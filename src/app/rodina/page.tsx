"use client";

import { useState, useEffect, useRef } from "react";
import Image from "@/components/OptimizedImage";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Zap,
  Droplets,
  Star,
  ArrowRight,
  Camera,
  Music,
  HeartHandshake,
  Phone,
  UtensilsCrossed,
  Home,
  Package,
  Hammer,
  Monitor,
  Calculator,
  Bike,
  Clock,
  FileText,
  X
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { trackEvent } from "@/utils/analytics";
import { playSound } from "@/utils/audio";

function MemberCard({ m, lang }: { m: any, lang: string }) {
  const [showContact, setShowContact] = useState(false);
  const role = lang === 'cs' ? m.role : m.roleEn;
  return (
    <div key={m.name} className="group bg-mafia-black/80 border border-mafia-gold/20 p-8 flex flex-col items-center justify-center backdrop-blur-xl hover:border-mafia-gold transition-all relative overflow-hidden">
      <Image src={m.img} alt={m.name} width={100} height={100} className="w-24 h-24 object-contain mb-6 grayscale group-hover:grayscale-0 transition-all" />
      <h3 className="text-xl font-heading font-black text-smoke-white uppercase mb-2">{m.name}</h3>
      <p className="text-mafia-gold font-mono text-[9px] tracking-widest uppercase mb-6">{role}</p>

      <div className="flex flex-col items-center w-full gap-4">
        <button
          onClick={() => setShowContact(!showContact)}
          className="px-10 py-3 border border-mafia-gold text-mafia-gold font-black text-[10px] uppercase tracking-widest hover:bg-mafia-gold hover:text-black transition-all"
        >
          {showContact ? (lang === 'cs' ? "ZAVŘÍT" : "CLOSE") : (lang === 'cs' ? "ZOBRAZIT" : "SHOW")}
        </button>

        <AnimatePresence>
          {showContact && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full bg-mafia-gold/5 border-t border-mafia-gold/20 mt-4 pt-4 flex flex-col items-center gap-3 overflow-hidden"
            >
              {/* Phone number if available */}
              {(m.phone || m.link.startsWith('tel:')) && (
                <div className="flex flex-col items-center gap-1">
                  <p className="text-mafia-gold font-heading text-lg font-black">{m.phone || m.link.replace('tel:', '')}</p>
                  <a href={`tel:${m.phone || m.link.replace('tel:', '')}`} className="text-[9px] font-mono text-white/40 hover:text-white uppercase tracking-widest border-b border-white/10 pb-1">ZAVOLAT</a>
                </div>
              )}

              {/* Internal CV Link */}
              {m.link.startsWith('/rodina/') && (
                <Link href={m.link} className="text-[9px] font-mono text-mafia-gold hover:text-white uppercase tracking-[0.2em] border border-mafia-gold/30 px-6 py-2 bg-mafia-gold/10">
                  {lang === 'cs' ? "ZOBRAZIT ŽIVOTOPIS" : "VIEW RESUME"}
                </Link>
              )}

              {/* External Link */}
              {!m.link.startsWith('tel:') && !m.link.startsWith('/rodina/') && (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-white/60 font-mono text-[10px] break-all px-4 text-center">{m.link}</p>
                  <a href={m.link} target="_blank" rel="noreferrer" className="text-[9px] font-mono text-mafia-gold hover:text-white uppercase tracking-[0.2em] border border-mafia-gold/30 px-4 py-2">NAVŠTÍVIT WEB</a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const divisions = [
  { id: "voda", name: "Vodaři / Vodo-Topo", nameEn: "Plumbers", icon: <Droplets className="w-5 h-5" /> },
  { id: "elektro", name: "Elektrikáři", nameEn: "Electricians", icon: <Zap className="w-5 h-5" /> },
  { id: "gastro", name: "Gastronomie", nameEn: "Gastronomy", icon: <UtensilsCrossed className="w-5 h-5" /> },
  { id: "kreativci", name: "Fotografové", nameEn: "Photographers", icon: <Camera className="w-5 h-5" /> },
  { id: "umelci", name: "Umělci", nameEn: "Artists", icon: <Music className="w-5 h-5" /> },
  { id: "reality", name: "Reality", nameEn: "Real Estate", icon: <Home className="w-5 h-5" /> },
  { id: "okna-vrata", name: "Okna / Vrata", nameEn: "Windows & Gates", icon: <Hammer className="w-5 h-5" /> },
  { id: "obaly", name: "Obaly", nameEn: "Packaging", icon: <Package className="w-5 h-5" /> },
  { id: "support", name: "Podpora", nameEn: "Support", icon: <HeartHandshake className="w-5 h-5" /> },
  { id: "ucetni", name: "Účetní", nameEn: "Accounting", icon: <Calculator className="w-5 h-5" /> },
  { id: "kola", name: "Jízdní kola", nameEn: "Bicycles", icon: <Bike className="w-5 h-5" /> },
  { id: "team", name: "Tým MMBarber", nameEn: "MMBarber Team", icon: <Monitor className="w-5 h-5" /> },
];

const members = [
  {
    name: "Vodo Topo Jahoda",
    div: "voda",
    role: "Expertíza a Tradice", roleEn: "Expertise & Tradition",
    img: "/loga_partneri/jahoda.png",
    link: "https://www.jahodavodotopo.cz/",
    year: 2025,
    specialHover: "Ten frajer hraje i na bubny..",
    specialHoverEn: "This guy even plays the drums.."
  },
  {
    name: "O Shawarma Beef",
    div: "gastro",
    role: "Nejlepší maso ve městě", roleEn: "Best Beef in Town",
    img: "/loga_partneri/ShawmaBeef.png",
    link: "https://www.instagram.com/o.shawarmabeef",
    year: 2025,
    specialHover: "Na tohoto to napráskám, to je ten co měl dole kebab. Ten jak byl na všechny milý... jo a nezapomeň říct, že jdeš od nás!",
    specialHoverEn: "I'll spill the beans on this one, he's the one who had the kebab place downstairs. The one who was nice to everyone... and don't forget to say you're from us!"
  },
  { name: "Poe Poe", div: "gastro", role: "Kvalitní posezení", roleEn: "Quality Dining", img: "/loga_partneri/poe.png", link: "https://www.poe-poe.cz/", year: 2025 },
  {
    name: "Dvůr pod Starýma Horama",
    div: "gastro",
    role: "Víno a Zážitky", roleEn: "Wine & Experiences",
    img: "/loga_partneri/DvurPodHorama.png",
    link: "https://dvurpodstarymahorama.cz/",
    year: 2025,
    specialHover: "Sem tam nějaká Brigadička pro mladého? nebo nějaké vínko z moravy ?",
    specialHoverEn: "Every now and then a little gig for the young one? Or some wine from Moravia?"
  },
  {
    name: "Malina Photo",
    div: "kreativci",
    role: "Profesionální Foto", roleEn: "Professional Photo",
    img: "/loga_partneri/malinaphoto.gif",
    link: "https://malinaphoto.cz/",
    year: 2025,
    specialHover: "Před pár lety jsme se setkali v Brně na Olympii, kde ji fotil. Netušil jsem, že bude ještě fotit i nás..",
    specialHoverEn: "A few years ago we met in Brno at Olympia where he photographed her. I had no idea he would be photographing us too.."
  },
  { name: "Šimon Král", div: "umelci", role: "Hudba & Eventy", roleEn: "Music & Events", img: "/loga_partneri/djKing.png", link: "https://simonkral.cz/", year: 2025 },
  {
    name: "Argema",
    div: "umelci",
    role: "Rocková Legenda", roleEn: "Rock Legend",
    img: "/loga_partneri/argema.png",
    link: "https://www.argema.cz/",
    year: 2025,
    specialHover: "To snad nemusím ani představovat...",
    specialHoverEn: "I probably don't even need to introduce this..."
  },
  { name: "Kofipack", div: "obaly", role: "Obalová Řešení", roleEn: "Packaging Solutions", img: "/loga_partneri/kofipack.png", link: "https://kofipack.cz/", year: 2025 },
  { name: "Sluneční Reality", div: "reality", role: "Reality s úsměvem", roleEn: "Real Estate Experts", img: "/loga_partneri/slunecniReality.png", link: "https://slunecnireality.cz/", year: 2025 },
  {
    name: "Dětský domov UH",
    div: "support",
    role: "Společenská Odpovědnost", roleEn: "Community Support",
    img: "/loga_partneri/detskydomov.png",
    link: "https://www.detskydomovuh.cz/",
    year: 2026,
    specialHover: "Co třeba neřešit vše jen penězma a nefotit se, ale darovat jim zážitek nebo koupit zmrzlinu? Možná stačí jen malá změna.",
    specialHoverEn: "How about not focusing just on money? Give them an experience instead. Maybe a small change is all it takes."
  },
  {
    name: "Zdeněk Mička",
    div: "voda",
    role: "Voda / Topo / Bílovice", roleEn: "Plumbing & Heating",
    img: "/logo.png",
    link: "tel:+420739080968",
    phone: "+420 739 080 968",
    year: 2025,
    specialHover: "Potřebuješ vodu nebo topení vyřešit hned? Zdeněk je tvoje spojka.",
    specialHoverEn: "Need plumbing or heating solved right now? Zdeněk is your contact."
  },
  {
    name: "Kudielka",
    div: "okna-vrata",
    role: "Stínící technika & Vrata", roleEn: "Shading & Gates",
    img: "/logo.png",
    link: "https://www.kudielka.cz/stinici-technika/plise-zaluzie.html",
    year: 2025,
    specialHover: "Potřebuješ se schovat před světem nebo před šéfem? Tyto žaluzie tě podrží.",
    specialHoverEn: "Need to hide from the world or your boss?"
  },
  {
    name: "Roman Jakubčák",
    div: "elektro",
    role: "Elektro / Revize", roleEn: "Electric / Revision",
    img: "/logo.png",
    link: "/rodina/elektrikari/roman-jakubcak",
    phone: "+420 732 169 799",
    year: 2026,
    specialHover: "Když to nejde silou, jde to Jakubčákem...",
    specialHoverEn: "When force doesn't work, Jakubčák does..."
  },
  {
    name: "Tomáš Mička",
    div: "team",
    role: "Web designer | Grafik", roleEn: "Web Designer | Graphic Designer",
    img: "/logo.png",
    link: "tel:+420577544073",
    year: 2025
  },
  {
    name: "Matěj Prášil",
    div: "team",
    role: "C# developer", roleEn: "C# Developer",
    img: "/logo.png",
    link: "tel:+420577544073",
    year: 2025
  },
  {
    name: "Adam Horňák",
    div: "team",
    role: "Web designer", roleEn: "Web Designer",
    img: "/logo.png",
    link: "tel:+420577544073",
    year: 2025
  },
  {
    name: "Romana Mičková",
    div: "ucetni",
    role: "Samostatná účetní", roleEn: "Independent Accountant",
    img: "/logo.png",
    link: "tel:+420774640332",
    phone: "+420 774 640 332",
    year: 2026
  },
  {
    name: "O Kolečko víc",
    div: "kola",
    role: "Jízdní kola a servis", roleEn: "Bicycles and Service",
    img: "/loga_partneri/okoleckovic.png",
    link: "https://www.okoleckovic.cz/",
    year: 2026
  },
];

export default function FamilyPage() {
  const { t, lang } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [activeDivision, setActiveDivision] = useState("voda");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isWallOpen, setIsWallOpen] = useState(false);
  const [contactModal, setContactModal] = useState<{ name: string; phone: string } | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "network">("grid");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const playDoorbell = () => {
    playSound("/sounds/zvonek.mp3", 0.4);
  };

  useEffect(() => {
    setIsMounted(true);
    trackEvent("view_family_page");
  }, []);

  // Camera control via Mouse Movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (viewMode !== 'network') return;
      // Calculate normalized mouse position (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Hide global header when in network mode
    if (viewMode === 'network') {
      document.documentElement.classList.add('hide-header-mm');
    } else {
      document.documentElement.classList.remove('hide-header-mm');
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.classList.remove('hide-header-mm');
    };
  }, [viewMode]);

  if (!isMounted) return null;

  const filteredMembers = members.filter(m => (activeDivision === 'all' || m.div === activeDivision) && m.div !== 'team');

  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white pt-32 pb-24 px-6 relative overflow-hidden cursor-crosshair">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,20,1)_0%,rgba(5,5,5,1)_100%)] pointer-events-none"></div>

      {/* View Mode Toggle - Only visible on Desktop */}
      <div className="fixed bottom-12 right-12 z-[100] hidden md:flex flex-col items-end gap-4">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-mafia-black/80 backdrop-blur-xl border border-mafia-gold/20 p-2 flex gap-2 shadow-2xl">
          <button onClick={() => { setViewMode("grid"); playDoorbell(); }} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-mafia-gold text-mafia-black' : 'text-mafia-gold/40 hover:text-mafia-gold'}`}>{t.rodina.list}</button>
          <button onClick={() => { setViewMode("network"); playDoorbell(); }} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'network' ? 'bg-mafia-gold text-mafia-black shadow-[0_0_20px_rgba(197,160,89,0.4)]' : 'text-mafia-gold/40 hover:text-mafia-gold'}`}>{t.rodina.network}</button>
        </motion.div>
      </div>

      {/* Cinematic Dust/Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }}
            animate={{ y: [null, "-100%"], opacity: [0, 0.4, 0] }}
            transition={{ duration: 20 + Math.random() * 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-1 h-1 bg-mafia-gold/20 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Navigation Breadcrumb - Only visible in Grid Mode */}
        {viewMode === 'grid' && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
            <Link href="/" className="group flex items-center gap-3 text-mafia-gold/60 hover:text-mafia-gold transition-colors font-mono text-xs uppercase tracking-[0.3em]">
              <ChevronLeft size={16} /> {t.rodina.backToHq}
            </Link>
          </motion.div>
        )}

        {viewMode === 'grid' && (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-heading font-black text-smoke-white uppercase mb-4">{t.rodina.title}</h1>
              <p className="text-mafia-gold font-heading text-xl uppercase tracking-[0.2em] italic font-black">{t.rodina.youForUs}</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-16">
              <aside className="w-full lg:w-[400px] shrink-0">
                <div className="sticky top-32">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-16 h-1.5 bg-mafia-gold"></div>
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-smoke-white uppercase tracking-widest italic">
                      {t.rodina.divisions}
                    </h2>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {divisions.map((div) => (
                      <button
                        key={div.id}
                        onClick={() => {
                          setActiveDivision(div.id);
                          playDoorbell();
                        }}
                        className={`w-full group relative overflow-hidden border-2 p-6 text-left transition-all duration-500 ${activeDivision === div.id ? 'border-mafia-gold bg-mafia-gold/10 shadow-[0_0_40px_rgba(197,160,89,0.3)]' : 'border-white/5 bg-white/[0.02] hover:border-mafia-gold/40'
                          }`}
                      >
                        <div className="relative z-10 flex items-center justify-between">
                          <span className={`font-heading font-bold text-lg uppercase tracking-widest transition-colors ${activeDivision === div.id ? 'text-mafia-gold' : 'text-smoke-white/60 group-hover:text-smoke-white'}`}>
                            {lang === 'cs' ? div.name : div.nameEn}
                          </span>
                          <div className={activeDivision === div.id ? 'text-mafia-gold' : 'text-smoke-white/20'}>
                            {div.icon && <div className="scale-125">{div.icon}</div>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </nav>

                  <div className="mt-12 p-6 border border-mafia-gold/10 bg-mafia-gold/5 backdrop-blur-sm">
                    <p className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.2em] leading-relaxed italic">
                      {t.rodina.weAreFamily}
                    </p>
                  </div>
                </div>
              </aside>

              <div className="flex-grow">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDivision}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {members.filter(m => activeDivision === 'all' || m.div === activeDivision).map(m => (
                      <MemberCard key={m.name} m={m} lang={lang} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* BONUS CONTENT SECTION - Only in Grid View */}
            <div className="mt-32 pt-24 border-t border-white/5 flex flex-col items-center">
              <button
                onClick={() => {
                  setIsWallOpen(true);
                  trackEvent("view_support_wall");
                }}
                className="flex flex-col items-center group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px w-20 bg-mafia-gold/20 group-hover:w-32 transition-all duration-700"></div>
                  <Star size={24} className="text-mafia-gold animate-pulse" />
                  <div className="h-px w-20 bg-mafia-gold/20 group-hover:w-32 transition-all duration-700"></div>
                </div>
                <span className="text-[12px] font-mono text-mafia-gold/40 uppercase tracking-[0.8em] mb-2">BONUS CONTENT</span>
                <span className="text-2xl md:text-3xl font-heading font-black text-mafia-gold uppercase tracking-widest group-hover:text-smoke-white transition-colors duration-500">
                  {t.rodina.list === 'Seznam' ? "Zeď podpory členů" : "Member Support Wall"}
                </span>
              </button>
            </div>

            <AnimatePresence>
              {isWallOpen && (
                <motion.section
                  key="classified-wall"
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="mt-20 pt-16 pb-20 border-t border-mafia-gold/30 px-6 bg-gradient-to-b from-mafia-gold/[0.02] to-transparent relative z-50"
                >
                  <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 text-center md:text-left">
                      <div className="flex flex-col gap-2">
                        <div className="text-mafia-gold font-mono text-[9px] uppercase tracking-[0.4em] mb-1 opacity-60">
                          {lang === 'cs' ? "INTERNÍ ARCHIV // DIVIZE PODPORY" : "INTERNAL ARCHIVE // SUPPORT DIVISION"}
                        </div>
                        <h4 className="text-3xl md:text-5xl font-heading font-black text-mafia-gold uppercase tracking-tighter italic">
                          {t.rodina.list === 'Seznam' ? "Zeď podpory členů" : "Member Support Wall"}
                        </h4>
                      </div>
                      <div className="border border-mafia-gold/20 text-mafia-gold/60 px-6 py-2 text-sm font-black uppercase tracking-[0.4em]">
                        2024
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"].map((month, idx) => {
                        const currentMonthIdx = new Date().getMonth();
                        const isReleased = idx <= currentMonthIdx;
                        return (
                          <motion.div
                            key={idx}
                            className={`p-4 border transition-all duration-500 ${isReleased ? 'border-mafia-gold/30 bg-white/[0.01] hover:bg-mafia-gold/5' : 'border-white/5 opacity-10'}`}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[9px] font-black tracking-widest text-mafia-gold/40 uppercase">{month}</span>
                              {isReleased && <Star size={8} className="fill-mafia-gold text-mafia-gold" />}
                            </div>
                            <div className="flex flex-col items-center">
                              <div className={`relative w-24 h-24 overflow-hidden border ${isReleased ? 'border-mafia-gold/20' : 'border-white/5'}`}>
                                {isReleased ? (
                                  <Image src="/logo.png" alt="Member" width={120} height={120} className="w-full h-full object-cover filter brightness-110" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
                                    <Clock className="w-4 h-4 text-white/10" />
                                  </div>
                                )}
                              </div>
                              <p className={`mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-center ${isReleased ? 'text-mafia-gold/80' : 'text-smoke-white/10'}`}>
                                {isReleased ? "ČLEN RODINY" : "..."}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="mt-12 flex justify-center">
                      <button
                        onClick={() => setIsWallOpen(false)}
                        className="px-8 py-3 border border-mafia-gold/20 text-mafia-gold/40 font-mono text-[9px] uppercase tracking-[0.4em] hover:text-mafia-gold hover:border-mafia-gold transition-all"
                      >
                        {lang === 'cs' ? "ZAVŘÍT ZEĎ" : "CLOSE WALL"}
                      </button>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* FULLSCREEN NETWORK VIEW / TACTICAL BOARD */}
      <AnimatePresence>
        {viewMode === 'network' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#0a0a0a] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {/* Tactical Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

            {/* Prominent Back Button */}
            <div className="absolute top-10 left-10 z-[300]">
              <button
                onClick={() => { setViewMode('grid'); }}
                className="group flex items-center gap-3 text-mafia-gold hover:text-smoke-white transition-all font-mono text-[11px] font-black uppercase tracking-[0.5em] bg-mafia-gold/10 backdrop-blur-xl px-8 py-4 border-2 border-mafia-gold shadow-[0_0_30px_rgba(197,160,89,0.2)] hover:shadow-[0_0_50px_rgba(197,160,89,0.4)]"
              >
                <ChevronLeft size={16} /> {t.rodina.closeNetwork}
              </button>
            </div>

            {/* Mouse Instruction Hint */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-10 top-1/2 -translate-y-1/2 z-[300] hidden xl:flex flex-col items-center gap-4 bg-mafia-black/40 p-6 border border-mafia-gold/10 backdrop-blur-md"
            >
              <div className="relative w-12 h-20 border-2 border-mafia-gold/40 rounded-full flex justify-center p-1">
                <motion.div
                  animate={{
                    x: [mousePos.x * 5],
                    y: [mousePos.y * 5],
                  }}
                  className="w-3 h-3 bg-mafia-gold rounded-full self-center"
                />
              </div>
              <p className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-[0.3em] text-center leading-relaxed">
                {t.rodina.cameraFollows}
              </p>
            </motion.div>

            {/* The Tactical Canvas (Now Fixed with Camera Movement) */}
            <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden perspective-1000">
              <motion.div
                animate={{
                  x: -mousePos.x * 600, // Significantly increased movement range
                  y: -mousePos.y * 600,
                  rotateY: mousePos.x * 8, // Slightly more pronounced 3D tilt
                  rotateX: -mousePos.y * 8,
                }}
                transition={{ type: "spring", stiffness: 40, damping: 25 }}
                className="relative min-w-[3000px] min-h-[2000px] flex items-center justify-center pointer-events-none"
                style={{ willChange: 'transform' }}
              >

                {/* SVG Connections (Strings) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  {members.filter(m => m.div !== 'team').map((member, i, arr) => {
                    const angle = (i / arr.length) * 2 * Math.PI;
                    const distance = 450 + (Math.sin(i * 13) * 150) + (i * 15);
                    const x = 50 + (Math.cos(angle) * distance / 35);
                    const y = 50 + (Math.sin(angle) * distance / 25);
                    const isHovered = hoveredNode === member.name;

                    return (
                      <motion.line
                        key={`string-${member.name}`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                          pathLength: 1,
                          opacity: isHovered ? 0.9 : 0.25,
                          strokeWidth: isHovered ? 2 : 1
                        }}
                        style={{ strokeWidth: isHovered ? 2 : 1 }}
                        transition={{ duration: 0.4 }}
                        x1="50%"
                        y1="50%"
                        x2={`${x}%`}
                        y2={`${y}%`}
                        stroke={isHovered ? "#c5a059" : "#c5a059"}
                        strokeDasharray={isHovered ? "0" : "6,6"}
                      />
                    );
                  })}
                </svg>

                {/* Center Node (MMBarber) - Perfectly Central */}
                <div className="absolute z-30 w-64 h-64 flex items-center justify-center pointer-events-auto -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '50%' }}>
                  <motion.div
                    animate={{
                      scale: hoveredNode ? 1.2 : 1,
                      opacity: hoveredNode ? 0.4 : 0.15
                    }}
                    className="absolute inset-0 bg-mafia-gold rounded-full blur-3xl animate-pulse"
                  />
                  <motion.div
                    animate={{
                      borderColor: hoveredNode ? "rgba(197, 160, 89, 0.8)" : "rgba(197, 160, 89, 0.4)",
                      boxShadow: hoveredNode ? "0 0 60px rgba(197, 160, 89, 0.6)" : "0 0 100px rgba(197, 160, 89, 0.2)"
                    }}
                    className="relative w-full h-full bg-mafia-black border-2 rounded-full flex items-center justify-center p-10 transition-all duration-500"
                  >
                    <Image src="/logo.png" alt="MMBarber" width={160} height={160} className="w-48 h-48 object-contain drop-shadow-[0_0:30px_rgba(197,160,89,0.6)]" priority />
                  </motion.div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-mafia-gold text-mafia-black px-8 py-1 font-heading font-black text-[10px] uppercase tracking-[0.5em] shadow-xl">
                    {t.rodina.headquarters}
                  </div>
                </div>

                {/* Partner Nodes (Spread out to avoid Centrála overlap) */}
                {members.filter(m => m.div !== 'team').map((member, i, arr) => {
                  const angle = (i / arr.length) * 2 * Math.PI;
                  const distance = 450 + (Math.sin(i * 13) * 150) + (i * 15);
                  const x = 50 + (Math.cos(angle) * distance / 35);
                  const y = 50 + (Math.sin(angle) * distance / 25);

                  return (
                    <motion.div
                      key={`node-${member.name}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      onMouseEnter={() => setHoveredNode(member.name)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (member.link.startsWith('tel:')) {
                          setContactModal({ name: member.name, phone: member.link.replace('tel:', '') });
                        } else {
                          window.open(member.link, "_blank", "noopener,noreferrer");
                        }
                      }}
                      className="absolute z-20 w-56 h-56 flex flex-col items-center justify-center group pointer-events-auto -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <div className="relative w-40 h-40 mb-2 group-hover:scale-125 transition-transform duration-700 ease-out">
                        <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Image
                          src={member.img}
                          alt={member.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-contain grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000"
                        />
                      </div>

                      <div className="text-center opacity-30 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-500">
                        <p className="text-[12px] font-mono font-black text-smoke-white uppercase tracking-[0.2em] leading-none mb-1 drop-shadow-lg">{member.name}</p>
                        <p className="text-[8px] font-mono text-mafia-gold/60 uppercase tracking-[0.3em] italic mb-1">{lang === 'cs' ? member.role : member.roleEn}</p>

                        {/* Joining Year with Sand/Wind Effect */}
                        <AnimatePresence mode="wait">
                          {hoveredNode === member.name && (
                            <motion.div
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              className="flex justify-center"
                            >
                              <div className="relative">
                                <span className="text-[14px] font-heading font-black text-mafia-gold tracking-[0.2em]">
                                  {member.year}
                                </span>
                                {/* Sand Particle Effects */}
                                {[...Array(6)].map((_, pi) => (
                                  <motion.div
                                    key={pi}
                                    variants={{
                                      initial: { opacity: 0, x: 0, y: 0 },
                                      animate: {
                                        opacity: [0, 1, 0],
                                        x: (Math.random() - 0.5) * 40,
                                        y: (Math.random() - 0.5) * 40,
                                        scale: [0, 1, 0]
                                      }
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: pi * 0.2 }}
                                    className="absolute top-1/2 left-1/2 w-1 h-1 bg-mafia-gold/60 rounded-full blur-[1px]"
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}

              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Modals */}
      <AnimatePresence>
        {contactModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setContactModal(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="relative w-full max-w-sm bg-mafia-dark border-2 border-mafia-gold p-8 text-center shadow-2xl">
              <h3 className="text-2xl font-heading font-black text-smoke-white uppercase mb-8">{contactModal.name}</h3>
              <p className="text-xl font-heading font-black text-mafia-gold mb-8">{contactModal.phone}</p>
              <div className="flex flex-col gap-4">
                <a href={`tel:${contactModal.phone}`} className="bg-mafia-gold py-4 text-mafia-black font-black uppercase">ZAVOLAT</a>
                <button onClick={() => setContactModal(null)} className="py-4 border border-mafia-gold/40 text-mafia-gold/60 font-black uppercase">ZAVŘÍT</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isJoinModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsJoinModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="relative w-full max-w-lg bg-mafia-dark border-2 border-mafia-gold p-12 text-center shadow-2xl">
              <h2 className="text-3xl font-heading font-black text-mafia-gold uppercase mb-8 italic">TAK ŠUPKY!</h2>
              <button onClick={() => setIsJoinModalOpen(false)} className="py-4 px-12 border border-mafia-gold/40 text-mafia-gold/60 font-black uppercase">ROZUMÍM</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </main>
  );
}
