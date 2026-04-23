"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface AboutMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutMeModal({ isOpen, onClose }: AboutMeModalProps) {
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
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-md cursor-crosshair"
            onClick={onClose}
          />

          {/* Grain Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

          {/* Content Container */}
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-[#0a0a0a] border border-mafia-gold/30 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/40 hover:text-mafia-gold transition-all p-2 z-50 group active:scale-95"
              aria-label="Zavřít"
            >
              <X size={28} />
            </button>

            {/* Header Decorations */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-mafia-gold/50 to-transparent z-40"></div>
            
            {/* Background Text Overlay */}
            <div className="absolute -top-10 -left-10 text-[120px] font-black text-white/[0.02] select-none pointer-events-none uppercase">
                MMBarber
            </div>

            {/* Scrollable Content */}
            <div className="relative z-10 p-8 md:p-12 overflow-y-auto custom-scrollbar flex-1">
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full border border-mafia-gold/50 flex items-center justify-center text-mafia-gold bg-mafia-gold/5">
                    <User size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-widest leading-none">O mně</h2>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mt-2">Dossier: Zakladatel MMBarber</p>
                </div>
              </div>

              <div className="space-y-6 text-smoke-white/80 font-sans leading-relaxed text-sm md:text-base">
                <p>
                  Střední školu jsem vystudoval na SŠPHZ v Uherském Hradišti, obor elektrotechnika. 
                  Poté jsem nastoupil na vysokou školu FLKŘ UTB, ale po čase jsem se rozhodl vydat jiným směrem. 
                  Nastoupil jsem do firmy, kde jsem pracoval zhruba půl roku. Následně jsem si dodělal rekvalifikaci na kadeřníka.
                </p>

                <p>
                  Během té doby se mi naskytla příležitost stříhat v Brně, a tak jsem se snažil dojíždět, jak jen to šlo. 
                  Zároveň jsem začal studovat sociální pedagogiku, kterou jsem úspěšně dokončil.
                </p>

                <p className="border-l-2 border-mafia-gold/20 pl-6 italic text-smoke-white/60">
                  Poslední rok pro mě byl poměrně náročný – státnice, bakalářská práce, práce, budování vlastního podniku 
                  a také rozchod s přítelkyní po přibližně sedmi letech. Většinu věcí jsem si od té doby musel odmakat sám – 
                  stříhat, pracovat, dotahovat věci do konce. Protože co si člověk neudělá sám, to nemá. 
                  A hlavně – dělat věci jinak než ostatní.
                </p>

                <p>
                  Teď se díváš na moje webovky. Možná tím někoho inspiruji, možná někoho motivuji něco v životě změnit. 
                  Upřímně se ale nepovažuji za nic výjimečného. Prostě stříhám.
                </p>

                <p>
                  Myslím si, že i když člověk něčeho dosáhne, nemusí si psát tituly před jméno, povyšovat se ani si na něco hrát – 
                  a to ani kdyby vedl firmu. Pracuji s mladými lidmi a snažím se jim předat něco do života. 
                  Něco, na čem budou moct stavět dál a jednou mě třeba i překonat.
                </p>

                <p>
                  Možná jednou najdu své místo jinde. V něčem novém, co budu znovu budovat – sám, nebo s těmi správnými lidmi.
                </p>

                <div className="pt-8 border-t border-white/5 mt-8">
                    <p className="text-mafia-gold font-bold italic mb-2">Nepovažuji se za barbera ani za něco víc. Jsem jen člověk.</p>
                    <p className="text-white/20 font-mono text-xs uppercase tracking-[0.4em]">Prach jsi a v prach se obrátíš.</p>
                </div>
              </div>

              {/* Signature / Stamp */}
              <div className="mt-12 flex justify-end">
                <div className="border-2 border-mafia-gold/20 p-4 rounded flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <ShieldCheck className="text-mafia-gold" size={32} />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-mafia-gold uppercase font-bold tracking-widest">Authorized by</span>
                        <span className="text-lg font-heading font-black text-white/90 leading-none">MMBARBER</span>
                    </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
