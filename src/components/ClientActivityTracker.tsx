'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export function ClientActivityTracker() {
  const { status } = useSession();
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const interval = setInterval(async () => {
      // Odesílá se jen pokud má okno focus
      if (document.hasFocus()) {
        try {
          const res = await fetch('/api/rewards/activity', { method: 'POST' });
          if (res.ok) {
            const data = await res.json();
            if (data.rewardGiven) {
              setNotification(data.rewardGiven);
              // Zmizí po 10 vteřinách
              setTimeout(() => setNotification(null), 10000);
            }
          }
        } catch (error) {
          console.error('Activity ping failed', error);
        }
      }
    }, 60000); // každou minutu

    return () => clearInterval(interval);
  }, [status]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-mafia-gold text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-2xl animate-bounce">
      🎁 {notification}
    </div>
  );
}
