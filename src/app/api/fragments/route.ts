import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ensureHiddenFragment, awardFragments, FRAGMENTS_PER_COIN } from '@/lib/fragmentEngine';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        mmcoinFragments: true,
        mmcoins: true,
        lastDailyLogin: true,
        hasClaimedProfileFragments: true
      }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Check if daily login is available
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const canClaimDaily = !user.lastDailyLogin || user.lastDailyLogin < today;

    // Ensure they have a hidden fragment
    const activeSpawn = await ensureHiddenFragment(session.user.id);

    return NextResponse.json({
      fragments: user.mmcoinFragments,
      coins: user.mmcoins,
      canClaimDaily,
      hasClaimedProfile: user.hasClaimedProfileFragments,
      fragmentsPerCoin: FRAGMENTS_PER_COIN,
      activeSpawn: activeSpawn ? {
        id: activeSpawn.id,
        location: activeSpawn.location,
        expiresAt: activeSpawn.expiresAt
      } : null
    });
  } catch (error: any) {
    console.error('Error fetching fragments state:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { action, spawnId } = body;

    const user = await prisma.user.findUnique({ where: { id: session.user.id }});
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (action === 'DAILY_LOGIN') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (user.lastDailyLogin && user.lastDailyLogin >= today) {
        return NextResponse.json({ error: 'Already claimed today' }, { status: 400 });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { lastDailyLogin: new Date() }
      });

      const result = await awardFragments(user.id, 1);
      return NextResponse.json({ success: true, ...result, message: 'DAILY_LOGIN' });
    }

    if (action === 'PROFILE_COMPLETION') {
      if (user.hasClaimedProfileFragments) {
        return NextResponse.json({ error: 'Already claimed profile reward' }, { status: 400 });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { hasClaimedProfileFragments: true }
      });

      const result = await awardFragments(user.id, 3);
      return NextResponse.json({ success: true, ...result, message: 'PROFILE_COMPLETION' });
    }

    if (action === 'COLLECT_HIDDEN') {
      if (!spawnId) return NextResponse.json({ error: 'Missing spawnId' }, { status: 400 });

      const spawn = await prisma.fragmentSpawn.findUnique({ where: { id: spawnId } });
      if (!spawn || spawn.userId !== user.id || spawn.isCollected) {
        return NextResponse.json({ error: 'Invalid or already collected spawn' }, { status: 400 });
      }
      if (spawn.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Spawn expired' }, { status: 400 });
      }

      await prisma.fragmentSpawn.update({
        where: { id: spawn.id },
        data: { isCollected: true }
      });

      const result = await awardFragments(user.id, 1);
      
      // Spawn a new one immediately for future? Or let the next GET request do it.
      // We will let the next GET request do it, it will create one if there are none.
      
      return NextResponse.json({ success: true, ...result, message: 'COLLECT_HIDDEN' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in fragments POST:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
