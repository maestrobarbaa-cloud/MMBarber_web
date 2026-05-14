"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, FileText, Scale, Info } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function TermsOfUse() {
  const { lang } = useTranslation();

  return (
    <main className="min-h-screen bg-mafia-black text-white pt-32 pb-20 px-6 font-sans selection:bg-mafia-gold selection:text-mafia-black">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center md:text-left"
        >
          <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
            <Scale className="text-mafia-gold" size={48} />
            <div className="h-[2px] w-24 bg-mafia-gold/30"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-[0.2em] uppercase mb-4">
            {lang === 'cs' ? "PODMÍNKY POUŽÍVÁNÍ" : "TERMS OF USE"}
          </h1>
          <p className="text-mafia-gold font-mono text-sm tracking-[0.4em] uppercase opacity-60">
            REGULATORY PROTOCOL V.2026
          </p>
        </motion.div>

        <div className="space-y-12">
          <section className="bg-white/[0.02] border-l-2 border-mafia-gold/20 p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-heading font-bold text-mafia-gold uppercase tracking-widest mb-6 flex items-center gap-4">
              <Info size={24} />
              {lang === 'cs' ? "1. ÚVODNÍ USTANOVENÍ" : "1. INTRODUCTION"}
            </h2>
            <div className="space-y-4 text-smoke-white/70 leading-relaxed font-sans">
              <p>
                {lang === 'cs' 
                  ? "Tyto podmínky upravují užívání webových stránek mmbarber.cz. Vstupem na tento web souhlasíte s těmito podmínkami a zavazujete se je dodržovat."
                  : "These terms govern the use of the mmbarber.cz website. By accessing this site, you agree to these terms and undertake to comply with them."}
              </p>
              <p>
                {lang === 'cs'
                  ? "Provozovatelem webu je Tomáš Mička, se sídlem Bedřicha Buchlovana 882, 686 01 Uherské Hradiště, IČO: 10862994."
                  : "The operator of the website is Tomáš Mička, located at Bedřicha Buchlovana 882, 686 01 Uherské Hradiště, IČO: 10862994."}
              </p>
            </div>
          </section>

          <section className="bg-white/[0.02] border-l-2 border-mafia-gold/20 p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-heading font-bold text-mafia-gold uppercase tracking-widest mb-6 flex items-center gap-4">
              <Shield size={24} />
              {lang === 'cs' ? "2. DUŠEVNÍ VLASTNICTVÍ" : "2. INTELLECTUAL PROPERTY"}
            </h2>
            <div className="space-y-4 text-smoke-white/70 leading-relaxed font-sans">
              <p>
                {lang === 'cs'
                  ? "Veškeré texty, fotografie, logo a originální obsah webu jsou chráněny autorským právem. Jakékoli užití obsahu bez předchozího písemného souhlasu provozovatele je zakázáno."
                  : "All texts, photographs, logo and original content of the website are protected by copyright. Any use of the content without prior written consent of the operator is prohibited."}
              </p>
            </div>
          </section>

          <section className="bg-white/[0.02] border-l-2 border-mafia-gold/20 p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-heading font-bold text-mafia-gold uppercase tracking-widest mb-6 flex items-center gap-4">
              <FileText size={24} />
              {lang === 'cs' ? "3. OMEZENÍ ODPOVĚDNOSTI" : "3. LIMITATION OF LIABILITY"}
            </h2>
            <div className="space-y-4 text-smoke-white/70 leading-relaxed font-sans">
              <p>
                {lang === 'cs'
                  ? "Obsah webu má informativní charakter. Provozovatel neodpovídá za případné škody vzniklé užíváním webu nebo informací na něm uvedených."
                  : "The content of the website is for informational purposes only. The operator is not liable for any damages resulting from the use of the website or the information provided on it."}
              </p>
            </div>
          </section>

          <section className="border-t border-white/10 pt-12 text-center md:text-left">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">
              {lang === 'cs' ? "Poslední aktualizace: 14. května 2026" : "Last updated: May 14, 2026"}
            </p>
            <p className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.2em]">
              MMBARBER REGULATORY COMPLIANCE UNIT
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
