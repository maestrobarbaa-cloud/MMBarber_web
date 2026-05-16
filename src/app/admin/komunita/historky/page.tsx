"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Check, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  X
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

interface Story {
  id: string;
  text: string;
  date: string;
  status: 'pending' | 'approved';
}

export default function AdminStoriesPage() {
  const { lang } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [stories, setStories] = useState<Story[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const ADMIN_PASSWORD = "MAFIA_PROTOCOL_737"; // Secret password provided to the user

  useEffect(() => {
    // Check if already authenticated in this session
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
    loadStories();
  }, []);

  const loadStories = () => {
    const saved = localStorage.getItem("mmbarber_community_stories");
    if (saved) {
      setStories(JSON.parse(saved));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("mmbarber_admin_auth", "true");
    } else {
      alert("ACCESS DENIED: INVALID CLEARANCE");
      setPassword("");
    }
  };

  const updateStoryStatus = (id: string, status: 'approved' | 'pending') => {
    const updated = stories.map(s => s.id === id ? { ...s, status } : s);
    setStories(updated);
    localStorage.setItem("mmbarber_community_stories", JSON.stringify(updated));
  };

  const deleteStory = (id: string) => {
    if (!confirm("OPRAVDU SMAZAT? TUTO AKCI NELZE VRÁTIT.")) return;
    const updated = stories.filter(s => s.id !== id);
    setStories(updated);
    localStorage.setItem("mmbarber_community_stories", JSON.stringify(updated));
  };

  const startEdit = (story: Story) => {
    setEditingId(story.id);
    setEditText(story.text);
  };

  const saveEdit = () => {
    const updated = stories.map(s => s.id === editingId ? { ...s, text: editText } : s);
    setStories(updated);
    localStorage.setItem("mmbarber_community_stories", JSON.stringify(updated));
    setEditingId(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.1)_0%,transparent_80%)]"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md bg-mafia-dark/80 border border-mafia-red/30 p-12 backdrop-blur-3xl shadow-2xl"
        >
          <div className="flex flex-col items-center mb-12">
            <Lock className="text-mafia-red mb-6" size={48} />
            <h1 className="text-3xl font-heading font-black text-white tracking-widest uppercase">ADMIN_ACCESS</h1>
            <p className="text-[10px] font-mono text-mafia-red/60 uppercase tracking-[0.4em] mt-2">RESTRICTED_AREA</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-8">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER CLEARANCE CODE..."
              className="w-full bg-black/40 border border-mafia-red/20 px-6 py-4 text-center text-white font-mono tracking-widest focus:outline-none focus:border-mafia-red transition-all"
              autoFocus
            />
            <button className="w-full py-4 bg-mafia-red text-white font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all">
              AUTHORIZE
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12 selection:bg-mafia-red selection:text-white">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20 pb-8 border-b border-white/5">
           <div>
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="text-mafia-red" size={24} />
                 <h1 className="text-4xl font-heading font-black uppercase italic tracking-tighter">KONTROLA <span className="text-mafia-red">HISTOREK</span></h1>
              </div>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">ADMINISTRATIVNÍ KONZOLE V1.0</p>
           </div>
           
           <div className="flex gap-4">
              <button onClick={loadStories} className="p-4 bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                 <RefreshCw size={20} />
              </button>
              <Link href="/admin" className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                 <ArrowLeft size={16} /> ZPĚT NA DASHBOARD
              </Link>
           </div>
        </header>

        <main className="grid grid-cols-1 gap-8">
           {stories.length === 0 ? (
             <div className="p-20 text-center border border-dashed border-white/5 opacity-20">
                <p className="font-mono text-xs uppercase tracking-widest">Žádné záznamy v databázi.</p>
             </div>
           ) : (
             stories.map((story) => (
               <motion.div 
                 key={story.id}
                 layout
                 className={`relative p-8 border ${story.status === 'approved' ? 'border-green-500/20 bg-green-500/[0.02]' : 'border-mafia-gold/20 bg-mafia-gold/[0.02]'}`}
               >
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-4">
                        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">ID: {story.id}</span>
                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${story.status === 'approved' ? 'bg-green-500 text-black' : 'bg-mafia-gold text-black'}`}>
                           {story.status === 'approved' ? 'ZVEŘEJNĚNO' : 'ČEKÁ_NA_SCHVÁLENÍ'}
                        </span>
                     </div>
                     <span className="text-[9px] font-mono text-white/20">{story.date}</span>
                  </div>

                  {editingId === story.id ? (
                    <div className="space-y-6">
                       <textarea 
                         value={editText}
                         onChange={(e) => setEditText(e.target.value)}
                         className="w-full bg-black/60 border border-white/20 p-6 text-white font-sans italic text-lg focus:outline-none focus:border-mafia-red transition-all"
                         rows={4}
                       />
                       <div className="flex gap-4">
                          <button onClick={saveEdit} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest">
                             <Save size={14} /> ULOŽIT
                          </button>
                          <button onClick={() => setEditingId(null)} className="flex items-center gap-2 px-6 py-2 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest">
                             <X size={14} /> ZRUŠIT
                          </button>
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-12 justify-between items-start">
                       <p className="text-xl md:text-2xl text-white/80 font-sans italic leading-relaxed flex-1">
                          "{story.text}"
                       </p>
                       
                       <div className="flex md:flex-col gap-4 flex-wrap">
                          {story.status === 'pending' ? (
                            <button 
                              onClick={() => updateStoryStatus(story.id, 'approved')}
                              className="flex items-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                               <Check size={16} /> SCHVÁLIT
                            </button>
                          ) : (
                            <button 
                              onClick={() => updateStoryStatus(story.id, 'pending')}
                              className="flex items-center gap-3 px-6 py-3 bg-mafia-gold hover:bg-white text-black text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                               <RefreshCw size={16} /> STÁHNOUT
                            </button>
                          )}
                          
                          <button 
                            onClick={() => startEdit(story)}
                            className="flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                             <Edit3 size={16} /> UPRAVIT
                          </button>
                          
                          <button 
                            onClick={() => deleteStory(story.id)}
                            className="flex items-center gap-3 px-6 py-3 bg-mafia-red hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                             <Trash2 size={16} /> SMAZAT
                          </button>
                       </div>
                    </div>
                  )}
               </motion.div>
             ))
           )}
        </main>
      </div>
    </div>
  );
}
