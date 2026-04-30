"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { playSound } from "@/utils/audio";
import { Clock, Sparkles, Sun, Heart, Ghost, PartyPopper, User, Baby, GraduationCap, Gift, ChevronDown, ChevronUp, Star, Flag, Scale, Hammer, Cross, Flame, Flower, Clover, Film, Utensils } from "lucide-react";

interface Holiday {
  name: string;
  date: Date;
  icon: React.ReactNode;
  desc: string;
  isHighSeason?: boolean;
}

export function HolidayCountdown() {
  const { lang, t } = useTranslation();
  const [showMore, setShowMore] = useState(false);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = useState(false);
  
  const paperAudioPool = useRef<HTMLAudioElement[]>([]);
  const audioIndex = useRef(0);

  useEffect(() => {
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

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Helper to get variable Easter dates (simplified for range)
    // 2024: 29.3. (Fri), 1.4. (Mon)
    // 2025: 18.4. (Fri), 21.4. (Mon)
    // 2026: 3.4. (Fri), 6.4. (Mon)
    const getEasterDates = (year: number) => {
        if (year === 2024) return { friday: new Date(2024, 2, 29), monday: new Date(2024, 3, 1) };
        if (year === 2025) return { friday: new Date(2025, 3, 18), monday: new Date(2025, 3, 21) };
        return { friday: new Date(2026, 3, 3), monday: new Date(2026, 3, 6) };
    };

    const easter = getEasterDates(currentYear);

    const getDates = () => {
      if (lang === 'en') {
        return [
          {
            name: t?.holidayCountdown?.holidays?.newYear?.name || "New Year",
            date: new Date(currentYear, 0, 1),
            icon: <PartyPopper className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.newYear?.desc,
            isHighSeason: true
          },
          {
            name: t?.holidayCountdown?.holidays?.valentine?.name || "Valentine's Day",
            date: new Date(currentYear, 1, 14),
            icon: <Heart className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.valentine?.desc,
            isHighSeason: true
          },
          {
            name: t?.holidayCountdown?.holidays?.witches?.name || "Witches' Night",
            date: new Date(currentYear, 3, 30),
            icon: <Flame className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.witches?.desc
          },
          {
            name: t?.holidayCountdown?.holidays?.laborDay?.name || "Labor Day",
            date: new Date(currentYear, 4, 1),
            icon: <Hammer className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.laborDay?.desc
          },
          {
            name: t?.holidayCountdown?.holidays?.victoryDay?.name || "Victory Day",
            date: new Date(currentYear, 4, 8),
            icon: <Flag className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.victoryDay?.desc
          },
          {
            name: t?.holidayCountdown?.holidays?.st_patricks?.name || "St. Patrick's Day",
            date: new Date(currentYear, 2, 17),
            icon: <Clover className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.st_patricks?.desc,
            isHighSeason: true
          },
          {
            name: t?.holidayCountdown?.holidays?.goodFriday?.name || "Good Friday",
            date: easter.friday,
            icon: <Cross className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.goodFriday?.desc,
            isHighSeason: true
          },
          {
            name: t?.holidayCountdown?.holidays?.easter?.name || "Easter Monday",
            date: easter.monday,
            icon: <Sparkles className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.easter?.desc,
            isHighSeason: true
          },
          {
            name: t?.holidayCountdown?.holidays?.mothersDay?.name || "Mother's Day",
            date: new Date(currentYear, 4, 11),
            icon: <Heart className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.mothersDay?.desc
          },
          {
            name: t?.holidayCountdown?.holidays?.fathersDay?.name || "Father's Day",
            date: new Date(currentYear, 5, 15),
            icon: <User className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.fathersDay?.desc,
            isHighSeason: true
          },
          {
            name: t?.holidayCountdown?.holidays?.independenceDay?.name || "Independence Day",
            date: new Date(currentYear, 6, 4),
            icon: <Flag className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.independenceDay?.desc,
            isHighSeason: true
          },
          {
            name: t?.holidayCountdown?.holidays?.lfs?.name || "Summer Film School",
            date: new Date(currentYear, 6, 25),
            icon: <Film className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.lfs?.desc,
            isHighSeason: true
          },
          {
            name: t?.holidayCountdown?.holidays?.slavnostiVina?.name || "Wine Festival",
            date: new Date(currentYear, 8, 13),
            icon: <Utensils className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.slavnostiVina?.desc,
            isHighSeason: true
          },
          {
            name: t?.holidayCountdown?.holidays?.halloween?.name || "Halloween",
            date: new Date(currentYear, 9, 31),
            icon: <Ghost className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.halloween?.desc,
            isHighSeason: true
          },
          {
            name: t?.holidayCountdown?.holidays?.thanksgiving?.name || "Thanksgiving",
            date: new Date(currentYear, 10, 27),
            icon: <Gift className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.thanksgiving?.desc,
            isHighSeason: true
          },
          {
            name: t?.holidayCountdown?.holidays?.christmas?.name || "Christmas Day",
            date: new Date(currentYear, 11, 25),
            icon: <Sparkles className="w-5 h-5 text-mafia-gold" />,
            desc: t?.holidayCountdown?.holidays?.christmas?.desc,
            isHighSeason: true
          }
        ];
      }

      return [
        {
          name: t.holidayCountdown.holidays.newYear.name,
          date: new Date(currentYear, 0, 1),
          icon: <PartyPopper className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.newYear.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.valentine.name,
          date: new Date(currentYear, 1, 14),
          icon: <Heart className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.valentine.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.goodFriday.name,
          date: easter.friday,
          icon: <Cross className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.goodFriday.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.womensDay.name,
          date: new Date(currentYear, 2, 8),
          icon: <Flower className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.womensDay.desc
        },
        {
          name: t.holidayCountdown.holidays.easter.name,
          date: easter.monday,
          icon: <Sparkles className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.easter.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.laborDay.name,
          date: new Date(currentYear, 4, 1),
          icon: <Hammer className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.laborDay.desc
        },
        {
          name: t.holidayCountdown.holidays.witches.name,
          date: new Date(currentYear, 3, 30),
          icon: <Flame className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.witches.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.victoryDay.name,
          date: new Date(currentYear, 4, 8),
          icon: <Star className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.victoryDay.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.mothersDay.name,
          date: new Date(currentYear, 4, 10), // Simplified
          icon: <Heart className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.mothersDay.desc
        },
        {
          name: t.holidayCountdown.holidays.childrensDay.name,
          date: new Date(currentYear, 5, 1),
          icon: <Baby className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.childrensDay.desc
        },
        {
          name: t.holidayCountdown.holidays.fathersDay.name,
          date: new Date(currentYear, 5, 21), // Simplified
          icon: <User className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.fathersDay.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.saintsCyrilMethodius.name,
          date: new Date(currentYear, 6, 5),
          icon: <Flag className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.saintsCyrilMethodius.desc
        },
        {
          name: t.holidayCountdown.holidays.janHus.name,
          date: new Date(currentYear, 6, 6),
          icon: <Scale className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.janHus.desc
        },
        {
          name: t.holidayCountdown.holidays.summer.name,
          date: new Date(currentYear, 5, 30),
          icon: <Sun className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.summer.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.backToSchool.name,
          date: new Date(currentYear, 8, 1),
          icon: <GraduationCap className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.backToSchool.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.statehoodDay.name,
          date: new Date(currentYear, 8, 28),
          icon: <Flag className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.statehoodDay.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.independenceDay.name,
          date: new Date(currentYear, 9, 28),
          icon: <Flag className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.independenceDay.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.halloween.name,
          date: new Date(currentYear, 9, 31),
          icon: <Ghost className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.halloween.desc
        },
        {
          name: t.holidayCountdown.holidays.freedomDay.name,
          date: new Date(currentYear, 10, 17),
          icon: <Star className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.freedomDay.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.st_nicholas.name,
          date: new Date(currentYear, 11, 5),
          icon: <Gift className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.st_nicholas.desc
        },
        {
          name: t.holidayCountdown.holidays.vacationSeason.name,
          date: new Date(currentYear, 6, 1),
          icon: <Sparkles className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.vacationSeason.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.lfs.name,
          date: new Date(currentYear, 6, 25),
          icon: <Film className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.lfs.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.slavnostiVina.name,
          date: new Date(currentYear, 8, 13),
          icon: <Utensils className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.slavnostiVina.desc,
          isHighSeason: true
        },
        {
          name: t.holidayCountdown.holidays.christmas.name,
          date: new Date(currentYear, 11, 24),
          icon: <Sparkles className="w-5 h-5 text-mafia-gold" />,
          desc: t.holidayCountdown.holidays.christmas.desc,
          isHighSeason: true
        }
      ];
    };

    const dates = getDates();

    const processedHolidays = dates
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

    setHolidays(processedHolidays);
  }, [lang, t]);

  const calculateDays = (targetDate: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const HolidayCard = ({ h, i, isNearest }: { h: Holiday; i: number; isNearest: boolean }) => {
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
        layout
        onMouseEnter={playPaperSound}
        onClick={handleClick}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ 
          opacity: 1, 
          scale: isClicking ? 1.05 : 1, 
          y: 0,
          borderColor: isClicking ? 'var(--user-accent-color)' : undefined,
          boxShadow: isClicking ? '0 0 30px var(--user-glow-color)' : undefined
        }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ duration: 0.6, delay: isClicking ? 0 : (i % 4) * 0.05 }}
        className={`holiday-card group relative flex flex-col items-center justify-center p-4 md:p-8 bg-mafia-black border transition-all duration-500 overflow-hidden min-h-[180px] md:min-h-[220px] ${isMobileEffectsEnabled ? 'shadow-2xl' : 'md:shadow-2xl'} ${
          isNearest 
            ? `border-mafia-gold ${isMobileEffectsEnabled ? 'shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]' : 'md:shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]'} scale-[1.02] z-10` 
            : (h.isHighSeason ? "border-mafia-gold/40" : "border-mafia-gold/20")
        } md:hover:border-mafia-gold ${isMobileEffectsEnabled ? 'md:hover:shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]' : 'md:hover:shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]'}`}
      >
        {/* Graphical Pulse Effect on Click */}
        <AnimatePresence>
          {isClicking && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-mafia-gold/10 z-0 pointer-events-none"
            />
          )}
        </AnimatePresence>
        {isNearest && (
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-mafia-gold to-transparent"></div>
        )}
        
        {h.isHighSeason && (
          <div className="absolute top-2 right-2 flex gap-1">
            <Sparkles size={10} className="text-mafia-gold animate-pulse" />
          </div>
        )}

        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-mafia-gold opacity-30 md:group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-mafia-gold opacity-30 md:group-hover:opacity-100 transition-opacity"></div>
        
        <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mb-4 md:group-hover:bg-mafia-gold/10 transition-all border ${isNearest ? 'bg-mafia-gold/10 border-mafia-gold' : 'bg-mafia-gold/5 border-mafia-gold/20'}`}>
          {h.icon}
        </div>

        <div className={`text-3xl md:text-5xl font-heading font-black mb-1 tabular-nums transition-all ${
          h.isHighSeason ? "text-mafia-gold" : "text-mafia-gold/80"
        } md:group-hover:scale-110 drop-shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]`}>
          {isToday ? (t?.holidayCountdown?.today || "TODAY") : daysLeft}
        </div>
        
        <div className="text-[8px] font-mono text-mafia-gold/40 uppercase tracking-[0.3em] mb-3 font-black">
          {isToday ? (t?.holidayCountdown?.rightNow || "NOW") : (
            daysLeft === 1 ? (t?.holidayCountdown?.day || "DAY") : (
              (lang === 'cs' && daysLeft >= 2 && daysLeft <= 4) ? "DNY" : (t?.holidayCountdown?.days || "DAYS")
            )
          )}
        </div>

        <h3 className="text-smoke-white font-sans font-bold text-xs md:text-sm uppercase tracking-widest text-center md:group-hover:text-mafia-gold transition-colors line-clamp-2 px-2">
          {h.name}
        </h3>
        
        <div className="absolute inset-0 bg-mafia-black/95 flex items-center justify-center p-6 opacity-0 md:group-hover:opacity-100 transition-all duration-300 pointer-events-none md:group-hover:pointer-events-auto">
            <p className="text-mafia-gold text-[10px] font-sans font-black text-center uppercase tracking-[0.2em] leading-relaxed scale-90 md:group-hover:scale-100 transition-transform duration-500">
                {h.desc}
            </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-mafia-gold to-transparent -translate-x-full md:group-hover:translate-x-0 transition-transform duration-700"></div>
      </motion.div>
    );
  };

  return (
    <section id="holidays" className="relative w-full py-24 bg-transparent overflow-hidden border-y border-mafia-gold/5">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-16 underline-offset-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 text-mafia-gold/40 font-mono text-[10px] uppercase tracking-[0.4em] mb-4"
          >
            <Clock size={16} />
            {t?.holidayCountdown?.upcoming}
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-heading font-black text-smoke-white tracking-[0.3em] uppercase text-center leading-tight">
            {t?.holidayCountdown?.title}
          </h2>
          <p className="text-smoke-white/40 font-sans text-xs md:text-sm mt-4 uppercase tracking-widest text-center max-w-lg">
            {t?.holidayCountdown?.subtitle}
          </p>
          <div className="section-underline w-16 md:w-24 h-1 bg-gradient-to-r from-mafia-gold/20 via-mafia-gold to-mafia-gold/20 mx-auto mt-6 shadow-[0_0_20px_var(--color-mafia-gold-glow)]" style={{ background: 'linear-gradient(to right, transparent, var(--user-accent-color), transparent)', boxShadow: '0 0 20px var(--user-glow-color)' }}></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2 md:px-4 auto-rows-fr">
          {holidays.slice(0, 4).map((h, i) => (
             <HolidayCard key={h.name} h={h} i={i} isNearest={i === 0} />
          ))}
        </div>

        <AnimatePresence>
          {showMore && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2 md:px-4 auto-rows-fr pt-4">
                {holidays.slice(4).map((h, i) => (
                  <HolidayCard key={h.name} h={h} i={i + 4} isNearest={false} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div layout className="mt-12 flex flex-col items-center gap-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-3 px-8 py-3 border border-mafia-gold/30 bg-mafia-black hover:bg-mafia-gold/10 text-mafia-gold font-mono text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl outline-none focus:ring-0 focus:border-mafia-gold"
          >
            {showMore ? (
              <>
                {t?.holidayCountdown?.showLess}
                <ChevronUp size={14} />
              </>
            ) : (
              <>
                {t?.holidayCountdown?.showMore}
                <ChevronDown size={14} />
              </>
            )}
          </motion.button>

          <p className="text-mafia-gold/30 font-mono text-[8px] uppercase tracking-[0.5em] italic animate-pulse">
              {t?.holidayCountdown?.footer}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
