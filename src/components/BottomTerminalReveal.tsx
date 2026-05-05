"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Lock, Unlock, Database, Activity } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

interface BottomTerminalRevealProps {
  children: (unlockLevel: number) => React.ReactNode;
  thresholdMultiplier?: number;
}

export function BottomTerminalReveal({ children, thresholdMultiplier = 1 }: BottomTerminalRevealProps) {
  const [unlockLevel, setUnlockLevel] = useState(0); // 0: Locked, 1-4: Stages
  const [overscrollProgress, setOverscrollProgress] = useState(0);
  const { lang } = useTranslation();
  
  const STAGE_1_THRESHOLD = 500 * thresholdMultiplier;
  const STAGE_2_THRESHOLD = 1500 * thresholdMultiplier;
  const STAGE_3_THRESHOLD = 3500 * thresholdMultiplier;
  const STAGE_4_THRESHOLD = 6000 * thresholdMultiplier;
  const STAGE_5_THRESHOLD = 10000 * thresholdMultiplier; 
  
  const scrollAccumulator = useRef(0);
  const lastScrollTime = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      
      if (isAtBottom && e.deltaY > 0) {
        scrollAccumulator.current += Math.abs(e.deltaY);
        
        if (unlockLevel < 1 && scrollAccumulator.current >= STAGE_1_THRESHOLD) setUnlockLevel(1);
        if (unlockLevel === 1 && scrollAccumulator.current >= STAGE_2_THRESHOLD) setUnlockLevel(2);
        if (unlockLevel === 2 && scrollAccumulator.current >= STAGE_3_THRESHOLD) setUnlockLevel(3);
        if (unlockLevel === 3 && scrollAccumulator.current >= STAGE_4_THRESHOLD) setUnlockLevel(4);
        if (unlockLevel === 4 && scrollAccumulator.current >= STAGE_5_THRESHOLD) setUnlockLevel(5);

        let progress = 0;
        if (unlockLevel === 0) progress = (scrollAccumulator.current / STAGE_1_THRESHOLD) * 100;
        else if (unlockLevel === 1) progress = ((scrollAccumulator.current - STAGE_1_THRESHOLD) / (STAGE_2_THRESHOLD - STAGE_1_THRESHOLD)) * 100;
        else if (unlockLevel === 2) progress = ((scrollAccumulator.current - STAGE_2_THRESHOLD) / (STAGE_3_THRESHOLD - STAGE_2_THRESHOLD)) * 100;
        else if (unlockLevel === 3) progress = ((scrollAccumulator.current - STAGE_3_THRESHOLD) / (STAGE_4_THRESHOLD - STAGE_3_THRESHOLD)) * 100;
        else if (unlockLevel === 4) progress = ((scrollAccumulator.current - STAGE_4_THRESHOLD) / (STAGE_5_THRESHOLD - STAGE_4_THRESHOLD)) * 100;
        else progress = 100;
        
        setOverscrollProgress(Math.min(progress, 100));
        lastScrollTime.current = Date.now();
      } else if (e.deltaY < 0 && isAtBottom && scrollAccumulator.current > 0) {
          scrollAccumulator.current = Math.max(0, scrollAccumulator.current - Math.abs(e.deltaY));
          
          if (unlockLevel === 5 && scrollAccumulator.current < STAGE_5_THRESHOLD) setUnlockLevel(4);
          else if (unlockLevel === 4 && scrollAccumulator.current < STAGE_4_THRESHOLD) setUnlockLevel(3);
          else if (unlockLevel === 3 && scrollAccumulator.current < STAGE_3_THRESHOLD) setUnlockLevel(2);
          else if (unlockLevel === 2 && scrollAccumulator.current < STAGE_2_THRESHOLD) setUnlockLevel(1);
          else if (unlockLevel === 1 && scrollAccumulator.current < STAGE_1_THRESHOLD) setUnlockLevel(0);
          
          setOverscrollProgress(0); 
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.touches[0].clientY;
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      
      if (isAtBottom && deltaY > 0) {
        scrollAccumulator.current += Math.abs(deltaY) * 0.5;
        // Logic same as wheel... but for simplicity we trigger levels faster on touch
        if (unlockLevel < 1 && scrollAccumulator.current >= STAGE_1_THRESHOLD) setUnlockLevel(1);
        lastScrollTime.current = Date.now();
      }
    };

    const timer = setInterval(() => {
        if (Date.now() - lastScrollTime.current > 3000 && scrollAccumulator.current > 0) {
            scrollAccumulator.current = Math.max(0, scrollAccumulator.current - 50);
        }
    }, 100);

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        clearInterval(timer);
    };
  }, [unlockLevel]);

  // Clone children and pass the unlock level if they are components that can receive it,
  // or simply use a context. For simplicity, we'll just render everything if level > 0
  // but with different animations for the deeper parts in the parent component.
  
  return (
    <div className="relative w-full">
      {!unlockLevel && (
        <div className="w-full h-12 pointer-events-none" aria-hidden="true" />
      )}

      <motion.div
        initial={{ opacity: 0, filter: "blur(20px)", y: 20 }}
        animate={unlockLevel >= 1 ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(20px)", y: 20 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className={unlockLevel === 0 ? "pointer-events-none select-none h-0 overflow-hidden" : "w-full"}
      >
        <div className="relative">
          {children(unlockLevel)}
        </div>
      </motion.div>
    </div>
  );
}
