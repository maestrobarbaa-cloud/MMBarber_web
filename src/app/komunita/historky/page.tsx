"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  ArrowLeft, 
  BookOpen,
  Send,
  ShieldAlert,
  Clock,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

interface Story {
  id: string;
  text: string;
  date: string;
  status: 'pending' | 'approved';
}

export default function StoriesPage() {
  const { t, lang } = useTranslation();
  const [stories, setStories] = useState<Story[]>([]);
  const [newStory, setNewStory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mmbarber_community_stories");
    if (saved) {
      const allStories = JSON.parse(saved);
      // Only show approved stories to the public
      setStories(allStories.filter((s: Story) => s.status === 'approved'));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStory.trim()) return;

    const story: Story = {
      id: Date.now().toString(),
      text: newStory,
      date: new Date().toLocaleDateString(),
      status: 'pending'
    };

    const saved = localStorage.getItem("mmbarber_community_stories");
    const allStories = saved ? JSON.parse(saved) : [];
    localStorage.setItem("mmbarber_community_stories", JSON.stringify([...allStories, story]));

    setNewStory("");
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-black text-smoke-white overflow-x-hidden relative selection:bg-mafia-gold selection:text-mafia-black">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--color-mafia-gold-rgb),0.05)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-10"></div>
      </div>

      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          href="/komunita" 
          className="group flex items-center gap-4 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-xs tracking-[0.4em] uppercase"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          {lang === 'cs' ? "ZPĚT" : "BACK"}
        </Link>
        <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-mafia-gold/30" />
            <span className="text-[8px] font-mono text-white/20 tracking-[0.5em] uppercase">ANONYMOUS_PROTOCOL_v1</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-40">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
           <div className="max-w-2xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                 <BookOpen className="text-mafia-gold" size={20} />
                 <span className="text-mafia-gold font-mono text-xs tracking-[0.6em] uppercase">{t.others.community.historky.subtitle}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-heading font-black uppercase tracking-tighter italic mb-8">
                ANONYMNÍ <span className="text-mafia-gold">HISTORKY</span>
              </h1>
              <p className="text-xl text-smoke-white/60 font-sans italic leading-relaxed">
                {t.others.community.historky.desc}
              </p>
           </div>
           
           <button 
             onClick={() => setShowForm(true)}
             className="w-full md:w-auto px-12 py-5 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.4em] hover:bg-white transition-all duration-300 shadow-2xl"
           >
              {t.others.community.historky.cta}
           </button>
        </div>

        {/* Stories List */}
        <div className="grid grid-cols-1 gap-12">
           {stories.length === 0 ? (
             <div className="border border-white/5 p-20 text-center opacity-20">
                <p className="font-mono text-xs uppercase tracking-[0.5em]">Zatím žádné schválené historky.</p>
             </div>
           ) : (
             stories.map((story, i) => (
               <motion.div 
                 key={story.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-mafia-dark/30 border border-white/5 p-10 md:p-16 relative group"
               >
                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                     <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.4em]">ANONYMNÍ_ZÁZNAM_{story.id.slice(-4)}</span>
                     <span className="text-[10px] font-mono text-white/20">{story.date}</span>
                  </div>
                  <p className="text-xl md:text-2xl text-smoke-white/80 font-sans italic leading-relaxed whitespace-pre-wrap">
                    "{story.text}"
                  </p>
                  
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-mafia-gold/5 to-transparent pointer-events-none"></div>
               </motion.div>
             ))
           )}
        </div>

        {/* Submission Modal */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                onClick={() => setShowForm(false)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-2xl bg-mafia-black border border-mafia-gold/30 p-10 md:p-16 shadow-2xl"
              >
                 <h2 className="text-4xl font-heading font-black text-mafia-gold uppercase italic mb-4">{t.others.community.historky.form.title}</h2>
                 <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.4em] mb-12">{t.others.community.historky.form.desc}</p>
                 
                 <form onSubmit={handleSubmit} className="space-y-10">
                    <textarea 
                      rows={6}
                      value={newStory}
                      onChange={(e) => setNewStory(e.target.value)}
                      placeholder={t.others.community.historky.form.placeholder}
                      className="w-full bg-white/5 border border-white/10 p-8 text-white font-sans text-lg tracking-wide focus:outline-none focus:border-mafia-gold transition-colors placeholder:text-white/10"
                      autoFocus
                    ></textarea>

                    <div className="flex justify-between items-center pt-8">
                       <button type="button" onClick={() => setShowForm(false)} className="text-white/20 font-mono text-[10px] uppercase tracking-[0.4em] hover:text-mafia-red transition-colors">ZRUŠIT</button>
                       <button className="px-12 py-5 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.4em] hover:bg-white transition-all duration-300 flex items-center gap-3">
                         {t.others.community.historky.form.submit} <Send size={18} />
                       </button>
                    </div>
                 </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {submitted && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] bg-mafia-black border border-mafia-gold px-8 py-4 shadow-2xl flex items-center gap-4"
            >
               <CheckCircle2 className="text-mafia-gold" size={24} />
               <div>
                  <p className="text-white font-heading font-black uppercase tracking-widest text-sm">ZPRÁVA ODESLÁNA</p>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Čeká na schválení administrátorem.</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
}
