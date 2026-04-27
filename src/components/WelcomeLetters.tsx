"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { playSound } from "../utils/audio";

interface LetterData {
  id: string;
  title: string;
  content: string;
}

const WaxSealIcon = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 80" fill="none" className="drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
    {/* Envelope Main Body */}
    <path d="M5 10 L95 10 L95 70 L5 70 Z" fill="var(--color-mafia-gold)" fillOpacity="0.2" stroke="var(--color-mafia-gold)" strokeWidth="1.5" />
    {/* Flap Shadows */}
    <path d="M5 10 L50 45 L95 10" stroke="#1a1a1a" strokeWidth="1.5" strokeOpacity="0.3" />
    <path d="M5 70 L40 40 M60 40 L95 70" stroke="#1a1a1a" strokeWidth="1" strokeOpacity="0.2" />
    {/* High-End Wax Seal */}
    <circle cx="50" cy="45" r="14" fill="#a00000" className="animate-pulse" />
    <path d="M42 45 Q50 35 58 45 Q50 55 42 45" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
    <circle cx="50" cy="45" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
  </svg>
);

const OpenedLetterIcon = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 80" fill="none" className="drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
    {/* Opened Envelope Body */}
    <path d="M5 30 L95 30 L95 75 L5 75 Z" fill="var(--color-mafia-gold)" fillOpacity="0.1" stroke="var(--color-mafia-gold)" strokeWidth="1.5" />
    {/* Paper sticking out */}
    <rect x="15" y="10" width="70" height="40" fill="white" className="animate-float-subtle" stroke="#d1d1d1" strokeWidth="0.5" />
    <path d="M20 20 H80 M20 28 H60 M20 36 H75" stroke="#1a1a1a" strokeWidth="0.5" strokeOpacity="0.4" />
    {/* Opened Flap */}
    <path d="M5 30 L50 5 L95 30" fill="var(--color-mafia-gold)" fillOpacity="0.3" stroke="var(--color-mafia-gold)" strokeWidth="1.5" />
  </svg>
);

const FolderIcon = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="drop-shadow-2xl">
    <path d="M4 10 H18 L22 6 H44 V42 H4 Z" fill="#2a2a2a" stroke="var(--color-mafia-gold)" strokeWidth="2" />
    <path d="M4 16 H44" stroke="var(--color-mafia-gold)" strokeWidth="1" opacity="0.4" />
    <path d="M30 25 L38 25 M30 31 L38 31" stroke="var(--color-mafia-gold)" strokeWidth="2" />
    <circle cx="15" cy="28" r="4" stroke="var(--color-mafia-gold)" strokeWidth="2" />
  </svg>
);

