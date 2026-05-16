"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, List, Target, Activity, Shield, Hash, MessageSquare, Send, Users as UsersIcon, LogIn } from "lucide-react";
import { playSound } from "@/utils/audio";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { getUserNetworkData } from "@/utils/network";

interface ToCItem {
  id: string;
  text: string;
  level: number;
}

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: any;
}

interface SidebarCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  link: string;
  external?: boolean;
  color: string;
}

function SidebarCard({ title, desc, icon, link, external, color }: SidebarCardProps) {
  const router = useRouter();
  
  const handleClick = () => {
    playSound("/sounds/card.mp3", 0.5);
    if (external) {
      window.open(link, '_blank');
    } else {
      router.push(link);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="w-full relative group"
    >
      <div className="relative p-6 border border-white/10 bg-white/[0.02] backdrop-blur-xl group-hover:border-mafia-gold/40 transition-all duration-500 overflow-hidden text-left flex flex-col h-full">
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(circle at 100% 0%, ${color}, transparent 60%)` }}
        ></div>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="w-12 h-12 border border-mafia-gold/20 flex items-center justify-center bg-mafia-black/40 group-hover:bg-mafia-gold transition-all duration-500 text-mafia-gold group-hover:text-mafia-black">
             {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
               <span className="text-[9px] font-mono text-mafia-gold/60 uppercase tracking-[0.3em]">{desc}</span>
               {external && <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-1">EXT_LINK</span>}
            </div>
            <h3 className="text-xl font-heading font-black text-white uppercase tracking-tighter italic group-hover:text-mafia-gold transition-colors leading-none">
              {title}
            </h3>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_2px] z-20 opacity-20 group-hover:opacity-40"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-mafia-gold/30 group-hover:border-mafia-gold transition-colors"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 group-hover:border-mafia-gold/30 transition-colors"></div>
      </div>
    </motion.button>
  );
}

import { useRouter } from "next/navigation";
import { Clock, Ticket, Sparkles, Camera } from "lucide-react";

export function TableOfContents() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'nav' | 'chat'>('nav');
  const [items, setItems] = useState<ToCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [nickname, setNickname] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const headingOffsetsRef = useRef<{ id: string; top: number }[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const savedNick = localStorage.getItem("mmbarber_community_nick");
    if (savedNick) setNickname(savedNick);

    // Chat subscription
    const qChat = query(
      collection(db, "community_messages"),
      orderBy("time", "desc"),
      limit(20)
    );

    const unsubscribeChat = onSnapshot(qChat, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      setMessages(msgs.reverse());
    });

    const recalculateOffsets = () => {
      const headings = Array.from(document.querySelectorAll("h2, h3[id]"));
      headingOffsetsRef.current = headings
        .map((h) => {
          const id = h.id || h.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
          if (!id) return null;
          return {
            id,
            top: h.getBoundingClientRect().top + window.scrollY
          };
        })
        .filter((item): item is { id: string; top: number } => item !== null);
    };

    const findSections = () => {
      const headings = Array.from(document.querySelectorAll("h2, h3[id]"));
      const tocItems = headings.map((h) => ({
        id: h.id || h.textContent?.toLowerCase().replace(/\s+/g, "-") || "",
        text: h.textContent || "",
        level: parseInt(h.tagName.substring(1))
      })).filter(item => item.id !== "");
      
      setItems(tocItems);
      // Allow DOM to settle, then recalculate offsets
      setTimeout(recalculateOffsets, 100);
    };

    // Initial find
    findSections();

    // Re-find on potential content changes
    const observer = new MutationObserver(findSections);
    observer.observe(document.body, { childList: true, subtree: true });

    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      const offsets = headingOffsetsRef.current;
      
      let currentActiveId = "";
      for (let i = offsets.length - 1; i >= 0; i--) {
        if (offsets[i].top < scrollPos) {
          currentActiveId = offsets[i].id;
          break;
        }
      }
      
      if (currentActiveId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", recalculateOffsets, { passive: true });

    return () => {
      observer.disconnect();
      unsubscribeChat();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", recalculateOffsets);
    };
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !nickname || isSending) return;

    setIsSending(true);
    try {
      const networkData = await getUserNetworkData();
      await addDoc(collection(db, "community_messages"), {
        user: nickname,
        text: inputValue,
        time: serverTimestamp(),
        ip: networkData.ip
      });
      setInputValue("");
      playSound("/sounds/click.mp3", 0.1);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      playSound("/sounds/click.mp3", 0.1);
      if (window.innerWidth < 1280) setIsOpen(false);
    }
  };

  if (!isMounted || items.length === 0) return null;

  return (
    <div className="fixed left-0 top-0 h-screen z-[40000] hidden xl:flex items-center">
      {/* Trigger Zone / Handle */}
      <div 
        className={`w-3 h-screen bg-black/40 border-r border-mafia-gold/30 cursor-pointer transition-all duration-500 hover:w-6 hover:bg-mafia-gold/10 flex items-center justify-center group ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onMouseEnter={() => {
          setIsOpen(true);
          playSound("/sounds/hover.mp3", 0.05);
        }}
      >
        <div className="absolute left-6 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none -rotate-90 origin-left translate-y-24">
          <span className="text-mafia-gold font-heading font-black text-sm uppercase tracking-[0.4em]">TACTICAL HUD</span>
        </div>
      </div>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 150 }}
            className="w-[450px] h-screen bg-mafia-black/98 backdrop-blur-2xl border-r border-white/10 shadow-[30px_0_60px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden"
            onMouseLeave={() => setIsOpen(false)}
          >
            {/* HUD Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-0 opacity-30"></div>

            {/* Header & Tabs */}
            <div className="relative z-10 p-10 pb-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Target className="w-6 h-6 text-mafia-gold animate-pulse" />
                  <span className="text-white font-heading font-black text-lg uppercase tracking-[0.2em] italic">MMB_CORE_NAV</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-mafia-gold animate-ping"></div>
                   <span className="text-[9px] font-mono text-mafia-gold uppercase tracking-widest">Live</span>
                </div>
              </div>

              {/* TABS */}
              <div className="flex gap-4">
                <button 
                   onClick={() => setActiveTab('nav')}
                   className={`flex-1 py-3 border transition-all flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-widest ${activeTab === 'nav' ? 'bg-mafia-gold text-mafia-black border-mafia-gold font-black' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                >
                   <List size={14} /> Obsah
                </button>
                <button 
                   onClick={() => setActiveTab('chat')}
                   className={`flex-1 py-3 border transition-all flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-widest ${activeTab === 'chat' ? 'bg-mafia-gold text-mafia-black border-mafia-gold font-black' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                >
                   <MessageSquare size={14} /> Chat
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
              <AnimatePresence mode="wait">
                {activeTab === 'nav' ? (
                  <motion.div 
                    key="nav"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="p-10 flex-1 overflow-y-auto scrollbar-none"
                  >
                    <div className="grid grid-cols-1 gap-6 pb-20">
                      {[
                        { title: 'Ceník & Služby', desc: 'PROFESSIONAL_PRICING', icon: <Target />, link: '/cenik', color: 'rgba(var(--color-mafia-gold-rgb), 0.1)' },
                        { title: 'Rezervace', desc: 'BOOK_YOUR_SESSION', icon: <Clock />, link: '#operativi', external: false, color: 'rgba(255, 255, 255, 0.05)' },
                        { title: 'Dárkové Vouchery', desc: 'GIFT_CARDS_SECURE', icon: <Ticket />, link: '/vouchery', color: 'rgba(var(--color-mafia-gold-rgb), 0.15)' },
                        { title: 'Komunita', desc: 'JOIN_THE_FAMILY', icon: <UsersIcon />, link: '/komunita', color: 'rgba(139, 0, 0, 0.1)' },
                        { title: 'Magazín Péče', desc: 'GROOMING_MAGAZINE', icon: <Sparkles />, link: '/pece', color: 'rgba(var(--color-mafia-gold-rgb), 0.2)' },
                        { title: 'Galerie & Fade', desc: 'VISUAL_INTELLIGENCE', icon: <Camera />, link: '/galerie', color: 'rgba(255, 255, 255, 0.1)' },
                      ].map((card, i) => (
                        <SidebarCard 
                          key={i}
                          {...card}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col h-full overflow-hidden"
                  >
                    {/* Chat Messages */}
                    <div 
                      ref={chatScrollRef}
                      className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-mafia-gold/10"
                    >
                      {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-10">
                          <Hash size={48} />
                          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest">Připojování k serveru...</p>
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <div key={msg.id} className="flex flex-col items-start">
                             <div className="flex items-center gap-3 mb-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${msg.user === nickname ? 'text-mafia-gold' : 'text-white/30'}`}>{msg.user}</span>
                                <span className="text-[8px] font-mono text-white/10 uppercase">
                                  {msg.time?.toDate ? msg.time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                </span>
                             </div>
                             <div className={`px-4 py-3 bg-white/[0.03] border-l-2 ${msg.user === nickname ? 'border-mafia-gold bg-mafia-gold/5' : 'border-white/10'} text-smoke-white font-sans text-sm leading-relaxed break-words w-full`}>
                                {msg.text}
                             </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-8 border-t border-white/10 bg-black/40">
                      {nickname ? (
                        <form onSubmit={handleSendMessage} className="flex gap-3">
                          <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="ZPRÁVA..."
                            className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-xs font-mono tracking-widest uppercase focus:outline-none focus:border-mafia-gold transition-colors"
                          />
                          <button 
                            type="submit"
                            className="w-12 h-12 bg-mafia-gold flex items-center justify-center text-mafia-black hover:bg-white transition-colors flex-shrink-0"
                          >
                             <Send size={18} />
                          </button>
                        </form>
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-center">
                           <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Pro psaní do chatu se musíš identifikovat v komunitní sekci.</p>
                           <Link 
                              href="/komunita/chat" 
                              className="px-6 py-2 border border-mafia-gold/30 text-mafia-gold font-mono text-[9px] uppercase tracking-widest hover:bg-mafia-gold hover:text-mafia-black transition-all flex items-center gap-2"
                           >
                             <LogIn size={12} /> Identifikovat se
                           </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Status */}
            <div className="relative z-10 p-8 pt-0 border-t border-white/5 flex flex-col gap-4">
               <div className="flex items-center justify-between pt-6">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-mafia-gold/40" />
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">Synchronization</span>
                  </div>
                  <span className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em]">100% SECURE</span>
               </div>
               <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-mafia-gold shadow-[0_0_10px_#d4af37]"
                    initial={{ width: 0 }}
                    animate={{ width: activeTab === 'nav' ? `${((items.findIndex(i => i.id === activeId) + 1) / items.length) * 100}%` : '100%' }}
                  />
               </div>
               <div className="flex justify-between text-[8px] font-mono text-white/10 uppercase italic">
                  <span>MMB_V3.5_HUD</span>
                  <span>{new Date().toLocaleTimeString()}</span>
               </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-mafia-gold/40"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-mafia-gold/40"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .vertical-text {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
}
