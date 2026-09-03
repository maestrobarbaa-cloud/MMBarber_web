import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Trash, UserX, AlertTriangle, Activity, BarChart, Settings, Users, ArrowLeft, Link, Copy, Check, Terminal, Bot } from 'lucide-react';
import { ProfileData } from './ProfileCard';

interface AdminDashboardProps {
  currentUser: any;
  allProfiles: ProfileData[];
  onDeleteProfile: (profileName: string) => void;
  onUpdateProfile: (profile: ProfileData) => void;
  onClose: () => void;
  lang: 'cs' | 'en' | 'zh';
}

export function AdminDashboard({ currentUser, allProfiles, onDeleteProfile, onUpdateProfile, onClose, lang }: AdminDashboardProps) {
  const isSuperAdmin = currentUser?.nickname === 'Admin';
  const partnerSalonId = currentUser?.partnerSalonId || null; // e.g., 'kavarna-x'
  
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'partners' | 'defender'>('overview');
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState('');
  
  // Real data state
  const [threatLogs, setThreatLogs] = useState<any[]>([]);
  const [attackers, setAttackers] = useState<any[]>([]);
  const [aiSpawnStatus, setAiSpawnStatus] = useState<string>('');
  
  const [isLockdown, setIsLockdown] = useState<boolean>(false);
  const [healingStatus, setHealingStatus] = useState<string>('');

  useEffect(() => {
    // Načíst stav lockdownu
    fetch('/api/admin/lockdown').then(res => res.json()).then(data => setIsLockdown(data.lockdown || false)).catch(console.error);
    
    if (isSuperAdmin) {
      fetch('/api/admin/threats')
        .then(res => res.json())
        .then(data => {
          if (data.logs) setThreatLogs(data.logs);
          if (data.attackers) setAttackers(data.attackers);
        })
        .catch(console.error);
    }
  }, [isSuperAdmin]);

  const handleSpawnAi = async () => {
    setAiSpawnStatus('Spouštím sekvenci...');
    try {
      const res = await fetch('/api/admin/spawn-ai', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setAiSpawnStatus(data.message || 'AI Profil úspěšně zrozen!');
      } else {
        setAiSpawnStatus('Chyba: ' + data.error);
      }
    } catch (e) {
      setAiSpawnStatus('Chyba komunikace.');
    }
  };

  const handleToggleLockdown = async () => {
    try {
      const res = await fetch('/api/admin/lockdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable: !isLockdown })
      });
      const data = await res.json();
      if (res.ok) setIsLockdown(data.lockdown);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAutoHeal = async () => {
    setHealingStatus('Léčím...');
    try {
      const res = await fetch('/api/admin/auto-heal', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setHealingStatus(`Úspěch! ${data.report.join(' ')}`);
        setTimeout(() => setHealingStatus(''), 5000);
      }
    } catch (e) {
      setHealingStatus('Chyba spojení.');
    }
  };

  // Filter profiles based on role
  const visibleProfiles = useMemo(() => {
    if (isSuperAdmin) return allProfiles;
    if (partnerSalonId) return allProfiles.filter(p => p.originSalonId === partnerSalonId);
    return [];
  }, [allProfiles, isSuperAdmin, partnerSalonId]);

  // Calculate stats
  const totalUsers = visibleProfiles.length;
  const totalReports = visibleProfiles.reduce((acc, p) => acc + (p.reportsDetails?.length || 0), 0);
  
  // Sort users by Danger Score
  const getDangerScore = (p: ProfileData) => {
    let score = 0;
    if (p.reportsDetails) score += p.reportsDetails.length * 20;
    if (p.replyRate === 'low') score += 15;
    if (p.trustScore !== undefined && p.trustScore < 30) score += 20;
    return score;
  };

  const sortedUsers = [...visibleProfiles].sort((a, b) => getDangerScore(b) - getDangerScore(a));
  
  const handlePurge = () => {
    const toDelete = sortedUsers.filter(p => getDangerScore(p) > 40 || (p.reportsDetails && p.reportsDetails.length >= 3));
    toDelete.forEach(p => onDeleteProfile(p.name));
    setShowPurgeModal(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(''), 2000);
  };

  return (
    <div className="min-h-screen bg-mafia-black text-smoke-white p-6 relative overflow-x-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <div>
          <button onClick={onClose} className="flex items-center gap-2 text-mafia-gold hover:text-white mb-4 transition-colors font-mono text-xs uppercase tracking-widest">
            <ArrowLeft size={16} /> {lang === 'cs' ? 'Zpět do Sítě' : 'Back to Network'}
          </button>
          <h1 className="text-3xl md:text-5xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] flex items-center gap-4">
            <ShieldCheck size={36} /> 
            {isSuperAdmin ? 'Super Admin' : `Partner Admin: ${partnerSalonId}`}
          </h1>
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors rounded ${activeTab === 'overview' ? 'bg-mafia-gold text-black' : 'text-white/50 hover:text-white'}`}>Přehled</button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors rounded ${activeTab === 'users' ? 'bg-mafia-gold text-black' : 'text-white/50 hover:text-white'}`}>Uživatelé</button>
          {isSuperAdmin && (
            <>
              <button onClick={() => setActiveTab('defender')} className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors rounded flex items-center gap-2 ${activeTab === 'defender' ? 'bg-red-900 text-white border border-red-500' : 'text-white/50 hover:text-white'}`}>
                <Terminal size={14} /> Defender
              </button>
              <button onClick={() => setActiveTab('partners')} className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors rounded ${activeTab === 'partners' ? 'bg-mafia-gold text-black' : 'text-white/50 hover:text-white'}`}>Partneři</button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/60 border border-white/10 p-6 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-400">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-white/50 font-mono text-xs uppercase tracking-widest mb-1">Celkem uživatelů</p>
                  <p className="text-3xl font-black text-white">{totalUsers}</p>
                </div>
              </div>
              <div className="bg-black/60 border border-white/10 p-6 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-900/40 flex items-center justify-center text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <p className="text-white/50 font-mono text-xs uppercase tracking-widest mb-1">Celkem nahlášení</p>
                  <p className="text-3xl font-black text-white">{totalReports}</p>
                </div>
              </div>
              <div className="bg-black/60 border border-mafia-gold/30 p-6 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-mafia-gold/70 font-mono text-xs uppercase tracking-widest mb-2">Hromadná očista</p>
                  <button onClick={() => setShowPurgeModal(true)} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded flex items-center gap-2 transition-colors">
                    <Trash size={14} /> THE PURGE
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40 max-w-[120px] font-sans">Automaticky smaže všechny účty s vysokým skóre nebezpečnosti.</p>
                </div>
              </div>
            </div>

            {/* Custom Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Threat Level Chart */}
              <div className="bg-black/40 border border-white/10 p-6 rounded-xl">
                <h3 className="font-heading font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2"><Activity size={18} className="text-red-500" /> Threat Level (Danger Score)</h3>
                <div className="flex items-end gap-2 h-48">
                  {sortedUsers.slice(0, 10).map((u, i) => {
                    const score = getDangerScore(u);
                    const height = Math.min(Math.max((score / 100) * 100, 5), 100);
                    const color = score > 40 ? 'bg-red-500' : score > 15 ? 'bg-orange-500' : 'bg-blue-500';
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                        <div className="absolute -top-8 bg-black border border-white/20 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 text-[10px] font-mono">
                          {u.name} (Skóre: {score})
                        </div>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: i * 0.1 }}
                          className={`w-full rounded-t-sm ${color} opacity-80 group-hover:opacity-100`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Ghosting Analýza */}
              <div className="bg-black/40 border border-white/10 p-6 rounded-xl">
                <h3 className="font-heading font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2"><BarChart size={18} className="text-blue-400" /> Ghosting Analýza (Reply Rate)</h3>
                <div className="space-y-4">
                  {[
                    { label: 'High', count: visibleProfiles.filter(p => p.replyRate === 'high').length, color: 'bg-green-500' },
                    { label: 'Medium', count: visibleProfiles.filter(p => p.replyRate === 'medium').length, color: 'bg-yellow-500' },
                    { label: 'Low (Toxický ghosting)', count: visibleProfiles.filter(p => p.replyRate === 'low').length, color: 'bg-red-500' }
                  ].map((stat, i) => {
                    const pct = totalUsers > 0 ? (stat.count / totalUsers) * 100 : 0;
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-white/70 uppercase">{stat.label}</span>
                          <span>{stat.count} uživatelů ({Math.round(pct)}%)</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} className={`h-full ${stat.color}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI Guru Section */}
            {isSuperAdmin && (
              <div className="bg-black/60 border border-mafia-gold/20 p-6 rounded-xl mt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-mafia-gold/10 flex items-center justify-center text-mafia-gold border border-mafia-gold/30">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-mafia-gold uppercase tracking-widest">AI Rádce (Guru)</h3>
                    <p className="text-sm text-white/50 font-mono">Vygenerovat systémový profil do sítě</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleSpawnAi}
                    className="px-6 py-2 bg-mafia-gold text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors rounded"
                  >
                    Vyvolat AI
                  </button>
                  {aiSpawnStatus && <span className="text-xs font-mono text-mafia-gold animate-pulse">{aiSpawnStatus}</span>}
                </div>
              </div>
            )}

            {/* Fail-Safes Section */}
            {isSuperAdmin && (
              <div className="bg-black/60 border border-red-900/50 p-6 rounded-xl mt-6">
                <h3 className="font-heading font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-500" /> Nouzové a Opravné Nástroje (Fail-Safes)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Panic Button */}
                  <div className="bg-red-950/20 border border-red-900 p-4 rounded text-center">
                    <p className="text-xs text-white/50 mb-3 font-mono">Uzamkne veškeré zápisy do databáze v celé aplikaci.</p>
                    <button 
                      onClick={handleToggleLockdown}
                      className={`w-full px-4 py-3 rounded uppercase font-bold text-xs tracking-widest transition-all ${isLockdown ? 'bg-white text-red-600 border border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.5)]' : 'bg-red-900 text-white hover:bg-red-700'}`}
                    >
                      {isLockdown ? 'Zrušit Lockdown' : 'Aktivovat Lockdown'}
                    </button>
                  </div>
                  {/* Auto Heal */}
                  <div className="bg-blue-950/20 border border-blue-900 p-4 rounded text-center">
                    <p className="text-xs text-white/50 mb-3 font-mono">Roboticky vyčistí databázi (promaže staré bany a neplatné vazby).</p>
                    <button 
                      onClick={handleAutoHeal}
                      className="w-full px-4 py-3 bg-blue-900 text-white hover:bg-blue-700 rounded uppercase font-bold text-xs tracking-widest transition-all"
                    >
                      Spustit Auto-Heal Bot
                    </button>
                    {healingStatus && <p className="text-[10px] text-blue-400 mt-2 font-mono">{healingStatus}</p>}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Defender Tab */}
        {activeTab === 'defender' && isSuperAdmin && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-black/80 border border-red-900 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/10 rounded-full blur-3xl" />
              <h3 className="text-xl font-heading font-black text-red-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                <Terminal size={24} /> 
                AI Defender Log
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-mono text-white/50 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Top Útočníci</h4>
                  <div className="space-y-2">
                    {attackers.length === 0 ? <p className="text-xs font-mono text-white/30">Čisto.</p> : attackers.map((att, i) => (
                      <div key={att.ip} className="flex justify-between items-center bg-black/40 border border-white/5 p-2 text-xs font-mono">
                        <span className="text-red-400">{att.ip}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-white/50">Skóre: {att.score}</span>
                          {att.isBanned && <span className="px-2 py-0.5 bg-red-900/50 text-red-500 text-[10px]">BANNED</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-mono text-white/50 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Poslední Zásahy</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {threatLogs.length === 0 ? <p className="text-xs font-mono text-white/30">Žádné útoky.</p> : threatLogs.map((log) => (
                      <div key={log.id} className="bg-black/40 border border-white/5 p-3 text-[10px] font-mono rounded">
                        <div className="flex justify-between text-white/50 mb-2">
                          <span>{new Date(log.createdAt).toLocaleString('cs')}</span>
                          <span className={log.threatLevel > 20 ? 'text-red-500 font-bold' : 'text-mafia-gold'}>Score: {log.threatLevel}</span>
                        </div>
                        <div className="text-green-500 font-bold break-all">
                          {log.method} {log.path}
                        </div>
                        <div className="text-white/30 mt-1">IP: {log.ip}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-black/60 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-sm">
                  <thead className="bg-white/5 text-white/50 text-[10px] uppercase tracking-widest">
                    <tr>
                      <th className="p-4">Uživatel</th>
                      <th className="p-4">Danger Score</th>
                      <th className="p-4">Nahlášení</th>
                      <th className="p-4">Reply Rate</th>
                      <th className="p-4">Salon / Původ</th>
                      <th className="p-4 text-right">Akce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sortedUsers.map((u, i) => {
                      const score = getDangerScore(u);
                      return (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10">
                              <Image src={u.photos?.[0] || '/placeholder.jpg'} alt={u.name} fill className="object-cover" sizes="32px" />
                            </div>
                            <span className="font-bold">{u.name}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-[10px] ${score > 40 ? 'bg-red-500/20 text-red-400' : score > 15 ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {score}
                            </span>
                          </td>
                          <td className="p-4 text-white/70">{u.reportsDetails?.length || 0}</td>
                          <td className="p-4 text-white/70">{u.replyRate || 'N/A'}</td>
                          <td className="p-4 text-white/70">{u.originSalonId || 'Main'}</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              {!u.salonVerified && isSuperAdmin && (
                                <button onClick={() => onUpdateProfile({...u, salonVerified: true})} className="p-2 text-mafia-gold hover:bg-mafia-gold/20 rounded transition-colors" title="Verifikovat v salonu">
                                  <ShieldCheck size={16} />
                                </button>
                              )}
                              <button onClick={() => onDeleteProfile(u.name)} className="p-2 text-red-500 hover:bg-red-500/20 rounded transition-colors" title="Smazat uživatele">
                                <Trash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {sortedUsers.length === 0 && (
                  <div className="p-12 text-center text-white/40 font-mono text-sm uppercase tracking-widest">
                    Zatím tu nikdo není.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Partners Tab (Super Admin Only) */}
        {activeTab === 'partners' && isSuperAdmin && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-900/20 to-black border border-emerald-500/30 p-8 rounded-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none text-emerald-500 -translate-y-1/4 translate-x-1/4">
                <Link size={200} />
              </div>
              <h3 className="text-2xl font-heading font-black text-emerald-400 uppercase tracking-widest mb-2 relative z-10">B2B Partnerské Přístupy</h3>
              <p className="text-white/60 font-mono text-xs max-w-2xl mb-8 relative z-10 leading-relaxed">
                Níže najdeš demo generátor odkazů pro spřátelené podniky. Zkopíruj jim jejich unikátní link. Pokud si přes něj lidé otevřou seznamku a zaregistrují se, propíše se k nim ID tohoto partnera. Partner pak pod jménem <span className="text-emerald-400 font-bold">Partner_[ID]</span> uvidí v tomto dashboardu jen své lidi.
              </p>

              <div className="space-y-4 max-w-xl relative z-10">
                {['barber-x', 'kavarna-lounge', 'fitness-centrum'].map((partnerId) => {
                  const url = `https://tvojadomena.cz/seznamka?salon=${partnerId}&embed=true`;
                  return (
                    <div key={partnerId} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-black/50 p-4 border border-white/10 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white font-bold mb-1">{partnerId}</p>
                        <p className="text-[10px] text-emerald-400/70 font-mono truncate">{url}</p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(url)}
                        className="flex-shrink-0 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/50 rounded flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest transition-colors"
                      >
                        {copiedLink === url ? <Check size={14} /> : <Copy size={14} />} {copiedLink === url ? 'Zkopírováno' : 'Kopírovat Odkaz'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Purge Modal */}
      <AnimatePresence>
        {showPurgeModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-black border-2 border-red-900 shadow-[0_0_50px_rgba(220,38,38,0.3)] rounded-2xl max-w-md w-full p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
              <AlertTriangle size={64} className="text-red-500 mx-auto mb-6" />
              <h2 className="text-2xl font-heading font-black text-red-500 uppercase tracking-widest mb-4">Potvrzení Očisty</h2>
              <p className="text-white/70 font-mono text-sm leading-relaxed mb-8">
                Skutečně chcete spustit proceduru PURGE? Všechny účty s Danger Score &gt; 40 nebo s více než 3 nahlášeními budou nenávratně smazány ze Sítě.
              </p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setShowPurgeModal(false)} className="px-6 py-2 border border-white/20 text-white hover:bg-white/10 rounded font-mono text-xs uppercase tracking-widest transition-colors">Zrušit</button>
                <button onClick={handlePurge} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-widest font-bold rounded shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all hover:scale-105">SPUSTIT OČISTU</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
