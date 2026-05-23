"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Medal, Crosshair, Shield, Swords, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "./OptimizedImage";
import { playSound } from "../utils/audio";
import { getDailyRole } from "@/utils/dailyRoles";

interface DossierMedal {
  title: string;
  year: string;
  desc: string;
}

interface BarberProfile {
  id: string;
  name: string;
  role: string;
  image: string;
  desc: string;
  schedule: string;
  bookingLink: string;
  story?: string;
  symbol: string;
  missionFailed?: boolean;
  unlockThreshold?: number;
  rank?: {
    level: number;
    title: string;
    status?: 'promoted' | 'demoted' | 'stable' | 'demotedDesertion';
  };
}

interface OperativeModalProps {
  barber: BarberProfile | null;
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

const BARBER_DOSSIER_DATA: Record<string, {
  codename: { cs: string; en: string };
  precision: number;
  speed: number;
  style: number;
  respect: number;
  weapon: { name: string; type: string };
  secondary: { name: string; type: string };
  medals: DossierMedal[];
}> = {
  tomas: {
    codename: { cs: "HLAVA RODINY", en: "THE DON" },
    precision: 99,
    speed: 90,
    style: 96,
    respect: 98,
    weapon: { name: "Břitva Dovo Solingen 5/8", type: "Primární zbraň / Straight Razor" },
    secondary: { name: "Wahl Gold Detailer", type: "Záložní zbraň / Trimmer" },
    medals: [
      { title: "Řád Zlaté Břitvy", year: "2023", desc: "Uděleno za bezcitnou preciznost a stabilní vedení rodinného podniku." },
      { title: "Medaile za loajalitu", year: "2024", desc: "Ocenění za stoprocentní dodržování kodexu mlčení v Uherském Hradišti." }
    ]
  },
  nella: {
    codename: { cs: "MLADÁ KREV", en: "THE ENFORCER" },
    precision: 92,
    speed: 95,
    style: 94,
    respect: 50,
    weapon: { name: "Nůžky Kasho Millenium 6.0", type: "Primární zbraň / Shears" },
    secondary: { name: "Zesvětlovací štětec Kolinsky", type: "Záložní zbraň / Dye Brush" },
    medals: [
      { title: "Kříž Rychlého Růstu", year: "2025", desc: "Za bleskové osvojení tajných technik střihu a stínování." },
      { title: "Medaile Čerstvé Krve", year: "2025", desc: "Za vnesení nové kreativní energie a precizních dámských stylů do rodiny." }
    ]
  }
};

// Circular gauge component styled like a Mafia HUD dial
function HUDDial({ value, label }: { value: number; label: string }) {
  const radius = 30;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5 p-2 bg-black/40 border border-white/5 rounded-sm relative overflow-hidden group">
      {/* HUD Scanner overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mafia-gold/5 to-transparent pointer-events-none -translate-y-full group-hover:translate-y-full transition-transform duration-1000" />
      
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Faint Background Ticks */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            className="stroke-mafia-gold/10 fill-transparent"
            strokeWidth={strokeWidth}
            strokeDasharray="2, 4"
          />
          {/* Foreground Active Arc */}
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            className="stroke-mafia-gold fill-transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 4px var(--user-glow-color))" }}
          />
        </svg>
        <span className="absolute text-xs font-mono font-bold text-smoke-white tracking-tighter">{value}%</span>
      </div>
      <span className="text-[8px] font-mono tracking-[0.2em] text-mafia-gold/60 uppercase">{label}</span>
    </div>
  );
}

