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

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: eventId } = await params;
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

    // Zkontrolujeme, zda akce existuje
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: 'Událost nenalezena' }, { status: 404 });
    }

    // Vytvoříme (nebo najdeme existující a aktualizujeme)
    const attendee = await prisma.eventAttendee.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId: user.id
        }
      },
      update: {
        status: 'GOING'
      },
      create: {
        eventId,
        userId: user.id,
        status: 'GOING'
      }
    });

    return NextResponse.json({ success: true, attendee });
  } catch (error) {
    console.error("Chyba při přihlašování na akci:", error);
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: eventId } = await params;
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

    await prisma.eventAttendee.delete({
      where: {
        eventId_userId: {
          eventId,
          userId: user.id
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chyba při odhlašování z akce:", error);
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}
