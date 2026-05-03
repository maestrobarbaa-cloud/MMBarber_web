"use client";

import React from "react";
import { motion } from "framer-motion";
import { Atmosphere } from "@/components/Atmosphere";
import { useTranslation } from "@/hooks/useTranslation";
import { MapPin, Star, ShieldCheck, Scissors } from "lucide-react";

export default function BarbershopUHPage() {
  const { t } = useTranslation();

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
              Barbershop Uherské Hradiště
            </h1>
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-white/40">
              Elite Grooming | Regional Authority
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-smoke-white/70 font-sans leading-relaxed text-lg">
            <p>
              Hledáte v Uherském Hradišti místo, kde se poctivé řemeslo potkává s nekompromisním stylem? MMBARBER není jen další kadeřnictví na rohu. Jsme epicentrem moderního pánského holičství v regionu Slovácko. Naše pobočka v Mařaticích definuje standardy toho, jak má vypadat profesionální péče o muže v roce 2026.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
               <div className="p-8 border border-mafia-gold/20 bg-mafia-gold/5 rounded-sm">
                  <Star className="text-mafia-gold mb-4" />
                  <h3 className="text-white font-heading font-bold uppercase italic text-xl mb-2">Pětihvězdičkový servis</h3>
                  <p className="text-sm">V Uherském Hradišti jsme si vybudovali pověst díky detailům. Každý střih je konzultován individuálně podle tvaru obličeje a růstu vlasů.</p>
               </div>
               <div className="p-8 border border-mafia-gold/20 bg-mafia-gold/5 rounded-sm">
                  <ShieldCheck className="text-mafia-gold mb-4" />
                  <h3 className="text-white font-heading font-bold uppercase italic text-xl mb-2">Exkluzivní produkty</h3>
                  <p className="text-sm">Používáme jen to nejlepší ze světového trhu – Reuzel, Uppercut Deluxe a naši vlastní řadu MM BARBER produktů.</p>
               </div>
            </div>

            <h2 className="text-3xl font-heading font-black uppercase italic text-white mb-6">Proč si vybrat právě nás?</h2>
            <p>
              V Uherském Hradišti působí několik barbershopů, ale MMBARBER sází na autenticitu a komunitu. Když k nám přijdete, nečekáte v tichu na židli. Jste součástí dění. Atmosféra našeho shopu je inspirována noir estetikou a gangsterskou elegancí, která podtrhuje mužské sebevědomí.
            </p>
            
            <ul className="space-y-4 list-none p-0">
               <li className="flex items-center gap-3">
                 <Scissors size={16} className="text-mafia-gold" />
                 <span>Precizní Skin Fade a moderní texturované střihy</span>
               </li>
               <li className="flex items-center gap-3">
                 <Scissors size={16} className="text-mafia-gold" />
                 <span>Tradiční holení břitvou s napařováním ručníkem (Hot Towel)</span>
               </li>
               <li className="flex items-center gap-3">
                 <Scissors size={16} className="text-mafia-gold" />
                 <span>Parkování zdarma přímo před provozovnou v Mařaticích</span>
               </li>
               <li className="flex items-center gap-3">
                 <Scissors size={16} className="text-mafia-gold" />
                 <span>Rezervace online 24/7 bez nutnosti telefonování</span>
               </li>
            </ul>

            <div className="mt-16 flex flex-col sm:flex-row gap-6">
               <a 
                 href="https://is.mmbarber.cz" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex-1 p-10 bg-mafia-gold text-mafia-black text-center font-heading font-black uppercase italic tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(197,160,89,0.3)]"
               >
                  Rezervovat termín UH
               </a>
               <a 
                 href="https://is.mmbarber.cz" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex-1 p-10 border-2 border-mafia-gold text-mafia-gold text-center font-heading font-black uppercase italic tracking-widest hover:bg-mafia-gold hover:text-mafia-black transition-all"
               >
                  Online objednávka
               </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
