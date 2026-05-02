"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, Eye, MapPin, Database, Camera } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export function HiddenSEOArchive() {
  const { lang } = useTranslation();

  const data = {
    cs: {
      title: "PROTOKOL SKRYTÝCH MÍST",
      subtitle: "URBEX, HISTORIE A NEZNÁMÁ MÍSTA UH",
      faq: [
        {
          q: "Co jsou to skrytá místa města?",
          a: "Uherské Hradiště má svou tvář i svou duši. Skrytá místa jsou zapomenuté kouty, urbex lokace a historické uzly, které nejsou v běžných turistických mapách, ale definují charakter našeho regionu."
        },
        {
          q: "Proč MM BARBER mapuje tato místa?",
          a: "Naše značka je o objevování podstaty. Stejně jako hledáme perfektní linii v sestřihu, hledáme i krásu v syrovosti a zapomnění. Je to součást naší noir estetiky a úcty k místu, kde tvoříme."
        },
        {
          q: "Jsou tyto lokace přístupné veřejnosti?",
          a: "Mnoho z nich je v šedé zóně nebo na soukromých pozemcích. Naším cílem není navádět k vandalismu, ale dokumentovat mizející svět skrze objektiv a vyprávět příběhy, které by jinak zmizely."
        }
      ],
      keywords: "Urbex Uherské Hradiště, skrytá místa Slovácko, zapomenutá historie UH, MM BARBER průzkum, industriální dědictví, noir fotografie Hradiště."
    },
    en: {
      title: "HIDDEN PLACES PROTOCOL",
      subtitle: "URBEX, HISTORY & UNKNOWN SPOTS IN UH",
      faq: [
        {
          q: "What are the hidden places of the city?",
          a: "Uherské Hradiště has its face and its soul. Hidden places are forgotten corners, urbex locations, and historical nodes that aren't on regular tourist maps but define the character of our region."
        },
        {
          q: "Why does MM BARBER map these places?",
          a: "Our brand is about discovering the essence. Just as we look for the perfect line in a haircut, we look for beauty in rawness and oblivion. It's part of our noir aesthetic and respect for the place where we create."
        },
        {
          q: "Are these locations accessible to the public?",
          a: "Many are in a gray area or on private property. Our goal isn't to encourage vandalism, but to document a disappearing world through the lens and tell stories that would otherwise vanish."
        }
      ],
      keywords: "Urbex Uherské Hradiště, hidden places Slovácko, forgotten history UH, MM BARBER exploration, industrial heritage, noir photography Hradiště."
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
            <Camera size={16} className="text-mafia-gold/40" />
            <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-widest font-bold">HIDDEN_PLACES_DATANODE</span>
          </div>
          <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest leading-loose max-w-5xl select-none">
            {content.keywords} • {content.keywords}
          </p>
        </div>
      </div>
    </div>
  );
}
