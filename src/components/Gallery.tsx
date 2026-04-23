"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

const PICS = [
  "/obr/atmosfera/barber-4.jpg",
  "/obr/atmosfera/barber-5.jpg",
  "/obr/atmosfera/barber-7.jpg",
  "/obr/atmosfera/barber-8.jpg",
  "/obr/atmosfera/barber-9.jpg",
  "/obr/atmosfera/barber-10.jpg",
  "/obr/atmosfera/barber-12.jpg",
  "/obr/atmosfera/barber-17.jpg",
  "/obr/atmosfera/barber-22.jpg",
  "/obr/atmosfera/barber-25.jpg",
  "/obr/atmosfera/barber-26.jpg",
  "/obr/atmosfera/barber-27.jpg",
  "/obr/atmosfera/barber-31.jpg",
  "/obr/atmosfera/barber-32.jpg",
  "/obr/atmosfera/barber-43.jpg",
  "/obr/atmosfera/barber-45.jpg",
  "/obr/atmosfera/barber-52.jpg",
  "/obr/atmosfera/barber-53.jpg",
  "/obr/atmosfera/barber-54.jpg",
  "/obr/atmosfera/barber-99.jpg"
];

export function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Inicializace zvuku promítačky
    audioRef.current = new Audio("/projector.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      audioRef.current?.play().catch(() => {});
      interval = setInterval(() => {
        changeSlide('next', false); // false = nepřehrajeme jednorázový zvuk znovu
      }, 3000);
    } else {
      audioRef.current?.pause();
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const changeSlide = (direction: 'next' | 'prev', playSound: boolean = true) => {
    if (playSound && !isPlaying) {
      // Click sound removed
    }

    if (!imageRef.current || !noiseRef.current) return;

    // Timeline for old projector transition
    const tl = gsap.timeline();

    // 1. Sudden strong noise overlay + flash
    tl.to(noiseRef.current, { opacity: 0.8, duration: 0.1, ease: "steps(2)" })
      .to(imageRef.current, { filter: "brightness(2) contrast(1.5) sepia(1) blur(2px)", opacity: 0.5, duration: 0.1 }, "<")
      .add(() => {
        // Change index mid-flash
        if (direction === 'next') {
          setCurrentIndex((prev) => (prev + 1) % PICS.length);
        } else {
          setCurrentIndex((prev) => (prev === 0 ? PICS.length - 1 : prev - 1));
        }
      })
      // 2. Fade noise out, revealing new image
      .to(noiseRef.current, { opacity: 0.15, duration: 0.2 })
      .to(imageRef.current, { filter: "brightness(1.1) contrast(1.1) sepia(0.4) grayscale(0.2)", opacity: 1, duration: 0.3 }, "<");
  };

  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section id="gallery" className="relative w-full py-32 px-4 md:px-12 bg-mafia-black border-y-8 border-mafia-dark flex flex-col items-center">
      
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-black text-mafia-gold mb-4 tracking-widest uppercase">
          {t.header.gallery}
        </h2>
        <p className="text-smoke-white/60 font-sans max-w-2xl mx-auto uppercase tracking-wider text-sm flex flex-col md:flex-row items-center justify-center gap-4">
          <span>Archivní snímky cílů</span>
          <button 
            onClick={toggleAutoplay} 
            className="flex items-center gap-2 bg-mafia-dark border border-mafia-gold/30 px-4 py-2 text-mafia-gold hover:bg-mafia-gold hover:text-mafia-black transition-colors z-30"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? "Pozastavit promítání" : "Spustit promítání"}
          </button>
        </p>
      </div>

      <div className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-video mx-auto">
        
        {/* Massive Vintage Frame Wrap */}
        <div className="absolute inset-0 z-20 pointer-events-none p-4 md:p-8">
          <div className="w-full h-full border-[10px] md:border-[20px] border-mafia-dark outline outline-2 outline-mafia-gold/20 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)] relative">
            <div className="absolute inset-0 border border-mafia-gold/10"></div>
          </div>
        </div>

        {/* The Projection View */}
        <div className="absolute inset-0 z-10 p-4 md:p-[28px] overflow-hidden bg-black">
          <div className="relative w-full h-full bg-mafia-black group">
            
            {/* Base Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              ref={imageRef}
              src={PICS[currentIndex]} 
              alt="Archivní Foto" 
              className="w-full h-full object-cover filter contrast-125 sepia-[0.4] grayscale-[0.2]" 
            />
            
            {/* Film Noise Overlay mapped to GSAP */}
            <div 
              ref={noiseRef}
              className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay"
              style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"filmNoise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23filmNoise)\"/%3E%3C/svg%3E')" }}
            ></div>

            {/* Flickering light ray effect overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50"></div>
            <div className={`absolute top-0 right-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,rgba(255,255,255,0)_0deg,rgba(255,255,255,0.05)_15deg,rgba(255,255,255,0)_30deg)] pointer-events-none mix-blend-screen transition-all duration-300 ${isPlaying ? 'animate-[spin_1s_linear_infinite] opacity-100' : 'animate-none opacity-0'}`}></div>
          </div>
        </div>

        {/* Controls - Positioned outside frame */}
        <button 
          onClick={() => { setIsPlaying(false); changeSlide('prev'); }}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-30 p-2 md:p-4 bg-mafia-dark border border-mafia-gold/30 text-mafia-gold hover:bg-mafia-gold hover:text-mafia-black transition-colors"
        >
          <ChevronLeft size={32} />
        </button>

        <button 
          onClick={() => { setIsPlaying(false); changeSlide('next'); }}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-30 p-2 md:p-4 bg-mafia-dark border border-mafia-gold/30 text-mafia-gold hover:bg-mafia-gold hover:text-mafia-black transition-colors"
        >
          <ChevronRight size={32} />
        </button>

      </div>

      <div className="flex items-center gap-4 mt-12 text-mafia-gold/50 text-xs font-mono tracking-widest uppercase">
        {isPlaying ? <Play size={16} className="animate-pulse" /> : <Pause size={16} />}
        <span>Přehrávání archivní cívky {currentIndex + 1} / {PICS.length}</span>
      </div>

    </section>
  );
}
