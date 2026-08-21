import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';
import crypto from 'crypto';

// Jednoduchý algoritmus pro výpočet kompatibility
function calculateMatchScore(userA: any, userB: any) {
  let score = 0;
  let maxScore = 0;

  // 1. Hodnoty (Values) - sdílené hodnoty zvyšují skóre nejvíc
  if (userA.values && userB.values) {
    const sharedValues = userA.values.filter((v: string) => userB.values.includes(v));
    score += sharedValues.length * 15;
    maxScore += Math.max(userA.values.length, userB.values.length) * 15;
  }

  // 2. Ambice (Ambitions) - podobné ambice přidávají body
  if (userA.ambitions && userB.ambitions) {
    if (userA.ambitions === userB.ambitions) {
      score += 20;
    }
    maxScore += 20;
  }

  // 3. Životní styl (Lifestyle)
  if (userA.lifestyle && userB.lifestyle) {
    const sharedLifestyle = userA.lifestyle.filter((l: string) => userB.lifestyle.includes(l));
    score += sharedLifestyle.length * 10;
    maxScore += Math.max(userA.lifestyle.length, userB.lifestyle.length) * 10;
  }

  // Zohlednění preference (shoda vs. protiklad)
  // Pokud uživatel hledá 'opposite', obrátíme skóre z vlastností (čím méně společného, tím lépe)
  // Ale u hodnot (Values) obvykle i protiklady hledají stejný základ. Zjednodušíme to:
  
  let percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 50;

  if (userA.matchPreference === 'opposite') {
    percentage = 100 - percentage;
    // Zabráníme tomu, aby to šlo pod 10%
    if (percentage < 10) percentage = 10;
  }

  return percentage;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const db = getDb();

  if (!userId) {
    return NextResponse.json({ error: 'Chybí userId' }, { status: 400 });
  }

  const myProfile = db.dating_profiles.find(p => p.userId === userId);
  
  if (!myProfile) {
    return NextResponse.json({ error: 'Uživatel nemá vytvořený profil.' }, { status: 404 });
  }

  // Najdeme všechny aktivní profily kromě mého
  const otherProfiles = db.dating_profiles.filter(p => p.status === 'active' && p.userId !== userId);

  // Vypočítáme match skóre pro všechny profily
  const scoredProfiles = otherProfiles.map(profile => {
    const score = calculateMatchScore(myProfile, profile);
    return {
      ...profile,
      matchScore: score
    };
  });

  // Seřadíme podle skóre sestupně (nejlepší match nahoře)
  scoredProfiles.sort((a, b) => b.matchScore - a.matchScore);

  return NextResponse.json(scoredProfiles);
}

export async function POST(req: Request) {
  // Zde by bylo odeslání "zájmu" (like) na jiný profil
  try {
    const body = await req.json();
    const { fromUserId, toUserId, action } = body; // action: 'like', 'pass'
    const db = getDb();

    if (!fromUserId || !toUserId || !action) {
      return NextResponse.json({ error: 'Chybí parametry' }, { status: 400 });
    }

    db.dating_matches.push({
      id: crypto.randomUUID(),
      fromUserId,
      toUserId,
      action,
      createdAt: new Date().toISOString()
    });

    saveDb();

    // TODO: Zkontrolovat, jestli nevznikl vzájemný match (oba dali 'like')
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Chyba' }, { status: 500 });
  }
}
