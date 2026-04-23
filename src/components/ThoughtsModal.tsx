"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Brain, Quote, Lock } from "lucide-react";
import { useEffect, useState } from "react";

interface ThoughtsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThoughtsModal({ isOpen, onClose }: ThoughtsModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/98 backdrop-blur-xl cursor-crosshair"
            onClick={onClose}
          />

          {/* Abstract background noise */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>

          {/* Content Container */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, rotateY: 10 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.95, opacity: 0, rotateY: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl max-h-[85vh] bg-[#0c0c0c] border border-white/5 shadow-[0_0_150px_rgba(0,0,0,1)] overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/20 hover:text-mafia-gold transition-all z-50 group"
              aria-label="Zavřít"
            >
              <X size={24} />
            </button>

            {/* Top Bar Decoration */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Scrollable Content */}
            <div className="relative z-10 p-10 md:p-14 overflow-y-auto custom-scrollbar flex-1">
              
              <div className="flex items-center gap-4 mb-12">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40">
                    <Brain size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-heading font-black text-white/90 uppercase tracking-widest leading-none">Úvahy</h2>
                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] mt-2">Status: DEEP OBSERVATION</p>
                </div>
              </div>

              <div className="space-y-8 text-smoke-white/70 font-sans leading-relaxed text-sm md:text-base">
                <p>
                  Ceny nemovitostí rostou a tlak na životní úroveň je čím dál větší. Do toho vstupují sociální sítě, které výrazně ovlivňují naše vnímání reality. 
                  Na platformách jako Instagram lidé často sledují trendy a přirozeně se jim přizpůsobují. Není to nutně špatně — je to lidské. 
                  Problém ale nastává ve chvíli, kdy člověk začne ztrácet vlastní směr.
                </p>

                <div className="relative py-4">
                    <Quote className="absolute -top-2 -left-4 text-white/5" size={48} />
                    <p className="relative z-10 italic border-l border-mafia-gold/30 pl-6 text-smoke-white/90 bg-white/[0.02] p-4">
                      V psychologii existuje princip zrcadlení — lidé mají tendenci napodobovat chování, názory nebo styl těch, které obdivují nebo mezi které chtějí zapadnout. 
                      Díky tomu se propojujeme, ale zároveň to může vést k tomu, že přebíráme i věci, které nám ve skutečnosti nesedí.
                    </p>
                </div>

                <p>
                  Dnes není těžké narazit na projekty nebo byznysy, které stojí na silných emocích. Některé z nich lidem opravdu pomáhají, jiné spíš využívají jejich nejistoty. 
                  Proto je důležité přemýšlet nad tím, čemu věnujeme pozornost a komu věříme.
                </p>

                <p>
                  Osobně jsem si prošel obdobím, kdy jsem se snažil podporovat partnerku v jejích cílech a dělal maximum pro vztah. 
                  Když to skončilo právě v době, kdy jsem pracoval na tomhle projektu, nebylo to jednoduché. Dokončit to stálo hodně energie.
                </p>

                <p>
                  I při tvorbě webu jsem narazil na rozdílné názory s lidmi kolem sebe. Chápu pohled na jednoduchost a efektivitu. 
                  Zároveň si ale myslím, že pokud chce člověk vytvořit něco smysluplného, musí hledat vlastní cestu — jinak snadno zapadne mezi ostatní.
                </p>

                <div className="bg-mafia-gold/5 border border-mafia-gold/10 p-6 space-y-4">
                  <p className="text-mafia-gold font-bold">Otázka, kterou si kladu, je jednoduchá: jak dnes pomoct lidem najít kvalitní vztah? Jak se v tom všem neztratit a zůstat sám sebou?</p>
                </div>

                <p>
                  Život má vždy své plusy i mínusy a každá zkušenost nás nějak formuje. Někdy se snažíte dát maximum a přesto to nestačí. 
                  Jindy vidíte, jak snadné je přizpůsobit se okolí a působit šťastně — i když realita může být jiná.
                </p>

                <p>
                  Možná i proto někteří lidé tíhnou k těm, kteří působí bezstarostně a mají dostatek času. Je ale dobré se zamyslet, co za tím skutečně stojí.
                </p>

                <p className="text-white/40 uppercase text-xs tracking-widest font-black text-center pt-8">
                    Hledat autenticitu — u sebe i u ostatních.
                </p>

                <p className="text-white/20 text-[11px] font-mono leading-relaxed mt-12 border-t border-white/5 pt-8">
                  Občas mám pocit, že procházím mezi lidmi skoro neviditelně. Možná je to i tím, jak se člověk prezentuje navenek. 
                  Ale i to mi připomíná, jak moc záleží na detailech — a jak snadno může být realita jiná, než jak působí.
                </p>
              </div>

              <div className="mt-16 flex justify-center opacity-20 hover:opacity-100 transition-opacity">
                 <Lock size={16} className="text-white/40" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
