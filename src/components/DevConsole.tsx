"use client";

import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Settings, RefreshCw, X, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DevConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalCollected, resetProgress, isTomasUnlocked, isNellaUnlocked } = useGame();

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[9999] bg-mafia-black/80 border border-mafia-gold/30 text-mafia-gold/50 hover:text-mafia-gold p-2 rounded shadow-[0_0_10px_rgba(197,160,89,0.2)] transition-colors opacity-30 hover:opacity-100"
        title="Developer Console"
      >
        <Settings size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-16 left-4 z-[9999] bg-mafia-black border-2 border-mafia-gold/50 shadow-[0_0_30px_rgba(197,160,89,0.3)] rounded-lg p-5 w-72 font-mono"
          >
            <div className="flex justify-between items-center mb-4 border-b border-mafia-gold/30 pb-2">
              <h3 className="text-mafia-gold font-bold flex items-center gap-2">
                <Settings size={16} /> DEV CONSOLE
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs text-smoke-white">
              <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                <span className="flex items-center gap-2"><Fingerprint size={14} className="text-mafia-gold"/> Collected:</span>
                <span className="font-bold text-mafia-gold">{totalCollected}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Tomáš Unlocked:</span>
                  <span className={isTomasUnlocked ? "text-green-500" : "text-red-500"}>
                    {isTomasUnlocked ? "YES" : "NO"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Nella Unlocked:</span>
                  <span className={isNellaUnlocked ? "text-green-500" : "text-red-500"}>
                    {isNellaUnlocked ? "YES" : "NO"}
                  </span>
                </div>
              </div>

              <button 
                onClick={async () => {
                  await resetProgress();
                }}
                className="w-full mt-4 bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-500/50 py-2 rounded flex items-center justify-center gap-2 transition-colors font-bold uppercase tracking-widest"
              >
                <RefreshCw size={14} />
                Reset Progress
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
