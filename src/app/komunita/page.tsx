"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useGame } from "@/contexts/GameContext";
import { 
  ArrowLeft, 
  Users,
  ShieldCheck,
  Zap,
  BookOpen,
  Trophy,
  Camera,
  Bell,
  MessageSquare,
  Lightbulb,
  Lock,
  CheckCircle2,
  Gift
} from "lucide-react";
import Link from "next/link";
import Image from "@/components/OptimizedImage";
import { Footer } from "@/components/Footer";

const COMMUNITY_LEVELS = [
  {
    id: 'grafika',
    title: 'GRAFIKA',
    subtitle: 'BRAND ASSETS',
    desc: 'Stáhni si exkluzivní grafiku a tapety.',
    icon: Camera,
    link: '/grafika',
    xpRequired: 300
  },
  {
    id: 'nabor',
    title: 'NÁBOR',
    subtitle: 'KARIÉRA',
    desc: 'Nábor ambiciózních lidí do týmu.',
    icon: Users,
    link: '/komunita/nabor',
    xpRequired: 700
  },
  {
    id: 'novinky',
    title: 'NOVINKY',
    subtitle: 'AKTUALITY',
    desc: 'Zůstaň v obraze. Nejnovější akce.',
    icon: Bell,
    link: '/komunita/novinky',
    xpRequired: 1150
  },
  {
    id: 'hodnoceni',
    title: 'HODNOCENÍ',
    subtitle: 'FEEDBACK',
    desc: 'Přečti si nebo zanech hodnocení.',
    icon: ShieldCheck,
    link: '/komunita/hodnoceni',
    xpRequired: 1750
  },
  {
    id: 'historky',
    title: 'HISTORKY Z KŘESLA',
    subtitle: 'PŘÍBĚHY',
    desc: 'Zajímavé příběhy a zákulisí.',
    icon: BookOpen,
    link: '/komunita/historky',
    xpRequired: 2400
  },
  {
    id: 'projekty',
    title: 'PROJEKTY',
    subtitle: 'SPOLUPRÁCE',
    desc: 'Speciální projekty a kolaborace.',
    icon: Zap,
    link: '/komunita/projekty',
    xpRequired: 3150
  },
  {
    id: 'sin-slavy',
    title: 'SÍŇ SLÁVY',
    subtitle: 'LEGENDY',
    desc: 'Naši nejvěrnější klienti a legendy.',
    icon: Trophy,
    link: '/komunita/sin-slavy',
    xpRequired: 4000
  },
  {
    id: 'zlepseni',
    title: 'ZLEPŠENÍ',
    subtitle: 'NÁPADY',
    desc: 'Máš nápad jak MMBarber vylepšit?',
    icon: Lightbulb,
    link: '/komunita/zlepseni',
    xpRequired: 4900
  },
  {
    id: 'chat',
    title: 'TAJNÝ CHAT',
    subtitle: 'DISKUSE',
    desc: 'Živá diskuse jen pro elitu.',
    icon: MessageSquare,
    link: '/komunita/chat',
    xpRequired: 5950
  }
];

