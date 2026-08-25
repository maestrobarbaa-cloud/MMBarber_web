import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculateRatingWeight, recalculateTrustScore } from '@/lib/TrustAlgorithm';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { raterId, targetId, rating, isCritical, traits } = body;

    if (!raterId || !targetId || !rating) {
      return NextResponse.json({ error: 'Chybí povinná data.' }, { status: 400 });
    }

    // 1. Zkontrolujeme přes algoritmus, jestli uživatel může hodnotit
    const { allowed, weight, reason } = await calculateRatingWeight(raterId, targetId);

    if (!allowed) {
      return NextResponse.json({ error: reason || 'Hodnocení nebylo povoleno.' }, { status: 403 });
    }

    // 2. Uložíme hodnocení do databáze (upsert = pokud už hodnotil, přepíšeme to)
    await prisma.profileRating.upsert({
      where: {
        raterId_targetId: {
          raterId,
          targetId
        }
      },
      update: {
        rating,
        isCritical,
        traits: JSON.stringify(traits || []),
        weight
      },
      create: {
        raterId,
        targetId,
        rating,
        isCritical,
        traits: JSON.stringify(traits || []),
        weight
      }
    });

    // 3. Spustíme asynchronně přepočet Trust Score cílového uživatele
    await recalculateTrustScore(targetId);

    return NextResponse.json({ success: true, message: 'Hodnocení bylo úspěšně uloženo.' });

  } catch (error: any) {
    console.error('Chyba při ukládání hodnocení:', error);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}
