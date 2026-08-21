"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "../hooks/useTranslation";
import { playSound } from "../utils/audio";

const THEMES = {
  fruits: [
    { id: 'cherry', icon: <span className="text-5xl md:text-7xl drop-shadow-lg">🍒</span> },
    { id: 'lemon', icon: <span className="text-5xl md:text-7xl drop-shadow-lg">🍋</span> },
    { id: 'grape', icon: <span className="text-5xl md:text-7xl drop-shadow-lg">🍇</span> }
  ],
  barber: [
    { id: 'scissors', icon: <span className="text-5xl md:text-7xl drop-shadow-lg">✂️</span> },
    { id: 'razor', icon: <span className="text-5xl md:text-7xl drop-shadow-lg">🪒</span> },
    { id: 'comb', icon: <span className="text-5xl md:text-7xl drop-shadow-lg">🪮</span> }
  ],
  retro: [
    { id: 'blonde', img: '/blonde_pinup.png' },
    { id: 'brunette', img: '/brunette_pinup.png' },
    { id: 'redhead', img: '/redhead_pinup.png' }
  ],
  cars: [
    { id: 'car1', img: '/retro_car_1.png' },
    { id: 'car2', img: '/retro_car_2.png' },
    { id: 'car3', img: '/retro_car_3.png' }
  ],
  planes: [
    { id: 'plane1', img: '/retro_plane_1.png' },
    { id: 'plane2', img: '/retro_plane_2.png' },
    { id: 'plane3', img: '/retro_plane_3.png' }
  ]
};

