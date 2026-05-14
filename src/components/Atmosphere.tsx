"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export function Atmosphere() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [starsLayer1, setStarsLayer1] = useState<Star[]>([]);
  const [starsLayer2, setStarsLayer2] = useState<Star[]>([]);
  const [starsLayer3, setStarsLayer3] = useState<Star[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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
      
      let isGalaxy = hour >= 22 || hour < 4;
      if (override === "galaxy") isGalaxy = true;
      else if (override === "classic") isGalaxy = false;
      
      setIsActive(isGalaxy && tier !== 'low');
    };

    checkAtmosphere();
    window.addEventListener('mmbarber-graphics-update', checkAtmosphere);
    window.addEventListener('mmbarber-atmosphere-update', checkAtmosphere);

    const generateStars = (count: number) => {
      return [...Array(count)].map(() => ({
        id: Math.random(),
        top: Math.random() * 100 + "%",
        left: Math.random() * 100 + "%",
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5
      }));
    };

    setStarsLayer1(generateStars(80)); // Near
    setStarsLayer2(generateStars(120)); // Middle
    setStarsLayer3(generateStars(200)); // Far

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60;
      const y = (e.clientY / window.innerHeight - 0.5) * 60;
      setMousePos({ x, y });
      mouseX.set((e.clientX - window.innerWidth / 2));
      mouseY.set((e.clientY - window.innerHeight / 2));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener('mmbarber-graphics-update', checkAtmosphere);
      window.removeEventListener('mmbarber-atmosphere-update', checkAtmosphere);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-1000 ${isActive ? 'bg-black' : 'bg-transparent'}`}>
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ rotateX, rotateY, perspective: 1000 }}
            className="absolute inset-0 overflow-hidden"
          >
            {/* Layer 3: Far Stars (Smallest, Slowest Parallax) */}
            <motion.div 
              style={{ x: mousePos.x * 0.2, y: mousePos.y * 0.2 }}
              className="absolute inset-[-100px] pointer-events-none opacity-30"
            >
              {starsLayer3.map((star) => (
                <motion.div
                  key={star.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5] }}
                  transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
                  className="absolute rounded-full bg-white blur-[0.5px]"
                  style={{
                    top: star.top,
                    left: star.left,
                    width: star.size * 0.5 + "px",
                    height: star.size * 0.5 + "px",
                  }}
                />
              ))}
            </motion.div>

            {/* Layer 2: Middle Stars */}
            <motion.div 
              style={{ x: mousePos.x * 0.5, y: mousePos.y * 0.5 }}
              className="absolute inset-[-100px] pointer-events-none opacity-50"
            >
              {starsLayer2.map((star) => (
                <motion.div
                  key={star.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5] }}
                  transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
                  className="absolute rounded-full bg-mafia-gold/40 blur-[1px]"
                  style={{
                    top: star.top,
                    left: star.left,
                    width: star.size + "px",
                    height: star.size + "px",
                    boxShadow: "0 0 10px rgba(var(--color-mafia-gold-rgb), 0.3)"
                  }}
                />
              ))}
            </motion.div>

            {/* Layer 1: Near Stars (Largest, Strongest Parallax) */}
            <motion.div 
              style={{ x: mousePos.x * 0.8, y: mousePos.y * 0.8 }}
              className="absolute inset-[-100px] pointer-events-none opacity-60"
            >
              {starsLayer1.map((star) => (
                <motion.div
                  key={star.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5] }}
                  transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
                  className="absolute rounded-full bg-white blur-[1.5px]"
                  style={{
                    top: star.top,
                    left: star.left,
                    width: star.size * 1.5 + "px",
                    height: star.size * 1.5 + "px",
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.4)"
                  }}
                />
              ))}
            </motion.div>

            {/* Ambient Nebula & Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--color-mafia-gold-rgb),0.05),transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
