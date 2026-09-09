"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Scissors, Plus, Trash2, Save, X, Lock, Unlock, Skull, Eye, EyeOff, MessageCircle, Activity, CalendarDays, Power, ShieldAlert, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useBarbers } from "@/contexts/BarberContext";
import { getOperativeStatusData, setOperativeStatusData, fetchOperativeStatusData, OperativeStatusData, OperativeStatusConfig } from "@/utils/status";

const DAYS = [
  { id: 1, label: 'Pondělí' },
  { id: 2, label: 'Úterý' },
  { id: 3, label: 'Středa' },
  { id: 4, label: 'Čtvrtek' },
  { id: 5, label: 'Pátek' },
  { id: 6, label: 'Sobota' },
  { id: 0, label: 'Neděle' }
];

export default function BarberAdminPage() {
  const { barbers, loading, refreshBarbers } = useBarbers();
  const [isAdding, setIsAdding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [quotesModalBarber, setQuotesModalBarber] = useState<any>(null);
  const [editingQuotes, setEditingQuotes] = useState<string[]>([]);
  const [newQuoteText, setNewQuoteText] = useState("");
  const [quoteTiming, setQuoteTiming] = useState({ showFor: 10, waitFor: 12 });
  
  const [statusModalBarber, setStatusModalBarber] = useState<any>(null);
  const [statusData, setStatusData] = useState<OperativeStatusData | null>(null);
  const [currentStatusConfig, setCurrentStatusConfig] = useState<OperativeStatusConfig | null>(null);
  const [savedStatusMessage, setSavedStatusMessage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "/obr/novy_barber.png",
    desc: "",
    schedule: "Individuální režim práce.",
    bookingLink: "",
    customChatText: "",
    parentId: "",
    requiresUnlock: false,
    unlockThreshold: 5,
    missionFailed: false,
    bookingSystemType: "external",
    structuredSchedule: {
      "Po": { work: true, start: "09:00", end: "18:00" },
      "Út": { work: true, start: "09:00", end: "18:00" },
      "St": { work: true, start: "09:00", end: "18:00" },
      "Čt": { work: true, start: "09:00", end: "18:00" },
      "Pá": { work: true, start: "09:00", end: "18:00" },
      "So": { work: false, start: "09:00", end: "12:00" },
      "Ne": { work: false, start: "09:00", end: "12:00" }
    }
  });

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
      fetchOperativeStatusData().then(fetchedData => {
        setStatusData(fetchedData);
      });
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
        setFormData({ 
          name: "", role: "", image: "/obr/novy_barber.png", desc: "", schedule: "Individuální režim práce.", 
          bookingLink: "", customChatText: "", parentId: "", requiresUnlock: false, unlockThreshold: 5, missionFailed: false,
          bookingSystemType: "external",
          structuredSchedule: {
            "Po": { work: true, start: "09:00", end: "18:00" },
            "Út": { work: true, start: "09:00", end: "18:00" },
            "St": { work: true, start: "09:00", end: "18:00" },
            "Čt": { work: true, start: "09:00", end: "18:00" },
            "Pá": { work: true, start: "09:00", end: "18:00" },
            "So": { work: false, start: "09:00", end: "12:00" },
            "Ne": { work: false, start: "09:00", end: "12:00" }
          }
        });
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

  const handleToggleLock = async (b: any) => {
    const isLocked = !b.requiresUnlock;
    let threshold = b.unlockThreshold || 5;
    if (isLocked) {
      const val = prompt("Kolik fragmentů je potřeba pro odemčení?", threshold.toString());
      if (val === null) return;
      threshold = parseInt(val) || 5;
    }
    
    try {
      const res = await fetch("/api/barbers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id, requiresUnlock: isLocked, unlockThreshold: threshold })
      });
      if (res.ok) await refreshBarbers();
    } catch (e) {}
  };

  const handleToggleKIA = async (b: any) => {
    const isKIA = !b.missionFailed;
    if (isKIA && !confirm(`Opravdu označit operativce ${b.name} jako "MISE SELHALA" (KIA)? Zmizí z webu a zbude jen pomník.`)) return;
    
    try {
      const res = await fetch("/api/barbers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id, missionFailed: isKIA })
      });
      if (res.ok) await refreshBarbers();
    } catch (e) {}
  };

  const openQuotesModal = (b: any) => {
    setQuotesModalBarber(b);
    setEditingQuotes(b.quotes || []);
    
    // Timing is stored in ms in DB, we want to show it in seconds
    const dbTiming = b.quoteTiming || { showFor: 10000, waitFor: 12000 };
    setQuoteTiming({
      showFor: Math.max(1, Math.round(dbTiming.showFor / 1000)),
      waitFor: Math.max(1, Math.round(dbTiming.waitFor / 1000))
    });
    setNewQuoteText("");
  };

  const closeQuotesModal = () => {
    setQuotesModalBarber(null);
    setEditingQuotes([]);
    setNewQuoteText("");
  };

  const handleAddQuote = () => {
    if (!newQuoteText.trim()) return;
    setEditingQuotes([...editingQuotes, newQuoteText.trim()]);
    setNewQuoteText("");
  };

  const handleRemoveQuote = (index: number) => {
    setEditingQuotes(editingQuotes.filter((_, i) => i !== index));
  };

  const handleSaveQuotes = async () => {
    if (!quotesModalBarber) return;
    try {
      const res = await fetch("/api/barbers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: quotesModalBarber.id, 
          quotes: editingQuotes,
          quoteTiming: {
            showFor: quoteTiming.showFor * 1000,
            waitFor: quoteTiming.waitFor * 1000
          }
        })
      });
      if (res.ok) {
        await refreshBarbers();
        closeQuotesModal();
      }
    } catch (e) {}
  };

  const openStatusModal = (b: any) => {
    setStatusModalBarber(b);
    if (statusData && statusData[b.id]) {
      setCurrentStatusConfig(statusData[b.id]);
    } else {
      // Default config for new barber
      setCurrentStatusConfig({
        mode: 'calendar',
        manualState: 'online',
        manualCustomText: '',
        isIndividualSchedule: false,
        calendar: [
          { dayOfWeek: 1, start: "09:00", end: "18:00" },
          { dayOfWeek: 2, start: "09:00", end: "18:00" },
          { dayOfWeek: 3, start: "09:00", end: "18:00" },
          { dayOfWeek: 4, start: "09:00", end: "18:00" },
          { dayOfWeek: 5, start: "09:00", end: "18:00" }
        ]
      });
    }
  };

  const closeStatusModal = () => {
    setStatusModalBarber(null);
    setCurrentStatusConfig(null);
  };

  const updateStatusConfig = (newConfig: Partial<OperativeStatusConfig>) => {
    setCurrentStatusConfig(prev => prev ? { ...prev, ...newConfig } : null);
  };

  const updateCalendarEntry = (dayId: number, field: 'start' | 'end' | 'breakStart' | 'breakEnd', value: string) => {
    if (!currentStatusConfig) return;
    const updatedCal = [...currentStatusConfig.calendar];
    const index = updatedCal.findIndex(c => c.dayOfWeek === dayId);
    if (index >= 0) {
      updatedCal[index] = { ...updatedCal[index], [field]: value };
    } else {
      updatedCal.push({
        dayOfWeek: dayId,
        start: field === 'start' ? value : '09:00',
        end: field === 'end' ? value : '18:00',
      });
    }
    updateStatusConfig({ calendar: updatedCal });
  };

  const handleSaveStatus = async () => {
    if (!statusModalBarber || !currentStatusConfig || !statusData) return;
    
    const newData = {
      ...statusData,
      [statusModalBarber.id]: currentStatusConfig
    };
    
    await setOperativeStatusData(newData);
    setStatusData(newData);
    setSavedStatusMessage(true);
    setTimeout(() => {
      setSavedStatusMessage(false);
      closeStatusModal();
    }, 1500);
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
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Typ Rezervačního Systému</label>
                  <select value={formData.bookingSystemType} onChange={e => setFormData({...formData, bookingSystemType: e.target.value as any})} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none">
                    <option value="external">Externí odkaz (původní)</option>
                    <option value="internal">Vlastní interní systém (přes web)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Odkaz na rezervaci (URL) [Pouze pro externí]</label>
                  <input type="text" value={formData.bookingLink} onChange={e => setFormData({...formData, bookingLink: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none" disabled={formData.bookingSystemType === 'internal'} />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Stručný popis (zobrazí se v detailu a na kartě)</label>
                  <textarea required rows={3} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none resize-none" />
                  <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Mise Selhala (Zabít operativce)</label>
                  <div className="flex items-center gap-4 mt-2">
                    <input type="checkbox" checked={formData.missionFailed} onChange={e => setFormData({...formData, missionFailed: e.target.checked})} className="w-6 h-6 accent-mafia-red" />
                    <span className="text-xs text-mafia-red/70 italic">Karta se promění v krvavý náhrobek.</span>
                  </div>
                </div>
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

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Vyžaduje Odemčení (Gamifikace)</label>
                  <div className="flex items-center gap-4 mt-2">
                    <input type="checkbox" checked={formData.requiresUnlock} onChange={e => setFormData({...formData, requiresUnlock: e.target.checked})} className="w-6 h-6 accent-mafia-gold" />
                    {formData.requiresUnlock && (
                      <input type="number" min="1" value={formData.unlockThreshold} onChange={e => setFormData({...formData, unlockThreshold: parseInt(e.target.value) || 1})} placeholder="Počet fragmentů" className="bg-black/50 border border-white/20 p-2 text-white focus:border-mafia-gold outline-none w-32" />
                    )}
                  </div>
                </div>

                {formData.bookingSystemType === 'internal' && (
                  <div className="space-y-4 md:col-span-2 border-t border-white/10 pt-4 mt-2">
                    <h3 className="text-sm font-heading font-bold text-mafia-gold uppercase tracking-widest">Pracovní doba (0-24h)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.keys(formData.structuredSchedule).map((day) => {
                        const s = (formData.structuredSchedule as any)[day];
                        return (
                          <div key={day} className="flex items-center gap-2 bg-black/50 p-2 border border-white/10">
                            <input 
                              type="checkbox" 
                              checked={s.work} 
                              onChange={(e) => setFormData(prev => ({
                                ...prev, 
                                structuredSchedule: {
                                  ...prev.structuredSchedule, 
                                  [day]: { ...s, work: e.target.checked }
                                }
                              }))} 
                              className="accent-mafia-gold"
                            />
                            <span className="w-8 font-mono text-white">{day}</span>
                            <input 
                              type="time" 
                              value={s.start} 
                              disabled={!s.work}
                              onChange={(e) => setFormData(prev => ({
                                ...prev, 
                                structuredSchedule: {
                                  ...prev.structuredSchedule, 
                                  [day]: { ...s, start: e.target.value }
                                }
                              }))}
                              className="bg-black border border-white/20 text-white px-1 text-xs outline-none" 
                            />
                            <span className="text-white/50">-</span>
                            <input 
                              type="time" 
                              value={s.end} 
                              disabled={!s.work}
                              onChange={(e) => setFormData(prev => ({
                                ...prev, 
                                structuredSchedule: {
                                  ...prev.structuredSchedule, 
                                  [day]: { ...s, end: e.target.value }
                                }
                              }))}
                              className="bg-black border border-white/20 text-white px-1 text-xs outline-none" 
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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
            <div key={b.id} className={`bg-white/5 border p-6 relative group flex flex-col justify-between ${b.missionFailed ? 'border-mafia-red/50 bg-mafia-red/5' : 'border-white/10'}`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-16 h-16 rounded overflow-hidden border ${b.missionFailed ? 'border-mafia-red' : 'border-mafia-gold/30'}`}>
                    <img src={b.image} alt={b.name} className={`w-full h-full object-cover transition ${b.missionFailed ? 'grayscale sepia-[0.5] hue-rotate-[-50deg] saturate-200' : 'grayscale group-hover:grayscale-0'}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggleKIA(b)} className={`transition p-2 border ${b.missionFailed ? 'text-mafia-red border-mafia-red bg-mafia-red/20' : 'text-white/30 border-white/10 hover:text-mafia-red/50'}`} title={b.missionFailed ? 'Oživit' : 'Zabít (Mise selhala)'}>
                      <Skull size={16} />
                    </button>
                    <button onClick={() => handleToggleLock(b)} className={`transition p-2 border ${b.requiresUnlock ? 'text-mafia-gold border-mafia-gold/50 bg-mafia-gold/10' : 'text-white/30 border-white/10 hover:text-white'}`} title={b.requiresUnlock ? `Zamčeno (potřeba ${b.unlockThreshold} fragmentů)` : 'Odemčeno'}>
                      {b.requiresUnlock ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>
                    <button onClick={() => openQuotesModal(b)} className="text-white/30 hover:text-blue-400 transition p-2 border border-white/10" title="Citáty a hlášky">
                      <MessageCircle size={16} />
                    </button>
                    <button onClick={() => openStatusModal(b)} className="text-white/30 hover:text-green-500 transition p-2 border border-white/10" title="Status operativce (Kalendář / Online)">
                      <Activity size={16} />
                    </button>
                    {b.id !== 'tomas' && b.id !== 'nella' && (
                      <button onClick={() => handleDelete(b.id)} className="text-white/30 hover:text-mafia-red transition p-2 border border-white/10">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                {b.missionFailed && <div className="text-mafia-red font-black tracking-widest text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 opacity-20 pointer-events-none">MISE SELHALA</div>}
                <h3 className={`text-2xl font-heading font-black uppercase tracking-widest ${b.missionFailed ? 'text-mafia-red line-through opacity-50' : 'text-white'}`}>{b.name}</h3>
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

      <AnimatePresence>
        {quotesModalBarber && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#0c0c0c] border border-white/10 w-full max-w-2xl max-h-[90vh] flex flex-col relative"
            >
              <button onClick={closeQuotesModal} className="absolute top-4 right-4 text-white/50 hover:text-white">
                <X size={20} />
              </button>
              
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-heading font-black tracking-widest uppercase text-mafia-gold">
                  Citáty a Hlášky - {quotesModalBarber.name}
                </h2>
                <p className="text-xs text-white/50 font-mono mt-1">Spravujte hlášky, které se objevují v bublině na hlavní stránce.</p>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div>
                  <h3 className="text-sm font-black uppercase text-white mb-4">Časování citátů</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-white/50 font-mono uppercase mb-1">Zobrazit bublinu na (sekundy)</label>
                      <input 
                        type="number" 
                        min="1"
                        value={quoteTiming.showFor} 
                        onChange={(e) => setQuoteTiming({...quoteTiming, showFor: parseInt(e.target.value) || 10})}
                        className="w-full bg-black/50 border border-white/20 p-2 text-sm focus:border-mafia-gold outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/50 font-mono uppercase mb-1">Skrýt bublinu na (sekundy)</label>
                      <input 
                        type="number" 
                        min="1"
                        value={quoteTiming.waitFor} 
                        onChange={(e) => setQuoteTiming({...quoteTiming, waitFor: parseInt(e.target.value) || 12})}
                        className="w-full bg-black/50 border border-white/20 p-2 text-sm focus:border-mafia-gold outline-none" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black uppercase text-white mb-4">Seznam citátů ({editingQuotes.length})</h3>
                  <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto pr-2">
                    {editingQuotes.length === 0 && <p className="text-xs text-white/30 italic">Žádné citáty nejsou nastaveny. Bublina se nebude objevovat.</p>}
                    {editingQuotes.map((q, idx) => (
                      <div key={idx} className="flex gap-2 items-start bg-white/5 p-3 border border-white/10">
                        <p className="text-sm text-white/80 flex-1">{q}</p>
                        <button onClick={() => handleRemoveQuote(idx)} className="text-white/30 hover:text-mafia-red">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newQuoteText} 
                      onChange={(e) => setNewQuoteText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddQuote()}
                      placeholder="Napište novou hlášku..."
                      className="flex-1 bg-black border border-white/20 p-2 text-sm focus:border-mafia-gold outline-none"
                    />
                    <button onClick={handleAddQuote} className="px-4 py-2 bg-white/10 hover:bg-white/20 transition text-sm font-black uppercase tracking-widest border border-white/20">
                      Přidat
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-black/50">
                <button onClick={closeQuotesModal} className="px-6 py-2 text-white/50 hover:text-white uppercase text-xs font-black tracking-widest">
                  Zrušit
                </button>
                <button onClick={handleSaveQuotes} className="px-6 py-2 bg-mafia-gold text-black uppercase text-xs font-black tracking-widest flex items-center gap-2 hover:bg-white transition">
                  <Save size={14} /> Uložit změny
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {statusModalBarber && currentStatusConfig && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#0c0c0c] border border-white/10 w-full max-w-4xl max-h-[90vh] flex flex-col relative"
            >
              <button onClick={closeStatusModal} className="absolute top-4 right-4 text-white/50 hover:text-white">
                <X size={20} />
              </button>
              
              <div className="p-6 border-b border-white/10 flex items-center gap-4">
                <Activity className="text-green-500" size={24} />
                <div>
                  <h2 className="text-2xl font-heading font-black tracking-widest uppercase text-mafia-gold">
                    STATUS - {statusModalBarber.name}
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">Spravujte kalendář a online/offline stav operativce.</p>
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-[#050505] relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(197,160,89,0.05)_0%,transparent_50%)] pointer-events-none"></div>
                
                <div className="p-4 border border-mafia-gold/20 bg-mafia-gold/5 flex gap-4 items-start relative z-10">
                  <ShieldAlert className="text-mafia-gold shrink-0 mt-1" size={20} />
                  <p className="font-mono text-xs text-white/60 leading-relaxed">
                    Zde nastavuješ, jestli má na kartě zelenou tečku (online), červenou (offline), nebo skrytou. Můžeš to nechat běžet automaticky podle hodin, nebo to ručně přebít.
                  </p>
                </div>

                <div className="space-y-12 relative z-10">
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6">REŽIM OVLÁDÁNÍ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`cursor-pointer p-6 border transition-all flex items-center gap-4 ${
                        currentStatusConfig.mode === 'manual' ? 'border-mafia-gold bg-mafia-gold/10' : 'border-white/10 hover:border-white/30'
                      }`}>
                        <input type="radio" name="mode" className="hidden" checked={currentStatusConfig.mode === 'manual'} onChange={() => updateStatusConfig({ mode: 'manual' })} />
                        <Power size={24} className={currentStatusConfig.mode === 'manual' ? 'text-mafia-gold' : 'text-white/40'} />
                        <div>
                          <div className={`font-heading font-black tracking-widest uppercase mb-1 ${currentStatusConfig.mode === 'manual' ? 'text-white' : 'text-white/60'}`}>Ruční ovládání</div>
                          <div className="font-mono text-[9px] text-white/40 uppercase">Okamžitě změní status nezávisle na čase.</div>
                        </div>
                      </label>
                      
                      <label className={`cursor-pointer p-6 border transition-all flex items-center gap-4 ${
                        currentStatusConfig.mode === 'calendar' ? 'border-mafia-gold bg-mafia-gold/10' : 'border-white/10 hover:border-white/30'
                      }`}>
                        <input type="radio" name="mode" className="hidden" checked={currentStatusConfig.mode === 'calendar'} onChange={() => updateStatusConfig({ mode: 'calendar' })} />
                        <CalendarDays size={24} className={currentStatusConfig.mode === 'calendar' ? 'text-mafia-gold' : 'text-white/40'} />
                        <div>
                          <div className={`font-heading font-black tracking-widest uppercase mb-1 ${currentStatusConfig.mode === 'calendar' ? 'text-white' : 'text-white/60'}`}>Automatický kalendář</div>
                          <div className="font-mono text-[9px] text-white/40 uppercase">Sám se přepíná podle pracovní doby.</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {currentStatusConfig.mode === 'manual' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 border-t border-white/5 pt-10">ZVOLTE RUČNÍ STAV</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <label className={`cursor-pointer p-4 border flex flex-col items-center justify-center gap-3 transition-all ${
                          currentStatusConfig.manualState === 'online' ? 'border-green-500 bg-green-500/10' : 'border-white/10 hover:border-white/30'
                        }`}>
                          <input type="radio" className="hidden" checked={currentStatusConfig.manualState === 'online'} onChange={() => updateStatusConfig({ manualState: 'online' })} />
                          <div className={`w-4 h-4 rounded-full bg-green-500 ${currentStatusConfig.manualState === 'online' ? 'shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse' : ''}`}></div>
                          <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Online</span>
                        </label>
                        <label className={`cursor-pointer p-4 border flex flex-col items-center justify-center gap-3 transition-all ${
                          currentStatusConfig.manualState === 'offline' ? 'border-red-600 bg-red-600/10' : 'border-white/10 hover:border-white/30'
                        }`}>
                          <input type="radio" className="hidden" checked={currentStatusConfig.manualState === 'offline'} onChange={() => updateStatusConfig({ manualState: 'offline' })} />
                          <div className={`w-4 h-4 rounded-full bg-red-600 ${currentStatusConfig.manualState === 'offline' ? 'shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-pulse' : ''}`}></div>
                          <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Offline</span>
                        </label>
                        <label className={`cursor-pointer p-4 border flex flex-col items-center justify-center gap-3 transition-all ${
                          currentStatusConfig.manualState === 'custom' ? 'border-mafia-gold bg-mafia-gold/10' : 'border-white/10 hover:border-white/30'
                        }`}>
                          <input type="radio" className="hidden" checked={currentStatusConfig.manualState === 'custom'} onChange={() => updateStatusConfig({ manualState: 'custom' })} />
                          <div className={`w-4 h-4 rounded-full bg-mafia-gold ${currentStatusConfig.manualState === 'custom' ? 'shadow-[0_0_15px_rgba(197,160,89,0.6)] animate-pulse' : ''}`}></div>
                          <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Vlastní text</span>
                        </label>
                        <label className={`cursor-pointer p-4 border flex flex-col items-center justify-center gap-3 transition-all ${
                          currentStatusConfig.manualState === 'transparent' ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/30'
                        }`}>
                          <input type="radio" className="hidden" checked={currentStatusConfig.manualState === 'transparent'} onChange={() => updateStatusConfig({ manualState: 'transparent' })} />
                          <EyeOff size={16} className={currentStatusConfig.manualState === 'transparent' ? 'text-white' : 'text-white/40'} />
                          <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Skrýt (Nic)</span>
                        </label>
                      </div>
                      {currentStatusConfig.manualState === 'custom' && (
                        <div className="p-6 border border-mafia-gold/30 bg-mafia-gold/5 mt-4">
                          <label className="block text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-4">Text vedle oranžové tečky:</label>
                          <input 
                            type="text" 
                            value={currentStatusConfig.manualCustomText}
                            onChange={(e) => updateStatusConfig({ manualCustomText: e.target.value })}
                            placeholder="např. Nemoc, Dovolená, Plno..."
                            className="w-full bg-black/50 border border-mafia-gold/50 p-4 text-white font-mono uppercase focus:border-mafia-gold focus:outline-none"
                          />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {currentStatusConfig.mode === 'calendar' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 border-t border-white/5 pt-10">PRACOVNÍ DOBA (Pro vizitku a online stav)</h3>
                      <div className="mb-8 p-6 border border-white/10 bg-white/5">
                        <label className="flex items-center gap-4 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="accent-mafia-gold w-5 h-5"
                            checked={currentStatusConfig.isIndividualSchedule}
                            onChange={(e) => updateStatusConfig({ isIndividualSchedule: e.target.checked })}
                          />
                          <div>
                            <div className="font-heading font-black tracking-widest uppercase text-white mb-1">Individuální režim</div>
                            <div className="font-mono text-[9px] uppercase text-white/40">Na kartě se místo časů vypíše "Individuální režim". Online tečka se nebude zapínat automaticky.</div>
                          </div>
                        </label>
                      </div>
                      {!currentStatusConfig.isIndividualSchedule && (
                        <div className="space-y-3">
                          {DAYS.map(day => {
                            const entry = currentStatusConfig.calendar.find(c => c.dayOfWeek === day.id);
                            const isActive = !!entry;
                            return (
                              <div key={day.id} className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4">
                                <div className="w-24 shrink-0 font-heading font-bold uppercase tracking-widest text-sm">
                                  {day.label}
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer ml-4 mr-8">
                                  <input 
                                    type="checkbox" 
                                    className="accent-mafia-gold w-4 h-4"
                                    checked={isActive}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        updateCalendarEntry(day.id, 'start', '09:00');
                                      } else {
                                        updateStatusConfig({ calendar: currentStatusConfig.calendar.filter(c => c.dayOfWeek !== day.id) });
                                      }
                                    }}
                                  />
                                  <span className="font-mono text-[10px] uppercase text-white/60">Pracuje</span>
                                </label>
                                {isActive ? (
                                  <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-4">
                                      <input 
                                        type="time" 
                                        value={entry.start}
                                        onChange={(e) => updateCalendarEntry(day.id, 'start', e.target.value)}
                                        className="bg-black border border-white/20 p-2 text-white font-mono text-sm focus:border-mafia-gold outline-none"
                                      />
                                      <span className="text-white/40 font-mono text-xs">do</span>
                                      <input 
                                        type="time" 
                                        value={entry.end}
                                        onChange={(e) => updateCalendarEntry(day.id, 'end', e.target.value)}
                                        className="bg-black border border-white/20 p-2 text-white font-mono text-sm focus:border-mafia-gold outline-none"
                                      />
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                                      <input 
                                        type="checkbox" 
                                        className="accent-mafia-red w-3 h-3"
                                        checked={!!(entry.breakStart || entry.breakEnd)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            updateCalendarEntry(day.id, 'breakStart', '12:00');
                                            updateCalendarEntry(day.id, 'breakEnd', '13:00');
                                          } else {
                                            updateCalendarEntry(day.id, 'breakStart', '');
                                            updateCalendarEntry(day.id, 'breakEnd', '');
                                          }
                                        }}
                                      />
                                      <span className="font-mono text-[9px] uppercase text-white/40">Přidat pauzu (Offline)</span>
                                    </label>
                                    {(entry.breakStart || entry.breakEnd) && (
                                      <div className="flex items-center gap-4 ml-5">
                                        <span className="text-mafia-red font-mono text-[10px] uppercase">Pauza:</span>
                                        <input 
                                          type="time" 
                                          value={entry.breakStart || ''}
                                          onChange={(e) => updateCalendarEntry(day.id, 'breakStart', e.target.value)}
                                          className="bg-mafia-red/10 border border-mafia-red/30 p-1 px-2 text-mafia-red font-mono text-xs focus:border-mafia-red outline-none"
                                        />
                                        <span className="text-white/40 font-mono text-[10px]">do</span>
                                        <input 
                                          type="time" 
                                          value={entry.breakEnd || ''}
                                          onChange={(e) => updateCalendarEntry(day.id, 'breakEnd', e.target.value)}
                                          className="bg-mafia-red/10 border border-mafia-red/30 p-1 px-2 text-mafia-red font-mono text-xs focus:border-mafia-red outline-none"
                                        />
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-white/20 font-mono text-[10px] uppercase italic tracking-widest">
                                    Offline (Volno)
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex justify-end items-center gap-4 bg-black/50">
                {savedStatusMessage && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-green-500 flex items-center gap-2 font-mono text-xs uppercase tracking-widest mr-4">
                    <CheckCircle size={14} /> Uloženo
                  </motion.div>
                )}
                <button onClick={closeStatusModal} className="px-6 py-2 text-white/50 hover:text-white uppercase text-xs font-black tracking-widest">
                  Zrušit
                </button>
                <button onClick={handleSaveStatus} className="px-6 py-2 bg-mafia-gold text-black uppercase text-xs font-black tracking-widest flex items-center gap-2 hover:bg-white transition">
                  <Save size={14} /> Uložit změny
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