export function SlotMachine() {
  const { lang } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [gameState, setGameState] = useState<'idle' | 'spinning' | 'won' | 'lost'>('idle');
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof THEMES>('retro');
  
  const [reels, setReels] = useState<any[]>([null, null, null]);
  const [winnerName, setWinnerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [jackpotStatus, setJackpotStatus] = useState<{available: boolean, nextSeasonDate: string} | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/winners/slot-status');
      if (res.ok) {
        const data = await res.json();
        setJackpotStatus(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setGameState('idle');
      const symbols = THEMES['retro'];
      setReels([symbols[0], symbols[1], symbols[2]]); // Ukaž rovnou úvodní náhled
      setHasSubmitted(false);
      setWinnerName("");
      setSelectedTheme('retro');
      fetchStatus(); // Aktualizuj status při otevření
    };
    window.addEventListener('mmbarber-slot-machine-open', handleOpen);
    return () => window.removeEventListener('mmbarber-slot-machine-open', handleOpen);
  }, []);

  const spin = () => {
    if (gameState === 'spinning') return;
    setGameState('spinning');
    playSound("/sounds/hover.mp3", 0.5);

    const symbols = THEMES[selectedTheme];
    // Výhra je možná POUZE, pokud je jackpot k dispozici
    const isWin = jackpotStatus?.available ? Math.random() < 0.01 : false;

    let finalReels: any[] = [];
    if (isWin) {
      // All 3 the same
      const winningSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      finalReels = [winningSymbol, winningSymbol, winningSymbol];
    } else {
      // Ensure they don't all match
      let r1 = symbols[Math.floor(Math.random() * symbols.length)];
      let r2 = symbols[Math.floor(Math.random() * symbols.length)];
      let r3 = symbols[Math.floor(Math.random() * symbols.length)];
      
      while (r1.id === r2.id && r2.id === r3.id) {
        r3 = symbols[Math.floor(Math.random() * symbols.length)];
      }
      finalReels = [r1, r2, r3];
    }

    // Animation simulation
    let counter = 0;
    const interval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        setReels(finalReels);
        setGameState(isWin ? 'won' : 'lost');
        if (isWin) {
          playSound("/sounds/kasa.mp3", 0.8);
        } else {
          playSound("/sounds/click.mp3", 0.5);
        }
      }
    }, 100);
  };

  const handleSubmitWinner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!winnerName.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/winners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: 'slot_machine',
          nickname: winnerName.trim(),
          prizeOrScore: 'Voucher 30 minut'
        })
      });
      setHasSubmitted(true);
    } catch (e) {
      console.error("Chyba při odesílání", e);
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  const renderSymbolContent = (symbol: any) => {
    if (!symbol) return <div className="w-full h-full bg-mafia-black/50" />;
    if (symbol.img) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <Image src={symbol.img} alt="Symbol" fill className="object-cover" />
        </div>
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center shadow-inner">
        {symbol.icon}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10010] flex items-center justify-center bg-black/98 backdrop-blur-2xl overflow-hidden select-none touch-none"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--color-mafia-gold-rgb),0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--color-mafia-gold-rgb),0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        </div>

        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-12 left-6 md:top-24 md:left-12 text-white/30 hover:text-mafia-gold transition-colors z-50 p-2"
        >
          <X size={32} />
        </button>

        <div className="flex flex-col items-center justify-center max-w-4xl w-full px-4 z-20">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-heading font-black text-white tracking-[0.2em] uppercase">
              HAZARDNÍ <span className="text-mafia-gold">AUTOMAT</span>
            </h1>
            <p className="text-white/50 text-xs md:text-sm font-mono tracking-widest uppercase mt-2">
              {lang === 'cs' ? "Vyhraj voucher na 30 minut zdarma." : "Win a free 30-min voucher."}
            </p>
          </motion.div>

          {/* Banner dostupnosti jackpotu */}
          {jackpotStatus && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`mb-6 p-4 border rounded-lg max-w-xl w-full text-center font-mono text-[10px] md:text-xs uppercase tracking-widest ${jackpotStatus.available ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              {jackpotStatus.available 
                ? (lang === 'cs' ? "✅ JACKPOT PRO TOTO OBDOBÍ JE VOLNÝ!" : "✅ SEASON JACKPOT IS AVAILABLE!")
                : (lang === 'cs' ? `❌ Voucher pro toto období již byl vybrán. Můžeš točit pro zábavu, ale další reálná šance se otevírá až ${jackpotStatus.nextSeasonDate}.` : `❌ Voucher claimed for this season. You can spin for fun. Next chance unlocks ${jackpotStatus.nextSeasonDate}.`)
              }
            </motion.div>
          )}

          {gameState === 'idle' && (
            <div className="mb-8 flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => { setSelectedTheme('retro'); setReels([THEMES.retro[0], THEMES.retro[1], THEMES.retro[2]]); }}
                className={`flex items-center gap-2 px-4 py-2 border font-mono text-xs tracking-widest uppercase transition-all ${selectedTheme === 'retro' ? 'bg-mafia-gold text-black border-mafia-gold' : 'bg-transparent text-white/50 border-white/20'}`}
              >
                <div className="flex -space-x-2">
                  <div className="w-5 h-5 rounded-full overflow-hidden relative border border-white/20"><Image src="/blonde_pinup.png" alt="" fill className="object-cover"/></div>
                  <div className="w-5 h-5 rounded-full overflow-hidden relative border border-white/20"><Image src="/brunette_pinup.png" alt="" fill className="object-cover"/></div>
                  <div className="w-5 h-5 rounded-full overflow-hidden relative border border-white/20"><Image src="/redhead_pinup.png" alt="" fill className="object-cover"/></div>
                </div>
                {lang === 'cs' ? "RETRO ŽENY" : "RETRO WOMEN"}
              </button>
              <button 
                onClick={() => { setSelectedTheme('cars'); setReels([THEMES.cars[0], THEMES.cars[1], THEMES.cars[2]]); }}
                className={`flex items-center gap-2 px-4 py-2 border font-mono text-xs tracking-widest uppercase transition-all ${selectedTheme === 'cars' ? 'bg-mafia-gold text-black border-mafia-gold' : 'bg-transparent text-white/50 border-white/20'}`}
              >
                <div className="flex -space-x-2">
                  <div className="w-5 h-5 rounded-full overflow-hidden relative border border-white/20"><Image src="/retro_car_1.png" alt="" fill className="object-cover"/></div>
                  <div className="w-5 h-5 rounded-full overflow-hidden relative border border-white/20"><Image src="/retro_car_2.png" alt="" fill className="object-cover"/></div>
                  <div className="w-5 h-5 rounded-full overflow-hidden relative border border-white/20"><Image src="/retro_car_3.png" alt="" fill className="object-cover"/></div>
                </div>
                {lang === 'cs' ? "AUTA" : "CARS"}
              </button>
              <button 
                onClick={() => { setSelectedTheme('planes'); setReels([THEMES.planes[0], THEMES.planes[1], THEMES.planes[2]]); }}
                className={`flex items-center gap-2 px-4 py-2 border font-mono text-xs tracking-widest uppercase transition-all ${selectedTheme === 'planes' ? 'bg-mafia-gold text-black border-mafia-gold' : 'bg-transparent text-white/50 border-white/20'}`}
              >
                <div className="flex -space-x-2">
                  <div className="w-5 h-5 rounded-full overflow-hidden relative border border-white/20"><Image src="/retro_plane_1.png" alt="" fill className="object-cover"/></div>
                  <div className="w-5 h-5 rounded-full overflow-hidden relative border border-white/20"><Image src="/retro_plane_2.png" alt="" fill className="object-cover"/></div>
                  <div className="w-5 h-5 rounded-full overflow-hidden relative border border-white/20"><Image src="/retro_plane_3.png" alt="" fill className="object-cover"/></div>
                </div>
                {lang === 'cs' ? "LETADLA" : "PLANES"}
              </button>
              <button 
                onClick={() => { setSelectedTheme('barber'); setReels([THEMES.barber[0], THEMES.barber[1], THEMES.barber[2]]); }}
                className={`flex items-center gap-2 px-4 py-2 border font-mono text-xs tracking-widest uppercase transition-all ${selectedTheme === 'barber' ? 'bg-mafia-gold text-black border-mafia-gold' : 'bg-transparent text-white/50 border-white/20'}`}
              >
                <span className="text-sm">✂️ 🪒 🪮</span>
                {lang === 'cs' ? "NÁSTROJE" : "TOOLS"}
              </button>
              <button 
                onClick={() => { setSelectedTheme('fruits'); setReels([THEMES.fruits[0], THEMES.fruits[1], THEMES.fruits[2]]); }}
                className={`flex items-center gap-2 px-4 py-2 border font-mono text-xs tracking-widest uppercase transition-all ${selectedTheme === 'fruits' ? 'bg-mafia-gold text-black border-mafia-gold' : 'bg-transparent text-white/50 border-white/20'}`}
              >
                <span className="text-sm">🍒 🍋 🍇</span>
                {lang === 'cs' ? "OVOCE" : "FRUITS"}
              </button>
            </div>
          )}

          <div className="bg-mafia-black/80 border-4 border-mafia-gold/50 p-6 md:p-12 rounded-xl shadow-[0_0_50px_rgba(var(--color-mafia-gold-rgb),0.2)]">
            <div className="flex gap-4 md:gap-8 justify-center mb-8">
              {reels.map((symbol, i) => (
                <div key={i} className="relative w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-lg border border-mafia-gold/30 flex items-center justify-center overflow-hidden">
                  {gameState === 'spinning' ? (
                    <motion.div
                      initial={{ y: "0%" }}
                      animate={{ y: ["0%", "-50%"] }}
                      transition={{ repeat: Infinity, duration: 0.15, ease: "linear" }}
                      className="absolute top-0 left-0 w-full h-[200%] flex flex-col opacity-80 blur-[2px]"
                    >
                      <div className="h-1/2 w-full flex items-center justify-center">{renderSymbolContent(symbol)}</div>
                      <div className="h-1/2 w-full flex items-center justify-center">{renderSymbolContent(THEMES[selectedTheme][Math.floor(Math.random() * THEMES[selectedTheme].length)])}</div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={symbol ? { y: "-100%" } : { opacity: 0 }}
                      animate={symbol ? { y: "0%" } : { opacity: 1 }}
                      transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {renderSymbolContent(symbol)}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {gameState === 'idle' || gameState === 'lost' ? (
              <div className="text-center">
                <button 
                  onClick={spin}
                  className="px-10 py-4 bg-mafia-red text-white font-heading font-black text-xl md:text-2xl uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,0,0,0.4)]"
                >
                  {lang === 'cs' ? "ZATOČIT" : "SPIN"}
                </button>
                {gameState === 'lost' && (
                  <p className="mt-4 text-white/40 font-mono text-xs uppercase tracking-widest animate-pulse">
                    {lang === 'cs' ? "Nic nepadlo. Zkus to znovu." : "Nothing. Try again."}
                  </p>
                )}
              </div>
            ) : gameState === 'spinning' ? (
              <div className="text-center py-4">
                <span className="text-mafia-gold font-mono tracking-widest uppercase animate-pulse">
                  {lang === 'cs' ? "LOSUJI..." : "SPINNING..."}
                </span>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-3xl md:text-5xl font-heading font-black text-mafia-gold uppercase mb-4 shadow-mafia-gold">
                  JACKPOT!
                </h3>
                <p className="text-white text-sm md:text-base font-mono tracking-widest uppercase mb-8">
                  {lang === 'cs' ? "Vyhráváš Voucher na 30 minut." : "You won a 30-min Voucher."}
                </p>
                
                {!hasSubmitted ? (
                  <form onSubmit={handleSubmitWinner} className="flex flex-col gap-4 items-center border-t border-white/10 pt-6">
                    <h4 className="text-white font-heading text-lg uppercase tracking-widest">
                      {lang === 'cs' ? "ZAPIŠ SE DO EVIDENCE VELITELE" : "ENTER YOUR NAME FOR HQ"}
                    </h4>
                    <input 
                      type="text" 
                      value={winnerName}
                      onChange={(e) => setWinnerName(e.target.value)}
                      placeholder={lang === 'cs' ? "Tvoje Přezdívka / Jméno" : "Your Nickname / Name"}
                      className="bg-mafia-black/80 border border-mafia-gold/30 text-mafia-gold font-mono p-3 w-full max-w-sm focus:outline-none focus:border-mafia-gold text-center"
                      required
                      maxLength={30}
                    />
                    <button 
                      type="submit" 
                      disabled={isSubmitting || !winnerName.trim()}
                      className="px-6 py-3 bg-mafia-gold text-black font-heading font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (lang === 'cs' ? "Odesílám..." : "Sending...") : (lang === 'cs' ? "VYBRAT VÝHRU" : "CLAIM PRIZE")}
                    </button>
                  </form>
                ) : (
                  <div className="border-t border-white/10 pt-6">
                    <h4 className="text-mafia-gold font-heading text-xl uppercase tracking-widest">
                      {lang === 'cs' ? "ÚSPĚŠNĚ ZAPSÁNO! VELITEL VÍ O TVÉ VÝHŘE." : "SUCCESSFULLY RECORDED! HQ KNOWS."}
                    </h4>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
