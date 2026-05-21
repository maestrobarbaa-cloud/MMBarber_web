import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const barbers = db.prepare('SELECT * FROM barbers ORDER BY orderIndex ASC').all();
    const formatted = barbers.map((b: any) => ({
      ...b,
      specializations: JSON.parse(b.specializations),
      rank: b.rankLevel !== null ? {
        level: b.rankLevel,
        title: b.rankTitle,
        status: b.rankStatus,
        nextRankIn: b.rankNextIn
      } : undefined
    }));
    return NextResponse.json({ barbers: formatted }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch barbers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const specializations = body.specializations ? JSON.stringify(body.specializations) : '[]';
    
    // Find next orderIndex
    let nextOrder = 1;
    const maxOrder = db.prepare('SELECT MAX(orderIndex) as max FROM barbers').get() as { max: number };
    if (maxOrder && maxOrder.max !== null) {
      nextOrder = maxOrder.max + 1;
    }

    const stmt = db.prepare(`
      INSERT INTO barbers (id, name, role, image, desc, schedule, bookingLink, specializations, symbol, parentId, customChatText, orderIndex)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.name,
      body.role,
      body.image || '/obr/novy_barber.png',
      body.desc || '',
      body.schedule || 'Nenastaveno',
      body.bookingLink || '#',
      specializations,
      body.symbol || 'X',
      body.parentId || null,
      body.customChatText || null,
      nextOrder
    );

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create barber' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, role, image, desc, schedule, bookingLink, specializations, symbol, parentId, customChatText, orderIndex } = body;
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const specsStr = specializations ? JSON.stringify(specializations) : undefined;

    const current = db.prepare('SELECT * FROM barbers WHERE id = ?').get(id) as any;
    if (!current) return NextResponse.json({ error: 'Barber not found' }, { status: 404 });

    const stmt = db.prepare(`
      UPDATE barbers SET
        name = COALESCE(?, name),
        role = COALESCE(?, role),
        image = COALESCE(?, image),
        desc = COALESCE(?, desc),
        schedule = COALESCE(?, schedule),
        bookingLink = COALESCE(?, bookingLink),
        specializations = COALESCE(?, specializations),
        symbol = COALESCE(?, symbol),
        parentId = COALESCE(?, parentId),
        customChatText = COALESCE(?, customChatText),
        orderIndex = COALESCE(?, orderIndex)
      WHERE id = ?
    `);

    stmt.run(
      name ?? current.name,
      role ?? current.role,
      image ?? current.image,
      desc ?? current.desc,
      schedule ?? current.schedule,
      bookingLink ?? current.bookingLink,
      specsStr ?? current.specializations,
      symbol ?? current.symbol,
      parentId !== undefined ? parentId : current.parentId,
      customChatText !== undefined ? customChatText : current.customChatText,
      orderIndex ?? current.orderIndex,
      id
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update barber' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    db.prepare('DELETE FROM barbers WHERE id = ?').run(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete barber' }, { status: 500 });
  }
}
