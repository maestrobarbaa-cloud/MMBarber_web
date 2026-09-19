"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CarFront } from 'lucide-react';
import { useUI } from '@/contexts/UIContext';

const GRAVITY = -0.6;
const JUMP_STRENGTH = 10;
const GAME_SPEED = 5;

export function MafiaMinigame() {
  const { isBloodMode } = useUI();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const obsContainerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const requestRef = useRef<number>(0);
  
  // Game State Refs (to avoid re-renders during loop)
  const state = useRef({
    carY: 0,
    velocity: 0,
    obstacles: [] as { x: number; passed: boolean; id: number }[],
    score: 0,
    frames: 0
  });

  const jump = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isPlaying && !gameOver) {
      setIsPlaying(true);
    }
    
    if (gameOver) {
      // Restart
      state.current = {
        carY: 0,
        velocity: 0,
        obstacles: [],
        score: 0,
        frames: 0
      };
      setScore(0);
      setGameOver(false);
      setIsPlaying(true);
      return;
    }
    
    // Only jump if on the ground
    if (state.current.carY <= 0) {
      state.current.velocity = JUMP_STRENGTH;
    }
  }, [isPlaying, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        jump(e);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  const updateGame = useCallback(() => {
    if (!isPlaying || gameOver) return;
    
    const s = state.current;
    const containerWidth = containerRef.current?.clientWidth || 600;
    
    // Update car physics (Y axis: 0 is bottom, positive is up)
    s.velocity += GRAVITY;
    s.carY += s.velocity;
    
    // Floor collision
    if (s.carY <= 0) {
      s.carY = 0;
      s.velocity = 0;
    }
    
    // Update obstacles
    s.frames++;
    
    // Spawn obstacle
    if (s.frames % 90 === 0 || (s.frames > 500 && s.frames % 60 === 0)) {
      s.obstacles.push({ x: containerWidth, passed: false, id: s.frames });
    }
    
    // Move obstacles and check collision
    // Car visually is 48x48 roughly, starting at x=50, bottom=0 (when carY=0)
    const carRect = { x: 50, y: s.carY, width: 40, height: 30 }; 
    
    for (let i = s.obstacles.length - 1; i >= 0; i--) {
      let obs = s.obstacles[i];
      obs.x -= GAME_SPEED + (s.score * 0.05); // Speed increases slightly
      
      const obsRect = { x: obs.x, y: 0, width: 24, height: 24 };
      
      // Collision detection (AABB)
      if (
        carRect.x < obsRect.x + obsRect.width &&
        carRect.x + carRect.width > obsRect.x &&
        carRect.y < obsRect.y + obsRect.height &&
        carRect.y + carRect.height > obsRect.y
      ) {
        // Hit!
        setGameOver(true);
        setIsPlaying(false);
        setHighScore(prev => Math.max(prev, s.score));
        return; // End frame early
      }
      
      // Score point when passing obstacle
      if (obs.x < carRect.x && !obs.passed) {
        obs.passed = true;
        s.score += 10;
        setScore(s.score);
      }
      
      // Remove off-screen obstacles
      if (obs.x < -50) {
        s.obstacles.splice(i, 1);
      }
    }
    
    // Render state to DOM
    if (carRef.current) {
      carRef.current.style.transform = `translateY(-${s.carY}px)`;
    }
    
    // Update DOM obstacles
    if (obsContainerRef.current) {
      obsContainerRef.current.innerHTML = '';
      s.obstacles.forEach(obs => {
        const div = document.createElement('div');
        div.className = `absolute bottom-0 w-8 h-8 flex items-end justify-center ${isBloodMode ? 'text-mafia-red' : 'text-mafia-gold'}`;
        div.style.left = `${obs.x}px`;
        div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cone"><path d="m20.9 18.55-8-15.98a1 1 0 0 0-1.8 0l-8 15.98"/><path d="M16 12 8 8"/><path d="M18 16 6 12"/><path d="M3 20h18"/><path d="M8 20v2"/><path d="M16 20v2"/></svg>`;
        obsContainerRef.current.appendChild(div);
      });
    }
    
    requestRef.current = requestAnimationFrame(updateGame);
  }, [isPlaying, gameOver, isBloodMode]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, gameOver, updateGame]);

  return (
    <div className="w-full relative select-none">
      <div className="flex justify-between items-center mb-2 font-mono text-sm uppercase text-smoke-white/60">
        <div>Skóre: <span className="text-white font-bold">{score}</span></div>
        <div>Nejlepší: <span className="text-white font-bold">{highScore}</span></div>
      </div>
      
      {/* Game Area */}
      <div 
        ref={containerRef}
        onClick={jump}
        className={`w-full h-[150px] bg-black/50 border overflow-hidden relative cursor-pointer ${isBloodMode ? 'border-mafia-red/30' : 'border-mafia-gold/30'}`}
      >
        {/* Sky / Background text */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 font-bold uppercase tracking-widest text-sm animate-pulse">
            Klikni nebo stiskni Mezerník pro únik
          </div>
        )}
        
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
            <span className={`font-black text-2xl uppercase tracking-widest mb-2 ${isBloodMode ? 'text-mafia-red' : 'text-mafia-gold'}`}>Dopadli tě</span>
            <span className="text-white/60 text-sm">Klikni pro restart</span>
          </div>
        )}

        {/* Floor */}
        <div className={`absolute bottom-0 w-full h-[1px] ${isBloodMode ? 'bg-mafia-red/50' : 'bg-mafia-gold/50'}`}></div>
        
        {/* Obstacles Container */}
        <div ref={obsContainerRef} className="absolute bottom-0 left-0 w-full h-full"></div>
        
        {/* Player (Car) */}
        <div 
          ref={carRef}
          className={`absolute bottom-[1px] left-[50px] transition-transform ${isBloodMode ? 'text-mafia-red' : 'text-mafia-gold'}`}
        >
          <CarFront size={48} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
