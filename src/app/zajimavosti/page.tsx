"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft, ChevronRight, UserSquare2, ExternalLink, HelpCircle, Lock, Unlock, ShieldAlert } from "lucide-react";
import Link from "next/link";
import Image from "@/components/OptimizedImage";
import { Footer } from "@/components/Footer";

// Ukázková data
const PEOPLE = [
  {
    id: 1,
    name: "Jan Novák",
    role: "Mistr řemesla",
    description: "Honza se věnuje tradičnímu zpracování kůže. Jeho dílna v centru Hradiště je místem, kde ožívají staré postupy. S MM Barberem ho pojí smysl pro detail a preciznost.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    link: "#"
  },
  {
    id: 2,
    name: "Eliška Svobodová",
    role: "Kavárnice & Vizionářka",
    description: "Eliška vybudovala komunitní espresso bar. Spojuje lidi u dobré kávy a často u ní probíráme nápady na rozvoj města. Každý její šálek má příběh.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80",
    link: "#"
  },
  {
    id: 3,
    name: "Tomáš Hrubý",
    role: "Urbanista",
    description: "Tomáš se zajímá o veřejný prostor. Pomáhá formovat vizuální tvář Slovácka tak, aby byla moderní, ale neztratila svou duši. Je častým hostem u nás v křesle.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80",
    link: "#"
  },
  {
    id: 4,
    name: "Hana",
    role: "Utajená rodačka",
    description: "\"Dobrý den. Jmenuji se Hana a jsem rodačkou z Mařatic. Ví to jen málokdo, a vy teď patříte mezi ně. Aktuálně pracuji pro Gen Digital Inc. a právě odtud částečně tvořím weby pro globální software.\"",
    image: null,
    link: "#",
    isMystery: true
  },
  {
    id: 5,
    name: "Tomáš",
    role: "Spisovatel z Jarošova",
    description: "\"Dobrý den. Jmenuji se Tomáš, jsem hrdý rodák z Jarošova a aktuálně pracuji na knize o osudech letců z druhé světové války. Je to běh na dlouhou trať, ale až bude kniha konečně na světě, pevně věřím, že ji společně pokřtíme právě tady, v našem podniku.\"",
    image: null,
    link: "#",
    isMystery: true
  }
];

