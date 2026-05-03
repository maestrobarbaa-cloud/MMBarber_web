"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, 
  Zap, 
  Shield, 
  Star, 
  Users, 
  Rocket, 
  BookOpen, 
  Flag,
  FileText,
  X,
  Lock,
  Terminal,
  Activity,
  AlertTriangle,
  Flame,
  Fingerprint,
  Heart,
  Search,
  Cpu,
  Ear,
  Timer,
  Layers,
  Laptop
} from "lucide-react";
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
  type?: 'major' | 'minor' | 'branch' | 'secret';
  secretContent?: string;
}

interface StarBg {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  depth: number;
}

const STORY_NODES: StoryNode[] = [
  {
    id: "origin",
    year: "DĚTSTVÍ",
    title: "PRVNÍ KONTAKT",
    content: "Už od dětství jsem měl blízko k technice a počítačům. Jako malý kluk jsem je rozebíral, skládal zpátky a snažil se pochopil, jak fungují. Byl to přirozený zájem, který mě provázel dlouho.",
    icon: <Cpu size={24} />,
    x: 2,
    y: 35,
    connections: ["tech_roots"],
    type: 'major'
  },
  {
    id: "tech_roots",
    year: "NÁVRAT",
    title: "TECHNOLOGICKÉ KOŘENY",
    content: "Postupně jsem se k technice začal vracet – tentokrát s jiným pohledem, větší zkušeností a jasnější hlavou. Začal jsem znovu využívat to, co jsem se naučil dřív, ale novým způsobem.",
    icon: <Terminal size={24} />,
    x: 4,
    y: 80,
    connections: ["origin_technical"],
    type: 'secret',
    secretContent: "Dnes už nevnímám tvorbu jen jako něco technického, ale jako možnost stavět věci po svém. Děkuji za všechny šablony a „hotová řešení“, ale jdu vlastní cestou."
  },
  {
    id: "origin_technical",
    year: "2013 — 2017",
    title: "TECHNICKÝ ZÁKLAD",
    content: "Vystudoval jsem elektrotechniku v Uherském Hradišti. Na papíře jeden směr, v realitě ale začátek cesty, která se postupně začala ubírat jiným směrem.",
    icon: <Zap size={24} />,
    x: 8,
    y: 55,
    connections: ["craft"],
    type: 'major'
  },
  {
    id: "craft",
    year: "2017",
    title: "SVĚT DETAILU",
    content: "Po škole jsem si dodělal kadeřnické studium, které mi otevřelo svět práce s lidmi a detailem. Pochopil jsem, že mě zajímá prostředí, kde má práce okamžitý dopad.",
    icon: <Target size={24} />,
    x: 15,
    y: 65,
    connections: ["experience"],
    type: 'major'
  },
  {
    id: "experience",
    year: "2018 — 2022",
    title: "TERÉNNÍ PRŮZKUM",
    content: "Zkušenosti jsem sbíral v Brně i Uherském Hradišti. Každé místo mě něco naučilo a posunulo dál. Tato cesta je dnes vidět v recenzích a zpětné vazbě klientů.",
    icon: <Shield size={24} />,
    x: 25,
    y: 45,
    connections: ["academic"],
    type: 'major'
  },
  {
    id: "academic",
    year: "2022 — 2024",
    title: "TITUL NENÍ CÍL",
    content: "Studoval jsem sociální pedagogiku na UTB ve Zlíně. Pochopil jsem ale jednu věc — titul nikdy nenahradí reálnou zkušenost a praxi.",
    icon: <BookOpen size={24} />,
    x: 35,
    y: 22,
    connections: ["maverick"],
    type: 'minor'
  },
  {
    id: "maverick",
    year: "ROZCESTÍ",
    title: "VLASTNÍ SMĚR",
    content: "Nechci jít s proudem jen proto, že je to běžná volba. Raději si volím vlastní směr — i když je delší a náročnější. Hledám si vlastní cestu.",
    icon: <Flag size={24} />,
    x: 42,
    y: 50,
    connections: ["vision"],
    type: 'branch'
  },
  {
    id: "vision",
    year: "SOUČASNOST",
    title: "ZROZENÍ MMBARBER",
    content: "Tenhle podnik nevznikl proto, aby byl „další barbershop“. Vznikl pro přístup, který má klid, respekt a hloubku.",
    icon: <Star size={24} />,
    x: 65,
    y: 45,
    connections: ["inner_circle"],
    type: 'major'
  },
  {
    id: "inner_circle",
    year: "CORE BELIEFS",
    title: "ELITNÍ PŘÍSTUP",
    content: "Respekt si nekoupíš. Respekt si musíš zasloužit. V MMBARBER se hraje podle našich pravidel.",
    icon: <Lock size={24} />,
    x: 68,
    y: 25,
    connections: ["people"],
    type: 'secret',
    secretContent: "Není to pro každého. A tak je to správně. Chceme lidi, kteří chápou hodnotu řemesla a loajality."
  },
  {
    id: "people",
    year: "MISE",
    title: "LIDÉ & PŘÍLEŽITOSTI",
    content: "Chci dávat příležitost těm, kteří ji jinde třeba nedostali. Mladším lidem, kteří chtějí začít a stát se součástí něčeho většího.",
    icon: <Users size={24} />,
    x: 75,
    y: 30,
    connections: ["future"],
    type: 'major'
  },
  {
    id: "future",
    year: "VIZE",
    title: "CESTA POKRAČUJE",
    content: "Mým cílem není jen podnik. Chci vytvářet místo, kde se spojuje poctivá práce, respekt k lidem a růst.",
    icon: <Rocket size={24} />,
    x: 78,
    y: 65,
    connections: ["operational_mode"],
    type: 'major'
  },
  {
    id: "operational_mode",
    year: "2024 — 2025",
    title: "OPERATIVNÍ REŽIM",
    content: "Už nejde jen o to, jak držíš nůžky, ale jak řídíš systém. Budování infrastruktury, která funguje bez ohledu na vnější vlivy.",
    icon: <Activity size={24} />,
    x: 85,
    y: 35,
    connections: ["systemic_dominance"],
    type: 'secret',
    secretContent: "Většina lidí vidí jen barber křesle. Já vidím data, logistiku a psychologii. Tohle je úroveň, kde se odděluje hobby od byznysu."
  },
  {
    id: "systemic_dominance",
    year: "2025 — 2026",
    title: "SYSTÉMOVÁ DOMINANCE",
    content: "Regionální autorita je potvrzena. MMBARBER se stává synonymem pro standard kvality na celém Slovácku.",
    icon: <Layers size={24} />,
    x: 92,
    y: 75,
    connections: ["global_standard"],
    type: 'major'
  },
  {
    id: "global_standard",
    year: "2026 — BUDOUCNOST",
    title: "GLOBÁLNÍ STANDARD",
    content: "Hranice regionu jsou minulostí. Standardy MMBARBER jsou uznávané i v mezinárodním kontextu. Cesta nikdy nekončí.",
    icon: <Shield size={24} />,
    x: 98,
    y: 25,
    connections: [],
    type: 'major'
  }
];
const ShootingStar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, angle: 0 });

  useEffect(() => {
    const launch = () => {
      setCoords({
        x: Math.random() * 100,
        y: Math.random() * 50,
        angle: Math.random() * 45 + 135 // shoot downwards
      });
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 2000);
    };

    const timer = setInterval(() => {
      if (Math.random() > 0.7) launch();
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ x: `${coords.x}%`, y: `${coords.y}%`, opacity: 0, scale: 0 }}
      animate={{ 
        x: `${coords.x - 20}%`, 
        y: `${coords.y + 20}%`, 
        opacity: [0, 1, 0],
        scale: [0, 1, 0]
      }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="absolute w-40 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent z-0 pointer-events-none"
      style={{ rotate: `${coords.angle}deg` }}
    />
  );
};

