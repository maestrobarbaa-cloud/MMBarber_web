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
  ArrowLeft, Home, UserCircle, ChevronDown
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
  GlobalBarberStats
} from "@/utils/barberXp";

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
      
      // Update like tracker map for each barber
      const updatedLikes: Record<string, boolean> = {};
      barbers.forEach((b) => {
        updatedLikes[b.id] = hasLikedToday(b.id);
      });
      setLikedMap(updatedLikes);
    });

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribeXp();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('mmbarber-theme-update', checkTheme);
    };
  }, []);

  const handleConfirmNickname = () => {
    localStorage.setItem("mmbarber_client_nickname", clientNickname);
    setIsEditingNickname(false);
    playSound("/sounds/reload.mp3", 0.4);
  };

  const handleLike = async (barberId: string) => {
    if (likedMap[barberId]) return;
    
    // Optimistic UI updates
    setLikedMap(prev => ({ ...prev, [barberId]: true }));
    setGlobalStats(prev => {
      const current = prev[barberId] || { xp: 0, likes: 0 };
      return {
        ...prev,
        [barberId]: {
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
        const current = prev[barberId] || { xp: 1, likes: 1 };
        return {
          ...prev,
          [barberId]: {
            xp: Math.max(0, current.xp - 1),
            likes: Math.max(0, current.likes - 1)
          }
        };
      });
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
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
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

        <div className="space-y-12 mb-20">
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 relative pb-40">
          {barbers.map((barber, idx) => {
            const stats = globalStats[barber.id] || { xp: 0, likes: 0 };
            const globalXp = stats.xp;
            const globalLikes = stats.likes;
            const globalLevel = calculateLevelFromXp(globalXp);
            const globalRankTitle = lang === 'cs'
              ? getCzechRankFromLevel(globalLevel, barber.id === 'nella')
              : getEnglishRankFromLevel(globalLevel);
            const alreadyLiked = likedMap[barber.id] || false;

            return (
              <motion.div
                key={barber.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative group bg-[#050505] border-2 border-white/5 hover:border-mafia-gold/30 transition-all duration-700 overflow-hidden rounded-sm`}
              >
                <div className="p-6 md:p-8 flex flex-col gap-8">
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 group/photo">
                      <div className={`absolute inset-0 border border-mafia-gold/30 rounded-lg z-10`} />
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
                      <h3 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-wider italic">
                        {barber.name}
                      </h3>
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
                            {lang === 'cs' ? 'GLOBÁLNÍ REPUTACE & EXP' : 'GLOBAL REPUTATION & EXP'}
                          </span>
                          <h4 className="text-lg font-heading font-black text-white uppercase tracking-wider italic flex items-center gap-2">
                            <Flame size={16} className="text-mafia-gold animate-pulse" />
                            {globalRankTitle}
                          </h4>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{lang === 'cs' ? 'CELKOVÉ EXP' : 'TOTAL EXP'}</span>
                          <span className="text-2xl font-heading font-black text-mafia-gold leading-none mt-1">
                            {globalXp} <span className="text-xs text-white/40 font-mono">/ 100 XP</span>
                          </span>
                        </div>
                      </div>

                      {/* Golden progress bar */}
                      <div className="relative w-full h-3 bg-black/60 border border-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${globalXp}%` }}
                          transition={{ type: "spring", stiffness: 80, damping: 15 }}
                          className={`h-full rounded-full ${isBloodMode ? 'bg-mafia-blood' : isNoirMode ? 'bg-white' : 'bg-gradient-to-r from-mafia-gold/50 via-mafia-gold to-mafia-gold shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.5)]'}`}
                        />
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Insignia / Level Indicator */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-sm bg-black/40">
                            <MilitaryInsignia level={globalLevel} color={isBloodMode ? "#ffffff" : isNoirMode ? "#ffffff" : "var(--color-mafia-gold)"} size={38} />
                          </div>
                          <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                            {lang === 'cs' ? `Stupeň šarže: ${globalLevel}` : `Rank Level: ${globalLevel}`}
                          </span>
                        </div>

                        {/* Interactive Like Button */}
                        <button
                          onClick={() => handleLike(barber.id)}
                          disabled={alreadyLiked}
                          className={`px-5 py-2.5 font-heading uppercase text-xs tracking-wider transition-all duration-300 flex items-center gap-2 border ${
                            alreadyLiked 
                              ? "bg-white/5 border-white/10 text-white/30 cursor-not-allowed" 
                              : isBloodMode 
                                ? "bg-mafia-blood border-mafia-blood text-white font-black hover:bg-white hover:text-black shadow-[0_4px_15px_rgba(var(--color-mafia-blood-rgb),0.2)]"
                                : isNoirMode
                                  ? "bg-white border-white text-black font-black hover:bg-transparent hover:text-white"
                                  : "bg-mafia-gold border-mafia-gold text-black font-black hover:bg-white hover:border-white shadow-[0_4px_15px_rgba(var(--color-mafia-gold-rgb),0.2)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.3)]"
                          }`}
                        >
                          <Flame size={14} className={alreadyLiked ? "" : "animate-bounce"} />
                          {alreadyLiked ? (lang === 'cs' ? "PODPOŘENO" : "SUPPORTED") : (lang === 'cs' ? "DÁT EXP +1" : "GIVE EXP +1")}
                        </button>
                      </div>
                      
                      {/* Next rank notification */}
                      {globalXp < 100 && (
                        <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest text-center mt-1">
                          {lang === 'cs' 
                            ? `K postupu do další hodnosti zbývá ${Math.max(1, Math.ceil((globalLevel + 1) * 7.5) - globalXp)} XP`
                            : `${Math.max(1, Math.ceil((globalLevel + 1) * 7.5) - globalXp)} XP needed for the next rank`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

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
              {lang === 'cs' ? '* Nastavení se ukládá lokálně do paměti tvého prohlížeče.' : '* Settings are stored locally in your browser\'s memory.'}
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
