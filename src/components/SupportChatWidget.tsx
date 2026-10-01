"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, ChevronDown, CheckCheck, Smile, Paperclip, Loader2, Phone, PhoneOff, Mic, MicOff, Copy, Check, Volume2, VolumeX, Maximize2, Minimize2, Download, Settings } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { EmojiPicker } from '@/components/EmojiPicker';
import { useUI } from '@/contexts/UIContext';
import { getDaimonResponse, getDaimonName, isAprilFools, resetDaimonMemory } from '@/lib/daimonBot';

interface SupportMessage {
  id: string;
  sender: 'USER' | 'ADMIN';
  text: string;
  timestamp: number;
  read: boolean;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'video' | 'audio';
  fullName?: string;
  isBot?: boolean;
  silent?: boolean;
  suggestedActions?: string[];
}

interface SupportSession {
  id: string;
  userFullName: string;
  status: string;
}

const isOnlyEmojis = (str: string) => {
  if (!str || str.trim().length === 0) return false;
  // Regex pro detekci samotných smajlíků
  const emojiRegex = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{200D}\u{FE0F}\s]+$/u;
  return emojiRegex.test(str);
};

export default function SupportChatWidget() {
  const { lang } = useTranslation();
  
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Zavřít chat, pokud je na mobilu, aby uživatel viděl kam scroluje?
      // Nebo jen plynule scrollovat.
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderTextWithLinks = (text: string) => {
    // Hledáme URLs a chytrá klíčová slova pro interakci
    const regex = /(https?:\/\/[^\s]+|Kontakt[u]?|Služb[yách]|Ceník[u]?|rezervační systém|rezervac[eíích]|map[auy]|Mařaticích|Instagram[u]?|Facebook[u]?|nejbližší spojení)/gi;
    
    return text.split(regex).map((part, i) => {
      if (!part) return null;
      
      if (part.match(/^https?:\/\/[^\s]+$/)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-blue-300 hover:text-white transition-colors">{part}</a>;
      }
      
      const lowerPart = part.toLowerCase();
      let sectionId = '';
      
      if (lowerPart.includes('kontakt') || lowerPart.includes('map') || lowerPart.includes('mařatic')) sectionId = 'kontakt';
      if (lowerPart.includes('služb') || lowerPart.includes('ceník')) sectionId = 'services';
      
      if (sectionId) {
        return (
          <button 
            key={i} 
            onClick={() => handleScrollTo(sectionId)}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded bg-black/30 hover:bg-mafia-gold/20 text-mafia-gold transition-all border border-mafia-gold/30 cursor-pointer shadow-sm active:scale-95"
            title={`Přejít na sekci ${sectionId}`}
          >
            {part} 📍
          </button>
        );
      }

      if (lowerPart.includes('spojení')) {
        return (
          <a 
            key={i} 
            href="https://idos.idnes.cz/vlakyautobusymhdvse/spojeni/?t=Uherské+Hradiště,,Východ+Rudy+Kubíčka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded bg-black/30 hover:bg-mafia-gold/20 text-mafia-gold transition-all border border-mafia-gold/30 cursor-pointer shadow-sm active:scale-95"
          >
            {part} 🚌
          </a>
        );
      }

      if (lowerPart.includes('rezervac')) {
        return (
          <a 
            key={i} 
            href="https://mm.inthechair.com/micka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded bg-black/30 hover:bg-mafia-gold/20 text-mafia-gold transition-all border border-mafia-gold/30 cursor-pointer shadow-sm active:scale-95"
          >
            {part} ✂️
          </a>
        );
      }
      
      if (lowerPart.includes('instagram')) {
        return (
          <a 
            key={i} 
            href="https://www.instagram.com/tomas_micka/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded bg-black/30 hover:bg-mafia-gold/20 text-mafia-gold transition-all border border-mafia-gold/30 cursor-pointer shadow-sm active:scale-95"
          >
            {part} 📸
          </a>
        );
      }

      return <span key={i}>{part}</span>;
    });
  };

  const { isSupportChatOpen: isOpen, setIsSupportChatOpen: setIsOpen } = useUI();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [session, setSession] = useState<SupportSession | null>(null);
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [theme, setTheme] = useState<'gold' | 'blood' | 'noir' | 'neon' | 'ocean' | 'forest'>('gold');
  const [chatBg, setChatBg] = useState<'particles' | 'grid' | 'clean' | 'ultra' | 'matrix'>('particles');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'appearance' | 'chat' | 'privacy'>('appearance');

  // User experience preferences
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [compactMode, setCompactMode] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [aiTypingSpeed, setAiTypingSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [bubbleStyle, setBubbleStyle] = useState<'rounded' | 'sharp' | 'mixed'>('mixed');
  const [liveTime, setLiveTime] = useState('');
  const [serverTime, setServerTime] = useState('');
  const [timeDiffHours, setTimeDiffHours] = useState(0);

  
  // Forms state
  const [fullName, setFullName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Chat Mode State
  const [chatMode, setChatMode] = useState<'bot' | 'human'>('bot');
  const [initialModeSet, setInitialModeSet] = useState(false);

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

  const [isBotTyping, setIsBotTyping] = useState(false);
  const [hasIdleAlert, setHasIdleAlert] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    idleTimerRef.current = setTimeout(() => {
      if (!isOpen) {
        setHasIdleAlert(true);
      }
    }, 45000);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isOpen]);

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen) {
      if (hasIdleAlert) {
        setHasIdleAlert(false);
        setChatMode('bot');
        setTimeout(() => {
          const cheekyPhrases = [
            "Co tu vokouníš? Potřebuješ něco?",
            "Nečuč jak chleba z tašky a něco dělej. Zarezervuj si termín.",
            "Koukáš na to jak z jara. Potřebuješ poradit se střihem?",
            "Haló, je tam někdo? Čumíš na to už pěkně dlouho."
          ];
          const phrase = cheekyPhrases[Math.floor(Math.random() * cheekyPhrases.length)];
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: `[BOT] ${phrase}`,
            sender: 'ADMIN',
            timestamp: Date.now(),
            read: true,
            fullName: getDaimonName()
          }]);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
          
          const currentLen = prevMessagesLengthRef.current + 1;
          closeTimerRef.current = setTimeout(() => {
            if (prevMessagesLengthRef.current <= currentLen) {
               setIsOpen(false);
               setMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  text: `[BOT] Asi nemáš slov. Zavírám. Čus.`,
                  sender: 'ADMIN',
                  timestamp: Date.now(),
                  read: true,
                  fullName: getDaimonName()
               }]);
            }
          }, 15000);
        }, 500);
      }
    } else {
       if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    }
  };

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
        
        setInitialModeSet(prev => {
          if (!prev) {
            setChatMode(data.isAdminOnline ? 'human' : 'bot');
            return true;
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Failed to fetch support chat state", error);
    }
  };

  // Live HUD clock (Local vs Server)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      // Local time
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setLiveTime(`${hh}:${mm}:${ss}`);

      // Server time (Europe/Prague)
      const pragueTimeStr = now.toLocaleString("en-US", { timeZone: "Europe/Prague" });
      const pragueDate = new Date(pragueTimeStr);
      const phh = String(pragueDate.getHours()).padStart(2, '0');
      const pmm = String(pragueDate.getMinutes()).padStart(2, '0');
      const pss = String(pragueDate.getSeconds()).padStart(2, '0');
      setServerTime(`${phh}:${pmm}:${pss}`);

      // Calculate difference in hours
      let diff = now.getHours() - pragueDate.getHours();
      // Adjust for day change
      if (diff > 12) diff -= 24;
      if (diff < -12) diff += 24;
      setTimeDiffHours(diff);
    };
    tick();
    const clockInterval = setInterval(tick, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    fetchState();
    
    const interval = setInterval(() => {
      fetchState();
    }, 5000);
    
    const checkTheme = () => {
      const savedTheme = localStorage.getItem('mmbarber_chat_theme');
      if (savedTheme) setTheme(savedTheme as any);
      else if (localStorage.getItem('mmbarber_blood_mode') === 'true') setTheme('blood');
      else if (localStorage.getItem('mmbarber_noir_mode') === 'true') setTheme('noir');
      else setTheme('gold');
      
      const savedBg = localStorage.getItem('mmbarber_chat_bg');
      if (savedBg) setChatBg(savedBg as any);

      const savedFont = localStorage.getItem('mmbarber_chat_font');
      if (savedFont) setFontSize(savedFont as any);
      const savedCompact = localStorage.getItem('mmbarber_chat_compact');
      if (savedCompact) setCompactMode(savedCompact === 'true');
      const savedTimestamps = localStorage.getItem('mmbarber_chat_timestamps');
      if (savedTimestamps !== null) setShowTimestamps(savedTimestamps === 'true');
      const savedSpeed = localStorage.getItem('mmbarber_chat_ai_speed');
      if (savedSpeed) setAiTypingSpeed(savedSpeed as any);
      const savedBubble = localStorage.getItem('mmbarber_chat_bubble');
      if (savedBubble) setBubbleStyle(savedBubble as any);
    };
    checkTheme();
    window.addEventListener('mmbarber-theme-changed', checkTheme);

    
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
      const hasNewAdminMessage = newMessages.some(m => 
        m.sender === 'ADMIN' && 
        !m.silent && 
        !m.text.startsWith('[BOT] ') && 
        !m.text.startsWith('[SYSTEM] ')
      );
      
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

  const clearChat = async () => {
    if (!session) return;
    if (window.confirm('Opravdu chcete nevratně smazat celou historii chatu?')) {
      try {
        await fetch('/api/support-chat', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'CLOSE', sessionId: session.id })
        });
        setMessages([]);
        setSession(null);
        setIsSettingsOpen(false);
        resetDaimonMemory(); // Reset bot conversation memory
      } catch (err) {
        console.error(err);
      }
    }
  };

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

  const switchMode = (newMode: 'bot' | 'human') => {
    if (chatMode === newMode) return;
    setChatMode(newMode);
    
    const sysMsgId = Date.now().toString() + Math.random();
    if (newMode === 'human') {
      setMessages(prev => [...prev, {
        id: sysMsgId,
        sender: 'ADMIN',
        text: '[SYSTEM] Přepnuli jste na živou podporu. Jakmile bude operátor dostupný, odpoví vám. Děkujeme za trpělivost.',
        timestamp: Date.now(),
        read: true,
        silent: true
      } as any]);
    } else {
      const introPhrases = [
        "Vítejí u nás. Já jsem Daimon, pokorný sluha tohoto podniku a především samotného velkého Dona Tomáše. Ráčíte si přát poradit se střihem, nebo hledáte cestu k Jeho křeslu?",
        "Buďte zdráv. Mé jméno je Daimon. Sloužím jako strážce tohoto digitálního prahu pro Jeho Excelenci, mistra Tomáše. Co pro vás mohu v tento moment udělat?",
        "Poklona. Jsem Daimon, dvorní rádce MMBarberu a poslušný stín velkého šéfa, Dona Tomáše. Copak byste od nás ráčili potřebovat?",
        "Přistupte blíž, ale s úctou. Já jsem Daimon, věrný služebník samotného zakladatele a mistra tohoto domu, velkého Dona Tomáše. Vaše přání?"
      ];
      const selectedIntro = introPhrases[Math.floor(Math.random() * introPhrases.length)];

      setMessages(prev => [...prev, {
        id: sysMsgId,
        sender: 'ADMIN',
        text: `[BOT] ${selectedIntro}`,
        timestamp: Date.now(),
        read: true,
        fullName: getDaimonName(),
        silent: true
      } as any]);
    }
    
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleBotResponse = async (userText: string, sessionId: string) => {
    const { text: botReply, isVulgar, isInsultingTomas, suggestedActions } = getDaimonResponse(userText, parseInt(localStorage.getItem('daimon_strikes') || '0'), lang);

    setIsBotTyping(true);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    
    // Simulate typing delay: 15ms per character, between 600ms and 2500ms
    const delay = Math.min(Math.max(botReply.length * 15, 600), 2500);
    
    setTimeout(async () => {
      setIsBotTyping(false);
      try {
        const res = await fetch('/api/support-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `[BOT] ${botReply}`,
            fullName: getDaimonName(),
            sender: 'ADMIN',
            sessionId: sessionId
          })
        });
        if (res.ok) {
          const data = await res.json();
          const newMessage = data.message;
          if (suggestedActions && suggestedActions.length > 0) {
            newMessage.suggestedActions = suggestedActions;
          }
          setMessages(prev => [...prev, newMessage]);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);

          if (isInsultingTomas) {
            setTimeout(async () => {
                let userIp = "Neznámá IP";
                try {
                  const ipRes = await fetch('https://api.ipify.org?format=json');
                  const ipData = await ipRes.json();
                  userIp = ipData.ip;
                } catch(e) {}

                // Secretly log to DB for admin, but don't show in UI
                await fetch('/api/support-chat', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    text: `[TAJNÁ ZPRÁVA PRO ADMINA] Tento uživatel právě urážel Dona Tomáše. Jeho zachycená IP adresa je: ${userIp}`,
                    fullName: 'Daimon-Bezpečnost',
                    sender: 'ADMIN',
                    sessionId: sessionId
                  })
                });

                // Public warning message
                const sysRes = await fetch('/api/support-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      text: `[SYSTÉMOVÉ UPOZORNĚNÍ] Zpráva byla zaznamenána. Administrátor byl upozorněn na nevhodné chování vůči personálu. Vaše připojení bylo monitorováno.`,
                      fullName: 'Systém',
                      sender: 'ADMIN',
                      sessionId: sessionId
                    })
                  });
                  if (sysRes.ok) {
                    const sysData = await sysRes.json();
                    setMessages(prev => [...prev, sysData.message]);
                    setTimeout(() => {
                      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }
            }, 3000);
        }

        if (isVulgar && !isInsultingTomas) {
          const currentStrikes = parseInt(localStorage.getItem('daimon_strikes') || '0');
          const newStrikes = currentStrikes + 1;
          localStorage.setItem('daimon_strikes', newStrikes.toString());
          
          if (newStrikes >= 3) {
            // Drop the hammer on the 3rd strike
            setTimeout(async () => {
               const finalRes = await fetch('/api/support-chat', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                   text: `[BOT] Tohle byla tvoje poslední kapka. Ať už sem ten tvůj prašivý skunk nikdy neleze. Vyhazuju tě za 3... 2... 1...`,
                   fullName: getDaimonName(),
                   sender: 'ADMIN',
                   sessionId: sessionId
                 })
               });
               
               if (finalRes.ok) {
                 const finalData = await finalRes.json();
                 setMessages(prev => [...prev, finalData.message]);
                 setTimeout(() => {
                   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                 }, 100);
                 
                 // Wait 4 seconds, then ban and kick
                 setTimeout(async () => {
                   await fetch('/api/support-chat', {
                     method: 'PUT',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ action: 'BAN', sessionId: sessionId })
                   });
                   window.location.href = "https://www.google.com/search?q=jak+se+chovat+slusne";
                 }, 4000);
               }
            }, 3000);
          }
        }
      }
    } catch (e) {
      console.error("Bot reply failed", e);
    }
  }, delay);
};

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

        if (chatMode === 'bot') {
            setTimeout(() => {
                handleBotResponse(textToSend, data.session?.id || session?.id);
            }, 1000);
        }
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

  const exportChat = () => {
    const textContent = messages.map(m => {
      const date = new Date(m.timestamp).toLocaleString('cs-CZ');
      const isBot = m.text.startsWith('[BOT]');
      const isSystem = m.text.startsWith('[SYSTEM]');
      const senderName = m.sender === 'USER' ? 'Zákazník' : (isBot ? getDaimonName() : (isSystem ? 'Systém' : 'Operátor'));
      const text = m.text.replace(/\[SYSTEM\] |\[BOT\] /g, '');
      return `[${date}] ${senderName}: ${text}`;
    }).join('\n\n');
    
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mmbarber_chat_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDateSeparator = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Dnes';
    if (date.toDateString() === yesterday.toDateString()) return 'Včera';
    return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  };

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
          onClick={toggleChat}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 group ${
            isOpen ? 'rotate-90 bg-white text-black' : 
            theme === 'blood' ? 'bg-gradient-to-tr from-red-600 to-red-900 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)]' :
            theme === 'noir' ? 'bg-gradient-to-tr from-gray-200 to-gray-500 text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)]' :
            theme === 'neon' ? 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]' :
            theme === 'ocean' ? 'bg-gradient-to-tr from-blue-500 to-cyan-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)]' :
            theme === 'forest' ? 'bg-gradient-to-tr from-emerald-600 to-green-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)]' :
            'bg-gradient-to-tr from-mafia-gold to-[#c79c3d] text-black shadow-[0_0_30px_rgba(199,156,61,0.3)] hover:shadow-[0_0_50px_rgba(199,156,61,0.6)]'
          } ${!isOpen && (hasUnreadFromAdmin || hasIdleAlert) ? (theme === 'blood' ? 'animate-pulse shadow-[0_0_40px_rgba(220,38,38,0.8)]' : theme === 'noir' ? 'animate-pulse shadow-[0_0_40px_rgba(255,255,255,0.8)]' : theme === 'neon' ? 'animate-pulse shadow-[0_0_40px_rgba(168,85,247,0.8)]' : theme === 'ocean' ? 'animate-pulse shadow-[0_0_40px_rgba(59,130,246,0.8)]' : theme === 'forest' ? 'animate-pulse shadow-[0_0_40px_rgba(16,185,129,0.8)]' : 'animate-pulse shadow-[0_0_40px_rgba(199,156,61,0.8)]') : ''}`}
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

          {/* Idle Alert Indicator (Large Exclamation Mark) */}
          {!isOpen && hasIdleAlert && !hasUnreadFromAdmin && (
            <span className="absolute -top-3 -right-3 w-8 h-8 bg-mafia-gold text-black flex items-center justify-center rounded-full border-2 border-black font-black text-[18px] animate-[bounce_1s_infinite] shadow-[0_0_15px_rgba(199,156,61,0.9)]">!</span>
          )}
          
          {/* Online Indicator */}
          {!isOpen && !hasUnreadFromAdmin && !hasIdleAlert && isAdminOnline && (
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
            className={`fixed bottom-28 right-6 max-w-[calc(100vw-3rem)] bg-black/90 backdrop-blur-2xl border rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden z-[9990] transition-all duration-300 ease-in-out w-[440px] h-[680px] max-h-[82vh] ${isExpanded ? 'md:w-[900px] md:h-[820px] md:max-h-[90vh]' : ''} ${
              theme === 'blood' ? 'border-red-600/40 shadow-[0_0_30px_rgba(220,38,38,0.15)]' :
              theme === 'noir' ? 'border-gray-500/40 shadow-[0_0_30px_rgba(255,255,255,0.1)]' :
              theme === 'neon' ? 'border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.15)]' :
              theme === 'ocean' ? 'border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.15)]' :
              theme === 'forest' ? 'border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]' :
              'border-mafia-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.15)]'
            }`}
          >
            {/* Oživující prvek: Zlaté částice (Ambient Particles) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              {chatBg === 'grid' && (
                <div className={`absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:20px_20px] ${
                  theme === 'blood' ? '[--grid-color:rgba(220,38,38,0.15)]' :
                  theme === 'noir' ? '[--grid-color:rgba(255,255,255,0.08)]' :
                  theme === 'neon' ? '[--grid-color:rgba(168,85,247,0.15)]' :
                  theme === 'ocean' ? '[--grid-color:rgba(59,130,246,0.15)]' :
                  theme === 'forest' ? '[--grid-color:rgba(16,185,129,0.15)]' :
                  '[--grid-color:rgba(212,175,55,0.15)]'
                }`} />
              )}
              {chatBg === 'matrix' && (
                <div className="absolute inset-0 overflow-hidden opacity-30 flex gap-4 p-2 justify-between pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={`matrix-${i}`}
                      initial={{ y: -100, opacity: 0 }}
                      animate={{ y: 800, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, ease: 'linear', delay: Math.random() * 5 }}
                      className={`w-px h-24 ${
                        theme === 'blood' ? 'bg-gradient-to-b from-transparent to-red-500' :
                        theme === 'noir' ? 'bg-gradient-to-b from-transparent to-gray-400' :
                        theme === 'neon' ? 'bg-gradient-to-b from-transparent to-purple-500' :
                        theme === 'ocean' ? 'bg-gradient-to-b from-transparent to-cyan-400' :
                        theme === 'forest' ? 'bg-gradient-to-b from-transparent to-green-500' :
                        'bg-gradient-to-b from-transparent to-mafia-gold'
                      }`}
                    />
                  ))}
                </div>
              )}
              {chatBg === 'ultra' && (
                <>
                  <motion.div 
                    animate={{ x: [0, 100, -100, 0], y: [0, 50, -50, 0], scale: [1, 1.5, 1] }} 
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className={`absolute w-72 h-72 rounded-full blur-[90px] opacity-20 top-0 left-0 ${
                      theme === 'blood' ? 'bg-red-600' : theme === 'noir' ? 'bg-white' : theme === 'neon' ? 'bg-purple-500' : theme === 'ocean' ? 'bg-blue-500' : theme === 'forest' ? 'bg-emerald-500' : 'bg-mafia-gold'
                    }`}
                  />
                  <motion.div 
                    animate={{ x: [0, -100, 100, 0], y: [0, -50, 50, 0], scale: [1.5, 1, 1.5] }} 
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className={`absolute w-72 h-72 rounded-full blur-[90px] opacity-20 bottom-0 right-0 ${
                      theme === 'blood' ? 'bg-orange-500' : theme === 'noir' ? 'bg-gray-400' : theme === 'neon' ? 'bg-pink-500' : theme === 'ocean' ? 'bg-cyan-400' : theme === 'forest' ? 'bg-green-400' : 'bg-yellow-500'
                    }`}
                  />
                </>
              )}
              {chatBg === 'particles' && Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className={`absolute rounded-full ${
                    theme === 'blood' ? 'bg-red-500' : theme === 'noir' ? 'bg-gray-400' : theme === 'neon' ? 'bg-purple-400' : theme === 'ocean' ? 'bg-blue-400' : theme === 'forest' ? 'bg-emerald-400' : 'bg-mafia-gold'
                  }`}
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
            <div className={`border-b p-4 flex justify-between items-center shrink-0 relative ${
              theme === 'blood' ? 'bg-gradient-to-r from-black via-red-950 to-black border-red-600/30' :
              theme === 'noir' ? 'bg-gradient-to-r from-black via-gray-900 to-black border-gray-600/30' :
              theme === 'neon' ? 'bg-gradient-to-r from-black via-purple-950 to-black border-purple-500/30' :
              theme === 'ocean' ? 'bg-gradient-to-r from-black via-blue-950 to-black border-blue-500/30' :
              theme === 'forest' ? 'bg-gradient-to-r from-black via-emerald-950 to-black border-emerald-500/30' :
              'bg-gradient-to-r from-black via-mafia-dark to-black border-mafia-gold/30'
            }`}>
               <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops),transparent_60%)] ${
                 theme === 'blood' ? 'from-red-600/15' : theme === 'noir' ? 'from-white/10' : theme === 'neon' ? 'from-purple-500/20' : theme === 'ocean' ? 'from-blue-500/20' : theme === 'forest' ? 'from-emerald-500/20' : 'from-mafia-gold/15'
               }`} />
               
               <div className="flex items-center gap-4 relative z-10">
                 <div className="relative group">
                   <div className={`absolute inset-0 rounded-full blur-md animate-pulse ${
                     theme === 'blood' ? 'bg-red-600/30' : theme === 'noir' ? 'bg-white/20' : theme === 'neon' ? 'bg-purple-500/30' : theme === 'ocean' ? 'bg-blue-500/30' : theme === 'forest' ? 'bg-emerald-500/30' : 'bg-mafia-gold/30'
                   }`}></div>
                   <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-black overflow-hidden relative z-10 ${
                     theme === 'blood' ? 'border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]' :
                     theme === 'noir' ? 'border-gray-500/50 shadow-[0_0_15px_rgba(255,255,255,0.2)]' :
                     theme === 'neon' ? 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' :
                     theme === 'ocean' ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' :
                     theme === 'forest' ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                     'border-mafia-gold/50 shadow-[0_0_15px_rgba(199,156,61,0.3)]'
                   }`}>
                     <img src="/logo.png" alt="MMBARBER Logo" className="w-6 h-6 object-contain" />
                   </div>
                   {isAdminOnline && (
                     <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-black bg-green-500"></div>
                   )}
                 </div>
                 <div>
                   <h3 className="font-heading font-black text-white text-lg tracking-widest uppercase italic">
                     {chatMode === 'bot' ? 'DAIMON' : 'MMBARBER SUPPORT'}
                   </h3>
                   <p className={`text-[10px] font-mono uppercase tracking-[0.2em] font-bold ${
                     theme === 'blood' ? 'text-red-400' : theme === 'noir' ? 'text-gray-400' : theme === 'neon' ? 'text-purple-400' : theme === 'ocean' ? 'text-blue-400' : theme === 'forest' ? 'text-emerald-400' : 'text-mafia-gold'
                   }`}>
                     {chatMode === 'human' ? (isAdminOnline ? 'Online & Připraven' : 'Nyní jsme offline (Zanechte vzkaz)') : 'Virtuální asistent'}
                   </p>
                 </div>
                 {/* Live HUD Clocks (Local & Server) */}
                 {timeDiffHours !== 0 && (
                   <div className="hidden sm:flex flex-col gap-1 ml-auto mr-2 relative group cursor-help z-50">
                     <div className="flex items-center gap-2 justify-end">
                       <span className="text-[7px] font-mono text-white/30 uppercase tracking-[0.3em]">LOCAL</span>
                       <span className={`font-mono text-[10px] font-bold tracking-[0.1em] tabular-nums ${
                         theme === 'blood' ? 'text-red-400' : theme === 'neon' ? 'text-purple-400' : theme === 'ocean' ? 'text-cyan-400' : theme === 'forest' ? 'text-emerald-400' : 'text-mafia-gold'
                       }`}>{liveTime}</span>
                     </div>
                     <div className="flex items-center gap-2 justify-end">
                       <span className="text-[7px] font-mono text-white/30 uppercase tracking-[0.3em]">SERVER</span>
                       <span className="font-mono text-[10px] text-white/70 tabular-nums">{serverTime}</span>
                     </div>
                     
                     {/* Tooltip for time difference */}
                     <div className="absolute top-full right-0 mt-2 p-3 bg-black/95 border border-white/10 rounded-xl backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-2xl">
                       <p className="text-xs font-mono text-white/80 font-bold mb-1">
                         Rozdíl: <span className={timeDiffHours === 0 ? 'text-green-400' : 'text-mafia-gold'}>
                           {timeDiffHours > 0 ? `+${timeDiffHours} hodin` : timeDiffHours < 0 ? `${timeDiffHours} hodin` : 'Stejný čas'}
                         </span>
                       </p>
                       <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Server v CZ vs Váš lokální čas</p>
                     </div>
                   </div>
                 )}
               </div>
               <div className="flex items-center gap-2 z-10 relative">
                 {chatMode === 'human' && callStatus === 'IDLE' && (
                   <button 
                     onClick={startCall}
                     className="p-2 bg-black/40 hover:bg-green-600 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/5"
                     title="Zavolat (Hlasový hovor)"
                   >
                     <Phone size={14} />
                   </button>
                 )}
                 <button 
                   onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                   className={`p-2 bg-black/40 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/5 ${isSettingsOpen ? 'bg-white/20' : ''}`}
                   title="Nastavení chatu"
                 >
                   <Settings size={14} />
                 </button>
                 <button 
                   onClick={exportChat}
                   className="hidden md:block p-2 bg-black/40 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/5"
                   title="Stáhnout historii chatu"
                 >
                   <Download size={14} />
                 </button>
                 <button 
                   onClick={() => setIsExpanded(!isExpanded)} 
                   className="hidden md:block p-2 bg-black/40 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/5"
                   title={isExpanded ? "Zmenšit" : "Zvětšit"}
                 >
                   {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                 </button>
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

            {/* Messages Area / Settings Area */}
            <div className="flex-1 overflow-y-auto relative z-10 flex flex-col">
              
              {/* Settings Overlay – redesigned with tabs */}
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 z-50 bg-[#0a0a0a]/98 backdrop-blur-3xl overflow-y-auto flex flex-col"
                  >
                    {/* Settings Header */}
                    <div className={`px-5 pt-5 pb-3 border-b flex items-center justify-between shrink-0 ${
                      theme === 'blood' ? 'border-red-600/20' : theme === 'neon' ? 'border-purple-500/20' : theme === 'ocean' ? 'border-blue-500/20' : 'border-mafia-gold/20'
                    }`}>
                      <div>
                        <h4 className={`font-heading font-black uppercase tracking-[0.2em] text-sm ${
                          theme === 'blood' ? 'text-red-400' : theme === 'neon' ? 'text-purple-400' : theme === 'ocean' ? 'text-blue-400' : theme === 'forest' ? 'text-emerald-400' : 'text-mafia-gold'
                        }`}>⚙ NASTAVENÍ CHATU</h4>
                        <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-0.5">Přizpůsobte si prostředí</p>
                      </div>
                      <button onClick={() => setIsSettingsOpen(false)} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                        <X size={14} />
                      </button>
                    </div>

                    {/* Tab Bar */}
                    <div className="flex border-b border-white/10 shrink-0">
                      {([['appearance', '🎨 Vzhled'], ['chat', '💬 Chat'], ['privacy', '🔒 Soukromí']] as const).map(([tab, label]) => (
                        <button
                          key={tab}
                          onClick={() => setSettingsTab(tab)}
                          className={`flex-1 py-2.5 text-[9px] font-mono uppercase tracking-widest transition-all ${
                            settingsTab === tab
                              ? (theme === 'blood' ? 'text-red-400 border-b-2 border-red-500 bg-red-500/5' :
                                 theme === 'neon' ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/5' :
                                 theme === 'ocean' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' :
                                 theme === 'forest' ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5' :
                                 'text-mafia-gold border-b-2 border-mafia-gold bg-mafia-gold/5')
                              : 'text-white/30 hover:text-white/60'
                          }`}
                        >{label}</button>
                      ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">

                      {/* ── APPEARANCE TAB ── */}
                      {settingsTab === 'appearance' && (
                        <>
                          {/* Theme picker */}
                          <div>
                            <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] mb-3">Motiv barev</p>
                            <div className="grid grid-cols-3 gap-2">
                              {([
                                {id: 'gold',   name: 'Zlatý',    dot: 'bg-yellow-400',  ring: 'ring-yellow-400'},
                                {id: 'blood',  name: 'Krvavý',   dot: 'bg-red-500',     ring: 'ring-red-500'},
                                {id: 'noir',   name: 'Temný',    dot: 'bg-gray-300',    ring: 'ring-gray-300'},
                                {id: 'neon',   name: 'Neon',     dot: 'bg-purple-500',  ring: 'ring-purple-500'},
                                {id: 'ocean',  name: 'Oceán',    dot: 'bg-cyan-400',    ring: 'ring-cyan-400'},
                                {id: 'forest', name: 'Les',      dot: 'bg-emerald-500', ring: 'ring-emerald-500'},
                              ] as const).map(t => (
                                <button
                                  key={t.id}
                                  onClick={() => { setTheme(t.id); localStorage.setItem('mmbarber_chat_theme', t.id); }}
                                  className={`relative py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                                    theme === t.id ? 'border-white/40 bg-white/10 scale-105' : 'border-white/5 bg-black/40 hover:border-white/20'
                                  }`}
                                >
                                  <div className={`w-5 h-5 rounded-full ${t.dot} ${theme === t.id ? `ring-2 ring-offset-1 ring-offset-black ${t.ring}` : ''}`} />
                                  <span className="text-[9px] font-mono text-white/60 uppercase tracking-widest">{t.name}</span>
                                  {theme === t.id && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white" />}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Background */}
                          <div>
                            <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] mb-3">Pozadí chatu</p>
                            <div className="flex flex-col gap-2">
                              {([
                                {id: 'particles', name: '✦ Zlaté částice',       desc: 'Plovoucí jiskry'},
                                {id: 'ultra',     name: '◎ Ultra mlhovina',      desc: 'Animované oblaky'},
                                {id: 'matrix',    name: '⬇ Digitální déšť',     desc: 'Matrix styl'},
                                {id: 'grid',      name: '⊞ Technická mřížka',   desc: 'HUD grid'},
                                {id: 'clean',     name: '○ Čisté pozadí',       desc: 'Minimalistické'},
                              ] as const).map(b => (
                                <button
                                  key={b.id}
                                  onClick={() => { setChatBg(b.id); localStorage.setItem('mmbarber_chat_bg', b.id); }}
                                  className={`flex items-center justify-between py-2.5 px-4 rounded-xl border text-left transition-all ${
                                    chatBg === b.id ? 'border-white/30 bg-white/10' : 'border-white/5 bg-black/30 hover:border-white/15'
                                  }`}
                                >
                                  <span className="text-xs font-mono text-white/80">{b.name}</span>
                                  <span className="text-[9px] font-mono text-white/30">{b.desc}</span>
                                  {chatBg === b.id && <div className={`ml-2 w-1.5 h-1.5 rounded-full shrink-0 ${
                                    theme === 'blood' ? 'bg-red-400' : theme === 'neon' ? 'bg-purple-400' : theme === 'ocean' ? 'bg-blue-400' : 'bg-mafia-gold'
                                  }`} />}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Bubble style */}
                          <div>
                            <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] mb-3">Tvar bubliny</p>
                            <div className="grid grid-cols-3 gap-2">
                              {([{id: 'rounded', name: 'Kulatá', preview: 'rounded-2xl'}, {id: 'sharp', name: 'Ostrá', preview: 'rounded-sm'}, {id: 'mixed', name: 'Smíšená', preview: 'rounded-xl rounded-tr-sm'}] as const).map(s => (
                                <button
                                  key={s.id}
                                  onClick={() => { setBubbleStyle(s.id); localStorage.setItem('mmbarber_chat_bubble', s.id); }}
                                  className={`py-2 px-3 border flex flex-col items-center gap-2 transition-all ${
                                    bubbleStyle === s.id ? 'border-white/30 bg-white/10' : 'border-white/5 bg-black/30 hover:border-white/15'
                                  }`}
                                >
                                  <div className={`w-8 h-4 bg-mafia-gold/40 ${s.preview}`} />
                                  <span className="text-[9px] font-mono text-white/50">{s.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* ── CHAT TAB ── */}
                      {settingsTab === 'chat' && (
                        <>
                          {/* Font size */}
                          <div>
                            <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] mb-3">Velikost textu</p>
                            <div className="flex gap-2">
                              {([{id: 'sm', label: 'A', size: 'text-xs'}, {id: 'md', label: 'A', size: 'text-sm'}, {id: 'lg', label: 'A', size: 'text-base'}] as const).map(f => (
                                <button
                                  key={f.id}
                                  onClick={() => { setFontSize(f.id); localStorage.setItem('mmbarber_chat_font', f.id); }}
                                  className={`flex-1 py-3 rounded-xl border flex items-center justify-center transition-all ${
                                    fontSize === f.id ? 'border-white/30 bg-white/10' : 'border-white/5 bg-black/30 hover:border-white/15'
                                  }`}
                                >
                                  <span className={`font-bold text-white/70 ${f.size}`}>{f.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Compact mode */}
                          <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-white/5 bg-black/30">
                            <div>
                              <p className="text-xs font-mono text-white/70">Kompaktní mód</p>
                              <p className="text-[9px] font-mono text-white/30">Menší mezery mezi zprávami</p>
                            </div>
                            <button
                              onClick={() => { const v = !compactMode; setCompactMode(v); localStorage.setItem('mmbarber_chat_compact', String(v)); }}
                              className={`w-11 h-6 rounded-full relative transition-colors duration-300 flex items-center ${
                                compactMode ? (theme === 'blood' ? 'bg-red-500' : theme === 'neon' ? 'bg-purple-500' : theme === 'ocean' ? 'bg-blue-500' : theme === 'forest' ? 'bg-emerald-500' : 'bg-mafia-gold') : 'bg-white/10'
                              }`}
                            >
                              <motion.div animate={{ x: compactMode ? 22 : 3 }} className="w-4 h-4 rounded-full bg-white shadow-sm" />
                            </button>
                          </div>

                          {/* Show timestamps */}
                          <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-white/5 bg-black/30">
                            <div>
                              <p className="text-xs font-mono text-white/70">Zobrazit časová razítka</p>
                              <p className="text-[9px] font-mono text-white/30">HUD styl čas u každé zprávy</p>
                            </div>
                            <button
                              onClick={() => { const v = !showTimestamps; setShowTimestamps(v); localStorage.setItem('mmbarber_chat_timestamps', String(v)); }}
                              className={`w-11 h-6 rounded-full relative transition-colors duration-300 flex items-center ${
                                showTimestamps ? (theme === 'blood' ? 'bg-red-500' : theme === 'neon' ? 'bg-purple-500' : theme === 'ocean' ? 'bg-blue-500' : theme === 'forest' ? 'bg-emerald-500' : 'bg-mafia-gold') : 'bg-white/10'
                              }`}
                            >
                              <motion.div animate={{ x: showTimestamps ? 22 : 3 }} className="w-4 h-4 rounded-full bg-white shadow-sm" />
                            </button>
                          </div>

                          {/* AI typing speed */}
                          <div>
                            <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] mb-3">Rychlost AI odpovědi</p>
                            <div className="flex gap-2">
                              {([{id: 'slow', label: '🐢 Pomalu'}, {id: 'normal', label: '⚡ Normálně'}, {id: 'fast', label: '🚀 Rychle'}] as const).map(sp => (
                                <button
                                  key={sp.id}
                                  onClick={() => { setAiTypingSpeed(sp.id); localStorage.setItem('mmbarber_chat_ai_speed', sp.id); }}
                                  className={`flex-1 py-2.5 px-1 rounded-xl border text-[9px] font-mono transition-all ${
                                    aiTypingSpeed === sp.id ? 'border-white/30 bg-white/10 text-white' : 'border-white/5 bg-black/30 text-white/40 hover:border-white/15'
                                  }`}
                                >
                                  {sp.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Sounds */}
                          <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-white/5 bg-black/30">
                            <div>
                              <p className="text-xs font-mono text-white/70">Zvuky chatu</p>
                              <p className="text-[9px] font-mono text-white/30">Upozornění na novou zprávu</p>
                            </div>
                            <button
                              onClick={() => { const v = !soundsEnabled; setSoundsEnabled(v); localStorage.setItem('mmbarber_chat_sounds', String(v)); }}
                              className={`w-11 h-6 rounded-full relative transition-colors duration-300 flex items-center ${
                                soundsEnabled ? (theme === 'blood' ? 'bg-red-500' : theme === 'neon' ? 'bg-purple-500' : theme === 'ocean' ? 'bg-blue-500' : theme === 'forest' ? 'bg-emerald-500' : 'bg-mafia-gold') : 'bg-white/10'
                              }`}
                            >
                              <motion.div animate={{ x: soundsEnabled ? 22 : 3 }} className="w-4 h-4 rounded-full bg-white shadow-sm" />
                            </button>
                          </div>
                        </>
                      )}

                      {/* ── PRIVACY TAB ── */}
                      {settingsTab === 'privacy' && (
                        <>
                          <div className="p-4 rounded-xl border border-white/5 bg-black/30">
                            <p className="text-xs font-mono text-white/70 mb-1">Vaše data</p>
                            <p className="text-[9px] font-mono text-white/30 leading-relaxed">Zprávy jsou ukládány pouze po dobu aktivní konverzace. Po uzavření konverzace jsou automaticky smazány ze serverů.</p>
                          </div>

                          <div className="p-4 rounded-xl border border-white/5 bg-black/30">
                            <p className="text-xs font-mono text-white/70 mb-1">Export konverzace</p>
                            <p className="text-[9px] font-mono text-white/30 leading-relaxed mb-3">Stáhněte si celou historii chatu jako textový soubor.</p>
                            <button
                              onClick={() => { exportChat(); }}
                              className="w-full py-2.5 px-4 rounded-xl border border-white/10 text-white/60 text-[10px] font-mono uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                              <Download size={12} /> Stáhnout historii
                            </button>
                          </div>

                          <div className="mt-auto pt-4 border-t border-white/10">
                            <button 
                              onClick={clearChat}
                              className="w-full py-3 px-4 rounded-xl border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.15)] flex items-center justify-center gap-2"
                            >
                              🗑 Smazat celou historii
                            </button>
                            <p className="text-[8px] font-mono text-white/20 text-center mt-2 uppercase tracking-widest">Tato akce je nevratná</p>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={`flex-1 overflow-y-auto custom-scrollbar ${chatBg !== 'clean' ? 'bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_80%)]' : ''} ${compactMode ? 'p-3 space-y-1' : 'p-5 space-y-2'}`}>
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6">
                    <motion.div 
                      animate={{ y: [0, -10, 0] }} 
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border ${
                        theme === 'blood' ? 'bg-red-600/5 border-red-600/20 text-red-500' :
                        theme === 'noir' ? 'bg-white/5 border-white/20 text-gray-300' :
                        theme === 'neon' ? 'bg-purple-500/5 border-purple-500/20 text-purple-400' :
                        theme === 'ocean' ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' :
                        theme === 'forest' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                        'bg-mafia-gold/5 border-mafia-gold/20 text-mafia-gold'
                      }`}
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
                          className={`py-2.5 px-4 rounded-full border text-xs font-mono transition-colors shadow-sm w-full text-left flex items-center justify-between group disabled:opacity-50 ${
                            theme === 'blood' ? 'border-red-600/30 text-red-400 hover:bg-red-600/10' :
                            theme === 'noir' ? 'border-white/20 text-gray-300 hover:bg-white/10' :
                            theme === 'neon' ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10' :
                            theme === 'ocean' ? 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10' :
                            theme === 'forest' ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' :
                            'border-mafia-gold/30 text-mafia-gold hover:bg-mafia-gold/10'
                          }`}
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
                  const isSystem = msg.text.startsWith('[SYSTEM] ') || (msg.sender === 'ADMIN' && msg.fullName?.includes("Systém"));
                  const isBot = msg.text.startsWith('[BOT] ') || msg.isBot || (msg.sender === 'ADMIN' && msg.fullName === getDaimonName());
                  const isHumanSupport = msg.sender === 'ADMIN' && !isBot && !isSystem;
                  const displayText = msg.text.replace(/\[SYSTEM\] |\[BOT\] /g, '');
                  const senderName = isUser ? 'Vy' : (isBot ? (msg.fullName || getDaimonName()) : (isSystem ? 'Systém' : 'Podpora'));
                  
                  const isNextSame = messages[idx + 1]?.sender === msg.sender && !isSystem && !messages[idx + 1]?.text.startsWith('[SYSTEM] ');
                  const isPrevSame = messages[idx - 1]?.sender === msg.sender && !isSystem && !messages[idx - 1]?.text.startsWith('[SYSTEM] ');
                  
                  const currentMsgDate = new Date(msg.timestamp).toDateString();
                  const prevMsgDate = idx > 0 ? new Date(messages[idx - 1].timestamp).toDateString() : null;
                  const showDateSeparator = currentMsgDate !== prevMsgDate;
                  const showHeader = !isPrevSame || showDateSeparator;
                  
                  const isLastMessage = idx === messages.length - 1;
                  const isSticker = isOnlyEmojis(displayText);
                  
                  return (
                    <React.Fragment key={msg.id}>
                      {showDateSeparator && (
                        <div className="flex justify-center my-6">
                          <span className="bg-white/5 border border-white/10 px-3 py-1.2 rounded-full text-[9px] font-mono uppercase tracking-widest text-white/50 backdrop-blur-md shadow-sm">
                            {formatDateSeparator(msg.timestamp)}
                          </span>
                        </div>
                      )}
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} ${isNextSame && !showDateSeparator ? 'mb-1' : 'mb-3'}`}
                      >
                       {showHeader && showTimestamps && (
                         <span className="text-[9px] font-mono text-white/30 uppercase mb-1.5 px-2 tracking-widest flex items-center gap-1.5">
                           <span className={`font-bold ${isUser ? 'text-white/60' : 'text-mafia-gold/70'}`}>[{senderName}]</span>
                           <span className="opacity-30">|</span>
                           <span className="opacity-50">T:</span>
                           <span className="tracking-[0.3em] font-bold">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                         </span>
                       )}
                       <div className="relative group max-w-[85%] flex items-center gap-2">
                           {isUser && (
                              <button 
                                onClick={() => navigator.clipboard.writeText(displayText)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10 shrink-0"
                                title="Kopírovat"
                              >
                                <Copy size={12} />
                              </button>
                           )}

                           <div className={`${isSticker ? 'text-[45px] leading-none tracking-widest' : `${compactMode ? 'p-2.5 px-3.5' : 'p-3.5 px-4'} ${fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm'} leading-relaxed shadow-lg ${
                                isSystem ? `bg-black/40 border italic ${bubbleStyle === 'rounded' ? 'rounded-xl' : bubbleStyle === 'sharp' ? 'rounded-sm' : 'rounded-xl'} text-center w-full ${
                                  theme === 'blood' ? 'border-red-600/20 text-red-400' :
                                  theme === 'noir' ? 'border-white/20 text-gray-400' :
                                  theme === 'neon' ? 'border-purple-500/20 text-purple-400' :
                                  theme === 'ocean' ? 'border-blue-500/20 text-blue-400' :
                                  theme === 'forest' ? 'border-emerald-500/20 text-emerald-400' :
                                  'border-mafia-gold/20 text-mafia-gold/80'
                                }` :
                                isUser 
                                  ? `text-black font-medium ${
                                      bubbleStyle === 'rounded' ? (isNextSame ? 'rounded-2xl rounded-tr-sm rounded-br-sm' : 'rounded-2xl rounded-br-sm') :
                                      bubbleStyle === 'sharp' ? 'rounded-sm' :
                                      (isNextSame ? 'rounded-xl rounded-tr-sm rounded-br-sm' : 'rounded-xl rounded-br-sm')
                                    } ${
                                      theme === 'blood' ? 'bg-red-600 text-white' :
                                      theme === 'noir' ? 'bg-gray-200 text-black' :
                                      theme === 'neon' ? 'bg-purple-500 text-white' :
                                      theme === 'ocean' ? 'bg-blue-500 text-white' :
                                      theme === 'forest' ? 'bg-emerald-500 text-white' :
                                      'bg-mafia-gold'
                                    }` 
                                  : isBot 
                                    ? `bg-blue-900/30 backdrop-blur-md border border-blue-500/30 text-blue-50 ${
                                        bubbleStyle === 'rounded' ? (isNextSame ? 'rounded-2xl rounded-tl-sm rounded-bl-sm' : 'rounded-2xl rounded-bl-sm') :
                                        bubbleStyle === 'sharp' ? 'rounded-sm' :
                                        (isNextSame ? 'rounded-xl rounded-tl-sm rounded-bl-sm' : 'rounded-xl rounded-bl-sm')
                                      }`
                                    : `bg-mafia-red/80 backdrop-blur-md border border-mafia-red/50 text-white font-medium shadow-[0_0_15px_rgba(220,38,38,0.3)] ${
                                        bubbleStyle === 'rounded' ? (isNextSame ? 'rounded-2xl rounded-tl-sm rounded-bl-sm' : 'rounded-2xl rounded-bl-sm') :
                                        bubbleStyle === 'sharp' ? 'rounded-sm' :
                                        (isNextSame ? 'rounded-xl rounded-tl-sm rounded-bl-sm' : 'rounded-xl rounded-bl-sm')
                                      }`
                           }`} overflow-hidden flex flex-col gap-1`}>
                              {msg.attachmentUrl && msg.attachmentType === 'image' && (
                                <img src={msg.attachmentUrl} alt="Attachment" className="w-full h-auto max-h-48 object-cover rounded-lg mb-2 cursor-pointer" onClick={() => window.open(msg.attachmentUrl, '_blank')} />
                              )}
                              {msg.attachmentUrl && msg.attachmentType === 'video' && (
                                <video src={msg.attachmentUrl} controls className="w-full max-h-48 rounded-lg mb-2" />
                              )}
                              <div className="break-words">{renderTextWithLinks(displayText)}</div>
                              
                              {isUser && !isLastMessage && (
                                <div className="self-end mt-0.5 flex items-center opacity-70">
                                  {msg.read ? <span title="Přečteno" className="flex items-center"><CheckCheck size={14} className="text-blue-800" /></span> : <span title="Odesláno" className="flex items-center"><Check size={14} /></span>}
                                </div>
                              )}
                           </div>

                           {isUser && isLastMessage && (
                             <div className="self-end mt-1 mb-1 mr-1 text-[9px] font-mono text-white/40 uppercase tracking-wider flex items-center gap-1">
                               {msg.read ? <><CheckCheck size={12} className="text-blue-400" /> Zobrazeno</> : <><Check size={12} /> Doručeno</>}
                             </div>
                           )}

                           {!isUser && !isSystem && (
                              <button 
                                onClick={() => navigator.clipboard.writeText(displayText)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10 shrink-0"
                                title="Kopírovat"
                              >
                                <Copy size={12} />
                              </button>
                           )}
                       </div>
                    </motion.div>
                   </React.Fragment>
                  );
                })
              )}
              {isBotTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex flex-col items-start mb-5"
                >
                  <span className="text-[9px] font-mono text-white/30 uppercase mb-1.5 px-2 tracking-widest">
                    {chatMode === 'bot' ? getDaimonName() : 'Operátor'} • píše...
                  </span>
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl rounded-bl-sm p-3.5 px-5 shadow-lg flex items-center gap-1.5">
                    <motion.div 
                      animate={{ y: [0, -3, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      className={`w-1.5 h-1.5 rounded-full ${
                        theme === 'blood' ? 'bg-red-400' : theme === 'noir' ? 'bg-gray-300' : theme === 'neon' ? 'bg-purple-400' : theme === 'ocean' ? 'bg-blue-400' : theme === 'forest' ? 'bg-emerald-400' : 'bg-mafia-gold'
                      }`}
                    />
                    <motion.div 
                      animate={{ y: [0, -3, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      className={`w-1.5 h-1.5 rounded-full ${
                        theme === 'blood' ? 'bg-red-400' : theme === 'noir' ? 'bg-gray-300' : theme === 'neon' ? 'bg-purple-400' : theme === 'ocean' ? 'bg-blue-400' : theme === 'forest' ? 'bg-emerald-400' : 'bg-mafia-gold'
                      }`}
                    />
                    <motion.div 
                      animate={{ y: [0, -3, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                      className={`w-1.5 h-1.5 rounded-full ${
                        theme === 'blood' ? 'bg-red-400' : theme === 'noir' ? 'bg-gray-300' : theme === 'neon' ? 'bg-purple-400' : theme === 'ocean' ? 'bg-blue-400' : theme === 'forest' ? 'bg-emerald-400' : 'bg-mafia-gold'
                      }`}
                    />
                  </div>
                </motion.div>
              )}
              {messages.length > 0 && messages[messages.length - 1].sender === 'ADMIN' && chatMode === 'bot' && !isBotTyping && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mt-4 mb-2 px-1">
                  {(messages[messages.length - 1].suggestedActions || ["Kde vás najdu?", "Ceník", "Chci rezervaci", "Přepnout na člověka"]).map((qr, i) => (
                    <button
                      key={i}
                      onClick={() => {
                         if (qr === "Přepnout na člověka") switchMode('human');
                         else handleSend(qr);
                      }}
                      disabled={isSubmitting}
                      className={`px-3 py-1.5 rounded-full border text-[10px] font-mono transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-sm ${
                        theme === 'blood' ? 'border-red-600/40 text-red-400 hover:bg-red-600 hover:text-white' :
                        theme === 'noir' ? 'border-white/20 text-gray-300 hover:bg-gray-200 hover:text-black' :
                        theme === 'neon' ? 'border-purple-500/40 text-purple-400 hover:bg-purple-500 hover:text-white' :
                        theme === 'ocean' ? 'border-blue-500/40 text-blue-400 hover:bg-blue-500 hover:text-white' :
                        theme === 'forest' ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white' :
                        'border-mafia-gold/40 text-mafia-gold hover:bg-mafia-gold hover:text-black'
                      }`}
                    >
                      {qr}
                    </button>
                  ))}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            </div>

            {/* Input Area */}
            <div className="bg-black/80 backdrop-blur-xl shrink-0 relative z-10 flex flex-col">
               {/* Mode Switcher */}
               <div className="flex border-t border-b border-white/10">
                 <button 
                   onClick={() => switchMode('bot')}
                   className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 ${
                     chatMode === 'bot' ? (
                        theme === 'blood' ? 'text-red-400 bg-white/5 border-b-2 border-red-500' :
                        theme === 'noir' ? 'text-gray-200 bg-white/5 border-b-2 border-gray-400' :
                        theme === 'neon' ? 'text-purple-400 bg-white/5 border-b-2 border-purple-500' :
                        theme === 'ocean' ? 'text-blue-400 bg-white/5 border-b-2 border-blue-500' :
                        theme === 'forest' ? 'text-emerald-400 bg-white/5 border-b-2 border-emerald-500' :
                        'text-mafia-gold bg-white/5 border-b-2 border-mafia-gold'
                     ) : 'text-white/50 hover:text-white/80 bg-transparent'
                   }`}
                 >
                   {getDaimonName()}
                 </button>
                 <div className="w-[1px] bg-white/10"></div>
                 <button 
                   onClick={() => switchMode('human')}
                   className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 ${
                     chatMode === 'human' ? (
                        theme === 'blood' ? 'text-red-400 bg-white/5 border-b-2 border-red-500' :
                        theme === 'noir' ? 'text-gray-200 bg-white/5 border-b-2 border-gray-400' :
                        theme === 'neon' ? 'text-purple-400 bg-white/5 border-b-2 border-purple-500' :
                        theme === 'ocean' ? 'text-blue-400 bg-white/5 border-b-2 border-blue-500' :
                        theme === 'forest' ? 'text-emerald-400 bg-white/5 border-b-2 border-emerald-500' :
                        'text-mafia-gold bg-white/5 border-b-2 border-mafia-gold'
                     ) : 'text-white/50 hover:text-white/80 bg-transparent'
                   }`}
                 >
                   Živá podpora
                 </button>
               </div>

               <div className="p-4 pt-3">
                 {!session && !isNameSet ? (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                   <p className="text-[10px] font-mono text-mafia-gold uppercase mb-2 tracking-widest pl-2">Pro začátek zadejte své jméno:</p>
                   <form onSubmit={(e) => { e.preventDefault(); if (fullName.trim()) setIsNameSet(true); }} className="relative flex items-center group gap-1">
                     <input 
                       type="text"
                       value={fullName}
                       onChange={(e) => setFullName(e.target.value)}
                       placeholder="Např. John Doe"
                       className="w-full bg-white/5 border border-mafia-gold/30 rounded-xl px-4 py-4 pr-16 text-base font-mono text-white focus:outline-none focus:border-mafia-gold focus:bg-white/10 transition-all placeholder:text-white/20"
                     />
                     <button
                       type="submit"
                       disabled={!fullName.trim()}
                       className={`absolute right-2 w-11 h-11 flex items-center justify-center text-black rounded-full hover:scale-105 transition-all disabled:opacity-0 disabled:scale-75 shadow-lg ${
                         theme === 'blood' ? 'bg-red-600 hover:bg-white text-white hover:text-black' :
                         theme === 'noir' ? 'bg-gray-300 hover:bg-white' :
                         theme === 'neon' ? 'bg-purple-500 hover:bg-white text-white hover:text-black' :
                         theme === 'ocean' ? 'bg-blue-500 hover:bg-white text-white hover:text-black' :
                         theme === 'forest' ? 'bg-emerald-500 hover:bg-white text-white hover:text-black' :
                         'bg-mafia-gold hover:bg-white'
                       }`}
                     >
                       <Check size={17} />
                     </button>
                   </form>
                 </motion.div>
               ) : (
               <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="relative flex items-center group gap-1">
                 {session && chatMode === 'human' && (
                   <div className="flex shrink-0">
                     <button 
                       type="button" 
                       onClick={() => fileInputRef.current?.click()}
                       className="p-2 text-white/50 hover:text-mafia-gold transition-colors relative"
                       disabled={isUploading}
                     >
                       {isUploading ? <Loader2 size={20} className="animate-spin text-mafia-gold" /> : <Paperclip size={20} />}
                     </button>
                     <button 
                       type="button" 
                       onClick={startCall}
                       disabled={callStatus !== 'IDLE'}
                       className="p-2 text-white/50 hover:text-mafia-gold transition-colors disabled:opacity-30"
                       title="Zavolat"
                     >
                       <Phone size={20} />
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
                   disabled={isSubmitting}
                   placeholder="Napište zprávu..."
                   className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-16 text-base text-white focus:outline-none focus:border-mafia-gold focus:bg-white/10 transition-all disabled:opacity-50 placeholder:text-white/30"
                 />
                 <button 
                   type="submit"
                   disabled={isSubmitting || !messageText.trim()}
                   className={`absolute right-2 w-11 h-11 flex items-center justify-center text-black rounded-full hover:scale-105 transition-all disabled:opacity-0 disabled:scale-75 shadow-lg ${
                     theme === 'blood' ? 'bg-red-600 hover:bg-white text-white hover:text-black' :
                     theme === 'noir' ? 'bg-gray-300 hover:bg-white' :
                     theme === 'neon' ? 'bg-purple-500 hover:bg-white text-white hover:text-black' :
                     theme === 'ocean' ? 'bg-blue-500 hover:bg-white text-white hover:text-black' :
                     theme === 'forest' ? 'bg-emerald-500 hover:bg-white text-white hover:text-black' :
                     'bg-mafia-gold hover:bg-white'
                   }`}
                 >
                   <Send size={17} className="ml-0.5" />
                 </button>
               </motion.form>
               )}
             </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={remoteAudioRef} autoPlay />
    </>
  );
}
