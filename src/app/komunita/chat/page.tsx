"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  ArrowLeft, 
  Send,
  Users,
  Circle,
  Hash,
  Terminal,
  ChevronRight,
  LogOut,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { getUserNetworkData, getUserIp, type UserNetworkData } from "@/utils/network";

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: any;
  isMe?: boolean;
  ip?: string;
  network?: UserNetworkData;
}

export default function CommunityChatPage() {
  const { lang } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [nickname, setNickname] = useState<string | null>(null);
  const [tempNickname, setTempNickname] = useState("");
  const [isBanned, setIsBanned] = useState(false);
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load nickname and check ban status
  useEffect(() => {
    const savedNickname = localStorage.getItem("mmbarber_community_nick");
    if (savedNickname) setNickname(savedNickname);
    
    const checkBanStatus = async () => {
      // NOTE: Temporarily omitting ban check since we moved away from Firebase
      // Could implement checking IP against an SQLite 'banned_ips' table later via an API
    };
    checkBanStatus();

    fetch('/api/settings?key=chat_enabled')
      .then(res => res.json())
      .then(data => setIsChatEnabled(data.value === null || data.value === 'true'))
      .catch(console.error);
  }, []);

  // Real-time messages
  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const res = await fetch('/api/chat');
        if (res.ok) {
          const data = await res.json();
          // SQLite returns timestamp in descending order (newest first based on limit)
          // We probably want to reverse it for chat view so newest is at bottom.
          setMessages(data.reverse());
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchMsgs();
    const interval = setInterval(fetchMsgs, 2000); // Polling every 2s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, nickname]);

  const handleSetNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempNickname.trim()) return;
    setNickname(tempNickname);
    localStorage.setItem("mmbarber_community_nick", tempNickname);
    
    // Odeslat systémovou zprávu o připojení
    try {
      const networkData = await getUserNetworkData();
      const payload = {
        user: "SYSTEM",
        userId: "system",
        text: `[SYSTÉM] Uživatel ${tempNickname} právě vstoupil do komunity.`,
        ip: networkData.ip,
        network: networkData,
        verifiedUser: true
      };

      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Failed to send system message", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !nickname || isBanned) return;

    try {
      const networkData = await getUserNetworkData();
      
      const payload = {
        user: nickname,
        userId: nickname,
        text: inputValue,
        ip: networkData.ip,
        network: networkData,
        verifiedUser: false
      };

      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setInputValue("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mmbarber_community_nick");
    setNickname(null);
  };

  if (isBanned) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <ShieldAlert className="text-mafia-red mx-auto mb-8" size={80} />
          <h1 className="text-4xl font-heading font-black text-white uppercase mb-4 tracking-tighter">PŘÍSTUP <span className="text-mafia-red">ZAMÍTNUT</span></h1>
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest leading-relaxed">
            Tento terminál byl trvale odpojen z důvodu porušení kodexu rodiny. Vaše IP adresa byla zařazena na černou listinu.
          </p>
          <Link href="/komunita" className="mt-12 inline-block px-12 py-4 border border-white/10 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
            ZPĚT DO BEZPEČÍ
          </Link>
        </div>
      </div>
    );
  }

  if (!isChatEnabled) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <ShieldAlert className="text-mafia-gold mx-auto mb-8" size={80} />
          <h1 className="text-4xl font-heading font-black text-white uppercase mb-4 tracking-tighter">KANÁL <span className="text-mafia-gold">UZAMČEN</span></h1>
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest leading-relaxed">
            Komunitní chat je momentálně administrátorem deaktivován. 
          </p>
          <Link href="/komunita" className="mt-12 inline-block px-12 py-4 border border-white/10 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
            ZPĚT DO KOMUNITY
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-smoke-white overflow-x-hidden relative selection:bg-mafia-gold selection:text-mafia-black">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(var(--color-mafia-gold-rgb),0.05)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          href="/komunita" 
          className="group flex items-center gap-4 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-xs tracking-[0.4em] uppercase"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          {lang === 'cs' ? "ZPĚT" : "BACK"}
        </Link>
        
        {nickname && (
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-3">
                <Circle size={8} className="fill-mafia-gold text-mafia-gold animate-pulse" />
                <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase">SYSTÉM AKTIVNÍ</span>
             </div>
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 text-white/20 hover:text-mafia-red transition-colors font-mono text-[9px] uppercase tracking-[0.2em]"
             >
                <LogOut size={14} />
                ODPOJIT
             </button>
          </div>
        )}
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-10 pb-40">
        <AnimatePresence mode="wait">
          {!nickname ? (
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
               <Terminal className="text-mafia-gold mb-12" size={64} />
               <h1 className="text-4xl md:text-6xl font-heading font-black uppercase italic tracking-tighter mb-6">IDENTIFIKACE <span className="text-mafia-gold">UŽIVATELE</span></h1>
               <p className="text-smoke-white/40 font-mono text-[10px] uppercase tracking-[0.5em] mb-12 max-w-sm">Pro vstup do komunitního kanálu zadejte svou přezdívku.</p>
               
               <form onSubmit={handleSetNickname} className="w-full max-w-md relative">
                  <input 
                    type="text" 
                    value={tempNickname}
                    onChange={(e) => setTempNickname(e.target.value)}
                    placeholder="TVOJE PŘEZDÍVKA..."
                    maxLength={20}
                    className="w-full bg-white/5 border border-white/10 px-8 py-6 text-xl font-heading font-black tracking-widest uppercase focus:outline-none focus:border-mafia-gold transition-all text-center placeholder:text-white/5"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    className="mt-8 w-full py-5 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.3)] flex items-center justify-center gap-3"
                  >
                     VSTOUPIT <ChevronRight size={20} />
                  </button>
               </form>
            </motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <div className="mb-12 flex items-center justify-between border-b border-white/5 pb-8">
                 <div className="flex items-center gap-4">
                    <Hash className="text-mafia-gold" size={32} />
                    <div>
                       <h1 className="text-3xl font-heading font-black uppercase italic tracking-tighter">MAIN_CHANNEL</h1>
                       <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Komunikace MM smečky / Přihlášen jako: <span className="text-mafia-gold">{nickname}</span></p>
                    </div>
                 </div>
                 <Users className="text-white/10 hidden md:block" size={32} />
              </div>

              {/* Chat Area */}
              <div className="bg-mafia-black/40 border border-white/5 h-[600px] flex flex-col backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                 <div 
                   ref={scrollRef}
                   className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-thin scrollbar-thumb-mafia-gold/20"
                 >
                    <AnimatePresence initial={false}>
                       {messages.length === 0 ? (
                         <div className="h-full flex flex-col items-center justify-center opacity-10">
                            <Hash size={80} />
                            <p className="mt-4 font-mono text-xs uppercase tracking-[0.5em]">Kanál je prázdný</p>
                         </div>
                       ) : (
                         messages.map((msg) => (
                           <motion.div 
                             key={msg.id}
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             className={`flex flex-col ${msg.user === nickname ? 'items-end' : 'items-start'}`}
                           >
                              <div className="flex items-center gap-3 mb-2">
                                 <span className={`text-[10px] font-black uppercase tracking-widest ${msg.user === nickname ? 'text-mafia-gold' : 'text-smoke-white/40'}`}>{msg.user}</span>
                                 <span className="text-[8px] font-mono text-white/20">
                                   {msg.time ? new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                 </span>
                              </div>
                              <div className={`px-6 py-4 max-w-md ${msg.user === nickname ? 'bg-mafia-gold/5 border-r-2 border-mafia-gold/40 text-right' : 'bg-white/5 border-l-2 border-white/10'} text-smoke-white font-sans text-sm md:text-base leading-relaxed break-words`}>
                                 {msg.text}
                              </div>
                           </motion.div>
                         ))
                       )}
                    </AnimatePresence>
                 </div>

                 {/* Input Area */}
                 <form 
                   onSubmit={handleSendMessage}
                   className="p-6 md:p-8 border-t border-white/5 bg-black/40 flex items-center gap-4 md:gap-6"
                 >
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="ZADEJTE ZPRÁVU..."
                      className="flex-1 bg-white/5 border border-white/10 px-6 py-4 text-sm font-mono tracking-widest uppercase focus:outline-none focus:border-mafia-gold transition-colors placeholder:text-white/10"
                    />
                    <button 
                      type="submit"
                      disabled={isBanned}
                      className="w-14 h-14 bg-mafia-gold flex items-center justify-center text-mafia-black hover:bg-white transition-colors shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.3)] flex-shrink-0 disabled:opacity-50"
                    >
                       <Send size={24} />
                    </button>
                 </form>
              </div>

              <div className="mt-8 flex justify-between items-center px-4">
                 <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.5em]">DIRECT_LINK_v2.1_REALTIME</span>
                 <div className="flex gap-4">
                    <div className="w-1.5 h-1.5 bg-mafia-gold/50 rounded-full"></div>
                    <span className="text-[9px] font-mono text-white/40 uppercase">SYNCED_WITH_CLOUD</span>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
