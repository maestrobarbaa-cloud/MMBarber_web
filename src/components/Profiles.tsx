"use client";

import Image from "./OptimizedImage";
import { useState, useEffect, useRef, useMemo } from "react";
import { CalendarDays, Languages, Sparkles, Heart, Clover } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { trackEvent } from "../utils/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "../utils/audio";

export interface BarberProfile {
  name: string;
  role: string;
  image: string;
  desc: string;
  schedule: string;
  bookingLink: string;
  staticDesc?: string;
  stats?: string[];
  story?: string;
  medals?: string[];
  motto?: string;
  specializations?: string[];
  favorites?: string;
  isHidden?: boolean;
  symbol: string;
}

const BARBER_DIALOGUES = [
  { 
    tomas: "Beru si inspiraci od lidí, co něco dokázali. A víš, co mě štve? Firmy, které nevidí potenciál v lidech hned na začátku. Přitom právě tam často je."
  },
  { 
    tomas: "To chápu. Ale jistota bez šance nikoho neposune. A upřímně – u nás to nebylo vždy ideální. Dvakrát jsem tě propustil, jednou jsi odešla sama… a nakonec ses vrátila."
  },
  { 
    tomas: "To si pamatuju. Ale víš co? Nešlo o to někoho dusit. Šlo o výsledky a o to, aby ses něco naučila."
  },
  { 
    tomas: "A to je přesně ono. Spousta lidí vyjde ze školy a čeká, že všechno půjde samo. Jenže praxe je jiná. Často musím lidi hodně věcí doučovat."
  },
  { 
    tomas: "Spíš jedou podle starších modelů. Učí se věci, které člověk skoro nepoužije, a ty důležité přijdou až v práci. A pak jsou z toho zbytečná očekávání."
  },
  { 
    tomas: "Přesně. Už jsem viděl hodně případů, kdy se mladým zdála nabídka nízká jen proto, že mají titul. Ale dovednosti tomu často neodpovídaly."
  },
  { 
    tomas: "Jednoznačně. A co je škoda – když s nimi chce šéf pracovat dlouhodobě, naučit je věci, tak někdy odejdou kvůli pár tisícům navíc jinam."
  },
  { 
    tomas: "Přesně tak. Někdy je lepší dívat se na to, co se naučíš, než jen na první výplatu."
  },
  { 
    tomas: "Tam je to podobné. Lidi často reagují na emoce – nakupují, když je všechno drahé, místo aby přemýšleli dopředu. Přitom trpělivost dělá největší rozdíl."
  },
  { 
    tomas: "Přesně. A u práce to platí taky. Když jsi přišla zpátky, věděl jsem, že to nebude o pohodlí. Ale o posunu."
  },
  { 
    tomas: "A o to jde. Ne o „kafíčka a pohodičku“, ale o to, aby ses posouvala a něco z toho měla i do budoucna. A taky si občas přiznej, když ti něco nejde – od toho tu jsme, abychom to zlepšili."
  },
  { 
    tomas: "To dělá hodně lidí. Ale právě tím se brzdí."
  },
  { 
    tomas: "A tu šanci máš. Teď ji jen využít."
  },
  { 
    tomas: "Tak jo, a šup do práce 🙂 Postarej se o klienty – náš zákazník, náš pán. A hlavně se s nimi bav, když chtějí. O tom to celé je."
  },
  { 
    tomas: "A ještě jedna věc – jestli tady uvidím někoho schovávat se za certifikáty místo reálné práce s lidmi, tak to není cesta, kterou jdeme. Tady rozhoduje praxe, přístup a výsledky, ne papíry za rámem."
  }
];

const TOMAS_QUOTES_EN = [
  "Divide et impera.",
  "Vires acquirit eundo.",
  "Memento mori.",
  "Labor omnia vincit.",
  "I'm teaching you humility.\nTowards customers... and life.",
  "You might feel you know everything.\nThat you're experienced.\nBut the truth is elsewhere.",
  "You know almost nothing yet.\nAnd that's okay.\nBecause you have a chance.",
  "Don't waste it. Work hard. Train.\nYou have the conditions here.",
  "One more thing...\nDon't ask for big money\nuntil you've mastered everything.",
  "Experience cannot be bypassed.\nYou have to earn it.",
  "Don't rely on others' wisdom.\nMost people just talk.\nYou must do."
];



