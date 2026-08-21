"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Trophy, Trash2, Calendar, Target, Dices } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Winner {
  id: string;
  createdAt: number;
  game: "elita" | "slot_machine";
  nickname: string;
  prizeOrScore: string;
}

export default function WinnersAdminPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWinners = async () => {
    try {
      const res = await fetch("/api/winners");
      if (res.ok) {
        const data = await res.json();
        setWinners(data);
      }
    } catch (e) {
      console.error("Failed to fetch winners", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu smazat tento záznam?")) return;
    try {
      await fetch(`/api/winners?id=${id}`, { method: "DELETE" });
      setWinners(winners.filter((w) => w.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Opravdu chcete smazat VŠECHNY záznamy výherců?")) return;
    try {
      await fetch(`/api/winners?all=true`, { method: "DELETE" });
      setWinners([]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 pb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="text-mafia-gold" size={24} />
              <h1 className="text-4xl font-heading font-black uppercase italic tracking-tighter">
                VÝHERCI <span className="text-mafia-gold">MINIHER</span>
              </h1>
            </div>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">
              ZÁZNAMY OPERATIVCŮ ZE SIMULÁTORŮ A AUTOMATŮ
            </p>
          </div>
          <Link href="/admin" className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
            <ArrowLeft size={16} /> ZPĚT DO CENTRÁLY
          </Link>
        </header>

        <main className="space-y-8">
          <div className="flex justify-between items-center bg-white/5 border border-white/10 p-6">
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-mafia-gold animate-pulse"></span>
              <h2 className="text-sm font-mono text-white/50 uppercase tracking-[0.3em]">DATABÁZE ÚSPĚŠNÝCH</h2>
            </div>
            {winners.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="px-6 py-2 bg-mafia-red/20 text-mafia-red border border-mafia-red/50 text-[10px] font-mono tracking-widest uppercase hover:bg-mafia-red hover:text-white transition-all"
              >
                VYMAZAT VŠECHNO
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-20 text-white/30 font-mono tracking-widest uppercase animate-pulse">
              NAČÍTÁM DATA...
            </div>
          ) : winners.length === 0 ? (
            <div className="text-center py-20 border border-white/5 bg-white/[0.02]">
              <p className="text-white/30 font-mono tracking-widest uppercase">Zatím žádní výherci.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {winners.map((winner, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={winner.id} 
                  className="bg-white/5 border border-white/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-mafia-gold/40 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-mafia-black border border-mafia-gold/30 flex items-center justify-center shrink-0">
                      {winner.game === "elita" ? <Target className="text-mafia-gold" size={20} /> : <Dices className="text-yellow-400" size={20} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-black text-white uppercase tracking-wider">
                        {winner.nickname}
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2">
                        <span className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1 h-1 bg-mafia-gold rounded-full"></span> 
                          {winner.game === "elita" ? "Elitní Střelba" : "Hazardní Automat"}
                        </span>
                        <span className="text-[10px] font-mono text-white/40 flex items-center gap-2">
                          <Calendar size={10} /> 
                          {new Date(winner.createdAt).toLocaleString('cs-CZ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-4 md:pt-0 mt-4 md:mt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1">
                        {winner.game === "elita" ? "NAHRANÉ SKÓRE" : "ZÍSKANÁ VÝHRA"}
                      </p>
                      <p className={`font-mono text-lg font-bold tracking-widest ${winner.game === "elita" ? "text-white" : "text-mafia-gold"}`}>
                        {winner.prizeOrScore}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(winner.id)}
                      className="p-3 bg-white/5 border border-white/10 text-white/30 hover:text-mafia-red hover:bg-mafia-red/10 transition-all rounded-sm shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
