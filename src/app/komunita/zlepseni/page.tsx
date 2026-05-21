"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Zap, 
  Send, 
  ThumbsUp, 
  MessageSquare, 
  ChevronRight,
  Plus,
  Target,
  AlertCircle,
  Calendar,
  Filter,
  Check
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { Footer } from "@/components/Footer";

interface Suggestion {
  id: string;
  user: string;
  content: string;
  points: string[];
  userPriority: number;
  adminPriority?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  likes: string[];
  adminResponse?: string;
  createdAt: any;
}

export default function SuggestionsPage() {
  const { lang, t } = useTranslation();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');
  const router = useRouter();
  
  // Form State
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<number>(5);

  const userId = typeof window !== 'undefined' ? (localStorage.getItem('mmbarber_user_id') || 'anon-' + Math.random().toString(36).substr(2, 9)) : 'anon';
  
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('mmbarber_user_id')) {
      localStorage.setItem('mmbarber_user_id', userId);
    }
    
    const savedName = localStorage.getItem('mmbarber_nickname') || "";
    if (savedName) setName(savedName);

    // Fetch approved suggestions
    const fetchSuggestions = async () => {
      try {
        const res = await fetch('/api/zlepseni?status=APPROVED');
        if (res.ok) {
          const data = await res.json();
          // Sort by likes + priority (numerical 1-10)
          const sorted = data.sort((a: Suggestion, b: Suggestion) => {
            const aLikes = a.likes?.length || 0;
            const bLikes = b.likes?.length || 0;
            if (bLikes !== aLikes) return bLikes - aLikes;
            
            const aScore = a.adminPriority !== undefined ? a.adminPriority : a.userPriority;
            const bScore = b.adminPriority !== undefined ? b.adminPriority : b.userPriority;
            return bScore - aScore;
          });

          setSuggestions(sorted);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchSuggestions();
    const interval = setInterval(fetchSuggestions, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SUBMIT CLICKED");
    
    if (!content.trim() || !name.trim()) {
      console.warn("VALIDATION FAILED: ", { name, content });
      return;
    }

    setIsSubmitting(true);
    
    // Parse content into points
    const points = content
      .split(/\n|•|-/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    try {
      const payload = {
        user: name,
        userId,
        content,
        points,
        userPriority: priority,
        status: "PENDING"
      };

      await fetch('/api/zlepseni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      localStorage.setItem('mmbarber_nickname', name);
      
      // Short delay to let user see the button change to "ODESLÁNO"
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show cinematic success overlay
      setSubmissionStep('SUCCESS');
      
      // Redirect after success message (3 seconds)
      setTimeout(() => {
        router.push("/komunita");
      }, 3000);
    } catch (error) {
      console.error("SUBMISSION ERROR:", error);
      setSubmissionStep('IDLE');
      alert(lang === 'cs' ? "Chyba při odesílání. Zkuste to prosím znovu." : "Error sending suggestion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLike = async (suggestion: Suggestion) => {
    try {
      await fetch('/api/zlepseni', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: suggestion.id, userId, action: 'toggleLike' })
      });
    } catch (error) {
      console.error("Like toggle failed:", error);
    }
  };

  const getPriorityColor = (p: number) => {
    if (p >= 9) return 'text-mafia-red border-mafia-red/30 bg-mafia-red/5';
    if (p >= 7) return 'text-orange-500 border-orange-500/30 bg-orange-500/5';
    if (p >= 4) return 'text-mafia-gold border-mafia-gold/30 bg-mafia-gold/5';
    return 'text-white/40 border-white/10 bg-white/5';
  };

  return (
    <div className="min-h-screen bg-black text-smoke-white overflow-x-hidden relative selection:bg-mafia-gold selection:text-mafia-black">
      
      {/* Submission Animation Overlay */}
      <AnimatePresence>
        {submissionStep !== 'IDLE' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
          >
            {submissionStep === 'SUCCESS' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="relative"
                >
                  <div className="w-32 h-32 rounded-full bg-mafia-gold/20 flex items-center justify-center border border-mafia-gold/40 mb-8 mx-auto">
                    <Send className="text-mafia-gold" size={48} />
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 1.5 }}
                    className="h-px bg-mafia-gold absolute -bottom-4 left-0"
                  />
                </motion.div>
                
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-heading font-black italic uppercase tracking-tighter mb-4 mt-8"
                >
                  NÁVRH <span className="text-mafia-gold">ODESLÁN</span>
                </motion.h2>
                
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-mafia-gold/60 font-mono text-xs uppercase tracking-[0.4em] max-w-sm leading-relaxed"
                >
                  {lang === 'cs' 
                    ? "TVŮJ NÁPAD BYL PŘIJAT DO SYSTÉMU. NYNÍ ČEKÁ NA SCHVÁLENÍ OPERATIVCEM." 
                    : "YOUR IDEA HAS BEEN RECEIVED. NOW AWAITING MODERATION BY AN OPERATIVE."}
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-12 flex items-center gap-3 text-white/20 font-mono text-[8px] uppercase tracking-[0.5em]"
                >
                  <div className="w-4 h-4 border-2 border-t-mafia-gold border-white/5 rounded-full animate-spin" />
                  PŘESMĚROVÁVÁM...
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--color-mafia-gold-rgb),0.1)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          href="/komunita" 
          className="group flex items-center gap-4 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-xs tracking-[0.4em] uppercase"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          {lang === 'cs' ? "ZPĚT" : "BACK"}
        </Link>
        <div className="text-right">
            <span className="text-[8px] font-mono text-mafia-gold/50 tracking-[0.5em] uppercase">FUTURE_PROTOCOL_v1.0</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-40">
        
        <header className="mb-20 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col items-center"
           >
              <div className="flex items-center gap-4 mb-6">
                <Target className="text-mafia-gold" size={20} />
                <span className="text-mafia-gold font-mono text-xs tracking-[0.6em] uppercase">COMMUNITY_VISIONS</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-heading font-black uppercase tracking-tighter italic mb-8">
                VIZE & <span className="text-mafia-gold">ZLEPŠENÍ</span>
              </h1>
              <p className="text-xl text-smoke-white/60 max-w-2xl font-sans italic mx-auto">
                Tady tvoříme budoucnost MMBarber. Máš nápad na zlepšení webu, služeb nebo komunity? Napiš nám ho.
              </p>
           </motion.div>
        </header>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 p-8 bg-white/[0.02] border border-white/5 backdrop-blur-xl">
           <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-mafia-gold/10 flex items-center justify-center border border-mafia-gold/20">
                 <Zap className="text-mafia-gold" size={20} />
              </div>
              <div>
                 <h3 className="text-sm font-black uppercase tracking-widest text-white">Chceš se zapojit?</h3>
                 <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Navrhni co tě trápí nebo co ti chybí.</p>
              </div>
           </div>
           <button 
             onClick={() => setShowForm(!showForm)}
             className="w-full md:w-auto px-10 py-4 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.2)]"
           >
              {showForm ? "ZRUŠIT" : "PŘIDAT NÁVRH"} <Plus size={18} />
           </button>
        </div>

        {/* Submission Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-16"
            >
               <form onSubmit={handleSubmit} className="p-8 md:p-12 border border-mafia-gold/20 bg-mafia-gold/[0.02] space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.3em]">Tvé jméno / Nick</label>
                        <input 
                          required
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="OPERATIVE_ID..."
                          className="w-full bg-black/40 border border-white/10 px-6 py-4 font-mono text-xs text-white focus:border-mafia-gold outline-none transition-all"
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.3em]">Tvou vnímaná priorita (1-10)</label>
                        <div className="grid grid-cols-5 md:grid-cols-10 gap-1">
                           {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
                             <button
                               key={p}
                               type="button"
                               onClick={() => setPriority(p)}
                               className={`py-3 text-[9px] font-mono border transition-all ${priority === p ? 'bg-mafia-gold text-mafia-black border-mafia-gold' : 'border-white/10 text-white/30 hover:border-white/30'}`}
                             >
                               {p}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.3em]">Návrh zlepšení (bodově)</label>
                     <textarea 
                       required
                       rows={6}
                       value={content}
                       onChange={(e) => setContent(e.target.value)}
                       placeholder="1. Přidat tmavý režim i pro mapy...&#10;2. Možnost online platby kartou...&#10;3. Víc merche v e-shopu..."
                       className="w-full bg-black/40 border border-white/10 px-6 py-4 font-mono text-xs text-white focus:border-mafia-gold outline-none transition-all resize-none"
                     />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting || submissionStep === 'SUCCESS'}
                    className={`w-full py-5 font-black uppercase tracking-[0.5em] transition-all disabled:opacity-50 flex items-center justify-center gap-4 ${submissionStep === 'SUCCESS' ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-mafia-gold'}`}
                  >
                     {submissionStep === 'SUCCESS' ? (
                       <>{lang === 'cs' ? "ODESLÁNO" : "SENT"} <Check size={18} /></>
                     ) : isSubmitting ? (
                       <>{lang === 'cs' ? "ODESÍLÁM..." : "SENDING..."}</>
                     ) : (
                       <>{lang === 'cs' ? "ODESLAT DO SYSTÉMU" : "SEND TO SYSTEM"} <Send size={18} /></>
                     )}
                  </button>
               </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestions List */}
        <div className="space-y-8">
           {loading ? null : suggestions.length === 0 ? (
             <div className="text-center py-20 border border-dashed border-white/5 opacity-20">
                <p className="font-mono text-xs uppercase tracking-[0.5em]">Žádné veřejné návrhy k zobrazení.</p>
             </div>
           ) : (
             suggestions.map((suggestion, i) => (
               <motion.div
                 key={suggestion.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="group bg-mafia-dark/40 border border-white/5 p-8 md:p-12 relative overflow-hidden hover:border-mafia-gold/20 transition-all duration-700"
               >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                     <div className="flex-1 space-y-6">
                        <div className="flex flex-wrap items-center gap-4">
                           <span className={`px-3 py-1 border text-[9px] font-mono tracking-widest uppercase ${getPriorityColor(suggestion.adminPriority !== undefined ? suggestion.adminPriority : suggestion.userPriority)}`}>
                              PRIORITY: {suggestion.adminPriority !== undefined ? suggestion.adminPriority : suggestion.userPriority}/10
                           </span>
                           <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-2">
                              <Calendar size={12} /> {suggestion.createdAt ? new Date(suggestion.createdAt).toLocaleDateString() : 'N/A'}
                           </span>
                           <span className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-widest italic">
                              @{suggestion.user}
                           </span>
                        </div>

                        <div className="space-y-4">
                           {suggestion.points.map((point, idx) => (
                             <div key={idx} className="flex items-start gap-4 group/point">
                                <ChevronRight className="text-mafia-gold mt-1 flex-shrink-0 group-hover/point:translate-x-1 transition-transform" size={16} />
                                <p className="text-lg text-white/80 font-sans italic leading-relaxed">{point}</p>
                             </div>
                           ))}
                        </div>

                        {/* Admin Response */}
                        {suggestion.adminResponse && (
                          <div className="mt-8 p-6 bg-mafia-gold/5 border-l-2 border-mafia-gold space-y-3">
                             <div className="flex items-center gap-3">
                                <ShieldCheck className="text-mafia-gold" size={16} />
                                <span className="text-[10px] font-black uppercase text-mafia-gold tracking-widest">ODPOVĚĎ ADMINA</span>
                             </div>
                             <p className="text-sm text-white/60 italic font-sans leading-relaxed">
                                {suggestion.adminResponse}
                             </p>
                          </div>
                        )}
                     </div>

                     <div className="flex flex-row md:flex-col items-center gap-4">
                        <button 
                          onClick={() => toggleLike(suggestion)}
                          className={`flex flex-col items-center justify-center w-16 h-20 border transition-all duration-500 ${suggestion.likes?.includes(userId) ? 'bg-mafia-gold border-mafia-gold text-mafia-black' : 'bg-white/5 border-white/10 text-white/30 hover:border-mafia-gold/40'}`}
                        >
                           <ThumbsUp size={24} className={suggestion.likes?.includes(userId) ? 'fill-mafia-black' : ''} />
                           <span className="text-xs font-mono font-black mt-2">{suggestion.likes?.length || 0}</span>
                        </button>
                     </div>
                  </div>

                  {/* Decorative Glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-mafia-gold/5 blur-[100px] pointer-events-none group-hover:bg-mafia-gold/10 transition-colors"></div>
               </motion.div>
             ))
           )}
        </div>

        {/* Footer Note */}
        <div className="mt-20 p-10 border border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
           <AlertCircle className="text-white/20" size={32} />
           <p className="text-xs font-mono text-white/30 leading-relaxed uppercase tracking-widest">
             Všechny návrhy jsou moderovány. Viditelné jsou pouze ty, které byly schváleny jako rentabilní a přínosné pro komunitu. 
             Likes pomáhají adminům určit, co je pro vás nejdůležitější.
           </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
