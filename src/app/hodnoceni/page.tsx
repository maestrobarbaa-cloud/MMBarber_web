"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getInternalIdentity } from "@/utils/identity";
import { barbers } from "@/data/barbers";
import { 
  castMultiVote, 
  getTodayMultiVote, 
  subscribeToLevelVotes, 
  getDominantLevel 
} from "@/utils/voting";
import { 
  Star, Crown, Flame, Trophy, ChevronRight, User, Shield, 
  Target, Medal, ArrowRight, Settings, Check, Plus, Minus,
  ArrowLeft, Home
} from "lucide-react";
import { MilitaryInsignia } from "@/components/Profiles";
import Image from "next/image";
import { playSound } from "@/utils/audio";
import { trackEvent } from "@/utils/analytics";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";

export default function RatingPage() {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const [internalId, setInternalId] = useState<string | null>(null);
  const [draftRatings, setDraftRatings] = useState<Record<string, number>>({});
  const [isSubmittedToday, setIsSubmittedToday] = useState(false);
  const [communityStats, setCommunityStats] = useState<Record<string, Record<number, number>>>({});
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isBloodMode, setIsBloodMode] = useState(false);
  const [isNoirMode, setIsNoirMode] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const initIdentity = async () => {
      const id = await getInternalIdentity();
      setInternalId(id);
      const savedRatings = await getTodayMultiVote(id);
      if (savedRatings) {
        setDraftRatings(savedRatings);
        setIsSubmittedToday(true);
      }
    };

    initIdentity();
    
    const checkTheme = () => {
      setIsBloodMode(document.documentElement.classList.contains('theme-blood'));
      setIsNoirMode(document.documentElement.classList.contains('noir-mode'));
    };
    checkTheme();
    window.addEventListener('mmbarber-theme-update', checkTheme);

    const unsubscribe = subscribeToLevelVotes((stats) => {
      setCommunityStats(stats);
      setLoading(false);
      setIsOffline(false);
    });

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('mmbarber-theme-update', checkTheme);
    };
  }, []);

  const handleLevelChange = (barberId: string, level: number) => {
    if (isSubmittedToday) return;
    const newLevel = Math.max(0, Math.min(7, level));
    setDraftRatings(prev => ({ ...prev, [barberId]: newLevel }));
    playSound("/sounds/bullet-hit.mp3", 0.2);
  };

  const handleFinalSubmit = async () => {
    if (!internalId || Object.keys(draftRatings).length === 0) return;

    setIsSaving(true);
    setIsSuccess(false);
    
    try {
      playSound("/sounds/reload.mp3", 0.5);
      console.log("Submitting protocol for ID:", internalId);
      
      await castMultiVote(internalId, draftRatings);
      
      setIsSuccess(true);
      setIsSubmittedToday(true);
      trackEvent("multi_vote_submitted", { count: Object.keys(draftRatings).length });
      
      // Dramatic delay before redirect to ensure they see "ZAPSÁNO"
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("Submission failed:", error);
      setIsSuccess(false);
      alert("Chyba při zápisu protokolu. Zkuste to prosím znovu.");
    } finally {
      setIsSaving(false);
    }
  };

  const rankTitles = [
    t.operatives.ranks.l0,
    t.operatives.ranks.l1,
    t.operatives.ranks.l2,
    t.operatives.ranks.l3,
    t.operatives.ranks.l4,
    t.operatives.ranks.l5,
    t.operatives.ranks.l6,
    t.operatives.ranks.l7,
  ];

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* Cinematic Background */}
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
            {lang === 'cs' ? 'Hlasování' : 'Elite'} <span className="text-white">{lang === 'cs' ? 'Elity' : 'Voting'}</span>
          </motion.h1>
          <p className="text-mafia-gold/60 font-mono tracking-[0.3em] uppercase text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            {lang === 'cs' ? 'Komunita rozhoduje o osudu. Tvůj hlas určuje hodnost, moc a prestiž v rodině MMBarberu.' : 'The community decides the fate. Your voice determines rank, power, and prestige within the MMBarber family.'}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {barbers.map((barber, idx) => {
            const barberStats = communityStats[barber.id];
            const dominantLv = getDominantLevel(barberStats);
            const currentDraftLv = draftRatings[barber.id] ?? dominantLv;
            
            const isNella = barber.id === 'nella';
            const isJune2026 = new Date() >= new Date(2026, 5, 1);
            
            // Dynamic status for preview
            const hasVotes = barberStats && Object.values(barberStats).some(v => v > 0);
            let status: 'promoted' | 'demoted' | 'stable' | 'demotedDesertion' = hasVotes 
              ? (dominantLv > (barber.rank?.level ?? 0) ? 'promoted' : (dominantLv < (barber.rank?.level ?? 0) ? 'demoted' : 'stable'))
              : (barber.rank?.status ?? 'stable');

            // Nella's Desertion override
            if (isNella && !isJune2026) {
              status = 'demotedDesertion';
            }

            return (
              <motion.div
                key={barber.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative group bg-[#050505] border-2 transition-all duration-700 overflow-hidden rounded-sm ${
                  isSubmittedToday ? "border-mafia-gold/20" : "border-white/5 hover:border-mafia-gold/30"
                }`}
              >
                <div className="p-6 md:p-8 flex flex-col gap-8">
                  {/* Header: Photo & Name */}
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
                      {isBloodMode && (
                        <div className="absolute inset-0 bg-mafia-blood/20 opacity-0 group-hover/photo:opacity-100 transition-opacity rounded-lg z-20 pointer-events-none" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl md:text-4xl font-heading font-black text-white uppercase tracking-wider group-hover:text-mafia-gold transition-colors">
                          {barber.name}
                        </h3>
                        {status && status !== 'stable' && (
                          <div className={`px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest ${status === 'promoted' ? 'bg-mafia-gold text-black' : 'bg-red-900/40 text-red-400 border border-red-500/30'}`}>
                            {status === 'promoted' 
                              ? (lang === 'cs' ? (isNella ? 'POVÝŠENA' : 'POVÝŠEN') : 'PROMOTED') 
                              : (status === 'demotedDesertion' 
                                  ? (lang === 'cs' ? 'DEGRADOVÁNA ZA DEZERCI' : 'DEMOTED FOR DESERTION')
                                  : (lang === 'cs' ? (isNella ? 'DEGRADOVÁNA' : 'DEGRADOVÁN') : 'DEMOTED')
                                )}
                          </div>
                        )}
                      </div>
                      <p className={`text-[10px] font-mono font-bold tracking-[0.3em] uppercase mt-1 ${isBloodMode ? 'text-mafia-blood' : 'text-mafia-gold'}`}>
                        RANK: {rankTitles[hasVotes ? dominantLv : (barber.rank?.level ?? 0)]}
                      </p>
                    </div>
                  </div>

                  {/* Tactical Level Picker */}
                  <div className="space-y-8 bg-white/[0.02] border border-white/5 p-6 rounded-lg backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                       <Target size={40} className="text-mafia-gold" />
                    </div>

                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 border flex items-center justify-center rounded-sm shadow-inner ${isBloodMode ? 'bg-mafia-blood/10 border-mafia-blood/20' : isNoirMode ? 'bg-white/10 border-white/20' : 'bg-mafia-gold/10 border-mafia-gold/20'}`}>
                           <MilitaryInsignia level={currentDraftLv} color={isBloodMode ? "var(--color-mafia-blood)" : isNoirMode ? "#ffffff" : "var(--color-mafia-gold)"} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em]">Úroveň protokolu</span>
                          <span className={`text-xl font-heading font-black tracking-widest leading-none mt-1 ${isBloodMode ? 'text-mafia-blood' : isNoirMode ? 'text-white' : 'text-mafia-gold'}`}>{rankTitles[currentDraftLv]}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                         <button 
                           onClick={() => handleLevelChange(barber.id, currentDraftLv - 1)}
                           disabled={isSubmittedToday || currentDraftLv <= 0}
                           className={`w-10 h-10 flex items-center justify-center border transition-all disabled:opacity-20 disabled:cursor-not-allowed ${isBloodMode ? 'border-mafia-blood/30 text-mafia-blood hover:bg-mafia-blood hover:text-white' : isNoirMode ? 'border-white/30 text-white hover:bg-white hover:text-black' : 'border-mafia-gold/30 text-mafia-gold hover:bg-mafia-gold hover:text-black'}`}
                         >
                           <Minus size={16} />
                         </button>
                         <button 
                           onClick={() => handleLevelChange(barber.id, currentDraftLv + 1)}
                           disabled={isSubmittedToday || currentDraftLv >= 7}
                           className={`w-10 h-10 flex items-center justify-center border transition-all disabled:opacity-20 disabled:cursor-not-allowed ${isBloodMode ? 'border-mafia-blood/30 text-mafia-blood hover:bg-mafia-blood hover:text-white' : isNoirMode ? 'border-white/30 text-white hover:bg-white hover:text-black' : 'border-mafia-gold/30 text-mafia-gold hover:bg-mafia-gold hover:text-black'}`}
                         >
                           <Plus size={16} />
                         </button>
                      </div>
                    </div>

                    <div className="relative h-12 flex items-center px-4">
                      {/* Slider Track */}
                      <div className="absolute inset-x-0 h-1 bg-white/5 rounded-full" />
                      
                      {/* Discrete Steps Background */}
                      <div className="absolute inset-x-0 flex justify-between px-4">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((lv) => (
                          <div 
                            key={lv}
                            className={`w-0.5 h-3 ${lv <= currentDraftLv ? "bg-mafia-gold/40" : "bg-white/10"}`}
                          />
                        ))}
                      </div>

                      {/* Interactive Slider Input */}
                      <input 
                        type="range"
                        min="0"
                        max="7"
                        step="1"
                        value={currentDraftLv}
                        disabled={isSubmittedToday}
                        onChange={(e) => handleLevelChange(barber.id, parseInt(e.target.value))}
                        className="absolute inset-x-0 w-full opacity-0 cursor-pointer h-12 z-20"
                      />

                      {/* Level Indicators (Bars) */}
                      <div className="absolute inset-x-0 flex justify-between px-0.5 pointer-events-none">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((lv) => (
                          <motion.div 
                            key={lv}
                            animate={{ 
                              height: lv === currentDraftLv ? 32 : 12,
                              opacity: lv <= currentDraftLv ? 1 : 0.05,
                              backgroundColor: lv === currentDraftLv ? (isNoirMode ? "#ffffff" : "#C5A059") : "rgba(255,255,255,0.2)",
                              boxShadow: lv === currentDraftLv ? (isBloodMode ? "0 0 25px rgba(255,0,0,0.8), 0 0 10px #C5A059" : isNoirMode ? "0 0 15px rgba(255,255,255,0.5)" : "0 0 15px rgba(197,160,89,0.5)") : "none"
                            }}
                            className="w-2 rounded-full"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Community Distribution (Mini Graph) */}
                    <div className="pt-4 border-t border-white/5">
                       <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase tracking-widest mb-3">
                         <span>Distribuce vlivu</span>
                         <div className="flex gap-1">
                           <div className="w-2 h-2 bg-mafia-gold/40" />
                           <span>Dominantní trend</span>
                         </div>
                       </div>
                       <div className="flex items-end gap-1.5 h-10 px-1">
                         {[0, 1, 2, 3, 4, 5, 6, 7].map((lv) => {
                           const count = barberStats?.[lv] || 0;
                           const total = Object.values(barberStats || {}).reduce((a, b) => a + b, 0) || 1;
                           const height = (count / total) * 100;
                           return (
                             <div key={lv} className="flex-grow bg-white/[0.02] relative group/lv border-x border-white/5 h-full">
                               <motion.div 
                                 initial={{ height: 0 }}
                                 animate={{ height: `${height}%` }}
                                 className={`w-full absolute bottom-0 transition-colors duration-500 ${lv === dominantLv ? (isBloodMode ? 'bg-mafia-blood/40' : isNoirMode ? 'bg-white/40' : 'bg-mafia-gold/40') : 'bg-white/10 group-hover/lv:bg-white/20'}`}
                               />
                               {count > 0 && (
                                 <div className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[7px] font-mono opacity-0 group-hover/lv:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-1 rounded-sm border ${isBloodMode ? 'text-mafia-blood border-mafia-blood/20' : isNoirMode ? 'text-white border-white/20' : 'text-mafia-gold border-mafia-gold/20'}`}>
                                   {count} HLASŮ
                                 </div>
                               )}
                             </div>
                           );
                         })}
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button */}
        {Object.keys(draftRatings).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky bottom-8 z-50 flex justify-center"
          >
            <button
              onClick={handleFinalSubmit}
              disabled={isSaving || isSuccess}
              className={`group relative px-12 py-6 overflow-hidden shadow-[0_0_50px_rgba(var(--color-mafia-gold-rgb),0.3)] transition-all active:scale-95 ${
                isSuccess ? "bg-green-600 shadow-[0_0_50px_rgba(22,163,74,0.5)]" : "bg-mafia-gold"
              }`}
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
              <div className="relative flex items-center gap-4">
                {isSaving ? (
                  <Settings className="w-6 h-6 text-black animate-spin" />
                ) : isSuccess ? (
                  <Check className="w-6 h-6 text-white animate-bounce" />
                ) : (
                  <ArrowRight className="w-6 h-6 text-black group-hover:translate-x-2 transition-transform" />
                )}
                <span className={`font-heading font-black text-xl tracking-[0.3em] uppercase ${isSuccess ? "text-white" : "text-black"}`}>
                  {isSaving ? "ZAPISUJI..." : isSuccess ? "ZAPSÁNO" : isSubmittedToday ? "UPRAVIT PROTOKOL" : "ZAZNAMENAT PROTOKOL"}
                </span>
              </div>
            </button>
          </motion.div>
        )}

        {isSubmittedToday && !isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6 py-10 border-t border-white/5 mt-10"
          >
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${isBloodMode ? 'border-mafia-blood text-mafia-blood' : isNoirMode ? 'border-white text-white' : 'border-mafia-gold text-mafia-gold'}`}>
              <Check size={32} />
            </div>
            <div className="text-center">
              <p className={`font-heading font-black text-2xl tracking-widest uppercase mb-2 ${isBloodMode ? 'text-mafia-blood' : isNoirMode ? 'text-white' : 'text-mafia-gold'}`}>
                Protokol byl úspěšně zaznamenán.
              </p>
              <p className="text-white/40 text-sm">Děkujeme za tvůj vliv na hierarchii rodiny.</p>
            </div>
            
            <Link href="/" className={`group flex items-center gap-4 px-10 py-4 border-2 transition-all duration-500 ${isBloodMode ? 'border-mafia-blood text-mafia-blood hover:bg-mafia-blood hover:text-white' : isNoirMode ? 'border-white text-white hover:bg-white hover:text-black' : 'border-mafia-gold text-mafia-gold hover:bg-mafia-gold hover:text-black'}`}>
              <Home size={20} />
              <span className="font-heading font-black text-lg tracking-[0.3em] uppercase">{lang === 'cs' ? 'ZPĚT NA ZÁKLADNU' : 'BACK TO HQ'}</span>
            </Link>
          </motion.div>
        )}

        <footer className="mt-20 text-center space-y-6">
          <div className="inline-flex items-center gap-4 px-6 py-3 border border-white/10 bg-white/5 rounded-full backdrop-blur-sm">
            <Flame size={20} className="text-mafia-gold animate-pulse" />
            <span className="text-[10px] font-mono text-white/60 tracking-[0.2em] uppercase">
              Vítěz dne získá titul <span className="text-mafia-gold font-bold">Barber of the Day</span> v 00:01
            </span>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-mafia-gold/5 border border-mafia-gold/20 rounded-sm">
              <Shield size={12} className="text-mafia-gold" />
              <span className="text-white/40 text-[9px] font-mono tracking-[0.1em] uppercase">
                MM-SECURE IDENTITY: {internalId ? `${internalId.substring(0, 8)}...` : "IDENTIFIKACE..."}
              </span>
            </div>
            <p className="text-white/20 text-[8px] font-mono uppercase tracking-widest">
              * Systém využívá anonymní validaci k zamezení vícenásobného hlasování.
            </p>

            {isOffline && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 px-4 py-2 bg-mafia-red/20 border border-mafia-red/40 rounded-sm"
              >
                <p className="text-mafia-red text-[9px] font-mono uppercase tracking-[0.2em] animate-pulse">
                  Pozor: Jste offline. Synchronizace s archivem přerušena.
                </p>
              </motion.div>
            )}
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
