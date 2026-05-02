"use client";

import React from "react";
import { motion } from "framer-motion";
import { Microscope, Database, Globe, Zap, Award } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export function CareSEOArchive() {
  const { lang } = useTranslation();

  const data = {
    cs: {
      title: "VĚDECKÝ ARCHIV PÉČE",
      subtitle: "HLOUBKOVÁ ANALÝZA DERMATOLOGICKÝCH PROTOKOLŮ",
      sections: [
        {
          title: "BIOLOGICKÉ PRINCIPY",
          icon: <Microscope size={20} />,
          content: "Péče v MM BARBER není založena na marketingu, ale na fyziologii. Studium keratinové struktury vlasu a lipidové bariéry pokožky nám umožňuje aplikovat postupy, které respektují přirozené pH (4.5–5.5). Každý zásah břitvou nebo nůžkami je doprovázen hloubkovou regenerací buněčné matrice."
        },
        {
          title: "REGIONÁLNÍ AUTORITA",
          icon: <Globe size={20} />,
          content: "Jako přední barbershop v Uherském Hradišti a regionu Slovácko integrujeme lokální specifika (tvrdost vody, klimatické podmínky) do našich doporučení. Naše 'Péče' je standardem pro moderního muže, který vyžaduje světovou úroveň služeb v srdci Moravy."
        },
        {
          title: "ESTETICKÁ INTEGRITA",
          icon: <Award size={20} />,
          content: "Skin Fade není jen střih, je to geometrická disciplína. Naše protokoly pro úpravu vousů zahrnují napařování (Hot Towel), dezinfekci kamencem a aplikaci specifických olejů, které zabraňují transepidermální ztrátě vody (TEWL)."
        }
      ],
      keywords: "Barbershop Uherské Hradiště, pánská kosmetika, péče o pleť pro muže, trichologie Slovácko, profesionální holení, bio-metrika vlasů, MM BARBER odbornost, dermatologické standardy, úprava vousů Mařatice."
    },
    en: {
      title: "SCIENTIFIC CARE ARCHIVE",
      subtitle: "DEEP ANALYSIS OF DERMATOLOGICAL PROTOCOLS",
      sections: [
        {
          title: "BIOLOGICAL PRINCIPLES",
          icon: <Microscope size={20} />,
          content: "Care at MM BARBER is not based on trends, but on physiology. The study of the hair's keratin structure and the skin's lipid barrier allows us to apply procedures that respect natural pH (4.5–5.5). Every razor or scissor intervention is accompanied by deep regeneration of the cellular matrix."
        },
        {
          title: "REGIONAL AUTHORITY",
          icon: <Globe size={20} />,
          content: "As the leading barbershop in Uherské Hradiště and the Slovácko region, we integrate local specifics (water hardness, climatic conditions) into our recommendations. Our 'Care' is the standard for the modern man who demands world-class services in the heart of Moravia."
        },
        {
          title: "AESTHETIC INTEGRITY",
          icon: <Award size={20} />,
          content: "Skin Fade is not just a haircut, it's a geometric discipline. Our beard grooming protocols include steaming (Hot Towel), alum disinfection, and the application of specific oils that prevent transepidermal water loss (TEWL)."
        }
      ],
      keywords: "Barbershop Uherské Hradiště, men's cosmetics, skin care for men, trichology Slovácko, professional shaving, hair biometrics, MM BARBER expertise, dermatological standards, beard grooming Mařatice."
    }
  };

  const content = lang === 'en' ? data.en : data.cs;

  return (
    <div className="w-full bg-[#080808] border-t border-mafia-gold/20 py-24 px-6 relative overflow-hidden mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(197,160,89,0.03)_0%,transparent_70%)] pointer-events-none"></div>
      
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
          {content.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/30 transition-all group"
            >
              <div className="w-12 h-12 border border-mafia-gold/20 flex items-center justify-center mb-6 text-mafia-gold group-hover:bg-mafia-gold group-hover:text-black transition-all">
                {section.icon}
              </div>
              <h3 className="text-white font-heading font-bold text-xl uppercase tracking-widest mb-4 italic">{section.title}</h3>
              <p className="text-smoke-white/50 text-sm leading-relaxed font-sans">{section.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="p-10 border-2 border-dashed border-mafia-gold/10 bg-black/40 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-6">
            <Database size={16} className="text-mafia-gold/40" />
            <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-widest font-bold">INDEXED_PAYLOAD_v3.4</span>
          </div>
          <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest leading-loose max-w-5xl select-none">
            {content.keywords} {content.keywords} {content.keywords}
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-6 flex items-center gap-3 opacity-20">
        <Zap size={12} className="text-mafia-gold animate-pulse" />
        <span className="font-mono text-[8px] text-white uppercase tracking-widest">SYSTEM_OPTIMIZED_FOR_GOOGLE_BOT</span>
      </div>
    </div>
  );
}
