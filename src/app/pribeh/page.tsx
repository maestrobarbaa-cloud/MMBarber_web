"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Target, 
  Zap, 
  Shield, 
  Star, 
  Users, 
  Rocket, 
  BookOpen, 
  Flag,
  FileText,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

interface StoryNode {
  id: string;
  year: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  x: number; // percentage from left
  y: number; // percentage from top
  connections: string[];
  type?: 'major' | 'minor' | 'branch';
}

const STORY_NODES: StoryNode[] = [
  {
    id: "origin",
    year: "2013 — 2017",
    title: "TECHNICKÝ ZÁKLAD",
    content: "Vystudoval jsem SSŠPHZ Uherské Hradiště, obor elektrotechnika. Na papíře jeden směr, v realitě ale začátek cesty, která se postupně začala ubírat jiným směrem.",
    icon: <Zap size={24} />,
    x: 10,
    y: 50,
    connections: ["craft"],
    type: 'major'
  },
  {
    id: "craft",
    year: "2017",
    title: "SVĚT DETAILU",
    content: "Po škole jsem si dodělal nástavbové studium kadeřník, které mi otevřelo svět práce s lidmi, stylem a detailem. Právě tam jsem pochopil, že mě zajímá něco víc než technický obor — prostředí, kde má práce okamžitý dopad na člověka.",
    icon: <Target size={24} />,
    x: 25,
    y: 40,
    connections: ["experience"],
    type: 'major'
  },
  {
    id: "experience",
    year: "2018 — 2022",
    title: "TERÉNNÍ PRŮZKUM",
    content: "Zkušenosti jsem sbíral v Brně i Uherském Hradišti, kde jsem prošel různými provozy a situacemi. Každé místo mě něco naučilo a posunulo dál. Historie této cesty je dnes vidět v recenzích a zpětné vazbě klientů.",
    icon: <Shield size={24} />,
    x: 40,
    y: 40,
    connections: ["academic", "maverick"],
    type: 'major'
  },
  {
    id: "academic",
    year: "2022 — 2024",
    title: "TITUL NENÍ CÍL",
    content: "Univerzita Tomáše Bati ve Zlíně, sociální pedagogika. Postupem času jsem ale pochopil jednu věc — titul není cíl. Je to jen formální potvrzení, které nikdy nenahradí reálnou zkušenost a praxi.",
    icon: <BookOpen size={24} />,
    x: 55,
    y: 25,
    connections: ["vision"],
    type: 'minor'
  },
  {
    id: "maverick",
    year: "ROZCESTÍ",
    title: "VLASTNÍ SMĚR",
    content: "Nechci jít s proudem jen proto, že je to běžná volba. Raději si volím vlastní směr — i když je delší, náročnější a bez jistot. Nechávám ostatní jít vyšlapanou cestou a já si hledám vlastní.",
    icon: <Flag size={24} />,
    x: 55,
    y: 65,
    connections: ["vision"],
    type: 'branch'
  },
  {
    id: "vision",
    year: "SOUČASNOST",
    title: "ZROZENÍ MMBARBER",
    content: "Tenhle podnik nevznikl proto, aby byl „další barbershop“. Vznikl pro přístup, který má klid, respekt a hloubku. Chci dělat věci vědomě, poctivě a s důrazem na detail i atmosféru.",
    icon: <Star size={24} />,
    x: 75,
    y: 50,
    connections: ["people"],
    type: 'major'
  },
  {
    id: "people",
    year: "MISE",
    title: "LIDÉ & PŘÍLEŽITOSTI",
    content: "Chci dávat příležitost i těm, kteří ji jinde třeba nedostali. Mladším lidem, kteří chtějí začít. Šance není samozřejmost. Chci budovat prostředí, kde se lidé stávají součástí něčeho většího.",
    icon: <Users size={24} />,
    x: 88,
    y: 40,
    connections: ["future"],
    type: 'major'
  },
  {
    id: "future",
    year: "VIZE",
    title: "CESTA POKRAČUJE",
    content: "Mým cílem není jen podnik. Chci vytvářet místo, kde se spojuje poctivá práce, respekt k lidem a růst. Nejde mi o status, jde mi o reálnou hodnotu. Tohle je cesta, která teprve začíná.",
    icon: <Rocket size={24} />,
    x: 95,
    y: 50,
    connections: [],
    type: 'major'
  }
];

