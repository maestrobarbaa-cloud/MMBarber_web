"use client";

import { motion } from "framer-motion";
import { MapPin, Target, ExternalLink, Users, ChevronLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { trackEvent } from "@/utils/analytics";
import Link from "next/link";
import Image from "next/image";
import TacticalClickEffects from "@/components/TacticalClickEffects";

export default function HiddenPlacesPage() {
  const { t, lang } = useTranslation();

  return (
    <div className="min-h-screen bg-mafia-black text-smoke-white pt-24 md:pt-32 relative overflow-hidden">
      <TacticalClickEffects />
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-mafia-gold/5 via-transparent to-transparent opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
        
        {/* Animated Scanning Line */}
        <motion.div 
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-px bg-mafia-gold/10 z-0"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
        {/* BACK NAVIGATION */}
        <div className="mb-12">
            <Link 
              href="/#services" 
              className="inline-flex items-center gap-2 text-mafia-gold/50 hover:text-mafia-gold transition-colors font-mono text-xs uppercase tracking-widest group"
              onClick={() => trackEvent("hidden_places_back_click")}
            >
               <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
               {lang === 'cs' ? "Zpět k filtrům" : "Back to filters"}
            </Link>
            <div className="flex items-center gap-4 mt-8 font-mono text-[9px] uppercase tracking-[0.5em] text-mafia-gold/30">
               <div className="w-1 h-1 bg-mafia-gold/30 rounded-full"></div>
               <span className="text-mafia-gold/40">SYSTÉM: MM_OS_ZABEZPEČENO</span>
            </div>
        </div>

        {/* MAIN TITLE SECTION */}
        <div className="text-center mb-16 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block relative px-12 py-4 mb-4"
          >
             <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-mafia-gold/30"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-mafia-gold/30"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-mafia-gold/30"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-mafia-gold/30"></div>
             
             <div className="flex flex-col items-center">
                <span className="text-mafia-gold/40 font-mono text-[10px] uppercase tracking-[1em] mb-4 ml-[1em]">
                  {lang === 'cs' ? "ZABEZPEČENÝ_PŘÍSTUP_NAVÁZÁN" : "SECURE_ACCESS_ESTABLISHED"}
                </span>
                
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-white italic tracking-tighter leading-[0.85] mb-2 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                   {lang === 'cs' ? (
                     <>SKRYTÁ <span className="text-mafia-gold">MÍSTA</span></>
                   ) : (
                     <>HIDDEN <span className="text-mafia-gold">PLACES</span></>
                   )}
                </h1>
                
                <h2 className="text-2xl md:text-4xl font-heading font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">
                   {lang === 'cs' ? "MĚSTA" : "CITY"}
                </h2>
             </div>
          </motion.div>
        </div>

        {/* FEATURE CARD: KOMFORT LOUNGE + TACTICAL MAP */}
        <section className="relative w-full mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-mafia-gold/20 bg-mafia-dark/20 backdrop-blur-md shadow-2xl relative overflow-hidden group/all">
            
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
               className="lg:col-span-12 xl:col-span-7 relative h-[350px] md:h-[450px] overflow-hidden group bg-mafia-dark/40 shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-12 h-[1px] bg-gradient-to-r from-mafia-gold to-transparent z-40"></div>
              <div className="absolute top-0 left-0 w-[1px] h-12 bg-gradient-to-b from-mafia-gold to-transparent z-40"></div>
              <div className="absolute bottom-0 right-0 w-12 h-[1px] bg-gradient-to-l from-mafia-gold to-transparent z-40"></div>
              <div className="absolute bottom-0 right-0 w-[1px] h-12 bg-gradient-to-t from-mafia-gold to-transparent z-40"></div>

              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2613.9225537201914!2d17.4540922753308!3d49.069106785856086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47131531393617db%3A0xde68010641623016!2sKomfort%20Lounge%20Bar!5e0!3m2!1scs!2scz!4v1776191505364!5m2!1scs!2scz"
                width="100%" height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(0.8) contrast(1.2) brightness(0.8)' }} 
                allowFullScreen={false} loading="lazy"
              ></iframe>

              <div className="absolute inset-0 pointer-events-none border-[6px] border-black/80 z-20"></div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
                 <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -inset-6 border border-mafia-gold/40 rounded-full"
                    />
                    <Target size={24} className="text-mafia-gold" />
                 </div>
              </div>

              <div className="absolute top-3 left-3 p-1.5 font-mono text-[7px] text-mafia-gold/50 bg-black/80 border border-mafia-gold/10 backdrop-blur-md hidden md:block z-30 tracking-tight">
                 {lang === 'cs' ? "LOKACE" : "LOCATION"}: KOMFORT_LOUNGE_BAR
              </div>
            </motion.div>

            <div className="lg:col-span-12 xl:col-span-5 p-6 md:p-8 flex flex-col justify-center relative bg-mafia-black/60 backdrop-blur-xl border-l border-mafia-gold/10 overflow-hidden">
               <div className="absolute top-0 right-0 w-12 h-[1px] bg-gradient-to-l from-mafia-gold to-transparent"></div>
               <div className="absolute top-0 right-0 w-[1px] h-12 bg-gradient-to-b from-mafia-gold to-transparent"></div>

               <motion.div 
                 initial={{ opacity: 0, x: 15 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="relative z-10"
               >
                  <div className="flex items-center gap-3 mb-3 text-mafia-gold/30 font-mono text-[8px] uppercase tracking-[0.2em]">
                     <span>STATUS: {lang === 'cs' ? "AKTIVNÍ" : "ACTIVE"}</span>
                     <div className="h-px flex-1 bg-mafia-gold/10"></div>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase italic tracking-tighter leading-none mb-3">
                    {t.others.hiddenPlaces.name}
                  </h2>
                  
                  <div className="flex items-start gap-4 text-smoke-white/40 mb-5 font-mono text-[9px] uppercase tracking-[0.2em]">
                     <MapPin size={12} className="text-mafia-red mt-0.5 shrink-0" />
                     <span className="border-b border-mafia-gold/20 pb-0.5">
                        {t.others.hiddenPlaces.address}
                     </span>
                  </div>

                  <div className="relative mb-6 bg-white/[0.01] border-l border-mafia-gold/30 p-4 italic text-smoke-white/60 leading-relaxed font-sans text-sm md:text-base">
                     {t.others.hiddenPlaces.description}
                  </div>

                  <div className="relative mb-6 border border-mafia-gold/10 bg-black/40 backdrop-blur-xl p-4 flex items-center gap-5">
                    <Target size={18} className="text-mafia-gold/50" />
                    <div className="flex-1">
                      <div className="text-[8px] font-mono text-mafia-gold/40 uppercase tracking-[0.2em]">
                        {lang === 'cs' ? "OPERATIVNÍ CÍL" : "OPERATIONAL GOAL"}
                      </div>
                      <div className="text-lg font-black text-white italic uppercase tracking-tighter">
                        {lang === 'cs' ? "VODNÍ DÝMKA A NÁPOJE" : "SHISHA & DRINKS"}
                      </div>
                    </div>
                  </div>

                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=Komfort+Lounge+Bar,+L.+Jan%C3%A1%C4%8Dka+180,+686+01+Uhersk%C3%A9+Hradi%C5%A1te+1"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent("hidden_place_navigate", { place: "Komfort Lounge" })}
                    className="relative block group/btn overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-mafia-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-[0.7,0,0.3,1]"></div>
                    <div className="relative z-10 py-4 border border-mafia-gold/50 group-hover/btn:border-mafia-gold flex items-center justify-center gap-3 text-mafia-gold group-hover/btn:text-black font-black uppercase tracking-[0.3em] transition-all duration-500 text-xs">
                      {lang === 'cs' ? "NAVIGOVAT K CÍLI" : "NAVIGATE TO TARGET"}
                      <ExternalLink size={14} />
                    </div>
                  </a>
               </motion.div>
            </div>
          </div>
        </section>

        {/* DEPLOYMENT CHART / SLOTS */}
        <section className="max-w-5xl mx-auto">
           <div className="text-center mb-24">
              <div className="inline-flex flex-col items-center">
                 <h4 className="text-mafia-gold font-heading font-black text-3xl md:text-5xl uppercase tracking-[0.3em] mb-4 italic">
                   {t.others.hiddenPlaces.slotsTitle}
                 </h4>
                 <div className="w-24 h-1 bg-mafia-gold mb-6 shadow-[0_0_15px_var(--user-glow-color)]"></div>
                 <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-[0.5em] italic font-sans max-w-2xl leading-relaxed">
                   {lang === 'cs' 
                     ? "PŘÍSTUP PRO ČLENY RODINY. PRIORITNÍ STATUS." 
                     : "FAMILY MEMBER ACCESS. PRIORITY STATUS."}
                 </p>
              </div>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-40">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="group/slot relative"
                  onClick={() => trackEvent("hidden_place_slot_click", { slot: i })}
                >
                  <div className="aspect-square border border-white/5 bg-gradient-to-br from-white/5 to-transparent flex flex-col items-center justify-center gap-6 transition-all duration-700 cursor-pointer overflow-hidden group-hover/slot:border-mafia-gold/50 shadow-2xl relative">
                    
                    <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-mafia-gold/20 group-hover/slot:border-mafia-gold transition-colors duration-500"></div>
                    <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-mafia-gold/20 group-hover/slot:border-mafia-gold transition-colors duration-500"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-mafia-gold/20 group-hover/slot:border-mafia-gold transition-colors duration-500"></div>
                    <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-mafia-gold/20 group-hover/slot:border-mafia-gold transition-colors duration-500"></div>
                    
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] font-black text-white/[0.02] select-none group-hover/slot:text-mafia-gold/[0.04] transition-all duration-700 pointer-events-none">{i}</div>
                    
                    <Users size={48} className="text-mafia-gold/30 group-hover/slot:text-mafia-gold group-hover/slot:scale-125 transition-all duration-700 z-10" />
                    <div className="flex flex-col items-center gap-1 z-10 transition-transform duration-700 group-hover/slot:translate-y-2">
                       <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] group-hover/slot:text-mafia-gold/60">{lang === 'cs' ? "MÍSTO" : "SLOT"}_{i}</span>
                       <div className="w-8 h-0.5 bg-mafia-gold/10 group-hover/slot:w-16 group-hover/slot:bg-mafia-gold/40 transition-all duration-700"></div>
                    </div>
                    
                    <div className="absolute inset-0 bg-mafia-gold opacity-0 group-hover/slot:opacity-[0.05] transition-opacity duration-700"></div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-all duration-500 transform translate-y-4 group-hover/slot:translate-y-12 pointer-events-none">
                     <div className="bg-mafia-gold text-black px-8 py-3 text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_10px_30px_rgba(0,0,0,0.5)] whitespace-nowrap">
                        {t.others.hiddenPlaces.cta}
                     </div>
                  </div>
                </motion.div>
              ))}
           </div>

           <div className="text-center pb-32 border-t border-white/5 pt-32">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-block relative"
              >
                 <Image src="/logo.png" alt="MMBarber" width={100} height={100} className="mx-auto grayscale opacity-10 hover:opacity-50 transition-all duration-1000 filter invert hover:invert-0" />
                 <div className="mt-12 text-mafia-gold/20 font-mono text-[9px] uppercase tracking-[1.5em] font-black transition-all duration-500 hover:text-mafia-gold/60 hover:tracking-[1.8em]">
                    {lang === 'cs' ? "MM_NET_CENTRÁLNÍ_SÍŤ" : "MM_NET_CENTRAL_NETWORK"}
                 </div>
              </motion.div>
           </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}
