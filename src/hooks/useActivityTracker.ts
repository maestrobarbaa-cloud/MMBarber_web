'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

const TRACKING_INTERVAL_MS = 60000; // 1 minute
const IDLE_TIMEOUT_MS = 300000; // 5 minutes

export function useActivityTracker() {
  const { data: session } = useSession();
  
  const lastActivityRef = useRef<number>(Date.now());
  const activeSecondsRef = useRef<number>(0);
  
  useEffect(() => {
    if (!session?.user) return;
    
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);

    const activeTimer = setInterval(() => {
      const now = Date.now();
      const isIdle = now - lastActivityRef.current > IDLE_TIMEOUT_MS;
      
      if (!isIdle) {
        activeSecondsRef.current += 1;
      }
    }, 1000);

    const heartbeatTimer = setInterval(() => {
      const secondsToReport = activeSecondsRef.current;
      if (secondsToReport > 0) {
        activeSecondsRef.current = 0;
        
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actionType: 'HEARTBEAT',
            durationSec: secondsToReport,
            points: Math.floor(secondsToReport / 60)
          })
        }).catch(err => console.error('Failed to sync activity', err));
      }
    }, TRACKING_INTERVAL_MS);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(activeTimer);
      clearInterval(heartbeatTimer);
    };
  }, [session?.user]);
}
