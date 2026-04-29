"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Activity, ShieldCheck, Globe } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Script from "next/script";

export function FamilyIntelligence() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [day, setDay] = useState(0);

  useEffect(() => {
    setMounted(true);
    setDay(new Date().getDate() - 1);
  }, []);

  if (!mounted) return null;

  const messages = t.familyIntelligence || [];
  const currentMessage = messages[day % messages.length] || "Network Status: Synchronized";
  const todayISO = new Date().toISOString().split('T')[0];

  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": `MMBARBER Family Operational Report - ${todayISO}`,
    "description": currentMessage,
    "datePublished": todayISO,
    "author": {
      "@type": "Organization",
      "name": "MMBARBER Intelligence Network"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MMBARBER",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mmbarber.cz/logo.png"
      }
    }
  };

  return (
    <div className="w-full bg-mafia-gold/[0.03] border border-mafia-gold/10 p-4 md:p-6 font-mono relative overflow-hidden group hover:bg-mafia-gold/[0.05] transition-all duration-700">
      <Script
        id={`family-intelligence-schema-${day}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />
      <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
        <Network size={24} className="text-mafia-gold" />
      </div>
      
      <div className="flex items-center gap-3 mb-4 border-b border-mafia-gold/10 pb-3">
         <Globe size={14} className="text-mafia-gold animate-spin-slow" />
         <span className="text-[10px] uppercase tracking-[0.3em] text-mafia-gold font-black">
            Family_Operational_Network
         </span>
         <span className="ml-auto text-[8px] opacity-30">SECURE_SYNC // V 3.4</span>
      </div>

      <div className="flex gap-4 items-start">
         <div className="shrink-0 pt-1">
            <ShieldCheck size={16} className="text-mafia-gold/60" />
         </div>
         <div className="space-y-2">
            <p className="text-xs md:text-sm text-smoke-white/80 leading-relaxed italic">
               <span className="text-mafia-gold mr-2 font-black">REPORT:</span>
               {currentMessage}
            </p>
            <div className="flex items-center gap-4">
               <span className="text-[8px] text-mafia-gold/40 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={10} /> Nodes: ACTIVE_2026
               </span>
               <div className="flex gap-1">
                  <div className="w-1 h-1 bg-mafia-gold rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-mafia-gold rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-mafia-gold rounded-full animate-pulse [animation-delay:0.4s]"></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
