"use client";

import { useTranslation } from "@/hooks/useTranslation";

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

  // STORY_NODES logic moved inside component to access translations

const ShootingStar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, angle: 0 });

  const [graphicsTier, setGraphicsTier] = useState<string>("low");

  useEffect(() => {
    const tier = document.documentElement.getAttribute('data-graphics-tier') || "low";
    setGraphicsTier(tier);
    
    if (tier === 'low' || tier === 'medium') return;

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
  const { t, lang } = useTranslation();

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
  const [graphicsTier, setGraphicsTier] = useState<string>("low");

  // Localized STORY_NODES
  const STORY_NODES: StoryNode[] = React.useMemo(() => [
    {
      id: "origin",
      title: t.story?.nodes.origin.title || "...",
      year: t.story?.nodes.origin.year || "...",
      content: t.story?.nodes.origin.content || "...",
      icon: <Users />,
      x: 50, y: 50,
      constellation: "core",
      requiredVisits: 1,
      connections: ["vibe", "rules", "loyalty"]
    },
    {
      id: "vibe",
      title: t.story?.nodes.vibe.title || "...",
      year: t.story?.nodes.vibe.year || "...",
      content: t.story?.nodes.vibe.content || "...",
      icon: <Moon />,
      x: 52, y: 48,
      constellation: "core",
      requiredVisits: 1,
      connections: ["style", "secret_vibe"]
    },
    {
      id: "rules",
      title: t.story?.nodes.rules.title || "...",
      year: t.story?.nodes.rules.year || "...",
      content: t.story?.nodes.rules.content || "...",
      icon: <Shield />,
      x: 48, y: 52,
      constellation: "core",
      requiredVisits: 1,
      connections: ["loyalty"]
    },
    {
      id: "loyalty",
      title: t.story?.nodes.loyalty.title || "...",
      year: t.story?.nodes.loyalty.year || "...",
      content: t.story?.nodes.loyalty.content || "...",
      icon: <Heart />,
      x: 49, y: 49,
      constellation: "core",
      requiredVisits: 1,
      connections: ["origin"]
    },
    {
      id: "style",
      title: t.story?.nodes.style.title || "...",
      year: t.story?.nodes.style.year || "...",
      content: t.story?.nodes.style.content || "...",
      icon: <Zap />,
      x: 51, y: 51,
      constellation: "core",
      requiredVisits: 1,
      connections: ["vibe"]
    },
    {
      id: "secret_vibe",
      title: t.story?.nodes.secret_vibe.title || "...",
      year: t.story?.nodes.secret_vibe.year || "...",
      content: t.story?.nodes.secret_vibe.content || "...",
      secretContent: t.story?.nodes.secret_vibe.secret || "...",
      type: "secret",
      icon: <Lock />,
      x: 50, y: 44,
      constellation: "core",
      requiredVisits: 1,
      connections: ["vibe"]
    },
    {
      id: "roots_start",
      title: t.story?.nodes.roots_start.title || "...",
      year: t.story?.nodes.roots_start.year || "...",
      content: t.story?.nodes.roots_start.content || "...",
      icon: <Scissors />,
      x: 8, y: 12,
      constellation: "origins",
      requiredVisits: 2,
      connections: ["tradition", "childhood"]
    },
    {
      id: "tradition",
      title: t.story?.nodes.tradition.title || "...",
      year: t.story?.nodes.tradition.year || "...",
      content: t.story?.nodes.tradition.content || "...",
      icon: <Star />,
      x: 3, y: 18,
      constellation: "origins",
      requiredVisits: 2,
      connections: ["hard_times", "secret_roots"]
    },
    {
      id: "childhood",
      title: t.story?.nodes.childhood.title || "...",
      year: t.story?.nodes.childhood.year || "...",
      content: t.story?.nodes.childhood.content || "...",
      icon: <MapPin />,
      x: 14, y: 5,
      constellation: "origins",
      requiredVisits: 2,
      connections: ["first_shop"]
    },
    {
      id: "hard_times",
      title: t.story?.nodes.hard_times.title || "...",
      year: t.story?.nodes.hard_times.year || "...",
      content: t.story?.nodes.hard_times.content || "...",
      icon: <Target />,
      x: 2, y: 30,
      constellation: "origins",
      requiredVisits: 2,
      connections: ["first_shop"]
    },
    {
      id: "first_shop",
      title: t.story?.nodes.first_shop.title || "...",
      year: t.story?.nodes.first_shop.year || "...",
      content: t.story?.nodes.first_shop.content || "...",
      icon: <Briefcase />,
      x: 10, y: 22,
      constellation: "origins",
      requiredVisits: 2,
      connections: ["roots_start"]
    },
    {
      id: "mentor",
      title: t.story?.nodes.mentor.title || "...",
      year: t.story?.nodes.mentor.year || "...",
      content: t.story?.nodes.mentor.content || "...",
      icon: <Bookmark />,
      x: 18, y: 18,
      constellation: "origins",
      requiredVisits: 2,
      connections: ["roots_start"]
    },
    {
      id: "secret_roots",
      title: t.story?.nodes.secret_roots.title || "...",
      year: t.story?.nodes.secret_roots.year || "...",
      content: t.story?.nodes.secret_roots.content || "...",
      secretContent: t.story?.nodes.secret_roots.secret || "...",
      type: "secret",
      icon: <FileText />,
      x: 5, y: 4,
      constellation: "origins",
      requiredVisits: 2,
      connections: ["tradition"]
    },
    {
      id: "talent_start",
      title: t.story?.nodes.talent_start.title || "...",
      year: t.story?.nodes.talent_start.year || "...",
      content: t.story?.nodes.talent_start.content || "...",
      icon: <Target />,
      x: 92, y: 12,
      constellation: "talent",
      requiredVisits: 3,
      connections: ["sharp_blade", "steady_hand"]
    },
    {
      id: "sharp_blade",
      title: t.story?.nodes.sharp_blade.title || "...",
      year: t.story?.nodes.sharp_blade.year || "...",
      content: t.story?.nodes.sharp_blade.content || "...",
      icon: <Zap />,
      x: 97, y: 5,
      constellation: "talent",
      requiredVisits: 3,
      connections: ["alchemy", "secret_talent"]
    },
    {
      id: "steady_hand",
      title: t.story?.nodes.steady_hand.title || "...",
      year: t.story?.nodes.steady_hand.year || "...",
      content: t.story?.nodes.steady_hand.content || "...",
      icon: <Activity />,
      x: 88, y: 6,
      constellation: "talent",
      requiredVisits: 3,
      connections: ["philosophy"]
    },
    {
      id: "alchemy",
      title: t.story?.nodes.alchemy.title || "...",
      year: t.story?.nodes.alchemy.year || "...",
      content: t.story?.nodes.alchemy.content || "...",
      icon: <FlaskConical />,
      x: 96, y: 20,
      constellation: "talent",
      requiredVisits: 3,
      connections: ["talent_start"]
    },
    {
      id: "philosophy",
      title: t.story?.nodes.philosophy.title || "...",
      year: t.story?.nodes.philosophy.year || "...",
      content: t.story?.nodes.philosophy.content || "...",
      icon: <Eye />,
      x: 82, y: 22,
      constellation: "talent",
      requiredVisits: 3,
      connections: ["talent_start"]
    },
    {
      id: "secret_talent",
      title: t.story?.nodes.secret_talent.title || "...",
      year: t.story?.nodes.secret_talent.year || "...",
      content: t.story?.nodes.secret_talent.content || "...",
      secretContent: t.story?.nodes.secret_talent.secret || "...",
      type: "secret",
      icon: <Flame />,
      x: 94, y: 3,
      constellation: "talent",
      requiredVisits: 3,
      connections: ["sharp_blade"]
    },
    {
      id: "career_start",
      title: t.story?.nodes.career_start.title || "...",
      year: t.story?.nodes.career_start.year || "...",
      content: t.story?.nodes.career_start.content || "...",
      icon: <Navigation />,
      x: 12, y: 85,
      constellation: "career",
      requiredVisits: 4,
      connections: ["team_power", "territory"]
    },
    {
      id: "team_power",
      title: t.story?.nodes.team_power.title || "...",
      year: t.story?.nodes.team_power.year || "...",
      content: t.story?.nodes.team_power.content || "...",
      icon: <Users />,
      x: 4, y: 94,
      constellation: "career",
      requiredVisits: 4,
      connections: ["standards", "secret_career"]
    },
    {
      id: "territory",
      title: t.story?.nodes.territory.title || "...",
      year: t.story?.nodes.territory.year || "...",
      content: t.story?.nodes.territory.content || "...",
      icon: <Map />,
      x: 20, y: 92,
      constellation: "career",
      requiredVisits: 4,
      connections: ["legacy_building"]
    },
    {
      id: "standards",
      title: t.story?.nodes.standards.title || "...",
      year: t.story?.nodes.standards.year || "...",
      content: t.story?.nodes.standards.content || "...",
      icon: <ShieldCheck />,
      x: 3, y: 82,
      constellation: "career",
      requiredVisits: 4,
      connections: ["career_start"]
    },
    {
      id: "legacy_building",
      title: t.story?.nodes.legacy_building.title || "...",
      year: t.story?.nodes.legacy_building.year || "...",
      content: t.story?.nodes.legacy_building.content || "...",
      icon: <Award />,
      x: 10, y: 97,
      constellation: "career",
      requiredVisits: 4,
      connections: ["career_start"]
    },
    {
      id: "secret_career",
      title: t.story?.nodes.secret_career.title || "...",
      year: t.story?.nodes.secret_career.year || "...",
      content: t.story?.nodes.secret_career.content || "...",
      secretContent: t.story?.nodes.secret_career.secret || "...",
      type: "secret",
      icon: <EyeOff />,
      x: 5, y: 72,
      constellation: "career",
      requiredVisits: 4,
      connections: ["team_power"]
    },
    {
      id: "ultimate_goal",
      title: t.story?.nodes.ultimate_goal.title || "...",
      year: t.story?.nodes.ultimate_goal.year || "...",
      content: t.story?.nodes.ultimate_goal.content || "...",
      icon: <Trophy />,
      x: 88, y: 85,
      constellation: "ultimate",
      requiredVisits: 5,
      connections: ["perfection", "immortality"]
    },
    {
      id: "perfection",
      title: t.story?.nodes.perfection.title || "...",
      year: t.story?.nodes.perfection.year || "...",
      content: t.story?.nodes.perfection.content || "...",
      icon: <Zap />,
      x: 95, y: 82,
      constellation: "ultimate",
      requiredVisits: 5,
      connections: ["new_era", "secret_ultimate"]
    },
    {
      id: "immortality",
      title: t.story?.nodes.immortality.title || "...",
      year: t.story?.nodes.immortality.year || "...",
      content: t.story?.nodes.immortality.content || "...",
      icon: <Compass />,
      x: 82, y: 94,
      constellation: "ultimate",
      requiredVisits: 5,
      connections: ["new_era"]
    },
    {
      id: "new_era",
      title: t.story?.nodes.new_era.title || "...",
      year: t.story?.nodes.new_era.year || "...",
      content: t.story?.nodes.new_era.content || "...",
      icon: <Radio />,
      x: 97, y: 92,
      constellation: "ultimate",
      requiredVisits: 5,
      connections: ["ultimate_goal"]
    },
    {
      id: "secret_ultimate",
      title: t.story?.nodes.secret_ultimate.title || "...",
      year: t.story?.nodes.secret_ultimate.year || "...",
      content: t.story?.nodes.secret_ultimate.content || "...",
      secretContent: t.story?.nodes.secret_ultimate.secret || "...",
      type: "secret",
      icon: <Key />,
      x: 92, y: 97,
      constellation: "ultimate",
      requiredVisits: 5,
      connections: ["perfection"]
    },
    {
      id: "legacy_myth",
      title: t.story?.nodes.legacy_myth.title || "...",
      year: t.story?.nodes.legacy_myth.year || "...",
      content: t.story?.nodes.legacy_myth.content || "...",
      icon: <Award />,
      x: 2, y: 2,
      constellation: "origins",
      requiredVisits: 2,
      connections: ["tradition"]
    }
  ], [t]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Find the actual node object based on the selected ID
  const selectedNode = React.useMemo(() => 
    STORY_NODES.find(n => n.id === selectedNodeId) || null
  , [STORY_NODES, selectedNodeId]);

  // Set initial node once translations are ready
  useEffect(() => {
    if (STORY_NODES.length > 0 && !selectedNodeId) {
      setSelectedNodeId("origin");
    }
  }, [STORY_NODES, selectedNodeId]);

  useEffect(() => {
    setIsMounted(true);
    const updateTier = () => {
      const tier = document.documentElement.getAttribute('data-graphics-tier') || "low";
      setGraphicsTier(tier);
    };
    window.addEventListener('mmbarber-graphics-update', updateTier);
    return () => window.removeEventListener('mmbarber-graphics-update', updateTier);
  }, []);

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

    const tier = document.documentElement.getAttribute('data-graphics-tier') || "low";
    setGraphicsTier(tier);

    let starCount = 800;
    if (tier === 'high') starCount = 400;
    else if (tier === 'medium') starCount = 200;
    else if (tier === 'low') starCount = 80;

    setStars([...Array(starCount)].map((_, i) => {
      const rand = Math.random();
      let color = "rgba(255, 255, 255, 0.8)";
      if (rand > 0.95) color = "rgba(147, 197, 253, 0.8)";
      else if (rand > 0.90) color = "rgba(252, 165, 165, 0.8)";
      else if (rand > 0.85) color = "var(--color-mafia-gold)";

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
    return t.story?.sectors[constellation as keyof typeof t.story.sectors] || t.story?.sectors.core || "Unknown";
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
    if (selectedNodeId && !visitedNodes.has(selectedNodeId)) {
      const nextVisited = new Set(visitedNodes);
      nextVisited.add(selectedNodeId);
      setVisitedNodes(nextVisited);
      localStorage.setItem("mmbarber_story_progress", JSON.stringify(Array.from(nextVisited)));
      setJustUnlocked(selectedNodeId);
      setTimeout(() => setJustUnlocked(null), 1500);
    }
    setIsSecretRevealed(false);
    setHackingProgress(0);
  }, [selectedNodeId]);

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
    const currentIndex = STORY_NODES.findIndex(n => n.id === selectedNodeId);
    const nextNode = STORY_NODES[currentIndex + 1];
    if (nextNode && unlockedLevels.has(nextNode.requiredVisits || 1)) {
      setSelectedNodeId(nextNode.id);
      handleCenterCamera(nextNode);
    }
  };
  const handlePrevNode = () => {
    const currentIndex = STORY_NODES.findIndex(n => n.id === selectedNodeId);
    const prevNode = STORY_NODES[currentIndex - 1];
    if (prevNode && unlockedLevels.has(prevNode.requiredVisits || 1)) {
      setSelectedNodeId(prevNode.id);
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
  }, [selectedNodeId, unlockedLevels]);

  const starLayer1 = React.useMemo(() => {
    if (graphicsTier === 'low') return null; // We will render flat 2D stars inside the panning layer instead
    const sliceEnd = graphicsTier === 'ultra' ? 200 : (graphicsTier === 'high' ? 150 : (graphicsTier === 'medium' ? 100 : 50));

    return (
      <motion.div 
        style={{ 
          x: starLayer1X, 
          y: starLayer1Y, 
          scale: starLayer1Scale 
        }} 
        className="absolute inset-0 w-[150%] h-[150%]"
      >
        {stars.slice(0, sliceEnd).map(star => (
          <motion.div 
            key={star.id} 
            animate={{ opacity: [0.2, 0.8, 0.2] }} 
            transition={{ duration: star.duration, repeat: Infinity }} 
            className="absolute rounded-full"
            style={{ width: star.size, height: star.size, left: `${star.x}%`, top: `${star.y}%`, backgroundColor: star.color, boxShadow: '0 0 5px white' }} 
          />
        ))}
      </motion.div>
    );
  }, [stars, graphicsTier, starLayer1X, starLayer1Y, starLayer1Scale]);

  const starLayer2 = React.useMemo(() => {
    if (graphicsTier === 'low' || graphicsTier === 'medium') return null;
    const sliceEnd = graphicsTier === 'ultra' ? 400 : 300;

    return (
      <motion.div style={{ x: starLayer2X, y: starLayer2Y, scale: starLayer2Scale }} className="absolute inset-0 w-[200%] h-[200%]">
        {stars.slice(200, sliceEnd).map(star => (
          <motion.div key={star.id} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: star.duration * 0.8, repeat: Infinity }} className="absolute rounded-full"
            style={{ width: star.size * 1.2, height: star.size * 1.2, left: `${star.x}%`, top: `${star.y}%`, backgroundColor: star.color, boxShadow: `0 0 8px ${star.color}` }} />
        ))}
      </motion.div>
    );
  }, [stars, graphicsTier]);

  const starLayer3 = React.useMemo(() => {
    if (graphicsTier !== 'ultra') return null;
    return (
      <motion.div style={{ x: starLayer3X, y: starLayer3Y, scale: starLayer3Scale }} className="absolute inset-0 w-[300%] h-[300%]">
        {stars.slice(400, 600).map(star => (
          <div key={star.id} className="absolute rounded-full" style={{ width: star.size * 1.5, height: star.size * 1.5, left: `${star.x}%`, top: `${star.y}%`, backgroundColor: star.color, opacity: 0.6 }} />
        ))}
      </motion.div>
    );
  }, [stars, graphicsTier]);


  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-transparent text-smoke-white overflow-hidden flex flex-col lg:flex-row">
      <div className="fixed inset-0 pointer-events-none z-0 atmosphere-container">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-mafia-gold/5 via-transparent to-mafia-black/40" />
      </div>

      <div className="w-full lg:w-[320px] xl:w-[400px] h-[45vh] lg:h-full bg-transparent relative z-40 flex flex-col pointer-events-none">
        <div className="p-8 pt-24 lg:pt-12 flex flex-col h-full items-center text-center pointer-events-none">
          <div className="flex items-center gap-3 mb-10 opacity-30">
            <div className="w-8 h-px bg-mafia-gold/40" />
            <div className="text-mafia-gold font-mono text-[9px] tracking-[0.6em] uppercase">Archiv_812</div>
            <div className="w-8 h-px bg-mafia-gold/40" />
          </div>

          <div className="flex-1 w-full flex flex-col justify-end pb-12">
            <AnimatePresence mode="wait">
              {selectedNode && (
                <motion.div 
                  key={`${selectedNode.id}-${lang}`} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 20 }} 
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="space-y-6 pointer-events-auto relative z-50"
                >
                  <span className="text-mafia-gold/40 font-mono text-[10px] tracking-widest block uppercase">
                    {(t.story?.hud?.period || "PERIOD") + " " + (selectedNode.year || "...")}
                  </span>
                  <h2 className="text-4xl font-heading font-black text-white uppercase italic leading-tight" style={{ textShadow: "0 0 20px rgba(212,175,55,0.3)", fontFamily: "var(--font-playfair), serif" }}>
                    {selectedNode.title}
                  </h2>
                  <p className="text-white/80 text-lg italic leading-relaxed" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)", fontFamily: "var(--font-inter), sans-serif" }}>
                    {selectedNode.content}
                  </p>

                  {selectedNode.type === 'secret' && !isSecretRevealed ? (
                    <button onClick={handleRevealSecret} className="w-full py-4 border border-mafia-red/40 text-mafia-red font-mono text-[10px] uppercase hover:bg-mafia-red hover:text-white transition-all">
                      {hackingProgress > 0 ? `${t.story?.hud.hacking} ${hackingProgress}%` : t.story?.hud.startHacking}
                    </button>
                  ) : isSecretRevealed && selectedNode.secretContent && (
                    <div className="p-6 border border-mafia-red/20 bg-mafia-red/5 text-mafia-red italic rounded-sm">
                      <div className="text-[9px] font-mono mb-2 opacity-50">{t.story?.hud.decryptedData}</div>
                      {selectedNode.secretContent}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="absolute inset-0 z-0 bg-[#020202] overflow-hidden cursor-crosshair" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <div className="absolute inset-0 pointer-events-none z-0">
          {starLayer1} {starLayer2} {starLayer3}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none atmosphere-container" />

        <ShootingStar />

        <motion.div className="absolute origin-top-left z-10" style={{ x: panX, y: panY, scale: zoomMotion, width: mapSize.width, height: mapSize.height }}>
          {/* FLAT 2D GALAXY BACKGROUND FOR LITE TIER */}
          {graphicsTier === 'low' && (
            <div className="absolute inset-0 pointer-events-none opacity-50">
              {stars.slice(0, 80).map(star => (
                <div 
                  key={`flat-${star.id}`} 
                  className="absolute rounded-full bg-white"
                  style={{ 
                    width: star.size, 
                    height: star.size, 
                    left: `${star.x}%`, 
                    top: `${star.y}%`, 
                    backgroundColor: star.color 
                  }} 
                />
              ))}
            </div>
          )}

          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {STORY_NODES.map(node => node.connections.map(targetId => {
              const target = STORY_NODES.find(n => n.id === targetId);
              if (!target || !unlockedLevels.has(node.requiredVisits || 1) || !unlockedLevels.has(target.requiredVisits || 1)) return null;
              return <line key={`${node.id}-${target.id}`} x1={`${node.x}%`} y1={`${node.y}%`} x2={`${target.x}%`} y2={`${target.y}%`} stroke={getGalaxyColor("var(--color-mafia-gold)")} strokeWidth={getStrokeWidth(2.5)} opacity={0.6} />;
            }))}
          </svg>

          {STORY_NODES.map(node => {
            const isAccessible = unlockedLevels.has(node.requiredVisits || 1);
            const isVisited = visitedNodes.has(node.id);
            return (
              <motion.div key={node.id} className="absolute" style={{ left: `${node.x}%`, top: `${node.y}%`, x: "-50%", y: "-50%" }}>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    if (isAccessible) { 
                      setSelectedNodeId(node.id); 
                      handleCenterCamera(node); 
                    } 
                  }}
                  className={`w-14 h-14 rounded-sm border-2 flex items-center justify-center transition-all duration-500 pointer-events-auto relative z-20 ${selectedNodeId === node.id ? "bg-mafia-gold text-mafia-black border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)]" : isVisited ? "bg-black text-mafia-gold border-mafia-gold" : "bg-black/80 text-white/20 border-white/10"}`}>
                  {isVisited ? (React.isValidElement(node.icon) ? React.cloneElement(node.icon as any, { size: 20 }) : <span>●</span>) : isAccessible ? <Activity size={20} className="animate-pulse" /> : <Lock size={20} className="opacity-20" />}
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
          <div className="flex justify-between gap-8"><span>{t.story?.hud.distance}</span><span className="text-mafia-gold font-bold">{textDistance} LY</span></div>
          <div className="flex justify-between gap-8"><span>{t.story?.hud.galaxy}</span><span className="text-mafia-gold font-bold">{getSectorName(selectedNode?.constellation || "core")}</span></div>
        </div>
      </div>

      <button onClick={() => window.location.href = '/'} className="fixed top-8 right-8 w-12 h-12 bg-black/60 border border-mafia-gold/20 text-mafia-gold flex items-center justify-center rounded-full z-[100] hover:text-white transition-all"><X size={20} /></button>
    </div>
  );
}
