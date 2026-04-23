"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CalendarHeart, Crosshair } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export function VipCalendar() {
  const { t } = useTranslation();

  return (
    <div className="w-full relative py-8 px-4 flex flex-col items-center">
      
      {/* Google Calendar Embed Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl mx-auto border-4 border-mafia-gold/30 p-2 md:p-4 bg-mafia-black/95 shadow-[0_0_50px_var(--color-mafia-gold-glow)] relative group"
      >
        {/* Decorative corner accents */}
        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-mafia-gold"></div>
        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-mafia-gold"></div>
        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-mafia-gold"></div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-mafia-gold"></div>
        
        <div className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-[#0a0a0a]">
          {/* 
            Mafiánský "tónovací" překryv: 
            Kombinace blendovacích módů obarví inverzní Google kalendář do zlata 
          */}
          <div className="absolute inset-0 z-10 bg-mafia-gold mix-blend-color opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-10"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-mafia-black via-transparent to-transparent pointer-events-none opacity-80"></div>
          
          <iframe 
            src="https://calendar.google.com/calendar/embed?src=5afa84e345ee6015b366a69da4e80a2b8149dbc7e9b798da1028a26991e39659%40group.calendar.google.com&ctz=Europe%2FPrague&wkst=2&bgcolor=%230a0a0a&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA" 
            title="MMBARBER Calendar"
            className="w-full h-full opacity-90 transition-all duration-700 group-hover:opacity-100 border-0"
            style={{ 
              /* Inverze bílého google kalendáře na tmavý + zvýšení kontrastu pro čitelnost */
              filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' 
            }} 
          ></iframe>
          
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-mafia-black to-transparent pointer-events-none z-20"></div>
        </div>
        
        {/* Footer detail */}
        <div className="bg-mafia-gold/5 mt-4 py-4 px-6 border border-mafia-gold/10 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs uppercase tracking-widest text-mafia-gold">
          <div className="flex items-center gap-2 font-black">
              <CalendarHeart size={16} /> 
              <span>{t.club.title} | OFFICIAL ROSTER</span>
          </div>
          <div className="flex gap-6 opacity-60">
            <span className="flex items-center gap-2"><ShieldCheck size={14} /> SECURE</span>
            <span className="flex items-center gap-2"><Crosshair size={14} /> ENCRYPTED</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
