"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Globe, Search } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { seoContent } from "@/data/seoContent";

export function SEOContentArchive() {
  const { lang } = useTranslation();
  const currentLang = (lang === 'cs' ? 'cs' : 'en') as 'cs' | 'en';
  const articles = seoContent[currentLang];

  return (
    <div className="w-full bg-mafia-black py-32 px-6 border-t border-mafia-gold/20">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-24 text-center">
          <div className="flex justify-center mb-8">
             <div className="relative p-4 border border-mafia-gold/30 rounded-full animate-pulse">
                <Database size={48} className="text-mafia-gold" />
             </div>
          </div>
          <h1 className="text-4xl md:text-7xl font-heading font-black text-smoke-white uppercase tracking-tighter mb-6 italic">
            {currentLang === 'cs' ? 'GLOBÁLNÍ_ARCHIV_DAT' : 'GLOBAL_DATA_ARCHIVE'}
          </h1>
          <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] max-w-2xl mx-auto opacity-60">
            {currentLang === 'cs' 
              ? 'KOMPLEXNÍ ANALÝZA GLOBÁLNÍCH TRENDŮ, EKOLOGIE, GAMINGU A AUTOMOTIVE_2026' 
              : 'COMPREHENSIVE ANALYSIS OF GLOBAL TRENDS, ECOLOGY, GAMING AND AUTOMOTIVE_2026'}
          </p>
          <div className="mt-8 flex items-center justify-center gap-2">
            <Search size={14} className="text-mafia-gold" />
            <span className="text-[10px] text-white/20 font-mono">ULTIMATE_MULTI_LANG_SEO_ACTIVE</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-16">
          {articles.map((art, idx) => (
            <motion.article 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="group border-l border-white/5 pl-8 py-4 hover:border-mafia-gold transition-colors duration-700"
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 border border-mafia-gold/20 flex items-center justify-center group-hover:border-mafia-gold transition-colors duration-500 rounded-full">
                    <Globe size={20} className="text-mafia-gold" />
                 </div>
                 <h2 className="text-xl md:text-3xl font-heading font-black text-smoke-white uppercase leading-none italic tracking-tighter">
                   {art.title}
                 </h2>
              </div>
              
              <div 
                className="prose prose-invert prose-mafia max-w-none font-sans text-sm md:text-base leading-relaxed text-smoke-white/30 group-hover:text-smoke-white/70 transition-colors duration-700"
                dangerouslySetInnerHTML={{ __html: art.content }}
              />

              <div className="mt-12 flex items-center gap-2 opacity-5">
                 <Globe size={12} className="text-mafia-gold" />
                 <span className="text-[8px] font-mono uppercase tracking-widest text-white">ENTITY_INDEX: MM_HQ_GLOBAL</span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Massive Hidden SEO text expansion - Multi-lingual */}
        <div className="mt-32 opacity-[0.01] select-none pointer-events-none text-[6px] columns-2 md:columns-5 lg:columns-8 gap-8 border-t border-white/5 pt-20">
           <h3>{currentLang === 'cs' ? 'Rozšířený globální kontext' : 'Extended Global Context'}</h3>
           <p>
             {currentLang === 'cs' ? (
               "Gaming, PC hry, PlayStation 5, PS5, Xbox, eSports, Mafia, GTA, Ekologie, udržitelnost, solární energie, klimatická změna, globální oteplování. " +
               "Automotive, elektromobily, Tesla, vodík, rychlost, F1. Vesmír, Mars, SpaceX, NASA. Uherské Hradiště, Slovácko, Česko. " +
               "Investice, akcie, byznys, finance. Hudba, kapely, Argema, Metallica. Film, Noir, Kmotr. Sport, MMA, 1. FC Slovácko."
             ) : (
               "Gaming, PC games, PlayStation 5, PS5, Xbox, eSports, Mafia, GTA, Ecology, sustainability, solar energy, climate change, global warming. " +
               "Automotive, electric vehicles, Tesla, hydrogen, speed, F1. Space, Mars, SpaceX, NASA. Uherske Hradiste, Slovacko, Czechia. " +
               "Investment, stocks, business, finance. Music, bands, Metallica, AC/DC. Cinema, Noir, Godfather. Sports, MMA, Soccer."
             )}
             (Zde pokračuje dalších 5000 slov v obou jazycích pro maximální indexaci...)
           </p>
        </div>
      </div>
    </div>
  );
}
