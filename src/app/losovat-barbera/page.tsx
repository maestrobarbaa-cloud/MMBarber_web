"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { barbers } from "@/data/barbers";
import { playSound } from "@/utils/audio";
import { MilitaryInsignia } from "@/components/Profiles";
import { Dices, CalendarDays, RefreshCw, Volume2, VolumeX, ArrowLeft, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { 
  subscribeToGlobalXpStats, 
  calculateLevelFromXp, 
  getCzechRankFromLevel, 
  GlobalBarberStats 
} from "@/utils/barberXp";

const REEL_REPEAT = 15; // More repeats for a longer, more premium spin

// Attribute metadata containing static base ratings
const BARBER_STATS_METADATA = {
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

export default function BarberLotteryPage() {
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [isDecided, setIsDecided] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [reelH, setReelH] = useState(320); // Height of the card in the reel
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Real-time server stats state
  const [globalStats, setGlobalStats] = useState<GlobalBarberStats>({});

  const stripRef = useRef<HTMLDivElement>(null);
  
  // Create a long strip of barbers for the spinning effect
  const strip = Array(REEL_REPEAT).fill(barbers).flat();
  const availableCount = barbers.length;

  useEffect(() => {
    const updateH = () => setReelH(window.innerWidth < 768 ? 220 : 320);
    updateH();
    window.addEventListener("resize", updateH);

    // Subscribe to global ratings in real-time
    const unsubscribeXp = subscribeToGlobalXpStats((stats) => {
      setGlobalStats(stats);
    });

    return () => {
      window.removeEventListener("resize", updateH);
      unsubscribeXp();
    };
  }, []);

  const handleSpin = () => {
    if (isRandomizing || (isDecided && !showResult)) return;

    if (soundEnabled) {
      playSound("/sounds/reload.mp3", 0.7);
    }

    setIsRandomizing(true);
    setIsDecided(false);
    setShowResult(false);
    setWinnerIndex(null);

    // Reset position to top first
    if (stripRef.current) {
      stripRef.current.style.transition = "none";
      stripRef.current.style.transform = `translateY(0px)`;
    }

    // Set a random winner
    const randomWinner = Math.floor(Math.random() * availableCount);

    setTimeout(() => {
      setWinnerIndex(randomWinner);
      setIsRandomizing(false);
      setIsDecided(true);

      // Wait exactly 3.2 seconds for the slot machine reel to come to a satisfying mechanical stop
      setTimeout(() => {
        setShowResult(true);
        if (soundEnabled) {
          playSound("/sounds/card.mp3", 0.9);
        }
      }, 3200);
    }, 100);
  };

  useEffect(() => {
    if (!stripRef.current || availableCount === 0 || winnerIndex === null) return;

    if (isDecided) {
      // Land in the middle section of our repeat strip (e.g. repeat offset 10)
      const repeatOffset = 10;
      const targetPos = (repeatOffset * availableCount + winnerIndex) * reelH;
      
      // Ultra-smooth, slow-down easing curve mimicking a real mechanical reel
      stripRef.current.style.transition = "transform 3.2s cubic-bezier(0.1, 0.82, 0.15, 1)";
      stripRef.current.style.transform = `translateY(-${targetPos}px)`;
    }
  }, [isDecided, winnerIndex, availableCount, reelH]);

  const winnerBarber = winnerIndex !== null ? barbers[winnerIndex] : null;

  // Compute dynamic stats based on Firestore server votes
  const getDynamicStats = (barberId: string) => {
    const serverData = globalStats[barberId] || { stat1: 0, stat2: 0, stat3: 0, stat4: 0, stat5: 0, stat6: 0 };
    const metadata = BARBER_STATS_METADATA[barberId as "tomas" | "nella"] || [];
    
    return metadata.map((stat, idx) => {
      const serverVotes = 
        idx === 0 ? (serverData.stat1 ?? 0) : 
        idx === 1 ? (serverData.stat2 ?? 0) : 
        idx === 2 ? (serverData.stat3 ?? 0) : 
        idx === 3 ? (serverData.stat4 ?? 0) : 
        idx === 4 ? (serverData.stat5 ?? 0) : 
        (serverData.stat6 ?? 0);
      return {
        label: stat.label,
        value: Math.min(100, stat.base + serverVotes),
        votes: serverVotes,
        color: stat.color
      };
    });
  };

  const winnerStats = winnerBarber ? getDynamicStats(winnerBarber.id) : [];
  const serverBarberData = winnerBarber ? (globalStats[winnerBarber.id] || { xp: 0 }) : { xp: 0 };
  const currentLevel = calculateLevelFromXp(serverBarberData.xp);
  const czechRank = winnerBarber ? getCzechRankFromLevel(currentLevel, winnerBarber.id === "nella") : "";

  return (
    <div className="min-h-screen bg-mafia-black text-smoke-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Texture & Overlays */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none z-0" />
      
      {/* Cybernetic background glowing elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[150px] bg-mafia-gold/5 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[150px] bg-mafia-gold/5 pointer-events-none" />

      {/* Header bar */}
      <header className="w-full py-6 px-6 border-b border-white/5 flex justify-between items-center z-10 backdrop-blur-md bg-mafia-black/40">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="text-white/40 hover:text-mafia-gold transition-colors duration-300 flex items-center gap-2 text-xs font-mono tracking-widest"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">ZPĚT NA ZÁKLADNU</span>
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <span className="font-heading font-black text-xl tracking-[0.2em] text-mafia-gold">MMBARBER</span>
          <span className="text-[9px] font-mono border border-mafia-gold/20 px-2 py-0.5 rounded text-mafia-gold bg-mafia-gold/5 uppercase tracking-widest hidden sm:inline">
            OPERATIVNÍ ROZBOČOVAČ
          </span>
        </div>
        
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-white/40 hover:text-mafia-gold p-2 transition-colors duration-300"
          title={soundEnabled ? "Vypnout zvuky" : "Zapnout zvuky"}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </header>

      {/* Main Content Casing */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 z-10 max-w-6xl mx-auto w-full">
        
        <div className="text-center mb-10 max-w-lg">
          <h1 className="text-2xl md:text-4xl font-heading font-black tracking-[0.2em] text-white uppercase mb-3 italic">
            OSUDOVÁ VOLBA
          </h1>
          <p className="text-xs md:text-sm text-smoke-white/60 uppercase tracking-widest leading-relaxed">
            Nevíš, kterému z našich specialistů dnes svěřit svou vizáž? Nech rozhodnout taktický automat rodiny.
          </p>
        </div>

        {/* GAMING LAYOUT: Side by side on desktop, stacked on mobile */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-8 lg:gap-12 w-full max-w-5xl">
          
          {/* LEFT: SLOT MACHINE */}
          <div className="w-full max-w-md bg-[#0a0a0a] border-2 border-mafia-gold/30 rounded-3xl p-6 md:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative flex flex-col items-center justify-between">
            
            {/* Subtle tactical details */}
            <div className="absolute top-3 left-6 text-[8px] font-mono text-white/20 uppercase tracking-widest">
              SYS_INDEX_VALCE_v1.0
            </div>
            <div className="absolute top-3 right-6 text-[8px] font-mono text-mafia-gold/40 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-mafia-gold" />
              AKTIVNÍ DETEKCE
            </div>

            {/* SCREEN DISPLAY CONTAINER */}
            <div 
              className="w-full h-[220px] md:h-[320px] bg-black border border-white/10 rounded-2xl relative overflow-hidden mt-4"
              style={{ boxShadow: "inset 0 10px 30px rgba(0,0,0,0.9)" }}
            >
              {/* CYLINDER SHADOWS */}
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black via-black/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none" />

              {/* TARGETING LASERS */}
              <div className="absolute inset-y-0 left-0 w-2 border-r-2 border-mafia-gold/30 z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-2 border-l-2 border-mafia-gold/30 z-10 pointer-events-none" />
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-[190px] md:h-[280px] border-y border-mafia-gold/20 z-10 pointer-events-none" />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-mafia-gold/30 z-10 pointer-events-none shadow-[0_0_8px_rgba(197,160,89,0.8)]" />

              {/* Reel Container */}
              <div 
                ref={stripRef} 
                className="flex flex-col" 
                style={{ 
                  willChange: "transform",
                  transform: winnerIndex === null ? `translateY(0px)` : undefined
                }}
              >
                {strip.map((barber, i) => {
                  const isMatch = isDecided && winnerIndex !== null && (i % availableCount === winnerIndex);

                  return (
                    <div
                      key={i}
                      className="flex-shrink-0 flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')]"
                      style={{ height: reelH }}
                    >
                      <div className="relative w-[160px] h-[160px] md:w-[240px] md:h-[240px] flex items-center justify-center">
                        <Image
                          src={barber.image}
                          alt={barber.name}
                          width={240}
                          height={240}
                          priority
                          className="object-cover rounded-xl"
                          style={{
                            width: "90%",
                            height: "90%",
                            filter: isDecided && isMatch
                              ? "none"
                              : "grayscale(1) brightness(0.4)",
                            boxShadow: isDecided && isMatch
                              ? "0 0 30px rgba(197, 160, 89, 0.4)"
                              : "none",
                            transition: "filter 0.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.8s ease",
                          }}
                        />
                        
                        {/* High-intensity scan sweep */}
                        <AnimatePresence>
                          {isDecided && isMatch && (
                            <motion.div
                              initial={{ x: "-100%", opacity: 0.5 }}
                              animate={{ x: "100%", opacity: 0 }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ACTION TRIGGERS */}
            <div className="w-full mt-6 flex flex-col gap-4">
              <button
                onClick={handleSpin}
                disabled={isRandomizing || (isDecided && !showResult)}
                className={`w-full py-5 rounded-xl font-heading font-black tracking-[0.3em] uppercase text-sm border-2 transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-3 z-10 ${
                  isRandomizing || (isDecided && !showResult)
                    ? "bg-white/5 border-white/10 text-white/30 cursor-not-allowed" 
                    : "bg-mafia-gold text-mafia-black border-mafia-gold hover:bg-white hover:border-white shadow-[0_0_30px_rgba(197,160,89,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                }`}
              >
                <Dices size={18} className={isRandomizing ? "animate-spin" : ""} />
                <span>{isRandomizing ? "LOSUJI..." : "ROZTOČIT AUTOMAT"}</span>
              </button>
            </div>
          </div>

          {/* RIGHT: GAMIFIED DECISION PANEL (Slides in beautifully on complete) */}
          <div className="w-full max-w-md min-h-[380px] lg:min-h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              {showResult && winnerBarber && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 40 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -30 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="w-full h-full bg-[#0a0a0a] border-2 border-mafia-gold p-6 md:p-8 rounded-3xl text-center shadow-[0_30px_70px_rgba(0,0,0,0.9)] flex flex-col justify-between items-center relative overflow-hidden"
                >
                  {/* Cybernetic holographic scan sweeps */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                  <motion.div 
                    initial={{ y: "-100%" }}
                    animate={{ y: "400%" }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-1/4 bg-gradient-to-b from-transparent via-mafia-gold/5 to-transparent pointer-events-none z-10"
                  />

                  {/* Header Hacking / Status Grid */}
                  <div className="w-full flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                    <span className="text-[8px] font-mono text-mafia-gold uppercase tracking-[0.25em] flex items-center gap-1.5 animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      DEŠIFROVÁNÍ ÚSPĚŠNÉ
                    </span>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">
                      SEC_LEVEL_{currentLevel}
                    </span>
                  </div>

                  {/* Glowing Insignia Badge */}
                  <div className="relative my-2 w-20 h-20 flex items-center justify-center bg-white/5 border border-white/10 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.15)]">
                    <div className="absolute inset-0 rounded-full bg-mafia-gold/5 animate-ping opacity-30" />
                    <MilitaryInsignia level={currentLevel} color="var(--user-accent-color, #c5a059)" size={48} />
                  </div>

                  {/* Barber Name & Title */}
                  <div className="mt-4 text-center w-full">
                    <span className="text-[9px] font-mono text-mafia-gold uppercase tracking-[0.4em] mb-1.5 block">
                      PŘIŘAZENÍ MISE DOKONČENO
                    </span>
                    <h3 className="text-white font-heading font-black text-3xl uppercase tracking-widest italic mb-1.5 leading-none text-glow">
                      {winnerBarber.name}
                    </h3>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">
                      {winnerBarber.id === "tomas" ? "ZAKLADATEL & HLAVNÍ BARBER" : "MLADÉ UCHO"}
                    </p>
                    <p className="text-[9px] font-mono text-glow text-mafia-gold uppercase tracking-[0.1em] mb-4 truncate max-w-xs mx-auto">
                      HODNOST: {czechRank}
                    </p>
                  </div>

                  {/* GAMIFIED STATS BARS */}
                  <div className="w-full space-y-4 my-6 bg-black/40 border border-white/5 p-4 rounded-xl">
                    {winnerStats.map((stat, idx) => (
                      <div key={idx} className="space-y-1.5 text-left">
                        <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest text-white/60">
                          <span>{stat.label}</span>
                          <span className="text-mafia-gold font-bold">
                            {stat.value}% {stat.votes > 0 && `(+${stat.votes})`}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.value}%` }}
                            transition={{ delay: 0.2 + idx * 0.15, type: "spring", stiffness: 60, damping: 10 }}
                            className="h-full rounded-full shadow-[0_0_10px_rgba(197,160,89,0.5)]"
                            style={{ backgroundColor: stat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* booking details */}
                  <p className="text-[10px] text-smoke-white/50 leading-relaxed uppercase tracking-wider mb-6 max-w-xs">
                    {winnerBarber.desc}
                  </p>

                  {/* ACTIONS */}
                  <div className="w-full flex flex-col sm:flex-row gap-3 border-t border-white/10 pt-4 mt-2">
                    <a
                      href={winnerBarber.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-4 bg-mafia-gold text-mafia-black font-heading font-black tracking-[0.2em] uppercase text-xs border border-mafia-gold hover:bg-white hover:border-white transition-all flex items-center justify-center gap-2 rounded-lg cursor-pointer"
                    >
                      <CalendarDays size={14} />
                      <span>REZERVACE</span>
                    </a>
                    
                    <button
                      onClick={handleSpin}
                      className="py-4 px-6 bg-transparent border border-white/20 text-white hover:bg-white hover:text-mafia-black hover:border-white transition-all font-heading font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-2 rounded-lg"
                    >
                      <RefreshCw size={12} />
                      <span>LOSOVAT ZNOVU</span>
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full py-6 text-center border-t border-white/5 z-10 bg-mafia-black/20">
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} MMBARBER. CHIRURGICKÁ PRECIZNOST V KAŽDÉM DETAILU.
        </p>
      </footer>
    </div>
  );
}
