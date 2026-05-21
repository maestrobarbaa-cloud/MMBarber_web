"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Heart, Mail, Phone, User, Calendar,
  CheckCircle2, Trash2, RefreshCw, MessageSquare, ChevronDown, ChevronUp
} from "lucide-react";
import Link from "next/link";

interface SeznamkaRequest {
  id: string;
  status: "new" | "read";
  createdAt: number;
  name: string;
  age: number;
  email: string;
  phone?: string;
  idealMan: string;
  characters: string[];
  ageRange: [number, number];
  dealbreaker?: string;
}

export default function AdminSeznamkaPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [requests, setRequests] = useState<SeznamkaRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "read">("all");

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/seznamka');
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
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
      await fetch('/api/seznamka', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'read' })
      });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'read' } : r));
    } catch(e) { console.error(e); }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Opravdu smazat tuto zprávu?")) return;
    try {
      await fetch(`/api/seznamka?id=${id}`, { method: 'DELETE' });
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch(e) { console.error(e); }
  };

  const formatDate = (ts: number | null) => {
    if (!ts) return "–";
    return new Date(ts).toLocaleString("cs-CZ", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-mafia-gold font-mono uppercase tracking-widest mb-4">Přístup odepřen</p>
          <Link href="/admin" className="text-white/40 font-mono text-sm underline">← Přihlásit se</Link>
        </div>
      </div>
    );
  }

  const filtered = requests.filter(r => filter === "all" || r.status === filter);
  const newCount = requests.filter(r => r.status === "new").length;

  return (
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 pb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Heart className="text-mafia-gold" size={22} />
              <h1 className="text-3xl font-heading font-black uppercase italic tracking-tighter">
                ZPRÁVY ZE <span className="text-mafia-gold">SEZNAMKY</span>
              </h1>
            </div>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">
              {requests.length} celkem · {newCount} nových
            </p>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={14} /> ZPĚT DO ADMINU
          </Link>
        </header>

        {/* Filtr */}
        <div className="flex gap-3 mb-10">
          {(["all", "new", "read"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all ${
                filter === f
                  ? "bg-mafia-gold text-mafia-black border-mafia-gold"
                  : "border-white/10 text-white/40 hover:border-mafia-gold/40"
              }`}
            >
              {f === "all" ? "Vše" : f === "new" ? `Nové (${newCount})` : "Přečtené"}
            </button>
          ))}
          {loading && <RefreshCw size={16} className="animate-spin text-white/30 ml-auto self-center" />}
        </div>

        {/* Zprávy */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-white/20 font-mono uppercase tracking-widest">
            <MessageSquare size={40} className="mx-auto mb-4 opacity-20" />
            Žádné zprávy
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((req) => {
                const isExpanded = expandedId === req.id;
                const isNew = req.status === "new";

                return (
                  <motion.div
                    key={req.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`border transition-all duration-300 ${
                      isNew
                        ? "border-mafia-gold/50 bg-mafia-gold/5 shadow-[0_0_20px_rgba(197,160,89,0.08)]"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    {/* Hlavička zprávy */}
                    <button
                      onClick={() => {
                        setExpandedId(isExpanded ? null : req.id);
                        if (isNew) markRead(req.id);
                      }}
                      className="w-full p-6 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
                    >
                      {isNew && (
                        <div className="w-2 h-2 rounded-full bg-mafia-gold animate-pulse flex-shrink-0" />
                      )}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-mafia-gold/60" />
                          <span className="font-heading font-bold text-smoke-white">{req.name}</span>
                          <span className="text-white/30 text-sm">{req.age} let</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-white/30" />
                          <a
                            href={`mailto:${req.email}`}
                            onClick={e => e.stopPropagation()}
                            className="text-sm text-mafia-gold/80 hover:text-mafia-gold underline truncate"
                          >
                            {req.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-white/30 text-sm">
                          <Calendar size={14} />
                          {formatDate(req.createdAt)}
                        </div>
                        <div className="flex items-center gap-2">
                          {req.characters.slice(0, 3).map(c => (
                            <span key={c} className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 text-white/40">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-mafia-gold/50 flex-shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-white/20 flex-shrink-0" />
                      )}
                    </button>

                    {/* Rozbalený detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 border-t border-white/5 pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                              {/* Kontakt */}
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-widest">Kontakt</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Mail size={13} className="text-mafia-gold/50" />
                                    <a href={`mailto:${req.email}`} className="text-mafia-gold hover:underline">{req.email}</a>
                                  </div>
                                  {req.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone size={13} className="text-mafia-gold/50" />
                                      <a href={`tel:${req.phone}`} className="text-smoke-white/70">{req.phone}</a>
                                    </div>
                                  )}
                                  <div className="text-white/30 font-mono text-[10px]">
                                    Preferovaný věk partnera: {req.ageRange?.[0]}–{req.ageRange?.[1]} let
                                  </div>
                                </div>
                              </div>

                              {/* Charakter */}
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-widest">Charakter</h4>
                                <div className="flex flex-wrap gap-2">
                                  {req.characters.length > 0 ? req.characters.map(c => (
                                    <span key={c} className="text-[10px] font-mono bg-mafia-gold/10 border border-mafia-gold/20 px-3 py-1 text-mafia-gold">
                                      {c}
                                    </span>
                                  )) : <span className="text-white/20 text-sm">–</span>}
                                </div>
                              </div>
                            </div>

                            {/* Ideální muž */}
                            <div>
                              <h4 className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-widest mb-3">Její ideální muž</h4>
                              <p className="text-smoke-white/80 font-sans text-sm leading-relaxed border-l-2 border-mafia-gold/30 pl-4 italic">
                                {req.idealMan}
                              </p>
                            </div>

                            {/* Deal breaker */}
                            {req.dealbreaker && (
                              <div>
                                <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-3">Co jí vadí</h4>
                                <p className="text-smoke-white/50 font-sans text-sm leading-relaxed border-l-2 border-white/10 pl-4">
                                  {req.dealbreaker}
                                </p>
                              </div>
                            )}

                            {/* Akce */}
                            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                              <a
                                href={`mailto:${req.email}?subject=MMBarber Seznamka – odpověď`}
                                className="flex items-center gap-2 px-5 py-2.5 bg-mafia-gold text-mafia-black font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all"
                              >
                                <Mail size={13} /> Napsat e-mail
                              </a>
                              {isNew && (
                                <button
                                  onClick={() => markRead(req.id)}
                                  className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-white/40 font-mono text-[10px] uppercase tracking-widest hover:border-mafia-gold/40 hover:text-white/60 transition-all"
                                >
                                  <CheckCircle2 size={13} /> Označit přečtené
                                </button>
                              )}
                              <button
                                onClick={() => deleteRequest(req.id)}
                                className="flex items-center gap-2 px-5 py-2.5 border border-red-900/30 text-red-500/40 font-mono text-[10px] uppercase tracking-widest hover:border-red-500/50 hover:text-red-400 transition-all ml-auto"
                              >
                                <Trash2 size={13} /> Smazat
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
