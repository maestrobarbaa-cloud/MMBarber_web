import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { phase, answers, contact } = await req.json();

    if (!contact?.email) {
      return NextResponse.json({ error: 'Email je povinný' }, { status: 400 });
    }

    let application = await prisma.recruitmentApplication.findFirst({
      where: { email: contact.email },
      orderBy: { createdAt: 'desc' }
    });

    if (!application) {
      application = await prisma.recruitmentApplication.create({
        data: {
          name: contact.name || 'Neznámý',
          email: contact.email,
          phone: contact.phone || null,
        }
      });
    }

    if (phase === 1) {
      await prisma.recruitmentApplication.update({
        where: { id: application.id },
        data: {
          phase1Answers: JSON.stringify(answers),
          phase1Status: 'PASSED', // Zjednodušeno pro ruční hodnocení
          status: 'IN_PROGRESS'
        }
      });
      return NextResponse.json({ status: 'PASSED', summary: 'Fáze 1 uložena.' });
    }

    if (phase === 3) {
      await prisma.recruitmentApplication.update({
        where: { id: application.id },
        data: {
          phase3Answers: JSON.stringify(answers),
          phase3Status: 'PENDING_REVIEW', // Čeká na hodnocení majitelem
          status: 'COMPLETED'
        }
      });
      return NextResponse.json({ status: 'PASSED', summary: 'Fáze 3 odeslána k hodnocení.' });
    }
    
    return NextResponse.json({ error: 'Neznámá fáze' }, { status: 400 });

  } catch (error) {
    console.error("Recruitment Submit Error:", error);
    return NextResponse.json({ error: 'Interní chyba serveru' }, { status: 500 });
  }
}
