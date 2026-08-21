"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Link2, Trash2, Check, X, Users, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LinkedAccountsSettings() {
  const { lang } = useTranslation();
  const [links, setLinks] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [isAdding, setIsAdding] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [relationType, setRelationType] = useState("couple");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/seznamka/link');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');
      setLinks(data.linked || []);
      setReceivedRequests(data.receivedRequests || []);
      setSentRequests(data.sentRequests || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showMessage = (msg: string, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(null), 3000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/seznamka/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetEmail, type: relationType })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      showMessage(lang === 'cs' ? 'Žádost úspěšně odeslána!' : 'Request sent successfully!');
      setIsAdding(false);
      setTargetEmail("");
      fetchData();
    } catch (err: any) {
      showMessage(err.message, true);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const res = await fetch('/api/seznamka/link', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showMessage(lang === 'cs' ? 'Žádost přijata!' : 'Request accepted!');
      fetchData();
    } catch (err: any) {
      showMessage(err.message, true);
    }
  };

  const handleDelete = async (type: 'request' | 'link', id: string) => {
    if (!window.confirm(lang === 'cs' ? 'Opravdu chcete tuto akci provést?' : 'Are you sure you want to do this?')) return;
    
    try {
      const url = `/api/seznamka/link?${type === 'request' ? `requestId=${id}` : `linkId=${id}`}`;
      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showMessage(lang === 'cs' ? 'Smazáno!' : 'Deleted!');
      fetchData();
    } catch (err: any) {
      showMessage(err.message, true);
    }
  };

  if (loading) return <div className="p-4 text-center text-white/50 animate-pulse">Loading...</div>;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-heading font-black text-mafia-gold uppercase tracking-widest flex items-center gap-2">
            <Link2 size={24} />
            {lang === 'cs' ? 'Propojené účty' : 'Linked Accounts'}
          </h3>
          <p className="text-xs text-white/50 font-mono mt-1">
            {lang === 'cs' 
              ? 'Propojte si účet s partnerem nebo rodinou, abyste se navzájem neviděli v seznamce.' 
              : 'Link your account with your partner or family so you don\'t see each other.'}
          </p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-mafia-gold text-black font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors flex items-center gap-2"
          >
            <Users size={16} />
            <span className="hidden sm:inline">{lang === 'cs' ? 'Propojit někoho' : 'Link someone'}</span>
          </button>
        )}
      </div>

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="p-3 bg-red-500/20 border border-red-500/50 text-red-500 text-xs font-mono">
            {error}
          </motion.div>
        )}
        {successMsg && (
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="p-3 bg-green-500/20 border border-green-500/50 text-green-500 text-xs font-mono">
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}}
            onSubmit={handleSendRequest}
            className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-4"
          >
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">{lang === 'cs' ? 'Odeslat žádost' : 'Send Request'}</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-white/50 mb-1">{lang === 'cs' ? 'E-mail partnera' : 'Partner\'s Email'}</label>
                <input 
                  type="email" required
                  value={targetEmail} onChange={e => setTargetEmail(e.target.value)}
                  className="w-full bg-black border border-white/20 p-2 text-white text-sm focus:border-mafia-gold outline-none"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-white/50 mb-1">{lang === 'cs' ? 'Typ propojení' : 'Relation Type'}</label>
                <select 
                  value={relationType} onChange={e => setRelationType(e.target.value)}
                  className="w-full bg-black border border-white/20 p-2 text-white text-sm focus:border-mafia-gold outline-none"
                >
                  <option value="couple">{lang === 'cs' ? 'Partner / Manžel' : 'Partner / Spouse'}</option>
                  <option value="family">{lang === 'cs' ? 'Rodina' : 'Family'}</option>
                  <option value="friend">{lang === 'cs' ? 'Kamarád' : 'Friend'}</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 border border-white/20 text-white/70 hover:text-white text-xs uppercase tracking-widest">{lang === 'cs' ? 'Zrušit' : 'Cancel'}</button>
              <button type="submit" className="px-4 py-2 bg-mafia-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-white">{lang === 'cs' ? 'Odeslat' : 'Send'}</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Received Requests */}
      {receivedRequests.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Mail size={16} className="text-mafia-gold" />
            {lang === 'cs' ? 'Nové žádosti' : 'New Requests'}
          </h4>
          {receivedRequests.map(req => (
            <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-mafia-gold/30 rounded-xl gap-4">
              <div>
                <p className="text-white font-bold">{req.sender.profile?.name || req.sender.email}</p>
                <p className="text-xs text-white/50 font-mono mt-1">
                  {lang === 'cs' ? 'Chce se s vámi propojit jako ' : 'Wants to link as '}
                  <strong className="text-mafia-gold">{req.type}</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleAcceptRequest(req.id)} className="flex-1 sm:flex-none flex justify-center items-center gap-1 px-4 py-2 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-black border border-green-500/50 transition-colors text-xs uppercase tracking-widest font-bold">
                  <Check size={16} /> {lang === 'cs' ? 'Přijmout' : 'Accept'}
                </button>
                <button onClick={() => handleDelete('request', req.id)} className="flex-1 sm:flex-none flex justify-center items-center gap-1 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/30 border border-red-500/30 transition-colors text-xs uppercase tracking-widest">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sent Requests */}
      {sentRequests.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white/50 uppercase tracking-widest">{lang === 'cs' ? 'Odeslané žádosti (Čeká se)' : 'Sent Requests (Pending)'}</h4>
          {sentRequests.map(req => (
            <div key={req.id} className="flex items-center justify-between p-3 border border-white/5 bg-black/40 rounded-xl">
              <div>
                <p className="text-white/70 text-sm">{req.receiver.profile?.name || req.receiver.email}</p>
                <p className="text-[10px] text-white/40 font-mono uppercase">{req.type}</p>
              </div>
              <button onClick={() => handleDelete('request', req.id)} className="p-2 text-white/30 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Linked Accounts */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-white uppercase tracking-widest">{lang === 'cs' ? 'Aktivní propojení' : 'Active Links'}</h4>
        {links.length === 0 ? (
          <div className="text-center p-8 border border-white/5 border-dashed rounded-xl text-white/30 font-mono text-sm">
            {lang === 'cs' ? 'Nemáte žádné propojené účty.' : 'No linked accounts.'}
          </div>
        ) : (
          links.map(link => (
            <div key={link.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-mafia-gold/20 flex items-center justify-center text-mafia-gold">
                  <Link2 size={18} />
                </div>
                <div>
                  <p className="text-white font-bold">{link.profile?.name || 'Neznámý uživatel'}</p>
                  <p className="text-xs text-white/50 font-mono uppercase mt-0.5">{link.type}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete('link', link.id)} 
                className="p-2 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                title={lang === 'cs' ? 'Zrušit propojení' : 'Remove link'}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
