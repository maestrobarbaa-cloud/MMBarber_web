export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const db = getDb();
    
    if (!key) {
      return NextResponse.json({ values: db.settings });
    }

    return NextResponse.json({ value: db.settings[key] !== undefined ? db.settings[key] : null });
  } catch (error) {
    console.error('Error fetching setting:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value, updates } = body;

    const db = getDb();
    
    if (updates && typeof updates === 'object') {
      Object.entries(updates).forEach(([k, v]) => {
        db.settings[k] = String(v);
      });
    } else if (key && value !== undefined) {
      db.settings[key] = String(value);
    } else {
      return NextResponse.json({ error: 'Missing key/value or updates object' }, { status: 400 });
    }

    saveDb();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving setting:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
