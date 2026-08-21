'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Hourglass, Users, ShieldCheck, GlassWater } from 'lucide-react';

export default function QueuePage() {
  const router = useRouter();
  const [position, setPosition] = useState<number | null>(null);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Animace teček
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkQueue = async () => {
      try {
        const res = await fetch('/api/queue/status');
        const data = await res.json();

        if (data.status === 'active') {
          router.push('/seznamka');
        } else if (data.status === 'waiting') {
          setPosition(data.position);
        }
      } catch (err) {
        console.error('Failed to check queue status');
      }
    };

    // Okamžitá první kontrola
    checkQueue();

    // Polling každých 5 sekund
    const poll = setInterval(checkQueue, 5000);
    return () => clearInterval(poll);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-mafia-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-black/60 border border-mafia-gold/20 p-8 rounded-2xl relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full border border-mafia-gold/30 flex items-center justify-center relative">
            <Hourglass size={32} className="text-mafia-gold animate-pulse" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-t-2 border-r-2 border-mafia-gold opacity-50"
            />
          </div>
        </div>

        <h1 className="text-3xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-2">
          Virtuální Čekárna
        </h1>
        <p className="text-white/60 font-mono text-sm leading-relaxed mb-8">
          Kapacita salonu je momentálně naplněna. Dali jsme tě do fronty, aby aplikace zůstala bleskově rychlá pro všechny.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-2 flex justify-center items-center gap-2">
            <Users size={14} /> Tvoje pozice ve frontě
          </p>
          <div className="text-5xl font-black text-white font-heading">
            {position !== null ? position : '-'}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded bg-mafia-gold/10 flex items-center justify-center flex-shrink-0 text-mafia-gold">
              <ShieldCheck size={16} />
            </div>
            <p className="text-xs font-mono text-white/50">Tato stránka se automaticky obnoví, jakmile přijdeš na řadu. Nezavírej ji.</p>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded bg-mafia-gold/10 flex items-center justify-center flex-shrink-0 text-mafia-gold">
              <GlassWater size={16} />
            </div>
            <p className="text-xs font-mono text-white/50">Dopřej si zatím kávu nebo drink. Hned jak někdo odejde, pustíme tě dovnitř.</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-mafia-gold font-mono text-xs uppercase tracking-widest">
          Ověřování kapacity{dots}
        </div>
      </motion.div>
    </div>
  );
}
