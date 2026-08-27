import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { actionType, metadata, durationSec, points } = body;

    if (!actionType) {
      return NextResponse.json({ error: 'Missing actionType' }, { status: 400 });
    }

    // 1. Create the activity log
    await prisma.userActivityLog.create({
      data: {
        userId,
        actionType,
        metadata: metadata || {},
        durationSec: durationSec || 0,
        points: points || 0,
      }
    });

    // 2. Update user stats
    const stats = await prisma.userStats.upsert({
      where: { userId },
      update: {
        totalTimeSec: { increment: durationSec || 0 },
        totalPoints: { increment: points || 0 },
        pointsThisWeek: { increment: points || 0 },
        pointsThisMonth: { increment: points || 0 },
        pointsThisYear: { increment: points || 0 },
      },
      create: {
        userId,
        totalTimeSec: durationSec || 0,
        totalPoints: points || 0,
        pointsThisWeek: points || 0,
        pointsThisMonth: points || 0,
        pointsThisYear: points || 0,
      }
    });

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
