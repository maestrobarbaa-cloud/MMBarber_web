"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACHIEVEMENTS, AchievementId } from "@/data/achievements";
import { Crown, Trophy } from "lucide-react";

export function AchievementUnlocked() {
  const [queue, setQueue] = useState<AchievementId[]>([]);
  const [current, setCurrent] = useState<AchievementId | null>(null);

  useEffect(() => {
    const handleUnlock = (e: CustomEvent) => {
      setQueue((prev) => [...prev, e.detail as AchievementId]);
    };
    window.addEventListener('mmbarber-achievement-unlocked', handleUnlock as EventListener);
    return () => window.removeEventListener('mmbarber-achievement-unlocked', handleUnlock as EventListener);
  }, []);

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((prev) => prev.slice(1));
      
      // Play a sound if available
      try {
        const audio = new Audio('/success.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch (e) {}

      // Hide after 4 seconds
      setTimeout(() => {
        setCurrent(null);
      }, 4000);
    }
  }, [queue, current]);

  return (
    <AnimatePresence>
      {current && ACHIEVEMENTS[current] && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.9 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[10000] w-[90%] max-w-sm pointer-events-none"
        >
          <div className="relative bg-slate-950 border border-mafia-gold/50 rounded-lg p-4 shadow-[0_10px_40px_rgba(197,160,89,0.3)] overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-mafia-gold/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-mafia-gold to-transparent" />
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border border-mafia-gold/40 flex items-center justify-center bg-black shrink-0 relative">
                <div className="absolute inset-0 bg-mafia-gold/10 rounded-full animate-pulse" />
                {(() => {
                  const Icon = ACHIEVEMENTS[current].icon;
                  return <Icon size={24} className="text-mafia-gold relative z-10" />;
                })()}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy size={12} className="text-mafia-gold" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-mafia-gold">
                    Úspěch odemčen
                  </span>
                </div>
                <h4 className="text-white font-bold text-sm mb-1 leading-tight">
                  {ACHIEVEMENTS[current].name}
                </h4>
                <p className="text-slate-400 text-xs line-clamp-2 leading-snug">
                  {ACHIEVEMENTS[current].description}
                </p>
                <div className="mt-2 text-mafia-gold font-mono text-[10px] font-bold">
                  +{ACHIEVEMENTS[current].xpReward} XP
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
