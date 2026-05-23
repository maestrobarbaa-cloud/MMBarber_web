"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  maxOpacity: number;
  speed: number;
  layer: number;
  phase: number;
}

export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [atmosphereMode, setAtmosphereMode] = useState<'classic' | 'galaxy' | 'pure_dark'>('classic');
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>(undefined);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), { damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), { damping: 20 });

    useEffect(() => {
    setIsMounted(true);
    
    const checkAtmosphere = () => {
      const hour = new Date().getHours();
      const override = localStorage.getItem("mmbarber_atmosphere_override");
      const tier = document.documentElement.getAttribute('data-graphics-tier');
      
      if (override === "pure_dark") {
          setAtmosphereMode('pure_dark');
          setIsActive(false);
          return;
      }

      let isGalaxy = hour >= 22 || hour < 4;
      if (override === "galaxy") {
          isGalaxy = true;
          setAtmosphereMode('galaxy');
      }
      else if (override === "classic") {
          isGalaxy = false;
          setAtmosphereMode('classic');
      } else {
          setAtmosphereMode(isGalaxy ? 'galaxy' : 'classic');
      }
      
      setIsActive(isGalaxy && tier !== 'low');
    };

    checkAtmosphere();
    window.addEventListener('mmbarber-graphics-update', checkAtmosphere);
    window.addEventListener('mmbarber-atmosphere-update', checkAtmosphere);

    const initStars = () => {
        const stars: Star[] = [];
        // Layer 1: Near (40)
        for (let i = 0; i < 40; i++) {
            stars.push({
                x: Math.random() * 110 - 5,
                y: Math.random() * 110 - 5,
                size: Math.random() * 1.5 + 1,
                opacity: Math.random(),
                maxOpacity: Math.random() * 0.4 + 0.4,
                speed: Math.random() * 0.05 + 0.02,
                layer: 1,
                phase: Math.random() * Math.PI * 2
            });
        }
        // Layer 2: Middle (60)
        for (let i = 0; i < 60; i++) {
            stars.push({
                x: Math.random() * 110 - 5,
                y: Math.random() * 110 - 5,
                size: Math.random() * 1 + 0.5,
                opacity: Math.random(),
                maxOpacity: Math.random() * 0.3 + 0.3,
                speed: Math.random() * 0.03 + 0.01,
                layer: 2,
                phase: Math.random() * Math.PI * 2
            });
        }
        // Layer 3: Far (100)
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * 110 - 5,
                y: Math.random() * 110 - 5,
                size: Math.random() * 0.6 + 0.2,
                opacity: Math.random(),
                maxOpacity: Math.random() * 0.2 + 0.2,
                speed: Math.random() * 0.02 + 0.005,
                layer: 3,
                phase: Math.random() * Math.PI * 2
            });
        }
        starsRef.current = stars;
    };

    initStars();

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60;
      const y = (e.clientY / window.innerHeight - 0.5) * 60;
      mouseRef.current = { x, y };
      mouseX.set((e.clientX - window.innerWidth / 2));
      mouseY.set((e.clientY - window.innerHeight / 2));
    };

    const handleResize = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
                ctx.scale(dpr, dpr);
            }
        }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener('mmbarber-graphics-update', checkAtmosphere);
      window.removeEventListener('mmbarber-atmosphere-update', checkAtmosphere);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isActive || !isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (time: number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const stars = starsRef.current;
        const { x: mx, y: my } = mouseRef.current;
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;

        stars.forEach(star => {
            // Calculate parallax based on layer
            let parallaxX = mx * (star.layer === 1 ? 0.8 : star.layer === 2 ? 0.5 : 0.2);
            let parallaxY = my * (star.layer === 1 ? 0.8 : star.layer === 2 ? 0.5 : 0.2);

            // Twinkle effect
            const twinkle = Math.sin(time * 0.001 * star.speed * 50 + star.phase);
            const currentOpacity = star.maxOpacity * (0.5 + 0.5 * twinkle);

            // Position (x, y are in percent 0-100)
            const posX = (star.x / 100) * w + (parallaxX * (w / 10000));
            const posY = (star.y / 100) * h + (parallaxY * (h / 10000));

            ctx.beginPath();
            if (star.layer === 2) {
                ctx.fillStyle = `rgba(197, 160, 41, ${currentOpacity * 0.8})`; 
            } else if (star.layer === 1) {
                ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.4})`;
            }

            // High quality circles for stars
            ctx.arc(posX, posY, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive, isMounted]);

  if (!isMounted) return null;

  return (
    <div ref={containerRef} className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-1000 ${atmosphereMode === 'pure_dark' ? 'bg-black' : (isActive ? 'bg-black' : 'bg-transparent')}`}>
      <AnimatePresence>
        {isActive && atmosphereMode !== 'pure_dark' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ rotateX, rotateY, perspective: 1000 }}
            className="absolute inset-0 overflow-hidden"
          >
            <canvas 
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />

            {/* Ambient Nebula & Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--color-mafia-gold-rgb),0.05),transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

