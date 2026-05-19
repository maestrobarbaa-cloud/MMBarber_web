"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "@/components/OptimizedImage";
import NextImage from "next/image";
import Link from "next/link";
import { ArrowLeft, X, Maximize2, Camera, ChevronLeft, ChevronRight, Eye, LayoutGrid, Play, Pause } from "lucide-react";
import { Footer } from "@/components/Footer";
import { playSound } from "@/utils/audio";

interface GalleryItem {
  src: string;
  title: { cs: string; en: string };
  desc: { cs: string; en: string };
}

const CATEGORY_KEYS = ['atmosfera', 'prostredi', 'strihy', 'rodina'] as const;
type Category = typeof CATEGORY_KEYS[number];

const CATEGORY_INFO: Record<Category, { 
  title: { cs: string; en: string }; 
  desc: { cs: string; en: string };
  sector: { cs: string; en: string };
  preview: string;
}> = {
  atmosfera: {
    title: { cs: "Atmosféra", en: "Atmosphere" },
    desc: { cs: "Filmová noir estetika, detaily a unikátní nálada naší centrály.", en: "Cinematic noir aesthetics, details and the unique vibe of our HQ." },
    sector: { cs: "SEKTOR_NOIR_01", en: "SECTOR_NOIR_01" },
    preview: "/obr/atmosfera/Atmosféra/barber-4.jpg"
  },
  prostredi: {
    title: { cs: "Prostředí", en: "Environment" },
    desc: { cs: "Surový design, kůže, patinované dřevo a kov v našem salonu.", en: "Raw design, leather, patinated wood and metal in our salon." },
    sector: { cs: "SEKTOR_PROSTREDI_02", en: "SECTOR_ENVIRONMENT_02" },
    preview: "/obr/atmosfera/Prostředí/DZZ_2471.jpg"
  },
  strihy: {
    title: { cs: "Střihy", en: "Haircuts" },
    desc: { cs: "Precizní práce, ostré linie a moderní styling v praxi.", en: "Precision work, sharp lines and modern styling in action." },
    sector: { cs: "SEKTOR_STRIHY_03", en: "SECTOR_HAIRCUTS_03" },
    preview: "/obr/atmosfera/Střihy/Studio Session-692.jpg"
  },
  rodina: {
    title: { cs: "Zákazníci & Rodina", en: "Customers & Family" },
    desc: { cs: "Naši věrní hosté, tým specialistů, bratrské pouto a společné chvíle.", en: "Our loyal guests, team of specialists, brotherly bond and shared moments." },
    sector: { cs: "SEKTOR_SYNDIKAT_04", en: "SECTOR_SYNDICATE_04" },
    preview: "/obr/atmosfera/rodina/barber-96.jpg"
  }
};

