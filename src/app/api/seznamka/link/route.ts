import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// GET: Získá seznam propojených účtů a čekajících žádostí
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    });

    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Získání propojených účtů (uživatel může být user1 nebo user2)
    const linkedAccounts1 = await prisma.linkedAccount.findMany({
      where: { userId1: currentUser.id },
      include: { user2: { include: { profile: true } } }
    });
    const linkedAccounts2 = await prisma.linkedAccount.findMany({
      where: { userId2: currentUser.id },
      include: { user1: { include: { profile: true } } }
    });

    // Získání žádostí (příchozí a odchozí)
    const receivedRequests = await prisma.linkRequest.findMany({
      where: { receiverId: currentUser.id },
      include: { sender: { include: { profile: true } } }
    });
    const sentRequests = await prisma.linkRequest.findMany({
      where: { senderId: currentUser.id },
      include: { receiver: { include: { profile: true } } }
    });

    // Formátování pro frontend
    const linked = [
      ...linkedAccounts1.map(link => ({
        id: link.id,
        linkedUserId: link.user2.id,
        type: link.type,
        createdAt: link.createdAt,
        profile: link.user2.profile
      })),
      ...linkedAccounts2.map(link => ({
        id: link.id,
        linkedUserId: link.user1.id,
        type: link.type,
        createdAt: link.createdAt,
        profile: link.user1.profile
      }))
    ];

    return NextResponse.json({
      linked,
      receivedRequests,
      sentRequests
    });
  } catch (error) {
    console.error('API Error (GET link):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Vytvoří žádost o propojení podle emailu
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const data = await request.json();
    const { targetEmail, type } = data; // type: 'couple', 'family', 'friend'

    if (!targetEmail || !type) {
      return NextResponse.json({ error: 'Missing targetEmail or type' }, { status: 400 });
    }

    if (!currentUser.email || targetEmail.toLowerCase() === currentUser.email.toLowerCase()) {
      return NextResponse.json({ error: 'Cannot link to yourself' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { email: targetEmail } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User with this email not found' }, { status: 404 });
    }

    // Zkontroluj, jestli už nejsou propojeni
    const existingLink = await prisma.linkedAccount.findFirst({
      where: {
        OR: [
          { userId1: currentUser.id, userId2: targetUser.id },
          { userId1: targetUser.id, userId2: currentUser.id }
        ]
      }
    });

    if (existingLink) {
      return NextResponse.json({ error: 'Already linked with this user' }, { status: 400 });
    }

    // Zkontroluj existující žádosti
    const existingRequest = await prisma.linkRequest.findFirst({
      where: {
        OR: [
          { senderId: currentUser.id, receiverId: targetUser.id },
          { senderId: targetUser.id, receiverId: currentUser.id }
        ]
      }
    });

    if (existingRequest) {
      return NextResponse.json({ error: 'A request already exists between these users' }, { status: 400 });
    }

    const requestObj = await prisma.linkRequest.create({
      data: {
        senderId: currentUser.id,
        receiverId: targetUser.id,
        type
      }
    });

    return NextResponse.json({ success: true, request: requestObj });
  } catch (error) {
    console.error('API Error (POST link):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Přijme žádost o propojení
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const data = await request.json();
    const { requestId } = data;

    if (!requestId) return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });

    const linkRequest = await prisma.linkRequest.findUnique({ where: { id: requestId } });
    if (!linkRequest) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

    if (linkRequest.receiverId !== currentUser.id) {
      return NextResponse.json({ error: 'Unauthorized to accept this request' }, { status: 403 });
    }

    // Vytvoř propojení
    const newLink = await prisma.linkedAccount.create({
      data: {
        userId1: linkRequest.senderId,
        userId2: linkRequest.receiverId,
        type: linkRequest.type
      }
    });

    // Smaž žádost
    await prisma.linkRequest.delete({ where: { id: requestId } });

    return NextResponse.json({ success: true, link: newLink });
  } catch (error) {
    console.error('API Error (PUT link):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Zruší žádost nebo zruší existující propojení
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');
    const linkId = searchParams.get('linkId');

    if (requestId) {
      const linkReq = await prisma.linkRequest.findUnique({ where: { id: requestId } });
      if (linkReq && (linkReq.senderId === currentUser.id || linkReq.receiverId === currentUser.id)) {
        await prisma.linkRequest.delete({ where: { id: requestId } });
        return NextResponse.json({ success: true, message: 'Request deleted' });
      }
      return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 403 });
    }

    if (linkId) {
      const linkAcc = await prisma.linkedAccount.findUnique({ where: { id: linkId } });
      if (linkAcc && (linkAcc.userId1 === currentUser.id || linkAcc.userId2 === currentUser.id)) {
        await prisma.linkedAccount.delete({ where: { id: linkId } });
        return NextResponse.json({ success: true, message: 'Link removed' });
      }
      return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Missing requestId or linkId' }, { status: 400 });
  } catch (error) {
    console.error('API Error (DELETE link):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
