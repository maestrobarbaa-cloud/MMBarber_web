"use client";

import Image from "next/image";
import { useTranslation } from "../hooks/useTranslation";
import { motion, AnimatePresence, useMotionValue, animate, PanInfo } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { playSound } from "../utils/audio";
import { GameFragment } from "./GameFragment";
import { Fingerprint } from "lucide-react";

const PARTNER_CATEGORIES = [
  {
    titleCs: "GASTRO & RELAX",
    titleEn: "GASTRO & RELAX",
    partners: [
      { name: "Kofipack", url: "https://kofipack.cz/", img: "/loga_partneri/kofipack.png" },
      { name: "O Shawarma Beef", url: "https://www.instagram.com/o.shawarmabeef", img: "/loga_partneri/ShawmaBeef.png" },
      { name: "Poe Poe", url: "https://www.poe-poe.cz/", img: "/loga_partneri/poe.png" }
    ]
  },
  {
    titleCs: "ŘEMESLA A SPRÁVA",
    titleEn: "CRAFTS & ADMIN",
    partners: [
      { name: "Vodo Topo Jahoda", url: "https://www.jahodavodotopo.cz/", img: "/loga_partneri/jahoda.png" },
      { name: "Sluneční Reality", url: "https://slunecnireality.cz/", img: "/loga_partneri/slunecniReality.png" },
      { name: "Comites", url: "https://comites.cz/", img: "/loga_partneri/comites.png" },
      { name: "Detailing", url: "https://www.detailing4u.cz/", img: "/loga_partneri/detailing.png" }
    ]
  },
  {
    titleCs: "KULTURA A ZÁBAVA",
    titleEn: "CULTURE & FUN",
    partners: [
      { name: "Argema", url: "https://www.argema.cz/", img: "/loga_partneri/argema.png" },
      { name: "Šimon Král", url: "https://simonkral.cz/", img: "/loga_partneri/djKing.png" },
      { name: "Dvůr pod Starýma Horama", url: "https://dvurpodstarymahorama.cz/", img: "/loga_partneri/DvurPodHorama.png" }
    ]
  },
  {
    titleCs: "PROJEKTY A POMOC",
    titleEn: "PROJECTS & CHARITY",
    partners: [
      { name: "Torinos Barbershop", url: "https://torinos-barbershop.myfox.cz/", img: "/loga_partneri/Torinos.png" },
      { name: "Dětský domov UH", url: "https://www.detskydomovuh.cz/", img: "/loga_partneri/detskydomov.png" },
      { name: "O Kolečkovič", url: "https://www.okoleckovic.cz/", img: "/loga_partneri/okoleckovic.png" },
      { name: "Malina Photo", url: "https://malinaphoto.cz/", img: "/loga_partneri/malinaphoto.gif" }
    ]
  }
];

const FLAT_PARTNERS = PARTNER_CATEGORIES.flatMap(c => c.partners);

