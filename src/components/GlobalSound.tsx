"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Global component that plays a sound effect on background clicks,
 * except for interactive elements and barber cards.
 */
export function GlobalSound() {
  const magnumRef = useRef<HTMLAudioElement | null>(null);
  const nabojeRef = useRef<HTMLAudioElement | null>(null);
  const kulometRef = useRef<HTMLAudioElement | null>(null);
  const [bulletHoles, setBulletHoles] = useState<{ id: number; x: number; y: number; rotation: number; size: number }[]>([]);
  const [weaponType, setWeaponType] = useState<'pistol' | 'burst'>('pistol');

  useEffect(() => {
    // ... audio initialization ...
    magnumRef.current = new Audio("/sounds/magnum.mp3");
    magnumRef.current.volume = 0.3;
    
    nabojeRef.current = new Audio("/sounds/naboje.mp3");
    nabojeRef.current.volume = 0.4;

    kulometRef.current = new Audio("/sounds/kulomet.mp3");
    kulometRef.current.volume = 0.25;

    const savedWeapon = localStorage.getItem("mmbarber_weapon_type") as 'pistol' | 'burst';
    if (savedWeapon) setWeaponType(savedWeapon);

    const handleWeaponUpdate = (e: Event) => {
      setWeaponType((e as CustomEvent).detail);
    };
    
    const handleGlobalClick = (e: MouseEvent) => {
      const soundSetting = localStorage.getItem("mmbarber_sound_enabled");
      const isEnabled = soundSetting === null || soundSetting === "true";
      if (!isEnabled) return;

      const target = e.target as HTMLElement;
      const isExempt = target.closest('button, a, [role="button"], .barber-card, .menu-card, .editorial-photo, .holiday-card, .radio-container, .game-container, input, select, textarea, img, canvas');
      if (isExempt) return;

      const currentWeapon = localStorage.getItem("mmbarber_weapon_type") || 'pistol';

      if (currentWeapon === 'pistol') {
        // Single Shot Logic - LARGER HOLES
        if (magnumRef.current) {
          magnumRef.current.currentTime = 0;
          magnumRef.current.play().catch(err => console.debug("Magnum blocked:", err));
        }
        
        const size = 35 + Math.random() * 25; // 35px to 60px
        addHole(e.clientX, e.clientY + window.scrollY, size);

        if (nabojeRef.current) {
          setTimeout(() => {
            if (nabojeRef.current) {
              nabojeRef.current.currentTime = 0;
              nabojeRef.current.play().catch(err => console.debug("Naboje blocked:", err));
            }
          }, 600);
        }
      } else {
        // Burst Shot Logic (Kulomet) - SMALLER HOLES
        const shotCount = Math.floor(Math.random() * 7) + 2; // 2 to 8 shots
        const angle = Math.random() * Math.PI * 2;
        
        for (let i = 0; i < shotCount; i++) {
          setTimeout(() => {
            if (kulometRef.current) {
               const sfx = kulometRef.current.cloneNode() as HTMLAudioElement;
               sfx.volume = 0.25;
               sfx.play().catch(() => {});
            }

            const distance = i * (15 + Math.random() * 25);
            const jitterX = (Math.random() - 0.5) * 30;
            const jitterY = (Math.random() - 0.5) * 30;
            
            const x = e.clientX + Math.cos(angle) * distance + jitterX;
            const y = e.clientY + window.scrollY + Math.sin(angle) * distance + jitterY;
            
            const size = 15 + Math.random() * 15; // 15px to 30px
            addHole(x, y, size);

            if (nabojeRef.current) {
              setTimeout(() => {
                if (nabojeRef.current) {
                  const shells = nabojeRef.current.cloneNode() as HTMLAudioElement;
                  shells.volume = 0.25;
                  shells.play().catch(() => {});
                }
              }, 50);
            }
          }, i * 120);
        }
      }
    };

    const addHole = (x: number, y: number, size: number) => {
      setBulletHoles(prev => {
        const newHoles = [...prev, {
          id: Date.now() + Math.random(),
          x,
          y,
          size,
          rotation: Math.random() * 360
        }];
        return newHoles.slice(-25);
      });
    };

    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("mmbarber-weapon-update", handleWeaponUpdate as EventListener);
    
    return () => {
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("mmbarber-weapon-update", handleWeaponUpdate as EventListener);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[10000] overflow-visible">
      {bulletHoles.map(hole => (
        <div 
          key={hole.id}
          className="absolute pointer-events-none"
          style={{ 
            left: hole.x - (hole.size / 2), 
            top: hole.y - (hole.size / 2),
            width: hole.size,
            height: hole.size,
            transform: `rotate(${hole.rotation}deg)`
          }}
        >
          {/* Main Hole - Scaled by hole.size */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black shadow-[inset_0_0_5px_rgba(0,0,0,1),0_0_2px_rgba(0,0,0,0.8)]" 
               style={{ width: hole.size * 0.15, height: hole.size * 0.15 }} />
          
          {/* Burn marks & cracks - Scaled */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 mix-blend-multiply bg-[radial-gradient(circle,rgba(0,0,0,0.8)_0%,transparent_70%)]" 
               style={{ width: hole.size, height: hole.size }} />
          
          {/* Cracks - Scaled */}
          <div className="absolute top-1/2 left-1/2 bg-black/40 origin-left -rotate-12" style={{ width: hole.size * 0.4, height: 1 }} />
          <div className="absolute top-1/2 left-1/2 bg-black/40 origin-left rotate-45" style={{ width: hole.size * 0.3, height: 1 }} />
          <div className="absolute top-1/2 left-1/2 bg-black/40 origin-left rotate-[110deg]" style={{ width: hole.size * 0.5, height: 1 }} />
          <div className="absolute top-1/2 left-1/2 bg-black/40 origin-left rotate-[190deg]" style={{ width: hole.size * 0.35, height: 1 }} />
          <div className="absolute top-1/2 left-1/2 bg-black/40 origin-left rotate-[280deg]" style={{ width: hole.size * 0.45, height: 1 }} />
          
          {/* Flash animation on impact - Scaled */}
          <motion.div 
             initial={{ opacity: 1, scale: 0.2 }}
             animate={{ opacity: 0, scale: 2 }}
             transition={{ duration: 0.3 }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 rounded-full blur-md mix-blend-screen"
             style={{ width: hole.size, height: hole.size }}
          />
        </div>
      ))}
    </div>
  );
}
