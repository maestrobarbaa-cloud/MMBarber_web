'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, Globe, Briefcase, Brain, ArrowRight, Rocket, Star, Fingerprint, Crown, GraduationCap, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

export default function AkademiePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const yBackground = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <main ref={containerRef} className="min-h-screen bg-mafia-black text-smoke-white relative overflow-hidden font-sans">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[url('/img/noise.png')] mix-blend-overlay" />
      <motion.div 
        style={{ y: yBackground }}
        className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(197,160,89,0.15)_0%,transparent_60%)] blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-mafia-gold/50 hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-[0.3em] mb-12"
        >
          <ChevronLeft size={14} />
          ZPĚT NA ZÁKLADNU
        </Link>

        {/* 1. HERO SEKCE */}
        <section className="min-h-[70vh] flex flex-col justify-center relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl md:text-8xl font-heading font-black uppercase tracking-tighter leading-[0.85] mb-8">
              CHCEŠ ŽÍT SVŮJ <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mafia-gold via-yellow-200 to-mafia-gold inline-block pb-4 drop-shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                VYSNĚNÝ ŽIVOT?
              </span>
            </h1>
            <p className="max-w-2xl text-lg md:text-2xl text-white/60 font-light leading-relaxed mb-12">
              Nejsme jen barbershop. <strong className="text-mafia-gold font-bold">Měníme mentalitu lidí.</strong> Posouváme to, co ostatní považují za nemožné. Budeš ten, kdo mění hru?
            </p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Link 
                href="#rozhodnuti"
                className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-mafia-gold text-mafia-black font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(197,160,89,0.4)]"
              >
                Vstoupit do vize
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* 2. LIFESTYLE (Bento Grid) */}
        <section className="py-24 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Karta 1 - Flexibilita */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 relative group overflow-hidden rounded-2xl bg-black/40 border border-mafia-gold/20 p-10 min-h-[400px] flex flex-col justify-end"
            >
              <div className="absolute inset-0 bg-[url('/obr/main-hero.png')] bg-cover bg-center opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative z-10">
                <Globe size={40} className="text-mafia-gold mb-6" />
                <h2 className="text-3xl md:text-5xl font-heading font-black uppercase text-white mb-4">Svoboda tvořit</h2>
                <p className="text-white/70 max-w-lg text-lg">
                  Chceš stříhat u nás v salonu a tvořit komunitní odkaz? Super. Chceš pracovat s notebookem od moře? Není problém. Zde si tvoříš pravidla hry ty.
                </p>
              </div>
            </motion.div>

            {/* Karta 2 - Mindset */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative group overflow-hidden rounded-2xl bg-mafia-gold text-mafia-black p-10 min-h-[400px] flex flex-col justify-between"
            >
              <Brain size={48} className="opacity-80" />
              <div>
                <h3 className="text-2xl font-heading font-black uppercase mb-4">Měníme<br/>Mentalitu</h3>
                <p className="font-medium opacity-80 text-sm">
                  Nejde jen o vlasy. Jde o způsob, jakým vnímáš svůj čas, svou hodnotu a své možnosti.
                </p>
              </div>
            </motion.div>

          </div>
        </section>

        {/* 3. ROZHODNUTÍ (Dvě cesty) */}
        <section id="rozhodnuti" className="py-32 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-heading font-black uppercase mb-6">Vyber si svou cestu</h2>
            <p className="text-white/50 font-mono tracking-widest text-sm">DVĚ MOŽNOSTI. JEDNA RODINA.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Cesta 1 - Hotový profík */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-12 border-2 border-white/10 hover:border-mafia-gold/50 bg-black/40 backdrop-blur-sm transition-all duration-300 relative group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
                <Crown size={80} className="text-mafia-gold" />
              </div>
              <h3 className="text-3xl font-heading font-black uppercase text-mafia-gold mb-6">Už jsi schopný člověk?</h3>
              <p className="text-white/60 mb-8 leading-relaxed">
                Máš vizi, máš zkušenosti a umíš vzít věci do vlastních rukou. Hledáš místo, kde tě nebudou brzdit, ale kde s námi můžeš budovat impérium.
              </p>
              <ul className="space-y-4 mb-12">
                <li className="flex items-center gap-3 text-sm font-bold text-white/80"><CheckCircle className="text-mafia-gold" /> Partnerský přístup</li>
                <li className="flex items-center gap-3 text-sm font-bold text-white/80"><CheckCircle className="text-mafia-gold" /> Maximální flexibilita</li>
              </ul>
              <Link 
                href="/kariera" 
                className="inline-block px-8 py-4 bg-white/5 border border-mafia-gold/30 text-mafia-gold hover:bg-mafia-gold hover:text-black font-bold uppercase tracking-widest text-xs transition-all"
              >
                Chci tvořit odkaz
              </Link>
            </motion.div>

            {/* Cesta 2 - Akademie / Začátečník */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-12 border-2 border-mafia-gold bg-mafia-gold/5 backdrop-blur-sm transition-all duration-300 relative group shadow-[0_0_40px_rgba(197,160,89,0.1)]"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
                <Rocket size={80} className="text-mafia-gold" />
              </div>
              <h3 className="text-3xl font-heading font-black uppercase text-white mb-6">Chceš se to naučit?</h3>
              <p className="text-white/80 mb-8 leading-relaxed">
                Ještě tam nejsi, ale máš neskutečný drajv. Naučíme tě to. Předáme ti naše know-how, techniku i tu správnou mentalitu úspěchu.
              </p>
              <ul className="space-y-4 mb-12">
                <li className="flex items-center gap-3 text-sm font-bold text-white/80"><CheckCircle className="text-mafia-gold" /> Profesionální trénink</li>
                <li className="flex items-center gap-3 text-sm font-bold text-white/80"><CheckCircle className="text-mafia-gold" /> Změna myšlení</li>
              </ul>
              <Link 
                href="/#kontakt" 
                className="inline-block px-8 py-4 bg-mafia-gold text-black hover:bg-white font-bold uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)]"
              >
                Chci do Akademie
              </Link>
            </motion.div>

          </div>
        </section>

        {/* 4. PŘEDNÁŠKY PRO ŠKOLY & VEŘEJNOST */}
        <section className="py-24 relative border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <div className="p-4 inline-block bg-mafia-gold/10 rounded-xl mb-6">
                <GraduationCap size={40} className="text-mafia-gold" />
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-black uppercase mb-6">Přednášky & Mentoring</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Pořádám přednášky pro školy i odbornou veřejnost. Sdílím svůj příběh, techniky a mindset, který mi pomohl vybudovat odkaz. Jako Tomáš Mička chci ukázat mladým talentům, že s tou správnou mentalitou a tvrdou dřinou je možné všechno.
              </p>
              <Link 
                href="/#kontakt" 
                className="inline-flex items-center gap-3 text-mafia-gold font-bold uppercase tracking-widest text-sm hover:text-white transition-colors group"
              >
                Pozvat mě na přednášku
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:w-1/2 relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10"
            >
              <div className="absolute inset-0 bg-[url('/obr/komunita/komunita_3.webp')] bg-cover bg-center opacity-40 hover:opacity-70 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-mafia-black to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* 5. OSOBNÍ PODĚKOVÁNÍ */}
        <section className="py-24 relative border-t border-white/5">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <HeartHandshake size={48} className="text-mafia-red mx-auto mb-8 opacity-80" />
            <h2 className="text-3xl font-playfair italic font-bold mb-8">
              "Děkuji každému z vás..."
            </h2>
            <div className="relative">
              <p className="text-xl text-white/70 leading-loose italic mb-10">
                Obrovské díky patří každému, kdo projde dveřmi našeho salonu. Neberu vás jen jako zákazníky, ale jako inspiraci. Učím se z vašich slov, příběhů a beru si je k srdci. Právě vy mě posouváte vpřed a díky vám má tenhle odkaz smysl.
              </p>
              <p className="font-heading font-black uppercase text-mafia-gold tracking-[0.3em]">
                Tomáš Mička
              </p>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-2">
                Zakladatel MMBarber
              </p>
            </div>
          </motion.div>
        </section>

      </div>
    </main>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 ${className}`}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
