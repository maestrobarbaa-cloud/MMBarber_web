import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { title, description, url, userAgent, screenSize } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Titulek a popis jsou povinné.' }, { status: 400 });
    }

    const bugReport = await prisma.bugReport.create({
      data: {
        title,
        description,
        url: url || null,
        userAgent: userAgent || null,
        screenSize: screenSize || null,
        userId: session?.user?.id || null,
      },
    });

    return NextResponse.json({ success: true, bugReport }, { status: 201 });
  } catch (error) {
    console.error('Failed to create bug report:', error);
    return NextResponse.json({ error: 'Došlo k chybě při ukládání hlášení.' }, { status: 500 });
  }
}
