"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, Crosshair, ShieldAlert, Zap } from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";

const CITIES = [
  "UHERSKÉ HRADIŠTĚ", "STARÉ MĚSTO", "KUNOVICE", "ZLÍN", 
  "VESELÍ NAD MORAVOU", "NAPAJEDLA", "OTROKOVICE", "UHERSKÝ BROD"
];

const INTEL_REPORTS_CS = [
  "Detekována zvýšená poptávka po prémiových fadech. Přesouváme kapacitu na operativce Tomáše.",
  "Zaznamenán pohyb VIP klientely v sektoru. Systém doporučuje rezervaci s předstihem.",
  "Monitorujeme šíření našeho vlivu v regionu. Teritorium je zabezpečeno.",
  "Zvýšená frekvence vyhledávání 'barber'. Aktivujeme SEO obranné protokoly.",
  "Centrála potvrzuje dominanci na lokálním trhu. Operativec Nela připravena k nasazení.",
  "Zachycena komunikace o našem syndikátu. Lidé žádají ostré přechody a luxusní péči."
];

const INTEL_REPORTS_EN = [
  "Increased demand for premium fades detected. Shifting capacity to operative Tomas.",
  "VIP client movement registered in sector. System recommends booking in advance.",
  "Monitoring the spread of our influence in the region. Territory is secured.",
  "Increased frequency of 'barber' searches. Activating SEO defense protocols.",
  "Headquarters confirms dominance in local market. Operative Nela ready for deployment.",
  "Intercepted communications about our syndicate. People are demanding sharp fades and luxury care."
];

interface LogEntry {
  id: string;
  time: string;
  city: string;
  message: string;
  icon: any;
}

export function TerritoryRadar() {
  const { lang } = useTranslation();
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const generateReport = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const reports = lang === 'cs' ? INTEL_REPORTS_CS : INTEL_REPORTS_EN;
    const message = reports[Math.floor(Math.random() * reports.length)];
    
    const icons = [Crosshair, ShieldAlert, Zap];
    const Icon = icons[Math.floor(Math.random() * icons.length)];

    return {
      id: Math.random().toString(36).substr(2, 9),
      time: timeStr,
      city,
      message,
      icon: Icon
    };
  };

  useEffect(() => {
    // Initial logs
    setLogs([generateReport(), generateReport()]);

    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [generateReport(), ...prev];
        return newLogs.slice(0, 3); // Keep only last 3 logs
      });
    }, 8000); // New report every 8 seconds

    return () => clearInterval(interval);
  }, [lang]);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12">
      <div className="bg-black/60 border border-mafia-gold/20 rounded-md p-6 backdrop-blur-sm relative overflow-hidden">
        
        {/* Radar Background Effect */}
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
           <Radar size={300} className="text-mafia-gold animate-spin-slow" />
        </div>

        <div className="flex items-center gap-3 mb-6 border-b border-mafia-gold/20 pb-4">
          <Radar className="text-mafia-gold animate-pulse" size={24} />
          <h3 className="font-heading text-xl text-mafia-gold uppercase tracking-widest m-0">
            {lang === 'cs' ? 'Regionální Skenovací Algoritmus' : 'Regional Intel Scanner'}
          </h3>
          <div className="ml-auto flex gap-2 items-center">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
             <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">Live</span>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-4 p-3 bg-white/5 rounded border-l-2 border-mafia-gold/50 hover:bg-white/10 transition-colors"
              >
                <div className="mt-1">
                  <log.icon size={16} className="text-mafia-gold/70" />
                </div>
                <div className="flex-1 font-mono">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-white/50">{log.time}</span>
                    <span className="text-xs font-bold text-mafia-gold tracking-wider">[{log.city}]</span>
                  </div>
                  <p className="text-sm text-smoke-white m-0">
                    {log.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* SEO Injection Box (Hidden visually but semantically present) */}
        <div className="sr-only">
          Monitoring local barber demand in Uherské Hradiště, Zlín, Staré Město, Kunovice, Napajedla, Otrokovice, and Veselí nad Moravou. 
          Premium fades, local dominance, elite haircut syndicate operating regionally.
        </div>
      </div>
    </div>
  );
}
