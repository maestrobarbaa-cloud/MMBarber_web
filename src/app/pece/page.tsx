"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight, ChevronLeft, Quote, Snowflake, Leaf, Sun, Wind } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { BottomTerminalReveal } from "@/components/BottomTerminalReveal";
import { CareSEOArchive } from "@/components/CareSEOArchive";
import { MAGAZINE_CS, MAGAZINE_EN, SEASONAL_CS, SEASONAL_EN } from '@/locales/magazine_content';
import { translations } from "@/locales/translations";

function StarField() {
  const [stars, setStars] = useState<{ x: number, y: number, size: number, opacity: number, duration: number, delay: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 300 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.2,
      opacity: Math.random() * 0.7 + 0.1,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 10
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-mafia-gold"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            boxShadow: star.size > 1.5 ? `0 0 ${star.size * 2}px rgba(197, 160, 89, 0.8)` : 'none',
          }}
          animate={{
            opacity: [0, star.opacity, star.opacity * 0.3, star.opacity],
            scale: [0.8, 1.5, 0.8],
            x: [(star.x - 50) * 0.05, (star.x - 50) * 0.2, (star.x - 50) * 0.05],
            y: [(star.y - 50) * 0.05, (star.y - 50) * 0.2, (star.y - 50) * 0.05],
          }}
          transition={{
            duration: star.duration * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay
          }}
        />
      ))}
    </div>
  );
}

function DNAHelix() {
  return (
    <div className="absolute top-0 bottom-0 right-8 md:right-[5%] w-64 pointer-events-none overflow-hidden hidden md:flex flex-col items-center justify-around z-0">
      {[...Array(32)].map((_, i) => (
        <div key={i} className="relative w-full h-8 flex items-center justify-center">
          {/* Synchronized Container for Rung and Points */}
          <motion.div
            className="relative flex items-center justify-center"
            animate={{
              width: ["0px", "180px", "0px"],
              opacity: [0, 1, 0],
              rotateY: [0, 180, 360],
              x: [0, 10, 0, -10, 0] // Subtle horizontal wobble for extra 3D feel
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.18
            }}
          >
            {/* Connection Rung - Tapered line (thicker at ends) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[2.5px] bg-gradient-to-r from-mafia-gold via-mafia-gold/5 to-mafia-gold noir-mode:from-mafia-silver noir-mode:via-mafia-silver/5 noir-mode:to-mafia-silver theme-blood:from-mafia-blood theme-blood:via-mafia-blood/5 theme-blood:to-mafia-blood opacity-60" />
            </div>

            {/* Left Rhombus (Kosodélník) */}
            <div 
              className="absolute left-0 -translate-x-1/2 w-3.5 h-7 bg-mafia-gold noir-mode:bg-mafia-silver theme-blood:bg-mafia-blood shadow-[0_0_20px_var(--user-accent-color)]"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            ></div>

            {/* Right Rhombus */}
            <div 
              className="absolute right-0 translate-x-1/2 w-3.5 h-7 bg-mafia-gold noir-mode:bg-mafia-silver theme-blood:bg-mafia-blood shadow-[0_0_20px_var(--user-accent-color)] opacity-90"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            ></div>
          </motion.div>
        </div>
      ))}
      
      {/* Vertical Backbone Glitters */}
      <motion.div 
        animate={{ y: ["0%", "100%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex flex-col items-center gap-24 opacity-5"
      >
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-px h-40 bg-gradient-to-b from-transparent via-mafia-gold noir-mode:via-mafia-silver theme-blood:via-mafia-blood to-transparent" />
        ))}
      </motion.div>
    </div>
  );
}

