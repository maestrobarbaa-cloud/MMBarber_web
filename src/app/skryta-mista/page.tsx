"use client";

import { motion } from "framer-motion";
import { MapPin, Target, ExternalLink, Users, ChevronLeft, Star } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { trackEvent } from "@/utils/analytics";
import Link from "next/link";
import Image from "@/components/OptimizedImage";
import TacticalClickEffects from "@/components/TacticalClickEffects";
import { Footer } from "@/components/Footer";
import { BottomTerminalReveal } from "@/components/BottomTerminalReveal";
import { HiddenSEOArchive } from "@/components/HiddenSEOArchive";

export default function HiddenPlacesPage() {
  const { t, lang } = useTranslation();

  const handleNavigate = (e: React.MouseEvent, destination: string, trackName: string) => {
    e.preventDefault();
    trackEvent("hidden_place_navigate", { place: trackName });
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          window.open(`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(destination)}`, '_blank');
        },
        () => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`, '_blank');
        }
      );
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-mafia-black text-smoke-white pt-24 md:pt-32 relative overflow-hidden">
      <TacticalClickEffects />
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-mafia-gold/5 via-transparent to-transparent opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
        {/* BACK NAVIGATION */}
        <div className="mb-12">
            <Link 
              href="/#services" 
              className="inline-flex items-center gap-2 text-mafia-gold/50 hover:text-mafia-gold transition-colors font-mono text-[10px] md:text-xs uppercase tracking-widest group"
              onClick={() => trackEvent("hidden_places_back_click")}
            >
               <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
               {lang === 'cs' ? "Zpět k filtrům" : "Back to filters"}
            </Link>
            <div className="flex items-center gap-4 mt-8 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.5em] text-mafia-gold/30">
               <div className="w-1 h-1 bg-mafia-gold/30 rounded-full"></div>
               <span className="text-mafia-gold/40">VIP PARTNER SÍŤ</span>
            </div>
        </div>

        {/* MAIN TITLE SECTION */}
        <div className="text-center mb-24 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block relative px-12 py-4 mb-4"
          >
             <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-mafia-gold/30"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-mafia-gold/30"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-mafia-gold/30"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-mafia-gold/30"></div>
             
             <div className="flex flex-col items-center">
                 <span className="text-mafia-gold/40 font-mono text-[9px] md:text-[10px] uppercase tracking-widest md:tracking-[1em] mb-4 ml-0 md:ml-[1em]">
                   {lang === 'cs' ? "MM BARBER FAMILY" : "MM BARBER FAMILY"}
                 </span>
                 <h1 className="text-4xl md:text-8xl lg:text-9xl font-heading font-black text-white italic tracking-tighter leading-[0.85] mb-2 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    {lang === 'cs' ? (
                      <>SKRYTÁ <span className="text-mafia-gold">MÍSTA</span></>
                    ) : (
                      <>HIDDEN <span className="text-mafia-gold">PLACES</span></>
                    )}
                 </h1>
                 
                 <h2 className="text-xl md:text-4xl font-heading font-black text-white/20 uppercase tracking-[0.2em] md:tracking-[0.4em] italic leading-none">
                    {lang === 'cs' ? "MĚSTA" : "CITY"}
                 </h2>
             </div>
          </motion.div>
        </div>

        {/* FEATURE CARD: KOMFORT LOUNGE */}
        <section className="relative w-full mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-mafia-gold/20 bg-mafia-dark/40 backdrop-blur-md shadow-2xl relative overflow-hidden rounded-xl group/all">
            
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
               className="lg:col-span-12 xl:col-span-7 relative h-[350px] md:h-[450px] overflow-hidden group bg-black/60 shadow-2xl"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2613.9225537201914!2d17.4540922753308!3d49.069106785856086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47131531393617db%3A0xde68010641623016!2sKomfort%20Lounge%20Bar!5e0!3m2!1scs!2scz!4v1776191505364!5m2!1scs!2scz"
                width="100%" height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(0.8) contrast(1.2) brightness(0.8)' }} 
                allowFullScreen={false} loading="lazy"
              ></iframe>
            </motion.div>

            <div className="lg:col-span-12 xl:col-span-5 p-8 md:p-12 flex flex-col justify-center relative bg-mafia-black/80 backdrop-blur-xl border-l border-mafia-gold/10 overflow-hidden">
               <motion.div 
                 initial={{ opacity: 0, x: 15 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="relative z-10"
               >
                  <div className="flex items-center gap-3 mb-4 text-mafia-gold/50 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em]">
                     <Star size={12} className="text-mafia-gold" />
                     <span>VIP PARTNER</span>
                     <div className="h-px flex-1 bg-mafia-gold/10"></div>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-heading font-black text-white uppercase italic tracking-tighter leading-none mb-3">
                    {t.others.hiddenPlaces.name}
                  </h2>
                  
                  <div className="flex items-start gap-4 text-smoke-white/60 mb-8 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.1em]">
                     <MapPin size={14} className="text-mafia-gold mt-0.5 shrink-0" />
                     <span className="border-b border-mafia-gold/20 pb-0.5">
                        {t.others.hiddenPlaces.address}
                     </span>
                  </div>

                  <div className="relative mb-8 text-smoke-white/70 leading-relaxed font-sans text-sm md:text-base border-l border-mafia-gold/30 pl-4">
                     {t.others.hiddenPlaces.description}
                  </div>

                  <a 
                    href="#"
                    onClick={(e) => handleNavigate(e, "Komfort Lounge Bar, L. Janáčka 180, 686 01 Uherské Hradiště", "Komfort Lounge")}
                    className="relative block w-max group/btn overflow-hidden rounded"
                  >
                    <div className="absolute inset-0 bg-mafia-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-[0.7,0,0.3,1]"></div>
                    <div className="relative z-10 px-8 py-4 border border-mafia-gold/50 group-hover/btn:border-mafia-gold flex items-center justify-center gap-3 text-mafia-gold group-hover/btn:text-black font-black uppercase tracking-[0.2em] transition-all duration-500 text-xs">
                      {lang === 'cs' ? "NAVIGOVAT K CÍLI" : "NAVIGATE TO TARGET"}
                      <ExternalLink size={14} />
                    </div>
                  </a>
               </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURE CARD: O KOLECKO VIC */}
        <section className="relative w-full mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-mafia-gold/20 bg-mafia-dark/40 backdrop-blur-md shadow-2xl relative overflow-hidden rounded-xl group/all">
            
            <div className="lg:col-span-12 xl:col-span-5 p-8 md:p-12 flex flex-col justify-center relative bg-mafia-black/80 backdrop-blur-xl border-r border-mafia-gold/10 overflow-hidden order-2 xl:order-1">
               <motion.div 
                 initial={{ opacity: 0, x: -15 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="relative z-10"
               >
                  <div className="flex items-center gap-3 mb-4 text-mafia-gold/50 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em]">
                     <Star size={12} className="text-mafia-gold" />
                     <span>VIP PARTNER</span>
                     <div className="h-px flex-1 bg-mafia-gold/10"></div>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-heading font-black text-white uppercase italic tracking-tighter leading-none mb-3">
                    O Kolečko Víc
                  </h2>
                  
                  <div className="flex items-start gap-4 text-smoke-white/60 mb-8 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.1em]">
                     <MapPin size={14} className="text-mafia-gold mt-0.5 shrink-0" />
                     <span className="border-b border-mafia-gold/20 pb-0.5">
                        {lang === 'cs' ? 'Jiřího z Poděbrad, 686 01 Uherské Hradiště' : 'Jiřího z Poděbrad, 686 01 Uherské Hradiště'}
                     </span>
                  </div>

                  <div className="relative mb-8 text-smoke-white/70 leading-relaxed font-sans text-sm md:text-base border-l border-mafia-gold/30 pl-4">
                     {lang === 'cs' 
                       ? 'Sezóna v plném proudu, servisy jedou na maximum. Pro fanoušky pohybu a cykloservisu je tu místo, kde se starají o vaši výbavu se stejnou vášní, s jakou my v MMBARBER stříháme vlasy.' 
                       : 'Season in full swing, service running at maximum. For fans of movement and bike service, this is the place where they take care of your equipment with the same passion with which we cut hair.'}
                  </div>

                  <a 
                    href="#"
                    onClick={(e) => handleNavigate(e, "O Kolečko Víc, Jiřího z Poděbrad 123, 686 01 Uherské Hradiště", "O Kolecko Vic")}
                    className="relative block w-max group/btn overflow-hidden rounded"
                  >
                    <div className="absolute inset-0 bg-mafia-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-[0.7,0,0.3,1]"></div>
                    <div className="relative z-10 px-8 py-4 border border-mafia-gold/50 group-hover/btn:border-mafia-gold flex items-center justify-center gap-3 text-mafia-gold group-hover/btn:text-black font-black uppercase tracking-[0.2em] transition-all duration-500 text-xs">
                      {lang === 'cs' ? "NAVIGOVAT K CÍLI" : "NAVIGATE TO TARGET"}
                      <ExternalLink size={14} />
                    </div>
                  </a>
               </motion.div>
            </div>

            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
               className="lg:col-span-12 xl:col-span-7 relative h-[350px] md:h-[450px] overflow-hidden group bg-black/60 shadow-2xl order-1 xl:order-2 flex items-center justify-center p-12"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-mafia-gold/5 to-transparent"></div>
              <Image 
                src="/loga_partneri/okoleckovic.png" 
                alt="O Kolečko Víc Logo" 
                width={500} 
                height={500} 
                className="w-auto h-full max-h-[250px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 z-10 filter drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]"
              />
            </motion.div>
          </div>
        </section>

        {/* FAMILY SLOTS */}
        <section className="max-w-5xl mx-auto">
           <div className="text-center mb-16">
              <div className="inline-flex flex-col items-center">
                 <h4 className="text-mafia-gold font-heading font-black text-2xl md:text-4xl uppercase tracking-[0.2em] mb-4 italic">
                   {t.others.hiddenPlaces.slotsTitle}
                 </h4>
                 <div className="w-16 h-0.5 bg-mafia-gold mb-6"></div>
                 <p className="text-white/40 text-[9px] md:text-xs uppercase tracking-[0.3em] italic font-sans max-w-2xl leading-relaxed">
                   {lang === 'cs' 
                     ? "PROSTOR POUZE PRO ČLENY RODINY. PRÉMIOVÝ STATUS." 
                     : "FAMILY MEMBER ACCESS. PREMIUM STATUS."}
                 </p>
              </div>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-40">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="group/slot relative"
                  onClick={() => trackEvent("hidden_place_slot_click", { slot: i })}
                >
                  <div className="aspect-square border border-white/10 bg-black/40 flex flex-col items-center justify-center gap-4 transition-all duration-500 cursor-pointer overflow-hidden hover:border-mafia-gold/50 shadow-xl rounded-xl relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[6rem] md:text-[8rem] font-black text-white/[0.02] select-none group-hover/slot:text-mafia-gold/[0.05] transition-all duration-500 pointer-events-none">{i}</div>
                    
                    <Users size={28} className="text-mafia-gold/30 group-hover/slot:text-mafia-gold transition-all duration-500 z-10" />
                    <div className="flex flex-col items-center gap-1 z-10 transition-transform duration-500">
                       <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] group-hover/slot:text-mafia-gold/80">{lang === 'cs' ? "MÍSTO" : "SLOT"} {i}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
           </div>

           <div className="text-center pb-32 border-t border-white/10 pt-24">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-block relative"
              >
                 <Image src="/logo.png" alt="MMBarber" width={80} height={80} className="mx-auto grayscale opacity-20 hover:opacity-100 transition-all duration-500" />
                 <div className="mt-8 text-mafia-gold/30 font-mono text-[9px] uppercase tracking-[0.5em] font-bold transition-all duration-500 hover:text-mafia-gold">
                    MM_BARBER_SÍŤ
                 </div>
              </motion.div>
           </div>
        </section>
      </div>

      <Footer />

      <BottomTerminalReveal thresholdMultiplier={1.5}>
        {(level) => (
          <>
            {level >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <HiddenSEOArchive />
              </motion.div>
            )}
          </>
        )}
      </BottomTerminalReveal>
    </div>
  );
}
