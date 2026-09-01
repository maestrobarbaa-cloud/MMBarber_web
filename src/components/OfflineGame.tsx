'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, WifiOff, ShieldAlert } from 'lucide-react';

export function OfflineGame() {
  const [isOffline, setIsOffline] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    // Kontrola při načtení
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
    }

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      setIsPlaying(false);
      setScore(0);
      setTargets([]);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Herní smyčka pro spawnování terčů
  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      if (targets.length < 5) {
        setTargets(prev => [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 80 + 10, // 10% až 90% šířky obrazovky
            y: Math.random() * 70 + 15, // 15% až 85% výšky
          }
        ]);
      }
    }, 1200);

    return () => clearInterval(spawnInterval);
  }, [isPlaying, targets]);

  const handleShoot = (id: number) => {
    setScore(s => s + 100);
    setTargets(prev => prev.filter(t => t.id !== id));
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTargets([]);
  };

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#0a0a0a] flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Background styling to look like a dark alley / shooting range */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[url('/img/noise.png')] pointer-events-none mix-blend-overlay" />

      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-3 text-mafia-red">
          <WifiOff className="w-8 h-8 animate-pulse" />
          <span className="font-bold text-xl uppercase tracking-widest">Spojení ztraceno</span>
        </div>
        {isPlaying && (
          <div className="text-mafia-gold font-bold text-2xl font-mono">
            SKÓRE: {score}
          </div>
        )}
      </div>

      {!isPlaying ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center z-10 max-w-lg px-6"
        >
          <ShieldAlert className="w-20 h-20 text-mafia-gold mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-smoke-white mb-4">
            Ztratili jsme vizuál
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Jsi offline. Pravý mafián ale nezahálí ani když vypadne spojení. Využij tento čas k tréninku přesnosti, než se připojení obnoví.
          </p>
          <button 
            onClick={startGame}
            className="px-8 py-4 bg-mafia-gold text-mafia-black font-bold uppercase tracking-widest rounded hover:bg-white hover:shadow-[0_0_20px_#C5A059] transition-all"
          >
            Začít trénink
          </button>
        </motion.div>
      ) : (
        <div className="relative w-full h-full cursor-crosshair">
          <AnimatePresence>
            {targets.map(target => (
              <motion.div
                key={target.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute flex items-center justify-center group"
                style={{ left: `${target.x}%`, top: `${target.y}%`, transform: 'translate(-50%, -50%)' }}
                onClick={(e) => { e.stopPropagation(); handleShoot(target.id); }}
              >
                <div className="w-16 h-16 bg-mafia-red/10 rounded-full animate-ping absolute" />
                <button className="relative w-12 h-12 bg-black border-2 border-mafia-red rounded-full flex items-center justify-center hover:bg-mafia-red/20 hover:scale-110 transition-all focus:outline-none">
                  <Target className="w-6 h-6 text-mafia-red group-hover:text-white transition-colors" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <div 
            className="absolute inset-0 z-0 cursor-crosshair" 
            onClick={() => {
              if (score > 0) setScore(s => Math.max(0, s - 50)); // Penalizace za minutu
            }} 
          />
        </div>
      )}
    </div>
  );
}
