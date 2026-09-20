"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { Flame } from 'lucide-react';

export function BurnCardGame() {
  const { lang } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isRevealed, setIsRevealed] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [canPlay, setCanPlay] = useState(true);

  // Check limits
  useEffect(() => {
    const lastPlay = localStorage.getItem('mmbarber_burn_game_last');
    if (lastPlay) {
      const timeSince = Date.now() - parseInt(lastPlay);
      if (timeSince < 12 * 60 * 60 * 1000) {
        setCanPlay(false);
        setHasPlayed(true);
      }
    }
    // Determine win state
    setIsWinner(Math.random() < 0.1); // 10% win chance
  }, []);

  useEffect(() => {
    if (!canvasRef.current || hasPlayed || !canPlay) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const img = new window.Image();
    img.src = '/obr/burn_paper.jpg';
    
    // Fill paper
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      // Darken overlay
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, width, height);
    };

    let isDrawing = false;
    let burnedPixels = 0;
    const totalPixels = width * height;

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let x, y;
      if (e.type.includes('mouse')) {
        x = (e as MouseEvent).clientX - rect.left;
        y = (e as MouseEvent).clientY - rect.top;
      } else {
        x = (e as TouchEvent).touches[0].clientX - rect.left;
        y = (e as TouchEvent).touches[0].clientY - rect.top;
      }
      return { x, y };
    };

    const burn = (x: number, y: number) => {
      if (isRevealed) return;
      
      const rad = 40; // hole radius
      
      // Cut the hole
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();

      // Add burn edges
      ctx.globalCompositeOperation = 'source-atop';
      const grad = ctx.createRadialGradient(x, y, rad - 10, x, y, rad + 10);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.5, 'rgba(255, 100, 0, 0.8)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, rad + 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over'; // reset

      // Check how much is burned (optimization: random sampling)
      burnedPixels++;
      if (burnedPixels > 100) { // arbitrary threshold for quick reveal
         handleReveal();
      }
    };

    const handleReveal = () => {
      setIsRevealed(true);
      setHasPlayed(true);
      localStorage.setItem('mmbarber_burn_game_last', Date.now().toString());
      
      // Animate full burn
      canvas.style.transition = 'opacity 1.5s ease-out';
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.display = 'none';
      }, 1500);
    };

    const handleDown = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      const { x, y } = getPos(e);
      burn(x, y);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      const { x, y } = getPos(e);
      setMousePos({ x, y });
      burn(x, y);
    };

    const handleUp = () => isDrawing = false;

    canvas.addEventListener('mousedown', handleDown);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleUp);
    canvas.addEventListener('mouseleave', handleUp);
    
    canvas.addEventListener('touchstart', handleDown);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleUp);

    return () => {
      canvas.removeEventListener('mousedown', handleDown);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleUp);
      canvas.removeEventListener('mouseleave', handleUp);
      canvas.removeEventListener('touchstart', handleDown);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleUp);
    };
  }, [hasPlayed, canPlay, isRevealed]);

  return (
    <div className="relative max-w-xl mx-auto p-4 flex flex-col items-center">
      <h2 className="text-4xl font-heading font-black text-mafia-gold uppercase mb-2">The Syndicate Burn</h2>
      <p className="text-smoke-white/60 mb-8 font-sans text-center">
        {lang === 'cs' 
          ? "Propálit plátno doutníkem a odhalit tajemství syndikátu. (Pokus každých 12h)" 
          : "Burn the canvas with a cigar to reveal the syndicate's secret. (Try every 12h)"}
      </p>

      <div 
        ref={containerRef}
        className="relative w-full aspect-square border-2 border-mafia-gold/20 cursor-none shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Background Result Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={isWinner ? '/obr/burn_win.jpg' : '/obr/burn_lose.jpg'} 
            alt="Result" 
            fill 
            className="object-cover"
          />
          {isRevealed && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10"
            >
               <h3 className={`text-5xl font-heading font-black uppercase mb-4 ${isWinner ? 'text-mafia-gold' : 'text-red-500'}`}>
                 {isWinner ? (lang === 'cs' ? 'VÝHRA!' : 'WINNER!') : (lang === 'cs' ? 'ZKUS TO ZNOVU' : 'TRY AGAIN')}
               </h3>
               <p className="text-white/80 uppercase tracking-widest text-sm">
                 {isWinner ? 'Kontaktuj admina s kódem: BURN777' : 'Zkus štěstí znovu za 12 hodin.'}
               </p>
            </motion.div>
          )}
        </div>

        {/* Scratch Canvas */}
        {!hasPlayed && (
          <canvas 
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-10"
          />
        )}

        {/* Custom Cigar/Flame Cursor */}
        <AnimatePresence>
          {isHovering && !isRevealed && !hasPlayed && (
            <motion.div 
              className="absolute pointer-events-none z-50 flex items-center justify-center w-12 h-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: mousePos.x - 24, y: mousePos.y - 24 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'tween', ease: 'linear', duration: 0.05 }}
            >
              <div className="relative">
                <Flame className="text-orange-500 animate-pulse drop-shadow-[0_0_15px_rgba(255,100,0,0.8)]" size={32} />
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-400 rounded-full blur-md -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!canPlay && hasPlayed && isRevealed === false && (
        <div className="mt-8 text-center p-6 bg-red-500/10 border border-red-500/30">
          <p className="text-red-500 uppercase tracking-widest font-bold">
            {lang === 'cs' ? "Váš doutník vyhasl. Další pokus za 12 hodin." : "Your cigar is out. Next try in 12 hours."}
          </p>
        </div>
      )}
    </div>
  );
}
