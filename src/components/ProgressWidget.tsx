"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { useGame } from "@/contexts/GameContext";

const getLevelFromVisits = (visits: number) => {
  if (visits <= 1) return 1;
  if (visits >= 33) return 33;
  return Math.floor(visits);
};

export const ProgressWidget = () => {
  const [isClient, setIsClient] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeChapter, setActiveChapter] = useState("products");
  const { chapterXp } = useGame();

  useEffect(() => {
    setIsClient(true);
    setIsHidden(localStorage.getItem("mmbarber_hide_progress_widget") === "true");
    setActiveChapter(localStorage.getItem("mmbarber_active_chapter") || "products");
    
    const handleUpdate = () => {
      setIsHidden(localStorage.getItem("mmbarber_hide_progress_widget") === "true");
    };
    window.addEventListener("mmbarber-ui-prefs-update", handleUpdate);
    
    // Watch for chapter changes
    const interval = setInterval(() => {
      const current = localStorage.getItem("mmbarber_active_chapter") || "products";
      if (current !== activeChapter) {
        setActiveChapter(current);
      }
    }, 1000);
    
    return () => {
      window.removeEventListener("mmbarber-ui-prefs-update", handleUpdate);
      clearInterval(interval);
    };
  }, [activeChapter]);

  if (!isClient || isHidden) return null;

  const currentXp = chapterXp[activeChapter] || 0;
  const sequence = getLevelFromVisits(currentXp);
  
  let chapterNum = 1;
  if (activeChapter === "community") chapterNum = 2;
  if (activeChapter === "settings") chapterNum = 3;

  return (
    <Link href="/postup">
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="hidden md:flex fixed bottom-24 left-6 md:bottom-32 md:left-10 z-40 p-3 md:p-4 rounded-full bg-black/80 border border-mafia-gold/50 theme-blood:border-red-500/50 noir-mode:border-white/50 shadow-[0_0_20px_rgba(197,160,89,0.3)] theme-blood:shadow-[0_0_20px_rgba(239,68,68,0.3)] text-mafia-gold theme-blood:text-red-500 noir-mode:text-white backdrop-blur-sm group overflow-visible items-center justify-center"
        title="Váš postup"
      >
        <div className="absolute inset-0 bg-mafia-gold/20 theme-blood:bg-red-500/20 noir-mode:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
        <Trophy size={28} className="relative z-10 group-hover:text-white transition-colors group-hover:scale-110" />
        
        {/* K Badge (Kapitola) */}
        <div className="absolute -top-2 -left-2 bg-mafia-gold theme-blood:bg-red-600 noir-mode:bg-white text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-black z-20 shadow-md">
          K{chapterNum}
        </div>
        
        {/* S Badge (Sekvence) */}
        <div className="absolute -bottom-2 -right-2 bg-mafia-gold theme-blood:bg-red-600 noir-mode:bg-white text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-black z-20 shadow-md">
          S{sequence}
        </div>
      </motion.button>
    </Link>
  );
};
