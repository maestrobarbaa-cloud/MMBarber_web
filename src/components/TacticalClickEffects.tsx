"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "@/utils/audio";

interface RadarPing {
  id: number;
  x: number;
  y: number;
}

export default function TacticalClickEffects() {
  const [pings, setPings] = useState<RadarPing[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Ignore clicks on buttons/links
      if ((e.target as HTMLElement).closest("button, a, input, [role='button']")) return;

      if (e.detail === 1) {
        // Single click - Radar Ping
        playSound("/sounds/kamera.mp3", 0.3); // Using camera click as a tech sound
        
        const newPing = { id: Date.now(), x: e.clientX, y: e.clientY };
        setPings(prev => [...prev, newPing]);
        
        setTimeout(() => {
          setPings(prev => prev.filter(p => p.id !== newPing.id));
        }, 2000);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {pings.map(ping => (
          <motion.div
            key={ping.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute rounded-full border border-mafia-gold"
            style={{
              left: ping.x - 20,
              top: ping.y - 20,
              width: 40,
              height: 40,
              boxShadow: "0 0 15px rgba(197, 160, 89, 0.5) inset"
            }}
          >
            {/* Crosshair inside ping */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-mafia-gold/50 -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 h-full w-[1px] bg-mafia-gold/50 -translate-x-1/2"></div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
