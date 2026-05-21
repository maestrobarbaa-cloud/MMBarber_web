"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MessageCircle, Trash2, CheckCircle2, RefreshCw,
  Newspaper, Lightbulb, Star, HelpCircle, Bell, BellOff,
  ChevronDown, ChevronUp, Trash
} from "lucide-react";
import Link from "next/link";

interface NovinkaMsg {
  id: string;
  status: "new" | "read";
  createdAt: number | null;
  nickname: string;
  category: "NOVINKA" | "TIP" | "POCHVALA" | "DOTAZ" | "VZKAZ";
  message: string;
}

const CAT_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  NOVINKA:  { label: "Novinka",  icon: <Newspaper    size={14} />, color: "text-blue-400   border-blue-400/30   bg-blue-400/5"   },
  TIP:      { label: "Tip",      icon: <Lightbulb    size={14} />, color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5" },
  POCHVALA: { label: "Pochvala", icon: <Star          size={14} />, color: "text-mafia-gold border-mafia-gold/30 bg-mafia-gold/5" },
  DOTAZ:    { label: "Dotaz",    icon: <HelpCircle   size={14} />, color: "text-purple-400 border-purple-400/30 bg-purple-400/5" },
  VZKAZ:    { label: "Vzkaz",    icon: <MessageCircle size={14} />, color: "text-white/50   border-white/20       bg-white/5"      },
};

