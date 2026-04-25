"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslation } from "../hooks/useTranslation";
import { getActiveTheme } from "../lib/holidays";

export function MinigameToggle() {
  const { lang } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isVip = pathname === "/vip-club";

  useEffect(() => {
    const checkVisibility = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      
      const theme = getActiveTheme();
      const isForced = localStorage.getItem("mmbarber_game_forced") === "true";
      
      // Events (Easter, Matrix, etc.)
      const isEvent = theme !== 'default';
      
      setIsVisible(isEvent || isForced);
      setIsEnabled(localStorage.getItem("mmbarber_game_enabled") === "true");
    };

    checkVisibility();
    const interval = setInterval(checkVisibility, 60000);
    window.addEventListener("mmbarber-game-update", checkVisibility);
    window.addEventListener("mmbarber-game-force-update", checkVisibility);
    window.addEventListener("storage", checkVisibility);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("mmbarber-game-update", checkVisibility);
      window.removeEventListener("mmbarber-game-force-update", checkVisibility);
      window.removeEventListener("storage", checkVisibility);
    };
  }, []);

  if (!isVisible) return null;

  const toggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem("mmbarber_game_enabled", newState.toString());
    window.dispatchEvent(new CustomEvent("mmbarber-game-update"));
  };

  const GameIcon = ({ enabled }: { enabled: boolean }) => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      className={`transition-all duration-700 ${enabled ? 'text-mafia-black scale-110' : 'text-mafia-gold group-hover:rotate-12'}`}
      style={{ filter: enabled ? 'none' : 'drop-shadow(0 0 5px var(--color-mafia-gold))' }}
    >
      <path d="M6 12H8M12 12H14M6 8V16M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="10" r="1.5" fill="currentColor" />
      <circle cx="18" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );

  return (
    <div className={`hidden xl:flex fixed ${isVip ? 'bottom-[84px]' : 'bottom-6'} right-6 z-50 items-center transition-all duration-500`}>
      <motion.button
        onClick={toggle}
        className={`w-44 h-[56px] flex items-center justify-center gap-4 border-2 transition-all duration-500 rounded-none bg-mafia-dark/95 backdrop-blur-md relative overflow-hidden shadow-2xl group ${
          isEnabled 
            ? "bg-mafia-gold border-mafia-gold text-mafia-black hover:bg-white hover:border-white" 
            : "border-mafia-gold/30 text-mafia-gold hover:border-mafia-gold hover:bg-mafia-black"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow effect */}
        {isEnabled && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white"
          ></motion.div>
        )}

        <div className="relative flex items-center gap-3">
            <GameIcon enabled={isEnabled} />
            <span className="font-heading font-black text-sm uppercase tracking-[0.2em] leading-none">
                {lang === 'cs' ? (isEnabled ? "HRY: ON" : "HRY: OFF") : (isEnabled ? "GAMES: ON" : "GAMES: OFF")}
            </span>
        </div>

        {/* Status indicator line */}
        <div className={`absolute bottom-0 left-0 h-1.5 bg-mafia-red transition-all duration-700 ${isEnabled ? 'w-full' : 'w-0'}`}></div>
      </motion.button>
    </div>
  );
}
