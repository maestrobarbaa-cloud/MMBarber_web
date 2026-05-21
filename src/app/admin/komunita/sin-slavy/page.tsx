"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowLeft, 
  Trash2, 
  RefreshCw,
  Trophy,
  Lock,
  Search,
  User
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

interface Supporter {
  id: string;
  name: string;
  time: any;
}

export default function AdminHallOfFamePage() {
  const { lang } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const ADMIN_PASSWORD = "MAFIA_PROTOCOL_737";

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchSupporters = async () => {
      try {
        const res = await fetch('/api/sin-slavy');
        if (res.ok) {
          const data = await res.json();
          setSupporters(data);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchSupporters();
    const interval = setInterval(fetchSupporters, 3000);
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

  const deleteSupporter = async (id: string) => {
    if (!confirm("ODSTRANIT JMÉNO ZE SÍNĚ SLÁVY?")) return;
    try {
      await fetch(`/api/sin-slavy?id=${id}`, { method: 'DELETE' });
      setSupporters(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full max-w-md bg-mafia-dark/80 border border-mafia-gold/30 p-12 backdrop-blur-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-12">
            <Lock className="text-mafia-gold mb-6" size={48} />
            <h1 className="text-3xl font-heading font-black text-white tracking-widest uppercase">HALL_OF_FAME_AUTH</h1>
            <p className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-[0.4em] mt-2">RESTRICTED_ACCESS</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-8">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="ENTER CODE..." className="w-full bg-black/40 border border-mafia-gold/20 px-6 py-4 text-center text-white font-mono tracking-widest focus:outline-none focus:border-mafia-gold transition-all" autoFocus />
            <button className="w-full py-4 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.2)]">AUTHORIZE</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const filteredSupporters = supporters.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12 selection:bg-mafia-gold selection:text-black">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20 pb-8 border-b border-white/5">
           <div>
              <div className="flex items-center gap-3 mb-4">
                 <Trophy className="text-mafia-gold" size={24} />
                 <h1 className="text-4xl font-heading font-black uppercase italic tracking-tighter">SPRÁVA <span className="text-mafia-gold">SÍNĚ SLÁVY</span></h1>
              </div>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">ARCHIV LEGEND_V1.0</p>
           </div>
           
           <div className="flex flex-wrap gap-4">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="HLEDAT JMÉNO..."
                   className="bg-white/5 border border-white/10 pl-12 pr-6 py-4 font-mono text-[10px] uppercase tracking-widest focus:border-mafia-gold transition-all outline-none w-64"
                 />
              </div>
              <Link href="/admin" className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                 <ArrowLeft size={16} /> ZPĚT NA DASHBOARD
              </Link>
           </div>
        </header>

        <main className="space-y-4">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-30 animate-pulse">
                <RefreshCw size={40} className="animate-spin mb-4" />
                <p className="font-mono text-xs uppercase tracking-widest">Načítám seznam legend...</p>
             </div>
           ) : filteredSupporters.length === 0 ? (
             <div className="p-20 text-center border border-dashed border-white/5 opacity-20">
                <p className="font-mono text-xs uppercase tracking-widest">Žádná jména k zobrazení.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSupporters.map((s) => (
                  <motion.div 
                    layout
                    key={s.id}
                    className="p-8 border border-white/5 bg-white/[0.02] flex justify-between items-center group hover:border-mafia-gold/20 transition-all"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-mafia-gold/10 flex items-center justify-center text-mafia-gold">
                           <User size={18} />
                        </div>
                        <div>
                           <h3 className="text-xl font-heading font-black text-white uppercase tracking-tighter italic">{s.name}</h3>
                           <p className="text-[9px] font-mono text-white/20 uppercase">Přidáno: {s.time ? new Date(s.time).toLocaleDateString() : 'Dnes'}</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => deleteSupporter(s.id)}
                       className="p-3 bg-white/5 hover:bg-mafia-red hover:text-white transition-all text-white/20 opacity-0 group-hover:opacity-100"
                     >
                        <Trash2 size={16} />
                     </button>
                  </motion.div>
                ))}
             </div>
           )}
        </main>
      </div>
    </div>
  );
}
