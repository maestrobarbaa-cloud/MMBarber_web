"use client";

import { useEffect, useState, useRef } from "react";
import { X, Calendar, MapPin, Phone, Compass, Info, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";
import { trackEvent } from "../utils/analytics";
import Link from "next/link";
import Image from "next/image";
import { playSound } from "../utils/audio";

export function MobileActions() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const [isCompassOpen, setIsCompassOpen] = useState(false);
  
  const playBulletHit = () => {
    playSound("/sounds/bullet-hit.mp3", 0.6);
  };

  useEffect(() => {
    const checkMobile = () => setIsVisible(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleCompassState = (e: Event) => {
      setIsCompassOpen((e as CustomEvent).detail);
    };
    window.addEventListener('mmbarber-compass-state', handleCompassState as EventListener);

    // Initial check for compass
    const stored = localStorage.getItem("mmbarber_compass_enabled") === "true";
    setIsCompassOpen(stored);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener('mmbarber-compass-state', handleCompassState as EventListener);
    };
  }, []);

  if (!isVisible) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  // Tile data
  const tiles = [
    { 
      id: 'book',
      label: t.header?.startMission || 'REZERVOVAT', 
      icon: <Calendar size={32} />, 
      href: '/jak-to-chodi',
      color: 'bg-mafia-gold',
      textColor: 'text-mafia-black',
      span: 'col-span-2'
    },
    { 
      id: 'schedule',
      label: 'ROZVRH', 
      icon: <Info size={24} />, 
      href: '/#holidays' 
    },
    { 
      id: 'gallery',
      label: 'GALERIE', 
      icon: <Info size={24} />, 
      href: '/galerie' 
    },
    { 
      id: 'contact',
      label: 'KONTAKT', 
      icon: <Phone size={24} />, 
      href: '/#kontakt' 
    },
    { 
      id: 'system',
      label: 'SYSTÉM A NÁVŠTĚVA', 
      icon: <ShieldCheck size={24} />, 
      href: '/system-a-navsteva' 
    },
    { 
      id: 'compass',
      label: 'KOMPAS', 
      icon: <Compass size={24} className="animate-spin-slow" />, 
      isAction: () => window.dispatchEvent(new CustomEvent('mmbarber-toggle-compass'))
    }
  ];

  return (
    <>
      {/* THE MAIN ACTION BUTTON (Windows Mobile Style) */}
      <div className={`fixed ${isCompassOpen ? 'bottom-28' : 'bottom-8'} left-1/2 -translate-x-1/2 z-[1100] transition-all duration-500 ease-out`}>
        <button
          onClick={toggleMenu}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-2 ${isOpen ? 'bg-mafia-red border-white scale-90' : 'bg-mafia-black border-mafia-gold scale-100 hover:scale-110 hover:shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]'}`}
        >
          {isOpen ? <X size={40} className="text-white" /> : (
            <div className="flex flex-col items-center">
               <Image src="/logo.png" alt="MM" width={32} height={24} className="w-8 h-6 object-contain" />
               <span className="text-[8px] font-black text-mafia-gold tracking-widest mt-1">MENU</span>
            </div>
          )}
          
          {/* Pulse Effect */}
          {!isOpen && (
            <div 
              className="absolute inset-0 rounded-full border-4 border-mafia-gold animate-ping opacity-20 pointer-events-none"
              style={{ borderColor: "var(--user-accent-color)" }}
            ></div>
          )}
        </button>
      </div>

      {/* TILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[1050] flex items-center justify-center p-6"
          >
            <div className="w-full max-w-sm grid grid-cols-2 gap-4">
              <div className="col-span-2 mb-4 text-center">
                 <h2 className="text-mafia-gold font-heading font-black text-2xl tracking-[0.3em] uppercase">CENTRÁLA</h2>
                 <p className="text-white/40 font-mono text-[10px] tracking-widest mt-1">OPERATIVNÍ ROZHRANÍ</p>
              </div>

              {tiles.map((tile) => (
                tile.href ? (
                  <Link
                    key={tile.id}
                    href={tile.href}
                    onClick={() => { 
                      toggleMenu(); 
                      trackEvent(`mobile_tile_${tile.id}`); 
                      playBulletHit();
                    }}
                    className={`${tile.span || 'col-span-1'} ${tile.color || 'bg-white/5 border border-white/10'} p-4 md:p-6 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform`}
                  >
                    <div className={`${tile.textColor || 'text-mafia-gold'} scale-90 md:scale-100`}>{tile.icon}</div>
                    <span className={`text-[9px] md:text-[10px] font-sans font-black tracking-widest uppercase ${tile.textColor || 'text-white'}`}>
                      {tile.label}
                    </span>
                  </Link>
                ) : (
                  <button
                    key={tile.id}
                    onClick={() => { 
                      tile.isAction?.(); 
                      toggleMenu(); 
                      trackEvent(`mobile_tile_${tile.id}`); 
                      playBulletHit();
                    }}
                    className={`${tile.span || 'col-span-1'} ${tile.color || 'bg-white/5 border border-white/10'} p-4 md:p-6 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform`}
                  >
                    <div className={`${tile.textColor || 'text-mafia-gold'} scale-90 md:scale-100`}>{tile.icon}</div>
                    <span className={`text-[9px] md:text-[10px] font-sans font-black tracking-widest uppercase ${tile.textColor || 'text-white'}`}>
                      {tile.label}
                    </span>
                  </button>
                )
              ))}

              <div className="col-span-2 flex justify-center gap-6 mt-6">
                 <button onClick={() => { 
                   window.location.href = "tel:+420577544073"; 
                   playBulletHit();
                 }} className="p-4 rounded-full border border-mafia-gold text-mafia-gold active:scale-90 transition-transform">
                   <Phone size={24} />
                 </button>
                 <button onClick={() => { 
                   window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("MMBARBER Mařatice")}`, '_blank'); 
                   playBulletHit();
                 }} className="p-4 rounded-full border border-mafia-gold text-mafia-gold active:scale-90 transition-transform">
                   <MapPin size={24} />
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
