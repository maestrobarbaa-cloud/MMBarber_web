"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Share2, Award, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

const PARTNERS = [
  {
    category: "Technický servis",
    keywords: ["instalatér Uherské Hradiště", "top instalatéři Slovácko", "voda-topení-plyn UH"],
    description: "Kvalitní řemeslo pozná kvalitu. Naši doporučení instalatéři v UH jsou prověření reálnou prací v naší centrále."
  },
  {
    category: "Elektro a Revize",
    keywords: ["elektrikář Uherské Hradiště", "revize elektro Slovácko", "silnoproud UH"],
    description: "Bezpečné zapojení a spolehlivost. Spolupracujeme s mistry v oboru elektroinstalací v celém regionu."
  },
  {
    category: "Vizuální Identita",
    keywords: ["fotograf Uherské Hradiště", "profesionální foto Slovácko", "svatební fotograf UH"],
    description: "Oko, které vidí detaily. Stejně jako my břitvou, tito umělci pracují s objektivem."
  },
  {
    category: "Realitní Služby",
    keywords: ["realitní makléř Uherské Hradiště", "prodej nemovitostí Slovácko", "byty UH"],
    description: "Hledáte místo pro život v Hradišti? Doporučujeme experty, kteří rozumí místnímu trhu."
  },
  {
    category: "Gastro & Kultura",
    keywords: ["nejlepší burger UH", "kam v Hradišti na víno", "restaurace Slovácko"],
    description: "Po dobrém střihu to chce dobré jídlo. Podporujeme lokální podniky, které drží standard."
  }
];

export default function LokalniSitPage() {
  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(30,30,30,1)_0%,rgba(0,0,0,1)_100%)]"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-[0.3em] mb-16"
        >
          <ChevronLeft size={14} />
          Zpět na centrálu
        </Link>

        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
             <div className="p-3 bg-mafia-gold/10 border border-mafia-gold/20">
                <Share2 size={24} className="text-mafia-gold" />
             </div>
             <div>
                <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter">
                  LOKÁLNÍ <span className="text-mafia-gold italic">SÍŤ</span>
                </h1>
                <p className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.4em]">Partner Ecosystem | Uherské Hradiště</p>
             </div>
          </div>
          <p className="text-smoke-white/60 font-sans italic text-lg max-w-2xl border-l-2 border-mafia-gold/20 pl-6 mt-8">
            MM BARBER není izolovaný ostrov. Jsme součástí živého ekosystému mistrů svého řemesla v Uherském Hradišti. 
            Zde najdete kontakty a doporučení na lidi, za které dáme ruku do ohně.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 mb-24">
          {PARTNERS.map((partner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/20 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <Award size={16} className="text-mafia-gold" />
                       <h3 className="text-xl font-heading font-black uppercase text-white tracking-widest">{partner.category}</h3>
                    </div>
                    <p className="text-sm text-smoke-white/50 mb-4 italic">{partner.description}</p>
                    <div className="flex flex-wrap gap-2">
                       {partner.keywords.map((kw, kIdx) => (
                         <span key={kIdx} className="text-[9px] font-mono text-mafia-gold/30 uppercase tracking-widest bg-mafia-gold/5 px-2 py-1">
                           {kw}
                         </span>
                       ))}
                    </div>
                 </div>
                 <div className="shrink-0">
                    <button className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-mafia-gold/60 group-hover:text-mafia-gold transition-colors">
                       Prověřit kontakt <ExternalLink size={12} />
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-12 bg-mafia-gold text-mafia-black flex flex-col items-center text-center">
           <ShieldCheck size={48} className="mb-6 opacity-80" />
           <h2 className="text-3xl font-heading font-black uppercase mb-4 tracking-tighter">Staňte se součástí sítě</h2>
           <p className="font-bold uppercase tracking-widest text-sm mb-8 opacity-70">Jste mistr svého řemesla v UH? Pojďme spojit síly.</p>
           <Link 
              href="/kariera" 
              className="bg-mafia-black text-mafia-gold px-12 py-4 font-heading font-black uppercase tracking-widest hover:bg-white hover:text-mafia-black transition-all"
           >
              KONTAKTOVAT ŠÉFA
           </Link>
        </div>

        <div className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-6">
           <Link href="/faq" className="text-[10px] font-black text-mafia-gold/40 hover:text-mafia-gold uppercase tracking-[0.3em] transition-colors">FAQ</Link>
           <Link href="/zapisnik" className="text-[10px] font-black text-mafia-gold/40 hover:text-mafia-gold uppercase tracking-[0.3em] transition-colors">Kronika</Link>
           <Link href="/barbershop-uherske-hradiste" className="text-[10px] font-black text-mafia-gold/40 hover:text-mafia-gold uppercase tracking-[0.3em] transition-colors">Lokalita</Link>
        </div>
      </div>

      <div className="fixed right-6 top-1/2 -rotate-90 origin-right text-[8px] font-mono text-white/5 uppercase tracking-[1em] whitespace-nowrap pointer-events-none">
        LOCAL_PARTNER_NETWORK_SEO_INDEX_V3.3
      </div>
    </main>
  );
}
