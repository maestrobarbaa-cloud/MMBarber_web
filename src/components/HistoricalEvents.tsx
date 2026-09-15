"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, Clock, Globe } from "lucide-react";
import { getHistoricalEvents } from "../actions/fetchHistoricalEvents";

interface HistoricalEvent {
  year: string;
  text: string;
  yearsAgo: number;
}

const CZECH_MONTHS = [
  "ledna", "února", "března", "dubna", "května", "června",
  "července", "srpna", "září", "října", "listopadu", "prosince"
];

export const HistoricalEvents = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [dateStr, setDateStr] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsHidden(localStorage.getItem("mmbarber_hide_historical_events") === "true");
    const handleUpdate = () => {
      setIsHidden(localStorage.getItem("mmbarber_hide_historical_events") === "true");
    };
    window.addEventListener("mmbarber-ui-prefs-update", handleUpdate);
    return () => window.removeEventListener("mmbarber-ui-prefs-update", handleUpdate);
  }, []);

  const fetchEvents = async () => {
    if (hasFetched) return;
    setIsLoading(true);
    try {
      const date = new Date();
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const monthName = CZECH_MONTHS[monthIndex];
      const currentYear = date.getFullYear();
      
      setDateStr(`${day}. ${monthName}`);

      const data = await getHistoricalEvents(day, monthName, currentYear);
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch historical events:", error);
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  };

  const handleOpen = () => {
    fetchEvents();
    setIsOpen(true);
  };

  if (!isClient) return null;
  if (isHidden) return null;

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={handleOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="hidden md:block fixed bottom-6 left-6 md:bottom-10 md:left-10 z-40 p-3 md:p-4 rounded-full bg-black/80 border border-mafia-gold/50 theme-blood:border-red-500/50 noir-mode:border-white/50 shadow-[0_0_20px_rgba(197,160,89,0.3)] theme-blood:shadow-[0_0_20px_rgba(239,68,68,0.3)] noir-mode:shadow-[0_0_20px_rgba(255,255,255,0.3)] text-mafia-gold theme-blood:text-red-500 noir-mode:text-white backdrop-blur-sm group overflow-hidden"
        title="Dnes v historii"
      >
        <div className="absolute inset-0 bg-mafia-gold/20 theme-blood:bg-red-500/20 noir-mode:bg-white/20 animate-ping opacity-75 rounded-full pointer-events-none" />
        <Info size={28} className="relative z-10 group-hover:text-white transition-colors" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -2, y: 20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotate: 2, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="relative w-full max-w-5xl bg-[#e8dec7] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] text-[#2c2825] font-serif border-[8px] md:border-[12px] border-[#2c2825]"
            >
              <div className="p-4 sm:p-8 flex flex-col items-center justify-center border-b-[4px] border-[#2c2825] relative">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 text-[#2c2825] hover:bg-[#2c2825]/10 rounded-full transition-all z-10"
                >
                  <X size={28} />
                </button>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-widest text-center mt-2 mb-2 leading-none" style={{ fontFamily: "Georgia, serif" }}>
                  MMBarber Times
                </h1>
                <div className="w-full flex flex-col md:flex-row justify-between items-center border-t-2 border-b-2 border-[#2c2825] py-2 mt-4 gap-2 md:gap-0">
                  <span className="font-bold text-xs md:text-sm uppercase tracking-widest">Zvláštní vydání</span>
                  <span className="font-bold text-sm md:text-base uppercase tracking-widest">{dateStr}</span>
                  <span className="font-bold text-xs md:text-sm uppercase tracking-widest">Cena: 20 MINCÍ</span>
                </div>
              </div>

              <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1 bg-[#e8dec7]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="w-12 h-12 border-4 border-[#2c2825]/30 border-t-[#2c2825] rounded-full animate-spin" />
                    <p className="text-xl font-bold uppercase tracking-widest">Tiskárna se zahřívá...</p>
                  </div>
                ) : events.length > 0 ? (
                  <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {events.map((event, index) => (
                      <div
                        key={index}
                        className="break-inside-avoid mb-8 relative group"
                      >
                        <h2 className="text-3xl md:text-4xl font-black mb-2" style={{ fontFamily: "Georgia, serif" }}>
                          {event.year}
                        </h2>
                        <div className="h-0.5 w-16 bg-[#2c2825] mb-4"></div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-3 opacity-70">
                          Před {event.yearsAgo} lety
                        </p>
                        <p className="text-base md:text-lg leading-relaxed text-justify" style={{ fontFamily: "Georgia, serif" }}>
                          <span className="float-left text-5xl md:text-6xl font-black leading-[0.8] pr-2 pt-1">
                            {event.text.charAt(0)}
                          </span>
                          {event.text.slice(1)}
                        </p>
                        {index < events.length - 1 && (
                          <div className="w-full border-b border-[#2c2825]/30 mt-8 md:hidden"></div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-xl font-bold uppercase tracking-widest">Dnes se podle archivu nestalo nic převratného.</p>
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t-[4px] border-[#2c2825] bg-[#d5c7ad] text-center">
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-70">
                  Vytiskl Syndikát | Zdroj: Otevřená encyklopedie Česká Wikipedie
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
