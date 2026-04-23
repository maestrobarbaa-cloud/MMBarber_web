"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { Footer } from "@/components/Footer";
import { Phone, Mail, ChevronLeft, Cpu, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

const SpiritEffect = () => {
  const [isMounted, setIsMounted] = React.useState(false);
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-mafia-gold/20 blur-xl"
          style={{
            width: Math.random() * 200 + 100,
            height: Math.random() * 200 + 100,
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function SpecialMissionPage() {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-mafia-black text-smoke-white selection:bg-mafia-gold selection:text-mafia-black overflow-x-hidden">
      <main className="flex-1 flex flex-col items-center justify-center relative py-20 px-6 overflow-hidden">
        
        {/* Deep Cinematic Background */}
        <div className="absolute inset-0 z-0 bg-[#050505]">
          <SpiritEffect />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-mafia-gold/5 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="max-w-5xl w-full relative z-10 flex flex-col items-center">
          
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="self-start mb-16"
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-mafia-gold/50 hover:text-mafia-gold transition-colors font-mono text-xs uppercase tracking-widest group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              {t.career.backToHq}
            </Link>
          </motion.div>

          <div className="w-full perspective-1000">
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-full bg-mafia-black/60 border border-mafia-gold/30 p-12 md:p-24 shadow-[0_50px_100px_rgba(0,0,0,0.9)] overflow-hidden rounded-sm group/card"
            >
              {/* Vintage Paper Texture Overlay */}
              <div 
                className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
                style={{ 
                  backgroundImage: `url('/vintage_paper_texture_1776711404358.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />

              {/* Noise Grain Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

              {/* Distressed Vignette */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

              {/* Dynamic Aura behind the text */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                 <motion.div 
                   animate={{ 
                     opacity: [0.1, 0.2, 0.1],
                     scale: [1, 1.1, 1] 
                   }}
                   transition={{ duration: 5, repeat: Infinity }}
                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-mafia-gold/15 via-transparent to-transparent opacity-30" 
                 />
              </div>

              {/* Decorative Tech Corners - Replaced with Vintage Corners */}
              <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-mafia-gold/20 m-4 pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-mafia-gold/20 m-4 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-mafia-gold/20 m-4 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-mafia-gold/20 m-4 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center gap-12" style={{ transform: "translateZ(80px)" }}>
                
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-4 text-mafia-gold font-mono text-xs uppercase tracking-[0.8em] py-2"
                  >
                    <div className="h-[1px] w-8 bg-mafia-gold/40" />
                    MMXXIV
                    <div className="h-[1px] w-8 bg-mafia-gold/40" />
                  </motion.div>
                  
                  <div className="relative group">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: 0.7, 
                        type: "spring", 
                        stiffness: 100,
                        damping: 15 
                      }}
                      className="relative px-6 py-4 flex items-center justify-center"
                    >
                      <h1 className="text-7xl md:text-9xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-smoke-white to-mafia-gold/40 tracking-normal uppercase leading-[1.1] drop-shadow-[0_10px_40px_rgba(197,160,89,0.3)] py-4">
                        T.M
                      </h1>
                      
                      {/* Distressed texture on T.M */}
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rough-paper.png')] opacity-20 pointer-events-none mix-blend-overlay" />
                    </motion.div>

                    {/* T.M Glow Effect */}
                    <div className="absolute -inset-4 bg-mafia-gold/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    
                    {/* Floating Sparkles around T.M */}
                    <div className="absolute inset-0 pointer-events-none">
                       {[...Array(6)].map((_, i) => (
                         <motion.div
                           key={i}
                           className="absolute text-mafia-gold/40"
                           initial={{ opacity: 0 }}
                           animate={{ 
                             opacity: [0, 1, 0],
                             y: [0, -40, -80],
                             x: (i % 2 === 0 ? -1 : 1) * (20 + Math.random() * 40),
                           }}
                           transition={{ 
                             delay: 1.5 + i * 0.3,
                             duration: 4,
                             repeat: Infinity,
                             repeatDelay: Math.random() * 5
                           }}
                           style={{
                             left: (i / 5) * 100 + "%",
                             top: "80%"
                           }}
                         >
                           <Sparkles size={12} />
                         </motion.div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-2xl md:text-4xl font-heading font-black text-white tracking-[0.1em] text-center uppercase"
                  >
                    Líbí se Vám web?
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                    className="relative"
                  >
                    <span className="text-xl md:text-3xl font-serif italic text-mafia-gold tracking-widest text-center border-y border-mafia-gold/20 py-2 px-8">
                      Zakázky přijímáme.
                    </span>
                  </motion.div>
                </div>

                <div className="w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-mafia-gold/20 to-transparent" />

                <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-stretch">
                  <motion.a 
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    href="mailto:mmbarber@mmbarber.cz"
                    className="flex-1 flex flex-col items-center gap-4 p-8 border border-mafia-gold/10 bg-black/40 hover:bg-mafia-gold/5 hover:border-mafia-gold/40 transition-all group relative overflow-hidden"
                  >
                     <Mail size={32} className="text-mafia-gold mb-2 group-hover:scale-110 transition-transform" />
                     <span className="text-[10px] font-mono text-mafia-gold/50 uppercase tracking-widest">EMAILOVÝ KANÁL</span>
                     <span className="text-sm md:text-base font-black tracking-widest">mmbarber@mmbarber.cz</span>
                  </motion.a>

                  <motion.a 
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    href="tel:+420577544073"
                    className="flex-1 flex flex-col items-center gap-4 p-8 border border-mafia-gold/10 bg-black/40 hover:bg-mafia-gold/5 hover:border-mafia-gold/40 transition-all group relative overflow-hidden"
                  >
                     <Phone size={32} className="text-mafia-gold mb-2 group-hover:scale-110 transition-transform" />
                     <span className="text-[10px] font-mono text-mafia-gold/50 uppercase tracking-widest">PŘÍMÁ LINKA</span>
                     <span className="text-lg md:text-xl font-black whitespace-nowrap">+420 577 544 073</span>
                  </motion.a>
                </div>
              </div>

              {/* Liquid Scanline Effect - Slowed down for vintage feel */}
              <div className="absolute inset-0 pointer-events-none">
                 <div className="w-full h-[4px] bg-mafia-gold/5 absolute top-0 animate-scanline-slow opacity-10"></div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 2 }}
            className="mt-16 flex flex-col items-center gap-4 text-center"
          >
            <div className="flex items-center gap-4">
               <Zap size={14} className="text-mafia-gold" />
               <span className="text-[10px] font-mono uppercase tracking-[1em] text-mafia-gold/40">ZABEZPEČENÁ LINKA // ŠIFROVÁNO</span>
               <Zap size={14} className="text-mafia-gold" />
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .animate-scanline-slow {
          animation: scanline 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
