import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Scissors, GlassWater, Clock, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface BarberAdCardProps {
  onDismiss?: () => void;
  inChat?: boolean;
}

export function BarberAdCard({ onDismiss, inChat = false }: BarberAdCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative w-full overflow-hidden bg-black border ${inChat ? 'border-mafia-gold/30 rounded-xl max-w-sm' : 'border-mafia-gold/50 rounded-2xl h-full shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col'}`}
    >
      <div className={`relative w-full ${inChat ? 'h-32' : 'h-1/2 min-h-[300px]'}`}>
        <Image 
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800" 
          alt="MM Barber Lounge" 
          fill 
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Odznak SPONZOROVÁNO */}
        <div className="absolute top-4 left-4 bg-mafia-gold text-black px-2 py-1 text-[10px] uppercase font-bold tracking-widest rounded flex items-center gap-1">
          <Sparkles size={12} /> Exkluzivní Nabídka
        </div>
      </div>

      <div className={`p-6 flex-1 flex flex-col justify-between ${inChat ? '' : 'relative z-10 -mt-10'}`}>
        <div>
          <h2 className={`font-heading font-black text-mafia-gold uppercase tracking-widest ${inChat ? 'text-lg' : 'text-3xl'} mb-2`}>
            Neobvyklé rande v MM Barber
          </h2>
          <p className="text-white/70 font-mono text-sm leading-relaxed mb-4">
            Proč jít na nudné rande do obyčejné kavárny? Překvapte polovičku VIP zážitkem.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-white/80 text-xs font-mono">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-mafia-gold">
                <GlassWater size={14} />
              </div>
              <span>Prémiové drinky na baru</span>
            </div>
            <div className="flex items-center gap-3 text-white/80 text-xs font-mono">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-mafia-gold">
                <Scissors size={14} />
              </div>
              <span>Společný styling a úprava (volitelné)</span>
            </div>
            <div className="flex items-center gap-3 text-white/80 text-xs font-mono">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-mafia-gold">
                <MapPin size={14} />
              </div>
              <span>Exkluzivní prostředí MM Barber Lounge</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <a href="https://mmbarber.cz/rezervace" target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-mafia-gold text-black text-center font-bold uppercase tracking-widest text-xs rounded hover:bg-white transition-colors">
            Rezervovat termín Rande
          </a>
          {!inChat && onDismiss && (
            <button onClick={onDismiss} className="w-full py-3 border border-white/20 text-white/50 text-center font-bold uppercase tracking-widest text-xs rounded hover:text-white transition-colors">
              Pokračovat ve Swajpování
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
