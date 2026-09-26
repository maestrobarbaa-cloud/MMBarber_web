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
  const [customTrackName, setCustomTrackName] = useState("");
  const [customTrackColor, setCustomTrackColor] = useState("");
  const pathname = usePathname();
  const isVip = pathname === "/vip-club";
  const [messageIndex, setMessageIndex] = useState(0);
  const [activeTheme, setActiveTheme] = useState<'normal' | 'blood' | 'noir'>('normal');
  const [playlist, setPlaylist] = useState<{name: string, track: string, color: string}[]>([]);
  const [showPlaylist, setShowPlaylist] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mmbarber_playlist');
      if (saved) {
        setPlaylist(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      const isBlood = document.documentElement.classList.contains('theme-blood') || document.documentElement.classList.contains('mode-blood');
      const isNoir = document.documentElement.classList.contains('noir-mode');
      if (isBlood) setActiveTheme('blood');
      else if (isNoir) setActiveTheme('noir');
      else setActiveTheme('normal');
    };
    updateTheme();
    window.addEventListener('mmbarber-graphics-update', updateTheme);
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      window.removeEventListener('mmbarber-graphics-update', updateTheme);
      observer.disconnect();
    };
  }, []);



  const VinylRecord = () => {
    const centerColor = {
      normal: 'var(--color-mafia-gold)',
      blood: '#ff0000',
      noir: '#e5e5e5'
    }[activeTheme];

    return (
      <motion.div
        animate={{ rotate: isPlaying ? 360000 : 0 }} // Massive rotation for infinite feel
        transition={{ 
          duration: isPlaying ? 4000 : 2, 
          ease: isPlaying ? "linear" : "easeOut" 
        }}
        className="relative w-24 h-24 rounded-full bg-[#0a0a0a] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden border border-white/10"
      >
        {/* Grooves */}
        {[4, 8, 12, 16, 20, 24, 28, 32].map(margin => (
          <div key={margin} className="absolute inset-0 rounded-full border border-white/5 opacity-20" style={{ margin: `${margin}px` }} />
        ))}
        {/* Center Label */}
        <div 
          className="w-10 h-10 rounded-full shadow-2xl transition-colors duration-500 border border-black/20 flex items-center justify-center relative" 
          style={{ backgroundColor: (isCustomTrack && customTrackColor) ? customTrackColor : centerColor }} 
        >
          {isCustomTrack && customTrackName && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div style={{ transform: 'scale(0.35)' }} className="flex flex-col items-center justify-center min-w-[80px]">
                 <span className="text-[12px] text-black/80 font-black font-sans uppercase text-center leading-[1.1]">
                   {customTrackName.split(' ').map((word, i) => <div key={i}>{word}</div>)}
                 </span>
               </div>
             </div>
          )}
        </div>
        {/* Hole */}
        <div className="absolute w-1.5 h-1.5 bg-black rounded-full" />
        {/* Cinematic Reflections */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-40" />
      </motion.div>
    );
  };

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
        setCustomTrackName(detail.name || "");
        setCustomTrackColor(detail.color || "");
        setIsPlaying(true);
        jazzAudioRef.current.src = detail.track;
        jazzAudioRef.current.play().catch(console.error);
        trackEvent("radio_custom_track", { track: detail.track });
        
        setPlaylist(prev => {
          if (!prev.find(p => p.track === detail.track)) {
            const newList = [...prev, { name: detail.name || "", track: detail.track, color: detail.color || "" }];
            localStorage.setItem('mmbarber_playlist', JSON.stringify(newList));
            return newList;
          }
          return prev;
        });
      }
    };

    const handleStopRadio = () => {
      if (jazzAudioRef.current) jazzAudioRef.current.pause();
      if (noiseAudioRef.current) noiseAudioRef.current.pause();
      setIsPlaying(false);
      setIsVisible(false);
      window.dispatchEvent(new CustomEvent('mmbarber-radio-update', { detail: false }));
    };

    const handleSetTrack = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.track) {
         setIsCustomTrack(true);
         setCustomTrackName(detail.name || "");
         setCustomTrackColor(detail.color || "");
         if (jazzAudioRef.current) {
           jazzAudioRef.current.src = detail.track;
           jazzAudioRef.current.play().then(() => {
             setIsPlaying(true);
             setIsVisible(true);
             window.dispatchEvent(new CustomEvent('mmbarber-radio-update', { detail: true }));
           }).catch((err) => {
             console.log("Autoplay prevented:", err);
             setIsPlaying(false);
             window.dispatchEvent(new CustomEvent('mmbarber-radio-update', { detail: false }));
           });
         }
      } else {
         setIsCustomTrack(false);
         setCustomTrackName("");
         setCustomTrackColor("");
         if (jazzAudioRef.current) {
           jazzAudioRef.current.src = "/jazz-loop.mp3";
           // If it was playing, we might want to try playing the new src
           if (isPlaying) {
             jazzAudioRef.current.play().catch(() => setIsPlaying(false));
           }
         }
      }
    };

    window.addEventListener('mmbarber-play-track', handlePlayTrack);
    window.addEventListener('mmbarber-stop-radio', handleStopRadio);
    window.addEventListener('mmbarber-set-radio-track', handleSetTrack);
    
    return () => {
      window.removeEventListener('mmbarber-play-track', handlePlayTrack);
      window.removeEventListener('mmbarber-stop-radio', handleStopRadio);
      window.removeEventListener('mmbarber-set-radio-track', handleSetTrack);
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

  const currentDisplayName = isCustomTrack && customTrackName ? customTrackName : "MMBarber Jazz Radio";

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.length === 0) return;
    
    // Find current index
    const currentIndex = playlist.findIndex(p => p.name === customTrackName);
    
    // If we are at the last track, or not currently playing a custom track, play the first one
    if (currentIndex === -1 || currentIndex >= playlist.length - 1) {
      window.dispatchEvent(new CustomEvent('mmbarber-play-track', { detail: playlist[0] }));
    } else {
      window.dispatchEvent(new CustomEvent('mmbarber-play-track', { detail: playlist[currentIndex + 1] }));
    }
  };

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
      
      // Delay hiding the player to allow the stylus arm to move back first
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);

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

  return (
    <AnimatePresence>
      {(isVisible || isPlaying) && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed ${isVip ? 'bottom-12' : 'bottom-24'} right-12 z-[9999999]`}
        >
          <div className="relative">
            {isPlaying && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-full mr-8 top-1/2 -translate-y-1/2 text-right flex flex-col items-end pointer-events-auto"
              >
                <div className="text-[9px] text-mafia-gold/40 uppercase tracking-[0.3em] font-mono mb-1">
                  PRÁVĚ HRAJE {playlist.length > 0 && "(KLIKNI PRO DALŠÍ)"}
                </div>
                <button 
                  onClick={handleNextTrack}
                  className="text-mafia-gold radio-lyrics-text font-serif italic text-lg leading-relaxed whitespace-nowrap tracking-wider hover:text-white transition-colors"
                  style={{ textShadow: '0 0 20px rgba(197,160,89,0.5)' }}
                  title={playlist.length > 0 ? "Přepnout skladbu" : ""}
                >
                  {currentDisplayName}
                </button>
                <div className="h-px w-32 bg-gradient-to-l from-mafia-gold/40 to-transparent ml-auto mt-2" />
              </motion.div>
            )}
            
            <button 
              onClick={togglePlay}
              className="relative group transition-all duration-500 active:scale-90"
              aria-label="Toggle Radio"
            >
              <div className="absolute inset-[-30%] rounded-full bg-mafia-gold/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl" />
              
              <div className="relative">
                <VinylRecord />
                
                {/* Stylus / Needle arm visual */}
                <motion.div 
                  animate={{ rotate: isPlaying ? 25 : -20 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute -top-2 -right-6 w-16 h-1.5 bg-mafia-gold/30 origin-right"
                  style={{ borderRadius: '3px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}
                >
                   <div className="absolute left-0 top-0 w-3 h-full bg-mafia-gold/50 rounded-l-sm" />
                </motion.div>

                {/* Playing indicator ring */}
                {isPlaying && (
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-mafia-gold/20"
                  />
                )}
              </div>

              {/* CTA Tooltip on hover */}
              {!isPlaying && (
                <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-[10px] font-mono text-mafia-gold bg-mafia-black/80 backdrop-blur-md border border-mafia-gold/30 px-3 py-1 uppercase tracking-widest whitespace-nowrap shadow-2xl">
                    Pustit Jazz
                  </span>
                </div>
              )}
            </button>
          </div>

          <style jsx>{`
            div {
              filter: drop-shadow(0 0 20px rgba(0,0,0,0.5));
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