// Typewriter component for Dossier entries
function HUDTypewriter({ text, delay = 15 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < text.length) {
        setDisplayedText(prev => prev + text.charAt(currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [text, delay]);

  return <p className="font-mono text-xs md:text-sm text-smoke-white/80 leading-relaxed whitespace-pre-line tracking-wide">{displayedText}</p>;
}

export function OperativeModal({ barber, isOpen, onClose, lang }: OperativeModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Sound trigger
      playSound("/sounds/reload.mp3", 0.5);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!barber) return null;

  const extraData = BARBER_DOSSIER_DATA[barber.id] || {
    codename: { cs: "OPERATIVEC", en: "OPERATIVE" },
    precision: 85,
    speed: 85,
    style: 85,
    respect: 50,
    weapon: { name: "Klasické nůžky", type: "Primární zbraň" },
    secondary: { name: "Hřeben", type: "Záložní zbraň" },
    medals: []
  };

  const codenameText = lang === 'cs' ? getDailyRole(barber.id, lang) : extraData.codename.en;
  
  const handleActionClick = () => {
    playSound("/sounds/magnum.mp3", 0.4);
    window.open(barber.bookingLink, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 md:p-6 pointer-events-none">
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] bg-[#0c0c0c] border border-mafia-gold/40 shadow-[0_0_80px_rgba(0,0,0,1)] overflow-hidden rounded-sm flex flex-col md:flex-row pointer-events-auto"
            >
              {/* Scanline & Grid HUD Aesthetics */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.01)_0%,_rgba(0,0,0,0)_80%)] pointer-events-none z-0" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none z-0" />
              
              {/* Outer HUD Corner Brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-mafia-gold/40 pointer-events-none" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-mafia-gold/40 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-mafia-gold/40 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-mafia-gold/40 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-50 p-1.5 border border-mafia-gold/20 hover:border-mafia-gold bg-black/60 text-mafia-gold hover:text-white transition-all rounded-none"
              >
                <X size={16} />
              </button>

              {/* LEFT COLUMN: Dossier Photo & Identity */}
              <div className="w-full md:w-[320px] bg-black/40 border-r border-white/5 p-6 flex flex-col items-center justify-between relative z-10 flex-shrink-0">
                <div className="w-full flex flex-col items-center gap-4">
                  {/* Photo with HUD frame */}
                  <div className="relative w-44 h-44 border-2 border-mafia-gold/20 overflow-hidden bg-black/50 p-1 shadow-inner group">
                    <div className="absolute inset-0 border border-mafia-gold/5 z-20 pointer-events-none" />
                    {/* Reticle HUD decoration */}
                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-mafia-gold/60" />
                    <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-mafia-gold/60" />
                    <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-mafia-gold/60" />
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-mafia-gold/60" />
                    
                    <Image
                      src={barber.image}
                      alt={barber.name}
                      width={300}
                      height={300}
                      priority
                      className="w-full h-full object-cover filter grayscale transition-all duration-700 group-hover:filter-none"
                    />
                  </div>

                  {/* ID / Code Designation */}
                  <div className="w-full text-center space-y-1 mt-2">
                    <span className="font-mono text-[9px] text-mafia-gold/60 uppercase tracking-[0.4em]">KÓD: {barber.name.toUpperCase()} / {barber.symbol}</span>
                    <h2 className="text-3xl font-heading font-black text-smoke-white uppercase tracking-widest leading-none">{barber.name}</h2>
                    <p className="text-mafia-gold font-mono tracking-widest text-[10px] uppercase font-bold px-2 py-0.5 border border-mafia-gold/20 bg-mafia-gold/5 rounded-sm inline-block mt-2">
                      {codenameText}
                    </p>
                  </div>
                </div>

                {/* Tactical Status Information */}
                <div className="w-full space-y-3 mt-6 border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/40 uppercase tracking-wider">{lang === 'cs' ? "POZICE" : "DESIGNATION"}</span>
                    <span className="text-smoke-white uppercase tracking-widest font-bold">{barber.role}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/40 uppercase tracking-wider">{lang === 'cs' ? "ROZVRH" : "AVAILABILITY"}</span>
                    <span className="text-smoke-white uppercase tracking-widest">{barber.schedule.split('|')[0]}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/40 uppercase tracking-wider">LEVEL</span>
                    <span className="text-mafia-gold uppercase font-bold tracking-widest">
                      {barber.rank?.level ?? 0}
                    </span>
                  </div>
                </div>

                {/* Approved Red Stamp */}
                <motion.div 
                  initial={{ scale: 2, opacity: 0, rotate: -25 }}
                  animate={{ scale: 1, opacity: 0.25, rotate: -15 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                  className="absolute bottom-4 left-4 pointer-events-none select-none border-2 border-red-600 text-red-600 font-serif font-black text-sm px-2 py-0.5 rounded-sm tracking-widest uppercase"
                >
                  {lang === 'cs' ? "SCHVÁLENO" : "APPROVED"}
                </motion.div>
              </div>

              {/* RIGHT COLUMN: Dossier Dossier Details & Speedometers */}
              <div className="flex-1 flex flex-col min-h-0 relative z-10">
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar space-y-6">
                  
                  {/* Stats Speedometer Dials Section */}
                  <div>
                    <h3 className="text-xs font-mono font-bold text-mafia-gold uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                      <Crosshair size={14} />
                      {lang === 'cs' ? "TAKTIČKÉ STATISTIKY" : "TACTICAL HUD METRICS"}
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      <HUDDial value={extraData.precision} label={lang === 'cs' ? "PRECIZNOST" : "PRECISION"} />
                      <HUDDial value={extraData.speed} label={lang === 'cs' ? "RYCHLOST" : "SPEED"} />
                      <HUDDial value={extraData.style} label={lang === 'cs' ? "STYLING" : "STYLE"} />
                      <HUDDial value={extraData.respect} label={lang === 'cs' ? "RESPEKT" : "RESPECT"} />
                    </div>
                  </div>

                  {/* Biography (Dossier Text) */}
                  <div className="border-t border-white/5 pt-4">
                    <h3 className="text-xs font-mono font-bold text-mafia-gold uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                      <Shield size={14} />
                      {lang === 'cs' ? "OSOBNÍ ZÁZNAM" : "DOSSIER BRIEFING"}
                    </h3>
                    <div className="p-4 bg-black/60 border border-white/5 rounded-sm min-h-[100px]">
                      <HUDTypewriter text={barber.story || barber.desc} />
                    </div>
                  </div>

                  {/* Weapons Loadout (Tools of trade) */}
                  <div className="border-t border-white/5 pt-4">
                    <h3 className="text-xs font-mono font-bold text-mafia-gold uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                      <Swords size={14} />
                      {lang === 'cs' ? "VÝZBROJ & VYBAVENÍ" : "PRIMARY TOOLS LOADOUT"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-sm">
                        <div className="w-10 h-10 border border-mafia-gold/20 flex items-center justify-center bg-black/60 text-mafia-gold">
                          <Swords size={20} />
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-smoke-white uppercase tracking-wider font-bold">{extraData.weapon.name}</div>
                          <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest">{extraData.weapon.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-sm">
                        <div className="w-10 h-10 border border-mafia-gold/20 flex items-center justify-center bg-black/60 text-mafia-gold">
                          <Zap size={20} />
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-smoke-white uppercase tracking-wider font-bold">{extraData.secondary.name}</div>
                          <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest">{extraData.secondary.type}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Achievements/Medals */}
                  {extraData.medals && extraData.medals.length > 0 && (
                    <div className="border-t border-white/5 pt-4">
                      <h3 className="text-xs font-mono font-bold text-mafia-gold uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                        <Award size={14} />
                        {lang === 'cs' ? "BOJOVÁ VYZNAMENÁNÍ" : "TACTICAL MEDALS & CITATIONS"}
                      </h3>
                      <div className="space-y-3">
                        {extraData.medals.map((medal, i) => (
                          <div key={i} className="flex gap-3 p-3 bg-black/40 border border-white/5 rounded-sm hover:border-mafia-gold/30 transition-colors">
                            <div className="w-8 h-8 rounded-full border border-mafia-gold/40 flex items-center justify-center bg-mafia-gold/5 text-mafia-gold flex-shrink-0">
                              <Medal size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="text-[10px] font-mono text-smoke-white uppercase tracking-wider font-bold">{medal.title}</h4>
                                <span className="text-[8px] font-mono text-mafia-gold border border-mafia-gold/30 px-1 rounded-sm bg-mafia-gold/5">EST. {medal.year}</span>
                              </div>
                              <p className="text-[9px] font-mono text-white/50 uppercase tracking-widest mt-1 leading-normal">{medal.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Dossier Footer with Primary CTA */}
                <div className="p-4 border-t border-white/5 bg-black/20 flex justify-center flex-shrink-0">
                  <button
                    onClick={handleActionClick}
                    className="w-full max-w-md py-4 border-2 border-mafia-gold bg-mafia-gold/10 hover:bg-mafia-gold text-mafia-gold hover:text-mafia-black font-heading font-black tracking-[0.5em] uppercase text-sm transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.1)] hover:shadow-[0_0_30px_rgba(197,160,89,0.4)] relative overflow-hidden group/btn active:scale-[0.99]"
                  >
                    {/* Glowing pulse hover overlay */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    <span>{lang === 'cs' ? "POVOLAT DO AKCE" : "DEPLOY TO MISSION"}</span>
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
