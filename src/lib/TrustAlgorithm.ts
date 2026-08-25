import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Limit na počet hodnocení za měsíc
const MAX_RATINGS_PER_MONTH = 3;

/**
 * Zhodnotí, jestli uživatel může hodnotit a s jakou váhou.
 * Vrací objekt s boolean 'allowed' a číslem 'weight'.
 */
export async function calculateRatingWeight(raterId: string, targetId: string): Promise<{ allowed: boolean; weight: number; reason?: string }> {
  // 1. Ochrana proti spamování (Rate Limiting)
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recentRatingsCount = await prisma.profileRating.count({
    where: {
      raterId,
      createdAt: { gte: oneMonthAgo },
    }
  });

  if (recentRatingsCount >= MAX_RATINGS_PER_MONTH) {
    return { allowed: false, weight: 0, reason: "Byl překročen měsíční limit pro hodnocení uživatelů." };
  }

  // 2. Analýza uživatele, který hodnotí
  const rater = await prisma.user.findUnique({
    where: { id: raterId },
    include: { profile: true }
  });

  if (!rater || !rater.profile) {
    return { allowed: false, weight: 0, reason: "Uživatel neexistuje nebo nemá profil." };
  }

  // 3. Výpočet základní váhy podle vlastního skóre (trustScore)
  let weight = 1.0;
  const raterTrust = rater.profile.trustScore;

  if (raterTrust < 50) {
    weight = 0.2; // Špatná pověst = hlas málo znamená
  } else if (raterTrust > 120) {
    weight = 1.2; // Vynikající pověst = hlas má větší sílu
  }

  // 4. Detekce "Trolla" nebo "Vote Boostera" z minulé historie
  const pastRatings = await prisma.profileRating.findMany({
    where: { raterId }
  });

  if (pastRatings.length >= 3) {
    const criticalCount = pastRatings.filter(r => r.isCritical || r.rating <= 2).length;
    const maxPositiveCount = pastRatings.filter(r => r.rating === 5).length;
    
    // Pokud je více než 80 % hodnocení negativních/kritických -> troll -> snížíme váhu na 0
    if (criticalCount / pastRatings.length > 0.8) {
      weight = 0.0; // Necháme ho odeslat, ať si myslí, že se pomstil, ale neudělá to nic (shadowban princip)
    }
    // Pokud je více než 80 % hodnocení pětihvězdičkových -> vote booster -> snížíme váhu
    else if (maxPositiveCount / pastRatings.length > 0.8) {
      weight = 0.3; // Váha se výrazně sníží
    }
  }

  // 5. Zhodnocení interakce (volitelné pro budoucnost, momentálně necháváme volné podle domluvy)
  // Např. await prisma.match.findFirst({ where: { user1Id: raterId, user2Id: targetId } })

  return { allowed: true, weight };
}

/**
 * Přepočítá cílovému uživateli jeho finální skóre důvěry
 * na základě všech obdržených hodnocení a jejich vah.
 */
export async function recalculateTrustScore(targetId: string) {
  const allRatings = await prisma.profileRating.findMany({
    where: { targetId }
  });

  let totalWeight = 0;
  let weightedScoreSum = 0;
  let criticalWarningsCount = 0;

  for (const rating of allRatings) {
    totalWeight += rating.weight;
    // Mapujeme rating (1-5) na skóre:
    // 3 hvězdy = neutrální (nemění)
    // 5 hvězd = +bod
    // 1 hvězda = -body
    const scoreDiff = (rating.rating - 3) * 5; // např. 5 hvězd = +10, 1 hvězda = -10
    weightedScoreSum += (scoreDiff * rating.weight);

    if (rating.isCritical && rating.weight > 0.5) {
      criticalWarningsCount += 1;
    }
  }

  // Aplikujeme na uživatele
  const targetUser = await prisma.user.findUnique({ where: { id: targetId }, include: { profile: true }});
  if (targetUser && targetUser.profile) {
    // Základní skóre začíná na 100
    let newScore = Math.round(100 + weightedScoreSum);
    
    // Za každé závažné varování od důvěryhodného uživatele odečteme dalších 20 bodů
    newScore -= (criticalWarningsCount * 20);

    // Omezení od 0 do 200
    newScore = Math.max(0, Math.min(200, newScore));

    await prisma.profile.update({
      where: { userId: targetId },
      data: { trustScore: newScore }
    });
  }
}
