"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Scissors, Plus, Trash2, Save, X, User } from "lucide-react";
import Link from "next/link";
import { useBarbers } from "@/contexts/BarberContext";

export default function BarberAdminPage() {
  const { barbers, loading, refreshBarbers } = useBarbers();
  const [isAdding, setIsAdding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "/obr/novy_barber.png",
    desc: "",
    schedule: "Individuální režim práce.",
    bookingLink: "",
    customChatText: "",
    parentId: ""
  });

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
    } else {
      window.location.href = "/admin";
    }
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/barbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        await refreshBarbers();
        setIsAdding(false);
        setFormData({ name: "", role: "", image: "/obr/novy_barber.png", desc: "", schedule: "Individuální režim práce.", bookingLink: "", customChatText: "", parentId: "" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu smazat tohoto barbera?")) return;
    try {
      const res = await fetch(`/api/barbers?id=${id}`, { method: "DELETE" });
      if (res.ok) await refreshBarbers();
    } catch (e) {}
  };

  if (!isAuthenticated || loading) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 relative overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        <header className="flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <Link href="/admin" className="text-mafia-gold font-mono text-[10px] uppercase tracking-widest hover:text-white flex items-center gap-2 mb-4">
              <ArrowLeft size={14} /> Zpět na centrálu
            </Link>
            <h1 className="text-4xl font-heading font-black tracking-widest uppercase flex items-center gap-4">
              <Scissors className="text-mafia-gold" size={32} />
              SPRÁVA BARBERŮ
            </h1>
            <p className="text-[10px] font-mono text-white/50 tracking-[0.2em] uppercase mt-2">
              Přidávejte a spravujte profily operativců.
            </p>
          </div>
          
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="px-6 py-3 bg-mafia-gold text-black font-black font-heading uppercase tracking-widest hover:bg-white transition flex items-center gap-2"
          >
            {isAdding ? <X size={18} /> : <Plus size={18} />}
            {isAdding ? "ZRUŠIT" : "PŘIDAT BARBERA"}
          </button>
        </header>

        <AnimatePresence>
          {isAdding && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 border border-mafia-gold/30 p-8 rounded-sm overflow-hidden"
              onSubmit={handleAdd}
            >
              <h2 className="text-2xl font-heading font-black text-mafia-gold mb-6 uppercase tracking-widest">Nový Operativec</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Jméno</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Pracovní Zařazení (Role)</label>
                  <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Odkaz na fotku (URL)</label>
                  <input required type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Odkaz na rezervaci (URL)</label>
                  <input type="text" value={formData.bookingLink} onChange={e => setFormData({...formData, bookingLink: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none" />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Stručný popis (zobrazí se v detailu a na kartě)</label>
                  <textarea required rows={3} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none resize-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Osobní uvítací chat zpráva</label>
                  <input type="text" value={formData.customChatText} onChange={e => setFormData({...formData, customChatText: e.target.value})} placeholder="Např. Ahoj, jsem nová posila. Sedni si a relaxuj." className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Hierarchie (Pod koho patří?)</label>
                  <select value={formData.parentId} onChange={e => setFormData({...formData, parentId: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none">
                    <option value="">-- Samostatný barber (žádný mentor) --</option>
                    {barbers.map(b => (
                      <option key={b.id} value={b.id}>Pod {b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button type="submit" className="px-8 py-3 bg-mafia-gold text-black font-black uppercase tracking-widest hover:bg-white transition flex items-center gap-2">
                  <Save size={18} /> ULOŽIT BARBERA
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((b) => (
            <div key={b.id} className="bg-white/5 border border-white/10 p-6 relative group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 rounded overflow-hidden border border-mafia-gold/30">
                    <img src={b.image} alt={b.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition" />
                  </div>
                  {b.id !== 'tomas' && b.id !== 'nella' && (
                    <button onClick={() => handleDelete(b.id)} className="text-white/30 hover:text-mafia-red transition">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <h3 className="text-2xl font-heading font-black text-white uppercase tracking-widest">{b.name}</h3>
                <p className="text-[10px] font-mono text-mafia-gold tracking-widest uppercase mb-4">{b.role}</p>
                
                {b.parentId && (
                  <div className="inline-block px-2 py-1 bg-mafia-gold/10 border border-mafia-gold/20 text-[9px] font-mono text-mafia-gold uppercase mb-4">
                    Mentor: {barbers.find(x => x.id === b.parentId)?.name || b.parentId}
                  </div>
                )}
                
                <p className="text-xs text-white/50 line-clamp-3 mb-4">{b.desc}</p>
              </div>
              
              {b.customChatText && (
                <div className="p-3 bg-black/40 border border-white/10 rounded-sm text-xs italic text-white/70">
                  "{b.customChatText}"
                </div>
              )}
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
