"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronUp } from "lucide-react";

export function BottomArt() {
  const { t } = useTranslation();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const checkHashAndOpen = () => {
      if (window.location.hash === "#specialni-projekty") {
        setIsUnlocked(true);
        setTimeout(() => {
          document.getElementById("specialni-projekty")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    const handleOpenRequest = () => {
      setIsUnlocked(true);
      setTimeout(() => {
        document.getElementById("specialni-projekty")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    };

    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const initialEffectsState = localStorage.getItem("mmbarber_mobile_effects_enabled") === "true";
    setIsMobileEffectsEnabled(initialEffectsState);
    
    const handleMobileEffectsUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsMobileEffectsEnabled(detail);
    };
    window.addEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as EventListener);

    // Check on mount
    checkHashAndOpen();

    // Listen for changes
    window.addEventListener('hashchange', checkHashAndOpen);
    window.addEventListener('mmbarber-open-web-info', handleOpenRequest);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as EventListener);
      window.removeEventListener('hashchange', checkHashAndOpen);
      window.removeEventListener('mmbarber-open-web-info', handleOpenRequest);
    };
  }, []);

  const handleToggle = () => {
    const nextState = !isUnlocked;
    setIsUnlocked(nextState);
    
    if (nextState && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/sounds/naboje.mp3" preload="auto" />
      
      <section id="specialni-projekty" className="relative w-full bg-[#080808] overflow-hidden flex flex-col items-center">
        {/* Background Textures */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>

        <div className="w-full border-t border-mafia-gold/20 relative z-10">
          <button 
            onClick={handleToggle}
            className="w-full py-16 flex flex-col items-center justify-center group transition-all duration-500 hover:bg-mafia-gold/[0.03]"
          >
            <motion.div 
               animate={isUnlocked ? { rotate: 180, scale: (!isMobile || isMobileEffectsEnabled) ? 1.2 : 1 } : { rotate: 0, scale: 1 }}
               className={`transition-all duration-500 mb-6 ${(!isMobile || isMobileEffectsEnabled) ? 'text-mafia-gold/20 group-hover:text-mafia-gold' : 'text-mafia-gold/40'}`}
            >
               <ChevronUp size={32} strokeWidth={1} />
            </motion.div>
            
            <div className="relative">
              <span className={`text-[10px] md:text-xs font-black font-heading transition-all duration-500 block uppercase tracking-[0.6em] ${(!isMobile || isMobileEffectsEnabled) ? 'text-mafia-gold/30 group-hover:text-mafia-gold' : 'text-mafia-gold/50'}`}>
                 {t.specialProjects.likeTheWeb}
              </span>
              <div className={`absolute -bottom-2 left-0 h-[1px] bg-mafia-gold/40 transition-all duration-700 ${(!isMobile || isMobileEffectsEnabled) ? 'w-0 group-hover:w-full' : 'w-1/2'}`}></div>
            </div>
          </button>
        </div>

        <AnimatePresence>
          {isUnlocked && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full border-t border-mafia-gold/10 flex flex-col items-center overflow-hidden bg-white/[0.01]"
            >
              <div className="max-w-5xl mx-auto px-6 md:px-12 text-center relative py-20 md:py-32">
                
                {/* Dossier Framing */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-mafia-gold/20"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-mafia-gold/20"></div>

                {/* 'CLASSIFIED' STAMP */}
                <motion.div
                  initial={{ opacity: 0, scale: 1.5, rotate: -20 }}
                  animate={{ opacity: 0.15, scale: 1, rotate: -15 }}
                  className="absolute top-10 right-10 border-4 border-mafia-red text-mafia-red font-black text-4xl px-4 py-2 pointer-events-none select-none"
                  style={{ fontFamily: "monospace" }}
                >
                  PŘÍSNĚ TAJNÉ
                </motion.div>

                <div className="absolute top-10 left-10 text-mafia-gold/10 font-mono text-[8px] tracking-[0.5em] flex flex-col items-start gap-1">
                  <span>PŘEDMĚT: MM_DESIGN_DIVIZE</span>
                  <span>PROVĚŘENÍ: POUZE_ÚROVEŇ_4</span>
                  <span>ID_SLOŽKY: #737-MARK-II</span>
                </div>
                
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   className="mb-8 font-mono text-[9px] md:text-[10px] uppercase tracking-[1.2em] text-mafia-gold/40"
                >
                  {t.specialProjects.division}
                </motion.div>

                <h2 className="text-5xl md:text-8xl font-heading font-black text-white mb-10 tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  {t.specialProjects.title}
                </h2>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-12"
                >
                  <div className="relative max-w-3xl">
                    <p className="text-mafia-gold font-sans italic text-2xl md:text-4xl leading-relaxed opacity-90">
                      &quot;{t.specialProjects.description}&quot;
                    </p>
                    <div className="absolute -left-8 top-0 text-mafia-gold/20 text-7xl font-serif">&quot;</div>
                  </div>

                  {/* Buttons with folder-tab look */}
                  <div className="flex flex-col sm:flex-row gap-10 mt-8 w-full justify-center">
                    <a 
                      href="mailto:info@mmbarber.cz" 
                      className="group relative"
                    >
                      <div className="absolute -inset-1 bg-mafia-gold blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <div className="relative px-16 py-8 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.4em] text-sm group-hover:bg-white transition-all duration-500">
                        {t.specialProjects.writeUs}
                      </div>
                    </a>
                    
                    <a 
                      href="tel:+420731000111" 
                      className="group relative"
                    >
                      <div className="relative px-16 py-8 border-2 border-mafia-gold/40 text-mafia-gold font-black uppercase tracking-[0.4em] text-sm group-hover:border-white group-hover:text-white transition-all duration-500">
                        {t.specialProjects.callUs}
                      </div>
                    </a>
                  </div>

                  <div className="mt-20 flex flex-col items-center gap-4">
                    <div className="w-16 h-[1px] bg-mafia-gold/20"></div>
                    <div className="opacity-20 font-mono text-[8px] uppercase tracking-[1em] text-mafia-gold">
                      PŘÍSNĚ TAJNÉ — POUZE PRO VAŠE OČI
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
