import { NextResponse } from 'next/server';
import { getDb } from '@/lib/jsonDb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toLowerCase();

  if (!query || query.trim() === '') {
    return NextResponse.json({ results: [] });
  }

  const db = getDb();
  
  // Search in dating_profiles
  const results = db.dating_profiles.filter((profile: any) => {
    // Only search active profiles
    if (profile.status !== 'active') return false;

    const nameMatch = profile.name?.toLowerCase().includes(query);
    const lastNameMatch = profile.lastName?.toLowerCase().includes(query);
    const nicknameMatch = profile.nickname?.toLowerCase().includes(query);

    return nameMatch || lastNameMatch || nicknameMatch;
  });

  // Calculate mutual friends for each result if we have a requesting user
  const requestingUserId = searchParams.get('userId');
  if (requestingUserId) {
    const friendships = db.dating_friendships || [];
    
    // Get friends of requesting user
    const myFriends = friendships
      .filter((f: any) => f.user1Id === requestingUserId || f.user2Id === requestingUserId)
      .map((f: any) => f.user1Id === requestingUserId ? f.user2Id : f.user1Id);

    results.forEach((profile: any) => {
      // Get friends of the search result user
      const theirFriends = friendships
        .filter((f: any) => f.user1Id === profile.userId || f.user2Id === profile.userId)
        .map((f: any) => f.user1Id === profile.userId ? f.user2Id : f.user1Id);

      // Find intersection
      const mutualFriends = myFriends.filter((id: string) => theirFriends.includes(id));
      profile.mutualFriendsCount = mutualFriends.length;
    });
  }

  // Remove sensitive data before sending
  const safeResults = results.map((profile: any) => ({
    userId: profile.userId,
    name: profile.name,
    lastName: profile.lastName,
    nickname: profile.nickname,
    photos: profile.photos,
    age: profile.age,
    city: profile.city,
    showMutualFriends: profile.showMutualFriends,
    mutualFriendsCount: profile.showMutualFriends === false ? 0 : (profile.mutualFriendsCount || 0)
  }));

  return NextResponse.json({ results: safeResults });
}
