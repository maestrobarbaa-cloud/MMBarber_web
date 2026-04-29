"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Camera, Hash, ExternalLink, Scissors, Book } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

const SEO_TAGS = [
  "#mmbarber", "#uherskehradiste", "#barbershop", "#skinfade", "#menshair", 
  "#slovacko", "#maratice", "#panskystrih", "#holicstvi", "#barberlife", 
  "#tomasmicka", "#upravavousu", "#beardstyle", "#fadehaircut", "#mensgrooming",
  "#uh", "#kunovice", "#staremesto", "#napajedla", "#hradhoviny"
];

const PHOTO_DESCRIPTIONS = [
  "Precizní skin fade Uherské Hradiště - detailní práce s mašinkou a břitvou v MM BARBER.",
  "Moderní pánský střih Mařatice - texturovaný vršek a čisté přechody pro každý den.",
  "Úprava vousů břitvou Slovácko - tradiční rituál s horkým ručníkem v MM BARBER.",
  "Taper fade Uherské Hradiště - jemný přechod u uší a na krku, klasika v moderním pojetí.",
  "Long hair design UH - i delší vlasy si zaslouží profesionální péči v našem barbershopu.",
  "Beard trim & shaping - perfektní tvar vousů podle geometrie obličeje, MM BARBER society.",
  "Classic side part Uherské Hradiště - elegance, která nikdy nevyjde z módy.",
  "Buzz cut & line up - pro ty, kteří hledají maximální ostrost a minimální údržbu.",
  "Grooming rituál MM BARBER - napařování, olejování a precizní oholení břitvou.",
  "Dětský střih Uherské Hradiště - i mladí džentlmeni z UH si zaslouží špičkový fade.",
  "Svatební servis pro muže UH - vypadejte nejlépe ve svůj velký den pod hradem Buchlov.",
  "Zastřižení kontur břitvou - ten nejostřejší detail, který definuje profesionální práci."
];

export default function FadeGalleryPage() {
  const { lang } = useTranslation();

  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-[0.3em] mb-16"
        >
          <ChevronLeft size={14} />
          Zpět na centrálu
        </Link>

        <header className="mb-20">
          <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter mb-6">
            DIGITÁLNÍ <span className="text-mafia-gold italic">ARCHIV FADE</span>
          </h1>
          <p className="text-smoke-white/60 font-sans italic text-lg max-w-2xl">
            Průřez nejčastějšími styly a technikami, které definují MM BARBER v Uherském Hradišti. 
            Tento archiv slouží pro inspiraci a technickou dokumentaci našich operací.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {PHOTO_DESCRIPTIONS.map((desc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 bg-mafia-dark/30 border border-white/5 hover:border-mafia-gold/30 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4 text-mafia-gold/40">
                <Camera size={18} />
                <span className="font-mono text-[10px] uppercase tracking-widest">Záznam #{idx + 101}</span>
              </div>
              <p className="text-sm font-sans leading-relaxed mb-6 group-hover:text-white transition-colors">
                {desc}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[9px] font-mono text-mafia-gold/30 uppercase tracking-widest">TAGS: fade-uh-hradiste, mmbarber-style, mens-hair-2026</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-mafia-gold/5 border-y border-mafia-gold/20 p-12 mb-24">
          <div className="flex items-center gap-3 mb-8">
            <Hash size={24} className="text-mafia-gold" />
            <h2 className="text-xl font-heading font-black uppercase tracking-widest text-mafia-gold">Instagram Connect & SEO Cloud</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {SEO_TAGS.map((tag, idx) => (
              <span key={idx} className="text-xs font-mono text-smoke-white/40 hover:text-mafia-gold cursor-default transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-16">
          <div>
            <h3 className="text-2xl font-heading font-black uppercase mb-6 text-mafia-gold">Vnitřní spojení</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/#sluzby" className="flex items-center gap-3 text-smoke-white/60 hover:text-mafia-gold transition-colors">
                  <Scissors size={16} />
                  <span className="text-sm uppercase tracking-widest font-bold">Ceník a služby MM BARBER</span>
                </Link>
              </li>
              <li>
                <Link href="/zapisnik" className="flex items-center gap-3 text-smoke-white/60 hover:text-mafia-gold transition-colors">
                  <Book size={16} className="w-4 h-4" />
                  <span className="text-sm uppercase tracking-widest font-bold">Měsíční reporty a historie</span>
                </Link>
              </li>
              <li>
                <Link href="/payment" className="flex items-center gap-3 text-smoke-white/60 hover:text-mafia-gold transition-colors">
                  <ExternalLink size={16} />
                  <span className="text-sm uppercase tracking-widest font-bold">Platební brána a instrukce</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="bg-mafia-gold text-mafia-black p-8 flex flex-col justify-center items-center text-center">
            <h3 className="text-2xl font-heading font-black uppercase mb-4">REZERVOVAT TERMIN</h3>
            <p className="text-sm font-sans font-bold uppercase tracking-widest mb-8 opacity-70">Uherské Hradiště - Mařatice</p>
            <a 
              href="https://is.mmbarber.cz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-mafia-black text-mafia-gold px-10 py-4 font-heading font-black uppercase tracking-widest hover:bg-white hover:text-mafia-black transition-all"
            >
              VSTOUPIT DO SYSTÉMU
            </a>
          </div>
        </section>
      </div>

      <div className="absolute top-1/2 left-0 -rotate-90 origin-left text-[8px] font-mono text-white/5 uppercase tracking-[1em] whitespace-nowrap pointer-events-none">
        FADE_DATABASE_SYNCHRONIZED_SEO_ACTIVE
      </div>
    </main>
  );
}

