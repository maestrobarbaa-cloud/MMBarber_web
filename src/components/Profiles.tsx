"use client";

import Image from "./OptimizedImage";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { CalendarDays, Languages, Sparkles, Heart, Clover, TrendingDown, TrendingUp, Shield, Medal, Trophy, Crown, Flame, ArrowRight } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { trackEvent } from "../utils/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "../utils/audio";
import { GameFragment } from "./GameFragment";
import { useBarbers } from "@/contexts/BarberContext";
import { useGame } from "@/contexts/GameContext";
import { OperativeModal } from "./OperativeModal";
import { UnlockDiagram } from "./UnlockDiagram";
import { 
  subscribeToUserRatings
} from "@/utils/voting";
import { 
  subscribeToGlobalXpStats, 
  addLikeToBarber, 
  hasLikedToday,
  calculateLevelFromXp,
  getCzechRankFromLevel,
  getEnglishRankFromLevel,
  GlobalBarberStats
} from "@/utils/barberXp";
import { getOperativeStatusData, subscribeToStatusUpdates, evaluateStatus, EvaluatedStatus, formatSchedule } from "@/utils/status";
import { getDailyRole } from "@/utils/dailyRoles";

import { StatusDot } from "./profiles/StatusDot";
import { StatusText } from "./profiles/StatusText";

import { 
  BarberProfile, 
  TOMAS_QUOTES, 
  TOMAS_QUOTES_EN, 
  TOMAS_CHAIR_GREETINGS_CS, 
  CHAIR_GREETINGS_CS, 
  CHAIR_GREETINGS_EN 
} from "@/data/profilesData";

import { MilitaryInsignia } from "./profiles/MilitaryInsignia";
import { BarberRanking } from "./profiles/BarberRanking";
import { MissionLoading } from "./profiles/MissionLoading";
import { MissionFailedOverlay } from "./profiles/MissionFailedOverlay";
export const getVocative = (name: string, lang: string) => {
  if (!name) return "";
  const n = name.trim().toUpperCase();
  if (lang !== 'cs') return name;

  // Basic Czech vocative heuristics
  if (n.endsWith('A')) return n.slice(0, -1) + 'O';
  if (n.endsWith('EK')) return n.slice(0, -2) + 'KU';
  if (n.endsWith('ÍK')) return n.slice(0, -2) + 'ÍKU';
  if (n.endsWith('US')) return n.slice(0, -2) + 'E';
  if (n.endsWith('ES')) return n.slice(0, -2) + 'E';
  if (n.endsWith('O')) return n;
  if (n.endsWith('I') || n.endsWith('Í')) return n;
  if (n.endsWith('E') || n.endsWith('Ě')) return n;
  
  // Soft consonants
  if (['Š', 'Ž', 'Č', 'Ř', 'C', 'J', 'Ď', 'Ť', 'Ň'].includes(n.slice(-1))) return n + 'I';
  // Hard/Velar consonants
  if (n.endsWith('H') || n.endsWith('CH') || n.endsWith('K') || n.endsWith('G')) return n + 'U';
  // Others
  if (['S', 'Z', 'T', 'D', 'M', 'B', 'P', 'V', 'N', 'R', 'L'].includes(n.slice(-1))) return n + 'E';
  
  return n;
};



import { ChairWithCard } from "./profiles/BarberCard";

