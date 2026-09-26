"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";

export default function SecretPageTwo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isEraserActive, setIsEraserActive] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  
  // Přechod z useState na useMotionValue pro pozici kurzoru
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const [flakes, setFlakes] = useState<{id: number, x: number, y: number, vx: number, vy: number, size: number, color: string, rotSpeed: number}[]>([]);
  
  const isDrawing = useRef(false);
  const lastPos = useRef<{x: number, y: number} | null>(null);
  const particleId = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      
      drawInitialImage(rect.width, rect.height);
    };

    const drawInitialImage = (width: number, height: number) => {
      const img = new window.Image();
      img.src = '/obr/obrazek1.png';
      img.onload = () => {
        if (!canvas || !ctx) return;
        
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        const scale = Math.max(width / img.width, height / img.height);
        const x = (width / 2) - (img.width / 2) * scale;
        const y = (height / 2) - (img.height / 2) * scale;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        setIsCanvasReady(true);
      };
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startX = lastPos.current ? lastPos.current.x : x;
    const startY = lastPos.current ? lastPos.current.y : y;

    ctx.globalCompositeOperation = "destination-out";
    
    // Zásadní změna: mažeme pouze 35 % průhlednosti při jednom projetí!
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";

    const dist = Math.hypot(x - startX, y - startY);
    const steps = Math.max(1, Math.floor(dist / 5));
    
    const newFlakesBatch = [];
    const colors = ["#111111", "#222222", "#000000", "#333333"];

    for (let i = 0; i <= steps; i++) {
      const interpX = startX + (x - startX) * (i / steps);
      const interpY = startY + (y - startY) * (i / steps);
      
      // Zásadní změna 2: menší radius (15 až 23 px místo 35 až 45)
      const radius = 15 + Math.random() * 8;
      
      ctx.beginPath();
      const numPoints = 12 + Math.floor(Math.random() * 8); 
      const angleStep = (Math.PI * 2) / numPoints;
      
      for (let j = 0; j <= numPoints; j++) {
        const r = radius * (0.4 + Math.random() * 0.6); 
        const px = interpX + Math.cos(j * angleStep) * r;
        const py = interpY + Math.sin(j * angleStep) * r;
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      if (Math.random() <= 0.15) { // Snížená četnost částic, aby to nebylo přeplácané při vícenásobném škrabání
        const numFlakes = Math.floor(Math.random() * 2) + 1;
        for (let k = 0; k < numFlakes; k++) {
          newFlakesBatch.push({
            id: particleId.current++,
            x: interpX + (Math.random() - 0.5) * radius, 
            y: interpY + (Math.random() - 0.5) * radius,
            vx: (Math.random() - 0.5) * 80,   
            vy: Math.random() * 120 + 30,      
            size: Math.random() * 5 + 2,       
            color: colors[Math.floor(Math.random() * colors.length)],
            rotSpeed: (Math.random() - 0.5) * 720
          });
        }
      }
    }

    if (newFlakesBatch.length > 0) {
      setFlakes(prev => [...prev.slice(-30), ...newFlakesBatch]);
    }

    lastPos.current = { x, y };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isEraserActive) return;
    isDrawing.current = true;
    const pos = getPointerPos(e);
    lastPos.current = pos;
    scratch(pos.x, pos.y);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isEraserActive) return;
    const pos = getPointerPos(e);
    
    mouseX.set(pos.x);
    mouseY.set(pos.y);
    
    if (!isDrawing.current) return;
    if ('touches' in e && typeof (e as any).cancelable !== 'undefined' && (e as any).cancelable) {
      e.preventDefault();
    }
    scratch(pos.x, pos.y);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    lastPos.current = null;
  };

  return (
    <div 
      className="min-h-screen bg-[#050505] text-mafia-gold relative overflow-hidden flex flex-col items-center justify-center p-4"
    >
      
      <Link 
        href="/zivotopisy" 
        className="absolute top-8 right-8 text-mafia-gold/50 hover:text-mafia-gold transition-colors z-50 group flex items-center gap-2"
      >
        <span className="font-mono text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Opustit systém</span>
        <X size={24} />
      </Link>

      <button
        onClick={() => setIsEraserActive(true)}
        className="absolute bottom-6 right-6 w-3 h-3 rounded-full bg-white/5 hover:bg-mafia-gold/30 cursor-pointer z-50 transition-colors"
        title="Aktivovat gumu"
      />

      <div className="relative p-2 md:p-3 bg-gradient-to-br from-mafia-gold/40 via-mafia-gold/10 to-mafia-gold/40 rounded-sm shadow-[0_0_50px_rgba(212,175,55,0.2)]">
        <div className="absolute inset-0 border border-mafia-gold/50 m-1 pointer-events-none"></div>
        <div className="absolute inset-0 border-[3px] border-black m-2 pointer-events-none z-30"></div>
        
        <div 
          ref={containerRef} 
          className="relative w-full max-w-6xl aspect-[16/9] w-[90vw] md:w-[75vw] lg:w-[65vw] mx-auto overflow-hidden bg-black"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          
          <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${isCanvasReady ? 'opacity-100' : 'opacity-0'}`}>
            <Image 
              src="/obr/obrazek2.png" 
              alt="Odkrytý obrázek" 
              fill 
              className="object-cover"
              quality={100}
            />
          </div>

          <canvas 
            ref={canvasRef}
            className={`absolute inset-0 z-10 w-full h-full touch-none ${isEraserActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
          />

          {/* Odlupující se kousky barvy/omítky */}
          <AnimatePresence>
            {flakes.map(flake => (
              <motion.div
                key={flake.id}
                className="absolute z-40 pointer-events-none"
                style={{ 
                  width: flake.size, 
                  height: flake.size, 
                  backgroundColor: flake.color,
                  boxShadow: 'inset -1px -1px 3px rgba(0,0,0,0.9), inset 1px 1px 2px rgba(255,255,255,0.1)'
                }}
                initial={{ x: flake.x, y: flake.y, opacity: 1, rotate: 0 }}
                animate={{ 
                  x: flake.x + flake.vx, 
                  y: flake.y + flake.vy, 
                  opacity: 0,
                  rotate: flake.rotSpeed
                }}
                transition={{ duration: 1 + Math.random(), ease: "easeIn" }}
                onAnimationComplete={() => {
                  setFlakes(prev => prev.filter(p => p.id !== flake.id));
                }}
              />
            ))}
          </AnimatePresence>
          
        </div>
      </div>
      
    </div>
  );
}
