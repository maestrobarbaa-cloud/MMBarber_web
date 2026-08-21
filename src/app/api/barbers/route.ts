export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';

export async function GET() {
  try {
    const db = getDb();
    const barbers = [...db.barbers].sort((a, b) => a.orderIndex - b.orderIndex);
    
    const formattedBarbers = barbers.map(b => ({
      ...b,
      specializations: b.specializations ? JSON.parse(b.specializations) : [],
      requiresUnlock: Boolean(b.requiresUnlock),
      missionFailed: Boolean(b.missionFailed),
      rank: b.rankLevel !== null ? {
        level: b.rankLevel,
        title: b.rankTitle,
        status: b.rankStatus,
        nextRankIn: b.rankNextIn
      } : undefined,
      bookingSystemType: b.bookingSystemType || 'internal',
      structuredSchedule: b.structuredSchedule ? JSON.parse(b.structuredSchedule) : null
    }));
    
    return NextResponse.json({ barbers: formattedBarbers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch barbers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, image, desc, schedule, bookingLink, specializations, bookingSystemType, structuredSchedule } = body;
    
    if (!name || !role || !image || !desc || !schedule) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const db = getDb();
    
    if (db.barbers.find(b => b.id === id)) {
      return NextResponse.json({ error: 'Barber with this ID already exists' }, { status: 400 });
    }

    const nextOrder = db.barbers.length > 0 ? Math.max(...db.barbers.map(b => b.orderIndex || 0)) + 1 : 1;

    db.barbers.push({
      id,
      name,
      role,
      image,
      desc,
      schedule,
      bookingLink: bookingLink || '',
      specializations: JSON.stringify(specializations || []),
      symbol: body.symbol || 'X',
      parentId: body.parentId || null,
      customChatText: body.customChatText || null,
      orderIndex: nextOrder,
      requiresUnlock: body.requiresUnlock ? 1 : 0,
      unlockThreshold: body.unlockThreshold || 5,
      missionFailed: body.missionFailed ? 1 : 0,
      rankLevel: null,
      rankTitle: null,
      rankStatus: null,
      rankNextIn: null,
      bookingSystemType: bookingSystemType || 'external',
      structuredSchedule: structuredSchedule ? JSON.stringify(structuredSchedule) : null
    });
    saveDb();

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create barber' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, role, image, desc, schedule, bookingLink, specializations, symbol, parentId, customChatText, orderIndex, requiresUnlock, unlockThreshold, missionFailed, bookingSystemType, structuredSchedule } = body;
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const db = getDb();
    const index = db.barbers.findIndex(b => b.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
    }

    const current = db.barbers[index];
    db.barbers[index] = {
      ...current,
      name: name ?? current.name,
      role: role ?? current.role,
      image: image ?? current.image,
      desc: desc ?? current.desc,
      schedule: schedule ?? current.schedule,
      bookingLink: bookingLink !== undefined ? bookingLink : current.bookingLink,
      specializations: specializations ? JSON.stringify(specializations) : current.specializations,
      symbol: symbol ?? current.symbol,
      parentId: parentId !== undefined ? parentId : current.parentId,
      customChatText: customChatText !== undefined ? customChatText : current.customChatText,
      orderIndex: orderIndex ?? current.orderIndex,
      requiresUnlock: requiresUnlock !== undefined ? (requiresUnlock ? 1 : 0) : current.requiresUnlock,
      unlockThreshold: unlockThreshold ?? current.unlockThreshold,
      missionFailed: missionFailed !== undefined ? (missionFailed ? 1 : 0) : current.missionFailed,
      bookingSystemType: bookingSystemType !== undefined ? bookingSystemType : current.bookingSystemType,
      structuredSchedule: structuredSchedule ? JSON.stringify(structuredSchedule) : current.structuredSchedule
    };
    saveDb();

    return NextResponse.json({ success: true });
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

    const db = getDb();
    db.barbers = db.barbers.filter(b => b.id !== id);
    saveDb();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete barber' }, { status: 500 });
  }
}
