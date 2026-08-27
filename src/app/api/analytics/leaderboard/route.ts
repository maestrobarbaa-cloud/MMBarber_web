import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all'; // week, month, year, all

    let orderBy: any = { totalPoints: 'desc' };
    
    if (filter === 'week') orderBy = { pointsThisWeek: 'desc' };
    else if (filter === 'month') orderBy = { pointsThisMonth: 'desc' };
    else if (filter === 'year') orderBy = { pointsThisYear: 'desc' };

    const topUsers = await prisma.userStats.findMany({
      take: 50,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json(topUsers);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
