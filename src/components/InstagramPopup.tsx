"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export function InstagramPopup() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [isLowTier, setIsLowTier] = useState(false);
  const INACTIVITY_LIMIT = 30000; // 30 seconds

  useEffect(() => {
    // Check if on mobile - DISABLE popups for mobile per user request
    if (window.innerWidth < 1280) {
      setHasBeenShown(true);
      return;
    }

    // Check if user has already seen the popup in previous sessions
    const previouslyShown = localStorage.getItem('mmbarber_instagram_shown') === 'true';
    if (previouslyShown) {
      setHasBeenShown(true);
    }

    // Check for low graphics tier
    const checkTier = () => {
      const tier = document.documentElement.getAttribute('data-graphics-tier');
      setIsLowTier(tier === 'low');
    };
    checkTier();
    
    // Listen for graphics updates
    window.addEventListener('mmbarber-graphics-update', checkTier);
    return () => window.removeEventListener('mmbarber-graphics-update', checkTier);
  }, []);

  const showPopup = useCallback(() => {
    if (!hasBeenShown) {
      setIsVisible(true);
      setHasBeenShown(true);
      localStorage.setItem('mmbarber_instagram_shown', 'true');
    }
  }, [hasBeenShown]);

  useEffect(() => {
    if (hasBeenShown || isLowTier) return; // Don't set up listeners if already shown or in LOW tier to save resources

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (!isVisible && !hasBeenShown) {
        timeoutId = setTimeout(showPopup, INACTIVITY_LIMIT);
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearTimeout(timeoutId);
    };
  }, [isVisible, hasBeenShown, showPopup, isLowTier]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={isLowTier ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={isLowTier ? { opacity: 0 } : { opacity: 0 }}
            onClick={() => setIsVisible(false)}
            className={`absolute inset-0 bg-black/80 ${isLowTier ? '' : 'backdrop-blur-md'}`}
          />

          {/* Popup Card */}
          <motion.div
            initial={isLowTier ? { opacity: 1, y: 0 } : { scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={isLowTier ? { opacity: 0 } : { scale: 0.9, opacity: 0, y: 10 }}
            className={`relative w-full max-w-md bg-mafia-dark/95 border-2 border-mafia-gold p-10 flex flex-col items-center text-center overflow-hidden ${isLowTier ? '' : 'shadow-[0_0_100px_rgba(197,160,89,0.2)]'}`}
          >
            {/* Cinematic Scanline Overlay - DISABLED IN LOW TIER */}
            {!isLowTier && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                <motion.div 
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-mafia-gold to-transparent"
                />
              </div>
            )}

            {/* Decorative Corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-mafia-gold/40"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-mafia-gold/40"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-mafia-gold/40"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-mafia-gold/40"></div>

            {/* Instagram Icon with Pulsing Glow */}
            <div className="relative mb-8">
              {!isLowTier && (
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-mafia-gold/20 blur-2xl rounded-full"
                />
              )}
              <div className="relative w-20 h-20 border-2 border-mafia-gold flex items-center justify-center bg-mafia-black">
                <Instagram size={40} className="text-mafia-gold" />
              </div>
            </div>

            <h3 className="text-mafia-gold font-heading font-black text-3xl uppercase tracking-wider mb-4 leading-tight">
              Sleduj náš příběh na instagramu!
            </h3>
            
            <div className="mb-10"></div>

            <div className="flex flex-col w-full gap-4">
              <a 
                href="https://www.instagram.com/mmbarber_uherske_hradiste/" 
                target="_blank" 
                rel="noreferrer"
                className="group relative overflow-hidden px-8 py-4 bg-mafia-gold text-mafia-black font-heading font-black text-sm uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10">Otevřít Instagram</span>
              </a>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-mafia-gold/40 hover:text-mafia-gold transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
