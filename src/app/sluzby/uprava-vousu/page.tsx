'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Flame, Droplets, Shield, Sparkles } from 'lucide-react';

export default function BeardTrimPage() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-mafia-gold selection:text-black overflow-hidden font-sans">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center border-b border-white/5">
        <motion.div 
          className="absolute inset-0 z-0 bg-[url('/images/barber-dark.jpg')] bg-cover bg-center opacity-20 grayscale"
          style={{ y: y1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202] z-10" />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="w-12 h-[1px] bg-mafia-gold" />
            <span className="text-mafia-gold font-mono uppercase tracking-[0.4em] text-xs font-bold">Expertní průvodce</span>
            <div className="w-12 h-[1px] bg-mafia-gold" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-heading text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.9]"
          >
            Kult <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mafia-gold via-[#e6c17a] to-mafia-gold">Vousů</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-smoke-white/60 font-serif italic text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed"
          >
            "Dobře upravené vousy vypráví příběh dřív, než promluvíte. Jsou symbolem trpělivosti a charakteru."
          </motion.p>
        </div>

        <motion.div 
          style={{ opacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <span className="text-[9px] uppercase tracking-widest text-smoke-white/40 font-mono">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-mafia-gold to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* Chapter 1: Anatomy & Hot Towel */}
      <section className="relative py-32 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            style={{ y: y2 }}
            className="relative h-[600px] w-full rounded-sm overflow-hidden order-2 md:order-1"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-mafia-gold/20 to-transparent z-10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-black/40 z-0" />
            {/* Zástupný prvek pro design */}
            <div className="w-full h-full border border-white/10 flex items-center justify-center bg-[#050505]">
              <div className="text-center space-y-4 opacity-50">
                <Flame className="mx-auto text-mafia-gold" size={48} />
                <p className="font-mono text-xs uppercase tracking-widest text-mafia-gold mt-4">Rituál horkého ručníku</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8 order-1 md:order-2"
          >
            <div className="flex items-center gap-4">
              <span className="text-6xl font-black font-heading text-white/5">01</span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-wide">Rituál & <br/><span className="text-mafia-gold">Hot Towel</span></h2>
            </div>
            
            <div className="prose prose-invert prose-p:text-smoke-white/80 prose-p:leading-relaxed prose-p:font-sans">
              <p>
                Kůže na obličeji pod vousy trpí. Vysychá, loupe se a póry se uzavírají. Úprava vousů u nás proto není jen
                mechanické zkrácení, ale komplexní lázeňský rituál.
              </p>
              <p>
                Vše začíná aplikací prémiového oleje před holením (pre-shave oil). Následuje zlatý hřeb – <strong>Hot Towel</strong>.
                Napařený, horký ručník přiložený na tvář. Tento proces uvolní svalové napětí, otevře póry a maximálně změkčí tvrdé vousy. 
                Díky tomu břitva klouže po tváři bez jakéhokoliv podráždění kůže.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
              <div className="space-y-2">
                <Droplets className="text-mafia-gold mb-4" size={24} />
                <h4 className="text-white font-bold uppercase text-sm tracking-wider">Hydratace</h4>
                <p className="text-smoke-white/60 text-xs">Příprava pokožky na čepel. Zabraňuje zarůstání chloupků.</p>
              </div>
              <div className="space-y-2">
                <Shield className="text-mafia-gold mb-4" size={24} />
                <h4 className="text-white font-bold uppercase text-sm tracking-wider">Cold Towel</h4>
                <p className="text-smoke-white/60 text-xs">Závěrečný ledový ručník pro šokové uzavření pórů a zklidnění.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapter 2: Shape & Architecture */}
      <section className="relative py-32 bg-[#050505] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <span className="text-mafia-gold font-mono uppercase tracking-widest text-xs font-bold mb-4 block">Kapitola II</span>
            <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight">Architektura <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-smoke-white/50">Tváře</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Linie krku (Neckline)",
                desc: "Nejčastější chyba domácího holení. Příliš vysoko vyholený krk tvoří dvojitou bradu, příliš nízko vypadá neupraveně. Hledáme zlatý střed přesně nad ohryzkem, který definuje ostrou čelist."
              },
              {
                title: "Tvarování objemu",
                desc: "Vousy nerostou všude stejně rychle a stejně hustě. Pomocí techniky 'freehand' (stříhání přes hřeben a nůžkami v prostoru) odebíráme objem pod ušima a necháváme jej na bradě, čímž tvář maskulině prodlužujeme."
              },
              {
                title: "Linie lícních kostí",
                desc: "Horní linie vousů musí podtrhnout vaše lícní kosti. Zarovnáváme ji tradiční ostrou břitvou s vyměnitelnou čepelí pro chirurgickou přesnost a čistotu kontur."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-[#020202] p-8 border border-white/5 hover:border-mafia-gold/30 transition-colors duration-500 group"
              >
                <div className="text-mafia-gold/20 font-heading text-6xl font-black mb-6 group-hover:text-mafia-gold/40 transition-colors">0{i+1}</div>
                <h3 className="text-xl font-bold uppercase tracking-wide mb-4 text-white">{item.title}</h3>
                <p className="text-smoke-white/70 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter 3: Advanced Methods */}
      <section className="relative py-32 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <span className="text-6xl font-black font-heading text-white/5">03</span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-wide">Tradiční i <br/><span className="text-mafia-gold">Moderní metody</span></h2>
            </div>
            
            <div className="prose prose-invert prose-p:text-smoke-white/80 prose-p:leading-relaxed prose-p:font-sans">
              <p>
                Nejsme jen o strojcích a nůžkách. Ovládáme kompletní péči o vaši tvář, spojující to nejlepší z tradičních i moderních holičských postupů. 
                Používáme jak starou školu s <strong>tradičním mýdlem na holení a štětkou</strong>, tak i moderní <strong>transparentní gely</strong> pro precizní konturování.
              </p>
              <p>
                A nezapomínáme ani na detaily, které dělají rozdíl. Pro ty, kteří chtějí dokonalou hladkost, nabízíme <strong>parní holení</strong> (napařování aktivní párou pro maximální otevření pórů). 
                K tomu přidáváme tradiční <strong>opalování uší ohněm</strong> a rychlou <strong>depilaci chloupků voskem</strong> (nos, uši, tváře). 
                Kompletní očista pro dokonalý pocit.
              </p>
            </div>
          </motion.div>

          <motion.div 
            style={{ y: y1 }}
            className="relative h-[500px] w-full rounded-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/images/beard.jpg')] bg-cover bg-center grayscale opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#020202] via-transparent to-transparent z-10" />
            <div className="w-full h-full border border-white/10 flex items-center justify-center bg-[#050505]/50 backdrop-blur-sm relative z-20">
              <div className="text-center space-y-4 opacity-70">
                <Flame className="mx-auto text-mafia-gold" size={48} />
                <p className="font-mono text-xs uppercase tracking-widest text-mafia-gold mt-4">Vosk & Oheň & Pára</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conclusion & CTA */}
      <section className="py-32 px-4 text-center border-t border-white/5">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <Sparkles className="mx-auto text-mafia-gold mb-8 animate-pulse" size={32} />
          <h2 className="text-3xl font-heading font-black uppercase tracking-widest mb-6">Zažijte ten rozdíl</h2>
          <p className="text-smoke-white/60 mb-10">Protože ostré kontury a zdravé vousy změní to, jak se na vás dívá svět.</p>
          
          <a 
            href="/#operativi"
            className="inline-block px-12 py-4 bg-mafia-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors duration-300 rounded-sm"
          >
            Rezervovat úpravu
          </a>
        </motion.div>
      </section>

    </div>
  );
}