export function Profiles() {
  const { t, lang } = useTranslation();
  const { isTomasUnlocked, isNellaUnlocked, totalCollected } = useGame();
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<'tomas' | 'nella' | null>(null);
  const [activeDialogueText, setActiveDialogueText] = useState("");
  
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  
  useEffect(() => {
    const d = new Date();
    const month = d.getMonth(); // 0 = Jan, 11 = Dec
    const day = d.getDate();
    
    if (month === 1 && day >= 10 && day <= 15) setActiveEvent('valentyn');
    else if ((month === 9 && day >= 25) || (month === 10 && day <= 2)) setActiveEvent('halloween');
    else if (month === 10 && day >= 20 && day <= 30) setActiveEvent('blackfriday');
    else if (month === 11 && day >= 20 && day <= 26) setActiveEvent('xmas');
    else if ((month === 11 && day >= 30) || (month === 0 && day <= 5)) setActiveEvent('newyear');
    else if (month === 6 || month === 7) setActiveEvent('summer');
    else setActiveEvent(null);
  }, []);
  
  const [isDecided, setIsDecided] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [slotIndex, setSlotIndex] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [revealedBarbers, setRevealedBarbers] = useState<string[]>([]);
  const [graphicsTier, setGraphicsTier] = useState<string>("low");
  const [selectedBarberForModal, setSelectedBarberForModal] = useState<any>(null);
  const [chairGreetingsIndices, setChairGreetingsIndices] = useState<{ [key: string]: number }>({});
  const [trackerScores, setTrackerScores] = useState<{[key: string]: number}>({});

  const { barbers, loading } = useBarbers();

  useEffect(() => {
    const handleTrackerUpdate = () => {
      const scores: {[key: string]: number} = {};
      barbers.forEach(b => {
        scores[b.id] = parseInt(localStorage.getItem(`mmbarber_${b.id}_clicks`) || '0', 10);
      });
      setTrackerScores(scores);
    };
    handleTrackerUpdate();
    window.addEventListener('mmbarber-tracker-update', handleTrackerUpdate);
    return () => window.removeEventListener('mmbarber-tracker-update', handleTrackerUpdate);
  }, [barbers]);

  const handleOpenDossier = (barber: any) => {
    setSelectedBarberForModal(barber);
    const key = `mmbarber_${barber.id}_clicks`;
    const current = parseInt(localStorage.getItem(key) || '0', 10);
    localStorage.setItem(key, (current + 1).toString());
    window.dispatchEvent(new Event('mmbarber-tracker-update'));
  };

  const visibleBarbers = barbers
    .filter(b => b.id !== 'nella' && b.name !== 'Nella') // Hide Nella
    .map(b => {
    let modifiedB = { ...b };
    const threshold = b.unlockThreshold || 5;
    if (b.requiresUnlock && totalCollected < threshold) {
      modifiedB.image = "question-mark";
    }
    return modifiedB;
  }).sort((a, b) => (trackerScores[b.id] || 0) - (trackerScores[a.id] || 0));

  useEffect(() => {
    const indices: { [key: string]: number } = {};
    
    const idxTomas = Math.floor(Math.random() * TOMAS_CHAIR_GREETINGS_CS.length);
    indices['tomas'] = idxTomas;

    const idxNella = Math.floor(Math.random() * CHAIR_GREETINGS_CS.length);
    indices['nella'] = idxNella;
    
    setChairGreetingsIndices(indices);
  }, []);

  const [customNames, setCustomNames] = useState({ tomas: "", nella: "" });
  const [statusData, setStatusData] = useState(getOperativeStatusData());
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = subscribeToStatusUpdates(setStatusData);
    const interval = setInterval(() => {
      setStatusData(getOperativeStatusData());
      setTick(t => t + 1);
    }, 60000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const checkNames = () => {
      setCustomNames({
        tomas: localStorage.getItem("mmbarber_custom_name_tomas") || "",
        nella: localStorage.getItem("mmbarber_custom_name_nella") || ""
      });
    };
    checkNames();
    window.addEventListener("storage", checkNames);
    window.addEventListener("mmbarber_names_updated", checkNames);
    return () => {
      window.removeEventListener("storage", checkNames);
      window.removeEventListener("mmbarber_names_updated", checkNames);
    };
  }, []);

  // Real-time Global XP and Liking States
  const [globalStats, setGlobalStats] = useState<GlobalBarberStats>({});
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const playCardSound = () => {
    playSound("/sounds/card.mp3", 0.9);
  };

  const handleLike = async (barberId: string) => {
    playSound("/sounds/reload.mp3", 0.5);
    const success = await addLikeToBarber(barberId);
    if (success) {
      playSound("/sounds/leather.mp3", 0.6);
      trackEvent("barber_liked_xp_home", { barberId });
      setLikedMap(prev => ({ ...prev, [barberId]: true }));
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const updateTier = () => {
      const tier = document.documentElement.getAttribute('data-graphics-tier') || "low";
      setGraphicsTier(tier);
    };
    updateTier();
    window.addEventListener('mmbarber-graphics-update', updateTier);
    
    // Visibility Observer for Dialogues
    const observer = new IntersectionObserver(
      ([entry]) => setIsSectionVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    const section = document.getElementById('operativi');
    if (section) observer.observe(section);

    // Lottery is currently disabled per user request - skipping directly to profiles
    setIsFirstVisit(false);

    const savedRevealed = localStorage.getItem("mmbarber_revealed_barbers");
    if (savedRevealed) {
      try {
        setRevealedBarbers(JSON.parse(savedRevealed));
      } catch {}
    }

    const handleReveal = () => {
      const allNames = barbers.map(b => b.name);
      setRevealedBarbers(allNames);
      localStorage.setItem("mmbarber_revealed_barbers", JSON.stringify(allNames));
    };

    window.addEventListener("mmbarber-reveal-barbers", handleReveal);

    // Real-time listener for global XP stats
    const unsubscribeXp = subscribeToGlobalXpStats((stats) => {
      setGlobalStats(stats);
      
      const updatedLikes: Record<string, boolean> = {};
      barbers.forEach((b) => {
        updatedLikes[b.id] = hasLikedToday(b.id);
      });
      setLikedMap(updatedLikes);
    });

    return () => {
      window.removeEventListener("mmbarber-reveal-barbers", handleReveal);
      window.removeEventListener('mmbarber-graphics-update', updateTier);
      unsubscribeXp();
      if (section) observer.unobserve(section);
    };
  }, [revealedBarbers]);

  const handleRandomize = () => {
    if (isRandomizing || isDecided) return;
    localStorage.setItem("mmbarber_profiles_seen", "true");
    trackEvent("cta_randomize_barber");

    const availableBarbers = barbers.filter(b => !b.missionFailed);
    if (availableBarbers.length === 0) return;

    setIsRandomizing(true);
    let ticks = 0;
    const maxTicks = 40; 
    const interval = setInterval(() => {
      setSlotIndex(prev => (prev + 1) % availableBarbers.length);
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        // Find the index of the winner in the ORIGINAL barbers array for the booking link
        // Actually, availableBarbers[winner] is already from the filtered list, but we need slotIndex to match the visual if we use slotIndex for rendering.
        // Wait, slotIndex is used to render the card.
        const winner = Math.floor(Math.random() * availableBarbers.length);
        
        // Find the index in the original barbers array
        const originalIndex = barbers.findIndex(b => b.name === availableBarbers[winner].name);
        
        setSlotIndex(originalIndex);
        setIsRandomizing(false);
        setIsDecided(true);
        setTimeout(() => {
          window.location.href = availableBarbers[winner].bookingLink || "#";
        }, 1500);
      }
    }, 80);
  };

  // TOMAS QUOTES ALGORITHM
  useEffect(() => {
    const isMobile = window.innerWidth < 1280;
    // Povolíme zobrazení na desktopu (kde je aktivní sekce operativi)
    if (!isSectionVisible || isMobile) {
      setActiveSpeaker(null);
      setActiveDialogueText("");
      return;
    }

    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;

    const playQuote = () => {
      let seen: string[] = [];
      try {
        const stored = localStorage.getItem('mmbarber_tomas_quotes_seen');
        if (stored) seen = JSON.parse(stored);
      } catch(e) {}

      if (seen.length >= TOMAS_QUOTES.length) {
        seen = [];
      }

      const availableQuotes = TOMAS_QUOTES.filter((q: string) => !seen.includes(q));
      const randomIndex = Math.floor(Math.random() * availableQuotes.length);
      const selectedQuote = availableQuotes[randomIndex] || TOMAS_QUOTES[0];

      seen.push(selectedQuote);
      try {
        localStorage.setItem('mmbarber_tomas_quotes_seen', JSON.stringify(seen));
      } catch(e) {}

      setActiveSpeaker('tomas');
      setActiveDialogueText(selectedQuote);

      t2 = setTimeout(() => {
        setActiveSpeaker(null);
        setActiveDialogueText("");
        
        t1 = setTimeout(() => {
          playQuote();
        }, 12000);
      }, 10000);
    };

    const initialDelay = setTimeout(() => {
      playQuote();
    }, 4000);

    return () => {
      clearTimeout(initialDelay);
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
      setActiveSpeaker(null);
      setActiveDialogueText("");
    };
  }, [isSectionVisible]);

  const translatedBarbers = useMemo(() => {
    return visibleBarbers.map(b => {
      const isTomas = b.id === 'tomas';
      const barberKey = isTomas ? 'tomas' : 'nella';
      const barberTranslations = t.operatives?.barbers?.[barberKey as 'tomas' | 'nella'];
      
      const staticDesc = barberTranslations?.story || "";
      const dialogueText = activeSpeaker === barberKey ? activeDialogueText : "";
      const customName = isTomas ? customNames.tomas : customNames.nella;
      return {
        ...b,
        name: customName || barberTranslations?.name || b.name,
        role: barberTranslations?.role || b.role,
        motto: barberTranslations?.motto || "",
        story: dialogueText || staticDesc || b.desc,
        schedule: formatSchedule(statusData[barberKey as 'tomas' | 'nella'], lang) || b.schedule,
        specializations: barberTranslations?.specializations || b.specializations,
        englishSpeaking: (barberTranslations as { englishSpeaking?: string })?.englishSpeaking,
        symbol: b.symbol,
        isHidden: false
      };
    });
  }, [visibleBarbers, t, customNames, activeSpeaker, activeDialogueText, statusData, lang, totalCollected]);

  if (loading || visibleBarbers.length === 0) return null;

  return (
    <section 
      id="operativi" 
      className={`relative w-full pt-10 md:pt-20 pb-4 md:pb-8 px-4 md:px-12 bg-transparent flex flex-col items-center scroll-mt-32 ${graphicsTier !== 'lite' ? 'border-t-8 border-mafia-dark' : ''}`}
    >
      {graphicsTier !== 'lite' && <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/black-paper.png')" }}></div>}
      
      {graphicsTier !== 'lite' && <GameFragment id="hero_frag_1" className="top-48 left-12 md:left-24" size={40} delay={2000} />}
      {graphicsTier !== 'lite' && <GameFragment id="hero_frag_2" className="bottom-40 right-16 md:right-32" size={30} delay={4500} />}
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="max-w-[1600px] mx-auto w-full">
            <div className="w-full">
                {graphicsTier !== 'lite' && (
                <div className="text-center mb-16 md:mb-24">
                    <h2 className="text-3xl md:text-5xl font-heading font-black text-smoke-white mb-3 md:mb-4 tracking-[0.3em] uppercase">{t.operatives.title}</h2>
                    <div className="section-underline w-16 md:w-24 h-1 bg-gradient-to-r from-mafia-gold/20 via-mafia-gold to-mafia-gold/20 mx-auto mb-4 md:mb-6 shadow-[0_0_20px_var(--color-mafia-gold-glow)]" style={{ background: 'linear-gradient(to right, transparent, var(--user-accent-color), transparent)', boxShadow: '0 0 20px var(--user-glow-color)' }}></div>
                    <div className="text-smoke-white/60 font-sans tracking-widest uppercase text-[10px] md:text-sm px-4 mb-4 flex flex-col items-center gap-1 md:gap-2 cursor-default group">
                        <span className="group-hover:text-white transition-colors duration-500">
                            {t.operatives.subtitle.split('.')[0]}.
                        </span>
                        
                        <div className="mt-6 flex justify-center">
                            {activeEvent ? (
                              <motion.div
                                  animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 20px rgba(138,7,7,0.4)", "0 0 40px rgba(138,7,7,0.8)", "0 0 20px rgba(138,7,7,0.4)"] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                  className="rounded"
                              >
                                  <Link 
                                      href={
                                        activeEvent === 'valentyn' ? "/valentynmatch" :
                                        activeEvent === 'halloween' ? "/halloween-sins" :
                                        activeEvent === 'blackfriday' ? "/blackfriday-darkweb" :
                                        activeEvent === 'xmas' ? "/xmas-ledger" :
                                        activeEvent === 'newyear' ? "/newyear-tarot" :
                                        "/summer-vice"
                                      }
                                      className="px-8 py-4 bg-[#0a0a0a] border-2 border-[#b30000] text-[#ff3333] hover:bg-[#b30000] hover:text-white font-heading font-black tracking-[0.2em] uppercase text-sm md:text-base transition-colors duration-300 rounded flex items-center gap-3 cursor-pointer"
                                      onClick={() => playSound("/sounds/digital_start.mp3", 0.5)}
                                  >
                                      <span className="drop-shadow-[0_0_8px_rgba(179,0,0,0.8)]">
                                        {lang === 'cs' ? (
                                          activeEvent === 'valentyn' ? 'VZTAHOVÁ RULETA' :
                                          activeEvent === 'halloween' ? 'KNIHA HŘÍCHŮ' :
                                          activeEvent === 'blackfriday' ? 'ČERNÝ TRH' :
                                          activeEvent === 'xmas' ? 'KMOTRŮV SEZNAM' :
                                          activeEvent === 'newyear' ? 'SYNDIKÁTNÍ VĚŠTBA' :
                                          'MIAMSKÝ KONTRABAND'
                                        ) : (
                                          activeEvent === 'valentyn' ? 'RELATIONSHIP ROULETTE' :
                                          activeEvent === 'halloween' ? 'BOOK OF SINS' :
                                          activeEvent === 'blackfriday' ? 'DARK WEB' :
                                          activeEvent === 'xmas' ? "GODFATHER'S LEDGER" :
                                          activeEvent === 'newyear' ? 'SYNDICATE TAROT' :
                                          'VICE CITY STASH'
                                        )}
                                      </span>
                                      <span className="text-xl">
                                        {activeEvent === 'valentyn' ? '🎰' :
                                         activeEvent === 'halloween' ? '💀' :
                                         activeEvent === 'blackfriday' ? '💻' :
                                         activeEvent === 'xmas' ? '💼' :
                                         activeEvent === 'newyear' ? '🃏' :
                                         '🌴'}
                                      </span>
                                  </Link>
                              </motion.div>
                            ) : (
                              <Link 
                                  href="/losovat-barbera"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-6 py-3 bg-mafia-gold/5 border border-mafia-gold/30 hover:border-mafia-gold hover:bg-mafia-gold text-mafia-gold hover:text-mafia-black font-heading font-black tracking-[0.2em] uppercase text-xs transition-all duration-300 rounded shadow-[0_0_15px_rgba(197,160,89,0.15)] hover:shadow-[0_0_25px_rgba(197,160,89,0.4)] flex items-center gap-2 group cursor-pointer"
                                  onClick={() => playSound("/sounds/hover.mp3", 0.4)}
                              >
                                  <span>{lang === 'cs' ? 'Losovat barbera' : 'Draw a barber'}</span>
                                  <motion.span 
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="inline-block font-sans font-bold"
                                  >
                                    ➔
                                  </motion.span>
                              </Link>
                            )}
                        </div>
                    </div>
                </div>
                )}
                <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-8 xl:gap-10 px-4 md:px-0 w-full mx-auto py-4 xl:py-8 relative">
                    {translatedBarbers.map((barber, index) => {
                      const isTomas = barber.name === 'Tomáš' || barber.name === 'Tomas';
                      const barberKey = isTomas ? 'tomas' : 'nella';
                      const greetingIdx = chairGreetingsIndices[barberKey] ?? 0;
                      let chairGreetingText = '';
                      if (isTomas) {
                        chairGreetingText = lang === 'cs' ? TOMAS_CHAIR_GREETINGS_CS[greetingIdx % TOMAS_CHAIR_GREETINGS_CS.length] : TOMAS_QUOTES_EN[greetingIdx % TOMAS_QUOTES_EN.length];
                      } else {
                        chairGreetingText = lang === 'cs' ? CHAIR_GREETINGS_CS[greetingIdx % CHAIR_GREETINGS_CS.length] : CHAIR_GREETINGS_EN[greetingIdx % CHAIR_GREETINGS_EN.length];
                      }
                      const bKey = barber.id === 'tomas' ? 'tomas' : 'nella';
                      const evaluated = evaluateStatus(statusData[bKey]);

                      return (
                        <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 30 }} key={barber.id} className="relative flex flex-col items-center w-full">
                          <ChairWithCard 
                            barber={barber} 
                            activeSpeaker={activeSpeaker} 
                            dialogueIndex={activeDialogueText} 
                            lang={lang} 
                            t={t} 
                            playCardSound={playCardSound} 
                            side={index % 2 === 0 ? "left" : "right"} 
                            graphicsTier={graphicsTier}
                            globalStats={globalStats}
                            likedMap={likedMap}
                            onLike={handleLike}
                            onOpenDossier={handleOpenDossier}
                            chairGreetingText={chairGreetingText || ""}
                            evaluatedStatus={evaluated}
                          />
                        </motion.div>
                      );
                    })}
                </div>
            </div>
        </div>
      </div>
      
      <OperativeModal 
        barber={selectedBarberForModal}
        isOpen={!!selectedBarberForModal}
        onClose={() => setSelectedBarberForModal(null)}
        lang={lang}
      />

      <style jsx global>{`
        @keyframes shake-gentle {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1px, 1px); }
          75% { transform: translate(1px, -1px); }
        }
        .animate-shake-gentle {
          animation: shake-gentle 0.3s ease-in-out infinite;
        }
        @keyframes glitch-text-anim {
          0% { transform: translate(0); text-shadow: none; }
          20% { transform: translate(-2px, 1px); text-shadow: 1px 0 var(--color-mafia-gold); }
          40% { transform: translate(2px, -1px); text-shadow: -1px 0 var(--color-mafia-gold); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1px); }
          100% { transform: translate(0); }
        }
        .animate-glitch-text {
          animation: glitch-text-anim 1s step-end infinite;
        }
      `}</style>
    </section>
  );
}