const GALLERY_DATA_BY_CATEGORY: Record<Category, GalleryItem[]> = {
  atmosfera: [
    { src: "/obr/atmosfera/Atmosféra/barber-4.jpg", title: { cs: "OČEKÁVÁNÍ", en: "EXPECTATION" }, desc: { cs: "Záběr na detaily interiéru naší centrály v tlumených barvách.", en: "Shot of our HQ interior details in muted colors." } },
    { src: "/obr/atmosfera/Atmosféra/barber-7.jpg", title: { cs: "RODINNÁ TRADICE", en: "FAMILY TRADITION" }, desc: { cs: "Důvěrné posezení v křeslech, kde se probírají nejdůležitější obchody.", en: "Confidential seating in chairs where the most important deals are discussed." } },
    { src: "/obr/atmosfera/Atmosféra/barber-9.jpg", title: { cs: "STYL DONA", en: "THE DON'S STYLE" }, desc: { cs: "Klasické holičské doplňky a atmosféra staré školy.", en: "Classic barber accessories and old-school atmosphere." } },
    { src: "/obr/atmosfera/Atmosféra/barber-12.jpg", title: { cs: "PULZ STARÝCH ČASŮ", en: "PULSE OF OLD TIMES" }, desc: { cs: "Retro rádio s elektronkami, které u nás stále hraje ten správný rytmus.", en: "Vintage tube radio that still plays the right rhythm for us." } },
    { src: "/obr/atmosfera/Atmosféra/barber-25.jpg", title: { cs: "ESTETIKA SÍLY", en: "AESTHETICS OF POWER" }, desc: { cs: "Dramatický portrét postavy s doutníkem a náznakem autority.", en: "Dramatic portrait of a figure with a cigar and a hint of authority." } },
    { src: "/obr/atmosfera/Atmosféra/barber-43.jpg", title: { cs: "DÁMSKÁ SPOLEČNOST", en: "LADIES' COMPANY" }, desc: { cs: "Elegance a whiskey v černém provedení.", en: "Elegance and whiskey in black." } },
    { src: "/obr/atmosfera/Atmosféra/barber-1.jpg", title: { cs: "ČERNÝ PORTRET", en: "BLACK PORTRAIT" }, desc: { cs: "Černobílé vyjádření našeho mistrovského řemesla.", en: "Black and white expression of our master craft." } },
    { src: "/obr/atmosfera/Atmosféra/barber-3.jpg", title: { cs: "RANNÍ RITUÁL", en: "MORNING RITUAL" }, desc: { cs: "Když slunce teprve vychází a salon se připravuje na první misi.", en: "When the sun just rises and the salon prepares for the first mission." } },
    { src: "/obr/atmosfera/Atmosféra/barber-5.jpg", title: { cs: "ZLATÝ ŘEZ", en: "GOLDEN RATIO" }, desc: { cs: "Detaily, které dělají celkový dojem dokonalým.", en: "Details that make the overall impression perfect." } },
    { src: "/obr/atmosfera/Atmosféra/barber-6.jpg", title: { cs: "KLASICKÁ BŘITVA", en: "CLASSIC RAZOR" }, desc: { cs: "Nástroj s historií a respektem pro tradiční holení.", en: "A tool with history and respect for traditional shaving." } },
    { src: "/obr/atmosfera/Atmosféra/barber-8.jpg", title: { cs: "ODRAZ TRADICE", en: "REFLECTION OF TRADITION" }, desc: { cs: "Pohled do zrcadla odhalující pravou tvář gentlemana.", en: "A look in the mirror revealing a true gentleman's face." } },
    { src: "/obr/atmosfera/Atmosféra/barber-10.jpg", title: { cs: "KOUŘOVÁ CLONA", en: "SMOKE SCREEN" }, desc: { cs: "Atmosféra plná tajuplnosti a relaxace s doutníkem.", en: "Atmospheric mystery and relaxation with a cigar." } },
    { src: "/obr/atmosfera/Atmosféra/barber-13.jpg", title: { cs: "ODHODLÁNÍ", en: "DETERMINATION" }, desc: { cs: "Každý střih vyžaduje stoprocentní soustředění a jistou ruku.", en: "Every cut requires 100% focus and a steady hand." } },
    { src: "/obr/atmosfera/Atmosféra/barber-14.jpg", title: { cs: "PÁNSKÝ KLUB", en: "GENTLEMEN'S CLUB" }, desc: { cs: "Místo, kde čas plyne podle našich vlastních pravidel.", en: "A place where time flows according to our own rules." } },
    { src: "/obr/atmosfera/Atmosféra/barber-18.jpg", title: { cs: "KÁVA A WHISKEY", en: "COFFEE & WHISKEY" }, desc: { cs: "Nezbytné doplňky pro chvíle pohody před servisem.", en: "Essential accessories for moments of comfort before service." } },
    { src: "/obr/atmosfera/Atmosféra/barber-26.jpg", title: { cs: "STÍN OSOBNOSTI", en: "SHADOW OF PERSONALITY" }, desc: { cs: "Portrét, který vypráví příběh bez jediného slova.", en: "A portrait that tells a story without a single word." } },
    { src: "/obr/atmosfera/Atmosféra/barber-27.jpg", title: { cs: "PRECIZNÍ VÝBĚR", en: "PRECISE SELECTION" }, desc: { cs: "Používáme výhradně prémiové produkty pro nejlepší péči.", en: "We use exclusively premium products for the best care." } },
    { src: "/obr/atmosfera/Atmosféra/barber-29.jpg", title: { cs: "DOTEK LUXUSU", en: "TOUCH OF LUXURY" }, desc: { cs: "Horký ručník a vůně kolínské uzavírá dokonalý zážitek.", en: "A hot towel and the scent of cologne closes the perfect experience." } },
    { src: "/obr/atmosfera/Atmosféra/barber-31.jpg", title: { cs: "TEMNÁ NOC", en: "DARK NIGHT" }, desc: { cs: "Ulice Hradiště spí, ale naše základna stále svítí.", en: "The streets of Hradiště sleep, but our base still shines." } },
    { src: "/obr/atmosfera/Atmosféra/barber-32.jpg", title: { cs: "PRVNÍ TŘÍDA", en: "FIRST CLASS" }, desc: { cs: "Každý detail je promyšlen tak, aby vás vytrhl z reality.", en: "Every detail is designed to take you out of reality." } },
    { src: "/obr/atmosfera/Atmosféra/barber-33.jpg", title: { cs: "BRATRSKÉ POUTO", en: "BROTHERLY BOND" }, desc: { cs: "Zde nejste jen zákazníkem, stáváte se součástí rodiny.", en: "Here you are not just a customer, you become part of the family." } },
    { src: "/obr/atmosfera/Atmosféra/barber-35.jpg", title: { cs: "OSTŘÍ & STYL", en: "EDGE & STYLE" }, desc: { cs: "Kvalitní ocel a dlouholeté zkušenosti zaručují dokonalost.", en: "Quality steel and years of experience guarantee perfection." } },
    { src: "/obr/atmosfera/Atmosféra/barber-36.jpg", title: { cs: "KONTRAST", en: "CONTRAST" }, desc: { cs: "Hra světel a stínů v naší noir atmosféře.", en: "Play of lights and shadows in our noir atmosphere." } },
    { src: "/obr/atmosfera/Atmosféra/barber-38.jpg", title: { cs: "REPRODUKTOR", en: "VINTAGE AUDIO" }, desc: { cs: "Hudba dotváří celkový dojem ze staré dobré éry.", en: "Music completes the overall impression of the good old era." } },
    { src: "/obr/atmosfera/Atmosféra/barber-39.jpg", title: { cs: "MISTROVSTVÍ", en: "MASTERY" }, desc: { cs: "Ruce, které vědí přesně, co dělají při každém tahu.", en: "Hands that know exactly what they are doing with every stroke." } },
    { src: "/obr/atmosfera/Atmosféra/barber-41.jpg", title: { cs: "VIP KOUTEK", en: "VIP CORNER" }, desc: { cs: "Vyhrazené místo pro ty, kteří vyžadují absolutní diskrétnost.", en: "Reserved space for those who demand absolute discretion." } },
    { src: "/obr/atmosfera/Atmosféra/barber-45.jpg", title: { cs: "TRADIČNÍ POSTUP", en: "TRADITIONAL PROCESS" }, desc: { cs: "Metody holení předávané z generace na generaci.", en: "Shaving methods passed down from generation to generation." } },
    { src: "/obr/atmosfera/Atmosféra/barber-49.jpg", title: { cs: "LEGENDA", en: "THE LEGEND" }, desc: { cs: "Styl, který nikdy nestárne a stále budí respekt.", en: "A style that never grows old and still commands respect." } },
    { src: "/obr/atmosfera/Atmosféra/barber-63.jpg", title: { cs: "DETAILY KŘESLA", en: "CHAIR DETAILS" }, desc: { cs: "Pohodlí a historie spojené v jednom kusu nábytku.", en: "Comfort and history combined in one piece of furniture." } },
    { src: "/obr/atmosfera/Atmosféra/barber-79.jpg", title: { cs: "VŮNĚ KŮŽE", en: "SCENT OF LEATHER" }, desc: { cs: "Kožené doplňky dodávají prostoru ten správný charakter.", en: "Leather accessories give the space its proper character." } },
    { src: "/obr/atmosfera/Atmosféra/barber-94.jpg", title: { cs: "POSLEDNÍ DOTYK", en: "FINAL TOUCH" }, desc: { cs: "Stylingový vosk dodá účesu pevnost a lesk na celý den.", en: "Styling wax gives the haircut hold and shine all day." } }
  ],
  prostredi: [
    { src: "/obr/atmosfera/Prostředí/DZZ_2471.jpg", title: { cs: "ŽELEZNÝ TRŮN", en: "THE IRON THRONE" }, desc: { cs: "Naše ikonické křeslo, kde se tvoří nová vizáž hostů.", en: "Our iconic chair where guests' new look is created." } },
    { src: "/obr/atmosfera/Prostředí/DZZ_2475.jpg", title: { cs: "SVĚTLO A STÍN", en: "LIGHT AND SHADOW" }, desc: { cs: "Atmosférické osvětlení dává vyniknout surovosti našeho prostředí.", en: "Atmospheric lighting brings out the rawness of our environment." } },
    { src: "/obr/atmosfera/Prostředí/DZZ_2480.jpg", title: { cs: "VIBE CENTRÁLY", en: "HQ VIBE" }, desc: { cs: "Široký pohled na interiér salonu připravený pro novou misi.", en: "Wide view of the salon interior ready for a new mission." } },
    { src: "/obr/atmosfera/Prostředí/DZZ_2486.jpg", title: { cs: "OPUŠTĚNÝ POST", en: "ABANDONED POST" }, desc: { cs: "Holičské křeslo čekající na svou další oběť... tedy klienta.", en: "A barber chair waiting for its next victim... I mean client." } },
    { src: "/obr/atmosfera/Prostředí/DZZ_2472.jpg", title: { cs: "DETAIL KŘESLA II", en: "CHAIR DETAIL II" }, desc: { cs: "Kvalitní zpracování a patina, která vypráví příběhy.", en: "Quality workmanship and patina that tells stories." } },
    { src: "/obr/atmosfera/Prostředí/D78_9241.jpg", title: { cs: "SUROVÁ TEXTURA", en: "RAW TEXTURE" }, desc: { cs: "Kov a patinované dřevo tvoří industriální atmosféru.", en: "Metal and patinated wood form the industrial atmosphere." } },
    { src: "/obr/atmosfera/Prostředí/D78_9246.jpg", title: { cs: "PERSPEKTIVA CENTRÁLY", en: "HQ PERSPECTIVE" }, desc: { cs: "Pohled z rohu na uspořádání pracovních stolů.", en: "A view from the corner showing the layout of workspaces." } },
    { src: "/obr/atmosfera/Prostředí/D78_9279.jpg", title: { cs: "BARBER STANICE", en: "BARBER STATION" }, desc: { cs: "Místo činu. Zde probíhají veškeré přeměny.", en: "The crime scene. This is where all transformations occur." } },
    { src: "/obr/atmosfera/Prostředí/DZZ_2682.jpg", title: { cs: "OSVĚTLENÍ", en: "THE LIGHTING" }, desc: { cs: "Zářivky a lampy navržené pro přesnou práci a intimní tón.", en: "Fluorescent lights and lamps designed for precision work and intimate tone." } },
    { src: "/obr/atmosfera/Prostředí/DZZ_2757.jpg", title: { cs: "HOLIČSKÉ POLICE", en: "BARBER SHELVES" }, desc: { cs: "Všechny naše nástroje a kosmetika jsou vždy na svém místě.", en: "All our tools and cosmetics are always in their place." } },
    { src: "/obr/atmosfera/Prostředí/DZZ_2763.jpg", title: { cs: "HISTORIE NA ZDI", en: "HISTORY ON THE WALL" }, desc: { cs: "Fotografie a plakáty připomínající zlatou éru holičství.", en: "Photos and posters reminding of the golden era of barbering." } },
    { src: "/obr/atmosfera/Prostředí/DZZ_2834.jpg", title: { cs: "PŘEDNÍ POHLED", en: "FRONT VIEW" }, desc: { cs: "Vstupte a nechte starosti všedního dne za dveřmi.", en: "Step in and leave your daily worries behind." } },
    { src: "/obr/atmosfera/Prostředí/barber-107.jpg", title: { cs: "ODRAZ SVĚTLA", en: "LIGHT REFLECTION" }, desc: { cs: "Hra světla na nerezových detailech našich křesel.", en: "Play of light on the stainless steel details of our chairs." } },
    { src: "/obr/atmosfera/Prostředí/barber-108.jpg", title: { cs: "ARCHITEKTURA PROSTORU", en: "SPACE ARCHITECTURE" }, desc: { cs: "Geometrické linie a uspořádání interiéru.", en: "Geometric lines and layout of the interior." } },
    { src: "/obr/atmosfera/Prostředí/barber-109.jpg", title: { cs: "PŘIPRAVENÝ SALON", en: "SALON READY" }, desc: { cs: "Každá stanice je dezinfikována a nachystána pro hosta.", en: "Every station is sanitized and prepared for the guest." } }
  ],
  strihy: [
    { src: "/obr/atmosfera/Střihy/Studio Session-692.jpg", title: { cs: "KLASICKÝ FADE", en: "CLASSIC FADE" }, desc: { cs: "Dokonalý přechod zkracující boky s geometrickou přesností.", en: "Perfect transition fading the sides with geometric precision." } },
    { src: "/obr/atmosfera/Střihy/Studio Session-695.jpg", title: { cs: "MODERNÍ TEXTURA", en: "MODERN TEXTURE" }, desc: { cs: "Střih s výraznou texturou navrchu a čistými konturami.", en: "Cut with distinctive texture on top and clean contours." } }
  ],
  rodina: [
    { src: "/obr/atmosfera/rodina/barber-96.jpg", title: { cs: "SPOLEČNÝ SYNDIKÁT", en: "THE SYNDICATE" }, desc: { cs: "Tým barberů, kteří drží pohromadě za každé situace.", en: "The team of barbers who stick together in every situation." } },
    { src: "/obr/atmosfera/rodina/barber-97.jpg", title: { cs: "BRATŘI V ŘEMESLU", en: "BROTHERS IN CRAFT" }, desc: { cs: "Sdílíme vášeň pro detail a věrnost tradičním postupům.", en: "We share a passion for detail and loyalty to traditional processes." } },
    { src: "/obr/atmosfera/rodina/barber-98.jpg", title: { cs: "ČAS NA ROZHOVOR", en: "TIME TO TALK" }, desc: { cs: "Chvíle odpočinku mezi střihy u dobrého nápoje.", en: "A moment of rest between cuts with a good drink." } },
    { src: "/obr/atmosfera/rodina/barber-99.jpg", title: { cs: "POSLEDNÍ ÚPRAVY", en: "FINAL TOUCHES" }, desc: { cs: "Soustředěný pohled na detail břitvy a hřebene v akci.", en: "Focused look at the razor and comb detail in action." } },
    { src: "/obr/atmosfera/rodina/barber-100.jpg", title: { cs: "MISTR & UČEŇ", en: "MASTER & APPRENTICE" }, desc: { cs: "Předávání zkušeností a udržování kvality naší značky.", en: "Passing down experiences and maintaining the quality of our brand." } },
    { src: "/obr/atmosfera/rodina/barber-101.jpg", title: { cs: "ZA SCÉNOU", en: "BEHIND THE SCENES" }, desc: { cs: "Uvolněná atmosféra naší rodiny, když se nikdo nedívá.", en: "The relaxed atmosphere of our family when nobody is watching." } },
    { src: "/obr/atmosfera/rodina/barber-102.jpg", title: { cs: "TÝMOVÁ PORADA", en: "TEAM MEETING" }, desc: { cs: "Plánování nových projektů a vylepšení služeb pro vás.", en: "Planning new projects and service improvements for you." } },
    { src: "/obr/atmosfera/rodina/barber-103.jpg", title: { cs: "SPOLEČNÝ CÍL", en: "COMMON GOAL" }, desc: { cs: "Každý den děláme maximum, abyste odcházeli stoprocentně spokojeni.", en: "Every day we do our best to make you leave 100% satisfied." } }
  ]
};

