"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, ExternalLink, MessageSquare, TrendingUp } from "lucide-react";
import { Footer } from "../../components/Footer";
import { useTranslation } from "../../hooks/useTranslation";
import Image from "next/image";

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
  source: "google" | "firmy";
}

const REVIEWS: Review[] = [
  {
    id: 1,
    author: "Josef Pavka",
    rating: 5,
    text: "Nejlepší barbershop v Uherském Hradišti. Tomáš je opravdový profesionál, který ví, co dělá. Atmosféra je skvělá a výsledek vždy perfektní.",
    date: "Před měsícem",
    source: "firmy"
  },
  {
    id: 2,
    author: "ivana brulikova",
    rating: 5,
    text: "Skvělý přístup, precizní práce. Syn byl nadšený a já také. Určitě doporučuji všem, kdo hledají kvalitu.",
    date: "Před 2 měsíci",
    source: "firmy"
  },
  {
    id: 3,
    author: "Michal K",
    rating: 5,
    text: "Pánské holičství na úrovni. Časový tarif je fér a výsledek stojí za to. Rád se vracím.",
    date: "Před 3 měsíci",
    source: "firmy"
  },
  {
    id: 4,
    author: "Jan Novotný",
    rating: 5,
    text: "Maximální spokojenost. Od prostředí až po samotný střih. Tady se člověk cítí jako u přátel.",
    date: "Před týdnem",
    source: "google"
  },
  {
    id: 5,
    author: "Petr Svoboda",
    rating: 5,
    text: "Vynikající servis. Šel jsem na doporučení a nelituji. Skin fade je naprosto špičkový.",
    date: "Před měsícem",
    source: "google"
  },
  {
    id: 6,
    author: "Marek Dvořák",
    rating: 5,
    text: "Příjemné prostředí, dobrá hudba a hlavně kvalitní sestřih. Parkování přímo před vchodem je velký bonus.",
    date: "Před 2 týdny",
    source: "google"
  }
];

export default function ReviewsPage() {

  const aggregateRating = 5.0;
  const totalReviews = 148; // Example total

  return (
    <div className="min-h-screen bg-mafia-black text-smoke-white font-sans selection:bg-mafia-gold selection:text-mafia-black">
      <main className="pt-12 md:pt-20 pb-20 px-6 max-w-7xl mx-auto relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-mafia-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-mafia-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

        {/* SEO Aggregate Rating (Visual) */}
        <div className="relative z-10 mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-mafia-gold/10 border border-mafia-gold/20 rounded-full mb-6"
          >
            <TrendingUp size={14} className="text-mafia-gold" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-mafia-gold">Aktuální hodnocení: {aggregateRating} / 5</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter mb-6 italic"
          >
            Hlasy <span className="text-mafia-gold">Rodiny</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-smoke-white/50 max-w-2xl mx-auto text-lg leading-relaxed mb-12"
          >
            Vaše loajalita a zpětná vazba jsou motorem naší preciznosti. Každá recenze je pro nás závazkem k udržení nejvyššího standardu.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-black text-white mb-1">5.0</div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-mafia-gold text-mafia-gold" />
                ))}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-smoke-white/30">Google Reviews</div>
            </div>
            <div className="w-[1px] h-16 bg-white/10 hidden md:block"></div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-black text-white mb-1">100%</div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-mafia-gold text-mafia-gold" />
                ))}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-smoke-white/30">Firmy.cz</div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="group relative p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/30 transition-all duration-500 flex flex-col"
            >
              {/* Decoration */}
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={40} className="text-mafia-gold" />
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={12} className="fill-mafia-gold text-mafia-gold" />
                ))}
              </div>

              <p className="text-smoke-white/80 leading-relaxed mb-8 flex-grow italic">
                &quot;{review.text}&quot;
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="font-bold text-white uppercase text-sm tracking-wide">{review.author}</span>
                  <span className="text-[10px] font-mono text-smoke-white/30 uppercase tracking-widest">{review.date}</span>
                </div>
                
                <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
                  {review.source === "google" ? (
                    <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} />
                  ) : (
                    <Image src="https://www.seznam.cz/favicon.ico" alt="Seznam" width={16} height={16} />
                  )}
                  <span className="text-[9px] font-mono text-smoke-white/20 group-hover:text-mafia-gold transition-colors">
                    {review.source === "google" ? "GOOGLE" : "FIRMY.CZ"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 text-center p-12 border-2 border-mafia-gold/20 bg-mafia-gold/[0.02] relative group"
        >
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-mafia-gold"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-mafia-gold"></div>

          <MessageSquare className="mx-auto mb-6 text-mafia-gold group-hover:scale-110 transition-transform" size={40} />
          <h2 className="text-3xl font-heading font-black uppercase mb-4 tracking-wider">Chcete se podělit o zkušenost?</h2>
          <p className="text-smoke-white/50 mb-10 max-w-lg mx-auto">Vaše hodnocení pomáhá budovat naši komunitu a zlepšovat naše služby.</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.google.com/search?q=mmbarber#lrd=0x471311b7d5b1b7d5:0x5b1b7d5b1b7d5b1b,3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-mafia-gold text-mafia-black font-heading font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-colors"
            >
              Napsat na Google <ExternalLink size={14} />
            </a>
            <a
              href="https://www.firmy.cz/detail/13801488-mmbarber-uherske-hradiste-maratice.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-mafia-gold text-mafia-gold font-heading font-black text-xs uppercase tracking-[0.2em] hover:bg-mafia-gold hover:text-mafia-black transition-all"
            >
              Napsat na Firmy.cz <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>
      </main>

      <Footer />

      {/* Schema.org Detailed Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BarberShop",
            "name": "MMBARBER",
            "image": "https://www.mmbarber.cz/logo.png",
            "@id": "https://www.mmbarber.cz",
            "url": "https://www.mmbarber.cz",
            "telephone": "+420577544073",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Sadová 1383",
              "addressLocality": "Uherské Hradiště",
              "postalCode": "686 05",
              "addressCountry": "CZ"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 49.059228,
              "longitude": 17.483505
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": totalReviews.toString(),
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": REVIEWS.map(r => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": r.author
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": r.rating.toString(),
                "bestRating": "5"
              },
              "reviewBody": r.text
            }))
          })
        }}
      />
    </div>
  );
}
