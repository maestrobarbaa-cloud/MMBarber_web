"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  ArrowLeft, 
  ChevronRight 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { BottomTerminalReveal } from "@/components/BottomTerminalReveal";
import { HousingSEOArchive } from "@/components/HousingSEOArchive";

export default function HousingEstatePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black text-smoke-white overflow-x-hidden relative selection:bg-mafia-gold selection:text-mafia-black">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.1)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,160,89,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,160,89,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="group flex items-center gap-4 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-xs tracking-[0.4em] uppercase"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          {t.sidliste.return}
        </Link>
        <div className="flex flex-col items-end">
            <div className="w-12 h-12 border border-mafia-gold/20 flex items-center justify-center overflow-hidden p-1">
                <Image src="/logo.png" alt="MM" width={40} height={40} className="w-full h-full object-contain opacity-80" />
            </div>
            <span className="text-[8px] font-mono text-mafia-gold/50 tracking-[0.5em] uppercase mt-2">Housing_Archive_v3.4.4</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32">
        
        <div className="flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center w-full"
          >
            <div className="text-mafia-gold font-mono text-[10px] uppercase tracking-[0.8em] mb-10 flex items-center gap-4">
               <div className="h-[1px] w-12 bg-mafia-gold/30"></div>
               {t.sidliste.sector}
               <div className="h-[1px] w-12 bg-mafia-gold/30"></div>
            </div>

            <h1 className="text-8xl md:text-[12rem] font-heading font-black uppercase tracking-tighter italic leading-none mb-16 drop-shadow-[0_20px_50px_rgba(0,0,0,1)]">
              {t.sidliste.title.slice(0, -4)}<span className="text-mafia-gold">{t.sidliste.title.slice(-4)}</span>
            </h1>
            
            <p className="text-3xl md:text-6xl font-heading text-smoke-white leading-tight uppercase tracking-tight mb-12 max-w-4xl">
              {t.sidliste.subtitle}
            </p>

            <div className="w-24 h-px bg-mafia-gold/40 mb-12"></div>

            <p className="text-xl md:text-2xl font-sans text-smoke-white/50 leading-relaxed italic max-w-2xl mb-24">
              {t.sidliste.description}
            </p>

            {/* CTA Section */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.5 }}
               className="w-full max-w-4xl p-12 md:p-20 border border-mafia-gold/20 bg-mafia-black/40 backdrop-blur-3xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-mafia-gold/5 blur-[120px] rounded-full group-hover:bg-mafia-gold/10 transition-colors duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-mafia-gold/5 blur-[120px] rounded-full group-hover:bg-mafia-gold/10 transition-colors duration-1000"></div>

                <div className="relative z-10 flex flex-col items-center">
                   <h2 className="text-4xl md:text-7xl font-heading font-black text-smoke-white uppercase tracking-tighter mb-8 italic">
                      {t.sidliste.ideaTitle}
                   </h2>
                   <p className="text-xl md:text-3xl font-sans text-mafia-gold/70 leading-relaxed mb-16 italic max-w-2xl">
                      {t.sidliste.ideaText}
                   </p>
                   
                   <motion.div className="flex flex-col items-center gap-12">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-8 group/cta"
                        onClick={() => window.location.href = 'mailto:mmbarber@mmbarber.cz'}
                      >
                         <div className="w-20 h-20 rounded-full border border-mafia-gold flex items-center justify-center bg-mafia-gold text-mafia-black shadow-[0_0_50px_rgba(197,160,89,0.3)] group-hover/cta:shadow-[0_0_70px_rgba(197,160,89,0.5)] transition-all duration-500">
                            <ChevronRight size={32} />
                         </div>
                         <span className="text-mafia-gold font-heading font-black text-2xl md:text-4xl uppercase tracking-[0.4em] group-hover/cta:text-smoke-white transition-colors">
                           {t.sidliste.proposeBtn}
                         </span>
                      </motion.button>

                      <div className="pt-12 border-t border-mafia-gold/10 w-full flex flex-col items-center gap-4">
                         <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.8em]">DIRECT PROTOCOL</span>
                         <a 
                           href="mailto:mmbarber@mmbarber.cz" 
                           className="text-2xl md:text-4xl font-heading font-black text-smoke-white hover:text-mafia-gold transition-all duration-300 tracking-[0.2em]"
                         >
                           mmbarber@mmbarber.cz
                         </a>
                      </div>
                   </motion.div>
                </div>
            </motion.div>
          </motion.div>

        </div>

      </main>

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
                <HousingSEOArchive />
              </motion.div>
            )}
          </>
        )}
      </BottomTerminalReveal>
    </div>
  );
}
