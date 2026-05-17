"use client";

import Image from "./OptimizedImage";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { CalendarDays, Languages, Sparkles, Heart, Clover, TrendingDown, TrendingUp, Shield, Medal, Trophy, Crown, Flame } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { trackEvent } from "../utils/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "../utils/audio";
import { barbers } from "@/data/barbers";
import { 
  subscribeToUserRatings
} from "@/utils/voting";
import { 
  subscribeToGlobalXpStats, 
  addLikeToBarber, 
  hasLikedToday,
  calculateLevelFromXp,
  getCzechRankFromLevel,
  getEnglishRankFromLevel,
  GlobalBarberStats
} from "@/utils/barberXp";

export interface BarberProfile {
  id: string;
  name: string;
  role: string;
  image: string;
  desc: string;
  schedule: string;
  bookingLink: string;
  staticDesc?: string;
  stats?: string[];
  story?: string;
  medals?: string[];
  motto?: string;
  specializations?: string[];
  favorites?: string;
  isHidden?: boolean;
  symbol: string;
  rank?: {
    level: number;
    title: string;
    status?: 'promoted' | 'demoted' | 'stable' | 'demotedDesertion';
    nextRankIn?: string;
  };
}

const JUNE_HISTORY_DIALOGUES = [
  { tomas: "Tak už mám vlastní uklízeče, zahradníky, elektrikáře a další lidi. Začínám to hezky rozjíždět… ale v pohodě, jsem rád, že si toho zatím moc nevšímají.", nella: "Proč to neděláš jako všichni ostatní? Všude to sdílet, ukazovat, chlubit se…" },
  { tomas: "Mám rád ten okamžik překvapení, až všichni zjistí, co se celou dobu budovalo potichu.", nella: "Ty jsi fakt divný případ. Většina lidí potřebuje obdiv hned." },
  { tomas: "A právě proto většina zůstane jen u řečí. Já radši buduju v tichu. Než někdo stihne pochopit plán, já už jsem o tři kroky dál.", nella: "Takže tajný boss mode jo?" },
  { tomas: "Spíš klid před bouří. Nejlepší pocit je, když tě podcení… a pak jim dojde, že ses celou dobu díval jinam než oni.", nella: "Ty si jedeš svůj film." },
  { tomas: "Ne film. Vizi. A ta nepotřebuje potlesk každý druhý den.", nella: "Víš… já jsem si vždycky myslela, že kadeřníci jsou jiní." },
  { tomas: "Nevěř báchorkám. Každá doba má svoje. Já se zabývám jinýma věcma…", nella: "A jakýma?" },
  { tomas: "Podnikatelskýma.", nella: "Ty mě někdy děsíš tím klidem." },
  { tomas: "Protože nejvíc hlučí ti, co nic nemají. Ti nejnebezpečnější většinou mluví potichu.", nella: "Ty fakt budeš jiné krve…" },
  { tomas: "To musíme ještě ověřit.", nella: "A jak se tohle ověřuje?" },
  { tomas: "Časem. Tlakem. A tím, co člověk udělá, když přijde chaos.", nella: "Ty odpovídáš jak mafián z filmu." },
  { tomas: "Možná proto, že většina lidí dnes hraje komedii místo vlastního života.", nella: "A ty hraješ co?" },
  { tomas: "Nic nehraju. Jen vím, kam jdu. To lidi mate nejvíc.", nella: "Víš, co je na tobě nejhorší?" },
  { tomas: "Povídej.", nella: "Že ti to člověk skoro věří." },
  { tomas: "„Skoro“ je začátek problémů, Nello.", nella: "A konec čeho?" },
  { tomas: "Klidného života.", nella: "..." }
];

const JUNE_HISTORY_DIALOGUES_EN = [
  { tomas: "I already have my own cleaners, gardeners, electricians, and others. I'm starting to move things along... but it's fine, I'm glad they haven't noticed much yet.", nella: "Why don't you do it like everyone else? Sharing it everywhere, showing off, bragging..." },
  { tomas: "I like the element of surprise, when everyone finally realizes what's been building in silence all this time.", nella: "You're a strange case. Most people need admiration immediately." },
  { tomas: "And that's why most people stay at just talk. I'd rather build in silence. Before anyone can grasp the plan, I'm already three steps ahead.", nella: "So, secret boss mode, huh?" },
  { tomas: "More like the calm before the storm. The best feeling is when they underestimate you... and then they realize you were looking elsewhere the whole time.", nella: "You're living your own movie." },
  { tomas: "Not a movie. A vision. And that doesn't need applause every other day.", nella: "You know... I always thought barbers were different." },
  { tomas: "Don't believe the stories. Every era has its own. I'm dealing with other things...", nella: "Like what?" },
  { tomas: "Business things.", nella: "You sometimes scare me with that calmness." },
  { tomas: "Because those with nothing make the most noise. The most dangerous ones usually speak softly.", nella: "You really must be of a different blood..." },
  { tomas: "We'll have to verify that.", nella: "And how is that verified?" },
  { tomas: "With time. With pressure. And by what a person does when chaos arrives.", nella: "You answer like a movie mobster." },
  { tomas: "Maybe because most people today play a comedy instead of their own life.", nella: "And what are you playing?" },
  { tomas: "I'm not playing anything. I just know where I'm going. That's what confuses people the most.", nella: "You know what's the worst thing about you?" },
  { tomas: "Tell me.", nella: "That one almost believes you." },
  { tomas: "“Almost” is the beginning of problems, Nella.", nella: "And the end of what?" },
  { tomas: "A peaceful life.", nella: "..." }
];

const MAY_HISTORY_DIALOGUES = [
  { tomas: "Ten den se nezapsal kvůli byznysu. Ne kvůli střihu. Ani kvůli penězům. Zapsal se kvůli návratu.", nella: "..." },
  { tomas: "Tak hele… zase zpátky. Dvakrát ven, jednou sama… a pořád stojíš tady.", nella: "Jen jsem chtěla zjistit, jestli to tu ještě žije." },
  { tomas: "Žije. Jakž takž. Dobří holubi se vracejí.", nella: "Ty si to fakt pamatuješ?" },
  { tomas: "Pamatuju si lidi, co odejdou.", nella: "Mezitím jsem tě prý trochu roznesla." },
  { tomas: "Slyšel jsem. V pohodě. Lidi mluví. Čas jim to nevezme.", nella: "A stejně jsem tady." },
  { tomas: "Jo. To je přesně ten moment, co si pamatuješ.", nella: "Takže… kolik mám proher?" },
  { tomas: "Nevím přesně. Ale historie si stejně zapisuje jen návraty.", nella: "Fajn." },
  { tomas: "Tady se nehraje na skóre. Tady se buď vrátíš… nebo zmizíš.", nella: "..." },
  { tomas: "A tak se to stalo. Bez fanfár. Bez svědků. Jen jedny dveře, které se znovu otevřely.", nella: "..." },
  { tomas: "A jeden den, který už nikdo nevymaže: 7. 5. 2026 – den, kdy se někdo vrátil zpátky do hry.", nella: "..." }
];

