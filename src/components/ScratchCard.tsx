"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Frown, Sparkles, Clock, Lock, Flame } from "lucide-react";
import Image from "next/image";

// Weighted rewards - Heavy RNG
const REWARDS = [
  { text: "Sleva 10 %", type: "win", weight: 3 },
  { text: "Káva zdarma", type: "win", weight: 1.5 },
  { text: "Styling navíc", type: "win", weight: 0.5 },
  { text: "Bohužel, zkus to znovu", type: "lose", weight: 95 },
];

const getRandomReward = () => {
  const totalWeight = REWARDS.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (const reward of REWARDS) {
    if (random < reward.weight) return reward;
    random -= reward.weight;
  }
  return REWARDS[REWARDS.length - 1]; // Fallback to lose
};

export default function ScratchCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [reward, setReward] = useState(REWARDS[3]);
  const [canPlayToday, setCanPlayToday] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const burnedPixels = useRef(0);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleOpen = () => {
      // Check limits (12h)
      const lastScratch = localStorage.getItem('mmbarber_burn_game_last');
      if (lastScratch) {
        const timeSince = Date.now() - parseInt(lastScratch);
        if (timeSince < 12 * 60 * 60 * 1000) {
          setCanPlayToday(false);
        } else {
          setCanPlayToday(true);
          setReward(getRandomReward());
          setIsRevealed(false);
          burnedPixels.current = 0;
        }
      } else {
        setCanPlayToday(true);
        setReward(getRandomReward());
        setIsRevealed(false);
        burnedPixels.current = 0;
      }
      setIsOpen(true);
    };

    window.addEventListener("mmbarber-scratch-card-open", handleOpen);
    return () => {
      window.removeEventListener("mmbarber-scratch-card-open", handleOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen && canPlayToday && !isRevealed) {
      initCanvas();
    }
  }, [isOpen, canPlayToday, isRevealed]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
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
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(0, 0, width, height);
      
      // Add text "SYNDICATE SEAL"
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 24px 'Courier New'";
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillText("SYNDICATE SEAL", width / 2, height / 2);
    };
  };

  const burn = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rad = 30; // hole radius
    
    // Cut the hole
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();

    // Add burn edges
    ctx.globalCompositeOperation = 'source-atop';
    const grad = ctx.createRadialGradient(x, y, rad - 5, x, y, rad + 10);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.5, 'rgba(255, 100, 0, 0.8)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, rad + 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over'; // reset

    // Check how much is burned
    burnedPixels.current++;
    if (burnedPixels.current > 70) { 
       handleReveal();
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    localStorage.setItem('mmbarber_burn_game_last', Date.now().toString());
    setCanPlayToday(false); // So they can't play again immediately when they close
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.transition = 'opacity 1.5s ease-out';
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.display = 'none';
      }, 1500);
    }
  };

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    const pos = getPointerPos(e);
    burn(pos.x, pos.y);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPointerPos(e);
    setMousePos(pos);
    
    if (!isDrawing.current) return;
    if ('touches' in e && typeof (e as any).cancelable !== 'undefined' && (e as any).cancelable) {
      // handled by css
    }
    burn(pos.x, pos.y);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-[#0a0a0a] border-2 border-mafia-gold rounded-xl shadow-[0_0_50px_rgba(197,160,89,0.25)] overflow-hidden flex flex-col"
        >
          {/* Subtle gold glow behind */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(197,160,89,0.15)_0%,transparent_70%)] pointer-events-none" />
          
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-mafia-gold/10 bg-black/40 relative z-10">
            <h2 className="font-heading font-bold text-mafia-gold uppercase tracking-wider flex items-center gap-2 text-lg">
              <Flame size={18} className="text-orange-500" />
              The Syndicate Burn
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {!canPlayToday && !isRevealed ? (
            /* Limit Reached Screen */
            <div className="p-8 flex flex-col items-center justify-center text-center relative min-h-[320px] bg-gradient-to-b from-[#111] to-[#050505]">
              <Lock size={48} className="text-mafia-gold/50 mb-6" />
              <h3 className="text-xl font-heading font-bold text-mafia-gold mb-4 uppercase tracking-widest">Přístup odepřen</h3>
              <p className="text-sm font-mono text-white/60 leading-relaxed mb-6">
                Tvůj doutník vyhasl. Podsvětí neodpouští chamtivost. Přijď opět za 12 hodin.
              </p>
              <div className="flex items-center justify-center gap-2 text-mafia-gold/80 text-xs font-mono uppercase tracking-widest px-4 py-2 border border-mafia-gold/20 bg-mafia-gold/5 rounded">
                <Clock size={14} />
                Čekej na další propálení
              </div>
            </div>
          ) : (
            /* Game Area */
            <div className="p-8 flex flex-col items-center justify-center relative min-h-[320px]">
              
              {/* Burning Container */}
              <div 
                className={`relative w-[280px] h-[280px] rounded-full overflow-hidden border-[4px] border-mafia-gold/80 shadow-[0_0_40px_rgba(197,160,89,0.3)] select-none bg-black transition-all duration-1000 ${isRevealed && reward.type === 'win' ? 'shadow-[0_0_80px_rgba(255,215,0,0.6)] border-yellow-400' : ''}`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => { setIsHovering(false); handlePointerUp(); }}
              >
                
                {/* Result Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={reward.type === 'win' ? '/obr/burn_win.jpg' : '/obr/burn_lose.jpg'} 
                    alt="Result" 
                    fill 
                    className="object-cover"
                  />
                  {isRevealed && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10"
                    >
                       <h3 className={`text-3xl font-heading font-black text-center uppercase mb-2 ${reward.type === 'win' ? 'text-mafia-gold' : 'text-red-500'}`}>
                         {reward.type === 'win' ? 'VÝHRA!' : 'ZKUS TO ZNOVU'}
                       </h3>
                       <p className="text-white/80 text-center px-4 text-xs font-bold uppercase tracking-widest">
                         {reward.text}
                       </p>
                    </motion.div>
                  )}
                </div>

                {/* The Scratchable Canvas Overlay */}
                {!isRevealed && (
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full cursor-none touch-none z-10"
                    onMouseDown={handlePointerDown}
                    onMouseMove={handlePointerMove}
                    onMouseUp={handlePointerUp}
                    onTouchStart={handlePointerDown}
                    onTouchMove={handlePointerMove}
                    onTouchEnd={handlePointerUp}
                  />
                )}
                
                {/* Custom Flame Cursor */}
                <AnimatePresence>
                  {isHovering && !isRevealed && (
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
              
              <p className="mt-8 text-white/60 font-mono text-xs text-center uppercase tracking-widest z-10">
                {isRevealed 
                  ? reward.type === "win" ? "Kontaktuj personál pro uplatnění výhry" : "Nezoufej, syndikát dává druhé šance"
                  : "Propálit doutníkem a odhalit pečeť"}
              </p>
            </div>
          )}
          
          <AnimatePresence>
            {(!canPlayToday || isRevealed) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-6 bg-black/80 border-t border-mafia-gold/20 backdrop-blur-md relative z-10"
              >
                 <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 bg-gradient-to-r from-mafia-gold/10 via-mafia-gold/20 to-mafia-gold/10 hover:from-mafia-gold/20 hover:via-mafia-gold/30 hover:to-mafia-gold/20 text-mafia-gold border border-mafia-gold/50 font-heading font-black uppercase tracking-[0.2em] transition-all rounded shadow-[0_0_15px_rgba(197,160,89,0.2)] hover:shadow-[0_0_25px_rgba(197,160,89,0.4)]"
                 >
                   Zavřít
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
