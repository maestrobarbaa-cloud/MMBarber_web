"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Play, User, Heart, Clock, ShieldCheck, Zap, MessageCircleHeart, Crown, Share2, RotateCcw, X } from "lucide-react";
import { playSound } from "@/utils/audio";

// Deterministic Hash Function
function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function cyrb128(str: string) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return (h1^h2^h3^h4) >>> 0;
}

type Person = { name: string, dob: string, gender: string };

export default function ValentynMatch() {
  const router = useRouter();
  
  const [step, setStep] = useState(0);
  
  const [personA, setPersonA] = useState<Person>({ name: "", dob: "", gender: "muž" });
  const [personB, setPersonB] = useState<Person>({ name: "", dob: "", gender: "žena" });
  
  const [durationKnown, setDurationKnown] = useState("1–3 roky");
  const [durationRel, setDurationRel] = useState("3–12 měsíců");
  const [relStatus, setRelStatus] = useState("zamilovaný");
  
  const [results, setResults] = useState<any>(null);
  
  const [graphicsTier, setGraphicsTier] = useState("low");
  useEffect(() => {
    setGraphicsTier(localStorage.getItem('mmbarber_graphics') || 'low');
  }, []);
  
  // Animation states
  const [roulettePhase, setRoulettePhase] = useState(-1);
  // -1 = Not started, 0 = Global spin, 1 = Chemistry, 2 = Attraction, 3 = Synergy, 4 = Communication, 5 = Compatibility, 6 = Conflict, 7 = Stability, 8 = Long-Term, 9 = Final
  
  const handleCalculate = () => {
    playSound("/sounds/terminal_beep.mp3", 0.5);
    // Generate deterministic hash string
    const normalizedA = personA.name.toLowerCase().trim() + personA.dob;
    const normalizedB = personB.name.toLowerCase().trim() + personB.dob;
    // Sort to make it symmetrical (A+B = B+A)
    const combinedStr = [normalizedA, normalizedB].sort().join("|") + durationKnown + durationRel + relStatus;
    
    const seed = cyrb128(combinedStr);
    const rand = mulberry32(seed);
    
    const genScore = (min: number, max: number, boost: number = 0) => {
        let score = Math.floor(rand() * (max - min + 1)) + min + boost;
        return Math.min(100, Math.max(0, score));
    };

    let baseMin = 40;
    let baseMax = 95;
    let stabBoost = 0;
    
    if (durationRel === "3–5 let" || durationRel === "více než 5 let") stabBoost += 10;
    if (relStatus === "komplikovaný" || relStatus === "bouřlivý") baseMin -= 20;
    if (relStatus === "zamilovaný") baseMax += 5;

    const scores = {
        chemistry: genScore(baseMin, baseMax),
        attraction: genScore(baseMin, baseMax),
        synergy: genScore(baseMin, baseMax),
        communication: genScore(baseMin, baseMax),
        compatibility: genScore(baseMin, baseMax),
        conflict: genScore(20, 80), // Conflict is independent
        stability: genScore(baseMin, baseMax, stabBoost),
        longTerm: genScore(baseMin, baseMax, stabBoost)
    };
    
    // Total is weighted average
    const total = Math.round(
        (scores.chemistry * 0.15) + 
        (scores.attraction * 0.15) + 
        (scores.synergy * 0.15) + 
        (scores.compatibility * 0.20) + 
        (scores.stability * 0.15) + 
        (scores.longTerm * 0.20)
    );
    
    setResults({ ...scores, total });
    setStep(4);
    
    // Start Animation Sequence
    setTimeout(() => setRoulettePhase(0), 500); // Big spin
    setTimeout(() => { setRoulettePhase(1); playSound("/sounds/success.mp3", 0.3); }, 3500);
    setTimeout(() => { setRoulettePhase(2); playSound("/sounds/success.mp3", 0.3); }, 5000);
    setTimeout(() => { setRoulettePhase(3); playSound("/sounds/success.mp3", 0.3); }, 6500);
    setTimeout(() => { setRoulettePhase(4); playSound("/sounds/success.mp3", 0.3); }, 8000);
    setTimeout(() => { setRoulettePhase(5); playSound("/sounds/success.mp3", 0.3); }, 9500);
    setTimeout(() => { setRoulettePhase(6); playSound("/sounds/success.mp3", 0.3); }, 11000);
    setTimeout(() => { setRoulettePhase(7); playSound("/sounds/success.mp3", 0.3); }, 12500);
    setTimeout(() => { setRoulettePhase(8); playSound("/sounds/success.mp3", 0.3); }, 14000);
    setTimeout(() => { setRoulettePhase(9); playSound("/sounds/cinematic_boom.mp3", 0.8); }, 16000); // Final reveal
  };

  const getVerdict = (total: number) => {
      if (total < 30) return "VELMI NEJISTÁ KOMBINACE";
      if (total < 45) return "KOMPLIKOVANÉ SPOJENÍ";
      if (total < 60) return "MÁTE NA ČEM STAVĚT";
      if (total < 75) return "DOBRÁ VZTAHOVÁ SOUHRA";
      if (total < 90) return "SILNÁ KOMPATIBILITA";
      return "MIMOŘÁDNĚ SILNÉ SPOJENÍ";
  };
  
  const getCharacteristic = (res: any) => {
      if (res.chemistry > 85 && res.attraction > 85) return "Mezi vámi je výrazná jiskra a silná vzájemná přitažlivost.";
      if (res.stability > 80 && res.longTerm > 80) return "Váš vztah má vynikající základ pro dlouhodobou stabilitu a budování budoucnosti.";
      if (res.conflict > 70 && res.chemistry > 80) return "Silná chemie může být zároveň zdrojem bouřlivějších střetů. Vášeň je obousečná zbraň.";
      if (res.synergy > 85) return "Vaší největší zbraní je schopnost vzájemně se doplňovat a fungovat jako tým.";
      if (res.communication < 50) return "Potenciál tam je, ale musíte zapracovat na otevřenější komunikaci a naslouchání.";
      if (res.total > 70) return "Tohle spojení dává obrovský smysl. Hrajete stejnou ligu.";
      return "Každý vztah vyžaduje práci. Jste na začátku cesty.";
  };

  const renderFormPerson = (p: Person, setP: (p: Person) => void, num: string) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md mx-auto space-y-6">
        <h2 className="text-3xl font-heading font-black text-mafia-gold uppercase text-center mb-8">Osoba {num}</h2>
        <div className="space-y-4">
            <div>
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">Jméno / Přezdívka</label>
                <input type="text" value={p.name} onChange={(e) => setP({...p, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-mafia-gold outline-none rounded font-bold" />
            </div>
            <div>
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">Datum narození</label>
                <input type="date" value={p.dob} onChange={(e) => setP({...p, dob: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-mafia-gold outline-none rounded font-bold" style={{ colorScheme: 'dark' }} />
            </div>
            <div>
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">Pohlaví</label>
                <select value={p.gender} onChange={(e) => setP({...p, gender: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-mafia-gold outline-none rounded font-bold appearance-none cursor-pointer">
                    <option value="muž">Muž</option>
                    <option value="žena">Žena</option>
                    <option value="jiné">Jiné</option>
                    <option value="nechci uvést">Nechci uvést</option>
                </select>
            </div>
        </div>
        <button onClick={() => { playSound("/sounds/click.mp3", 0.5); setStep(step + 1); }} disabled={!p.name || !p.dob} className="w-full mt-8 py-5 bg-mafia-gold text-black font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3">
            Pokračovat <Play size={16} />
        </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      <button onClick={() => { playSound("/sounds/click.mp3", 0.5); window.location.href = "/"; }} className="absolute top-6 right-6 z-[9999] text-white/50 hover:text-white transition-colors cursor-pointer bg-black/50 p-2 rounded-full border border-white/10 hover:border-white/30 backdrop-blur-md">
          <X size={24} />
      </button>
      {/* Background Decor */}
      {graphicsTier !== 'lite' && (
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] bg-mafia-gold/20"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] bg-mafia-red/20"></div>
         {(graphicsTier === 'high' || graphicsTier === 'ultra') && (
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
         )}
      </div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
            <motion.div key="intro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -50 }} className="text-center z-10 max-w-2xl">
                <div className="w-20 h-20 mx-auto border-2 border-mafia-gold/30 rounded-full flex items-center justify-center mb-6 bg-mafia-gold/5 shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                    <Heart className="text-mafia-gold" size={32} />
                </div>
                <h1 className="text-5xl md:text-7xl font-heading font-black text-white uppercase tracking-[0.1em] mb-4 drop-shadow-2xl text-shadow-glow-gold">
                    Vztahová <span className="text-mafia-gold">Ruleta</span>
                </h1>
                <p className="text-lg md:text-xl text-white/60 font-medium mb-12">Zjistěte, jak moc vám to spolu klape.<br/><span className="text-sm font-mono opacity-50 block mt-2">Dva lidé. Několik údajů. Jeden výsledek.</span></p>
                <button onClick={() => { playSound("/sounds/digital_start.mp3", 0.5); setStep(1); }} className="px-10 py-5 bg-mafia-gold text-black font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-[0_0_40px_rgba(197,160,89,0.4)] flex items-center justify-center gap-3 mx-auto">
                    Spustit Ruletu <Play size={20} />
                </button>
            </motion.div>
        )}

        {step === 1 && ( <div key="step1" className="z-10 w-full">{renderFormPerson(personA, setPersonA, "A")}</div> )}
        {step === 2 && ( <div key="step2" className="z-10 w-full">{renderFormPerson(personB, setPersonB, "B")}</div> )}
        
        {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md mx-auto space-y-6 z-10">
                <h2 className="text-3xl font-heading font-black text-mafia-gold uppercase text-center mb-8">Detaily Spojení</h2>
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">Jak dlouho se znáte?</label>
                        <select value={durationKnown} onChange={(e) => setDurationKnown(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-mafia-gold outline-none rounded font-bold cursor-pointer appearance-none">
                            <option>méně než měsíc</option><option>1–6 měsíců</option><option>6–12 měsíců</option>
                            <option>1–3 roky</option><option>3–5 let</option><option>více než 5 let</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">Jak dlouho jste spolu?</label>
                        <select value={durationRel} onChange={(e) => setDurationRel(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-mafia-gold outline-none rounded font-bold cursor-pointer appearance-none">
                            <option>ještě spolu nejsme</option><option>méně než 3 měsíce</option><option>3–12 měsíců</option>
                            <option>1–3 roky</option><option>3–5 let</option><option>více než 5 let</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">Jak byste váš vztah popsali?</label>
                        <select value={relStatus} onChange={(e) => setRelStatus(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-mafia-gold outline-none rounded font-bold cursor-pointer appearance-none">
                            <option>čerstvý</option><option>zamilovaný</option><option>stabilní</option>
                            <option>komplikovaný</option><option>bouřlivý</option><option>přátelský</option><option>zatím nevíme</option>
                        </select>
                    </div>
                </div>
                <button onClick={handleCalculate} className="w-full mt-8 py-5 bg-white text-black font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3">
                    Roztočit Ruletu <Zap size={16} />
                </button>
            </motion.div>
        )}

        {step === 4 && roulettePhase < 9 && (
            <motion.div key="roulette" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-20 bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.1)_0%,transparent_60%)] animate-pulse-slow"></div>
                <h3 className="absolute top-12 text-sm font-mono text-white/40 uppercase tracking-[0.5em] animate-pulse">Vztahová Ruleta</h3>
                
                {/* Giant Roulette Wheel Representation */}
                <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center">
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: roulettePhase === 0 ? 0.5 : 2, repeat: Infinity, ease: roulettePhase === 0 ? "linear" : "easeOut" }}
                        className="absolute inset-0 border-[40px] md:border-[60px] border-dashed border-mafia-gold/20 rounded-full"
                    />
                    <motion.div 
                        animate={{ rotate: -360 }} 
                        transition={{ duration: roulettePhase === 0 ? 0.8 : 3, repeat: Infinity, ease: roulettePhase === 0 ? "linear" : "easeOut" }}
                        className="absolute inset-8 border-[20px] md:border-[30px] border-dotted border-white/10 rounded-full"
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
                        {roulettePhase === 0 && <span className="text-6xl md:text-8xl font-black font-mono text-mafia-gold blur-[2px] animate-pulse">***</span>}
                        {roulettePhase > 0 && (
                            <motion.div key={roulettePhase} initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }} animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} className="text-center">
                                <span className="text-[10px] md:text-sm font-mono text-white/50 uppercase tracking-widest block mb-2">
                                    {roulettePhase === 1 && "Chemie"}
                                    {roulettePhase === 2 && "Přitažlivost"}
                                    {roulettePhase === 3 && "Souhra"}
                                    {roulettePhase === 4 && "Komunikace"}
                                    {roulettePhase === 5 && "Kompatibilita"}
                                    {roulettePhase === 6 && "Konfliktní potenciál"}
                                    {roulettePhase === 7 && "Stabilita"}
                                    {roulettePhase === 8 && "Dlouhodobý potenciál"}
                                </span>
                                <span className="text-7xl md:text-9xl font-black font-mono text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                                    {roulettePhase === 1 && results.chemistry}
                                    {roulettePhase === 2 && results.attraction}
                                    {roulettePhase === 3 && results.synergy}
                                    {roulettePhase === 4 && results.communication}
                                    {roulettePhase === 5 && results.compatibility}
                                    {roulettePhase === 6 && results.conflict}
                                    {roulettePhase === 7 && results.stability}
                                    {roulettePhase === 8 && results.longTerm}
                                    <span className="text-3xl md:text-5xl text-mafia-gold">%</span>
                                </span>
                            </motion.div>
                        )}
                    </div>
                </div>
                
                <p className="absolute bottom-12 text-xs font-mono text-mafia-gold/60 uppercase tracking-widest">
                    Měříme vaši kompatibilitu...
                </p>
            </motion.div>
        )}

        {step === 4 && roulettePhase === 9 && (
            <motion.div key="results" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="z-30 w-full max-w-2xl mx-auto flex flex-col items-center py-10 relative">
                
                <h4 className="text-[10px] font-mono text-mafia-gold/50 uppercase tracking-[0.4em] mb-4">Vztahová Ruleta Dotočila</h4>
                
                <div className="flex items-center gap-4 text-2xl md:text-4xl font-heading font-black uppercase mb-10">
                    <span className="text-white">{personA.name}</span>
                    <Heart className="text-mafia-red animate-pulse" fill="currentColor" size={24} />
                    <span className="text-white">{personB.name}</span>
                </div>

                <div className="relative mb-12">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.5 }} className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-mafia-gold/30 flex flex-col items-center justify-center bg-black/50 shadow-[0_0_60px_rgba(197,160,89,0.3)] backdrop-blur-xl relative z-10">
                        <span className="text-6xl md:text-8xl font-black font-mono text-mafia-gold drop-shadow-[0_0_20px_rgba(197,160,89,0.8)]">
                            {results.total}<span className="text-3xl">%</span>
                        </span>
                    </motion.div>
                    <div className="absolute inset-0 rounded-full border border-mafia-gold animate-ping opacity-20"></div>
                </div>

                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] mb-4">
                        {getVerdict(results.total)}
                    </h2>
                    <p className="text-sm md:text-base text-white/70 italic font-medium max-w-lg mx-auto leading-relaxed border-l-2 border-mafia-gold/50 pl-4">
                        "{getCharacteristic(results)}"
                    </p>
                </div>

                <div className="w-full bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 mb-10 backdrop-blur-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {[
                            { label: "Chemie", val: results.chemistry, icon: <Zap size={14}/> },
                            { label: "Přitažlivost", val: results.attraction, icon: <Heart size={14}/> },
                            { label: "Souhra", val: results.synergy, icon: <ShieldCheck size={14}/> },
                            { label: "Komunikace", val: results.communication, icon: <MessageCircleHeart size={14}/> },
                            { label: "Kompatibilita", val: results.compatibility, icon: <Crown size={14}/> },
                            { label: "Stabilita", val: results.stability, icon: <ShieldCheck size={14}/> },
                            { label: "Dlouhodobý potenciál", val: results.longTerm, icon: <Clock size={14}/> },
                            { label: "Konfliktní potenciál", val: results.conflict, icon: <Zap size={14} className="text-mafia-red"/>, isRed: true }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-white/60">
                                    <span className="flex items-center gap-2">{stat.icon} {stat.label}</span>
                                    <span className={stat.isRed ? "text-mafia-red font-bold" : "text-mafia-gold font-bold"}>{stat.val} %</span>
                                </div>
                                <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} transition={{ delay: 1 + (i * 0.1), duration: 1 }} className={`h-full ${stat.isRed ? 'bg-mafia-red' : 'bg-mafia-gold'}`}></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <button onClick={() => { playSound("/sounds/success.mp3", 0.5); alert("Sdílení se připravuje! Brzy budete moci sdílet obrázek na sítě."); }} className="flex-1 py-4 bg-mafia-gold text-black font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                        <Share2 size={16} /> Sdílet výsledek
                    </button>
                    <button onClick={() => { setStep(1); setRoulettePhase(-1); }} className="flex-1 py-4 bg-transparent border border-white/20 text-white font-black uppercase tracking-widest text-sm hover:bg-white/5 active:scale-95 transition-colors flex items-center justify-center gap-2">
                        <RotateCcw size={16} /> Zkusit znovu
                    </button>
                </div>

                <p className="mt-12 text-[9px] font-mono text-white/30 text-center uppercase max-w-sm">
                    Výsledek naznačuje teoretickou kompatibilitu podle zadaných údajů. Vztahová ruleta je matematický model a slouží primárně k zábavě.
                </p>
            </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