export default function CareMagazinePage() {
  const { lang } = useTranslation();
  const MAGAZINE_PAGES = lang === 'en' ? MAGAZINE_EN : MAGAZINE_CS;
  const SEASONAL_CONTENT = lang === 'en' ? SEASONAL_EN : SEASONAL_CS;
  const t_mag = (translations as any)[lang]?.magazine || translations.cs.magazine;

  const [currentPage, setCurrentPage] = useState(0);
  const [season, setSeason] = useState<'winter' | 'spring' | 'summer' | 'autumn'>('spring');
  const [testAnswers, setTestAnswers] = useState<number[]>([]);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    setTestAnswers([]);
    setTestResult(null);
  }, [currentPage]);

  useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month === 12 || month <= 2) setSeason('winter');
    else if (month >= 3 && month <= 5) setSeason('spring');
    else if (month >= 6 && month <= 8) setSeason('summer');
    else setSeason('autumn');
  }, []);

  const nextPage = () => {
    if (currentPage < MAGAZINE_PAGES.length - 1) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const handleTestAnswer = (val: number) => {
    const newAnswers = [...testAnswers, val];
    setTestAnswers(newAnswers);
    const pageType = MAGAZINE_PAGES[currentPage].type;

    if (pageType === 'test' && newAnswers.length === 6) {
      const sum = newAnswers.reduce((a, b) => a + b, 0);
      if (sum <= 9) setTestResult('borealis');
      else if (sum <= 15) setTestResult('meridionalis');
      else setTestResult('orientalis');
    } 
    else if (pageType === 'test-hair' && newAnswers.length === 3) {
      const sum = newAnswers.reduce((a, b) => a + b, 0);
      if (sum <= 4) setTestResult('low-porosity');
      else if (sum <= 7) setTestResult('medium-porosity');
      else setTestResult('high-porosity');
    }
    else if (pageType === 'test-scalp' && newAnswers.length === 3) {
      const sum = newAnswers.reduce((a, b) => a + b, 0);
      if (sum <= 4) setTestResult('dry');
      else if (sum <= 7) setTestResult('oily');
      else setTestResult('problematic');
    }
    else if (pageType === 'test-trichology' && newAnswers.length === 6) {
      const sum = newAnswers.reduce((a, b) => a + b, 0);
      if (sum <= 9) setTestResult('stable');
      else if (sum <= 14) setTestResult('warning');
      else setTestResult('critical');
    }
    else if (pageType === 'alter-ego' && newAnswers.length === 3) {
      const sum = newAnswers.reduce((a, b) => a + b, 0);
      if (sum <= 4) setTestResult('boss');
      else if (sum <= 7) setTestResult('gangster');
      else if (sum <= 10) setTestResult('outsider');
      else setTestResult('gentleman');
    }
  };

  const resetTest = () => {
    setTestAnswers([]);
    setTestResult(null);
  };

  return (
    <main className="min-h-screen bg-black text-white relative flex flex-col selection:bg-mafia-gold selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 z-0 bg-black">
        <StarField />
        <DNAHelix />
      </div>

      <div className="relative flex flex-col flex-1">
        {/* Navigation Sidebar Track */}
        <div className="absolute inset-y-0 left-0 w-80 pointer-events-none z-50 hidden xl:block"
             style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}>
          <div className="sticky top-0 h-screen flex flex-col justify-center pointer-events-auto pl-8 gap-8 translate-y-8">
            <div className="h-12 w-px bg-mafia-gold/20 mx-auto mb-2"></div>
            {Object.entries(MAGAZINE_PAGES.reduce((acc, page, i) => {
               if (!acc[page.category]) acc[page.category] = [];
               acc[page.category].push({ ...page, index: i });
               return acc;
            }, {} as Record<string, any[]>)).map(([category, pages]) => (
               <div key={category} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-1">
                     <div className="w-1.5 h-1.5 bg-mafia-gold rotate-45 shadow-[0_0_5px_rgba(197,160,89,0.3)]"></div>
                     <span className="font-mono text-[11px] text-mafia-gold/60 uppercase tracking-[0.4em] font-black">
                       {category}
                     </span>
                  </div>
                  <div className="flex flex-col gap-3 pl-4 border-l border-white/10">
                     {pages.map((page) => (
                       <button 
                         key={page.index}
                         onClick={() => setCurrentPage(page.index)}
                         className={`group flex items-center gap-4 transition-all duration-500 ${page.index === currentPage ? 'text-mafia-gold' : 'text-white/30 hover:text-white/70'}`}
                       >
                          <div className={`w-2 h-2 rotate-45 transition-all duration-500 ${page.index === currentPage ? 'bg-mafia-gold scale-150 shadow-[0_0_12px_rgba(197,160,89,0.9)]' : 'bg-white/10 group-hover:bg-white/30'}`}></div>
                          <span className={`font-mono text-[10px] uppercase tracking-[0.25em] transition-all duration-500 origin-left whitespace-nowrap ${page.index === currentPage ? 'opacity-100 translate-x-1 font-bold' : 'opacity-50 group-hover:opacity-100'}`}>
                            {page.shortTitle}
                          </span>
                       </button>
                     ))}
                  </div>
               </div>
            ))}
            <div className="h-12 w-px bg-mafia-gold/20 mx-auto mt-2"></div>
          </div>
        </div>

        {/* Mobile Navigation Header */}
        <div className="xl:hidden border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-24 z-[90] overflow-x-auto no-scrollbar scroll-smooth">
           <div className="flex px-4 py-3 gap-6 whitespace-nowrap min-w-max">
              {MAGAZINE_PAGES.map((page, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setCurrentPage(i);
                    // Scroll into view
                    const el = document.getElementById(`mob-nav-${i}`);
                    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                  }}
                  id={`mob-nav-${i}`}
                  className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${i === currentPage ? 'text-mafia-gold' : 'text-white/30'}`}
                >
                   <div className={`w-1.5 h-1.5 rotate-45 transition-all duration-500 ${i === currentPage ? 'bg-mafia-gold scale-125 shadow-[0_0_8px_rgba(197,160,89,0.8)]' : 'bg-white/10'}`}></div>
                   <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
                     {page.shortTitle}
                   </span>
                </button>
              ))}
           </div>
        </div>

        {/* Header */}
        <div className="sticky top-0 z-[110] h-24 flex items-center justify-between px-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
           <Link href="/" className="group flex items-center gap-3 text-mafia-gold noir-mode:text-mafia-silver theme-blood:text-mafia-red hover:text-white transition-all duration-500">
              <div className="w-10 h-10 rounded-full border border-mafia-gold/20 noir-mode:border-mafia-silver/20 theme-blood:border-mafia-red/20 flex items-center justify-center group-hover:border-mafia-gold noir-mode:group-hover:border-mafia-silver theme-blood:group-hover:border-mafia-red group-hover:bg-mafia-gold noir-mode:group-hover:bg-mafia-silver theme-blood:group-hover:bg-mafia-red group-hover:text-black transition-all duration-500">
                 <ArrowLeft size={18} />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">{t_mag.ui.backToSalon}</span>
           </Link>
           <div className="flex flex-col items-end">
              <span className="font-heading font-black text-xl italic tracking-tighter text-white logo-neon">MMBARBER</span>
              <span className="text-[8px] font-mono text-mafia-gold/50 noir-mode:text-mafia-silver/50 theme-blood:text-mafia-red/50 tracking-[0.5em] uppercase">{t_mag.ui.title?.replace(' ', '_')}_v3.4.4</span>
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center relative p-3 md:p-12 mt-4 md:mt-16 z-10">
           <div className="max-w-6xl w-full h-[75vh] md:h-[80vh] relative">
              <AnimatePresence mode="wait">
                 <motion.div
                   key={currentPage}
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 1.02 }}
                   transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                   className="w-full h-full bg-[#0c0c0c] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative"
                 >
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="flex-1 p-6 md:p-20 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-mafia-gold/20">
                      {renderPageContent(MAGAZINE_PAGES[currentPage], season, { handleTestAnswer, testAnswers, testResult, resetTest, lang }, t_mag, SEASONAL_CONTENT)}
                    </div>
                    <div className="absolute bottom-4 right-4 font-mono text-[9px] text-mafia-gold/30 uppercase tracking-widest">
                       {t_mag.ui.page} {currentPage + 1} / {MAGAZINE_PAGES.length}
                    </div>
                 </motion.div>
              </AnimatePresence>

              <div className="absolute -bottom-16 md:-bottom-20 left-0 w-full flex items-center justify-center gap-4 md:gap-8 px-4">
                 <button 
                   onClick={prevPage}
                   disabled={currentPage === 0}
                   className={`p-3 md:p-4 rounded-full border border-mafia-gold/20 transition-all ${currentPage === 0 ? 'opacity-10 cursor-not-allowed' : 'hover:bg-mafia-gold hover:text-black hover:border-mafia-gold active:scale-90'}`}
                 >
                  <ChevronLeft size={20} />
                 </button>
                 <div className="flex-1 max-w-[200px] flex gap-1 md:gap-2">
                    {MAGAZINE_PAGES.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 flex-1 transition-all duration-500 ${i === currentPage ? 'bg-mafia-gold shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'bg-white/10'}`}
                      ></div>
                    ))}
                 </div>
                 <button 
                   onClick={nextPage}
                   disabled={currentPage === MAGAZINE_PAGES.length - 1}
                   className={`p-3 md:p-4 rounded-full border border-mafia-gold/20 transition-all ${currentPage === MAGAZINE_PAGES.length - 1 ? 'opacity-10 cursor-not-allowed' : 'hover:bg-mafia-gold hover:text-black hover:border-mafia-gold active:scale-90'}`}
                 >
                  <ChevronRight size={20} />
                 </button>
              </div>
           </div>
        </div>
        <div className="h-20 md:h-24"></div>
      </div>
      
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
                <CareSEOArchive />
              </motion.div>
            )}
          </>
        )}
      </BottomTerminalReveal>
    </main>
  );
}

