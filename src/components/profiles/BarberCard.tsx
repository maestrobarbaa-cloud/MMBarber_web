import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clover, Heart, CalendarDays, ArrowRight, Medal } from "lucide-react";
import { BarberProfile, TOMAS_QUOTES_EN, TOMAS_CHAIR_GREETINGS_CS, CHAIR_GREETINGS_CS, CHAIR_GREETINGS_EN } from "@/data/profilesData";
import { GlobalBarberStats, calculateLevelFromXp, getEnglishRankFromLevel } from "@/utils/barberXp";
import { getDailyRole } from "@/utils/dailyRoles";
import { UnlockDiagram } from "@/components/UnlockDiagram";
import { getVocative } from "@/components/Profiles";
import { useBarbers } from "@/contexts/BarberContext";
import { EvaluatedStatus } from "@/utils/status";
import { StatusDot } from "./StatusDot";
import { StatusText } from "./StatusText";
import { BarberRanking } from "./BarberRanking";
import { MissionLoading } from "./MissionLoading";
import { MissionFailedOverlay } from "./MissionFailedOverlay";
import { playSound } from "@/utils/audio";
import { trackEvent } from "@/utils/analytics";
import { useGame } from "@/contexts/GameContext";

const getYearsOfExperience = (barberId: string, lang: string) => {
  const startDate = barberId === 'nella' 
    ? new Date(2023, 8, 1) // 1. září 2023
    : (barberId === 'tomas' ? new Date(2019, 8, 1) : null); // 1. září 2019

  if (!startDate) return null;

  const now = new Date();
  
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (years <= 0 && months <= 0) return null;
  
  if (lang === 'cs') {
    let yearStr = '';
    if (years === 1) yearStr = '1 rok';
    else if (years >= 2 && years <= 4) yearStr = `${years} roky`;
    else if (years > 4) yearStr = `${years} let`;

    let monthStr = '';
    if (months === 1) monthStr = '1 měsíc';
    else if (months >= 2 && months <= 4) monthStr = `${months} měsíce`;
    else if (months > 4) monthStr = `${months} měsíců`;

    if (years === 0) return `${monthStr} praxe`;
    if (months === 0) return `${yearStr} praxe`;
    return `${yearStr} a ${monthStr} praxe`;
  } else {
    const yearStr = years === 1 ? '1 year' : `${years} years`;
    const monthStr = months === 1 ? '1 month' : `${months} months`;

    if (years === 0) return `${monthStr} of experience`;
    if (months === 0) return `${yearStr} of experience`;
    return `${yearStr} and ${monthStr} of experience`;
  }
};

