"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Key, Plus, Trash2, Clock, ShieldAlert, FileText, Send } from "lucide-react";
import Link from "next/link";

interface PasswordEntry {
  id: string;
  password: string;
  createdAt: number;
  expiresAt: number;
}

interface SecretArticle {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  barberId: string;
}

export default function ZivotopisAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [articles, setArticles] = useState<SecretArticle[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newArticleTitle, setNewArticleTitle] = useState("");
  const [newArticleContent, setNewArticleContent] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/cv-auth?action=list');
      const data = await res.json();
      setPasswords(data.passwords || []);
      setArticles(data.articles || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = async () => {
    try {
      const res = await fetch('/api/cv-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' })
      });
      const newPass = await res.json();
      setPasswords(prev => [...prev, newPass]);
    } catch (e) {
      console.error(e);
    }
  };

  const deletePassword = async (id: string) => {
    try {
      await fetch('/api/cv-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      setPasswords(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const addArticle = async () => {
    if (!newArticleTitle.trim() || !newArticleContent.trim()) return;
    try {
      const res = await fetch('/api/cv-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            action: 'add_article', 
            title: newArticleTitle, 
            content: newArticleContent, 
            barberId: 'tomas' 
        })
      });
      const newArt = await res.json();
      setArticles(prev => [...prev, newArt]);
      setNewArticleTitle("");
      setNewArticleContent("");
    } catch (e) {
      console.error(e);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Opravdu smazat tento útržek?")) return;
    try {
      await fetch('/api/cv-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_article', id })
      });
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-mono">
        ACCESS DENIED
      </div>
    );
  }

  const formatTimeLeft = (expiresAt: number) => {
    const now = Date.now();
    if (now > expiresAt) return "EXPIROVÁNO";
    const hours = Math.floor((expiresAt - now) / (1000 * 60 * 60));
    const minutes = Math.floor(((expiresAt - now) % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12 font-mono selection:bg-mafia-gold selection:text-black">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 pb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Key className="text-mafia-gold" size={24} />
              <h1 className="text-3xl font-heading font-black uppercase tracking-widest italic">
                TAJNÝ ŽIVOTOPIS <span className="text-mafia-gold">CENTRÁLA</span>
              </h1>
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.3em]">
              Správa Enigma hesel a redakční systém tajných záznamů
            </p>
          </div>
          <Link href="/admin" className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
            <ArrowLeft size={14} /> ZPĚT DO CENTRÁLY
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT SIDE: PASSWORDS */}
          <div className="space-y-8 border-r border-white/5 pr-0 lg:pr-12">
              <div>
                  <h2 className="text-mafia-gold font-bold uppercase tracking-widest text-lg mb-6 border-b border-mafia-gold/20 pb-2">Přístupová Hesla</h2>
                  <div className="p-6 border border-mafia-gold/30 bg-mafia-gold/5 rounded-sm mb-8">
                    <ShieldAlert className="text-mafia-gold mb-4" size={32} />
                    <h2 className="text-mafia-gold font-bold uppercase tracking-widest text-sm mb-2">Generátor Kódů</h2>
                    <p className="text-xs text-white/50 leading-relaxed mb-6">
                      Hesla mají platnost přesně 24 hodin a odemykají celý tajný životopis včetně všech níže napsaných útržků.
                    </p>
                    <button 
                      onClick={generatePassword}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-mafia-gold text-black font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                    >
                      <Plus size={16} /> GENEROVAT HESLO
                    </button>
                  </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-4 border-b border-white/10 pb-2">Seznam vygenerovaných hesel</h3>
                
                {passwords.length === 0 ? (
                  <div className="p-8 text-center border border-white/5 bg-white/5 text-white/30 text-xs uppercase tracking-widest">
                    Žádná hesla neexistují
                  </div>
                ) : (
                  passwords.sort((a, b) => b.createdAt - a.createdAt).map(p => {
                    const isExpired = Date.now() > p.expiresAt;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={p.id}
                        className={`flex items-center justify-between p-4 border rounded-sm transition-all ${isExpired ? 'border-red-500/30 bg-red-500/5' : 'border-mafia-gold/30 bg-black/50 hover:bg-mafia-gold/5'}`}
                      >
                        <div>
                          <div className={`text-xl font-black tracking-[0.3em] ${isExpired ? 'text-red-400/50 line-through' : 'text-mafia-gold'}`}>
                            {p.password}
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-[10px] uppercase tracking-widest text-white/40">
                            <Clock size={12} />
                            <span className={isExpired ? 'text-red-400/50' : 'text-white/70'}>
                              ZBYVÁ: {formatTimeLeft(p.expiresAt)}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => deletePassword(p.id)}
                          className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all rounded-sm"
                          title="Smazat heslo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </div>
          </div>

          {/* RIGHT SIDE: ARTICLES */}
          <div className="space-y-8">
              <div>
                  <h2 className="text-mafia-gold font-bold uppercase tracking-widest text-lg mb-6 border-b border-mafia-gold/20 pb-2 flex items-center gap-2">
                      <FileText size={20} /> Tajné Útržky (Záznamy)
                  </h2>
                  <div className="p-6 border border-white/10 bg-white/5 rounded-sm mb-8 space-y-4">
                      <p className="text-xs text-white/50 leading-relaxed mb-2">
                          Zde můžeš sepisovat své myšlenky, postřehy z trhu nebo psychologie. Všechny tyto záznamy se připojí k základnímu tajnému životopisu.
                      </p>
                      
                      <div>
                          <label className="text-[10px] uppercase tracking-widest text-mafia-gold mb-2 block">Nadpis (Volitelné)</label>
                          <input 
                              type="text" 
                              value={newArticleTitle}
                              onChange={e => setNewArticleTitle(e.target.value)}
                              placeholder="Např.: Cykly a tlak na výkon (Březen 2026)"
                              className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white focus:border-mafia-gold focus:outline-none transition-colors"
                          />
                      </div>
                      
                      <div>
                          <label className="text-[10px] uppercase tracking-widest text-mafia-gold mb-2 block">Obsah záznamu</label>
                          <textarea 
                              value={newArticleContent}
                              onChange={e => setNewArticleContent(e.target.value)}
                              placeholder="Tvůj tajný text sem..."
                              rows={8}
                              className="w-full bg-black/50 border border-white/10 p-4 text-sm text-white/80 leading-relaxed focus:border-mafia-gold focus:outline-none transition-colors resize-y custom-scrollbar"
                          ></textarea>
                      </div>
                      
                      <button 
                          onClick={addArticle}
                          disabled={!newArticleTitle.trim() || !newArticleContent.trim()}
                          className="w-full flex items-center justify-center gap-2 py-4 bg-white/10 text-white font-black uppercase tracking-widest hover:bg-mafia-gold hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          <Send size={16} /> PŘIDAT ZÁZNAM K PROFILU
                      </button>
                  </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-4 border-b border-white/10 pb-2">Publikované tajné útržky</h3>
                
                {articles.length === 0 ? (
                  <div className="p-8 text-center border border-white/5 bg-white/5 text-white/30 text-xs uppercase tracking-widest">
                    Žádné útržky nebyly napsány
                  </div>
                ) : (
                  articles.sort((a, b) => b.createdAt - a.createdAt).map(a => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={a.id}
                        className="p-5 border border-white/10 bg-black/30 rounded-sm relative group"
                      >
                        <div className="flex justify-between items-start gap-4 mb-3">
                            <h4 className="text-mafia-gold font-black uppercase tracking-wider">{a.title}</h4>
                            <button 
                              onClick={() => deleteArticle(a.id)}
                              className="text-red-500/50 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                              title="Smazat záznam"
                            >
                              <Trash2 size={14} />
                            </button>
                        </div>
                        <div className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap line-clamp-3">
                            {a.content}
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-[9px] uppercase tracking-widest text-white/30">
                            <Clock size={10} /> Přidáno: {new Date(a.createdAt).toLocaleDateString('cs-CZ')}
                        </div>
                      </motion.div>
                  ))
                )}
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}
