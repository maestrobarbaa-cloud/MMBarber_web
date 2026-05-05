"use client";

import { Scissors, Users, Target, ShieldCheck, CheckCircle2, ChevronDown, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/hooks/useTranslation";
import { BottomTerminalReveal } from "@/components/BottomTerminalReveal";
import { DatingSEOArchive } from "@/components/DatingSEOArchive";

export default function SeznamkaPage() {
  const { t, lang } = useTranslation();
  const [activeVariant, setActiveVariant] = useState<'selection' | 'A' | 'B'>('selection');
  const [confirmedSteps, setConfirmedSteps] = useState<string[]>([]);
  const [isLegalExpanded, setIsLegalExpanded] = useState(false);
  const [showRecruitmentMessage, setShowRecruitmentMessage] = useState(false);
  
  const handleConfirm = (id: string) => {
    if (!confirmedSteps.includes(id)) {
      setConfirmedSteps([...confirmedSteps, id]);
    }
  };

  const allConfirmed = confirmedSteps.length === 3;

  const steps = [
    {
      id: "01",
      title: t.seznamka.steps[0].title,
      desc: t.seznamka.steps[0].desc,
      icon: <Users className="text-mafia-gold" size={32} />,
      color: "border-mafia-gold/30"
    },
    {
      id: "02",
      title: t.seznamka.steps[1].title,
      desc: t.seznamka.steps[1].desc,
      icon: <Scissors className="text-mafia-gold" size={32} />,
      color: "border-mafia-gold/30"
    },
    {
      id: "03",
      title: t.seznamka.steps[2].title,
      desc: t.seznamka.steps[2].desc,
      icon: <Target className="text-mafia-gold" size={32} />,
      color: "border-mafia-gold/30"
    }
  ];

  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white overflow-x-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-[150] bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <button 
            onClick={() => {
              if (activeVariant !== 'selection') {
                setActiveVariant('selection');
                setConfirmedSteps([]);
              } else {
                window.location.href = "/";
              }
            }} 
            className="group flex items-center gap-4 text-mafia-gold hover:text-white transition-all duration-500 relative z-[160]"
          >
            <div className="w-12 h-12 rounded-full border border-mafia-gold/20 flex items-center justify-center group-hover:border-mafia-gold group-hover:bg-mafia-gold group-hover:text-black transition-all duration-500">
              <ChevronLeft size={20} />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.4em] font-bold">
              {activeVariant === 'selection' 
                ? (lang === 'cs' ? "ZPĚT DO SALONU" : "BACK TO SALON")
                : (lang === 'cs' ? "ZPĚT NA VÝBĚR" : "BACK TO SELECTION")
              }
            </span>
          </button>
          <div className="flex flex-col items-end">
            <span className="font-heading font-black text-2xl italic tracking-tighter text-white">MMBARBER</span>
            <span className="text-[8px] font-mono text-mafia-gold/50 tracking-[0.5em] uppercase">Network_Protocol_v3.4.4</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 md:px-12 flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-mafia-gold rounded-full animate-pulse" style={{ borderColor: 'var(--user-accent-color)', filter: 'drop-shadow(0 0 var(--user-glow-radius) var(--user-glow-color))' }}></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-mafia-gold/20 rounded-full animate-pulse delay-700" style={{ borderColor: 'rgba(var(--user-accent-color-rgb), 0.2)', filter: 'drop-shadow(0 0 var(--user-glow-radius) var(--user-glow-color))' }}></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1 className="text-5xl md:text-8xl font-heading font-black text-smoke-white uppercase tracking-[0.2em] mb-8">
            {t.header.seznamka}
          </h1>
          
          <div className="w-24 h-1 bg-mafia-gold mx-auto mb-8 shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]"></div>
          
          <p className="flavor-text max-w-2xl mx-auto text-smoke-white/60 font-sans text-lg md:text-xl leading-relaxed italic mb-12 whitespace-pre-line">
            {t.seznamka.description}
          </p>
        </motion.div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 px-4 md:px-12 relative max-w-6xl mx-auto min-h-[600px]">
        
        {activeVariant === 'selection' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
          >
            {/* Variant B Card (Now First) */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveVariant('B')}
              className="group relative bg-mafia-dark/40 border-2 border-mafia-gold p-8 md:p-12 hover:bg-mafia-gold/5 transition-all duration-500 cursor-pointer overflow-hidden shadow-[0_0_15px_rgba(var(--user-accent-color-rgb),0.1)]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-mafia-gold/10 -rotate-45 translate-x-12 -translate-y-12"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-mafia-gold/10 border border-mafia-gold/20 rounded-full">
                    <Scissors className="text-mafia-gold" size={24} />
                  </div>
                  <span className="font-mono text-[10px] text-mafia-gold/50 tracking-[0.3em] uppercase">Status: Recruiting</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-heading font-black text-mafia-gold uppercase mb-4 tracking-tighter italic">
                  {t.seznamka.variantB.title}
                </h3>
                <p className="text-smoke-white/70 mb-8 font-sans leading-relaxed text-sm md:text-base">
                  {t.seznamka.variantB.desc}
                </p>
                <div className="flex justify-start">
                  <div className="px-8 py-3 bg-mafia-gold text-mafia-black font-heading font-black uppercase tracking-widest text-xs group-hover:bg-smoke-white transition-colors">
                    {lang === 'cs' ? "SPUSTIT NÁBOR" : "START RECRUITMENT"}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Variant A Card (Now Second) */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveVariant('A')}
              className="group relative bg-mafia-dark/20 border-2 border-white/5 p-8 md:p-12 hover:border-mafia-gold/40 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-full">
                    <Users className="text-white/40" size={24} />
                  </div>
                  <span className="font-mono text-[10px] text-white/20 tracking-[0.3em] uppercase">Status: Passive</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-black text-smoke-white/60 group-hover:text-mafia-gold uppercase mb-4 tracking-widest transition-colors">
                  {t.seznamka.variantA.title}
                </h3>
                <p className="text-smoke-white/40 group-hover:text-smoke-white/60 mb-8 font-sans leading-relaxed text-sm">
                  {t.seznamka.variantA.desc}
                </p>
                <div className="flex justify-start">
                  <div className="px-8 py-3 border border-white/10 text-white/40 font-heading font-black uppercase tracking-widest text-xs group-hover:border-mafia-gold group-hover:text-mafia-gold transition-all">
                    {lang === 'cs' ? "SPUSTIT PROTOKOL" : "START PROTOCOL"}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeVariant === 'A' && (
          <motion.div 
              key="protocol-room-a"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
          >
              <div className="text-center mb-16">
                  <h2 className="text-2xl md:text-4xl font-heading font-bold text-mafia-gold uppercase tracking-[0.2em] mb-4">
                      {t.seznamka.variantA.title}
                  </h2>
                  <p className="text-smoke-white/40 font-mono text-[10px] uppercase tracking-[0.5em]">
                      Postupujte podle pokynů / Action Required
                  </p>
              </div>
      
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-mafia-gold/10 -translate-y-1/2 z-0"></div>

                  {steps.map((step, index) => {
                      const isConfirmed = confirmedSteps.includes(step.id);
                      const canInteract = confirmedSteps.length >= index;

                      return (
                          <motion.div 
                              key={step.id}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2 }}
                              className={`relative z-10 bg-mafia-dark/40 border-2 p-8 group transition-all duration-500 overflow-hidden ${
                              isConfirmed ? 'border-mafia-gold' : canInteract ? 'border-mafia-gold/30 hover:border-mafia-gold' : 'border-neutral-900 grayscale opacity-40'
                              }`}
                          >
                              {isConfirmed && (
                              <motion.div 
                                  initial={{ scale: 2, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="absolute top-4 right-4 text-mafia-gold z-30"
                              >
                                  <CheckCircle2 size={32} />
                              </motion.div>
                              )}

                              <div className="absolute top-4 right-4 text-3xl font-heading font-black text-white/5 group-hover:text-mafia-gold/10 transition-colors">
                                  {step.id}
                              </div>
                              
                              <div className={`mb-6 w-16 h-16 bg-mafia-black border flex items-center justify-center transition-all duration-500 ${
                              isConfirmed ? 'border-mafia-gold shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]' : 'border-mafia-gold/10 group-hover:scale-110 group-hover:border-mafia-gold/50'
                              }`}>
                                  <div className={`transition-colors duration-500 ${isConfirmed ? 'text-mafia-gold' : 'text-mafia-gold group-hover:text-white'}`}>
                                  {step.icon}
                                  </div>
                              </div>

                              <h3 className={`text-xl font-heading font-bold uppercase mb-4 tracking-wider transition-colors duration-500 ${isConfirmed ? 'text-smoke-white' : 'text-mafia-gold group-hover:text-smoke-white'}`}>
                                  {step.title}
                              </h3>

                              <p className="text-smoke-white/60 font-sans text-sm leading-relaxed mb-8 h-12">
                                  {step.desc}
                              </p>

                              {!isConfirmed && canInteract && (
                              <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleConfirm(step.id)}
                                  className="w-full bg-mafia-gold/20 border border-mafia-gold/40 hover:bg-mafia-gold hover:text-mafia-black py-2 px-4 font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
                              >
                                  {t.seznamka.acknowledge}
                              </motion.button>
                              )}
                              
                              {isConfirmed && (
                              <div className="flex items-center gap-2 text-mafia-gold/60">
                                  <ShieldCheck size={16} />
                                  <span className="text-[10px] font-mono uppercase tracking-widest">{t.seznamka.confirmedLabel}</span>
                              </div>
                              )}
                          </motion.div>
                      );
                  })}
              </div>

              <AnimatePresence>
                  {allConfirmed && (
                      <motion.div 
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="mt-20 p-12 bg-mafia-dark border-2 border-mafia-gold shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)] text-center relative overflow-hidden"
                      >
                          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(var(--user-accent-color-rgb),0.1)_0%,transparent_70%)]"></div>
                          <h3 className="text-3xl md:text-4xl font-heading font-black text-mafia-gold uppercase mb-6 tracking-widest" style={{ textShadow: '0 0 var(--user-glow-radius) var(--user-glow-color)' }}>
                              {t.seznamka.successTitle}
                          </h3>
                          <p className="max-w-xl mx-auto text-smoke-white font-sans text-lg md:text-xl leading-relaxed mb-10 italic">
                            {t.seznamka.successText}
                          </p>
                          <div className="flex flex-col items-center gap-6">
                              <Link 
                                  href="/"
                                  className="group relative overflow-hidden bg-mafia-gold border border-mafia-gold px-12 py-5 transition-all duration-500 hover:shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]"
                              >
                                  <div className="absolute inset-0 block bg-smoke-white -translate-x-[102%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></div>
                                  <span className="relative z-10 text-mafia-black font-heading font-black uppercase tracking-[0.3em] group-hover:text-mafia-black transition-colors duration-500 text-lg">
                                      {t.seznamka.finishBtn}
                                  </span>
                              </Link>
                          </div>
                      </motion.div>
                  )}
              </AnimatePresence>
          </motion.div>
        )}

        {activeVariant === 'B' && (
          <motion.div 
            key="brigada-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-mafia-dark/60 border-2 border-mafia-gold p-12 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-mafia-gold/20 uppercase tracking-[0.5em] rotate-90 origin-top-right">
                RECRUITMENT_PHASE_01
              </div>

              <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
                <div className="w-32 h-32 border-2 border-mafia-gold flex items-center justify-center shrink-0 bg-mafia-black">
                  <Scissors className="text-mafia-gold" size={48} />
                </div>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-mafia-gold uppercase tracking-tighter mb-2 italic">
                      {t.seznamka.brigada.title}
                    </h2>
                    <p className="text-mafia-gold/60 font-mono text-xs uppercase tracking-[0.3em]">
                      {t.seznamka.brigada.subtitle}
                    </p>
                  </div>

                  <p className="text-smoke-white/80 text-lg leading-relaxed italic border-l-4 border-mafia-gold pl-6">
                    {t.seznamka.brigada.desc}
                  </p>

                  <div className="space-y-4 pt-8">
                    <h4 className="text-sm font-heading font-bold text-smoke-white uppercase tracking-widest border-b border-white/10 pb-2 inline-block">
                      {lang === 'cs' ? "CO MUSÍTE SPLŇOVAT / VĚDĚT:" : "REQUIREMENTS / INFO:"}
                    </h4>
                    <ul className="space-y-3">
                      {t.seznamka.brigada.requirements.map((req: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-smoke-white/60 font-sans text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-mafia-gold mt-1.5 shrink-0"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-12">
                    {!showRecruitmentMessage ? (
                      <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setShowRecruitmentMessage(true)}
                        className="group relative overflow-hidden bg-mafia-gold border border-mafia-gold px-12 py-5 transition-all duration-500 hover:shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)] w-full md:w-auto"
                      >
                        <div className="absolute inset-0 block bg-smoke-white -translate-x-[102%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></div>
                        <span className="relative z-10 text-mafia-black font-heading font-black uppercase tracking-[0.3em] group-hover:text-mafia-black transition-colors duration-500 text-lg">
                          {t.seznamka.brigada.cta}
                        </span>
                      </motion.button>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-mafia-gold/10 border border-mafia-gold p-8 text-center"
                      >
                        <p className="text-mafia-gold font-heading font-black text-2xl md:text-3xl tracking-tighter animate-pulse">
                          {t.seznamka.brigada.recruitmentSuccess}
                        </p>
                      </motion.div>
                    )}
                    <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-4">
                      {lang === 'cs' ? "POZNÁMKA: Výběrové řízení je neveřejné a vysoce selektivní." : "NOTE: Selection process is private and highly selective."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </section>

      {/* Interactive Legal & Mission Section */}
      <section className="py-24 px-4 md:px-12 border-t border-white/5 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={false}
            className="border border-mafia-gold/20 bg-mafia-dark/40 overflow-hidden"
          >
            <button 
              onClick={() => setIsLegalExpanded(!isLegalExpanded)}
              className="w-full p-6 flex items-center justify-between group transition-colors hover:bg-mafia-gold/5"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 border transition-all duration-500 ${isLegalExpanded ? 'border-mafia-gold bg-mafia-gold/10' : 'border-white/10 text-white/20'}`}>
                  <ShieldCheck size={20} className={isLegalExpanded ? 'text-mafia-gold' : ''} />
                </div>
                <div className="text-left">
                  <h4 className={`text-sm font-heading font-black uppercase tracking-[0.3em] transition-colors ${isLegalExpanded ? 'text-mafia-gold' : 'text-smoke-white/40 group-hover:text-smoke-white/60'}`}>
                    {lang === 'cs' ? 'PRÁVNÍ PROTOKOL & MISE PROJEKTU' : 'LEGAL PROTOCOL & PROJECT MISSION'}
                  </h4>
                  <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest mt-1">
                    {isLegalExpanded ? 'Access Granted // Full Disclosure' : 'Click to decrypt legal documentation'}
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isLegalExpanded ? 180 : 0 }}
                className="text-mafia-gold/30 group-hover:text-mafia-gold transition-colors"
              >
                <ChevronDown size={24} />
              </motion.div>
            </button>

            <AnimatePresence>
              {isLegalExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <div className="p-8 md:p-12 border-t border-white/5 space-y-12">
                    
                    {/* Mission & Vision */}
                    <div className="space-y-4">
                      <h4 className="text-mafia-gold font-heading font-black text-xs uppercase tracking-[0.3em]">Mise & Propojení</h4>
                      <p className="text-[11px] md:text-xs font-sans leading-relaxed text-smoke-white/80">
                        První seznamka propojená s lokálními službami. Do projektu jsou vítáni všichni partneři poskytující služby, které mohou být propojeny se seznamkou. Spolupráce je dobrovolná a každý partner bude informován o pravidlech ochrany osobních údajů a podmínkách zapojení.
                      </p>
                      <p className="text-[11px] md:text-xs font-sans leading-relaxed text-smoke-white/80">
                        V budoucnu plánujeme integrovat seznamovací aplikaci propojenou s našimi partnery – barbershopy, kadeřnictví, kosmetikou, wellness a dalšími službami.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                      
                      {/* Terms of Concept */}
                      <div className="space-y-6">
                        <h4 className="text-mafia-gold font-heading font-black text-[10px] uppercase tracking-[0.3em]">PODMÍNKY A OCHRANA KONCEPTU</h4>
                        <div className="space-y-4 text-[10px] font-mono uppercase tracking-wider leading-relaxed text-smoke-white/60">
                          <div>
                            <span className="text-mafia-gold/80 block mb-1">1. Úvodní ustanovení</span>
                            Tento projekt propojuje seznamku s různými službami poskytovanými partnery (např. barbershopy, kadeřnictví, kosmetika, wellnes, fitness) jedinečným způsobem. Veškeré části projektu – včetně názvu, designu, textů a způsobu propojení klientů se službami – jsou chráněny autorským právem podle zákona č. 121/2000 Sb.
                          </div>
                          <div>
                            <span className="text-mafia-gold/80 block mb-1">2. Duševní vlastnictví</span>
                            Veškerý obsah publikovaný na webu nebo přidružených profilech a platformách je výhradním duševním vlastnictvím provozovatele. Jakékoliv kopírování či zneužití je zakázáno.
                          </div>
                          <div>
                            <span className="text-mafia-gold/80 block mb-1">3. Souhlas účastníků</span>
                            Každá osoba zapojená do projektu byla předem informována a výslovně souhlasila se zařazením do systému.
                          </div>
                          <div>
                            <span className="text-mafia-gold/80 block mb-1">4. Ochrana soukromí</span>
                            Projekt nezveřejňuje žádná skutečná jména ani fotografie bez výslovného souhlasu. Přezdívky jsou smyšlené či stylizované.
                          </div>
                        </div>
                      </div>

                      {/* GDPR Quick View */}
                      <div className="space-y-6">
                        <h4 className="text-mafia-gold font-heading font-black text-[10px] uppercase tracking-[0.3em]">GDPR & OCHRANA ÚDAJŮ</h4>
                        <div className="space-y-4 text-[10px] font-mono uppercase tracking-wider leading-relaxed text-smoke-white/60">
                          <div><span className="text-mafia-gold/80">Správce:</span> Tomáš Mička, Bedřicha Buchlovana 882, UH.</div>
                          <div><span className="text-mafia-gold/80">Účel:</span> Propojení osob v rámci projektu a využití partnerských služeb.</div>
                          <div><span className="text-mafia-gold/80">Práva:</span> Máte právo na přístup, opravu, výmaz či omezení zpracování vašich údajů.</div>
                          <div><span className="text-mafia-gold/80">Kontakt:</span> mickatomas@seznam.cz</div>
                        </div>
                      </div>
                    </div>

                    {/* Copyright Footer */}
                    <div className="pt-12 border-t border-white/5 text-center">
                      <p className="text-mafia-gold font-heading font-black text-[10px] uppercase tracking-[0.5em] mb-4">
                        © 2025 Tomáš Mička. Všechna práva vyhrazena.
                      </p>
                      <p className="text-[9px] font-sans text-smoke-white/20 max-w-2xl mx-auto leading-relaxed">
                        Veškerý obsah tohoto webu je chráněn autorským právem. Jakékoliv kopírování či užívání bez výslovného souhlasu autora není dovoleno.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Footer />

      <BottomTerminalReveal thresholdMultiplier={1.5}>
        {(level) => (
          <>
            {level >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <DatingSEOArchive />
              </motion.div>
            )}
          </>
        )}
      </BottomTerminalReveal>
    </main>
  );
}
