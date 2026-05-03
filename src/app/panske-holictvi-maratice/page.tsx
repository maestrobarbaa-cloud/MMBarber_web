"use client";

import React from "react";
import { motion } from "framer-motion";
import { Atmosphere } from "@/components/Atmosphere";
import { Scissors, MapPin, Coffee, Users } from "lucide-react";

export default function HolictviMaraticePage() {
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
              Pánské holičství Mařatice
            </h1>
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-white/40">
              Sadová 1383 | MMBARBER Base
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-smoke-white/70 font-sans leading-relaxed text-lg">
            <p>
              Mařatice nejsou jen rezidenční čtvrť Uherského Hradiště. Pro nás jsou srdcem systému. MMBARBER zde sídlí na adrese Sadová 1383 a nabízí útočiště pro každého, kdo hledá poctivé pánské holičství bez zbytečných kudrlinek a marketingu.
            </p>
            
            <div className="bg-mafia-gold/5 border-l-4 border-mafia-gold p-8 my-10">
               <h2 className="text-mafia-gold font-heading font-bold uppercase italic text-2xl mb-4">Lokální autorita v Mařaticích</h2>
               <p className="italic font-serif">
                 „Nejsme jen holiči. Jsme sousedé. Známe příběhy lidí z UH a Mařatic, a proto ke každému střihu přistupujeme s respektem, který si tohle město zaslouží.“
               </p>
            </div>

            <p>
              V našem holičství v Mařaticích sázíme na tradici. Pánské kadeřnictví se v posledních letech změnilo, ale poctivý přístup zůstává stejný. Ať už potřebujete klasický střih do práce, nebo něco progresivnějšího na víkend, v Mařaticích jste na správné adrese.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-12">
               <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10">
                  <MapPin className="text-mafia-gold shrink-0" size={20} />
                  <div>
                    <h4 className="text-white font-bold mb-1">Skvělá dostupnost</h4>
                    <p className="text-sm">Snadný příjezd z centra Hradiště i okolních obcí.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10">
                  <Scissors className="text-mafia-gold shrink-0" size={20} />
                  <div>
                    <h4 className="text-white font-bold mb-1">Mistři řemesla</h4>
                    <p className="text-sm">Pravidelně školení barbaři s mezinárodními zkušenostmi.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10">
                  <Coffee className="text-mafia-gold shrink-0" size={20} />
                  <div>
                    <h4 className="text-white font-bold mb-1">Atmosféra</h4>
                    <p className="text-sm">Unikátní design, skvělá káva a správná hudba.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10">
                  <Users className="text-mafia-gold shrink-0" size={20} />
                  <div>
                    <h4 className="text-white font-bold mb-1">Komunita</h4>
                    <p className="text-sm">Místo, kde se potkávají zajímaví lidé z celého regionu.</p>
                  </div>
               </div>
            </div>

            <h2 className="text-3xl font-heading font-black uppercase italic text-white mb-6">Proč chlapi z Mařatic chodí k nám?</h2>
            <p className="mb-12">
              Odpověď je jednoduchá: protože kadeřnice v nákupáku ti nikdy nedá ten pocit sounáležitosti a preciznosti, jako náš barbershop. V Mařaticích budujeme místo, kde se zastaví čas a ty se můžeš soustředit jen na sebe.
            </p>

            <div className="space-y-6">
               <a 
                 href="https://is.mmbarber.cz" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="block w-full p-8 bg-mafia-gold text-mafia-black text-center font-heading font-black uppercase italic tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)]"
               >
                  Chci svůj termín v Mařaticích
               </a>
               <a 
                 href="https://is.mmbarber.cz" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="block w-full p-8 border border-mafia-gold/50 text-white text-center font-heading font-black uppercase italic tracking-widest hover:bg-mafia-gold/20 transition-all"
               >
                  Rezervace 24/7
               </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
