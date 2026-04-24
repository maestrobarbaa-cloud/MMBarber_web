"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, X, Trophy, Timer, Zap, Shield, User, Skull, Star, Award } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { playSound } from "../utils/audio";

// Predefined unique codes (one-time use)
const ELITA_CODES = [
  "MMB-7K9X", "MMB-2R4Y", "MMB-9P1Z", "MMB-5W3A", "MMB-8Q2B",
  "MMB-4L6C", "MMB-1M9D", "MMB-6V5E", "MMB-3N8F", "MMB-9T1G",
  "MMB-2S4H", "MMB-7X6I", "MMB-5K3J", "MMB-8P2K", "MMB-4W6L",
  "MMB-1R9M", "MMB-6Q5N", "MMB-3L8O", "MMB-9M1P", "MMB-2V4Q",
  "MMB-7N6R", "MMB-5S3S", "MMB-8X2T", "MMB-4K6U", "MMB-1P9V",
  "MMB-6W5X", "MMB-3R8Y", "MMB-9Q1Z", "MMB-2L4A", "MMB-7M6B"
];

interface GameTarget {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  type: 'fade' | 'bowl' | 'mullet' | 'meme';
  points: number;
}

interface LeaderboardEntry {
  rank: string;
  score: number;
  date: string;
}

