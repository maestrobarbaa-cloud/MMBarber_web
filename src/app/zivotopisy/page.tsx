"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useBarbers } from "@/contexts/BarberContext";
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
  Compass
} from "lucide-react";


export default function BiographiesPage() {
  const { lang } = useTranslation();
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalBarberStats>({});
  const { barbers, loading } = useBarbers();
  
  // Custom names overrides from localStorage
  const [customTomasName, setCustomTomasName] = useState("Tomáš");
  const [customNellaName, setCustomNellaName] = useState("Nella");
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  const syncLocalStorageData = useCallback(() => {
    const savedTomas = localStorage.getItem("mmbarber_custom_name_tomas");
    const savedNella = localStorage.getItem("mmbarber_custom_name_nella");
    if (savedTomas) setCustomTomasName(savedTomas);
    if (savedNella) setCustomNellaName(savedNella);
  }, []);

  useEffect(() => {
    syncLocalStorageData();

    const handleStorageUpdate = () => {
      syncLocalStorageData();
    };
    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("mmbarber_names_updated", handleStorageUpdate);

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
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("mmbarber_names_updated", handleStorageUpdate);
      unsubscribeXp();
    };
  }, [syncLocalStorageData]);

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

              {/* Hierarchy Tree */}
              <div className="w-full flex flex-col items-center relative py-8 px-4 mx-auto">
                 {/* LEVEL 1: Boss */}
                 {isTomasVisible && (
                   <div className="w-full flex justify-center relative z-20">
                      {(() => {
                         const tomas = barbers.find(b => b.id === "tomas");
                       if (!tomas) return null;
                       const customName = customTomasName;
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
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* LEFT PORTRAIT COLUMN */}
                <div className="lg:col-span-5">
                  
                  {/* Photo Frame */}
                  <div className="w-full aspect-square relative rounded-sm border border-white/10 overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                    <Image 
                      src={activeBarberSafe.image} 
                      alt={activeCustomName} 
                      fill 
                      priority
                      className="object-cover" 
                    />
                  </div>

                </div>

                {/* RIGHT DETAILED BIO COLUMN */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* Title & Rank header */}
                  <div className="space-y-2 text-left">
                    <span className="text-mafia-gold text-[10px] font-mono tracking-[0.3em] uppercase block">
                      {lang === 'cs' ? getDailyRole(activeBarberSafe.id, lang) : "SPECIALIST"}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tight italic">
                      {activeCustomName}
                    </h2>
                  </div>

                  {/* Backstory */}
                  <div className="space-y-3 text-left">
                    <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                      {lang === 'cs' ? "O BARBEROVI & BIOGRAFIE" : "ABOUT & BIOGRAPHY"}
                    </h4>
                    <p className="text-base text-smoke-white/90 font-sans leading-relaxed">
                      {activeBarberSafe.desc}
                    </p>
                  </div>

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

      </div>

      <Footer />
    </main>
  );
}
