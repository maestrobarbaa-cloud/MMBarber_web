import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const barberId = searchParams.get('barberId');
    const dateStr = searchParams.get('date');

    const db = getDb();
    let appointments = db.appointments || [];

    if (barberId) {
      appointments = appointments.filter((a: any) => a.barberId === barberId);
    }
    if (dateStr) {
      appointments = appointments.filter((a: any) => a.date === dateStr);
    }

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { barberId, serviceName, durationMin, price, date, time, customerName, customerEmail, customerPhone, reminders } = body;
    
    if (!barberId || !date || !time || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();
    
    // Zde bychom měli provést kontrolu obsazenosti (rate limiting a kolize slotů)
    // Pro zjednodušení teď jen uložíme

    const appointmentId = crypto.randomUUID();
    const newAppointment = {
      id: appointmentId,
      barberId,
      serviceName: serviceName || 'Služba',
      durationMin: durationMin || 30,
      price: price || 0,
      date,
      time,
      customerName,
      customerEmail,
      customerPhone,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    db.appointments.push(newAppointment);

    // Přidání upozornění
    if (reminders && Array.isArray(reminders)) {
      for (const r of reminders) {
        db.reminders.push({
          id: crypto.randomUUID(),
          appointmentId,
          type: r.type, // 'EMAIL' nebo 'SMS'
          hoursBefore: r.hoursBefore,
          sent: false
        });
      }
    }

    saveDb();

    return NextResponse.json({ success: true, appointmentId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const db = getDb();
    db.appointments = db.appointments.filter((a: any) => a.id !== id);
    db.reminders = db.reminders.filter((r: any) => r.appointmentId !== id);
    saveDb();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