const barbers: BarberProfile[] = [
  {
    name: "Tomáš",
    role: "The Enforcer",
    image: "/obr/tomasmicka.png",
    desc: "Mistr komunikace a hrubé síly. Tvůj vous zlomí k naprosté poslušnosti.",
    schedule: "Út-Pá 9:00 - 18:00 | So-Ne 9:00 - 12:00",
    bookingLink: "https://mm.inthechair.com/micka",
    specializations: ["Primárně pánské", "ale zvládnu i dámy"],
    symbol: "A"
  }
];

const MissionLoading = ({ isHovered }: { isHovered: boolean }) => (
  <AnimatePresence>
    {isHovered && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {/* Scanning Line */}
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-full h-1/3 bg-gradient-to-b from-transparent via-mafia-gold/40 to-transparent z-10"
        />
        
        {/* Binary/Data Overlay */}
        <div className="absolute inset-0 flex flex-wrap content-start opacity-20 text-[6px] font-mono leading-none p-1 gap-1">
          {Array(40).fill(0).map((_, i) => (
            <motion.span 
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: Math.random() * 2 + 1, repeat: Infinity }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </motion.span>
          ))}
        </div>

        {/* Glitch Overlay */}
        <motion.div 
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 5 }}
          className="absolute inset-0 bg-white mix-blend-overlay"
        />
      </motion.div>
    )}
  </AnimatePresence>
);

