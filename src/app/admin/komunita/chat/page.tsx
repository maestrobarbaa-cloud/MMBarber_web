"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowLeft, 
  Trash2, 
  UserX, 
  RefreshCw,
  Lock,
  Search,
  MessageSquare,
  CheckCircle,
  Clock,
  Send,
  AlertOctagon,
  Ban,
  Paperclip,
  Loader2,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { EmojiPicker } from "@/components/EmojiPicker";

interface SupportMessage {
  id: string;
  sender: 'USER' | 'ADMIN';
  text: string;
  timestamp: number;
  read: boolean;
  sessionId: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'video';
}

interface SupportSession {
  id: string;
  ip: string;
  userFullName: string;
  startedAt: number;
  lastActivity: number;
  status: string;
}

export default function AdminSupportChatPage() {
  const { lang } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  const [sessions, setSessions] = useState<SupportSession[]>([]);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // WebRTC
  const [incomingCallId, setIncomingCallId] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<'IDLE' | 'RINGING' | 'IN_CALL'>('IDLE');
  const [isMuted, setIsMuted] = useState(false);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ADMIN_PASSWORD = "MAFIA_PROTOCOL_737";

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch('/api/support-chat?admin=true');
      const data = await res.json();
      setSessions(data.sessions || []);
      setLoading(false);

      if (activeSessionId) {
        const smRes = await fetch(`/api/support-chat?sessionId=${activeSessionId}`);
        const smData = await smRes.json();
        setMessages(smData.messages || []);
      }

      // Check for incoming calls
      const callsRes = await fetch('/api/support-chat/calls');
      const callsData = await callsRes.json();
      
      if (callsData.calls && callsData.calls.length > 0) {
        // Find if our active session is ringing, or if any is ringing
        const ringingCall = callsData.calls.find((c: any) => c.status === 'RINGING' || c.status === 'ACCEPTED');
        if (ringingCall) {
          if (callStatus === 'IDLE' && ringingCall.status === 'RINGING') {
             setIncomingCallId(ringingCall.sessionId);
             setCallStatus('RINGING');
          }
          
          if (ringingCall.status === 'ACCEPTED' && callStatus === 'IDLE') {
            // someone else accepted it, or we reloaded.
          }
          
          if (ringingCall.status === 'RINGING' || ringingCall.status === 'ACCEPTED') {
             // Handle remote candidates
             if (ringingCall.candidates && pcRef.current && pcRef.current.remoteDescription) {
               for (const cand of ringingCall.candidates) {
                 try {
                   await pcRef.current.addIceCandidate(new RTCIceCandidate(cand));
                 } catch (e) {}
               }
             }
          }
        }
      } else {
        if (callStatus === 'RINGING') {
          setCallStatus('IDLE');
          setIncomingCallId(null);
        }
      }

    } catch (error) {
      console.error("Failed to fetch state:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Polling every 3s
    return () => clearInterval(interval);
  }, [isAuthenticated, activeSessionId, callStatus]);
  
  // Mark messages as read when opening a session
  useEffect(() => {
    if (activeSessionId) {
      const unreadIds = messages
        .filter(m => m.sessionId === activeSessionId && m.sender === 'USER' && !m.read)
        .map(m => m.id);
        
      if (unreadIds.length > 0) {
        fetch('/api/support-chat', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'MARK_READ', messageIds: unreadIds })
        }).then(() => {
          setMessages(prev => prev.map(m => unreadIds.includes(m.id) ? { ...m, read: true } : m));
        });
      }
      
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSessionId, messages.length]);

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

  // -------------------------------------------------------------
  // WEBRTC ADMIN LOGIC
  // -------------------------------------------------------------
  const setupPeerConnection = (sessionId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await fetch('/api/support-chat/calls', {
          method: 'POST',
          body: JSON.stringify({
            action: 'CANDIDATE',
            sessionId,
            candidate: event.candidate.toJSON()
          })
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteAudioRef.current && event.streams[0]) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    return pc;
  };

  const acceptCall = async () => {
    if (!incomingCallId) return;
    try {
      // Get offer from API first
      const callsRes = await fetch(`/api/support-chat/calls?sessionId=${incomingCallId}`);
      const data = await callsRes.json();
      if (!data.call || !data.call.offer) throw new Error("No offer found");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      
      const pc = setupPeerConnection(incomingCallId);
      pcRef.current = pc;
      
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(data.call.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      setCallStatus('IN_CALL');

      await fetch('/api/support-chat/calls', {
        method: 'POST',
        body: JSON.stringify({
          action: 'ACCEPT',
          sessionId: incomingCallId,
          answer: { type: answer.type, sdp: answer.sdp }
        })
      });
      
      // Auto switch to that chat session
      setActiveSessionId(incomingCallId);
    } catch (err) {
      console.error(err);
      alert("Nepodařilo se přijmout hovor.");
      cleanupCall();
    }
  };

  const endCall = async () => {
    const sId = incomingCallId || activeSessionId;
    if (sId) {
      await fetch('/api/support-chat/calls', {
        method: 'POST',
        body: JSON.stringify({ action: 'END', sessionId: sId })
      });
    }
    cleanupCall();
  };

  const cleanupCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    setCallStatus('IDLE');
    setIncomingCallId(null);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };
  // -------------------------------------------------------------

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeSessionId || isSubmitting) return;
    
    setIsSubmitting(true);
    const textToSend = replyText;
    setReplyText("");
    
    try {
      const res = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSend,
          sender: 'ADMIN',
          sessionId: activeSessionId
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      setReplyText(textToSend);
      console.error("Failed to send reply", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSessionId) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', activeSessionId);

    try {
      const uploadRes = await fetch('/api/support-chat/upload', {
        method: 'POST',
        body: formData
      });
      if (!uploadRes.ok) throw new Error("Upload failed");
      
      const uploadData = await uploadRes.json();
      
      const res = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Odeslán soubor (Admin)',
          sender: 'ADMIN',
          sessionId: activeSessionId,
          attachmentUrl: uploadData.url,
          attachmentType: uploadData.type
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      console.error("Failed to upload file", error);
      alert("Nepodařilo se nahrát soubor.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const closeSession = async (sessionId: string) => {
    if (!confirm("OPRAVDU UZAVŘÍT CHAT A SMAZAT HISTORII ZPRÁV TÉTO KONVERZACE?")) return;
    try {
      await fetch('/api/support-chat', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CLOSE', sessionId })
      });
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      setMessages(prev => prev.filter(m => m.sessionId !== sessionId));
      if (activeSessionId === sessionId) setActiveSessionId(null);
    } catch (error) {
      console.error("Close failed:", error);
    }
  };

  const banSession = async (sessionId: string) => {
    if (!confirm("ZABANOVAT TUTO IP ADRESU? Uživateli se zablokuje chat.")) return;
    try {
      await fetch('/api/support-chat', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'BAN', sessionId })
      });
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'BANNED' } : s));
    } catch (error) {
      console.error("Ban failed:", error);
    }
  };

  const unbanSession = async (sessionId: string) => {
    if (!confirm("ODBLOKOVAT TUTO IP ADRESU? Uživatel bude moci znovu psát.")) return;
    try {
      await fetch('/api/support-chat', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UNBAN', sessionId })
      });
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'OPEN' } : s));
    } catch (error) {
      console.error("Unban failed:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full max-w-md bg-mafia-dark/80 border border-mafia-red/30 p-12 backdrop-blur-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-12">
            <Lock className="text-mafia-red mb-6" size={48} />
            <h1 className="text-3xl font-heading font-black text-white tracking-widest uppercase">SUPPORT_AUTH</h1>
            <p className="text-[10px] font-mono text-mafia-red/60 uppercase tracking-[0.4em] mt-2">RESTRICTED_ACCESS</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-8">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="ENTER CODE..." className="w-full bg-black/40 border border-mafia-red/20 px-6 py-4 text-center text-white font-mono tracking-widest focus:outline-none focus:border-mafia-red transition-all" autoFocus />
            <button className="w-full py-4 bg-mafia-red text-white font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all">AUTHORIZE</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const filteredSessions = sessions.filter(s => 
    s.userFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.ip.includes(searchQuery)
  ).sort((a, b) => b.lastActivity - a.lastActivity); // Sort by most recent activity

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const activeMessages = messages.filter(m => m.sessionId === activeSessionId).sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12 selection:bg-mafia-red selection:text-white flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 pb-8 border-b border-white/5 shrink-0">
           <div>
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="text-mafia-red" size={24} />
                 <h1 className="text-4xl font-heading font-black uppercase italic tracking-tighter">LIVE <span className="text-mafia-red">SUPPORT</span></h1>
              </div>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">KOMUNIKAČNÍ CENTRUM_V2.0</p>
           </div>
           
           <div className="flex flex-wrap gap-4">
              <Link href="/admin" className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                 <ArrowLeft size={16} /> ZPĚT NA DASHBOARD
              </Link>
           </div>
        </header>

        <main className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 overflow-hidden relative">
          
          {/* Incoming Call Banner Overlay (if ringing but not in active chat) */}
          {callStatus === 'RINGING' && incomingCallId && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-mafia-gold/90 text-black px-6 py-4 rounded-full shadow-[0_0_50px_rgba(199,156,61,0.5)] flex items-center gap-6 animate-bounce">
              <div className="flex items-center gap-3">
                <PhoneCall className="animate-pulse" />
                <span className="font-bold tracking-widest uppercase">Příchozí Hovor ze Suportu</span>
              </div>
              <div className="flex gap-2">
                <button onClick={acceptCall} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full font-bold uppercase text-xs">Přijmout</button>
                <button onClick={endCall} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full font-bold uppercase text-xs">Odmítnout</button>
              </div>
            </div>
          )}

          {/* LEFT PANE: SESSIONS LIST */}
          <div className="w-full md:w-1/3 lg:w-1/4 bg-black/40 backdrop-blur-xl border border-mafia-red/20 rounded-2xl flex flex-col overflow-hidden shrink-0 shadow-[0_0_30px_rgba(220,38,38,0.05)]">
             <div className="p-5 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
               <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Hledat uživatele (Jméno, IP)..."
                   className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-mafia-red focus:bg-white/5 transition-all placeholder:text-white/30"
                 />
               </div>
             </div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="flex justify-center p-8 opacity-30">
                     <RefreshCw size={20} className="animate-spin" />
                  </div>
                ) : filteredSessions.length === 0 ? (
                  <div className="p-8 text-center opacity-30">
                     <p className="text-xs font-mono uppercase">Žádné aktivní chaty</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {filteredSessions.map(session => {
                      const unreadCount = messages.filter(m => m.sessionId === session.id && m.sender === 'USER' && !m.read).length;
                      const isActive = activeSessionId === session.id;
                      
                      return (
                        <button
                          key={session.id}
                          onClick={() => setActiveSessionId(session.id)}
                          className={`w-full text-left p-5 transition-all hover:bg-white/[0.04] border-l-4 ${isActive ? 'bg-white/[0.06] border-mafia-red' : 'border-transparent'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                             <h4 className={`font-heading font-black uppercase tracking-wider text-sm truncate pr-2 ${isActive ? 'text-mafia-red' : 'text-white'}`}>
                               {session.userFullName}
                             </h4>
                             {unreadCount > 0 && (
                               <span className="bg-mafia-red text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                                 {unreadCount}
                               </span>
                             )}
                          </div>
                          <div className="flex justify-between items-center text-[11px] font-mono text-white/50">
                             <span className="truncate mr-2">{session.ip}</span>
                             <span className="shrink-0">{new Date(session.lastActivity).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          {session.status === 'BANNED' && (
                            <span className="inline-block mt-3 text-[10px] font-bold bg-red-900/40 text-red-400 px-3 py-1 rounded uppercase tracking-widest border border-red-500/30">Zablokováno</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
             </div>
          </div>

          {/* RIGHT PANE: ACTIVE CHAT */}
          <div className="flex-1 bg-black/60 backdrop-blur-2xl border border-mafia-red/20 rounded-2xl flex flex-col overflow-hidden relative shadow-[0_0_50px_rgba(220,38,38,0.05)]">
            {activeSession ? (
              <>
                {/* Chat Header */}
                <div className="p-5 md:p-6 border-b border-white/10 bg-gradient-to-r from-mafia-red/20 to-transparent flex justify-between items-center shrink-0">
                   <div>
                      <h2 className="text-xl font-heading font-black text-white uppercase italic tracking-tighter">
                        {activeSession.userFullName}
                      </h2>
                      <div className="flex gap-4 mt-1">
                        <p className="text-[10px] font-mono text-white/40">IP: {activeSession.ip}</p>
                        <p className="text-[10px] font-mono text-white/40 flex items-center gap-1">
                          <Clock size={10} /> {new Date(activeSession.startedAt).toLocaleString()}
                        </p>
                      </div>
                   </div>
                   
                   <div className="flex gap-3">
                      {activeSession.status === 'BANNED' ? (
                        <button 
                          onClick={() => unbanSession(activeSession.id)}
                          className="p-3.5 bg-black border border-white/10 rounded-xl hover:border-green-500 hover:text-green-500 hover:bg-green-500/10 transition-all text-white/50"
                          title="Odblokovat uživatele"
                        >
                           <ShieldCheck size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => banSession(activeSession.id)}
                          className="p-3.5 bg-black border border-white/10 rounded-xl hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all text-white/50"
                          title="Zablokovat uživatele"
                        >
                           <Ban size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => closeSession(activeSession.id)}
                        className="flex items-center gap-2 px-5 py-3.5 bg-white/5 rounded-xl border border-white/10 hover:bg-mafia-red hover:border-mafia-red hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest text-white/80 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                      >
                         <CheckCircle size={18} /> Vyřešit a smazat
                      </button>
                   </div>
                </div>

                {/* Active Call UI */}
                {callStatus === 'IN_CALL' && (incomingCallId === activeSession.id || activeSessionId === incomingCallId) && (
                  <div className="bg-mafia-gold/10 border-b border-mafia-gold/20 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-bold text-white uppercase tracking-widest">Hovor aktivní</span>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={toggleMute} className="p-3 bg-black/50 rounded-full hover:bg-white/10 text-white transition-all">
                        {isMuted ? <MicOff size={16} className="text-red-400" /> : <Mic size={16} />}
                      </button>
                      <button onClick={endCall} className="p-3 bg-red-600 rounded-full hover:bg-red-500 text-white shadow-lg transition-all">
                        <PhoneOff size={16} />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02),transparent_80%)] custom-scrollbar">
                   {activeMessages.map(msg => {
                     const isAdmin = msg.sender === 'ADMIN';
                     return (
                       <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-2 mb-1.5 px-2">
                             <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">
                               {isAdmin ? 'VY (Admin)' : activeSession.userFullName}
                             </span>
                             <span className="text-[10px] font-mono text-white/20">
                               {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </span>
                          </div>
                          <div className={`max-w-[85%] md:max-w-[70%] p-4 px-5 rounded-2xl text-[14px] leading-relaxed shadow-lg overflow-hidden ${isAdmin ? 'bg-mafia-red text-white rounded-br-sm font-medium' : 'bg-white/10 backdrop-blur-md border border-white/10 text-white/90 rounded-bl-sm'}`}>
                             {msg.attachmentUrl && msg.attachmentType === 'image' && (
                               <img src={msg.attachmentUrl} alt="Attachment" className="w-full h-auto max-h-64 object-cover rounded-lg mb-3 cursor-pointer" onClick={() => window.open(msg.attachmentUrl, '_blank')} />
                             )}
                             {msg.attachmentUrl && msg.attachmentType === 'video' && (
                               <video src={msg.attachmentUrl} controls className="w-full max-h-64 rounded-lg mb-3" />
                             )}
                             {msg.text}
                          </div>
                       </div>
                     );
                   })}
                   <div ref={messagesEndRef} />
                </div>
                
                {/* Chat Input */}
                <div className="p-4 md:p-6 bg-black/80 backdrop-blur-xl border-t border-white/10 shrink-0">
                  {activeSession.status === 'BANNED' ? (
                    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3 text-red-400 font-mono text-xs uppercase tracking-widest">
                         <AlertOctagon size={18} /> Tento uživatel byl trvale zablokován
                      </div>
                      <button 
                        onClick={() => unbanSession(activeSession.id)}
                        className="px-4 py-2 bg-red-500 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-red-600 transition-colors"
                      >
                        Odblokovat
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendReply} className="relative flex items-center gap-2 group">
                       <button 
                         type="button" 
                         onClick={() => fileInputRef.current?.click()}
                         className="shrink-0 p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-mafia-red transition-all text-white/50"
                         disabled={isUploading}
                       >
                         {isUploading ? <Loader2 size={18} className="animate-spin text-mafia-red" /> : <Paperclip size={18} />}
                       </button>
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         onChange={handleFileUpload} 
                         className="hidden" 
                         accept="image/*,video/*"
                       />
                       <EmojiPicker 
                          onSelect={(emoji) => setReplyText(prev => prev + emoji)}
                          direction="up"
                          isDark={true}
                          className="shrink-0"
                       />
                       <div className="relative flex-1">
                         <input 
                           type="text"
                           value={replyText}
                           onChange={(e) => setReplyText(e.target.value)}
                           disabled={isSubmitting}
                           placeholder="Napište odpověď jako Admin..."
                           className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-5 pr-16 text-[14px] text-white focus:outline-none focus:border-mafia-red focus:bg-white/10 transition-all disabled:opacity-50 placeholder:text-white/30"
                           autoFocus
                         />
                         <button 
                           type="submit"
                           disabled={isSubmitting || !replyText.trim()}
                           className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-mafia-red text-white rounded-full hover:bg-white hover:text-black hover:scale-105 transition-all disabled:opacity-0 disabled:scale-75 shadow-lg"
                         >
                           <Send size={16} className="ml-0.5" />
                         </button>
                       </div>
                    </form>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center p-8">
                 <MessageSquare size={64} className="mb-6 text-white/20" />
                 <h2 className="text-xl font-heading font-black uppercase tracking-widest mb-2">Vyberte konverzaci</h2>
                 <p className="font-mono text-[10px] uppercase text-white/50">Vyberte uživatele z levého panelu k zobrazení chatu.</p>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Hidden Audio element for remote stream */}
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
}
