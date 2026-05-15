"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  ArrowLeft, 
  Star,
  MessageSquare,
  Award,
  Filter
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

interface Review {
  id: string;
  name: string;
  rank: string;
  rating: number;
  text: string;
  date: string;
}

const REVIEWS: Review[] = [
  { id: '1', name: 'Marek S.', rank: 'GENERÁLNÍ ŘEDITEL STŘIHU', rating: 5, text: 'Tohle není jen barber, to je rituál. Preciznost, kterou jinde nenajdete. Chodím k Tomovi už 3 roky a nikdy jsem nebyl zklamaný.', date: '12.05.2026' },
  { id: '2', name: 'Jirka H.', rank: 'STRÁŽCE ČISTÝCH RUČNÍKŮ', rating: 5, text: 'Super atmosféra a skvělá káva. Ten fade drží tvar neskutečně dlouho.', date: '08.05.2026' },
  { id: '3', name: 'Anonymní_Rekrut', rank: 'REKRUT S BŘITVOU', rating: 4, text: 'Skvělý střih, jen jsem musel trochu déle čekat na volný termín, ale stálo to za to.', date: '01.05.2026' },
];

export default function ReviewsPage() {
  const { t, lang } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);

  return (
    <div className="min-h-screen bg-black text-smoke-white overflow-x-hidden relative selection:bg-mafia-gold selection:text-mafia-black">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(var(--color-mafia-gold-rgb),0.08)_0%,transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          href="/komunita" 
          className="group flex items-center gap-4 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-xs tracking-[0.4em] uppercase"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          {lang === 'cs' ? "ZPĚT" : "BACK"}
        </Link>
        <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <span className="text-xl font-heading font-black text-mafia-gold">4.9 / 5</span>
               <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.3em]">BEYOND_EXCELLENCE</span>
            </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-40">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
           <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                 <Award className="text-mafia-gold" size={20} />
                 <span className="text-mafia-gold font-mono text-xs tracking-[0.6em] uppercase">HLAS_RODINY</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-heading font-black uppercase tracking-tighter italic mb-8">
                HODNOCENÍ <span className="text-mafia-gold">PODNIKU</span>
              </h1>
              <p className="text-xl text-smoke-white/60 font-sans italic leading-relaxed">
                Vaše slovo má váhu. Nejsme jen firma, jsme komunita postavená na důvěře a výsledcích.
              </p>
           </div>
           
           <button 
             onClick={() => setShowForm(true)}
             className="px-12 py-5 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.4em] hover:bg-white transition-all duration-300 shadow-2xl skew-x-[-10deg]"
           >
              ZANECHAT RECENZI
           </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-12 border-y border-white/5 py-6">
           <div className="flex items-center gap-8">
              <button className="text-mafia-gold font-mono text-[10px] tracking-[0.3em] uppercase">Všechny</button>
              <button className="text-white/20 hover:text-white transition-colors font-mono text-[10px] tracking-[0.3em] uppercase">Nejnovější</button>
              <button className="text-white/20 hover:text-white transition-colors font-mono text-[10px] tracking-[0.3em] uppercase">Kritické</button>
           </div>
           <Filter className="text-white/10" size={16} />
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 gap-8">
           {REVIEWS.map((review, i) => (
             <motion.div 
               key={review.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-mafia-dark/30 border border-white/5 p-10 md:p-14 relative group hover:border-mafia-gold/20 transition-all duration-500"
             >
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                   <div>
                      <div className="flex gap-1 mb-4">
                         {[...Array(5)].map((_, i) => (
                           <Star key={i} size={14} className={i < review.rating ? "fill-mafia-gold text-mafia-gold" : "text-white/10"} />
                         ))}
                      </div>
                      <h3 className="text-2xl font-heading font-black text-white uppercase tracking-widest">{review.name}</h3>
                      <p className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-[0.4em] mt-2">{review.rank}</p>
                   </div>
                   <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{review.date}</span>
                </div>
                
                <p className="text-lg md:text-xl text-smoke-white/70 font-sans italic leading-relaxed max-w-4xl border-l-2 border-mafia-gold/20 pl-8">
                   "{review.text}"
                </p>

                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                   <MessageSquare className="text-mafia-gold/20" size={40} />
                </div>
             </motion.div>
           ))}
        </div>

        {/* Review Modal - Simplified for UX */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                onClick={() => setShowForm(false)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-2xl bg-mafia-black border border-mafia-gold/30 p-12 md:p-20 shadow-2xl"
              >
                 <h2 className="text-4xl font-heading font-black text-mafia-gold uppercase italic mb-4">VAŠE SLOVO</h2>
                 <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.4em] mb-12">HLAS_REKRUTA_PROTOKOL</p>
                 
                 <div className="space-y-10">
                    <div>
                       <label className="block text-[10px] font-mono text-mafia-gold uppercase tracking-[0.5em] mb-6">INTENZITA SPOKOJENOSTI</label>
                       <div className="flex gap-4">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button key={s} onClick={() => setRating(s)}>
                               <Star size={32} className={s <= rating ? "fill-mafia-gold text-mafia-gold" : "text-white/10 hover:text-white/30 transition-colors"} />
                            </button>
                          ))}
                       </div>
                    </div>
                    
                    <div>
                       <label className="block text-[10px] font-mono text-mafia-gold uppercase tracking-[0.5em] mb-6">PROHLÁŠENÍ</label>
                       <textarea 
                         rows={4}
                         placeholder="ZADEJTE SVÉ SVĚDECTVÍ..."
                         className="w-full bg-white/5 border border-white/10 p-6 text-white font-mono text-sm tracking-widest uppercase focus:outline-none focus:border-mafia-gold transition-colors"
                       ></textarea>
                    </div>

                    <div className="flex justify-between items-center pt-8">
                       <button onClick={() => setShowForm(false)} className="text-white/20 font-mono text-[10px] uppercase tracking-[0.4em] hover:text-mafia-red transition-colors">ZRUŠIT</button>
                       <button className="px-10 py-4 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.4em] hover:bg-white transition-all duration-300">ODESLAT HLAS</button>
                    </div>
                 </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
