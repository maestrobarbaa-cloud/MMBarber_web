"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { usePathname } from "next/navigation";

interface Message {
  name: string;
  text: string;
}

const DIALOGUES: Message[][] = [
  [
    { name: "BARBER_AI", text: "Detekuji nového návštěvníka. Spouštím analýzu estetického profilu..." }
  ],
  [
    { name: "BARBER_AI", text: "Neklidné scrollování detekováno. Doporučuji hluboký nádech a návštěvu salonu." }
  ],
  [
    { name: "BARBER_AI", text: "Upozornění: Vaše aktuální úprava vousů neodpovídá standardům MM BARBER." }
  ],
  [
    { name: "BARBER_AI", text: "Optimalizuji vizuální integritu webu... Hotovo. Teď to vypadá tak, jak má." }
  ],
  [
    { name: "BARBER_AI", text: "Vyhledávám volné termíny... Systém je přetížen vaší nerozhodností." }
  ],
  [
    { name: "BARBER_AI", text: "Záznam 737: Kvalita není náhoda. Je to výsledek precizního algoritmu." }
  ],
  [
    { name: "BARBER_AI", text: "Váš styl je jako starý kód. Potřebuje refaktorizaci břitvou." }
  ],
  [
    { name: "BARBER_AI", text: "MHC Komplex analyzován. Vaše biologická stopa vyžaduje specifickou péči." },
    { name: "BARBER_AI", text: "Doporučuji sekci Péče pro další instrukce." }
  ],
  [
    { name: "BARBER_AI", text: "Systémový uzel aktivován. Připravuji půdu pro novou generaci holičství." }
  ],
  [
    { name: "BARBER_AI", text: "Vše pod kontrolou. Jen relaxujte. AI_SYSTEM se postará o zbytek." }
  ]
];

interface BarberChatProps {
  isOpen: boolean;
}

export function BarberChat({ isOpen }: BarberChatProps) {
  const { lang } = useTranslation();
  const pathname = usePathname();
  const isVip = pathname === "/vip-club";
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingName, setTypingName] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastIndexRef = useRef<number>(-1);
  const activeSessionRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setActiveMessages([]);
      setIsTyping(false);
      activeSessionRef.current = false;
      return;
    }

    activeSessionRef.current = true;
    const startTimeout = setTimeout(() => {
      startNewDialogue();
    }, 1000);

    return () => {
      clearTimeout(startTimeout);
      activeSessionRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const startNewDialogue = () => {
    if (!activeSessionRef.current) return;

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * DIALOGUES.length);
    } while (randomIndex === lastIndexRef.current && DIALOGUES.length > 1);
    
    lastIndexRef.current = randomIndex;
    const dialogue = DIALOGUES[randomIndex];
    
    showMessagesSequentially(0, dialogue);
  };

  const showMessagesSequentially = (index: number, dialogue: Message[]) => {
    if (!activeSessionRef.current) return;

    if (index >= dialogue.length) {
      // End of this dialogue, wait and start new one
      setTimeout(() => {
        if (activeSessionRef.current) startNewDialogue();
      }, 5000); // Wait 5 seconds between dialogues
      return;
    }

    const nextMsg = dialogue[index];
    setTypingName(nextMsg.name);
    setIsTyping(true);
    
    // Random typing duration
    const typingTime = Math.random() * 1000 + 1500;
    
    setTimeout(() => {
      if (!activeSessionRef.current) return;
      
      setIsTyping(false);
      setActiveMessages(prev => {
        // Keep only last 10 messages for performance and UX
        const newMessages = [...prev, nextMsg];
        return newMessages.slice(-10);
      });
      
      if (index + 1 < dialogue.length) {
        setTimeout(() => {
          showMessagesSequentially(index + 1, dialogue);
        }, 2000); 
      } else {
        // Wait and start next dialogue after completing current pair
        setTimeout(() => {
          if (activeSessionRef.current) startNewDialogue();
        }, 6000);
      }
    }, typingTime);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages, isTyping]);

  if (lang !== 'cs' || !isOpen) return null; // Only for Czech and when opened

  return (
    <div className={`hidden xl:block fixed ${isVip ? 'bottom-[100px]' : 'bottom-[160px]'} right-6 z-[60] w-[320px] md:w-[380px] pointer-events-none group`}>
      <div className="relative pointer-events-auto">
        <div className="relative bg-mafia-black/90 border border-mafia-gold/40 p-4 md:p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl group-hover:border-mafia-gold/60 transition-all duration-500">
          
          {/* Decorative Header with blinking status */}
          <div className="flex items-center justify-between mb-4 border-b border-mafia-gold/20 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-mafia-red animate-pulse shadow-[0_0_8px_rgba(139,0,0,1)]"></div>
              <span className="text-[9px] font-mono text-mafia-gold/80 uppercase tracking-[0.2em] font-bold">
                BARBER_AI: ACTIVE_LEARNING
              </span>
            </div>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-mafia-gold/20"></div>
              <div className="w-1 h-1 bg-mafia-gold/20"></div>
              <div className="w-1 h-1 bg-mafia-red/40"></div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide pr-1"
          >
            <AnimatePresence>
              {activeMessages.map((msg, i) => (
                <motion.div
                  key={`${i}-${msg.text}`}
                  initial={{ opacity: 0, x: msg.name === 'BARBER_AI' ? 10 : -10, y: 5 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  className={`flex flex-col ${msg.name === 'BARBER_AI' ? 'items-end' : 'items-start'}`}
                >
                  <span className={`text-[8px] font-mono mb-0.5 uppercase tracking-widest ${msg.name === 'BARBER_AI' ? 'text-mafia-gold/40' : 'text-mafia-red/40'}`}>
                    {msg.name}
                  </span>
                  <div className={`px-3 py-1.5 text-xs md:text-sm font-sans relative ${
                    msg.name === 'BARBER_AI' 
                    ? 'bg-mafia-gold/5 border-r border-mafia-gold/30 text-smoke-white/90' 
                    : 'bg-mafia-red/5 border-l border-mafia-red/30 text-smoke-white/90'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center gap-1 ${typingName === 'BARBER_AI' ? 'justify-end' : 'justify-start'}`}
              >
                <span className="text-[8px] font-mono text-white/30 uppercase mr-1">
                   ai processing
                </span>
                <span className="inline-flex gap-0.5">
                  <span className="w-0.5 h-0.5 bg-mafia-gold/30 animate-bounce"></span>
                  <span className="w-0.5 h-0.5 bg-mafia-gold/30 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-0.5 h-0.5 bg-mafia-gold/30 animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </motion.div>
            )}
          </div>

          {/* Glitch Overlay Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] mix-blend-overlay">
            <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>
          </div>
          
          {/* Moving scanline */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden h-full">
            <div className="w-full h-[1px] bg-mafia-gold/20 animate-scanline opacity-20"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400px); }
        }
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
