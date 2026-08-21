import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'E-mail je povinný' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success anyway to prevent email enumeration
      return NextResponse.json({ success: true, message: 'Pokud účet existuje, odeslali jsme e-mail.' });
    }

    // Check if there is already a pending report for this email recently
    const existingReport = await prisma.compromisedAccountReport.findFirst({
      where: { 
        email, 
        status: 'PENDING',
        createdAt: {
          gte: new Date(Date.now() - 1000 * 60 * 60) // 1 hour
        }
      },
    });

    if (existingReport) {
       return NextResponse.json({ success: true, message: 'Pokud účet existuje, odeslali jsme e-mail.' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';

    await prisma.compromisedAccountReport.create({
      data: {
        email,
        ipAddress,
        verificationToken,
      }
    });

    // In a real app, send an email here using your email provider (e.g. Resend, SendGrid)
    // Example:
    // await sendEmail({
    //   to: email,
    //   subject: 'Požadavek na smazání zneužitého účtu',
    //   text: `Klikněte na tento odkaz pro smazání vašeho účtu: ${process.env.NEXT_PUBLIC_APP_URL}/auth/compromised?token=${verificationToken}`
    // })

    console.log(`[SIMULATED EMAIL TO ${email}] Klikněte na tento odkaz pro smazání vašeho účtu: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/compromised?token=${verificationToken}`);

    return NextResponse.json({ success: true, message: 'Pokud účet existuje, odeslali jsme e-mail s instrukcemi.' });

  } catch (error) {
    console.error('Chyba při nahlašování zneužitého účtu:', error);
    return NextResponse.json({ error: 'Interní chyba serveru' }, { status: 500 });
  }
}
