"use client";

import { Calendar, Dices, Cigarette, Coffee, UserPlus, Scissors, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EVENT_TYPES = [
  {
    dayIndex: 1, // Pondělí (0 = Sunday, 1 = Monday, etc.)
    title: "Prohibiční Pondělí",
    icon: <Coffee size={20} />,
    desc: "Zákaz mluvení. Přijď se vzpamatovat po víkendu, mlč a dostaneš 10% slevu na Fade. Silné espresso navíc zdarma pro ty, co neřeknou ani slovo.",
    highlight: "10% SLEVA ZA OMERTA"
  },
  {
    dayIndex: 2,
    title: "Den Zrádců",
    icon: <UserPlus size={20} />,
    desc: "Přiveď k nám parťáka, co doteď chodil ke konkurenci, a nech ho přísahat věrnost naší Rodině. Pro tebe je úprava plnovousu kompletně na náš účet.",
    highlight: "BEARD STYLING ZDARMA"
  },
  {
    dayIndex: 3,
    title: "Středeční Čistka",
    icon: <Scissors size={20} />,
    desc: "V polovině týdne je třeba zahladit stopy. Mytí hlavy speciálním čistícím šamponem, horký ručník a masáž hlavy ke každému kombu.",
    highlight: "HOT TOWEL V CENĚ"
  },
  {
    dayIndex: 4,
    title: "Casino Čtvrtek",
    icon: <Dices size={20} />,
    desc: "Hoď si po střihu kostkami s tvým operativcem. Padnou-li dvě šestky, máš dnešní misi zcela zdarma. Pokud ne, aspoň dostaneš panáka bourbonu.",
    highlight: "HRA O STŘIH ZDARMA"
  },
  {
    dayIndex: 5,
    title: "Příprava na Razzii",
    icon: <Cigarette size={20} />,
    desc: "Před víkendem musíme všichni vypadat ostře. Odejdeš od nás tak vyladěný, že bys z fleku mohl vést monopol. Ke kompletce dostaneš kvalitní doutník.",
    highlight: "DOUTNÍK JAKO BONUS"
  },
  {
    dayIndex: 6,
    title: "Mafia Ráno",
    icon: <Coffee size={20} />,
    desc: "Speciální ranní vyprošťovák pro ty, co to včera s Rodinou přehnali na baru. Kombinace studeného obkladu, ledové vody a nekompromisní ostré břitvy.",
    highlight: "VYPROŠŤOVACÍ PROCEDURA"
  },
  {
    dayIndex: 0, // Neděle
    title: "Omerta (Zavřeno)",
    icon: <Calendar size={20} />,
    desc: "Zbraně utichly. Rodina nabírá síly na další týden.",
    highlight: "DEN PRACOVNÍHO KLIDU"
  }
];

const MONTH_NAMES = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];
const DAY_NAMES = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  event: typeof EVENT_TYPES[0];
}

