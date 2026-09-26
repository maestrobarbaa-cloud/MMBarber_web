"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, ChevronDown, CheckCheck, Smile, Paperclip, Loader2, Phone, PhoneOff, Mic, MicOff, Copy, Check, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { EmojiPicker } from '@/components/EmojiPicker';
import { useUI } from '@/contexts/UIContext';

interface SupportMessage {
  id: string;
  sender: 'USER' | 'ADMIN';
  text: string;
  timestamp: number;
  read: boolean;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'video';
}

interface SupportSession {
  id: string;
  userFullName: string;
  status: string;
}

export default function SupportChatWidget() {
  const { lang } = useTranslation();
  const { isSupportChatOpen: isOpen, setIsSupportChatOpen: setIsOpen } = useUI();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [session, setSession] = useState<SupportSession | null>(null);
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [theme, setTheme] = useState<'gold' | 'blood' | 'noir'>('gold');

  
  // Forms state
  const [fullName, setFullName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // WebRTC Call State
  const [callStatus, setCallStatus] = useState<'IDLE' | 'CALLING' | 'RINGING' | 'IN_CALL'>('IDLE');
  const [isMuted, setIsMuted] = useState(false);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const callPollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const prevMessagesLengthRef = useRef(0);
  const initialFetchDoneRef = useRef(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/support-chat');
      if (res.status === 403) {
        setIsBanned(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setSession(data.session);
        
        if (!initialFetchDoneRef.current) {
          prevMessagesLengthRef.current = data.messages?.length || 0;
          initialFetchDoneRef.current = true;
        }
        
        setMessages(data.messages || []);
        setIsAdminOnline(data.isAdminOnline);
        if (data.session && !fullName) {
          setFullName(data.session.userFullName);
        }
      }
    } catch (error) {
      console.error("Failed to fetch support chat state", error);
    }
  };

  useEffect(() => {
    fetchState();
    
    const interval = setInterval(() => {
      fetchState();
    }, 5000);
    
    const checkTheme = () => {
      if (localStorage.getItem('mmbarber_blood_mode') === 'true') setTheme('blood');
      else if (localStorage.getItem('mmbarber_noir_mode') === 'true') setTheme('noir');
      else setTheme('gold');
    };
    checkTheme();
    window.addEventListener('mmbarber-theme-changed', checkTheme); // Volitelné
    
    const savedSounds = localStorage.getItem('mmbarber_chat_sounds');
    if (savedSounds !== null) {
      setSoundsEnabled(savedSounds === 'true');
    }
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('mmbarber-theme-changed', checkTheme);
    };
  }, []);

  // Play sound on new admin message
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      const newMessages = messages.slice(prevMessagesLengthRef.current);
      const hasNewAdminMessage = newMessages.some(m => m.sender === 'ADMIN');
      
      if (hasNewAdminMessage && soundsEnabled) {
        try {
          const audio = new Audio('/sounds/chat.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch (e) {}
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, soundsEnabled]);

  // -------------------------------------------------------------
  // WEBRTC CALLING LOGIC
  // -------------------------------------------------------------
  const setupPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = async (event) => {
      if (event.candidate && session) {
        await fetch('/api/support-chat/calls', {
          method: 'POST',
          body: JSON.stringify({
            action: 'CANDIDATE',
            sessionId: session.id,
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

  const startCall = async () => {
    if (!session) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      
      const pc = setupPeerConnection();
      pcRef.current = pc;
      
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      setCallStatus('CALLING');

      await fetch('/api/support-chat/calls', {
        method: 'POST',
        body: JSON.stringify({
          action: 'CALL',
          sessionId: session.id,
          offer: { type: offer.type, sdp: offer.sdp }
        })
      });
      
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert("Pro hovor musíte povolit mikrofon.");
      cleanupCall();
    }
  };

  const endCall = async () => {
    if (session) {
      await fetch('/api/support-chat/calls', {
        method: 'POST',
        body: JSON.stringify({ action: 'END', sessionId: session.id })
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

  useEffect(() => {
    if (!session || callStatus === 'IDLE') return;

    const pollCall = async () => {
      try {
        const res = await fetch(`/api/support-chat/calls?sessionId=${session.id}`);
        const data = await res.json();
        if (data.call) {
          const call = data.call;
          
          if (call.status === 'REJECTED' || call.status === 'ENDED') {
            cleanupCall();
            return;
          }

          if (call.status === 'ACCEPTED' && call.answer && pcRef.current) {
            if (pcRef.current.signalingState === 'have-local-offer') {
              await pcRef.current.setRemoteDescription(new RTCSessionDescription(call.answer));
              setCallStatus('IN_CALL');
            }
          }

          if (call.candidates && pcRef.current && pcRef.current.remoteDescription) {
            for (const cand of call.candidates) {
              try {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(cand));
              } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    callPollIntervalRef.current = setInterval(pollCall, 2000);
    return () => {
      if (callPollIntervalRef.current) clearInterval(callPollIntervalRef.current);
    };
  }, [session, callStatus]);

  // -------------------------------------------------------------
  
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      
      const unreadAdminMessageIds = messages
        .filter(m => m.sender === 'ADMIN' && !m.read)
        .map(m => m.id);
        
      if (unreadAdminMessageIds.length > 0 && session) {
        fetch('/api/support-chat', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'MARK_READ', messageIds: unreadAdminMessageIds })
        }).then(() => {
          setMessages(prev => prev.map(m => unreadAdminMessageIds.includes(m.id) ? { ...m, read: true } : m));
        }).catch(console.error);
      }
    }
  }, [messages, isOpen, session]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isSubmitting || isBanned) return;
    if (!session && !fullName.trim()) return;

    setIsSubmitting(true);
    
    // Play sound (if available) - standard HTML5 audio
    try {
       const audio = new Audio('/sounds/send.mp3');
       audio.volume = 0.5;
       audio.play().catch(() => {});
    } catch(e) {}

    try {
      const res = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSend,
          fullName: fullName.trim(),
          sender: 'USER',
          sessionId: session?.id
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
        if (!session) setSession(data.session);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      console.error("Failed to send message", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = messageText;
    setMessageText("");
    handleSend(text).catch(() => setMessageText(text));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session || isBanned) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', session.id);

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
          text: 'Odeslán soubor',
          fullName: fullName.trim(),
          sender: 'USER',
          sessionId: session.id,
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

  const hasUnreadFromAdmin = messages.some(m => m.sender === 'ADMIN' && !m.read);

  if (isBanned) return null; // Don't show anything to banned users

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.div 
        className="fixed bottom-6 right-6 z-[9990]"
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.5 }}
      >
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 group ${
            isOpen ? 'rotate-90 bg-white text-black' : 
            theme === 'blood' ? 'bg-gradient-to-tr from-red-600 to-red-900 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)]' :
            theme === 'noir' ? 'bg-gradient-to-tr from-gray-200 to-gray-500 text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)]' :
            'bg-gradient-to-tr from-mafia-gold to-[#c79c3d] text-black shadow-[0_0_30px_rgba(199,156,61,0.3)] hover:shadow-[0_0_50px_rgba(199,156,61,0.6)]'
          } ${!isOpen && hasUnreadFromAdmin ? (theme === 'blood' ? 'animate-pulse shadow-[0_0_40px_rgba(220,38,38,0.8)]' : theme === 'noir' ? 'animate-pulse shadow-[0_0_40px_rgba(255,255,255,0.8)]' : 'animate-pulse shadow-[0_0_40px_rgba(199,156,61,0.8)]') : ''}`}
        >
          {/* Background glow effect on hover */}
          <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 rounded-full"></div>
          
          <div className="relative z-10">
            {isOpen ? <ChevronDown size={28} /> : <MessageSquare size={28} />}
          </div>
          
          {/* Unread Indicator */}
          {!isOpen && hasUnreadFromAdmin && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white flex items-center justify-center rounded-full border-2 border-black font-bold text-[12px] animate-bounce shadow-[0_0_10px_rgba(220,38,38,0.8)]">!</span>
          )}
          
          {/* Online Indicator */}
          {!isOpen && !hasUnreadFromAdmin && isAdminOnline && (
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-black bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
          )}
        </button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-28 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[75vh] bg-black/90 backdrop-blur-2xl border border-mafia-gold/40 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.15)] flex flex-col overflow-hidden z-[9990]"
          >
            {/* Oživující prvek: Zlaté částice (Ambient Particles) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute bg-mafia-gold rounded-full"
                  initial={{
                    x: Math.random() * 380,
                    y: Math.random() * 600,
                    scale: Math.random() * 0.5 + 0.5,
                    opacity: Math.random() * 0.2 + 0.05
                  }}
                  animate={{
                    y: [null, Math.random() * -200 - 100],
                    x: [null, (Math.random() - 0.5) * 100],
                    opacity: [null, 0]
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    width: Math.random() * 3 + 1 + "px",
                    height: Math.random() * 3 + 1 + "px"
                  }}
                />
              ))}
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-black via-mafia-dark to-black border-b border-mafia-gold/30 p-4 flex justify-between items-center shrink-0 relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(199,156,61,0.15),transparent_60%)]" />
               
               <div className="flex items-center gap-4 relative z-10">
                 <div className="relative group">
                   <div className="absolute inset-0 bg-mafia-gold/30 rounded-full blur-md animate-pulse"></div>
                   <div className="w-10 h-10 rounded-full border-2 border-mafia-gold/50 flex items-center justify-center bg-black overflow-hidden shadow-[0_0_15px_rgba(199,156,61,0.3)] relative z-10">
                     <img src="/logo.png" alt="MMBARBER Logo" className="w-6 h-6 object-contain" />
                   </div>
                   {isAdminOnline && (
                     <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-black bg-green-500"></div>
                   )}
                 </div>
                 <div>
                   <h3 className="font-heading font-black text-white text-lg tracking-widest uppercase italic">MMBARBER SUPPORT</h3>
                   <p className="text-[10px] text-mafia-gold font-mono uppercase tracking-[0.2em] font-bold">
                     {isAdminOnline ? 'Online & Připraven' : 'Nyní jsme offline (Zanechte vzkaz)'}
                   </p>
                 </div>
               </div>
               <div className="flex items-center gap-2 z-10 relative">
                 <button 
                   onClick={() => {
                     const newVal = !soundsEnabled;
                     setSoundsEnabled(newVal);
                     localStorage.setItem('mmbarber_chat_sounds', String(newVal));
                   }} 
                   className="p-2 bg-black/40 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/5"
                   title={soundsEnabled ? "Vypnout zvuky" : "Zapnout zvuky"}
                 >
                   {soundsEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                 </button>
                 <button 
                   onClick={() => setIsOpen(false)} 
                   className="p-2 bg-black/40 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/5"
                 >
                   <X size={16} />
                 </button>
               </div>
            </div>

            {/* Call UI Banner */}
            <AnimatePresence>
              {callStatus !== 'IDLE' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-mafia-gold/20 border-b border-mafia-gold/30 px-4 py-3 flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${callStatus === 'IN_CALL' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500 animate-bounce'}`} />
                    <span className="text-xs font-bold text-white uppercase tracking-widest">
                      {callStatus === 'CALLING' ? 'Vytáčení...' : callStatus === 'IN_CALL' ? 'Probíhá hovor' : 'Hovor'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {callStatus === 'IN_CALL' && (
                      <button onClick={toggleMute} className="p-2 bg-black/40 rounded-full hover:bg-white/10 text-white">
                        {isMuted ? <MicOff size={14} className="text-red-400" /> : <Mic size={14} />}
                      </button>
                    )}
                    <button onClick={endCall} className="p-2 bg-red-600 rounded-full hover:bg-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                      <PhoneOff size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-2 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_80%)] custom-scrollbar relative z-10">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="w-20 h-20 bg-mafia-gold/5 rounded-full flex items-center justify-center mb-6 border border-mafia-gold/20"
                  >
                    <MessageSquare size={32} className="text-mafia-gold" />
                  </motion.div>
                  <h4 className="font-heading font-black uppercase tracking-widest text-white mb-2">Vítejte v podsvětí</h4>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 leading-relaxed mb-8">Jsme tu pro vás. Napište nám svůj dotaz, žádost nebo nahlaste problém a brzy se vám ozveme.</p>
                  
                  {session && (
                    <div className="flex flex-col gap-2.5 w-full mt-4">
                      {["Kolik stojí střih?", "Kde vás najdu?", "Chci zrušit rezervaci"].map((qr, i) => (
                        <button 
                          key={i}
                          onClick={() => handleSend(qr)}
                          disabled={isSubmitting}
                          className="py-2.5 px-4 rounded-full border border-mafia-gold/30 text-mafia-gold text-xs font-mono hover:bg-mafia-gold/10 transition-colors shadow-sm w-full text-left flex items-center justify-between group disabled:opacity-50"
                        >
                          <span>{qr}</span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isUser = msg.sender === 'USER';
                  const isNextSame = messages[idx + 1]?.sender === msg.sender;
                  const isPrevSame = messages[idx - 1]?.sender === msg.sender;
                  const showHeader = !isPrevSame;
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      key={msg.id} 
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} ${isNextSame ? 'mb-1' : 'mb-5'}`}
                    >
                       {showHeader && (
                         <span className="text-[9px] font-mono text-white/30 uppercase mb-1.5 px-2 tracking-widest">
                           {isUser ? 'Vy' : 'Podpora'} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </span>
                       )}
                       <div className="relative group max-w-[85%] flex items-center gap-2">
                           {isUser && (
                              <button 
                                onClick={() => navigator.clipboard.writeText(msg.text)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10 shrink-0"
                                title="Kopírovat"
                              >
                                <Copy size={12} />
                              </button>
                           )}

                           <div className={`p-3.5 px-4 text-[13px] leading-relaxed shadow-lg overflow-hidden flex flex-col gap-1 ${
                                isUser 
                                  ? `bg-mafia-gold text-black ${isNextSame ? 'rounded-2xl rounded-tr-sm rounded-br-sm' : 'rounded-2xl rounded-br-sm'} font-medium` 
                                  : `bg-white/10 backdrop-blur-md border border-white/10 text-white ${isNextSame ? 'rounded-2xl rounded-tl-sm rounded-bl-sm' : 'rounded-2xl rounded-bl-sm'}`
                           }`}>
                              {msg.attachmentUrl && msg.attachmentType === 'image' && (
                                <img src={msg.attachmentUrl} alt="Attachment" className="w-full h-auto max-h-48 object-cover rounded-lg mb-2 cursor-pointer" onClick={() => window.open(msg.attachmentUrl, '_blank')} />
                              )}
                              {msg.attachmentUrl && msg.attachmentType === 'video' && (
                                <video src={msg.attachmentUrl} controls className="w-full max-h-48 rounded-lg mb-2" />
                              )}
                              <span>{msg.text}</span>
                              
                              {isUser && (
                                <div className="self-end mt-0.5 flex items-center opacity-70">
                                  {msg.read ? <span title="Přečteno" className="flex items-center"><CheckCheck size={14} className="text-blue-800" /></span> : <span title="Odesláno" className="flex items-center"><Check size={14} /></span>}
                                </div>
                              )}
                           </div>

                           {!isUser && (
                              <button 
                                onClick={() => navigator.clipboard.writeText(msg.text)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10 shrink-0"
                                title="Kopírovat"
                              >
                                <Copy size={12} />
                              </button>
                           )}
                       </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 shrink-0 relative z-10">
               {!session && !fullName ? (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                   <p className="text-[9px] font-mono text-mafia-gold uppercase mb-2 tracking-widest pl-2">Pro začátek zadejte své jméno:</p>
                   <input 
                     type="text"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     placeholder="Např. John Doe"
                     className="w-full bg-white/5 border border-mafia-gold/30 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-mafia-gold focus:bg-white/10 transition-all placeholder:text-white/20"
                   />
                 </motion.div>
               ) : null}
               
               <form onSubmit={handleSubmit} className="relative flex items-center group gap-1">
                 {session && (
                   <div className="flex shrink-0">
                     <button 
                       type="button" 
                       onClick={() => fileInputRef.current?.click()}
                       className="p-2 text-white/50 hover:text-mafia-gold transition-colors relative"
                       disabled={isUploading}
                     >
                       {isUploading ? <Loader2 size={18} className="animate-spin text-mafia-gold" /> : <Paperclip size={18} />}
                     </button>
                     <button 
                       type="button" 
                       onClick={startCall}
                       disabled={callStatus !== 'IDLE'}
                       className="p-2 text-white/50 hover:text-mafia-gold transition-colors disabled:opacity-30"
                       title="Zavolat"
                     >
                       <Phone size={18} />
                     </button>
                   </div>
                 )}
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileUpload} 
                   className="hidden" 
                   accept="image/*,video/*"
                 />
                 <EmojiPicker 
                    onSelect={(emoji) => setMessageText(prev => prev + emoji)} 
                    direction="up" 
                    className="shrink-0"
                 />
                 <input 
                   type="text"
                   value={messageText}
                   onChange={(e) => setMessageText(e.target.value)}
                   disabled={isSubmitting || (!session && !fullName.trim())}
                   placeholder={(!session && !fullName.trim()) ? "Zadejte nejprve jméno..." : "Napište zprávu..."}
                   className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-5 pr-14 text-sm text-white focus:outline-none focus:border-mafia-gold focus:bg-white/10 transition-all disabled:opacity-50 placeholder:text-white/30"
                 />
                 <button 
                   type="submit"
                   disabled={isSubmitting || !messageText.trim() || (!session && !fullName.trim())}
                   className="absolute right-1.5 w-9 h-9 flex items-center justify-center bg-mafia-gold text-black rounded-full hover:bg-white hover:scale-105 transition-all disabled:opacity-0 disabled:scale-75 shadow-lg"
                 >
                   <Send size={14} className="ml-0.5" />
                 </button>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={remoteAudioRef} autoPlay />
    </>
  );
}
