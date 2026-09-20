import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma'; // Assuming this is where prisma client is

export async function GET() {
  try {
    const scores = await prisma.connectionGameScore.findMany({
      orderBy: { score: 'desc' },
      take: 10,
      include: {
        user: {
          select: { name: true, image: true, email: true },
        },
      },
    });

    return NextResponse.json(scores);
  } catch (error) {
    console.error('Failed to fetch connection game scores:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { score, maxLevel } = await req.json();

    if (!score || maxLevel === undefined) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const userId = session?.user?.id;

    // Optional: Only save score if user is logged in, or save with null userId
    const newScore = await prisma.connectionGameScore.create({
      data: {
        userId: userId || null,
        score,
        maxLevel,
      },
    });

    return NextResponse.json(newScore);
  } catch (error) {
    console.error('Failed to save connection game score:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
