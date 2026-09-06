'use client';

import { useState, useEffect } from 'react';

type FragmentState = {
  fragments: number;
  coins: number;
  canClaimDaily: boolean;
  hasClaimedProfile: boolean;
  fragmentsPerCoin: number;
  activeSpawn: {
    id: string;
    location: string;
    expiresAt: string;
  } | null;
} | null;

export function useFragments() {
  const [state, setState] = useState<FragmentState>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/fragments');
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch (e) {
      console.error('Error fetching fragment state', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const claimAction = async (action: 'DAILY_LOGIN' | 'PROFILE_COMPLETION' | 'COLLECT_HIDDEN', spawnId?: string) => {
    try {
      const res = await fetch('/api/fragments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, spawnId })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchState(); // Refresh state
        return data; // returns { success, fragments, coins, coinsAdded, message }
      }
      return null;
    } catch (e) {
      console.error('Error claiming fragment', e);
      return null;
    }
  };

  return { state, isLoading, fetchState, claimAction };
}
