"use client";

import { motion } from "framer-motion";
import { ChevronLeft, MapPin, Star, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

interface SEOPageProps {
  title: string;
  subtitle: string;
  content: React.ReactNode;
  keywords: string[];
  url: string;
}

export function SEOPageLayout({ title, subtitle, content, keywords, url }: SEOPageProps) {
  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,20,20,1)_0%,rgba(0,0,0,1)_100%)]"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-[0.3em] mb-16"
        >
          <ChevronLeft size={14} />
          Zpět na hlavní panel
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <header className="mb-16">
            <div className="flex items-center gap-4 mb-6 opacity-30">
               <div className="h-px w-12 bg-mafia-gold"></div>
               <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-mafia-gold">{url}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-heading font-black uppercase tracking-tighter mb-8 leading-none">
              {title.split(' ')[0]} <span className="text-mafia-gold italic">{title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-2xl font-sans italic text-smoke-white/60 border-l-4 border-mafia-gold pl-8 leading-relaxed">
              {subtitle}
            </p>
          </header>

          <div className="prose prose-invert prose-mafia-gold max-w-none mb-24">
            {content}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <div className="p-8 bg-mafia-dark/30 border border-white/5">
              <h3 className="text-mafia-gold font-heading font-black uppercase mb-4 flex items-center gap-2">
                <MapPin size={20} /> Lokalita
              </h3>
              <p className="text-sm opacity-60">Uherské Hradiště, Mařatice, Kunovice, Staré Město, Slovácko.</p>
            </div>
            <div className="p-8 bg-mafia-dark/30 border border-white/5">
              <h3 className="text-mafia-gold font-heading font-black uppercase mb-4 flex items-center gap-2">
                <Star size={20} /> Specializace
              </h3>
              <p className="text-sm opacity-60">Skin fade, Taper fade, Buzz cut, Beard shaping, Razor shave.</p>
            </div>
          </div>

          <div className="bg-mafia-gold/5 p-12 border-y border-mafia-gold/20 text-center mb-24">
            <h2 className="text-2xl font-heading font-black uppercase mb-8">Strategické Propojení</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/#sluzby" className="text-xs font-bold uppercase tracking-widest hover:text-mafia-gold">Služby a Ceník</Link>
              <Link href="/#operativi" className="text-xs font-bold uppercase tracking-widest hover:text-mafia-gold">Náš Tým</Link>
              <Link href="/pribeh" className="text-xs font-bold uppercase tracking-widest hover:text-mafia-gold">Příběh MM</Link>
              <Link href="/zapisnik" className="text-xs font-bold uppercase tracking-widest hover:text-mafia-gold">Archiv Záznamů</Link>
              <Link href="/fade-gallery" className="text-xs font-bold uppercase tracking-widest hover:text-mafia-gold">Fade Galerie</Link>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="https://is.mmbarber.cz/"
              className="bg-mafia-gold text-mafia-black px-16 py-6 font-heading font-black uppercase tracking-[0.3em] text-lg shadow-[0_0_50px_rgba(197,160,89,0.3)]"
            >
              REZERVACE ONLINE
            </motion.a>
            <p className="mt-8 text-[10px] font-mono opacity-20 uppercase tracking-[0.5em] text-center">
              Keywords: {keywords.join(', ')}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="fixed left-6 top-1/2 -rotate-90 origin-left text-[8px] font-mono text-white/5 uppercase tracking-[1em] whitespace-nowrap pointer-events-none">
        STATIC_LANDING_PAGE_SEO_V3.3
      </div>
    </main>
  );
}