const Carousel3D = ({ items, lang }: { items: typeof FLAT_PARTNERS, lang: string }) => {
  const rotation = useMotionValue(0);
  const [activeItem, setActiveItem] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [radius, setRadius] = useState(280);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const updateRadius = () => {
      setRadius(window.innerWidth < 768 ? 140 : 280);
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  const theta = 360 / items.length;

  // Auto rotation
  useEffect(() => {
    let animationFrameId: number;
    const loop = () => {
      if (!isDragging && !isHovered) {
        rotation.set(rotation.get() - 0.08); // Slow spin
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging, isHovered, rotation]);

  useEffect(() => {
    return rotation.on("change", (latest) => {
      let posRot = latest % 360;
      if (posRot < 0) posRot += 360;
      const currentIndex = Math.round(posRot / theta) % items.length;
      setActiveItem(currentIndex);
    });
  }, [rotation, theta, items.length]);

  const handlePanStart = () => {
    setIsDragging(true);
  };

  const handlePanEnd = (e: any, info: PanInfo) => {
    setIsDragging(false);
    const currentRot = rotation.get();
    const velocity = info.velocity.x * 0.5;
    const target = currentRot + velocity;
    const nearest = Math.round(target / theta) * theta;
    
    animate(rotation, nearest, {
      type: "spring",
      stiffness: 100,
      damping: 20
    });
  };

  if (!isClient) return null;

  return (
    <motion.div
      onPanStart={handlePanStart}
      onPan={(e, info) => rotation.set(rotation.get() + info.delta.x * 0.5)}
      onPanEnd={handlePanEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: "1200px" }}
      className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing my-6"
    >
      {/* Center Compass Line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] md:w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-mafia-gold to-transparent z-0 pointer-events-none opacity-50"></div>
      
      {/* Current Active Item Title */}
      <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none w-full px-4">
        <h3 className="text-mafia-gold font-heading font-black text-lg md:text-2xl uppercase tracking-[0.3em] drop-shadow-[0_0_10px_var(--color-mafia-gold-glow)]">
          {items[activeItem]?.name}
        </h3>
        {/* Find category of active item */}
        <p className="text-white/50 font-mono text-[10px] md:text-xs tracking-widest mt-1 uppercase">
          {lang === 'cs' 
             ? PARTNER_CATEGORIES.find(c => c.partners.includes(items[activeItem]))?.titleCs 
             : PARTNER_CATEGORIES.find(c => c.partners.includes(items[activeItem]))?.titleEn}
        </p>
      </div>

      {/* Rotating 3D Container */}
      <motion.div
        style={{ rotateY: rotation, transformStyle: "preserve-3d" }}
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
      >
        {items.map((item, i) => {
          const itemAngle = i * theta;
          const isActive = i === activeItem;

          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `rotateY(${-itemAngle}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden"
              }}
            >
              <a 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                className={`block w-24 h-24 md:w-32 md:h-32 transition-all duration-500 flex items-center justify-center pointer-events-auto
                  ${isActive 
                    ? 'scale-125 md:scale-150 drop-shadow-[0_0_20px_var(--color-mafia-gold-glow)] z-10 opacity-100 grayscale-0' 
                    : 'scale-100 opacity-30 grayscale hover:opacity-80 hover:grayscale-[50%]'
                  }
                `}
              >
                <Image src={item.img} alt={item.name} width={90} height={90} className="w-full h-full object-contain" />
              </a>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export function Partners({ onOpenRodina }: { onOpenRodina?: () => void }) {
  const { t, lang } = useTranslation();
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [graphicsTier, setGraphicsTier] = useState<string>("low");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    const updateTier = () => {
      const tier = document.documentElement.getAttribute('data-graphics-tier') || "low";
      setGraphicsTier(tier);
    };
    updateTier();
    window.addEventListener('mmbarber-graphics-update', updateTier);
    return () => window.removeEventListener('mmbarber-graphics-update', updateTier);
  }, []);

  const startShooting = () => {
    if (hasStarted) return;
    setHasStarted(true);
    
    // Disable effects for mobile/tablet or lite graphics tier
    const isMobile = window.innerWidth < 1024;
    if (isMobile || graphicsTier === 'lite') {
      setRevealedIndices(FLAT_PARTNERS.map((_, i) => i));
      return;
    }
    
    FLAT_PARTNERS.forEach((_, index) => {
      setTimeout(() => {
        // Play camera sound for each reveal
        playSound("/sounds/kamera.mp3", 0.4);
        
        setRevealedIndices(prev => [...prev, index]);
      }, index * 400 + Math.random() * 200);
    });
  };

  const handleUnlock = () => {
    if (isUnlocking || isUnlocked) return;
    setIsUnlocking(true);
    playSound("/sounds/kamera.mp3", 0.6);
    
    setTimeout(() => {
      setIsUnlocked(true);
      setIsUnlocking(false);
      startShooting();
    }, 1200);
  };

  return (
    <motion.section 
      className="w-full py-0 px-4 bg-[#050505] relative overflow-hidden group/partners"
    >
      
      {/* Background extended from Footer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(var(--color-mafia-gold-rgb),0.05)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-12 mt-8 flex flex-col items-center">
          <div className="flex items-center gap-4 md:gap-8 mb-4">
            {/* Left Gangster Stars */}
            <div className="hidden sm:flex items-center gap-2 text-mafia-gold">
              {[20, 32, 20].map((size, i) => (
                <motion.div 
                  key={`left-star-${i}`}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }} 
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                >
                  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </motion.div>
              ))}
            </div>

            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl md:text-6xl font-heading font-black text-white tracking-[0.2em] md:tracking-[0.3em] uppercase"
            >
              {t?.partners?.title || (lang === 'cs' ? 'NAŠI KUMPÁNI' : 'OUR PARTNERS')}
            </motion.h2>

            {/* Right Gangster Stars */}
            <div className="hidden sm:flex items-center gap-2 text-mafia-gold">
              {[20, 32, 20].map((size, i) => (
                <motion.div 
                  key={`right-star-${i}`}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }} 
                  transition={{ duration: 3, repeat: Infinity, delay: (2-i) * 0.4 }}
                >
                  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="section-underline w-16 md:w-24 h-1 bg-gradient-to-r from-mafia-gold/20 via-mafia-gold to-mafia-gold/20 mx-auto mb-6 shadow-[0_0_20px_var(--color-mafia-gold-glow)]" style={{ background: 'linear-gradient(to right, transparent, var(--user-accent-color), transparent)', boxShadow: '0 0 20px var(--user-glow-color)' }}></div>
        </div>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div 
              key="unlock-button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center my-10 md:my-20 relative z-20"
            >
              <button 
                onClick={handleUnlock}
                disabled={isUnlocking}
                className="relative group w-40 h-40 md:w-48 md:h-48 rounded-full border border-mafia-gold/20 flex flex-col items-center justify-center bg-mafia-black overflow-hidden transition-all duration-700 hover:border-mafia-gold hover:shadow-[0_0_50px_rgba(var(--color-mafia-gold-rgb),0.3)]"
              >
                {/* Scanline effect when unlocking */}
                {isUnlocking && (
                  <motion.div 
                    initial={{ y: "-100%" }}
                    animate={{ y: "100%" }}
                    transition={{ duration: 1.2, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-mafia-gold/40 to-transparent z-10"
                  />
                )}
                
                <div className={`relative z-20 transition-all duration-500 ${isUnlocking ? "text-mafia-gold scale-110" : "text-mafia-gold/50 group-hover:text-mafia-gold"}`}>
                  <Fingerprint size={48} className="md:w-16 md:h-16" strokeWidth={1} />
                </div>
                <span className={`mt-4 md:mt-6 text-[8px] md:text-[10px] font-mono tracking-[0.3em] uppercase transition-colors duration-500 relative z-20 ${isUnlocking ? "text-mafia-gold animate-pulse" : "text-mafia-gold/50 group-hover:text-mafia-gold"}`}>
                  {isUnlocking ? (lang === 'cs' ? "DEŠIFRUJI..." : "DECRYPTING...") : (lang === 'cs' ? "ODTAJNIT SÍŤ" : "DECRYPT NETWORK")}
                </span>
                
                {/* Spinning border on hover */}
                <div className="absolute inset-0 rounded-full border-t border-mafia-gold opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow transition-opacity duration-700 pointer-events-none"></div>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="partners-carousel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="w-full relative z-20"
            >
              <Carousel3D items={FLAT_PARTNERS} lang={lang} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Dust/Smoke Particle Area removed by request */}


    </motion.section>
  );
}
