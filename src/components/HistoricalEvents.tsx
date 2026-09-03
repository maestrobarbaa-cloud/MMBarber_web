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

  useEffect(() => {
    setIsClient(true);
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

  return (
    <>
      <motion.button
        onClick={handleOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="hidden md:block fixed bottom-6 left-6 md:bottom-10 md:left-10 z-40 p-3 md:p-4 rounded-full bg-black/80 border border-mafia-gold/50 shadow-[0_0_20px_rgba(197,160,89,0.3)] text-mafia-gold backdrop-blur-sm group overflow-hidden"
        title="Dnes v historii"
      >
        <div className="absolute inset-0 bg-mafia-gold/20 animate-ping opacity-75 rounded-full pointer-events-none" />
        <Info size={28} className="relative z-10 group-hover:text-white transition-colors" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-mafia-gold/30 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-mafia-gold/20 flex justify-between items-center bg-gradient-to-r from-black via-[#1a1a1a] to-black">
                <div className="flex items-center gap-3">
                  <Globe className="text-mafia-gold" size={24} />
                  <div>
                    <h2 className="text-xl md:text-2xl font-heading font-black text-smoke-white uppercase tracking-wider">
                      Stalo se v historii
                    </h2>
                    <p className="text-sm font-mono text-mafia-gold/80 mt-1">
                      Významné události ze dne {dateStr}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-smoke-white/50 hover:text-mafia-gold hover:bg-white/5 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-10 h-10 border-4 border-mafia-gold/30 border-t-mafia-gold rounded-full animate-spin" />
                    <p className="text-sm font-mono text-smoke-white/50">Prohledávám archivy...</p>
                  </div>
                ) : events.length > 0 ? (
                  <div className="space-y-6">
                    {events.map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-mafia-gold/30 hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex-shrink-0 w-20 md:w-24 border-r border-mafia-gold/20 pr-4 flex flex-col items-end justify-center">
                          <span className="text-xl font-heading font-black text-mafia-gold">
                            {event.year}
                          </span>
                          <span className="text-[10px] md:text-xs font-mono text-smoke-white/40 text-right mt-1 flex items-center gap-1">
                            <Clock size={10} />
                            před {event.yearsAgo} lety
                          </span>
                        </div>
                        <div className="flex-1 pl-2">
                          <p className="text-sm md:text-base text-smoke-white/90 leading-relaxed group-hover:text-white transition-colors">
                            {event.text}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-smoke-white/50 font-mono">Dnes se podle Wikipedie nestalo nic zásadního.</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-mafia-gold/10 bg-black/50 text-center">
                <p className="text-[10px] font-mono text-smoke-white/30">
                  Zdroj dat: Otevřená encyklopedie Česká Wikipedie
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
