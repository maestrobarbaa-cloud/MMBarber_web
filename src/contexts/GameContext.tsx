"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getInternalIdentity } from '@/utils/identity';

interface GameContextProps {
  collectedIds: string[];
  collectFragment: (fragmentId: string) => Promise<void>;
  isTomasUnlocked: boolean;
  isNellaUnlocked: boolean;
  totalCollected: number;
  mafiaRank: string;
  resetProgress: () => Promise<void>;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const TOMAS_THRESHOLD = 5;
export const NELLA_THRESHOLD = 10;

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const [bonusXp, setBonusXp] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mmbarber_fragments');
      if (saved) {
        setCollectedIds(JSON.parse(saved));
      }
      
      const savedXp = parseInt(localStorage.getItem('mmbarber_bonus_xp') || '0', 10);
      let currentBonus = savedXp;

      const lastLogin = localStorage.getItem('mmbarber_last_login');
      const today = new Date().toDateString();
      
      if (lastLogin !== today) {
        currentBonus += 50;
        localStorage.setItem('mmbarber_bonus_xp', currentBonus.toString());
        localStorage.setItem('mmbarber_last_login', today);
      }
      setBonusXp(currentBonus);
    } catch (e) {
      console.error("Failed to load game data:", e);
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
    } catch (e) {}
  };

  const resetProgress = async () => {
    setCollectedIds([]);
    setBonusXp(0);
    try {
      localStorage.removeItem('mmbarber_fragments');
      localStorage.removeItem('mmbarber_bonus_xp');
      localStorage.removeItem('mmbarber_last_login');
    } catch (e) {}
  };

  const totalCollected = (collectedIds.length * 10) + bonusXp; // Base fragments worth 10 XP
  const isTomasUnlocked = totalCollected >= TOMAS_THRESHOLD;
  const isNellaUnlocked = totalCollected >= NELLA_THRESHOLD;

  let mafiaRank = "Soldato";
  if (totalCollected >= 150) mafiaRank = "Capo";
  if (totalCollected >= 500) mafiaRank = "Underboss";
  if (totalCollected >= 1000) mafiaRank = "Don";

  return (
    <GameContext.Provider value={{
      collectedIds,
      collectFragment,
      isTomasUnlocked,
      isNellaUnlocked,
      totalCollected,
      mafiaRank,
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
