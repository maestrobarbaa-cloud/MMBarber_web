import { NextResponse } from 'next/server';
import { getDb } from '@/lib/jsonDb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Chybí userId' }, { status: 400 });
  }

  const db = getDb();
  
  const friendships = db.dating_friendships || [];
  const friendIds = friendships
    .filter((f: any) => f.user1Id === userId || f.user2Id === userId)
    .map((f: any) => f.user1Id === userId ? f.user2Id : f.user1Id);

  const friendsProfiles = db.dating_profiles.filter((p: any) => friendIds.includes(p.userId));

  // Remove sensitive data
  const safeFriends = friendsProfiles.map((profile: any) => ({
    userId: profile.userId,
    name: profile.name,
    lastName: profile.lastName,
    nickname: profile.nickname,
    photos: profile.photos,
    age: profile.age,
    city: profile.city
  }));

  return NextResponse.json({ friends: safeFriends });
}
