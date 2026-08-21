import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';
import crypto from 'crypto';

// Pomocná funkce pro hashování hesla
function hashPassword(password: string): { salt: string, hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

// Pomocná funkce pro ověření hesla
function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === checkHash;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, nickname, password, consent } = body;
    const db = getDb();

    if (!action || !nickname || !password) {
      return NextResponse.json({ error: 'Chybí povinné údaje.' }, { status: 400 });
    }

    const cleanNickname = nickname.trim();

    if (action === 'register') {
      if (!consent) {
        return NextResponse.json({ error: 'Musíte souhlasit s podmínkami.' }, { status: 400 });
      }

      // Kontrola, zda uživatel už existuje
      const exists = db.dating_users.find(u => u.nickname.toLowerCase() === cleanNickname.toLowerCase());
      if (exists) {
        return NextResponse.json({ error: 'Tato přezdívka je již zabraná.' }, { status: 400 });
      }

      const { salt, hash } = hashPassword(password);
      
      const newUser = {
        id: crypto.randomUUID(),
        nickname: cleanNickname,
        passwordHash: hash,
        passwordSalt: salt,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      db.dating_users.push(newUser);
      saveDb();

      // Vygenerujeme jednoduchý token pro session (v reálu by to byl JWT)
      const token = crypto.randomUUID();

      return NextResponse.json({ 
        message: 'Registrace úspěšná',
        user: { id: newUser.id, nickname: newUser.nickname, role: newUser.role },
        token
      });

    } else if (action === 'login') {
      const user = db.dating_users.find(u => u.nickname.toLowerCase() === cleanNickname.toLowerCase());
      if (!user) {
        return NextResponse.json({ error: 'Neplatné přihlašovací údaje.' }, { status: 401 });
      }

      const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
      if (!isValid) {
        return NextResponse.json({ error: 'Neplatné přihlašovací údaje.' }, { status: 401 });
      }

      const token = crypto.randomUUID();

      return NextResponse.json({
        message: 'Přihlášení úspěšné',
        user: { id: user.id, nickname: user.nickname, role: user.role },
        token
      });
    }

    return NextResponse.json({ error: 'Neznámá akce.' }, { status: 400 });

  } catch (error) {
    console.error('Seznamka Auth Error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}