// Component for random bullet holes in atmosphere - ENHANCED VISIBILITY
const BulletHoles = () => {
  const [holes, setHoles] = useState<{ id: number, x: number, y: number, scale: number, rotation: number }[]>([]);

  useEffect(() => {
    // Lead with a couple of holes immediately
    const initialHoles = Array.from({ length: 2 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360
    }));
    setHoles(initialHoles);

    const interval = setInterval(() => {
      const newHole = {
        id: Date.now(),
        x: Math.random() * 85 + 7,
        y: Math.random() * 85 + 7,
        scale: Math.random() * 0.6 + 0.4,
        rotation: Math.random() * 360
      };
      setHoles(prev => [...prev.slice(-6), newHole]);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[6000] overflow-hidden hidden md:block">
      <AnimatePresence>
        {holes.map((hole) => (
          <motion.div
            key={hole.id}
            initial={{ opacity: 0, scale: 3 }}
            animate={{ opacity: 0.7, scale: hole.scale }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            className="absolute w-10 h-10"
            style={{ left: `${hole.x}%`, top: `${hole.y}%`, rotate: `${hole.rotation}deg` }}
          >
             {/* The Bullet Hole - ULTRA REALISTIC GOLD */}
             <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1a1100] via-black to-[#2d1e00] border-[3px] border-mafia-gold shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.4),inset_0_0_15px_rgba(0,0,0,1)] relative overflow-hidden">
                {/* Metallic shine reflection */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 -skew-y-12"></div>
             </div>
             
             {/* Irregular glass shards / splinters - GOLDEN TINT */}
             {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <div 
                 key={i}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-px bg-gradient-to-r from-transparent via-mafia-gold/30 to-transparent"
                 style={{ rotate: `${angle + (i * 10)}deg`, scale: i % 2 === 0 ? 1.5 : 1 }}
                ></div>
             ))}

             {/* Smaller, sharper cracks */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-px bg-mafia-gold/50 rotate-[30deg]"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-px bg-mafia-gold/50 rotate-[120deg]"></div>
             
             {/* Intense Golden Impact Flash */}
             <motion.div 
               initial={{ opacity: 1, scale: 0 }}
               animate={{ opacity: 0, scale: 4 }}
               transition={{ duration: 0.6 }}
               className="absolute inset-x-[-20px] inset-y-[-20px] bg-mafia-gold rounded-full blur-xl mix-blend-screen"
             />

             {/* Burn mark / singe edge */}
             <div className="absolute inset-[-4px] border border-mafia-gold/20 rounded-full blur-sm"></div>
             
             {/* Debris / Burning bits */}
             <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
             >
                {[1,2,3,4].map(p => (
                   <motion.div 
                    key={p}
                    initial={{ x: 0, y: 0 }}
                    animate={{ x: (p % 2 === 0 ? 30 : -30), y: 50, opacity: 0 }}
                    transition={{ duration: 1 + (p * 0.1) }}
                    className="absolute top-1/2 left-1/2 w-1 h-1 bg-mafia-gold rounded-full"
                   />
                ))}
             </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Interactive Before/After Image Comparison Slider (inspired by World of Tanks map changes)
const ImageComparisonSlider = ({ image1, image2, lang }: { image1: GalleryItem; image2: GalleryItem; lang: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
        playSound("/sounds/click.mp3", 0.08);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        if (e.touches.length > 0) {
          handleMove(e.touches[0].clientX);
        }
        playSound("/sounds/click.mp3", 0.08);
      }}
      className="relative w-full aspect-[16/10] md:aspect-[16/9] border-2 border-mafia-gold/20 hover:border-mafia-gold/50 transition-colors duration-500 bg-[#0a0a0a] overflow-hidden select-none cursor-ew-resize group shadow-[0_30px_80px_rgba(0,0,0,0.9)] rounded-none"
    >
      {/* Background/Right Image (Image 2) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <NextImage 
          src={image2.src}
          alt={image2.title[lang as 'cs' | 'en']}
          fill
          priority
          quality={95}
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover contrast-[1.1] transition-all duration-300"
        />
      </div>

      {/* Foreground/Left Image (Image 1) */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <NextImage 
          src={image1.src}
          alt={image1.title[lang as 'cs' | 'en']}
          fill
          priority
          quality={95}
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover contrast-[1.1]"
        />
      </div>

      {/* Vertical divider line */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-mafia-gold z-30 pointer-events-none shadow-[0_0_15px_rgba(212,175,55,0.7)]"
        style={{ left: `${sliderPosition}%` }}
      />

      {/* Drag handle button */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black border-2 border-mafia-gold flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8),0_0_15px_rgba(var(--color-mafia-gold-rgb),0.4)] pointer-events-none group-hover:scale-110 active:scale-95 transition-transform duration-300"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="flex items-center gap-1 text-mafia-gold">
          <ChevronLeft size={16} className="animate-pulse" />
          <div className="w-[1px] h-4 bg-mafia-gold/40" />
          <ChevronRight size={16} className="animate-pulse" />
        </div>
      </div>

      {/* Tactical HUD Corner Elements */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-mafia-gold/40 pointer-events-none z-30"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-mafia-gold/40 pointer-events-none z-30"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-mafia-gold/40 pointer-events-none z-30"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-mafia-gold/40 pointer-events-none z-30"></div>

      {/* Top HUD Info */}
      <div className="absolute top-3 left-4 z-30 font-mono text-[9px] text-mafia-gold/60 uppercase tracking-widest pointer-events-none">
        [ SEKTOR // COMPARE_NOIR_03 ]
      </div>
      <div className="absolute top-3 right-4 z-30 font-mono text-[9px] text-mafia-gold/60 uppercase tracking-widest pointer-events-none hidden sm:block">
        [ DRAG POSITION: {sliderPosition.toFixed(0)}% ]
      </div>

      {/* Bottom HUD Labels (Before / After equivalents) */}
      <div className="absolute bottom-3 left-4 z-30 font-mono text-[10px] text-white bg-black/60 px-2 py-1 border border-white/10 uppercase tracking-wider pointer-events-none transition-opacity duration-300" style={{ opacity: sliderPosition < 15 ? 0 : 1 }}>
        {image1.title[lang as 'cs' | 'en']}
      </div>
      <div className="absolute bottom-3 right-4 z-30 font-mono text-[10px] text-white bg-black/60 px-2 py-1 border border-white/10 uppercase tracking-wider pointer-events-none transition-opacity duration-300" style={{ opacity: sliderPosition > 85 ? 0 : 1 }}>
        {image2.title[lang as 'cs' | 'en']}
      </div>

      {/* Scan Sweeper (for interactive indicator) */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-mafia-gold/20 to-transparent top-0 pointer-events-none z-20 animate-[scanSweep_6s_linear_infinite]" />
    </div>
  );
};

interface RetroProjectorSlideshowProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  lang: string;
}

const RetroProjectorSlideshow = ({ isOpen, onClose, items, lang }: RetroProjectorSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and manage projector audio loop
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/projector.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Control audio playback based on playing state & modal visibility
  useEffect(() => {
    if (!audioRef.current) return;
    if (isOpen && isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isOpen, isPlaying]);

  // Slideshow advance timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, items.length]);

  const handleNext = () => {
    playSound("/sounds/click.mp3", 0.08);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    playSound("/sounds/click.mp3", 0.08);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const togglePlay = () => {
    playSound("/sounds/click.mp3", 0.1);
    setIsPlaying(!isPlaying);
  };

  if (!isOpen || items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[6000] bg-black/95 select-none flex flex-col items-center justify-center overflow-hidden"
      >
        {/* CSS styles for film reel effects (grain, scratches, flicker, moving sprocket reel) */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes filmFlicker {
            0% { opacity: 0.96; }
            20% { opacity: 1; }
            40% { opacity: 0.98; }
            60% { opacity: 0.95; }
            80% { opacity: 1; }
            100% { opacity: 0.97; }
          }
          @keyframes verticalScratch {
            0% { transform: translateX(-10%); opacity: 0.1; }
            10% { transform: translateX(20%); opacity: 0.4; }
            20% { transform: translateX(5%); opacity: 0.2; }
            30% { transform: translateX(-30%); opacity: 0; }
            40% { transform: translateX(15%); opacity: 0.3; }
            50% { transform: translateX(-5%); opacity: 0.1; }
            60% { transform: translateX(35%); opacity: 0.5; }
            70% { transform: translateX(-20%); opacity: 0.2; }
            80% { transform: translateX(10%); opacity: 0; }
            90% { transform: translateX(-15%); opacity: 0.4; }
            100% { transform: translateX(0%); opacity: 0.1; }
          }
          .film-flicker {
            animation: filmFlicker 0.15s infinite;
          }
          .film-scratch {
            animation: verticalScratch 0.8s steps(4) infinite;
          }
        ` }} />

        {/* Projector flickering light cone in background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_75%)] pointer-events-none film-flicker" />

        {/* Dust and Scratches Overlays */}
        <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-15 overflow-hidden">
          {/* Vertical scratching line */}
          <div className="absolute top-0 bottom-0 w-[1px] bg-white/40 left-1/3 film-scratch" />
          <div className="absolute top-0 bottom-0 w-[1px] bg-white/30 left-2/3 film-scratch" style={{ animationDelay: '0.3s' }} />
          {/* Film Grain Texture SVG */}
          <div 
            className="absolute inset-0 opacity-[0.18] mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"filmNoise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23filmNoise)\"/%3E%3C/svg%3E')" }}
          />
        </div>

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)] bg-gradient-to-t from-black via-transparent to-black/80" />

        {/* Header HUD panel */}
        <div className="absolute top-8 left-8 right-8 z-50 flex justify-between items-center text-mono">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-mafia-gold/60 tracking-[0.3em] font-mono uppercase">
              {lang === 'cs' ? '[ PROJEKCE KOTOUČE ]' : '[ REEL PROJECTION ]'}
            </span>
            <span className="text-[8px] text-white/40 tracking-widest font-mono uppercase">
              {isPlaying ? (lang === 'cs' ? 'STATUS: PŘEHRÁVÁNÍ' : 'STATUS: PLAYING') : (lang === 'cs' ? 'STATUS: POZASTAVENO' : 'STATUS: PAUSED')}
            </span>
          </div>
          
          <button 
            onClick={onClose}
            className="group relative flex items-center justify-center w-12 h-12 bg-black/60 border border-white/10 text-white hover:border-mafia-gold transition-all duration-300 rounded-full"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-500 text-white" />
          </button>
        </div>

        {/* MAIN CINEMATIC FILM REEL SCREEN */}
        <div className="relative w-full max-w-5xl px-12 md:px-20 z-30 flex items-center justify-center">
          
          {/* Film Strip Left Border */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-[#121212] border-r-2 border-white/10 flex flex-col justify-around py-4 overflow-hidden select-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={`left-perf-${i}`} className="w-4 h-6 bg-black border border-white/10 rounded-sm mx-auto" />
            ))}
          </div>

          {/* Film Strip Right Border */}
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-[#121212] border-l-2 border-white/10 flex flex-col justify-around py-4 overflow-hidden select-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={`right-perf-${i}`} className="w-4 h-6 bg-black border border-white/10 rounded-sm mx-auto" />
            ))}
          </div>

          {/* Shutter / Frame screen wrapper */}
          <div className="relative w-full aspect-[16/10] md:aspect-video bg-black border-y-8 border-mafia-dark/80 outline outline-2 outline-white/5 overflow-hidden flex items-center justify-center shadow-[0_0_100px_rgba(0,0,0,0.9)]">
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.98, filter: "brightness(2) contrast(1.5) sepia(0.8) grayscale(0.5) blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "brightness(1) contrast(1.1) sepia(0.3) grayscale(0.2) blur(0px)" }}
                exit={{ opacity: 0, scale: 1.02, filter: "brightness(2) contrast(1.5) sepia(0.8) grayscale(0.5) blur(4px)" }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                <NextImage 
                  src={items[currentIndex].src}
                  alt={items[currentIndex].title[lang as 'cs' | 'en']}
                  fill
                  priority
                  quality={95}
                  sizes="(max-width: 1200px) 100vw, 1920px"
                  className="object-cover film-flicker"
                />
              </motion.div>
            </AnimatePresence>

            {/* Celluloid Frame Line Overlay */}
            <div className="absolute inset-0 pointer-events-none border-x-4 border-black/40" />
            
            {/* Overlay Frame text */}
            <div className="absolute bottom-4 left-4 z-40 bg-black/60 px-3 py-1.5 border border-white/10 text-white font-mono text-[10px] tracking-wider uppercase">
              {items[currentIndex].title[lang as 'cs' | 'en']}
            </div>
            
            <div className="absolute bottom-4 right-4 z-40 bg-black/60 px-3 py-1.5 border border-white/10 text-mafia-gold font-mono text-[10px] tracking-widest">
              FRAME // {String(currentIndex + 1).padStart(2, '0')}/{String(items.length).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* BOTTOM VINTAGE CONTROLS */}
        <div className="absolute bottom-8 z-40 flex items-center gap-6 bg-black/60 px-8 py-4 border border-white/10 backdrop-blur-md">
          <button 
            onClick={handlePrev}
            className="p-3 text-white hover:text-mafia-gold transition-colors duration-300"
          >
            <ChevronLeft size={24} />
          </button>

          <button 
            onClick={togglePlay}
            className="flex items-center gap-2 bg-mafia-gold hover:bg-white text-mafia-black font-heading font-black text-xs px-6 py-3 tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause size={14} className="text-mafia-black" /> : <Play size={14} className="text-mafia-black" />}
            {isPlaying ? (lang === 'cs' ? 'POZASTAVIT' : 'PAUSE') : (lang === 'cs' ? 'SPUSTIT' : 'PLAY')}
          </button>

          <button 
            onClick={handleNext}
            className="p-3 text-white hover:text-mafia-gold transition-colors duration-300"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function GaleriePage() {
  const { lang } = useTranslation();
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [slideshowOpen, setSlideshowOpen] = useState(false);

  // Initialize selected category from URL param if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("cat");
      if (cat && CATEGORY_KEYS.includes(cat as Category)) {
        setCurrentCategory(cat as Category);
      }
    }
  }, []);

  const selectCategory = (cat: Category | null) => {
    setCurrentCategory(cat);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (cat) {
        url.searchParams.set("cat", cat);
      } else {
        url.searchParams.delete("cat");
      }
      window.history.pushState({}, "", url.toString());
    }
  };

  const activeGalleryData = currentCategory ? GALLERY_DATA_BY_CATEGORY[currentCategory] : [];

  const openImage = (index: number) => setSelectedIndex(index);
  const closeImage = () => setSelectedIndex(null);

  const nextImage = useCallback(() => {
    if (selectedIndex === null || !currentCategory) return;
    const data = GALLERY_DATA_BY_CATEGORY[currentCategory];
    setSelectedIndex((prev) => (prev! + 1) % data.length);
  }, [selectedIndex, currentCategory]);

  const prevImage = useCallback(() => {
    if (selectedIndex === null || !currentCategory) return;
    const data = GALLERY_DATA_BY_CATEGORY[currentCategory];
    setSelectedIndex((prev) => (prev! - 1 + data.length) % data.length);
  }, [selectedIndex, currentCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, nextImage, prevImage]);

  return (
    <main className="min-h-screen relative text-white overflow-x-hidden font-sans bg-[#0c0c0c]">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanSweep {
          0% { top: -5%; }
          100% { top: 105%; }
        }
      `}} />
      
      {/* Background Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-mafia-dark to-[#1a0505] opacity-100"></div>
         <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>
         <motion.div 
            animate={{ x: [-20, 20, -20], opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] blur-3xl"
         ></motion.div>
         <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,1)]"></div>
      </div>

      <section className="relative pt-24 pb-8 px-6 flex flex-col items-center justify-center text-center overflow-hidden z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative"
        >
          <Camera className="text-mafia-gold mb-4 mx-auto animate-pulse" size={44} />
          
          <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-heading font-black text-white uppercase tracking-[0.2em] mb-2 drop-shadow-[0_20px_60px_rgba(0,0,0,1)] leading-none">
            {lang === 'cs' ? 'GALERIE' : 'GALLERY'}
          </h1>

          {currentCategory && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mt-4"
            >
              <span className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-[0.4em]">
                [ {lang === 'cs' ? 'SEKTOR' : 'SECTOR'} // {CATEGORY_INFO[currentCategory].title[lang as 'cs' | 'en'].toUpperCase()} ]
              </span>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Main Content Area */}
      <div className="relative z-20 pb-32">
        <AnimatePresence mode="wait">
          {!currentCategory ? (
            /* ========================================================
               GTA HUD STYLE ROUTER (ROZCESTNÍK)
               ======================================================== */
            <motion.div 
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-6xl mx-auto px-6 mt-8">
                {CATEGORY_KEYS.map((catKey, index) => {
                  const cat = CATEGORY_INFO[catKey];
                  const itemIndex = String(index + 1).padStart(2, '0');
                  return (
                    <motion.div
                      key={catKey}
                      initial={{ opacity: 0, y: 35 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: index * 0.15 }}
                      whileHover={{ scale: 1.02 }}
                      onMouseEnter={() => playSound("/sounds/hover.mp3", 0.15)}
                      onClick={() => selectCategory(catKey)}
                      className="group relative cursor-pointer bg-[#0a0a0a]/90 border-2 border-mafia-gold/20 p-6 md:p-8 flex flex-col justify-between aspect-[16/10] overflow-hidden rounded-none transition-all duration-500 hover:border-mafia-gold/70 hover:shadow-[0_0_40px_rgba(var(--color-mafia-gold-rgb),0.3)] shadow-2xl"
                    >
                      {/* Preview Background Image */}
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={cat.preview}
                          alt={cat.title[lang as 'cs' | 'en']}
                          fill
                          sizes="(max-width: 768px) 100vw, 600px"
                          className="object-cover opacity-20 filter grayscale brightness-[0.3] transition-all duration-[1200ms] group-hover:opacity-60 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                      </div>

                      {/* Scanner Line Sweep */}
                      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-mafia-gold/40 to-transparent top-0 opacity-0 group-hover:opacity-100 animate-[scanSweep_3.5s_linear_infinite] pointer-events-none z-10" />

                      {/* HUD tactical corners */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-mafia-gold/40 group-hover:border-mafia-gold transition-colors duration-300 pointer-events-none"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-mafia-gold/40 group-hover:border-mafia-gold transition-colors duration-300 pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-mafia-gold/40 group-hover:border-mafia-gold transition-colors duration-300 pointer-events-none"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-mafia-gold/40 group-hover:border-mafia-gold transition-colors duration-300 pointer-events-none"></div>

                      {/* Top Info */}
                      <div className="flex justify-between items-start z-10 w-full">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-widest">[ {cat.sector[lang as 'cs' | 'en']} ]</span>
                          <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest mt-1">
                            {lang === 'cs' ? 'STAV: DOSTUPNÝ' : 'STATUS: ACCESSIBLE'}
                          </span>
                        </div>
                        <span className="font-heading font-black text-4xl text-mafia-gold/15 group-hover:text-mafia-gold/40 transition-colors duration-500 italic">
                          {itemIndex}
                        </span>
                      </div>

                      {/* Bottom Info */}
                      <div className="flex flex-col mt-auto z-10">
                        <h3 className="text-white font-heading font-black text-3xl md:text-4xl uppercase tracking-tighter italic leading-none group-hover:text-glow transition-all duration-300">
                          {cat.title[lang as 'cs' | 'en']}
                        </h3>
                        <p className="text-[10px] md:text-[11px] font-mono text-smoke-white/60 group-hover:text-smoke-white/90 uppercase tracking-widest leading-relaxed mt-3 border-l-2 border-mafia-gold/30 pl-3">
                          {cat.desc[lang as 'cs' | 'en']}
                        </p>

                        <div className="flex items-center gap-2 mt-4 text-[9px] font-mono text-mafia-gold uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Eye size={10} className="animate-pulse" />
                          <span>{lang === 'cs' ? '[ OTEVŘÍT SEKTOR ]' : '[ OPEN SECTOR ]'}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Main Back Button */}
              <div className="flex flex-col items-center gap-10 mt-16 md:mt-24">
                <Link 
                    href="/#services"
                    className="group relative inline-flex items-center gap-6 bg-mafia-gold px-12 py-5 transition-all duration-700 hover:bg-white hover:scale-105 shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_20px_rgba(var(--color-mafia-gold-rgb),0.3)] active:scale-95"
                >
                    <ArrowLeft size={24} className="text-mafia-black group-hover:-translate-x-2 transition-transform" />
                    <span className="text-mafia-black font-heading font-black text-xl uppercase tracking-[0.4em]">
                      {lang === 'cs' ? 'ZPĚT NA ÚVODNÍ STRANU' : 'BACK TO HOME PAGE'}
                    </span>
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ========================================================
               ACTIVE GALLERY VIEWER (SAME BEAUTIFUL LAYOUT)
               ======================================================== */
            <motion.div 
              key="gallery-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center"
            >
              {/* Back and Slideshow Buttons */}
              <div className="flex flex-wrap justify-center gap-4 w-full px-6 mb-8 mt-2">
                <button
                  onClick={() => {
                    playSound("/sounds/click.mp3", 0.2);
                    selectCategory(null);
                  }}
                  className="group relative inline-flex items-center gap-4 bg-transparent border-2 border-mafia-gold/30 hover:border-mafia-gold text-mafia-gold px-8 py-4 transition-all duration-500 hover:scale-105 active:scale-95 shadow-lg"
                >
                  <LayoutGrid size={18} className="text-mafia-gold group-hover:rotate-45 transition-transform duration-500" />
                  <span className="font-heading font-black text-sm uppercase tracking-[0.3em] text-white">
                    {lang === 'cs' ? 'ZPĚT DO VOLBY SEKTORŮ' : 'BACK TO SECTOR SELECT'}
                  </span>
                </button>

                {currentCategory !== "strihy" && (
                  <button
                    onClick={() => {
                      playSound("/sounds/click.mp3", 0.2);
                      setSlideshowOpen(true);
                    }}
                    className="group relative inline-flex items-center gap-4 bg-mafia-gold hover:bg-white text-mafia-black px-8 py-4 transition-all duration-500 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <Play size={18} className="text-mafia-black group-hover:scale-125 transition-transform duration-500" />
                    <span className="font-heading font-black text-sm uppercase tracking-[0.3em] text-mafia-black">
                      {lang === 'cs' ? 'SPUSTIT PREZENTACI' : 'START SLIDESHOW'}
                    </span>
                  </button>
                )}
              </div>

              {/* Gallery Grid or Comparison Slider for Haircuts */}
              {currentCategory === "strihy" ? (
                <div className="w-full max-w-5xl mx-auto px-6 py-8 pb-20">
                  <ImageComparisonSlider 
                    image1={activeGalleryData[0]}
                    image2={activeGalleryData[1]}
                    lang={lang}
                  />
                  <div className="mt-12 text-center max-w-2xl mx-auto">
                    <h3 className="text-mafia-gold font-heading font-black text-3xl md:text-5xl uppercase tracking-tighter mb-4">
                      {lang === 'cs' ? 'DRAMATICKÁ PROMĚNA' : 'DRAMATIC TRANSFORMATION'}
                    </h3>
                    <p className="text-white/40 text-sm md:text-lg italic leading-relaxed">
                      {lang === 'cs' 
                        ? 'Chyťte posuvník uprostřed a tahem do stran porovnejte preciznost klasického fade a moderní texturované úpravy.'
                        : 'Grab the slider in the middle and drag side to side to compare the precision of a classic fade and a modern textured cut.'}
                    </p>
                  </div>
                </div>
              ) : (
                <section id="gallery-grid" className="relative pb-16 pt-8 px-4 md:px-12 max-w-[1800px] w-full mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                    {activeGalleryData.map((img, index) => (
                      <motion.div
                        key={img.src}
                        initial={{ opacity: 0, y: 50, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: (index % 2) * 0.15 }}
                        className="flex flex-col group cursor-pointer"
                        onClick={() => openImage(index)}
                      >
                        <div className="relative p-2.5 bg-white/5 border border-white/10 transition-all duration-700 group-hover:border-mafia-gold/50 group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,1)]">
                          <div className="relative aspect-[16/9] overflow-hidden border-2 border-black">
                             <Image 
                              src={img.src}
                              alt={img.title[lang as 'cs' | 'en']}
                              width={1200}
                              height={800}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                              className="w-full h-full object-cover grayscale brightness-50 transition-all duration-1000 group-hover:grayscale-0 group-hover:brightness-110 group-hover:scale-102"
                              priority={index < 2}
                              quality={75}
                             />
                             <div className="absolute inset-x-0 bottom-0 py-4 bg-mafia-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700 flex items-center justify-center gap-3">
                                <Maximize2 size={16} className="text-mafia-black animate-pulse" />
                                <span className="text-xs font-black text-mafia-black uppercase tracking-[0.4em]">{lang === 'cs' ? 'ZVĚTŠIT OBRAZ' : 'EXPAND VIEW'}</span>
                             </div>
                          </div>
                        </div>
                        <div className="mt-6 flex flex-col items-center text-center px-4">
                           <h3 className="text-mafia-gold font-heading font-black text-3xl md:text-5xl uppercase tracking-tighter">{img.title[lang as 'cs' | 'en']}</h3>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox / Modal View */}
      <AnimatePresence>
        {selectedIndex !== null && currentCategory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
               <Image 
                src="/mafia_lightbox_background_1775810360608.png"
                alt="Mafia Background"
                fill
                className="object-cover opacity-30 grayscale brightness-50"
               />
               <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                closeImage();
              }}
              className="fixed top-20 right-8 md:top-24 md:right-12 z-[99999] flex items-center gap-2 text-white hover:text-mafia-red transition-all group p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full"
            >
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] hidden md:block">{lang === 'cs' ? 'ZAVŘÍT' : 'EXIT'}</span>
              <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center group-hover:rotate-90 transition-all duration-500">
                <X size={32} />
              </div>
            </button>

            <div className="fixed inset-y-0 left-0 right-0 flex items-center justify-between z-[5040] pointer-events-none px-4 md:px-12">
               <button onClick={prevImage} className="pointer-events-auto w-12 h-20 md:w-20 md:h-32 bg-mafia-gold text-mafia-black border-2 border-white hover:scale-110 transition-all flex items-center justify-center">
                 <ChevronLeft size={48} />
               </button>
               <button onClick={nextImage} className="pointer-events-auto w-12 h-20 md:w-20 md:h-32 bg-mafia-gold text-mafia-black border-2 border-white hover:scale-110 transition-all flex items-center justify-center">
                 <ChevronRight size={48} />
               </button>
            </div>

            <div className="w-full h-full max-w-6xl mx-auto flex flex-col items-center justify-center relative z-[5030]">
               <div className="relative w-full h-[55vh] md:h-[65vh] flex items-center justify-center">
                  <motion.div 
                    key={selectedIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 0.95 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full h-full relative flex items-center justify-center"
                  >
                    <div className="relative p-[2px] md:p-[3px] bg-mafia-gold shadow-[0_30px_100px_rgba(0,0,0,1)]">
                       <div className="relative bg-black">
                          <NextImage quality={95}
                            src={activeGalleryData[selectedIndex].src}
                            alt={activeGalleryData[selectedIndex].title[lang as 'cs' | 'en']}
                            width={1920}
                            height={1080}
                            className="object-contain w-full h-full max-h-[50vh] md:max-h-[60vh]"
                            priority
                          />
                       </div>
                    </div>
                  </motion.div>
               </div>
               <div className="mt-6 text-center w-full px-4 overflow-y-auto max-h-[25vh]">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <span className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-[0.4em]">{selectedIndex + 1} / {activeGalleryData.length}</span>
                  </div>
                  <h4 className="text-2xl md:text-5xl font-heading font-black text-mafia-gold uppercase tracking-widest leading-tight">
                    {activeGalleryData[selectedIndex].title[lang as 'cs' | 'en']}
                  </h4>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RetroProjectorSlideshow 
        isOpen={slideshowOpen} 
        onClose={() => setSlideshowOpen(false)} 
        items={activeGalleryData} 
        lang={lang} 
      />

      <BulletHoles />
      <Footer />
    </main>
  );
}
