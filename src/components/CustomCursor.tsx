"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { MousePointer2, Pointer } from "lucide-react";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isLowTier, setIsLowTier] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    
    const tier = document.documentElement.getAttribute('data-graphics-tier');
    setIsLowTier(tier === 'low');
    
    const handleUpdate = () => {
      const newTier = document.documentElement.getAttribute('data-graphics-tier');
      setIsLowTier(newTier === 'low');
    };
    window.addEventListener('mmbarber-graphics-update', handleUpdate);

    // Check if on desktop (custom cursor is usually better on desktop)
    if (window.innerWidth < 1024) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" || 
        target.tagName === "A" || 
        target.tagName === "BUTTON"
      );
      
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener('mmbarber-graphics-update', handleUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  if (!mounted || window.innerWidth < 1024 || isLowTier) return null;

  return (
    <div className="custom-cursor">
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[20000] flex items-center justify-center"
        style={{
          x: mouseX,
          y: mouseY,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div className="relative">
          {isPointer ? (
              <Pointer 
                size={28} 
                fill="var(--user-accent-color)" 
                className="text-mafia-black transition-transform duration-200"
                style={{
                  filter: "drop-shadow(0 0 10px var(--user-glow-color))",
                  transform: "translate(-20%, -10%)"
                }}
              />
          ) : (
            <MousePointer2 
              size={24} 
              fill="black" 
              className="text-mafia-gold transition-transform duration-200"
              style={{ filter: "drop-shadow(0 0 8px var(--user-glow-color))" }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
