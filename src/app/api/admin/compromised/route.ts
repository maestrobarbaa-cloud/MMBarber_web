import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reports = await prisma.compromisedAccountReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Chybí ID' }, { status: 400 });

    await prisma.compromisedAccountReport.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, action } = await request.json();

    if (!id) return NextResponse.json({ error: 'Chybí ID' }, { status: 400 });

    if (action === 'delete_user') {
      const report = await prisma.compromisedAccountReport.findUnique({ where: { id } });
      if (!report) return NextResponse.json({ error: 'Nenalezeno' }, { status: 404 });

      // Smazat uživatele ručně adminem
      const user = await prisma.user.findUnique({ where: { email: report.email } });
      if (user) {
        await prisma.user.delete({ where: { id: user.id } });
      }

      await prisma.compromisedAccountReport.update({
        where: { id },
        data: { status: 'RESOLVED_BY_ADMIN', resolvedAt: new Date() }
      });

      return NextResponse.json({ success: true, message: 'Uživatel smazán a report vyřešen.' });
    }

    return NextResponse.json({ error: 'Neznámá akce' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}
