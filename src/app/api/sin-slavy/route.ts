export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active');

    const db = getDb();
    let rows = [...db.hall_of_fame];

    if (activeOnly === 'true') {
      rows = rows.filter(r => Boolean(r.active) === true);
    }
    
    rows.sort((a, b) => b.dateJoined - a.dateJoined);

    const data = rows.map((r: any) => ({
      ...r,
      active: Boolean(r.active),
    }));

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = crypto.randomUUID();

    const db = getDb();
    db.hall_of_fame.push({
      id,
      name: body.name, // this is "Jak se zde chcete zapsat"
      fullName: body.fullName || '', // Skutečné jméno
      tier: body.tier,
      message: body.message || '',
      dateJoined: body.dateJoined?.seconds ? body.dateJoined.seconds * 1000 : Date.now(),
      avatarId: body.avatarId || 1,
      active: body.active !== undefined ? (body.active ? 1 : 0) : 0 // Výchozí: neschváleno
    });
    saveDb();

    return NextResponse.json({ id, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, active, name, fullName } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const db = getDb();
    const index = db.hall_of_fame.findIndex(h => h.id === id);
    if (index !== -1) {
      // If admin is just approving/toggling active status:
      if (active !== undefined) {
        db.hall_of_fame[index].active = active ? 1 : 0;
      } 
      // If user is updating their own entry:
      if (name !== undefined) {
        db.hall_of_fame[index].name = name;
        if (fullName !== undefined) {
          db.hall_of_fame[index].fullName = fullName;
        }
        db.hall_of_fame[index].active = 0; // Requires re-approval
      }
      saveDb();
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const db = getDb();
    db.hall_of_fame = db.hall_of_fame.filter(h => h.id !== id);
    saveDb();
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
