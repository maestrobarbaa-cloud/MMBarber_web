"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowLeft, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Lock,
  Search,
  Zap,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Clock,
  Check
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

interface Suggestion {
  id: string;
  user: string;
  userId: string;
  content: string;
  points: string[];
  userPriority: number;
  adminPriority?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN';
  likes: string[];
  adminResponse?: string;
  createdAt: any;
}

export default function AdminSuggestionsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN'>('PENDING');

  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [selectedAdminPriority, setSelectedAdminPriority] = useState<number>(5);
  const [isResponsePublic, setIsResponsePublic] = useState(true);

  const ADMIN_PASSWORD = "MAFIA_PROTOCOL_737";

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(
      collection(db, "suggestions"), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Suggestion[];
      setSuggestions(data);
      setLoading(false);
    });

    return () => unsubscribe();
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

  const updateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await updateDoc(doc(db, "suggestions", id), { 
        status,
        updatedAt: serverTimestamp() 
      });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleResponse = async (id: string) => {
    try {
      await updateDoc(doc(db, "suggestions", id), { 
        adminResponse,
        adminPriority: selectedAdminPriority,
        status: isResponsePublic ? "APPROVED" : "HIDDEN", 
        updatedAt: serverTimestamp() 
      });
      setRespondingTo(null);
      setAdminResponse("");
      setIsResponsePublic(true);
    } catch (error) {
      console.error("Response failed:", error);
    }
  };

  const deleteSuggestion = async (id: string) => {
    if (!confirm("SMAZAT NÁVRH NAVŽDY?")) return;
    try {
      await deleteDoc(doc(db, "suggestions", id));
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
            <h1 className="text-3xl font-heading font-black text-white tracking-widest uppercase text-center">FUTURE_MODERATION</h1>
            <p className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-[0.4em] mt-2">RESTRICTED_ACCESS</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-8">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="ENTER CODE..." className="w-full bg-black/40 border border-mafia-gold/20 px-6 py-4 text-center text-white font-mono tracking-widest focus:outline-none focus:border-mafia-gold transition-all" autoFocus />
            <button className="w-full py-4 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.5em] hover:bg-white transition-all">AUTHORIZE</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const filteredSuggestions = suggestions.filter(s => {
    const matchesSearch = s.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'ALL' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20 pb-8 border-b border-white/5">
           <div>
              <div className="flex items-center gap-3 mb-4">
                 <Zap className="text-mafia-gold" size={24} />
                 <h1 className="text-4xl font-heading font-black uppercase italic tracking-tighter">VIZE & <span className="text-mafia-gold">MODERACE</span></h1>
              </div>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">FUTURE_CONTROL_PANEL_V1.0</p>
           </div>
           
           <div className="flex flex-wrap gap-4">
              <div className="flex bg-white/5 border border-white/10 p-1">
                 {(['ALL', 'PENDING', 'APPROVED', 'HIDDEN', 'REJECTED'] as const).map((f) => (
                   <button 
                     key={f}
                     onClick={() => setFilter(f)}
                     className={`px-4 py-2 font-mono text-[9px] uppercase tracking-widest transition-all ${filter === f ? 'bg-mafia-gold text-mafia-black' : 'text-white/40 hover:text-white'}`}
                   >
                     {f}
                   </button>
                 ))}
              </div>
              <Link href="/admin" className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                 <ArrowLeft size={16} /> ZPĚT
              </Link>
           </div>
        </header>

        <main className="space-y-8">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-30 animate-pulse">
                <TrendingUp size={40} className="animate-bounce mb-4 text-mafia-gold" />
                <p className="font-mono text-xs uppercase tracking-widest">SYNCHING FUTURE...</p>
             </div>
           ) : filteredSuggestions.length === 0 ? (
             <div className="p-20 text-center border border-dashed border-white/5 opacity-20">
                <p className="font-mono text-xs uppercase tracking-widest">No suggestions found for this criteria.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 gap-6">
                {filteredSuggestions.map((s) => (
                  <motion.div 
                    key={s.id}
                    layout
                    className={`bg-mafia-dark/40 border p-8 relative overflow-hidden transition-all duration-500 ${s.status === 'PENDING' ? 'border-mafia-gold/20' : s.status === 'APPROVED' ? 'border-green-500/20' : 'border-mafia-red/20 opacity-50'}`}
                  >
                     <div className="flex flex-col lg:flex-row justify-between gap-12">
                        <div className="flex-1 space-y-6">
                           <div className="flex flex-wrap items-center gap-4">
                              <span className={`px-3 py-1 border text-[9px] font-mono tracking-widest uppercase ${s.status === 'PENDING' ? 'text-mafia-gold border-mafia-gold/30' : s.status === 'APPROVED' ? 'text-green-500 border-green-500/30' : s.status === 'HIDDEN' ? 'text-blue-400 border-blue-400/30' : 'text-mafia-red border-mafia-red/30'}`}>
                                 STATUS: {s.status}
                              </span>
                              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                                 <Clock size={12} /> {s.createdAt?.toDate ? s.createdAt.toDate().toLocaleString() : 'N/A'}
                              </span>
                              <span className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest font-black">
                                 USER: {s.user} ({s.likes?.length || 0} LIKES)
                              </span>
                              <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                                 USER_PRIORITY: {s.userPriority}/10
                              </span>
                           </div>

                           <div className="space-y-3">
                              {s.points.map((p, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                   <ChevronRight className="text-mafia-gold mt-1" size={14} />
                                   <p className="text-lg text-white font-sans italic">{p}</p>
                                </div>
                              ))}
                           </div>

                           {s.adminResponse && (
                             <div className="mt-8 p-6 bg-mafia-gold/10 border-l-2 border-mafia-gold">
                                <span className="text-[9px] font-black uppercase text-mafia-gold tracking-[0.3em] block mb-2">ADMIN_FEEDBACK</span>
                                <p className="text-sm text-white/80 italic font-sans">{s.adminResponse}</p>
                                <div className="mt-4 text-[9px] font-mono text-mafia-gold/60 uppercase">SYSTEM_PRIORITY_SET: {s.adminPriority}</div>
                             </div>
                           )}
                        </div>

                        <div className="flex flex-wrap lg:flex-col justify-end gap-3 min-w-[200px]">
                           {respondingTo === s.id ? (
                             <div className="w-full space-y-4 bg-black/40 p-6 border border-mafia-gold/30">
                                <textarea 
                                  value={adminResponse}
                                  onChange={(e) => setAdminResponse(e.target.value)}
                                  placeholder="NAPIŠ ODPOVĚĎ A SCHVÁLI..."
                                  className="w-full bg-black/60 border border-mafia-gold/40 p-6 font-sans text-lg text-white focus:border-mafia-gold outline-none resize-y min-h-[300px]"
                                  rows={12}
                                />
                                <div className="space-y-2">
                                   <label className="text-[8px] font-mono text-mafia-gold uppercase tracking-widest">NASTAVIT ADMIN PRIORITU (1-10)</label>
                                   <div className="grid grid-cols-5 md:grid-cols-10 gap-1">
                                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
                                        <button 
                                          key={p} 
                                          onClick={() => setSelectedAdminPriority(p)}
                                          className={`py-2 text-[8px] border font-mono ${selectedAdminPriority === p ? 'bg-mafia-gold text-mafia-black border-mafia-gold' : 'border-white/10 text-white/30'}`}
                                        >
                                          {p}
                                        </button>
                                      ))}
                                   </div>
                                </div>
                                   <div className="flex items-center gap-4 py-4 border-t border-white/5">
                                      <button 
                                        type="button"
                                        onClick={() => setIsResponsePublic(!isResponsePublic)}
                                        className={`flex items-center gap-3 px-4 py-3 border transition-all ${isResponsePublic ? 'border-mafia-gold text-mafia-gold bg-mafia-gold/10' : 'border-white/10 text-white/30'}`}
                                      >
                                         <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${isResponsePublic ? 'border-mafia-gold bg-mafia-gold text-black' : 'border-white/20 bg-black/40'}`}>
                                            {isResponsePublic && <Check size={14} />}
                                         </div>
                                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isResponsePublic ? 'ZVEŘEJNIT VEŘEJNĚ' : 'SOUKROMÁ ODPOVĚĎ'}</span>
                                      </button>
                                   </div>
                                   <div className="flex gap-2">
                                      <button 
                                        onClick={() => handleResponse(s.id)}
                                        className="flex-1 py-4 bg-mafia-gold text-mafia-black font-black uppercase text-[11px] tracking-widest hover:bg-white transition-all"
                                      >
                                         {isResponsePublic ? 'ODESLAT & ZVEŘEJNIT' : 'ULOŽIT SOUKROMĚ'}
                                      </button>
                                      <button 
                                        onClick={() => setRespondingTo(null)}
                                        className="px-6 py-4 bg-white/5 text-white/40 font-black uppercase text-[11px] tracking-widest hover:text-white"
                                      >
                                         X
                                      </button>
                                   </div>
                             </div>
                           ) : (
                             <>
                               <button 
                                 onClick={() => setRespondingTo(s.id)}
                                 className="flex items-center justify-center gap-3 px-6 py-4 bg-mafia-gold/10 border border-mafia-gold/30 text-mafia-gold font-mono text-[10px] uppercase tracking-widest hover:bg-mafia-gold hover:text-mafia-black transition-all"
                               >
                                  <MessageSquare size={14} /> ODPOVĚDĚT
                               </button>
                               <div className="grid grid-cols-2 gap-2">
                                  <button 
                                    onClick={() => updateStatus(s.id, 'APPROVED')}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-500 font-mono text-[10px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all"
                                  >
                                     <CheckCircle2 size={14} /> OK
                                  </button>
                                  <button 
                                    onClick={() => updateStatus(s.id, 'REJECTED')}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-mafia-red/10 border border-mafia-red/20 text-mafia-red font-mono text-[10px] uppercase tracking-widest hover:bg-mafia-red hover:text-white transition-all"
                                  >
                                     <XCircle size={14} /> NO
                                  </button>
                               </div>
                               <button 
                                 onClick={() => deleteSuggestion(s.id)}
                                 className="flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-white/20 font-mono text-[10px] uppercase tracking-widest hover:bg-mafia-red hover:text-white transition-all"
                               >
                                  <Trash2 size={14} /> SMAZAT
                               </button>
                             </>
                           )}
                        </div>
                     </div>
                  </motion.div>
                ))}
             </div>
           )}
        </main>

        <div className="mt-12 p-8 border border-mafia-gold/20 bg-mafia-gold/[0.02] flex items-start gap-4">
           <AlertTriangle className="text-mafia-gold flex-shrink-0" size={20} />
           <div>
              <h4 className="text-[10px] font-black uppercase text-mafia-gold tracking-widest mb-2">Pravidla schvalování</h4>
              <p className="text-[9px] font-mono text-white/40 leading-relaxed uppercase">
                Návrhy jsou po schválení (tlačítko OK nebo Odpověď) viditelné veřejně. Admin priorita přepisuje uživatelskou prioritu při řazení. 
                Likes jsou klíčovým indikátorem zájmu komunity. Rentabilita je na tvém uvážení.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
