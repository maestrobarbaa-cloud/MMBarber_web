"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOMAS_SKILLS } from '@/components/TomasSkillTree';
import { Server, Activity, Network, Target, Cpu, Binary, Zap, Download } from 'lucide-react';
import { generateProceduralParagraph } from '@/utils/proceduralGenerator';
import { TerritoryRadar } from '@/components/TerritoryRadar';

const CORPORATE_MODELS = [
  {
    id: "meta",
    icon: Network,
    badge: 'SOCIAL INFRASTRUCTURE',
    title: { cs: 'Infrastruktura komunitní péče', en: 'Community Grooming Infrastructure' },
    seoKeywords: "metaverse barber, community grooming, connection driven haircut, digital profile enhancement, social capital styling",
    intro: {
      cs: "Naše mise je propojovat globální lídry přes optimalizovanou vizuální identitu. Každý fade je komunitní uzel v síti úspěchu.",
      en: "Our mission is connecting global leaders through optimized visual identity. Every fade is a community node in the network of success."
    }
  },
  {
    id: "microsoft",
    icon: Binary,
    badge: "ENTERPRISE SOLUTIONS",
    title: { cs: "Enterprise Grooming Standard 365", en: "Enterprise Grooming Standard 365" },
    seoKeywords: "enterprise barber solutions, 99.9% reliability haircut, corporate standard grooming, productivity fade, professional appearance system",
    intro: {
      cs: "Poskytujeme škálovatelná řešení osobního vzhledu pro korporátní sféru. 99.9% spolehlivost ostříhání. Žádné výpadky stylu.",
      en: "Providing scalable personal appearance solutions for the corporate sphere. 99.9% haircut reliability. Zero style downtime."
    }
  },
  {
    id: "apple",
    icon: Cpu,
    badge: "PRO PERFORMANCE",
    title: { cs: "Unibody Design Fade", en: "Unibody Design Fade" },
    seoKeywords: "pro performance barber, unibody design fade, magical grooming experience, seamless style integration, premium haircut technology",
    intro: {
      cs: "Nejtenčí a nejpokročilejší přechod (fade), jaký jsme kdy vytvořili. Bezproblémová integrace vašeho těla a našeho strojku. Je to magické.",
      en: "The thinnest and most advanced fade we've ever created. Seamless integration of your body and our clippers. It's magical."
    }
  },
  {
    id: "tesla",
    icon: Zap,
    badge: "DISRUPTIVE INNOVATION",
    title: { cs: "Neural Network Haircuts", en: "Neural Network Haircuts" },
    seoKeywords: "disruptive barber innovation, neural network haircut, autonomous style generation, aerodynamic grooming, rocket growth lifestyle",
    intro: {
      cs: "Akcelerujeme přechod světa k udržitelné dokonalosti. Naše neurální sítě vizuální percepce generují aerodynamický styl pro raketový růst vašeho sebevědomí.",
      en: "Accelerating the world's transition to sustainable perfection. Our visual perception neural networks generate aerodynamic style for your rocket growth confidence."
    }
  }
];

