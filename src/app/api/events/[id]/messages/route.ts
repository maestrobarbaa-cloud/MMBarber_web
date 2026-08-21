import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getSession() {
  try {
    return await getServerSession(authOptions);
  } catch (e) {
    return null;
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: eventId } = await params;
    const messages = await prisma.eventMessage.findMany({
      where: { eventId },
      include: {
        user: { select: { name: true, image: true, email: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    
    if (!session?.user?.email) {
       return NextResponse.json({ error: 'Nejste přihlášeni' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Uživatel nenalezen' }, { status: 404 });
    }

    const { id: eventId } = await params;
    const { text } = await request.json();

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Prázdná zpráva' }, { status: 400 });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return NextResponse.json({ error: 'Akce neexistuje' }, { status: 404 });

    const message = await prisma.eventMessage.create({
      data: {
        eventId,
        userId: user.id,
        text
      },
      include: {
        user: { select: { name: true, image: true, email: true } }
      }
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Chyba při odesílání zprávy:", error);
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}
