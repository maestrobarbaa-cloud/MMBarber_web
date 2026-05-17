"use client";

import Image from "next/image";
import { useTranslation } from "../hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { playSound } from "../utils/audio";

const PARTNERS = [
  { name: "Vodo Topo Jahoda", url: "https://www.jahodavodotopo.cz/", img: "/loga_partneri/jahoda.png" },
  { name: "Kofipack", url: "https://kofipack.cz/", img: "/loga_partneri/kofipack.png" },
  { name: "Torinos Barbershop", url: "https://torinos-barbershop.myfox.cz/", img: "/loga_partneri/Torinos.png" },
  { name: "O Shawarma Beef", url: "https://www.instagram.com/o.shawarmabeef", img: "/loga_partneri/ShawmaBeef.png" },
  { name: "Malina Photo", url: "https://malinaphoto.cz/", img: "/loga_partneri/malinaphoto.gif" },
  { name: "Poe Poe", url: "https://www.poe-poe.cz/", img: "/loga_partneri/poe.png" },
  { name: "Šimon Král", url: "https://simonkral.cz/", img: "/loga_partneri/djKing.png" },
  { name: "Argema", url: "https://www.argema.cz/", img: "/loga_partneri/argema.png" },
  { name: "Dvůr pod Starýma Horama", url: "https://dvurpodstarymahorama.cz/", img: "/loga_partneri/DvurPodHorama.png" },
  { name: "Sluneční Reality", url: "https://slunecnireality.cz/", img: "/loga_partneri/slunecniReality.png" },
  { name: "Dětský domov UH", url: "https://www.detskydomovuh.cz/", img: "/loga_partneri/detskydomov.png" },
  { name: "O Kolečkovič", url: "https://www.okoleckovic.cz/", img: "/loga_partneri/okoleckovic.png" },
  { name: "Comites", url: "https://comites.cz/", img: "/loga_partneri/comites.png" }
];

export function Partners({ onOpenRodina }: { onOpenRodina?: () => void }) {
  const { t, lang } = useTranslation();
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [graphicsTier, setGraphicsTier] = useState<string>("low");

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
    
    // Disable effects for mobile/tablet or low graphics tier
    const isMobile = window.innerWidth < 1024;
    if (isMobile || graphicsTier === 'low' || graphicsTier === 'medium') {
      setRevealedIndices(PARTNERS.map((_, i) => i));
      return;
    }
    
    PARTNERS.forEach((_, index) => {
      setTimeout(() => {
        // Play camera sound for each reveal
        playSound("/sounds/kamera.mp3", 0.4);
        
        setRevealedIndices(prev => [...prev, index]);
      }, index * 400 + Math.random() * 200);
    });
  };

  return (
    <motion.section 
      onViewportEnter={startShooting}
      viewport={{ once: true, margin: "-100px" }}
      className="w-full pt-10 pb-8 md:pt-32 md:pb-16 px-4 bg-[#050505] relative overflow-hidden group/partners"
    >
      
      {/* Background extended from Footer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(var(--color-mafia-gold-rgb),0.05)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10 md:mb-24 flex flex-col items-center">
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

        {/* Grid of Partner Slots - 3 columns on mobile, 4 on desktop, 6 on large desktop */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-10">
          {PARTNERS.map((partner, i) => {
            const isRevealed = revealedIndices.includes(i);
            return (
              <div key={i} className="relative aspect-square flex items-center justify-center">
                {/* The "Wall" slot */}
                <div className="absolute inset-0 bg-mafia-dark/40 border border-white/5 shadow-inner"></div>

                <AnimatePresence>
                  {isRevealed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 z-10"
                    >
                      {/* Logo Soak-in Animation */}
                      <motion.div
                        initial={{ scale: 0, rotate: -10, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full h-full p-1 md:p-12 flex items-center justify-center"
                      >
                          <a href={partner.url} target="_blank" rel="noreferrer" className="group">
                            <Image
                                src={partner.img}
                                alt={partner.name}
                                width={180}
                                height={90}
                                sizes="(max-width: 640px) 30vw, (max-width: 1024px) 15vw, 10vw"
                                loading="lazy"
                                className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700 brightness-75 group-hover:brightness-125"
                            />
                          </a>
                      </motion.div>

                      {/* Impact Flash - No permanent hole to keep logos visible */}
                      {graphicsTier !== 'low' && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                           <motion.div 
                              initial={{ opacity: 1, scale: 0 }}
                              animate={{ opacity: 0, scale: 4 }}
                              transition={{ duration: 0.6 }}
                              className="absolute inset-x-[-20px] inset-y-[-20px] bg-mafia-gold rounded-full blur-xl mix-blend-screen"
                           />
                        </div>
                      )}
                    </motion.div>
                   )}
                </AnimatePresence>

                {/* Default State: Bare concrete or subtle marker */}
                {!isRevealed && (
                  <div className="w-2 h-2 bg-mafia-gold/10 rounded-full animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Dust/Smoke Particle Area removed by request */}


    </motion.section>
  );
}
