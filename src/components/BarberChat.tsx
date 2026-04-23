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
    { name: "Nella", text: "Proč zrovna tohle místo?" },
    { name: "Tomáš", text: "Protože některý věci musí být nad vším ostatním." }
  ],
  [
    { name: "Nella", text: "Co zas děláš?" },
    { name: "Tomáš", text: "Mlč… hraju si s publikem. Počkej, až to začnou chápat." }
  ],
  [
    { name: "Nella", text: "Ty si s nima hraješ, že jo?" },
    { name: "Tomáš", text: "Jen tak trošku… jinak by to byla nuda." }
  ],
  [
    { name: "Nella", text: "Tenhle chce změnu." },
    { name: "Tomáš", text: "To říkají všichni… a pak chtějí to samý." }
  ],
  [
    { name: "Nella", text: "Co když se mu to nebude líbit?" },
    { name: "Tomáš", text: "Tak přijde znova… a už bude vědět." }
  ],
  [
    { name: "Nella", text: "Už jde další." },
    { name: "Tomáš", text: "Vsadím se, že řekne, udělej mi to jak minule." }
  ],
  [
    { name: "Tomáš", text: "Chceš zase vyhodit?" },
    { name: "Nella", text: "No jistě." },
    { name: "Tomáš", text: "To znám… odejdeš dveřma a vlezeš zpátky oknem." }
  ],
  [
    { name: "Tomáš", text: "Klid… ať se ti to začne plnit v rezervacích." },
    { name: "Nella", text: "Pracuju na tom." },
    { name: "Tomáš", text: "Jo, tak to bude dobrý." }
  ],
  [
    { name: "Nella", text: "Sestra mi říkala, že sis ani nechtěl jet pro svůj vysokoškolský diplom." },
    { name: "Tomáš", text: "Jo, to má pravdu… museli mi poslat výzvu." },
    { name: "Tomáš", text: "Prý se na něj prášilo a byl tam chudáček úplně sám." },
    { name: "Tomáš", text: "Kdyby bylo na mně, nechám ho tam ještě další rok." },
    { name: "Tomáš", text: "Nakonec mi ho stejně vyzvedla ona." },
    { name: "Nella", text: "A kde ho teď máš?" },
    { name: "Tomáš", text: "Hele… vyrovnávám s ním televizi." },
    { name: "Tomáš", text: "Byla totiž trochu křivá." }
  ],
  [
    { name: "Nella", text: "Ty jsi barber?" },
    { name: "Tomáš", text: "Ne." },
    { name: "Tomáš", text: "To by bylo moc jednoduchý." },
    { name: "Nella", text: "Tak proč stříháš?" },
    { name: "Tomáš", text: "Nevím… ale funguje to." }
  ],
  [
    { name: "Nella", text: "Ty jim dáváš styl… nebo sebevědomí?" },
    { name: "Tomáš", text: "Rozdíl?" }
  ],
  [
    { name: "Tomáš", text: "Styl se nedá koupit." },
    { name: "Nella", text: "Ale u nás si ho můžeš nechat vytvořit." }
  ],
  [
    { name: "Nella", text: "Tohle je barbershop nebo klub?" },
    { name: "Tomáš", text: "Podnikatelský klub… jen místo obleků máme pláště." }
  ],
  [
    { name: "Nella", text: "Myslela jsem, že ses k tomu jen přimotal…" },
    { name: "Tomáš", text: "Já se nepřimotávám. Já určuju, kde to začíná." }
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
                SECRET_COMM: INTERCEPT_14
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
                  initial={{ opacity: 0, x: msg.name === 'Tomáš' ? 10 : -10, y: 5 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  className={`flex flex-col ${msg.name === 'Tomáš' ? 'items-end' : 'items-start'}`}
                >
                  <span className={`text-[8px] font-mono mb-0.5 uppercase tracking-widest ${msg.name === 'Tomáš' ? 'text-mafia-gold/40' : 'text-mafia-red/40'}`}>
                    {msg.name}
                  </span>
                  <div className={`px-3 py-1.5 text-xs md:text-sm font-sans relative ${
                    msg.name === 'Tomáš' 
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
                className={`flex items-center gap-1 ${typingName === 'Tomáš' ? 'justify-end' : 'justify-start'}`}
              >
                <span className="text-[8px] font-mono text-white/30 uppercase mr-1">
                   signal incoming
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