function BarberCard({ 
  barber, 
  isActive, 
  dialogueIndex, 
  lang, 
  t, 
  playCardSound,
  onBook,
  onOpenDossier,
  onHoverChange,
  activeSpeaker,
  graphicsTier,
  globalStats,
  likedMap,
  onLike,
  evaluatedStatus
}: { 
  barber: BarberProfile & { isHidden?: boolean }, 
  isActive: boolean, 
  dialogueIndex: string | number, 
  lang: string, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any, 
  playCardSound: () => void,
  onBook: () => void,
  onOpenDossier: () => void,
  onHoverChange?: (hovered: boolean) => void,
  activeSpeaker: string | null,
  graphicsTier?: string,
  globalStats: GlobalBarberStats,
  likedMap: Record<string, boolean>,
  onLike: (barberId: string) => void,
  evaluatedStatus: EvaluatedStatus
}) {
  const { totalCollected } = useGame();
  const [isHovered, setIsHovered] = useState(false);
  const [cohort, setCohort] = useState('gold');

  useEffect(() => {
    setCohort(localStorage.getItem('mmbarber_cohort') || 'gold');
  }, []);

  const stats = globalStats[barber.id] || { xp: 0, likes: 0 };
  const globalXp = stats.xp;
  const globalLevel = calculateLevelFromXp(globalXp);
  const globalRank = lang === 'cs' 
    ? getDailyRole(barber.id, lang)
    : getEnglishRankFromLevel(globalLevel);
  const alreadyLiked = likedMap[barber.id] || false;

  const handleMouseEnter = () => {
    setIsHovered(true);
    playCardSound();
    if (onHoverChange) onHoverChange(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHoverChange) onHoverChange(false);
  };

  const [nicknames, setNicknames] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch nicknames dynamically
    const loadNicknames = async () => {
      try {
        const { getNicknamesAction } = await import('@/app/actions/nicknames');
        const db = await getNicknamesAction();
        setNicknames({
          tomas: db.tomas?.topNickname || barber.name,
          nella: db.nella?.topNickname || barber.name
        });
      } catch (e) {}
    };
    loadNicknames();
    const interval = setInterval(loadNicknames, 10000);
    return () => clearInterval(interval);
  }, [barber.name]);

  const isHidden = barber.isHidden;
  const barberDisplayName = nicknames[barber.id] || barber.name;

  return (
    <>
      {/* MOBILE VERSION: Simple, Static, No effects */}
      <div className="xl:hidden w-full max-w-[340px] h-auto min-h-[420px] bg-[#0c0c0c] border-2 border-mafia-gold/20 p-5 rounded-lg flex flex-col items-center gap-4 shadow-2xl overflow-hidden relative">
        {barber.missionFailed ? (
          <MissionFailedOverlay name={barberDisplayName} lang={lang} />
        ) : (
          <>
        {graphicsTier !== 'lite' && (
          <div className="w-36 h-36 border-2 border-mafia-gold/20 overflow-hidden bg-black/40 flex-shrink-0 rounded-none shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
            {barber.image === "question-mark" ? (
              <UnlockDiagram required={barber.unlockThreshold || 5} collected={totalCollected} size={140} />
            ) : (
              <Image 
                src={barber.image} 
                alt={barber.name} 
                width={192} 
                height={192} 
                priority 
                quality={100}
                loading="eager"
                className="w-full h-full object-cover" 
              />
            )}
          </div>
        )}
        
        <div className="text-center space-y-1 relative w-full flex flex-col items-center">
          <h3 className="text-3xl font-heading font-black uppercase text-mafia-gold tracking-widest leading-none relative flex items-center justify-center">
            {barberDisplayName}
            {graphicsTier !== 'lite' && <StatusDot evaluated={evaluatedStatus} />}
          </h3>
          {graphicsTier !== 'lite' && (
            <span className="text-[10px] font-mono uppercase text-white/30 tracking-widest block relative">
              {barber.role}
            </span>
          )}
          {graphicsTier !== 'lite' && (
            <div className="flex justify-center mt-2 mb-2">
              <StatusText evaluated={evaluatedStatus} lang={lang} />
            </div>
          )}
          {!barber.isHidden && (
            <button 
              onClick={() => {
                trackEvent("cta_barber_booking_mobile", { barber: barber.name });
                onBook();
              }}
              className={`w-full py-5 font-heading font-black tracking-[0.3em] uppercase text-sm border-2 transition-all z-10 mt-4 ${
                barber.image === "question-mark"
                  ? "bg-mafia-gold/20 text-white/30 border-mafia-gold/20 cursor-not-allowed"
                  : "bg-mafia-gold text-mafia-black border-mafia-gold hover:bg-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] cursor-pointer"
              }`}
            >
              {barber.image === "question-mark"
                ? (lang === 'cs' ? "ZAMČENO" : "LOCKED")
                : (lang === 'cs' ? "REZERVACE" : "BOOKING")}
            </button>
          )}
          {graphicsTier !== 'lite' && (
            <div className="mt-4 relative flex justify-center">
              <BarberRanking 
                level={globalLevel} 
                rankTitle={globalRank} 
                lang={lang} 
                id={barber.id} 
                xp={globalXp}
              />
            </div>
          )}
          {graphicsTier === 'lite' && (
            <div className="mt-4 text-[10px] text-white/40 uppercase tracking-widest font-mono">
              Hradební 1, Uherské Hradiště
            </div>
          )}
        </div>

        {graphicsTier !== 'lite' && (
          <div className="w-full flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 mt-auto px-2">
            {barber.specializations?.map((spec, i) => (
              <div key={i} className="flex items-center gap-3 relative">
                <span className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-[0.2em] whitespace-nowrap font-bold">
                  {spec}
                </span>
                {isHidden && (
                  <div className="absolute inset-0 bg-mafia-black border border-mafia-gold/10 z-10" />
                )}
                {i < (barber.specializations?.length || 0) - 1 && (
                  <div className="w-1 h-1 rounded-full bg-mafia-gold/20" />
                )}
              </div>
            ))}
          </div>
        )}
          </>
        )}
      </div>

      {/* DESKTOP VERSION: The full Noir experience */}
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="hidden xl:block barber-card relative xl:perspective-2000 w-[340px] flex-shrink-0 h-[640px] z-10"
      >
        <motion.div
          animate={{ rotateY: isHovered && !barber.missionFailed && graphicsTier !== 'lite' && graphicsTier !== 'low' ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {barber.missionFailed ? (
            <div className="absolute inset-0 bg-[#0c0c0c] border-2 p-8 flex flex-col items-center justify-between rounded-lg overflow-hidden border-mafia-red/50 shadow-[0_0_30px_rgba(255,0,0,0.15)]">
               <MissionFailedOverlay name={barberDisplayName} lang={lang} />
            </div>
          ) : (
            <>
          {/* Front Side */}
          <motion.div 
            animate={{ 
              opacity: isHovered && graphicsTier !== 'low' && graphicsTier !== 'lite' ? 0 : 1,
              visibility: isHovered && graphicsTier !== 'low' && graphicsTier !== 'lite' ? "hidden" : "visible"
            }}
            transition={{ 
              opacity: { duration: 0.1, delay: isHovered ? 0.35 : 0 },
              visibility: { delay: isHovered ? 0.4 : 0 }
            }}
            className={`absolute inset-0 bg-[#0c0c0c] border-2 p-8 flex flex-col items-center justify-between rounded-lg overflow-hidden shadow-[0_45px_90px_-20px_rgba(0,0,0,1)] ${
              graphicsTier === 'low' ? 'transition-none' : 'transition-all duration-300'
            } ${
              isActive ? "border-mafia-gold shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.3)]" : "border-mafia-gold/20"
            }`}
            style={{ 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(1px)",
              zIndex: isHovered ? 5 : 10
            }}
          >
            <div className="w-full flex justify-between items-start">
              <div className="flex flex-col items-center gap-0 text-mafia-gold">
                  <span className="font-heading font-black text-4xl leading-none card-symbol-front">
                    {barber.symbol}
                  </span>
                  <div className="mt-1">
                    {barber.symbol === 'A' ? (
                      <Clover size={24} strokeWidth={3} className="opacity-80" />
                    ) : (
                      <Heart size={24} strokeWidth={3} fill="currentColor" className="opacity-80" />
                    )}
                  </div>
              </div>
              <div className="flex-1 flex flex-col items-center text-center relative">
                  <h3 className="text-4xl font-heading font-black uppercase text-mafia-gold tracking-widest relative flex items-center justify-center">
                    {barberDisplayName}
                    <StatusDot evaluated={evaluatedStatus} />
                    {isHidden && (
                      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="absolute inset-0 bg-mafia-black border border-mafia-gold/20 z-20 origin-left" />
                    )}
                  </h3>
                  <span className="text-[10px] font-mono uppercase text-white/30 tracking-widest relative block">
                    {barber.role}
                  </span>
                  <div className="mt-6 relative flex justify-center">
                    <BarberRanking 
                      level={globalLevel} 
                      rankTitle={globalRank} 
                      lang={lang} 
                      id={barber.id} 
                      xp={globalXp}
                    />
                    {isHidden && (
                      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="absolute inset-0 bg-mafia-black/80 border border-mafia-gold/10 z-20 origin-left scale-y-75" />
                    )}
                  </div>
              </div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-start text-center px-4 pt-10">
              {/* Dialogue Bubble - Increased space and added background for clarity */}
              <div className="mb-10 relative w-full min-h-[160px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {activeSpeaker === (barber.id === 'tomas' ? 'tomas' : 'nella') && (
                      <motion.div
                        key={`${barber.name}-${dialogueIndex}`}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-mafia-gold barber-dialogue-text font-heading italic text-xs md:text-[14px] tracking-[0.15em] px-6 py-4 leading-relaxed uppercase bg-mafia-gold/5 border border-mafia-gold/10 rounded-none backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                      >
                        <span className="opacity-40 block mb-2 text-[8px] font-mono tracking-[0.5em]">
                          {lang === 'cs' ? "— ZÁZNAM KOMUNIKACE —" : "— MESSAGE_LOG —"}
                        </span>
                        {barber.story}
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>

              <div className="space-y-2 w-full mt-auto">
                  {barber.specializations?.map((spec, i) => (
                    <div key={i} className="text-[9px] font-mono text-mafia-gold/40 border border-mafia-gold/5 py-1.5 uppercase tracking-[0.3em] relative">
                      {spec}
                      {isHidden && (
                        <div className="absolute inset-0 bg-mafia-black/80 z-10" />
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="w-full pt-6 border-t border-mafia-gold/10 relative">
              <div className="flex items-center justify-center gap-3 text-white/40 mb-2">
                  <CalendarDays size={14} className="text-mafia-gold/60" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em]">{lang === 'cs' ? "OPERATIVNÍ DOBA" : "OPERATIONAL HOURS"}</span>
              </div>
              <p className="text-[11px] font-mono text-white/60 text-center tracking-widest uppercase mb-2">{barber.schedule}</p>
              <div className="flex justify-center mt-1">
                <StatusText evaluated={evaluatedStatus} lang={lang} />
              </div>
              {isHidden && (
                <div className="absolute inset-0 bg-mafia-black border-t border-mafia-gold/20 z-10 flex items-center justify-center text-[8px] tracking-[0.3em] text-mafia-gold/40"></div>
              )}
            </div>

            {(graphicsTier === 'low' || graphicsTier === 'lite') && !isHidden && !barber.missionFailed && (
              <div className="w-full flex justify-center mt-4 pb-2 z-50 relative pointer-events-auto">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    trackEvent("cta_barber_booking_card_desktop_lite", { barber: barber.name });
                    onBook();
                  }}
                  className="w-full max-w-[200px] py-3 bg-mafia-gold text-mafia-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.3)]"
                >
                  {lang === 'cs' 
                    ? (cohort === 'blood' ? "VYŽÁDAT AUDIENCI" : "REZERVOVAT") 
                    : (cohort === 'blood' ? "REQUEST AUDIENCE" : "BOOK NOW")}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

          </motion.div>

          {/* Back Side (Booking) */}
          <motion.div 
            animate={{ 
              opacity: isHovered ? 1 : 0,
              visibility: isHovered ? "visible" : "hidden"
            }}
            transition={{ 
              opacity: { duration: 0.1, delay: isHovered ? 0.35 : 0 },
              visibility: { delay: isHovered ? 0.4 : 0 }
            }}
            className={`absolute inset-0 bg-[#0c0c0c] border-2 p-8 flex flex-col items-center transition-all duration-500 rounded-lg shadow-[0_45px_90px_-20px_rgba(0,0,0,1)] overflow-hidden ${
              isHovered ? "border-mafia-gold pointer-events-auto" : "border-mafia-gold/40 pointer-events-none"
            }`}
            style={{ 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(1px)",
              zIndex: isHovered ? 10 : 5
            }}
          >

            
            <div className="flex-grow w-full flex flex-col items-center justify-start relative z-10 pt-16">
                {barber.id === "nella" ? (
                  <>
                    <div className={`relative w-56 h-56 rounded-none overflow-hidden transition-all duration-1000 mb-8 flex items-center justify-center ${
                        isHovered ? "shadow-[0_0_40px_rgba(var(--color-mafia-gold-rgb),0.2)]" : ""
                    }`}>
                        {barber.image === "question-mark" ? (
                          <UnlockDiagram required={barber.unlockThreshold || 5} collected={totalCollected} size={220} />
                        ) : (
                          <motion.div animate={{ scale: isHovered ? 1.1 : 1 }} transition={{ duration: 1.2 }}>
                            <Image src={barber.image} alt={barber.name} width={300} height={300} priority quality={100} loading="eager" className="w-full h-full object-cover grayscale-[0.2]" />
                          </motion.div>
                        )}
                    </div>
                    {getYearsOfExperience(barber.id, lang) && (
                      <div className="text-center mt-[-1.5rem] mb-6 relative z-20 flex justify-center w-full px-4">
                        <div className="flex items-center justify-center gap-4 border-[3px] border-mafia-gold px-6 py-3 bg-black relative w-full max-w-[300px]">
                           {/* Vnitřní olympijská linka */}
                           <div className="absolute inset-1 border border-mafia-gold/40 pointer-events-none" />
                           <Medal size={24} className="text-mafia-gold flex-shrink-0" />
                           <span className="text-sm md:text-base font-heading font-black text-mafia-gold tracking-[0.2em] uppercase">
                             {getYearsOfExperience(barber.id, lang)}
                           </span>
                           <Medal size={24} className="text-mafia-gold flex-shrink-0" />
                        </div>
                      </div>
                    )}
                    <div className="text-center px-6 mt-4">
                      <h3 className="text-2xl md:text-3xl font-heading font-black uppercase tracking-[0.1em] text-mafia-gold italic leading-tight drop-shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.3)]">
                        {barber.motto}
                      </h3>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`relative w-56 h-56 rounded-none overflow-hidden transition-all duration-1000 mb-8 flex items-center justify-center ${
                        isHovered ? "shadow-[0_0_40px_rgba(var(--color-mafia-gold-rgb),0.2)]" : ""
                    }`}>
                        {barber.image === "question-mark" ? (
                          <UnlockDiagram required={barber.unlockThreshold || 5} collected={totalCollected} size={220} />
                        ) : (
                          <motion.div animate={{ scale: isHovered ? 1.1 : 1 }} transition={{ duration: 1.2 }}>
                            <Image src={barber.image} alt={barber.name} width={300} height={300} priority quality={100} loading="eager" className="w-full h-full object-cover grayscale-[0.2]" />
                          </motion.div>
                        )}
                    </div>

                    {getYearsOfExperience(barber.id, lang) && (
                      <div className="text-center mt-[-1.5rem] mb-6 relative z-20 flex justify-center w-full px-4">
                        <div className="flex items-center justify-center gap-4 border-[3px] border-mafia-gold px-6 py-3 bg-black relative w-full max-w-[300px]">
                           {/* Vnitřní olympijská linka */}
                           <div className="absolute inset-1 border border-mafia-gold/40 pointer-events-none" />
                           <Medal size={24} className="text-mafia-gold flex-shrink-0" />
                           <span className="text-sm md:text-base font-heading font-black text-mafia-gold tracking-[0.2em] uppercase">
                             {getYearsOfExperience(barber.id, lang)}
                           </span>
                           <Medal size={24} className="text-mafia-gold flex-shrink-0" />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-1 mb-6 text-center relative w-full px-4">
                        {barber.motto && (
                          <div className="mt-4 text-2xl font-heading text-mafia-gold/90 tracking-[0.1em] uppercase font-black italic relative">
                            {barber.motto}
                            {isHidden && (
                              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="absolute inset-0 bg-mafia-black/80 border border-mafia-gold/10 z-20 origin-left scale-y-75" />
                            )}
                          </div>
                        )}

                        {/* Tracker Fragmentů */}
                        {barber.id === 'tomas' && (
                          <div className="mt-6 w-full max-w-[260px] border border-mafia-gold/30 bg-black/50 p-4 rounded-sm flex flex-col items-center gap-2 shadow-[inset_0_0_20px_rgba(197,160,89,0.05)]">
                             <div className="text-[9px] font-mono text-white/50 uppercase tracking-[0.2em] text-center">
                               {lang === 'cs' ? 'Nalezené fragmenty (Projekt X)' : 'Fragments Found (Project X)'}
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="text-2xl font-heading font-black text-mafia-gold">{totalCollected}</span>
                                <span className="text-white/30 text-xl">/</span>
                                <span className="text-2xl font-heading font-black text-white/50">12</span>
                             </div>
                             <div className="w-full bg-white/10 h-1.5 mt-1 relative overflow-hidden rounded-full">
                               <div className="absolute top-0 left-0 h-full bg-mafia-gold shadow-[0_0_10px_var(--color-mafia-gold)]" style={{ width: `${(totalCollected / 12) * 100}%` }}></div>
                             </div>
                             {totalCollected < 12 ? (
                                <div className="text-[8px] font-mono text-mafia-gold/60 uppercase tracking-widest mt-1">
                                  {lang === 'cs' ? `Chybí odhalit: ${12 - totalCollected}` : `Missing: ${12 - totalCollected}`}
                                </div>
                             ) : (
                                <div className="text-[9px] font-mono text-mafia-gold uppercase tracking-widest mt-1 animate-pulse font-bold bg-mafia-gold/20 px-2 py-0.5 rounded">
                                  {lang === 'cs' ? 'DATA ZKOMPLETOVÁNA' : 'DATA COMPLETED'}
                                </div>
                             )}
                          </div>
                        )}
                    </div>
                  </>
                )}
            </div>

              {!isHidden && (
                <div className="w-full flex justify-center relative z-[60] mt-auto pb-10">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        trackEvent("cta_barber_booking_card_desktop", { barber: barber.name });
                        onBook();
                      }}
                      className={`w-full max-w-[260px] h-14 relative flex items-center justify-center font-heading uppercase tracking-[0.3em] font-black text-base transition-all z-[70] ${
                        barber.image === "question-mark"
                          ? "bg-mafia-gold/20 text-white/30 border border-mafia-gold/20 cursor-not-allowed"
                          : "bg-mafia-gold text-mafia-black hover:bg-white shadow-[0_0_20px_rgba(197,160,89,0.3)] cursor-pointer"
                      }`}
                    >
                      {barber.image === "question-mark"
                        ? (lang === 'cs' ? "ZAMČENO" : "LOCKED")
                        : (lang === 'cs' 
                           ? (cohort === 'blood' ? "VYŽÁDAT AUDIENCI" : "REZERVOVAT") 
                           : (cohort === 'blood' ? "REQUEST AUDIENCE" : "BOOK NOW"))}
                    </button>
                </div>
              )}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
          </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}

const REEL_REPEAT = 10; 

function SlotReel({
  isRandomizing,
  isDecided,
  winnerIndex,
  revealedBarbers,
}: {
  isRandomizing: boolean;
  isDecided: boolean;
  winnerIndex: number;
  revealedBarbers: string[];
}) {
  const { barbers } = useBarbers();
  const [reelH, setReelH] = useState(260);

  useEffect(() => {
    const updateH = () => setReelH(window.innerWidth < 768 ? 180 : 260);
    updateH();
    window.addEventListener('resize', updateH);
    return () => window.removeEventListener('resize', updateH);
  }, []);

  const stripRef = useRef<HTMLDivElement>(null);
  const strip = Array(REEL_REPEAT).fill(barbers).flat();

  const availableCount = barbers.length;

  useEffect(() => {
    if (!stripRef.current || availableCount === 0) return;
    if (isRandomizing) {
      stripRef.current.style.transition = "none";
      stripRef.current.style.transform = `translateY(0px)`;
    } else if (isDecided) {
      const targetPos = (7 * availableCount + winnerIndex) * reelH;
      stripRef.current.style.transition = "transform 1.5s cubic-bezier(0.15, 0, 0.15, 1)";
      stripRef.current.style.transform = `translateY(-${targetPos}px)`;
    }
  }, [isRandomizing, isDecided, winnerIndex, availableCount, reelH]);

  return (
    <div className="relative w-full h-full bg-[#080808] border-y border-mafia-gold/20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none z-20" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-mafia-gold/30 z-20 pointer-events-none" />
      <div ref={stripRef} className="flex flex-col" style={{ willChange: 'transform' }}>
        {strip.map((barber, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')]"
            style={{ height: reelH }}
          >
            <Image
              src={barber.image}
              alt={barber.name}
              width={200}
              height={200}
              priority
              className="object-cover barber-photo-img"
              style={{
                width: '180px',
                height: '180px',
                filter: isDecided && i === 7 * (strip.length / REEL_REPEAT) + winnerIndex
                  ? 'none'
                  : 'grayscale(1) brightness(0.6)',
                transition: 'filter 0.8s ease',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}


export function ChairWithCard({ 
  barber, 
  activeSpeaker, 
  dialogueIndex, 
  lang, 
  t, 
  playCardSound, 
  side,
  graphicsTier,
  globalStats,
  likedMap,
  onLike,
  onOpenDossier,
  chairGreetingText,
  evaluatedStatus
}: { 
  barber: BarberProfile & { isHidden?: boolean }, 
  activeSpeaker: string | null, 
  dialogueIndex: string | number, 
  lang: string, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: Record<string, any>, 
  playCardSound: () => void,
  side: 'left' | 'right',
  graphicsTier: string,
  globalStats: GlobalBarberStats,
  likedMap: Record<string, boolean>,
  onLike: (barberId: string) => void,
  onOpenDossier: (barber: any) => void,
  chairGreetingText: string,
  evaluatedStatus: EvaluatedStatus
}) {
  const { totalCollected } = useGame();
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isSitting, setIsSitting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [clientNickname, setClientNickname] = useState<string | null>(null);
  const [liveViewers, setLiveViewers] = useState(0);

  useEffect(() => {
    const d = new Date();
    const seed = d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate() + (barber.id === 'tomas' ? 1 : 2);
    const x = Math.sin(seed) * 10000;
    const random = x - Math.floor(x);
    const day = d.getDay();
    const isBusyDay = day === 5 || day === 6;
    const count = isBusyDay ? Math.floor(random * 10) + 12 : Math.floor(random * 6) + 2;
    setLiveViewers(count);

    const { getUserRatingsData } = require("@/utils/voting");
    const data = getUserRatingsData();
    if (data?.nickname) {
      setClientNickname(data.nickname);
    }
  }, [barber.id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCardHovered) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleBook = () => {
    if (isSitting) return;
    setIsSitting(true);
    playSound("/sounds/leather.mp3", 0.6); 
    setTimeout(() => {
      window.open(barber.bookingLink, "_blank", "noopener,noreferrer");
      setTimeout(() => setIsSitting(false), 500); 
    }, 600); 
  };


  const vocativeName = getVocative(clientNickname || "", lang);

  const chairGreeting = useMemo(() => {
    if (!chairGreetingText) return "";
    let greeting = chairGreetingText;
    
    // Personalize if possible
    if (vocativeName) {
      const personalAdditions = lang === 'cs' 
        ? [`, ${vocativeName}!`, `... nazdar ${vocativeName}.`, `. Čekáme na tebe, ${vocativeName}.`] 
        : [`, ${vocativeName}!`, `... greetings, ${vocativeName}.`, `. We've been waiting, ${vocativeName}.`];
      greeting += personalAdditions[Math.floor(Math.random() * personalAdditions.length)];
    }

    return greeting;
  }, [chairGreetingText, lang, vocativeName]);

  const isLite = graphicsTier === 'lite';
  const targetScale = isLite ? 1 : (isSitting ? 1.0 : (isCardHovered ? 1.05 : 1));
  const filterStr = isLite ? "none" : (isCardHovered 
    ? "brightness(1.2) contrast(1.15) drop-shadow(0 25px 25px rgba(0,0,0,0.9))" 
    : "brightness(0.88) drop-shadow(0 0px 0px rgba(0,0,0,0))");
  
  const ySink = isSitting ? 25 : 0;
  const actualY = isLite ? 0 : (isSitting ? ySink : (isCardHovered ? mousePos.y * -20 : 0));
  const actualX = isLite ? 0 : (isCardHovered ? mousePos.x * -20 : 0);
  const parallaxBgX = isLite ? 0 : (isCardHovered ? mousePos.x * 10 : 0);

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`flex flex-col xl:flex-row items-center justify-center gap-4 xl:gap-8 ${side === 'right' ? 'xl:flex-row-reverse' : ''}`}
    >
      <motion.div 
        initial={isLite ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        animate={{ 
          y: actualY,
          x: actualX,
          opacity: isLite ? 1 : (isSitting || isCardHovered ? 1 : 0.7),
          scale: targetScale,
          filter: filterStr,
        }}
        transition={{ 
          y: isSitting ? { type: "spring", stiffness: 100, damping: 10 } : { type: "spring", stiffness: 150, damping: 15 },
          x: { type: "spring", stiffness: 150, damping: 15 },
          opacity: { duration: (graphicsTier === 'low') ? 0 : 0.5 },
          scale: { duration: isSitting ? 0.4 : 0.6, ease: "easeOut" }
        }}
        className="hidden xl:block w-[380px] h-[480px] relative z-0"
        style={{ isolation: 'isolate', transformOrigin: 'center center' }}
      >
        {/* Floating text above the chair on hover */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isCardHovered || isSitting ? 1 : 0,
            y: isCardHovered || isSitting ? -20 : 0
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute -top-16 left-0 w-full flex flex-col items-center justify-center z-50 pointer-events-none gap-2"
        >
          {liveViewers > 0 && !isSitting && (
            <div className="flex items-center gap-2 bg-mafia-red/10 border border-mafia-red/30 px-3 py-1 rounded-full animate-pulse shadow-[0_0_10px_rgba(179,0,0,0.5)]">
              <span className="w-1.5 h-1.5 bg-mafia-red rounded-full"></span>
              <span className="text-[9px] font-mono text-mafia-red uppercase tracking-widest font-bold">
                {lang === 'cs' ? `Právě si prohlíží profil ${liveViewers} lidí` : `${liveViewers} people viewing right now`}
              </span>
            </div>
          )}
          <div className="flex flex-row items-center justify-center">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-mafia-gold/30 mr-4"></div>
            <p className="font-heading text-lg text-mafia-gold italic tracking-[0.2em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {chairGreeting}
            </p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-mafia-gold/30 ml-4"></div>
          </div>
        </motion.div>
        <motion.div 
          animate={{ y: 0, scaleX: side === 'left' ? -1 : 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full relative"
        >
          {/* Subtle Parallax Background behind the chair */}
          <motion.div 
            animate={{ x: parallaxBgX }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(var(--color-mafia-gold-rgb),0.15)_0%,_rgba(0,0,0,0)_60%)] pointer-events-none rounded-full blur-2xl"
          />

          <Image 
            src="/obr/kreslo.png" 
            alt={`Barber Chair ${barber.name}`}
            fill 
            priority
            quality={100}
            loading="eager"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
          
          <div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{ 
              maskImage: `url('/obr/kreslo.png')`,
              WebkitMaskImage: `url('/obr/kreslo.png')`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat'
            }}
          >
            {/* Light Flash on Sit */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: isSitting ? [0, 0.9, 0] : 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 bg-white mix-blend-overlay z-30"
            />
          
            {/* Search lights */}
            {graphicsTier !== 'lite' && (
              <>
                <motion.div
                  animate={{ x: [-100, 250, 50, -100], y: [-50, 200, 350, -50] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full blur-[60px] bg-gradient-to-tr from-mafia-gold/40 via-white/20 to-transparent mix-blend-overlay z-10"
                />
                <motion.div
                  animate={{ x: [-50, 280, 100, -50], y: [0, 250, 300, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 left-0 w-[150px] h-[150px] rounded-full blur-[40px] bg-white/30 mix-blend-color-dodge z-10"
                />

                {/* Fog / Smoke */}
                <motion.div 
                  animate={{ x: [-20, 20, -20], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-[-10%] left-[-20%] w-[140%] h-[200px] bg-white blur-[50px] rounded-full mix-blend-overlay z-0"
                />
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      <div className="relative z-10">
        <BarberCard 
          barber={barber}
          isActive={activeSpeaker === (barber.id === 'tomas' ? 'tomas' : 'nella')}
          dialogueIndex={dialogueIndex}
          lang={lang}
          t={t}
          playCardSound={playCardSound}
          onBook={handleBook}
          onOpenDossier={() => onOpenDossier(barber)}
          onHoverChange={(h) => setIsCardHovered(h)}
          activeSpeaker={activeSpeaker}
          graphicsTier={graphicsTier}
          globalStats={globalStats}
          likedMap={likedMap}
          onLike={onLike}
          evaluatedStatus={evaluatedStatus}
        />
      </div>
    </div>
  );
}