export function Events() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarDay | null>(null);

  useEffect(() => {
    generateCalendar(currentDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get day of week for first day (0 = Sunday, 1 = Monday...)
    // Adjust so Monday is 0 and Sunday is 6
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6; 

    const calendarDays: CalendarDay[] = [];

    // Prior month days to fill the first row
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      calendarDays.push(createDayObj(d, false, today));
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
       const d = new Date(year, month, i);
       calendarDays.push(createDayObj(d, true, today));
    }

    // Next month days to fill the grid (let's aim for 42 total cells = 6 rows)
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
       const d = new Date(year, month + 1, i);
       calendarDays.push(createDayObj(d, false, today));
    }

    setDays(calendarDays);
  };

  const createDayObj = (d: Date, isCurrentMonth: boolean, today: Date): CalendarDay => {
    const dStr = d.toDateString();
    const tStr = today.toDateString();
    return {
      date: d,
      isCurrentMonth,
      isToday: dStr === tStr,
      event: EVENT_TYPES.find(e => e.dayIndex === d.getDay()) || EVENT_TYPES[0]
    };
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  return (
    <section id="harmonogram" className="relative w-full py-16 md:py-32 px-2 md:px-12 bg-mafia-black border-y-8 border-mafia-dark flex flex-col items-center">
      
      {/* Background Texture via CSS patterns */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')" }}></div>

      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12 relative z-10 px-4">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-smoke-white mb-3 md:mb-4 tracking-widest uppercase">
          Rozvrh <span className="text-mafia-gold">Podsvětí</span>
        </h2>
        <div className="w-16 md:w-24 h-1 bg-mafia-gold mx-auto mb-4 md:mb-6 shadow-[0_0_10px_rgba(197,160,89,0.8)]"></div>
        <p className="text-smoke-white/60 font-sans max-w-2xl mx-auto text-xs md:text-base italic uppercase tracking-wider">
          Plánuj své mise strategicky. Každý den má svá specifika.
        </p>
      </div>

      <div className="w-full max-w-5xl relative z-10 px-2 sm:px-0">
        
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-8 px-4 py-3 bg-mafia-dark/80 border border-mafia-gold/20 backdrop-blur-sm">
          <button 
            onClick={prevMonth}
            className="p-2 text-mafia-gold hover:bg-mafia-gold hover:text-mafia-black transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          <h3 className="text-xl md:text-2xl font-heading font-bold text-smoke-white uppercase tracking-widest">
            {MONTH_NAMES[currentDate.getMonth()]} <span className="text-mafia-gold">{currentDate.getFullYear()}</span>
          </h3>
          
          <button 
            onClick={nextMonth}
            className="p-2 text-mafia-gold hover:bg-mafia-gold hover:text-mafia-black transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {DAY_NAMES.map((name, i) => (
            <div key={i} className="text-center font-mono text-mafia-gold/80 text-xs md:text-sm tracking-widest uppercase py-2">
              {name}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {days.map((day, i) => {
            const isSunday = day.date.getDay() === 0;

            return (
              <div 
                key={i} 
                onClick={() => setSelectedEvent(day)}
                className={`
                  relative h-20 sm:h-24 md:h-32 p-1 md:p-3 flex flex-col transition-all duration-300 cursor-pointer group cursor-hover
                  ${day.isCurrentMonth ? 'bg-mafia-dark/40 border-mafia-gold/10 hover:border-mafia-gold hover:bg-mafia-dark/80 hover:shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'bg-transparent border-white/5 opacity-50'}
                  ${day.isToday ? 'border-2 border-mafia-red bg-mafia-red/5' : 'border'}
                  ${isSunday ? 'opacity-60 grayscale' : ''}
                `}
              >
                {/* Date Number */}
                <span className={`font-mono text-xs sm:text-sm md:text-lg mb-1 leading-none ${day.isToday ? 'text-mafia-red font-bold' : 'text-smoke-white/60'}`}>
                  {day.date.getDate()}.
                </span>

                {/* Event Short Preview */}
                <div className="mt-auto hidden sm:flex flex-col gap-1 w-full flex-grow text-center overflow-hidden">
                  <div className={`mx-auto p-1 rounded-full ${day.isToday ? 'bg-mafia-red text-white' : 'text-mafia-gold/50 group-hover:text-mafia-gold'}`}>
                    {day.event.icon}
                  </div>
                  <span className="text-[9px] md:text-[10px] text-smoke-white font-sans uppercase tracking-wider truncate px-1 hidden md:block opacity-60 group-hover:opacity-100">
                    {day.event.title}
                  </span>
                </div>
                
                {/* Mobile Icon only */}
                <div className="flex sm:hidden w-full h-full items-center justify-center text-mafia-gold/30">
                   {day.event.icon}
                </div>

                {/* Today Badge */}
                {day.isToday && (
                  <div className="absolute bottom-0 inset-x-0 bg-mafia-red text-[8px] sm:text-[10px] text-white font-bold text-center tracking-widest uppercase py-0.5">
                    Dnes
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal Overlay */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-lg relative overflow-hidden border ${selectedEvent.isToday ? 'border-mafia-red' : 'border-mafia-gold/40'} shadow-2xl p-8 bg-mafia-black`}
              onClick={e => e.stopPropagation()}
            >
               <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/black-paper.png')" }}></div>
               
               <button 
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 z-20 text-smoke-white/50 hover:text-mafia-gold transition-colors"
                >
                  <X size={24} />
               </button>

               <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-full border ${selectedEvent.isToday ? 'bg-mafia-red border-mafia-red text-white shadow-[0_0_20px_rgba(139,0,0,0.8)]' : 'bg-transparent border-mafia-gold text-mafia-gold'}`}>
                      {selectedEvent.event.icon}
                    </div>
                    <div>
                      <p className="font-mono text-mafia-gold/70 text-sm tracking-widest mb-1">
                        {selectedEvent.date.toLocaleDateString('cs-CZ')}
                      </p>
                      <h3 className="text-2xl font-heading font-black text-smoke-white uppercase tracking-wider">
                        {selectedEvent.event.title}
                      </h3>
                    </div>
                 </div>

                 <p className="text-smoke-white/80 font-sans leading-relaxed mb-8">
                   {selectedEvent.event.desc}
                 </p>

                 <div className={`w-full text-center py-4 border-t border-b ${selectedEvent.isToday ? 'border-mafia-red/50 bg-mafia-red/10' : 'border-mafia-gold/20 bg-mafia-gold/5'}`}>
                   <span className={`font-mono text-sm uppercase tracking-[0.2em] font-bold ${selectedEvent.isToday ? 'text-mafia-red drop-shadow-[0_0_8px_rgba(139,0,0,0.8)]' : 'text-mafia-gold'}`}>
                     {selectedEvent.event.highlight}
                   </span>
                 </div>
                 
                 {/* Booking shortcut */}
                 {selectedEvent.date.getDay() !== 0 && (
                   <div className="mt-8 flex justify-center">
                     <a href="#services" onClick={() => setSelectedEvent(null)} className="px-8 py-3 bg-mafia-dark border border-mafia-gold/50 text-mafia-gold font-sans uppercase tracking-widest text-xs hover:bg-mafia-gold hover:text-mafia-black transition-all">
                       Naplánovat akci
                     </a>
                   </div>
                 )}
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
