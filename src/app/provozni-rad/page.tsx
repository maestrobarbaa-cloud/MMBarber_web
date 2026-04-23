"use client";

import Image from "next/image";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { FileText, ChevronLeft, ShieldCheck, AlertTriangle, Scale, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function ProvozniRad() {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-mafia-black text-smoke-white selection:bg-mafia-gold selection:text-mafia-black overflow-hidden relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-l from-mafia-gold/5 to-transparent pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-mafia-red/5 to-transparent pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="mb-20 text-center md:text-left relative">
          <div className="absolute -top-10 -left-10 opacity-5 pointer-events-none">
            <FileText size={200} className="text-mafia-gold" />
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-heading font-black text-white mb-6 uppercase tracking-widest leading-tight"
          >
            {t.rulesPage.title}
          </motion.h1>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="w-32 h-1 bg-mafia-gold mb-10 origin-left mx-auto md:mx-0"
          ></motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-smoke-white/60 font-sans text-lg md:text-xl leading-relaxed max-w-2xl italic border-l-2 border-mafia-gold/20 pl-6"
          >
            {t.rulesPage.subtitle}
          </motion.p>
        </header>

        {/* Rules Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-12"
        >
          {(t.rulesPage.sections as { title: string, text: string }[]).map((section, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="relative group"
            >
              {/* Decorative HUD Corner */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-mafia-gold/30 group-hover:border-mafia-gold transition-colors duration-500"></div>
              
              <div className="bg-mafia-dark/30 border border-mafia-gold/10 p-8 md:p-10 hover:border-mafia-gold/30 transition-all duration-500 relative overflow-hidden backdrop-blur-sm shadow-xl">
                
                {/* Section Index Indicator */}
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-6xl font-black text-mafia-gold font-mono">{idx + 1}</span>
                </div>

                <h2 className="text-xl md:text-2xl font-heading font-bold text-mafia-gold mb-6 uppercase tracking-wider flex items-center gap-4">
                  <div className="w-8 h-px bg-mafia-red"></div>
                  {section.title}
                </h2>
                
                <p className="font-sans text-smoke-white/80 leading-relaxed text-base md:text-lg">
                  {section.text}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Back to Home Button at the bottom */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <NextLink href="/" className="inline-flex items-center gap-4 bg-mafia-dark/80 border border-mafia-gold/30 px-8 py-4 text-mafia-gold hover:bg-mafia-gold hover:text-mafia-black transition-all duration-500 group shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-sm uppercase tracking-[0.3em] font-bold">{t.rulesPage.backBtn}</span>
          </NextLink>
        </motion.div>

        {/* Footer of the document */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 pt-12 border-t border-mafia-gold/10 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 opacity-20 grayscale mb-4">
                <Image src="/logo.png" alt="MM" width={64} height={64} className="w-full h-full object-contain" />
            </div>
            <p className="font-mono text-[10px] text-smoke-white/30 uppercase tracking-[0.5em]">
              MMBARBER OPERATIONAL PROTOCOL &copy; 2024-2026
            </p>
            <div className="flex gap-8 mt-4 text-mafia-gold/20">
                <ShieldCheck size={20} />
                <Scale size={20} />
                <Clock size={20} />
                <AlertTriangle size={20} />
            </div>
          </div>
        </motion.footer>

        {/* Fixed bottom HUD decoration */}
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mafia-gold/20 to-transparent pointer-events-none"></div>

      </div>
    </div>
  );
}
