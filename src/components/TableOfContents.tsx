"use client";

import React, { useState, useEffect } from "react";
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
  Crown
} from "lucide-react";
import { playSound } from "@/utils/audio";

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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);

    const readSound = () => {
      const isSound = localStorage.getItem("mmbarber_sound_enabled") === "true";
      setSoundState(isSound);
    };
    readSound();
    window.addEventListener("mmbarber-sound-update-remote", readSound);

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
      window.removeEventListener("mmbarber-sound-update-remote", readSound);
    };
  }, [isOpen]);

  const handleSelectWedge = (item: HUDWeaponItem) => {
    playSound("/sounds/success.mp3", 0.6);
    setIsOpen(false);

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
      name: "Vzhled rozhraní",
      desc: "Aktivuje terminál uživatelského rozhraní, kde si můžete přizpůsobit taktickou barvu, intenzitu záře a styly písma.",
      subText: "NALEZENÍ VAŠÍ ESTETIKY",
      icon: <Palette />,
      link: "/uzivatel",
      color: "rgba(197, 160, 89, 0.4)"
    },
    {
      name: "Grafika systému",
      desc: "Otevře panel nastavení grafiky. Umožňuje přepínat atmosférické částice, stíny, 3D textury a spravovat celkový výkon webu.",
      subText: "ATMOSFÉRICKÉ CONFIG",
      icon: <Monitor />,
      link: "graphics_settings",
      color: "rgba(255, 255, 255, 0.3)"
    },
    {
      name: "Zvukové efekty",
      desc: "Přepíná globální stav zvukových efektů. Změna se ihned projeví u všech operativních zvuků, hlasování i animací.",
      subText: "ZAPNOUT / VYPNOUT ZVUKY",
      icon: <Volume2 />,
      link: "sound_toggle",
      color: "rgba(197, 160, 89, 0.45)"
    },
    {
      name: "MMBarber Rádio",
      desc: "Spouští a zastavuje živé syndikátní rádio. Hraje výběr exkluzivních skladeb pro dokonalou atmosféru na základně.",
      subText: "SPUSTIT / ZASTAVIT HUDBU",
      icon: <Radio />,
      link: "radio_toggle",
      color: "rgba(255, 0, 0, 0.3)"
    },
    {
      name: "Hodnocení a přezdívky",
      desc: "Vstoupí do terminálu komunitního hodnocení. Zde můžete hlasovat o břitvě barberů a měnit herní šarže celé posádky.",
      subText: "TERMINÁL HODNOCENÍ",
      icon: <Crown />,
      link: "/hodnoceni",
      color: "rgba(197, 160, 89, 0.5)"
    },
    {
      name: "Elitní střelba",
      desc: "Spustí taktický tréninkový simulátor. Zlepšete své reakce a přesnost střelby na terče v reálném čase.",
      subText: "TRÉNINK PŘESNOSTI",
      icon: <Target />,
      link: "elite_shooting",
      color: "rgba(255, 255, 255, 0.35)"
    },
    {
      name: "Losovat barbera",
      desc: "Spustí taktický losovací automat. Pokud nevíte, pod koho břitvu se dnes svěřit, automat vám plynule vybere a ukáže jeho statistiky.",
      subText: "NÁHODNÉ PŘIŘAZENÍ MISE",
      icon: <Sparkles />,
      link: "/losovat-barbera",
      color: "rgba(0, 255, 255, 0.3)"
    },
    {
      name: "Zavřít navigaci",
      desc: "Ukončí interaktivní HUD režim a bezpečně vás navrátí k prohlížení hlavní základny MMBarber.",
      subText: "ZAVŘÍT HUD OBRAZOVKU",
      icon: <X />,
      link: "close",
      color: "rgba(139, 0, 0, 0.5)"
    }
  ];

  const activeHoveredItem = hoveredIndex !== null ? hudItems[hoveredIndex] : null;

  if (!isMounted) return null;
  if (pathname !== "/") return null;

  return (
    <>
      {/* Edge Hover Handle / Trigger Cue */}
      <div 
        className={`fixed left-0 top-0 h-screen w-4 bg-black/80 border-r border-mafia-gold/30 cursor-pointer transition-all duration-500 hover:w-10 hover:bg-mafia-gold/5 flex flex-col items-center justify-center group z-[40000] hidden xl:flex ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onMouseEnter={() => {
          setIsOpen(true);
          playSound("/sounds/success.mp3", 0.4);
        }}
      >
        {/* Pulsing top LED indicator */}
        <div className="absolute top-10 flex flex-col items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-mafia-gold animate-pulse shadow-[0_0_8px_rgba(197,160,89,0.8)]" />
          <span className="text-[6px] font-mono text-mafia-gold uppercase tracking-[0.2em] -rotate-90 origin-center mt-2">SYS_ON</span>
        </div>

        {/* Center pulsing vertical text hinting the HUD is here */}
        <div className="flex flex-col items-center gap-4 transition-all duration-500 -rotate-90 origin-center whitespace-nowrap">
          <span className="text-[8px] font-mono text-mafia-gold/40 group-hover:text-mafia-gold/90 uppercase tracking-[0.4em] transition-colors duration-300 flex items-center gap-2 animate-[pulse_2.5s_infinite_ease-in-out]">
            <Target size={10} className="animate-[spin_6s_linear_infinite]" />
            TAKTICKÝ PANEL HUD [ TAB / NAJEĎ ]
          </span>
        </div>

        {/* Bottom coordinates coordinate info */}
        <div className="absolute bottom-10 opacity-30 group-hover:opacity-75 transition-opacity duration-300 text-[6px] font-mono text-mafia-gold -rotate-90 origin-center">
          LOC_0x7F
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-screen h-screen bg-black z-[45000] flex flex-col items-center justify-center overflow-hidden font-sans select-none"
          >
            {/* Global HUD Scanline / CRT overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10 opacity-30"></div>
            
            {/* HUD HEADER */}
            <div className="absolute top-10 left-12 right-12 flex items-center justify-between border-b border-white/10 pb-6 z-20">
              <div className="flex items-center gap-4">
                <Target className="w-8 h-8 text-mafia-gold animate-[spin_8s_linear_infinite]" />
                <div className="flex flex-col">
                  <span className="text-white font-heading font-black text-2xl uppercase tracking-[0.25em] italic">MMB_TAKTICKÁ_NAVIGACE</span>
                  <span className="text-[9px] font-mono text-mafia-gold/60 uppercase tracking-widest">TAKTICKÉ INTERAKTIVNÍ ROZHRANÍ v3.5 // DRŽTE NEBO STISKNĚTE TAB PRO PŘEPNUTÍ</span>
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

                {/* Radial Menu Item Icons */}
                {hudItems.map((item, i) => {
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
                      className="absolute w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 z-20 cursor-pointer"
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
                        <span className="text-[7px] font-mono text-mafia-gold uppercase tracking-[0.3em] mb-1">TAKTICKÉ_MENU</span>
                        <span className="text-[10px] font-heading font-black text-white/50 uppercase tracking-widest italic">
                          ZVOLIT SEKCI
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Rotating decorative rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-white/5 pointer-events-none animate-[spin_40s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-dashed border-mafia-gold/20 pointer-events-none animate-[spin_20s_linear_infinite_reverse]" />
              </div>

              {/* RIGHT COLUMN: PREMIUM DESCRIPTION ONLY PANEL */}
              <div className="w-[420px] h-[480px] flex flex-col justify-center shrink-0">
                <AnimatePresence mode="wait">
                  {activeHoveredItem ? (
                    <motion.div
                      key={hoveredIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                      className="bg-mafia-black/90 border border-mafia-gold/20 p-8 flex flex-col justify-between rounded-sm h-[320px] shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-left relative overflow-hidden"
                      style={{
                        boxShadow: `0 20px 50px rgba(0,0,0,0.9), 0 0 20px ${activeHoveredItem.color}`
                      }}
                    >
                      {/* High-tech laser sweep scanline */}
                      <motion.div 
                        initial={{ y: "-100%" }}
                        animate={{ y: "450%" }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-mafia-gold/30 to-transparent pointer-events-none z-10"
                      />

                      <div className="flex flex-col gap-1 z-20">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-mafia-gold animate-pulse" />
                          <span className="text-[9px] font-mono text-mafia-gold uppercase tracking-[0.4em]">PODROBNOSTI SEKCE // INFO</span>
                        </div>
                        <h3 className="text-white font-heading font-black text-3xl uppercase tracking-tighter italic leading-none text-glow">
                          {activeHoveredItem.name}
                        </h3>
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-1">
                          [ SYSTÉMOVÝ MODUL: {activeHoveredItem.subText} ]
                        </span>
                      </div>
                      
                      <div className="my-4 z-20">
                        <p className="text-[11px] font-mono text-smoke-white/80 uppercase tracking-widest leading-[1.8] border-l-2 border-mafia-gold/40 pl-4">
                          {activeHoveredItem.link === "sound_toggle"
                            ? `Přepíná globální stav zvukových efektů rozhraní. Zvukové efekty jsou v tomto okamžiku: ${soundState ? "AKTIVNÍ (ZAPNUTO)" : "DEAKTIVOVANÉ (VYPNUTO)"}.`
                            : activeHoveredItem.desc}
                        </p>
                      </div>

                      <div className="flex justify-between items-center border-t border-white/5 pt-4 z-20">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mafia-gold opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-mafia-gold"></span>
                          </span>
                          <span className="text-[8px] font-mono text-white/40 uppercase">STATUS: PŘIPRAVEN K PŘECHODU</span>
                        </div>
                        <span className="text-[9px] font-mono text-mafia-gold font-bold uppercase tracking-widest animate-pulse">[ AKTIVUJ SEKTOR ]</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white/[0.02] border border-white/5 p-8 flex flex-col justify-between rounded-sm text-left h-[320px] relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tl from-mafia-gold/5 via-transparent to-transparent opacity-50"></div>
                      
                      <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                          <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.4em]">DIAGNOSTIKA SYSTÉMU</span>
                        </div>
                        <h3 className="text-white/60 font-heading font-black text-2xl uppercase tracking-widest italic">
                          ČEKÁNÍ NA VÝBĚR
                        </h3>
                        <p className="text-[10px] font-mono text-smoke-white/30 leading-[1.8] uppercase tracking-widest">
                          Najeďte myší na libovolný sektor taktického kruhu na levé straně. Zobrazí se detailní parametry a instrukce pro rychlou aktivaci zvoleného systémového nastavení či hry.
                        </p>
                      </div>

                      <div className="flex justify-between items-center border-t border-white/5 pt-4 relative z-10">
                        <span className="text-[8px] font-mono text-white/10 uppercase">SYSTÉM_AKTIVNÍ: 1</span>
                        <span className="text-[8px] font-mono text-white/10 uppercase">STATUS: ČEKÁNÍ</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* BOTTOM DIAGNOSTICS STATS */}
            <div className="absolute bottom-10 left-12 right-12 flex justify-between items-center border-t border-white/10 pt-6 z-20 font-mono text-[10px] text-white/30 uppercase">
              <div className="flex gap-8">
                <span>[ STAV: SYNCHRONIZOVÁNO ]</span>
                <span>[ UŽIVATEL: AKTIVNÍ OPERATIVEC ]</span>
              </div>
              <div className="flex gap-8">
                <span className="text-mafia-gold font-bold">100% BEZPEČNÝ SYSTÉM // MMB_V3.5_HUD</span>
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
