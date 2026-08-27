import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get('userId');

    if (!targetUserId) {
      return NextResponse.json({ error: 'Chybí ID uživatele' }, { status: 400 });
    }

    const reviews = await prisma.employerReview.findMany({
      where: {
        targetUserId: targetUserId
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            companyProfile: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching employer reviews:', error);
    return NextResponse.json({ error: 'Chyba při načítání referencí' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Uživatel nenalezen' }, { status: 404 });
    }

    // Prozatím omezíme pouze na firemní účty (nebo ty s rolí COMPANY / ADMIN)
    if (currentUser.role !== 'COMPANY' && currentUser.role !== 'ADMIN' && currentUser.role !== 'OWNER') {
      return NextResponse.json({ error: 'Pouze firmy mohou přidávat pracovní reference' }, { status: 403 });
    }

    const body = await req.json();
    const { targetUserId, workEthicRating, teamDynamics, drivePercentage, textReview } = body;

    if (!targetUserId || workEthicRating === undefined || !teamDynamics || drivePercentage === undefined) {
      return NextResponse.json({ error: 'Chybí povinná pole pro hodnocení' }, { status: 400 });
    }

    // Uložit novou referenci
    const review = await prisma.employerReview.create({
      data: {
        reviewerId: currentUser.id,
        targetUserId,
        workEthicRating: Number(workEthicRating),
        teamDynamics,
        drivePercentage: Number(drivePercentage),
        textReview: textReview || null
      }
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error('Error creating employer review:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Tohoto uživatele jste již hodnotili' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Chyba při ukládání reference' }, { status: 500 });
  }
}
