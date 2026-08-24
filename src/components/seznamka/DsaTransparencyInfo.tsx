'use client';

import React from 'react';
import { X, ShieldCheck, Mail, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DsaTransparencyInfoProps {
  lang: 'cs' | 'en';
  isOpen: boolean;
  onClose: () => void;
}

export function DsaTransparencyInfo({ lang, isOpen, onClose }: DsaTransparencyInfoProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-mafia-dark w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 relative max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/40 shrink-0">
              <div className="flex items-center gap-3 text-mafia-gold">
                <Scale className="w-6 h-6" />
                <h2 className="text-xl font-heading font-black uppercase tracking-widest">
                  {lang === 'cs' ? 'Transparentnost & DSA' : 'Transparency & DSA'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 flex-1">
              {/* Recommender Systems Transparency */}
              <section>
                <h3 className="font-heading font-black uppercase text-lg mb-4 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-blue-400" />
                  {lang === 'cs' ? 'Jak fungují naše doporučovací systémy' : 'How our recommender systems work'}
                </h3>
                <p className="text-white/70 font-mono text-sm leading-relaxed mb-4">
                  {lang === 'cs' 
                    ? 'Dle nařízení EU o digitálních službách (DSA) vás informujeme o tom, jak vybíráme profily, které vidíte:' 
                    : 'Under the EU Digital Services Act (DSA), we inform you how we select the profiles you see:'}
                </p>
                
                <div className="space-y-3">
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                    <h4 className="font-bold text-mafia-gold mb-1">Náhodný (Random)</h4>
                    <p className="text-white/60 text-xs font-mono">
                      {lang === 'cs' ? 'Zobrazuje profily náhodně bez ohledu na vaše preference. Slouží k rozbití bubliny.' : 'Shows profiles randomly regardless of preferences. Breaks the algorithm bubble.'}
                    </p>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-400 mb-1">Nejbližší (Closest)</h4>
                    <p className="text-white/60 text-xs font-mono">
                      {lang === 'cs' ? 'Primárním parametrem je geografická vzdálenost k vašemu nastavenému městu/lokalitě.' : 'Primary parameter is geographical distance to your set city/location.'}
                    </p>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                    <h4 className="font-bold text-purple-400 mb-1">Magnet & Zrcadlové (Magnet & Mirror)</h4>
                    <p className="text-white/60 text-xs font-mono">
                      {lang === 'cs' ? 'Analyzuje vaše odpovědi (extroverze, koníčky, plány) a hledá buď přesnou shodu (Magnet) nebo protiklady (Zrcadlové).' : 'Analyzes your answers (extroversion, hobbies, plans) and finds either exact matches (Magnet) or opposites (Mirror).'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Point of Contact */}
              <section className="bg-red-950/20 border-l-2 border-red-500 p-6 rounded-r-xl">
                <h3 className="font-heading font-black uppercase text-lg text-red-500 mb-2 flex items-center gap-2">
                  <Mail size={18} />
                  {lang === 'cs' ? 'Kontaktní místo (DSA)' : 'Point of Contact (DSA)'}
                </h3>
                <p className="text-white/70 font-mono text-sm leading-relaxed mb-4">
                  {lang === 'cs' 
                    ? 'Ve smyslu čl. 11 a čl. 12 nařízení (EU) 2022/2065 ustanovujeme následující kontaktní místo pro komunikaci s úřady členských států, Evropskou komisí a sítěmi důvěryhodných oznamovatelů, a zároveň pro komunikaci s příjemci služby:' 
                    : 'Pursuant to Art. 11 and Art. 12 of Regulation (EU) 2022/2065, we establish the following single point of contact for communications with Member State authorities, the European Commission and trusted flaggers, as well as with recipients of the service:'}
                </p>
                <div className="bg-black border border-red-500/30 p-4 rounded-lg inline-block">
                  <a href="mailto:dsa@mmbarber.cz" className="text-red-400 font-bold hover:underline flex items-center gap-2">
                    <Mail size={16} /> dsa@mmbarber.cz
                  </a>
                </div>
                <p className="text-white/50 text-xs mt-3">
                  {lang === 'cs' ? 'Komunikační jazyky: Čeština, Angličtina.' : 'Languages of communication: Czech, English.'}
                </p>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
