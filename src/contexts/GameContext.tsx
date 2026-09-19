"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getInternalIdentity } from '@/utils/identity';
import { AchievementId, ACHIEVEMENTS } from '@/data/achievements';

interface GameContextProps {
  collectedIds: string[];
  unlockedAchievements: AchievementId[];
  collectFragment: (fragmentId: string) => Promise<void>;
  unlockAchievement: (id: AchievementId) => void;
  isTomasUnlocked: boolean;
  isNellaUnlocked: boolean;
  totalCollected: number; // Nyní reprezentuje Návštěvy
  chapterXp: Record<string, number>; // Nyní reprezentuje Návštěvy pro danou kapitolu
  mafiaRank: string;
  resetProgress: () => Promise<void>;
  activeChapter: string;
  changeChapter: (chapterId: string) => Promise<void>;
  isAdmin: boolean;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const TOMAS_THRESHOLD = 5;
export const NELLA_THRESHOLD = 10;

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<AchievementId[]>([]);
  const [totalCollected, setTotalCollected] = useState(0); 
  const [chapterXp, setChapterXp] = useState<Record<string, number>>({ products: 0, community: 0, secret: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeChapter, setActiveChapter] = useState("products");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(typeof window !== 'undefined' && sessionStorage.getItem("mmbarber_admin_auth") === "true");
    
    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/progress');
        if (res.ok) {
          const { data } = await res.json();
          setTotalCollected(data.totalVisits);
          setChapterXp({
            products: data.productsVisits,
            community: data.communityVisits,
            secret: data.secretVisits
          });
          setActiveChapter(data.activeChapter);
          
          if (data.collectedFragments) {
            setCollectedIds(JSON.parse(data.collectedFragments));
          }
          if (data.unlockedAchievements) {
            setUnlockedAchievements(JSON.parse(data.unlockedAchievements));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchProgress();
  }, []);

  // Anti-F5 - Ping každou minutu pokud je aktivita, po 5 min se na serveru započte návštěva
  useEffect(() => {
    if (!isLoaded) return;
    let lastActionTime = Date.now();
    
    const handleActivity = () => {
      lastActionTime = Date.now();
    };
    
    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('scroll', handleActivity, { passive: true });
    window.addEventListener('click', handleActivity, { passive: true });
    
    const interval = setInterval(async () => {
      const now = Date.now();
      if (now - lastActionTime < 5000) {
        try {
          const res = await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'ping' })
          });
          if (res.ok) {
            const { data, rewarded } = await res.json();
            if (rewarded) {
              setTotalCollected(data.totalVisits);
              setChapterXp({
                products: data.productsVisits,
                community: data.communityVisits,
                secret: data.secretVisits
              });
            }
          }
        } catch (e) { }
      }
    }, 5000);
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(interval);
    };
  }, [isLoaded]);

  const collectFragment = async (fragmentId: string) => {
    if (collectedIds.includes(fragmentId)) return;
    
    const newCollected = [...collectedIds, fragmentId];
    setCollectedIds(newCollected);
    
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fragment', fragmentId })
      });
      if (res.ok) {
        const { data } = await res.json();
        setTotalCollected(data.totalVisits);
        setChapterXp({
          products: data.productsVisits,
          community: data.communityVisits,
          secret: data.secretVisits
        });
      }

      if (newCollected.length === 1) unlockAchievement('first_blood');
      if (newCollected.length >= 5) unlockAchievement('collector');
    } catch (e) {}
  };

  const unlockAchievement = async (id: AchievementId) => {
    if (unlockedAchievements.includes(id)) return;

    const newUnlocked = [...unlockedAchievements, id];
    setUnlockedAchievements(newUnlocked);
    
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'achievement', achievementId: id })
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mmbarber-achievement-unlocked', { detail: id }));
      }
    } catch (e) {}
  };

  const changeChapter = async (chapterId: string) => {
    setActiveChapter(chapterId);
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change_chapter', chapterId })
      });
    } catch (e) {}
  };

  const resetProgress = async () => {
    setCollectedIds([]);
    setUnlockedAchievements([]);
    setTotalCollected(0);
    setChapterXp({ products: 0, community: 0, secret: 0 });
  };

  const isTomasUnlocked = totalCollected >= TOMAS_THRESHOLD;
  const isNellaUnlocked = totalCollected >= NELLA_THRESHOLD;

  let mafiaRank = "Soldato";
  if (totalCollected >= 15) mafiaRank = "Capo";
  if (totalCollected >= 50) mafiaRank = "Underboss";
  if (totalCollected >= 100) mafiaRank = "Don";

  return (
    <GameContext.Provider value={{
      collectedIds,
      unlockedAchievements,
      collectFragment,
      unlockAchievement,
      isTomasUnlocked,
      isNellaUnlocked,
      totalCollected,
      chapterXp,
      mafiaRank,
      resetProgress,
      activeChapter,
      changeChapter,
      isAdmin
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