export function WelcomeLetters() {
  const { t, lang } = useTranslation();
  const [activeLetter, setActiveLetter] = useState<LetterData | null>(null);
  const [openedIds, setOpenedIds] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    
    // Skip for mobile immediately
    if (window.innerWidth < 1280) {
      localStorage.setItem("mmbarber_welcome_letters_seen_v13", "true");
      return;
    }

    // Unique version v13 to reset for all users who had issues
    const hasSeen = localStorage.getItem("mmbarber_welcome_letters_seen_v13"); 
    if (!hasSeen) {
      const timer = setTimeout(() => setIsVisible(true), 1500); // Faster appearance for better UX
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismissPermanently = () => {
    localStorage.setItem("mmbarber_welcome_letters_seen_v13", "true");
    setIsVisible(false);
  };

  const letters: LetterData[] = [
    { id: 'l1', title: t.welcome.l1.title, content: t.welcome.l1.content },
    { id: 'l2', title: t.welcome.l2.title, content: t.welcome.l2.content },
    { id: 'l3', title: t.welcome.l3.title, content: t.welcome.l3.content },
  ];

  const handleOpen = (letter: LetterData) => {
    setActiveLetter(letter);
    if (!openedIds.includes(letter.id)) {
      setOpenedIds(prev => [...prev, letter.id]);
    }
  };

  const handleClose = () => {
    setActiveLetter(null);
    if (openedIds.length === 3) {
      localStorage.setItem("mmbarber_welcome_letters_seen_v13", "true");
      // Hide immediately as requested
      setIsVisible(false);
      // Notify other components to clean up (like the intro logo loop)
      window.dispatchEvent(new Event("welcomeLettersFinished"));
    }
  };

  const playFireSound = () => {
    playSound("/sounds/sirka.mp3", 0.5);
  };

  const getPosition = (idx: number) => {
    const positions = [
      { top: '25%', left: '15%' },
      { top: '65%', left: '45%' },
      { top: '35%', left: '75%' }
    ];
    return positions[idx] || { top: '50%', left: '50%' };
  };

  if (!isMounted || !isVisible) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden select-none">
        {/* Dismiss Button */}
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 3 } }}
          onClick={handleDismissPermanently}
          className="absolute top-10 right-10 p-3 pointer-events-auto border border-mafia-gold text-mafia-gold bg-mafia-black/40 hover:bg-mafia-gold hover:text-mafia-black transition-all z-[9999]"
          title={lang === "cs" ? "Zavřít zprávy" : "Dismiss letters"}
        >
          <X size={20} />
        </motion.button>

        {/* Scattered Letters */}
        {letters.map((letter, idx) => (
          <motion.div
            key={letter.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { delay: 2.0 + idx * 0.3 }
            }}
            whileHover={{ scale: 1.1, zIndex: 50 }}
            className="absolute pointer-events-auto cursor-pointer"
            style={getPosition(idx)}
            onClick={() => handleOpen(letter)}
          >
            <div className="relative group">
              {/* Subtle Floating (No rotation) */}
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: idx % 2 === 0 ? 12 : -12 
                    }}
                    transition={{ 
                      duration: 6 + idx, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className={`relative transition-all duration-500 ${
                      openedIds.includes(letter.id) 
                        ? "opacity-30 z-10 scale-90 grayscale" 
                        : "bg-transparent z-20 hover:scale-110"
                    }`}
                  >
                    <div className="filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                      {openedIds.includes(letter.id) ? <OpenedLetterIcon /> : <WaxSealIcon />}
                    </div>
                
                {/* Noble Golden Exclamation Badge */}
                {!openedIds.includes(letter.id) && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-tr from-mafia-gold to-white flex items-center justify-center z-30 shadow-[0_0_20px_var(--color-mafia-gold-glow)] border border-mafia-black/20"
                  >
                    <span className="text-mafia-black font-serif italic font-black text-xl leading-none">!</span>
                  </motion.div>
                )}
                
                <span className={`absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-[0.3em] font-black whitespace-nowrap px-2 py-1 ${
                   openedIds.includes(letter.id) ? "opacity-30 text-mafia-gold" : "bg-mafia-black text-mafia-gold opacity-100"
                }`}>
                  {openedIds.includes(letter.id) ? (lang === 'cs' ? "VŠE VÍTE" : "AUTHORIZED") : (lang === 'cs' ? "DŮVĚRNÉ" : "CONFIDENTIAL")}
                </span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Letter Content Modal */}
      <AnimatePresence>
        {activeLetter && (
          <div className="fixed inset-0 z-[10005] flex items-center justify-center p-4 bg-mafia-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateX: 90 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ 
                scale: 0.1, 
                opacity: 0, 
                scaleY: 0,
                rotateZ: 45,
                filter: "blur(20px)",
                transition: { duration: 0.4, ease: "backIn" } 
              }}
              className="w-full max-w-lg bg-[#f0e6d2] p-8 md:p-12 relative shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-mafia-gold/30"
              style={{ transformOrigin: "center" }}
            >
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"></div>
              
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 text-mafia-black hover:scale-110 transition-transform"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col gap-8 relative z-10">
                <div className="flex items-center gap-4 border-b border-mafia-black/10 pb-4">
                  <FolderIcon size={40} />
                  <div>
                    <h3 className="text-mafia-black font-heading font-black text-2xl uppercase tracking-widest">{activeLetter.title}</h3>
                    <span className="text-[10px] font-mono text-mafia-red font-black uppercase tracking-widest">{t.welcome.authorized}</span>
                  </div>
                </div>

                <div className="text-mafia-black font-serif text-lg md:text-xl leading-relaxed italic border-l-4 border-mafia-red/20 pl-6 py-2">
                  {activeLetter.content}
                </div>

                <div className="flex flex-col items-end gap-2 mt-4">
                  <span className="text-[10px] font-mono text-mafia-black/40 uppercase tracking-widest">RAZÍTKO:</span>
                  <div className="text-2xl font-signature text-mafia-black opacity-80" style={{ fontFamily: "var(--font-playfair)", fontWeight: 900 }}>MMBARBER</div>
                </div>

                <button 
                  onClick={() => { handleClose(); playFireSound(); }}
                  className="group relative w-full bg-mafia-black text-[#f0e6d2] py-4 font-sans font-black uppercase tracking-[0.5em] overflow-hidden"
                >
                  <motion.div 
                    className="absolute inset-0 bg-mafia-red transform -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-500 ease-out skew-x-[-15deg]"
                  />
                  <span className="relative z-10">{lang === 'cs' ? "SPÁLIT PO PŘEČTENÍ" : "BURN AFTER READING"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
