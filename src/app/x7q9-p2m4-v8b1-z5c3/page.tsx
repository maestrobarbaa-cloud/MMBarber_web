"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SecretOpenFreeMap } from "@/components/SecretOpenFreeMap";
import { useRouter } from "next/navigation";

// --- POZADÍ (Particles) ---
function SecretInteractiveParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    const particles: any[] = [];
    const numParticles = 40;
    const symbols = ['✂', '♛', '♦', '⚜', '♠', '★'];

    for (let i = 0; i < numParticles; i++) {
      const el = document.createElement('div');
      el.className = `absolute flex items-center justify-center text-mafia-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.8)]`;
      const size = Math.random() * 15 + 10;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.fontSize = `${size * 0.8}px`;
      el.style.opacity = (Math.random() * 0.4 + 0.3).toString();
      el.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
      container.appendChild(el);
      
      particles.push({
        element: el,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: - (Math.random() * 1.5 + 0.5),
        size,
        baseSpeedY: - (Math.random() * 1.5 + 0.5),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
      });
    }

    let mouseX = -1000, mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const handleMouseLeave = () => { mouseX = -1000; mouseY = -1000; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;
    const render = () => {
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rotation += p.rotationSpeed;
        if (p.y < -50) { p.y = window.innerHeight + 50; p.x = Math.random() * window.innerWidth; p.vx = (Math.random() - 0.5) * 0.5; }
        if (p.x < -50) p.x = window.innerWidth + 50;
        if (p.x > window.innerWidth + 50) p.x = -50;

        const dx = p.x - mouseX, dy = p.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          p.vx += (dx / distance) * force * 0.8;
          p.vy += (dy / distance) * force * 0.8;
          p.rotationSpeed += (dx > 0 ? 1 : -1) * force * 0.5;
        } else {
          p.vx *= 0.95; p.vy += (p.baseSpeedY - p.vy) * 0.05;
          p.rotationSpeed *= 0.98;
        }
        p.vx += Math.sin(p.y * 0.02) * 0.05;
        p.element.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`;
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />;
}

// --- DATA DIALOGŮ ---
type DialogueOption = {
  text: string;
  nextId: string | null;
  isEnd?: boolean;
};

type DialogueNode = {
  id: string;
  text: string;
  options: DialogueOption[];
  isEnd?: boolean;
  isInput?: boolean;
};

const dialogueTree: Record<string, DialogueNode> = {
  "start": {
    id: "start",
    text: "No neříkej, že ses sem dostal omylem. Vypadáš, jako bys zrovna utekl hrobníkovi z lopaty. Co tu chceš? Mluv, než mi vystydne kafe.",
    options: [
      { text: "ZPOVĚĎ (Mám problém)", nextId: "confession" },
      { text: "HUMOR (Řekni vtip)", nextId: "joke" },
      { text: "ŠPINAVÁ PRÁCE (Schovat tělo)", nextId: "morava" },
      { text: "IDENTITA (Krycí jméno)", nextId: "alias" },
      { text: "STATUS (Jak na tom jsem?)", nextId: "status_ask" },
      { text: "LOKACE (Soukromé stříhárny)", nextId: "speakeasy" }
      // { text: "VZPOMÍNKY (Příběh dvou)", nextId: "go_to_story" }
    ]
  },
  "speakeasy": {
    id: "speakeasy",
    text: "Hledej, turisto. Ptej se místních na soukromé stříhárny. Pocestní ti poradí. Pamatuj na krédo Bratrstva... Pracujeme v temnotě, abychom sloužili světlu.",
    options: [
      { text: "Otevřít mapu úkrytů", nextId: "show_map" }
    ]
  },
  "status_ask": {
    id: "status_ask",
    text: "Status? Chceš vědět, kam patříš v potravním řetězci? Dobrá. Ale napřed mi řekni, čím se vůbec živíš, frajere?",
    options: [
      { text: "Jsem Barber", nextId: "status_anim" },
      { text: "Jsem Manažer", nextId: "status_anim" },
      { text: "Jsem Student", nextId: "status_anim" },
      { text: "Dělám něco jinýho", nextId: "status_anim" }
    ]
  },
  "status_explanation_barber": {
    id: "status_explanation_barber",
    text: "Proč pod hnojem? Stříhat vlasy umí každej trouba. Skutečnej byznys se dělá v zákulisí s velkejma prachama. Ale nezoufej, někdo mi tu ofinku zastřihnout musí.",
    options: [],
    isEnd: true
  },
  "status_explanation_manager": {
    id: "status_explanation_manager",
    text: "Manažer? Znáš ten vtip, jak přijde manažer do baru a... vlastně žádnej není, protože jste všichni strašně nudní. Jsi pod hnojem, protože hnůj má aspoň nějaký reálný využití na poli.",
    options: [],
    isEnd: true
  },
  "status_explanation_student": {
    id: "status_explanation_student",
    text: "Student? Někdo ten hnůj prostě kydat musí. Každej musí nějak začít, mladej. Až dostuduješ a vyroste ti plnovous, možná tě povýším na zkušební lopatu.",
    options: [],
    isEnd: true
  },
  "status_explanation_other": {
    id: "status_explanation_other",
    text: "Něco jinýho? Když ani ty nevíš, co jsi pořádně zač, jak tě můžu zařadit jinam než na úplný dno? Buď rád, že jsi vůbec na seznamu.",
    options: [],
    isEnd: true
  },
  "joke": {
    id: "joke",
    text: "Vtip? Já ti vypadám jako nějakej klaun z poutě? Ale budiž, jeden z oboru ti řeknu. Víš, proč si mafiáni nikdy nestěžují u holiče?",
    options: [
      { text: "Protože mají přirozený respekt?", nextId: "joke_respect" },
      { text: "Protože holič drží břitvu na jejich krku?", nextId: "joke_razor" }
    ]
  },
  "joke_respect": {
    id: "joke_respect",
    text: "Ne, ty chytrolíne. Protože když se jim nelíbí sestřih, z holičství se stane pizzerie. Haha! No nic, radši už běž, mám tu práci.",
    options: [],
    isEnd: true
  },
  "joke_razor": {
    id: "joke_razor",
    text: "Přesně tak! Jediný člověk, kterýmu Don dobrovolně svěří svůj krk, je ten s nabroušenou břitvou. A teď už mazej, než mi z tebe vyschne v krku.",
    options: [],
    isEnd: true
  },
  "alias": {
    id: "alias",
    text: "Krycí jméno? Dobře. Vypadáš naprosto tuctově. Odteď seš 'Jarda, co minulej čtvrtek u samoobslužný kasy zapomněl pípnout rohlíky'. Je to tak blbý, že je to absolutně neprůstřelný. Nikoho nenapadne tě hledat. A teď už běž.",
    options: [],
    isEnd: true
  },
  "confession": {
    id: "confession",
    text: "Vyzpovídat se? Na to tu máme kostel. Ale budiž, mám zrovna dobrou náladu. Co ti leží na srdci, chlapče? Vyklop to všechno, poslouchám.",
    options: [],
    isInput: true
  },
  "confess_1": {
    id: "confess_1",
    text: "Hele, to je těžký... Ale jak říkával můj děda: Když tě něco trápí, dej si pořádnej guláš se šesti. Problém to sice nevyřeší, ale s plným břichem se líp přemýšlí.",
    options: [],
    isEnd: true
  },
  "confess_2": {
    id: "confess_2",
    text: "Chápu tě. Život je občas jak jízda v autě s prasklou gumou. Ale pamatuj – když tě někdo fakt štve, prostě mu schovej nabíječku na mobil. To je dneska horší než italská vendeta.",
    options: [],
    isEnd: true
  },
  "confess_3": {
    id: "confess_3",
    text: "Slyším tě. Ale upřímně? Prostě nad tím mávni rukou. Stres dělá vrásky a přes vrásky se špatně holí krk. Takže se usměj a hoď to za hlavu.",
    options: [],
    isEnd: true
  },
  "confess_4": {
    id: "confess_4",
    text: "Zajímavý... Velmi zajímavý. Ale víš ty co? Zkus to zresetovat. Ne počítač, ale sebe. Běž na pivo, pusť si fajn film a zítra je taky den.",
    options: [],
    isEnd: true
  },
  "morava": {
    id: "morava",
    text: "Morava? Děláš si prdel? Tam je v létě vody po kotníky a na každým metru čumí nějakej rybář. Leda bys to chtěl maskovat jako trofejního sumce. A pískovna v Ostrožský už je beztak plná mých... nepovedených experimentů.",
    options: [
      { text: "Tak to zakopem někde ve vinohradu pod Buchlovem.", nextId: "morava_wine" },
      { text: "Tak nevím. Co to nechat prostě na Masarykově náměstí lavičce?", nextId: "morava_square" }
    ]
  },
  "morava_wine": {
    id: "morava_wine",
    text: "Vinohrad pod Buchlovem... konečně mluvíš jako pravej chlap ze Slovácka. Kvalitní hnojivo je základ dobrýho Rulandskýho. Běž pro rýč a já zavolám chlapům, ať nastartujou dodávku.",
    options: [],
    isEnd: true
  },
  "morava_square": {
    id: "morava_square",
    text: "Na Masarykáči? Jo, a rovnou tomu dáme do ruky kornout zmrzliny, ať je nenápadnej, ne? Ty seš blbější než vypadáš. Zmiz, než si to rozmyslím a udělám z tebe krmení pro holuby na vlakovým nádraží.",
    options: [],
    isEnd: true
  }
};

// --- KOMPONENTY PRO DIALOG ---
const TypewriterText = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    let currentIndex = 0;
    let isFinished = false;
    
    const intervalId = setInterval(() => {
      if (isFinished) return;
      
      setDisplayedText(text.substring(0, currentIndex + 1));
      currentIndex++;
      
      if (currentIndex >= text.length) {
        isFinished = true;
        clearInterval(intervalId);
        // Prodleva 1.2 sekundy po dopsání textu, než naskočí možnosti (aby si to hráč stihl dočíst)
        setTimeout(() => {
          onComplete();
        }, 1200);
      }
    }, 35); // Rychlost psaní

    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return <span>{displayedText}</span>;
};

const BigHierarchyAnimation = ({ profession, onComplete }: { profession: string; onComplete: () => void }) => {
  const items = [
    { title: "BŮH (Kmotr)", scale: 2 },
    { title: "CAPO (Šéf)", scale: 1.5 },
    { title: "PĚŠÁK", scale: 1 },
    { title: "HNŮJ", scale: 0.8 },
    { title: `TY (${profession.toUpperCase()})`, scale: 0.5, color: "text-red-500" }
  ];

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden font-heading text-mafia-gold">
      <motion.div 
        initial={{ y: "50vh" }}
        animate={{ y: "-240vh" }}
        transition={{ duration: 5, ease: "easeInOut" }}
        className="flex flex-col items-center gap-[40vh] pt-[50vh]"
      >
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <motion.h1 
              style={{ scale: item.scale }}
              className={`text-5xl md:text-7xl font-black uppercase tracking-widest text-center ${item.color || "text-mafia-gold"}`}
            >
              {item.title}
            </motion.h1>
            {idx < items.length - 1 && (
              <div className="h-[40vh] border-l-4 border-dashed border-mafia-gold/30 my-8 flex items-center justify-center relative">
                <div className="absolute bottom-0 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-mafia-gold/30 translate-y-full" />
              </div>
            )}
          </div>
        ))}
      </motion.div>

      <AnimatePresence>
        {showButton && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onComplete}
            className="absolute bottom-10 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest uppercase text-xl rounded shadow-[0_0_40px_rgba(255,0,0,0.5)] z-[101] transition-colors"
          >
            Proč jsem zařazen tady?!
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function EasterEggPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDay, setIsDay] = useState(true);
  const [currentNodeId, setCurrentNodeId] = useState<string>("start");
  const [isTyping, setIsTyping] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [hierarchyAnim, setHierarchyAnim] = useState(false);
  const [selectedStartOption, setSelectedStartOption] = useState("");
  const [profession, setProfession] = useState("");
  const [showBigAnim, setShowBigAnim] = useState(false);
  const [showSecretMap, setShowSecretMap] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    setIsDay(hour >= 6 && hour < 18);
  }, []);

  const handleOptionClick = (nextId: string | null, text: string = "") => {
    // if (nextId === "go_to_story") {
    //   router.push('/q8w2-e4r7-t1y5-u9i3');
    //   return;
    // }

    if (nextId === "show_map") {
      setShowSecretMap(true);
      return;
    }

    if (nextId === "status_anim") {
      if (text.includes("Barber")) setProfession("Barber");
      else if (text.includes("Manažer")) setProfession("Manažer");
      else if (text.includes("Student")) setProfession("Student");
      else setProfession("Něco jinýho");
      
      setShowBigAnim(true);
      return;
    }

    if (nextId && dialogueTree[nextId]) {
      setCurrentNodeId(nextId);
      setIsTyping(true);
    }
  };

  const handleAnimComplete = () => {
    setShowBigAnim(false);
    let nextNode = "status_explanation_other";
    if (profession === "Barber") nextNode = "status_explanation_barber";
    if (profession === "Manažer") nextNode = "status_explanation_manager";
    if (profession === "Student") nextNode = "status_explanation_student";
    
    setCurrentNodeId(nextNode);
    setIsTyping(true);
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;
    const universalAnswers = ["confess_1", "confess_2", "confess_3", "confess_4"];
    const randomAnswer = universalAnswers[Math.floor(Math.random() * universalAnswers.length)];
    setCurrentNodeId(randomAnswer);
    setIsTyping(true);
    setInputValue("");
  };

  const handleComplete = useCallback(() => setIsTyping(false), []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  if (showSecretMap) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black flex flex-col"
      >
        <div className="absolute top-4 left-4 z-[210]">
          <button 
            onClick={() => setShowSecretMap(false)} 
            className="px-6 py-2 bg-black hover:bg-mafia-gold/20 text-mafia-gold border border-mafia-gold uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:shadow-[0_0_25px_rgba(197,160,89,0.6)]"
          >
            Zpět do úkrytu
          </button>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[210] bg-black/80 backdrop-blur-md px-8 py-4 border-y border-mafia-gold/50 shadow-[0_0_30px_rgba(0,0,0,0.9)] text-center w-11/12 md:w-auto pointer-events-none">
          <span className="text-mafia-gold font-serif italic text-xl md:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            „Pracujeme v temnotě, abychom sloužili světlu.“
          </span>
        </div>
        <div className="flex-1 relative">
          <SecretOpenFreeMap />
        </div>
      </motion.div>
    );
  }

  if (showBigAnim) {
    return <BigHierarchyAnimation profession={profession} onComplete={handleAnimComplete} />;
  }

  const currentNode = dialogueTree[currentNodeId];
  const tomasImage = isDay ? '/hierarchie/tomáš-sako-den.png' : '/hierarchie/tomáš-sako-večer.png';

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-center overflow-hidden font-sans">
      <SecretInteractiveParticles />

      {/* Vtipná hierarchie */}
      <motion.div 
        className="absolute top-6 right-6 md:top-10 md:right-10 z-50 bg-white/10 backdrop-blur-md border border-white/30 px-6 py-3 rounded-full cursor-pointer overflow-hidden flex flex-col items-center group"
        onClick={() => setHierarchyAnim(true)}
        animate={
          hierarchyAnim 
          ? { 
              y: [0, -20, 0, -10, 0, 500], 
              rotate: [0, -10, 10, -5, 5, 360], 
              opacity: [1, 1, 1, 1, 1, 0],
              scale: [1, 1.2, 0.8, 1.1, 1, 0]
            } 
          : {}
        }
        transition={{ duration: 1.5, ease: "easeInOut" }}
        onAnimationComplete={() => { if (hierarchyAnim) { alert("Byl jsi degradován na krmivo pro ryby."); setHierarchyAnim(false); } }}
      >
        <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono mb-1 group-hover:text-white/80 transition-colors">Tvoje Hierarchie</span>
        <span className="text-sm text-white font-bold uppercase tracking-widest">Podržtaška (Lvl. 1)</span>
        
        {hierarchyAnim && (
          <span className="absolute inset-0 bg-red-600/80 flex items-center justify-center text-white font-black text-xs uppercase animate-pulse">
            PÁD KE DNU!
          </span>
        )}
      </motion.div>

      {/* Hlavní obsah - Z-index navrch */}
      <div className="z-10 w-full max-w-4xl p-6 h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 relative">
        
        {/* Obrázek Tomáše */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-64 h-80 md:w-96 md:h-[500px] shrink-0"
        >
          <img 
            src={tomasImage} 
            alt="Don Tomáš" 
            className={`absolute inset-0 w-full h-full object-contain z-10 transition-all duration-500 ${!isDay ? 'drop-shadow-[0_0_25px_rgba(197,160,89,0.3)]' : 'drop-shadow-[0_0_15px_rgba(0,0,0,0.3)]'}`}
          />
        </motion.div>

        {/* Dialogové okno */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 flex flex-col justify-center w-full min-h-[300px]"
        >
          <div className="bg-black/80 backdrop-blur-md border border-mafia-gold/40 rounded-sm p-6 md:p-8 shadow-[0_0_40px_rgba(197,160,89,0.15)] relative">
            
            {/* Jméno řečníka */}
            <div className="absolute -top-4 left-6 bg-black border border-mafia-gold px-4 py-1 shadow-[0_0_10px_rgba(197,160,89,0.2)]">
              <h2 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-sm">Don Tomáš</h2>
            </div>

            {/* Text dialogu */}
            <div className="text-mafia-gold/90 text-xl md:text-2xl min-h-[120px] font-serif italic tracking-wide leading-relaxed mt-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <TypewriterText 
                text={currentNode.text} 
                onComplete={handleComplete} 
              />
            </div>

            {/* Volby */}
            <div className="mt-10 flex flex-col gap-3 min-h-[100px] font-serif tracking-wider text-lg">
              <AnimatePresence>
                {/* --- Speciální render pro úvodní volbu (Roletka) --- */}
                {!isTyping && currentNodeId === 'start' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 w-full"
                  >
                    <select
                      value={selectedStartOption}
                      onChange={(e) => setSelectedStartOption(e.target.value)}
                      className="w-full p-4 bg-black border border-mafia-gold/40 text-mafia-gold font-serif text-lg focus:outline-none focus:border-mafia-gold appearance-none cursor-pointer"
                      style={{ backgroundImage: 'linear-gradient(45deg, transparent 50%, #c5a059 50%), linear-gradient(135deg, #c5a059 50%, transparent 50%)', backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)', backgroundSize: '5px 5px, 5px 5px', backgroundRepeat: 'no-repeat' }}
                    >
                      <option value="" disabled className="bg-black text-white/50">-- Vyber si téma hovoru --</option>
                      {currentNode.options.map((option, idx) => (
                        <option key={idx} value={option.nextId!} className="bg-black text-mafia-gold py-2">{option.text}</option>
                      ))}
                    </select>
                    <button
                      disabled={!selectedStartOption}
                      onClick={() => {
                        const opt = currentNode.options.find(o => o.nextId === selectedStartOption);
                        if (opt) handleOptionClick(selectedStartOption, opt.text);
                      }}
                      className="w-full p-4 border border-mafia-gold/40 hover:border-mafia-gold bg-mafia-gold/10 hover:bg-mafia-gold/30 text-mafia-gold transition-all uppercase tracking-widest text-sm font-sans font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Potvrdit téma
                    </button>
                  </motion.div>
                )}

                {/* --- Normální render pro další dialogy --- */}
                {!isTyping && !currentNode.isEnd && !currentNode.isInput && currentNodeId !== 'start' && currentNode.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    onClick={() => handleOptionClick(option.nextId, option.text)}
                    className="w-full text-left p-4 border border-white/10 hover:border-mafia-gold/60 bg-white/5 hover:bg-mafia-gold/10 text-white/70 hover:text-white transition-all duration-300 flex items-center justify-between group text-lg"
                  >
                    <span>{option.text}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-mafia-gold transition-opacity">→</span>
                  </motion.button>
                ))}

                {!isTyping && currentNode.isInput && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-4 mt-2"
                  >
                    <textarea 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Vyklop mi to..."
                      className="w-full bg-black/60 border border-mafia-gold/30 p-4 text-smoke-white font-serif italic focus:outline-none focus:border-mafia-gold resize-none h-32"
                    />
                    <button 
                      onClick={handleInputSubmit}
                      className="w-full text-center p-4 border border-mafia-gold/40 hover:border-mafia-gold bg-mafia-gold/10 hover:bg-mafia-gold/30 text-mafia-gold transition-all uppercase tracking-widest text-sm font-sans font-bold"
                    >
                      Říct to Donovi
                    </button>
                  </motion.div>
                )}

                {!isTyping && currentNode.isEnd && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center mt-4"
                  >
                    <Link 
                      href="/" 
                      className="group flex items-center gap-3 text-mafia-gold hover:text-white transition-all duration-500 border border-mafia-gold/30 hover:border-mafia-gold px-8 py-4 bg-mafia-gold/5 hover:bg-mafia-gold/10"
                    >
                      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
                      <span className="tracking-widest uppercase text-sm">Odejít ze stínů</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}