function BarberCard({ 
  barber, 
  isActive, 
  dialogueIndex, 
  lang, 
  t, 
  playCardSound,
  onBook,
  onHoverChange,
  graphicsTier
}: { 
  barber: BarberProfile & { isHidden?: boolean }, 
  isActive: boolean, 
  dialogueIndex: number, 
  lang: string, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any, 
  playCardSound: () => void,
  onBook: () => void,
  onHoverChange?: (hovered: boolean) => void,
  graphicsTier?: string
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    playCardSound();
    if (onHoverChange) onHoverChange(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHoverChange) onHoverChange(false);
  };

  const isHidden = barber.isHidden;

  return (
    <>
      {/* MOBILE VERSION: Simple, Static, No effects */}
      <div className="xl:hidden w-full max-w-[340px] h-auto min-h-[420px] bg-[#0c0c0c] border-2 border-mafia-gold/20 p-5 rounded-2xl flex flex-col items-center gap-4 shadow-2xl overflow-hidden relative">
        <div className="w-36 h-36 border-2 border-mafia-gold/20 overflow-hidden bg-black/40 flex-shrink-0 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
          {barber.image === "question-mark" ? (
            <div className="text-mafia-gold/30 font-heading text-9xl animate-pulse italic drop-shadow-[0_0_15px_rgba(197,160,89,0.2)]">?</div>
          ) : (
            <Image 
              src={barber.image} 
              alt={barber.name} 
              width={192} 
              height={192} 
              priority 
              quality={100}
              className="w-full h-full object-cover" 
            />
          )}
        </div>
        
        <div className="text-center space-y-1 relative">
          <h3 className="text-3xl font-heading font-black uppercase text-mafia-gold tracking-widest leading-none relative">
            {barber.name}
          </h3>
          <span className="text-[10px] font-mono uppercase text-white/30 tracking-widest block relative">
            {barber.role}
          </span>
        </div>

        {!barber.isHidden && (
          <button 
            onClick={() => {
              trackEvent("cta_barber_booking_mobile", { barber: barber.name });
              onBook();
            }}
            className="w-full py-5 bg-mafia-gold text-mafia-black font-heading font-black tracking-[0.3em] uppercase text-sm border-2 border-mafia-gold hover:bg-white transition-all z-10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          >
            {lang === 'cs' ? "REZERVACE" : "BOOKING"}
          </button>
        )}

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
      </div>

      {/* DESKTOP VERSION: The full Noir experience */}
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="hidden xl:block barber-card relative xl:perspective-2000 w-[340px] flex-shrink-0 h-[640px] z-10"
      >
        <motion.div
          animate={{ rotateY: isHovered ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {/* Front Side */}
          <motion.div 
            animate={{ 
              opacity: isHovered ? 0 : 1,
              visibility: isHovered ? "hidden" : "visible"
            }}
            transition={{ 
              opacity: { duration: 0.1, delay: isHovered ? 0.35 : 0 },
              visibility: { delay: isHovered ? 0.4 : 0 }
            }}
            className={`absolute inset-0 bg-[#0c0c0c] border-2 p-8 flex flex-col items-center justify-between rounded-2xl shadow-[0_45px_90px_-20px_rgba(0,0,0,1)] ${
              graphicsTier === 'low' ? 'transition-none' : 'transition-all duration-300'
            } ${
              isActive ? "border-mafia-gold shadow-[0_0_20px_rgba(197,160,89,0.3)]" : "border-mafia-gold/20"
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
              <div className="text-right relative">
                  <h3 className="text-4xl font-heading font-black uppercase text-mafia-gold tracking-widest relative">
                    {barber.name}
                    {isHidden && (
                      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="absolute inset-0 bg-mafia-black border border-mafia-gold/20 z-20 origin-left" />
                    )}
                  </h3>
                  <span className="text-[10px] font-mono uppercase text-white/30 tracking-widest relative block">
                    {barber.role}
                    {isHidden && (
                      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="absolute inset-0 bg-mafia-black/80 border border-mafia-gold/10 z-20 origin-left scale-y-75" />
                    )}
                  </span>
              </div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
              <div className="mb-6 relative w-full h-[20px] flex items-center justify-center">
                  {/* Dialogues hidden per user request */}
              </div>

              <div className="space-y-3 w-full">
                  {barber.specializations?.map((spec, i) => (
                    <div key={i} className="text-[10px] font-mono text-mafia-gold/40 border border-mafia-gold/10 py-2 uppercase tracking-[0.3em] relative">
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
              <p className="text-[11px] font-mono text-white/60 text-center tracking-widest uppercase">{barber.schedule}</p>
              {isHidden && (
                <div className="absolute inset-0 bg-mafia-black border-t border-mafia-gold/20 z-10 flex items-center justify-center text-[8px] tracking-[0.3em] text-mafia-gold/40"></div>
              )}
            </div>

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
            onClick={() => {
              if (isHidden) return;
              trackEvent("cta_barber_booking_card_click", { barber: barber.name });
              onBook();
            }}
            className={`absolute inset-0 bg-[#0c0c0c] border-2 p-8 flex flex-col items-center transition-all duration-500 rounded-2xl shadow-[0_45px_90px_-20px_rgba(0,0,0,1)] overflow-hidden cursor-pointer ${
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
                <div className={`relative w-56 h-56 rounded-none overflow-hidden transition-all duration-1000 mb-8 flex items-center justify-center ${
                    isHovered ? "shadow-[0_0_40px_rgba(197,160,89,0.2)]" : ""
                }`}>
                    {barber.image === "question-mark" ? (
                      <div className="text-mafia-gold/30 font-heading text-[12rem] animate-pulse italic drop-shadow-[0_0_20px_rgba(197,160,89,0.3)]">?</div>
                    ) : (
                      <motion.div animate={{ scale: isHovered ? 1.1 : 1 }} transition={{ duration: 1.2 }}>
                        <Image src={barber.image} alt={barber.name} width={300} height={300} className="w-full h-full object-cover grayscale-[0.2]" />
                      </motion.div>
                    )}
                </div>

                <div className="flex flex-col items-center gap-1 mb-6 text-center relative">
                    <h3 className="text-7xl font-heading font-black uppercase tracking-[0.2em] text-mafia-gold leading-none mr-[-0.2em] relative">
                        {barber.name}
                        {isHidden && (
                          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="absolute inset-0 bg-mafia-black border border-mafia-gold/20 z-20 origin-left" />
                        )}
                    </h3>
                    {barber.motto && (
                      <div className="mt-8 text-2xl font-heading text-mafia-gold/90 tracking-[0.1em] uppercase font-black italic relative">
                        {barber.motto}
                        {isHidden && (
                          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="absolute inset-0 bg-mafia-black/80 border border-mafia-gold/10 z-20 origin-left scale-y-75" />
                        )}
                      </div>
                    )}
                </div>
            </div>

              {!isHidden && (
                <div className="w-full flex justify-center relative z-[60] mt-auto pb-10">
                    <div className="w-full max-w-[260px] h-16 relative flex items-center justify-center border-2 border-mafia-gold bg-mafia-black text-mafia-gold font-heading uppercase tracking-[0.6em] font-black text-lg overflow-hidden group">
                        <MissionLoading isHovered={isHovered} />
                        <span className="relative z-20 transition-all duration-300 group-hover:tracking-[0.8em]">
                          {lang === 'cs' ? "REZERVACE" : "BOOKING"}
                        </span>
                    </div>
                </div>
              )}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
          </motion.div>
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
              priority={i < 4}
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

function ChairWithCard({ 
  barber, 
  activeSpeaker, 
  dialogueIndex, 
  lang, 
  t, 
  playCardSound, 
  side,
  graphicsTier
}: { 
  barber: BarberProfile & { isHidden?: boolean }, 
  activeSpeaker: boolean, 
  dialogueIndex: number, 
  lang: string, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: Record<string, any>, 
  playCardSound: () => void,
  side: 'left' | 'right',
  graphicsTier: string
}) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isSitting, setIsSitting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });


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

  const targetScale = isSitting ? 1.0 : (isCardHovered ? 1.05 : 1);
  const filterStr = isCardHovered 
    ? "brightness(1.2) contrast(1.15) drop-shadow(0 25px 25px rgba(0,0,0,0.9))" 
    : "brightness(0.88) drop-shadow(0 0px 0px rgba(0,0,0,0))";
  
  const ySink = isSitting ? 25 : 0;
  const actualY = isSitting ? ySink : (isCardHovered ? mousePos.y * -20 : 0);
  const actualX = isCardHovered ? mousePos.x * -20 : 0;
  const parallaxBgX = isCardHovered ? mousePos.x * 10 : 0;

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`flex flex-col xl:flex-row items-center justify-center gap-4 xl:gap-8 ${side === 'right' ? 'xl:flex-row-reverse' : ''}`}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          y: actualY,
          x: actualX,
          opacity: isSitting || isCardHovered ? 1 : 0,
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
          className="absolute -top-12 left-0 w-full flex flex-row items-center justify-center z-50 pointer-events-none"
        >
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-mafia-gold/30 mr-4"></div>
          <p className="font-heading text-lg text-mafia-gold italic tracking-[0.2em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {side === 'right' 
              ? (lang === 'cs' ? "Přidáš se?" : "Will you join?")
              : (lang === 'cs' ? "Tvoje místo je připravené." : "Your seat is ready.")
            }
          </p>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-mafia-gold/30 ml-4"></div>
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
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(197,160,89,0.15)_0%,_rgba(0,0,0,0)_60%)] pointer-events-none rounded-full blur-2xl"
          />

          <Image 
            src="/obr/kreslo.png" 
            alt={`Barber Chair ${barber.name}`}
            fill 
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
          </div>
        </motion.div>
      </motion.div>

      <div className="relative z-10">
        <BarberCard 
          barber={barber}
          isActive={activeSpeaker}
          dialogueIndex={dialogueIndex}
          lang={lang}
          t={t}
          playCardSound={playCardSound}
          onBook={handleBook}
          onHoverChange={(h) => setIsCardHovered(h)}
          graphicsTier={graphicsTier}
        />
      </div>
    </div>
  );
}

