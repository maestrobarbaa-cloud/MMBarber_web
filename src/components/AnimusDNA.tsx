import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

export function AnimusDNA({ isBloodMode, isNoirMode }: { isBloodMode: boolean, isNoirMode: boolean }) {
  const { lang } = useTranslation();
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const segments = [
    { id: 1, label: 'SEQ 01', dataCs: 'Synchronizace paměti: 100%', dataEn: 'Memory Synchronization: 100%' },
    { id: 2, label: 'SEQ 02', dataCs: 'Nedostupná data (Čeká se na dešifrování)', dataEn: 'Data unavailable (Awaiting decryption)' },
    { id: 3, label: 'SEQ 03', dataCs: 'Poškozený záznam z minulosti', dataEn: 'Corrupted record from the past' },
    { id: 4, label: 'SEQ 04', dataCs: 'Genetická shoda nalezena', dataEn: 'Genetic match found' },
    { id: 5, label: 'SEQ 05', dataCs: '[NEZNÁMÁ ENERGIE]', dataEn: '[UNKNOWN ENERGY]' }
  ];

  const strokeColor = isBloodMode ? 'rgba(200,16,46,0.4)' : isNoirMode ? 'rgba(255,255,255,0.4)' : 'rgba(197,160,89,0.4)';
  const glowClass = isBloodMode ? 'shadow-[0_0_15px_rgba(200,16,46,0.6)] border-mafia-red bg-mafia-red/20' : isNoirMode ? 'shadow-[0_0_15px_rgba(255,255,255,0.6)] border-white bg-white/20' : 'shadow-[0_0_15px_rgba(197,160,89,0.6)] border-mafia-gold bg-mafia-gold/20';
  const inactiveClass = isBloodMode ? 'border-mafia-red/30 bg-black/80' : isNoirMode ? 'border-white/30 bg-black/80' : 'border-mafia-gold/30 bg-black/80';
  const textClass = isBloodMode ? 'text-mafia-red' : isNoirMode ? 'text-white' : 'text-mafia-gold';

  return (
    <div className="relative w-full flex justify-center pointer-events-auto z-40 mt-8 md:mt-16 h-32 items-center">
      
      {/* SVG Double Helix Background */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0 overflow-hidden">
        <svg width="600" height="80" viewBox="0 0 600 80" className="opacity-60 mix-blend-screen max-w-full">
           {/* Top strand */}
           <path 
             d="M 50 40 Q 87.5 0, 125 40 T 200 40 T 275 40 T 350 40 T 425 40 T 500 40 T 575 40" 
             fill="none" 
             stroke={strokeColor} 
             strokeWidth="1.5" 
             className="animate-[dash_10s_linear_infinite]"
             strokeDasharray="4 4"
           />
           {/* Bottom strand */}
           <path 
             d="M 50 40 Q 87.5 80, 125 40 T 200 40 T 275 40 T 350 40 T 425 40 T 500 40 T 575 40" 
             fill="none" 
             stroke={strokeColor} 
             strokeWidth="1.5" 
             className="animate-[dash_10s_linear_infinite_reverse]"
             strokeDasharray="4 4"
           />
           {/* Center straight connection line */}
           <line x1="50" y1="40" x2="575" y2="40" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
           
           {/* Vertical links */}
           {[87.5, 162.5, 237.5, 312.5, 387.5, 462.5, 537.5].map((x, i) => (
             <line key={i} x1={x} y1="20" x2={x} y2="60" stroke={strokeColor} strokeWidth="0.5" opacity="0.3" />
           ))}
        </svg>
      </div>
      
      <div className="flex flex-row justify-between w-[300px] md:w-[450px] relative z-10 px-0">
        {segments.map((seg) => (
          <div 
            key={seg.id}
            className="relative flex items-center justify-center group cursor-pointer"
            onMouseEnter={() => setHoveredSegment(seg.id)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            {/* The Hexagon/Diamond segment */}
            <div className={`w-6 h-6 md:w-8 md:h-8 border flex items-center justify-center rotate-45 transition-all duration-300 ${hoveredSegment === seg.id ? glowClass + ' scale-110' : inactiveClass}`}>
              <div className={`w-2 h-2 md:w-3 md:h-3 rotate-45 transition-all duration-300 ${hoveredSegment === seg.id ? (isBloodMode ? 'bg-mafia-red shadow-[0_0_10px_rgba(200,16,46,1)]' : isNoirMode ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,1)]' : 'bg-mafia-gold shadow-[0_0_10px_rgba(197,160,89,1)]') : 'bg-white/10'}`} />
            </div>

            {/* Connecting lines for hover (Vertical) */}
            <div className={`absolute bottom-full w-[1px] h-4 md:h-8 transition-all duration-300 ${hoveredSegment === seg.id ? (isBloodMode ? 'bg-mafia-red' : isNoirMode ? 'bg-white' : 'bg-mafia-gold') : 'bg-transparent'}`} />

            {/* Hover details tooltip */}
            <AnimatePresence>
              {hoveredSegment === seg.id && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                  transition={{ duration: 0.2 }}
                  className={`absolute bottom-[calc(100%+16px)] md:bottom-[calc(100%+32px)] whitespace-nowrap bg-black/90 backdrop-blur-md border px-4 py-2 rounded-sm shadow-xl ${isBloodMode ? 'border-mafia-red/50 shadow-[0_0_15px_rgba(200,16,46,0.3)]' : isNoirMode ? 'border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-mafia-gold/50 shadow-[0_0_15px_rgba(197,160,89,0.3)]'}`}
                >
                  <div className={`text-[10px] font-mono font-bold tracking-widest uppercase mb-1 ${textClass} text-center`}>
                    {seg.label}
                  </div>
                  <div className="text-xs font-sans text-white/90 text-center">
                    {lang === 'cs' ? seg.dataCs : seg.dataEn}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
