"use client";

import { useEffect, useState, useRef } from "react";
import { useGame } from "@/contexts/GameContext";
import { ACHIEVEMENTS } from "@/data/achievements";
import { Trophy, Lock, Zap, Shield, Crown, ChevronLeft, Package, Users, EyeOff, CheckCircle2, Play, Star, Gift, Settings } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/contexts/UIContext";

const PremiumMafiaBackground = () => {
  const { isBloodMode } = useUI();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="fixed inset-0 bg-[#050505] z-0"></div>;

  const particles = Array.from({ length: 25 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#050505]">
      {/* Základní texturované pozadí (jemný elegantní vzor) */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.83v58.34l-.83.83H5.373l-.83-.83V.83l.83-.83h49.254zM53.8 58.34V1.66H6.2v56.68h47.6zM30 54.34c-13.434 0-24.34-10.906-24.34-24.34S16.566 5.66 30 5.66s24.34 10.906 24.34 24.34-10.906 24.34-24.34 24.34zM30 7.32c-12.518 0-22.68 10.162-22.68 22.68S17.482 52.68 30 52.68 52.68 42.518 52.68 30 42.518 7.32 30 7.32z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }}
      ></div>

      {/* Velmi jemné rohové nasvícení (hladké vykreslování přes radial-gradient místo blur) */}
      <div className={`absolute -top-1/4 -right-1/4 w-[1200px] h-[1200px] opacity-[0.15] transition-colors duration-1000 ${isBloodMode ? 'bg-[radial-gradient(circle_at_center,rgba(200,16,46,0.6)_0%,transparent_60%)]' : 'bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.6)_0%,transparent_60%)]'}`}></div>
      <div className={`absolute -bottom-1/4 -left-1/4 w-[1200px] h-[1200px] opacity-[0.15] transition-colors duration-1000 ${isBloodMode ? 'bg-[radial-gradient(circle_at_center,rgba(200,16,46,0.6)_0%,transparent_60%)]' : 'bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.6)_0%,transparent_60%)]'}`}></div>

      {/* Jemná mlha/kouř u země */}
      <div className={`absolute bottom-0 left-0 w-full h-[50vh] transition-colors duration-1000 ${isBloodMode ? 'bg-gradient-to-t from-[#c8102e]/5 to-transparent' : 'bg-gradient-to-t from-[#d4af37]/5 to-transparent'}`}></div>

      {/* Žhavé jiskry letící jedním směrem (zleva dole -> doprava nahoru) */}
      {particles.map((_, i) => {
        const startX = Math.random() * 120 - 20; // Začátek rozptýlený od -20vw do 100vw
        const distanceX = Math.random() * 40 + 20; // Každá jiskra uletí doprava o 20 až 60vw
        const width = Math.random() * 2 + 1.5; // Velikost 1.5 - 3.5px
        return (
          <motion.div
            key={`elegant-dust-${i}`}
            className={`absolute rounded-full shadow-[0_0_10px_2px_currentColor] ${isBloodMode ? 'bg-mafia-red text-mafia-red' : 'bg-[#ffd700] text-[#ffd700]'}`}
            style={{
              width: `${width}px`,
              height: `${width}px`,
              filter: `blur(${Math.random() * 0.5}px)`,
            }}
            initial={{ 
               y: '110vh', 
               x: `${startX}vw`,
               opacity: 0
            }}
            animate={{
              y: '-10vh',
              x: `${startX + distanceX}vw`,
              opacity: [0, Math.random() * 0.5 + 0.3, 0]
            }}
            transition={{
              duration: 12 + Math.random() * 15, // Přirozená rychlost letu
              repeat: Infinity,
              ease: "linear", // Stálý vítr
              delay: Math.random() * 20
            }}
          />
        );
      })}
    </div>
  );
};

