import { prisma } from './prisma';

// A constant to dictate how many fragments make a full MMCoin
export const FRAGMENTS_PER_COIN = 10;
export const VALID_LOCATIONS = ['POND', 'ADMIRERS', 'PROFILE', 'MATCHES', 'SETTINGS'];

/**
 * Ensures the user has a valid fragment hidden somewhere.
 * If they don't have an active one, it spawns a new one randomly.
 */
export async function ensureHiddenFragment(userId: string) {
  // Check if they already have an active uncollected fragment
  const activeSpawn = await prisma.fragmentSpawn.findFirst({
    where: {
      userId,
      isCollected: false,
      expiresAt: { gt: new Date() } // Not expired
    }
  });

  if (activeSpawn) return activeSpawn;

  // Zkontrolujeme, kdy byl vytvořen poslední spawn (abychom zabránili neustálému spawnování)
  const lastSpawn = await prisma.fragmentSpawn.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  if (lastSpawn) {
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    if (lastSpawn.createdAt > oneDayAgo) {
      // Příliš brzy na další fragment (max 1 denně)
      return null;
    }
  }

  // Pick a random location
  const randomLoc = VALID_LOCATIONS[Math.floor(Math.random() * VALID_LOCATIONS.length)];
  
  // Expiry is +48 hours
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  const newSpawn = await prisma.fragmentSpawn.create({
    data: {
      userId,
      location: randomLoc,
      expiresAt
    }
  });

  return newSpawn;
}

/**
 * Processes adding fragments to a user, and converting them to MMCoins if they reach the threshold.
 */
export async function awardFragments(userId: string, amount: number) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { mmcoinFragments: true, mmcoins: true }});
  if (!user) return { fragments: 0, coins: 0, coinsAdded: 0 };

  let newFragments = user.mmcoinFragments + amount;
  let newCoins = user.mmcoins;
  let coinsAdded = 0;

  while (newFragments >= FRAGMENTS_PER_COIN) {
    newFragments -= FRAGMENTS_PER_COIN;
    newCoins += 1;
    coinsAdded += 1;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      mmcoinFragments: newFragments,
      mmcoins: newCoins
    }
  });

  return { fragments: newFragments, coins: newCoins, coinsAdded };
}
