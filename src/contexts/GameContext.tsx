"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getInternalIdentity } from '@/utils/identity';

interface GameContextProps {
  collectedIds: string[];
  collectFragment: (fragmentId: string) => Promise<void>;
  isTomasUnlocked: boolean;
  isNellaUnlocked: boolean;
  totalCollected: number;
  resetProgress: () => Promise<void>;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const TOMAS_THRESHOLD = 5;
export const NELLA_THRESHOLD = 10;

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const id = await getInternalIdentity();
        const res = await fetch(`/api/fragments/progress?id=${encodeURIComponent(id)}`);
        if (res.ok) {
          const data = await res.json();
          setCollectedIds(data.collectedIds || []);
        }
      } catch (error) {
        console.error("Failed to load fragment progress:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadProgress();
  }, []);

  const collectFragment = async (fragmentId: string) => {
    if (collectedIds.includes(fragmentId)) return;
    
    // Optimistic update
    const newCollected = [...collectedIds, fragmentId];
    setCollectedIds(newCollected);

    try {
      const id = await getInternalIdentity();
      const res = await fetch('/api/fragments/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, fragmentId })
      });
      if (!res.ok) {
        // Revert on failure
        setCollectedIds(collectedIds);
      }
    } catch (error) {
      console.error("Failed to collect fragment:", error);
      setCollectedIds(collectedIds);
    }
  };

  const resetProgress = async () => {
    setCollectedIds([]);
    try {
      const id = await getInternalIdentity();
      await fetch('/api/fragments/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (error) {
      console.error("Failed to reset progress:", error);
    }
  };

  const totalCollected = collectedIds.length;
  const isTomasUnlocked = totalCollected >= TOMAS_THRESHOLD;
  const isNellaUnlocked = totalCollected >= NELLA_THRESHOLD;

  return (
    <GameContext.Provider value={{
      collectedIds,
      collectFragment,
      isTomasUnlocked,
      isNellaUnlocked,
      totalCollected,
      resetProgress
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
