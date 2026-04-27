"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "./OptimizedImage";
import gsap from "gsap";
import { useTranslation } from "../hooks/useTranslation";
import { Copy, MapPin } from "lucide-react";

export function CinematicIntro({ onDismiss }: { onDismiss?: () => void }) {
  const { t, lang } = useTranslation();
  
  // Mobile check for early return
  const [isActuallyMobile, setIsActuallyMobile] = useState(false);

  const [showIntro, setShowIntro] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFullyOpen, setIsFullyOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLowTier, setIsLowTier] = useState(false);
  const grainRef = useRef<HTMLDivElement>(null);
  const flickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if on mobile (intros are for desktop immersion)
    if (window.innerWidth < 1280) {
      setIsActuallyMobile(true);
      localStorage.setItem("mmbarber_visited", "true");
      onDismiss?.();
      return;
    }

    // Check for low graphics tier
    const tier = document.documentElement.getAttribute('data-graphics-tier');
    if (tier === 'low') {
        setIsLowTier(true);
        localStorage.setItem("mmbarber_visited", "true"); // Automatically skip next time
        return;
    }
    
    // Check if visited before
    const hasVisited = localStorage.getItem("mmbarber_visited") === "true";
    if (!hasVisited) {
      setShowIntro(true);
    }
    
    return () => {
    };
  }, [onDismiss]);

  useEffect(() => {
      if (!showIntro || isDismissed) return;
      
      // Start curtain animation after a short delay
      const curtainTimer = setTimeout(() => {
        setIsAnimating(true);
      }, 500);

      const fullyOpenTimer = setTimeout(() => {
        setIsFullyOpen(true);
      }, 3500); // Wait for curtains to finish

      // Film grain animation
      const grainAnim = grainRef.current ? gsap.to(grainRef.current, {
        backgroundPosition: "400px 200px",
        duration: 0.1,
        repeat: -1,
        ease: "none",
      }) : null;

      // Random flicker/scratches animation
      const flickerInterval = setInterval(() => {
        if (flickerRef.current) {
          flickerRef.current.style.opacity = (Math.random() * 0.04).toString();
          flickerRef.current.style.transform = `translateX(${Math.random() * 10 - 5}px)`;
        }
      }, 100);

      return () => {
        clearInterval(flickerInterval);
        clearTimeout(curtainTimer);
        clearTimeout(fullyOpenTimer);
        grainAnim?.kill();
      };
  }, [showIntro, isDismissed]);

  // If already dismissed, don't render anything to avoid pushing content
  if (!showIntro || isDismissed || isLowTier || isActuallyMobile) return null;

  return (
    <>
      {/* Curtain Layer - Stays at the very top */}
      <div className="fixed inset-0 z-[10000] flex pointer-events-none overflow-hidden select-none">
        
        {/* Left Curtain */}
        <motion.div
          initial={{ x: 0 }}
          animate={isAnimating ? { x: "-100%" } : { x: 0 }}
          transition={{ duration: 2.8, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
          className="w-1/2 h-full bg-[#3d2b1f] relative overflow-hidden"
          style={{ 
            boxShadow: "15px 0 50px rgba(0,0,0,0.8)",
            background: "linear-gradient(90deg, #1c140e 0%, #3d2b1f 20%, #1c140e 40%, #3d2b1f 60%, #1c140e 80%, #3d2b1f 100%)"
          }}
        >
          {/* Realistic Texture & Folds */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/black-linen-2.png')] mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
          
          {/* Vertical Shadow Folds */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_50px,rgba(0,0,0,0.3)_75px,transparent_100px)] pointer-events-none"></div>

          {/* Left half of logo/text */}
          <div className="absolute inset-y-0 right-0 flex items-center justify-center w-[100vw] translate-x-1/2">
            <div className="flex flex-col items-center gap-12 text-center">
              <Image 
                src="/logo.png" 
                alt="MMBARBER" 
                width={256}
                height={256}
                unoptimized
                className="w-48 h-48 md:w-64 md:h-64 object-contain brightness-125 saturate-[0.5] drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
              />
              <h1 className="text-5xl md:text-8xl font-heading font-black text-mafia-gold uppercase tracking-[0.4em] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                MMBARBER
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Right Curtain */}
        <motion.div
          initial={{ x: 0 }}
          animate={isAnimating ? { x: "100%" } : { x: 0 }}
          transition={{ duration: 2.8, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
          className="w-1/2 h-full bg-[#3d2b1f] relative overflow-hidden"
          style={{ 
            boxShadow: "-15px 0 50px rgba(0,0,0,0.8)",
            background: "linear-gradient(90deg, #3d2b1f 0%, #1c140e 20%, #3d2b1f 40%, #1c140e 60%, #3d2b1f 80%, #1c140e 100%)"
          }}
        >
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/black-linen-2.png')] mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_50px,rgba(0,0,0,0.3)_75px,transparent_100px)] pointer-events-none"></div>

          {/* Right half of logo/text */}
          <div className="absolute inset-y-0 left-0 flex items-center justify-center w-[100vw] -translate-x-1/2">
            <div className="flex flex-col items-center gap-12 text-center">
              <Image 
                src="/logo.png" 
                alt="MMBARBER" 
                width={256}
                height={256}
                unoptimized
                className="w-48 h-48 md:w-64 md:h-64 object-contain brightness-125 saturate-[0.5] drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
              />
              <h1 className="text-5xl md:text-8xl font-heading font-black text-mafia-gold uppercase tracking-[0.4em] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                MMBARBER
              </h1>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Behind the Curtain Content - Background & Logo Layer */}
      <div className={`fixed inset-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden z-[9990] transition-all duration-1000 ${isAnimating ? 'opacity-100' : 'opacity-0 bg-[#020202]'}`}>
        {/* Cinematic Layers */}
        <div 
          ref={grainRef}
          className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] pointer-events-none"
        ></div>

        <div 
          ref={flickerRef}
          className="absolute inset-0 bg-white opacity-0 mix-blend-overlay pointer-events-none transition-opacity duration-75"
        ></div>

        {/* Dramatic Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,1)_100%)] pointer-events-none"></div>

        {/* The revealed content stays visible */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute inset-x-0 bottom-[15%] md:bottom-[20%] flex flex-col items-center gap-16 px-6 text-center"
        >
          <div className="flex flex-col items-center gap-6">
                {/* Primary Info */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="flex flex-col items-center gap-6"
                >
                  {/* Parking Card */}
                  <div className="bg-mafia-black/60 border border-mafia-gold/20 p-6 md:p-8 max-w-lg relative group">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-mafia-gold text-mafia-black px-4 py-1 text-[10px] font-black uppercase tracking-widest skew-x-[-12deg]">
                      {t.intro.parking}
                    </div>
                    
                    <p className="flavor-text text-mafia-gold/80 font-heading font-bold text-xl md:text-2xl uppercase tracking-widest mt-2 mb-4 leading-tight">
                      {t.intro.parkingHint}
                    </p>
                    
                    <p className="text-smoke-white/60 font-mono text-xs uppercase tracking-[0.2em] mb-6 border-l border-mafia-red/50 pl-4">
                      Sadová 1383, 686 05 Uherské Hradiště 5
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText("Sadová 1383, 686 05 Uherské Hradiště 5");
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-mafia-gold/10 border border-mafia-gold/30 hover:bg-mafia-gold hover:text-mafia-black transition-all text-[10px] font-black uppercase tracking-widest group/btn"
                      >
                        <Copy size={12} className={copied ? "text-green-500" : ""} />
                        {copied ? (lang === "cs" ? "KOPÍROVÁNO" : "COPIED") : t.intro.copyAddress}
                      </button>
                      
                      <a 
                        href="https://www.google.com/maps/dir/?api=1&destination=Sadová+1383,+686+05+Uherské+Hradiště+5"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-mafia-red/10 border border-mafia-red/30 hover:bg-mafia-red hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        <MapPin size={12} />
                        {t.intro.openMaps}
                      </a>
                    </div>
                  </div>
                  
                  {/* Decorative separator */}
                  <div className="w-32 h-1 bg-gradient-to-r from-transparent via-mafia-gold/30 to-transparent my-2"></div>
                  
                  <span className="flavor-text font-heading font-black text-3xl md:text-[50px] uppercase tracking-[0.2em] text-mafia-gold drop-shadow-[0_0_25px_rgba(197,160,89,0.5)] leading-tight">
                    {t.intro.payment}
                  </span>
                </motion.div>
          </div>

          {/* Accept Mission Button */}
          {isFullyOpen && (
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.5 }}
               className="flex flex-col items-center gap-4"
            >
               <button 
                onClick={() => {
                  setIsDismissed(true);
                  localStorage.setItem("mmbarber_visited", "true");
                  window.dispatchEvent(new Event("introDismissed"));
                  onDismiss?.();
                }}
                className="group relative px-16 py-6 bg-mafia-red text-mafia-black font-heading font-black text-2xl md:text-4xl uppercase tracking-[0.4em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(166,124,82,0.5)] hover:bg-white hover:text-black active:shadow-inner"
               >
                 {/* Internal glow animation */}
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none shadow-[0_0_30px_white]"></div>
                  <span className="relative z-10">
                    {t.intro.acknowledge}
                  </span>
               </button>
               
               {/* Terminal subtext for the button */}
               <motion.p 
                 animate={{ opacity: [0.3, 0.6, 0.3] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="font-mono text-[10px] text-mafia-red uppercase tracking-[0.5em] font-bold"
               >
                  {t.intro.acceptMission}
               </motion.p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
