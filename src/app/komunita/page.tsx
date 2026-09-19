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
  Gift,
  Star
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
    xpRequired: 1
  },
  {
    id: 'nabor',
    title: 'NÁBOR',
    subtitle: 'KARIÉRA',
    desc: 'Nábor ambiciózních lidí do týmu.',
    icon: Users,
    link: '/komunita/nabor',
    xpRequired: 1
  },
  {
    id: 'novinky',
    title: 'NOVINKY',
    subtitle: 'AKTUALITY',
    desc: 'Zůstaň v obraze. Nejnovější akce.',
    icon: Bell,
    link: '/komunita/novinky',
    xpRequired: 1
  },
  {
    id: 'hodnoceni',
    title: 'HODNOCENÍ',
    subtitle: 'FEEDBACK',
    desc: 'Přečti si nebo zanech hodnocení.',
    icon: ShieldCheck,
    link: '/komunita/hodnoceni',
    xpRequired: 1
  },
  {
    id: 'historky',
    title: 'HISTORKY Z KŘESLA',
    subtitle: 'PŘÍBĚHY',
    desc: 'Zajímavé příběhy a zákulisí.',
    icon: BookOpen,
    link: '/komunita/historky',
    xpRequired: 1
  },
  {
    id: 'projekty',
    title: 'PROJEKTY',
    subtitle: 'SPOLUPRÁCE',
    desc: 'Speciální projekty a kolaborace.',
    icon: Zap,
    link: '/komunita/projekty',
    xpRequired: 1
  },
  {
    id: 'sin-slavy',
    title: 'SÍŇ SLÁVY',
    subtitle: 'LEGENDY',
    desc: 'Naši nejvěrnější klienti a legendy.',
    icon: Trophy,
    link: '/komunita/sin-slavy',
    xpRequired: 1
  },
  {
    id: 'zlepseni',
    title: 'ZLEPŠENÍ',
    subtitle: 'NÁPADY',
    desc: 'Máš nápad jak MMBarber vylepšit?',
    icon: Lightbulb,
    link: '/komunita/zlepseni',
    xpRequired: 1
  },
  {
    id: 'chat',
    title: 'TAJNÝ CHAT',
    subtitle: 'DISKUSE',
    desc: 'Živá diskuse jen pro elitu.',
    icon: MessageSquare,
    link: '/komunita/chat',
    xpRequired: 1
  }
];

export default function CommunityPage() {
  const { t, lang } = useTranslation();
  const { chapterXp, isAdmin } = useGame();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentCommunityXp = isAdmin ? 999999 : (chapterXp['community'] || 0);
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
              Tvé místo v rodině se odvíjí od tvé loajality. Sbírej návštěvy a odemykej nové možnosti v komunitě.
            </p>

            <div className="inline-flex items-center gap-3 bg-white/5 border border-mafia-gold/30 px-8 py-4 rounded-xl text-mafia-gold font-mono uppercase tracking-widest shadow-[0_0_30px_rgba(197,160,89,0.2)] mb-20">
              <Star size={20} className="animate-pulse" />
              <span className="text-sm">Tvůj vliv v komunitě:</span>
              <span className="text-2xl font-bold">{currentCommunityXp.toLocaleString()} Návštěv</span>
            </div>

            {/* Grid Section */}
            <div className="w-full max-w-6xl mx-auto mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {COMMUNITY_LEVELS.map((level, idx) => {
                  const isCompleted = currentCommunityXp >= level.xpRequired;
                  const Icon = level.icon;

                  return (
                    <div 
                      key={level.id} 
                      className={`relative group bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 overflow-hidden flex flex-col items-center text-center
                        ${isCompleted ? 'hover:bg-white/[0.05] hover:border-mafia-gold/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-2' : 'opacity-60 grayscale'}
                      `}
                    >
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-b from-mafia-gold/5 to-transparent opacity-0 transition-opacity duration-500 ${isCompleted ? 'group-hover:opacity-100' : ''}`} />
                      
                      {/* Icon */}
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 border relative z-10
                        ${isCompleted ? 'border-mafia-gold/50 bg-mafia-black text-mafia-gold shadow-[0_0_20px_rgba(197,160,89,0.2)] group-hover:scale-110' : 'border-white/10 bg-white/5 text-white/30'}
                      `}>
                        {isCompleted ? <Icon size={32} /> : <Lock size={32} />}
                      </div>

                      {/* Content */}
                      <div className="relative z-10 flex-grow flex flex-col items-center w-full">
                        <div className="text-[10px] uppercase tracking-[0.3em] mb-2 font-mono text-mafia-gold/60">
                          {level.subtitle}
                        </div>
                        <h3 className="font-black text-2xl uppercase tracking-widest mb-4 text-smoke-white">
                          {level.title}
                        </h3>
                        <p className="text-sm font-light text-smoke-white/60 leading-relaxed mb-8 flex-grow">
                          {level.desc}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="relative z-10 mt-auto w-full">
                        {isCompleted ? (
                          <Link 
                            href={level.link}
                            className="block w-full py-4 border border-mafia-gold/30 text-mafia-gold font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-mafia-gold hover:text-black transition-all duration-300 rounded-xl"
                          >
                            Vstoupit
                          </Link>
                        ) : (
                          <div className="w-full py-4 border border-white/10 text-white/30 font-mono text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2">
                            <Lock size={14} /> Zamčeno (Potřebuješ {level.xpRequired} návštěv)
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        </div>
      </main>

      <Footer />

    </div>
  );
}
