"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, ChevronDown, CheckCheck, Smile, Paperclip, Loader2, Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
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
    
    // Polling jen pokud je chat otevřený, nebo pokud už existuje session, aby uživatel dostal upozornění
    const interval = setInterval(() => {
      fetchState();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------
  // WEBRTC CALLING LOGIC
  // -------------------------------------------------------------
  const setupPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = async (event) => {
      if (event.candidate && session) {
        // Send candidate to API
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

  // Poll for Call State
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

          // Apply remote candidates
          if (call.candidates && pcRef.current && pcRef.current.remoteDescription) {
            for (const cand of call.candidates) {
              try {
                // To avoid duplicate adding, you usually track added candidates, 
                // but RTCPeerConnection usually ignores duplicates gracefully or we can catch the error.
                await pcRef.current.addIceCandidate(new RTCIceCandidate(cand));
              } catch (e) {
                // Ignore duplicates
              }
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
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || isSubmitting || isBanned) return;
    
    // Validate name if no session
    if (!session && !fullName.trim()) return;

    setIsSubmitting(true);
    const textToSend = messageText;
    setMessageText(""); // Optimistic clear

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
      setMessageText(textToSend); // Restore on error
    } finally {
      setIsSubmitting(false);
    }
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
      
      // Send message with attachment
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
          className={`w-16 h-16 rounded-full bg-gradient-to-tr from-mafia-gold to-[#c79c3d] text-black flex items-center justify-center shadow-[0_0_30px_rgba(199,156,61,0.3)] hover:shadow-[0_0_50px_rgba(199,156,61,0.6)] transition-all duration-500 hover:scale-110 group ${isOpen ? 'rotate-90 bg-white text-black' : ''} ${!isOpen && hasUnreadFromAdmin ? 'animate-pulse shadow-[0_0_40px_rgba(199,156,61,0.8)]' : ''}`}
        >
          {/* Background glow effect on hover */}
          <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 rounded-full"></div>
          
          <div className="relative z-10">
            {isOpen ? <ChevronDown size={28} /> : <MessageSquare size={28} />}
          </div>
          
          {/* Unread Indicator */}
          {!isOpen && hasUnreadFromAdmin && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-black animate-pulse"></span>
          )}
          
          {/* Online Indicator */}
          {!isOpen && isAdminOnline && !hasUnreadFromAdmin && (
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
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
            {/* Header */}
            <div className="bg-gradient-to-r from-black via-mafia-dark to-black border-b border-mafia-gold/30 p-4 flex justify-between items-center shrink-0 relative overflow-hidden">
               {/* Background decorative accent */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(199,156,61,0.15),transparent_60%)]" />
               
               <div className="flex items-center gap-4 relative z-10">
                 <div className="relative group">
                   <div className="w-10 h-10 rounded-full border-2 border-mafia-gold/50 flex items-center justify-center bg-black overflow-hidden shadow-[0_0_15px_rgba(199,156,61,0.3)]">
                     <img src="/logo.png" alt="MMBARBER Logo" className="w-6 h-6 object-contain" />
                   </div>
                   {isAdminOnline && (
                     <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black"></div>
                   )}
                 </div>
                 <div>
                   <h3 className="font-heading font-black text-white text-lg tracking-widest uppercase italic">MMBARBER SUPPORT</h3>
                   <p className="text-[10px] text-mafia-gold font-mono uppercase tracking-[0.2em] font-bold">
                     {isAdminOnline ? 'Online & Připraven' : 'Zanechte nám vzkaz'}
                   </p>
                 </div>
               </div>
               <button 
                 onClick={() => setIsOpen(false)} 
                 className="p-2 bg-black/40 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/5 relative z-10"
               >
                 <X size={16} />
               </button>
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
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_80%)] custom-scrollbar">
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
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 leading-relaxed">Jsme tu pro vás. Napište nám svůj dotaz, žádost nebo nahlaste problém a brzy se vám ozveme.</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isUser = msg.sender === 'USER';
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      key={msg.id} 
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                       <span className="text-[9px] font-mono text-white/30 uppercase mb-1.5 px-2 tracking-widest">
                         {isUser ? 'Vy' : 'Podpora'} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </span>
                       <div className={`max-w-[85%] p-3.5 px-4 text-[13px] leading-relaxed shadow-lg overflow-hidden ${isUser ? 'bg-mafia-gold text-black rounded-2xl rounded-br-sm font-medium' : 'bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl rounded-bl-sm'}`}>
                          {msg.attachmentUrl && msg.attachmentType === 'image' && (
                            <img src={msg.attachmentUrl} alt="Attachment" className="w-full h-auto max-h-48 object-cover rounded-lg mb-2 cursor-pointer" onClick={() => window.open(msg.attachmentUrl, '_blank')} />
                          )}
                          {msg.attachmentUrl && msg.attachmentType === 'video' && (
                            <video src={msg.attachmentUrl} controls className="w-full max-h-48 rounded-lg mb-2" />
                          )}
                          {msg.text}
                       </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 shrink-0">
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

      {/* Hidden Audio element for remote stream */}
      <audio ref={remoteAudioRef} autoPlay />
    </>
  );
}