const isJune2026_Dialogue = new Date() >= new Date(2026, 5, 1);
const BARBER_DIALOGUES = isJune2026_Dialogue ? JUNE_HISTORY_DIALOGUES : MAY_HISTORY_DIALOGUES;
const BARBER_DIALOGUES_EN = isJune2026_Dialogue ? JUNE_HISTORY_DIALOGUES_EN : MAY_HISTORY_DIALOGUES;

const TOMAS_QUOTES_EN = [
  "Divide et impera.",
  "Vires acquirit eundo.",
  "Memento mori.",
  "Labor omnia vincit.",
  "I'm teaching you humility.\nTowards customers... and life.",
  "You might feel you know everything.\nThat you're experienced.\nBut the truth is elsewhere.",
  "You know almost nothing yet.\nAnd that's okay.\nBecause you have a chance.",
  "Don't waste it. Work hard. Train.\nYou have the conditions here.",
  "One more thing...\nDon't ask for big money\nuntil you've mastered everything.",
  "Experience cannot be bypassed.\nYou have to earn it.",
  "Don't rely on others' wisdom.\nMost people just talk.\nYou must do."
];



// Barbers data moved to @/data/barbers.ts

export const MilitaryInsignia = ({ level, color = "currentColor", size = 36 }: { level: number, color?: string, size?: number }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="overflow-visible" style={{ color }}>
      <defs>
        <filter id="insigniaGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g filter="url(#insigniaGlow)">
        {/* Level 0: FOUNDATION */}
        {level === 0 && (
          <motion.circle 
            cx="12" cy="12" r="4" 
            fill="none" stroke="currentColor" 
            strokeWidth="1.5" strokeDasharray="1 3"
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="opacity-20"
          />
        )}

        {/* Levels 1-6: REFINED TACTICAL CHEVRONS (Lower Ranks) */}
        {level >= 1 && level <= 6 && (
          <g>
            {/* Standard Chevrons (V-Shapes) */}
            {level >= 1 && <path d="M4 10.5 L12 14.5 L20 10.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
            {level >= 2 && <path d="M4 7.5 L12 11.5 L20 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
            {level >= 3 && <path d="M4 4.5 L12 8.5 L20 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
            
            {/* Rockers (Curved Arcs at Bottom - Inverted style) - Flatter radii for authentic look */}
            {level >= 4 && <path d="M5 14 A 25 25 0 0 0 19 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />}
            {level >= 5 && <path d="M6 16.5 A 22 22 0 0 0 18 16.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />}
            {level >= 6 && <path d="M7 19 A 20 20 0 0 0 17 19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />}
            
            {/* Precision Detail (Inner line) */}
            <path d="M12 8.5 L12 11.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-30" />
          </g>
        )}

        {/* Levels 7-10: HIGH RANK COMMAND (Stars only) */}
        {level >= 7 && (
          <g>
            {/* Level 7: Single Central Star */}
            {level === 7 && (
              <motion.path 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                d="M12 4 L13.5 9 L18.5 9 L14.5 12 L16 17 L12 14.5 L8 17 L9.5 12 L5.5 9 L10.5 9 Z" 
                fill="currentColor" 
              />
            )}

            {/* Level 8: Dual Horizontal Stars */}
            {level === 8 && (
              <g>
                <motion.path 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: -5, opacity: 1 }}
                  d="M12 6 L13.5 11 L18.5 11 L14.5 14 L16 19 L12 16.5 L8 19 L9.5 14 L5.5 11 L10.5 11 Z" 
                  fill="currentColor" 
                  className="scale-75 origin-center"
                />
                <motion.path 
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 5, opacity: 1 }}
                  d="M12 6 L13.5 11 L18.5 11 L14.5 14 L16 19 L12 16.5 L8 19 L9.5 14 L5.5 11 L10.5 11 Z" 
                  fill="currentColor" 
                  className="scale-75 origin-center"
                />
              </g>
            )}

            {/* Level 9: Triple Star Formation (Triangle) */}
            {level === 9 && (
              <g>
                <motion.path 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: -4, opacity: 1 }}
                  d="M12 4 L13.5 9 L18.5 9 L14.5 12 L16 17 L12 14.5 L8 17 L9.5 12 L5.5 9 L10.5 9 Z" 
                  fill="currentColor" 
                  className="scale-60 origin-center"
                />
                <motion.path 
                  initial={{ x: -10, y: 10, opacity: 0 }}
                  animate={{ x: -6, y: 4, opacity: 1 }}
                  d="M12 4 L13.5 9 L18.5 9 L14.5 12 L16 17 L12 14.5 L8 17 L9.5 12 L5.5 9 L10.5 9 Z" 
                  fill="currentColor" 
                  className="scale-60 origin-center"
                />
                <motion.path 
                  initial={{ x: 10, y: 10, opacity: 0 }}
                  animate={{ x: 6, y: 4, opacity: 1 }}
                  d="M12 4 L13.5 9 L18.5 9 L14.5 12 L16 17 L12 14.5 L8 17 L9.5 12 L5.5 9 L10.5 9 Z" 
                  fill="currentColor" 
                  className="scale-60 origin-center"
                />
                {/* Tactical Ring */}
                <motion.circle 
                  cx="12" cy="11" r="9" 
                  fill="none" stroke="currentColor" 
                  strokeWidth="0.5" strokeDasharray="2 2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="opacity-40"
                />
              </g>
            )}

            {/* Level 10: ELITE MARSHAL / AUDITED BOSS (Central focal point) */}
            {level === 10 && (
              <g>
                <motion.path
                  d="M12 2 L20 10 L12 22 L4 10 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.path
                  d="M12 5 L17 10 L12 17 L7 10 Z"
                  fill="currentColor"
                  className="opacity-30"
                />
                {/* Rotating Inner Star */}
                <motion.path 
                  d="M12 7 L13 9 L15 9 L13.5 10.5 L14 12.5 L12 11.5 L10 12.5 L10.5 10.5 L9 9 L11 9 Z" 
                  fill="currentColor"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </g>
            )}

            {/* Level 11: OFICIÁLNÍ KRÁL FADEU (Tactical Crown & Crest) */}
            {level === 11 && (
              <g>
                <motion.path
                  d="M12 2 L20 6 L18 16 L12 22 L6 16 L4 6 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="opacity-60"
                />
                {/* Crown shape */}
                <motion.path
                  d="M7 14 L9 9 L12 12 L15 9 L17 14 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ y: [0, -1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <circle cx="12" cy="7" r="1.5" fill="currentColor" />
                <circle cx="7" cy="14" r="1" fill="currentColor" />
                <circle cx="17" cy="14" r="1" fill="currentColor" />
              </g>
            )}

            {/* Level 12: ŽIVOUCÍ LEGENDA (Double Overlapping Rotating Seals) */}
            {level === 12 && (
              <g>
                <motion.path
                  d="M12 2 L22 12 L12 22 L2 12 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  animate={{ rotate: 90 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                  d="M12 2 L22 12 L12 22 L2 12 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  animate={{ rotate: -90 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
                {/* Cross of Honor */}
                <motion.path
                  d="M12 7 L12 17 M7 12 L17 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              </g>
            )}

            {/* Level 13: CEO REALITY (Ultimate Grand Badge & Stars) */}
            {level === 13 && (
              <g>
                {/* Outer Rotating Tactical Dashed Circle */}
                <motion.circle 
                  cx="12" cy="12" r="11" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  strokeDasharray="4 2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                {/* Grand Diamond Shield */}
                <path
                  d="M12 3 L21 12 L12 21 L3 12 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                {/* 3 Central Stars */}
                <g className="scale-75 origin-center translate-x-[3px] translate-y-[3px]">
                  <motion.path 
                    d="M12 5 L13 8 L16 8 L13.5 10 L14 13 L12 11 L10 13 L10.5 10 L8 8 L11 8 Z" 
                    fill="currentColor"
                    animate={{ scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <path d="M7 11 L8 13 L10 13 L8.5 14.5 L9 16.5 L7 15 L5 16.5 L5.5 14.5 L4 13 L6 13 Z" fill="currentColor" className="opacity-75" />
                  <path d="M17 11 L18 13 L20 13 L18.5 14.5 L19 16.5 L17 15 L15 16.5 L15.5 14.5 L14 13 L16 13 Z" fill="currentColor" className="opacity-75" />
                </g>
              </g>
            )}
          </g>
        )}
      </g>
    </svg>
  );
};

const getVocative = (name: string, lang: string) => {
  if (!name) return "";
  const n = name.trim().toUpperCase();
  if (lang !== 'cs') return name;

  // Basic Czech vocative heuristics
  if (n.endsWith('A')) return n.slice(0, -1) + 'O';
  if (n.endsWith('EK')) return n.slice(0, -2) + 'KU';
  if (n.endsWith('ÍK')) return n.slice(0, -2) + 'ÍKU';
  if (n.endsWith('US')) return n.slice(0, -2) + 'E';
  if (n.endsWith('ES')) return n.slice(0, -2) + 'E';
  if (n.endsWith('O')) return n;
  if (n.endsWith('I') || n.endsWith('Í')) return n;
  if (n.endsWith('E') || n.endsWith('Ě')) return n;
  
  // Soft consonants
  if (['Š', 'Ž', 'Č', 'Ř', 'C', 'J', 'Ď', 'Ť', 'Ň'].includes(n.slice(-1))) return n + 'I';
  // Hard/Velar consonants
  if (n.endsWith('H') || n.endsWith('CH') || n.endsWith('K') || n.endsWith('G')) return n + 'U';
  // Others
  if (['S', 'Z', 'T', 'D', 'M', 'B', 'P', 'V', 'N', 'R', 'L'].includes(n.slice(-1))) return n + 'E';
  
  return n;
};

const BarberRanking = ({ 
  level, 
  rankTitle, 
  lang, 
  id 
}: { 
  level: number, 
  rankTitle: string, 
  lang: string, 
  id: string 
}) => {
  const [isBloodMode, setIsBloodMode] = useState(false);
  const [isNoirMode, setIsNoirMode] = useState(false);

  useEffect(() => {
    const checkThemes = () => {
      const html = document.documentElement;
      setIsBloodMode(html.classList.contains('theme-blood'));
      setIsNoirMode(html.classList.contains('noir-mode'));
    };
    checkThemes();
    window.addEventListener('mmbarber-theme-update', checkThemes);
    
    return () => {
      window.removeEventListener('mmbarber-theme-update', checkThemes);
    };
  }, [id]);

  const statusColor = isBloodMode 
    ? 'text-mafia-blood' 
    : (isNoirMode ? 'text-white' : 'text-mafia-gold');

  const barColor = isBloodMode 
    ? 'bg-mafia-blood' 
    : (isNoirMode ? 'bg-white' : 'bg-mafia-gold');

  const insigniaColor = isBloodMode 
    ? 'var(--color-mafia-blood)' 
    : (isNoirMode ? '#ffffff' : 'var(--color-mafia-gold)');

  return (
    <div className={`flex flex-col items-center gap-2 group/rank min-w-[160px] ${statusColor}`}>
      <div className="flex items-center gap-2.5">
        <MilitaryInsignia level={level} color={insigniaColor} size={42} />
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 min-h-[18px] min-w-[120px] justify-center">
            <AnimatePresence mode="wait">
              <motion.span 
                key={rankTitle}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[11px] font-black tracking-[0.05em] uppercase leading-tight text-center"
              >
                {rankTitle}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex gap-0.5 mt-2 max-w-[200px] justify-center flex-wrap">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => (
              <div 
                key={i} 
                className={`h-[3px] w-2 md:w-2.5 rounded-full transition-all duration-700 ${
                  i <= level ? `${barColor} shadow-[0_0_10px_rgba(var(--color-mafia-gold-rgb),0.7)]` : "bg-white/10"
                }`} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MissionLoading = ({ isHovered, graphicsTier }: { isHovered: boolean, graphicsTier?: string }) => (
  <AnimatePresence>
    {isHovered && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {/* Scanning Line */}
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-full h-1/3 bg-gradient-to-b from-transparent via-mafia-gold/40 to-transparent z-10"
        />
        
        {/* Binary/Data Overlay - Only on high tiers */}
        {graphicsTier !== 'low' && graphicsTier !== 'medium' && (
          <div className="absolute inset-0 flex flex-wrap content-start opacity-20 text-[6px] font-mono leading-none p-1 gap-1">
            {Array(20).fill(0).map((_, i) => (
              <motion.span 
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: Math.random() * 2 + 1, repeat: Infinity }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
              </motion.span>
            ))}
          </div>
        )}

        {/* Glitch Overlay - Only on high tiers */}
        {graphicsTier !== 'low' && graphicsTier !== 'medium' && (
          <motion.div 
            animate={{ opacity: [0, 0.1, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 5 }}
            className="absolute inset-0 bg-white mix-blend-overlay"
          />
        )}
      </motion.div>
    )}
  </AnimatePresence>
);

function BarberCard({ 
  barber, 
  isActive, 
  dialogueIndex, 
  lang, 
  t, 
  playCardSound,
  onBook,
  onHoverChange,
  activeSpeaker,
  graphicsTier,
  globalStats,
  likedMap,
  onLike
}: { 
  barber: BarberProfile & { isHidden?: boolean }, 
  isActive: boolean, 
  dialogueIndex: number, 
  lang: string, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any, 
  playCardSound: () => void,
  onBook: () => void,
  onHoverChange?: (hovered: boolean) => void,
  activeSpeaker: string | null,
  graphicsTier?: string,
  globalStats: GlobalBarberStats,
  likedMap: Record<string, boolean>,
  onLike: (barberId: string) => void
}) {
  const [isHovered, setIsHovered] = useState(false);

  const stats = globalStats[barber.id] || { xp: 0, likes: 0 };
  const globalXp = stats.xp;
  const globalLevel = calculateLevelFromXp(globalXp);
  const globalRank = lang === 'cs' 
    ? getCzechRankFromLevel(globalLevel, barber.id === 'nella') 
    : getEnglishRankFromLevel(globalLevel);
  const alreadyLiked = likedMap[barber.id] || false;

  const handleMouseEnter = () => {
    setIsHovered(true);
    playCardSound();
    if (onHoverChange) onHoverChange(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHoverChange) onHoverChange(false);
  };

  const isHidden = barber.isHidden;
  const barberDisplayName = barber.name;

  return (
    <>
      {/* MOBILE VERSION: Simple, Static, No effects */}
      <div className="xl:hidden w-full max-w-[340px] h-auto min-h-[420px] bg-[#0c0c0c] border-2 border-mafia-gold/20 p-5 rounded-2xl flex flex-col items-center gap-4 shadow-2xl overflow-hidden relative">
        <div className="w-36 h-36 border-2 border-mafia-gold/20 overflow-hidden bg-black/40 flex-shrink-0 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
          {barber.image === "question-mark" ? (
            <div className="text-mafia-gold/30 font-heading text-9xl animate-pulse italic drop-shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.2)]">?</div>
          ) : (
            <Image 
              src={barber.image} 
              alt={barber.name} 
              width={192} 
              height={192} 
              priority 
              quality={100}
              loading="eager"
              className="w-full h-full object-cover" 
            />
          )}
        </div>
        
        <div className="text-center space-y-1 relative w-full flex flex-col items-center">
          <h3 className="text-3xl font-heading font-black uppercase text-mafia-gold tracking-widest leading-none relative">
            {barberDisplayName}
          </h3>
          <span className="text-[10px] font-mono uppercase text-white/30 tracking-widest block relative">
            {barber.role}
          </span>
          <div className="mt-4 relative flex justify-center">
            <BarberRanking 
              level={globalLevel} 
              rankTitle={globalRank} 
              lang={lang} 
              id={barber.id} 
            />
          </div>
        </div>

        {!barber.isHidden && (
          <button 
            onClick={() => {
              trackEvent("cta_barber_booking_mobile", { barber: barber.name });
              onBook();
            }}
            className="w-full py-5 bg-mafia-gold text-mafia-black font-heading font-black tracking-[0.3em] uppercase text-sm border-2 border-mafia-gold hover:bg-white transition-all z-10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          >
            {lang === 'cs' ? "REZERVACE" : "BOOKING"}
          </button>
        )}

        <div className="w-full flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 mt-auto px-2">
          {barber.specializations?.map((spec, i) => (
            <div key={i} className="flex items-center gap-3 relative">
              <span className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-[0.2em] whitespace-nowrap font-bold">
                {spec}
              </span>
              {isHidden && (
                <div className="absolute inset-0 bg-mafia-black border border-mafia-gold/10 z-10" />
              )}
              {i < (barber.specializations?.length || 0) - 1 && (
                <div className="w-1 h-1 rounded-full bg-mafia-gold/20" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP VERSION: The full Noir experience */}
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="hidden xl:block barber-card relative xl:perspective-2000 w-[340px] flex-shrink-0 h-[640px] z-10"
      >
        <motion.div
          animate={{ rotateY: isHovered ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {/* Front Side */}
          <motion.div 
            animate={{ 
              opacity: isHovered ? 0 : 1,
              visibility: isHovered ? "hidden" : "visible"
            }}
            transition={{ 
              opacity: { duration: 0.1, delay: isHovered ? 0.35 : 0 },
              visibility: { delay: isHovered ? 0.4 : 0 }
            }}
            className={`absolute inset-0 bg-[#0c0c0c] border-2 p-8 flex flex-col items-center justify-between rounded-2xl shadow-[0_45px_90px_-20px_rgba(0,0,0,1)] ${
              graphicsTier === 'low' ? 'transition-none' : 'transition-all duration-300'
            } ${
              isActive ? "border-mafia-gold shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.3)]" : "border-mafia-gold/20"
            }`}
            style={{ 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(1px)",
              zIndex: isHovered ? 5 : 10
            }}
          >
            <div className="w-full flex justify-between items-start">
              <div className="flex flex-col items-center gap-0 text-mafia-gold">
                  <span className="font-heading font-black text-4xl leading-none card-symbol-front">
                    {barber.symbol}
                  </span>
                  <div className="mt-1">
                    {barber.symbol === 'A' ? (
                      <Clover size={24} strokeWidth={3} className="opacity-80" />
                    ) : (
                      <Heart size={24} strokeWidth={3} fill="currentColor" className="opacity-80" />
                    )}
                  </div>
              </div>
              <div className="flex-1 flex flex-col items-center text-center relative">
                  <h3 className="text-4xl font-heading font-black uppercase text-mafia-gold tracking-widest relative">
                    {barberDisplayName}
                    {isHidden && (
                      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="absolute inset-0 bg-mafia-black border border-mafia-gold/20 z-20 origin-left" />
                    )}
                  </h3>
                  <span className="text-[10px] font-mono uppercase text-white/30 tracking-widest relative block">
                    {barber.role}
                  </span>
                  <div className="mt-6 relative flex justify-center">
                    <BarberRanking 
                      level={globalLevel} 
                      rankTitle={globalRank} 
                      lang={lang} 
                      id={barber.id} 
                    />
                    {isHidden && (
                      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="absolute inset-0 bg-mafia-black/80 border border-mafia-gold/10 z-20 origin-left scale-y-75" />
                    )}
                  </div>
              </div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-start text-center px-4 pt-10">
              {/* Dialogue Bubble - Increased space and added background for clarity */}
              <div className="mb-10 relative w-full min-h-[160px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {activeSpeaker === (barber.name === 'Tomáš' || barber.name === 'Tomas' ? 'tomas' : 'nella') && (
                      <motion.div
                        key={`${barber.name}-${dialogueIndex}`}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-mafia-gold barber-dialogue-text font-heading italic text-xs md:text-[14px] tracking-[0.15em] px-6 py-4 leading-relaxed uppercase bg-mafia-gold/5 border border-mafia-gold/10 rounded-lg backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                      >
                        <span className="opacity-40 block mb-2 text-[8px] font-mono tracking-[0.5em]">
                          {lang === 'cs' ? "— ZÁZNAM KOMUNIKACE —" : "— MESSAGE_LOG —"}
                        </span>
                        {barber.story}
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>

              <div className="space-y-2 w-full mt-auto">
                  {barber.specializations?.map((spec, i) => (
                    <div key={i} className="text-[9px] font-mono text-mafia-gold/40 border border-mafia-gold/5 py-1.5 uppercase tracking-[0.3em] relative">
                      {spec}
                      {isHidden && (
                        <div className="absolute inset-0 bg-mafia-black/80 z-10" />
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="w-full pt-6 border-t border-mafia-gold/10 relative">
              <div className="flex items-center justify-center gap-3 text-white/40 mb-2">
                  <CalendarDays size={14} className="text-mafia-gold/60" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em]">{lang === 'cs' ? "OPERATIVNÍ DOBA" : "OPERATIONAL HOURS"}</span>
              </div>
              <p className="text-[11px] font-mono text-white/60 text-center tracking-widest uppercase">{barber.schedule}</p>
              {isHidden && (
                <div className="absolute inset-0 bg-mafia-black border-t border-mafia-gold/20 z-10 flex items-center justify-center text-[8px] tracking-[0.3em] text-mafia-gold/40"></div>
              )}
            </div>

          </motion.div>

          {/* Back Side (Booking) */}
          <motion.div 
            animate={{ 
              opacity: isHovered ? 1 : 0,
              visibility: isHovered ? "visible" : "hidden"
            }}
            transition={{ 
              opacity: { duration: 0.1, delay: isHovered ? 0.35 : 0 },
              visibility: { delay: isHovered ? 0.4 : 0 }
            }}
            onClick={() => {
              if (isHidden) return;
              trackEvent("cta_barber_booking_card_click", { barber: barber.name });
              onBook();
            }}
            className={`absolute inset-0 bg-[#0c0c0c] border-2 p-8 flex flex-col items-center transition-all duration-500 rounded-2xl shadow-[0_45px_90px_-20px_rgba(0,0,0,1)] overflow-hidden cursor-pointer ${
              isHovered ? "border-mafia-gold pointer-events-auto" : "border-mafia-gold/40 pointer-events-none"
            }`}
            style={{ 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(1px)",
              zIndex: isHovered ? 10 : 5
            }}
          >

            
            <div className="flex-grow w-full flex flex-col items-center justify-start relative z-10 pt-16">
                {barber.name === "Nella" ? (
                  <>
                    <div className={`relative w-56 h-56 rounded-none overflow-hidden transition-all duration-1000 mb-8 flex items-center justify-center ${
                        isHovered ? "shadow-[0_0_40px_rgba(var(--color-mafia-gold-rgb),0.2)]" : ""
                    }`}>
                        <motion.div animate={{ scale: isHovered ? 1.1 : 1 }} transition={{ duration: 1.2 }}>
                          <Image src={barber.image} alt={barber.name} width={300} height={300} priority quality={100} loading="eager" className="w-full h-full object-cover grayscale-[0.2]" />
                        </motion.div>
                    </div>
                    <div className="text-center px-6 mt-4">
                      <h3 className="text-2xl md:text-3xl font-heading font-black uppercase tracking-[0.1em] text-mafia-gold italic leading-tight drop-shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.3)]">
                        {barber.motto}
                      </h3>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`relative w-56 h-56 rounded-none overflow-hidden transition-all duration-1000 mb-8 flex items-center justify-center ${
                        isHovered ? "shadow-[0_0_40px_rgba(var(--color-mafia-gold-rgb),0.2)]" : ""
                    }`}>
                        {barber.image === "question-mark" ? (
                          <div className="text-mafia-gold/30 font-heading text-[12rem] animate-pulse italic drop-shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.3)]">?</div>
                        ) : (
                          <motion.div animate={{ scale: isHovered ? 1.1 : 1 }} transition={{ duration: 1.2 }}>
                            <Image src={barber.image} alt={barber.name} width={300} height={300} priority quality={100} loading="eager" className="w-full h-full object-cover grayscale-[0.2]" />
                          </motion.div>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-1 mb-6 text-center relative">
                        {barber.motto && (
                          <div className="mt-8 text-2xl font-heading text-mafia-gold/90 tracking-[0.1em] uppercase font-black italic relative">
                            {barber.motto}
                            {isHidden && (
                              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="absolute inset-0 bg-mafia-black/80 border border-mafia-gold/10 z-20 origin-left scale-y-75" />
                            )}
                          </div>
                        )}
                    </div>
                  </>
                )}
            </div>

              {!isHidden && (
                <div className="w-full flex justify-center relative z-[60] mt-auto pb-10">
                    <div className="w-full max-w-[260px] h-16 relative flex items-center justify-center border-2 border-mafia-gold bg-mafia-black text-mafia-gold font-heading uppercase tracking-[0.6em] font-black text-lg overflow-hidden group">
                        <MissionLoading isHovered={isHovered} graphicsTier={graphicsTier} />
                        <span className="relative z-20 transition-all duration-300 group-hover:tracking-[0.8em]">
                          {lang === 'cs' ? "REZERVACE" : "BOOKING"}
                        </span>
                    </div>
                </div>
              )}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

const REEL_REPEAT = 10; 

function SlotReel({
  isRandomizing,
  isDecided,
  winnerIndex,
  revealedBarbers,
}: {
  isRandomizing: boolean;
  isDecided: boolean;
  winnerIndex: number;
  revealedBarbers: string[];
}) {
  const [reelH, setReelH] = useState(260);

  useEffect(() => {
    const updateH = () => setReelH(window.innerWidth < 768 ? 180 : 260);
    updateH();
    window.addEventListener('resize', updateH);
    return () => window.removeEventListener('resize', updateH);
  }, []);

  const stripRef = useRef<HTMLDivElement>(null);
  const strip = Array(REEL_REPEAT).fill(barbers).flat();

  const availableCount = barbers.length;

  useEffect(() => {
    if (!stripRef.current || availableCount === 0) return;
    if (isRandomizing) {
      stripRef.current.style.transition = "none";
      stripRef.current.style.transform = `translateY(0px)`;
    } else if (isDecided) {
      const targetPos = (7 * availableCount + winnerIndex) * reelH;
      stripRef.current.style.transition = "transform 1.5s cubic-bezier(0.15, 0, 0.15, 1)";
      stripRef.current.style.transform = `translateY(-${targetPos}px)`;
    }
  }, [isRandomizing, isDecided, winnerIndex, availableCount, reelH]);

  return (
    <div className="relative w-full h-full bg-[#080808] border-y border-mafia-gold/20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none z-20" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-mafia-gold/30 z-20 pointer-events-none" />
      <div ref={stripRef} className="flex flex-col" style={{ willChange: 'transform' }}>
        {strip.map((barber, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')]"
            style={{ height: reelH }}
          >
            <Image
              src={barber.image}
              alt={barber.name}
              width={200}
              height={200}
              priority
              className="object-cover barber-photo-img"
              style={{
                width: '180px',
                height: '180px',
                filter: isDecided && i === 7 * (strip.length / REEL_REPEAT) + winnerIndex
                  ? 'none'
                  : 'grayscale(1) brightness(0.6)',
                transition: 'filter 0.8s ease',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChairWithCard({ 
  barber, 
  activeSpeaker, 
  dialogueIndex, 
  lang, 
  t, 
  playCardSound, 
  side,
  graphicsTier,
  globalStats,
  likedMap,
  onLike
}: { 
  barber: BarberProfile & { isHidden?: boolean }, 
  activeSpeaker: string | null, 
  dialogueIndex: number, 
  lang: string, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: Record<string, any>, 
  playCardSound: () => void,
  side: 'left' | 'right',
  graphicsTier: string,
  globalStats: GlobalBarberStats,
  likedMap: Record<string, boolean>,
  onLike: (barberId: string) => void
}) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isSitting, setIsSitting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCardHovered) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleBook = () => {
    if (isSitting) return;
    setIsSitting(true);
    playSound("/sounds/leather.mp3", 0.6); 
    setTimeout(() => {
      window.open(barber.bookingLink, "_blank", "noopener,noreferrer");
      setTimeout(() => setIsSitting(false), 500); 
    }, 600); 
  };

  const [clientNickname, setClientNickname] = useState<string | null>(null);

  useEffect(() => {
    const { getUserRatingsData } = require("@/utils/voting");
    const data = getUserRatingsData();
    if (data && data.clientNickname) setClientNickname(data.clientNickname);
  }, []);

  const vocativeName = getVocative(clientNickname || "", lang);

  const chairGreeting = useMemo(() => {
    const isTomas = barber.name === 'Tomáš' || barber.name === 'Tomas';
    const barberKey = isTomas ? 'tomas' : 'nella';
    const greetings = t.operatives?.barbers?.[barberKey]?.chairGreetings;
    
    if (greetings && Array.isArray(greetings) && greetings.length > 0) {
      const randomIndex = Math.floor(Math.random() * greetings.length);
      let greeting = greetings[randomIndex];
      
      // Personalize if possible
      if (vocativeName) {
        const personalAdditions = lang === 'cs' 
          ? [`, ${vocativeName}!`, `... nazdar ${vocativeName}.`, `. Čekáme na tebe, ${vocativeName}.`] 
          : [`, ${vocativeName}!`, `... greetings, ${vocativeName}.`, `. We've been waiting, ${vocativeName}.`];
        greeting += personalAdditions[Math.floor(Math.random() * personalAdditions.length)];
      }

      return greeting;
    }
    
    // Fallbacks
    if (side === 'right') {
      return vocativeName 
        ? (lang === 'cs' ? `Pane ${vocativeName}, Vaše místo...` : `Sir ${vocativeName}, your seat...`)
        : (lang === 'cs' ? "Pane, Vaše místo..." : "Sir, your seat...");
    }
    return vocativeName 
      ? (lang === 'cs' ? `${vocativeName}, tvoje místo je ready.` : `${vocativeName}, your seat is ready.`)
      : (lang === 'cs' ? "Tvoje místo je připravené." : "Your seat is ready.");
  }, [t, barber.name, lang, side, vocativeName]);

  const targetScale = isSitting ? 1.0 : (isCardHovered ? 1.05 : 1);
  const filterStr = isCardHovered 
    ? "brightness(1.2) contrast(1.15) drop-shadow(0 25px 25px rgba(0,0,0,0.9))" 
    : "brightness(0.88) drop-shadow(0 0px 0px rgba(0,0,0,0))";
  
  const ySink = isSitting ? 25 : 0;
  const actualY = isSitting ? ySink : (isCardHovered ? mousePos.y * -20 : 0);
  const actualX = isCardHovered ? mousePos.x * -20 : 0;
  const parallaxBgX = isCardHovered ? mousePos.x * 10 : 0;

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`flex flex-col xl:flex-row items-center justify-center gap-4 xl:gap-8 ${side === 'right' ? 'xl:flex-row-reverse' : ''}`}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          y: actualY,
          x: actualX,
          opacity: isSitting || isCardHovered ? 1 : 0.7,
          scale: targetScale,
          filter: filterStr,
        }}
        transition={{ 
          y: isSitting ? { type: "spring", stiffness: 100, damping: 10 } : { type: "spring", stiffness: 150, damping: 15 },
          x: { type: "spring", stiffness: 150, damping: 15 },
          opacity: { duration: (graphicsTier === 'low') ? 0 : 0.5 },
          scale: { duration: isSitting ? 0.4 : 0.6, ease: "easeOut" }
        }}
        className="hidden xl:block w-[380px] h-[480px] relative z-0"
        style={{ isolation: 'isolate', transformOrigin: 'center center' }}
      >
        {/* Floating text above the chair on hover */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isCardHovered || isSitting ? 1 : 0,
            y: isCardHovered || isSitting ? -20 : 0
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute -top-12 left-0 w-full flex flex-row items-center justify-center z-50 pointer-events-none"
        >
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-mafia-gold/30 mr-4"></div>
          <p className="font-heading text-lg text-mafia-gold italic tracking-[0.2em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {chairGreeting}
          </p>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-mafia-gold/30 ml-4"></div>
        </motion.div>
        <motion.div 
          animate={{ y: 0, scaleX: side === 'left' ? -1 : 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full relative"
        >
          {/* Subtle Parallax Background behind the chair */}
          <motion.div 
            animate={{ x: parallaxBgX }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(var(--color-mafia-gold-rgb),0.15)_0%,_rgba(0,0,0,0)_60%)] pointer-events-none rounded-full blur-2xl"
          />

          <Image 
            src="/obr/kreslo.png" 
            alt={`Barber Chair ${barber.name}`}
            fill 
            priority
            quality={100}
            loading="eager"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
          
          <div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{ 
              maskImage: `url('/obr/kreslo.png')`,
              WebkitMaskImage: `url('/obr/kreslo.png')`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat'
            }}
          >
            {/* Light Flash on Sit */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: isSitting ? [0, 0.9, 0] : 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 bg-white mix-blend-overlay z-30"
            />
          
            {/* Search lights */}
            <motion.div
              animate={{ x: [-100, 250, 50, -100], y: [-50, 200, 350, -50] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full blur-[60px] bg-gradient-to-tr from-mafia-gold/40 via-white/20 to-transparent mix-blend-overlay z-10"
            />
            <motion.div
              animate={{ x: [-50, 280, 100, -50], y: [0, 250, 300, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-[150px] h-[150px] rounded-full blur-[40px] bg-white/30 mix-blend-color-dodge z-10"
            />

            {/* Fog / Smoke */}
            <motion.div 
              animate={{ x: [-20, 20, -20], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[-10%] left-[-20%] w-[140%] h-[200px] bg-white blur-[50px] rounded-full mix-blend-overlay z-0"
            />
          </div>
        </motion.div>
      </motion.div>

      <div className="relative z-10">
        <BarberCard 
          barber={barber}
          isActive={activeSpeaker === (barber.name === 'Tomáš' || barber.name === 'Tomas' ? 'tomas' : 'nella')}
          dialogueIndex={dialogueIndex}
          lang={lang}
          t={t}
          playCardSound={playCardSound}
          onBook={handleBook}
          onHoverChange={(h) => setIsCardHovered(h)}
          activeSpeaker={activeSpeaker}
          graphicsTier={graphicsTier}
          globalStats={globalStats}
          likedMap={likedMap}
          onLike={onLike}
        />
      </div>
    </div>
  );
}

export function Profiles() {
  const { t, lang } = useTranslation();
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(BARBER_DIALOGUES.length - 1);
  const [activeSpeaker, setActiveSpeaker] = useState<'tomas' | 'nella' | null>(null);
  const [isDecided, setIsDecided] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [slotIndex, setSlotIndex] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [revealedBarbers, setRevealedBarbers] = useState<string[]>([]);
  const [graphicsTier, setGraphicsTier] = useState<string>("low");

  // Real-time Global XP and Liking States
  const [globalStats, setGlobalStats] = useState<GlobalBarberStats>({});
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const playCardSound = () => {
    playSound("/sounds/card.mp3", 0.9);
  };

  const handleLike = async (barberId: string) => {
    playSound("/sounds/reload.mp3", 0.5);
    const success = await addLikeToBarber(barberId);
    if (success) {
      playSound("/sounds/leather.mp3", 0.6);
      trackEvent("barber_liked_xp_home", { barberId });
      setLikedMap(prev => ({ ...prev, [barberId]: true }));
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const updateTier = () => {
      const tier = document.documentElement.getAttribute('data-graphics-tier') || "low";
      setGraphicsTier(tier);
    };
    updateTier();
    window.addEventListener('mmbarber-graphics-update', updateTier);
    
    // Visibility Observer for Dialogues
    const observer = new IntersectionObserver(
      ([entry]) => setIsSectionVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    const section = document.getElementById('operativi');
    if (section) observer.observe(section);

    // Lottery is currently disabled per user request - skipping directly to profiles
    setIsFirstVisit(false);

    const savedRevealed = localStorage.getItem("mmbarber_revealed_barbers");
    if (savedRevealed) {
      try {
        setRevealedBarbers(JSON.parse(savedRevealed));
      } catch {}
    }

    const handleReveal = () => {
      const allNames = barbers.map(b => b.name);
      setRevealedBarbers(allNames);
      localStorage.setItem("mmbarber_revealed_barbers", JSON.stringify(allNames));
    };

    window.addEventListener("mmbarber-reveal-barbers", handleReveal);

    // Real-time listener for global XP stats
    const unsubscribeXp = subscribeToGlobalXpStats((stats) => {
      setGlobalStats(stats);
      
      const updatedLikes: Record<string, boolean> = {};
      barbers.forEach((b) => {
        updatedLikes[b.id] = hasLikedToday(b.id);
      });
      setLikedMap(updatedLikes);
    });

    return () => {
      window.removeEventListener("mmbarber-reveal-barbers", handleReveal);
      window.removeEventListener('mmbarber-graphics-update', updateTier);
      unsubscribeXp();
      if (section) observer.unobserve(section);
    };
  }, [revealedBarbers]);

  const handleRandomize = () => {
    if (isRandomizing || isDecided) return;
    localStorage.setItem("mmbarber_profiles_seen", "true");
    trackEvent("cta_randomize_barber");

    const availableBarbers = barbers;

    setIsRandomizing(true);
    let ticks = 0;
    const maxTicks = 40; 
    const interval = setInterval(() => {
      setSlotIndex(prev => (prev + 1) % availableBarbers.length);
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        // Find the index of the winner in the ORIGINAL barbers array for the booking link
        // Actually, availableBarbers[winner] is already from the filtered list, but we need slotIndex to match the visual if we use slotIndex for rendering.
        // Wait, slotIndex is used to render the card.
        const winner = Math.floor(Math.random() * availableBarbers.length);
        
        // Find the index in the original barbers array
        const originalIndex = barbers.findIndex(b => b.name === availableBarbers[winner].name);
        
        setSlotIndex(originalIndex);
        setIsRandomizing(false);
        setIsDecided(true);
        setTimeout(() => {
          window.location.href = availableBarbers[winner].bookingLink;
        }, 1500);
      }
    }, 80);
  };

  // Re-enabled dialogue system - Alternating sequential mode
  useEffect(() => {
    const isMobile = window.innerWidth < 1280;
    const isMay = new Date().getMonth() === 4;
    
    if (!isSectionVisible || isMobile || !isMay) {
      setActiveSpeaker(null);
      return;
    }

    let cycleCount = 0;
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;
    
    const triggerDialogue = () => {
      // Tomáš starts, then Nella replies
      const speaker = cycleCount % 2 === 0 ? 'tomas' : 'nella';
      
      if (speaker === 'tomas') {
        // Only increment dialogue index when Tomáš starts a new exchange
        setDialogueIndex(prev => (prev + 1) % BARBER_DIALOGUES.length);
      }
      
      setActiveSpeaker(speaker);
      
      // Slower pace: Keep talking for 8-10 seconds
      const talkTime = 8000;
      t1 = setTimeout(() => {
        setActiveSpeaker(null);
        cycleCount++;
        
        // Pause between speakers (3s) or between exchanges (6s)
        const pauseTime = cycleCount % 2 === 0 ? 6000 : 3000;
        t2 = setTimeout(triggerDialogue, pauseTime);
      }, talkTime);
    };

    // Initial delay before first talk
    const initialDelay = setTimeout(triggerDialogue, 4000);

    return () => {
      clearTimeout(initialDelay);
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
      setActiveSpeaker(null);
    };
  }, [isSectionVisible]);

  const translatedBarbers = useMemo(() => {
    const isMay = new Date().getMonth() === 4;
    
    return barbers.map(b => {
      const isTomas = b.name === 'Tomáš' || b.name === 'Tomas';
      const barberKey = isTomas ? 'tomas' : 'nella';
      const barberTranslations = t.operatives?.barbers?.[barberKey as 'tomas' | 'nella'];
      
      const staticDesc = barberTranslations?.story || "";

      // Show dialogue only in May (index 4)
      const currentDialogues = isMay ? BARBER_DIALOGUES : [];
      const currentDialogue = currentDialogues[dialogueIndex];
      const dialogueText = isTomas ? currentDialogue?.tomas : currentDialogue?.nella;

      return {
        ...b,
        name: barberTranslations?.name || b.name,
        role: barberTranslations?.role || b.role,
        motto: barberTranslations?.motto || "",
        story: dialogueText || staticDesc,
        schedule: barberTranslations?.schedule || b.schedule,
        specializations: barberTranslations?.specializations || b.specializations,
        englishSpeaking: (barberTranslations as { englishSpeaking?: string })?.englishSpeaking,
        symbol: b.symbol,
        isHidden: false
      };
    });
  }, [dialogueIndex, t]);

  return (
    <section 
      id="operativi" 
      className="relative w-full py-10 md:py-20 px-4 md:px-12 bg-transparent border-t-8 border-mafia-dark flex flex-col items-center scroll-mt-32"
    >
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/black-paper.png')" }}></div>
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="max-w-[1600px] mx-auto w-full">
            <div className="w-full">
                <div className="text-center mb-16 md:mb-24">
                    <h2 className="text-3xl md:text-5xl font-heading font-black text-smoke-white mb-3 md:mb-4 tracking-[0.3em] uppercase">{t.operatives.title}</h2>
                    <div className="section-underline w-16 md:w-24 h-1 bg-gradient-to-r from-mafia-gold/20 via-mafia-gold to-mafia-gold/20 mx-auto mb-4 md:mb-6 shadow-[0_0_20px_var(--color-mafia-gold-glow)]" style={{ background: 'linear-gradient(to right, transparent, var(--user-accent-color), transparent)', boxShadow: '0 0 20px var(--user-glow-color)' }}></div>
                    <div className="text-smoke-white/60 font-sans tracking-widest uppercase text-[10px] md:text-sm px-4 mb-4 flex flex-col items-center gap-1 md:gap-2 cursor-default group">
                        <span className="group-hover:text-white transition-colors duration-500">
                            {t.operatives.subtitle.split('.')[0]}.
                        </span>
                        
                        <div className="mt-6 flex justify-center">
                            <Link 
                                href="/losovat-barbera"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-mafia-gold/5 border border-mafia-gold/30 hover:border-mafia-gold hover:bg-mafia-gold text-mafia-gold hover:text-mafia-black font-heading font-black tracking-[0.2em] uppercase text-xs transition-all duration-300 rounded shadow-[0_0_15px_rgba(197,160,89,0.15)] hover:shadow-[0_0_25px_rgba(197,160,89,0.4)] flex items-center gap-2 group cursor-pointer"
                                onClick={() => playSound("/sounds/hover.mp3", 0.4)}
                            >
                                <span>Nevím za kým půjdu</span>
                                <motion.span 
                                  animate={{ x: [0, 4, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                  className="inline-block font-sans font-bold"
                                >
                                  ➔
                                </motion.span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-8 xl:gap-10 px-4 md:px-0 w-full mx-auto py-4 xl:py-8">
                    {translatedBarbers.map((barber, index) => (
                      <ChairWithCard 
                        key={barber.name}
                        barber={barber} 
                        activeSpeaker={activeSpeaker} 
                        dialogueIndex={dialogueIndex} 
                        lang={lang} 
                        t={t} 
                        playCardSound={playCardSound} 
                        side={index % 2 === 0 ? "left" : "right"} 
                        graphicsTier={graphicsTier}
                        globalStats={globalStats}
                        likedMap={likedMap}
                        onLike={handleLike}
                      />
                    ))}
                </div>
            </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes shake-gentle {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1px, 1px); }
          75% { transform: translate(1px, -1px); }
        }
        .animate-shake-gentle {
          animation: shake-gentle 0.3s ease-in-out infinite;
        }
        @keyframes glitch-text-anim {
          0% { transform: translate(0); text-shadow: none; }
          20% { transform: translate(-2px, 1px); text-shadow: 1px 0 var(--color-mafia-gold); }
          40% { transform: translate(2px, -1px); text-shadow: -1px 0 var(--color-mafia-gold); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1px); }
          100% { transform: translate(0); }
        }
        .animate-glitch-text {
          animation: glitch-text-anim 1s step-end infinite;
        }
      `}</style>
    </section>
  );
}
