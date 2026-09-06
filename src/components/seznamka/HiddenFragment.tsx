'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface HiddenFragmentProps {
  onCollect: () => void;
}

export function HiddenFragment({ onCollect }: HiddenFragmentProps) {
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
      className="fixed bottom-24 right-8 z-[9999] w-14 h-14 bg-mafia-gold rounded-full shadow-[0_0_30px_rgba(212,175,55,0.6)] flex items-center justify-center cursor-pointer hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] transition-shadow"
      title="Sebrat skrytý úlomek!"
    >
      <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" style={{ animationDuration: '3s' }} />
      <Sparkles className="text-black w-7 h-7" />
    </motion.button>
  );
}
