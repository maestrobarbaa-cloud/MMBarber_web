"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";

export function GlobalIntelligenceArchive() {
  const { t } = useTranslation();
  
  // Guard for missing translations
  if (!t.intelligenceArchive) return null;

  const archive = t.intelligenceArchive;
  const categories = Object.values(archive.categories);

  return (
    <section className="w-full py-20 bg-black/40 border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 flex items-center gap-4 opacity-30 group hover:opacity-100 transition-opacity duration-1000">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-mafia-gold" />
          <h2 className="text-[10px] font-mono tracking-[0.5em] uppercase text-mafia-gold">
            {archive.title}
          </h2>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-mafia-gold" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {categories.map((cat: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0.05, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: idx * 0.1 }}
              className="space-y-4 group"
            >
              <h3 className="text-white/20 group-hover:text-mafia-gold transition-colors duration-700 text-[11px] font-mono font-black tracking-widest border-l-2 border-white/5 group-hover:border-mafia-gold/50 pl-4 uppercase">
                {cat.title}
              </h3>
              <p className="text-[9px] leading-relaxed font-sans text-white/5 group-hover:text-white/30 transition-colors duration-1000 text-justify">
                {cat.text.replace("{keywords}", cat.keywords)}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 opacity-[0.01] pointer-events-none select-none text-[8px] font-mono text-justify leading-tight">
          {archive.hiddenDump}
        </div>
      </div>
    </section>
  );
}
