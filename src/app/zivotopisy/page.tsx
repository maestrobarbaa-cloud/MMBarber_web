"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "@/components/OptimizedImage";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useBarbers } from "@/contexts/BarberContext";
import { useGame } from "@/contexts/GameContext";
import { playSound } from "@/utils/audio";
import { trackEvent } from "@/utils/analytics";
import { useTranslation } from "@/hooks/useTranslation";
import { Footer } from "@/components/Footer";
import { 
  subscribeToGlobalXpStats, 
  calculateLevelFromXp, 
  getCzechRankFromLevel, 
  getEnglishRankFromLevel,
  GlobalBarberStats 
} from "@/utils/barberXp";
import { getDailyRole } from "@/utils/dailyRoles";
import { getNicknamesAction, addNicknameVoteAction, NicknamesDB } from "@/app/actions/nicknames";
import { 
  ArrowLeft, 
  Sparkles, 
  Award, 
  Star, 
  Calendar, 
  Layers, 
  Sliders, 
  Pocket, 
  CheckCircle2, 
  RefreshCw,
  Compass,
  Share2
} from "lucide-react";


export default function BiographiesPage() {
  const { lang } = useTranslation();
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalBarberStats>({});
  const { barbers, loading } = useBarbers();
  const { isTomasUnlocked, isNellaUnlocked, totalCollected } = useGame();
  
  // Custom names overrides from localStorage
  const [customTomasName, setCustomTomasName] = useState("Tomáš");
  const [customNellaName, setCustomNellaName] = useState("Nella");
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [showUnlockOverlay, setShowUnlockOverlay] = useState(false);

  const [nicknamesDb, setNicknamesDb] = useState<NicknamesDB | null>(null);
  const [newNickname, setNewNickname] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isExtendedUnlocked, setIsExtendedUnlocked] = useState(false);
  const [secretContent, setSecretContent] = useState("");
  const [secretArticles, setSecretArticles] = useState<any[]>([]);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // New State for Folders
  const [activeFolderId, setActiveFolderId] = useState('main_bio');
  
  // Cheat Code State
  const [cheatUnlocked, setCheatUnlocked] = useState(false);

  const parseSecretText = (text: string) => {
    const parts = text.split('\n');
    return parts.map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h5 key={i} className="text-mafia-gold font-heading font-black uppercase tracking-widest mb-2 mt-4 italic">{line.replace(/\*\*/g, '')}</h5>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 mb-1 list-disc text-white/80">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2"></div>;
      }
      return <p key={i} className="mb-2 leading-relaxed text-smoke-white/90">{line}</p>;
    });
  };

  const handleUnlock = async () => {
    if (!passwordInput.trim() || isUnlocking) return;
    setIsUnlocking(true);
    try {
      const res = await fetch('/api/cv-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unlock', password: passwordInput.toUpperCase(), lang })
      });
      const data = await res.json();
      if (data.success) {
        setSecretContent(data.text);
        setSecretArticles(data.articles || []);
        setIsExtendedUnlocked(true);
        setShowPasswordModal(false);
        playSound("/sounds/reload.mp3", 0.4);
      } else {
        if (data.error === 'expired_password') {
          alert(lang === 'cs' ? "Toto heslo již vypršelo." : "This password has expired.");
        } else {
          alert(lang === 'cs' ? "Přístup odepřen: Neplatné nebo expirované heslo." : "Access Denied: Invalid or expired password.");
        }
      }
    } catch (e) {
      alert("Chyba spojení.");
    }
    setIsUnlocking(false);
  };

  const fetchNicknames = useCallback(async () => {
    try {
      const db = await getNicknamesAction();
      setNicknamesDb(db);
      if (db.tomas?.topNickname) setCustomTomasName(db.tomas.topNickname);
      if (db.nella?.topNickname) setCustomNellaName(db.nella.topNickname);
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchNicknames();
    // Poll for nickname updates every 10 seconds
    const interval = setInterval(fetchNicknames, 10000);

    // Subscribe to global stats
    const unsubscribeXp = subscribeToGlobalXpStats((stats) => {
      setGlobalStats(stats);
    });

    const fetchVisibility = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          const parsed: Record<string, boolean> = {};
          if (data.values) {
            Object.entries(data.values).forEach(([key, val]) => {
              parsed[key] = val === 'true';
            });
          }
          setVisibility(parsed);
        }
      } catch (e) {}
    };
    fetchVisibility();

    return () => {
      clearInterval(interval);
      unsubscribeXp();
    };
  }, [fetchNicknames]);

  const isTomasVisible = visibility['visibility_barber_tomas'] ?? true;
  const isNellaVisible = visibility['visibility_barber_nella'] ?? true;

  // Calculate dynamic rating based on real community feedback in firebase
  const getBarberRatingData = (barberId: string) => {
    const stats = globalStats[barberId] || { xp: 0, likes: 0, stat1: 0, stat2: 0, stat3: 0, stat4: 0, stat5: 0, stat6: 0 };
    const likes = stats.likes || 0;
    
    // Sum up the dynamic attribute ratings cast by users
    const totalStatVotes = (stats.stat1 || 0) + (stats.stat2 || 0) + (stats.stat3 || 0) + (stats.stat4 || 0) + (stats.stat5 || 0) + (stats.stat6 || 0);
    const overallActions = likes + totalStatVotes;

    // Start with high baseline to look professional (e.g. 4.8), then scale organically up to 4.98 based on user likes
    const starScore = Math.min(5.0, 4.8 + Math.min(0.2, likes * 0.005));
    
    return {
      stars: starScore.toFixed(2),
      actionsCount: overallActions,
      likesCount: likes
    };
  };

  const handleSelectBarber = (id: string) => {
    setSelectedBarberId(id);
    playSound("/sounds/reload.mp3", 0.4);
    trackEvent("biography_select", { barberId: id });
  };

  const handleBackToSelection = () => {
    setSelectedBarberId(null);
    playSound("/sounds/click.mp3", 0.2);
  };

  const handleVoteNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNickname.trim() || !activeBarberSafe.id) return;
    setIsVoting(true);
    const res = await addNicknameVoteAction(activeBarberSafe.id as 'tomas' | 'nella', newNickname);
    if (res.success) {
      setNewNickname("");
      fetchNicknames();
      // Optional: show a small success message or play a sound
      playSound("/sounds/click.mp3", 0.4);
    } else {
      alert(res.error || "Chyba při hlasování.");
    }
    setIsVoting(false);
  };

  const isTomasFullyUnlocked = isTomasUnlocked || cheatUnlocked;
  const isNellaFullyUnlocked = isNellaUnlocked || cheatUnlocked;
  const effectiveTotalCollected = cheatUnlocked ? 99 : totalCollected;
  
  // Need activeBarber safe fallback early if loading is done
  const activeBarberTemp = barbers.find(b => b.id === selectedBarberId) || barbers[0] || { id: "tomas" };
  const isFullyUnlockedTemp = activeBarberTemp.id === "tomas" ? isTomasFullyUnlocked : (activeBarberTemp.id === "nella" ? isNellaFullyUnlocked : false);

  useEffect(() => {
    if (selectedBarberId && isFullyUnlockedTemp) {
      const shownKey = `mmbarber_unlock_shown_${selectedBarberId}`;
      if (!sessionStorage.getItem(shownKey)) {
        setShowUnlockOverlay(true);
        sessionStorage.setItem(shownKey, 'true');
        setTimeout(() => setShowUnlockOverlay(false), 2500);
      }
    }
  }, [selectedBarberId, isFullyUnlockedTemp]);

  if (loading || barbers.length === 0) return null;

  // Find currently active chosen barber
  const activeBarber = barbers.find(b => b.id === selectedBarberId);
  const activeBarberSafe = activeBarber || barbers[0];
  const activeCustomName = activeBarberSafe.id === "tomas" ? customTomasName : customNellaName;

  const activeStats = globalStats[activeBarberSafe.id] || { xp: 0 };
  const activeLevel = calculateLevelFromXp(activeStats.xp);
  const activeRank = lang === 'cs' 
    ? getCzechRankFromLevel(activeLevel, activeBarberSafe.id === "nella") 
    : getEnglishRankFromLevel(activeLevel);

  const activeRating = getBarberRatingData(activeBarberSafe.id);

  const isPhotoUnlocked = activeBarberSafe.id === "tomas" ? effectiveTotalCollected >= 2 : (activeBarberSafe.id === "nella" ? effectiveTotalCollected >= 4 : false);
  const isFullyUnlocked = activeBarberSafe.id === "tomas" ? isTomasFullyUnlocked : (activeBarberSafe.id === "nella" ? isNellaFullyUnlocked : false);
  
  // Calculate how many text parts to show
  // Fallback to match to avoid Safari syntax error on lookbehinds
  const textParts = activeBarberSafe.desc.match(/.*?[.?!](?:\s+|$)|.+/g)?.map(s => s.trim()) || [activeBarberSafe.desc];
  let textPartsToShow = 0;
  
  if (activeBarberSafe.id === "tomas") {
    if (effectiveTotalCollected >= 3) textPartsToShow = Math.ceil(textParts.length / 2);
    if (effectiveTotalCollected >= 4) textPartsToShow = textParts.length;
  } else if (activeBarberSafe.id === "nella") {
    if (effectiveTotalCollected >= 6) textPartsToShow = Math.floor(textParts.length / 3);
    if (effectiveTotalCollected >= 8) textPartsToShow = Math.floor(textParts.length * (2/3));
    if (effectiveTotalCollected >= 10) textPartsToShow = textParts.length;
  }
  
  if (cheatUnlocked) {
    textPartsToShow = textParts.length;
  }
  
  const visibleText = textParts.slice(0, textPartsToShow).join(' ');
  const hiddenText = textParts.slice(textPartsToShow).join(' ');

  return (
    <main className="min-h-screen bg-[#050505] text-smoke-white overflow-x-hidden selection:bg-mafia-gold selection:text-mafia-black relative flex flex-col justify-between">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(var(--color-mafia-gold-rgb),0.03)_0%,transparent_60%)] opacity-80" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      {/* Header section */}
      <header className="w-full py-6 px-8 border-b border-white/5 flex justify-between items-center z-50 backdrop-blur-md bg-mafia-black/80 sticky top-0">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2.5 text-white/50 hover:text-mafia-gold transition-colors font-mono text-[9px] uppercase tracking-[0.4em]"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>{lang === 'cs' ? "Zpět na základnu" : "Back Home"}</span>
        </Link>
        <span className="font-heading font-black text-base tracking-[0.3em] text-mafia-gold logo-neon">MMBARBER</span>
      </header>

      {/* Main Container */}
      <div className="flex-grow max-w-6xl mx-auto w-full px-6 py-12 md:py-16 z-10 flex flex-col justify-center gap-12">
        
        <AnimatePresence mode="wait">
          {!selectedBarberId ? (
            /* SELECTION GRID MODE */
            <motion.div
              key="selection-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Title Block */}
              <div className="text-center space-y-4 max-w-xl mx-auto">
                <span className="text-mafia-gold text-[10px] font-mono tracking-[0.4em] uppercase block">
                  {lang === 'cs' ? "DOKUMENTACE OPERATIVCŮ" : "OPERATIVE PERSONNEL REGISTRY"}
                </span>
                <h1 className="text-4xl md:text-5xl font-heading font-black text-smoke-white uppercase tracking-tight leading-none">
                  {lang === 'cs' ? "ŽIVOTOPISY BARBERŮ" : "BARBERS' BIOGRAPHIES"}
                </h1>
                <p className="text-xs text-white/40 leading-relaxed max-w-sm mx-auto">
                  {lang === 'cs'
                    ? "Vyberte si složku jednoho z našich kadeřnických operativců pro detailní taktický životopis, přehled dovedností a hodnocení."
                    : "Select a profile folder for an in-depth dossier covering tactical backgrounds, community reviews, and combat skills."}
                </p>
              </div>

              {/* Fragment Warning */}
              {totalCollected < 10 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-2xl mx-auto border border-mafia-gold/50 bg-mafia-gold/10 p-6 rounded-sm text-center shadow-[0_0_20px_rgba(197,160,89,0.15)] flex flex-col items-center gap-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mafia-gold/80 to-transparent"></div>
                  <Compass className="text-mafia-gold animate-pulse" size={28} />
                  <h3 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-lg md:text-xl">
                    {lang === 'cs' ? "ZKOMPLETUJTE ŽIVOTOPISY" : "COMPLETE THE BIOGRAPHIES"}
                  </h3>
                  <p className="text-xs md:text-sm font-mono text-smoke-white/90 leading-relaxed max-w-lg mx-auto">
                    {lang === 'cs' 
                      ? "Některá data jsou stále zašifrována. Běžte na hlavní stránku, hledejte skryté otisky prstů (fragmenty) a postupně odemykejte plné profily operativců!" 
                      : "Some data is still encrypted. Go to the homepage, find hidden fingerprints (fragments), and gradually unlock full operative profiles!"}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 border border-mafia-gold/30 bg-mafia-black px-4 py-2 rounded-sm text-[10px] font-mono text-mafia-gold uppercase tracking-[0.3em]">
                    {lang === 'cs' ? `Nalezeno fragmentů: ${effectiveTotalCollected} / 10` : `Fragments found: ${effectiveTotalCollected} / 10`}
                  </div>
                </motion.div>
              )}

              {/* Hierarchy Tree */}
              <div className="w-full flex flex-col items-center relative py-8 px-4 mx-auto">
                 {/* LEVEL 1: Boss */}
                 {isTomasVisible && (
                   <div className="w-full flex justify-center relative z-20">
                      {(() => {
                         const tomas = barbers.find(b => b.id === "tomas");
                       if (!tomas) return null;
                       const customName = customTomasName;
                       
                       const isTomasHierarchyUnlocked = effectiveTotalCollected >= 1;
                       
                       if (!isTomasHierarchyUnlocked) {
                         return (
                           <div className="flex flex-col items-center opacity-60">
                             <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-mafia-gold/30 overflow-hidden mx-auto bg-black flex items-center justify-center relative">
                               <span className="text-6xl font-heading font-black text-mafia-gold/20 italic animate-pulse">?</span>
                             </div>
                             <div className="mt-6 text-center">
                               <span className="text-mafia-gold/40 text-[10px] font-mono tracking-[0.3em] uppercase block mb-1">HLEDANÝ REKRUT</span>
                               <h2 className="text-2xl font-heading font-black text-white/50 uppercase tracking-widest italic">???</h2>
                             </div>
                           </div>
                         );
                       }
                       
                       return (
                         <div 
                           onClick={() => handleSelectBarber("tomas")}
                           className="flex flex-col items-center group cursor-pointer"
                         >
                           <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-mafia-gold overflow-hidden mx-auto transition-colors relative shadow-[0_0_20px_rgba(197,160,89,0.3)] group-hover:shadow-[0_0_40px_rgba(197,160,89,0.6)]">
                             <Image src={tomas.image} alt={customName} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                           </div>
                           <div className="mt-6 text-center">
                              <span className="text-mafia-gold/60 text-[10px] font-mono tracking-[0.3em] uppercase block mb-1">{getDailyRole("tomas", lang)}</span>
                              <h2 className="text-3xl font-heading font-black text-white group-hover:text-mafia-gold transition-colors uppercase tracking-widest italic">{customName}</h2>
                           </div>
                         </div>
                       );
                      })()}
                   </div>
                 )}

                 {/* SVG SPOJNICE */}
                 <div className="hidden md:block w-full max-w-[800px] h-[80px] relative -my-4 z-10 pointer-events-none">
                    <svg className="w-full h-full" preserveAspectRatio="none">
                       <line x1="50%" y1="0" x2="50%" y2="50%" stroke="var(--color-mafia-gold)" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="6,4" />
                       <line x1="16.66%" y1="50%" x2="83.33%" y2="50%" stroke="var(--color-mafia-gold)" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="6,4" />
                       <line x1="16.66%" y1="50%" x2="16.66%" y2="100%" stroke="var(--color-mafia-gold)" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="6,4" />
                       <line x1="50%" y1="50%" x2="50%" y2="100%" stroke="var(--color-mafia-gold)" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="6,4" />
                       <line x1="83.33%" y1="50%" x2="83.33%" y2="100%" stroke="var(--color-mafia-gold)" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="6,4" />
                    </svg>
                 </div>
                 <div className="md:hidden w-px h-16 bg-gradient-to-b from-mafia-gold/40 to-transparent my-4"></div>

                 {/* LEVEL 2: Underbosses */}
                 <div className="w-full max-w-[1000px] flex flex-col md:flex-row justify-center items-center md:items-start gap-12 relative z-20">
                    
                    {/* Nella */}
                    {isNellaVisible && (
                      <div className="flex-1 flex justify-center">
                         {(() => {
                           const nella = barbers.find(b => b.id === "nella");
                         if (!nella) return null;
                         const customName = customNellaName;
                         
                         const isNellaHierarchyUnlocked = effectiveTotalCollected >= 2;

                         if (!isNellaHierarchyUnlocked) {
                           return (
                             <div className="flex flex-col items-center opacity-60">
                               <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-mafia-gold/30 overflow-hidden mx-auto bg-black flex items-center justify-center relative">
                                 <span className="text-6xl font-heading font-black text-mafia-gold/20 italic animate-pulse">?</span>
                               </div>
                               <div className="mt-6 text-center">
                                 <span className="text-mafia-gold/40 text-[10px] font-mono tracking-[0.3em] uppercase block mb-1">HLEDANÝ REKRUT</span>
                                 <h2 className="text-2xl font-heading font-black text-white/50 uppercase tracking-widest italic">???</h2>
                               </div>
                             </div>
                           );
                         }

                         return (
                           <div 
                             onClick={() => handleSelectBarber("nella")}
                             className="flex flex-col items-center group cursor-pointer"
                           >
                             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-mafia-gold overflow-hidden mx-auto transition-colors relative shadow-[0_0_20px_rgba(197,160,89,0.3)] group-hover:shadow-[0_0_40px_rgba(197,160,89,0.6)]">
                               <Image src={nella.image} alt={customName} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                             </div>
                             <div className="mt-6 text-center">
                                <span className="text-mafia-gold/60 text-[10px] font-mono tracking-[0.3em] uppercase block mb-1">{getDailyRole("nella", lang)}</span>
                                <h2 className="text-2xl font-heading font-black text-white group-hover:text-mafia-gold transition-colors uppercase tracking-widest italic">{customName}</h2>
                             </div>
                           </div>
                         );
                       })()}
                      </div>
                    )}

                    {/* Unknown 1 */}
                    <div className="flex-1 flex justify-center">
                         <div className="flex flex-col items-center opacity-60">
                           <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-mafia-gold/30 overflow-hidden mx-auto bg-black flex items-center justify-center relative">
                              <span className="text-6xl font-heading font-black text-mafia-gold/20 italic animate-pulse">?</span>
                           </div>
                           <div className="mt-6 text-center">
                              <span className="text-mafia-gold/40 text-[10px] font-mono tracking-[0.3em] uppercase block mb-1">HLEDANÝ REKRUT</span>
                              <h2 className="text-2xl font-heading font-black text-white/50 uppercase tracking-widest italic">???</h2>
                           </div>
                         </div>
                    </div>

                    {/* Unknown 2 */}
                    <div className="flex-1 flex justify-center">
                         <div className="flex flex-col items-center opacity-60">
                           <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-mafia-gold/30 overflow-hidden mx-auto bg-black flex items-center justify-center relative">
                              <span className="text-6xl font-heading font-black text-mafia-gold/20 italic animate-pulse">?</span>
                           </div>
                           <div className="mt-6 text-center">
                              <span className="text-mafia-gold/40 text-[10px] font-mono tracking-[0.3em] uppercase block mb-1">HLEDANÝ REKRUT</span>
                              <h2 className="text-2xl font-heading font-black text-white/50 uppercase tracking-widest italic">???</h2>
                           </div>
                         </div>
                    </div>

                 </div>
              </div>
            </motion.div>
          ) : (
            /* DOSSIER DETAIL MODE */
            <motion.div
              key="barber-dossier"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="bg-mafia-black/95 border border-white/10 p-6 md:p-12 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] rounded-sm"
            >
              {/* Gold Scanner line decoration */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-mafia-gold/30 to-transparent pointer-events-none" />

              {/* Back Link inside dossier */}
              <button 
                onClick={handleBackToSelection}
                className="group inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors font-mono text-[9px] uppercase tracking-[0.3em] mb-8"
              >
                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                <span>{lang === 'cs' ? "Zpět na hierarchii" : "Back to Hierarchy"}</span>
              </button>

              {/* Main Dossier Grid */}
              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                
                {/* LEFT PORTRAIT COLUMN */}
                <div className="lg:col-span-4 order-1">
                  
                  {/* Photo Frame */}
                  <div className={`w-full aspect-square relative rounded-sm border overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-1000 ${isPhotoUnlocked ? 'border-mafia-gold/50' : 'border-white/10'}`}>
                    <Image 
                      src={activeBarberSafe.image} 
                      alt={activeCustomName} 
                      fill 
                      priority
                      className={`object-cover transition-all duration-1000 ${!isPhotoUnlocked ? 'grayscale blur-xl brightness-50 opacity-40' : 'grayscale-0 blur-0 brightness-100 opacity-100'}`} 
                    />
                    
                    {!isPhotoUnlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-80 mix-blend-overlay"></div>
                    )}
                    
                    {!isPhotoUnlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <span className="text-mafia-gold/50 font-mono text-xs uppercase tracking-widest animate-pulse border border-mafia-gold/20 bg-mafia-black/80 px-4 py-2 rounded backdrop-blur-sm shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                          [ FOTOGRAFIE BLOKOVÁNA ]
                        </span>
                      </div>
                    )}
                  </div>

                </div>

                {/* RIGHT FOLDERS COLUMN (Tab navigation) */}
                <div className="lg:col-span-3 order-2 lg:order-3 w-full overflow-x-auto pb-4 lg:pb-0 hide-scrollbar pt-2">
                  <div className="flex flex-row lg:flex-col gap-3 lg:gap-4 min-w-max lg:min-w-0 pr-4 lg:pr-0 pl-2 lg:pl-0 lg:border-l-2 lg:border-white/10 lg:pl-0">
                    
                    {/* Základní profil */}
                    <button
                      onClick={() => { setActiveFolderId('main_bio'); playSound("/sounds/paper.mp3", 0.4); }}
                      className={`relative px-5 py-5 text-left transition-all duration-500 overflow-hidden min-w-[180px] lg:min-w-full shadow-lg flex flex-col justify-center
                        ${activeFolderId === 'main_bio' 
                          ? 'border-l-4 border-b-4 lg:border-b-0 border-mafia-gold bg-gradient-to-r from-mafia-gold/20 via-mafia-black/90 to-black lg:-ml-[2px] scale-[1.02] z-10' 
                          : 'border-l-2 border-white/20 bg-black/60 hover:bg-white/5 hover:border-mafia-gold/50 opacity-70 hover:opacity-100'}
                        rounded-tr-md rounded-br-md`}
                    >
                      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-overlay pointer-events-none"></div>
                      <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex items-center gap-3">
                          <Layers size={18} className={activeFolderId === 'main_bio' ? 'text-mafia-gold' : 'text-white/40'} />
                          <span className={`text-xs md:text-sm font-heading font-black uppercase tracking-[0.2em] ${activeFolderId === 'main_bio' ? 'text-mafia-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'text-white/60'}`}>
                            {lang === 'cs' ? 'Základní složka' : 'Main Dossier'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between opacity-50 pl-7">
                          <div className="font-mono text-[8px] tracking-[0.4em] text-white/50">REF: MB-001</div>
                          {activeFolderId === 'main_bio' && <div className="w-1.5 h-1.5 rounded-full bg-mafia-gold shadow-[0_0_5px_var(--color-mafia-gold)] animate-pulse"></div>}
                        </div>
                      </div>
                    </button>

                    {/* Tajný životopis (pouze Tomáš) */}
                    {activeBarberSafe.id === 'tomas' && (
                      <button
                        onClick={() => { setActiveFolderId('secret_cv'); playSound("/sounds/paper.mp3", 0.4); }}
                        className={`relative px-5 py-5 text-left transition-all duration-500 overflow-hidden min-w-[180px] lg:min-w-full shadow-lg flex flex-col justify-center
                          ${activeFolderId === 'secret_cv' 
                            ? 'border-l-4 border-b-4 lg:border-b-0 border-mafia-gold bg-gradient-to-r from-mafia-gold/20 via-mafia-black/90 to-black lg:-ml-[2px] scale-[1.02] z-10' 
                            : 'border-l-2 border-white/20 bg-black/60 hover:bg-white/5 hover:border-mafia-gold/50 opacity-70 hover:opacity-100'}
                          rounded-tr-md rounded-br-md`}
                      >
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-overlay pointer-events-none"></div>
                        <div className="flex flex-col gap-2 relative z-10">
                          <div className="flex items-center gap-3">
                            <Sliders size={18} className={activeFolderId === 'secret_cv' ? 'text-mafia-gold' : 'text-white/40'} />
                            <span className={`text-xs md:text-sm font-heading font-black uppercase tracking-[0.2em] ${activeFolderId === 'secret_cv' ? 'text-mafia-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'text-white/60'}`}>
                              {lang === 'cs' ? 'Tajný spis' : 'Secret Dossier'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between opacity-50 pl-7">
                            <div className="font-mono text-[8px] tracking-[0.4em] text-mafia-gold/80">CLASS: TOP SECRET</div>
                            {activeFolderId === 'secret_cv' && <div className="w-1.5 h-1.5 rounded-full bg-mafia-gold shadow-[0_0_5px_var(--color-mafia-gold)] animate-pulse"></div>}
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Nový zablokovaný spis (Projekt X) */}
                    {activeBarberSafe.id === 'tomas' && (
                      <button
                        onClick={() => {
                           if (effectiveTotalCollected >= 12) {
                             setActiveFolderId('classified_1'); 
                             playSound("/sounds/paper.mp3", 0.4);
                           } else {
                             playSound("/sounds/click.mp3", 0.4);
                           }
                        }}
                        className={`relative px-5 py-5 text-left transition-all duration-500 overflow-hidden min-w-[180px] lg:min-w-full shadow-lg flex flex-col justify-center
                          ${effectiveTotalCollected < 12 ? 'opacity-40 cursor-not-allowed grayscale' : ''}
                          ${activeFolderId === 'classified_1' 
                            ? 'border-l-4 border-b-4 lg:border-b-0 border-mafia-gold bg-gradient-to-r from-mafia-gold/20 via-mafia-black/90 to-black lg:-ml-[2px] scale-[1.02] z-10' 
                            : 'border-l-2 border-white/20 bg-black/60 hover:bg-white/5 hover:border-mafia-gold/50 opacity-70 hover:opacity-100'}
                          rounded-tr-md rounded-br-md`}
                      >
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-overlay pointer-events-none"></div>
                        
                        {/* Diagonální proužky (varování) pokud je zamčeno */}
                        {effectiveTotalCollected < 12 && (
                           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, #c5a059 10px, #c5a059 20px)" }}></div>
                        )}

                        <div className="flex flex-col gap-2 relative z-10">
                           <div className="flex items-center gap-3">
                             <Pocket size={18} className={activeFolderId === 'classified_1' ? 'text-mafia-gold' : 'text-white/40'} />
                             <span className={`text-xs md:text-sm font-heading font-black uppercase tracking-[0.2em] ${activeFolderId === 'classified_1' ? 'text-mafia-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'text-white/60'}`}>
                               {lang === 'cs' ? 'Spis Projekt X' : 'Project X File'}
                             </span>
                           </div>
                           <div className="flex items-center justify-between pl-7">
                             {effectiveTotalCollected < 12 ? (
                                <div className="text-[8px] font-mono text-mafia-gold font-bold uppercase tracking-widest bg-mafia-gold/20 border border-mafia-gold/50 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(197,160,89,0.2)]">
                                  {lang === 'cs' ? 'Vyžaduje 12 fragmentů' : 'Requires 12 fragments'}
                                </div>
                             ) : (
                                <>
                                  <div className="font-mono text-[8px] tracking-[0.4em] text-white/50 opacity-50">REF: X-992</div>
                                  {activeFolderId === 'classified_1' && <div className="w-1.5 h-1.5 rounded-full bg-mafia-gold shadow-[0_0_5px_var(--color-mafia-gold)] animate-pulse"></div>}
                                </>
                             )}
                           </div>
                        </div>
                      </button>
                    )}

                  </div>
                </div>

                {/* MIDDLE DETAILED BIO COLUMN */}
                <div className="lg:col-span-5 space-y-8 order-3 lg:order-2 w-full lg:pr-4">
                  
                  {/* Title & Rank header */}
                  <div className="space-y-2 text-left">
                    <span className="text-mafia-gold text-[10px] font-mono tracking-[0.3em] uppercase block">
                      {lang === 'cs' ? getDailyRole(activeBarberSafe.id, lang) : "SPECIALIST"}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tight italic">
                      {activeCustomName}
                    </h2>
                    
                    {/* Hlasování o přezdívce */}
                    <div className="mt-4 p-4 border border-white/10 bg-black/50 rounded-sm">
                      <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-3">
                        {lang === 'cs' ? "Návrhy komunity na přezdívku:" : "Community nickname suggestions:"}
                      </p>
                      
                      {/* Top suggestions tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {nicknamesDb?.[activeBarberSafe.id as 'tomas'|'nella']?.suggestions && 
                         Object.entries(nicknamesDb[activeBarberSafe.id as 'tomas'|'nella'].suggestions)
                           .sort((a, b) => b[1] - a[1])
                           .slice(0, 5) // Show top 5
                           .map(([name, votes]) => (
                             <button
                               key={name}
                               onClick={() => { setNewNickname(name); }}
                               className="px-2 py-1 text-[10px] font-mono uppercase bg-white/5 border border-white/10 hover:border-mafia-gold hover:text-mafia-gold transition-colors rounded text-white/70 flex items-center gap-2"
                             >
                               <span>{name}</span>
                               <span className="text-mafia-gold/50">[{votes}]</span>
                             </button>
                         ))}
                      </div>

                      {/* Vote Form */}
                      <form onSubmit={handleVoteNickname} className="flex gap-2">
                        <input
                          type="text"
                          maxLength={20}
                          value={newNickname}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.toLowerCase() === "open") {
                              setCheatUnlocked(true);
                              setNewNickname("");
                              playSound("/sounds/reload.mp3", 0.5);
                            } else {
                              setNewNickname(val);
                            }
                          }}
                          placeholder={lang === 'cs' ? "Navrhni novou přezdívku..." : "Suggest a new nickname..."}
                          className="flex-grow bg-black border border-white/20 p-2 text-white font-mono text-xs focus:border-mafia-gold focus:outline-none rounded-sm transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={!newNickname.trim() || isVoting}
                          className="px-4 py-2 bg-mafia-gold/20 text-mafia-gold border border-mafia-gold/50 hover:bg-mafia-gold hover:text-black font-mono text-[10px] uppercase tracking-widest rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isVoting ? "..." : (lang === 'cs' ? "HLASOVAT" : "VOTE")}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Conditional Rendering of Content based on Active Folder */}
                  <AnimatePresence mode="wait">
                    {activeFolderId === 'main_bio' && (
                      <motion.div 
                        key="folder_main"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* Backstory */}
                        <div className="space-y-3 text-left relative min-h-[200px]">
                          <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                            {lang === 'cs' ? "O BARBEROVI & BIOGRAFIE" : "ABOUT & BIOGRAPHY"}
                          </h4>
                          
                          {!isFullyUnlocked && visibleText.length === 0 ? (
                            <div className="absolute inset-0 pt-6 flex flex-col items-center justify-center bg-mafia-black/80 backdrop-blur-[2px] z-10 border border-mafia-gold/20 rounded">
                              <span className="text-mafia-gold/50 font-mono text-xs uppercase tracking-widest animate-pulse mb-2">
                                [ DATA UZAMČENA / FRAGMENTY CHYBÍ ]
                              </span>
                              <p className="text-white/30 text-xs font-mono max-w-[80%] text-center">
                                Najdi všechny otisky/fragmenty na domovské stránce k odemčení kompletního profilu operativce.
                              </p>
                            </div>
                          ) : (
                            <motion.div 
                              initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            >
                              {isFullyUnlocked && (
                                 <div className="mb-4 inline-flex items-center gap-2 border border-mafia-gold/30 bg-mafia-gold/10 px-3 py-1 rounded text-mafia-gold font-mono text-[9px] uppercase tracking-widest shadow-[0_0_10px_rgba(197,160,89,0.2)]">
                                   <CheckCircle2 size={10} />
                                   {lang === 'cs' ? "Úspěšně sestaveno z útržků" : "Successfully assembled from fragments"}
                                 </div>
                              )}
                              <div className="text-base text-smoke-white/90 font-sans leading-relaxed relative flex flex-wrap gap-1 whitespace-pre-wrap">
                                {visibleText && <span className="animate-fade-in-up">{visibleText}</span>}
                                {!isFullyUnlocked && hiddenText && (
                                  <span className="blur-sm opacity-30 select-none bg-white/5 inline-block text-transparent bg-clip-text" style={{ textShadow: "0 0 8px rgba(255,255,255,0.5)" }}>
                                    {hiddenText.replace(/[a-zA-Z]/g, '█')}
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {activeFolderId === 'secret_cv' && activeBarberSafe.id === 'tomas' && (
                      <motion.div
                        key="folder_secret"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-4">
                          {lang === 'cs' ? "TAJNÝ SPIS - NEJVYŠŠÍ UTAJENÍ" : "SECRET DOSSIER - TOP SECRET"}
                        </h4>

                        {!isExtendedUnlocked ? (
                           <div className="border border-mafia-gold/30 bg-mafia-gold/5 p-8 rounded-sm text-center flex flex-col items-center gap-4">
                             <Sliders size={32} className="text-mafia-gold/50" />
                             <h3 className="font-heading font-black text-mafia-gold uppercase tracking-widest">
                               ŠIFROVANÝ DOKUMENT
                             </h3>
                             <p className="text-xs text-white/50 font-mono max-w-sm mb-4">
                               K odpečetění této složky potřebuješ heslo, které poskytuje pouze vedení v centrále.
                             </p>
                             <button 
                               onClick={() => setShowPasswordModal(true)}
                               className="text-[10px] font-mono uppercase tracking-widest text-mafia-black bg-mafia-gold px-6 py-3 hover:bg-white hover:text-black transition-colors rounded shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                             >
                               {lang === 'cs' ? "ZADAT HESLO" : "ENTER PASSWORD"}
                             </button>
                           </div>
                        ) : (
                           <motion.div 
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             className="mt-4 p-6 border border-mafia-gold/30 bg-mafia-gold/5 text-smoke-white/90 font-sans leading-relaxed text-sm shadow-[inset_0_0_20px_rgba(197,160,89,0.05)] rounded-sm relative"
                           >
                              <div className="absolute top-0 left-0 w-2 h-full bg-mafia-gold/50" />
                              <h5 className="text-mafia-gold font-heading font-black uppercase tracking-widest mb-2 italic">Odlečněno (Stupeň utajení 0)</h5>
                              <div className="mb-4">
                                {parseSecretText(secretContent)}
                              </div>

                              {secretArticles.length > 0 && (
                                <div className="mt-8 space-y-6 border-t border-mafia-gold/20 pt-8 mb-6">
                                    <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest italic mb-6">
                                        {lang === 'cs' ? 'Archiv Bádání & Záznamy' : 'Research Archive & Logs'}
                                    </h4>
                                    {secretArticles.map((article: any) => (
                                        <div key={article.id} className="bg-black/40 border border-white/5 p-6 rounded-sm relative">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-mafia-gold/30" />
                                            {article.title && (
                                                <h5 className="text-white font-bold uppercase tracking-wider mb-3">{article.title}</h5>
                                            )}
                                            <div className="text-sm text-smoke-white/80 leading-relaxed whitespace-pre-wrap">
                                                {article.content}
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-mafia-gold/40 font-mono uppercase tracking-widest">
                                                {lang === 'cs' ? 'Záznam pořízen:' : 'Log Date:'} {new Date(article.createdAt).toLocaleDateString(lang === 'cs' ? 'cs-CZ' : 'en-US')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                              )}
                              
                              <div className="w-full h-px bg-white/10 my-4"></div>
                              
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <p className="text-mafia-gold/50 font-mono text-xs uppercase tracking-widest max-w-sm">
                                  {lang === 'cs'
                                    ? "Tato část životopisu je exkluzivně pro loajální klienty. Jsem rád, že jsi tu s námi."
                                    : "This part of the biography is exclusive to loyal clients. I'm glad you're here with us."}
                                </p>
                                
                                <button 
                                  onClick={() => {
                                    if (navigator.share) {
                                      navigator.share({
                                        title: 'MMBarber - Tajný Životopis',
                                        url: window.location.href
                                      }).catch(console.error);
                                    } else {
                                      navigator.clipboard.writeText(window.location.href);
                                      setIsCopied(true);
                                      setTimeout(() => setIsCopied(false), 2000);
                                    }
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 border border-mafia-gold/30 hover:bg-mafia-gold hover:text-black transition-colors rounded text-[10px] font-mono uppercase tracking-widest text-mafia-gold whitespace-nowrap"
                                >
                                  <Share2 size={14} />
                                  {isCopied ? (lang === 'cs' ? "Zkopírováno!" : "Copied!") : (lang === 'cs' ? "Máš svého šéfa? Pošli mu to!" : "Have a boss? Share this!")}
                                </button>
                              </div>
                           </motion.div>
                         )}
                      </motion.div>
                    )}

                    {activeFolderId === 'classified_1' && activeBarberSafe.id === 'tomas' && (
                      <motion.div
                        key="folder_classified1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 border border-white/10 p-6 rounded-sm bg-black/40"
                      >
                        <h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-4">
                          {lang === 'cs' ? "PROJEKT X - PRACOVNÍ SLOŽKA" : "PROJECT X - WORK FILE"}
                        </h4>
                        <div className="text-sm text-smoke-white/80 leading-relaxed space-y-4">
                          <p>Tato složka byla odemčena díky sbírání fragmentů. Brzy zde přibudou další informace o zákulisí MMBARBER a plánech do budoucna.</p>
                          <p className="italic text-white/40">Záznam končí...</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Call to action & switch bar */}
                  <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
                    
                    <a
                      href={activeBarberSafe.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow py-4 bg-mafia-gold text-mafia-black font-heading font-black tracking-[0.25em] uppercase text-xs flex items-center justify-center gap-2 rounded shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.25)] hover:bg-white hover:border-white transition-all cursor-pointer"
                    >
                      <Calendar size={14} />
                      <span>{lang === 'cs' ? "REZERVOVAT KŘESLO" : "BOOK A CHAIR"}</span>
                    </a>

                    {((activeBarberSafe.id === "tomas" && isNellaVisible) || (activeBarberSafe.id === "nella" && isTomasVisible)) && (
                      <button
                        onClick={() => handleSelectBarber(activeBarberSafe.id === "tomas" ? "nella" : "tomas")}
                        className="py-3.5 px-6 bg-transparent border border-white/10 hover:border-white/30 text-white/60 hover:text-white font-mono text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all cursor-pointer rounded"
                      >
                        <RefreshCw size={12} />
                        <span>
                          {lang === 'cs' 
                            ? `Přepnout na ${activeBarberSafe.id === "tomas" ? customNellaName : customTomasName}`
                            : `Switch to ${activeBarberSafe.id === "tomas" ? customNellaName : customTomasName}`}
                        </span>
                      </button>
                    )}

                  </div>

                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showUnlockOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="text-center"
              >
                <div className="mb-6 mx-auto w-24 h-24 border-4 border-mafia-gold rounded-full flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(197,160,89,0.5)]">
                  <CheckCircle2 size={48} className="text-mafia-gold" />
                </div>
                <h2 className="text-4xl md:text-6xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-4 drop-shadow-[0_0_10px_rgba(197,160,89,0.8)]">
                  PŘÍSTUP ODEMČEN
                </h2>
                <p className="font-mono text-white/50 tracking-widest uppercase">
                  Data kompletně dešifrována a sestavena
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-mafia-black border border-mafia-gold/50 p-8 md:p-12 max-w-md w-full relative shadow-[0_0_50px_rgba(197,160,89,0.2)] text-center rounded-sm"
              >
                <button 
                  onClick={() => setShowPasswordModal(false)}
                  className="absolute top-4 right-4 text-white/30 hover:text-white font-mono text-xs uppercase tracking-widest"
                >
                  [ ZAVŘÍT ]
                </button>
                <h3 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-6 italic">
                  {lang === 'cs' ? "Autorizace nutná" : "Authorization Required"}
                </h3>
                <input 
                  type="password"
                  value={passwordInput}
                  maxLength={17}
                  onChange={(e) => {
                    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                    if (val === "OPEN") {
                      setCheatUnlocked(true);
                      setPasswordInput("");
                      playSound("/sounds/reload.mp3", 0.5);
                      setShowPasswordModal(false);
                      return;
                    }
                    let formatted = '';
                    if (val.length > 0) formatted = val.substring(0, 7);
                    if (val.length > 7) formatted += '-' + val.substring(7, 11);
                    if (val.length > 11) formatted += '-' + val.substring(11, 15);
                    setPasswordInput(formatted);
                  }}
                  className="w-full bg-black/50 border border-white/20 p-4 text-white text-center font-mono tracking-[0.5em] uppercase focus:border-mafia-gold focus:outline-none mb-6 rounded-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                  placeholder="KRYPTON-XXXX-XXXX"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnlock();
                    }
                  }}
                  disabled={isUnlocking}
                />
                <button 
                  onClick={handleUnlock}
                  disabled={isUnlocking}
                  className="w-full py-4 bg-mafia-gold text-black font-black uppercase tracking-[0.3em] mb-8 hover:bg-white transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUnlocking ? "..." : (lang === 'cs' ? "ODEMKNOUT DATA" : "UNLOCK DATA")}
                </button>
                <div className="w-12 h-px bg-mafia-gold/30 mx-auto mb-6"></div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">
                  {lang === 'cs' 
                    ? "Pokud chceš bližší životopis, dostav se k nám na křeslo. Tomáš ti dá heslo osobně." 
                    : "If you want the detailed biography, visit us in person. Tomas will give you the password."}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
