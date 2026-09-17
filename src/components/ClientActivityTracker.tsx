'use client'

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function ClientActivityTracker() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated') return;

    const interval = setInterval(async () => {
      // Odesílá se jen pokud má okno focus
      if (document.hasFocus()) {
        try {
          // Na pozadí připisuje aktivitu, ale nevyskakuje žádné upozornění
          await fetch('/api/rewards/activity', { method: 'POST' });
        } catch (error) {
          console.error('Activity ping failed', error);
        }
      }
    }, 60000); // každou minutu

    return () => clearInterval(interval);
  }, [status]);

  // Komponenta na obrazovce nic neukazuje
  return null;
}
