"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Palette, Star, ArrowLeft, ShieldCheck, Download, Smartphone, Monitor } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "@/components/OptimizedImage";
import { Footer } from "@/components/Footer";
import { BottomTerminalReveal } from "@/components/BottomTerminalReveal";
import { SupportSEOArchive } from "@/components/SupportSEOArchive";

export default function GraphicsPage() {
  const { lang, t } = useTranslation();
  const [isUnlocked, setIsUnlocked] = useState(true);
  return (
    <main className="min-h-screen bg-black text-white selection:bg-mafia-gold selection:text-black overflow-x-hidden">
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--color-mafia-gold-rgb),0.05)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-4 text-mafia-gold hover:text-white transition-all duration-500 relative z-[110]">
            <div className="w-12 h-12 rounded-full border border-mafia-gold/20 flex items-center justify-center group-hover:border-mafia-gold group-hover:bg-mafia-gold group-hover:text-black transition-all duration-500">
              <ArrowLeft size={20} />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.4em] font-bold">
              {lang === 'cs' ? "ZPĚT DO SALONU" : "BACK TO SALON"}
            </span>
          </Link>
          <div className="flex flex-col items-end">
            <span className="font-heading font-black text-2xl italic tracking-tighter text-white">MMBARBER</span>
            <span className="text-[8px] font-mono text-mafia-gold/50 tracking-[0.5em] uppercase">Visual_Assets_v3.5.0</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="space-y-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 border border-mafia-gold/30 bg-mafia-gold/5 text-mafia-gold text-xs font-mono uppercase tracking-[0.5em]">
              <ShieldCheck size={14} />
              {lang === 'cs' ? "PŘÍSTUP SCHVÁLEN" : "ACCESS GRANTED"}
            </div>
            <h1 className="text-6xl md:text-8xl font-heading font-black text-white italic uppercase tracking-tighter leading-none">
              {lang === 'cs' ? "DIGITÁLNÍ" : "DIGITAL"} <span className="text-mafia-gold">{lang === 'cs' ? "ODMĚNY" : "REWARDS"}</span>
            </h1>
            <p className="text-xl md:text-2xl text-smoke-white/60 max-w-3xl mx-auto italic font-light">
              {lang === 'cs' 
                ? "Náš systém odměn zahrnuje exkluzivní digitální aktiva, jako jsou HD tapety pro PC a mobilní zařízení, které odrážejí noir estetiku MM BARBER. Tato aktiva jsou dostupná pro naše nejvěrnější podporovatele."
                : "Our rewards system includes exclusive digital assets, such as HD wallpapers for PC and mobile devices, reflecting the noir aesthetic of MM BARBER. These assets are available to our most loyal supporters."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* PC Wallpaper */}
            <div className="group relative">
              <div className="flex items-center gap-4 mb-6">
                <Monitor size={24} className="text-mafia-gold" />
                <h3 className="text-2xl font-heading font-black text-white uppercase tracking-widest italic">PC_WALLPAPER_HD</h3>
              </div>
              <div className="relative aspect-[16/9] border-2 border-mafia-gold/20 p-2 bg-mafia-dark/40 group-hover:border-mafia-gold/60 transition-all duration-500 overflow-hidden shadow-2xl">
                <Image src="/obr/support_pc.png" alt="PC Bonus" width={1920} height={1080} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                   <a 
                     href="/obr/support_pc.png" 
                     download="MMBARBER_PC_BONUS.png"
                     className="px-10 py-4 bg-mafia-gold text-mafia-black font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white transition-all"
                   >
                     <Download size={20} /> {lang === 'cs' ? "STÁHNOUT" : "DOWNLOAD"}
                   </a>
                </div>
              </div>
            </div>

            {/* Mobile Wallpaper */}
            <div className="group relative">
              <div className="flex items-center gap-4 mb-6">
                <Smartphone size={24} className="text-mafia-gold" />
                <h3 className="text-2xl font-heading font-black text-white uppercase tracking-widest italic">MOBILE_WALLPAPER_HD</h3>
              </div>
              <div className="relative aspect-[9/16] max-w-[320px] mx-auto border-2 border-mafia-gold/20 p-2 bg-mafia-dark/40 group-hover:border-mafia-gold/60 transition-all duration-500 overflow-hidden shadow-2xl">
                <Image src="/obr/support_mobile.png" alt="Mobile Bonus" width={1080} height={1920} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                   <a 
                     href="/obr/support_mobile.png" 
                     download="MMBARBER_MOBILE_BONUS.png"
                     className="px-8 py-3 bg-mafia-gold text-mafia-black font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white transition-all"
                   >
                     <Download size={20} /> {lang === 'cs' ? "STÁHNOUT" : "DOWNLOAD"}
                   </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomTerminalReveal thresholdMultiplier={1.5}>
        {(level) => (
          <>
            <Footer />
            {level >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <SupportSEOArchive />
              </motion.div>
            )}
          </>
        )}
      </BottomTerminalReveal>
    </main>
  );
}