// Generátor 30 úrovní pro každou kapitolu
const generateLevels = (chapterId: string) => {
  const levels = [];
  let visits = 0;
  const maxLevels = chapterId === 'community' ? 33 : 30;
  for (let i = 1; i <= maxLevels; i++) {
    visits += 10 + (Math.floor(i / 5) * 5); // 10, pak 15
    let isMilestone = i % 5 === 0;
    
    let title = isMilestone ? `Milník ${i}` : `Úroveň ${i}`;
    let reward = isMilestone ? "Speciální Odměna" : "Návštěva";
    
    if (chapterId === 'products') {
      if (i === 1) { title = "Grafika systému"; reward = "Vzhled"; visits = 1; isMilestone = true; }
      else if (i === 2) { title = "Zvukové produkty"; reward = "Audio"; visits = 2; isMilestone = true; }
      else if (isMilestone) {
        if (i===5) { title="Základní výbava"; reward="5% Sleva"; }
        if (i===10) { title="Vzorek"; reward="Produkt zdarma"; }
        if (i===15) { title="Pokročilá péče"; reward="10% Sleva"; }
        if (i===20) { title="VIP Balíček"; reward="Doprava zdarma"; }
        if (i===25) { title="Mistr Holič"; reward="Sada hřebenů"; }
        if (i===30) { title="Vybuduj Město"; reward="3D Editor Města (Hra)"; }
      } else {
        reward = `${10 * i} Mincí`;
        title = "Denní odměna";
      }
    } else if (chapterId === 'settings') {
      if (isMilestone) {
        if (i===5) { title="Audio"; reward="Zvukové Efekty"; }
        if (i===10) { title="Visuals"; reward="Efekty Prostředí"; }
        if (i===15) { title="Rozhraní"; reward="Widgety"; }
        if (i===20) { title="Inkognito"; reward="Stealth Mód"; }
        if (i===25) { title="Exkluzivní"; reward="Custom Kurzor"; }
        if (i===30) { title="Absolutní Kontrola"; reward="Přístup do Centrály"; }
      } else {
        reward = "Systémová Data";
        title = "Hacking";
      }
    } else if (chapterId === 'community') {
      const communityMilestone = i % 3 === 0; // custom milestone frequency for community (every 3 levels)
      if (i === 1) {
        title = "Vstup do Komunity";
        reward = "Přístup ke Kartě";
      } else if (communityMilestone) {
        if (i===3) { title="Grafika"; reward="Brand Assets"; }
        if (i===6) { title="Nábor"; reward="Kariéra"; }
        if (i===9) { title="Novinky"; reward="Aktuality"; }
        if (i===12) { title="Hodnocení"; reward="Feedback"; }
        if (i===15) { title="Historky"; reward="Příběhy z křesla"; }
        if (i===18) { title="Projekty"; reward="Spolupráce"; }
        if (i===21) { title="Síň Slávy"; reward="Legendy"; }
        if (i===24) { title="Zlepšení"; reward="Nápady"; }
        if (i===27) { title="Tajný Chat"; reward="Diskuse"; }
        if (i===30) { title="Don"; reward="Respekt Rodiny"; }
        if (i===33) { title="Město"; reward="City Environment"; }
      } else {
        reward = `${5 * i} Návštěv`;
        title = "Respekt";
      }
      
      levels.push({
        id: i,
        title,
        reward,
        xpRequired: visits,
        isMilestone: i === 1 || communityMilestone
      });
      continue;
    }
    
    levels.push({
      id: i,
      title,
      reward,
      xpRequired: visits,
      isMilestone
    });
  }
  return levels;
};

const CHAPTERS = [
  {
    id: "products",
    title: "Nastavení webu",
    description: "Objevte naši kosmetiku a vybavení. Získávejte exkluzivní slevy.",
    icon: Package,
    color: "from-mafia-gold/10 theme-blood:from-mafia-red/10 noir-mode:from-white/10 to-mafia-black/50",
    borderColor: "border-mafia-gold/30 theme-blood:border-mafia-red/30 noir-mode:border-white/30",
    textColor: "text-mafia-gold theme-blood:text-mafia-red noir-mode:text-white",
    locked: false,
    levels: generateLevels("products")
  },
  {
    id: "community",
    title: "Komunita",
    description: "Tvá pozice v rodině. Získej přístup k novinkám, chatu a exkluzivnímu obsahu.",
    icon: Users,
    color: "from-white/5 to-mafia-black/50",
    borderColor: "border-white/10",
    textColor: "text-white",
    locked: false,
    levels: generateLevels("community")
  },
  {
    id: "secret",
    title: "Centrální Nastavení",
    description: "Získej plnou kontrolu nad svým rozhraním. Odemykej si postupně vzhled, widgety a stealth mód.",
    icon: Settings,
    color: "from-white/5 to-mafia-black/50",
    borderColor: "border-white/10",
    textColor: "text-white",
    locked: false,
    levels: generateLevels("settings")
  }
];

