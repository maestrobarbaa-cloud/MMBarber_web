"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getInternalIdentity } from "@/utils/identity";
import { barbers } from "@/data/barbers";
import { 
  castMultiVote, 
  getUserRatings, 
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

export default function RatingPage() {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const [internalId, setInternalId] = useState<string | null>(null);
  const [draftRatings, setDraftRatings] = useState<Record<string, BarberRating>>({});
  const [userRatings, setUserRatings] = useState<Record<string, BarberRating>>({});
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
    };

    initIdentity();
    
    const checkTheme = () => {
      setIsBloodMode(document.documentElement.classList.contains('theme-blood'));
      setIsNoirMode(document.documentElement.classList.contains('noir-mode'));
    };
    checkTheme();
    window.addEventListener('mmbarber-theme-update', checkTheme);

    const unsubscribe = subscribeToUserRatings((ratings) => {
      if (ratings) {
        setUserRatings(ratings);
        setDraftRatings(ratings);
      }
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
    const newLevel = Math.max(0, Math.min(10, level));
    setDraftRatings(prev => ({ 
      ...prev, 
      [barberId]: { 
        level: newLevel, 
        title: prev[barberId]?.title ?? newLevel 
      } 
    }));
    playSound("/sounds/bullet-hit.mp3", 0.2);
  };

  const handleTitleChange = (barberId: string, titleIndex: number) => {
    const newTitle = Math.max(0, Math.min(10, titleIndex));
    setDraftRatings(prev => ({ 
      ...prev, 
      [barberId]: { 
        ...prev[barberId],
        level: prev[barberId]?.level ?? newTitle, 
        title: newTitle,
        customTitle: prev[barberId]?.customTitle || "" // Clear or keep custom title? Let's keep it but maybe user wants both.
      } 
    }));
    playSound("/sounds/bullet-hit.mp3", 0.1);
  };

  const handleNicknameChange = (barberId: string, nickname: string) => {
    setDraftRatings(prev => ({
      ...prev,
      [barberId]: {
        ...prev[barberId],
        level: prev[barberId]?.level ?? 0,
        title: prev[barberId]?.title ?? 0,
        nickname
      }
    }));
  };

  const handleCustomTitleChange = (barberId: string, customTitle: string) => {
    setDraftRatings(prev => ({
      ...prev,
      [barberId]: {
        ...prev[barberId],
        level: prev[barberId]?.level ?? 0,
        title: prev[barberId]?.title ?? 0,
        customTitle
      }
    }));
  };

  const handlePrefixChange = (barberId: string, prefixId: string) => {
    setDraftRatings(prev => {
      const current = prev[barberId] || { level: 0, title: 0 };
      const prefixObj = TITLE_PREFIXES.find(p => p.id === prefixId);
      const suffixObj = TITLE_SUFFIXES.find(s => s.id === (current.suffix || 'none'));
      const prefixLabel = lang === 'cs' ? prefixObj?.cs : prefixObj?.en;
      const suffixLabel = lang === 'cs' ? suffixObj?.cs : suffixObj?.en;
      
      return {
        ...prev,
        [barberId]: {
          ...current,
          prefix: prefixId,
          customTitle: buildTitle(prefixLabel || "", suffixLabel || "")
        }
      };
    });
  };

  const handleSuffixChange = (barberId: string, suffixId: string) => {
    setDraftRatings(prev => {
      const current = prev[barberId] || { level: 0, title: 0 };
      const prefixObj = TITLE_PREFIXES.find(p => p.id === (current.prefix || 'none'));
      const suffixObj = TITLE_SUFFIXES.find(s => s.id === suffixId);
      const prefixLabel = lang === 'cs' ? prefixObj?.cs : prefixObj?.en;
      const suffixLabel = lang === 'cs' ? suffixObj?.cs : suffixObj?.en;
      
      return {
        ...prev,
        [barberId]: {
          ...current,
          suffix: suffixId,
          customTitle: buildTitle(prefixLabel || "", suffixLabel || "")
        }
      };
    });
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
      trackEvent("ratings_saved_locally", { count: Object.keys(draftRatings).length });
      
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
    t.operatives.ranks.l8,
    t.operatives.ranks.l9,
    t.operatives.ranks.l10,
  ];

  const TITLE_PREFIXES = [
    { id: 'none', cs: 'ŽÁDNÝ', en: 'NONE' },
    { id: 'ceo', cs: 'CEO', en: 'CEO' },
    { id: 'manager', cs: 'MANAŽER', en: 'MANAGER' },
    { id: 'general', cs: 'GENERÁL', en: 'GENERAL' },
    { id: 'marshal', cs: 'MARŠÁL', en: 'MARSHAL' },
    { id: 'lieutenant', cs: 'PORUČÍK', en: 'LIEUTENANT' },
    { id: 'recruit', cs: 'REKRUT', en: 'RECRUIT' },
    { id: 'commander', cs: 'VELITEL', en: 'COMMANDER' },
    { id: 'guardian', cs: 'STRÁŽCE', en: 'GUARDIAN' },
    { id: 'cosmetic', cs: 'KOSMETIK', en: 'COSMETICIAN' },
    { id: 'boss', cs: 'ŠÉF', en: 'BOSS' },
    { id: 'cho', cs: 'REFERENT ŠTĚSTÍ', en: 'CHIEF HAPPINESS OFFICER' },
    { id: 'visionary', cs: 'KREATIVNÍ VIZIONÁŘ', en: 'CREATIVE VISIONARY' },
    { id: 'vibe', cs: 'ŘEDITEL ATMOSFÉRY', en: 'EXECUTIVE OF VIBES' },
    { id: 'architect', cs: 'ARCHITEKT RUČNÍKŮ', en: 'TOWEL ARCHITECT' },
    { id: 'strategy', cs: 'ŠÉF STRATEGIE', en: 'HEAD OF STRATEGY' },
    { id: 'consultant', cs: 'KONZULTANT ÚČESŮ', en: 'HAIR CONSULTANT' },
    { id: 'engineer', cs: 'INŽENÝR SMETÁKU', en: 'BROOM ENGINEER' },
    { id: 'vp', cs: 'VICEPREZIDENT PRO ŠAMPON', en: 'VP OF SHAMPOO' },
    { id: 'director', cs: 'ŘEDITEL OSTRÝCH PŘEDMĚTŮ', en: 'DIRECTOR OF SHARP OBJECTS' },
    { id: 'fades', cs: 'HLAVNÍ STŘIHAČ PŘECHODŮ', en: 'HEAD OF FADES' },
  ];

  const TITLE_SUFFIXES = [
    { id: 'none', cs: 'ŽÁDNÝ', en: 'NONE' },
    { id: 'toilet', cs: 'TOALETY', en: 'OF TOILET' },
    { id: 'cleaning', cs: 'ÚKLIDU', en: 'OF CLEANING' },
    { id: 'cut', cs: 'STŘIHU', en: 'OF CUTS' },
    { id: 'flooring', cs: 'PLOVOUCÍCH KRYTIN', en: 'OF FLOORING' },
    { id: 'broom', cs: 'SMETÁKU', en: 'OF THE BROOM' },
    { id: 'towels', cs: 'ČISTÝCH RUČNÍKŮ', en: 'OF CLEAN TOWELS' },
    { id: 'washer', cs: 'MYČ HLAV', en: 'HEAD WASHER' },
    { id: 'razor', cs: 'BŘITVY', en: 'OF THE RAZOR' },
    { id: 'chair', cs: 'KŘESLA', en: 'OF THE CHAIR' },
  ];

  const buildTitle = (prefix: string, suffix: string) => {
    const noneLabel = lang === 'cs' ? 'ŽÁDNÝ' : 'NONE';
    if (prefix === noneLabel && suffix === noneLabel) return "";
    if (prefix === noneLabel) return suffix;
    if (suffix === noneLabel) return prefix;
    return `${prefix} ${suffix}`;
  };

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
            {lang === 'cs' ? 'Nastavení' : 'Elite'} <span className="text-white">{lang === 'cs' ? 'Hodností' : 'Ranks'}</span>
          </motion.h1>
          <p className="text-mafia-gold/60 font-mono tracking-[0.3em] uppercase text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            {lang === 'cs' ? 'Urči si vlastní hierarchii. Nastavené hodnosti a tituly uvidíš napříč celým systémem.' : 'Define your own hierarchy. Your chosen ranks and titles will be reflected across the entire system.'}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {barbers.map((barber, idx) => {
            const currentDraft = draftRatings[barber.id] || userRatings[barber.id] || { level: barber.rank?.level ?? 0, title: barber.rank?.level ?? 0 };

            return (
              <motion.div
                key={barber.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative group bg-[#050505] border-2 transition-all duration-700 overflow-hidden rounded-sm ${
                  Object.keys(userRatings).length > 0 ? "border-mafia-gold/20" : "border-white/5 hover:border-mafia-gold/30"
                }`}
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
                    <div className="flex-grow space-y-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">{lang === 'cs' ? 'Původní jméno:' : 'Original name:'} {barber.name}</span>
                        <input 
                          type="text"
                          placeholder={lang === 'cs' ? "Zadej přezdívku..." : "Enter nickname..."}
                          value={currentDraft.nickname || ""}
                          onChange={(e) => handleNicknameChange(barber.id, e.target.value)}
                          className="bg-transparent border-b border-white/10 text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-wider focus:border-mafia-gold outline-none transition-colors w-full"
                        />
                      </div>
                      <p className={`text-[10px] font-mono font-bold tracking-[0.3em] uppercase mt-1 ${isBloodMode ? 'text-white' : isNoirMode ? 'text-white' : 'text-mafia-gold'}`}>
                        {lang === 'cs' ? 'AKTUÁLNÍ STATUS:' : 'CURRENT STATUS:'} {currentDraft.customTitle || rankTitles[currentDraft.title]}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-12 bg-white/[0.02] border border-white/5 p-6 rounded-lg backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                       <Target size={120} className="text-mafia-gold" />
                    </div>

                    <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 border flex items-center justify-center rounded-sm shadow-inner ${isBloodMode ? 'bg-mafia-blood/10 border-mafia-blood/20' : isNoirMode ? 'bg-white/10 border-white/20' : 'bg-mafia-gold/10 border-mafia-gold/20'}`}>
                             <MilitaryInsignia level={currentDraft.level} color={isBloodMode ? "#ffffff" : isNoirMode ? "#ffffff" : "var(--color-mafia-gold)"} size={64} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em]">{lang === 'cs' ? 'Úroveň šarže' : 'Rank Level'}</span>
                            <span className={`text-sm font-heading font-black tracking-widest leading-none mt-1 ${isBloodMode ? 'text-white' : isNoirMode ? 'text-white' : 'text-mafia-gold'}`}>{lang === 'cs' ? 'STUPEŇ' : 'LEVEL'} {currentDraft.level}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                           <button onClick={() => handleLevelChange(barber.id, currentDraft.level - 1)} disabled={currentDraft.level <= 0} className="w-8 h-8 flex items-center justify-center border border-white/20 hover:bg-white/10 transition-all disabled:opacity-10"><Minus size={14} /></button>
                           <button onClick={() => handleLevelChange(barber.id, currentDraft.level + 1)} disabled={currentDraft.level >= 10} className="w-8 h-8 flex items-center justify-center border border-white/20 hover:bg-white/10 transition-all disabled:opacity-10"><Plus size={14} /></button>
                        </div>
                      </div>
                      
                      <div className="relative h-8 flex items-center px-1">
                        <div className="absolute inset-x-0 h-0.5 bg-white/10 rounded-full" />
                        <input 
                          type="range" min="0" max="10" step="1" value={currentDraft.level}
                          onChange={(e) => handleLevelChange(barber.id, parseInt(e.target.value))}
                          className="absolute inset-x-0 w-full opacity-0 cursor-pointer h-8 z-20"
                        />
                        <div className="absolute inset-x-0 flex justify-between pointer-events-none px-1">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lv) => (
                            <motion.div 
                              key={lv}
                              animate={{ 
                                height: lv === currentDraft.level ? 20 : 6,
                                opacity: lv <= currentDraft.level ? 1 : 0.1,
                                backgroundColor: lv === currentDraft.level ? (isBloodMode ? "#ffffff" : isNoirMode ? "#ffffff" : "#C5A059") : "rgba(255,255,255,0.4)"
                              }}
                              className="w-1.5 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-white/5 relative z-10">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 border flex items-center justify-center rounded-sm ${isBloodMode ? 'bg-mafia-blood/10 border-mafia-blood/20' : isNoirMode ? 'bg-white/10 border-white/20' : 'bg-mafia-gold/10 border-mafia-gold/20'}`}>
                             <UserCircle size={24} className={isBloodMode ? 'text-white' : isNoirMode ? 'text-white' : 'text-mafia-gold'} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em]">{lang === 'cs' ? 'Sestavit titul' : 'Build Title'}</span>
                            <span className={`text-base font-heading font-black tracking-widest leading-none mt-1 ${isBloodMode ? 'text-white' : isNoirMode ? 'text-white' : 'text-mafia-gold'}`}>
                              {currentDraft.customTitle || rankTitles[currentDraft.title]}
                            </span>
                          </div>
                        </div>

                        {/* Modular Builder */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest px-1">{lang === 'cs' ? 'Role / Šarže' : 'Role / Rank'}</span>
                            <div className="relative group/sel">
                              <select 
                                value={currentDraft.prefix || "none"}
                                onChange={(e) => handlePrefixChange(barber.id, e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 px-3 py-3 rounded-sm text-[11px] font-mono uppercase text-white/90 outline-none focus:border-mafia-gold focus:bg-white/5 transition-all appearance-none cursor-pointer hover:border-white/20"
                              >
                                {TITLE_PREFIXES.map(p => (
                                  <option key={p.id} value={p.id} className="bg-[#0a0a0a] text-white py-2">
                                    {lang === 'cs' ? p.cs : p.en}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover/sel:text-mafia-gold transition-colors">
                                <ChevronDown size={14} />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest px-1">{lang === 'cs' ? 'Oblast / Kontext' : 'Area / Context'}</span>
                            <div className="relative group/sel">
                              <select 
                                value={currentDraft.suffix || "none"}
                                onChange={(e) => handleSuffixChange(barber.id, e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 px-3 py-3 rounded-sm text-[11px] font-mono uppercase text-white/90 outline-none focus:border-mafia-gold focus:bg-white/5 transition-all appearance-none cursor-pointer hover:border-white/20"
                              >
                                {TITLE_SUFFIXES.map(s => (
                                  <option key={s.id} value={s.id} className="bg-[#0a0a0a] text-white py-2">
                                    {lang === 'cs' ? s.cs : s.en}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover/sel:text-mafia-gold transition-colors">
                                <ChevronDown size={14} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Manual Override */}
                        <div className="space-y-2">
                          <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{lang === 'cs' ? 'Nebo napiš vlastní' : 'Or write your own'}</span>
                          <input 
                            type="text"
                            placeholder={lang === 'cs' ? "Zadej libovolný titul..." : "Enter any title..."}
                            value={currentDraft.customTitle || ""}
                            onChange={(e) => handleCustomTitleChange(barber.id, e.target.value)}
                            className="bg-white/5 border border-white/10 px-4 py-3 rounded-sm text-[11px] font-mono uppercase tracking-widest text-white focus:border-mafia-gold outline-none transition-all w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

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
                  {isSaving ? (lang === 'cs' ? "ZAPISUJI..." : "SAVING...") : isSuccess ? (lang === 'cs' ? "ULOŽENO" : "SAVED") : (lang === 'cs' ? "ULOŽIT NASTAVENÍ" : "SAVE SETTINGS")}
                </span>
              </div>
            </button>
          </motion.div>
        )}

        {isSuccess && (
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
                {lang === 'cs' ? 'Nastavení bylo úspěšně uloženo.' : 'Settings successfully saved.'}
              </p>
              <p className="text-white/40 text-sm">{lang === 'cs' ? 'Tvoje nová hierarchie je aktivní v tvém prohlížeči.' : 'Your new hierarchy is active in your browser.'}</p>
            </div>
            
            <Link href="/" className={`group flex items-center gap-4 px-10 py-4 border-2 transition-all duration-500 ${isBloodMode ? 'border-mafia-blood text-mafia-blood hover:bg-mafia-blood hover:text-white' : isNoirMode ? 'border-white text-white hover:bg-white hover:text-black' : 'border-mafia-gold text-mafia-gold hover:bg-mafia-gold hover:text-black'}`}>
              <Home size={20} />
              <span className="font-heading font-black text-lg tracking-[0.3em] uppercase">{lang === 'cs' ? 'ZPĚT NA ZÁKLADNU' : 'BACK TO HQ'}</span>
            </Link>
          </motion.div>
        )}

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
