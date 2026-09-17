'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface HiddenFragmentProps {
  onCollect: () => void;
}

export function HiddenFragment({ onCollect }: HiddenFragmentProps) {
  const [position, setPosition] = useState({ top: 'auto', bottom: '6rem', left: 'auto', right: '2rem' });
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    // Generate random coordinates (10% to 85% of screen to avoid edges and headers)
    const randomTop = Math.floor(Math.random() * 75) + 10;
    const randomLeft = Math.floor(Math.random() * 75) + 10;
    setPosition({
      top: `${randomTop}vh`,
      left: `${randomLeft}vw`,
      bottom: 'auto',
      right: 'auto'
    });
    setIsMounted(true);
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMounted || isMobile) return null; // Avoid hydration mismatch and hide on mobile

  return (
    <motion.button
      onClick={onCollect}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -10, 0],
      }}
      transition={{ 
        duration: 0.5,
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      style={position}
      className="fixed z-[9999] w-14 h-14 bg-mafia-gold rounded-full shadow-[0_0_30px_rgba(212,175,55,0.6)] flex items-center justify-center cursor-pointer hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] transition-shadow"
      title="Sebrat skrytý úlomek!"
    >
      <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" style={{ animationDuration: '3s' }} />
      <Sparkles className="text-black w-7 h-7" />
    </motion.button>
  );
}
