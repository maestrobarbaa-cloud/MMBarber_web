"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, animate, useTransform, useMotionValueEvent } from "framer-motion";
import {
  Target,
  Zap,
  Shield,
  Star,
  Users,
  Rocket,
  BookOpen,
  Flag,
  X,
  Lock,
  Terminal,
  Activity,
  AlertTriangle,
  Flame,
  Fingerprint,
  Cpu,
  Plus,
  Minus,
  Scissors,
  MapPin,
  Briefcase,
  Bookmark,
  FileText,
  FlaskConical,
  Eye,
  Navigation,
  Map,
  ShieldCheck,
  Award,
  EyeOff,
  Trophy,
  Compass,
  Radio,
  Key,
  Moon,
  Heart,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

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
  constellation: 'core' | 'origins' | 'talent' | 'career' | 'ultimate';
  requiredVisits?: number;
}

interface StarBg {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  depth: number;
  color: string;
}

const STORY_NODES: StoryNode[] = [
  // --- LEVEL 1: SOUČASNOST (Central Core Hub) ---
  {
    id: "origin",
    title: "Srdce Rodiny",
    year: "DNES",
    content: "Vše začíná zde. V našem křesle, kde se čas zastaví. Tady se tvoří respekt, který se nedá koupit. Jsme MMBarber a toto je naše teritorium.",
    icon: <Users />,
    x: 50, y: 50,
    constellation: "core",
    requiredVisits: 1,
    connections: ["vibe", "rules", "loyalty"]
  },
  {
    id: "vibe",
    title: "Noir Atmosféra",
    year: "2024",
    content: "Černá a bílá. Žádné kompromisy. Naše estetika odráží naši filozofii – čistota, kontrast a neúprosná kvalita v každém detailu.",
    icon: <Moon />,
    x: 52, y: 48,
    constellation: "core",
    requiredVisits: 1,
    connections: ["style", "secret_vibe"]
  },
  {
    id: "rules",
    title: "Kodex Mlčení",
    year: "STÁLÉ",
    content: "To, co se řekne v barberu, zůstane v barberu. Jsme důvěrníci, psychologové i spojenci našich hostů. Respektujeme vaše soukromí jako vlastní.",
    icon: <Shield />,
    x: 48, y: 52,
    constellation: "core",
    requiredVisits: 1,
    connections: ["loyalty"]
  },
  {
    id: "loyalty",
    title: "Pouto Krve",
    year: "VŽDY",
    content: "Naši zákazníci nejsou jen klienti, jsou to členové širší rodiny. Loajalita je měnou, kterou si u nás ceníme nejvíce.",
    icon: <Heart />,
    x: 49, y: 49,
    constellation: "core",
    requiredVisits: 1,
    connections: ["origin"]
  },
  {
    id: "style",
    title: "Estetika Moci",
    year: "2024",
    content: "Styl není móda. Móda pomíjí, styl je věčný. My tvoříme identitu, která vyzařuje sílu a sebevědomí v každém kroku.",
    icon: <Zap />,
    x: 51, y: 51,
    constellation: "core",
    requiredVisits: 1,
    connections: ["vibe"]
  },
  {
    id: "secret_vibe",
    title: "Půlnoční Kšeft",
    year: "UTAJENO",
    content: "Někdy se ty nejdůležitější věci řeší, když město spí. Naše dveře se občas otevírají i pro ty, kteří nepotřebují jen střih, ale i radu.",
    type: "secret",
    secretContent: "V noci se v MMBarberu scházejí lidé, kteří hýbou tímto městem. Jsme neutrální půda pro velké kšefty.",
    icon: <Lock />,
    x: 50, y: 44,
    constellation: "core",
    requiredVisits: 1,
    connections: ["vibe"]
  },

  // --- LEVEL 2: KOŘENY (Origins Cluster) ---
  {
    id: "roots_start",
    title: "První Nůžky",
    year: "MINULOST",
    content: "Zde v Hradišti to všechno začalo. Jeden sen, jedny nůžky a nekonečná touha dělat věci jinak – poctivě a s respektem k řemeslu.",
    icon: <Scissors />,
    x: 8, y: 12,
    constellation: "origins",
    requiredVisits: 2,
    connections: ["tradition", "childhood"]
  },
  {
    id: "tradition",
    title: "Rodinný Odkaz",
    year: "1984",
    content: "Respekt k řemeslu se u nás dědí. Učili jsme se od those nejlepších, abychom dnes mohli sami určovat pravidla hry.",
    icon: <Star />,
    x: 3, y: 18,
    constellation: "origins",
    requiredVisits: 2,
    connections: ["hard_times", "secret_roots"]
  },
  {
    id: "childhood",
    title: "Ulicemi Hradiště",
    year: "RETRO",
    content: "Každý kout tohoto města známe. Tady jsme vyrůstali a tady jsme pochopili, co znamená slovo domov a teritorium.",
    icon: <MapPin />,
    x: 14, y: 5,
    constellation: "origins",
    requiredVisits: 2,
    connections: ["first_shop"]
  },
  {
    id: "hard_times",
    title: "Zkouška Ohněm",
    year: "KRITICKÉ",
    content: "Nebylo to vždy snadné. Každá jizva na naší cestě nás posílila. Naučili jsme se, že pád není konec, ale lekce.",
    icon: <Target />,
    x: 2, y: 30,
    constellation: "origins",
    requiredVisits: 2,
    connections: ["first_shop"]
  },
  {
    id: "first_shop",
    title: "Stará Garáž",
    year: "START",
    content: "První neoficiální křeslo v garáži. Tam se rodila legenda. Bez marketingu, jen díky šeptandě o nejlepším střihu v okolí.",
    icon: <Briefcase />,
    x: 10, y: 22,
    constellation: "origins",
    requiredVisits: 2,
    connections: ["roots_start"]
  },
  {
    id: "mentor",
    title: "Starý Mistr",
    year: "MOUDROST",
    content: "Každý šéf měl svého mentora. Člověka, který mu ukázal, že nůžky jsou jen nástroj, ale ruka je vedená duší.",
    icon: <Bookmark />,
    x: 18, y: 18,
    constellation: "origins",
    requiredVisits: 2,
    connections: ["roots_start"]
  },
  {
    id: "secret_roots",
    title: "Ztracený Deník",
    year: "KLASIFIKOVÁNO",
    content: "Existují záznamy o prvních klientech, kteří u nás hledali azyl. Příběhy, které by neměly být nikdy vyprávěny nahlas.",
    type: "secret",
    secretContent: "Prvním hostem v garáži byl místní boss, který nám daroval první profesionální břitvu za zachování mlčení.",
    icon: <FileText />,
    x: 5, y: 4,
    constellation: "origins",
    requiredVisits: 2,
    connections: ["tradition"]
  },

  // --- LEVEL 3: TALENT (Talent Cluster) ---
  {
    id: "talent_start",
    title: "Absolutní Přesnost",
    year: "MISTROVSTVÍ",
    content: "Chyba není v našem slovníku. Každý milimetr hraje roli. Naše práce je geometrie aplikovaná na tvář moderního muže.",
    icon: <Target />,
    x: 92, y: 12,
    constellation: "talent",
    requiredVisits: 3,
    connections: ["sharp_blade", "steady_hand"]
  },
  {
    id: "sharp_blade",
    title: "Ocel a Kůže",
    year: "ZRUČNOST",
    content: "Břitva je prodloužením naší ruky. Pocit ostří na kůži je rituál, který vyžaduje absolutní důvěru mezi barberem a hostem.",
    icon: <Zap />,
    x: 97, y: 5,
    constellation: "talent",
    requiredVisits: 3,
    connections: ["alchemy", "secret_talent"]
  },
  {
    id: "steady_hand",
    title: "Klidná Ruka",
    year: "TRÉNINK",
    content: "Tisíce hodin tréninku vedou k jedinému okamžiku dokonalosti. Naše ruce se nechvějí ani v největším tlaku.",
    icon: <Activity />,
    x: 88, y: 6,
    constellation: "talent",
    requiredVisits: 3,
    connections: ["philosophy"]
  },
  {
    id: "alchemy",
    title: "Vůně Respektu",
    year: "MAGIE",
    content: "Výběr vůně je jako podpis. Namícháme pro vás esenci, která bude vyprávět váš příběh dřív, než promluvíte.",
    icon: <FlaskConical />,
    x: 96, y: 20,
    constellation: "talent",
    requiredVisits: 3,
    connections: ["talent_start"]
  },
  {
    id: "philosophy",
    title: "Tichá Síla",
    year: "FILOZOFIE",
    content: "Skutečný talent nepotřebuje křičet. Naše výsledky mluví samy za sebe. Jsme tiší tvůrci vašeho veřejného obrazu.",
    icon: <Eye />,
    x: 82, y: 22,
    constellation: "talent",
    requiredVisits: 3,
    connections: ["talent_start"]
  },
  {
    id: "secret_talent",
    title: "Zakázaná Technika",
    year: "EXPERIMENTÁLNÍ",
    content: "Existují postupy, které běžné oko nespatří. Práce s texturou, která hraničí s uměním. Jen pro vyvolené.",
    type: "secret",
    secretContent: "Naše speciální technika 'Fantomový Fade' vytváří přechod, který vypadá přirozeně i po dvou týdnech.",
    icon: <Flame />,
    x: 94, y: 3,
    constellation: "talent",
    requiredVisits: 3,
    connections: ["sharp_blade"]
  },

  // --- LEVEL 4: CESTA (Career Cluster) ---
  {
    id: "career_start",
    title: "Expanze",
    year: "RŮST",
    content: "Hradiště nám začalo být malé. Naše jméno se začalo šířit dál. Vybudovat impérium vyžaduje strategii a správné lidi po boku.",
    icon: <Navigation />,
    x: 12, y: 85,
    constellation: "career",
    requiredVisits: 4,
    connections: ["team_power", "territory"]
  },
  {
    id: "team_power",
    title: "Smečka",
    year: "RODINA",
    content: "Barber je jen tak dobrý, jako jeho nejslabší článek. My žádné slabé články nemáme. Jsme jednotka se společným cílem.",
    icon: <Users />,
    x: 4, y: 94,
    constellation: "career",
    requiredVisits: 4,
    connections: ["standards", "secret_career"]
  },
  {
    id: "territory",
    title: "Dobytí Trhu",
    year: "DOMINANCE",
    content: "Nejsme jen další barber. Jsme standard, podle kterého se měří ostatní. Ovládli jsme prostor kvalitou, ne reklamou.",
    icon: <Map />,
    x: 20, y: 92,
    constellation: "career",
    requiredVisits: 4,
    connections: ["legacy_building"]
  },
  {
    id: "standards",
    title: "Železná Pravidla",
    year: "PROVOZ",
    content: "Naše standardy jsou neúprosné. Hygiena, servis, drink – vše musí být na 110 %. Jinak nejsme rodina MM.",
    icon: <ShieldCheck />,
    x: 3, y: 82,
    constellation: "career",
    requiredVisits: 4,
    connections: ["career_start"]
  },
  {
    id: "legacy_building",
    title: "Budování Jména",
    year: "ZNAČKA",
    content: "MMBarber není jen nápis na dveřích. Je to příslib zážitku. Investujeme do budoucnosti, aby naše jméno přežilo nás všechny.",
    icon: <Award />,
    x: 10, y: 97,
    constellation: "career",
    requiredVisits: 4,
    connections: ["career_start"]
  },
  {
    id: "secret_career",
    title: "Stínový Poradce",
    year: "NEOFICIÁLNÍ",
    content: "Některá rozhodnutí se nedělají u stolu, ale za zavřenými dveřmi v zadní místnosti. Tam se kreslí mapa naší expanze.",
    type: "secret",
    secretContent: "Plánujeme otevření utajeného klubu pro naše VIP členy, kde barbering bude jen začátkem večera.",
    icon: <EyeOff />,
    x: 5, y: 72,
    constellation: "career",
    requiredVisits: 4,
    connections: ["team_power"]
  },

  // --- LEVEL 5: CÍL (Ultimate Cluster) ---
  {
    id: "ultimate_goal",
    title: "Absolutní Vize",
    year: "BUDOUCNOST",
    content: "Naše cesta nekončí. Míříme ke hvězdám. Chceme změnit vnímání mužské péče v celém regionu i mimo něj.",
    icon: <Trophy />,
    x: 88, y: 85,
    constellation: "ultimate",
    requiredVisits: 5,
    connections: ["perfection", "immortality"]
  },
  {
    id: "perfection",
    title: "Bod Nula",
    year: "DOKONALOST",
    content: "Hledáme bod, kde už není co zlepšit. Neustálý progres je náš motor. Spokojenost je pro nás jen dočasná zastávka.",
    icon: <Zap />,
    x: 95, y: 82,
    constellation: "ultimate",
    requiredVisits: 5,
    connections: ["new_era", "secret_ultimate"]
  },
  {
    id: "immortality",
    title: "Nesmrtelnost",
    year: "ODKAZ",
    content: "Chceme vytvořit něco, co tu bude i za sto let. Odkaz MMBarber je vrytý do tváří tisíců mužů, kteří prošli naším křeslem.",
    icon: <Compass />,
    x: 82, y: 94,
    constellation: "ultimate",
    requiredVisits: 5,
    connections: ["new_era"]
  },
  {
    id: "new_era",
    title: "Nová Éra",
    year: "2030+",
    content: "Připravujeme půdu pro příští generaci. Technologie, tradice a noir styl v dokonalé symbióze příští dekády.",
    icon: <Radio />,
    x: 97, y: 92,
    constellation: "ultimate",
    requiredVisits: 5,
    connections: ["ultimate_goal"]
  },
  {
    id: "secret_ultimate",
    title: "Původní Plán",
    year: "GENESIS",
    content: "Všechno, co vidíte, bylo naplánováno už na úplném začátku. Každý krok v této galaxii byl zapsán v naší první vizi.",
    type: "secret",
    secretContent: "Konečným cílem je vytvořit globální síť MMBarber, kde se loajalita odměňuje doživotním členstvím v elitním klubu.",
    icon: <Key />,
    x: 92, y: 97,
    constellation: "ultimate",
    requiredVisits: 5,
    connections: ["perfection"]
  },
  {
    id: "legacy_myth",
    title: "Mýtus o Barberovi",
    year: "NEKONEČNO",
    content: "Některé příběhy se stávají legendami. Traduje se, že první MM střih změnil osud celého rodu. Pravda je ale mnohem hlubší.",
    icon: <Award />,
    x: 2, y: 2,
    constellation: "ultimate",
    requiredVisits: 5,
    connections: ["origin"]
  }
];

