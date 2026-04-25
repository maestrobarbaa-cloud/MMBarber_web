"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "./OptimizedImage";

const DETAIL_PICS = [
  "/obr/prostredi/0793ccfb-06cc-4f51-9a97-91be0c3fc9ae.jfif.jpg",
  "/obr/prostredi/1c475788-6939-438d-8f05-909eced05770.jfif.jpg",
  "/obr/prostredi/DZZ_2471.jpg",
  "/obr/prostredi/DZZ_2475.jpg",
  "/obr/prostredi/DZZ_2477.jpg",
  "/obr/prostredi/DZZ_2480.jpg",
  "/obr/prostredi/DZZ_2486.jpg"
];

export function EnvironmentSlider() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();

  // Lock scroll when image is enlarged
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);

  return (
    <section id="galerie-prostredi" className="relative w-full bg-transparent flex flex-col items-center py-12 md:py-20 border-t border-mafia-gold/10 xl:hidden">
      <style>{`
        @keyframes scrollGallery {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-gallery {
          animation: scrollGallery 60s linear infinite;
        }
      `}</style>

      {/* Title / Intel Header */}
      <div className="max-w-6xl mx-auto w-full px-6 mb-10 flex items-end justify-between">
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-smoke-white uppercase tracking-widest flex items-center gap-3">
                {t.environmentSlider.title}
                <div className="w-12 h-px bg-mafia-gold"></div>
            </h2>
        </div>
      </div>

      {/* Moving Gallery - Simple approach */}
      <div className={`relative w-full flex ${!isMobile ? 'overflow-hidden' : 'overflow-x-auto scrollbar-hide'} bg-mafia-black/40 py-8 md:py-14 group border-y border-mafia-gold/5 snap-x snap-mandatory`}>
        
        {/* Very Subtle Gold Sheen at the edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-mafia-gold/5 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-mafia-gold/5 to-transparent z-10 pointer-events-none"></div>

        {/* Dynamic Refined Scan Line - Barely visible sheen */}
        <motion.div 
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent w-full z-10 pointer-events-none"
        ></motion.div>

        {/* Cinematic Vignette */}
        <div className="absolute inset-y-0 left-0 w-32 md:w-80 bg-gradient-to-r from-mafia-black to-transparent z-20 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 md:w-80 bg-gradient-to-l from-mafia-black to-transparent z-20 pointer-events-none"></div>

        <div className={`flex w-max ${!isMobile ? 'animate-scroll-gallery group-hover:[animation-play-state:paused]' : ''} transition-all duration-300`}>
          {(!isMobile ? [...DETAIL_PICS, ...DETAIL_PICS] : DETAIL_PICS).map((pic, i) => (
            <div 
                key={`${pic}-${i}`} 
                className="group/img flex-shrink-0 w-80 md:w-[380px] h-56 md:h-64 mx-3 relative overflow-hidden border border-mafia-gold/20 shadow-[0_0_15px_rgba(197,160,89,0.15)] cursor-pointer hover:border-mafia-gold/50 transition-all duration-700 snap-center"
                onClick={() => setSelectedImage(pic)}
            >
                {/* HUD Overlay on Hover */}
                <div className="absolute inset-0 z-20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 bg-mafia-black/20 border-2 border-mafia-gold/30 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 border border-mafia-gold flex items-center justify-center text-mafia-gold">
                            <Eye size={20} />
                        </div>
                        <span className="text-[9px] font-mono text-mafia-gold tracking-[0.3em] uppercase">{t.environmentSlider.detailPhoto}</span>
                    </div>
                </div>

                <Image 
                    src={pic} 
                    alt="Environment detail"
                    width={380}
                    height={256}
                    className={`w-full h-full object-cover transition-all duration-1000 ${!isMobile ? 'filter contrast-[1.1] brightness-[0.8] grayscale blur-[2px] group-hover/img:blur-none group-hover/img:grayscale-0 group-hover/img:brightness-100 group-hover/img:scale-105' : 'brightness-100'}`} 
                />
            </div>
          ))}
        </div>
      </div>

      {/* IMAGE ENLARGEMENT MODAL (HUD STYLE) */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            
            <div className="relative flex flex-col md:flex-row gap-6 max-w-7xl w-full items-center justify-center">
                
                {/* ZOOMED IMAGE WITH DETAILED HUD FRAME */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.05, y: -20 }}
                    className="relative max-w-2xl w-full max-h-[60vh] bg-mafia-black border border-mafia-gold/30 shadow-[0_0_100px_rgba(197,160,89,0.2)] overflow-hidden"
                >
                    {/* HUD Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-mafia-gold z-20"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-mafia-gold z-20"></div>
                    
                    {/* Targeting Lines */}
                    <div className="absolute inset-0 z-10 pointer-events-none">
                        <div className="absolute top-1/2 left-0 w-4 h-px bg-mafia-gold/50"></div>
                        <div className="absolute top-1/2 right-0 w-4 h-px bg-mafia-gold/50"></div>
                        <div className="absolute top-0 left-1/2 w-px h-4 bg-mafia-gold/50"></div>
                        <div className="absolute bottom-0 left-1/2 w-px h-4 bg-mafia-gold/50"></div>
                    </div>

                    <Image 
                        src={selectedImage} 
                        alt="Zoomed Detail" 
                        width={1200}
                        height={800}
                        className="w-full h-full object-contain pointer-events-none"
                    />
                </motion.div>

                {/* STYLED CLOSE BUTTON */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: 0.2 }}
                    className="flex-shrink-0"
                >
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="group relative w-16 h-16 md:w-20 md:h-20 bg-mafia-black border-2 border-mafia-gold/30 flex items-center justify-center hover:border-mafia-gold transition-all duration-500 shadow-2xl"
                    >
                        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-mafia-gold transition-colors group-hover:border-mafia-gold"></div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-mafia-gold transition-colors group-hover:border-mafia-gold"></div>
                        
                        <X size={32} className="text-mafia-gold group-hover:text-mafia-gold transition-all group-hover:rotate-90 duration-500 relative z-10" />
                        
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-mono text-mafia-gold/40 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{t.environmentSlider.closeImage}</span>
                    </button>
                </motion.div>

            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
