"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, MessageSquare, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

interface WebInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WebInfoModal({ isOpen, onClose }: WebInfoModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { lang } = useTranslation();

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
          className="fixed inset-0 z-[10005] flex items-center justify-center p-4 md:p-8"
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
            initial={{ scale: 0.9, opacity: 0, y: 50, rotateX: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50, rotateX: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl bg-[#080808] border border-mafia-gold/30 shadow-[0_0_150px_rgba(197,160,89,0.15)] overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/20 hover:text-mafia-gold hover:scale-110 hover:rotate-90 transition-all z-50 p-2 group"
              aria-label="Zavřít"
            >
              <X size={28} />
              <div className="absolute inset-0 bg-mafia-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            {/* Top Design Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mafia-gold to-transparent opacity-50"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-mafia-gold/5 blur-[100px] rounded-full"></div>

            {/* Scrollable Content */}
            <div className="relative z-10 p-10 md:p-14 overflow-y-auto custom-scrollbar flex-1">
              
              <div className="flex items-center gap-5 mb-12">
                <div className="w-14 h-14 border-2 border-mafia-gold/40 flex items-center justify-center text-mafia-gold bg-mafia-gold/5 shadow-[0_0_20px_rgba(197,160,89,0.1)]">
                    <Globe size={28} className="animate-pulse" />
                </div>
                <div>
                    <h2 className="text-2xl font-heading font-black text-white uppercase tracking-[0.2em] leading-none">
                      {lang === 'cs' ? 'Filozofie Webu' : 'Web Philosophy'}
                    </h2>
                    <p className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.4em] mt-2">Manifest // Identita Zdrojového Kódu</p>
                </div>
              </div>

              <div className="space-y-10">
                {/* Main Quote Block */}
                <div className="relative p-8 bg-white/[0.02] border border-white/5 rounded-sm">
                  <div className="absolute -top-3 -left-3 text-mafia-gold/20">
                    <MessageSquare size={40} />
                  </div>
                  
                  <p className="text-lg md:text-xl text-smoke-white/90 font-sans italic leading-relaxed text-center">
                    {lang === 'cs' 
                      ? "„Při tvorbě webu jsem se dostal do konfliktu i se svými kamarády, ale jdu si vlastní cestou.“"
                      : "“During the creation of this website, I even got into conflicts with my friends, but I follow my own path.”"}
                  </p>
                </div>

                <div className="space-y-6 text-smoke-white/70 font-sans leading-relaxed text-sm md:text-base">
                  <p>
                    {lang === 'cs'
                      ? "Odmítám, aby moje stránky vypadaly jako u každého jiného, a hlavně nechci, aby působily dojmem, že prodávám kebab."
                      : "I refuse to let my pages look like everyone else's, and most importantly, I don't want them to give the impression that I'm selling kebab."}
                  </p>
                  
                  <p>
                    {lang === 'cs'
                      ? "Věřím v autenticitu a v to, že digitální prostor by měl odrážet skutečnou atmosféru místa, ne jen prázdnou šablonu. Každý pixel, každá animace a každá řádka kódu má svůj účel – vytvořit zážitek, který si zapamatujete."
                      : "I believe in authenticity and that digital space should reflect the true atmosphere of a place, not just an empty template. Every pixel, every animation, and every line of code has a purpose – to create an experience you'll remember."}
                  </p>
                </div>

                <div className="pt-10 border-t border-mafia-gold/10 flex flex-col items-center">
                   <div className="flex items-center gap-3 text-white/30 mb-4">
                      <ShieldAlert size={16} />
                      <span className="text-[9px] font-mono uppercase tracking-[0.5em]">Stav Systému: Nezávislý</span>
                   </div>
                   <button 
                     onClick={onClose}
                     className="px-10 py-3 bg-mafia-gold/10 border border-mafia-gold/40 text-mafia-gold text-xs font-black uppercase tracking-[0.3em] hover:bg-mafia-gold hover:text-mafia-black transition-all duration-500 shadow-[0_0_30px_rgba(197,160,89,0.05)] hover:shadow-[0_0_40px_rgba(197,160,89,0.2)]"
                   >
                     {lang === 'cs' ? 'Zavřít Protokol' : 'Close Protocol'}
                   </button>
                </div>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-mafia-gold/30 to-transparent"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
