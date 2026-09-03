'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Scissors, Ruler, Shield, Sparkles } from 'lucide-react';

export default function HaircutPage() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-mafia-gold selection:text-black overflow-hidden font-sans">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center border-b border-white/5">
        <motion.div 
          className="absolute inset-0 z-0 bg-[url('/images/barber-tools.jpg')] bg-cover bg-center opacity-20 grayscale"
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
            Anatomie <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mafia-gold via-[#e6c17a] to-mafia-gold">Střihu</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-smoke-white/60 font-serif italic text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed"
          >
            "Vlasy nejsou jen materiál. Jsou rámem vašeho obličeje a vizitkou vaší osobnosti."
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

      {/* Chapter 1: Geometry */}
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
              <span className="text-6xl font-black font-heading text-white/5">01</span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-wide">Geometrie & <br/><span className="text-mafia-gold">Tvar obličeje</span></h2>
            </div>
            
            <div className="prose prose-invert prose-p:text-smoke-white/80 prose-p:leading-relaxed prose-p:font-sans">
              <p>
                Každá lebka je unikátní. Profesionální barber nestříhá podle šablony, ale podle geometrie. 
                Před prvním zásahem nůžek či strojku analyzujeme strukturu vaší lebky, růstové víry (tzv. kravské lízance) a směr růstu vlasů.
              </p>
              <p>
                Cílem správného střihu je vytvořit <strong>iluzi dokonalého oválu</strong>. Pokud máte kulatější obličej, 
                potřebujeme po stranách vytvořit ostřejší hrany a nechat větší objem nahoře, abychom obličej opticky protáhli. 
                Naopak u úzkých obličejů zachováváme více objemu po stranách.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
              <div className="space-y-2">
                <Ruler className="text-mafia-gold mb-4" size={24} />
                <h4 className="text-white font-bold uppercase text-sm tracking-wider">Měření a Úhly</h4>
                <p className="text-smoke-white/60 text-xs">Precizní vyvážení stran pro dosažení symetrie i na asymetrickém základu.</p>
              </div>
              <div className="space-y-2">
                <Scissors className="text-mafia-gold mb-4" size={24} />
                <h4 className="text-white font-bold uppercase text-sm tracking-wider">Texturizace</h4>
                <p className="text-smoke-white/60 text-xs">Odebrání hmoty tam, kde překáží, a podpora přirozeného pohybu vlasů.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            style={{ y: y2 }}
            className="relative h-[600px] w-full rounded-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-mafia-gold/20 to-transparent z-10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-black/40 z-0" />
            {/* Zástupný prvek pro design */}
            <div className="w-full h-full border border-white/10 flex items-center justify-center bg-[#050505]">
              <div className="text-center space-y-4 opacity-50">
                <div className="w-32 h-32 rounded-full border-[0.5px] border-mafia-gold/30 mx-auto flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-[0.5px] border-mafia-gold/50 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-[0.5px] border-mafia-gold" />
                  </div>
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-mafia-gold">Zlatý řez</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapter 2: Skin Fade Detail */}
      <section className="relative py-32 bg-[#050505] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <span className="text-mafia-gold font-mono uppercase tracking-widest text-xs font-bold mb-4 block">Kapitola II</span>
            <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight">Umění <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-smoke-white/50">Skin Fade</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Foil Shaver & Čisté plátno",
                desc: "Základem pravého skin fadu není jen nula na strojku. Pro dosažení absolutní hladkosti kůže používáme planžetový strojek (Foil Shaver), který oholí vlasy těsně na kůži. Vzniká tak dokonalé 'čisté plátno'."
              },
              {
                title: "Přechod a Blending",
                desc: "Samotné kouzlo spočívá v technice blendingu (stínování). Postupně měníme výšku nože (tzv. pákou na strojku) po milimetrech a střídáme nástavce. Cílem je neviditelný, kouřový přechod (blur effect) bez jediné čáry."
              },
              {
                title: "Váha a Tvar (Weight Line)",
                desc: "Skin fade není jen o vystříhání do ztracena. Zásadní je, kde necháme váhu (tzv. weight line). Zda uděláme High, Mid nebo Low fade, závisí čistě na tvaru vaší lebky a na tom, co chcete vizuálně zdůraznit."
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

      {/* Chapter 3: Comprehensive Service */}
      <section className="relative py-32 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            style={{ y: y1 }}
            className="relative h-[500px] w-full rounded-sm overflow-hidden order-2 md:order-1"
          >
            <div className="absolute inset-0 bg-[url('/images/barber-dark.jpg')] bg-cover bg-center grayscale opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-transparent z-10" />
            <div className="w-full h-full border border-white/10 flex items-center justify-center bg-[#050505]/50 backdrop-blur-sm relative z-20">
              <div className="text-center space-y-4 opacity-70">
                <Scissors className="mx-auto text-mafia-gold" size={48} />
                <p className="font-mono text-xs uppercase tracking-widest text-mafia-gold mt-4">Všechny Styly & Barvení</p>
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
              <span className="text-6xl font-black font-heading text-white/5">03</span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-wide">Komplexní <br/><span className="text-mafia-gold">Servis</span></h2>
            </div>
            
            <div className="prose prose-invert prose-p:text-smoke-white/80 prose-p:leading-relaxed prose-p:font-sans">
              <p>
                Ačkoli je Skin Fade naší ikonou, <strong>stříháme naprosto všechny styly</strong>. Od klasických nůžkových střihů z 50. let, 
                přes texturované "crop" moderní sestřihy, až po dlouhé "surfařské" vlasy. Naše řemeslo nemá hranice.
              </p>
              <p>
                Nerozlišujeme pohlaví, pouze tvar hlavy a styl. Pokud ženy touží po dokonale čistém a ostrém "barber" stylu, 
                naše křeslo je jim plně otevřeno. Kromě střihů navíc nabízíme <strong>profesionální barvení vlasů i vousů</strong> pro sjednocení tónu, 
                zakrytí šedin nebo kompletní změnu vaší image.
              </p>
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
          <h2 className="text-3xl font-heading font-black uppercase tracking-widest mb-6">Připraven na změnu?</h2>
          <p className="text-smoke-white/60 mb-10">Střih, který drží tvar nejen první den, ale i po třech týdnech.</p>
          
          <a 
            href="/#operativi"
            className="inline-block px-12 py-4 bg-mafia-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors duration-300 rounded-sm"
          >
            Rezervovat termín
          </a>
        </motion.div>
      </section>

    </div>
  );
}
