import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Zkontrolujte cestu k vaší instanci prisma, obvykle bývá v lib/prisma.ts

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    let dateFilter = {};
    if (month && year) {
      // V JavaScriptu jsou měsíce indexovány od 0 (0 = Leden, 11 = Prosinec)
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      dateFilter = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        }
      };
    }
    
    let regionFilter = {};
    if (region && region !== 'all') {
      regionFilter = { region };
    }

    const donations = await prisma.donation.findMany({
      where: {
        ...dateFilter,
        ...regionFilter,
      },
      include: {
        user: {
          select: {
            image: true,
            name: true,
            profile: {
              select: {
                name: true,
                photos: true
              }
            }
          }
        }
      },
      orderBy: {
        amount: 'desc'
      }
    });

    return NextResponse.json(donations);
  } catch (error) {
    console.error('Donations API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}