export default function CommunityPage() {
  const { t, lang } = useTranslation();
  const { chapterXp } = useGame();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentCommunityXp = chapterXp['community'] || 0;
  const maxXP = COMMUNITY_LEVELS[COMMUNITY_LEVELS.length - 1].xpRequired;
  const chapterProgress = Math.min(100, (currentCommunityXp / maxXP) * 100);

  return (
    <div className="min-h-screen bg-mafia-black text-smoke-white overflow-x-hidden relative selection:bg-mafia-gold selection:text-mafia-black">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--color-mafia-gold-rgb),0.15)_0%,transparent_70%)] opacity-50"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="group flex items-center gap-4 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-xs tracking-[0.4em] uppercase"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          {t?.sidliste?.return || 'ZPĚT NA ZÁKLADNU'}
        </Link>
        <div className="flex flex-col items-end">
            <div className="w-12 h-12 border border-mafia-gold/20 flex items-center justify-center overflow-hidden p-1">
                <Image src="/logo.png" alt="MM" width={40} height={40} className="w-full h-full object-contain opacity-80" />
            </div>
            <span className="text-[8px] font-mono text-mafia-gold/50 tracking-[0.5em] uppercase mt-2">COMMUNITY_ID_ROOT</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-40">
        
        <div className="flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center w-full"
          >
            <div className="text-mafia-gold font-mono text-[10px] uppercase tracking-[0.8em] mb-8 flex items-center gap-4">
               <div className="h-[1px] w-12 bg-mafia-gold/30"></div>
               {lang === 'cs' ? "MMBARBER_ECOSYSTEM" : "MMBARBER_ECOSYSTEM"}
               <div className="h-[1px] w-12 bg-mafia-gold/30"></div>
            </div>

            <h1 className="text-6xl md:text-[8rem] font-heading font-black uppercase tracking-tighter italic leading-none mb-8 drop-shadow-[0_20px_50px_rgba(0,0,0,1)]">
              {t.others.community.title.slice(0, -3)}<span className="text-mafia-gold">{t.others.community.title.slice(-3)}</span>
            </h1>
            
            <p className="text-xl md:text-3xl font-heading text-smoke-white leading-tight uppercase tracking-tight mb-8 max-w-4xl">
              Tvé místo v rodině se odvíjí od tvých zkušeností. Sbírej XP a odemykej nové možnosti v komunitě.
            </p>

            <div className="inline-flex items-center gap-3 bg-white/5 border border-mafia-gold/30 px-8 py-4 rounded-xl text-mafia-gold font-mono uppercase tracking-widest shadow-[0_0_30px_rgba(197,160,89,0.2)] mb-20">
              <Zap size={20} className="animate-pulse" />
              <span className="text-sm">Tvůj vliv v komunitě:</span>
              <span className="text-2xl font-bold">{currentCommunityXp.toLocaleString()} XP</span>
            </div>

            {/* Timeline Section */}
            <div className="w-full relative bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-light text-white uppercase tracking-[0.3em]">Cesta Komunitou</h2>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-widest mb-1">Celkový postup</div>
                  <div className="text-3xl font-light text-white">{Math.floor(chapterProgress)}%</div>
                </div>
              </div>

              <div 
                className="relative py-12 px-4 overflow-x-auto custom-scrollbar"
                ref={scrollContainerRef}
              >
                <div className="flex items-center min-w-max gap-12 md:gap-20 relative px-10">
                  {/* Background Line */}
                  <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[2px] bg-white/10" />
                  
                  {/* Active Progress Line */}
                  <div 
                    className="absolute left-10 top-1/2 -translate-y-1/2 h-[2px] bg-mafia-gold shadow-[0_0_15px_rgba(197,160,89,0.8)] transition-all duration-1000 ease-out"
                    style={{ width: `calc(${chapterProgress}% - 40px)` }} 
                  />

                  {COMMUNITY_LEVELS.map((level, idx) => {
                    const isCompleted = currentCommunityXp >= level.xpRequired;
                    const isNext = !isCompleted && currentCommunityXp < level.xpRequired && (idx === 0 || currentCommunityXp >= COMMUNITY_LEVELS[idx - 1].xpRequired);
                    const Icon = level.icon;

                    return (
                      <div key={level.id} className="relative z-10 flex flex-col items-center w-56 shrink-0 group">
                        
                        {/* XP Badge */}
                        <div className={`absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded bg-black/90 text-[10px] font-mono tracking-widest border whitespace-nowrap transition-all duration-300 shadow-xl
                          ${isCompleted || isNext ? 'border-mafia-gold/50 text-mafia-gold' : 'border-white/10 text-white/40'}
                        `}>
                          {level.xpRequired} XP
                        </div>

                        {/* Node */}
                        <Link 
                          href={isCompleted ? level.link : '#'}
                          onClick={(e) => {
                            if (!isCompleted) e.preventDefault();
                          }}
                          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 relative bg-black backdrop-blur-md
                            ${isCompleted ? 'border-2 border-mafia-gold text-mafia-gold shadow-[0_0_30px_rgba(197,160,89,0.3)] hover:scale-110 hover:bg-mafia-gold/10 cursor-pointer' : 'border border-white/10 text-white/30 cursor-not-allowed'}
                            ${isNext ? 'border-2 border-white text-white scale-110 shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-pulse' : ''}
                          `}
                        >
                          {isCompleted ? (
                            <Icon size={32} />
                          ) : (
                            isNext ? <Gift size={28} /> : <Lock size={24} />
                          )}
                        </Link>
                        
                        {/* Reward Info */}
                        <div className={`mt-8 text-center transition-all duration-500 ${!isCompleted && !isNext ? 'opacity-40' : 'opacity-100'}`}>
                          <div className="text-xs uppercase tracking-[0.3em] mb-2 font-mono text-mafia-gold/80">
                            {level.subtitle}
                          </div>
                          <div className={`font-black text-xl uppercase tracking-widest mb-3 ${isCompleted || isNext ? 'text-white' : 'text-white/60'}`}>
                            {level.title}
                          </div>
                          <p className="text-sm font-light text-white/50 leading-relaxed">
                            {level.desc}
                          </p>
                        </div>
                        
                        {/* Action Button (only if completed) */}
                        {isCompleted && (
                          <Link 
                            href={level.link}
                            className="mt-6 px-6 py-2 border border-mafia-gold/30 text-mafia-gold font-mono text-[10px] uppercase tracking-widest hover:bg-mafia-gold hover:text-black transition-colors rounded-full"
                          >
                            Vstoupit
                          </Link>
                        )}
                        {!isCompleted && isNext && (
                          <div className="mt-6 px-6 py-2 border border-white/10 text-white/30 font-mono text-[10px] uppercase tracking-widest rounded-full">
                            Zamčeno
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(197,160,89,0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(197,160,89,0.6);
        }
      `}} />
    </div>
  );
}
