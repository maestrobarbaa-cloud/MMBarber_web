"use client";

import React, { useState, useEffect } from "react";
import { getCooperationAdminAction, updateCooperationStatusAction } from "@/app/actions/cooperation";
import { Handshake, CheckCircle, XCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type CooperationRequest = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  field: string;
  message: string;
  status: string;
  createdAt: Date;
};

export default function SpolupraceAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [requests, setRequests] = useState<CooperationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ADMIN_PASSWORD = "MAFIA_PROTOCOL_737";

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchRequests = async () => {
      const res = await getCooperationAdminAction();
      if (res.success && res.data) {
        setRequests(res.data as CooperationRequest[]);
      }
      setIsLoading(false);
    };

    fetchRequests();
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
    const res = await updateCooperationStatusAction(id, newStatus);
    if (res.success) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
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
            <h1 className="text-3xl font-heading font-black text-white tracking-widest uppercase text-center">NÁVRHY NA SPOLUPRÁCI</h1>
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
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12 selection:bg-mafia-gold selection:text-mafia-black">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 pb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Handshake className="text-mafia-gold" size={24} />
              <h1 className="text-3xl font-heading font-black uppercase tracking-widest">NÁVRHY NA <span className="text-mafia-gold">SPOLUPRÁCI</span></h1>
            </div>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">ADMINISTRATION_PROTOCOL</p>
          </div>
          <Link href="/admin" className="flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-mafia-gold hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-widest">
            <ArrowLeft size={14} /> Návrat na centrálu
          </Link>
        </header>

        {isLoading ? (
          <div className="text-center text-white/50 font-mono text-sm tracking-widest animate-pulse">NAČÍTÁNÍ ZÁZNAMŮ...</div>
        ) : requests.length === 0 ? (
          <div className="text-center p-12 border border-white/5 bg-white/[0.02]">
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Žádné návrhy na spolupráci nebyly nalezeny.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requests.map((r) => (
              <motion.div 
                key={r.id}
                layout
                className={`bg-mafia-dark/40 border p-8 relative overflow-hidden transition-all duration-500 ${
                  r.status === 'NEW' ? 'border-mafia-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 
                  r.status === 'IN_PROGRESS' ? 'border-blue-500/30' :
                  r.status === 'COMPLETED' ? 'border-green-500/20 opacity-70' : 
                  'border-mafia-red/20 opacity-50'
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className={`px-3 py-1 border text-[9px] font-mono tracking-widest uppercase ${
                        r.status === 'NEW' ? 'text-mafia-gold border-mafia-gold/30 bg-mafia-gold/10' : 
                        r.status === 'IN_PROGRESS' ? 'text-blue-400 border-blue-400/30' :
                        r.status === 'COMPLETED' ? 'text-green-500 border-green-500/30' : 
                        'text-mafia-red border-mafia-red/30'
                      }`}>
                        {r.status === 'NEW' ? 'NOVÉ' : r.status}
                      </span>
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} /> {new Date(r.createdAt).toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-white uppercase tracking-widest flex items-center gap-2 border border-white/20 px-2 py-1">
                        OBOR: {r.field}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-heading font-bold text-white mb-2">{r.name}</h3>
                      <div className="flex gap-4 text-xs font-mono text-mafia-gold/80 mb-6">
                        <a href={`mailto:${r.email}`} className="hover:underline">{r.email}</a>
                        {r.phone && <a href={`tel:${r.phone}`} className="hover:underline">{r.phone}</a>}
                      </div>
                      
                      <div className="bg-black/40 border border-white/5 p-6">
                        <p className="text-white/90 font-sans leading-relaxed">{r.message}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap lg:flex-col justify-end gap-3 min-w-[200px]">
                    <button 
                      onClick={() => handleUpdateStatus(r.id, "IN_PROGRESS")}
                      className={`flex items-center gap-3 px-4 py-3 text-[10px] font-mono uppercase tracking-widest border transition-all ${
                        r.status === 'IN_PROGRESS' 
                          ? 'border-blue-500 text-blue-500 bg-blue-500/10' 
                          : 'border-white/10 text-white/50 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/10'
                      }`}
                    >
                      <Clock size={14} /> V ŘEŠENÍ
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(r.id, "COMPLETED")}
                      className={`flex items-center gap-3 px-4 py-3 text-[10px] font-mono uppercase tracking-widest border transition-all ${
                        r.status === 'COMPLETED' 
                          ? 'border-green-500 text-green-500 bg-green-500/10' 
                          : 'border-white/10 text-white/50 hover:border-green-500 hover:text-green-500 hover:bg-green-500/10'
                      }`}
                    >
                      <CheckCircle size={14} /> DOKONČENO
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(r.id, "REJECTED")}
                      className={`flex items-center gap-3 px-4 py-3 text-[10px] font-mono uppercase tracking-widest border transition-all ${
                        r.status === 'REJECTED' 
                          ? 'border-mafia-red text-mafia-red bg-mafia-red/10' 
                          : 'border-white/10 text-white/50 hover:border-mafia-red hover:text-mafia-red hover:bg-mafia-red/10'
                      }`}
                    >
                      <XCircle size={14} /> ZAMÍTNUTO
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