export function Profiles() {
  const { t, lang } = useTranslation();
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(BARBER_DIALOGUES.length - 1);
  const [activeSpeaker, setActiveSpeaker] = useState<'tomas' | null>(null);
  const [isDecided, setIsDecided] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [slotIndex, setSlotIndex] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [revealedBarbers, setRevealedBarbers] = useState<string[]>([]);
  const [graphicsTier, setGraphicsTier] = useState<string>("low");

  const playCardSound = () => {
    playSound("/sounds/card.mp3", 0.9);
  };

  useEffect(() => {
    setIsMounted(true);
    const updateTier = () => {
      const tier = document.documentElement.getAttribute('data-graphics-tier') || "low";
      setGraphicsTier(tier);
    };
    updateTier();
    window.addEventListener('mmbarber-graphics-update', updateTier);
    
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
    return () => {
      window.removeEventListener("mmbarber-reveal-barbers", handleReveal);
      window.removeEventListener('mmbarber-graphics-update', updateTier);
    };
  }, [revealedBarbers]);

  const handleRandomize = () => {
    if (isRandomizing || isDecided) return;
    localStorage.setItem("mmbarber_profiles_seen", "true");
    trackEvent("cta_randomize_barber");

    const availableBarbers = barbers.filter(b => b.name !== "Nella");

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
          window.location.href = availableBarbers[winner].bookingLink;
        }, 1500);
      }
    }, 80);
  };

  // Re-enabled dialogue system - Sequential story mode
  useEffect(() => {
    if (!isSectionVisible) {
      setActiveSpeaker(null);
      return;
    }

    const triggerDialogue = () => {
      setDialogueIndex(prev => (prev + 1) % BARBER_DIALOGUES.length);
      
      // Sequence the "talking" animation
      setActiveSpeaker('tomas');
      
      // Increased delays for longer text
      const tomasDelay = 6000;
      const t1 = setTimeout(() => setActiveSpeaker(null), tomasDelay);
      
      return () => {
        clearTimeout(t1);
      };
    };

    // Initial delay before first talk
    const initialDelay = setTimeout(triggerDialogue, 4000);

    const interval = setInterval(() => {
      triggerDialogue();
    }, 18000); // Wait longer between full exchanges

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
      setActiveSpeaker(null);
    };
  }, [isSectionVisible]);

  const translatedBarbers = useMemo(() => {
    return barbers.map(b => {
      const isTomas = b.name === 'Tomáš';
      
      const staticDesc = isTomas 
        ? (t.operatives?.barbers?.tomas as { story?: string })?.story 
        : "";

      const currentDialogue = BARBER_DIALOGUES[dialogueIndex];
      const dialogueText = isTomas ? currentDialogue?.tomas : "";

      return {
        ...b,
        name: t.operatives?.barbers?.tomas?.name,
        role: t.operatives?.barbers?.tomas?.role,
        motto: t.operatives?.barbers?.tomas?.motto,
        staticDesc,
        desc: dialogueText ?? staticDesc ?? "",
        schedule: t.operatives?.barbers?.tomas?.schedule,
        favorites: undefined,
        specializations: t.operatives?.barbers?.tomas?.specializations,
        englishSpeaking: (t.operatives?.barbers?.tomas as { englishSpeaking?: string })?.englishSpeaking,
        symbol: b.symbol,
        isHidden: false
      };
    });
  }, [dialogueIndex, t]);

  return (
    <section 
      id="operativi" 
      className="relative w-full py-10 md:py-20 px-4 md:px-12 bg-transparent border-t-8 border-mafia-dark flex flex-col items-center scroll-mt-32"
    >
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/black-paper.png')" }}></div>
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="max-w-6xl mx-auto w-full">
            <div className="w-full">
                <div className="text-center mb-16 md:mb-24">
                    <h2 className="text-3xl md:text-5xl font-heading font-black text-smoke-white mb-3 md:mb-4 tracking-[0.3em] uppercase">{t.operatives.title}</h2>
                    <div className="section-underline w-16 md:w-24 h-1 bg-gradient-to-r from-mafia-gold/20 via-mafia-gold to-mafia-gold/20 mx-auto mb-4 md:mb-6 shadow-[0_0_20px_var(--color-mafia-gold-glow)]" style={{ background: 'linear-gradient(to right, transparent, var(--user-accent-color), transparent)', boxShadow: '0 0 20px var(--user-glow-color)' }}></div>
                    <div className="text-smoke-white/60 font-sans tracking-widest uppercase text-[10px] md:text-sm px-4 mb-4 flex flex-col items-center gap-1 md:gap-2 cursor-default group">
                        <span className="group-hover:text-white transition-colors duration-500">
                            {t.operatives.subtitle.split('.')[0]}.
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-8 xl:gap-10 px-4 md:px-0 w-full max-w-[1400px] mx-auto py-4 xl:py-8">
                    {translatedBarbers.map((barber, index) => (
                      <ChairWithCard 
                        key={barber.name}
                        barber={barber} 
                        activeSpeaker={activeSpeaker === 'tomas'} 
                        dialogueIndex={dialogueIndex} 
                        lang={lang} 
                        t={t} 
                        playCardSound={playCardSound} 
                        side={index % 2 === 0 ? "left" : "right"} 
                        graphicsTier={graphicsTier}
                      />
                    ))}
                </div>
            </div>
        </div>
      </div>
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
          20% { transform: translate(-2px, 1px); text-shadow: 1px 0 #ffd700; }
          40% { transform: translate(2px, -1px); text-shadow: -1px 0 #c5a059; }
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
