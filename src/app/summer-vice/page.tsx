"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, Unlock, Briefcase, Zap, Skull, Sun, ArrowLeft } from "lucide-react";
import { playSound } from "@/utils/audio";
import { useBarbers } from "@/contexts/BarberContext";

export default function SummerVicePage() {
  const router = useRouter();
  const { barbers } = useBarbers();
  const [step, setStep] = useState<"intro" | "hacking" | "result">("intro");
  const [progress, setProgress] = useState(0);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [glitchCode, setGlitchCode] = useState("");

  useEffect(() => {
    playSound("/sounds/digital_start.mp3", 0.6);
  }, []);

  const handleUnlock = () => {
    playSound("/sounds/reload.mp3", 0.6);
    setStep("hacking");
    let p = 0;
    
    // Select a real barber dynamically
    const availableBarbers = barbers && barbers.length > 0 ? barbers : [
      { id: "tomas", name: "Tomáš", bookingLink: "https://mm.inthechair.com/micka" }
    ];
    
    const winner = availableBarbers[Math.floor(Math.random() * availableBarbers.length)];
    
    // Assign a summer alias
    const aliasMap: Record<string, string> = {
      tomas: "El Jefe del Verano",
      nella: "Vice City Sniper"
    };
    
    setSelectedBarber({
      ...winner,
      summerAlias: aliasMap[winner.id] || "Neonový Syndikát"
    });

    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          playSound("/sounds/success.mp3", 0.8);
          setStep("result");
        }, 500);
      }
      setProgress(p);
      
      // Glitch code effect
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
      let code = "";
      for (let i=0; i<12; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
      setGlitchCode(code);
      
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-sans select-none">
      
      {/* Background Synthwave Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: "linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 255, 0.2) 1px, transparent 1px)",
             backgroundSize: "40px 40px",
             transform: "perspective(500px) rotateX(60deg) translateY(100px) scale(3)",
             transformOrigin: "bottom center"
           }}
      />

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 bg-gradient-to-b from-[#050505] via-transparent to-[#ff00ff]/10" />

      {/* Navigation */}
      <button 
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 md:top-12 md:left-12 z-50 text-[#00ffff] hover:text-[#ff00ff] transition-colors duration-300 flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        <span className="font-mono text-sm tracking-widest uppercase">Zpět do Úkrytu</span>
      </button>

      {/* Main Content */}
      <main className="flex-1 relative z-20 flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          
          {step === "intro" && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="max-w-xl w-full flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 mb-8 relative flex items-center justify-center">
                <Sun size={64} className="text-[#ff00ff] absolute animate-pulse opacity-50" />
                <Briefcase size={48} className="text-[#00ffff] relative z-10" />
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-[0.2em] uppercase" style={{ textShadow: "0 0 20px #ff00ff, 0 0 40px #ff00ff" }}>
                Miamský
                <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] to-[#ff00ff]" style={{ WebkitTextStroke: "1px #fff" }}>
                  Kontraband
                </span>
              </h1>
              
              <p className="text-[#00ffff]/70 font-mono text-sm md:text-base mb-12 tracking-widest leading-relaxed max-w-md">
                RODINA ZACHYTILA NOVOU ZÁSILKU. PŘEDÁNÍ PROBĚHNE V MIAMI. TVŮJ NOVÝ STYL JE ZAMČENÝ UVNITŘ KUFŘÍKU.
              </p>

              <button 
                onClick={handleUnlock}
                className="group relative px-12 py-5 bg-transparent border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black font-black uppercase tracking-[0.3em] transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-[#00ffff] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0" />
                <span className="relative z-10 flex items-center gap-3">
                  <Lock size={18} className="group-hover:hidden" />
                  <Unlock size={18} className="hidden group-hover:block" />
                  ODEMKNOUT ZÁSILKU
                </span>
              </button>
            </motion.div>
          )}

          {step === "hacking" && (
            <motion.div 
              key="hacking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-md flex flex-col items-center"
            >
              <Skull size={64} className="text-[#ff00ff] mb-8 animate-pulse" />
              
              <div className="font-mono text-[#00ffff] text-2xl tracking-widest mb-6">
                DECRYPTING...
              </div>

              <div className="w-full h-2 bg-[#ff00ff]/20 rounded overflow-hidden mb-6">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#00ffff] to-[#ff00ff]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="font-mono text-[#ff00ff] text-xl opacity-70">
                [{glitchCode}]
              </div>
              <div className="text-[#00ffff]/50 text-xs font-mono mt-4">
                BYPASSING CARTEL SECURITY... {Math.floor(progress)}%
              </div>
            </motion.div>
          )}

          {step === "result" && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl w-full flex flex-col items-center text-center bg-black/60 p-8 md:p-16 border border-[#ff00ff]/30 shadow-[0_0_50px_rgba(255,0,255,0.15)] backdrop-blur-md"
            >
              <div className="text-[#00ffff] font-mono text-sm tracking-[0.3em] mb-4">
                KONTRABAND ÚSPĚŠNĚ ODHALEN
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black mb-2 text-white tracking-[0.1em] uppercase drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
                {selectedBarber.summerAlias}
              </h2>
              <div className="text-[#ff00ff] font-mono text-sm tracking-widest mb-10">
                (KRYCÍ JMÉNO PRO: {selectedBarber.name})
              </div>

              <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                <button 
                  onClick={() => {
                    playSound("/sounds/leather.mp3", 0.6);
                    window.open(selectedBarber.bookingLink, "_blank");
                  }}
                  className="px-8 py-4 bg-[#ff00ff] text-white hover:bg-white hover:text-[#ff00ff] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,0,255,0.4)]"
                >
                  <Zap size={18} />
                  PŘEVZÍT ZÁSILKU (REZERVOVAT)
                </button>
                
                <button 
                  onClick={() => {
                    playSound("/sounds/hover.mp3", 0.4);
                    setStep("intro");
                  }}
                  className="px-8 py-4 border border-[#00ffff]/50 text-[#00ffff] hover:bg-[#00ffff]/10 font-black uppercase tracking-[0.2em] transition-all duration-300"
                >
                  ZAHODIT A HLEDAT ZNOVU
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
