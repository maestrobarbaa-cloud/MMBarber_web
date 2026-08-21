'use client';

import React from 'react';
import Image from 'next/image';

interface DonationUser {
  name: string | null;
  image: string | null;
  profile?: {
    name: string | null;
    photos: string | null;
  } | null;
}

export interface DonationItem {
  id: string;
  name: string | null;
  amount: number;
  currency: string;
  message: string | null;
  region: string | null;
  createdAt: string;
  user: DonationUser | null;
}

interface DonateWallCardProps {
  donation: DonationItem;
  rank: number;
}

export default function DonateWallCard({ donation, rank }: DonateWallCardProps) {
  // Určíme třídu podle výše daru
  let tier = 'supporter';
  let tierName = 'Srdcař';
  let badgeColor = 'bg-slate-100 text-slate-800 border-slate-300';
  let cardStyle = 'border-slate-200 bg-white hover:border-slate-300';

  if (donation.amount >= 2000) {
    tier = 'vip';
    tierName = 'Vyšší třída (VIP)';
    badgeColor = 'bg-yellow-100 text-yellow-800 border-yellow-300';
    cardStyle = 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-white shadow-md shadow-yellow-100/50 hover:shadow-lg hover:shadow-yellow-200/50';
  } else if (donation.amount >= 500) {
    tier = 'middle';
    tierName = 'Střední třída';
    badgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-300';
    cardStyle = 'border-indigo-200 bg-gradient-to-br from-indigo-50/30 to-white hover:border-indigo-300';
  }

  // Získáme jméno a fotku - priorita je anonymní jméno u daru, pak profil, pak user
  const displayName = donation.name || (donation.user?.profile?.name) || donation.user?.name || 'Anonymní dárce';
  
  let avatarUrl = '/default-avatar.png';
  if (donation.user?.profile?.photos) {
    try {
      const photos = JSON.parse(donation.user.profile.photos);
      if (photos && photos.length > 0) avatarUrl = photos[0];
    } catch(e) {
      // Ignorujeme chyby parsování
    }
  } else if (donation.user?.image) {
    avatarUrl = donation.user.image;
  }

  return (
    <div className={`relative p-5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 ${cardStyle}`}>
      {/* Odznáček pro TOP 3 */}
      {rank <= 3 && (
        <div className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 text-white font-bold shadow-lg">
          #{rank}
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
          <Image 
            src={avatarUrl} 
            alt={displayName}
            fill
            className="object-cover"
            sizes="(max-width: 56px) 100vw, 56px"
          />
        </div>

        {/* Informace */}
        <div className="flex-grow">
          <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">
            {displayName}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md text-sm">
              {donation.amount.toLocaleString('cs-CZ')} {donation.currency}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badgeColor}`}>
              {tierName}
            </span>
            {donation.region && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {donation.region}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Vzkaz */}
      {donation.message && (
        <div className="mt-4 p-3 rounded-xl bg-white/60 text-gray-700 text-sm italic border border-white/40 shadow-sm">
          "{donation.message}"
        </div>
      )}
    </div>
  );
}
