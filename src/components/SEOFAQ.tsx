"use client";

import React from "react";
import { useTranslation } from "../hooks/useTranslation";

export function SEOFAQ() {
  const { t } = useTranslation();

  if (!t.faqSection) return null;

  return (
    <section id="seo-faq-layer" className="w-full py-16 px-6 bg-transparent border-t border-white/5">
      <div className="max-w-7xl mx-auto text-left opacity-[0.02] blur-[2.5px] hover:opacity-100 hover:blur-none transition-all duration-1000 select-none hover:select-text">
        <h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
          <span className="w-2 h-2 bg-mafia-gold animate-pulse"></span>
          {t.faqSection.title}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
          {t.faqSection.items.map((item: { q: string, a: string }, index: number) => (
            <div key={index} className="space-y-2 border-l border-white/5 pl-4 hover:border-mafia-gold/30 transition-colors duration-500">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">{item.q}</p>
              <p className="text-[10px] font-mono text-smoke-white/40 uppercase leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-4 border-t border-white/5 text-[9px] font-mono text-white/10 uppercase tracking-[0.2em]">
          MMBARBER SEO DATA LAYER // AUTHENTIC CRAFT // UH-MARATICE
        </div>
      </div>
    </section>
  );
}
