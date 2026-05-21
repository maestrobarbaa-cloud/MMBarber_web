"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Activity, CalendarDays, Power, EyeOff, Save, ShieldAlert, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOperativeStatusData, setOperativeStatusData, OperativeStatusData, OperativeState, OperativeStatusConfig } from "@/utils/status";

const DAYS = [
  { id: 1, label: 'Pondělí' },
  { id: 2, label: 'Úterý' },
  { id: 3, label: 'Středa' },
  { id: 4, label: 'Čtvrtek' },
  { id: 5, label: 'Pátek' },
  { id: 6, label: 'Sobota' },
  { id: 0, label: 'Neděle' }
];

export default function AdminStatusPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<OperativeStatusData | null>(null);
  const [activeTab, setActiveTab] = useState<'tomas' | 'nella'>('tomas');
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") !== "true") {
      router.push("/admin");
    } else {
      setIsAuthenticated(true);
      setData(getOperativeStatusData());
    }
  }, [router]);

  const handleSave = () => {
    if (data) {
      setOperativeStatusData(data);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    }
  };

  if (!isAuthenticated || !data) return null;

  const currentConfig = data[activeTab];

  const updateConfig = (newConfig: Partial<OperativeStatusConfig>) => {
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          ...newConfig
        }
      };
    });
  };

  const updateCalendarEntry = (dayId: number, field: 'start' | 'end' | 'breakStart' | 'breakEnd', value: string) => {
    const updatedCal = [...currentConfig.calendar];
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
    updateConfig({ calendar: updatedCal });
  };

  return (
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12 selection:bg-mafia-gold selection:text-mafia-black">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 pb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Activity className="text-green-500" size={24} />
              <h1 className="text-3xl md:text-4xl font-heading font-black uppercase italic tracking-tighter">
                STATUS <span className="text-mafia-gold">OPERATIVCŮ</span>
              </h1>
            </div>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">MMBARBER_STATUS_CONTROL_V1</p>
          </div>
          
          <div className="flex gap-4 items-center">
            {savedMessage && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-green-500 flex items-center gap-2 font-mono text-xs uppercase tracking-widest mr-4">
                <CheckCircle size={14} /> Uloženo
              </motion.div>
            )}
            <button 
              onClick={handleSave}
              className="flex items-center gap-3 px-8 py-4 bg-mafia-gold text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)]"
            >
              <Save size={16} /> ULOŽIT ZMĚNY
            </button>
            <Link href="/admin" className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
              <ArrowLeft size={16} /> ZPĚT
            </Link>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-4 mb-10">
          <button 
            onClick={() => setActiveTab('tomas')}
            className={`flex-1 py-6 border transition-all text-center uppercase tracking-[0.3em] font-heading font-black text-xl italic ${
              activeTab === 'tomas' 
                ? 'border-mafia-gold bg-mafia-gold/10 text-mafia-gold shadow-[0_0_20px_rgba(197,160,89,0.1)]' 
                : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
            }`}
          >
            TOMÁŠ
          </button>
          <button 
            onClick={() => setActiveTab('nella')}
            className={`flex-1 py-6 border transition-all text-center uppercase tracking-[0.3em] font-heading font-black text-xl italic ${
              activeTab === 'nella' 
                ? 'border-mafia-gold bg-mafia-gold/10 text-mafia-gold shadow-[0_0_20px_rgba(197,160,89,0.1)]' 
                : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
            }`}
          >
            NELLA
          </button>
        </div>

        {/* Content */}
        <div className="bg-[#050505] border border-white/10 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(197,160,89,0.05)_0%,transparent_50%)] pointer-events-none"></div>
          
          <div className="mb-10 p-4 border border-mafia-gold/20 bg-mafia-gold/5 flex gap-4 items-start">
            <ShieldAlert className="text-mafia-gold shrink-0 mt-1" size={20} />
            <p className="font-mono text-xs text-smoke-white/60 leading-relaxed">
              Zde nastavuješ, jestli máš na kartě zelenou tečku (stříháš/online), červenou (plno/offline), nebo jestli je bodík skrytý.
              Můžeš to nechat běžet automaticky podle hodin, nebo to ručně "přebít".
            </p>
          </div>

          <div className="space-y-12 relative z-10">
            {/* Režim */}
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6">REŽIM OVLÁDÁNÍ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`cursor-pointer p-6 border transition-all flex items-center gap-4 ${
                  currentConfig.mode === 'manual' ? 'border-mafia-gold bg-mafia-gold/10' : 'border-white/10 hover:border-white/30'
                }`}>
                  <input type="radio" name="mode" className="hidden" checked={currentConfig.mode === 'manual'} onChange={() => updateConfig({ mode: 'manual' })} />
                  <Power size={24} className={currentConfig.mode === 'manual' ? 'text-mafia-gold' : 'text-white/40'} />
                  <div>
                    <div className={`font-heading font-black tracking-widest uppercase mb-1 ${currentConfig.mode === 'manual' ? 'text-white' : 'text-white/60'}`}>Ruční ovládání</div>
                    <div className="font-mono text-[9px] text-white/40 uppercase">Okamžitě změní status nezávisle na čase.</div>
                  </div>
                </label>
                
                <label className={`cursor-pointer p-6 border transition-all flex items-center gap-4 ${
                  currentConfig.mode === 'calendar' ? 'border-mafia-gold bg-mafia-gold/10' : 'border-white/10 hover:border-white/30'
                }`}>
                  <input type="radio" name="mode" className="hidden" checked={currentConfig.mode === 'calendar'} onChange={() => updateConfig({ mode: 'calendar' })} />
                  <CalendarDays size={24} className={currentConfig.mode === 'calendar' ? 'text-mafia-gold' : 'text-white/40'} />
                  <div>
                    <div className={`font-heading font-black tracking-widest uppercase mb-1 ${currentConfig.mode === 'calendar' ? 'text-white' : 'text-white/60'}`}>Automatický kalendář</div>
                    <div className="font-mono text-[9px] text-white/40 uppercase">Sám se přepíná podle pracovní doby.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Ruční nastavení */}
            {currentConfig.mode === 'manual' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 border-t border-white/5 pt-10">ZVOLTE RUČNÍ STAV</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {/* Online */}
                  <label className={`cursor-pointer p-4 border flex flex-col items-center justify-center gap-3 transition-all ${
                    currentConfig.manualState === 'online' ? 'border-green-500 bg-green-500/10' : 'border-white/10 hover:border-white/30'
                  }`}>
                    <input type="radio" className="hidden" checked={currentConfig.manualState === 'online'} onChange={() => updateConfig({ manualState: 'online' })} />
                    <div className={`w-4 h-4 rounded-full bg-green-500 ${currentConfig.manualState === 'online' ? 'shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse' : ''}`}></div>
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Online</span>
                  </label>

                  {/* Offline */}
                  <label className={`cursor-pointer p-4 border flex flex-col items-center justify-center gap-3 transition-all ${
                    currentConfig.manualState === 'offline' ? 'border-red-600 bg-red-600/10' : 'border-white/10 hover:border-white/30'
                  }`}>
                    <input type="radio" className="hidden" checked={currentConfig.manualState === 'offline'} onChange={() => updateConfig({ manualState: 'offline' })} />
                    <div className={`w-4 h-4 rounded-full bg-red-600 ${currentConfig.manualState === 'offline' ? 'shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-pulse' : ''}`}></div>
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Offline</span>
                  </label>

                  {/* Vlastní */}
                  <label className={`cursor-pointer p-4 border flex flex-col items-center justify-center gap-3 transition-all ${
                    currentConfig.manualState === 'custom' ? 'border-mafia-gold bg-mafia-gold/10' : 'border-white/10 hover:border-white/30'
                  }`}>
                    <input type="radio" className="hidden" checked={currentConfig.manualState === 'custom'} onChange={() => updateConfig({ manualState: 'custom' })} />
                    <div className={`w-4 h-4 rounded-full bg-mafia-gold ${currentConfig.manualState === 'custom' ? 'shadow-[0_0_15px_rgba(197,160,89,0.6)] animate-pulse' : ''}`}></div>
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Vlastní text</span>
                  </label>

                  {/* Transparent */}
                  <label className={`cursor-pointer p-4 border flex flex-col items-center justify-center gap-3 transition-all ${
                    currentConfig.manualState === 'transparent' ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/30'
                  }`}>
                    <input type="radio" className="hidden" checked={currentConfig.manualState === 'transparent'} onChange={() => updateConfig({ manualState: 'transparent' })} />
                    <EyeOff size={16} className={currentConfig.manualState === 'transparent' ? 'text-white' : 'text-white/40'} />
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Skrýt (Nic)</span>
                  </label>
                </div>

                {currentConfig.manualState === 'custom' && (
                  <div className="p-6 border border-mafia-gold/30 bg-mafia-gold/5 mt-4">
                    <label className="block text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-4">Text vedle oranžové tečky:</label>
                    <input 
                      type="text" 
                      value={currentConfig.manualCustomText}
                      onChange={(e) => updateConfig({ manualCustomText: e.target.value })}
                      placeholder="např. Nemoc, Dovolená, Plno..."
                      className="w-full bg-black/50 border border-mafia-gold/50 p-4 text-white font-mono uppercase focus:border-mafia-gold focus:outline-none"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* Kalendář */}
            {currentConfig.mode === 'calendar' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 border-t border-white/5 pt-10">PRACOVNÍ DOBA (Pro vizitku a online stav)</h3>
                
                <div className="mb-8 p-6 border border-white/10 bg-white/5">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="accent-mafia-gold w-5 h-5"
                      checked={currentConfig.isIndividualSchedule}
                      onChange={(e) => updateConfig({ isIndividualSchedule: e.target.checked })}
                    />
                    <div>
                      <div className="font-heading font-black tracking-widest uppercase text-white mb-1">Individuální režim</div>
                      <div className="font-mono text-[9px] uppercase text-white/40">Na kartě se místo časů vypíše "Individuální režim". Online tečka se nebude zapínat automaticky.</div>
                    </div>
                  </label>
                </div>

                {!currentConfig.isIndividualSchedule && (
                  <div className="space-y-3">
                    {DAYS.map(day => {
                    const entry = currentConfig.calendar.find(c => c.dayOfWeek === day.id);
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
                                updateConfig({ calendar: currentConfig.calendar.filter(c => c.dayOfWeek !== day.id) });
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

      </div>
    </div>
  );
}
