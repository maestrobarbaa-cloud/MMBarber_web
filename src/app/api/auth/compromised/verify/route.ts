import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token je povinný' }, { status: 400 });
    }

    // Find the report
    const report = await prisma.compromisedAccountReport.findUnique({
      where: { verificationToken: token },
    });

    if (!report) {
      return NextResponse.json({ error: 'Neplatný nebo vypršelý token' }, { status: 400 });
    }

    if (report.status !== 'PENDING') {
      return NextResponse.json({ error: 'Tento požadavek již byl zpracován' }, { status: 400 });
    }

    // Find the user to delete
    const user = await prisma.user.findUnique({
      where: { email: report.email },
    });

    if (user) {
      // Delete the user
      // Note: Because of onDelete: Cascade in schema, related records (Profile, Messages, etc.) should be deleted automatically
      await prisma.user.delete({
        where: { id: user.id }
      });
    }

    // Update the report status
    await prisma.compromisedAccountReport.update({
      where: { id: report.id },
      data: {
        status: 'VERIFIED',
        resolvedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, message: 'Účet byl úspěšně smazán z důvodu narušení bezpečnosti.' });

  } catch (error) {
    console.error('Chyba při ověřování smazání účtu:', error);
    return NextResponse.json({ error: 'Interní chyba serveru' }, { status: 500 });
  }
}
