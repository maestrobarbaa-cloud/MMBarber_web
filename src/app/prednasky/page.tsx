'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, GraduationCap, ArrowRight, Brain, Lightbulb, Users, Target } from 'lucide-react';
import Link from 'next/link';

export default function PrednaskyPage() {
  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white relative overflow-hidden font-sans">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[url('/img/noise.png')] mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(197,160,89,0.1)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-mafia-gold/50 hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-[0.3em] mb-12"
        >
          <ChevronLeft size={14} />
          ZPĚT NA ZÁKLADNU
        </Link>

        {/* Hero */}
        <section className="mb-24 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 bg-mafia-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-mafia-gold/20">
              <GraduationCap size={40} className="text-mafia-gold" />
            </div>
            <h1 className="text-4xl md:text-7xl font-heading font-black uppercase tracking-tighter leading-tight mb-6">
              Přednášky & <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mafia-gold via-yellow-200 to-mafia-gold">
                Mentoring
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-white/60 font-light leading-relaxed">
              Sdílím svůj příběh, techniky a mindset, který mi pomohl vybudovat odkaz. Pro školy, firmy i mladé talenty.
            </p>
          </motion.div>
        </section>

        {/* Co si odnesete */}
        <section className="py-24 relative border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-black uppercase mb-4">Co ode mě uslyšíte</h2>
            <p className="text-white/50 font-mono tracking-widest text-sm">ŽÁDNÉ TEORIE, JEN PRAXE</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Brain size={32} />, title: "Mindset vítěze", text: "Jak přeprogramovat své myšlení na úspěch a přestat se bát chyb." },
              { icon: <Lightbulb size={32} />, title: "Budování značky", text: "Proč nestačí jen dobré řemeslo a jak vytvořit prémiový brand." },
              { icon: <Users size={32} />, title: "Komunita", text: "Jak vybudovat loajální klientelu a tým, který s vámi dýchá." },
              { icon: <Target size={32} />, title: "Cesta z nuly", text: "Můj reálný příběh od prvních střihů až po budování impéria." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-black/40 border border-white/5 p-8 hover:border-mafia-gold/30 transition-colors group rounded-xl"
              >
                <div className="text-mafia-gold mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">{item.icon}</div>
                <h3 className="text-xl font-bold uppercase mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Výzva k akci */}
        <section className="py-24 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-mafia-gold text-mafia-black p-12 md:p-20 rounded-2xl text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/img/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-heading font-black uppercase mb-6">Pozvěte mě k vám</h2>
              <p className="font-medium opacity-80 text-lg mb-10">
                Chcete ukázat svým studentům nebo týmu, že s tvrdou prací je možné všechno? Napište mi a domluvíme termín.
              </p>
              <Link 
                href="/#kontakt" 
                className="inline-flex items-center justify-center gap-3 bg-mafia-black text-white px-10 py-5 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow-2xl"
              >
                Kontaktovat Tomáše
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </section>

      </div>
    </main>
  );
}
