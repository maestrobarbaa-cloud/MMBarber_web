import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';
import crypto from 'crypto';

// GET: Získá profil uživatele (podle userId v headeru/query, nebo všechny aktivní profily pro rybník)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const type = searchParams.get('type');
  const db = getDb();

  if (type === 'all_active') {
    // Vracíme jen veřejné/aktivní profily pro matchmaking
    const publicProfiles = db.dating_profiles.filter(p => p.status === 'active');
    return NextResponse.json(publicProfiles);
  }

  if (!userId) {
    return NextResponse.json({ error: 'Chybí userId' }, { status: 400 });
  }

  const profile = db.dating_profiles.find(p => p.userId === userId);
  if (!profile) {
    return NextResponse.json({ message: 'Profil nenalezen' }, { status: 404 });
  }

  return NextResponse.json(profile);
}

// POST: Vytvoří nebo aktualizuje profil
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, photoUrl, age, gender, orientation, bio, zodiac, education, ambitions, values, lifestyle, partnerCount, matchPreference } = body;
    const db = getDb();

    if (!userId) {
      return NextResponse.json({ error: 'Chybí identifikace uživatele' }, { status: 400 });
    }

    // Najdeme uživatele, jestli existuje
    const user = db.dating_users.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json({ error: 'Uživatel nenalezen' }, { status: 404 });
    }

    const existingProfileIndex = db.dating_profiles.findIndex(p => p.userId === userId);

    const profileData = {
      userId,
      name: body.name || user.name || '',
      lastName: body.lastName || null,
      nickname: body.nickname || user.nickname || null,
      showMutualFriends: body.showMutualFriends !== false,
      photoUrl: photoUrl || null,
      photos: body.photos || [],
      age: age || null,
      gender: gender || null,
      orientation: orientation || null,
      bio: bio || '',
      zodiac: zodiac || null,
      education: education || null,
      ambitions: ambitions || null,
      values: values || [],
      lifestyle: lifestyle || [],
      partnerCount: partnerCount || null, // Zcela dobrovolné, odpovědnost klienta
      matchPreference: matchPreference || 'both', // 'same', 'opposite', 'both'
      status: 'active',
      updatedAt: new Date().toISOString()
    };

    if (existingProfileIndex >= 0) {
      // Update
      db.dating_profiles[existingProfileIndex] = {
        ...db.dating_profiles[existingProfileIndex],
        ...profileData
      };
    } else {
      // Create
      db.dating_profiles.push({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...profileData
      });
    }

    saveDb();
    return NextResponse.json({ message: 'Profil úspěšně uložen', profile: profileData });

  } catch (error) {
    console.error('Seznamka Profile Error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}