function renderPageContent(page: any, season: string, testProps: any, t_mag: any, SEASONAL_CONTENT: any) {
  const { handleTestAnswer, testAnswers, testResult, resetTest, lang } = testProps;

  switch (page.type) {
    case 'cover':
      return (
        <div className="h-full flex flex-col items-center justify-center text-center py-6 md:py-20 relative overflow-hidden">
             <div className="inline-block px-3 py-1 bg-mafia-gold text-black font-mono text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-8 md:mb-12 relative z-20">
                {t_mag.ui.officialPub}
             </div>
             <div className="relative flex flex-col items-center">
                <h1 className="text-7xl min-[400px]:text-8xl md:text-[18rem] font-heading font-black text-white italic leading-none tracking-tighter mb-4 opacity-5 absolute pointer-events-none select-none top-1/2 -translate-y-1/2">
                    {page.title}
                </h1>
                <h1 className="text-6xl min-[400px]:text-7xl md:text-[10rem] font-heading font-black text-white italic leading-none tracking-tighter mb-4 z-10 relative">
                    {page.title}
                </h1>
             </div>
             <p className="text-mafia-gold font-heading font-bold text-lg min-[400px]:text-xl md:text-3xl uppercase tracking-widest mb-8 md:mb-12 italic z-10">
                {page.subtitle}
             </p>
             <div className="mt-8 md:mt-20 pt-6 md:pt-8 border-t border-white/10 w-48 md:w-64 flex justify-center z-10">
                <div className="font-mono text-[9px] md:text-[10px] text-white/40 tracking-widest">{page.edition}</div>
             </div>
        </div>
      );
    case 'editorial':
      return (
        <div className="h-full flex flex-col max-w-4xl mx-auto text-center py-4 md:py-10">
             <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-8 md:mb-12 leading-tight">
                {page.title}
             </h2>
             <div className="relative px-4">
                <Quote className="text-mafia-gold/10 absolute -top-8 -left-2 md:-top-12 md:-left-12 w-12 h-12 md:w-20 md:h-20" />
                <p className="text-smoke-white/80 text-lg md:text-2xl leading-relaxed italic mb-8 md:mb-12 font-serif relative z-10">
                    {page.content}
                </p>
             </div>
             <div className="mt-6 md:mt-12">
                <p className="text-mafia-gold font-heading font-bold text-xl md:text-2xl mb-2">{page.quote}</p>
                <div className="w-10 h-0.5 bg-mafia-gold/30 mx-auto mt-4"></div>
             </div>
        </div>
      );
    case 'rituals':
      return (
        <div className="h-full flex flex-col pb-10">
           <div className="mb-10 md:mb-16 text-center">
              <h2 className="text-4xl md:text-7xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-[0.4em]">{page.subtitle}</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
              {page.rituals.map((r: any, i: number) => (
                <div key={i} className="space-y-4 p-6 md:p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/30 transition-all duration-500">
                   <div className="flex items-center gap-4">
                      <span className="text-mafia-gold font-heading font-black text-xl md:text-2xl italic">{r.country}</span>
                      <div className="flex-1 h-px bg-mafia-gold/20"></div>
                   </div>
                   <p className="text-smoke-white/60 text-xs md:text-base leading-relaxed font-sans italic">
                      {r.fact}
                   </p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'seasonal':
      const content = (SEASONAL_CONTENT as any)[season];
      const icons: any = {
        winter: <Snowflake className="text-blue-400" />,
        spring: <Leaf className="text-green-400" />,
        summer: <Sun className="text-yellow-400" />,
        autumn: <Wind className="text-orange-400" />
      };

      return (
        <div className="h-full flex flex-col pb-10">
           <div className="mb-10 md:mb-16 text-center">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <div className="flex items-center justify-center gap-4">
                 <div className="w-8 h-px bg-mafia-gold/30"></div>
                 {icons[season]}
                 <div className="w-8 h-px bg-mafia-gold/30"></div>
              </div>
           </div>
           <div className="max-w-4xl mx-auto bg-white/[0.02] border border-white/5 p-6 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 md:opacity-10">
                 {icons[season]}
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-white italic mb-4 md:mb-6">{content.title}</h3>
              <p className="text-smoke-white/70 text-base md:text-lg leading-relaxed mb-8 md:mb-12 italic border-l-2 border-mafia-gold pl-4 md:pl-6">
                 {content.desc}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                 {content.tips.map((tip: string, i: number) => (
                   <div key={i} className="p-5 md:p-6 bg-black border border-white/5 hover:border-mafia-gold/40 transition-all group">
                      <div className="text-mafia-gold font-mono text-[9px] mb-3">TIP 0{i+1}</div>
                      <p className="text-smoke-white/60 text-xs md:text-sm leading-relaxed group-hover:text-white transition-colors">{tip}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      );
    case 'fragrance':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="mb-12 md:mb-16">
              <h4 className="text-white font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] mb-6 md:mb-8 border-l-2 border-mafia-gold pl-4">{lang === 'cs' ? 'Genetický Profiler:' : 'Genetic Profiler:'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                 {page.profiles.map((p: any, i: number) => (
                   <div key={i} className="group p-6 md:p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/40 transition-all duration-700">
                      <h5 className="text-mafia-gold font-heading font-bold text-base md:text-lg uppercase mb-4">{p.origin}</h5>
                      <div className="space-y-3 md:space-y-4">
                         <div className="text-[8px] md:text-[9px] font-mono text-white/30 uppercase">{lang === 'cs' ? 'Biometrika:' : 'Biometrics:'} <span className="text-white/60">{p.skin}</span></div>
                         <div className="text-[8px] md:text-[9px] font-mono text-white/30 uppercase">{lang === 'cs' ? 'Genetika:' : 'Genetics:'} <span className="text-white/60">{p.genetics}</span></div>
                         <div className="h-px bg-white/5 w-full my-3 md:my-4"></div>
                         <p className="text-smoke-white/50 text-[10px] md:text-xs leading-relaxed italic">{p.rec}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {page.factors.map((f: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-black border border-white/5 hover:border-mafia-gold/30 transition-all duration-500">
                   <h5 className="text-mafia-gold font-heading font-bold text-base md:text-lg uppercase tracking-widest mb-4 md:mb-6">{f.t}</h5>
                   <p className="text-smoke-white/50 text-xs md:text-sm leading-relaxed font-sans">{f.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'aftercare':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {page.sections.map((section: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/20 transition-all group">
                   <h5 className="text-mafia-gold font-heading font-bold text-base md:text-lg uppercase tracking-widest mb-4 group-hover:text-white transition-colors">{section.t}</h5>
                   <p className="text-smoke-white/50 text-xs md:text-sm leading-relaxed">{section.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'shaving':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {page.steps.map((step: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-black border border-white/5 hover:border-mafia-gold/40 transition-all duration-500 group">
                   <div className="flex items-center gap-4 mb-4 md:mb-6">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-mafia-gold/30 flex items-center justify-center text-mafia-gold font-mono text-xs md:text-sm group-hover:bg-mafia-gold group-hover:text-black transition-all">
                         0{i+1}
                      </div>
                      <h5 className="text-white font-heading font-bold text-base md:text-lg uppercase tracking-widest">{step.t}</h5>
                   </div>
                   <p className="text-smoke-white/50 text-xs md:text-sm leading-relaxed">{step.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'nutrition':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12 text-center md:text-left">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {page.nutrients.map((item: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/20 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <h5 className="text-mafia-gold font-heading font-bold text-lg md:text-xl uppercase tracking-widest">{item.n}</h5>
                      <div className="text-[8px] md:text-[10px] font-mono text-white/30 uppercase tracking-widest">{lang === 'cs' ? 'Klíčová živina' : 'Key Nutrient'}</div>
                   </div>
                   <div className="text-white/80 text-[10px] font-mono mb-4 uppercase tracking-wider bg-white/5 inline-block px-2 py-1">
                      {lang === 'cs' ? 'Zdroje:' : 'Sources:'} {item.f}
                   </div>
                   <p className="text-smoke-white/50 text-xs md:text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'expert':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {page.sections.map((section: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-black border border-white/5 hover:border-mafia-gold/30 transition-all group">
                   <h5 className="text-mafia-gold font-heading font-bold text-base md:text-lg uppercase tracking-widest mb-4 group-hover:text-white transition-colors">{section.t}</h5>
                   <p className="text-smoke-white/50 text-xs md:text-sm leading-relaxed">{section.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'solutions':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {page.categories.map((cat: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/20 transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 text-[30px] md:text-[40px] font-heading font-black text-white/[0.02] pointer-events-none uppercase italic">SOL-0{i+1}</div>
                   <h5 className="text-mafia-gold font-heading font-bold text-lg md:text-xl uppercase tracking-widest mb-4 md:mb-6 group-hover:text-white transition-colors">{cat.t}</h5>
                   <p className="text-smoke-white/50 text-[10px] md:text-sm leading-relaxed border-l border-mafia-gold/20 pl-4 md:pl-6">{cat.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'alter-ego':
      if (testResult) {
        const res = page.results[testResult];
        return (
          <div className="h-full flex flex-col items-center justify-center py-6 md:py-10">
             <motion.div 
               initial={{ opacity: 0, rotateY: 180, scale: 0.8 }} 
               animate={{ opacity: 1, rotateY: 0, scale: 1 }} 
               className="max-w-3xl w-full bg-gradient-to-br from-mafia-gold/20 via-black to-mafia-gold/5 border-2 border-mafia-gold p-8 md:p-16 relative overflow-hidden shadow-[0_0_50px_rgba(197,160,89,0.3)]"
             >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-4 font-mono text-[60px] opacity-10 select-none">ID</div>
                <div className="absolute bottom-0 left-0 p-4 font-mono text-[10px] text-mafia-gold/40 tracking-widest uppercase">Verified by MMBARBER</div>
                
                <h2 className="text-mafia-gold font-heading font-black text-4xl md:text-6xl italic mb-4 tracking-tighter uppercase">{res.title}</h2>
                <div className="w-24 h-1 bg-mafia-gold mb-8"></div>
                
                <p className="text-white text-lg md:text-2xl leading-relaxed mb-10 italic font-serif">
                  {res.desc}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-mafia-gold font-mono text-[10px] uppercase mb-3 tracking-widest font-black">Doporučený střih:</div>
                      <p className="text-white font-heading font-bold text-xl uppercase italic">{res.haircut}</p>
                   </div>
                   <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-mafia-gold font-mono text-[10px] uppercase mb-3 tracking-widest font-black">Úprava vousů:</div>
                      <p className="text-white font-heading font-bold text-xl uppercase italic">{res.beard}</p>
                   </div>
                </div>

                <div className="bg-mafia-gold/10 p-6 border-l-4 border-mafia-gold mb-12">
                   <p className="text-mafia-gold font-mono text-[11px] font-bold uppercase mb-2">PRO TIP:</p>
                   <p className="text-smoke-white/80 italic">{res.advice}</p>
                </div>

                <button 
                  onClick={resetTest} 
                  className="group relative w-full py-6 bg-mafia-gold text-mafia-black font-heading font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:bg-white"
                >
                   <span className="relative z-10">{lang === 'cs' ? 'Zkusit jinou identitu' : 'Try another identity'}</span>
                </button>
             </motion.div>
          </div>
        );
      }

      const q = page.questions[testAnswers.length];
      return (
        <div className="h-full flex flex-col items-center justify-center py-6 md:py-10">
           <div className="max-w-4xl w-full">
              <div className="mb-12 text-center">
                 <h2 className="text-4xl md:text-7xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
                 <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-[0.5em]">{page.subtitle}</p>
              </div>
              <div className="relative">
                 <AnimatePresence mode="wait">
                    <motion.div 
                      key={testAnswers.length}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-8"
                    >
                       <h3 className="text-2xl md:text-4xl font-heading font-bold text-white italic mb-10 text-center leading-tight">
                         {q.q}
                       </h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {q.options.map((opt: any, i: number) => (
                            <button 
                              key={i} 
                              onClick={() => handleTestAnswer(opt.val)} 
                              className="group relative p-6 md:p-8 border border-white/10 bg-white/[0.02] hover:border-mafia-gold transition-all duration-500 text-left overflow-hidden"
                            >
                               <div className="absolute inset-0 bg-mafia-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                               <p className="relative z-10 text-smoke-white/60 group-hover:text-white transition-colors text-base md:text-lg font-sans">
                                 {opt.text}
                               </p>
                               <div className="absolute top-2 right-2 font-mono text-[10px] text-white/10 group-hover:text-mafia-gold/40">0{i+1}</div>
                            </button>
                          ))}
                       </div>
                    </motion.div>
                 </AnimatePresence>
              </div>
           </div>
        </div>
      );
    case 'test':
    case 'test-hair':
    case 'test-scalp':
    case 'test-trichology':
      const questions = page.questions;
      const results = page.results;

      if (testResult) {
        const res = results[testResult];
        return (
          <div className="h-full flex flex-col items-center justify-center py-6 md:py-10">
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full bg-white/[0.03] border border-mafia-gold/30 p-6 md:p-12 relative overflow-hidden">
                <h2 className="text-mafia-gold font-heading font-black text-2xl md:text-4xl italic mb-2">{res.title}</h2>
                <p className="text-smoke-white/80 text-sm md:text-lg leading-relaxed mb-6 md:mb-8 italic">{res.desc}</p>
                
                {res.advice && (
                  <div className="p-4 bg-mafia-gold/5 border-l-2 border-mafia-gold mb-6 md:mb-8">
                    <div className="text-mafia-gold font-mono text-[9px] md:text-[10px] uppercase mb-2 font-bold">
                       {page.type === 'test-scalp' ? (lang === 'cs' ? 'Doporučení:' : 'Recommendation:') : (lang === 'cs' ? 'Expertní rada:' : 'Expert Advice:')}
                    </div>
                    <p className="text-xs md:text-sm text-white/70">{res.advice}</p>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {res.focus && (
                    <div className="text-white/30 text-[9px] md:text-[10px] font-mono uppercase">
                      {lang === 'cs' ? 'Hlavní složka:' : 'Key Ingredient:'} {res.focus}
                    </div>
                  )}
                  
                  {res.warning && (
                    <div className="text-red-400/60 text-[8px] md:text-[9px] font-mono uppercase tracking-widest">
                      {lang === 'cs' ? 'Varování:' : 'Warning:'} {res.warning}
                    </div>
                  )}
                </div>

                <button onClick={resetTest} className="mt-8 w-full py-4 border border-white/10 hover:bg-white/5 transition-all font-mono text-[9px] md:text-[10px] uppercase tracking-widest">
                   {t_mag.ui.reset}
                </button>
             </motion.div>
          </div>
        );
      }

      const currentQ = questions[testAnswers.length];
      return (
        <div className="h-full flex flex-col items-center justify-center py-6 md:py-10">
           <div className="max-w-3xl w-full px-4">
              <div className="mb-10 md:mb-12 text-center">
                 <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
                 <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-[0.4em]">{page.subtitle}</p>
              </div>
              <div className="space-y-6 md:space-y-8">
                 <h3 className="text-xl md:text-2xl font-heading font-bold text-white italic mb-6 md:mb-8 text-center">{currentQ.q}</h3>
                 <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {currentQ.options.map((opt: any, i: number) => (
                      <button key={i} onClick={() => handleTestAnswer(opt.val)} className="p-5 md:p-6 border border-white/5 bg-white/[0.02] hover:border-mafia-gold/50 hover:bg-mafia-gold/5 text-left transition-all group">
                         <p className="text-smoke-white/60 group-hover:text-white transition-colors text-sm md:text-base">{opt.text}</p>
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      );
    default:
      return null;
  }
}
