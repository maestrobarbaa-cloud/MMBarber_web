"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile } from 'lucide-react';
import EmojiPickerReact, { Theme } from 'emoji-picker-react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  direction?: 'up' | 'down';
  className?: string;
  isDark?: boolean;
}

export function EmojiPicker({ onSelect, direction = 'up', className = '', isDark = false }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-colors ${isOpen ? (isDark ? 'bg-mafia-red/20 text-mafia-red' : 'bg-mafia-gold/20 text-mafia-gold') : 'text-white/50 hover:text-white'}`}
      >
        <Smile size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)}></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: direction === 'up' ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: direction === 'up' ? 10 : -10 }}
              transition={{ duration: 0.15 }}
              className={`absolute z-[9999] shadow-2xl origin-bottom-left ${
                direction === 'up' ? 'bottom-full mb-2 left-0' : 'top-full mt-2 left-0'
              }`}
            >
               <EmojiPickerReact 
                 onEmojiClick={(emojiData) => {
                   onSelect(emojiData.emoji);
                 }}
                 theme={Theme.DARK}
                 searchDisabled={false}
                 skinTonesDisabled={false}
                 previewConfig={{ showPreview: false }}
                 lazyLoadEmojis={true}
                 searchPlaceHolder="Hledat emoji..."
               />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
