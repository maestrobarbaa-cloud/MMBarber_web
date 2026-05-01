"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

const familyFaqs = [
  {
    q: "Jaké služby nabízí MM BARBER Rodina v Uherském Hradišti?",
    a: "Naše rodina sdružuje mistry z mnoha oborů – od nejlepších instalatérů (Vodo Topo Jahoda) a elektrikářů (Roman Jakubčák) až po profesionální fotografy (Malina Photo) a realitní experty (Sluneční Reality). Všechny tyto partnery spojuje loajalita k MM BARBER brandu a špičková kvalita odvedené práce.",
    link: "/rodina",
    linkLabel: "Zobrazit všechny členy"
  },
  {
    q: "Hledám instalatéra v UH, proč využít někoho z vaší rodiny?",
    a: "Protože za naše lidi dáváme ruku do ohně. Vodo Topo Jahoda nebo Zdeněk Mička jsou prověření patrioti, kteří se starají o centrálu MM BARBER a stovky spokojených klientů na Slovácku. Osobní doporučení od barbera je víc než anonymní recenze na internetu.",
    link: "/rodina?div=voda",
    linkLabel: "Divize Voda"
  },
  {
    q: "Jak se stát součástí MM BARBER partnerství?",
    a: "Vstup do naší rodiny není jen o penězích, ale o přístupu. Hledáme lidi, kteří to berou vážně, mají charakter a chtějí budovat silný regionální brand. Pokud máte pocit, že vaše služba patří k nejlepším v Hradišti, ozvěte se nám.",
    link: "/specialni-mise",
    linkLabel: "Nábor partnerů"
  },
  {
    q: "Kde najdu nejlepší pánský střih a zároveň servis pro mé auto/kolo/dům?",
    a: "V MM BARBER centrále propojujeme lifestyle s praktickými službami. Zatímco vy relaxujete v křesle, můžeme vám doporučit ty nejlepší experty z naší sítě (O Kolečko víc pro cyklisty, Kudielka pro stínící techniku atd.). Je to komplexní ekosystém pro moderního muže.",
    link: "/rodina",
    linkLabel: "Prozkoumat ekosystém"
  },
  {
    q: "Mají členové rodiny nějaké speciální výhody pro mé projekty?",
    a: "Ano, členství v MM BARBER rodině často přináší prioritní termíny a exkluzivní přístup k realizacím. Je to uzavřený okruh důvěry, kde si navzájem pomáháme růst a zajišťujeme, aby kvalita na Slovácku neklesala.",
    link: "/vip-club",
    linkLabel: "VIP Sekce"
  }
];

export function FamilyFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="w-full bg-mafia-black py-24 px-6 border-t border-mafia-gold/10 relative overflow-hidden">
      {/* Background patterns for SEO/Vibe */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,var(--color-mafia-gold)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="w-12 h-12 rounded-full border border-mafia-gold/20 flex items-center justify-center mb-6">
            <HelpCircle size={24} className="text-mafia-gold" />
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-smoke-white uppercase tracking-tighter italic mb-4">
            FAMILY NETWORK FAQ
          </h2>
          <div className="w-24 h-1 bg-mafia-gold"></div>
        </div>

        <div className="space-y-4">
          {familyFaqs.map((faq, idx) => (
            <div 
              key={idx}
              className={`border transition-all duration-500 ${openIdx === idx ? 'border-mafia-gold bg-mafia-gold/[0.03]' : 'border-white/5 bg-white/[0.01] hover:border-white/20'}`}
            >
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className={`font-heading font-black text-sm md:text-lg uppercase tracking-wide transition-colors ${openIdx === idx ? 'text-mafia-gold' : 'text-smoke-white'}`}>
                  {faq.q}
                </span>
                <div className={`transition-transform duration-500 ${openIdx === idx ? 'rotate-180 text-mafia-gold' : 'text-white/20'}`}>
                  <ChevronDown size={20} />
                </div>
              </button>
              
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 border-t border-mafia-gold/10 mt-2">
                      <p className="text-smoke-white/60 font-sans text-sm md:text-base leading-relaxed mb-6">
                        {faq.a}
                      </p>
                      <Link 
                        href={faq.link}
                        className="inline-flex items-center gap-2 text-mafia-gold font-mono text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors"
                      >
                        <Plus size={12} /> {faq.linkLabel}
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Deep SEO Links for Partners */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-30">
          {[
            { name: "Instalatéři UH", url: "/rodina?div=voda" },
            { name: "Elektro Revize", url: "/rodina?div=elektro" },
            { name: "Reality Slovácko", url: "/rodina?div=stavebnictvi" },
            { name: "Foto & Design", url: "/rodina?div=kreativci" }
          ].map((link, i) => (
            <Link 
              key={i} 
              href={link.url}
              className="group flex items-center justify-center p-4 border border-white/10 hover:border-mafia-gold transition-all text-[9px] font-black uppercase tracking-widest text-smoke-white/60 hover:text-mafia-gold"
            >
              {link.name} <ExternalLink size={10} className="ml-2 opacity-0 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
