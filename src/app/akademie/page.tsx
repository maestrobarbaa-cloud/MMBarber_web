'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Rocket, CheckCircle, ArrowRight, BookOpen, Scissors, Target, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DedicatedAkademiePage() {
  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white relative overflow-hidden font-sans">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[url('/img/noise.png')] mix-blend-overlay" />
      <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(197,160,89,0.15)_0%,transparent_60%)] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-mafia-gold/50 hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-[0.3em] mb-12"
        >
          <ChevronLeft size={14} />
          ZPĚT NA ZÁKLADNU
        </Link>

        {/* Hero SEKCE */}
        <section className="mb-24 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mafia-gold/30 bg-mafia-gold/10 text-mafia-gold text-xs font-bold uppercase tracking-widest mb-6">
              <Rocket size={14} /> Akademie pro začátečníky
            </div>
            <h1 className="text-4xl md:text-7xl font-heading font-black uppercase tracking-tighter leading-[0.9] mb-6">
              Nová krev.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mafia-gold via-yellow-200 to-mafia-gold">
                Nová mentalita.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed mb-8">
              Máš drajv, ale chybí ti nůžky v ruce? Značka MMBarber není jen o střihání, je o přístupu. Naučíme tě řemeslo i mindset od absolutních základů.
            </p>
            <Link 
              href="/#kontakt"
              className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-mafia-gold text-mafia-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors shadow-[0_0_30px_rgba(197,160,89,0.4)]"
            >
              Přihlásit se
              <ArrowRight size={18} />
            </Link>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="md:w-1/2 relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-[url('/obr/komunita/komunita_1.jpg')] bg-cover bg-center opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-tr from-mafia-black to-transparent" />
          </motion.div>
        </section>

        {/* Co se naučíš */}
        <section className="py-24 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-black uppercase mb-4">Co tě čeká</h2>
            <p className="text-white/50 font-mono tracking-widest text-sm">TVRDÁ DŘINA, KTERÁ SE VYPLATÍ</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Scissors size={32} />, title: "Řemeslo od 0", text: "Držení nůžek, strojku a kompletní anatomie střihu." },
              { icon: <BookOpen size={32} />, title: "Komunikace", text: "Jak jednat s klientem, budovat si vztah a prodat svou hodnotu." },
              { icon: <Target size={32} />, title: "Mindset", text: "Jak nepřestat, když to nejde, a jak se vypracovat mezi elitu." },
              { icon: <Clock size={32} />, title: "Intenzivní praxe", text: "Stovky hodin na živých modelech pod přísným dohledem." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-black/40 border border-white/5 p-8 hover:border-mafia-gold/30 transition-colors group"
              >
                <div className="text-mafia-gold mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">{item.icon}</div>
                <h3 className="text-xl font-bold uppercase mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
