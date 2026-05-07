"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Scissors, Sparkles, Ruler, Coins } from "lucide-react";

export function GroomingGuideArchive() {
  const articles = [
    {
      title: "Jak vybrat správný střih podle tvaru obličeje",
      icon: <Ruler className="text-mafia-gold" size={20} />,
      content: `Výběr střihu není jen o tom, co je v módě, ale o geometrii. 
      U oválného obličeje máte volnou ruku – sedne vám téměř vše od klasického pompadouru po krátký buzz cut. 
      Hranatý obličej vyžaduje zjemnění, proto doporučujeme střihy s delšími stranami nebo texturovaný vršek. 
      Kulatý obličej naopak potřebuje výšku a objem nahoře, aby se opticky prodloužil – zde kraluje high fade s výrazným stylingem. 
      V MMBARBER se na váš tvar obličeje podíváme dřív, než vezmeme do ruky strojek.`
    },
    {
      title: "Co je fade a jak ho nosit",
      icon: <Scissors className="text-mafia-gold" size={20} />,
      content: `Fade střih je symbolem moderního barbery. Jde o plynulý přechod z úplně krátkých stran (často až na kůži – skin fade) do delších vlasů nahoře. 
      Existuje několik variant: Low Fade (přechod začíná nízko u uší), Mid Fade (střední cesta) a High Fade (agresivní přechod vysoko na spáncích). 
      Fade vyžaduje údržbu – aby vypadal stále ostře, doporučujeme návštěvu barbershopu každé 2 až 3 týdny. 
      V Uherském Hradišti jsme mistři právě v precizních přechodech, které drží tvar.`
    },
    {
      title: "Jak pečovat o vousy",
      icon: <Sparkles className="text-mafia-gold" size={20} />,
      content: `Vousy jsou vaší vizitkou, ale bez péče se změní v chaos. Základem je pravidelné mytí speciálním šamponem, který nevysušuje kůži pod vousy. 
      Každodenní rituál by měl zahrnovat olej na vousy, který změkčuje chlupy a vyživuje pokožku, a následné pročesání kartáčem z kančích štětin. 
      Pokud jsou vaše vousy delší, sáhněte po balzámu pro lepší styling. 
      Nezapomínejte na kontury – ty vám břitvou srovnáme v MMBARBER, aby váš look měl jasný řád a respekt.`
    },
    {
      title: "Barber vs. kadeřník: Proč si připlatit?",
      icon: <Coins className="text-mafia-gold" size={20} />,
      content: `Kadeřník vás ostříhá, barber se o vás postará. Rozdíl není jen v ceně, ale v expertíze na mužskou anatomii a specifické techniky jako je práce s břitvou, napařování tváře (hot towel) a detailní úprava kontur. 
      V barbershopu MMABRBER v Uherském Hradišti dostáváte nejen špičkový servis, ale i prostor pro relaxaci v ryze mužském prostředí. 
      Investice do barbera je investicí do vlastního sebevědomí a stylu, který přežije i náročný pracovní týden.`
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-16 px-4">
      <div className="flex items-center gap-4 mb-12 border-b border-mafia-gold/20 pb-4">
        <BookOpen className="text-mafia-gold" size={32} />
        <div>
          <h2 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-[0.3em]">
            Průvodce stylem & Grooming Archiv
          </h2>
          <p className="text-mafia-gold/50 font-mono text-xs uppercase tracking-widest mt-1">
            Znalosti jsou základem každého respektovaného stylu
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-mafia-dark/40 border border-mafia-gold/10 p-8 hover:border-mafia-gold/30 transition-all duration-500"
          >
            <div className="absolute top-0 left-0 w-1 h-0 bg-mafia-gold group-hover:h-full transition-all duration-700" />
            
            <div className="flex items-center gap-3 mb-6">
              {article.icon}
              <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider group-hover:text-mafia-gold transition-colors">
                {article.title}
              </h3>
            </div>
            
            <p className="text-smoke-white/60 text-sm leading-relaxed font-sans">
              {article.content}
            </p>
            
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-mafia-gold">
                MMBARBER_LOG_{2026 + idx}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-1 h-1 bg-mafia-gold rounded-full" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 p-8 border border-mafia-gold/5 bg-mafia-gold/[0.02] text-center italic text-mafia-gold/40 text-sm font-serif">
        "Styl není jen o tom, co nosíte na hlavě, ale o tom, jak nesete sami sebe ve světě, který se neustále mění."
      </div>
    </div>
  );
}
