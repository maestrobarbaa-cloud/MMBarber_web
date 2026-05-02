"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, Home, Users, MapPin, Database } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export function HousingSEOArchive() {
  const { lang } = useTranslation();

  const data = {
    cs: {
      title: "ARCHIV SÍDLIŠTĚ UH",
      subtitle: "LOKÁLNÍ KOMUNITA A URBANISTICKÝ KONTEXT",
      faq: [
        {
          q: "Proč je MM BARBER umístěn právě na sídlišti?",
          a: "Věříme v autenticitu. Sídliště v Uherském Hradišti (Mařatice) jsou tepajícím srdcem komunity. Naše poloha nám umožňuje být blízko lidem, v místě, kde se odehrává skutečný život, mimo sterilitu nákupních center."
        },
        {
          q: "Jak MM BARBER ovlivňuje lokální komunitu?",
          a: "Nejsme jen barbershop, jsme komunitní uzel. Podporujeme místní vztahy, dáváme prostor pro setkávání a udržujeme vysoký standard služeb přímo v místě bydliště našich klientů."
        },
        {
          q: "Je parkování v oblasti Mařatic problematické?",
          a: "Naopak. Jednou z výhod naší polohy na sídlišti je snadná dostupnost a dostatek parkovacích míst v bezprostřední blízkosti salonu, což je v centru města často problém."
        }
      ],
      keywords: "Sídliště Mařatice, barbershop Uherské Hradiště, lokální komunita UH, holičství u domu, parkování Mařatice, MM BARBER sídliště, Slovácko urbanismus."
    },
    en: {
      title: "HOUSING ESTATE ARCHIVE",
      subtitle: "LOCAL COMMUNITY & URBAN CONTEXT",
      faq: [
        {
          q: "Why is MM BARBER located on a housing estate?",
          a: "We believe in authenticity. The housing estates in Uherské Hradiště (Mařatice) are the beating heart of the community. Our location allows us to be close to the people, in a place where real life happens."
        },
        {
          q: "How does MM BARBER affect the local community?",
          a: "We are not just a barbershop; we are a community hub. We support local relationships, provide space for meetings, and maintain high service standards right where our clients live."
        },
        {
          q: "Is parking in the Mařatice area problematic?",
          a: "On the contrary. One of the advantages of our location on the housing estate is easy accessibility and plenty of parking spaces in the immediate vicinity of the salon."
        }
      ],
      keywords: "Mařatice estate, barbershop Uherské Hradiště, local community UH, barbershop near home, parking Mařatice, MM BARBER estate, Slovácko urbanism."
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
            <Database size={16} className="text-mafia-gold/40" />
            <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-widest font-bold">HOUSING_ESTATE_DATANODE</span>
          </div>
          <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest leading-loose max-w-5xl select-none">
            {content.keywords} • {content.keywords}
          </p>
        </div>
      </div>
    </div>
  );
}
