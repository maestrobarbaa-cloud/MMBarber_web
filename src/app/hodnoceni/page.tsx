"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getInternalIdentity } from "@/utils/identity";
import { barbers } from "@/data/barbers";
import { 
  castMultiVote, 
  getUserRatingsData, 
  subscribeToUserRatings,
  BarberRating
} from "@/utils/voting";
import { 
  Crown, Flame, User, Shield, 
  Target, ArrowRight, Settings, Check, Plus, Minus,
  ArrowLeft, Home, UserCircle, ChevronDown, Sparkles, Edit3
} from "lucide-react";
import { MilitaryInsignia } from "@/components/Profiles";
import Image from "next/image";
import { playSound } from "@/utils/audio";
import { trackEvent } from "@/utils/analytics";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { 
  subscribeToGlobalXpStats, 
  addLikeToBarber, 
  hasLikedToday,
  calculateLevelFromXp,
  getCzechRankFromLevel,
  getEnglishRankFromLevel,
  GlobalBarberStats,
  addVoteToBarberStat,
  hasStatLikedToday
} from "@/utils/barberXp";

// Attribute rating configurations with static baseline levels
const BARBER_STATS_METADATA: Record<string, { label: string; base: number; color: string }[]> = {
  tomas: [
    { label: "PŘESNOST BŘITVY", base: 0, color: "var(--user-accent-color, #c5a059)" },
    { label: "GEOMETRIE FADU", base: 0, color: "var(--user-accent-color, #c5a059)" },
    { label: "TAKTIKA A KOMUNIKACE", base: 0, color: "var(--user-accent-color, #c5a059)" },
    { label: "CHARISMA A LIDSKÝ PŘÍSTUP", base: 0, color: "var(--user-accent-color, #c5a059)" },
    { label: "POKEC A SMYSL PRO HUMOR", base: 0, color: "var(--user-accent-color, #c5a059)" },
    { label: "OCHOTA A BRATRSKÝ VIBE", base: 0, color: "var(--user-accent-color, #c5a059)" }
  ],
  nella: [
    { label: "KREATIVNÍ TEXTURA", base: 0, color: "var(--user-accent-color, #c5a059)" },
    { label: "TRADIČNÍ STYLING", base: 0, color: "var(--user-accent-color, #c5a059)" },
    { label: "TAKTIKA A RYCHLOST", base: 0, color: "var(--user-accent-color, #c5a059)" },
    { label: "EMPATIE A PŘÁTELSKÁ AURA", base: 0, color: "var(--user-accent-color, #c5a059)" },
    { label: "DOBRÁ NÁLADA A POKEC", base: 0, color: "var(--user-accent-color, #c5a059)" },
    { label: "TRPĚLIVOST A PÉČE", base: 0, color: "var(--user-accent-color, #c5a059)" }
  ]
};

