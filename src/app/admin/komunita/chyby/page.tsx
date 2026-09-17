"use client";

import React, { useEffect, useState } from "react";
import { getFeedbackAdminAction, updateFeedbackStatusAction } from "@/app/actions/feedback";
import { useSession } from "next-auth/react";
import { MessageSquare, CheckCircle, Clock, AlertTriangle, Lightbulb, Bug } from "lucide-react";

type Feedback = {
  id: string;
  type: string;
  message: string;
  status: string;
  createdAt: Date;
  user?: { name: string | null; email: string | null } | null;
};

export default function FeedbackAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ADMIN_PASSWORD = "MAFIA_PROTOCOL_737";

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchFeedback = async () => {
      const res = await getFeedbackAdminAction();
      if (res.success && res.data) {
        setFeedbacks(res.data as Feedback[]);
      }
      setIsLoading(false);
    };

    fetchFeedback();
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

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const res = await updateFeedbackStatusAction(id, newStatus);
    if (res.success) {
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
      );
    } else {
      alert("Chyba při aktualizaci stavu.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="relative w-full max-w-md bg-mafia-dark/80 border border-mafia-gold/30 p-12 backdrop-blur-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-3xl font-heading font-black text-white tracking-widest uppercase text-center">NAHLÁŠENÉ CHYBY</h1>
            <p className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-[0.4em] mt-2">RESTRICTED_ACCESS</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-8">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="ENTER CODE..." className="w-full bg-black/40 border border-mafia-gold/20 px-6 py-4 text-center text-white font-mono tracking-widest focus:outline-none focus:border-mafia-gold transition-all" autoFocus />
            <button className="w-full py-4 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.5em] hover:bg-white transition-all">AUTHORIZE</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MessageSquare size={32} className="text-mafia-gold" />
            <h1 className="text-3xl font-heading font-black text-mafia-gold uppercase tracking-widest">
              Zpětná Vazba Uživatelů
            </h1>
          </div>
        </header>

        {isLoading ? (
          <div className="text-white/50 animate-pulse">Načítání...</div>
        ) : feedbacks.length === 0 ? (
          <div className="text-white/50 border border-white/10 p-8 text-center rounded">
            Zatím zde nejsou žádné zprávy.
          </div>
        ) : (
          <div className="grid gap-6">
            {feedbacks.map((f) => (
              <div key={f.id} className="bg-black border border-white/10 rounded-lg p-6 relative overflow-hidden group hover:border-mafia-gold/50 transition-colors">
                <div className={`absolute top-0 left-0 w-1 h-full ${f.type === 'IDEA' ? 'bg-blue-500' : 'bg-red-500'}`} />
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {f.type === 'IDEA' ? <Lightbulb className="text-blue-500" size={20} /> : <Bug className="text-red-500" size={20} />}
                    <span className="text-xs font-mono font-bold text-white/50 tracking-widest uppercase">
                      {f.type === 'IDEA' ? 'Nápad na zlepšení' : 'Nahlášený problém'}
                    </span>
                    <span className="text-xs text-white/30 ml-4">
                      {new Date(f.createdAt).toLocaleString('cs-CZ')}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    {f.status === 'NEW' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                        <AlertTriangle size={12} /> Nové
                      </span>
                    )}
                    {f.status === 'REVIEWED' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                        <Clock size={12} /> V řešení
                      </span>
                    )}
                    {f.status === 'RESOLVED' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">
                        <CheckCircle size={12} /> Vyřešeno
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-white text-lg mb-6 whitespace-pre-wrap">{f.message}</p>

                <div className="flex justify-between items-end">
                  <div className="text-sm text-white/40">
                    Odesílatel: <span className="text-white/80">{f.user ? `${f.user.name} (${f.user.email})` : 'Anonym'}</span>
                  </div>

                  <div className="flex gap-2">
                    {f.status !== 'NEW' && (
                      <button onClick={() => handleUpdateStatus(f.id, 'NEW')} className="text-xs border border-white/20 text-white/50 hover:text-white px-3 py-1.5 rounded transition-colors">
                        Označit jako Nové
                      </button>
                    )}
                    {f.status !== 'REVIEWED' && (
                      <button onClick={() => handleUpdateStatus(f.id, 'REVIEWED')} className="text-xs border border-blue-500/30 text-blue-500 hover:bg-blue-500/10 px-3 py-1.5 rounded transition-colors">
                        V řešení
                      </button>
                    )}
                    {f.status !== 'RESOLVED' && (
                      <button onClick={() => handleUpdateStatus(f.id, 'RESOLVED')} className="text-xs border border-green-500/30 text-green-500 hover:bg-green-500/10 px-3 py-1.5 rounded transition-colors">
                        Vyřešit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
