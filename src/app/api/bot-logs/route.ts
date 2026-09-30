import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function getUserIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

export async function GET(request: Request) {
  try {
    const db = getDb();
    const logs = db.bot_logs || [];
    // Vrátíme logy od nejnovějších
    return NextResponse.json({ logs: logs.sort((a, b) => b.timestamp - a.timestamp) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userMessage, botReply, fullName } = body;
    const ip = getUserIp(request);
    
    const db = getDb();
    if (!db.bot_logs) db.bot_logs = [];
    
    const newLog = {
      id: crypto.randomUUID(),
      ip,
      fullName: fullName || 'Neznámý',
      userMessage,
      botReply,
      timestamp: Date.now()
    };
    
    db.bot_logs.push(newLog);
    
    // Udržujeme jen posledních 500 logů, ať JSON nebobtná
    if (db.bot_logs.length > 500) {
      db.bot_logs = db.bot_logs.slice(db.bot_logs.length - 500);
    }
    
    saveDb();
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
