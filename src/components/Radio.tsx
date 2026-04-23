"use client";

import { useState, useEffect, useRef } from "react";
import { Radio as RadioReceiver } from "lucide-react";
import { trackEvent } from "../utils/analytics";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";

export function Radio() {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCta, setShowCta] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomTrack, setIsCustomTrack] = useState(false);
  const pathname = usePathname();
  const isVip = pathname === "/vip-club";
  const [messageIndex, setMessageIndex] = useState(0);

  const radioMessages = [
    "„Jen pro ty, co jsou ještě vzhůru.“",
    "„BŘITVA HLÁSÍ: Všechny cíle byly dnes úspěšně ostříhány.“",
    "„Všechno je v pořádku... Rodina se o to postará.“",
    "„ZPRÁVA: Káva v MMBarber voní dnes obzvlášť loajálně.“",
    "„Ticho je občas hlasitější než hudba.“",
    "„MIMOŘÁDNÁ ZPRÁVA: Respekt je nejlepší spropitné.“",
    "„STATUS: OPERACE PROBÍHÁ... BUDUJEME DYNASTII.“",
    "„TIP: Kdo dříve rezervuje, ten dříve stříhá.“"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % radioMessages.length);
    }, 6000); // 6 seconds per message
    return () => clearInterval(interval);
  }, [radioMessages.length]);

  useEffect(() => {
    // Strictly manual visibility: visible only when playing.
    setIsVisible(isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    const handleRemoteToggle = () => {
        const noise = noiseAudioRef.current;
        const jazz = jazzAudioRef.current;
        if (!noise || !jazz) return;

        if (isPlaying) {
            noise.pause();
            jazz.pause();
            setIsPlaying(false);
            setIsCustomTrack(false);
            setIsVisible(false); // Hide on stop
            window.dispatchEvent(new CustomEvent('mmbarber-radio-update', { detail: false }));
        } else {
            setIsPlaying(true);
            setIsCustomTrack(false);
            setIsVisible(true); // Show on play
            window.dispatchEvent(new CustomEvent('mmbarber-radio-update', { detail: true }));
            if (!hasPlayedFirstNoiseRef.current) {
                hasPlayedFirstNoiseRef.current = true;
                noise.play().catch(() => jazz.play().catch(console.error));
            } else {
                jazz.play().catch(console.error);
            }
        }
    };

    window.addEventListener('mmbarber-radio-toggle', handleRemoteToggle);
    return () => {
      window.removeEventListener('mmbarber-radio-toggle', handleRemoteToggle);
    };
  }, [isPlaying]);

  useEffect(() => {
    const handlePlayTrack = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.track && jazzAudioRef.current) {
        setIsVisible(true);
        setIsCustomTrack(true);
        setIsPlaying(true);
        jazzAudioRef.current.src = detail.track;
        jazzAudioRef.current.play().catch(console.error);
        trackEvent("radio_custom_track", { track: detail.track });
      }
    };

    const handleStopRadio = () => {
      if (jazzAudioRef.current) jazzAudioRef.current.pause();
      if (noiseAudioRef.current) noiseAudioRef.current.pause();
      setIsPlaying(false);
      setIsVisible(false);
      window.dispatchEvent(new CustomEvent('mmbarber-radio-update', { detail: false }));
    };

    window.addEventListener('mmbarber-play-track', handlePlayTrack);
    window.addEventListener('mmbarber-stop-radio', handleStopRadio);
    
    return () => {
      window.removeEventListener('mmbarber-play-track', handlePlayTrack);
      window.removeEventListener('mmbarber-stop-radio', handleStopRadio);
    };
  }, []);
  
  // Audio instances
  const noiseAudioRef = useRef<HTMLAudioElement | null>(null);
  const jazzAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedFirstNoiseRef = useRef(false);

  // Initialize audio once on mount
  useEffect(() => {
    noiseAudioRef.current = new Audio("/sounds/noise.mp3");
    noiseAudioRef.current.volume = 0.4;

    // We'll set the jazz track source dynamically when play starts if needed, 
    // but better to initialize now.
    jazzAudioRef.current = new Audio("/jazz-loop.mp3");
    jazzAudioRef.current.loop = true;
    jazzAudioRef.current.volume = 0.3;

    const handleNoiseEnded = () => {
      if (jazzAudioRef.current) {
        jazzAudioRef.current.play().catch(console.error);
      }
    };

    noiseAudioRef.current.addEventListener("ended", handleNoiseEnded);

    return () => {
      noiseAudioRef.current?.pause();
      jazzAudioRef.current?.pause();
      noiseAudioRef.current?.removeEventListener("ended", handleNoiseEnded);
    };
  }, []);

  // Handle path-based track switching for Jazz (if different)
  useEffect(() => {
    if (jazzAudioRef.current && !isCustomTrack) {
      const track = "/jazz-loop.mp3";
      // Only update if source changed
      if (!jazzAudioRef.current.src.endsWith(track)) {
        jazzAudioRef.current.src = track;
        if (isPlaying) jazzAudioRef.current.play().catch(console.error);
      }
    }
  }, [isPlaying, isCustomTrack]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150 && showCta) {
        setShowCta(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showCta]);

  const togglePlay = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setShowCta(false);

    const noise = noiseAudioRef.current;
    const jazz = jazzAudioRef.current;
    if (!noise || !jazz) return;

    if (isPlaying) {
      noise.pause();
      jazz.pause();
      setIsPlaying(false);
      setIsCustomTrack(false); // Reset on manual stop
      setIsVisible(false); // Hide player when stopped manually
      trackEvent("radio_stop_play");
      window.dispatchEvent(new CustomEvent('mmbarber-radio-update', { detail: false }));
    } else {
      setIsPlaying(true);
      setIsCustomTrack(false); // Returning to radio
      setIsVisible(true); // Show player when started manually
      trackEvent("radio_start_play");
      window.dispatchEvent(new CustomEvent('mmbarber-radio-update', { detail: true }));

      if (!hasPlayedFirstNoiseRef.current) {
        hasPlayedFirstNoiseRef.current = true;
        noise.play().catch(err => {
          console.error("Noise failed, skipping to jazz", err);
          jazz.play().catch(console.error);
        });
      } else {
        jazz.play().catch(console.error);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`hidden xl:flex fixed ${isVip ? 'bottom-6' : 'bottom-[84px]'} right-6 z-50 items-center transition-all duration-500 font-sans`}>
      {/* Horizontal Hand-drawn Play Me CTA */}
      {showCta && !isPlaying && (
        <div className="absolute right-full mr-4 flex items-center pointer-events-none select-none whitespace-nowrap animate-bounce-x">
          <svg className="absolute h-0 w-0">
            <defs>
              <filter id="ink-bleed">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
              </filter>
            </defs>
          </svg>
          
          <span 
            className="text-mafia-gold text-sm font-bold tracking-tight mr-4 uppercase font-mono"
          >
            {t.radio.playMe}
          </span>

          <svg width="40" height="20" viewBox="0 0 50 30" fill="none" className="text-mafia-gold" filter="url(#ink-bleed)">
            <path 
              d="M 5,15 C 15,13 35,13 45,15 M 45,15 L 35,7 M 45,15 L 35,23" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      <button 
        onClick={togglePlay}
        className={`w-64 h-[72px] flex items-center justify-start px-6 gap-6 border-2 transition-all duration-700 rounded-none bg-mafia-dark/95 backdrop-blur-md group relative shadow-2xl overflow-hidden ${
          isPlaying 
            ? "border-mafia-gold bg-mafia-black" 
            : "border-mafia-gold/30 text-mafia-gold hover:border-mafia-gold hover:bg-mafia-black"
        }`}
        aria-label="Toggle Jazz Music"
      >
        {/* Progress like bar at bottom */}
        {isPlaying && (
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-mafia-gold origin-left"
          />
        )}

        <div className="relative flex items-center justify-center w-10 h-10 border border-mafia-gold/20 shrink-0">
          <RadioReceiver 
            size={24} 
            className={`text-mafia-gold transition-all duration-700 ${isPlaying ? 'scale-110 drop-shadow-[0_0_10px_rgba(197,160,89,0.8)]' : ''}`} 
          />
          {isPlaying && (
             <motion.div 
               animate={{ opacity: [0.1, 0.4, 0.1] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute inset-0 bg-mafia-gold"
             />
          )}
        </div>

        <div className="flex flex-col items-start gap-0.5 overflow-hidden">
          <div className="flex items-center gap-3">
             <span className="font-heading font-black text-lg uppercase tracking-[0.2em] leading-none text-mafia-gold">Radio</span>
             <AnimatePresence>
               {isPlaying && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0 }}
                   className="flex gap-0.5 h-3 items-end"
                 >
                   <span className="w-1 h-2 bg-mafia-red/80 animate-[pulse_0.8s_infinite_ease-in-out]" style={{animationDelay: "0ms"}}></span>
                   <span className="w-1 h-3 bg-mafia-red/80 animate-[pulse_0.8s_infinite_ease-in-out]" style={{animationDelay: "150ms"}}></span>
                   <span className="w-1 h-2 bg-mafia-red/80 animate-[pulse_0.8s_infinite_ease-in-out]" style={{animationDelay: "300ms"}}></span>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
          
            <span className="text-[10px] font-mono font-black text-mafia-gold uppercase leading-tight">
              MM Radio je živě.
            </span>
            <div className="relative h-3 w-40 overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
               <AnimatePresence mode="popLayout">
                  <motion.span 
                    key={messageIndex}
                    initial={{ x: "120%", opacity: 0 }}
                    animate={{ x: "-120%", opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 15, 
                      ease: "linear",
                      opacity: { duration: 1 }
                    }}
                    className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-tighter leading-tight whitespace-nowrap absolute"
                  >
                    {radioMessages[messageIndex]}
                  </motion.span>
               </AnimatePresence>
            </div>
        </div>
      </button>

      <style jsx>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-10px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