function PersonCard({ person, index, isRevealed, onReveal }: { person: any, index: number, isRevealed: boolean, onReveal: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`group relative flex flex-col bg-mafia-black border transition-all duration-500 overflow-hidden ${isRevealed ? 'border-mafia-gold/30' : 'border-mafia-gold/10'}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-mafia-black cursor-pointer" onClick={!isRevealed ? onReveal : undefined}>
        {person.isMystery ? (
          <div className="absolute inset-0 flex items-center justify-center bg-mafia-gold/5 z-10 transition-colors duration-1000">
            <HelpCircle size={120} strokeWidth={1} className={`transition-all duration-1000 ${isRevealed ? 'text-mafia-gold/60 scale-110' : 'text-mafia-gold/20'}`} />
          </div>
        ) : (
          <>
            <div className={`absolute inset-0 transition-colors duration-700 z-10 ${isRevealed ? 'bg-transparent' : 'bg-mafia-black/70 backdrop-blur-sm'}`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={person.image} 
              alt={isRevealed ? person.name : "Neznámý"}
              className={`object-cover w-full h-full transition-all duration-1000 ${isRevealed ? 'grayscale-0 scale-105' : 'grayscale scale-100 blur-[2px]'}`}
            />
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-mafia-black via-mafia-black/80 to-transparent z-20 pointer-events-none" />

        {/* Lock Overlay */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-mafia-black/40 backdrop-blur-[2px]"
            >
              <div className="flex flex-col items-center group-hover:scale-110 transition-transform duration-500">
                <div className="w-20 h-20 rounded-full border border-mafia-gold flex items-center justify-center bg-mafia-black text-mafia-gold mb-6 shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.3)] group-hover:bg-mafia-gold group-hover:text-black group-hover:shadow-[0_0_50px_rgba(var(--color-mafia-gold-rgb),0.6)] transition-all duration-500 animate-pulse group-hover:animate-none">
                  <Lock size={32} className="relative z-10" />
                </div>
                <div className="px-6 py-2 border border-mafia-gold/50 bg-mafia-gold/10 backdrop-blur-sm text-mafia-gold font-heading font-black tracking-widest uppercase text-sm group-hover:bg-mafia-gold group-hover:text-black transition-colors duration-500">
                  Odtajnit záznam
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Box */}
      <div className="relative z-30 p-8 flex flex-col flex-grow -mt-20 pointer-events-none">
        <div className="mb-4">
          <span className={`font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-1000 ${isRevealed ? 'text-mafia-gold' : 'text-mafia-gold/30'}`}>
            {isRevealed ? person.role : 'PŘÍSTUP ODEPŘEN'}
          </span>
          <h3 className={`text-3xl font-heading font-black italic mt-2 transition-colors duration-1000 ${isRevealed ? 'text-smoke-white' : 'text-smoke-white/20 blur-sm select-none'}`}>
            {isRevealed ? person.name : 'Neznámý Subjekt'}
          </h3>
        </div>
        
        <p className={`text-sm leading-relaxed mb-8 flex-grow transition-all duration-1000 ${isRevealed ? 'text-smoke-white/60' : 'text-smoke-white/10 blur-sm select-none'}`}>
          {isRevealed ? person.description : 'Tento záznam je uzamčen. Pro zobrazení detailů a příběhu této osobnosti je nutné prolomit bezpečnostní ochranu kliknutím na obrazovku.'}
        </p>
        
        {person.link !== "#" && isRevealed && (
          <a href={person.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-mafia-gold hover:text-smoke-white transition-colors mt-auto pointer-events-auto">
            PROZKOUMAT <ExternalLink size={14} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function ZajimavostiPage() {
  const { t } = useTranslation();
  const [revealedIds, setRevealedIds] = useState<number[]>([]);

  const handleReveal = (id: number) => {
    if (!revealedIds.includes(id)) {
      setRevealedIds(prev => [...prev, id]);
    }
  };

  const progressPercentage = Math.round((revealedIds.length / PEOPLE.length) * 100);

  const content = (t as any).zajimavosti || {
    return: "ZPĚT NA ZÁKLADNU",
    sector: "INSPIRACE // UH",
    title: "ZAJÍMAVOSTI",
    subtitle: "Zajímaví lidé z Uherského Hradiště a jejich příběhy.",
    description: "Poznejte lidi z našeho města, kteří dělají věci jinak. Inspirativní osobnosti, umělci, řemeslníci a vizionáři, kteří tvoří jedinečnou atmosféru Uherského Hradiště.",
    ideaTitle: "Znáte někoho zajímavého?",
    ideaText: "Pokud víte o někom, kdo by tu neměl chybět, dejte nám vědět. Rádi jeho příběh posdílíme dál.",
    proposeBtn: "NAPSAT TIP"
  };

  return (
    <div className="min-h-screen bg-black text-smoke-white overflow-x-hidden relative selection:bg-mafia-gold selection:text-mafia-black">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--color-mafia-gold-rgb),0.08)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--color-mafia-gold-rgb),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--color-mafia-gold-rgb),0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="group flex items-center gap-4 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-xs tracking-[0.4em] uppercase"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          {content.return}
        </Link>
        <div className="flex flex-col items-end">
            <div className="w-12 h-12 border border-mafia-gold/20 flex items-center justify-center overflow-hidden p-1">
                <Image src="/logo.png" alt="MM" width={40} height={40} className="w-full h-full object-contain opacity-80" />
            </div>
            <span className="text-[8px] font-mono text-mafia-gold/50 tracking-[0.5em] uppercase mt-2">Inspirace_v3.5.0</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center w-full"
          >
            <div className="text-mafia-gold font-mono text-[10px] uppercase tracking-[0.8em] mb-10 flex items-center gap-4">
               <div className="h-[1px] w-12 bg-mafia-gold/30"></div>
               {content.sector}
               <div className="h-[1px] w-12 bg-mafia-gold/30"></div>
            </div>

            <h1 className="text-7xl md:text-[10rem] font-heading font-black uppercase tracking-tighter italic leading-none mb-12 drop-shadow-[0_20px_50px_rgba(0,0,0,1)]">
              {content.title}
            </h1>
            
            <p className="text-2xl md:text-5xl font-heading text-smoke-white leading-tight uppercase tracking-tight mb-8 max-w-4xl">
              {content.subtitle}
            </p>

            <div className="w-24 h-px bg-mafia-gold/40 mb-8"></div>

            <p className="text-lg md:text-xl font-sans text-smoke-white/50 leading-relaxed max-w-3xl">
              {content.description}
            </p>
          </motion.div>
        </div>

        {/* Progress Bar Game Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-2xl mx-auto mb-24 p-6 border border-mafia-gold/20 bg-mafia-black/80 backdrop-blur-md relative overflow-hidden"
        >
          <div className="flex justify-between items-end mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-mafia-gold" size={24} />
              <span className="font-mono text-sm tracking-[0.3em] uppercase text-smoke-white/80">Stav databáze</span>
            </div>
            <span className="font-heading font-black text-3xl italic text-mafia-gold">{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-mafia-gold/10 relative z-10 overflow-hidden">
            <motion.div 
              className="h-full bg-mafia-gold shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),1)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          {progressPercentage === 100 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center font-mono text-xs text-mafia-gold tracking-widest uppercase"
            >
              Všechny spisy odhaleny. Dobrá práce.
            </motion.div>
          )}
        </motion.div>

        {/* People Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-32">
          {PEOPLE.map((person, index) => (
            <PersonCard 
              key={person.id} 
              person={person} 
              index={index} 
              isRevealed={revealedIds.includes(person.id)}
              onReveal={() => handleReveal(person.id)}
            />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="w-full max-w-4xl mx-auto p-12 md:p-20 border border-mafia-gold/20 bg-mafia-black/40 backdrop-blur-3xl relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-mafia-gold/5 blur-[120px] rounded-full group-hover:bg-mafia-gold/10 transition-colors duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-mafia-gold/5 blur-[120px] rounded-full group-hover:bg-mafia-gold/10 transition-colors duration-1000"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
               <UserSquare2 size={48} className="text-mafia-gold/50 mb-8" />
               <h2 className="text-4xl md:text-6xl font-heading font-black text-smoke-white uppercase tracking-tighter mb-8 italic">
                  {content.ideaTitle}
               </h2>
               <p className="text-xl md:text-2xl font-sans text-mafia-gold/70 leading-relaxed mb-12 max-w-2xl">
                  {content.ideaText}
               </p>
               
               <motion.div className="flex flex-col items-center gap-12">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-8 group/cta"
                    onClick={() => window.location.href = 'mailto:mmbarber@mmbarber.cz'}
                  >
                     <div className="w-16 h-16 rounded-full border border-mafia-gold flex items-center justify-center bg-mafia-gold text-mafia-black shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.3)] group-hover/cta:shadow-[0_0_50px_rgba(var(--color-mafia-gold-rgb),0.5)] transition-all duration-500">
                        <ChevronRight size={24} />
                     </div>
                     <span className="text-mafia-gold font-heading font-black text-xl md:text-3xl uppercase tracking-[0.4em] group-hover/cta:text-smoke-white transition-colors">
                       {content.proposeBtn}
                     </span>
                  </motion.button>
               </motion.div>
            </div>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
}
