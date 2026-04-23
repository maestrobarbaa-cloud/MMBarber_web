"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2, Scissors, Target, Shield, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function Kariera() {
  const [phase, setPhase] = useState(0);
  const { t } = useTranslation();

  interface Step {
    title: string;
    subtitle: string;
    content: string;
    btnText: string;
    icon: React.ReactNode;
    href?: string;
  }

  const steps: Step[] = [
    {
      title: t.career?.step1Title ?? "CHCEŠ BÝT JEDNÍM Z NÁS?",
      subtitle: t.career?.step1Sub ?? "Zkušební protokol",
      content: t.career?.step1Content ?? "Nábor do MMBARBER není pro každého. Hledáme lidi, kteří znají hodnotu loajality a poctivého řemesla.",
      btnText: t.career?.step1Btn ?? "Zahájit prověrku",
      icon: <Target size={32} className="text-mafia-red mb-6 mx-auto" />
    },
    {
      title: t.career?.step2Title ?? "NEJSME JEN HOLIČSTVÍ. JSME RODINA.",
      subtitle: t.career?.step2Sub ?? "Pravidlo č. 1",
      content: t.career?.step2Content ?? "Očekáváme absolutní oddanost řemeslu, chirurgickou preciznost v každém tahu břitvou a naprostou diskrétnost.",
      btnText: t.career?.step2Btn ?? "Tomu rozumím",
      icon: <Shield size={32} className="text-mafia-gold mb-6 mx-auto" />
    },
    {
      title: t.career?.step3Title ?? "VLASTNÍ KŘESLO A RESPEKT",
      subtitle: t.career?.step3Sub ?? "Odměna za loajalitu",
      content: t.career?.step3Content ?? "My se postaráme o tebe. Dostaneš vlastní křeslo, přístup k VIP klientele a místo u našeho stolu.",
      btnText: t.career?.step3Btn ?? "Jdu do toho",
      icon: <CheckCircle2 size={32} className="text-mafia-gold mb-6 mx-auto" />
    },
    {
      title: t.career?.step4Title ?? "PŘIDEJ SE DO TÝMU",
      subtitle: t.career?.step4Sub ?? "Finální mise",
      content: t.career?.step4Content ?? "Jsi připraven? Pošli nám pár slov o sobě a svých zkušenostech.",
      btnText: t.career?.step4Btn ?? "Otevřít spojení (E-mail)",
      href: "mailto:mmbarber@mmbarber.cz",
      icon: <Scissors size={32} className="text-mafia-gold mb-6 mx-auto" />
    }
  ];

  const handleNext = () => {
    if (phase < steps.length - 1) setPhase(phase + 1);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-mafia-black text-smoke-white selection:bg-mafia-gold selection:text-mafia-black flex items-center justify-center relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] border border-mafia-gold/10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-20 right-10 w-[500px] h-[500px] border border-mafia-red/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
      </div>

      <div className="w-full max-w-2xl z-10 mx-auto text-center relative">
        
        <div className="flex justify-center gap-3 mb-10">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 transition-all duration-500 rounded-none ${
                idx === phase ? 'w-8 bg-mafia-gold' : 
                idx < phase ? 'w-4 bg-mafia-gold/50' : 'w-4 bg-mafia-gold/10'
              }`}
            />
          ))}
        </div>

        <div className="min-h-[350px] relative border-2 border-mafia-gold/30 bg-mafia-black/80 backdrop-blur-md p-10 shadow-[0_0_30px_rgba(197,160,89,0.1)] overflow-hidden">
             <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-mafia-gold/60"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-mafia-gold/60"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-mafia-gold/60"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-mafia-gold/60"></div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={phase}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center h-full"
                >
                    {steps[phase].icon}
                    
                    <span className="font-mono text-mafia-gold uppercase tracking-[0.3em] text-[10px] mb-4 inline-block px-3 py-1 bg-mafia-gold/5 border border-mafia-gold/20">
                        {steps[phase].subtitle}
                    </span>
                    
                    <h2 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-wider leading-tight mb-6">
                        {steps[phase].title}
                    </h2>
                    
                    <p className="text-smoke-white/70 font-sans leading-relaxed text-sm md:text-base mb-10 max-w-lg mx-auto whitespace-pre-wrap">
                    {steps[phase].content}
                    </p>

                    {steps[phase].href ? (
                        <a 
                            href={steps[phase].href}
                            className="group relative overflow-hidden bg-mafia-gold text-mafia-black px-8 py-3 w-full sm:w-auto flex items-center justify-center gap-3 transition-transform hover:scale-105"
                        >
                            <Mail size={16} />
                            <span className="relative z-10 font-heading font-black text-sm md:text-base uppercase tracking-widest whitespace-nowrap">
                                {steps[phase].btnText}
                            </span>
                        </a>
                    ) : (
                        <button 
                            onClick={handleNext}
                            className="group relative overflow-hidden bg-mafia-dark border border-mafia-gold px-8 py-3 w-full sm:w-auto flex items-center justify-center gap-3 transition-all hover:bg-mafia-gold hover:text-mafia-black text-mafia-gold"
                        >
                            <span className="relative z-10 font-heading font-black text-sm md:text-base uppercase tracking-widest whitespace-nowrap">
                                {steps[phase].btnText}
                            </span>
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>

        <div className="mt-8">
            <Link href="/" className="font-mono text-[10px] text-mafia-gold/40 hover:text-mafia-gold transition-colors uppercase tracking-[0.5em] border-b border-mafia-gold/0 hover:border-mafia-gold/30 pb-1">
                {t.career?.backToHq ?? "Zpět na ústředí"}
            </Link>
        </div>
        
      </div>
    </div>
  );
}
