"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function FogLayer() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
      <div className="absolute inset-0 bg-smoke-white mix-blend-overlay animate-pulse" style={{ filter: 'blur(100px)' }}></div>
    </div>
  );
}

const StoryParagraph = ({ children, delay = 0, fadeOnHover = false }: { children: React.ReactNode, delay?: number, fadeOnHover?: boolean }) => {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
      className={`text-lg md:text-xl font-serif leading-relaxed text-smoke-white/80 tracking-wide mb-8 md:mb-12 transition-all duration-1000 ${fadeOnHover ? 'hover:text-mafia-gold/90 hover:drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]' : ''}`}
    >
      {children}
    </motion.p>
  );
}

export default function StoryEasterEgg() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ target: containerRef });
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div ref={containerRef} className="min-h-screen bg-black" />;

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative flex flex-col items-center overflow-x-hidden font-serif selection:bg-mafia-gold/30 selection:text-white">
      
      {/* Background layer */}
      <motion.div style={{ opacity: bgOpacity }} className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#0a0a0a]"></div>
        <FogLayer />
      </motion.div>

      {/* Top Nav */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 2 }}
        className="fixed top-8 left-8 z-50"
      >
        <Link 
          href="/" 
          className="group flex items-center gap-3 text-white/40 hover:text-white transition-all duration-500"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform duration-500" />
          <span className="tracking-widest uppercase text-xs font-sans">Návrat ze vzpomínek</span>
        </Link>
      </motion.div>

      {/* Content */}
      <div className="z-10 w-full max-w-2xl px-6 py-32 md:py-48 flex flex-col items-center text-center">
        
        <motion.h1 
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-heading text-mafia-gold uppercase tracking-[0.3em] mb-24 md:mb-32 drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]"
        >
          Základy a ozvěny
        </motion.h1>

        <StoryParagraph delay={0.5} fadeOnHover>
          Byli spolu dřív, než vůbec věděli, co znamená být spolu.
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          Vyrostli vedle sebe. Znali své první radosti, první chyby i první představy o tom, jak jednou bude vypadat jejich život. Nebyli jen pár. Byli si zvykem, bezpečím a kusem vlastního života.
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          On ji nikdy nechtěl mít menší.<br />Naopak.<br />Chtěl, aby jednou stála sama za sebe. Aby se nemusela sklánět před někým jen proto, že měl peníze, funkci nebo podepsanou smlouvu. Říkal jí, že jednou bude muset narazit sama. Že některé věci člověku nevysvětlíš. Některé si musí odžít.
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          A zatímco ona hledala cestu nahoru, on se mezitím začal pohybovat mezi lidmi, ke kterým se jiní dostávali až po letech. Sedával s řediteli firem, poslouchal jejich zkušenosti a sbíral věci, které se nedaly naučit ze školy.
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          Když se vracel domů, přinášel s sebou něco, co se snažil předat jí.
        </StoryParagraph>
        
        <div className="flex flex-col gap-2 my-8 md:my-12 font-sans uppercase tracking-[0.2em] text-sm text-mafia-gold/70">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>Zkušenost.</motion.span>
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }}>Rady.</motion.span>
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 1 }}>Možnost.</motion.span>
        </div>

        <StoryParagraph delay={0.2}>
          <span className="italic text-white/50">Možná někdy až příliš velkou.</span>
        </StoryParagraph>

        <StoryParagraph delay={0.2}>
          Protože člověk může druhému ukazovat dveře celé roky, ale nemůže ho donutit, aby jimi prošel.
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          A ona chtěla něco jiného.<br />
          Začala poznávat nové lidi. Nové názory. Nový způsob života. A s nimi začala pomalu poznávat i jinou verzi sebe samotné.
        </StoryParagraph>

        <StoryParagraph delay={0.2}>
          <span className="text-white/60">Nebo si alespoň myslela, že ji poznává.</span>
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          Čím víc hledala, tím méně věděla, co vlastně hledá.<br />
          Říkala, že jednou bude cestovat.<br />
          Že jednou bude žít jinak.<br />
          Že jednou bude šťastná.
        </StoryParagraph>

        <StoryParagraph delay={0.2}>
          Slova přicházela snadno.<br />
          <span className="text-white/40">Jen ty dny, kdy se měla proměnit ve skutečnost, nějak nepřicházely.</span>
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          On mezitím stavěl.<br />Nejen pro sebe.
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          V hlavě měl dva lidi, jeden domov a budoucnost, kterou si představoval společně. Pracoval, poznával lidi, učil se a snažil se vytvořit něco, o co by se jednou mohli oba opřít.
        </StoryParagraph>

        <StoryParagraph delay={0.2}>
          Možná si přitom ani nevšiml, že zatímco staví dům pro dva, druhý člověk už přemýšlí, jestli v něm vůbec chce bydlet.
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          A pak přišla chvíle, kdy potřeboval čas.<br />
          Ne peníze.<br />
          Ne radu.<br />
          Jen chvíli pro sebe.<br />
          Možná poprvé za dlouhou dobu.
        </StoryParagraph>

        <StoryParagraph delay={0.2}>
          A právě tehdy zjistil, že některé dveře se otevíraly za jeho zády.
        </StoryParagraph>

        <div className="flex flex-col gap-2 my-8 md:my-12 font-sans uppercase tracking-[0.2em] text-sm text-red-900/60">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>Nejdřív jen jako otázka.</motion.span>
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }}>Potom jako podezření.</motion.span>
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 1, color: "rgba(197,160,89,0.8)" }}>A nakonec jako skutečnost.</motion.span>
        </div>

        <StoryParagraph delay={0.2} fadeOnHover>
          Někde mezi jejich společnými vzpomínkami a její představou o budoucnosti vzniklo místo pro někoho dalšího.<br />
          Možná to začalo mnohem dřív. Možná až tehdy.<br />
          To už dnes nikdo přesně nezjistí.
        </StoryParagraph>

        <StoryParagraph delay={0.2}>
          Člověk totiž někdy neztratí druhého v okamžiku, kdy odejde.<br />
          <span className="italic text-white/50 hover:text-mafia-gold/80 transition-colors duration-1000">Někdy ho ztrácí po malých částech dlouho předtím.</span>
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          A možná nejhorší na tom nebylo, že hledala někoho jiného.<br />
          Možná nejhorší bylo, že celou dobu hledala sama sebe — a přitom přestala vidět člověka, který vedle ní rostl od začátku.
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          On si dlouho myslel, že když někomu dáš všechno, co můžeš, jednoho dne to pochopí.<br />
          Jenže život takhle nefunguje.
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          Někomu můžeš dát zkušenosti.<br />
          Můžeš mu ukázat cestu.<br />
          Můžeš za něj nést část jeho strachu.<br />
          Můžeš pracovat na budoucnosti, kterou si představuješ společně.
        </StoryParagraph>

        <StoryParagraph delay={0.2}>
          <span className="text-mafia-gold/80 font-bold tracking-widest drop-shadow-[0_0_8px_rgba(197,160,89,0.4)]">Ale nemůžeš za něj chtít stejný život.</span>
        </StoryParagraph>

        <div className="w-px h-24 bg-gradient-to-b from-mafia-gold/0 via-mafia-gold/30 to-mafia-gold/0 my-16 mx-auto"></div>

        <StoryParagraph delay={0.2} fadeOnHover>
          A tak dva lidé, kteří kdysi vyrůstali spolu, jednoho dne zjistili, že dospěli každý někam jinam.
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          On zůstal stát u toho, co budoval.<br />
          Ona pokračovala v hledání.
        </StoryParagraph>

        <StoryParagraph delay={0.2}>
          <span className="italic text-white/50 text-sm hover:text-white/80 transition-colors duration-1000">A možná právě tady začíná ta část příběhu, kterou si musí každý přečíst sám.</span>
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          Protože jeden člověk v ní uvidí ženu, která promarnila něco, co měla přímo před sebou.<br />
          Jiný v ní uvidí ženu, která se konečně rozhodla hledat vlastní život.
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          Někdo uvidí muže, který pro druhého udělal všechno.<br />
          Jiný v něm možná uvidí člověka, který chtěl rozhodovat o tom, jak má život toho druhého vypadat.
        </StoryParagraph>

        <StoryParagraph delay={0.2}>
          A možná je pravda někde mezi tím.<br />
          Protože některé příběhy nemají jednoho viníka. Mají jen dva lidi, kteří si kdysi slíbili budoucnost — a potom každý začal psát jinou.
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          A někdy člověk pochopí cenu toho, co měl, až ve chvíli, kdy už to nemůže vzít zpátky.<br />
          Jestli je to její případ, to už není na něm.
        </StoryParagraph>

        <StoryParagraph delay={0.2} fadeOnHover>
          A jestli byla jeho představa společné budoucnosti skutečně tím nejlepším, co pro ně mohl udělat, to zase není na ní.
        </StoryParagraph>

        <StoryParagraph delay={0.2}>
          <span className="text-mafia-gold font-bold tracking-[0.2em] uppercase text-sm drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]">To rozhodne až čas.</span>
        </StoryParagraph>

        <StoryParagraph delay={0.2}>
          Protože některé odpovědi se nedají vynutit.<br />
          <span className="italic text-white/40 hover:text-white/90 transition-colors duration-1000">Musí se prožít.</span>
        </StoryParagraph>

        <div className="h-48"></div>
      </div>
    </div>
  );
}