export default function StoryPage() {
  const [selectedNode, setSelectedNode] = useState<StoryNode | null>(STORY_NODES[0]);
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set(["origin"]));
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isSecretRevealed, setIsSecretRevealed] = useState(false);
  const [hackingProgress, setHackingProgress] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const [personalNodesUnlocked, setPersonalNodesUnlocked] = useState(false);
  const [loyalNodesUnlocked, setLoyalNodesUnlocked] = useState(false);
  
  const [stars, setStars] = useState<StarBg[]>([]);

  useEffect(() => {
    setStars([...Array(250)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 5 + 3,
      delay: Math.random() * 10,
      depth: Math.random()
    })));

    const count = parseInt(localStorage.getItem('mmbarber_visit_count') || '0');
    setVisitCount(count);
    if (count >= 5) {
      setPersonalNodesUnlocked(true);
    }
    if (count >= 10) {
      setLoyalNodesUnlocked(true);
    }
  }, []);

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
    // Reset secret reveal when node changes
    setIsSecretRevealed(false);
    setHackingProgress(0);
  }, [selectedNode, visitedNodes]);


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

  const handleRevealSecret = () => {
    if (isSecretRevealed) return;
    
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      setHackingProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsSecretRevealed(true);
      }
    }, 20);
  };

  const personalNodes: StoryNode[] = [
    {
      id: "shadow_days",
      year: "2020 — 2021",
      title: "STÍNOVÁ OPERACE",
      content: "Doba, kdy se formovaly nejtvrdší zásady. Práce pod tlakem v nejistém prostředí. Tehdy jsem pochopil, že se musíš postarat o své lidi.",
      icon: <Fingerprint size={24} />,
      x: 30,
      y: 75,
      connections: ["maverick"],
      type: 'secret',
      secretContent: "Období lockdownů nebylo o čekání. Bylo o hledání cest tam, kde ostatní viděli jen zavřené dveře."
    },
    {
      id: "human_connection",
      year: "POZOROVÁNÍ",
      title: "SKUTEČNÁ POUTO",
      content: "Během času jsem začal víc vnímat, jak těžké je pro některé lidi skutečně někoho poznat. Nešlo jen o mě, ale i o moji sestru.",
      icon: <Search size={24} />,
      x: 55,
      y: 22,
      connections: ["vision"],
      type: 'secret',
      secretContent: "Všude je spousta možností, ale málo skutečných spojení. To mě přivedlo k myšlence vytvořit něco jiného."
    }
  ];

  const loyalNodes: StoryNode[] = [
    {
      id: "turning_point",
      year: "ZLOMOVÝ BOD",
      title: "OSOBNÍ TRANSFORMACE",
      content: "Měl jsem plány, které nebyly jen o mně – chtěl jsem budovat budoucnost pro dva. Byl jsem připravený začít znovu.",
      icon: <Heart size={24} />,
      x: 28,
      y: 28,
      connections: ["academic"],
      type: 'secret',
      secretContent: "Ale život ti někdy ukáže jiný směr. Pochopil jsem, že moje energie musí patřit něčemu vlastnímu. Tak vznikl MMBARBER poté, co se naše cesty s partnerkou rozdělily."
    }
  ];

  // Add pulse animation state
  const [pulseIndex, setPulseIndex] = useState(0);
  
  // Linear sequence definition for the pulse
  const getLinearSequence = () => {
    const base = [
      "origin", "tech_roots", "origin_technical", "craft", "experience", 
      "academic", "maverick", "vision", "inner_circle", "people", 
      "future", "operational_mode", "systemic_dominance", "global_standard"
    ];
    
    // Insert personal/loyal nodes if unlocked
    const sequence = [...base];
    if (loyalNodesUnlocked) {
      const idx = sequence.indexOf("experience");
      if (idx !== -1) sequence.splice(idx + 1, 0, "turning_point");
    }
    if (personalNodesUnlocked) {
      const idxAcad = sequence.indexOf("academic");
      if (idxAcad !== -1) sequence.splice(idxAcad + 1, 0, "shadow_days");
      const idxVis = sequence.indexOf("vision");
      if (idxVis !== -1) sequence.splice(idxVis + 1, 0, "human_connection");
    }
    return sequence;
  };

  const sequence = getLinearSequence();
  const maxAccessibleIndex = sequence.findLastIndex(id => visitedNodes.has(id));

  // Global pulse timer - SLOWER as requested
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex(prev => {
        const next = prev + 1;
        // If we reached the end of what's accessible, start over
        return next > maxAccessibleIndex ? 0 : next;
      });
    }, 2500); // Slower interval (2.5s per node)
    return () => clearInterval(interval);
  }, [maxAccessibleIndex]);

  const visibleNodes = [
    ...STORY_NODES,
    ...(personalNodesUnlocked ? personalNodes : []),
    ...(loyalNodesUnlocked ? loyalNodes : [])
  ];

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
            STATUS: {selectedNode?.type === 'secret' ? 'CLASSIFIED_ACCESS_REQUIRED' : 'ACTIVE'}
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
                   <div className={`absolute top-0 left-0 border-2 px-2 py-1 rotate-[-15deg] pointer-events-none select-none uppercase font-mono transition-all duration-700 ${selectedNode.type === 'secret' ? 'border-mafia-red text-mafia-red scale-110' : 'border-mafia-red/20 text-mafia-red/20 text-xl'}`}>
                      {selectedNode.type === 'secret' ? 'PŘÍSNĚ TAJNÉ // EYES ONLY' : 'PŘÍSNĚ TAJNÉ'}
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
                  
                  {selectedNode.type === 'secret' && !isSecretRevealed ? (
                    <div className="space-y-6">
                      <div className="p-6 border border-mafia-red/30 bg-mafia-red/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(239,68,68,0.05)_10px,rgba(239,68,68,0.05)_20px)] animate-pulse"></div>
                        <p className="text-mafia-red/60 font-mono text-sm mb-4 relative z-10 flex items-center gap-2">
                          <AlertTriangle size={14} /> TENTO OBSAH JE ŠIFROVÁN
                        </p>
                        <button 
                          onClick={handleRevealSecret}
                          className="w-full py-4 border border-mafia-red/50 hover:bg-mafia-red hover:text-white transition-all duration-300 font-mono text-xs uppercase tracking-[0.3em] relative z-10"
                        >
                          {hackingProgress > 0 ? `DEŠIFROVÁNÍ: ${hackingProgress}%` : "DEŠIFROVAT ZÁPIS"}
                        </button>
                      </div>
                      <p className="text-smoke-white/20 text-lg md:text-xl font-sans leading-relaxed italic blur-sm select-none">
                        {selectedNode.content}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-smoke-white/90 text-lg md:text-xl font-sans leading-relaxed italic first-letter:text-4xl first-letter:font-heading first-letter:text-mafia-gold first-letter:mr-1">
                        {selectedNode.content}
                      </p>
                      
                      {isSecretRevealed && selectedNode.secretContent && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-6 border-t border-mafia-red/20 mt-6"
                        >
                          <p className="text-mafia-red font-mono text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
                             <Flame size={14} /> NEZACOVANÁ PRAVDA:
                          </p>
                          <p className="text-mafia-red/90 text-lg md:text-xl font-sans leading-relaxed italic border-l-2 border-mafia-red pl-4 whitespace-pre-line">
                            {selectedNode.secretContent}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                {/* Decorative Elements */}
                <div className="pt-12 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 flex items-center justify-center transition-all duration-500 ${selectedNode.type === 'secret' ? 'bg-mafia-red/10 border-mafia-red/40 text-mafia-red shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-mafia-gold/5 border-mafia-gold/20 text-mafia-gold'} border`}>
                      {selectedNode.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-widest">ID_OPERACE</div>
                      <div className={`text-xs font-heading font-bold uppercase transition-colors ${selectedNode.type === 'secret' ? 'text-mafia-red' : 'text-smoke-white'}`}>
                        {selectedNode.id}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="mt-12 flex items-center gap-2">
                  {visibleNodes.map((node, i) => (
                    <motion.div 
                      key={node.id} 
                      animate={{ 
                        backgroundColor: visibleNodes.indexOf(selectedNode) >= i 
                          ? (visibleNodes[i].type === 'secret' ? "#ef4444" : "#c5a059") 
                          : "rgba(197, 160, 89, 0.1)",
                        height: visibleNodes.indexOf(selectedNode) === i ? 6 : 2
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
          <h1 className="text-xl md:text-2xl font-heading font-black text-mafia-gold/40 uppercase tracking-widest">STELLAR_CHART</h1>
          <div className="text-[8px] font-mono text-mafia-gold/20 tracking-[0.5em] mt-1">STAR_FIELD_REF: 49.0683° N, 17.4597° E</div>
        </div>

        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`h-full w-full overflow-x-auto overflow-y-hidden ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'} no-scrollbar transition-all`}
        >
          <div className="relative h-full w-[600vw] md:w-[500vw] lg:w-[450vw] flex items-center">
            
            {/* SVG Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(197, 160, 89, 0.1)" />
                  <stop offset="50%" stopColor="rgba(197, 160, 89, 0.4)" />
                  <stop offset="100%" stopColor="rgba(197, 160, 89, 0.1)" />
                </linearGradient>
                <linearGradient id="secretLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(239, 68, 68, 0.1)" />
                  <stop offset="50%" stopColor="rgba(239, 68, 68, 0.5)" />
                  <stop offset="100%" stopColor="rgba(239, 68, 68, 0.1)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="secretGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {sequence.map((nodeId, idx) => {
                if (idx >= sequence.length - 1) return null;
                
                const sourceId = nodeId;
                const targetId = sequence[idx + 1];
                
                const node = visibleNodes.find(n => n.id === sourceId);
                const target = visibleNodes.find(n => n.id === targetId);
                
                if (!node || !target) return null;
                
                const isSourceVisited = visitedNodes.has(node.id);
                const isTargetVisited = visitedNodes.has(target.id);
                const isFullyDiscovered = isSourceVisited && isTargetVisited;
                const isPulseActive = pulseIndex === idx;
                const isSecretConnection = node.type === 'secret' || target.type === 'secret';
                
                if (!isSourceVisited) return null;

                return (
                  <React.Fragment key={`${node.id}-${target.id}`}>
                    {/* Static Connection Line - Color coded and hidden until fully discovered */}
                    {isFullyDiscovered && (
                      <motion.line
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${target.x}%`}
                        y2={`${target.y}%`}
                        stroke={isSecretConnection ? "#ef4444" : "#c5a059"}
                        strokeWidth="1.5"
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: isFullyDiscovered ? (isPulseActive ? 0.9 : 0.4) : 0,
                          strokeWidth: isPulseActive ? 2.5 : 1.5,
                        }}
                        transition={{ duration: 1.5 }}
                        style={{ 
                          filter: isSecretConnection ? "blur(1px) drop-shadow(0 0 5px #ef4444)" : "blur(1px) drop-shadow(0 0 5px #c5a059)"
                        }}
                      />
                    )}
                    
                    {/* Travelling Energy Beam - Always active for the current segment */}
                    <AnimatePresence>
                      {isPulseActive && (
                        <motion.line
                          key={`pulse-${node.id}`}
                          x1={`${node.x}%`}
                          y1={`${node.y}%`}
                          x2={`${target.x}%`}
                          y2={`${target.y}%`}
                          stroke={isSecretConnection ? "#ff0000" : "#ffffff"}
                          strokeWidth="3"
                          strokeDasharray="40, 1000"
                          initial={{ strokeDashoffset: 1000, opacity: 0 }}
                          animate={{ 
                            strokeDashoffset: 0, 
                            opacity: [0, 1, 1, 0] 
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 2.5, ease: "easeInOut" }}
                          style={{ filter: isSecretConnection ? "blur(2px) drop-shadow(0 0 10px #ff0000)" : "blur(2px) drop-shadow(0 0 10px #ffffff)" }}
                        />
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </svg>

            {/* Nodes */}
            {visibleNodes.map((node) => {
              const isVisited = visitedNodes.has(node.id);
              const isAccessible = isVisited || visibleNodes.some(n => visitedNodes.has(n.id) && n.connections.includes(node.id));

              // Nodes are completely hidden until accessible
              if (!isAccessible) return null;

              return (
                <div 
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: pulseIndex === sequence.indexOf(node.id) ? 1.2 : 1, 
                      opacity: 1,
                      boxShadow: pulseIndex === sequence.indexOf(node.id) 
                        ? (node.type === 'secret' ? "0 0 60px rgba(255,0,0,1)" : "0 0 40px rgba(255,255,255,0.8)") 
                        : "none"
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      if (isDragging) return;
                      setSelectedNode(node);
                    }}
                    className={`relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-2 transition-all duration-700 ${
                      selectedNode?.id === node.id 
                        ? (node.type === 'secret' ? "bg-mafia-red text-white border-white shadow-[0_0_50px_rgba(255,0,0,0.8)]" : "bg-mafia-gold text-mafia-black border-white shadow-[0_0_40px_rgba(197,160,89,0.7)]")
                        : isVisited
                          ? (node.type === 'secret' ? "bg-mafia-black text-mafia-red border-mafia-red" : "bg-mafia-black text-mafia-gold border-mafia-gold")
                          : (node.type === 'secret' ? "bg-mafia-black/20 text-mafia-red/20 border-mafia-red/10" : "bg-mafia-black/20 text-mafia-gold/20 border-mafia-gold/10")
                    }`}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                       <span className={`text-[8px] font-mono font-black tracking-[0.2em] uppercase transition-opacity duration-500 ${isVisited ? 'opacity-100' : 'opacity-0'}`}>{node.year}</span>
                    </div>

                    <div className="scale-75 md:scale-100">
                      {isVisited ? node.icon : <Lock size={16} className="opacity-40" />}
                    </div>

                    <AnimatePresence>
                      {isVisited && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`absolute -inset-1 border border-dashed rounded-sm pointer-events-none opacity-20 ${node.type === 'secret' ? 'border-mafia-red' : 'border-mafia-gold'} animate-[spin_10s_linear_infinite]`}
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                  
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                     <span className={`text-[9px] font-heading font-black tracking-widest uppercase transition-all duration-700 ${isVisited ? "text-white opacity-100" : "text-white/0 opacity-0"}`}>
                       {node.title}
                     </span>
                  </div>
                </div>
              );
            })}

            <div className="absolute inset-0 pointer-events-none">
               {/* Starfield Layers (Star Wars style flight effect) */}
               <div className="absolute inset-0 z-0">
                  {/* Layer 1: Slow distant stars */}
                  <motion.div 
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-[200%] flex"
                  >
                    {[...Array(2)].map((_, idx) => (
                      <div key={idx} className="relative w-full h-full">
                        {stars.slice(0, 80).map(star => (
                          <div
                            key={star.id}
                            className="absolute rounded-full bg-white/40"
                            style={{ 
                              width: `${star.size * 0.5}px`,
                              height: `${star.size * 0.5}px`,
                              left: `${star.x}%`, 
                              top: `${star.y}%`,
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </motion.div>

                  {/* Layer 2: Medium speed stars */}
                  <motion.div 
                    animate={{ x: ["0%", "-100%"] }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-[200%] flex"
                  >
                    {[...Array(2)].map((_, idx) => (
                      <div key={idx} className="relative w-full h-full">
                        {stars.slice(80, 160).map(star => (
                          <motion.div
                            key={star.id}
                            animate={{ opacity: [0.2, 0.8, 0.2] }}
                            transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
                            className="absolute rounded-full bg-white/80"
                            style={{ 
                              width: `${star.size}px`,
                              height: `${star.size}px`,
                              left: `${star.x}%`, 
                              top: `${star.y}%`,
                              boxShadow: star.size > 1.5 ? '0 0 8px rgba(255,255,255,0.4)' : 'none'
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </motion.div>

                  {/* Layer 3: Fast streaks (The "Star Wars" feel) */}
                  <motion.div 
                    animate={{ x: ["0%", "-200%"] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-[300%] flex"
                  >
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="relative w-full h-full">
                        {stars.slice(160, 200).map(star => (
                          <div
                            key={star.id}
                            className="absolute bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            style={{ 
                              width: `${star.size * 20}px`,
                              height: `1px`,
                              left: `${star.x}%`, 
                              top: `${star.y}%`,
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </motion.div>
               </div>
               
               {/* Nebula Effects */}
               <div className="absolute top-1/3 left-1/4 w-[800px] h-[800px] bg-mafia-gold/5 blur-[150px] rounded-full animate-pulse"></div>
               <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-mafia-red/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
               
               <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-mafia-gold rotate-45 opacity-10"></div>
               <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-mafia-gold -rotate-12 opacity-10"></div>
               <div className="absolute top-3/4 left-2/3 w-64 h-64 border border-mafia-red/50 rotate-90 opacity-10"></div>

               <ShootingStar />
               <ShootingStar />
            </div>

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

        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between pointer-events-none z-30">
          <div className="flex items-center gap-4 opacity-30">
            <div className="w-12 h-[1px] bg-mafia-gold"></div>
            <span className="text-[8px] font-mono uppercase tracking-[0.5em]">Sector_MM_Tactical_Update</span>
          </div>
          <div className="flex items-center gap-2 text-mafia-red/40 font-mono text-[8px] animate-pulse">
            <Activity size={10} /> LIVE_ENCRYPTION_LAYER_ACTIVE
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

                <section className="pt-12 border-t border-mafia-gold/10 italic text-mafia-gold/60">
                  <h3 className="text-xl font-heading font-black text-mafia-gold uppercase not-italic mb-4">🧭 ZÁVĚR</h3>
                  <p className="mb-2">Tohle není jen web.</p>
                  <p className="mb-2">Tohle je práce, přístup a způsob myšlene.</p>
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