export default function AdminNovinkyPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [msgs, setMsgs] = useState<NovinkaMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "read">("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [deletingAll, setDeletingAll] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      try {
        const res = await fetch('/api/novinky');
        if (res.ok) {
          const data = await res.json();
          setMsgs(data);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const markRead = async (id: string) => {
    try {
      await fetch('/api/novinky', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'read' })
      });
      // Optimistic update
      setMsgs(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m));
    } catch(e) { console.error(e); }
  };

  const deleteMsg = async (id: string) => {
    if (!confirm("Smazat tuto zprávu?")) return;
    try {
      await fetch(`/api/novinky?id=${id}`, { method: 'DELETE' });
      // Optimistic update
      setMsgs(prev => prev.filter(m => m.id !== id));
    } catch(e) { console.error(e); }
  };

  const deleteAll = async () => {
    if (!confirm("Opravdu smazat VŠECHNY zprávy? Tato akce je nevratná.")) return;
    setDeletingAll(true);
    try {
      await fetch('/api/novinky?all=true', { method: 'DELETE' });
      setMsgs([]);
    } finally {
      setDeletingAll(false);
    }
  };

  const formatDate = (ts: number | null) => {
    if (!ts) return "–";
    return new Date(ts).toLocaleString("cs-CZ", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-mafia-gold font-mono uppercase tracking-widest mb-4">Přístup odepřen</p>
          <Link href="/admin" className="text-white/40 font-mono text-sm underline">← Přihlásit se</Link>
        </div>
      </div>
    );
  }

  const filtered = msgs.filter(m => {
    const matchStatus = filter === "all" || m.status === filter;
    const matchCat = catFilter === "all" || m.category === catFilter;
    return matchStatus && matchCat;
  });

  const newCount = msgs.filter(m => m.status === "new").length;

  return (
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 pb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {newCount > 0
                ? <Bell className="text-mafia-gold animate-pulse" size={22} />
                : <BellOff className="text-white/20" size={22} />
              }
              <h1 className="text-3xl font-heading font-black uppercase italic tracking-tighter">
                INBOX <span className="text-mafia-gold">BARBERA</span>
              </h1>
              {newCount > 0 && (
                <div className="w-7 h-7 bg-mafia-red rounded-full flex items-center justify-center text-white text-xs font-bold font-mono animate-pulse shadow-[0_0_20px_rgba(255,0,0,0.5)]">
                  {newCount}
                </div>
              )}
            </div>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">
              {msgs.length} celkem · {newCount} nových
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={deleteAll}
              disabled={deletingAll || msgs.length === 0}
              className="flex items-center gap-2 px-5 py-3 border border-red-900/40 text-red-500/50 font-mono text-[10px] uppercase tracking-widest hover:border-red-500/60 hover:text-red-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {deletingAll
                ? <RefreshCw size={13} className="animate-spin" />
                : <Trash size={13} />
              }
              Smazat vše
            </button>
            <Link href="/admin"
              className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
              <ArrowLeft size={14} /> Zpět
            </Link>
          </div>
        </header>

        {/* Filtry */}
        <div className="flex flex-wrap gap-3 mb-10">
          {/* Status filter */}
          <div className="flex gap-1">
            {(["all", "new", "read"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all ${
                  filter === f ? "bg-mafia-gold text-mafia-black border-mafia-gold" : "border-white/10 text-white/40 hover:border-mafia-gold/40"
                }`}>
                {f === "all" ? "Vše" : f === "new" ? `Nové (${newCount})` : "Přečtené"}
              </button>
            ))}
          </div>

          {/* Kategorie filter */}
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => setCatFilter("all")}
              className={`px-3 py-2 text-[9px] font-mono uppercase tracking-widest border transition-all ${catFilter === "all" ? "bg-white/10 border-white/20" : "border-white/5 text-white/20"}`}>
              Vše
            </button>
            {Object.entries(CAT_META).map(([id, meta]) => (
              <button key={id} onClick={() => setCatFilter(id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[9px] font-mono uppercase tracking-widest border transition-all ${
                  catFilter === id ? meta.color : "border-white/5 text-white/20 hover:text-white/40"
                }`}>
                {meta.icon} {meta.label}
              </button>
            ))}
          </div>

          {loading && <RefreshCw size={14} className="animate-spin text-white/20 self-center ml-2" />}
        </div>

        {/* Zprávy */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-white/20 font-mono uppercase tracking-widest">
            <MessageCircle size={40} className="mx-auto mb-4 opacity-20" />
            {loading ? "Načítám..." : "Žádné zprávy"}
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map(msg => {
                const isExpanded = expandedId === msg.id;
                const isNew = msg.status === "new";
                const cat = CAT_META[msg.category] || CAT_META["VZKAZ"];

                return (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`border transition-all duration-300 ${
                      isNew
                        ? "border-mafia-gold/40 bg-mafia-gold/5 shadow-[0_0_15px_rgba(197,160,89,0.06)]"
                        : "border-white/8 bg-white/[0.02]"
                    }`}
                  >
                    {/* Řádek */}
                    <button
                      onClick={() => {
                        setExpandedId(isExpanded ? null : msg.id);
                        if (isNew) markRead(msg.id);
                      }}
                      className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
                    >
                      {/* Nová tečka */}
                      {isNew && <div className="w-2 h-2 rounded-full bg-mafia-gold animate-pulse flex-shrink-0" />}

                      {/* Kategorie badge */}
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 border text-[9px] font-mono uppercase tracking-wider flex-shrink-0 ${cat.color}`}>
                        {cat.icon} {cat.label}
                      </div>

                      {/* Jméno + preview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-heading font-bold text-smoke-white text-sm">{msg.nickname}</span>
                          <span className="text-white/30 text-xs font-mono">{formatDate(msg.createdAt)}</span>
                        </div>
                        <p className="text-white/40 text-xs font-sans truncate mt-0.5">{msg.message}</p>
                      </div>

                      {isExpanded
                        ? <ChevronUp size={14} className="text-mafia-gold/50 flex-shrink-0" />
                        : <ChevronDown size={14} className="text-white/20 flex-shrink-0" />
                      }
                    </button>

                    {/* Detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 border-t border-white/5 pt-5 space-y-4">
                            <p className="text-smoke-white/85 font-sans text-sm leading-relaxed border-l-2 border-mafia-gold/40 pl-4">
                              {msg.message}
                            </p>
                            <div className="flex items-center gap-3 pt-2">
                              {isNew && (
                                <button onClick={() => markRead(msg.id)}
                                  className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white/40 font-mono text-[9px] uppercase tracking-widest hover:border-mafia-gold/40 hover:text-white/60 transition-all">
                                  <CheckCircle2 size={12} /> Přečteno
                                </button>
                              )}
                              <button onClick={() => deleteMsg(msg.id)}
                                className="flex items-center gap-2 px-4 py-2 border border-red-900/30 text-red-500/40 font-mono text-[9px] uppercase tracking-widest hover:border-red-500/50 hover:text-red-400 transition-all ml-auto">
                                <Trash2 size={12} /> Smazat
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}
