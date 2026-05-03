"use client";

import React from "react";
import { motion } from "framer-motion";
import { Atmosphere } from "@/components/Atmosphere";
import { Scissors, Flame, Droplets, CheckCircle } from "lucide-react";

export default function StrihVousyDetailPage() {
  return (
    <div className="min-h-screen bg-mafia-black text-white pt-32 pb-20 px-6">
      <Atmosphere />
      
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-7xl font-heading font-black italic uppercase tracking-tighter text-mafia-gold">
              Střih + Vousy: Kompletní Servis
            </h1>
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-white/40">
              The Ultimate MMBARBER Experience
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-smoke-white/70 font-sans leading-relaxed text-lg">
            <p>
              V MM BARBER věříme, že polovičatý servis neexistuje. Pokud chceš vypadat jako chlap, musíš mít v pořádku obojí – vlasy i vousy. Náš balíček „Střih + Vousy“ je nejprodávanější službou v Uherském Hradišti, protože nabízí komplexní transformaci identity během 60 až 90 minut.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-16">
               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-mafia-gold">
                    <Scissors size={24} />
                    <h3 className="text-2xl font-heading font-bold uppercase italic">Master Haircut</h3>
                  </div>
                  <p className="text-sm">
                    Od klasického Side Partu po moderní Skin Fade. Používáme techniku nůžek i strojků k dosažení perfektního přechodu, který vydrží týdny, ne jen dny. Součástí je mytí vlasů a styling profesionálními produkty.
                  </p>
               </div>
               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-mafia-gold">
                    <Flame size={24} />
                    <h3 className="text-2xl font-heading font-bold uppercase italic">Beard Design</h3>
                  </div>
                  <p className="text-sm">
                    Úprava vousů břitvou s využitím rituálu Hot Towel (napařování horkým ručníkem). Kontury vytáhneme do naprosté ostrosti, vousy vyživíme olejem a balzámem a poradíme ti, jak se o ně starat doma.
                  </p>
               </div>
            </div>

            <h2 className="text-3xl font-heading font-black uppercase italic text-white mb-6">Proč chlapi chodí do barbershopu a ne ke kadeřnici?</h2>
            <p>
              Je to otázka specializace. Kadeřnice stříhá všechno od dětí po babičky. Barber se specializuje výhradně na muže. Rozumíme struktuře mužského vlasu, víme, jak korigovat kouty nebo prořídlá místa, a hlavně – umíme zacházet s břitvou. Kadeřnice ti vousy nikdy neoholí tak, jako mistr v MM BARBER.
            </p>

            <div className="p-8 bg-white/5 border border-white/10 rounded-lg">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <Droplets className="text-mafia-gold" size={20} />
                 Průběh služby u nás:
               </h3>
               <ul className="space-y-4">
                  {[
                    "Konzultace a diagnostika vlasové pokožky",
                    "Precizní střih vlasů a fade",
                    "Mytí a masáž hlavy",
                    "Příprava vousů (napařování)",
                    "Holení kontur břitvou",
                    "Závěrečná péče (aftershave, olej, balzám)",
                    "Finální styling a doporučení produktů"
                  ].map((step, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <CheckCircle size={14} className="text-mafia-gold" />
                      {step}
                    </li>
                  ))}
               </ul>
            </div>

            <p className="mt-10 mb-12">
              Přijď si pro svůj respekt do Mařatic. MMBARBER je místem, kde tvůj vzhled dostane nový rozměr. Rezervuj si kompletní servis ještě dnes a zažij rozdíl mezi "stříháním" a "barberingem".
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <a href="https://is.mmbarber.cz" target="_blank" rel="noopener noreferrer" className="p-6 bg-mafia-gold text-mafia-black text-center font-heading font-bold uppercase italic hover:bg-white transition-all">Střih + Vousy</a>
               <a href="https://is.mmbarber.cz" target="_blank" rel="noopener noreferrer" className="p-6 bg-white/10 text-white text-center font-heading font-bold uppercase italic hover:bg-mafia-gold hover:text-mafia-black transition-all">Pouze Střih</a>
               <a href="https://is.mmbarber.cz" target="_blank" rel="noopener noreferrer" className="p-6 bg-white/10 text-white text-center font-heading font-bold uppercase italic hover:bg-mafia-gold hover:text-mafia-black transition-all">Pouze Vousy</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