export default function PostupPage() {
  const { totalCollected, chapterXp, mafiaRank } = useGame();
  const [mounted, setMounted] = useState(false);
  
  // Stavy pro kapitoly
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [viewedChapterId, setViewedChapterId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mmbarber_active_chapter");
    if (saved) {
      setActiveChapterId(saved);
      setViewedChapterId(saved);
    }
  }, []);

  const handleActivateChapter = (chapterId: string) => {
    setActiveChapterId(chapterId);
    localStorage.setItem("mmbarber_active_chapter", chapterId);
  };

  if (!mounted) return null;

  // Mafia Rank Thresholds
  const ranks = [
    { name: "Soldato", min: 0, max: 150 },
    { name: "Capo", min: 150, max: 500 },
    { name: "Underboss", min: 500, max: 1000 },
    { name: "Don", min: 1000, max: 5000 }
  ];

  const currentRankIndex = ranks.findIndex(r => mafiaRank === r.name);
  const nextRank = ranks[currentRankIndex + 1];
  
  const viewedChapter = CHAPTERS.find(c => c.id === viewedChapterId);

  // Spočítáme progress pro aktivní kapitolu
  const activeChapter = CHAPTERS.find(c => c.id === activeChapterId);
  let chapterProgress = 0;
  if (activeChapter && activeChapter.levels.length > 0) {
    const maxXP = activeChapter.levels[activeChapter.levels.length - 1].xpRequired;
    const currentChapterXp = chapterXp[activeChapter.id] || 0;
    chapterProgress = Math.min(100, (currentChapterXp / maxXP) * 100);
  }

  return (
    <div className="min-h-screen bg-transparent text-white pt-32 pb-24 px-4 relative overflow-hidden font-sans">
      <PremiumMafiaBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-mafia-gold theme-blood:text-mafia-red noir-mode:text-white hover:text-white theme-blood:hover:text-white noir-mode:hover:text-gray-300 transition-colors mb-8 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs uppercase tracking-widest ml-2">Zpět na základnu</span>
        </Link>

        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-widest text-mafia-gold theme-blood:text-mafia-red noir-mode:text-white mb-6 uppercase drop-shadow-[0_0_15px_rgba(197,160,89,0.3)] theme-blood:drop-shadow-[0_0_15px_rgba(200,16,46,0.3)] noir-mode:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Váš postup
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base font-light mb-4">
            Plň úkoly, získávej XP a postupuj v hierarchii. Vyber si cestu, která tě zajímá, a odemykej si exkluzivní odměny úroveň po úrovni.
          </p>
          <div className="inline-flex items-center gap-2 bg-mafia-gold/10 theme-blood:bg-mafia-red/10 noir-mode:bg-white/10 border border-mafia-gold/30 theme-blood:border-mafia-red/30 noir-mode:border-white/30 px-4 py-2 rounded-full text-mafia-gold theme-blood:text-mafia-red noir-mode:text-white text-xs font-mono uppercase tracking-widest">
            <Zap size={14} /> Tvé Celkové XP: {totalCollected.toLocaleString()}
          </div>
        </div>

        {/* Kapitoly Selection */}
        <div className="mb-12">
          <h3 className="text-xl font-light text-white/80 uppercase tracking-[0.3em] mb-8 text-center">
            Zvol si svou cestu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {CHAPTERS.map((chapter) => {
              const Icon = chapter.icon;
              const isActive = activeChapterId === chapter.id;
              const isViewed = viewedChapterId === chapter.id;
              
              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    if ((chapter as any).isRedirect && (chapter as any).redirectUrl) {
                      window.location.href = (chapter as any).redirectUrl;
                    } else {
                      setViewedChapterId(chapter.id);
                    }
                  }}
                  className={`group relative p-8 rounded-2xl text-left transition-all duration-500 overflow-hidden flex flex-col h-full border backdrop-blur-xl
                    ${chapter.locked ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:-translate-y-2'}
                    ${isViewed ? `border-white/20 bg-white/[0.07] scale-[1.02] z-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,1)]` : `border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10`}
                    ${isActive ? 'ring-1 ring-offset-4 ring-offset-mafia-black ring-mafia-gold/50 theme-blood:ring-mafia-red/50 noir-mode:ring-white/50' : ''}
                  `}
                >
                  {/* Background overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${chapter.color} opacity-10 transition-opacity duration-500 group-hover:opacity-20`} />
                  
                  {isActive && (
                    <div className="absolute top-5 right-5 bg-mafia-gold theme-blood:bg-mafia-red noir-mode:bg-white text-black theme-blood:text-white noir-mode:text-black text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-[0_0_15px_rgba(197,160,89,0.5)] theme-blood:shadow-[0_0_15px_rgba(200,16,46,0.5)] noir-mode:shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                      <Zap size={10} /> Aktivní
                    </div>
                  )}

                  {chapter.locked && (
                    <div className="absolute top-5 right-5 text-white/20">
                      <Lock size={20} />
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-8 transition-colors duration-500 border ${isViewed ? 'border-white/20 bg-white/10' : 'border-white/10 bg-white/5 group-hover:border-white/20'}`}>
                    <Icon size={24} className={`${chapter.locked ? 'text-white/20' : chapter.textColor} transition-transform duration-500 group-hover:scale-110`} />
                  </div>
                  
                  <h4 className="text-2xl font-light tracking-wide mb-3 text-white">{chapter.title}</h4>
                  <p className="text-sm text-white/50 mb-8 flex-grow leading-relaxed font-light">{chapter.description}</p>

                  {!chapter.locked && (
                    <div className={`mt-auto inline-flex items-center text-xs font-mono uppercase tracking-widest transition-colors duration-300 ${isViewed ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
                      {(chapter as any).isRedirect ? 'Vstoupit na Cestu' : (isViewed ? 'Zobrazuji' : 'Prohlédnout')} 
                      <ChevronLeft size={14} className={`ml-2 transition-transform duration-500 ${isViewed && !(chapter as any).isRedirect ? '-rotate-90' : 'rotate-180 group-hover:translate-x-1'}`} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Aktivní kapitola - Horizontální posuvník */}
        <AnimatePresence mode="wait">
          {viewedChapter && !viewedChapter.locked && (
            <motion.div
              key={viewedChapter.id}
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-16 overflow-hidden"
            >
              <div className={`p-8 md:p-12 rounded-3xl bg-[#0a0a0a]/80 border border-white/5 backdrop-blur-2xl relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                  <div>
                    <h3 className="text-3xl font-light text-white tracking-wide mb-4 flex items-center gap-4">
                      <viewedChapter.icon className={viewedChapter.textColor} size={28} />
                      {viewedChapter.title}
                    </h3>
                    <p className="text-white/50 font-light text-lg max-w-2xl">
                      {activeChapterId === viewedChapter.id 
                        ? "Tato kapitola je aktuálně aktivní. Každá tvá reálná návštěva (aktivita) na webu se přičítá právě sem." 
                        : "Aktivuj tuto kapitolu, aby se tvé nově získané návštěvy začaly počítat do odemykání těchto odměn. Dosavadní postup v jiných kapitolách zůstane uložen."}
                    </p>
                  </div>
                  
                  {activeChapterId !== viewedChapter.id && (
                    <button 
                      onClick={() => handleActivateChapter(viewedChapter.id)}
                      className={`shrink-0 px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 font-mono text-sm uppercase tracking-widest rounded-lg flex items-center gap-3 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105`}
                    >
                      <Play size={16} />
                      Aktivovat
                    </button>
                  )}
                  {activeChapterId === viewedChapter.id && (
                    <div className="shrink-0 text-right">
                       <div className="text-xs font-mono uppercase tracking-widest text-mafia-gold/60 mb-2">Aktivní Linka</div>
                       <div className="text-3xl font-light text-white">{Math.floor(chapterProgress)}%</div>
                    </div>
                  )}
                  {activeChapterId !== viewedChapter.id && (
                    <div className="shrink-0 text-right">
                       <div className="text-xs font-mono uppercase tracking-widest text-white/30 mb-2">Uložený Postup</div>
                       <div className="text-3xl font-light text-white/50">
                         {Math.floor(Math.min(100, ((chapterXp[viewedChapter.id] || 0) / (viewedChapter.levels.length > 0 ? viewedChapter.levels[viewedChapter.levels.length - 1].xpRequired : 1)) * 100))}%
                       </div>
                    </div>
                  )}
                </div>

                {/* The Horizontal Timeline s 30 levely */}
                <div 
                  className="relative py-16 px-4 md:px-8 overflow-x-auto custom-scrollbar"
                  ref={scrollContainerRef}
                >
                  <div className="flex items-center min-w-max gap-6 md:gap-10 relative px-10">
                    {/* Background Line */}
                    <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[2px] bg-white/5" />
                    
                    <div 
                      className={`absolute left-10 top-1/2 -translate-y-1/2 h-[2px] shadow-[0_0_15px_rgba(197,160,89,0.8)] theme-blood:shadow-[0_0_15px_rgba(200,16,46,0.8)] noir-mode:shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-1000 ease-out ${activeChapterId === viewedChapter.id ? 'bg-mafia-gold theme-blood:bg-mafia-red noir-mode:bg-white' : 'bg-white/30'}`}
                      style={{ 
                        width: `calc(${Math.min(100, ((chapterXp[viewedChapter.id] || 0) / (viewedChapter.levels.length > 0 ? viewedChapter.levels[viewedChapter.levels.length - 1].xpRequired : 1)) * 100)}% - 40px)` 
                      }} 
                    />

                    {viewedChapter.levels.map((level, idx) => {
                      const currentViewedChapterXp = chapterXp[viewedChapter.id] || 0;
                      const isCompleted = currentViewedChapterXp >= level.xpRequired;
                      const isNext = activeChapterId === viewedChapter.id && !isCompleted && currentViewedChapterXp < level.xpRequired && (idx === 0 || currentViewedChapterXp >= viewedChapter.levels[idx - 1].xpRequired);
                      
                      const isMilestone = level.isMilestone;

                      return (
                        <div key={level.id} className={`relative z-10 flex flex-col items-center shrink-0 group ${isMilestone ? 'w-40' : 'w-24'}`}>
                          
                          {/* XP Tooltip / Badge - Always visible for milestone, hover for small ones */}
                          <div className={`absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/90 text-[10px] font-mono tracking-widest border whitespace-nowrap transition-all duration-300
                            ${isCompleted || isNext ? 'border-mafia-gold/30 text-mafia-gold theme-blood:border-mafia-red/30 theme-blood:text-mafia-red noir-mode:border-white/30 noir-mode:text-white' : 'border-white/5 text-white/30 group-hover:border-white/20 group-hover:text-white/60'}
                            ${!isMilestone && !isNext && !isCompleted ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}
                          `}>
                            {level.xpRequired} Návštěv
                          </div>

                          {/* Level Node (Bigger for milestones, smaller for regular) */}
                          <div className={`rounded-full flex items-center justify-center transition-all duration-500 relative bg-black backdrop-blur-md
                            ${isMilestone ? 'w-14 h-14' : 'w-6 h-6'}
                            ${isCompleted ? (isMilestone ? 'border-2 border-mafia-gold text-mafia-gold shadow-[0_0_20px_rgba(197,160,89,0.3)] theme-blood:border-mafia-red theme-blood:text-mafia-red theme-blood:shadow-[0_0_20px_rgba(200,16,46,0.3)] noir-mode:border-white noir-mode:text-white noir-mode:shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-mafia-gold theme-blood:bg-mafia-red noir-mode:bg-white border-none shadow-[0_0_10px_rgba(197,160,89,0.5)] theme-blood:shadow-[0_0_10px_rgba(200,16,46,0.5)] noir-mode:shadow-[0_0_10px_rgba(255,255,255,0.5)]') : 'border border-white/10 text-white/30'}
                            ${isNext ? (isMilestone ? 'border-2 border-white text-white scale-110 shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-pulse' : 'bg-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.4)] animate-pulse') : ''}
                            ${!isCompleted && !isNext ? 'group-hover:border-white/30 group-hover:text-white/60 group-hover:scale-110' : ''}
                          `}>
                            {isMilestone ? (
                              isCompleted ? <CheckCircle2 size={24} /> : (isNext ? <Gift size={20} /> : <span className="font-mono text-lg">{idx + 1}</span>)
                            ) : (
                              // Small dot content
                              isCompleted && <div className="w-2 h-2 rounded-full bg-black" />
                            )}
                          </div>
                          
                          {/* Reward Info */}
                          <div className={`mt-6 text-center transition-all duration-500 ${!isCompleted && !isNext ? 'opacity-30 group-hover:opacity-100' : 'opacity-100'}`}>
                            {isMilestone ? (
                              <>
                                <div className="text-[10px] uppercase tracking-[0.2em] mb-1 font-mono text-white/50">
                                  {level.title}
                                </div>
                                <div className={`font-light tracking-wider text-sm ${isCompleted || isNext ? viewedChapter.textColor : 'text-white/80'}`}>
                                  {level.reward}
                                </div>
                                {isCompleted && viewedChapter.id === 'secret' && (
                                  <Link 
                                    href="/nastaveni"
                                    className="mt-4 px-4 py-1.5 border border-mafia-gold/30 text-mafia-gold font-mono text-[9px] uppercase tracking-widest hover:bg-mafia-gold hover:text-black transition-colors rounded-full inline-block theme-blood:border-mafia-red/30 theme-blood:text-mafia-red theme-blood:hover:bg-mafia-red noir-mode:border-white/30 noir-mode:text-white noir-mode:hover:bg-white noir-mode:hover:text-black"
                                  >
                                    Spravovat
                                  </Link>
                                )}
                                {isCompleted && viewedChapter.id === 'products' && level.id === 30 && (
                                  <div 
                                    className="mt-4 px-4 py-1.5 border border-mafia-gold/20 text-mafia-gold/50 theme-blood:border-mafia-red/20 theme-blood:text-mafia-red/50 noir-mode:border-white/20 noir-mode:text-white/50 font-mono text-[9px] uppercase tracking-widest rounded-full inline-flex items-center gap-1.5 cursor-not-allowed bg-black/50"
                                    title="Modul je momentálně ve vývoji a není dostupný."
                                  >
                                    <Lock size={10} /> Editor Města (Ve vývoji)
                                  </div>
                                )}
                                {isCompleted && viewedChapter.id === 'community' && level.id === 33 && (
                                  <Link 
                                    href="/physics-demo"
                                    className="mt-4 px-4 py-1.5 border border-mafia-gold/30 text-mafia-gold font-mono text-[9px] uppercase tracking-widest hover:bg-mafia-gold hover:text-black transition-colors rounded-full inline-block theme-blood:border-mafia-red/30 theme-blood:text-mafia-red theme-blood:hover:bg-mafia-red noir-mode:border-white/30 noir-mode:text-white noir-mode:hover:bg-white noir-mode:hover:text-black"
                                  >
                                    Hrát Město
                                  </Link>
                                )}
                                {isCompleted && viewedChapter.id === 'community' && level.id !== 33 && (
                                  <Link 
                                    href="/komunita"
                                    className="mt-4 px-4 py-1.5 border border-mafia-gold/30 text-mafia-gold font-mono text-[9px] uppercase tracking-widest hover:bg-mafia-gold hover:text-black transition-colors rounded-full inline-block theme-blood:border-mafia-red/30 theme-blood:text-mafia-red theme-blood:hover:bg-mafia-red noir-mode:border-white/30 noir-mode:text-white noir-mode:hover:bg-white noir-mode:hover:text-black"
                                  >
                                    Vstoupit
                                  </Link>
                                )}
                                {isCompleted && !(viewedChapter.id === 'secret') && !(viewedChapter.id === 'products' && level.id === 30) && !(viewedChapter.id === 'community') && (
                                  <button
                                    onClick={() => alert(`Odměna "${level.reward}" je připravena k využití na pobočce nebo v profilu.`)}
                                    className="mt-4 px-4 py-1.5 border border-white/20 text-white/80 font-mono text-[9px] uppercase tracking-widest hover:bg-white/10 transition-colors rounded-full inline-flex items-center gap-1.5"
                                  >
                                    <Gift size={10} /> Využít odměnu
                                  </button>
                                )}
                              </>
                            ) : (
                              <div className={`text-[9px] uppercase font-mono tracking-widest ${isCompleted || isNext ? 'text-mafia-gold/70 theme-blood:text-mafia-red/70 noir-mode:text-white/70' : 'text-white/40'}`}>
                                {level.reward}
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Hint Overlay */}
                {activeChapterId !== viewedChapter.id && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-3xl pointer-events-none opacity-0 transition-opacity duration-500" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      {/* Custom Scrollbar Styles for the timeline */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(197,160,89,0.3);
          border-radius: 4px;
        }
        html.theme-blood .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(200,16,46,0.3);
        }
        html.noir-mode .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(197,160,89,0.6);
        }
        html.theme-blood .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(200,16,46,0.6);
        }
        html.noir-mode .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.6);
        }
      `}} />
    </div>
  );
}
