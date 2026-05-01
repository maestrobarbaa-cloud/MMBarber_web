"use client";

import { motion } from "framer-motion";
import { ChevronLeft, GraduationCap, BookOpen, Scissors, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useTranslation } from "@/hooks/useTranslation";

export default function AkademiePage() {
  const { t } = useTranslation();

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": t?.akademie?.guides?.[0]?.title || "MMBARBER Academy",
    "description": t?.akademie?.description || "Professional barber training.",
    "step": t?.akademie?.guides?.flatMap((g: any) => g?.steps?.map((s: string, i: number) => ({
      "@type": "HowToStep",
      "text": s,
      "name": `${g.title} - Step ${i + 1}`
    }))) || []
  };

  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white py-24 px-6 relative overflow-hidden">
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-[0.3em] mb-16"
        >
          <ChevronLeft size={14} />
          {t?.akademie?.backToHqBtn || "BACK TO HQ"}
        </Link>

        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
             <div className="p-3 bg-mafia-gold/10 border border-mafia-gold/20">
                <GraduationCap size={24} className="text-mafia-gold" />
             </div>
             <div>
                <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter">
                  {t?.akademie?.title?.split(' ').slice(0, -1).join(' ') || "MMBARBER"} <span className="text-mafia-gold italic">{t?.akademie?.title?.split(' ').slice(-1) || "ACADEMY"}</span>
                </h1>
                <p className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.4em]">{t?.akademie?.guidesTitle || "KNOWLEDGE BASE"}</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {t?.akademie?.guides?.map((guide: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-10 bg-mafia-dark/40 border border-white/5 relative group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                <BookOpen size={32} />
              </div>
              <h2 className="text-2xl font-heading font-black uppercase text-white mb-8 pr-12">{guide?.title}</h2>
              <ul className="space-y-6">
                {guide?.steps?.map((step: string, sIdx: number) => (
                  <li key={sIdx} className="flex gap-4">
                    <CheckCircle2 size={18} className="text-mafia-gold shrink-0 mt-1" />
                    <p className="text-sm text-smoke-white/70 leading-relaxed italic">{step}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-10 pt-6 border-t border-white/5 flex gap-2">
                 {guide?.keywords?.map((kw: string, kIdx: number) => (
                   <span key={kIdx} className="text-[8px] font-mono uppercase text-mafia-gold/40">#{kw?.replace(/ /g, '')}</span>
                 ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center py-20 border-t border-white/5">
           <Scissors size={40} className="mx-auto mb-6 text-mafia-gold/20" />
           <p className="text-sm font-mono uppercase tracking-[0.4em] text-smoke-white/40 mb-8">{t?.akademie?.noResults || "Book your chair."}</p>
           <Link 
              href="/#operativi" 
              className="inline-block border-2 border-mafia-gold text-mafia-gold px-12 py-4 font-heading font-black uppercase tracking-widest hover:bg-mafia-gold hover:text-mafia-black transition-all"
           >
              {t?.akademie?.bookBtn || "BOOK NOW"}
           </Link>
        </div>
      </div>

      <div className="fixed left-6 top-1/2 -rotate-90 origin-left text-[8px] font-mono text-white/5 uppercase tracking-[1em] whitespace-nowrap pointer-events-none">
        MMBARBER_ACADEMY_GROOMING_PROTOCOL
      </div>
    </main>
  );
}