const ShootingStar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, angle: 0 });

  useEffect(() => {
    const launch = () => {
      setCoords({
        x: Math.random() * 80 + 10,
        y: Math.random() * 40,
        angle: Math.random() * 30 + 135
      });
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    };
    const timer = setInterval(() => {
      if (Math.random() > 0.85) launch();
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ x: `${coords.x}%`, y: `${coords.y}%`, opacity: 0, scale: 0 }}
      animate={{
        x: `${coords.x - 30}%`,
        y: `${coords.y + 30}%`,
        opacity: [0, 1, 0.8, 0],
        scale: [0, 1, 1.2, 0]
      }}
      transition={{ duration: 2.8, ease: "linear" }}
      className="absolute z-0 pointer-events-none flex items-center"
      style={{ rotate: `${coords.angle}deg` }}
    >
      <div className="w-64 h-[2px] bg-gradient-to-r from-transparent via-mafia-gold/20 to-white/60 blur-[1px]" />
      <div className="w-2 h-2 bg-white rounded-full blur-[2px] shadow-[0_0_15px_white]" />
    </motion.div>
  );
};

export default function StoryPage() {
  const [selectedNode, setSelectedNode] = useState<StoryNode | null>(STORY_NODES[0]);
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set(["origin"]));
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSecretRevealed, setIsSecretRevealed] = useState(false);
  const [hackingProgress, setHackingProgress] = useState(0);
  const flightControlRef = useRef<number>(0);

  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const zoomMotion = useMotionValue(0.8);

  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mapSize, setMapSize] = useState({ width: 3000, height: 2000 });
  const [unlockedLevels, setUnlockedLevels] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6]));
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalStatus, setTerminalStatus] = useState<"idle" | "success" | "error">("idle");
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [stars, setStars] = useState<StarBg[]>([]);
  const [textDistance, setTextDistance] = useState("15625");

  // Parallax and HUD transforms
  const starLayer1X = useTransform(panX, x => x * 0.05);
  const starLayer1Y = useTransform(panY, y => y * 0.05);
  const starLayer1Scale = useTransform(zoomMotion, z => 1 + (z - 1) * 0.02);

  const starLayer2X = useTransform(panX, x => x * 0.1);
  const starLayer2Y = useTransform(panY, y => y * 0.1);
  const starLayer2Scale = useTransform(zoomMotion, z => 1 + (z - 1) * 0.05);

  const starLayer3X = useTransform(panX, x => x * 0.2);
  const starLayer3Y = useTransform(panY, y => y * 0.2);
  const starLayer3Scale = useTransform(zoomMotion, z => 1 + (z - 1) * 0.08);

  const distanceValue = useTransform(zoomMotion, (z) => (12500 / z).toFixed(0));
  useMotionValueEvent(distanceValue, "change", (latest) => setTextDistance(latest));

  useEffect(() => {
    setIsMounted(true);
    const savedProgress = localStorage.getItem("mmbarber_story_progress");
    if (savedProgress) {
      try { setVisitedNodes(new Set(JSON.parse(savedProgress))); } catch (e) { }
    }

    const savedLevels = localStorage.getItem("mmbarber_unlocked_levels");
    if (savedLevels) {
      try { setUnlockedLevels(new Set(JSON.parse(savedLevels))); } catch (e) { }
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    setMapSize({ width: w * 8, height: h * 4 });

    setStars([...Array(800)].map((_, i) => {
      const rand = Math.random();
      let color = "rgba(255, 255, 255, 0.8)";
      if (rand > 0.95) color = "rgba(147, 197, 253, 0.8)";
      else if (rand > 0.90) color = "rgba(252, 165, 165, 0.8)";
      else if (rand > 0.85) color = "rgba(197, 160, 89, 0.8)";

      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        duration: Math.random() * 5 + 3,
        delay: Math.random() * 10,
        depth: Math.random(),
        color
      };
    }));

    // Initial center on "origin"
    const targetNode = STORY_NODES[0];
    const sidebarW = w >= 1024 ? (w >= 1280 ? 400 : 320) : 0;
    const cX = sidebarW + (w - sidebarW) / 2;
    const cY = h / 2;
    panX.set(cX - (targetNode.x / 100) * (w * 8) * 0.8);
    panY.set(cY - (targetNode.y / 100) * (h * 4) * 0.8);
  }, []);

  const getSectorName = (constellation: string) => {
    const sectors: Record<string, string> = {
      core: "Souhvězdí Kodexu",
      origins: "Souhvězdí Původu",
      talent: "Souhvězdí Mistrů",
      career: "Souhvězdí Teritoria",
      ultimate: "Souhvězdí Odkazu"
    };
    return sectors[constellation] || "Neznámé Souhvězdí";
  };

  const getGalaxyColor = (baseColor: string) => {
    const currentZoom = zoomMotion.get();
    if (currentZoom < 0.4) return "#4facfe";
    if (currentZoom < 0.9) return "#f8fafc";
    if (currentZoom < 1.6) return "#ff4d4d";
    return baseColor;
  };

  const getStrokeWidth = (base: number) => base / Math.sqrt(zoomMotion.get());

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

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const passwords: Record<string, number> = { "KORENY": 2, "TALENT": 3, "CESTA": 4, "CIL": 5 };
    const level = passwords[terminalInput.toUpperCase().trim()];
    if (level) {
      const nextLevels = new Set(unlockedLevels);
      nextLevels.add(level);
      setUnlockedLevels(nextLevels);
      localStorage.setItem("mmbarber_unlocked_levels", JSON.stringify(Array.from(nextLevels)));
      setTerminalStatus("success");
      setTerminalInput("");
      setTimeout(() => setTerminalStatus("idle"), 2000);
    } else {
      setTerminalStatus("error");
      setTimeout(() => setTerminalStatus("idle"), 2000);
    }
  };

  useEffect(() => {
    if (selectedNode && !visitedNodes.has(selectedNode.id)) {
      const nextVisited = new Set(visitedNodes);
      nextVisited.add(selectedNode.id);
      setVisitedNodes(nextVisited);
      localStorage.setItem("mmbarber_story_progress", JSON.stringify(Array.from(nextVisited)));
      setJustUnlocked(selectedNode.id);
      setTimeout(() => setJustUnlocked(null), 1500);
    }
    setIsSecretRevealed(false);
    setHackingProgress(0);
  }, [selectedNode]);

  const handleCenterCamera = async (targetNode: StoryNode, customZoom?: number) => {
    const flightId = ++flightControlRef.current;
    const targetZoom = customZoom || 1.2;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const sidebarW = w >= 1024 ? (w >= 1280 ? 400 : 320) : 0;
    const cX = sidebarW + (w - sidebarW) / 2;
    const cY = h / 2;
    const tx = cX - (targetNode.x / 100) * mapSize.width * targetZoom;
    const ty = cY - (targetNode.y / 100) * mapSize.height * targetZoom;

    await Promise.all([
      animate(panX, tx, { duration: 0.8, ease: "easeInOut" }),
      animate(panY, ty, { duration: 0.8, ease: "easeInOut" }),
      animate(zoomMotion, targetZoom, { duration: 0.8, ease: "easeInOut" })
    ]);
  };

  const handleZoom = (delta: number, mouseX?: number, mouseY?: number) => {
    const currentZoom = zoomMotion.get();
    const newZoom = Math.min(Math.max(currentZoom + delta, 0.2), 3);
    const zoomRatio = newZoom / currentZoom;
    const rect = containerRef.current?.getBoundingClientRect();
    const x = mouseX !== undefined ? mouseX : (rect ? rect.width / 2 : 0);
    const y = mouseY !== undefined ? mouseY : (rect ? rect.height / 2 : 0);
    const newX = x - (x - panX.get()) * zoomRatio;
    const newY = y - (y - panY.get()) * zoomRatio;
    panX.set(newX);
    panY.set(newY);
    zoomMotion.set(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    panX.set(panX.get() + dx);
    panY.set(panY.get() + dy);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleNextNode = () => {
    const currentIndex = STORY_NODES.findIndex(n => n.id === selectedNode?.id);
    const nextNode = STORY_NODES[currentIndex + 1];
    if (nextNode && unlockedLevels.has(nextNode.requiredVisits || 1)) {
      setSelectedNode(nextNode);
      handleCenterCamera(nextNode);
    }
  };
  const handlePrevNode = () => {
    const currentIndex = STORY_NODES.findIndex(n => n.id === selectedNode?.id);
    const prevNode = STORY_NODES[currentIndex - 1];
    if (prevNode && unlockedLevels.has(prevNode.requiredVisits || 1)) {
      setSelectedNode(prevNode);
      handleCenterCamera(prevNode);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextNode();
      if (e.key === 'ArrowLeft') handlePrevNode();
    };
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleZoom(-e.deltaY * 0.002, e.clientX, e.clientY);
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [selectedNode, unlockedLevels]);

  const starLayer1 = React.useMemo(() => (
    <motion.div style={{ x: starLayer1X, y: starLayer1Y, scale: starLayer1Scale }} className="absolute inset-0 w-[150%] h-[150%]">
      {stars.slice(0, 200).map(star => (
        <motion.div key={star.id} animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: star.duration, repeat: Infinity }} className="absolute rounded-full"
          style={{ width: star.size, height: star.size, left: `${star.x}%`, top: `${star.y}%`, backgroundColor: star.color, boxShadow: '0 0 5px white' }} />
      ))}
    </motion.div>
  ), [stars]);

  const starLayer2 = React.useMemo(() => (
    <motion.div style={{ x: starLayer2X, y: starLayer2Y, scale: starLayer2Scale }} className="absolute inset-0 w-[200%] h-[200%]">
      {stars.slice(200, 400).map(star => (
        <motion.div key={star.id} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: star.duration * 0.8, repeat: Infinity }} className="absolute rounded-full"
          style={{ width: star.size * 1.2, height: star.size * 1.2, left: `${star.x}%`, top: `${star.y}%`, backgroundColor: star.color, boxShadow: `0 0 8px ${star.color}` }} />
      ))}
    </motion.div>
  ), [stars]);

  const starLayer3 = React.useMemo(() => (
    <motion.div style={{ x: starLayer3X, y: starLayer3Y, scale: starLayer3Scale }} className="absolute inset-0 w-[300%] h-[300%]">
      {stars.slice(400, 600).map(star => (
        <div key={star.id} className="absolute rounded-full" style={{ width: star.size * 1.5, height: star.size * 1.5, left: `${star.x}%`, top: `${star.y}%`, backgroundColor: star.color, opacity: 0.6 }} />
      ))}
    </motion.div>
  ), [stars]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black text-smoke-white overflow-hidden flex flex-col lg:flex-row">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-mafia-gold/5 via-transparent to-mafia-black" />
      </div>

      <div className="w-full lg:w-[320px] xl:w-[400px] h-[45vh] lg:h-full bg-black/5 backdrop-blur-md border-r border-white/5 relative z-40 flex flex-col pointer-events-none">
        <div className="p-8 pt-24 lg:pt-12 flex flex-col h-full items-center text-center pointer-events-none">
          <div className="flex items-center gap-3 mb-10 opacity-30">
            <div className="w-8 h-px bg-mafia-gold/40" />
            <div className="text-mafia-gold font-mono text-[9px] tracking-[0.6em] uppercase">Archiv_812</div>
            <div className="w-8 h-px bg-mafia-gold/40" />
          </div>

          <div className="flex-1 w-full flex flex-col justify-end pb-12">
            <AnimatePresence mode="wait">
              {selectedNode && (
                <motion.div key={selectedNode.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 pointer-events-auto">
                  <span className="text-mafia-gold/40 font-mono text-[10px] tracking-widest block uppercase">Období: {selectedNode.year}</span>
                  <h2 className="text-4xl font-heading font-black text-white uppercase italic leading-tight">{selectedNode.title}</h2>
                  <p className="text-white/80 text-lg italic leading-relaxed">{selectedNode.content}</p>

                  {selectedNode.type === 'secret' && !isSecretRevealed ? (
                    <button onClick={handleRevealSecret} className="w-full py-4 border border-mafia-red/40 text-mafia-red font-mono text-[10px] uppercase hover:bg-mafia-red hover:text-white transition-all">
                      {hackingProgress > 0 ? `DEŠIFROVÁNÍ: ${hackingProgress}%` : "ZAHÁJIT_DEŠIFROVÁNÍ"}
                    </button>
                  ) : isSecretRevealed && selectedNode.secretContent && (
                    <div className="p-6 border border-mafia-red/20 bg-mafia-red/5 text-mafia-red italic rounded-sm">
                      <div className="text-[9px] font-mono mb-2 opacity-50">DEŠIFROVANÁ_DATA:</div>
                      {selectedNode.secretContent}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="absolute inset-0 z-0 bg-black overflow-hidden cursor-crosshair" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <div className="absolute inset-0 pointer-events-none z-0">
          {starLayer1} {starLayer2} {starLayer3}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

        <ShootingStar />

        <motion.div className="absolute origin-top-left z-10" style={{ x: panX, y: panY, scale: zoomMotion, width: mapSize.width, height: mapSize.height }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {STORY_NODES.map(node => node.connections.map(targetId => {
              const target = STORY_NODES.find(n => n.id === targetId);
              if (!target || !unlockedLevels.has(node.requiredVisits || 1) || !unlockedLevels.has(target.requiredVisits || 1)) return null;
              return <line key={`${node.id}-${target.id}`} x1={`${node.x}%`} y1={`${node.y}%`} x2={`${target.x}%`} y2={`${target.y}%`} stroke={getGalaxyColor("#c5a059")} strokeWidth={getStrokeWidth(1)} opacity={0.3} strokeDasharray="4 4" />;
            }))}
          </svg>

          {STORY_NODES.map(node => {
            const isAccessible = unlockedLevels.has(node.requiredVisits || 1);
            const isVisited = visitedNodes.has(node.id);
            return (
              <motion.div key={node.id} className="absolute" style={{ left: `${node.x}%`, top: `${node.y}%`, x: "-50%", y: "-50%" }}>
                <button onClick={() => { if (isAccessible) { setSelectedNode(node); handleCenterCamera(node); } }}
                  className={`w-14 h-14 rounded-sm border-2 flex items-center justify-center transition-all duration-500 pointer-events-auto ${selectedNode?.id === node.id ? "bg-mafia-gold text-mafia-black border-white" : isVisited ? "bg-black text-mafia-gold border-mafia-gold" : "bg-black/80 text-white/20 border-white/10"}`}>
                  {isVisited ? React.cloneElement(node.icon as any, { size: 20 }) : isAccessible ? <Activity size={20} className="animate-pulse" /> : <Lock size={20} className="opacity-20" />}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>


      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2 pointer-events-auto">
        <button onClick={() => handleZoom(0.2)} className="w-12 h-12 bg-black/40 border border-white/10 text-mafia-gold flex items-center justify-center rounded-sm hover:bg-mafia-gold hover:text-black transition-all"><Plus size={20} /></button>
        <button onClick={() => handleZoom(-0.2)} className="w-12 h-12 bg-black/40 border border-white/10 text-mafia-gold flex items-center justify-center rounded-sm hover:bg-mafia-gold hover:text-black transition-all"><Minus size={20} /></button>
        <div className="mt-2 p-4 bg-black/60 border border-mafia-gold/20 backdrop-blur-md text-[9px] font-mono text-mafia-gold/60 uppercase space-y-2">
          <div className="flex justify-between gap-8"><span>VZDÁLENOST:</span><span className="text-mafia-gold font-bold">{textDistance} LY</span></div>
          <div className="flex justify-between gap-8"><span>GALAXIE:</span><span className="text-mafia-gold font-bold">{getSectorName(selectedNode?.constellation || "core")}</span></div>
        </div>
      </div>

      <button onClick={() => window.location.href = '/'} className="fixed top-8 right-8 w-12 h-12 bg-black/60 border border-mafia-gold/20 text-mafia-gold flex items-center justify-center rounded-full z-[100] hover:text-white transition-all"><X size={20} /></button>
    </div>
  );
}
