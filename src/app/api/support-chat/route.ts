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
    const { searchParams } = new URL(request.url);
    const adminMode = searchParams.get('admin') === 'true';
    const db = getDb();
    
    // Zjistíme, jestli byl admin aktivní v posledních 5 minutách (pro online indikátor)
    const adminSettings = db.settings['admin_last_seen'];
    const adminLastSeen = adminSettings ? parseInt(adminSettings) : 0;
    const isAdminOnline = Date.now() - adminLastSeen < 5 * 60 * 1000;

    if (adminMode) {
      // Admin vidí všechny sessions a zprávy
      const sessions = db.support_sessions || [];
      const messages = db.support_messages || [];
      
      // Update admin last seen
      db.settings['admin_last_seen'] = Date.now().toString();
      saveDb();
      
      return NextResponse.json({ sessions, messages });
    } else {
      // Uživatel vidí jen svou session a zprávy
      const ip = getUserIp(request);
      const session = (db.support_sessions || []).find(s => s.ip === ip);
      
      if (!session) {
        return NextResponse.json({ session: null, messages: [], isAdminOnline });
      }
      
      if (session.status === 'BANNED') {
        return NextResponse.json({ error: 'BANNED' }, { status: 403 });
      }
      
      const messages = (db.support_messages || []).filter(m => m.sessionId === session.id);
      
      // Update session last activity
      session.lastActivity = Date.now();
      saveDb();
      
      return NextResponse.json({ session, messages, isAdminOnline });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, fullName, sender, sessionId, attachmentUrl, attachmentType } = body; // sender: 'USER' | 'ADMIN'
    const ip = getUserIp(request);
    
    const db = getDb();
    if (!db.support_sessions) db.support_sessions = [];
    if (!db.support_messages) db.support_messages = [];
    
    let currentSessionId = sessionId;
    let session = null;

    if (sender === 'USER') {
      // Check if session exists for this IP
      session = db.support_sessions.find(s => s.ip === ip);
      
      if (session && session.status === 'BANNED') {
        return NextResponse.json({ error: 'BANNED' }, { status: 403 });
      }
      
      if (!session) {
        // Založit novou session
        session = {
          id: crypto.randomUUID(),
          ip,
          userFullName: fullName || 'Neznámý uživatel',
          startedAt: Date.now(),
          lastActivity: Date.now(),
          status: 'OPEN'
        };
        db.support_sessions.push(session);
      } else {
        // Aktualizovat jméno a aktivitu
        if (fullName) session.userFullName = fullName;
        session.lastActivity = Date.now();
      }
      currentSessionId = session.id;
    } else if (sender === 'ADMIN') {
      // Admin update last seen
      db.settings['admin_last_seen'] = Date.now().toString();
      session = db.support_sessions.find(s => s.id === currentSessionId);
      if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    // Přidat zprávu
    const newMessage = {
      id: crypto.randomUUID(),
      sessionId: currentSessionId,
      sender,
      text,
      timestamp: Date.now(),
      read: false,
      attachmentUrl,
      attachmentType
    };
    
    db.support_messages.push(newMessage);
    saveDb();
    
    return NextResponse.json({ success: true, message: newMessage, session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, sessionId, messageIds } = body;
    
    const db = getDb();
    if (!db.support_sessions) db.support_sessions = [];
    if (!db.support_messages) db.support_messages = [];
    
    if (action === 'MARK_READ') {
      if (messageIds && Array.isArray(messageIds)) {
        messageIds.forEach(id => {
          const msg = db.support_messages.find(m => m.id === id);
          if (msg) msg.read = true;
        });
      }
      saveDb();
      return NextResponse.json({ success: true });
    }
    
    if (action === 'CLOSE') {
      // Smazat historii
      db.support_messages = db.support_messages.filter(m => m.sessionId !== sessionId);
      db.support_sessions = db.support_sessions.filter(s => s.id !== sessionId);
      saveDb();
      return NextResponse.json({ success: true });
    }
    
    if (action === 'BAN') {
      const session = db.support_sessions.find(s => s.id === sessionId);
      if (session) {
        session.status = 'BANNED';
        saveDb();
      }
      return NextResponse.json({ success: true });
    }
    
    if (action === 'UNBAN') {
      const session = db.support_sessions.find(s => s.id === sessionId);
      if (session) {
        session.status = 'OPEN';
        saveDb();
      }
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
