"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "@/components/OptimizedImage";
import { motion, AnimatePresence } from "framer-motion";
import { useBarbers } from "@/contexts/BarberContext";
import { playSound } from "@/utils/audio";
import { trackEvent } from "@/utils/analytics";
import { 
  ArrowLeft, 
  Sparkles, 
  HelpCircle, 
  RotateCw, 
  Calendar, 
  User, 
  ExternalLink,
  Award,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { 
  subscribeToGlobalXpStats, 
  calculateLevelFromXp, 
  getCzechRankFromLevel, 
  getEnglishRankFromLevel,
  GlobalBarberStats 
} from "@/utils/barberXp";
import { useTranslation } from "@/hooks/useTranslation";
import { Footer } from "@/components/Footer";
import { BottomTerminalReveal } from "@/components/BottomTerminalReveal";

export default function BarberLotteryPage() {
  const { lang } = useTranslation();
  const [isRandomizing, setIsRandomizing] = useState(false);
  const { barbers: allBarbers, loading } = useBarbers();
  // ZATÍM JEN TOMÁŠ: Filtrujeme pouze Tomáše
  const barbers = allBarbers.filter(b => b.id === 'tomas');
  const [isDecided, setIsDecided] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalBarberStats>({});
  
  // Client synced profile
  const [clientNickname, setClientNickname] = useState<string | null>(null);
  
  // Custom names overrides from localStorage
  const [customTomasName, setCustomTomasName] = useState("Tomáš");
  const [customNellaName, setCustomNellaName] = useState("Nella");

  // Sync names & active combatant profile
  const syncLocalStorageData = useCallback(() => {
    const savedTomas = localStorage.getItem("mmbarber_custom_name_tomas");
    const savedNella = localStorage.getItem("mmbarber_custom_name_nella");
    if (savedTomas) setCustomTomasName(savedTomas);
    if (savedNella) setCustomNellaName(savedNella);

    const savedNickname = localStorage.getItem("mmbarber_client_nickname");
    if (savedNickname) setClientNickname(savedNickname);
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

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("mmbarber_names_updated", handleStorageUpdate);
      unsubscribeXp();
    };
  }, [syncLocalStorageData]);

  // Vocative Czech name translation helper
  const getVocative = (name: string) => {
    if (!name) return "";
    const n = name.trim().toUpperCase();
    if (lang !== 'cs') return name;

    if (n.endsWith('A')) return n.slice(0, -1) + 'O';
    if (n.endsWith('EK')) return n.slice(0, -2) + 'KU';
    if (n.endsWith('ÍK')) return n.slice(0, -2) + 'ÍKU';
    if (n.endsWith('US')) return n.slice(0, -2) + 'E';
    if (n.endsWith('ES')) return n.slice(0, -2) + 'E';
    if (n.endsWith('O')) return n;
    if (n.endsWith('I') || n.endsWith('Í')) return n;
    if (n.endsWith('E') || n.endsWith('Ě')) return n;
    
    if (['Š', 'Ž', 'Č', 'Ř', 'C', 'J', 'Ď', 'Ť', 'Ň'].includes(n.slice(-1))) return n + 'I';
    if (n.endsWith('H') || n.endsWith('CH') || n.endsWith('K') || n.endsWith('G')) return n + 'U';
    if (['S', 'Z', 'T', 'D', 'M', 'B', 'P', 'V', 'N', 'R', 'L'].includes(n.slice(-1))) return n + 'E';
    
    return n;
  };

  const handleStartDraw = () => {
    if (isRandomizing || loading) return;

    setIsRandomizing(true);
    setIsDecided(false);
    setWinnerIndex(null);
    trackEvent("barber_lottery_start");

    // Continuous spin sound tick
    playSound("/sounds/reload.mp3", 0.5);
    let soundInterval = setInterval(() => {
      playSound("/sounds/card.mp3", 0.25);
    }, 150);

    // Spin animation duration
    setTimeout(() => {
      clearInterval(soundInterval);
      const chosenIndex = Math.floor(Math.random() * barbers.length);
      setWinnerIndex(chosenIndex);
      setIsRandomizing(false);
      setIsDecided(true);
      playSound("/sounds/success.mp3", 0.6);
      trackEvent("barber_lottery_success", { winner: barbers[chosenIndex].id });
    }, 2500);
  };

  if (loading) return null;

  const winnerBarber = winnerIndex !== null ? barbers[winnerIndex] : null;
  const winnerCustomName = winnerBarber 
    ? (winnerBarber.id === "tomas" ? customTomasName : customNellaName) 
    : "";

  // Dynamic winner stats
  const winnerStats = winnerBarber ? globalStats[winnerBarber.id] || { xp: 0 } : { xp: 0 };
  const winnerLevel = calculateLevelFromXp(winnerStats.xp);
  const winnerRank = winnerBarber 
    ? (lang === 'cs' ? getCzechRankFromLevel(winnerLevel, winnerBarber.id === "nella") : getEnglishRankFromLevel(winnerLevel))
    : "";

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

      {/* Main content grid */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 z-10 flex flex-col items-center justify-center gap-12">
        
        {/* Page Title & synched active combatant info */}
        <div className="text-center space-y-4 max-w-xl">
          <span className="text-mafia-gold text-[10px] font-mono tracking-[0.4em] uppercase block">
            {lang === 'cs' ? "OSUDOVÁ VOLBA KŘESLA" : "FATEFUL CHAIR SELECTION"}
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-smoke-white uppercase tracking-tight leading-none">
            {lang === 'cs' ? "LOSOVAT BARBERA" : "DRAW A BARBER"}
          </h1>
          
          {clientNickname ? (
            <p className="text-xs font-mono text-white/50 tracking-wider">
              {lang === 'cs' 
                ? `Bojovníku ${getVocative(clientNickname)}, nech osud rozhodnout o tvém příštím střihu!`
                : `Fighter ${clientNickname}, let destiny dictate your next look!`}
            </p>
          ) : (
            <p className="text-xs text-white/40 leading-relaxed max-w-sm mx-auto">
              {lang === 'cs'
                ? "Nemůžeš se rozhodnout pro jednoho z našich elitních operativců? Nech osudový stroj zvolit tvé příští křeslo."
                : "Can't decide between our elite barbers? Let the system randomizer make the choice for you."}
            </p>
          )}
        </div>

        {/* Dynamic slot machine roulette */}
        <div className="w-full max-w-lg bg-mafia-black/90 border border-white/10 p-8 flex flex-col items-center relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          
          {/* Decorative scanner line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-mafia-gold/20 to-transparent pointer-events-none" />

          {/* Slot screen containing images */}
          <div className="w-full h-64 bg-black border-2 border-mafia-gold/30 relative overflow-hidden rounded mb-8 flex items-center justify-center">
            
            {/* Dark inner felt textures */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-25 z-0" />
            
            {/* Target lines indicator */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-mafia-gold/40 z-20 pointer-events-none" />
            <div className="absolute inset-y-0 left-6 right-6 border-y border-mafia-gold/10 z-20 pointer-events-none flex items-center justify-between">
              <span className="text-[8px] font-mono text-mafia-gold/50 tracking-widest pl-2">SELECT</span>
              <span className="text-[8px] font-mono text-mafia-gold/50 tracking-widest pr-2">TARGET</span>
            </div>

            {/* Animations for roulette */}
            <AnimatePresence mode="wait">
              {isRandomizing ? (
                /* Rapid spinning flow */
                <motion.div 
                  key="spinning-slot"
                  animate={{ y: [-400, 0] }}
                  transition={{ repeat: Infinity, duration: 0.35, ease: "linear" }}
                  className="flex flex-col gap-6 items-center py-4"
                >
                  {/* Repeatedly render barbers to simulate spinning wheel */}
                  {Array(8).fill(barbers[0]).map((b, idx) => (
                    <div key={idx} className="w-40 h-40 relative rounded overflow-hidden grayscale opacity-45 border border-white/5 shrink-0">
                      <Image src={b.image} alt={b.name} fill className="object-cover" />
                    </div>
                  ))}
                </motion.div>
              ) : isDecided && winnerBarber ? (
                /* Static winner display */
                <motion.div
                  key="winner-slot"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 12 }}
                  className="relative flex flex-col items-center justify-center z-10"
                >
                  <div className="w-48 h-48 relative rounded-full border-4 border-mafia-gold overflow-hidden shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.25)]">
                    <Image 
                      src={winnerBarber.image} 
                      alt={winnerBarber.name} 
                      fill 
                      priority
                      className="object-cover" 
                    />
                  </div>
                </motion.div>
              ) : (
                /* Empty / Start state */
                <motion.div
                  key="idle-slot"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-3 relative z-10 text-white/30"
                >
                  <HelpCircle size={48} className="animate-pulse text-mafia-gold/30" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em]">
                    {lang === 'cs' ? "Čekání na spuštění" : "System Idle"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Winner details and call-to-actions */}
          <AnimatePresence>
            {isDecided && winnerBarber && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full space-y-6 text-center overflow-hidden border-t border-white/5 pt-6"
              >
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-mafia-gold/60 uppercase tracking-[0.3em] block">
                    {lang === 'cs' ? "VYLOSOVANÝ OPERATIVEC" : "RECOMMENDED OPERATIVE"}
                  </span>
                  
                  <h3 className="text-3xl font-heading font-black text-white uppercase tracking-wider italic">
                    {winnerCustomName}
                  </h3>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-mafia-gold/10 border border-mafia-gold/30 rounded-full mt-2">
                    <Award size={12} className="text-mafia-gold" />
                    <span className="text-[9px] font-mono text-mafia-gold uppercase tracking-wider font-bold">
                      {winnerRank} // LEVEL {winnerLevel}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] font-sans text-white/50 leading-relaxed uppercase tracking-wider max-w-sm mx-auto">
                  {winnerBarber.desc}
                </p>

                {/* Booking reserve button */}
                <div className="pt-2 flex flex-col gap-3">
                  <a
                    href={winnerBarber.bookingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-mafia-gold text-mafia-black font-heading font-black tracking-[0.25em] uppercase text-xs flex items-center justify-center gap-2 rounded shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.25)] hover:bg-white hover:border-white transition-all cursor-pointer"
                  >
                    <Calendar size={14} />
                    <span>{lang === 'cs' ? "REZERVOVAT KŘESLO" : "BOOK CHAIR MISSION"}</span>
                  </a>

                  <button
                    onClick={handleStartDraw}
                    className="w-full py-3.5 bg-transparent border border-white/10 hover:border-white/30 text-white/60 hover:text-white font-mono text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all cursor-pointer rounded"
                  >
                    <RotateCw size={12} />
                    <span>{lang === 'cs' ? "SPUSTIT ZNOVU" : "RE-DRAW CHAIR"}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Draw Button for Idle State */}
          {!isDecided && (
            <button
              onClick={handleStartDraw}
              disabled={isRandomizing}
              className={`w-full py-4 font-heading font-black tracking-[0.25em] uppercase text-xs border rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                isRandomizing 
                  ? "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
                  : "bg-mafia-gold text-mafia-black border-mafia-gold hover:bg-white hover:border-white shadow-[0_0_25px_rgba(var(--color-mafia-gold-rgb),0.25)]"
              }`}
            >
              <Sparkles size={14} className={isRandomizing ? "animate-spin" : ""} />
              <span>{isRandomizing ? (lang === 'cs' ? "LOSUJI..." : "DRAWING...") : (lang === 'cs' ? "SPUSTIT LOSOVÁNÍ" : "SPIN ROULETTE")}</span>
            </button>
          )}

        </div>

      </div>

      <Footer />

      {/* Dynamic Terminal Scroll-Reveal for local SEO */}
      <BottomTerminalReveal thresholdMultiplier={10.0}>
        {(level) => (
          <div className="w-full flex flex-col gap-12 pb-32 pt-16 max-w-4xl mx-auto px-6 z-50 relative">
            {level >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-mafia-black/90 border border-white/5 p-8 rounded-sm space-y-6 text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-mafia-gold/5 border-b border-l border-white/5 text-center flex items-center justify-center font-mono text-[10px] text-mafia-gold">
                  SEO-L1
                </div>
                <span className="text-mafia-gold text-[9px] font-mono tracking-[0.3em] uppercase block">
                  {lang === 'cs' ? "SYNDIKÁTNÍ ALGORITMUS & SELECTION ENGINE" : "SYNDICATE SELECTION ALGORITHM"}
                </span>
                <h2 className="text-2xl font-heading font-black text-white uppercase italic">
                  {lang === 'cs' ? "JAK FUNGUJE NÁHODNÉ LOSOVÁNÍ BARBERA V UH?" : "HOW DOES THE BARBER LOTTERY IN UH WORK?"}
                </h2>
                <p className="text-xs text-white/60 leading-relaxed">
                  {lang === 'cs' 
                    ? "Náš automatizovaný losovací systém propojuje špičkové kadeřnické standardy s nestrannou náhodou. Pokud váháte mezi našimi specialisty (Tomáš a Nella), syndikátní algoritmus vybere optimální křeslo na základě okamžité kapacity a vytížení. Uherské Hradiště nabízí řadu holičství, ale pouze MMBarber kombinuje herní kulturu a precizní technologii s tradicí pánského řemesla na Slovácku."
                    : "Our automated drawing system fuses high-end barbering standards with absolute chance. If you hesitate between our elite professionals (Tomáš and Nella), the system selects the optimal seat for you. Uherské Hradiště hosts many hair studios, but only MMBarber blends gaming lounge culture, technical precision, and modern men's grooming in the Slovácko region."}
                </p>
              </motion.div>
            )}

            {level >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-mafia-black/90 border border-white/5 p-8 rounded-sm space-y-6 text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-mafia-gold/5 border-b border-l border-white/5 text-center flex items-center justify-center font-mono text-[10px] text-mafia-gold">
                  SEO-L2
                </div>
                <span className="text-mafia-gold text-[9px] font-mono tracking-[0.3em] uppercase block">
                  {lang === 'cs' ? "LOKÁLNÍ PŮSOBNOST & GEOGRAFICKÉ RELEVANCE" : "LOCAL GEOGRAPHIC RELEVANCE"}
                </span>
                <h2 className="text-2xl font-heading font-black text-white uppercase italic">
                  {lang === 'cs' ? "HOLIČSTVÍ UHERSKÉ HRADIŠTĚ - MAŘATICE SADOVÁ" : "BARBERSHOP UHERSKÉ HRADIŠTĚ - MAŘATICE SADOVÁ"}
                </h2>
                <p className="text-xs text-white/60 leading-relaxed">
                  {lang === 'cs'
                    ? "MMBarber se nachází v lukrativní a klidné části Mařatice na ulici Sadová 1383. Poskytujeme exkluzivní pánské střihy, úpravu vousů horkým ručníkem (hot towel), skin fade střihy a kompletní styling pro klienty z celého Slovácka. Ať už jedete ze Starého Města, Kunovic, Zlína nebo Uherského Brodu, parkování u naší základny je bezproblémové a atmosféra bezkonkurenční."
                    : "MMBarber is situated in a premium location of Mařatice on Sadová 1383 street. We deliver elite men's hair styling, warm hot-towel shaves, clean skin fades, and complete hair care for clients across Slovácko. Whether you commute from Staré Město, Kunovice, Zlín, or Uherský Brod, on-site parking is easy and the atmosphere is unmatched."}
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    "Barbershop Uherské Hradiště", "Pánské holičství Mařatice", 
                    "Skin fade Slovácko", "Pánský střih Sadová", 
                    "MMBarber losování", "Nejlepší barber UH", 
                    "Úprava vousů břitvou", "Horký ručník UH",
                    "Tomáš a Nella", "Syndikátní střihy"
                  ].map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white/[0.02] border border-white/10 rounded text-[9px] font-mono text-white/40 tracking-wider">
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {level >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-mafia-black/90 border border-white/5 p-8 rounded-sm space-y-6 text-left"
              >
                <span className="text-mafia-gold text-[9px] font-mono tracking-[0.3em] uppercase block">
                  {lang === 'cs' ? "ČASTO KLADENÉ OTÁZKY (FAQ)" : "FREQUENTLY ASKED QUESTIONS"}
                </span>
                <h2 className="text-2xl font-heading font-black text-white uppercase italic">
                  {lang === 'cs' ? "ZODPOVĚZENÉ OTÁZKY K VOLBĚ BARBERA" : "RESOLVED QUESTIONS ABOUT LOTTERY SELECTION"}
                </h2>
                
                <div className="space-y-4 pt-2">
                  <div className="border-l border-mafia-gold/30 pl-4 space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase">
                      {lang === 'cs' ? "Jaká je výhoda náhodného losování barbera?" : "What is the advantage of a random lottery selection?"}
                    </h4>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      {lang === 'cs'
                        ? "Losování eliminuje rozhodovací paralýzu. Všichni naši operativci (Tomáš i Nella) jsou certifikovaní profesionálové s nekompromisními výsledky v oblasti skin fade a úpravy vousů. Losování zaručuje, že dostanete stoprocentní MMBarber standard bez nutnosti dlouhého vybírání."
                        : "Lottery removes decision fatigue. All our hair specialists (Tomáš and Nella) are fully certified professionals with uncompromising standards in skin fades and beard styling. The draw guarantees you receive premium MMBarber quality."}
                    </p>
                  </div>
                  
                  <div className="border-l-2 border-mafia-gold/30 pl-4 space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase">
                      {lang === 'cs' ? "Je skin fade vhodný pro všechny typy vlasů?" : "Is a skin fade suitable for all hair types?"}
                    </h4>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      {lang === 'cs'
                        ? "Ano, skin fade (do ztracena) je univerzální moderní pánský střih, který skvěle padne většině typů vlasů i tvarů obličeje. Naši barbeři precizně geometricky přizpůsobí přechod vašim rysům."
                        : "Yes, the skin fade is a highly versatile modern men's haircut that suits most hair types and head shapes. Our barbers dynamically tailor the transition to match your facial profile."}
                    </p>
                  </div>

                  <div className="border-l-2 border-mafia-gold/30 pl-4 space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase">
                      {lang === 'cs' ? "Jak se mohu rezervovat do MMBarber?" : "How do I book a chair at MMBarber?"}
                    </h4>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      {lang === 'cs'
                        ? "Po dokončení losování stačí kliknout na tlačítko \"REZERVOVAT KŘESLO\", které vás okamžitě přesměruje do příslušného rezervačního kalendáře vybraného barbera."
                        : "After the lottery selection completes, simply click \"REZERVOVAT KŘESLO\" to route directly to the custom reservation calendar of the chosen barber."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </BottomTerminalReveal>
    </main>
  );
}
