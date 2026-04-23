"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { text: "7:37", duration: 4000 },
  { text: "Ne každý příběh je vidět.", duration: 5000 },
  { text: "Některý se musely vybojovat…", duration: 5000 },
  { text: "…abychom dnes mohli stát tady.", duration: 6000 },
];

export function CinematicSequence737() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const handleTrigger = () => {
      setIsActive(true);
      setCurrentStep(0);
      
      // Start music
      window.dispatchEvent(new CustomEvent('mmbarber-play-track', { 
        detail: { track: "/sounds/musica.mp3" } 
      }));
    };

    window.addEventListener('mmbarber-trigger-737', handleTrigger);
    return () => window.removeEventListener('mmbarber-trigger-737', handleTrigger);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    if (currentStep < STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, STEPS[currentStep].duration);
      return () => clearTimeout(timer);
    } else {
      // Sequence finished
      const exitTimer = setTimeout(() => {
        // Hide sequence, but keep music playing
        setIsActive(false);
      }, 3000);
      return () => clearTimeout(exitTimer);
    }
  }, [isActive, currentStep]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] bg-black flex items-center justify-center p-8 text-center"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        
        {/* Cinematic Film Grain / Noise Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        <div className="relative max-w-4xl w-full">
          <AnimatePresence mode="wait">
            {currentStep < STEPS.length && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.95, letterSpacing: "-0.05em" }}
                animate={{ opacity: 1, scale: 1, letterSpacing: "0.2em" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="flex flex-col items-center gap-12"
              >
                <div className="w-px h-16 bg-gradient-to-t from-mafia-gold/40 to-transparent"></div>
                
                <h2 
                  className="text-white text-3xl md:text-5xl lg:text-7xl font-heading font-black tracking-[0.2em] leading-relaxed uppercase"
                  style={{ 
                    fontFamily: "var(--font-playfair), serif",
                    textShadow: "0 0 40px rgba(197,160,89,0.3)" 
                  }}
                >
                  {STEPS[currentStep].text}
                </h2>
                
                <div className="w-px h-16 bg-gradient-to-b from-mafia-gold/40 to-transparent"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cinematic Film Grain Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] mix-blend-overlay"></div>
        
        {/* Scanning Beam HUD */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px bg-white/5 z-10"
        />

        {/* Global Shutter Vignette */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_300px_rgba(0,0,0,1)]"></div>
      </motion.div>
    </AnimatePresence>
  );
}
