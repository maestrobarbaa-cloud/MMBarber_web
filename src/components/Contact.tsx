"use client";

import { useState, useRef } from "react";
import { MapPin, Car, Bus, Mail, Phone, Info, Copy } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { trackEvent } from "../utils/analytics";
import { playSound } from "../utils/audio";
import { motion, AnimatePresence } from "framer-motion";

type InfoCategory = "address" | "connection" | "parking" | "transit";

export function Contact() {
  const { t, lang } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<InfoCategory>("address");
  const [copied, setCopied] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const playContactSound = (soundFile: string) => {
    playSound(`/sounds/${soundFile}`, 0.5);
  };

  const categories = [
    { id: "address" as const, icon: <MapPin size={40} />, label: t?.contact?.address || (lang === 'cs' ? 'Adresa' : 'Address') },
    { id: "connection" as const, icon: <Phone size={40} />, label: t?.contact?.connection || (lang === 'cs' ? 'Spojení' : 'Connection') },
    { id: "parking" as const, icon: <Car size={40} />, label: t?.contact?.parking || (lang === 'cs' ? 'Parkování' : 'Parking') },
    { id: "transit" as const, icon: <Bus size={40} />, label: t?.contact?.transit || (lang === 'cs' ? 'MHD' : 'Transit') },
  ];

  const renderActiveInfo = () => {
    switch (activeCategory) {
      case "address":
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 flex flex-col items-center text-center"
          >
            <div className="flex items-center gap-3 text-mafia-gold">
                <MapPin size={20} />
                <h4 className="font-heading font-bold uppercase tracking-widest">{t?.contact?.address || (lang === 'cs' ? 'Adresa' : 'Address')}</h4>
            </div>
            <div className="address-side-bar font-mono text-xl md:text-2xl text-smoke-white border-y border-mafia-gold/20 py-4 px-8 allow-copy">
                <p>Mařatice, Sadová 1383</p>
                <p className="text-mafia-gold/60">Uherské Hradiště</p>
            </div>
          </motion.div>
        );
      case "connection":
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 flex flex-col items-center text-center w-full"
          >
            <div className="flex items-center gap-3 text-mafia-gold">
                <Phone size={20} />
                <h4 className="font-heading font-bold uppercase tracking-widest">{t?.contact?.connection || (lang === 'cs' ? 'Spojení' : 'Connection')}</h4>
            </div>
            <div className="grid gap-4 w-full max-w-sm allow-copy">
                <a href="tel:+420577544073" 
                   onClick={() => { trackEvent("cta_contact_tel"); playContactSound("telefon.mp3"); }}
                   className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:border-mafia-gold transition-all duration-300">
                    <div className="w-10 h-10 border border-mafia-gold/20 flex items-center justify-center group-hover:bg-mafia-gold transition-colors">
                        <Phone size={18} className="text-mafia-gold group-hover:text-mafia-black" />
                    </div>
                    <span className="text-lg md:text-xl font-mono text-smoke-white">+420 577 544 073</span>
                </a>
                <a href="mailto:mmbarber@mmbarber.cz" 
                   onClick={() => { trackEvent("cta_contact_mail"); playContactSound("telefon.mp3"); }}
                   className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:border-mafia-gold transition-all duration-300">
                    <div className="w-10 h-10 border border-mafia-gold/20 flex items-center justify-center group-hover:bg-mafia-gold transition-colors">
                        <Mail size={18} className="text-mafia-gold group-hover:text-mafia-black" />
                    </div>
                    <span className="text-lg md:text-xl font-mono text-smoke-white break-all">mmbarber@mmbarber.cz</span>
                </a>
            </div>
          </motion.div>
        );

      case "parking":
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 flex flex-col items-center text-center w-full"
          >
            <div className="flex items-center gap-3 text-mafia-gold">
                <Car size={20} />
                <h4 className="font-heading font-bold uppercase tracking-widest">{t?.contact?.parking || (lang === 'cs' ? 'Parkování' : 'Parking')}</h4>
            </div>
            
            <div className="space-y-4 font-sans text-smoke-white/80 leading-relaxed border-mafia-red border-l-4 md:border-l-4 pl-6 py-2">
                <p className="text-xl font-bold text-smoke-white uppercase tracking-wider">{t?.intro?.parking || (lang === 'cs' ? 'PARKOVÁNÍ' : 'PARKING')}</p>
                <p className="text-lg italic text-mafia-gold/90">{t?.intro?.parkingHint}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-2 w-full">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("Sadová 1383, 686 05 Uherské Hradiště 5");
                    setCopied(true);
                    playContactSound("papir.mp3");
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-mafia-gold transition-all text-xs font-bold uppercase tracking-widest group"
                >
                  <Copy size={14} className={copied ? "text-green-500" : "text-mafia-gold group-hover:scale-110 transition-transform"} />
                  <span className="text-smoke-white">{copied ? (lang === 'cs' ? "KOPÍROVÁNO" : "COPIED") : (t?.intro?.copyAddress || "COPY ADDRESS")}</span>
                </button>
                
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=Sadová+1383,+686+05+Uherské+Hradiště+5"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playContactSound("papir.mp3")}
                  className="flex items-center gap-2 px-6 py-3 bg-mafia-gold/10 border border-mafia-gold/30 hover:bg-mafia-gold hover:text-mafia-black transition-all text-xs font-bold uppercase tracking-widest group"
                >
                  <MapPin size={14} className="text-mafia-gold group-hover:text-mafia-black transition-colors" />
                  <span className="text-smoke-white group-hover:text-mafia-black">{t?.intro?.openMaps || "OPEN MAPS"}</span>
                </a>
            </div>
          </motion.div>
        );
      case "transit":
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 flex flex-col items-center text-center w-full"
          >
            <div className="flex items-center gap-3 text-mafia-gold">
                <Bus size={20} />
                <h4 className="font-heading font-bold uppercase tracking-widest">{t?.contact?.transit || (lang === 'cs' ? 'MHD' : 'Transit')}</h4>
            </div>
            <div className="p-6 bg-white/5 border-2 border-dashed border-mafia-gold/20 flex flex-col gap-4 w-full max-w-sm mx-auto">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 bg-mafia-gold shrink-0 flex items-center justify-center text-mafia-black font-black">ST</div>
                    <div>
                        <p className="text-smoke-white font-bold text-lg uppercase tracking-widest">{t?.contact?.transitText1}</p>
                        <p className="text-mafia-gold/60 font-mono text-sm uppercase mt-1">{t?.contact?.transitText2}</p>
                    </div>
                </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="kontakt" className="relative w-full py-24 px-6 md:px-12 bg-transparent border-t border-mafia-gold/10 overflow-hidden">
      
      {/* HUD Background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 border-t border-l border-mafia-gold/5 -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 border-b border-r border-mafia-gold/5 translate-x-1/2 translate-y-1/2 rounded-full"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-heading font-black text-smoke-white mb-4 tracking-[0.2em] uppercase">
            {t?.contact?.title || (lang === 'cs' ? 'KONTAKT' : 'CONTACT')}
          </h2>
          <div className="section-underline w-16 md:w-24 h-1 bg-gradient-to-r from-mafia-gold/20 via-mafia-gold to-mafia-gold/20 mx-auto mb-6 shadow-[0_0_20px_var(--color-mafia-gold-glow)]" style={{ background: 'linear-gradient(to right, transparent, var(--user-accent-color), transparent)', boxShadow: '0 0 20px var(--user-glow-color)' }}></div>
          <p className="text-smoke-white/40 font-mono tracking-[0.4em] uppercase text-xs md:text-sm">{t?.contact?.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* INTERACTIVE ICON GRID & DETAIL VIEWER */}
          <div className="flex flex-col gap-8 md:gap-12">
            
            {/* Category Icons */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            setActiveCategory(cat.id);
                            trackEvent("contact_category_click", { category: cat.id });
                            
                            // Map categories to specific sounds
                            const soundMap: Record<string, string> = {
                              address: "papir.mp3",
                              connection: "telefon.mp3",
                              parking: "klakson.mp3",
                              transit: "autobus.mp3"
                            };
                            playContactSound(soundMap[cat.id]);
                        }}
                        className={`group relative w-20 h-20 md:w-28 md:h-28 flex flex-col items-center justify-center transition-all duration-500 border-2 outline-none ${
                            activeCategory === cat.id 
                            ? "bg-white/5 border-mafia-gold shadow-[0_0_30px_rgba(197,160,89,0.3)]" 
                            : "bg-mafia-dark/40 border-mafia-gold/20 hover:border-mafia-gold/60"
                        }`}
                    >
                        <div className={`transition-all duration-500 ${
                            activeCategory === cat.id ? "text-mafia-gold scale-110" : "text-mafia-gold group-hover:scale-105"
                        }`}>
                            {cat.icon}
                        </div>
                        <span className={`absolute -bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] md:text-[12px] uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                            activeCategory === cat.id ? "opacity-100 text-mafia-gold translate-y-2 font-bold" : "opacity-0 invisible"
                        }`}>
                            {cat.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Information Viewer (HUD Style) */}
            <div className="mt-8 md:mt-4 p-8 md:p-12 bg-mafia-dark/30 border-2 border-mafia-gold/10 relative h-[320px] md:h-[350px] flex items-center overflow-hidden">
                {/* HUD Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-mafia-gold/20"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-mafia-gold/20"></div>
                
                <div className="w-full">
                    <AnimatePresence mode="wait">
                        <div key={activeCategory}>
                            {renderActiveInfo()}
                        </div>
                    </AnimatePresence>
                </div>
            </div>

          </div>

          {/* Map Section */}
          <div className="w-full h-[400px] lg:h-[500px] bg-mafia-black border-2 border-mafia-gold/20 p-1 relative group overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-mafia-gold/30 z-20 group-hover:bg-mafia-gold/60 transition-colors shadow-[0_0_15px_rgba(197,160,89,0)] group-hover:shadow-[0_0_15px_rgba(197,160,89,0.5)]"></div>
            <div className="absolute inset-0 bg-mafia-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
            <iframe 
              src="https://maps.google.com/maps?q=Sadov%C3%A1%201383,%20686%2005%20Uhersk%C3%A9%20Hradi%C5%A1t%C4%9B%205&t=&z=16&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: "grayscale(1) contrast(1.2) brightness(0.8) invert(1) hue-rotate(180deg) brightness(0.6)" }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full relative z-0"
            ></iframe>

            {/* HAND-DRAWN MARKER OVERLAY */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center">
                <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="map-target text-mafia-gold drop-shadow-[0_0_15px_rgba(197,160,89,0.8)] filter drop-shadow-[0_0_2px_rgba(0,0,0,1)]">
                    {/* Wobbly Circle */}
                    <path 
                        className="map-target-ring"
                        d="M50 10c10.4 0 24.3 2.5 32 10 7.7 7.5 10 18.5 10 30s-2.3 22.5-10 30c-7.7 7.5-21.6 10-32 10s-24.3-2.5-32-10c-7.7-7.5-10-18.5-10-30s2.3-22.5 10-30c7.7-7.5-21.6-10-32-10Z" 
                        stroke="currentColor" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        style={{ strokeDasharray: "300", strokeDashoffset: "0", opacity: 0.8 }}
                    />
                    {/* Hand-drawn Wobbly Cross */}
                    <path 
                        className="map-target-x-1" 
                        d="M32 36c4 4 12 11 18 14s14 10 18 14" 
                        stroke="currentColor" 
                        strokeWidth="5" 
                        strokeLinecap="round" 
                        style={{ opacity: 0.9 }}
                    />
                    <path 
                        className="map-target-x-2" 
                        d="M68 34c-5 5-13 12-18 16s-12 11-16 16" 
                        stroke="currentColor" 
                        strokeWidth="5" 
                        strokeLinecap="round" 
                        style={{ opacity: 0.9 }}
                    />
                </svg>
                <div className="mt-2 bg-mafia-gold text-mafia-black font-serif italic text-[10px] font-black uppercase px-3 py-0.5 tracking-[0.2em] shadow-lg">CÍLOVÁ OBLAST</div>
            </div>

            {/* Map HUD Overlay */}
            <div className="absolute bottom-4 left-4 z-20 bg-mafia-black/80 backdrop-blur-md px-4 py-2 border border-mafia-gold/30 flex items-center gap-3">
                <Info size={14} className="text-mafia-gold" />
                <span className="text-[11px] font-serif italic uppercase tracking-[0.3em] text-mafia-gold/90">Označené území</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