export default function StoryPage() {
  const router = useRouter();
  const { lang } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<StoryNode | null>(STORY_NODES[0]);
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set(["origin"]));
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);

  // Load visited nodes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mmbarber_story_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setVisitedNodes(new Set(parsed));
      } catch (e) {}
    }
  }, []);

  // Update visited nodes when selected
  useEffect(() => {
    if (selectedNode && !visitedNodes.has(selectedNode.id)) {
      const nextVisited = new Set(visitedNodes);
      nextVisited.add(selectedNode.id);
      setVisitedNodes(nextVisited);
      localStorage.setItem("mmbarber_story_progress", JSON.stringify(Array.from(nextVisited)));
    }
  }, [selectedNode, visitedNodes]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = target.scrollLeft / (target.scrollWidth - target.clientWidth);
    setScrollProgress(progress);
  };

  // Mouse Dragging Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Automatic Selection Logic (Center Tracking)
  useEffect(() => {
    const handleAutoSelect = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const scrollCenterX = container.scrollLeft + container.clientWidth / 2;
      const totalWidth = container.scrollWidth;

      let closestNode = STORY_NODES[0];
      let minDistance = Infinity;

      STORY_NODES.forEach(node => {
        const nodeX = (node.x / 100) * totalWidth;
        const distance = Math.abs(scrollCenterX - nodeX);
        if (distance < minDistance) {
          minDistance = distance;
          closestNode = node;
        }
      });

      // Only auto-select if reasonably close (e.g. within 15% of viewport width)
      if (minDistance < container.clientWidth * 0.15) {
        setSelectedNode(closestNode);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleAutoSelect);
      return () => container.removeEventListener("scroll", handleAutoSelect);
    }
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const scrollAmount = 200;
      if (e.key === "ArrowRight") {
        containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      } else if (e.key === "ArrowLeft") {
        containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-mafia-black text-smoke-white overflow-hidden selection:bg-mafia-gold selection:text-mafia-black flex flex-col lg:flex-row">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-mafia-gold/5 via-transparent to-mafia-black"></div>
      </div>

      {/* LEFT SIDE: Personal Diary / Dossier */}
      <div className="w-full lg:w-[450px] xl:w-[550px] h-[40vh] lg:h-full bg-[#0c0c0c] border-b lg:border-b-0 lg:border-r border-mafia-gold/20 relative z-40 flex flex-col shadow-[10px_0_50px_rgba(0,0,0,0.5)]">
        {/* Diary Binding Effect */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-r from-black/50 to-transparent"></div>
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black via-black/20 to-transparent opacity-40"></div>
        
        {/* Header inside Diary */}
        <div className="p-8 pt-24 lg:pt-8 pb-4 flex items-center justify-end">
          <div className="text-mafia-gold/20 font-mono text-[8px] tracking-[0.5em] text-right">
            DOC_REF: MM_812<br/>
            STATUS: ACTIVE
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-mafia-gold/10 p-8 pt-0">
          <AnimatePresence mode="wait">
            {selectedNode && (
              <motion.div 
                key={selectedNode.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <div className="relative pt-12">
                   {/* 'CLASSIFIED' STAMP */}
                   <div className="absolute top-0 left-0 border-2 border-mafia-red/20 text-mafia-red/20 font-black text-xl px-2 py-1 rotate-[-15deg] pointer-events-none select-none uppercase font-mono">
                      PŘÍSNĚ TAJNÉ
                   </div>
                   
                   <div className="flex items-center gap-4 mb-2">
                     <span className="text-mafia-gold font-mono text-xs tracking-widest">{selectedNode.year}</span>
                     <div className="h-[1px] flex-1 bg-mafia-gold/20"></div>
                   </div>
                   
                   <h2 className="text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter italic leading-none mb-6">
                      {selectedNode.title}
                   </h2>
                </div>

                <div className="relative group">
                  <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-mafia-gold/30"></div>
                  <p className="text-smoke-white/90 text-lg md:text-xl font-sans leading-relaxed italic first-letter:text-4xl first-letter:font-heading first-letter:text-mafia-gold first-letter:mr-1">
                    {selectedNode.content}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="pt-12 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-mafia-gold/5 border border-mafia-gold/20 flex items-center justify-center text-mafia-gold">
                      {selectedNode.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-widest">ID_OPERACE</div>
                      <div className="text-xs font-heading font-bold text-smoke-white uppercase">{selectedNode.id}</div>
                    </div>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="mt-12 flex items-center gap-2">
                  {STORY_NODES.map((node, i) => (
                    <motion.div 
                      key={node.id} 
                      animate={{ 
                        backgroundColor: STORY_NODES.indexOf(selectedNode) >= i ? "#c5a059" : "rgba(197, 160, 89, 0.1)",
                        height: STORY_NODES.indexOf(selectedNode) === i ? 6 : 2
                      }}
                      className="flex-1 transition-all duration-700"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* RIGHT SIDE: Campaign Map */}
      <div className="flex-1 h-[60vh] lg:h-full relative overflow-hidden bg-mafia-black/30 backdrop-blur-sm">
        {/* Tactical Grid Background */}
        {/* Fine Grid with Sector Labels */}
        <div 
          className="absolute inset-0 z-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(197, 160, 89, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(197, 160, 89, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        >
          {/* Sector Labels Overlay */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none">
             {[...Array(144)].map((_, i) => (
               <div key={i} className="border-r border-b border-mafia-gold/5 p-1 flex items-start justify-start">
                  <span className="text-[6px] font-mono text-mafia-gold/20 uppercase">
                    {String.fromCharCode(65 + Math.floor(i / 12))}{i % 12 + 1}
                  </span>
               </div>
             ))}
          </div>
        </div>

        {/* Large Strategic Grid */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(197, 160, 89, 0.6) 2px, transparent 2px),
              linear-gradient(to bottom, rgba(197, 160, 89, 0.6) 2px, transparent 2px)
            `,
            backgroundSize: '400px 400px'
          }}
        ></div>

        {/* Map Header */}
        <div className="absolute top-0 right-0 p-8 z-30 pointer-events-none text-right">
          <h1 className="text-xl md:text-2xl font-heading font-black text-mafia-gold/40 uppercase tracking-widest">MAP_OVERVIEW</h1>
          <div className="text-[8px] font-mono text-mafia-gold/20 tracking-[0.5em] mt-1">GRID_REF: 49.0683° N, 17.4597° E</div>
        </div>

        <div 
          ref={containerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`h-full w-full overflow-x-auto overflow-y-hidden ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'} no-scrollbar transition-all`}
        >
          <div className="relative h-full w-[450vw] md:w-[350vw] lg:w-[300vw] flex items-center">
            
            {/* SVG Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(197, 160, 89, 0.1)" />
                  <stop offset="50%" stopColor="rgba(197, 160, 89, 0.4)" />
                  <stop offset="100%" stopColor="rgba(197, 160, 89, 0.1)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {STORY_NODES.map(node => (
                node.connections.map(connId => {
                  const target = STORY_NODES.find(n => n.id === connId);
                  if (!target) return null;
                  
                  const isFullyDiscovered = visitedNodes.has(node.id) && visitedNodes.has(target.id);
                  const isNextPotential = selectedNode?.id === node.id && !visitedNodes.has(target.id);
                  
                  return (
                    <motion.line
                      key={`${node.id}-${connId}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${target.x}%`}
                      y2={`${target.y}%`}
                      stroke="url(#lineGrad)"
                      strokeWidth={isFullyDiscovered ? "3" : isNextPotential ? "2" : "1.5"}
                      strokeDasharray={isFullyDiscovered ? "0" : "8,8"}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ 
                        pathLength: 1, 
                        opacity: isFullyDiscovered ? 0.9 : isNextPotential ? 0.5 : 0.25,
                      }}
                      transition={{ duration: 1 }}
                      style={{ 
                        filter: isFullyDiscovered ? "url(#glow)" : "none",
                      }}
                    />
                  );
                })
              ))}
            </svg>

            {/* Nodes */}
            {STORY_NODES.map((node) => (
              <div 
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    if (isDragging) return;
                    setSelectedNode(node);
                    
                    // Smoothly center the node on click
                    if (containerRef.current) {
                      const totalWidth = containerRef.current.scrollWidth;
                      const targetX = (node.x / 100) * totalWidth - containerRef.current.clientWidth / 2;
                      containerRef.current.scrollTo({ left: targetX, behavior: "smooth" });
                    }
                  }}
                  className={`relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-2 transition-all duration-500 ${
                    selectedNode?.id === node.id 
                      ? "bg-mafia-gold text-mafia-black border-white shadow-[0_0_30px_rgba(197,160,89,0.5)]" 
                      : visitedNodes.has(node.id)
                        ? "bg-mafia-black/80 text-mafia-gold border-mafia-gold/60 hover:border-mafia-gold"
                        : "bg-mafia-black/40 text-mafia-gold/20 border-mafia-gold/10 hover:border-mafia-gold/30"
                  }`}
                >
                  {/* Node Label (Year) */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                     <span className="text-[8px] font-mono font-black tracking-[0.2em] opacity-40 uppercase">{node.year}</span>
                  </div>

                  <div className="scale-75 md:scale-100">
                    {node.icon}
                  </div>

                  {/* Tactical Ring */}
                  <AnimatePresence>
                    {selectedNode?.id === node.id && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: [0.5, 0] }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 border border-mafia-gold rounded-full pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
                
                {/* Tactical Title */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                   <span className={`text-[9px] font-heading font-black tracking-widest uppercase transition-colors duration-500 ${selectedNode?.id === node.id ? "text-white" : "text-mafia-gold/40"}`}>
                     {node.title}
                   </span>
                </div>
              </div>
            ))}

            {/* Tactical Decor */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
               <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-mafia-gold rotate-45"></div>
               <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-mafia-gold -rotate-12"></div>
            </div>

            {/* Easter Egg Trigger (Classified File near Technical Basis) */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.3 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              onClick={() => setIsEasterEggOpen(true)}
              className="absolute z-20 w-32 h-32 flex flex-col items-center justify-center cursor-help group pointer-events-auto -translate-x-1/2 -translate-y-1/2"
              style={{ left: '10%', top: '75%' }}
            >
              <div className="w-12 h-12 bg-mafia-gold/5 border border-mafia-gold/20 flex items-center justify-center mb-1 shadow-[0_0_20px_rgba(197,160,89,0.1)] group-hover:border-mafia-gold/60 group-hover:bg-mafia-gold/20 transition-all">
                <FileText size={18} className="text-mafia-gold/40 group-hover:text-mafia-gold" />
              </div>
              <span className="text-[6px] font-mono text-mafia-gold/30 uppercase tracking-[0.4em] group-hover:text-mafia-gold transition-colors">CLASSIFIED_FILE.doc</span>
            </motion.div>
          </div>
        </div>

        {/* Tactical Map Footer */}
        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between pointer-events-none z-30">
          <div className="flex items-center gap-4 opacity-30">
            <div className="w-12 h-[1px] bg-mafia-gold"></div>
            <span className="text-[8px] font-mono uppercase tracking-[0.5em]">Sector_MM_01</span>
          </div>
        </div>
      </div>

      {/* EASTER EGG MODAL (DOSSIER) */}
      <AnimatePresence>
        {isEasterEggOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsEasterEggOpen(false)} 
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, rotateX: 20 }} 
              animate={{ scale: 1, opacity: 1, rotateX: 0 }} 
              exit={{ scale: 0.9, opacity: 0, rotateX: 20 }} 
              className="relative w-full max-w-4xl max-h-[85vh] bg-[#1a1a1a] border-l-8 border-mafia-gold p-8 md:p-16 overflow-y-auto shadow-[0_0_100px_rgba(0,0,0,1)] scrollbar-hide"
            >
              <div className="absolute top-8 right-8">
                <button onClick={() => setIsEasterEggOpen(false)} className="text-mafia-gold/40 hover:text-mafia-gold transition-colors">
                  <X size={32} />
                </button>
              </div>

              <div className="flex items-center gap-6 mb-12 opacity-40">
                <div className="w-12 h-12 border-2 border-mafia-gold flex items-center justify-center font-black text-mafia-gold">MM</div>
                <div className="h-px flex-grow bg-mafia-gold/20"></div>
                <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-mafia-gold">INTERNAL_MEMO // #001</div>
              </div>

              <div className="space-y-12 font-mono text-smoke-white/80 leading-relaxed">
                <section>
                  <h2 className="text-3xl font-heading font-black text-mafia-gold uppercase italic mb-6">CESTA PO SVÝM (MAFIA STYLE)</h2>
                  <p className="mb-4">Ty první weby vznikly rychle. V podstatě mezi svátky, když ostatní seděli u stolu, já jsem seděl u práce a skládal věci dohromady po svým.</p>
                  <p className="mb-4">Nebyl to žádný velký plán. Spíš první krok.</p>
                  <p>Když to pustíš ven, začne to žít vlastním životem. A lidi začnou mluvit.</p>
                </section>

                <section>
                  <h3 className="text-xl font-heading font-black text-mafia-gold uppercase mb-6 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full border border-mafia-gold/30 flex items-center justify-center text-[10px]">01</span>
                    🧠 HLUK VENKU
                  </h3>
                  <p className="mb-4">Začaly chodit zprávy. E-maily. Názory.</p>
                  <p className="mb-4">Že je to slabé. Že by to chtělo víc. Že to není „ono“.</p>
                  <p className="mb-4">Něco z toho bylo užitečné. Něco jen hluk.</p>
                  <p>Ale v jednu chvíli ti dojde jednoduchá věc — když začneš něco dělat jinak, vždycky se najde někdo, komu to nesedí.</p>
                </section>

                <section>
                  <h3 className="text-xl font-heading font-black text-mafia-gold uppercase mb-6 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full border border-mafia-gold/30 flex items-center justify-center text-[10px]">02</span>
                    👊 JÁ NEJSEM NA ŠABLONY
                  </h3>
                  <p className="mb-4">Seděl jsem nad tím a říkal si:</p>
                  <p className="mb-4">Nechci dělat věci tak, jak se mají dělat „správně“.</p>
                  <p className="mb-4">Nechci web, co jen projde kontrolou a zapadne.</p>
                  <p className="mb-4">Chci něco, co má styl. Charakter. Přítomnost.</p>
                  <p>Něco, co není kopie ostatních.</p>
                </section>

                <section>
                  <h3 className="text-xl font-heading font-black text-mafia-gold uppercase mb-6 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full border border-mafia-gold/30 flex items-center justify-center text-[10px]">03</span>
                    🧭 ULICE A REALITA
                  </h3>
                  <p className="mb-4">Neprodávám rychlé řešení.</p>
                  <p className="mb-4">Nejedu podle ceníků a šablon, co vypadají stejně všude.</p>
                  <p className="mb-4">Do každé věci dávám svůj přístup — někdy to drhne, někdy se to hádá, někdy to stojí víc nervů než práce samotná.</p>
                  <p>Ale funguje to. Protože to není hra na dokonalost. Je to realita.</p>
                </section>

                <section>
                  <h3 className="text-xl font-heading font-black text-mafia-gold uppercase mb-6 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full border border-mafia-gold/30 flex items-center justify-center text-[10px]">04</span>
                    🚬 TVÁŘ TOHO, CO DĚLÁM
                  </h3>
                  <p className="mb-4">V dnešní době není těžké kopírovat ostatní.</p>
                  <p className="mb-4">Těžké je stát si za svým.</p>
                  <p>Najít lidi, kteří chtějí dělat věci poctivě, není jednoduché. Ale o to víc to má váhu, když se to povede.</p>
                </section>

                <section>
                  <h3 className="text-xl font-heading font-black text-mafia-gold uppercase mb-6 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full border border-mafia-gold/30 flex items-center justify-center text-[10px]">05</span>
                    🚀 SMĚR
                  </h3>
                  <p className="mb-4">Nejedu s davem.</p>
                  <p className="mb-4">Nejdu tam, kam se má.</p>
                  <p className="mb-4">Jdu svou cestou — pomalejší, těžší, ale vlastní.</p>
                  <p>A postupně z toho stavím něco, co má styl, respekt a smysl.</p>
                </section>

                <section className="pt-12 border-t border-mafia-gold/10 italic text-mafia-gold/60">
                  <h3 className="text-xl font-heading font-black text-mafia-gold uppercase not-italic mb-4">🧭 ZÁVĚR</h3>
                  <p className="mb-2">Tohle není jen web.</p>
                  <p className="mb-2">Tohle je práce, přístup a způsob myšleme.</p>
                  <p>A kdo to chápe, ten je součástí.</p>
                </section>
              </div>

              <div className="mt-20 flex justify-between items-end opacity-20 font-mono text-[8px] uppercase tracking-[0.8em]">
                <span>CONFIDENTIAL_INFORMATION</span>
                <span>ORIGIN: MM_ARCHIVE</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
