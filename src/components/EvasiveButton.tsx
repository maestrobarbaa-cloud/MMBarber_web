"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

interface EvasiveButtonProps {
  onCatch: () => void;
}

export const EvasiveButton = ({ onCatch }: EvasiveButtonProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const controls = useAnimation();
  const { t } = useTranslation();

  useEffect(() => {
    // Initial random position
    setPosition({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    const distanceX = e.clientX - buttonCenterX;
    const distanceY = e.clientY - buttonCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // If mouse is close, move away
    if (distance < 150) {
      const angle = Math.atan2(distanceY, distanceX);
      const pushDistance = 200;
      
      let newX = position.x - Math.cos(angle) * pushDistance;
      let newY = position.y - Math.sin(angle) * pushDistance;

      // Keep within bounds (rough estimate of viewport)
      const maxX = window.innerWidth / 2 - 100;
      const maxY = window.innerHeight / 2 - 100;

      if (Math.abs(newX) > maxX) newX = Math.sign(newX) * (maxX - 50);
      if (Math.abs(newY) > maxY) newY = Math.sign(newY) * (maxY - 50);

      setPosition({ x: newX, y: newY });
      
      controls.start({
        x: newX,
        y: newY,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      });
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      animate={controls}
      initial={{ x: 0, y: 0 }}
      onMouseMove={handleMouseMove}
      onClick={onCatch}
      className="px-12 py-6 bg-mafia-gold text-mafia-black font-heading font-black text-2xl uppercase tracking-[0.3em] border-4 border-white shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)] hover:scale-110 active:scale-95 transition-transform select-none evasive-button-custom"
    >
      {t.footer.neklikat}
    </motion.button>
  );
};
