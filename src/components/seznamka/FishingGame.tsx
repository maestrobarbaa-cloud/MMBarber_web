"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileData, ProfileCard } from "./ProfileCard";
import { Fish, Anchor, Heart, X, Droplet, Expand, XCircle, DollarSign, Dumbbell, Wine } from "lucide-react";

interface FishingGameProps {
  profiles: ProfileData[];
  lang: string;
  onAction: (direction: "left" | "right" | "up" | "superlike", profile: ProfileData) => void;
  activeBait: string | null;
}

type FishingState = 'idle' | 'struggling' | 'caught' | 'escaped';

export function FishingGame({ profiles, lang, onAction, activeBait }: FishingGameProps) {
  const [activeProfiles, setActiveProfiles] = useState<ProfileData[]>([]);
  const [fishingState, setFishingState] = useState<FishingState>('idle');
  const [targetProfile, setTargetProfile] = useState<ProfileData | null>(null);
  const [struggleProgress, setStruggleProgress] = useState(30);
  const [showFullProfile, setShowFullProfile] = useState(false);
  
  const struggleTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setActiveProfiles(profiles.slice(0, 7)); // Max 7 fish
  }, [profiles]);

  // Struggle mechanic logic
  useEffect(() => {
    if (fishingState === 'struggling') {
      setStruggleProgress(30); // Start at 30%
      
      struggleTimer.current = setInterval(() => {
        setStruggleProgress(prev => {
          const newProgress = prev - 8; // Decay rate
          if (newProgress <= 0) {
            handleEscape();
            return 0;
          }
          return newProgress;
        });
      }, 150); // Tick every 150ms
    } else {
      if (struggleTimer.current) clearInterval(struggleTimer.current);
    }

    return () => {
      if (struggleTimer.current) clearInterval(struggleTimer.current);
    };
  }, [fishingState]);

  const handleFishClick = (profile: ProfileData) => {
    if (fishingState !== 'idle') return;
    setTargetProfile(profile);
    setFishingState('struggling');
  };

  const handlePull = () => {
    if (fishingState !== 'struggling') return;
    
    setStruggleProgress(prev => {
      const newProgress = prev + 15; // Pull strength
      if (newProgress >= 100) {
        handleCatch();
        return 100;
      }
      return newProgress;
    });
  };

  const handleEscape = () => {
    setFishingState('escaped');
    setTimeout(() => {
      setFishingState('idle');
      setTargetProfile(null);
    }, 2000);
  };

  const handleCatch = () => {
    setFishingState('caught');
  };

  const handleAction = (action: "left" | "right" | "superlike") => {
    if (!targetProfile) return;
    
    onAction(action, targetProfile);
    setActiveProfiles(prev => prev.filter(p => p.name !== targetProfile.name));
    
    setFishingState('idle');
    setTargetProfile(null);
    setShowFullProfile(false);
  };

  const getRandomPosition = () => ({
    x: Math.random() * 80 + 10 + "%",
    y: Math.random() * 80 + 10 + "%",
  });

  const checkBaitMatch = (profile: ProfileData) => {
    if (!activeBait) return false;
    return profile.categories ? profile.categories.includes(activeBait) : false;
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-900/20 to-blue-950/90 rounded-3xl overflow-hidden border border-blue-500/30 shadow-[inset_0_0_50px_rgba(59,130,246,0.2)]">
      
      {/* Background ripples */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`ripple-${i}`}
            className="absolute rounded-full border border-blue-400"
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              width: Math.random() * 100 + 50 + "px",
              height: Math.random() * 100 + 50 + "px",
            }}
            animate={{ scale: [1, 2, 1], opacity: [0.1, 0, 0.1] }}
            transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Active Bait in the water */}
      <AnimatePresence>
        {activeBait && fishingState === 'idle' && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <div className="w-1 h-32 bg-gray-400/30 absolute bottom-full left-1/2 -translate-x-1/2" />
            <Anchor size={32} className="text-gray-300 drop-shadow-lg" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-mafia-gold/20 text-mafia-gold text-[10px] font-mono px-2 py-1 rounded-full whitespace-nowrap">
              {activeBait}
            </div>
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl w-16 h-16 -translate-x-1/4 -translate-y-1/4"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Fish (Silhouettes) */}
      <AnimatePresence>
        {fishingState === 'idle' && activeProfiles.map((profile, i) => {
          const isBoss = profile.categories && profile.categories.includes("🚀 Ambiciózní");
          const isMatch = checkBaitMatch(profile);
          
          // If a bait is active and it's a match, swim towards center. Else random.
          const targetX = activeBait ? (isMatch ? "50%" : getRandomPosition().x) : [getRandomPosition().x, getRandomPosition().x];
          const targetY = activeBait ? (isMatch ? "50%" : getRandomPosition().y) : [getRandomPosition().y, getRandomPosition().y];

          return (
            <motion.div
              key={profile.name}
              className="absolute cursor-pointer group z-20"
              style={{ willChange: "left, top, transform" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, left: targetX, top: targetY }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                left: { duration: activeBait && isMatch ? 5 : 20 + Math.random() * 10, repeat: activeBait ? 0 : Infinity, repeatType: "mirror" },
                top: { duration: activeBait && isMatch ? 5 : 15 + Math.random() * 10, repeat: activeBait ? 0 : Infinity, repeatType: "mirror" },
              }}
              onClick={() => handleFishClick(profile)}
            >
              <div className="relative flex flex-col items-center">
                <div className={`rounded-full bg-transparent flex items-center justify-center relative transition-all duration-300
                  ${isBoss ? 'w-20 h-20 shadow-[0_0_20px_rgba(197,160,89,0.3)]' : 'w-12 h-12 shadow-[0_0_10px_rgba(0,0,0,0.5)]'}
                  group-hover:scale-110
                `}>
                  {/* Silhouette overlay to hide photo */}
                  <div className="absolute inset-0 bg-black/95 z-10 rounded-full" />
                  {isBoss && <div className="absolute inset-0 bg-mafia-gold/10 mix-blend-screen z-20 rounded-full" />}
                  <img src={profile.photos[0]} alt="Mystery" className="w-full h-full object-cover opacity-20 rounded-full" />
                  
                  {/* Subtle eyes or indicator */}
                  <div className="absolute z-30 flex gap-2">
                     <div className={`w-1 h-1 rounded-full ${isBoss ? 'bg-mafia-gold' : 'bg-white/40'}`} />
                     <div className={`w-1 h-1 rounded-full ${isBoss ? 'bg-mafia-gold' : 'bg-white/40'}`} />
                  </div>
                </div>
                
                {/* Boss indicator (only subtle glow, no name) */}
                {isBoss && (
                  <div className="mt-2 text-mafia-gold/50 font-mono text-[8px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    VIP
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Struggling Minigame State */}
      <AnimatePresence>
        {fishingState === 'struggling' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-6"
            onClick={handlePull} // Allow clicking anywhere to pull
          >
            <h3 className="text-3xl font-heading font-black text-red-500 uppercase tracking-[0.2em] mb-8 animate-pulse text-center">
              {lang === 'cs' ? 'Zásek! Tahej!' : 'Hooked! Pull!'}
            </h3>
            
            {/* Progress Bar Container */}
            <div className="w-full max-w-[200px] h-6 bg-black/80 rounded-full border border-white/20 overflow-hidden mb-12 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <motion.div 
                className="h-full bg-gradient-to-r from-red-600 to-mafia-gold"
                animate={{ width: `${struggleProgress}%` }}
                transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
              />
            </div>

            {/* Fishing rod / reel indicator */}
            <motion.div
              animate={{ rotate: struggleProgress * 3.6 }}
              className="w-32 h-32 rounded-full border-4 border-white/10 border-t-mafia-gold flex items-center justify-center"
            >
               <Anchor size={48} className="text-white/40" />
            </motion.div>

            <p className="mt-12 text-white/40 font-mono text-sm uppercase tracking-widest text-center">
               {lang === 'cs' ? 'Klikej rychle na displej!' : 'Tap screen rapidly!'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Escaped State */}
      <AnimatePresence>
        {fishingState === 'escaped' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 p-6 text-center"
          >
             <XCircle size={64} className="text-red-500 mb-4" />
             <h3 className="text-2xl font-heading font-black text-white uppercase tracking-widest">
               {lang === 'cs' ? 'Ryba utekla!' : 'The fish escaped!'}
             </h3>
             <p className="text-white/50 font-mono mt-2">
               {lang === 'cs' ? 'Byl jsi moc pomalý.' : 'You were too slow.'}
             </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Caught Profile Modal (Revealed) */}
      <AnimatePresence>
        {fishingState === 'caught' && targetProfile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            {!showFullProfile ? (
              <motion.div 
                initial={{ scale: 0.5, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -50 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-full max-w-sm bg-mafia-dark border border-mafia-gold/50 rounded-sm p-6 shadow-[0_0_40px_rgba(197,160,89,0.2)] relative flex flex-col items-center"
              >
                <div className="absolute -top-12 text-mafia-gold flex items-center gap-2">
                  <span className="text-3xl">✨</span>
                  <Fish size={40} className="drop-shadow-[0_0_15px_rgba(197,160,89,0.8)]" />
                  <span className="text-3xl">✨</span>
                </div>

                <h3 className="text-xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-1">
                  {lang === 'cs' ? 'Úspěšný lov!' : 'Great catch!'}
                </h3>
                
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-mafia-gold my-6 shadow-[0_0_30px_rgba(197,160,89,0.4)] relative group">
                  <img src={targetProfile.photos[0]} alt={targetProfile.name} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setShowFullProfile(true)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <Expand size={28} />
                  </button>
                </div>

                <div className="text-center mb-8">
                  <h4 className="text-2xl font-black text-white">{targetProfile.name}, {targetProfile.age}</h4>
                  <p className="text-white/50 text-sm font-mono mt-1">{targetProfile.city}</p>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={() => handleAction("right")}
                    className="w-full py-4 bg-mafia-gold text-black font-heading font-black uppercase tracking-widest hover:bg-white transition-all flex justify-center items-center gap-2"
                  >
                    <Heart size={20} />
                    {lang === 'cs' ? 'Nechat si kapra' : 'Keep the catch'}
                  </button>
                  <button 
                    onClick={() => handleAction("superlike")}
                    className="w-full py-3 bg-cyan-900/30 border border-cyan-400/50 text-cyan-400 font-heading font-black uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all flex justify-center items-center gap-2"
                  >
                    <Anchor size={18} />
                    {lang === 'cs' ? 'Do kádě na později' : 'Save in the vat'}
                  </button>
                  <button 
                    onClick={() => handleAction("left")}
                    className="w-full py-3 bg-red-900/20 border border-red-500/50 text-red-500 font-heading font-black uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all flex justify-center items-center gap-2"
                  >
                    <X size={18} />
                    {lang === 'cs' ? 'Malá rybka, hodit zpět' : 'Throw back'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm h-full max-h-[600px] relative"
              >
                <div className="absolute top-2 right-2 z-50">
                  <button 
                    onClick={() => setShowFullProfile(false)}
                    className="p-2 bg-black/50 rounded-full text-white/70 hover:text-white backdrop-blur-md border border-white/20"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
                <div className="h-full overflow-y-auto rounded-3xl hide-scrollbar pointer-events-auto">
                   <ProfileCard profile={targetProfile} />
                </div>
                
                <div className="absolute bottom-4 left-0 w-full px-4 flex justify-between z-50">
                   <button 
                      onClick={() => handleAction("left")}
                      className="w-14 h-14 rounded-full bg-black border border-red-500/50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-black shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    >
                      <X size={24} />
                    </button>
                    <button 
                      onClick={() => handleAction("right")}
                      className="w-14 h-14 rounded-full bg-black border border-mafia-gold/50 text-mafia-gold flex items-center justify-center hover:bg-mafia-gold hover:text-black shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                    >
                      <Heart size={24} />
                    </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