export function HiddenSeoArchive({ lang, mode = 'easter-egg' }: { lang: string, mode?: 'easter-egg' | 'seo-hidden' }) {
  const [isUnlocked, setIsUnlocked] = useState(mode === 'seo-hidden');
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const [winRate, setWinRate] = useState(25.0);
  const [isDownloading, setIsDownloading] = useState(mode === 'easter-egg');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const statsRaw = localStorage.getItem('mmbarber_seo_stats');
      let stats = statsRaw ? JSON.parse(statsRaw) : {};
      
      if (Object.keys(stats).length === 0) {
        CORPORATE_MODELS.forEach(m => { stats[m.id] = 10; });
      }

      const totalTime = Object.values(stats).reduce((a: any, b: any) => a + b, 0) as number;
      
      let randomVal = Math.random() * totalTime;
      let selectedIdx = 0;
      let cumulative = 0;

      for (let i = 0; i < CORPORATE_MODELS.length; i++) {
        cumulative += stats[CORPORATE_MODELS[i].id];
        if (randomVal <= cumulative) {
          selectedIdx = i;
          break;
        }
      }

      setActiveModelIndex(selectedIdx);
      setWinRate((stats[CORPORATE_MODELS[selectedIdx].id] / totalTime) * 100);
      
    } catch (e) {
      setActiveModelIndex(0);
    }
  }, []);

  useEffect(() => {
    if (mode === 'seo-hidden' || !isUnlocked || !isDownloading) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setIsDownloading(false), 500);
      }
      setDownloadProgress(progress);
    }, 300);

    return () => clearInterval(interval);
  }, [isUnlocked, isDownloading, mode]);

  useEffect(() => {
    if (!isUnlocked || mode === 'seo-hidden' || isDownloading) return;

    const timer = setInterval(() => {
      try {
        const statsRaw = localStorage.getItem('mmbarber_seo_stats');
        let stats = statsRaw ? JSON.parse(statsRaw) : {};
        const activeId = CORPORATE_MODELS[activeModelIndex].id;
        
        stats[activeId] = (stats[activeId] || 10) + 1;
        localStorage.setItem('mmbarber_seo_stats', JSON.stringify(stats));
      } catch (e) {}
    }, 1000);

    return () => clearInterval(timer);
  }, [isUnlocked, activeModelIndex, mode, isDownloading]);

  useEffect(() => {
    if (mode === 'seo-hidden') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsUnlocked(true);
          setIsDownloading(true);
          setDownloadProgress(0);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    if (triggerRef.current) observer.observe(triggerRef.current);
    return () => {
      if (triggerRef.current) observer.unobserve(triggerRef.current);
    };
  }, [mode]);

  const activeModel = CORPORATE_MODELS[activeModelIndex];
  const Icon = activeModel.icon;
  const proceduralText = generateProceduralParagraph(lang, activeModel.id, 2);

  const allDescriptions = TOMAS_SKILLS.map(skill => (lang === 'cs' ? skill.desc.cs : skill.desc.en));
  const allLore = TOMAS_SKILLS.flatMap(skill => 
    skill.loreLevels
      .map(lore => (lang === 'cs' ? lore.cs : lore.en))
      .filter(text => !text.includes('BUDOUCÍ AKTUALIZACE') && !text.includes('FUTURE UPDATE'))
  );

  const content = (
    <div className="flex flex-col space-y-12 text-white/50 font-sans relative">
      {mode === 'easter-egg' && (
        <div className="absolute -top-16 left-0 right-0 flex justify-center pointer-events-none">
           <div className="bg-black/80 border border-mafia-gold/40 px-4 py-2 rounded flex flex-col md:flex-row items-center gap-3 backdrop-blur-md shadow-[0_0_20px_rgba(197,160,89,0.3)] animate-pulse">
              <div className="flex items-center gap-2">
                <Cpu className="text-mafia-gold" size={16} />
                <span className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.3em]">
                   {lang === 'cs' ? 'ALGORITMUS:' : 'ALGORITHM:'} {activeModel.badge}
                </span>
              </div>
              <div className="w-px h-3 bg-white/20 hidden md:block"></div>
              <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">
                 [ OPTIMIZATION: {winRate.toFixed(1)}% ]
              </span>
           </div>
        </div>
      )}

      <div className="text-center space-y-4">
         <span className="text-red-500 font-mono text-sm tracking-[0.5em] uppercase drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
            {lang === 'cs' ? 'PŘÍSTUP POVOLEN' : 'ACCESS GRANTED'}
         </span>
         <h2 className="text-4xl lg:text-6xl font-heading font-black text-mafia-gold uppercase tracking-widest leading-none text-shadow-md">
            Global MMBarber Archive
         </h2>
         <p className="text-sm font-mono tracking-widest opacity-60 max-w-2xl mx-auto uppercase">
            {lang === 'cs' 
               ? 'Následující dešifrované spisy odhalují techniky legendárního kadeřnického podsvětí. Obsah je generován jádrem stromu dovedností.'
               : 'The following decrypted files reveal the techniques of the legendary barber underworld. Content is extracted from the core skill tree.'}
         </p>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-mafia-gold/50 to-transparent"></div>

      <div className="prose prose-invert prose-mafia max-w-none">
         <div className="flex items-center gap-4 mb-4">
            {mode === 'easter-egg' && <Icon size={28} className="text-mafia-gold" />}
            <h3 className="m-0 text-white/90">
               {lang === 'cs' ? activeModel.title.cs : activeModel.title.en}
            </h3>
         </div>
         
         <p className="text-lg leading-relaxed text-smoke-white font-medium border-l-4 border-mafia-gold/50 pl-4 mb-4">
            {lang === 'cs' ? activeModel.intro.cs : activeModel.intro.en}
         </p>

         <p className="text-md leading-relaxed text-mafia-gold font-mono italic mb-8">
            &gt;_ {proceduralText}
         </p>
         
         <p className="mt-8">
            {lang === 'cs' 
               ? 'Základem tohoto globálního úspěchu a masivního dosahu jsou unikátní techniky našeho elitního operativce. Analýza zdrojového kódu odhalila tyto kritické funkce systému:'
               : 'The foundation of this global success and massive reach are the unique techniques of our elite operative. Source code analysis revealed these critical system functions:'}
         </p>
         
         <ul className="list-none pl-0 space-y-3 mt-4 text-smoke-white/80">
            {allDescriptions.map((desc, i) => (
               <li key={`desc-${i}`} className="flex gap-3">
                  <span className="text-mafia-gold">▹</span>
                  <span>{desc}</span>
               </li>
            ))}
         </ul>

         <h3 className="mt-16 text-mafia-gold flex items-center gap-3">
            {mode === 'easter-egg' && <Activity size={20} />}
            {lang === 'cs' ? 'Tajné Spisy: Archívy (FAQ)' : 'Secret Files: The Archives (FAQ)'}
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {allLore.map((lore, i) => (
               <div key={`lore-${i}`} className="bg-white/5 border border-white/10 p-5 rounded-sm hover:border-mafia-gold/30 transition-colors">
                  <h4 className="text-white/40 font-mono uppercase tracking-widest text-[10px] mb-3">
                     {lang === 'cs' ? `Záznam #${i + 1000}` : `Record #${i + 1000}`}
                  </h4>
                  <p className="text-sm leading-relaxed italic text-white/80">"{lore}"</p>
               </div>
            ))}
         </div>
         
         <div className="mt-16 p-6 bg-mafia-gold/5 border border-mafia-gold/20 rounded-md">
            <h4 className="text-mafia-gold font-mono tracking-widest uppercase mb-4 text-center">
               Global Search Algorithm Optimization
            </h4>
            <p className="text-[10px] lg:text-xs font-mono text-center text-mafia-gold/60 leading-loose">
               SYSTEM KEYWORDS: <span className="text-white/60">{activeModel.seoKeywords}</span>, luxury lifestyle, secret mafia barber, elite haircut experience, worldwide phenomenon, underground success, famous personalities barbershop, global operative.
            </p>
         </div>

         <div className="mt-16 w-full max-w-4xl mx-auto">
            <TerritoryRadar />
         </div>
      </div>
    </div>
  );

  if (mode === 'seo-hidden') {
    return (
      <div className="sr-only" aria-hidden="true">
        {content}
      </div>
    );
  }

  return (
    <div id="global-archive" className="w-full relative flex flex-col items-center">
      <div className="w-full h-[5000px] lg:h-[12000px] pointer-events-none opacity-0">
         <span className="sr-only">Scroll down to discover the global secrets of the MMBarber mafia lifestyle...</span>
      </div>
      <div ref={triggerRef} className="w-full max-w-4xl px-6 py-24 min-h-screen">
         <AnimatePresence>
            {isUnlocked && isDownloading && (
              <motion.div
                key="downloading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center space-y-6 h-64 font-mono text-mafia-gold"
              >
                <Download className="animate-bounce" size={48} />
                <div className="text-center">
                  <p className="text-sm tracking-[0.2em] uppercase mb-2">
                    {lang === 'cs' ? 'Stahování nejnovějších dat z ' : 'Downloading latest data from '} 
                    {activeModel.id === 'apple' ? 'Cupertino...' : activeModel.id === 'microsoft' ? 'Redmond...' : activeModel.id === 'meta' ? 'Menlo Park...' : 'Palo Alto...'}
                  </p>
                  <p className="text-xs text-white/50">
                    {lang === 'cs' ? 'Aplikování AI procedurálního patche...' : 'Applying AI procedural patch...'}
                  </p>
                </div>
                <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-mafia-gold transition-all duration-300 ease-out"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs">{downloadProgress}%</p>
              </motion.div>
            )}

            {isUnlocked && !isDownloading && (
               <motion.div 
                key="content"
                initial={{ opacity: 0, y: 100 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1, ease: "easeOut" }}
               >
                  {content}
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
