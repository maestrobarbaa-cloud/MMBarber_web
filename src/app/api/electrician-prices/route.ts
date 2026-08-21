import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({ prices: db.electrician_prices || {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password, prices } = body;

    // Simple password check
    if (password !== 'roman123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prices || typeof prices !== 'object') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const db = getDb();
    
    // Ensure electrician_prices object exists
    if (!db.electrician_prices) {
      db.electrician_prices = {};
    }

    // Update prices
    Object.assign(db.electrician_prices, prices);
    
    saveDb();

    return NextResponse.json({ success: true, prices: db.electrician_prices }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update prices' }, { status: 500 });
  }
}
