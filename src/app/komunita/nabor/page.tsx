"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function NaborPage() {
  const { lang } = useTranslation();

  return (
    <div className="min-h-screen bg-black text-smoke-white overflow-x-hidden relative selection:bg-mafia-gold selection:text-mafia-black">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(var(--color-mafia-gold-rgb),0.05)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          href="/komunita" 
          className="group flex items-center gap-4 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-xs tracking-[0.4em] uppercase"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          {lang === 'cs' ? "ZPĚT" : "BACK"}
        </Link>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-10 pb-40">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        >
          <Briefcase className="text-mafia-gold mb-12" size={64} />
          
          <h1 className="text-4xl md:text-6xl font-heading font-black uppercase italic tracking-tighter mb-6">
            {lang === 'cs' ? "NÁBOR " : "RECRUITMENT "}
            <span className="text-mafia-gold">
              {lang === 'cs' ? "AMBICIOZNÍCH" : "AMBITIOUS"}
            </span>
          </h1>
          
          <p className="text-smoke-white/40 font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] mb-12 max-w-lg leading-relaxed">
            {lang === 'cs' ? "Bude se konat řízení pro mladé talenty a lidi s touhou něčeho dosáhnout." : "A procedure will be held for young talents and people with a desire to achieve something."}
          </p>

          <div className="bg-mafia-black/40 border border-mafia-gold/30 backdrop-blur-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden max-w-2xl w-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--color-mafia-gold-rgb),0.1)_0%,transparent_60%)]"></div>
            
            <div className="relative z-10">
               <Users className="text-mafia-gold/50 mx-auto mb-6" size={40} />
               <h2 className="text-2xl font-heading font-black uppercase tracking-widest mb-4">
                 {lang === 'cs' ? "JAK SE PŘIHLÁSIT?" : "HOW TO APPLY?"}
               </h2>
               <p className="text-smoke-white text-sm md:text-base leading-relaxed font-sans mb-8">
                 {lang === 'cs' 
                    ? "Zájemci ať se dostaví přímo k nám na stříhání. Hledáme lidi s odhodláním a charakterem. Přijď ukázat, co v tobě je." 
                    : "Those interested should come directly to us for a haircut. We are looking for people with determination and character. Come show what you've got."}
               </p>
               
               <Link href="/rezervace" className="inline-block px-10 py-5 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.3)]">
                  {lang === 'cs' ? "OBJEDNAT SE NA STŘIH" : "BOOK A HAIRCUT"}
               </Link>
            </div>
          </div>

        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
