import React, { useState } from 'react';
import Image from 'next/image';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface UserSearchCardProps {
  user: {
    userId: string;
    name: string;
    lastName?: string;
    nickname?: string;
    photos: string[];
    age: string;
    city?: string;
    mutualFriendsCount?: number;
    showMutualFriends?: boolean;
  };
  onFriendRequestSent?: () => void;
}

export function UserSearchCard({ user, onFriendRequestSent }: UserSearchCardProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  
  const handleAddFriend = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/seznamka/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: session.user.id,
          receiverId: user.userId
        })
      });
      
      if (res.ok) {
        setRequested(true);
        if (onFriendRequestSent) onFriendRequestSent();
      }
    } catch (error) {
      console.error('Error sending friend request', error);
    } finally {
      setLoading(false);
    }
  };

  const displayName = `${user.name} ${user.lastName || ''}`.trim();

  return (
    <div className="bg-mafia-dark/80 backdrop-blur-md border border-mafia-gold/20 rounded-xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-mafia-gold/50">
          <Image 
            src={user.photos && user.photos.length > 0 ? user.photos[0] : '/placeholder-user.jpg'} 
            alt={displayName} 
            fill 
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-heading font-black text-white text-lg flex items-center gap-2">
            {displayName}
            {user.nickname && <span className="text-mafia-gold/70 text-sm italic normal-case font-sans">"{user.nickname}"</span>}
          </h3>
          <p className="text-white/60 text-sm font-mono">{user.age} {user.city ? `• ${user.city}` : ''}</p>
          
          {user.showMutualFriends !== false && user.mutualFriendsCount !== undefined && user.mutualFriendsCount > 0 && (
            <p className="text-pink-400 text-xs font-mono mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
              {user.mutualFriendsCount} společných přátel
            </p>
          )}
        </div>
      </div>
      
      <button 
        onClick={handleAddFriend}
        disabled={loading || requested}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          requested 
            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
            : 'bg-mafia-gold hover:bg-yellow-600 text-black shadow-[0_0_10px_rgba(197,160,89,0.5)]'
        }`}
        title={requested ? 'Žádost odeslána' : 'Přidat do přátel'}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : 
         requested ? <UserCheck size={18} /> : <UserPlus size={18} />}
      </button>
    </div>
  );
}
