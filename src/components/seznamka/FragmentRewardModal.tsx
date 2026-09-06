'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Gift, X } from 'lucide-react';

interface FragmentRewardModalProps {
  isOpen: boolean;
  type: 'DAILY' | 'PROFILE' | 'HIDDEN' | null;
  fragmentsAdded: number;
  currentFragments: number;
  fragmentsPerCoin: number;
  coinsAdded: number;
  onClose: () => void;
}

export function FragmentRewardModal({ isOpen, type, fragmentsAdded, currentFragments, fragmentsPerCoin, coinsAdded, onClose }: FragmentRewardModalProps) {
  if (!isOpen || !type) return null;

  const contentMap = {
    DAILY: {
      title: 'Denní odměna!',
      message: 'Získáváš 1 úlomek MMCoinu za přihlášení. Vrať se zítra pro další!',
      icon: <Gift className="w-12 h-12 text-mafia-gold" />
    },
    PROFILE: {
      title: 'Profil kompletní!',
      message: `Skvělá práce! Za kompletní vyplnění profilu získáváš ${fragmentsAdded} úlomky.`,
      icon: <CheckCircle2 className="w-12 h-12 text-mafia-gold" />
    },
    HIDDEN: {
      title: 'Skrytý úlomek nalezen!',
      message: 'Máš postřeh! Našel jsi schovaný úlomek. Měj oči na stopkách dál.',
      icon: <Sparkles className="w-12 h-12 text-mafia-gold" />
    }
  };

  const content = contentMap[type];

  // Calculate progress safely
  const progress = Math.min(100, Math.max(0, (currentFragments / fragmentsPerCoin) * 100));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: -50 }}
          className="relative bg-neutral-900 border border-mafia-gold/30 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(212,175,55,0.2)]"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex justify-center mb-6">
            <div className="p-4 bg-mafia-gold/10 rounded-full animate-pulse">
              {content.icon}
            </div>
          </div>

          <h2 className="text-2xl font-heading font-black text-white uppercase tracking-widest mb-3">
            {content.title}
          </h2>
          <p className="text-white/70 font-mono text-sm mb-8 leading-relaxed">
            {content.message}
          </p>

          <div className="bg-black/50 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-mono text-white/50 uppercase">Tvůj postup</span>
              <span className="text-lg font-bold text-mafia-gold">
                {currentFragments} / {fragmentsPerCoin}
              </span>
            </div>
            
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-mafia-gold/50 to-mafia-gold"
              />
            </div>
            
            {coinsAdded > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-green-400 font-bold text-sm animate-bounce"
              >
                🎉 Složil jsi nový MMCoin! (+{coinsAdded})
              </motion.div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 py-3 bg-mafia-gold text-black font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-colors"
          >
            Pokračovat
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
