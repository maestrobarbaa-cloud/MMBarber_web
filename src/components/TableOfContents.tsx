"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Target, 
  CreditCard, 
  Clock, 
  Ticket, 
  Sparkles, 
  Camera, 
  X, 
  Skull, 
  BookOpen,
  Briefcase
} from "lucide-react";
import { playSound } from "@/utils/audio";

interface HUDWeaponItem {
  name: string;
  desc: string;
  subText: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  stats: {
    freshness: number;
    capacity: number;
    precision: number;
    range: number;
  };
}

export function TableOfContents() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    // Keyboard shortcuts: TAB key triggers weapon wheel selection HUD!
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        setIsOpen(prev => {
          const nextState = !prev;
          if (nextState) {
            playSound("/sounds/success.mp3", 0.4);
          } else {
            playSound("/sounds/click.mp3", 0.2);
          }
          return nextState;
        });
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        playSound("/sounds/click.mp3", 0.2);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectWedge = (item: HUDWeaponItem) => {
    playSound("/sounds/success.mp3", 0.6);
    setIsOpen(false);

    if (item.link === "close") {
      return;
    }

    if (item.link.startsWith("#")) {
      const id = item.link.substring(1);
      const el = document.getElementById(id);
      if (el) {
        const offset = 120;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    } else {
      router.push(item.link);
    }
  };

  // Math helper for drawing SVG wedges segment path
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const getWedgePath = (centerX: number, centerY: number, rInner: number, rOuter: number, startAngle: number, endAngle: number) => {
    const startOuter = polarToCartesian(centerX, centerY, rOuter, startAngle);
    const endOuter = polarToCartesian(centerX, centerY, rOuter, endAngle);
    const startInner = polarToCartesian(centerX, centerY, rInner, startAngle);
    const endInner = polarToCartesian(centerX, centerY, rInner, endAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", startOuter.x, startOuter.y,
      "A", rOuter, rOuter, 0, largeArcFlag, 1, endOuter.x, endOuter.y,
      "L", endInner.x, endInner.y,
      "A", rInner, rInner, 0, largeArcFlag, 0, startInner.x, startInner.y,
      "Z"
    ].join(" ");
  };

  const hudItems: HUDWeaponItem[] = [
    {
      name: "Služby & Ceník",
      desc: "SLUŽBY & CENÍK",
      subText: "TACTICAL PRICING",
      icon: <CreditCard />,
      link: "/cenik",
      color: "rgba(197, 160, 89, 0.4)",
      stats: { freshness: 98, capacity: 95, precision: 99, range: 80 }
    },
    {
      name: "Rezervace",
      desc: "REZERVACE TERMÍNU",
      subText: "DEPLOY OPERATIVE",
      icon: <Clock />,
      link: "/#operativi",
      color: "rgba(255, 255, 255, 0.3)",
      stats: { freshness: 90, capacity: 99, precision: 95, range: 75 }
    },
    {
      name: "Dárkové Vouchery",
      desc: "DÁRKOVÉ VOUCHERY",
      subText: "AMMUNITION CARDS",
      icon: <Ticket />,
      link: "/vouchery",
      color: "rgba(197, 160, 89, 0.45)",
      stats: { freshness: 95, capacity: 90, precision: 98, range: 85 }
    },
    {
      name: "Komunita",
      desc: "KOMUNITNÍ CENTRÁLA",
      subText: "SYNDICATE HUB",
      icon: <BookOpen />,
      link: "/komunita",
      color: "rgba(255, 0, 0, 0.3)",
      stats: { freshness: 88, capacity: 92, precision: 90, range: 95 }
    },
    {
      name: "Magazín Péče",
      desc: "MAGAZÍN PÉČE",
      subText: "SECRET CARE MANUAL",
      icon: <Sparkles />,
      link: "/pece",
      color: "rgba(197, 160, 89, 0.5)",
      stats: { freshness: 92, capacity: 85, precision: 96, range: 90 }
    },
    {
      name: "Galerie & Fade",
      desc: "VIZUÁLNÍ REPORTY",
      subText: "PORTFOLIO CUTS",
      icon: <Camera />,
      link: "/galerie",
      color: "rgba(255, 255, 255, 0.35)",
      stats: { freshness: 96, capacity: 88, precision: 98, range: 92 }
    },
    {
      name: "Syndikát Kariéra",
      desc: "NÁBOR NOVÝCH ČLENŮ",
      subText: "JOIN THE FAMILY",
      icon: <Briefcase />,
      link: "/kariera",
      color: "rgba(0, 255, 255, 0.3)",
      stats: { freshness: 94, capacity: 95, precision: 98, range: 90 }
    },
    {
      name: "Zavřít HUD",
      desc: "ZAVŘÍT TACTICAL HUD",
      subText: "DISMISS COMPASS",
      icon: <X />,
      link: "close",
      color: "rgba(139, 0, 0, 0.5)",
      stats: { freshness: 0, capacity: 0, precision: 0, range: 0 }
    }
  ];

  const activeHoveredItem = hoveredIndex !== null ? hudItems[hoveredIndex] : null;

  if (!isMounted) return null;

  return (
    <>
      {/* Edge Hover Handle / Trigger */}
      <div 
        className={`fixed left-0 top-0 h-screen w-3 bg-black/40 border-r border-mafia-gold/30 cursor-pointer transition-all duration-500 hover:w-6 hover:bg-mafia-gold/10 flex items-center justify-center group z-[40000] hidden xl:flex ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onMouseEnter={() => {
          setIsOpen(true);
          playSound("/sounds/success.mp3", 0.4);
        }}
      >
        <div className="absolute left-6 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none -rotate-90 origin-left translate-y-24">
          <span className="text-mafia-gold font-heading font-black text-xs uppercase tracking-[0.4em]">WEAPON WHEEL</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-screen h-screen bg-black/85 backdrop-blur-md z-[45000] flex flex-col items-center justify-center overflow-hidden font-sans select-none"
          >
            {/* Global HUD Scanline / CRT overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10 opacity-30"></div>
            
            {/* HUD HEADER */}
            <div className="absolute top-10 left-12 right-12 flex items-center justify-between border-b border-white/10 pb-6 z-20">
              <div className="flex items-center gap-4">
                <Target className="w-8 h-8 text-mafia-gold animate-[spin_8s_linear_infinite]" />
                <div className="flex flex-col">
                  <span className="text-white font-heading font-black text-2xl uppercase tracking-[0.25em] italic">MMB_WEAPON_SELECT</span>
                  <span className="text-[9px] font-mono text-mafia-gold/60 uppercase tracking-widest">TACTICAL INTERACTIVE INTERFACE v3.5 // HOLD OR PRESS TAB TO SWITCH</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  playSound("/sounds/click.mp3", 0.2);
                  setIsOpen(false);
                }}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white hover:bg-mafia-gold hover:text-black transition-all font-mono text-xs uppercase tracking-widest rounded-sm"
              >
                [ ESC ] ZAVŘÍT
              </button>
            </div>

            {/* MAIN INTERFACE ROW (SPACED AND ALIGNED FLEXBOX LAYOUT) */}
            <div className="w-full max-w-[1250px] px-8 flex items-center justify-between gap-16 relative z-20">
              
              {/* LEFT COLUMN: REMOVED CHAT - MOVED WHEEL TO CENTER STAGE */}
              <div className="w-[480px] h-[480px] relative shrink-0">
                {/* SVG Radial Wheel */}
                <svg 
                  width="480" 
                  height="480" 
                  className="absolute top-0 left-0 z-10 overflow-visible"
                >
                  <g transform="translate(0, 0)">
                    {hudItems.map((item, i) => {
                      const startAngle = -22.5 + i * 45;
                      const endAngle = 22.5 + i * 45;
                      const isHovered = hoveredIndex === i;
                      
                      return (
                        <motion.path 
                          key={i}
                          d={getWedgePath(240, 240, 95, 235, startAngle, endAngle)}
                          fill={isHovered ? item.color : "rgba(20, 20, 20, 0.75)"}
                          stroke={isHovered ? "var(--color-mafia-gold)" : "rgba(255, 255, 255, 0.08)"}
                          strokeWidth={isHovered ? 2.5 : 1}
                          className="cursor-pointer transition-all duration-300 ease-out"
                          style={{
                            filter: isHovered ? `drop-shadow(0 0 15px ${item.color})` : 'none'
                          }}
                          onMouseEnter={() => {
                            setHoveredIndex(i);
                            playSound("/sounds/hover.mp3", 0.1);
                          }}
                          onClick={() => handleSelectWedge(item)}
                        />
                      );
                    })}
                  </g>
                </svg>

                {/* Radial Menu Item Icons (Absolute HTML positioning for crisp icons & badges) */}
                {hudItems.map((item, i) => {
                  // Position calculations:
                  // Angle: i * 45 degrees, transformed to radians
                  // Center is 240, radius is 172 (perfect optical centering)
                  const angleRad = (i * 45 * Math.PI) / 180.0;
                  const x = 240 + 172 * Math.sin(angleRad);
                  const y = 240 - 172 * Math.cos(angleRad);
                  const isHovered = hoveredIndex === i;

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectWedge(item)}
                      onMouseEnter={() => {
                        setHoveredIndex(i);
                        playSound("/sounds/hover.mp3", 0.1);
                      }}
                      className={`absolute w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 z-20 cursor-pointer`}
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        backgroundColor: isHovered ? "var(--color-mafia-gold)" : "rgba(10, 10, 10, 0.9)",
                        borderColor: isHovered ? "white" : "rgba(255, 255, 255, 0.15)",
                        color: isHovered ? "black" : "var(--color-mafia-gold)",
                        boxShadow: isHovered ? "0 0 25px var(--color-mafia-gold)" : "none",
                        transform: `translate(-50%, -50%) scale(${isHovered ? 1.15 : 1.0})`
                      }}
                    >
                      {React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 22 })}
                    </button>
                  );
                })}

                {/* Inner HUD Circular Card (Center Focal Point) */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full bg-mafia-black border-2 flex flex-col items-center justify-center p-4 text-center z-30 transition-all duration-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]"
                  style={{
                    borderColor: activeHoveredItem ? "var(--color-mafia-gold)" : "rgba(255, 255, 255, 0.1)",
                    boxShadow: activeHoveredItem ? `0 0 35px ${activeHoveredItem.color}` : "none"
                  }}
                >
                  <AnimatePresence mode="wait">
                    {activeHoveredItem ? (
                      <motion.div
                        key={hoveredIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center justify-center h-full"
                      >
                        <div className="text-mafia-gold mb-1 filter drop-shadow-[0_0_8px_rgba(var(--color-mafia-gold-rgb),0.4)]">
                          {React.cloneElement(activeHoveredItem.icon as React.ReactElement<{ size?: number }>, { size: 28 })}
                        </div>
                        <span className="text-[8px] font-mono text-white/40 uppercase tracking-[0.2em] leading-none mb-1">
                          {activeHoveredItem.subText}
                        </span>
                        <h3 className="text-white font-heading font-black text-sm uppercase tracking-wider italic leading-tight">
                          {activeHoveredItem.name}
                        </h3>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-full"
                      >
                        <Skull className="w-8 h-8 text-white/20 mb-2 animate-pulse" />
                        <span className="text-[7px] font-mono text-mafia-gold uppercase tracking-[0.3em] mb-1">TACTICAL_HUD</span>
                        <span className="text-[10px] font-heading font-black text-white/50 uppercase tracking-widest italic">
                          SELECT WEAPON
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Rotating decorative rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-white/5 pointer-events-none animate-[spin_40s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-dashed border-mafia-gold/20 pointer-events-none animate-[spin_20s_linear_infinite_reverse]" />
              </div>

              {/* RIGHT COLUMN: GTA 5 STYLE WEAPON STATS PANEL */}
              <div className="w-[420px] h-[550px] flex flex-col justify-center shrink-0">
                <AnimatePresence mode="wait">
                  {activeHoveredItem ? (
                    <motion.div
                      key={hoveredIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                      className="bg-mafia-black/80 border border-white/10 p-8 flex flex-col rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-left"
                    >
                      <span className="text-[9px] font-mono text-mafia-gold uppercase tracking-[0.4em] mb-1">WEAPON CLASSIFICATION</span>
                      <h3 className="text-white font-heading font-black text-3xl uppercase tracking-tighter italic mb-4 leading-none text-glow">
                        {activeHoveredItem.desc}
                      </h3>
                      
                      <p className="text-xs text-smoke-white/60 leading-relaxed mb-8 uppercase tracking-wide">
                        {activeHoveredItem.link === "close" 
                          ? "Opustí taktickou navigaci a navrátí ovládání standardnímu rozhraní." 
                          : `Spustí sekvenční přesun na modul ${activeHoveredItem.name}. Aktivuje taktické zobrazení.`}
                      </p>

                      {/* STATS BARS */}
                      <div className="space-y-4">
                        {[
                          { label: "POŠKOZENÍ / FRESH CUT", val: activeHoveredItem.stats.freshness },
                          { label: "KAPACITA / DOSTUPNÉ SLOTY", val: activeHoveredItem.stats.capacity },
                          { label: "PŘESNOST / HODNOCENÍ", val: activeHoveredItem.stats.precision },
                          { label: "DOSAH / KOMUNITA", val: activeHoveredItem.stats.range }
                        ].map((stat, idx) => (
                          <div key={idx} className="flex flex-col">
                            <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase tracking-widest mb-1.5">
                              <span>{stat.label}</span>
                              <span className="text-mafia-gold font-bold">{stat.val}%</span>
                            </div>
                            
                            {/* Segmented GTA-style slider bar */}
                            <div className="grid grid-cols-10 gap-1 h-3 w-full bg-white/5 p-[1px]">
                              {Array.from({ length: 10 }).map((_, segmentIdx) => {
                                const fillPercent = (stat.val / 100) * 10;
                                const isFilled = segmentIdx < fillPercent;
                                
                                return (
                                  <div 
                                    key={segmentIdx}
                                    className={`h-full transition-all duration-500 ${isFilled ? 'bg-mafia-gold shadow-[0_0_8px_var(--color-mafia-gold-glow)]' : 'bg-transparent'}`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5">
                        <span className="text-[8px] font-mono text-white/20 uppercase">TARGETING STATUS: LOCKED</span>
                        <span className="text-[10px] font-mono text-mafia-gold font-bold uppercase tracking-widest animate-pulse">DEPLOY READY</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white/[0.02] border border-white/5 p-8 flex flex-col rounded-sm text-left h-[430px] justify-between relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tl from-mafia-gold/5 via-transparent to-transparent opacity-50"></div>
                      
                      <div className="space-y-4 relative z-10">
                        <span className="text-[9px] font-mono text-mafia-gold uppercase tracking-[0.4em]">SYSTEM DIAGNOSTIC</span>
                        <h3 className="text-white font-heading font-black text-2xl uppercase tracking-widest italic">
                          AWAITING SELECTION
                        </h3>
                        <p className="text-xs text-smoke-white/40 leading-relaxed uppercase tracking-wider">
                          Najeďte myší na libovolný sektor taktického kruhu pro zobrazení bojových parametrů, statistik a pro rychlý přechod do dané sekce webu.
                        </p>
                      </div>

                      <div className="space-y-4 relative z-10 opacity-20">
                        {["FRESH CUT", "DOSTUPNÉ SLOTY", "PŘESNOST", "DOSAH"].map((label, idx) => (
                          <div key={idx} className="flex flex-col">
                            <span className="text-[8px] font-mono text-white/40 uppercase mb-1">{label}</span>
                            <div className="grid grid-cols-10 gap-1 h-3 w-full bg-white/5" />
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center border-t border-white/5 pt-4 relative z-10">
                        <span className="text-[8px] font-mono text-white/10 uppercase">SYS_ACTIVE_OPERATIONAL: 1</span>
                        <span className="text-[8px] font-mono text-white/10 uppercase">WAITING</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* BOTTOM DIAGNOSTICS STATS */}
            <div className="absolute bottom-10 left-12 right-12 flex justify-between items-center border-t border-white/10 pt-6 z-20 font-mono text-[10px] text-white/30 uppercase">
              <div className="flex gap-8">
                <span>[ STATUS: SYNCHRONIZED ]</span>
                <span>[ CLIENT_NICKNAME: ONLINE_OPERATIVE ]</span>
              </div>
              <div className="flex gap-8">
                <span className="text-mafia-gold font-bold">100% SECURE SYSTEM // MMB_V3.5_HUD</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-mafia-gold z-30"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-mafia-gold z-30"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-mafia-gold z-30"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-mafia-gold z-30"></div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
