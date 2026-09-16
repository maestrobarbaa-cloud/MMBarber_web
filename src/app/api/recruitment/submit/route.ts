import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function evaluateAnswers(answers: Record<string, any>): { score: number; maxScore: number; percentage: number; status: 'PASSED' | 'BORDERLINE' | 'FAILED' } {
  let totalScore = 0;
  let maxScore = 0;

  for (const key of Object.keys(answers)) {
    const answer = answers[key];
    if (typeof answer?.score === 'number') {
      totalScore += answer.score;
      maxScore += 2; // max score per question is 2
    } else if (typeof answer?.value === 'number' && typeof answer?.score === 'number') {
      totalScore += answer.score;
      maxScore += 2;
    }
  }

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const status = percentage >= 60 ? 'PASSED' : percentage >= 40 ? 'BORDERLINE' : 'FAILED';

  return { score: totalScore, maxScore, percentage, status };
}

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
      const evaluation = evaluateAnswers(answers);
      await prisma.recruitmentApplication.update({
        where: { id: application.id },
        data: {
          phase1Answers: JSON.stringify(answers),
          phase1Status: evaluation.status,
          status: 'IN_PROGRESS'
        }
      });
      return NextResponse.json({
        status: evaluation.status,
        score: evaluation.score,
        maxScore: evaluation.maxScore,
        percentage: evaluation.percentage,
        applicantId: application.applicantId,
        summary: `Fáze 1 vyhodnocena. Skóre: ${evaluation.score}/${evaluation.maxScore} (${evaluation.percentage}%)`
      });
    }

    if (phase === 3) {
      const evaluation = evaluateAnswers(answers);
      await prisma.recruitmentApplication.update({
        where: { id: application.id },
        data: {
          phase3Answers: JSON.stringify(answers),
          phase3Status: 'PENDING_REVIEW',
          status: 'COMPLETED'
        }
      });
      return NextResponse.json({
        status: 'PASSED',
        score: evaluation.score,
        maxScore: evaluation.maxScore,
        percentage: evaluation.percentage,
        applicantId: application.applicantId,
        summary: `Fáze 3 odeslána k hodnocení. Předběžné skóre: ${evaluation.score}/${evaluation.maxScore} (${evaluation.percentage}%)`
      });
    }
    
    return NextResponse.json({ error: 'Neznámá fáze' }, { status: 400 });

  } catch (error) {
    console.error("Recruitment Submit Error:", error);
    return NextResponse.json({ error: 'Interní chyba serveru' }, { status: 500 });
  }
}

