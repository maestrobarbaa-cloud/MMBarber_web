import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';
import crypto from 'crypto';

// POST: Odeslání žádosti o přátelství
export async function POST(req: Request) {
  try {
    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: 'Chybí ID odesílatele nebo příjemce.' }, { status: 400 });
    }

    const db = getDb();

    // Kontrola existující žádosti
    const existingReq = db.dating_friend_requests.find(
      (r: any) => (r.senderId === senderId && r.receiverId === receiverId) || 
                  (r.senderId === receiverId && r.receiverId === senderId)
    );

    if (existingReq) {
      return NextResponse.json({ error: 'Žádost již existuje.' }, { status: 400 });
    }

    // Kontrola existujícího přátelství
    const existingFriendship = db.dating_friendships.find(
      (f: any) => (f.user1Id === senderId && f.user2Id === receiverId) || 
                  (f.user1Id === receiverId && f.user2Id === senderId)
    );

    if (existingFriendship) {
      return NextResponse.json({ error: 'Již jste přátelé.' }, { status: 400 });
    }

    const newRequest = {
      id: crypto.randomUUID(),
      senderId,
      receiverId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    db.dating_friend_requests.push(newRequest);
    saveDb();

    return NextResponse.json({ message: 'Žádost odeslána.', request: newRequest });
  } catch (error) {
    return NextResponse.json({ error: 'Chyba serveru.' }, { status: 500 });
  }
}

// PUT: Přijetí / Odmítnutí žádosti
export async function PUT(req: Request) {
  try {
    const { requestId, action } = await req.json(); // action: 'accept' | 'reject'

    if (!requestId || !action) {
      return NextResponse.json({ error: 'Chybí parametry.' }, { status: 400 });
    }

    const db = getDb();
    const reqIndex = db.dating_friend_requests.findIndex((r: any) => r.id === requestId);

    if (reqIndex === -1) {
      return NextResponse.json({ error: 'Žádost nenalezena.' }, { status: 404 });
    }

    const friendRequest = db.dating_friend_requests[reqIndex];

    if (action === 'accept') {
      friendRequest.status = 'accepted';
      
      const newFriendship = {
        id: crypto.randomUUID(),
        user1Id: friendRequest.senderId,
        user2Id: friendRequest.receiverId,
        createdAt: new Date().toISOString()
      };
      
      db.dating_friendships.push(newFriendship);
    } else if (action === 'reject') {
      friendRequest.status = 'rejected';
      // Odstranění zamítnuté žádosti z db pro čistotu (nebo nechat jako rejected)
      db.dating_friend_requests.splice(reqIndex, 1);
    }

    saveDb();
    return NextResponse.json({ message: `Žádost ${action === 'accept' ? 'přijata' : 'odmítnuta'}.` });
  } catch (error) {
    return NextResponse.json({ error: 'Chyba serveru.' }, { status: 500 });
  }
}
