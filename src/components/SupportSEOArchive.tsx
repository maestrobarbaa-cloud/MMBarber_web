"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Palette, Heart, ShieldCheck, Database } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export function SupportSEOArchive() {
  const { lang } = useTranslation();

  const data = {
    cs: {
      title: "PROTOKOL VIZUÁLNÍ PODPORY",
      subtitle: "REVIZE GRAFICKÝCH STANDARDŮ A ODMĚN",
      faq: [
        {
          q: "Co obsahuje balíček grafické podpory?",
          a: "Náš systém odměn zahrnuje exkluzivní digitální aktiva, jako jsou 4K tapety pro PC a mobilní zařízení, které odrážejí noir estetiku MM BARBER. Tato aktiva jsou dostupná pro naše nejvěrnější podporovatele."
        },
        {
          q: "Proč je k přístupu vyžadováno heslo?",
          a: "Chceme, aby naše speciální odměny byly exkluzivní. Heslo (grafika) je symbolem příslušnosti k užšímu okruhu rodiny MM BARBER, kteří chápou naši vizuální identitu a hodnoty."
        },
        {
          q: "Jak mohu salon dále podpořit?",
          a: "Podpora může být přímá i nepřímá. Od sdílení naší práce na sociálních sítích až po využívání našich dárkových voucherů. Každá interakce posiluje náš ekosystém."
        }
      ],
      keywords: "MM BARBER grafika, noir tapety, podpora salonu, exkluzivní digitální obsah, dárky pro věrné klienty, vizuální identita Uherské Hradiště."
    },
    en: {
      title: "VISUAL SUPPORT PROTOCOL",
      subtitle: "REVISION OF GRAPHIC STANDARDS & REWARDS",
      faq: [
        {
          q: "What does the graphic support package contain?",
          a: "Our rewards system includes exclusive digital assets such as 4K wallpapers for PC and mobile devices reflecting the MM BARBER noir aesthetic. These assets are available for our most loyal supporters."
        },
        {
          q: "Why is a password required for access?",
          a: "We want our special rewards to be exclusive. The password (grafika) is a symbol of belonging to the inner circle of the MM BARBER family who understand our visual identity and values."
        },
        {
          q: "How can I further support the salon?",
          a: "Support can be direct and indirect. From sharing our work on social media to using our gift vouchers. Every interaction strengthens our ecosystem."
        }
      ],
      keywords: "MM BARBER graphics, noir wallpapers, salon support, exclusive digital content, gifts for loyal clients, visual identity Uherské Hradiště."
    }
  };

  const content = lang === 'en' ? data.en : data.cs;

  return (
    <div className="w-full bg-[#030303] border-t border-mafia-gold/20 py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(197,160,89,0.02)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-mafia-gold font-heading font-black text-4xl md:text-6xl uppercase tracking-tighter mb-4 italic">
            {content.title}
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-mafia-gold/30"></div>
            <p className="text-smoke-white/40 font-mono text-[10px] uppercase tracking-[0.6em]">{content.subtitle}</p>
            <div className="h-px w-12 bg-mafia-gold/30"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {content.faq.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white/[0.01] border border-white/5 hover:border-mafia-gold/20 transition-all group"
            >
              <h3 className="text-white font-heading font-bold text-lg uppercase tracking-widest mb-4 italic group-hover:text-mafia-gold transition-colors">
                {item.q}
              </h3>
              <p className="text-smoke-white/50 text-xs leading-relaxed font-sans">
                {item.a}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="p-10 border-2 border-dashed border-mafia-gold/10 bg-black/60 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-6">
            <Palette size={16} className="text-mafia-gold/40" />
            <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-widest font-bold">GRAPHIC_REWARDS_DATANODE</span>
          </div>
          <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest leading-loose max-w-5xl select-none">
            {content.keywords} • {content.keywords}
          </p>
        </div>
      </div>
    </div>
  );
}
