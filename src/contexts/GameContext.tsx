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
    try {
      const saved = localStorage.getItem('mmbarber_fragments');
      if (saved) {
        setCollectedIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load fragments from local storage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const collectFragment = async (fragmentId: string) => {
    if (collectedIds.includes(fragmentId)) return;
    
    const newCollected = [...collectedIds, fragmentId];
    setCollectedIds(newCollected);
    
    try {
      localStorage.setItem('mmbarber_fragments', JSON.stringify(newCollected));
    } catch (e) {
      console.error("Failed to save fragment to local storage:", e);
    }
  };

  const resetProgress = async () => {
    setCollectedIds([]);
    try {
      localStorage.removeItem('mmbarber_fragments');
    } catch (e) {
      console.error("Failed to reset fragments in local storage:", e);
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
