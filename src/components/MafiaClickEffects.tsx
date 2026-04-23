"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "../utils/audio";

export function MafiaClickEffects() {
  const [effectType, setEffectType] = useState<"none" | "bullets" | "money">("none");
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [bullets, setBullets] = useState<{ x: number, y: number, id: number }[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Ignore clicks on buttons/links to avoid interfering with navigation
      const target = e.target as HTMLElement;
      const heroEl = document.getElementById("hero");
      const isHeroArea = heroEl && (heroEl === target || heroEl.contains(target));
      if (target.closest("button") || target.closest("a") || target.closest("input") || isHeroArea || target.closest('[data-no-click-effect="true"]')) return;

      setClickCount((prev) => prev + 1);

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      clickTimeoutRef.current = setTimeout(() => {
        setClickCount((currentCount) => {
          if (currentCount === 2) {
            triggerBulletEffect(e.clientX, e.clientY);
          } else if (currentCount >= 3) {
            triggerMoneyEffect();
          }
          return 0; // Reset
        });
      }, 400); // 400ms window for double/triple click
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const triggerBulletEffect = (x: number, y: number) => {
    setEffectType("bullets");
    playSound("/sounds/naboje.mp3", 0.8);
    
    // Create exactly 1 bullet hole exactly at the click coordinates
    setBullets([{ x, y, id: Date.now() }]);

    setTimeout(() => {
      setEffectType("none");
      setBullets([]);
    }, 2000);
  };

  const triggerMoneyEffect = () => {
    setEffectType("money");
    playSound("/sounds/kamera.mp3", 0.6); // Camera flash sound as a trigger
    setTimeout(() => {
      setEffectType("none");
    }, 4000);
  };

  return (
    <>
      <AnimatePresence>
        {effectType === "bullets" && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[9999]"
          >
            {/* Flash */}
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-white mix-blend-overlay"
            />
            {bullets.map((b) => (
              <motion.div
                key={b.id}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1, opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: b.x, top: b.y }}
              >
                {/* Bullet hole crack */}
                <div className="absolute inset-0 border-4 border-black/80 rounded-full scale-10" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/shattered-glass.png')] opacity-80 mix-blend-screen scale-[3]" />
                <div className="absolute inset-0 bg-mafia-red/50 blur-xl scale-[2]" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {effectType === "money" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
          >
            {/* Cinematic Sepia/Gold overlay */}
            <div className="absolute inset-0 bg-mafia-gold/20 mix-blend-color backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
            
            {/* Falling Money Bills */}
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -100, 
                  x: Math.random() * window.innerWidth, 
                  rotateZ: Math.random() * 360,
                  rotateX: Math.random() * 360
                }}
                animate={{ 
                  y: window.innerHeight + 100,
                  rotateZ: Math.random() * 720,
                  rotateX: Math.random() * 720
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2, 
                  ease: "linear",
                  delay: Math.random() * 0.5 
                }}
                className="absolute w-16 h-8 bg-mafia-dark border border-mafia-gold/50 shadow-lg flex items-center justify-center opacity-80"
              >
                <span className="text-[6px] font-mono text-mafia-gold uppercase tracking-widest">$100</span>
              </motion.div>
            ))}

            {/* Central "Family" crest pulse */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.2, 1], opacity: [0, 0.8, 0] }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
            >
              <div className="w-[320px] h-[320px] md:w-[400px] md:h-[400px] border-4 border-mafia-gold rounded-full flex items-center justify-center relative px-8">
                <div className="absolute inset-0 bg-mafia-gold/10 blur-xl rounded-full" />
                <span className="text-3xl md:text-5xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] text-center drop-shadow-[0_0_20px_rgba(197,160,89,1)]">
                  JSI MI V PATÁCH !
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
