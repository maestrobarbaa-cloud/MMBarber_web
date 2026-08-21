"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Fingerprint } from 'lucide-react';

interface GameFragmentProps {
  id: string;
  className?: string;
  size?: number;
  delay?: number;
}

export function GameFragment({ id, className = "", size = 32, delay = 0 }: GameFragmentProps) {
  const { collectedIds, collectFragment } = useGame();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isCollected = collectedIds.includes(id);

  const [graphicsTier, setGraphicsTier] = useState<string>("high");

  useEffect(() => {
    const tier = document.documentElement.getAttribute('data-graphics-tier') || "low";
    setGraphicsTier(tier);
    
    if (tier !== 'low' && tier !== 'lite') {
      const t = setTimeout(() => setIsVisible(true), 2000 + delay);
      return () => clearTimeout(t);
    }
  }, [delay]);

  if (isCollected || graphicsTier === 'low' || graphicsTier === 'lite' || !isVisible) return null;

  const handleCollect = (e: React.MouseEvent) => {
    e.stopPropagation();
    collectFragment(id);
    // Play a small sound or give feedback if desired
  };

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
        whileHover={{ scale: 1.2, rotate: 90 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCollect}
        className={`absolute z-[100] cursor-pointer group flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        title="Odemkni fragment"
      >
        <div className="absolute inset-0 bg-mafia-gold/40 rounded-full blur-md group-hover:bg-mafia-gold/80 transition-all duration-300 animate-pulse"></div>
        <Fingerprint 
          size={size * 0.7} 
          className="text-mafia-gold relative z-10 opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_12px_rgba(197,160,89,1)]" 
        />
        {/* Radar ping effect */}
        <motion.div
          animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 border-2 border-mafia-gold rounded-full pointer-events-none"
        />
      </motion.button>
    </AnimatePresence>
  );
}
