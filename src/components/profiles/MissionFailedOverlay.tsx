import { motion } from "framer-motion";

export const MissionFailedOverlay = ({ name, lang }: { name: string, lang: string }) => {
  // Rozložíme jméno na písmena a náhodně některá schováme pro efekt "pozůstatku"
  const chars = name.split('');
  
  return (
    <div className="absolute inset-0 z-50 bg-mafia-black flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Glitch / Grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,0,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.2)_1px,transparent_1px)] bg-[size:20px_20px]" />
      <motion.div 
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 5 }}
        className="absolute inset-0 bg-mafia-red mix-blend-overlay"
      />
      
      {/* Remnant of name */}
      <h3 className="text-3xl xl:text-4xl font-heading font-black uppercase text-white/20 tracking-widest leading-none relative z-10 blur-[1px] mb-12">
        {chars.map((char, i) => (
          <span key={i} className={(i % 3 === 0 || i % 5 === 0) ? "opacity-10" : "opacity-40"}>{char}</span>
        ))}
      </h3>
      
      {/* KIA Stamp */}
      <motion.div 
        initial={{ scale: 2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="border-4 border-mafia-red text-mafia-red text-4xl xl:text-5xl font-heading font-black uppercase tracking-widest p-4 -rotate-12 z-20 drop-shadow-[0_0_20px_rgba(255,0,0,0.6)] bg-mafia-black/50 backdrop-blur-sm text-center"
      >
        {lang === 'cs' ? "MISE SELHALA" : "MISSION FAILED"}
      </motion.div>
      
      {/* Scanline */}
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: "100%" }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="w-full h-1/4 bg-gradient-to-b from-transparent via-mafia-red/10 to-transparent absolute z-30 pointer-events-none"
      />
    </div>
  );
};
