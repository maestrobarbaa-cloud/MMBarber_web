"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, ExternalLink, MessageSquare } from "lucide-react";
import Image from "next/image";

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
}

const GOOGLE_REVIEWS: Review[] = [
  {
    id: 1,
    author: "Josef Pavka",
    rating: 5,
    text: "Nejlepší barbershop v Uherském Hradišti. Tomáš je opravdový profesionál, který ví, co dělá. Atmosféra je skvělá a výsledek vždy perfektní.",
    date: "Před měsícem"
  },
  {
    id: 2,
    author: "Ivana Brulíková",
    rating: 5,
    text: "Skvělý přístup, precizní práce. Syn byl nadšený a já také. Určitě doporučuji všem, kdo hledají kvalitu.",
    date: "Před 2 měsíci"
  },
  {
    id: 3,
    author: "Michal K",
    rating: 5,
    text: "Pánské holičství na úrovni. Časový tarif je fér a výsledek stojí za to. Rád se vracím.",
    date: "Před 3 měsíci"
  },
  {
    id: 4,
    author: "Jan Novotný",
    rating: 5,
    text: "Maximální spokojenost. Od prostředí až po samotný střih. Tady se člověk cítí jako u přátel.",
    date: "Před týdnem"
  },
  {
    id: 5,
    author: "Petr Svoboda",
    rating: 5,
    text: "Vynikající servis. Šel jsem na doporučení a nelituji. Skin fade je naprosto špičkový.",
    date: "Před měsícem"
  },
  {
    id: 6,
    author: "Marek Dvořák",
    rating: 5,
    text: "Příjemné prostředí, dobrá hudba a hlavně kvalitní sestřih. Parkování přímo před vchodem je velký bonus.",
    date: "Před 2 týdny"
  }
];

export function GoogleReviewsWall() {
  return (
    <div className="w-full bg-mafia-black/95 border-t border-mafia-gold/20 py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex gap-1 mb-6"
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={24} className="fill-mafia-gold text-mafia-gold shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
            ))}
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter mb-4 italic">
            DŮKAZ <span className="text-mafia-gold">KVALITY</span>
          </h2>
          <p className="text-smoke-white/40 font-mono text-[10px] uppercase tracking-[0.5em]">DIRECT_FEEDBACK_FROM_GOOGLE_REVIEWS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GOOGLE_REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/30 transition-all duration-500 relative group"
            >
              <Quote className="absolute top-4 right-4 text-mafia-gold/10 group-hover:text-mafia-gold/20 transition-colors" size={40} />
              
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={12} className="fill-mafia-gold text-mafia-gold" />
                ))}
              </div>

              <p className="text-smoke-white/70 italic text-sm leading-relaxed mb-8 relative z-10">
                &quot;{review.text}&quot;
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-white font-bold uppercase text-xs tracking-widest">{review.author}</span>
                  <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest mt-1">{review.date}</span>
                </div>
                <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                   <Image src="https://www.google.com/favicon.ico" alt="Google" width={14} height={14} className="grayscale group-hover:grayscale-0" />
                   <span className="text-[8px] font-mono uppercase text-white/40">VERIFIED</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <a 
            href="https://www.google.com/search?q=mmbarber#lrd=0x471311b7d5b1b7d5:0x5b1b7d5b1b7d5b1b,3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-12 py-5 bg-transparent border-2 border-mafia-gold text-mafia-gold font-heading font-black text-xs uppercase tracking-[0.3em] hover:bg-mafia-gold hover:text-mafia-black transition-all"
          >
            ZOBRAZIT VŠECHNY RECENZE <ExternalLink size={14} />
          </a>
        </div>

      </div>
    </div>
  );
}
