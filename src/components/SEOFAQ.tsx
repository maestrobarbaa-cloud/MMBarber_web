"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "../hooks/useTranslation";

export function SEOFAQ() {
  const { t } = useTranslation();

  if (!t.faqSection) return null;

  const getTargetUrl = (question: string, index: number) => {
    const q = question.toLowerCase();
    if (q.includes("najdu") || q.includes("located")) return "/barbershop-uherske-hradiste";
    if (q.includes("akademie") || q.includes("academy")) return "/akademie";
    if (q.includes("fade")) return "/fade-gallery";
    if (q.includes("rodina") || q.includes("family")) return "/rodina";
    if (q.includes("objednat") || q.includes("book")) return "https://is.mmbarber.cz";
    if (q.includes("kariéra") || q.includes("career")) return "/kariera";
    if (q.includes("střih") || q.includes("haircut")) return "/pansky-strih-uherske-hradiste";
    if (q.includes("vousy") || q.includes("beard")) return "/uprava-vousu-uherske-hradiste";
    if (q.includes("slovácko") || q.includes("region")) return "/region-slovacko";
    if (q.includes("poukaz") || q.includes("voucher")) return "/system-a-navsteva";
    if (q.includes("platit") || q.includes("pay")) return "/payment";
    if (q.includes("trendy")) return "/zapisnik";
    return `/faq#q-${index}`;
  };

  return (
    <section id="seo-faq-layer" className="w-full py-16 px-6 bg-transparent border-t border-white/5">
      <div className="max-w-7xl mx-auto text-left opacity-[0.02] blur-[2.5px] hover:opacity-100 hover:blur-none transition-all duration-1000 select-none hover:select-text">
        <h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
          <span className="w-2 h-2 bg-mafia-gold animate-pulse"></span>
          {t.faqSection.title}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
          {t.faqSection.items.map((item: { q: string, a: string }, index: number) => (
            <Link 
              key={index} 
              href={getTargetUrl(item.q, index)}
              className="block group/item space-y-2 border-l border-white/5 pl-4 hover:border-mafia-gold/30 transition-colors duration-500"
            >
              <p className="text-[10px] font-black text-white uppercase tracking-widest group-hover/item:text-mafia-gold transition-colors">{item.q}</p>
              <p className="text-[10px] font-mono text-smoke-white/40 uppercase leading-relaxed group-hover/item:text-smoke-white/60 transition-colors">
                {item.a}
              </p>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-white/10 uppercase tracking-[0.2em]">
          <span>MMBARBER SEO DATA LAYER // AUTHENTIC CRAFT // UH-MARATICE</span>
          <Link href="/faq" className="hover:text-mafia-gold/40 transition-colors">Zobrazit celou databázi znalostí →</Link>
        </div>
      </div>
    </section>
  );
}
