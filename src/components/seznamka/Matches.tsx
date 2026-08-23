import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MessageCircleHeart, X, Send, Heart, Star, ThumbsDown, Sparkles, MapPin, Camera, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { ProfileData } from "./ProfileCard";
import { motion, AnimatePresence } from "framer-motion";
import { TriangleAlert } from "lucide-react";

interface MatchesProps {
  matches?: ProfileData[];
}

export function Matches({ matches = [] }: MatchesProps) {
  const { lang } = useTranslation();
  const [activeChat, setActiveChat] = useState<ProfileData | null>(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{sender: 'me' | 'them', senderName?: string, senderPhoto?: string, type?: 'text'|'image'|'audio', text?: string, url?: string, audioUrl?: string, isBlurred?: boolean, id?: string, isRead?: boolean, reaction?: string}[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);
  const [ratedMatches, setRatedMatches] = useState<string[]>([]);
  const [autoBlurImages, setAutoBlurImages] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('seznamka_safe_chat');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });
  const [filterToxicWords, setFilterToxicWords] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('seznamka_toxic_filter');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isPanicking, setIsPanicking] = useState(false);
  const [retentionDays, setRetentionDays] = useState<number | null>(1);
  const [isGhostDropdownOpen, setIsGhostDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleRecording = async () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            await fetch('/api/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                targetUserId: activeChat!.userId,
                audioUrl: base64Audio
              })
            });
            fetchMessages(activeChat!);
          };
          stream.getTracks().forEach(track => track.stop()); // zastavit stream po nahrani
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access denied", err);
        alert("Nepodařilo se přistoupit k mikrofonu.");
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeChat) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetUserId: activeChat.userId,
            imageUrl: base64Image
          })
        });
        fetchMessages(activeChat);
      };
    }
  };

  const censorText = (text: string | undefined) => {
    if (!text || !filterToxicWords) return text;
    let censored = text;
    const toxicWords = ['kurva', 'kurv', 'zmrd', 'zkurv', 'píča', 'kokot', 'debil', 'hovno', 'hovn', 'prdel'];
    toxicWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      censored = censored.replace(regex, '***');
    });
    return censored;
  };


  // Fetch match messages
  const fetchMessages = async (match: ProfileData) => {
    if (!match.matchId) return;

    if (match.matchId.startsWith('mock-')) {
      if (match.matchId === 'mock-ema') {
        setChatHistory([
          { id: '1', sender: 'them', text: 'Ahoj! Všimla jsem si, že taky rád fotíš. 📸', isRead: true },
          { id: '2', sender: 'me', text: 'Čau Emo! Přesně tak, nejradši fotím street photo v Praze. Co ty?', isRead: true },
          { id: '3', sender: 'them', text: 'Já hlavně portréty a přírodu. Mimochodem, neznáme se od vidění z té kavárny minulý týden?', reaction: '❤️' }
        ]);
        setCurrentUserId('me');
        setIsTyping(false);
      } else if (match.matchId === 'mock-tomas') {
        setChatHistory([
          { id: '4', sender: 'them', text: 'Zdravím! Mám dotaz k tomu, co máš v bio...', isRead: true }
        ]);
        setCurrentUserId('me');
        setIsTyping(true);
      }
      return;
    }

    try {
      const res = await fetch(`/api/messages?matchId=${match.matchId}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentUserId(data.currentUserId);
        
        const formattedMessages = data.messages.map((m: any) => ({
          id: m.id,
          sender: m.senderId === data.currentUserId ? 'me' : 'them',
          text: m.text, // Měli bychom používat m.text místo m.content protože schéma má `text` (v minulé verzi bylo `m.content` což byl bug)
          type: m.audioUrl ? 'audio' : (m.url ? 'image' : 'text'),
          url: m.url,
          audioUrl: m.audioUrl,
          isBlurred: m.url ? autoBlurImages : false,
          isRead: m.isRead,
          reaction: m.reaction
        }));
        
        setChatHistory(formattedMessages);
        if (data.messageRetentionDays !== undefined) {
          setRetentionDays(data.messageRetentionDays);
        }
        if (data.isTyping !== undefined) {
          setIsTyping(data.isTyping);
        }
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  // Smart Polling
  useEffect(() => {
    if (!activeChat) return;
    
    fetchMessages(activeChat);

    const interval = setInterval(() => {
      fetchMessages(activeChat);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeChat, autoBlurImages]);

  const handleOpenChat = (profile: ProfileData) => {
    setActiveChat(profile);
    setChatHistory([]);
    setIsTyping(false);
  };

  // Odeslání pingu při psaní
  useEffect(() => {
    if (!message.trim() || !activeChat?.matchId) return;
    const timeout = setTimeout(() => {
      fetch('/api/messages/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: activeChat.matchId })
      }).catch(console.error);
    }, 500); // Debounce psaní
    return () => clearTimeout(timeout);
  }, [message, activeChat]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;
    
    const textToSend = message;
    setMessage(""); // Optimistic UI clear
    
    // Optimistic insert
    setChatHistory(prev => [...prev, { sender: 'me', text: textToSend, id: 'temp-' + Date.now() }]);

    if (activeChat.matchId?.startsWith('mock-')) {
      // Simulate an artificial response delay
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatHistory(prev => [...prev, { sender: 'them', text: 'Haha, to je super! Rozumím.', id: 'temp-reply-' + Date.now() }]);
      }, 2500);
      return;
    }

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: activeChat.userId,
          text: textToSend
        })
      });
    } catch (err) {
      console.error("Chyba při odesílání", err);
    }
  };

  // AI Spellcheck / Grammar check
  const handleSpellcheck = () => {
    if (!message.trim()) return;

    // Simulate AI grammar check with a local algorithm
    // In the future, this calls POST /api/ai/spellcheck
    let corrected = message.trim();
    
    // Zjednodušená ukázka (první písmeno velké, na konci tečka)
    corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
    if (!/[.!?]$/.test(corrected)) {
      corrected += ".";
    }

    // Korekce typických překlepů
    corrected = corrected.replace(/\b(ahoj|cau)\b/gi, 'Ahoj');
    corrected = corrected.replace(/\b(jdem|jdes)\b/gi, (match) => match === 'jdem' ? 'jdeme' : 'jdeš');
    corrected = corrected.replace(/\b(mas)\b/gi, 'máš');

    setMessage(corrected);
  };

  const handleRate = (type: 'positive' | 'negative') => {
    if (activeChat) {
      setRatedMatches(prev => [...prev, activeChat.name]);
    }
    setShowRatingModal(false);
  };

  const handlePanic = async () => {
    if (!activeChat) return;
    const confirmPanic = window.confirm(lang === 'cs' ? 'Opravdu chcete tohoto uživatele nahlásit, zablokovat a smazat konverzaci?' : 'Are you sure you want to report, block, and delete this conversation?');
    if (!confirmPanic) return;

    setIsPanicking(true);
    try {
      const res = await fetch('/api/messages/panic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: activeChat.userId })
      });
      if (res.ok) {
        alert(lang === 'cs' ? 'Uživatel zablokován a nahlášen.' : 'User blocked and reported.');
        setActiveChat(null); // Zavřít chat
        // V produkci by se měl smazat i z listu matches (refreshnutí parent listu)
      } else {
        const data = await res.json();
        alert(data.error || 'Nastala chyba');
      }
    } catch (err) {
      alert('Chyba při nahlašování');
    }
    setIsPanicking(false);
  };

  const handleRetentionChange = async (days: number | null) => {
    if (!activeChat?.matchId) return;
    try {
      const res = await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: activeChat.matchId, messageRetentionDays: days })
      });
      if (res.ok) {
        setRetentionDays(days);
        setIsGhostDropdownOpen(false);
        // Refresh messages after retention change to reflect deleted messages
        fetchMessages(activeChat);
      } else {
        alert(lang === 'cs' ? 'Chyba při ukládání nastavení Ghost Mode.' : 'Error saving Ghost Mode settings.');
      }
    } catch (err) {
      console.error(err);
    }
  };


  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <MessageCircleHeart size={48} className="text-mafia-gold/30 mb-6" />
        <h3 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-2">
          {lang === 'cs' ? 'Zatím žádné zprávy' : 'No messages yet'}
        </h3>
        <p className="text-smoke-white/50 max-w-md text-sm font-mono uppercase tracking-widest leading-relaxed">
          {lang === 'cs' 
            ? 'Vrať se do sítě a najdi si někoho, s kým si padnete do oka.' 
            : 'Go back to hunting and find someone you click with.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] flex flex-col md:flex-row border border-white/10 rounded-xl overflow-hidden bg-black/40">
      {/* Sidebar - List of matches */}
      <div className={`w-full md:w-1/3 border-r border-white/10 h-full flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-white/10 flex-shrink-0 bg-black/60">
          <h3 className="text-xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em]">
            {lang === 'cs' ? 'Kontakty' : 'Matches'}
          </h3>
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          
          {/* Drop Match Banner (Adrenalin Match) */}
          <div className="p-3 mb-4 rounded-lg bg-gradient-to-r from-mafia-gold/20 to-mafia-dark border border-mafia-gold/50 shadow-[0_0_20px_rgba(197,160,89,0.2)]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-mafia-gold animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-mafia-gold uppercase tracking-widest">Zlatý Drop</span>
            </div>
            <p className="text-xs text-white/80 font-sans mb-3">Tento match vyprší za <strong className="text-mafia-gold font-mono">23:59:59</strong>, pokud si nenapíšete.</p>
            <button className="w-full py-2 bg-mafia-gold text-black font-heading font-black uppercase tracking-widest text-xs hover:bg-white transition-colors">
              Napsat hned
            </button>
          </div>

          {matches.map((profile, i) => (
            <button
              key={i}
              onClick={() => handleOpenChat(profile)}
              className={`w-full text-left p-3 flex items-center gap-4 rounded-lg transition-all ${
                activeChat?.name === profile.name ? 'bg-mafia-gold/10 border border-mafia-gold/30' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="w-12 h-12 flex-shrink-0 relative">
                <div className="w-full h-full rounded-full overflow-hidden border border-mafia-gold/50 relative">
                  <Image src={profile.photos?.[0] || '/placeholder.jpg'} alt={profile.name} fill className="object-cover" sizes="48px" />
                </div>
                {profile.lastOnline && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)] z-10"></div>
                )}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="font-heading font-bold text-white uppercase tracking-wider truncate">{profile.name}</div>
                <div className="text-[10px] font-mono text-mafia-gold truncate uppercase tracking-widest">
                  {lang === 'cs' ? 'Klikni pro chat' : 'Click to chat'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`w-full md:w-2/3 h-full flex flex-col relative ${!activeChat ? 'hidden md:flex bg-black/20' : 'bg-black/60'}`}>
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageCircleHeart size={48} className="text-mafia-gold/20 mb-4" />
            <p className="text-smoke-white/50 text-sm font-mono uppercase tracking-widest">
              {lang === 'cs' ? 'Vyber si kontakt vlevo a začni chatovat.' : 'Select a match on the left to start chatting.'}
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-mafia-dark/80 backdrop-blur-md sticky top-0 z-10 flex-shrink-0">
              <button 
                onClick={() => setActiveChat(null)}
                className="md:hidden text-white/50 hover:text-white p-2"
              >
                <X size={20} />
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-mafia-gold/50 flex-shrink-0 relative">
                <Image src={activeChat.photos?.[0] || '/placeholder.jpg'} alt={activeChat.name} fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <h3 className="font-heading font-black text-white uppercase tracking-wider">{activeChat.name}</h3>
                <p className={`text-[9px] font-mono uppercase tracking-widest ${activeChat.accountType === 'property' ? 'text-blue-400' : 'text-green-500'}`}>
                  {activeChat.accountType === 'property' ? (lang === 'cs' ? 'Komunitní Chat' : 'Community Chat') : 'Online'}
                </p>
              </div>
              
              <div className="ml-auto flex items-center">
                {activeChat.accountType === 'property' && (
                  <button className="flex items-center gap-2 px-3 py-1.5 mr-2 bg-blue-900/50 border border-blue-500/30 rounded-full text-blue-400 hover:bg-blue-500/20 transition-colors">
                    <span className="text-[10px] font-mono uppercase tracking-widest">{lang === 'cs' ? 'Spravovat Členy' : 'Manage Members'}</span>
                  </button>
                )}
                {!ratedMatches.includes(activeChat.name) ? (
                  <button 
                    onClick={() => setShowRatingModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-black/50 border border-mafia-gold/30 rounded-full text-mafia-gold hover:bg-mafia-gold/10 transition-colors"
                  >
                    <Star size={14} />
                    <span className="text-[10px] font-mono uppercase tracking-widest">{lang === 'cs' ? 'Ohodnotit' : 'Rate'}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 border border-white/10 rounded-full text-white/40">
                    <span className="text-[10px] font-mono uppercase tracking-widest">{lang === 'cs' ? 'Ohodnoceno' : 'Rated'}</span>
                  </div>
                )}
                
                {/* Ghost Mode Dropdown */}
                <div className="relative ml-2 flex items-center">
                  <button
                    onClick={() => setIsGhostDropdownOpen(!isGhostDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-black/50 border-white/10 text-white/40 hover:bg-white/5 transition-colors"
                    title={lang === 'cs' ? 'Nastavení mizejících zpráv (Ghost Mode)' : 'Disappearing messages settings'}
                  >
                    <Clock size={14} className={retentionDays !== null ? "text-mafia-gold" : ""} />
                    <span className="text-[10px] font-mono uppercase tracking-widest hidden sm:inline">
                      {retentionDays === null ? (lang === 'cs' ? 'Nikdy' : 'Never') : `${retentionDays}d`}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {isGhostDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-mafia-dark border border-mafia-gold/30 rounded-lg shadow-xl overflow-hidden z-50 flex flex-col"
                      >
                        <div className="p-2 border-b border-white/10 bg-black/50 text-[10px] font-mono text-mafia-gold uppercase tracking-widest text-center">
                          {lang === 'cs' ? 'Smazat zprávy za' : 'Auto-delete after'}
                        </div>
                        {[
                          { value: 1, label: lang === 'cs' ? '1 den' : '1 day' },
                          { value: 3, label: lang === 'cs' ? '3 dny' : '3 days' },
                          { value: 7, label: lang === 'cs' ? '7 dní' : '7 days' },
                          { value: 14, label: lang === 'cs' ? '14 dní' : '14 days' },
                          { value: 30, label: lang === 'cs' ? '1 měsíc' : '1 month' },
                          { value: 90, label: lang === 'cs' ? 'Čtvrt roku' : '3 months' },
                          { value: 180, label: lang === 'cs' ? 'Půl roku' : '6 months' },
                          { value: 365, label: lang === 'cs' ? '1 rok' : '1 year' },
                          { value: null, label: lang === 'cs' ? 'Nikdy' : 'Never' },
                        ].map((option) => (
                          <button
                            key={option.value === null ? 'never' : option.value}
                            onClick={() => handleRetentionChange(option.value)}
                            className={`px-4 py-2 text-left text-xs font-mono transition-colors ${
                              retentionDays === option.value
                                ? 'bg-mafia-gold/20 text-mafia-gold'
                                : 'text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Safe Chat Toggle */}
                <button 
                  onClick={() => {
                    const newValue = !autoBlurImages;
                    setAutoBlurImages(newValue);
                    localStorage.setItem('seznamka_safe_chat', newValue.toString());
                  }}
                  className={`ml-2 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${autoBlurImages ? 'bg-blue-900/40 border-blue-500/50 text-blue-400' : 'bg-black/50 border-white/10 text-white/40'}`}
                  title={lang === 'cs' ? 'Přepnout rozmazání fotek (Ochrana)' : 'Toggle Image Blur (Safety)'}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest">{autoBlurImages ? (lang === 'cs' ? 'Ochrana ZAP' : 'Safe ON') : (lang === 'cs' ? 'Ochrana VYP' : 'Safe OFF')}</span>
                </button>

                {/* Toxic Words Filter Toggle */}
                <button 
                  onClick={() => {
                    const newValue = !filterToxicWords;
                    setFilterToxicWords(newValue);
                    localStorage.setItem('seznamka_toxic_filter', newValue.toString());
                  }}
                  className={`ml-2 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${filterToxicWords ? 'bg-green-900/40 border-green-500/50 text-green-400' : 'bg-black/50 border-white/10 text-white/40'}`}
                  title={lang === 'cs' ? 'Přepnout filtr nadávek' : 'Toggle swear word filter'}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest">{filterToxicWords ? (lang === 'cs' ? 'Filtr ZAP' : 'Filter ON') : (lang === 'cs' ? 'Filtr VYP' : 'Filter OFF')}</span>
                </button>
                
                {/* Panic Button */}
                <button 
                  onClick={handlePanic}
                  disabled={isPanicking}
                  className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-red-900/30 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_10px_rgba(239,68,68,0.3)] disabled:opacity-50"
                  title={lang === 'cs' ? 'NOUZOVÉ TLAČÍTKO: Nahlásit a zablokovat uživatele' : 'PANIC BUTTON: Report and block user'}
                >
                  <TriangleAlert size={14} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <AnimatePresence>
                {chatHistory.map((msg, i) => (
                  <motion.div
                    key={msg.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative max-w-[75%] p-3 rounded-2xl group flex flex-col ${
                      msg.sender === 'me' 
                        ? 'bg-mafia-gold/20 border border-mafia-gold/40 text-white self-end rounded-br-none' 
                        : 'bg-white/10 border border-white/5 text-white/80 self-start rounded-bl-none'
                    }`}
                  >
                    {activeChat.accountType === 'property' && msg.sender === 'them' && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20 flex-shrink-0 relative">
                          <Image src={msg.senderPhoto || '/placeholder.jpg'} alt={msg.senderName || 'User'} fill className="object-cover" sizes="20px" />
                        </div>
                        <span className="text-[9px] font-mono font-bold text-mafia-gold uppercase tracking-widest">{msg.senderName || 'Neznámý člen'}</span>
                      </div>
                    )}
                    {/* Reakce Menu (Hover) */}
                    {msg.sender === 'them' && (
                      <div className="absolute -top-10 left-0 bg-mafia-dark border border-mafia-gold/30 rounded-full px-2 py-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
                        {['❤️', '👍', '😂', '🔥', '👀'].map(emoji => (
                          <button key={emoji} onClick={() => {
                            fetch('/api/messages/reaction', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ messageId: msg.id, reaction: msg.reaction === emoji ? null : emoji })
                            }).then(() => fetchMessages(activeChat!));
                          }} className="hover:scale-125 transition-transform text-lg">{emoji}</button>
                        ))}
                      </div>
                    )}

                    {msg.type === 'image' ? (
                      <div className="relative group/img cursor-pointer overflow-hidden rounded-lg" onClick={() => {
                        const newHistory = [...chatHistory];
                        newHistory[i] = { ...msg, isBlurred: !msg.isBlurred };
                        setChatHistory(newHistory);
                      }}>
                        <Image 
                          src={msg.url || '/placeholder.jpg'} 
                          alt="Zpráva s obrázkem" 
                          width={300}
                          height={192}
                          className={`max-w-full h-auto max-h-48 object-cover transition-all duration-300 rounded-lg ${autoBlurImages && msg.isBlurred ? 'blur-md opacity-80' : 'blur-none opacity-100'}`}
                        />
                        {autoBlurImages && msg.isBlurred && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-100 group-hover/img:opacity-0 transition-opacity">
                            <span className="text-white text-[10px] font-mono uppercase tracking-widest bg-black/50 px-2 py-1 rounded">Klikni pro odkrytí</span>
                          </div>
                        )}
                      </div>
                    ) : msg.type === 'audio' ? (
                      <div className="flex items-center gap-2">
                         <span className="text-xl">🎤</span>
                         <audio src={msg.audioUrl} controls className="h-8 w-48" />
                      </div>
                    ) : (
                      <p className="text-sm font-sans">{censorText(msg.text)}</p>
                    )}

                    {/* Zobrazení Reakce */}
                    {msg.reaction && (
                      <div className={`absolute -bottom-3 ${msg.sender === 'me' ? 'left-2' : 'right-2'} bg-black border border-white/10 rounded-full px-1.5 py-0.5 text-xs z-10 shadow-md`}>
                        {msg.reaction}
                      </div>
                    )}

                    {/* Přečteno / Odesláno (Read Receipts) */}
                    {msg.sender === 'me' && (
                      <div className="absolute bottom-1 right-2 text-[8px] flex items-center">
                        <span className={msg.isRead ? "text-blue-400" : "text-white/40"}>
                          {msg.isRead ? '✓✓' : '✓'}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="self-start text-white/50 text-xs font-mono uppercase tracking-widest flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5"
                  >
                    <span>Uživatel píše</span>
                    <span className="flex gap-0.5">
                      <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}>.</motion.span>
                      <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}>.</motion.span>
                      <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}>.</motion.span>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chat Input & First Message Guide */}
            <div className="p-4 border-t border-white/10 bg-black flex-shrink-0 flex flex-col gap-2">
              {chatHistory.length > 0 && !chatHistory.some(m => m.sender === 'me') && (
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-left shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <p className="text-blue-400 font-heading font-black text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Star size={12} className="fill-blue-400" /> První zpráva určuje vše
                  </p>
                  <p className="text-white/70 text-[10px] font-mono leading-relaxed">
                    Místo obyčejného "Ahoj" zkus reagovat na něco konkrétního z profilu (fotku, povahu, icebreaker). 
                    Lidé, kteří to dělají, mají o <span className="text-white font-bold">70% vyšší šanci na odpověď!</span>
                  </p>
                </div>
              )}
              
              <div className="flex gap-2 mb-2 overflow-x-auto pb-1 no-scrollbar">
                <button 
                  onClick={() => {
                    setMessage(lang === 'cs' ? 'Ahoj, nechceš se sejít u nás v MM Barber na kávu? Bude to bezpečné (Safe Spot) a navíc dostaneme odznak Fyzického Ověření!' : 'Hi, wanna meet at MM Barber for coffee? It\'s a Safe Spot and we get a Physical Verification badge!');
                  }}
                  className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/50 rounded-full text-blue-400 transition-colors"
                >
                  <MapPin size={12} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">{lang === 'cs' ? 'Navrhnout Safe Spot' : 'Suggest Safe Spot'}</span>
                </button>
                <button 
                  onClick={() => {
                    setMessage(lang === 'cs' ? 'Odeslán požadavek na fyzické ověření! Až se sejdeme, potvrdíme to a získáme štít.' : 'Physical verification request sent! Once we meet, we\'ll confirm it and get the shield.');
                  }}
                  className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/50 rounded-full text-purple-400 transition-colors"
                >
                  <Camera size={12} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">{lang === 'cs' ? 'Check-in (Ověření)' : 'Check-in (Verify)'}</span>
                </button>
                <button 
                  onClick={() => {
                    setMessage(lang === 'cs' ? 'Ahoj! Jaký jsi měl víkend?' : 'Hi! How was your weekend?');
                  }}
                  className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-green-900/30 hover:bg-green-900/50 border border-green-500/50 rounded-full text-green-400 transition-colors"
                >
                  <span className="text-lg">👋</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest">{lang === 'cs' ? 'Icebreaker: Víkend' : 'Icebreaker: Weekend'}</span>
                </button>
                <button 
                  onClick={() => {
                    setMessage(lang === 'cs' ? 'Kdybys mohl cestovat kamkoliv na světě, kam by to bylo?' : 'If you could travel anywhere, where would it be?');
                  }}
                  className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-500/50 rounded-full text-yellow-400 transition-colors"
                >
                  <span className="text-lg">✈️</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest">{lang === 'cs' ? 'Icebreaker: Cestování' : 'Icebreaker: Travel'}</span>
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title={lang === 'cs' ? "Poslat obrázek" : "Send image"}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <Camera size={18} />
                </button>
                
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage(e);
                  }}
                  placeholder={lang === 'cs' ? 'Napiš zprávu...' : 'Type a message...'}
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-mafia-gold text-white font-sans placeholder-white/30"
                />
                <button 
                  type="button"
                  onClick={handleSpellcheck}
                  title={lang === 'cs' ? "✨ Vylepšit pravopis" : "✨ Spellcheck"}
                  className="w-10 h-10 rounded-full bg-mafia-dark border border-mafia-gold/50 flex items-center justify-center text-mafia-gold hover:bg-mafia-gold hover:text-black transition-colors"
                >
                  <Sparkles size={18} />
                </button>
                <button 
                  type="button"
                  onClick={toggleRecording}
                  title={lang === 'cs' ? (isRecording ? "Zastavit a odeslat nahrávání" : "Nahrát hlasovou zprávu") : (isRecording ? "Stop and send" : "Record audio")}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${isRecording ? 'bg-red-500 text-white border-red-400 animate-pulse' : 'bg-white/5 text-white border-white/10 hover:bg-white/20'}`}
                >
                  <span className="text-xl">🎤</span>
                </button>
                <button 
                  type="submit"
                  disabled={!message.trim()}
                  className="w-10 h-10 rounded-full bg-mafia-gold text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        )}

        {/* Rating Modal */}
        <AnimatePresence>
          {showRatingModal && activeChat && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-mafia-dark border border-mafia-gold/30 rounded-xl p-6 max-w-sm w-full text-center relative"
              >
                <button 
                  onClick={() => setShowRatingModal(false)}
                  className="absolute top-4 right-4 text-white/50 hover:text-white"
                >
                  <X size={20} />
                </button>
                
                <h3 className="text-xl font-heading font-black text-white uppercase tracking-widest mb-2">
                  {lang === 'cs' ? 'Hodnocení Zkušenosti' : 'Experience Rating'}
                </h3>
                <p className="text-sm font-mono text-white/50 mb-6">
                  {lang === 'cs' ? `Jaká je vaše zkušenost s profilem ${activeChat.name}? Tímto budujete systém důvěry.` : `What is your experience with ${activeChat.name}? This builds the trust system.`}
                </p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => handleRate('positive')}
                    className="w-full py-4 rounded-lg bg-green-900/20 border border-green-500/30 flex items-center justify-center gap-3 text-green-400 hover:bg-green-500/10 transition-colors group"
                  >
                    <Heart size={20} className="group-hover:scale-110 transition-transform fill-current" />
                    <span className="font-heading font-bold uppercase tracking-widest">
                      {lang === 'cs' ? 'Pozitivní zkušenost (+ Trust)' : 'Positive experience (+ Trust)'}
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => handleRate('negative')}
                    className="w-full py-4 rounded-lg bg-red-900/20 border border-red-500/30 flex items-center justify-center gap-3 text-red-500 hover:bg-red-500/10 transition-colors group"
                  >
                    <ThumbsDown size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-heading font-bold uppercase tracking-widest text-sm">
                      {lang === 'cs' ? 'Negativní zkušenost (- Trust)' : 'Negative experience (- Trust)'}
                    </span>
                  </button>
                </div>
                
                <p className="text-[10px] font-mono text-white/30 mt-4 px-4">
                  {lang === 'cs' 
                    ? '*Pomáháte budovat bezpečnější komunitu.' 
                    : '*You are helping build a safer community.'}
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
