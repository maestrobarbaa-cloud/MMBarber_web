"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Zap, Home, Eye, Globe, Award, Lock, User, Sparkles, AlertCircle, Radio, Snowflake, Skull, Palette, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export default function CheatSheet() {
  const router = useRouter();
  const { lang } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    // Golden Matrix Matrix Rain Effect
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const columns = Math.floor(width / 25);
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) drops[i] = Math.random() * -100;

    const chars = "MMBARBER0101SECRETKODYVIPBOSSGOLD".split("");

    const draw = () => {
      ctx.fillStyle = "rgba(5, 5, 5, 0.1)";
      ctx.fillRect(0, 0, width, height);

      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-mafia-gold').trim();
      ctx.font = "12px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = Math.random() * 0.5 + 0.1;
        ctx.fillText(text, i * 25, drops[i] * 25);
        ctx.globalAlpha = 1.0;

        if (drops[i] * 25 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const cheats = [
    { code: "vip", desc: lang === "cs" ? "Přímý přístup do utajené sekce Stará Republika" : "Direct access to the classified Old Republic section", type: "access", icon: Lock },
    { code: "dev", desc: lang === "cs" ? "Otevření vývojářské konzole pro ovládání reality" : "Open developer console for reality manipulation", type: "system", icon: Terminal },
    { code: "legacy", desc: lang === "cs" ? "Aktivace vzácného režimu zakladatele (8. prosince)" : "Activate rare Founder mode (observed on Dec 8th)", type: "access", icon: Award },
    { code: "earth", desc: lang === "cs" ? "Spuštění globálního sledovacího protokolu Země" : "Initiate Earth global tracking protocol", type: "system", icon: Globe },
    { code: "normal", desc: lang === "cs" ? "Návrat vizuální reality do výchozího stavu" : "Reset visual reality to default state", type: "system", icon: Home },
    { code: "radio", desc: lang === "cs" ? "Manuální aktivace MM Radia mimo vysílací čas" : "Manual activation of MM Radio outside broadcast hours", type: "system", icon: Radio },
    { code: "hry", desc: lang === "cs" ? "Zviditelnění miniher mimo plánované události" : "Reveal minigames outside of scheduled events", type: "system", icon: Zap },
    { code: "matrix", desc: lang === "cs" ? "Digitální dekonstrukce webu v kódu Matrixu" : "Digital deconstruction of the site in Matrix code", type: "filter", icon: Eye },
    { code: "crt", desc: lang === "cs" ? "Simulace analogového monitoru se skenovacími řádky" : "Analog monitor simulation with scan lines", type: "filter", icon: Terminal },
    { code: "pixel", desc: lang === "cs" ? "Retro pixelová fragmentace celého rozhraní" : "Retro pixel fragmentation of the interface", type: "filter", icon: Sparkles },
    { code: "chaos", desc: lang === "cs" ? "Maximální vizuální entropie a glitch efekty" : "Maximum visual entropy and glitch effects", type: "filter", icon: Zap },
    { code: "valentine", desc: lang === "cs" ? "Atmosféra zaměřená na úctu a respekt (Love)" : "Atmosphere focused on honor and respect (Love)", type: "filter", icon: User },
    { code: "patrik", desc: lang === "cs" ? "Smaragdová záře a poletující čtyřlístky pro štěstí" : "Emerald glow and lucky floating four-leaf clovers", type: "filter", icon: Sparkles },
    { code: "halloween", desc: lang === "cs" ? "Spektrální vizualizace a stíny podsvětí" : "Spectral visualization and underworld shadows", type: "filter", icon: AlertCircle },
    { code: "christmas", desc: lang === "cs" ? "Zimní nálada s padajícím sněhem a jehličím" : "Winter mood with falling snow and pine needles", type: "filter", icon: Snowflake },
    { code: "czech", desc: lang === "cs" ? "Protokol v barvách národní hrdosti" : "National pride color protocol", type: "filter", icon: Globe },
    { code: "secret", desc: lang === "cs" ? "Hluboké stíny exkluzivního Noir schématu" : "Deep shadows of exclusive Noir scheme", type: "filter", icon: Eye },
    { code: "uživatel", desc: lang === "cs" ? "Přístup k nastavení vlastního vzhledu webu" : "Access to custom website appearance settings", type: "system", icon: Palette },
    { code: "friday13", desc: lang === "cs" ? "Hororová atmosféra prokletého pátku třináctého" : "Horror atmosphere of the cursed Friday the 13th", type: "filter", icon: Skull },
    { code: "carodejnice", desc: lang === "cs" ? "Plameny purifikace a mystická noc čarodějnic" : "Flames of purification and mystical witches' night", type: "filter", icon: Flame },
    { code: "boss", desc: lang === "cs" ? "Protokol Capo di Tutti Capi – mluv jako šéf rodiny" : "Capo di Tutti Capi protocol – speak like the family boss", type: "system", icon: User },
    { code: "victory", desc: lang === "cs" ? "Slavnostní zlatý protokol ke Dni vítězství" : "Triumphant golden protocol for Victory Day", type: "filter", icon: Award },
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-6 relative overflow-hidden font-sans">
      {/* Golden Matrix Rain Background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-20 pointer-events-none" />
      
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-50 pointer-events-none bg-[size:100%_4px,3px_100%]" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header HUD Element */}
        <div className="flex flex-col items-center mb-12">
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-16 h-16 border-2 border-mafia-gold flex items-center justify-center mb-8 bg-mafia-gold/10 backdrop-blur-xl shadow-[0_0_30px_rgba(197,160,89,0.3)]"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          >
            <Zap className="text-mafia-gold" size={28} />
          </motion.div>

          <h1 className="text-5xl md:text-8xl font-heading font-black text-white tracking-widest uppercase mb-6 text-center">
            {lang === "cs" ? "SYSTÉMOVÉ " : "SYSTEM "} 
            <span className="text-mafia-gold drop-shadow-[0_0_20px_rgba(197,160,89,0.5)]">
              {lang === "cs" ? "KÓDY" : "CODES"}
            </span>
          </h1>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent to-mafia-gold"></div>
            <span className="text-mafia-gold font-mono text-xs uppercase tracking-[0.5em] font-black animate-pulse">
              ENCRYPTION_ACTIVE
            </span>
            <div className="h-[2px] w-24 bg-gradient-to-l from-transparent to-mafia-gold"></div>
          </div>
        </div>

        {/* Main Console Interface */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border-2 border-mafia-gold/20 shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden">
          
          {/* Header Bar */}
          <div className="grid grid-cols-12 bg-mafia-gold/10 border-b border-mafia-gold/20 py-6 px-8 items-center">
            <div className="col-span-12 md:col-span-4 flex items-center gap-3">
              <Terminal size={14} className="text-mafia-gold" />
              <span className="text-[10px] font-mono font-black text-mafia-gold uppercase tracking-[0.3em]">DIRECTORY / ROOT / CHEATS</span>
            </div>
            <div className="hidden md:block col-span-8 text-right">
              <span className="text-[10px] font-mono font-bold text-mafia-gold/40 uppercase tracking-widest italic leading-none">
                MMBARBER_OS_VERSION_3.0_GOLDEN_GATE
              </span>
            </div>
          </div>

          {/* List Area */}
          <div className="divide-y divide-mafia-gold/10">
            {cheats.map((cheat, i) => (
              <motion.div 
                key={cheat.code} 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group grid grid-cols-12 items-center py-8 md:py-10 px-8 hover:bg-mafia-gold/[0.03] transition-all duration-500 cursor-default relative"
              >
                {/* Visual indicator on hover */}
                {hoveredIndex === i && (
                  <motion.div 
                    layoutId="hover-border"
                    className="absolute left-0 w-1.5 h-full bg-mafia-gold shadow-[0_0_15px_rgba(197,160,89,1)]"
                  />
                )}

                <div className="col-span-12 md:col-span-4 flex items-center gap-8 mb-6 md:mb-0">
                  <div className={`w-14 h-14 border-2 flex items-center justify-center transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${cheat.type === 'access' ? 'border-mafia-red bg-mafia-red/10' : 'border-mafia-gold bg-mafia-gold/10'} group-hover:scale-110 group-hover:rotate-[360deg]`}>
                    <cheat.icon size={28} className={cheat.type === 'access' ? 'text-mafia-red' : 'text-mafia-gold'} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-black text-mafia-gold/40 uppercase mb-1 tracking-widest">COMMAND_KEY</span>
                    <span 
                      className={`font-mono font-black tracking-[0.3em] uppercase text-2xl md:text-4xl ${cheat.type === 'access' ? 'text-mafia-red' : 'text-white group-hover:text-mafia-gold'} transition-colors duration-500`}
                      style={{ textShadow: hoveredIndex === i ? `0 0 20px currentColor` : 'none' }}
                    >
                      {cheat.code}
                    </span>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-8 flex flex-col items-start md:pl-8">
                   <div className="text-[10px] font-mono font-black text-smoke-white/20 uppercase mb-2 tracking-widest">DESCRIPTION</div>
                   <p className="text-base md:text-xl text-smoke-white/70 font-sans font-bold leading-snug group-hover:text-white transition-colors">
                     {cheat.desc}
                   </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Bar */}
          <div className="bg-mafia-gold/5 py-4 px-8 border-t border-mafia-gold/20 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-mafia-gold animate-pulse"></div>
                <span className="text-[8px] font-mono text-mafia-gold/60 uppercase font-black">SYSTEM_STABLE: OK</span>
             </div>
             <div className="text-[8px] font-mono text-mafia-gold/30 uppercase max-w-xs text-center md:text-right">
                Authorized use only. Unauthorized attempts to manipulate reality will be logged and analyzed.
             </div>
          </div>
        </div>

        {/* Back and Status buttons */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8">
          <button 
            onClick={() => router.push("/")}
            className="group relative overflow-hidden bg-white text-mafia-black px-12 py-4 font-heading font-black uppercase tracking-[0.3em] text-sm md:text-base border-2 border-white hover:bg-transparent hover:text-white transition-all duration-500"
          >
            <div className="flex items-center gap-3 relative z-10">
              <Home size={18} />
              {lang === "cs" ? "ÚSTŘEDNÍ TERMINÁL" : "CENTRAL TERMINAL"}
            </div>
          </button>

          <div className="flex items-center gap-4 text-mafia-gold/40 font-mono text-xs uppercase tracking-widest">
            <span className="animate-pulse">LOCATING_USER...</span>
            <div className="w-16 h-[1px] bg-mafia-gold/20"></div>
            <span className="font-black text-mafia-gold">SCAN_COMPLETE</span>
          </div>
        </div>
      </div>

      {/* Decorative corners HUD */}
      <div className="fixed top-6 left-6 w-32 h-32 border-t-4 border-l-4 border-mafia-gold/10 pointer-events-none z-50"></div>
      <div className="fixed top-6 right-6 w-32 h-32 border-t-4 border-r-4 border-mafia-gold/10 pointer-events-none z-50"></div>
      <div className="fixed bottom-6 left-6 w-32 h-32 border-b-4 border-l-4 border-mafia-gold/10 pointer-events-none z-50"></div>
      <div className="fixed bottom-6 right-6 w-32 h-32 border-b-4 border-r-4 border-mafia-gold/10 pointer-events-none z-50"></div>
    </main>
  );
}
