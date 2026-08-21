"use client";

import { useState, useRef } from "react";
import { MapPin, Car, Bus, Mail, Phone, Info, Copy } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { trackEvent } from "../utils/analytics";
import { playSound } from "../utils/audio";
import { motion, AnimatePresence } from "framer-motion";
import { GameFragment } from "./GameFragment";

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
            
            <div className="flex flex-wrap justify-center gap-4 pt-4 w-full">
                <a 
                  href="https://maps.google.com/?q=Sadová+1383,+686+05+Uherské+Hradiště"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playContactSound("papir.mp3")}
                  className="flex items-center gap-2 px-6 py-3 bg-mafia-gold/10 border border-mafia-gold/30 hover:bg-mafia-gold hover:text-mafia-black transition-all text-xs font-bold uppercase tracking-widest group"
                >
                  <MapPin size={14} className="text-mafia-gold group-hover:text-mafia-black transition-colors" />
                  <span className="text-smoke-white group-hover:text-mafia-black">GOOGLE MAPS</span>
                </a>
                
                <a 
                  href="https://mapy.cz/zakladni?q=Sadová%201383%2C%20Uherské%20Hradiště"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playContactSound("papir.mp3")}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-mafia-gold transition-all text-xs font-bold uppercase tracking-widest group"
                >
                  <MapPin size={14} className="text-mafia-gold group-hover:scale-110 transition-transform" />
                  <span className="text-smoke-white">MAPY.CZ</span>
                </a>

                <a 
                  href="https://waze.com/ul?q=Sadová%201383,%20Uherské%20Hradiště"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playContactSound("papir.mp3")}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-mafia-gold transition-all text-xs font-bold uppercase tracking-widest group"
                >
                  <Car size={14} className="text-mafia-gold group-hover:scale-110 transition-transform" />
                  <span className="text-smoke-white">WAZE</span>
                </a>
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
            <div className="grid gap-4 w-full max-w-sm">
                <a href="tel:+420577544073" 
                   onClick={() => { 
                     try { trackEvent("cta_contact_tel"); playContactSound("telefon.mp3"); } catch(e) {}
                   }}
                   className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:border-mafia-gold transition-all duration-300 select-none cursor-pointer">
                    <div className="w-10 h-10 border border-mafia-gold/20 flex items-center justify-center group-hover:bg-mafia-gold transition-colors">
                        <Phone size={18} className="text-mafia-gold group-hover:text-mafia-black" />
                    </div>
                    <span className="text-lg md:text-xl font-mono text-smoke-white pointer-events-none">+420 577 544 073</span>
                </a>
                <a href="mailto:mmbarber@mmbarber.cz" 
                   onClick={() => { 
                     try { trackEvent("cta_contact_mail"); playContactSound("telefon.mp3"); } catch(e) {}
                   }}
                   className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:border-mafia-gold transition-all duration-300">
                    <div className="w-10 h-10 border border-mafia-gold/20 flex items-center justify-center group-hover:bg-mafia-gold transition-colors">
                        <Mail size={18} className="text-mafia-gold group-hover:text-mafia-black" />
                    </div>
                    <span className="text-lg md:text-xl font-mono text-smoke-white break-all allow-copy">mmbarber@mmbarber.cz</span>
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
            
            <div className="space-y-4 font-sans text-smoke-white/80 leading-relaxed border-mafia-gold border-l-4 md:border-l-4 pl-6 py-2">
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

      <GameFragment id="contact_frag_1" className="top-32 left-8 md:left-32" size={30} delay={500} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-heading font-black text-smoke-white mb-4 tracking-[0.2em] uppercase">
            {t?.contact?.title || (lang === 'cs' ? 'KONTAKT' : 'CONTACT')}
          </h2>
          <div className="section-underline w-16 md:w-24 h-1 bg-gradient-to-r from-mafia-gold/20 via-mafia-gold to-mafia-gold/20 mx-auto mb-6 shadow-[0_0_20px_var(--color-mafia-gold-glow)]" style={{ background: 'linear-gradient(to right, transparent, var(--user-accent-color), transparent)', boxShadow: '0 0 20px var(--user-glow-color)' }}></div>
          <p className="text-smoke-white/40 font-mono tracking-[0.4em] uppercase text-xs md:text-sm">{t?.contact?.subtitle}</p>
        </div>

        <div className="flex flex-col items-center gap-12 w-full max-w-3xl mx-auto">
          
          {/* INTERACTIVE ICON GRID & DETAIL VIEWER */}
          <div className="flex flex-col gap-8 md:gap-12 w-full">
            
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
                            ? "bg-white/5 border-mafia-gold shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.3)]" 
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
            <div className="mt-8 md:mt-4 p-8 md:p-12 bg-mafia-dark/30 border-2 border-mafia-gold/10 relative min-h-[380px] flex items-center overflow-hidden">
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

        </div>
      </div>
    </section>
  );
}
