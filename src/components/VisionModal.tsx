"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Heart, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface VisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VisionModal({ isOpen, onClose }: VisionModalProps) {
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
          className="fixed inset-0 z-[10002] flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/98 backdrop-blur-2xl cursor-crosshair"
            onClick={onClose}
          />

          {/* Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          {/* Content Container */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[85vh] bg-[#080808] border border-mafia-gold/20 shadow-[0_0_150px_rgba(197,160,89,0.1)] overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/20 hover:text-mafia-gold transition-all z-50 p-2"
              aria-label="Zavřít"
            >
              <X size={24} />
            </button>

            {/* Accent Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-mafia-gold/5 blur-3xl -z-10"></div>

            {/* Scrollable Content */}
            <div className="relative z-10 p-10 md:p-14 overflow-y-auto custom-scrollbar flex-1">
              
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 border-2 border-mafia-gold/30 flex items-center justify-center text-mafia-gold">
                    <Target size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] leading-none">Vize & Budoucnost</h2>
                    <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.4em] mt-2">Dossier: Corporate Strategy & Legacy</p>
                </div>
              </div>

              <div className="space-y-8 text-smoke-white/80 font-sans leading-relaxed text-sm md:text-base">
                <p className="font-bold text-white uppercase tracking-wider text-xs border-b border-mafia-gold/20 pb-2">I. Výzva a Odhodlání</p>
                <p>
                  Kdybych měl dostat příležitost pomoct nějaké firmě posunout se jiným směrem, nešlo by mi v první řadě o peníze. 
                  Bral bych to jako výzvu — buď to vyjde, nebo ne. Ale přistupoval bych k tomu tak, aby to vyjít muselo. 
                  S maximálním nasazením, jako by to byl můj vlastní projekt.
                </p>

                <p>
                  Ke svému podnikání už dnes přistupuji skoro jako k vlastnímu dítěti. Vím, kolik úsilí, času a energie za tím stojí. 
                  A úplně stejně bych přemýšlel i u cizí firmy — jako někdo, komu na tom skutečně záleží.
                </p>

                <p className="font-bold text-white uppercase tracking-wider text-xs border-b border-mafia-gold/20 pb-2">II. Hodnota za Vizitkou</p>
                <p>
                  Formální pozice nebo vizitky pro mě nikdy nebyly to hlavní. Důležité je, aby firma fungovala. 
                  Každá koruna by měla mít smysl — investovat do lidí, kteří opravdu pracují a chtějí firmu posouvat dál. 
                  Hledat řešení, nové cesty, nebát se přemýšlet jinak a jít naplno.
                </p>

                <p>
                  To samé se snažím předávat lidem kolem sebe. Ne vždy je to jednoduché — ne každý má nastavení na dlouhodobou práci a odpovědnost. 
                  Ale věřím, že se to dá postupně naučit. Za každým výsledkem je dlouhodobá práce, zkušenosti a chyby. 
                  Velkou školou pro mě bylo i holičství. Často právě z těch rozhovorů s lidmi z praxe získá člověk víc než kdekoliv jinde.
                </p>

                <div className="relative p-6 bg-white/[0.03] border-l-4 border-mafia-gold">
                    <TrendingUp className="absolute -top-3 -right-3 text-mafia-gold/20" size={64} />
                    <p className="italic text-smoke-white/90">
                      Do budoucna bych rád předal svoje místo mladším a posunul se dál. Možná i do věcí, které mi nejsou úplně přirozené — 
                      třeba vystupování před kamerou. Není to komfortní, ale věřím, že trénink posouvá dál.
                    </p>
                </div>

                <p className="font-bold text-white uppercase tracking-wider text-xs border-b border-mafia-gold/20 pb-2">III. Kvalita a Tým</p>
                <p>
                  Zároveň si myslím, že kvalita by měla být standard. Ať už jde o video, web nebo prezentaci. 
                  Dnes je snadné dělat věci rychle a levně, ale ne vždy to přináší dobrý výsledek. 
                  Někdy má smysl si věci udělat po svém — kvalitněji a s větším důrazem na detail.
                </p>

                <p>
                  Dlouhou dobu jsem jel naplno — práce, provoz, tvorba, všechno najednou. Na osobní život často nezbýval prostor. 
                  Postupně ale přichází fáze, kdy si člověk uvědomí, že všechno sám dělat nemůže. Že je potřeba mít kolem sebe tým. 
                  A právě to je jedna z nejtěžších věcí — vybudovat lidi, kteří vás jednou přerostou.
                </p>

                <p className="font-bold text-white uppercase tracking-wider text-xs border-b border-mafia-gold/20 pb-2">IV. Společenský Rozměr</p>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1 space-y-4">
                        <p>
                        I proto se snažím něco vracet — například tím, že nabízím střihání zdarma dětem z dětského domova. 
                        Nejde jen o pomoc jako takovou, ale i o přístup. Možná víc než peníze má smysl dát příležitost, zkušenost a směr.
                        </p>
                        <p>
                        Do budoucna by mi dávalo smysl tyhle děti víc zapojit — ukázat jim prostředí práce, naučit je základům, 
                        dát jim možnost něco si vyzkoušet.
                        </p>
                    </div>
                    <div className="w-full md:w-32 h-32 border border-mafia-gold/20 flex flex-col items-center justify-center bg-mafia-gold/5 p-4 text-center">
                        <Heart className="text-mafia-gold mb-2" size={24} />
                        <span className="text-[8px] font-mono text-white/50 uppercase tracking-widest leading-tight">Social Legacy Program</span>
                    </div>
                </div>

                <p className="text-center pt-8 font-heading font-black text-mafia-gold uppercase tracking-[0.3em] text-sm">
                   Najít vlastní způsob, který dává smysl — i když je jiný.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
