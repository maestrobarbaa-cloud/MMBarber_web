"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";
import { Building2, ArrowRight } from "lucide-react";
import Image from "next/image";

export function HousingEstate() {
  const { lang } = useTranslation();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-black">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Digital Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
        
        {/* Floating Blurs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-mafia-gold/5 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-mafia-gold/5 blur-[140px] rounded-full"
        />

        {/* Floating Particles */}
        {typeof window !== 'undefined' && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              opacity: Math.random() * 0.3 
            }}
            animate={{ 
              y: ["-5%", "5%"],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute w-1 h-1 bg-mafia-gold rounded-full"
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="relative group overflow-hidden border border-mafia-gold/20 bg-mafia-black/40 backdrop-blur-xl p-8 md:p-24 shadow-[0_0_80px_rgba(0,0,0,0.5)]"
        >
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-mafia-gold to-transparent"></div>
          <div className="absolute top-0 left-0 w-[1px] h-24 bg-gradient-to-b from-mafia-gold to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-24 h-[1px] bg-gradient-to-l from-mafia-gold to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-[1px] h-24 bg-gradient-to-t from-mafia-gold to-transparent"></div>

          <div className="flex flex-col items-center text-center max-w-4xl mx-auto relative">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <Building2 size={64} strokeWidth={0.5} className="text-mafia-gold" />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 border border-mafia-gold rounded-full"
                />
              </div>
            </motion.div>

            <div className="relative mb-6">
              <h2 className="text-6xl md:text-9xl font-heading font-black text-smoke-white uppercase tracking-tighter italic leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                {lang === 'cs' ? "Sídliště" : "Housing Estate"}
              </h2>
              <div className="absolute -inset-x-4 -bottom-2 h-[2px] bg-gradient-to-r from-transparent via-mafia-gold to-transparent opacity-40"></div>
            </div>
            
            <div className="text-[10px] md:text-sm font-mono text-mafia-gold uppercase tracking-[0.8em] mb-12 opacity-60">
              {lang === 'cs' ? "KOMUNITNÍ SEKTOR // MM BARBER" : "COMMUNITY SECTOR // MM BARBER"}
            </div>
            
            <div className="space-y-6 mb-16">
              <p className="text-2xl md:text-5xl font-heading text-smoke-white leading-tight uppercase tracking-tight">
                {lang === 'cs' 
                  ? "Přidej se k lidem, co chtějí víc než jen sedět na místě." 
                  : "Join the people who want more than just sitting around."}
              </p>

              <div className="w-16 h-px bg-mafia-gold/40 mx-auto"></div>

              <p className="text-lg md:text-2xl font-sans text-mafia-gold/50 leading-relaxed italic max-w-2xl px-6">
                {lang === 'cs'
                  ? "Bylo by fajn se zde domluvit na nějaké společné akci."
                  : "It would be great to arrange some joint events here."}
              </p>
            </div>

            <div className="flex flex-col items-center gap-10">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-6 group/btn"
                onClick={() => window.location.href = 'mailto:mmbarber@mmbarber.cz'}
              >
                <div className="w-24 h-24 rounded-full border border-mafia-gold/40 flex items-center justify-center group-hover/btn:bg-mafia-gold group-hover/btn:border-mafia-gold transition-all duration-500 shadow-[0_0_40px_rgba(197,160,89,0.1)] group-hover/btn:shadow-[0_0_60px_rgba(197,160,89,0.4)]">
                   <ArrowRight className="text-mafia-gold group-hover/btn:text-mafia-black transition-colors" size={32} />
                </div>
                <span className="text-mafia-gold font-heading font-black text-2xl uppercase tracking-[0.4em] group-hover/btn:text-smoke-white transition-colors">
                  {lang === 'cs' ? "NAVRHNOUT AKCI" : "PROPOSE EVENT"}
                </span>
              </motion.button>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-10 border-t border-mafia-gold/10 w-full flex flex-col items-center gap-3"
              >
                 <span className="text-[10px] font-mono text-smoke-white/20 uppercase tracking-[0.5em]">DIRECT CONNECTION</span>
                 <a 
                   href="mailto:mmbarber@mmbarber.cz" 
                   className="text-xl md:text-3xl font-heading font-black text-smoke-white hover:text-mafia-gold transition-all duration-300 tracking-widest border-b border-white/5 hover:border-mafia-gold pb-1"
                 >
                   mmbarber@mmbarber.cz
                 </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
