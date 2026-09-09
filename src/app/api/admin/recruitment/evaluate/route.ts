import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { id, aiPersonalityReport } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Chybí ID kandidáta' }, { status: 400 });
    }

    const application = await prisma.recruitmentApplication.update({
      where: { id },
      data: {
        aiPersonalityReport: JSON.stringify(aiPersonalityReport),
        phase3Status: 'PASSED' // Označeno jako manuálně zhodnocené
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Evaluation Error:", error);
    return NextResponse.json({ error: 'Interní chyba' }, { status: 500 });
  }
}
