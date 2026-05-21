"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowLeft, 
  Trash2, 
  UserX, 
  Terminal,
  RefreshCw,
  Hash,
  AlertTriangle,
  Lock,
  Search,
  Info,
  Power,
  PowerOff
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { UserNetworkData } from "@/utils/network";

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: any;
  ip: string;
  userId?: string;
  network?: UserNetworkData;
}

export default function AdminChatModerationPage() {
  const { lang } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatEnabled, setIsChatEnabled] = useState(true);

  const ADMIN_PASSWORD = "MAFIA_PROTOCOL_737";

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMsgs = async () => {
      try {
        const res = await fetch('/api/chat');
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings?key=chat_enabled');
        if (res.ok) {
          const data = await res.json();
          // Default is true if not set
          setIsChatEnabled(data.value === null || data.value === 'true');
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchSettings();
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("mmbarber_admin_auth", "true");
    } else {
      alert("ACCESS DENIED");
      setPassword("");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("SMAZAT ZPRÁVU?")) return;
    try {
      await fetch(`/api/chat?id=${id}`, { method: 'DELETE' });
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const banUser = async (ip: string, user: string) => {
    if (!confirm(`ZABLOKOVAT IP ${ip} (${user})?`)) return;
    try {
      // NOTE: Temporarily omitting ban feature until banned_ips API route is added
      alert(`Banning currently disabled until API route is added for IPs.`);
    } catch (error) {
      console.error("Ban failed:", error);
    }
  };

  const clearChat = async () => {
    if (!confirm("VAROVÁNÍ: SMAZAT CELOU HISTORII CHATU?")) return;
    try {
      await fetch('/api/chat?all=true', { method: 'DELETE' });
      setMessages([]);
    } catch (error) {
      console.error("Clear failed:", error);
    }
  };

  const toggleChatEnabled = async () => {
    const newState = !isChatEnabled;
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'chat_enabled', value: newState ? 'true' : 'false' })
      });
      setIsChatEnabled(newState);
    } catch (error) {
      console.error("Failed to toggle chat:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full max-w-md bg-mafia-dark/80 border border-mafia-red/30 p-12 backdrop-blur-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-12">
            <Lock className="text-mafia-red mb-6" size={48} />
            <h1 className="text-3xl font-heading font-black text-white tracking-widest uppercase">CHAT_MODERATION</h1>
            <p className="text-[10px] font-mono text-mafia-red/60 uppercase tracking-[0.4em] mt-2">RESTRICTED_ACCESS</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-8">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="ENTER CODE..." className="w-full bg-black/40 border border-mafia-red/20 px-6 py-4 text-center text-white font-mono tracking-widest focus:outline-none focus:border-mafia-red transition-all" autoFocus />
            <button className="w-full py-4 bg-mafia-red text-white font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all">AUTHORIZE</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const filteredMessages = messages.filter(m => 
    m.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.ip.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12 selection:bg-mafia-red selection:text-white">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20 pb-8 border-b border-white/5">
           <div>
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="text-mafia-red" size={24} />
                 <h1 className="text-4xl font-heading font-black uppercase italic tracking-tighter">MODERACE <span className="text-mafia-red">CHATU</span></h1>
              </div>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">KOMUNITNÍ DOHLED_V1.0</p>
           </div>
           
           <div className="flex flex-wrap gap-4">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="HLEDAT (IP, TEXT, USER)..."
                   className="bg-white/5 border border-white/10 pl-12 pr-6 py-4 font-mono text-[10px] uppercase tracking-widest focus:border-mafia-red transition-all outline-none w-64"
                 />
              </div>
              <button onClick={toggleChatEnabled} className={`flex items-center gap-3 px-8 py-4 border font-mono text-[10px] uppercase tracking-widest transition-all ${isChatEnabled ? 'bg-mafia-gold/10 border-mafia-gold/20 text-mafia-gold hover:bg-mafia-gold hover:text-black' : 'bg-white/5 border-white/20 text-white/50 hover:bg-white/10'}`}>
                 {isChatEnabled ? <><Power size={16} /> CHAT ZAPNUTÝ</> : <><PowerOff size={16} /> CHAT SKRYTÝ</>}
              </button>
              <button onClick={clearChat} className="flex items-center gap-3 px-8 py-4 bg-mafia-red/10 border border-mafia-red/20 text-mafia-red font-mono text-[10px] uppercase tracking-widest hover:bg-mafia-red hover:text-white transition-all">
                 <Trash2 size={16} /> SMAZAT CHAT
              </button>
              <Link href="/admin" className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                 <ArrowLeft size={16} /> ZPĚT NA DASHBOARD
              </Link>
           </div>
        </header>

        <main className="space-y-4">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-30 animate-pulse">
                <RefreshCw size={40} className="animate-spin mb-4" />
                <p className="font-mono text-xs uppercase tracking-widest">Načítám data z mainframe...</p>
             </div>
           ) : filteredMessages.length === 0 ? (
             <div className="p-20 text-center border border-dashed border-white/5 opacity-20">
                <p className="font-mono text-xs uppercase tracking-widest">Žádné zprávy k zobrazení.</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                 <thead>
                    <tr className="bg-white/[0.02] border-b border-white/10 text-left">
                       <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-white/40">Čas</th>
                       <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-white/40">Uživatel</th>
                       <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-white/40">IP Adresa</th>
                       <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-white/40">Zpráva</th>
                       <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-white/40 text-right">Akce</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {filteredMessages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-white/[0.01] transition-colors group">
                         <td className="p-6 font-mono text-[10px] text-white/30">
                            {msg.time ? new Date(msg.time).toLocaleTimeString() : new Date().toLocaleTimeString()}
                         </td>
                         <td className="p-6">
                            <span className="font-heading font-black uppercase text-mafia-gold italic tracking-tighter">{msg.user}</span>
                         </td>
                         <td className="p-6">
                            <code className="text-[10px] font-mono bg-white/5 px-2 py-1 text-white/60 group-hover:text-mafia-red transition-colors">{msg.ip}</code>
                         </td>
                         <td className="p-6 max-w-xl">
                            <p className="text-sm text-white/80 leading-relaxed font-sans italic">"{msg.text}"</p>
                         </td>
                         <td className="p-6 text-right">
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={() => {
                                   if (msg.network) {
                                     alert(`IP: ${msg.network.ip}\nLOKALITA: ${msg.network.city || '?'}\nISP: ${msg.network.org || '?'}\nBROWSER: ${msg.network.userAgent}`);
                                   } else {
                                     alert(`IP: ${msg.ip}\nMetadata nedostupná.`);
                                   }
                                 }}
                                 className="p-3 bg-white/5 hover:bg-mafia-gold hover:text-black transition-all text-white/30"
                               >
                                  <Info size={16} />
                               </button>
                               <button 
                                 onClick={() => banUser(msg.ip, msg.user)}
                                 className="p-3 bg-white/5 hover:bg-mafia-red hover:text-white transition-all text-white/30"
                               >
                                  <UserX size={16} />
                               </button>
                               <button 
                                 onClick={() => deleteMessage(msg.id)}
                                 title="Smazat zprávu"
                                 className="p-3 bg-white/5 hover:bg-red-600 hover:text-white transition-all text-white/30"
                               >
                                  <Trash2 size={16} />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
           )}
        </main>

        <div className="mt-12 p-8 border border-mafia-red/20 bg-mafia-red/[0.02] flex items-start gap-4">
           <AlertTriangle className="text-mafia-red flex-shrink-0" size={20} />
           <div>
              <h4 className="text-[10px] font-black uppercase text-mafia-red tracking-widest mb-2">Pravidla moderování</h4>
              <p className="text-[9px] font-mono text-white/40 leading-relaxed uppercase">Smazání zprávy je okamžité. Blokování IP zabrání uživateli v dalším odesílání zpráv. Veškeré zásahy jsou nevratné a vyžadují potvrzení v dialogu.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
