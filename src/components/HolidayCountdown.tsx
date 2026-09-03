"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { playSound } from "@/utils/audio";
import { Clock, Sparkles, Sun, Heart, Ghost, PartyPopper, User, Baby, GraduationCap, Gift, ChevronDown, ChevronUp, Star, Flag, Scale, Hammer, Cross, Flame, Flower, Clover, Film, Utensils, CalendarRange, SlidersHorizontal, LayoutGrid, Route } from "lucide-react";

interface Holiday {
  name: string;
  date: Date;
  icon: React.ReactNode;
  desc: string;
  isHighSeason?: boolean;
  type: 'public' | 'commercial' | 'other';
}

export function HolidayCountdown() {
  const { lang, t } = useTranslation();
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = useState(false);
  const [showIntel, setShowIntel] = useState(false);
  const [graphicsTier, setGraphicsTier] = useState<string>("high");

  const isTimelineView = graphicsTier !== 'low' && graphicsTier !== 'lite' && graphicsTier !== 'standard';

  const paperAudioPool = useRef<HTMLAudioElement[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Drag to scroll logic
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const rafId = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    isDown.current = true;
    el.style.scrollSnapType = 'none';
    el.style.scrollBehavior = 'auto'; // Vypne plynulé dorovnávání, které způsobuje sekání při tažení
    el.classList.add('select-none'); // Zabrání označování textu během tažení
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (isDown.current) {
      isDown.current = false;
      el.style.scrollSnapType = 'x mandatory';
      el.classList.remove('select-none');
      if (rafId.current) cancelAnimationFrame(rafId.current);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    isDown.current = false;
    el.style.scrollSnapType = 'x mandatory';
    el.classList.remove('select-none');
    if (rafId.current) cancelAnimationFrame(rafId.current);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown.current) return;
    e.preventDefault();
    const el = e.currentTarget;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Jemnější multiplikátor

    // Použití requestAnimationFrame pro plynulejší render na 60/120 FPS
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      el.scrollLeft = scrollLeft.current - walk;
    });
  };



  useEffect(() => {
    const tier = document.documentElement.getAttribute('data-graphics-tier') || "high";
    setGraphicsTier(tier);

    // Pool for snappy paper sound on hover
    const poolSize = 5;
    const pool: HTMLAudioElement[] = [];
    for (let i = 0; i < poolSize; i++) {
      const audio = new Audio("/sounds/paper.mp3");
      audio.volume = 0.6;
      audio.preload = "auto";
      pool.push(audio);
    }
    paperAudioPool.current = pool;

    const initialEffectsState = localStorage.getItem("mmbarber_mobile_effects_enabled") === "true";
    setIsMobileEffectsEnabled(initialEffectsState);

    const handleMobileEffectsUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsMobileEffectsEnabled(detail);
    };
    window.addEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as EventListener);

    return () => {
      window.removeEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as EventListener);
    };
  }, []);



  const playPaperSound = () => {
    playSound("/sounds/paper.mp3", 0.6);
  };

  const holidays = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    const getEasterDates = (year: number) => {
      if (year === 2024) return { friday: new Date(2024, 2, 29), monday: new Date(2024, 3, 1) };
      if (year === 2025) return { friday: new Date(2025, 3, 18), monday: new Date(2025, 3, 21) };
      return { friday: new Date(2026, 3, 3), monday: new Date(2026, 3, 6) };
    };

    const easter = getEasterDates(currentYear);

    const getDates = (): Holiday[] => {
      if (lang === 'en') {
        return [
          { name: t?.holidayCountdown?.holidays?.newYear?.name || "New Year", date: new Date(currentYear, 0, 1), icon: <PartyPopper className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.newYear?.desc || "", isHighSeason: true, type: 'public' },
          { name: t?.holidayCountdown?.holidays?.valentine?.name || "Valentine's Day", date: new Date(currentYear, 1, 14), icon: <Heart className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.valentine?.desc || "", isHighSeason: true, type: 'commercial' },
          { name: t?.holidayCountdown?.holidays?.witches?.name || "Witches' Night", date: new Date(currentYear, 3, 30), icon: <Flame className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.witches?.desc || "", type: 'commercial' },
          { name: t?.holidayCountdown?.holidays?.laborDay?.name || "Labor Day", date: new Date(currentYear, 4, 1), icon: <Hammer className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.laborDay?.desc || "", type: 'public' },
          { name: t?.holidayCountdown?.holidays?.victoryDay?.name || "Victory Day", date: new Date(currentYear, 4, 8), icon: <Flag className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.victoryDay?.desc || "", type: 'public' },
          { name: t?.holidayCountdown?.holidays?.st_patricks?.name || "St. Patrick's Day", date: new Date(currentYear, 2, 17), icon: <Clover className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.st_patricks?.desc || "", isHighSeason: true, type: 'commercial' },
          { name: t?.holidayCountdown?.holidays?.goodFriday?.name || "Good Friday", date: easter.friday, icon: <Cross className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.goodFriday?.desc || "", isHighSeason: true, type: 'public' },
          { name: t?.holidayCountdown?.holidays?.easter?.name || "Easter Monday", date: easter.monday, icon: <Sparkles className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.easter?.desc || "", isHighSeason: true, type: 'public' },
          { name: t?.holidayCountdown?.holidays?.mothersDay?.name || "Mother's Day", date: new Date(currentYear, 4, 11), icon: <Heart className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.mothersDay?.desc || "", type: 'commercial' },
          { name: t?.holidayCountdown?.holidays?.fathersDay?.name || "Father's Day", date: new Date(currentYear, 5, 15), icon: <User className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.fathersDay?.desc || "", isHighSeason: true, type: 'commercial' },
          { name: t?.holidayCountdown?.holidays?.slovackeLeto?.name || "Slovácké léto", date: new Date(currentYear, 6, 3), icon: <Sun className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.slovackeLeto?.desc || "", isHighSeason: true, type: 'commercial' },
          { name: t?.holidayCountdown?.holidays?.independenceDay?.name || "Independence Day", date: new Date(currentYear, 6, 4), icon: <Flag className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.independenceDay?.desc || "", isHighSeason: true, type: 'public' },
          { name: t?.holidayCountdown?.holidays?.lfs?.name || "Summer Film School", date: new Date(currentYear, 6, 25), icon: <Film className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.lfs?.desc || "", isHighSeason: true, type: 'commercial' },
          { name: t?.holidayCountdown?.holidays?.slavnostiVina?.name || "Wine Festival", date: new Date(currentYear, 8, 13), icon: <Utensils className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.slavnostiVina?.desc || "", isHighSeason: true, type: 'commercial' },
          { name: "Slovácké hody", date: new Date(currentYear, 9, 15), icon: <Utensils className="w-5 h-5 text-mafia-gold" />, desc: "Traditional Slovácko feasts.", isHighSeason: true, type: 'commercial' },
          { name: t?.holidayCountdown?.holidays?.halloween?.name || "Halloween", date: new Date(currentYear, 9, 31), icon: <Ghost className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.halloween?.desc || "", isHighSeason: true, type: 'commercial' },
          { name: t?.holidayCountdown?.holidays?.thanksgiving?.name || "Thanksgiving", date: new Date(currentYear, 10, 27), icon: <Gift className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.thanksgiving?.desc || "", isHighSeason: true, type: 'public' },
          { name: t?.holidayCountdown?.holidays?.christmas?.name || "Christmas Day", date: new Date(currentYear, 11, 25), icon: <Sparkles className="w-5 h-5 text-mafia-gold" />, desc: t?.holidayCountdown?.holidays?.christmas?.desc || "", isHighSeason: true, type: 'public' },
          { name: "Wedding Season Starts", date: new Date(currentYear, 4, 1), icon: <Heart className="w-5 h-5 text-mafia-gold" />, desc: "Book your slot early, the schedule fills up fast.", isHighSeason: true, type: 'other' },
          { name: "Wedding Season Ends", date: new Date(currentYear, 8, 30), icon: <Heart className="w-5 h-5 text-mafia-gold" />, desc: "Last minute touch-ups for the late weddings.", type: 'other' },
          { name: "Spring Dating Season", date: new Date(currentYear, 3, 15), icon: <Flame className="w-5 h-5 text-mafia-gold" />, desc: "Love is in the air. Look your best.", isHighSeason: true, type: 'other' },
          { name: "Breakup Season", date: new Date(currentYear, 11, 11), icon: <Ghost className="w-5 h-5 text-mafia-gold" />, desc: "Statistically the most common day for breakups. Time for a revenge cut.", isHighSeason: true, type: 'other' },
          { name: "Cuffing Season Starts", date: new Date(currentYear, 10, 1), icon: <Sparkles className="w-5 h-5 text-mafia-gold" />, desc: "Get ready to settle down for the winter.", type: 'other' },
          { name: "Final Exams", date: new Date(currentYear, 4, 15), icon: <Scale className="w-5 h-5 text-mafia-gold" />, desc: "Look smart, act smart. A good haircut is half the grade.", isHighSeason: true, type: 'other' },
          { name: "Movember", date: new Date(currentYear, 10, 1), icon: <User className="w-5 h-5 text-mafia-gold" />, desc: "Time to grow that mustache.", type: 'other' }
        ];
      }

      if (!t?.holidayCountdown?.holidays) return [];

      return [
        { name: t.holidayCountdown.holidays.newYear?.name || "Nový rok", date: new Date(currentYear, 0, 1), icon: <PartyPopper className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.newYear?.desc || "", isHighSeason: true, type: 'public' },
        { name: t.holidayCountdown.holidays.valentine?.name || "Valentýn", date: new Date(currentYear, 1, 14), icon: <Heart className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.valentine?.desc || "", isHighSeason: true, type: 'commercial' },
        { name: t.holidayCountdown.holidays.goodFriday?.name || "Velký pátek", date: easter.friday, icon: <Cross className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.goodFriday?.desc || "", isHighSeason: true, type: 'public' },
        { name: t.holidayCountdown.holidays.womensDay?.name || "MDŽ", date: new Date(currentYear, 2, 8), icon: <Flower className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.womensDay?.desc || "", type: 'commercial' },
        { name: t.holidayCountdown.holidays.easter?.name || "Velikonoční pondělí", date: easter.monday, icon: <Sparkles className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.easter?.desc || "", isHighSeason: true, type: 'public' },
        { name: t.holidayCountdown.holidays.laborDay?.name || "Svátek práce", date: new Date(currentYear, 4, 1), icon: <Hammer className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.laborDay?.desc || "", type: 'public' },
        { name: t.holidayCountdown.holidays.witches?.name || "Pálení čarodějnic", date: new Date(currentYear, 3, 30), icon: <Flame className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.witches?.desc || "", isHighSeason: true, type: 'commercial' },
        { name: t.holidayCountdown.holidays.victoryDay?.name || "Den vítězství", date: new Date(currentYear, 4, 8), icon: <Star className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.victoryDay?.desc || "", isHighSeason: true, type: 'public' },
        { name: t.holidayCountdown.holidays.mothersDay?.name || "Den matek", date: new Date(currentYear, 4, 10), icon: <Heart className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.mothersDay?.desc || "", type: 'commercial' },
        { name: t.holidayCountdown.holidays.childrensDay?.name || "Den dětí", date: new Date(currentYear, 5, 1), icon: <Baby className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.childrensDay?.desc || "", type: 'commercial' },
        { name: t.holidayCountdown.holidays.fathersDay?.name || "Den otců", date: new Date(currentYear, 5, 21), icon: <User className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.fathersDay?.desc || "", isHighSeason: true, type: 'commercial' },
        { name: t.holidayCountdown.holidays.saintsCyrilMethodius?.name || "Cyril a Metoděj", date: new Date(currentYear, 6, 5), icon: <Flag className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.saintsCyrilMethodius?.desc || "", type: 'public' },
        { name: t.holidayCountdown.holidays.janHus?.name || "Mistr Jan Hus", date: new Date(currentYear, 6, 6), icon: <Scale className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.janHus?.desc || "", type: 'public' },
        { name: t.holidayCountdown.holidays.summer?.name || "Léto", date: new Date(currentYear, 5, 30), icon: <Sun className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.summer?.desc || "", isHighSeason: true, type: 'commercial' },
        { name: t.holidayCountdown.holidays.backToSchool?.name || "Zpátky do školy", date: new Date(currentYear, 8, 1), icon: <GraduationCap className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.backToSchool?.desc || "", isHighSeason: true, type: 'commercial' },
        { name: t.holidayCountdown.holidays.statehoodDay?.name || "Den české státnosti", date: new Date(currentYear, 8, 28), icon: <Flag className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.statehoodDay?.desc || "", isHighSeason: true, type: 'public' },
        { name: t.holidayCountdown.holidays.independenceDay?.name || "Vznik Československa", date: new Date(currentYear, 9, 28), icon: <Flag className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.independenceDay?.desc || "", isHighSeason: true, type: 'public' },
        { name: t.holidayCountdown.holidays.halloween?.name || "Halloween", date: new Date(currentYear, 9, 31), icon: <Ghost className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.halloween?.desc || "", type: 'commercial' },
        { name: t.holidayCountdown.holidays.freedomDay?.name || "Den boje za svobodu", date: new Date(currentYear, 10, 17), icon: <Star className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.freedomDay?.desc || "", isHighSeason: true, type: 'public' },
        { name: t.holidayCountdown.holidays.st_nicholas?.name || "Mikuláš", date: new Date(currentYear, 11, 5), icon: <Gift className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.st_nicholas?.desc || "", type: 'commercial' },
        { name: t.holidayCountdown.holidays.slovackeLeto?.name || "Slovácké léto", date: new Date(currentYear, 6, 3), icon: <Sun className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.slovackeLeto?.desc || "", isHighSeason: true, type: 'commercial' },
        { name: t.holidayCountdown.holidays.vacationSeason?.name || "Dovolené", date: new Date(currentYear, 6, 1), icon: <Sparkles className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.vacationSeason?.desc || "", isHighSeason: true, type: 'commercial' },
        { name: t.holidayCountdown.holidays.lfs?.name || "Letní filmová škola", date: new Date(currentYear, 6, 25), icon: <Film className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.lfs?.desc || "", isHighSeason: true, type: 'commercial' },
        { name: t.holidayCountdown.holidays.slavnostiVina?.name || "Slavnosti vína", date: new Date(currentYear, 8, 13), icon: <Utensils className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.slavnostiVina?.desc || "", isHighSeason: true, type: 'commercial' },
        { name: "Slovácké Hody", date: new Date(currentYear, 9, 15), icon: <Utensils className="w-5 h-5 text-mafia-gold" />, desc: "Tradiční hody v okolí UH. Ke kroji to musí ladit na 100%.", isHighSeason: true, type: 'commercial' },
        { name: t.holidayCountdown.holidays.christmas?.name || "Vánoce", date: new Date(currentYear, 11, 24), icon: <Sparkles className="w-5 h-5 text-mafia-gold" />, desc: t.holidayCountdown.holidays.christmas?.desc || "", isHighSeason: true, type: 'public' },
        { name: "Začátek svatební sezóny", date: new Date(currentYear, 4, 1), icon: <Heart className="w-5 h-5 text-mafia-gold" />, desc: "Diář se plní. Zajisti si termín včas.", isHighSeason: true, type: 'other' },
        { name: "Konec svatební sezóny", date: new Date(currentYear, 8, 30), icon: <Heart className="w-5 h-5 text-mafia-gold" />, desc: "Poslední záchrana pro opozdilce.", type: 'other' },
        { name: "Sezóna randíček", date: new Date(currentYear, 3, 15), icon: <Flame className="w-5 h-5 text-mafia-gold" />, desc: "Láska je ve vzduchu. Musíš vypadat skvěle.", isHighSeason: true, type: 'other' },
        { name: "Sezóna rozvodů", date: new Date(currentYear, 11, 11), icon: <Ghost className="w-5 h-5 text-mafia-gold" />, desc: "Statisticky nejčastější den rozchodů. Čas na nový účes.", isHighSeason: true, type: 'other' },
        { name: "Zazimování (Cuffing season)", date: new Date(currentYear, 10, 1), icon: <Sparkles className="w-5 h-5 text-mafia-gold" />, desc: "Čas najít si polovičku na dlouhé zimní večery.", type: 'other' },
        { name: "Maturity a Státnice", date: new Date(currentYear, 4, 15), icon: <Scale className="w-5 h-5 text-mafia-gold" />, desc: "Dobrý střih je půlka známky. Vypadej jako profík.", isHighSeason: true, type: 'other' },
        { name: "Movember", date: new Date(currentYear, 10, 1), icon: <User className="w-5 h-5 text-mafia-gold" />, desc: "Kníry rostou, ale zbytek musí být ostrý.", type: 'other' }
      ];
    };

    const dates = getDates();

    return dates
      .map(h => {
        const holidayDate = new Date(h.date);
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        const compareDate = new Date(holidayDate);
        compareDate.setHours(0, 0, 0, 0);

        if (compareDate < today) {
          holidayDate.setFullYear(holidayDate.getFullYear() + 1);
        }
        return { ...h, date: holidayDate };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [lang, t]);

  const calculateDays = (targetDate: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };


  // ==============================
  // VIEW COMPONENTS
  // ==============================

  // 1. TIMELINE NODE (Bigger Version)
  const TimelineNode = ({ h, i, isNearest }: { h: Holiday; i: number; isNearest: boolean }) => {
    const daysLeft = calculateDays(h.date);
    const isToday = daysLeft === 0;
    const [isClicking, setIsClicking] = useState(false);

    const handleClick = () => {
      if (isMobileEffectsEnabled) {
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 800);
      }
    };

    return (
      <motion.div
        onMouseEnter={playPaperSound}
        onClick={handleClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, delay: (i % 5) * 0.1 }}
        className="relative flex flex-col items-center group min-w-[300px] md:min-w-[350px] shrink-0"
      >
        {/* Node (The Dot on the Timeline) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
          <div className={`w-5 h-5 rounded-full transition-all duration-500 border-[3px] bg-mafia-black ${isNearest ? 'border-mafia-gold w-8 h-8 shadow-[0_0_25px_var(--color-mafia-gold)]' : 'border-mafia-gold/30 group-hover:border-mafia-gold/70 group-hover:bg-mafia-gold/20 group-hover:scale-125'}`}>
            {isNearest && (
              <div className="absolute inset-0 bg-mafia-gold/40 rounded-full animate-ping"></div>
            )}
          </div>
        </div>

        {/* Top Section (Date & Days Left) */}
        <div className={`flex flex-col items-center justify-end h-[220px] pb-12 w-full transition-all duration-300 ${isNearest ? 'text-mafia-gold' : 'text-smoke-white/60 group-hover:text-smoke-white'}`}>
          <div className={`text-6xl md:text-8xl font-heading font-black tabular-nums transition-all duration-500 mb-2 ${isNearest ? 'drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]' : ''} group-hover:scale-105`}>
            {isToday ? (t?.holidayCountdown?.today || "TODAY") : daysLeft}
          </div>
          <div className={`text-xs md:text-sm font-mono uppercase tracking-[0.5em] font-black ${isNearest ? 'text-mafia-gold/80' : 'text-mafia-gold/50'}`}>
            {isToday ? (lang === 'cs' ? "PRÁVĚ TEĎ" : "NOW") : (
              daysLeft === 1 ? (lang === 'cs' ? "DEN" : "DAY") : (
                lang === 'cs' ? (daysLeft >= 2 && daysLeft <= 4 ? "DNY" : "DNÍ") : "DAYS"
              )
            )}
          </div>
          <div className="mt-3 text-xs md:text-sm uppercase tracking-widest font-mono opacity-70 flex items-center gap-2">
            <CalendarRange size={14} />
            {h.date.toLocaleDateString(lang === 'cs' ? 'cs-CZ' : 'en-US')}
          </div>

          {/* Vertical Connector Top */}
          <div className={`absolute top-[170px] w-[2px] h-[50px] bg-gradient-to-b from-transparent ${isNearest ? 'to-mafia-gold' : 'to-mafia-gold/40'}`}></div>
        </div>

        {/* Bottom Section (Event Details) */}
        <div className="flex flex-col items-center justify-start h-[260px] pt-12 w-full relative">
          {/* Vertical Connector Bottom */}
          <div className={`absolute top-0 w-[2px] h-[50px] bg-gradient-to-b ${isNearest ? 'from-mafia-gold' : 'from-mafia-gold/40'} to-transparent`}></div>

          <div className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mb-6 rounded-sm transition-all duration-500 border ${isNearest ? 'bg-mafia-gold/20 border-mafia-gold text-mafia-gold shadow-[0_0_20px_rgba(255,215,0,0.3)]' : 'bg-mafia-gold/5 border-mafia-gold/30 text-smoke-white/60 group-hover:text-mafia-gold group-hover:border-mafia-gold/60 group-hover:bg-mafia-gold/10'} group-hover:scale-110`}>
            {h.icon}
          </div>

          <h3 className={`font-sans font-bold text-center px-4 text-xl md:text-2xl uppercase tracking-[0.2em] leading-tight mb-3 transition-colors duration-300 ${isNearest ? 'text-smoke-white drop-shadow-md' : 'text-smoke-white/80 group-hover:text-smoke-white'}`}>
            {h.name}
          </h3>

          <p className="text-smoke-white/60 text-sm text-center font-sans leading-relaxed max-w-[280px] transition-colors duration-300 group-hover:text-smoke-white/90 pointer-events-none">
            {h.desc}
          </p>

          {/* removed premium label */}
          <AnimatePresence>
            {isClicking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-mafia-gold/5 z-0 pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };


  // 3. HOLIDAY LIST ITEM (List View)
  const HolidayListItem = ({ h, i, isNearest }: { h: Holiday; i: number; isNearest: boolean }) => {
    const daysLeft = calculateDays(h.date);
    const isToday = daysLeft === 0;
    const isStatic = graphicsTier === 'low' || graphicsTier === 'lite';

    return (
      <motion.div
        initial={isStatic ? false : { opacity: 0, y: 20 }}
        animate={isStatic ? false : { opacity: 1, y: 0 }}
        transition={isStatic ? { duration: 0 } : { duration: 0.5, delay: (i % 5) * 0.1 }}
        className={`w-full flex flex-col p-6 md:p-8 bg-mafia-black/80 backdrop-blur-md border border-mafia-gold/20 mb-4 rounded-sm hover:border-mafia-gold/50 hover:bg-mafia-gold/5 transition-all ${isNearest ? 'border-mafia-gold shadow-[0_0_15px_rgba(255,215,0,0.15)] bg-mafia-gold/5' : ''}`}
      >
        <div className="flex flex-col md:flex-row gap-6 justify-between md:items-center w-full">
          <div className="flex flex-col items-center md:items-start text-center md:text-left mb-2 md:mb-0 md:min-w-[180px]">
            <div className="text-4xl md:text-5xl font-heading font-black text-mafia-gold mb-1 tabular-nums drop-shadow-[0_0_15px_rgba(255,215,0,0.2)]">
              {isToday ? (t?.holidayCountdown?.today || "TODAY") : daysLeft}
            </div>
            <div className="text-[10px] md:text-xs font-mono text-mafia-gold/60 uppercase tracking-widest font-bold">
              {isToday ? (lang === 'cs' ? "PRÁVĚ TEĎ" : "NOW") : (
                daysLeft === 1 ? (lang === 'cs' ? "DEN" : "DAY") : (
                  lang === 'cs' ? (daysLeft >= 2 && daysLeft <= 4 ? "DNY" : "DNÍ") : "DAYS"
                )
              )}
            </div>
            <div className="mt-2 text-xs text-smoke-white/50 font-mono tracking-widest flex items-center justify-center md:justify-start gap-2">
              <CalendarRange size={12} className="text-mafia-gold/40" />
              {h.date.toLocaleDateString(lang === 'cs' ? 'cs-CZ' : 'en-US')}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6 flex-1 border-t md:border-t-0 md:border-l border-mafia-gold/10 pt-6 md:pt-0 md:pl-8">
            <div className={`p-4 rounded-sm ${isNearest ? 'bg-mafia-gold/20 text-mafia-gold' : 'bg-mafia-gold/5 text-smoke-white/60'}`}>
              {h.icon}
            </div>
            <div>
              <h3 className="font-sans font-bold text-xl md:text-2xl text-smoke-white uppercase tracking-widest leading-tight mb-2">
                {h.name}
              </h3>
              <p className="text-smoke-white/70 text-sm font-sans leading-relaxed max-w-2xl">
                {h.desc}
              </p>
            </div>

            {/* removed premium label */}          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="holidays" className="relative w-full py-24 bg-transparent overflow-hidden">

      <div className="w-full mx-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 text-mafia-gold/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-4"
          >
            <Clock size={16} />
            {t?.holidayCountdown?.upcoming || (lang === 'cs' ? 'BLÍŽÍCÍ SE UDÁLOSTI' : 'UPCOMING EVENTS')}
          </motion.div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-smoke-white tracking-[0.2em] uppercase text-center leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {t?.holidayCountdown?.title || (lang === 'cs' ? 'TO NEJLEPŠÍ Z TÝDNE' : 'BEST OF THE WEEK')}
          </h2>
          <div className="section-underline w-24 h-1 bg-gradient-to-r from-transparent via-mafia-gold to-transparent mx-auto mt-8 mb-12 opacity-80" style={{ boxShadow: '0 0 15px var(--user-glow-color)' }}></div>

          {/* NEW INTEL SECTION - GOLD THEME, SHORT, GAME-LIKE */}
          <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center z-20">
            <button
              onClick={() => setShowIntel(!showIntel)}
              className="group relative flex items-center gap-2 px-4 py-2 border border-mafia-gold/30 bg-mafia-gold/5 hover:bg-mafia-gold/10 transition-all cursor-pointer shadow-[0_0_10px_rgba(var(--color-mafia-gold-rgb),0.1)] hover:shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.2)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-mafia-gold/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              <Sparkles size={14} className="text-mafia-gold relative z-10 animate-pulse" />
              <span className="font-mono text-mafia-gold tracking-widest uppercase text-[10px] sm:text-xs relative z-10">
                {lang === 'cs' ? 'INFO: VYTÍŽENÉ OBDOBÍ' : 'INFO: HIGH SEASON'}
              </span>
              <ChevronDown size={14} className={`text-mafia-gold transition-transform duration-300 relative z-10 ${showIntel ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showIntel && (
                <motion.div
                  initial={graphicsTier === 'low' ? {} : { opacity: 0, height: 0 }}
                  animate={graphicsTier === 'low' ? {} : { opacity: 1, height: 'auto' }}
                  exit={graphicsTier === 'low' ? {} : { opacity: 0, height: 0 }}
                  className="w-full mt-4 overflow-hidden"
                >
                  <div className="p-4 sm:p-6 border border-mafia-gold/30 bg-mafia-black/90 backdrop-blur-sm relative shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-mafia-gold to-transparent opacity-50"></div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <h4 className="text-lg font-heading font-black text-mafia-gold uppercase tracking-widest">
                          {lang === 'cs' ? 'KRITICKÉ VYTÍŽENÍ' : 'CRITICAL LOAD'}
                        </h4>
                        <p className="text-smoke-white/80 font-mono text-xs leading-relaxed">
                          {lang === 'cs' 
                            ? 'Události výše znamenají plná křesla. Nechceš přece Donovi vysvětlovat amatérský sestřih. Rezervuj 14 dní předem.'
                            : 'These events mean fully booked chairs. Don\'t explain an amateur cut to the Don. Book 14 days ahead.'}
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0 w-full sm:w-auto">
                        <a 
                          href="#booking"
                          className="block w-full px-6 py-3 bg-mafia-gold text-mafia-black font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-white transition-colors text-center shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.3)]"
                        >
                          {lang === 'cs' ? 'ZAJISTIT KŘESLO' : 'SECURE CHAIR'}
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>



        </div>

        {/* Dynamic Content Area based on View Mode */}
        <div className="w-full relative mt-12 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={isTimelineView ? 'timeline' : 'list'}
              initial={(graphicsTier === 'low' || graphicsTier === 'lite') ? {} : { opacity: 0, y: 20 }}
              animate={(graphicsTier === 'low' || graphicsTier === 'lite') ? {} : { opacity: 1, y: 0 }}
              exit={(graphicsTier === 'low' || graphicsTier === 'lite') ? {} : { opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {isTimelineView && (
                <div className="relative w-full pt-12 pb-16">
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-mafia-gold/10 -translate-y-1/2"></div>

                  <div
                    ref={timelineRef}
                    className="w-full flex justify-start overflow-x-auto hide-scrollbar relative z-10 items-center cursor-grab active:cursor-grabbing px-6 md:px-12"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                  >
                    {holidays.map((h, i) => (
                      <TimelineNode key={h.name + i} h={h} i={i} isNearest={i === 0} />
                    ))}

                    {holidays.length === 0 && (
                      <div className="w-full text-center py-32 text-smoke-white/50 font-mono uppercase tracking-widest text-sm bg-mafia-black/80">
                        {lang === 'cs' ? 'Žádné události v této kategorii' : 'No events in this category'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!isTimelineView && (
                <div className="w-full max-w-4xl mx-auto px-6 flex flex-col pt-4 pb-10">
                  {holidays.map((h, i) => (
                    <HolidayListItem key={h.name + i} h={h} i={i} isNearest={i === 0} />
                  ))}

                  {holidays.length === 0 && (
                    <div className="w-full text-center py-20 text-smoke-white/50 font-mono uppercase tracking-widest text-sm">
                      {lang === 'cs' ? 'Žádné události v této kategorii' : 'No events in this category'}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
