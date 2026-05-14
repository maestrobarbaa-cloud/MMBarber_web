"use client";

import React, { useEffect, useRef, useState } from "react";

export function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLowTier, setIsLowTier] = useState(false);
  const requestRef = useRef<number>(undefined);
  const framesRef = useRef<ImageData[]>([]);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      const tier = document.documentElement.getAttribute('data-graphics-tier');
      setIsLowTier(tier === 'low' || tier === 'medium' || window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('mmbarber-graphics-update', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mmbarber-graphics-update', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isLowTier) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const noiseWidth = 256;
    const noiseHeight = 256;
    const offscreenCanvases: HTMLCanvasElement[] = [];
    
    const generateNoiseFrame = () => {
        const offscreen = document.createElement('canvas');
        offscreen.width = noiseWidth;
        offscreen.height = noiseHeight;
        const offCtx = offscreen.getContext('2d');
        if (!offCtx) return offscreen;

        const frame = offCtx.createImageData(noiseWidth, noiseHeight);
        const data = frame.data;
        for (let i = 0; i < data.length; i += 4) {
            const val = Math.random() * 255;
            data[i] = val;     // R
            data[i + 1] = val; // G
            data[i + 2] = val; // B
            data[i + 3] = 25;  // Alpha (low opacity grain)
        }
        offCtx.putImageData(frame, 0, 0);
        return offscreen;
    };

    const noiseFrames = [
        generateNoiseFrame(),
        generateNoiseFrame(),
        generateNoiseFrame(),
        generateNoiseFrame(),
        generateNoiseFrame()
    ];

    const animate = () => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Clear and draw tiled noise
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const offscreen = noiseFrames[currentFrameRef.current];
        
        const pattern = ctx.createPattern(offscreen, 'repeat');
        if (pattern) {
            ctx.fillStyle = pattern;
            // Random offset to make it look more dynamic
            const offsetX = Math.random() * noiseWidth;
            const offsetY = Math.random() * noiseHeight;
            ctx.translate(offsetX, offsetY);
            ctx.fillRect(-offsetX, -offsetY, canvas.width, canvas.height);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        currentFrameRef.current = (currentFrameRef.current + 1) % noiseFrames.length;
        
        // Slow down the grain animation to ~20fps for a more filmic look and better performance
        setTimeout(() => {
            requestRef.current = requestAnimationFrame(animate);
        }, 50); 
    };

    const handleResize = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.scale(dpr, dpr);
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
        window.removeEventListener('resize', handleResize);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isLowTier]);

  if (isLowTier) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden opacity-[0.2] mix-blend-overlay">
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}

