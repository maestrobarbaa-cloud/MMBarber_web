"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { 
  Target, 
  Sparkles, 
  X, 
  Skull,
  Palette,
  Monitor,
  Volume2,
  Radio,
  Crown,
  Users,
  Dices,
  Bell,
  Settings
} from "lucide-react";
import { playSound } from "@/utils/audio";
import { useTranslation } from "@/hooks/useTranslation";
import { useUI } from "@/contexts/UIContext";

interface HUDWeaponItem {
  name: string;
  desc: string;
  subText: string;
  icon: React.ReactNode;
  link: string;
  color: string;
}

export function TableOfContents() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [soundState, setSoundState] = useState(true);
  const [isIntroActive, setIsIntroActive] = useState(false);
  const [clickStats, setClickStats] = useState<Record<number, number>>({});
  const [justOpened, setJustOpened] = useState(false);
  const [isBloodMode, setIsBloodMode] = useState(false);
  const [isNoirMode, setIsNoirMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { lang } = useTranslation();
  const { graphicsTier } = useUI();

  useEffect(() => {
    setIsMounted(true);

    const checkModes = () => {
      setIsBloodMode(document.documentElement.classList.contains('theme-blood'));
      setIsNoirMode(document.documentElement.classList.contains('noir-mode'));
    };
    checkModes();
    const observer = new MutationObserver(checkModes);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 1280;
    const hasVisited = typeof window !== 'undefined' && localStorage.getItem("mmbarber_visited") === "true";
    if (!isMobileDevice && !hasVisited && window.location.pathname === "/") {
      setIsIntroActive(true);
    }
    const handleIntroDismissed = () => setIsIntroActive(false);
    window.addEventListener("introDismissed", handleIntroDismissed);

    const readSound = () => {
      const isSound = localStorage.getItem("mmbarber_sound_enabled") === "true";
      setSoundState(isSound);
    };
    readSound();
    window.addEventListener("mmbarber-sound-update-remote", readSound);

    // Load Click Stats
    try {
      const stats = localStorage.getItem("mmbarber_radial_stats");
      if (stats) {
        setClickStats(JSON.parse(stats));
      }
    } catch(e) {}

    // Keyboard shortcuts: TAB key triggers weapon wheel selection HUD!
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (document.activeElement && document.activeElement !== document.body) {
          return;
        }
        e.preventDefault();
        setIsOpen(prev => {
          const nextState = !prev;
          if (nextState) {
            playSound("/sounds/success.mp3", 0.4);
            setJustOpened(true);
            setTimeout(() => setJustOpened(false), 500);
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
      window.removeEventListener("mmbarber-sound-update-remote", readSound);
      window.removeEventListener("introDismissed", handleIntroDismissed);
      observer.disconnect();
    };
  }, [isOpen]);

  const hudItems: HUDWeaponItem[] = [
    {
      name: "Nastavení Webu",
      desc: "Kompletní správa vzhledu, grafiky, upozornění a zvuků.",
      subText: "PŘIZPŮSOBENÍ WEBU",
      icon: <Settings />,
      link: "/nastaveni",
      color: "rgba(197, 160, 89, 0.4)"
    },
    {
      name: "Hodnocení a přezdívky",
      desc: "Zde můžete hodnotit naše barbery a spravovat své uživatelské jméno.",
      subText: "KOMUNITA",
      icon: <Crown />,
      link: "/hodnoceni",
      color: "rgba(197, 160, 89, 0.4)"
    },
    {
      name: "Zábava & Hry",
      desc: "Vyzkoušejte elitní střelbu nebo hazardní automat a získejte respekt.",
      subText: "ZÁBAVA A PODSVĚTÍ",
      icon: <Dices />,
      link: "/hry",
      color: "rgba(255, 255, 255, 0.2)"
    },
    {
      name: "Náš Tým",
      desc: "Prozkoumejte profily, specializace a celková hodnocení našich barberů.",
      subText: "ZAMĚSTNANCI",
      icon: <Users />,
      link: "/zivotopisy",
      color: "rgba(255, 255, 255, 0.2)"
    },
    {
      name: "Zavřít menu",
      desc: "Zavře tento navigační panel a vrátí vás zpět na stránku.",
      subText: "NAVIGACE",
      icon: <X />,
      link: "close",
      color: "rgba(197, 160, 89, 0.4)"
    }
  ];

  // Find Favorite (most clicked) Item
  const favoriteIndex = useMemo(() => {
    let max = 0;
    let fav = -1;
    for (const [key, val] of Object.entries(clickStats)) {
       if (val > max) { max = val; fav = parseInt(key); }
    }
    return fav;
  }, [clickStats]);

  const handleSelectWedge = (item: HUDWeaponItem, index: number) => {
    playSound("/sounds/success.mp3", 0.6);
    setIsOpen(false);

    // Save stats
    const newStats = { ...clickStats, [index]: (clickStats[index] || 0) + 1 };
    setClickStats(newStats);
    localStorage.setItem("mmbarber_radial_stats", JSON.stringify(newStats));

    if (item.link === "close") {
      return;
    }

    if (item.link === "graphics_settings") {
      window.dispatchEvent(new Event('mmbarber-graphics-open'));
      return;
    }

    if (item.link === "sound_toggle") {
      const current = localStorage.getItem("mmbarber_sound_enabled") === "true";
      const nextState = !current;
      localStorage.setItem("mmbarber_sound_enabled", String(nextState));
      window.dispatchEvent(new CustomEvent('mmbarber-sound-update', { detail: nextState }));
      window.dispatchEvent(new Event('mmbarber-sound-update-remote'));
      return;
    }

    if (item.link === "radio_toggle") {
      window.dispatchEvent(new Event('mmbarber-radio-toggle'));
      return;
    }

    if (item.link === "elite_shooting") {
      window.dispatchEvent(new Event('mmbarber-elita-game-open'));
      return;
    }

    if (item.link === "slot_machine") {
      window.dispatchEvent(new Event('mmbarber-slot-machine-open'));
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

  const activeHoveredItem = hoveredIndex !== null ? hudItems[hoveredIndex] : null;

  const accentColor = isBloodMode ? "#c8102e" : isNoirMode ? "#ffffff" : "#c5a059";
  const accentRgba = isBloodMode ? "rgba(200, 16, 46, 0.4)" : isNoirMode ? "rgba(255, 255, 255, 0.4)" : "rgba(197, 160, 89, 0.4)";
  const accentRgbaStrong = isBloodMode ? "rgba(200, 16, 46, 0.6)" : isNoirMode ? "rgba(255, 255, 255, 0.6)" : "rgba(197, 160, 89, 0.6)";
  const accentRgbaFaint = isBloodMode ? "rgba(200, 16, 46, 0.15)" : isNoirMode ? "rgba(255, 255, 255, 0.15)" : "rgba(197, 160, 89, 0.15)";
  const accentShadow = isBloodMode ? "rgba(200, 16, 46, 0.3)" : isNoirMode ? "rgba(255, 255, 255, 0.3)" : "rgba(197, 160, 89, 0.3)";

  if (!isMounted) return null;
  if (pathname !== "/") return null;
  if (isIntroActive) return null;

  return (
    <>
      <div 
        onClick={() => {
          setIsOpen(true);
          setJustOpened(true);
          setTimeout(() => setJustOpened(false), 500);
          playSound("/sounds/success.mp3", 0.4);
        }}
        onMouseEnter={() => {
          setIsOpen(true);
          setJustOpened(true);
          setTimeout(() => setJustOpened(false), 500);
          playSound("/sounds/success.mp3", 0.4);
        }}
        className={`fixed left-0 top-0 h-screen w-8 bg-gradient-to-r from-mafia-black to-black/80 border-r border-mafia-gold/40 cursor-pointer transition-all duration-500 hover:w-12 hover:bg-mafia-gold/10 flex flex-col items-center justify-center group z-[29000] hidden xl:flex shadow-[5px_0_15px_rgba(197,160,89,0.15)] ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="flex flex-col items-center gap-6 transition-all duration-500 -rotate-90 origin-center whitespace-nowrap opacity-100">
          <span className="text-[11px] text-mafia-gold font-black drop-shadow-[0_0_8px_rgba(197,160,89,1)] uppercase tracking-[0.2em] transition-colors duration-300 flex items-center gap-3">
            {lang === 'cs' ? 'HLAVNÍ MENU' : 'MAIN MENU'}
          </span>
        </div>

        {(graphicsTier === 'high' || graphicsTier === 'ultra') && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none w-full opacity-30 group-hover:opacity-100 transition-opacity duration-500">
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-[2px] h-[45px] rounded-full bg-gradient-to-t from-transparent via-mafia-gold/80 to-white shadow-[0_0_10px_#C5A059] z-0 will-change-transform will-change-opacity transform-gpu"
              initial={{ y: "100vh" }}
              animate={{ y: "-10vh" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: 2,
              }}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-screen h-screen bg-black z-[45000] flex flex-col items-center justify-center overflow-hidden font-sans select-none"
          >
            {/* BOOT UP GLITCH EFFECT */}
            {justOpened && (
              <motion.div 
                initial={{ opacity: 0.8 }} 
                animate={{ opacity: 0 }} 
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 bg-white z-[50000] pointer-events-none mix-blend-difference"
                style={{ clipPath: "polygon(0 10%, 100% 20%, 100% 30%, 0 40%, 0 60%, 100% 70%, 100% 80%, 0 90%)" }}
              />
            )}

            {/* Global HUD Scanline / CRT overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10 opacity-40 mix-blend-overlay"></div>
            <div className="absolute inset-0 pointer-events-none opacity-20 shadow-[inset_0_0_150px_rgba(0,0,0,1)] z-10"></div>
            
            {/* HUD HEADER */}
            <div className="absolute top-10 left-12 right-12 flex items-center justify-between border-b border-white/10 pb-6 z-20">
              <div className="flex items-center gap-4">
                <Target className="w-8 h-8 animate-[spin_8s_linear_infinite]" style={{ color: accentColor }} />
                <div className="flex flex-col">
                  <span className="text-white font-heading font-black text-2xl uppercase tracking-widest text-shadow-glow">MMBARBER NAVIGACE</span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: accentColor, opacity: 0.6 }}>WEAPON WHEEL</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  playSound("/sounds/click.mp3", 0.2);
                  setIsOpen(false);
                }}
                className="fixed top-6 right-6 md:top-10 md:right-12 z-[100] px-4 md:px-6 py-2 md:py-3 bg-black/50 border border-white/10 text-white hover:text-black transition-all duration-300 font-mono text-[10px] md:text-xs uppercase tracking-widest rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.05)] backdrop-blur-md flex items-center gap-2 group"
                style={{
                  '--hover-bg': accentColor,
                  '--hover-border': accentColor,
                  '--hover-shadow': `0 0 20px ${accentColor}`
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = accentColor;
                  e.currentTarget.style.borderColor = accentColor;
                  e.currentTarget.style.boxShadow = `0 0 20px ${accentRgbaStrong}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(255,255,255,0.05)';
                }}
              >
                <X size={14} className="group-hover:rotate-90 transition-transform" />
                <span className="hidden md:inline">[ ESC ] ZAVŘÍT</span>
                <span className="md:hidden">ZAVŘÍT</span>
              </button>
            </div>

            {/* MAIN INTERFACE ROW */}
            <div className="w-full max-w-[1250px] px-8 flex items-center justify-between gap-16 relative z-20">
              
              {/* LEFT COLUMN: SVG Radial Wheel */}
              <div className="w-[480px] h-[480px] relative shrink-0">
                <svg 
                  width="480" 
                  height="480" 
                  className="absolute top-0 left-0 z-10 overflow-visible"
                >
                  <g transform="translate(0, 0)">
                    {hudItems.map((item, i) => {
                      const angleStep = 360 / hudItems.length;
                      const startAngle = -(angleStep/2) + i * angleStep;
                      const endAngle = (angleStep/2) + i * angleStep;
                      const isHovered = hoveredIndex === i;
                      const isFavorite = favoriteIndex === i;
                      
                      // Calculate offset for "pop out" effect
                      const midAngle = (startAngle + endAngle) / 2;
                      const popAmount = isHovered ? 12 : 0; // Push out by 12px
                      const popX = polarToCartesian(0, 0, popAmount, midAngle).x;
                      const popY = polarToCartesian(0, 0, popAmount, midAngle).y;
                      
                      return (
                        <motion.path 
                          key={i}
                          animate={{ x: popX, y: popY }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          d={getWedgePath(240, 240, 95, 235, startAngle, endAngle)}
                          fill={isHovered ? (item.color.includes("rgba(197") ? accentRgba : item.color) : "rgba(20, 20, 20, 0.75)"}
                          stroke={isHovered ? accentColor : (isFavorite && !isHovered ? accentRgba : "rgba(255, 255, 255, 0.08)")}
                          strokeWidth={isHovered ? 2.5 : (isFavorite ? 2 : 1)}
                          className="cursor-pointer transition-colors duration-300 ease-out"
                          style={{
                            filter: isHovered ? `drop-shadow(0 0 15px ${item.color.includes("rgba(197") ? accentRgba : item.color})` : (isFavorite ? `drop-shadow(0 0 8px ${accentShadow})` : 'none')
                          }}
                          onMouseEnter={() => {
                            setHoveredIndex(i);
                            playSound("/sounds/hover.mp3", 0.1);
                          }}
                          onClick={() => handleSelectWedge(item, i)}
                        />
                      );
                    })}
                  </g>
                </svg>

                {/* Radial Menu Item Icons */}
                {hudItems.map((item, i) => {
                  const angleStep = 360 / hudItems.length;
                  const angleRad = (i * angleStep * Math.PI) / 180.0;
                  const isHovered = hoveredIndex === i;
                  
                  // Same push logic for icons
                  const popAmount = isHovered ? 12 : 0;
                  const centerX = 240 + popAmount * Math.sin(angleRad);
                  const centerY = 240 - popAmount * Math.cos(angleRad);

                  // Adjusted radius to perfectly center icons vertically within the wedge (95 + 235) / 2 = 165
                  const x = centerX + 165 * Math.sin(angleRad);
                  const y = centerY - 165 * Math.cos(angleRad);
                  
                  const isFavorite = favoriteIndex === i;

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleSelectWedge(item, i)}
                      onMouseEnter={() => {
                        setHoveredIndex(i);
                        playSound("/sounds/hover.mp3", 0.1);
                      }}
                      animate={{ left: x, top: y }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute w-14 h-14 rounded-full border flex items-center justify-center z-20 cursor-pointer"
                      style={{
                        backgroundColor: isHovered ? accentColor : (isFavorite ? accentRgbaFaint : "rgba(10, 10, 10, 0.9)"),
                        borderColor: isHovered ? "white" : (isFavorite ? accentRgbaStrong : "rgba(255, 255, 255, 0.15)"),
                        color: isHovered ? "black" : accentColor,
                        boxShadow: isHovered ? `0 0 25px ${accentColor}` : (isFavorite ? `0 0 15px ${accentShadow}` : "none"),
                        transform: `translate(-50%, -50%) scale(${isHovered ? 1.15 : 1.0})`
                      }}
                    >
                      {React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 22 })}
                    </motion.button>
                  );
                })}

                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full bg-mafia-black border-2 flex flex-col items-center justify-center p-4 text-center z-30 transition-all duration-300 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]"
                  style={{
                    borderColor: activeHoveredItem ? accentColor : "rgba(255, 255, 255, 0.1)",
                    boxShadow: activeHoveredItem ? `0 0 45px ${activeHoveredItem.color.includes("rgba(197") ? accentRgba : activeHoveredItem.color}, inset 0 0 30px ${activeHoveredItem.color.includes("rgba(197") ? accentRgba : activeHoveredItem.color}` : "none"
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
                        <div className="mb-2" style={{ color: accentColor, filter: `drop-shadow(0 0 8px ${accentColor})` }}>
                          {React.cloneElement(activeHoveredItem.icon as React.ReactElement<{ size?: number }>, { size: 36 })}
                        </div>
                        <span className="text-[10px] text-white/70 uppercase tracking-wider font-semibold mb-1">
                          {activeHoveredItem.subText}
                        </span>
                        <h3 className="text-white font-heading font-black text-sm uppercase tracking-wider leading-tight drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                          {activeHoveredItem.name}
                        </h3>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-full"
                      >
                        <Target className="w-10 h-10 text-white/10 mb-3 animate-pulse" />
                        <span className="text-[12px] font-heading font-black text-white/30 uppercase tracking-widest">
                          SYSTEM
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Rotating decorative rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-white/10 pointer-events-none animate-[spin_40s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-dashed border-mafia-gold/30 pointer-events-none animate-[spin_20s_linear_infinite_reverse]" />
              </div>

              {/* RIGHT COLUMN: PREMIUM DESCRIPTION ONLY PANEL */}
              <div className="w-[480px] h-[480px] flex flex-col justify-center shrink-0">
                <AnimatePresence mode="wait">
                  {activeHoveredItem ? (
                    <motion.div
                      key={hoveredIndex}
                      initial={{ opacity: 0, x: 50, filter: "blur(10px)", scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)", scale: 1 }}
                      exit={{ opacity: 0, x: 50, filter: "blur(10px)", scale: 0.95 }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                      className="bg-black/80 border border-mafia-gold/30 p-8 flex flex-col justify-between rounded-sm h-[360px] text-left relative overflow-hidden backdrop-blur-xl"
                      style={{
                        boxShadow: `0 20px 50px rgba(0,0,0,0.9), inset 0 0 60px rgba(0,0,0,0.8), 0 0 30px ${activeHoveredItem.color}`
                      }}
                    >
                      {/* Watermark Icon */}
                      <div className="absolute -bottom-10 -right-10 text-white/[0.03] rotate-[-15deg] pointer-events-none">
                         {React.cloneElement(activeHoveredItem.icon as React.ReactElement<{ size?: number }>, { size: 280 })}
                      </div>

                      {/* Smooth top accent line */}
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-mafia-gold to-transparent shadow-[0_0_15px_rgba(197,160,89,1)]" />
                      <div className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-mafia-gold/30" />
                      <div className="absolute bottom-0 left-0 w-2 h-full bg-gradient-to-b from-mafia-gold/20 to-transparent" />

                      <div className="flex flex-col gap-2 z-20">
                        <div className="flex items-center gap-3 mb-2 bg-mafia-gold/10 w-max px-3 py-1 rounded-sm border border-mafia-gold/20">
                          <span className="w-2 h-2 rounded-full bg-mafia-gold animate-pulse shadow-[0_0_8px_rgba(197,160,89,1)]" />
                          <span className="text-[10px] text-mafia-gold uppercase tracking-[0.3em] font-black">{activeHoveredItem.subText}</span>
                        </div>
                        <h3 className="text-white font-heading font-black text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] tracking-wide">
                          {activeHoveredItem.name}
                        </h3>
                      </div>
                      
                      <div className="my-6 z-20 flex-1 border-l-2 border-white/10 pl-5 relative">
                        {/* Ammo / Stat Bars for flavor */}
                        <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-white/5 flex flex-col justify-between py-1">
                          {[...Array(6)].map((_, idx) => (
                             <div key={idx} className="w-full h-1 bg-mafia-gold/30"></div>
                          ))}
                        </div>

                        <p className="text-base text-smoke-white/90 leading-relaxed font-sans">
                          {activeHoveredItem.link === "sound_toggle"
                            ? `Tato položka umožňuje zapnutí nebo vypnutí veškerých zvuků na webu. Zvukové efekty jsou v tuto chvíli: ${soundState ? "ZAPNUTÉ" : "VYPNUTÉ"}.`
                            : activeHoveredItem.desc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/10 pt-5 z-20 mt-auto">
                        <div className="flex flex-col">
                           <span className="text-[9px] text-white/30 uppercase tracking-[0.2em]">AKCE</span>
                           <span className="text-[13px] text-mafia-gold font-black uppercase tracking-widest hover:text-white transition-colors cursor-pointer drop-shadow-[0_0_5px_rgba(197,160,89,0.6)]">
                             [ POTVRDIT LKM ] &rarr;
                           </span>
                        </div>
                        
                        <div className="text-[10px] font-mono text-mafia-gold/30 text-right">
                           {hoveredIndex !== null && clickStats[hoveredIndex] ? `POUŽITO: ${clickStats[hoveredIndex]}x` : 'POUŽITO: 0x'}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-black/40 border border-white/5 p-8 flex flex-col justify-between rounded-sm text-left h-[360px] relative overflow-hidden backdrop-blur-sm"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(197,160,89,0.02)_25%,transparent_25%,transparent_50%,rgba(197,160,89,0.02)_50%,rgba(197,160,89,0.02)_75%,transparent_75%,transparent)] bg-[length:20px_20px]"></div>
                      
                      <div className="space-y-4 relative z-10 mt-6">
                        <div className="flex items-center gap-3 opacity-50">
                          <span className="w-2 h-2 rounded-full border border-white/50" />
                          <span className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-black">SYSTÉM PŘIPRAVEN</span>
                        </div>
                        <h3 className="text-white/40 font-heading font-black text-3xl uppercase tracking-wider">
                          ČEKÁM NA VÝBĚR
                        </h3>
                        <div className="h-[2px] w-12 bg-white/10 my-4"></div>
                        <p className="text-[14px] text-smoke-white/40 leading-relaxed font-sans">
                          Najeďte myší na libovolnou výseč taktického kruhu vlevo. Objeví se zde podrobné informace o zbrani/modulu a možnost rychlého spuštění.
                        </p>
                      </div>

                      <div className="absolute bottom-6 right-8 opacity-20">
                         <Target size={120} className="animate-[spin_20s_linear_infinite]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-mafia-gold z-30 opacity-50"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-mafia-gold z-30 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-mafia-gold z-30 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-mafia-gold z-30 opacity-50"></div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
