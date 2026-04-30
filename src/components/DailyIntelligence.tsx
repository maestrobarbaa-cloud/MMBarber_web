"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Activity, ShieldAlert, Cpu } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Script from "next/script";

export function DailyIntelligence() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [day, setDay] = useState(0);

  useEffect(() => {
    setMounted(true);
    setDay(new Date().getDate() - 1);
  }, []);

  if (!mounted) return null;

  const messages = t.intelligence || [];
  const currentMessage = messages[day % messages.length] || "System Status: Stable";
  const todayISO = new Date().toISOString().split('T')[0];

  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": `MMBARBER Intelligence Report - ${todayISO}`,
    "description": currentMessage,
    "datePublished": todayISO,
    "author": {
      "@type": "Organization",
      "name": "MMBARBER Intelligence System"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MMBARBER",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mmbarber.cz/logo.png"
      }
    },
    "about": [
      { "@type": "Thing", "name": "Barbershop Uherské Hradiště" },
      { "@type": "Thing", "name": "Men's Grooming Excellence" }
    ],
    "mentions": [
      { "@type": "Place", "name": "Mařatice" },
      { "@type": "Place", "name": "Kunovice" },
      { "@type": "Place", "name": "Staré Město" },
      { "@type": "Place", "name": "Uherské Hradiště" }
    ]
  };

  return (
    <div className="w-full bg-black/20 border border-white/5 p-4 md:p-6 font-mono relative overflow-hidden group opacity-20 hover:opacity-100 transition-opacity duration-1000">
      <Script
        id={`intelligence-schema-${day}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />
      <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
        <Cpu size={24} className="text-mafia-gold" />
      </div>
      
      <div className="flex items-center gap-3 mb-4 border-b border-mafia-gold/10 pb-3">
         <Activity size={14} className="text-mafia-gold animate-pulse" />
         <span className="text-[10px] uppercase tracking-[0.3em] text-mafia-gold">
            {t.footer.intelligenceFeed}
         </span>
         <span className="ml-auto text-[8px] opacity-30">{t.footer.liveUpdate}</span>
      </div>

      <div className="flex gap-4 items-start">
         <div className="shrink-0 pt-1">
            <Terminal size={16} className="text-mafia-gold/60" />
         </div>
         <div className="space-y-2">
            <p className="text-xs md:text-sm text-smoke-white/80 leading-relaxed">
               <span className="text-mafia-gold mr-2 font-black">{">"}</span>
               {currentMessage}
            </p>
            <div className="flex items-center gap-4">
               <span className="text-[8px] text-mafia-gold/40 uppercase tracking-widest">{t.footer.targetRegion}</span>
               <div className="flex gap-1">
                  <div className="w-1 h-1 bg-mafia-gold rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-mafia-gold rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-mafia-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
            </div>
         </div>
      </div>

      <AnimatePresence>
         {day % 5 === 0 && (
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="absolute top-4 right-12 flex items-center gap-2 px-2 py-1 bg-mafia-red/10 border border-mafia-red/20 text-mafia-red text-[8px] uppercase tracking-tighter"
           >
              <ShieldAlert size={10} />
              <span>{t.footer.priorityNotice}</span>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
