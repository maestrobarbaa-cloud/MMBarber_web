"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile } from 'lucide-react';

const EMOJI_CATEGORIES = {
  "Smajlíci": ["😊", "😂", "🥰", "😎", "🤔", "😅", "😭", "😍", "🙏", "💪", "👍", "🔥", "✨", "💯", "🎉", "👀", "👏", "🙌", "🤌", "🤝", "🤬", "🤯", "🥶", "🥸"],
  "Barber": ["✂️", "💈", "💇", "👑", "🎩", "🤫", "💼", "💰", "🔪", "🩸", "🪒", "🧴", "🪞", "🧽"],
  "Ostatní": ["🚗", "🚀", "💀", "👻", "👽", "🤖", "⭐", "🌙", "⚡", "❤️", "💔", "💣", "🎮", "🎲", "🏆"]
};

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  direction?: 'up' | 'down';
  className?: string;
  isDark?: boolean;
}

export function EmojiPicker({ onSelect, direction = 'up', className = '', isDark = false }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>("Smajlíci");

  return (
    <div className={`relative ${className}`}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-colors ${isOpen ? (isDark ? 'bg-mafia-red/20 text-mafia-red' : 'bg-mafia-gold/20 text-mafia-gold') : 'text-gray-400 hover:text-white'}`}
      >
        <Smile size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click outside backdrop */}
            <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)}></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: direction === 'up' ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: direction === 'up' ? 10 : -10 }}
              transition={{ duration: 0.15 }}
              className={`absolute z-[101] w-[280px] rounded-xl border backdrop-blur-xl shadow-2xl overflow-hidden ${
                direction === 'up' ? 'bottom-full mb-2 left-0 md:-left-1/2' : 'top-full mt-2 left-0'
              } ${isDark ? 'bg-black/90 border-mafia-red/30' : 'bg-black/90 border-mafia-gold/30'}`}
            >
                {/* Categories Tabs */}
                <div className={`flex border-b text-[10px] uppercase font-bold tracking-wider ${isDark ? 'border-mafia-red/20' : 'border-mafia-gold/20'}`}>
                  {Object.keys(EMOJI_CATEGORIES).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat as keyof typeof EMOJI_CATEGORIES)}
                      className={`flex-1 py-2 transition-colors ${activeCategory === cat ? (isDark ? 'bg-mafia-red/20 text-white' : 'bg-mafia-gold/20 text-white') : 'text-white/40 hover:bg-white/5'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Emoji Grid */}
                <div className="grid grid-cols-6 gap-2 p-3 max-h-48 overflow-y-auto custom-scrollbar">
                  {EMOJI_CATEGORIES[activeCategory].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        onSelect(emoji);
                        setIsOpen(false);
                      }}
                      className={`text-xl hover:scale-125 transition-transform flex items-center justify-center p-1 rounded-md ${isDark ? 'hover:bg-mafia-red/20' : 'hover:bg-mafia-gold/20'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
