"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Image from "@/components/OptimizedImage";
import Link from "next/link";
import { ArrowLeft, X, Maximize2, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { MinigameToggle } from "@/components/MinigameToggle";

// Corrected Gallery Data
const GALLERY_DATA = [
  { src: "/obr/atmosfera/barber-4.jpg", title: { cs: "OČEKÁVÁNÍ", en: "EXPECTATION" }, desc: { cs: "Záběr na detaily interiéru naší centrály v tlumených barvách.", en: "Shot of our HQ interior details in muted colors." } },
  { src: "/obr/atmosfera/barber-7.jpg", title: { cs: "RODINNÁ TRADICE", en: "FAMILY TRADITION" }, desc: { cs: "Důvěrné posezení v křeslech, kde se probírají nejdůležitější obchody.", en: "Confidential seating in chairs where the most important deals are discussed." } },
  { src: "/obr/atmosfera/barber-9.jpg", title: { cs: "STYL DONA", en: "THE DON'S STYLE" }, desc: { cs: "Klasické holičské doplňky a atmosféra staré školy.", en: "Classic barber accessories and old-school atmosphere." } },
  { src: "/obr/atmosfera/barber-12.jpg", title: { cs: "PULZ STARÝCH ČASŮ", en: "PULSE OF OLD TIMES" }, desc: { cs: "Retro rádio s elektronkami, které u nás stále hraje ten správný rytmus.", en: "Vintage tube radio that still plays the right rhythm for us." } },
  { src: "/obr/atmosfera/barber-25.jpg", title: { cs: "ESTETIKA SÍLY", en: "AESTHETICS OF POWER" }, desc: { cs: "Dramatický portrét postavy s doutníkem a náznakem autority.", en: "Dramatic portrait of a figure with a cigar and a hint of authority." } },
  { src: "/obr/atmosfera/barber-43.jpg", title: { cs: "DÁMSKÁ SPOLEČNOST", en: "LADIES' COMPANY" }, desc: { cs: "Elegance a whiskey v černém provedení.", en: "Elegance and whiskey in black." } },
  { src: "/obr/atmosfera/barber-52.jpg", title: { cs: "RUCH V OPERATIVĚ", en: "OPERATIONAL HIGHLIGHTS" }, desc: { cs: "Zákulisí práce našich specialistů v plném nasazení.", en: "Behind the scenes of our specialists working at full speed." } },
  { src: "/obr/atmosfera/barber-99.jpg", title: { cs: "POSLEDNÍ ÚPRAVY", en: "FINAL TOUCHES" }, desc: { cs: "Soustředěný pohled na detail břitvy a hřebene v akci.", en: "Focused look at the razor and comb detail in action." } },
  { src: "/obr/prostredi/DZZ_2471.jpg", title: { cs: "ŽELEZNÝ TRŮN", en: "THE IRON THRONE" }, desc: { cs: "Naše ikonické křeslo, kde se tvoří nová vizáž hostů.", en: "Our iconic chair where guests' new look is created." } },
  { src: "/obr/prostredi/DZZ_2475.jpg", title: { cs: "SVĚTLO A STÍN", en: "LIGHT AND SHADOW" }, desc: { cs: "Atmosférické osvětlení dává vyniknout surovosti našeho prostředí.", en: "Atmospheric lighting brings out the rawness of our environment." } },
  { src: "/obr/prostredi/DZZ_2477.jpg", title: { cs: "PÉČE O DETAIL", en: "ATTENTION TO DETAIL" }, desc: { cs: "Tradiční štětka na holení a precizní nástroje.", en: "Traditional shaving brush and precision tools." } },
  { src: "/obr/prostredi/DZZ_2480.jpg", title: { cs: "VIBE CENTRÁLY", en: "HQ VIBE" }, desc: { cs: "Široký pohled na interiér salonu připravený pro novou misi.", en: "Wide view of the salon interior ready for a new mission." } },
  { src: "/obr/prostredi/DZZ_2486.jpg", title: { cs: "OPUŠTĚNÝ POST", en: "ABANDONED POST" }, desc: { cs: "Holičské křeslo čekající na svou další oběť... tedy klienta.", en: "A barber chair waiting for its next victim... I mean client." } }
];

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
             <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1a1100] via-black to-[#2d1e00] border-[3px] border-mafia-gold shadow-[0_0_20px_rgba(197,160,89,0.4),inset_0_0_15px_rgba(0,0,0,1)] relative overflow-hidden">
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

export default function GaleriePage() {
  const { lang } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openImage = (index: number) => setSelectedIndex(index);
  const closeImage = () => setSelectedIndex(null);

  const nextImage = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % GALLERY_DATA.length);
  }, [selectedIndex]);

  const prevImage = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + GALLERY_DATA.length) % GALLERY_DATA.length);
  }, [selectedIndex]);

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

      <section className="relative pt-24 pb-16 px-6 flex flex-col items-center justify-center text-center overflow-hidden z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative"
        >
          <Camera className="text-mafia-gold mb-6 mx-auto animate-pulse" size={48} />
          <h1 className="text-7xl md:text-[8rem] font-heading font-black text-white uppercase tracking-[0.25em] mb-4 drop-shadow-[0_20px_60px_rgba(0,0,0,1)] leading-none">
            {lang === 'cs' ? 'GALERIE' : 'GALLERY'}
          </h1>
          
          <div className="flex flex-col items-center gap-10 mt-24 md:mt-40">
            <Link 
                href="/#services"
                className="group relative inline-flex items-center gap-6 bg-mafia-gold px-12 py-6 transition-all duration-700 hover:bg-white hover:scale-105 shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_20px_rgba(197,160,89,0.3)] active:scale-95"
            >
                <ArrowLeft size={32} className="text-mafia-black group-hover:-translate-x-2 transition-transform" />
                <span className="text-mafia-black font-heading font-black text-2xl uppercase tracking-[0.4em]">{lang === 'cs' ? 'ZPĚT NA ÚVODNÍ STRANU' : 'BACK TO HOME PAGE'}</span>
            </Link>
          </div>
        </motion.div>
      </section>

      <section id="gallery-grid" className="relative pb-32 pt-10 px-4 md:px-12 max-w-[1800px] mx-auto z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {GALLERY_DATA.map((img, index) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index % 2 * 0.15 }}
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
              <div className="mt-10 flex flex-col items-center text-center px-4">
                 <h3 className="text-mafia-gold font-heading font-black text-3xl md:text-5xl uppercase tracking-tighter mb-4">{img.title[lang as 'cs' | 'en']}</h3>
                 <p className="text-white/30 text-sm md:text-lg italic max-w-md mx-auto">{img.desc[lang as 'cs' | 'en']}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedIndex !== null && (
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
                          <Image 
                            src={GALLERY_DATA[selectedIndex].src}
                            alt={GALLERY_DATA[selectedIndex].title[lang as 'cs' | 'en']}
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
                    <span className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-[0.4em]">{selectedIndex + 1} / {GALLERY_DATA.length}</span>
                  </div>
                  <h4 className="text-2xl md:text-5xl font-heading font-black text-mafia-gold uppercase mb-2 tracking-widest leading-tight">{GALLERY_DATA[selectedIndex].title[lang as 'cs' | 'en']}</h4>
                  <p className="text-white/80 font-sans italic text-sm md:text-2xl leading-relaxed max-w-2xl mx-auto">{GALLERY_DATA[selectedIndex].desc[lang as 'cs' | 'en']}</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BulletHoles />
      <MinigameToggle />
      <Footer />
    </main>
  );
}
