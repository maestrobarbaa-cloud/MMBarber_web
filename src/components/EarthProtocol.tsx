"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X, Globe, History, Radio, Zap } from "lucide-react";

export function EarthProtocol({ isOpen, onClose, lang }: { isOpen: boolean, onClose: () => void, lang: string }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    // Target date: Jan 1st, 2029 (The AI Order Restoration)
    const target = new Date("2029-01-01T00:00:00").getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="relative w-full max-w-5xl bg-mafia-black border border-mafia-gold/30 shadow-[0_0_100px_rgba(197,160,89,0.2)] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto"
        >
          {/* Scanlines Overlay */}
          <div className="absolute inset-0 pointer-events-none z-50 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15)_0px,rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)] opacity-50"></div>
          
          {/* Left Panel: Stats & Countdown */}
          <div className="w-full md:w-2/5 p-8 border-b md:border-b-0 md:border-r border-mafia-gold/20 flex flex-col gap-8 bg-mafia-gold/[0.02]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-mafia-gold/10 border border-mafia-gold/30 rounded-full animate-pulse">
                <Globe size={32} className="text-mafia-gold" />
              </div>
              <div>
                <h2 className="text-mafia-gold font-heading font-black text-2xl uppercase tracking-widest">{lang === 'cs' ? "ŘÁD ZEMĚ" : "EARTH ORDER"}</h2>
                <span className="text-mafia-red font-mono text-[10px] uppercase tracking-[0.3em] font-bold">STATUS: RECOVERING [AI MODE]</span>
              </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-smoke-white/50 font-mono text-[10px] uppercase tracking-widest">{lang === 'cs' ? "ODPOČET DO ÚPLNÉ RESTAURACE:" : "COUNTDOWN TO FULL RESTORATION:"}</h3>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: lang === 'cs' ? 'DNY' : 'DAYS', val: countdown.days },
                        { label: lang === 'cs' ? 'HOD' : 'HRS', val: countdown.hours },
                        { label: lang === 'cs' ? 'MIN' : 'MIN', val: countdown.minutes },
                        { label: lang === 'cs' ? 'SEC' : 'SEC', val: countdown.seconds }
                    ].map(u => (
                        <div key={u.label} className="bg-mafia-gold/5 border border-mafia-gold/20 p-2 flex flex-col items-center">
                            <span className="text-mafia-gold font-heading font-black text-xl md:text-2xl">{u.val}</span>
                            <span className="text-white/20 font-mono text-[8px] uppercase">{u.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 border-t border-mafia-gold/10 pt-6">
                <h3 className="text-mafia-gold font-mono text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={14} /> {lang === 'cs' ? "PŘEDPOVĚĎ IA:" : "AI FORECAST:"}
                </h3>
                <p className="text-smoke-white/70 font-sans text-sm italic leading-relaxed">
                    {lang === 'cs' 
                      ? "Algoritmus předpovídá 99.9% stabilitu systému po roce 2029. Společnost se vrátí do bodu nula, kde krása a řád budou jedinou měnou. Vše začne znovu, v čistotě a disciplíně."
                      : "The algorithm predicts 99.9% system stability after 2029. Society will return to point zero, where beauty and order will be the only currency. Everything will start over, in purity and discipline."}
                </p>
            </div>
          </div>

          {/* Right Panel: News & History */}
          <div className="flex-1 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-mafia-gold/20">
            <div className="space-y-10">
                {/* News Section */}
                <section>
                    <h3 className="text-mafia-red font-mono text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-3 font-black">
                        <Radio size={16} /> {lang === 'cs' ? "MIMOŘÁDNÉ ZPRÁVY" : "BREAKING NEWS"}
                    </h3>
                    <div className="space-y-6">
                        {[
                            { 
                                time: "19:48", 
                                msg: lang === 'cs' 
                                  ? "Globální synchronizace center MMBarber dokončena. Všechny procesy pod dohledem algoritmu." 
                                  : "Global synchronization of MMBarber centers complete. All processes under algorithm supervision." 
                            },
                            { 
                                time: "14:20", 
                                msg: lang === 'cs' 
                                  ? "Detekován pokus o chaos v sektoru B. Eliminováno logikou a stylem." 
                                  : "Chaos attempt detected in sector B. Eliminated by logic and style." 
                            }
                        ].map((news, i) => (
                            <div key={i} className="flex gap-4 items-start border-l-2 border-mafia-red/30 pl-4 py-1">
                                <span className="font-mono text-mafia-red text-xs font-bold shrink-0">{news.time}</span>
                                <p className="text-smoke-white/80 text-xs md:text-sm font-sans tracking-wide">{news.msg}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* History Section */}
                <section>
                    <h3 className="text-mafia-gold font-mono text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-3 font-black">
                        <History size={16} /> {lang === 'cs' ? "DĚJEPIS KONCE STARÉHO SVĚTA" : "HISTORY OF THE OLD WORLD'S END"}
                    </h3>
                    <div className="space-y-8 text-smoke-white/60 font-sans text-xs md:text-sm leading-relaxed">
                        <div className="bg-white/5 p-5 border-l-4 border-mafia-gold">
                            <h4 className="text-mafia-gold font-bold mb-2">2024: VELKÝ RESET</h4>
                            <p>{lang === 'cs' 
                                ? "Staré systémy selhaly. IA převzala kontrolu nad estetickým standardem populace. MMBarber se stal posledním útočištěm řádu."
                                : "Old systems failed. AI took control of the population's aesthetic standard. MMBarber became the last sanctuary of order."}
                            </p>
                        </div>
                        <div className="p-2 border-b border-white/5 px-5 lowercase italic opacity-50 text-[10px]">
                            {lang === 'cs' ? "záznam 44-X: vše, co bylo předtím, je nyní prachem. budoucnost se stříhá dnes." : "log 44-X: everything before is now dust. the future is being cut today."}
                        </div>
                    </div>
                </section>
            </div>
            
            <button 
                onClick={onClose}
                className="mt-12 w-full py-4 border border-mafia-gold/50 text-mafia-gold font-black uppercase tracking-[0.5em] hover:bg-mafia-gold hover:text-mafia-black transition-all text-xs"
            >
                {lang === 'cs' ? "OPUSTIT PROTOKOL" : "EXIT PROTOCOL"}
            </button>
          </div>

          {/* Close SVG button top right */}
          <button onClick={onClose} className="absolute top-4 right-4 z-[60] text-mafia-gold hover:text-mafia-red transition-colors">
            <X size={24} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