export function ElitaGame() {
  const { lang } = useTranslation();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended' | 'leaderboard'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<GameTarget[]>([]);
  const [combo, setCombo] = useState(0);
  const [lastHitTime, setLastHitTime] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [unlockedCode, setUnlockedCode] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const gameLoopRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load leaderboard and check codes
  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('mmbarber_elita_leaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }

    const handleOpen = () => setIsOpen(true);
    window.addEventListener('mmbarber-elita-game-open', handleOpen);
    return () => window.removeEventListener('mmbarber-elita-game-open', handleOpen);
  }, []);

  const [isGunSoundEnabled, setIsGunSoundEnabled] = useState(false);

  // Difficulty multiplier (increases as score goes up)
  const difficultyMultiplier = 1 + (score / 20000); 

  const getRank = (s: number) => {
    if (lang === 'cs') {
      if (s < 5000) return "Nováček";
      if (s < 15000) return "Střelec";
      if (s < 30000) return "Voják";
      if (s < 50000) return "Boss";
      return "Kingpin";
    }
    if (s < 5000) return "Rookie";
    if (s < 15000) return "Shooter";
    if (s < 30000) return "Soldier";
    if (s < 50000) return "Boss";
    return "Kingpin";
  };

  const spawnTarget = useCallback(() => {
    const types: GameTarget['type'][] = ['fade', 'bowl', 'mullet', 'meme'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const newTarget: GameTarget = {
      id: Date.now() + Math.random(),
      x: Math.random() * 65 + 17.5, // 17.5-82.5% (safer for mobile/notches)
      y: Math.random() * 45 + 27.5, // 27.5-72.5% (safer for mobile/notches)
      size: Math.random() * 15 + 45, // Smaller targets: 45-60px (down from 70-90px)
      speed: (Math.random() * 1.8 + 1.5) * difficultyMultiplier,
      type,
      points: type === 'meme' ? 150 : (type === 'mullet' ? 100 : 50)
    };

    setTargets(prev => [...prev, newTarget]);

    // Auto-remove target after some time (faster as speed increases)
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id));
    }, 2200 / newTarget.speed);
  }, [difficultyMultiplier]);

  const startGame = async () => {
    // Advanced Anti-Cheat: IP Check Simulation
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const ip = data.ip;
      
      const lastPlayedDate = localStorage.getItem(`mmbarber_elita_played_${ip}`);
      const today = new Date().toDateString();

      const isDev = localStorage.getItem('mmbarber_dev_mode') === 'true';
      if (lastPlayedDate === today && !isDev) {
        alert(lang === 'cs' ? "Z této IP adresy už se dnes střílelo. Přijď zítra." : "This IP has already played today. Come back tomorrow.");
        return;
      }
      
      localStorage.setItem(`mmbarber_elita_played_${ip}`, today);
    } catch (e) {
      const lastPlayed = localStorage.getItem('mmbarber_elita_last_played');
      const today = new Date().toDateString();
      if (lastPlayed === today) {
         alert(lang === 'cs' ? "Dnes už jsi svoji šanci využil." : "You've used your chance today.");
         return;
      }
    }

    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    setTargets([]);
    setUnlockedCode(null);
    setGameState('playing');
    playSound("/sounds/kasa.mp3", 0.4);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      // Faster spawn as difficulty increases
      const spawnRate = Math.max(120, 320 / difficultyMultiplier);
      const interval = setInterval(spawnTarget, spawnRate); 
      return () => clearInterval(interval);
    }
  }, [gameState, spawnTarget, difficultyMultiplier]);

  const endGame = useCallback(() => {
    setGameState('ended');
    localStorage.setItem('mmbarber_elita_last_played', new Date().toDateString());

    // Process Leaderboard
    const newEntry: LeaderboardEntry = {
      rank: getRank(score),
      score: score,
      date: new Date().toLocaleDateString()
    };

    const currentLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setLeaderboard(currentLeaderboard);
    localStorage.setItem('mmbarber_elita_leaderboard', JSON.stringify(currentLeaderboard));

    // Check if score is high enough for code (50,000+)
    if (score >= 50000) {
      const usedCodes = JSON.parse(localStorage.getItem('mmbarber_elita_used_codes') || '[]');
      const availableCode = ELITA_CODES.find(c => !usedCodes.includes(c));
      
      if (availableCode) {
        setUnlockedCode(availableCode);
        usedCodes.push(availableCode);
        localStorage.setItem('mmbarber_elita_used_codes', JSON.stringify(usedCodes));
        localStorage.setItem('mmbarber_elita_active_code', availableCode);
      }
    }
    
    playSound("/sounds/neon.mp3", 0.5);
  }, [score, leaderboard]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
  }, [gameState, timeLeft, endGame]);

  const handleShot = (targetId: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    // Points logic
    const now = Date.now();
    let pointsToAdd = target.points;
    
    if (now - lastHitTime < 700) { // Tighter combo window
      setCombo(prev => prev + 1);
      pointsToAdd *= (1 + combo * 0.2); // Better combo scaling
    } else {
      setCombo(0);
    }
    
    setScore(prev => Math.round(prev + pointsToAdd));
    setLastHitTime(now);
    setTargets(prev => prev.filter(t => t.id !== targetId));

    // Quips
    const quips = lang === 'cs' 
      ? ["Čistý zásah.", "Bez milosti.", "Respekt získán.", "V systému.", "Elita.", "Mafioso."]
      : ["Clean shot.", "No mercy.", "Respect earned.", "In the system.", "Elite.", "Mafioso."];
    setShowPopup(quips[Math.floor(Math.random() * quips.length)]);
    setTimeout(() => setShowPopup(null), 800);

    if (isGunSoundEnabled) {
      playSound("/sounds/magnum.mp3", 0.3);
    } else {
      playSound("/sounds/břitva.mp3", 0.4);
    }
  };

  const handleMiss = () => {
    if (gameState !== 'playing') return;
    setCombo(0);
    playSound("/sounds/click.mp3", 0.1);
  };

  const maskCode = (code: string) => {
    const parts = code.split('-');
    if (parts.length < 2) return code;
    const suffix = parts[1];
    return `${parts[0]}-${suffix.substring(0, 2)}**`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10010] flex items-center justify-center bg-black/98 backdrop-blur-2xl overflow-hidden select-none touch-none"
        onClick={handleMiss}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        </div>

        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 md:top-8 md:right-8 text-white/30 hover:text-mafia-gold transition-colors z-50 p-2"
        >
          <X size={32} />
        </button>

        {gameState === 'idle' && (
          <div className="text-center space-y-8 max-w-xl px-6 py-12 overflow-y-auto max-h-screen">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h1 className="text-4xl md:text-7xl font-heading font-black text-white tracking-[0.2em] uppercase">
                ELITA <span className="text-mafia-gold">SHOT</span>
              </h1>
              <p className="text-mafia-gold/60 font-mono text-[10px] md:text-sm tracking-[0.3em] mt-4 uppercase">
                {lang === 'cs' ? "ELIMINACE ŠPATNÝCH ÚČESŮ" : "MMBARBER TARGET ACQUISITION"}
              </p>
            </motion.div>

            <div className="p-6 md:p-8 border border-white/10 bg-white/5 space-y-6">
              <p className="text-white/70 text-[10px] md:text-sm leading-relaxed uppercase tracking-wider font-sans">
                {lang === 'cs' 
                  ? "Zlikviduj špatné účesy dřív, než ovládnou ulice. Máš 30 sekund na to, abys dokázal, že patříš k elitě. Jen skóre nad 50 000 ti zajistí místo ve hře o Kingpina sezóny."
                  : "Eliminate bad haircuts before they take over the streets. You have 30 seconds to prove you belong to the elite. Only score over 50,000 secures your spot for Kingpin of the season."}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-[9px] md:text-[10px] font-mono text-mafia-gold">
                <div className="flex items-center gap-2 border border-mafia-gold/20 p-3">
                  <Timer size={14} /> 30 {lang === 'cs' ? 'SEKUND' : 'SECONDS'}
                </div>
                <div className="flex items-center gap-2 border border-mafia-gold/20 p-3">
                  <Trophy size={14} /> 50 000+ {lang === 'cs' ? 'PRO KÓD' : 'FOR CODE'}
                </div>
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center justify-center gap-4 pt-2">
                 <button 
                  onClick={(e) => { e.stopPropagation(); setIsGunSoundEnabled(!isGunSoundEnabled); }}
                  className={`flex items-center gap-3 px-4 py-2 border transition-all ${isGunSoundEnabled ? 'bg-mafia-red/20 border-mafia-red text-mafia-red' : 'bg-white/5 border-white/10 text-white/40'}`}
                 >
                    <div className={`w-3 h-3 rounded-full ${isGunSoundEnabled ? 'bg-mafia-red animate-pulse' : 'bg-white/20'}`} />
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em]">
                      {lang === 'cs' ? "ZAPNOUT ZVUKY" : "TACTICAL AUDIO"}
                    </span>
                 </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="px-8 md:px-12 py-4 md:py-5 bg-mafia-gold text-mafia-black font-heading font-black text-base md:text-lg uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(197,160,89,0.3)]"
              >
                {lang === 'cs' ? "ZAHÁJIT PALBU" : "START MISSION"}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setGameState('leaderboard'); }}
                className="px-6 md:px-8 py-4 md:py-5 border border-white/20 text-white font-heading font-black text-base md:text-lg uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
              >
                {lang === 'cs' ? "ŽEBŘÍČEK" : "LEADERBOARD"}
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="w-full h-full relative cursor-crosshair">
            {/* HUD */}
            <div className="absolute top-6 left-6 right-6 md:top-12 md:left-12 md:right-12 flex justify-between items-start pointer-events-none">
              <div className="space-y-1">
                <p className="text-mafia-gold/40 text-[8px] md:text-[10px] font-mono tracking-widest uppercase">
                  {lang === 'cs' ? 'SKÓRE_OPERATIVCE' : 'OPERATIVE_SCORE'}
                </p>
                <h3 className="text-2xl md:text-4xl font-heading font-black text-white tracking-widest">{score.toString().padStart(6, '0')}</h3>
                {combo > 0 && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-mafia-red font-black text-sm md:text-xl italic"
                  >
                    COMBO X{combo + 1}
                  </motion.div>
                )}
              </div>
              
              <div className="text-center">
                 <p className="text-mafia-gold/40 text-[8px] md:text-[10px] font-mono tracking-widest uppercase">
                   {lang === 'cs' ? 'ZBÝVAJÍCÍ_ČAS' : 'TIME_REMAINING'}
                 </p>
                 <h3 className={`text-4xl md:text-6xl font-heading font-black tracking-tighter ${timeLeft < 10 ? 'text-mafia-red animate-pulse' : 'text-white'}`}>
                    {timeLeft}s
                 </h3>
              </div>

              <div className="text-right space-y-1">
                <p className="text-mafia-gold/40 text-[8px] md:text-[10px] font-mono tracking-widest uppercase">
                   {lang === 'cs' ? 'AKTUÁLNÍ_HODNOST' : 'CURRENT_RANK'}
                 </p>
                <h3 className="text-xs md:text-xl font-heading font-black text-mafia-gold tracking-widest uppercase">{getRank(score)}</h3>
              </div>
            </div>

            {/* Targets */}
            {targets.map(target => (
              <motion.div
                key={target.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute flex items-center justify-center group"
                style={{ left: `${target.x}%`, top: `${target.y}%`, width: target.size, height: target.size }}
                onPointerDown={(e) => handleShot(target.id, e)}
              >
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 border-2 border-mafia-gold/30 rounded-full animate-spin-slow" />
                  <div className="absolute inset-2 border border-mafia-red/50 rounded-full animate-pulse" />
                  
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-mafia-black/40 rounded-full backdrop-blur-sm border border-white/5">
                    {target.type === 'fade' && <User className="text-white/80 w-1/2 h-1/2" />}
                    {target.type === 'mullet' && <Skull className="text-mafia-red w-1/2 h-1/2" />}
                    {target.type === 'bowl' && <Zap className="text-mafia-gold w-1/2 h-1/2" />}
                    {target.type === 'meme' && <Star className="text-white w-2/3 h-2/3 animate-bounce" />}
                  </div>

                  <div className="absolute -top-4 -right-4 bg-mafia-gold text-mafia-black text-[8px] md:text-[10px] font-black px-1.5 py-0.5 shadow-xl">
                    +{target.points}
                  </div>
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {showPopup && (
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed bottom-24 inset-x-0 flex items-center justify-center pointer-events-none"
                >
                  <span className="text-2xl md:text-5xl font-heading font-black text-mafia-gold italic tracking-tighter uppercase [text-shadow:0_5px_15px_rgba(0,0,0,0.5)]">
                    {showPopup}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {gameState === 'ended' && (
          <div className="text-center space-y-8 max-w-2xl px-6 py-12 overflow-y-auto max-h-screen">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <h2 className="text-mafia-gold font-mono text-[10px] md:text-sm tracking-[0.4em] uppercase mb-2">
                {lang === 'cs' ? 'MISE_DOKONČENA' : 'MISSION_COMPLETE'}
              </h2>
              <h1 className="text-5xl md:text-8xl font-heading font-black text-white tracking-widest uppercase">{score}</h1>
              <p className="text-white/40 font-mono text-[8px] md:text-xs uppercase tracking-[0.2em] mt-2">
                 {lang === 'cs' ? 'CELKOVÉ_DOSAŽENÉ_SKÓRE' : 'TOTAL_SCORE_ACCUMULATED'}
              </p>
            </motion.div>

            <div className="p-6 md:p-10 bg-white/5 border border-white/10 relative overflow-hidden">
               {unlockedCode ? (
                 <div className="space-y-6">
                    <div className="flex justify-center mb-4">
                      <Trophy size={48} className="text-mafia-gold animate-bounce" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-heading font-black text-white uppercase tracking-widest">
                      {lang === 'cs' ? "PATŘÍŠ MEZI ELITU" : "YOU BELONG TO THE ELITE"}
                    </h3>
                    <p className="text-white/60 text-[10px] md:text-sm uppercase tracking-wider">
                      {lang === 'cs' 
                        ? "Ulož si tenhle kód. Rozhodne o tvém postavení." 
                        : "Save this code. It will decide your standing."}
                    </p>
                    <div className="bg-mafia-black border-2 border-mafia-gold p-4 md:p-6 inline-block">
                      <span className="text-2xl md:text-5xl font-mono font-black text-mafia-gold tracking-[0.3em]">{maskCode(unlockedCode)}</span>
                    </div>
                    <p className="text-[8px] md:text-[10px] text-mafia-gold/40 uppercase font-mono mt-4">
                      {lang === 'cs' ? "UKAŽ KÓD V MMBARBER" : "SHOW CODE AT MMBARBER"}
                    </p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   <h3 className="text-lg md:text-2xl font-heading font-black text-white/80 uppercase tracking-widest">
                     {score < 5000 ? (lang === 'cs' ? "ZATÍM NEJSI NIKDO." : "YOU ARE NOBODY YET.") : 
                      score < 30000 ? (lang === 'cs' ? "MÁŠ POTENCIÁL." : "YOU HAVE POTENTIAL.") : 
                      (lang === 'cs' ? "BLÍŽÍŠ SE ELITĚ." : "CLOSING IN ON THE ELITE.")}
                   </h3>
                   <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest">
                     {lang === 'cs' ? "Potřebuješ 50 000+ pro získání kódu. Zkus to znovu zítra." : "You need 50,000+ to claim your code. Try again tomorrow."}
                   </p>
                 </div>
               )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={(e) => { e.stopPropagation(); setGameState('idle'); }}
                className="px-8 md:px-12 py-4 md:py-5 border border-white/20 text-white font-heading font-black text-base md:text-lg uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
              >
                {lang === 'cs' ? "HLAVNÍ MENU" : "MAIN MENU"}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setGameState('leaderboard'); }}
                className="px-8 md:px-12 py-4 md:py-5 bg-mafia-gold text-mafia-black font-heading font-black text-base md:text-lg uppercase tracking-[0.3em] hover:scale-105 transition-all"
              >
                {lang === 'cs' ? "MMBARBER ELITA" : "THE ELITE"}
              </button>
            </div>
          </div>
        )}

        {gameState === 'leaderboard' && (
          <div className="w-full max-w-2xl px-6 space-y-8 py-12 overflow-y-auto max-h-screen">
            <div className="text-center">
              <h2 className="text-mafia-gold font-mono text-[10px] md:text-sm tracking-[0.4em] uppercase mb-2">
                 {lang === 'cs' ? 'GLOBÁLNÍ_ŽEBŘÍČEK' : 'GLOBAL_RANKINGS'}
              </h2>
              <h1 className="text-3xl md:text-6xl font-heading font-black text-white tracking-[0.2em] uppercase">MMBARBER ELITA</h1>
            </div>

            <div className="bg-white/5 border border-white/10 p-1 md:p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[400px]">
                  <thead>
                    <tr className="border-b border-white/10 text-[8px] md:text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.2em]">
                      <th className="p-2 md:p-4">{lang === 'cs' ? 'POŘADÍ' : 'RANK'}</th>
                      <th className="p-2 md:p-4">{lang === 'cs' ? 'HODNOST' : 'LEVEL'}</th>
                      <th className="p-2 md:p-4">{lang === 'cs' ? 'SKÓRE' : 'SCORE'}</th>
                      <th className="p-2 md:p-4 text-right">{lang === 'cs' ? 'DATUM' : 'DATE'}</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {leaderboard.length > 0 ? leaderboard.map((entry, i) => (
                      <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i === 0 ? 'text-mafia-gold bg-mafia-gold/5' : 'text-white/70'}`}>
                        <td className="p-2 md:p-4 font-black">#{i + 1}</td>
                        <td className="p-2 md:p-4 text-[8px] md:text-[10px] uppercase tracking-widest">{entry.rank}</td>
                        <td className="p-2 md:p-4 text-sm md:text-xl font-heading">{entry.score}</td>
                        <td className="p-2 md:p-4 text-right text-[8px] md:text-[10px] opacity-40">{entry.date}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-white/20 uppercase tracking-[0.3em] text-xs">
                           {lang === 'cs' ? 'Čekám na kandidáty...' : 'Waiting for candidates...'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={(e) => { e.stopPropagation(); setGameState('idle'); }}
                className="px-8 md:px-12 py-4 md:py-5 border border-white/20 text-white font-heading font-black text-base md:text-lg uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
              >
                {lang === 'cs' ? "ZPĚT" : "BACK"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