export default function RatingPage() {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const [internalId, setInternalId] = useState<string | null>(null);
  const [clientNickname, setClientNickname] = useState("");
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isBloodMode, setIsBloodMode] = useState(false);
  const [isNoirMode, setIsNoirMode] = useState(false);
  
  // Real-time Global XP and Liking States
  const [globalStats, setGlobalStats] = useState<GlobalBarberStats>({});
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [statLikedMap, setStatLikedMap] = useState<Record<string, boolean>>({});

  // Barber customizable names states
  const [customTomasName, setCustomTomasName] = useState<string>("Tomáš");
  const [customNellaName, setCustomNellaName] = useState<string>("Nella");
  const [isEditingTomasName, setIsEditingTomasName] = useState<boolean>(false);
  const [isEditingNellaName, setIsEditingNellaName] = useState<boolean>(false);
  const [tomasInputName, setTomasInputName] = useState<string>("Tomáš");
  const [nellaInputName, setNellaInputName] = useState<string>("Nella");

  useEffect(() => {
    setIsClient(true);
    
    const initIdentity = async () => {
      const id = await getInternalIdentity();
      setInternalId(id);
    };

    initIdentity();
    
    const checkTheme = () => {
      setIsBloodMode(document.documentElement.classList.contains('theme-blood'));
      setIsNoirMode(document.documentElement.classList.contains('noir-mode'));
    };
    checkTheme();
    window.addEventListener('mmbarber-theme-update', checkTheme);

    // Load custom names from local storage
    const savedTomas = localStorage.getItem("mmbarber_custom_name_tomas");
    if (savedTomas) {
      setCustomTomasName(savedTomas);
      setTomasInputName(savedTomas);
    }
    const savedNella = localStorage.getItem("mmbarber_custom_name_nella");
    if (savedNella) {
      setCustomNellaName(savedNella);
      setNellaInputName(savedNella);
    }

    // Load simple nickname from local storage
    const savedNickname = localStorage.getItem("mmbarber_client_nickname");
    if (savedNickname) {
      setClientNickname(savedNickname);
    } else {
      setIsEditingNickname(true); // Edit identity automatically on first visit
    }

    // Real-time listener for global XP stats
    const unsubscribeXp = subscribeToGlobalXpStats((stats) => {
      setGlobalStats(stats);
      
      // Update like and stat-like tracker maps for each barber
      const updatedLikes: Record<string, boolean> = {};
      const updatedStatLikes: Record<string, boolean> = {};
      
      barbers.forEach((b) => {
        updatedLikes[b.id] = hasLikedToday(b.id);
        for (let i = 0; i < 6; i++) {
          updatedStatLikes[`${b.id}_${i}`] = hasStatLikedToday(b.id, i);
        }
      });
      
      setLikedMap(updatedLikes);
      setStatLikedMap(updatedStatLikes);
    });

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for local XP changes to update UI instantly
    const handleLocalXpUpdate = () => {
      const updatedLikes: Record<string, boolean> = {};
      const updatedStatLikes: Record<string, boolean> = {};
      barbers.forEach((b) => {
        updatedLikes[b.id] = hasLikedToday(b.id);
        for (let i = 0; i < 6; i++) {
          updatedStatLikes[`${b.id}_${i}`] = hasStatLikedToday(b.id, i);
        }
      });
      setLikedMap(updatedLikes);
      setStatLikedMap(updatedStatLikes);
    };
    window.addEventListener('mmbarber_xp_updated', handleLocalXpUpdate);

    return () => {
      unsubscribeXp();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('mmbarber-theme-update', checkTheme);
      window.removeEventListener('mmbarber_xp_updated', handleLocalXpUpdate);
    };
  }, []);

  const handleConfirmNickname = () => {
    localStorage.setItem("mmbarber_client_nickname", clientNickname);
    setIsEditingNickname(false);
    playSound("/sounds/reload.mp3", 0.4);
  };

  const handleSaveTomasName = () => {
    const trimmed = tomasInputName.trim();
    if (trimmed) {
      localStorage.setItem("mmbarber_custom_name_tomas", trimmed);
      setCustomTomasName(trimmed);
    } else {
      localStorage.removeItem("mmbarber_custom_name_tomas");
      setCustomTomasName("Tomáš");
      setTomasInputName("Tomáš");
    }
    setIsEditingTomasName(false);
    playSound("/sounds/reload.mp3", 0.4);
  };

  const handleSaveNellaName = () => {
    const trimmed = nellaInputName.trim();
    if (trimmed) {
      localStorage.setItem("mmbarber_custom_name_nella", trimmed);
      setCustomNellaName(trimmed);
    } else {
      localStorage.removeItem("mmbarber_custom_name_nella");
      setCustomNellaName("Nella");
      setNellaInputName("Nella");
    }
    setIsEditingNellaName(false);
    playSound("/sounds/reload.mp3", 0.4);
  };

  const handleLike = async (barberId: string) => {
    if (likedMap[barberId]) return;
    
    // Optimistic UI updates
    setLikedMap(prev => ({ ...prev, [barberId]: true }));
    setGlobalStats(prev => {
      const current = prev[barberId] || { xp: 0, likes: 0, stat1: 0, stat2: 0, stat3: 0, stat4: 0, stat5: 0, stat6: 0 };
      return {
        ...prev,
        [barberId]: {
          ...current,
          xp: Math.min(100, current.xp + 1),
          likes: current.likes + 1
        }
      };
    });
    
    // Play premium sound effect
    playSound("/sounds/cash.mp3", 0.4);
    
    try {
      await addLikeToBarber(barberId);
    } catch (err) {
      console.error("Failed to add like:", err);
      // Rollback on error
      setLikedMap(prev => ({ ...prev, [barberId]: false }));
      setGlobalStats(prev => {
        const current = prev[barberId] || { xp: 1, likes: 1, stat1: 0, stat2: 0, stat3: 0, stat4: 0, stat5: 0, stat6: 0 };
        return {
          ...prev,
          [barberId]: {
            ...current,
            xp: Math.max(0, current.xp - 1),
            likes: Math.max(0, current.likes - 1)
          }
        };
      });
    }
  };

  const handleStatVote = async (barberId: string, statIndex: number) => {
    const mapKey = `${barberId}_${statIndex}`;
    if (statLikedMap[mapKey]) return;

    // Optimistic local update
    setStatLikedMap(prev => ({ ...prev, [mapKey]: true }));
    setGlobalStats(prev => {
      const current = prev[barberId] || { xp: 0, likes: 0, stat1: 0, stat2: 0, stat3: 0, stat4: 0, stat5: 0, stat6: 0 };
      const val1 = statIndex === 0 ? (current.stat1 ?? 0) + 1 : (current.stat1 ?? 0);
      const val2 = statIndex === 1 ? (current.stat2 ?? 0) + 1 : (current.stat2 ?? 0);
      const val3 = statIndex === 2 ? (current.stat3 ?? 0) + 1 : (current.stat3 ?? 0);
      const val4 = statIndex === 3 ? (current.stat4 ?? 0) + 1 : (current.stat4 ?? 0);
      const val5 = statIndex === 4 ? (current.stat5 ?? 0) + 1 : (current.stat5 ?? 0);
      const val6 = statIndex === 5 ? (current.stat6 ?? 0) + 1 : (current.stat6 ?? 0);
      return {
        ...prev,
        [barberId]: {
          xp: current.xp + 1, // +1 XP on stat endorsement
          likes: current.likes + 1,
          stat1: val1,
          stat2: val2,
          stat3: val3,
          stat4: val4,
          stat5: val5,
          stat6: val6
        }
      };
    });

    playSound("/sounds/cash.mp3", 0.4);
    trackEvent("barber_stat_vote", { barberId, statIndex });

    try {
      await addVoteToBarberStat(barberId, statIndex);
    } catch (err) {
      console.error("Failed to add stat vote:", err);
      // Rollback
      setStatLikedMap(prev => ({ ...prev, [mapKey]: false }));
    }
  };

  const getVocative = (name: string) => {
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

  const vocativeName = getVocative(clientNickname);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-8 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.05),transparent)] opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-b from-mafia-gold/5 via-transparent to-black"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12">
          <Link href="/" className={`group inline-flex items-center gap-3 px-6 py-3 border transition-all duration-500 ${isBloodMode ? 'border-mafia-blood/30 text-mafia-blood hover:bg-mafia-blood hover:text-white' : isNoirMode ? 'border-white/30 text-white hover:bg-white hover:text-black' : 'border-mafia-gold/30 text-mafia-gold hover:bg-mafia-gold hover:text-black'}`}>
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[12px] font-black tracking-[0.3em] uppercase">{lang === 'cs' ? 'ZPĚT NA ZÁKLADNU' : 'BACK TO HQ'}</span>
          </Link>
        </div>

        <header className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <div className="p-4 bg-mafia-gold/10 border border-mafia-gold/30 rounded-full shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.2)]">
              <Crown size={48} className="text-mafia-gold animate-pulse" />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl md:text-7xl font-heading font-black tracking-tighter uppercase text-mafia-gold drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          >
            {t.header.nicknames}
          </motion.h1>
          <p className="text-mafia-gold/60 font-mono tracking-[0.3em] uppercase text-xs md:text-sm max-w-2xl mx-auto leading-relaxed italic">
            {clientNickname ? (
              lang === 'cs' 
                ? `Vítejte zpět, operativče ${clientNickname}. Určete vlastní hierarchii pro váš terminál.` 
                : `Welcome back, operative ${clientNickname}. Define your own hierarchy for your terminal.`
            ) : (
              lang === 'cs' 
                ? 'Urči si vlastní hierarchii. Nastavené hodnosti a tituly uvidíš napříč celým systémem.' 
                : 'Define your own hierarchy. Your chosen ranks and titles will be reflected across the entire system.'
            )}
          </p>
        </header>



        {/* TEAM CARDS GRID WITH REAL-TIME STAT RATINGS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 relative pb-40">
          {barbers.map((barber, idx) => {
            const stats = globalStats[barber.id] || { xp: 0, likes: 0, stat1: 0, stat2: 0, stat3: 0, stat4: 0, stat5: 0, stat6: 0 };
            const globalXp = stats.xp;
            const globalLikes = stats.likes;
            const globalLevel = calculateLevelFromXp(globalXp);
            const globalRankTitle = lang === 'cs'
              ? getCzechRankFromLevel(globalLevel, barber.id === 'nella')
              : getEnglishRankFromLevel(globalLevel);
            
            const alreadyLiked = likedMap[barber.id] || false;
            const statsMetadata = BARBER_STATS_METADATA[barber.id] || [];

            return (
              <motion.div
                key={barber.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative group bg-[#050505] border-2 border-white/5 hover:border-mafia-gold/30 transition-all duration-700 overflow-hidden rounded-sm flex flex-col justify-between"
              >
                <div className="p-6 md:p-8 flex flex-col gap-6">
                  {/* Barber profile head */}
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 group/photo">
                      <div className="absolute inset-0 border border-mafia-gold/30 rounded-lg z-10" />
                      <Image 
                        src={barber.image} 
                        alt={barber.name} 
                        width={128} 
                        height={128} 
                        className={`w-full h-full object-cover rounded-lg grayscale transition-all duration-700 ${isBloodMode ? 'group-hover/photo:grayscale-0 group-hover/photo:sepia-[1] group-hover/photo:hue-rotate-[320deg] group-hover/photo:saturate-[5]' : 'group-hover:grayscale-0'}`}
                      />
                    </div>
                    <div className="flex-grow space-y-1">
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">{lang === 'cs' ? 'OPERATIVNÍ ČLEN' : 'OPERATIVE MEMBER'}</span>
                      <div className="flex items-center gap-2">
                        {barber.id === 'tomas' ? (
                          isEditingTomasName ? (
                            <div className="flex items-center gap-2 mt-1">
                              <input 
                                type="text"
                                value={tomasInputName}
                                onChange={(e) => setTomasInputName(e.target.value)}
                                className="bg-black/80 border border-mafia-gold text-white px-2 py-0.5 rounded text-xl font-heading w-40 md:w-56 focus:outline-none uppercase"
                                autoFocus
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTomasName(); }}
                              />
                              <button 
                                onClick={handleSaveTomasName}
                                className="text-[10px] font-mono text-mafia-gold hover:text-white border border-mafia-gold/40 px-2 py-0.5 rounded transition bg-mafia-gold/10"
                              >
                                OK
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-baseline gap-2 group/name select-none">
                              <h3 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-wider italic">
                                {customTomasName}
                              </h3>
                              <button 
                                onClick={() => setIsEditingTomasName(true)}
                                className="text-[9px] font-mono text-white/40 hover:text-mafia-gold flex items-center gap-1 transition-all duration-300 opacity-0 group-hover/name:opacity-100 focus:opacity-100 cursor-pointer bg-transparent border-none"
                                title="Změnit jméno"
                              >
                                <Edit3 size={11} />
                                <span>[ PŘEPSAT ]</span>
                              </button>
                            </div>
                          )
                        ) : (
                          isEditingNellaName ? (
                            <div className="flex items-center gap-2 mt-1">
                              <input 
                                type="text"
                                value={nellaInputName}
                                onChange={(e) => setNellaInputName(e.target.value)}
                                className="bg-black/80 border border-mafia-gold text-white px-2 py-0.5 rounded text-xl font-heading w-40 md:w-56 focus:outline-none uppercase"
                                autoFocus
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNellaName(); }}
                              />
                              <button 
                                onClick={handleSaveNellaName}
                                className="text-[10px] font-mono text-mafia-gold hover:text-white border border-mafia-gold/40 px-2 py-0.5 rounded transition bg-mafia-gold/10"
                              >
                                OK
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-baseline gap-2 group/name select-none">
                              <h3 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-wider italic">
                                {customNellaName}
                              </h3>
                              <button 
                                onClick={() => setIsEditingNellaName(true)}
                                className="text-[9px] font-mono text-white/40 hover:text-mafia-gold flex items-center gap-1 transition-all duration-300 opacity-0 group-hover/name:opacity-100 focus:opacity-100 cursor-pointer bg-transparent border-none"
                                title="Změnit jméno"
                              >
                                <Edit3 size={11} />
                                <span>[ PŘEPSAT ]</span>
                              </button>
                            </div>
                          )
                        )}
                      </div>
                      <p className={`text-[11px] font-mono font-bold tracking-[0.3em] uppercase ${isBloodMode ? 'text-white' : isNoirMode ? 'text-white' : 'text-mafia-gold'}`}>
                        {barber.role}
                      </p>
                    </div>
                  </div>

                  {/* GLOBÁLNÍ REPUTACE & EXP SYSTEM (FIRESTORE REALTIME VOTE) */}
                  <div className={`p-6 border border-mafia-gold/30 rounded-lg relative overflow-hidden backdrop-blur-md ${isBloodMode ? 'bg-mafia-blood/5 border-mafia-blood/30' : isNoirMode ? 'bg-white/5 border-white/20' : 'bg-mafia-gold/5 shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.05)]'}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(var(--color-mafia-gold-rgb),0.08)_0%,transparent_50%)] pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-mafia-gold/60 uppercase tracking-[0.3em] block">
                            {lang === 'cs' ? 'CELKOVÁ REPUTACE TÝMU' : 'GLOBAL TEAM REPUTATION'}
                          </span>
                          <h4 className="text-sm md:text-base font-heading font-black text-white uppercase tracking-wider italic flex items-center gap-2">
                            <Flame size={16} className="text-mafia-gold animate-pulse animate-bounce" />
                            {globalRankTitle}
                          </h4>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{lang === 'cs' ? 'CELKOVÉ EXP' : 'TOTAL EXP'}</span>
                          <span className="text-2xl font-heading font-black text-mafia-gold leading-none mt-1">
                            {globalXp} <span className="text-xs text-white/40 font-mono">XP</span>
                          </span>
                        </div>
                      </div>

                      {/* Golden progress bar */}
                      <div className="relative w-full h-3 bg-black/60 border border-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${globalXp % 100}%` }}
                          transition={{ type: "spring", stiffness: 80, damping: 15 }}
                          className={`h-full rounded-full ${isBloodMode ? 'bg-mafia-blood' : isNoirMode ? 'bg-white' : 'bg-gradient-to-r from-mafia-gold/50 via-mafia-gold to-mafia-gold shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.5)]'}`}
                        />
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        {/* Insignia / Level Indicator */}
                        <div className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-sm bg-black/40">
                          <MilitaryInsignia level={globalLevel} color={isBloodMode ? "#ffffff" : isNoirMode ? "#ffffff" : "var(--color-mafia-gold)"} size={38} />
                        </div>
                        <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                          {lang === 'cs' ? `Stupeň šarže: ${globalLevel}` : `Rank Level: ${globalLevel}`}
                        </span>
                      </div>
                      
                      {/* Next rank notification */}
                      {globalXp < 10000 && (
                        <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest text-center mt-1">
                          {lang === 'cs' 
                            ? `K postupu do další hodnosti zbývá ${100 - (globalXp % 100)} XP`
                            : `${100 - (globalXp % 100)} XP needed for the next rank`}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SPECIÁLNÍ SCHOPNOSTI OPERATIVCE (INDIVIDUAL ATTRIBUTES VOTING PANEL) */}
                  <div className="bg-black/40 border border-white/5 p-5 rounded-xl space-y-5 relative">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-2.5 justify-between">
                      <span className="text-[9px] font-mono text-glow text-mafia-gold uppercase tracking-[0.25em] flex items-center gap-1.5">
                        <Target size={12} className="text-mafia-gold" />
                        {lang === 'cs' ? 'HODNOCENÍ SPECIFICKÝCH SCHOPNOSTÍ' : 'SPECIFIC SKILLS RATINGS'}
                      </span>
                      <span className="text-[8px] font-mono text-white/30 uppercase">
                        ONLINE SYNCHRONIZACE
                      </span>
                    </div>

                    <div className="space-y-4">
                      {statsMetadata.map((stat, sIdx) => {
                        const serverVotes = 
                          sIdx === 0 ? (stats.stat1 ?? 0) : 
                          sIdx === 1 ? (stats.stat2 ?? 0) : 
                          sIdx === 2 ? (stats.stat3 ?? 0) : 
                          sIdx === 3 ? (stats.stat4 ?? 0) : 
                          sIdx === 4 ? (stats.stat5 ?? 0) : 
                          (stats.stat6 ?? 0);
                        const currentPercentage = Math.min(100, stat.base + serverVotes);
                        const hasVotedForStat = statLikedMap[`${barber.id}_${sIdx}`] || false;

                        return (
                          <div key={sIdx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:border-mafia-gold/20 transition-all duration-300">
                            
                            {/* Stat details and loading bar */}
                            <div className="flex-grow space-y-1.5 w-full">
                              <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest text-white/60">
                                <span>{stat.label}</span>
                                <span className="text-mafia-gold font-bold">
                                  {currentPercentage}% {serverVotes > 0 && `(+${serverVotes} ${lang === 'cs' ? 'hlasů' : 'votes'})`}
                                </span>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${currentPercentage}%` }}
                                  transition={{ type: "spring", stiffness: 60, damping: 10 }}
                                  className="h-full rounded-full shadow-[0_0_8px_rgba(197,160,89,0.3)] bg-mafia-gold"
                                />
                              </div>
                            </div>

                            {/* Stat specific upvote trigger */}
                            <button
                              onClick={() => handleStatVote(barber.id, sIdx)}
                              disabled={hasVotedForStat}
                              className={`w-full sm:w-auto px-4 py-2 border transition-all duration-300 flex items-center justify-center gap-1.5 text-[9px] font-mono uppercase tracking-wider shrink-0 rounded ${
                                hasVotedForStat
                                  ? "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
                                  : "bg-transparent border-mafia-gold/40 text-mafia-gold hover:bg-mafia-gold hover:text-black hover:border-mafia-gold"
                              }`}
                            >
                              {hasVotedForStat ? (
                                <>
                                  <Check size={12} className="text-emerald-500 shrink-0" />
                                  <span>PODPOŘENO</span>
                                </>
                              ) : (
                                <>
                                  <Flame size={12} className="text-mafia-gold shrink-0 group-hover:animate-bounce" />
                                  <span>DÁT EXP +1</span>
                                </>
                              )}
                            </button>

                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* IDENTITY MANAGEMENT SECTION (MOVED TO BOTTOM AS REQUESTED) */}
        <div className="space-y-12 mb-12 mt-16">
          <AnimatePresence mode="wait">
            {!isEditingNickname && clientNickname ? (
              <motion.div 
                key="greeting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 bg-mafia-black border-2 border-mafia-gold/20 rounded-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-mafia-gold/10 border border-mafia-gold/30 flex items-center justify-center rounded-full shrink-0 shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.1)]">
                     <User size={28} className="text-mafia-gold" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.4em] block">
                       {lang === 'cs' ? 'STATUS OPERATIVCE' : 'OPERATIVE STATUS'}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-wider italic">
                       {lang === 'cs' 
                         ? [
                            `Ale, ale... koho to tu máme? ${vocativeName}, vítej zpět v akci.`,
                            `Pozor na palubě! Šéf ${clientNickname} se právě přihlásil k systému.`,
                            `${vocativeName}? To je tvoje krycí jméno, nebo tě tak vážně oslovují?`,
                            `Systém hlásí přítomnost legendy. Nazdar, ${vocativeName}!`,
                            `Zase ty, ${vocativeName}? Doufám, že dneska ty kluky nebudeme moc šikanovat...`,
                            `Protokol MMBarber aktivován pro uživatele: ${clientNickname}.`,
                            `Ověřeno. Identita potvrzena. Vstup povolen, ${vocativeName}.`,
                         ][(clientNickname.length % 7)]
                         : [
                            `Well, well, well... look who's back. ${clientNickname}, welcome to the action.`,
                            `Attention on deck! Boss ${clientNickname} just logged in.`,
                            `${clientNickname}? Is that your cover name or do people actually call you that?`,
                            `System reports a legend is present. Greetings, ${clientNickname}!`,
                            `You again, ${clientNickname}? Ready to judge the squad?`,
                            `MMBarber protocol activated for: ${clientNickname}.`,
                            `Verified. Identity confirmed. Access granted, ${clientNickname}.`,
                         ][(clientNickname.length % 7)]
                       }
                    </h2>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditingNickname(true)}
                  className="px-6 py-3 border border-mafia-gold/30 text-mafia-gold font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-mafia-gold hover:text-black transition-all flex items-center gap-2 group-hover:border-mafia-gold"
                >
                  <Settings size={14} />
                  {lang === 'cs' ? 'UPRAVIT IDENTITU' : 'EDIT IDENTITY'}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8 bg-[#070707] border-2 border-mafia-gold/40 rounded-sm relative overflow-hidden group shadow-[0_0_40px_rgba(var(--color-mafia-gold-rgb),0.1)]"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                   <UserCircle size={120} className="text-mafia-gold" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-20 h-20 bg-mafia-gold/10 border border-mafia-gold/30 flex items-center justify-center rounded-full shrink-0">
                     <User size={32} className="text-mafia-gold" />
                  </div>
                  <div className="flex-grow space-y-4 w-full">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.4em] mb-2">
                        {lang === 'cs' ? 'IDENTIFIKACE OPERATIVCE (KLIENTA):' : 'OPERATIVE IDENTIFICATION (CLIENT):'}
                      </span>
                      <div className="flex flex-col md:flex-row gap-4">
                        <input 
                           type="text"
                           placeholder={lang === 'cs' ? "ZADEJTE JMÉNO..." : "ENTER NAME..."}
                           value={clientNickname}
                           onChange={(e) => setClientNickname(e.target.value.toUpperCase())}
                           autoFocus
                           className="bg-transparent border-b-2 border-white/20 text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter focus:border-mafia-gold outline-none transition-all flex-grow placeholder:opacity-20"
                        />
                        <button 
                           onClick={handleConfirmNickname}
                           className="px-8 py-4 bg-mafia-gold text-black font-heading font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.3)]"
                        >
                           {lang === 'cs' ? 'POTVRDIT' : 'CONFIRM'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SECURITY & OFFLINE METADATA */}
        <footer className="mt-20 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-mafia-gold/5 border border-mafia-gold/20 rounded-sm">
              <Shield size={12} className="text-mafia-gold" />
              <span className="text-white/40 text-[9px] font-mono tracking-[0.1em] uppercase">
                MM-SECURE IDENTITY: {internalId ? `${internalId.substring(0, 8)}...` : (lang === 'cs' ? "IDENTIFIKACE..." : "IDENTIFICATION...")}
              </span>
            </div>
            <p className="text-white/20 text-[8px] font-mono uppercase tracking-widest">
              {lang === 'cs' ? '* Hodnocení a EXP se bezpečně ukládají na lokální server.' : '* Ratings and EXP are securely saved to the local server.'}
            </p>

            {isOffline && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 px-4 py-2 bg-mafia-red/20 border border-mafia-red/40 rounded-sm"
              >
                <p className="text-mafia-red text-[9px] font-mono uppercase tracking-[0.2em] animate-pulse">
                  {lang === 'cs' ? 'Pozor: Jste offline. Synchronizace s archivem přerušena.' : 'Warning: You are offline. Sync with archive interrupted.'}
                </p>
              </motion.div>
            )}
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
