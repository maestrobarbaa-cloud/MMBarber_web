"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Plus, Users, Map, CheckCircle2, X, Share2, MessageSquare, Send, Lock } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ShareModal } from "@/components/seznamka/ShareModal";

const REGIONS = [
  "ALL",
  "Hlavní město Praha", "Středočeský kraj", "Jihočeský kraj", "Plzeňský kraj", 
  "Karlovarský kraj", "Ústecký kraj", "Liberecký kraj", "Královéhradecký kraj", 
  "Pardubický kraj", "Kraj Vysočina", "Jihomoravský kraj", "Olomoucký kraj", 
  "Zlínský kraj", "Moravskoslezský kraj",
  "Bratislavský kraj", "Trnavský kraj", "Trenčianský kraj", "Nitranský kraj",
  "Žilinský kraj", "Banskobystrický kraj", "Prešovský kraj", "Košický kraj"
];

const CATEGORIES = [
  { id: "party", name: "Párty & Kluby", emoji: "🍻" },
  { id: "sport", name: "Sport & Aktivity", emoji: "🏃‍♂️" },
  { id: "culture", name: "Kultura & Umění", emoji: "🎭" },
  { id: "chill", name: "Chill & Pokec", emoji: "☕" },
  { id: "trip", name: "Výlet & Příroda", emoji: "🏔️" },
];

export default function AkcePage() {
  const { lang } = useTranslation();
  const { data: session } = useSession();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtry
  const [selectedRegion, setSelectedRegion] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchCity, setSearchCity] = useState("");
  const [debouncedCity, setDebouncedCity] = useState("");
  
  // Modály
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBoardEvent, setActiveBoardEvent] = useState<any>(null);
  const [shareModalEvent, setShareModalEvent] = useState<any>(null);
  
  // Debounce for city search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCity(searchCity);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchCity]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events?region=${encodeURIComponent(selectedRegion)}&category=${encodeURIComponent(selectedCategory)}&city=${encodeURIComponent(debouncedCity)}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedRegion, selectedCategory, debouncedCity]);

  const handleAttend = async (eventId: string, isAttending: boolean) => {
    if (!session) {
      alert(lang === 'cs' ? "Musíte se přihlásit!" : "You must login!");
      return;
    }
    
    try {
      const method = isAttending ? 'DELETE' : 'POST';
      const res = await fetch(`/api/events/${eventId}/attend`, { method });
      if (res.ok) {
        fetchEvents();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = (event: any) => {
    setShareModalEvent(event);
  };

  return (
    <div className="min-h-screen bg-mafia-black text-smoke-white font-mono p-4 md:p-8">
      <div className="fixed inset-0 bg-[url('/img/noise.png')] opacity-20 mix-blend-overlay pointer-events-none z-0"></div>
      
      <div className="max-w-5xl mx-auto relative z-10 pt-20">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/seznamka" className="inline-flex items-center gap-2 text-mafia-gold/60 hover:text-mafia-gold text-sm font-mono uppercase tracking-widest transition-colors">
            <span className="text-xl leading-none">&larr;</span> {lang === 'cs' ? 'Zpět do Rybníku' : 'Back to Pond'}
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-2 flex items-center gap-3">
              {lang === 'cs' ? "Kam vyrazit" : "Where to go"}
              <SparkleIcon />
            </h1>
            <p className="text-smoke-white/50 text-sm uppercase tracking-widest max-w-lg">
              {lang === 'cs' 
                ? "Najdi lidi z okolí. Vyber si kraj, zúčastni se akce nebo vytvoř vlastní. Nezapomeň: Nikdo nechce jít sám."
                : "Find locals. Choose a region, attend an event or create your own."}
            </p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-4 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            <Plus size={18} />
            {lang === 'cs' ? "Nová Akce" : "New Event"}
          </button>
        </div>

        {/* Filters */}
        <div className="bg-black/60 border border-mafia-gold/30 p-5 mb-8 flex flex-col md:flex-row gap-4 shadow-xl backdrop-blur-sm">
          <div className="flex-1">
            <label className="block text-[10px] text-mafia-gold/80 font-bold uppercase tracking-widest mb-2">
              {lang === 'cs' ? "Kraj (Region):" : "Region:"}
            </label>
            <div className="relative">
              <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mafia-gold/50" size={16} />
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-black/80 border border-white/10 px-10 py-3 text-smoke-white text-sm focus:border-mafia-gold focus:ring-1 focus:ring-mafia-gold transition-all appearance-none"
              >
                {REGIONS.map(r => (
                  <option key={r} value={r}>{r === "ALL" ? (lang === 'cs' ? "Celá ČR/SR" : "All Regions") : r}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-[10px] text-mafia-gold/80 font-bold uppercase tracking-widest mb-2">
              {lang === 'cs' ? "Vibe (Kategorie):" : "Vibe (Category):"}
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-black/80 border border-white/10 px-4 py-3 text-smoke-white text-sm focus:border-mafia-gold focus:ring-1 focus:ring-mafia-gold transition-all appearance-none"
            >
              <option value="ALL">{lang === 'cs' ? "Všechny Vibes" : "All Vibes"}</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-[10px] text-mafia-gold/80 font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
              {lang === 'cs' ? "Smart Město:" : "Smart City:"} <span className="text-[8px] bg-mafia-gold/20 text-mafia-gold px-1 rounded">AUTO</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mafia-gold/50" size={16} />
              <input 
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder={lang === 'cs' ? "Zadejte město pro boost..." : "Enter city to boost..."}
                className="w-full bg-black/80 border border-white/10 px-10 py-3 text-smoke-white text-sm focus:border-mafia-gold focus:ring-1 focus:ring-mafia-gold transition-all"
              />
            </div>
          </div>
        </div>

        {/* Events Feed */}
        {loading ? (
          <div className="text-center py-20 text-mafia-gold font-bold uppercase tracking-widest animate-pulse flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-mafia-gold border-t-transparent rounded-full animate-spin"></div>
            {lang === 'cs' ? "Skenuji radar..." : "Scanning radar..."}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-32 border border-white/5 bg-black/40 backdrop-blur-sm">
            <MapPin size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/40 uppercase tracking-widest text-sm mb-4">
              {lang === 'cs' ? "V této oblasti je zatím mrtvo." : "It's dead in this area."}
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-mafia-gold border-b border-mafia-gold pb-1 hover:text-white hover:border-white transition-colors"
            >
              {lang === 'cs' ? "Buď první a vytvoř akci!" : "Be the first to create an event!"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map(event => {
              const myEmail = session?.user?.email;
              const isAttending = event.attendees.some((a: any) => a.user?.email === myEmail);
              const categoryObj = CATEGORIES.find(c => c.id === event.category);
              
              const eventDateObj = new Date(event.eventDate);
              const isToday = new Date().toDateString() === eventDateObj.toDateString();
              
              const currentAttendees = event.attendees.length;
              const isFull = event.maxCapacity && currentAttendees >= event.maxCapacity;

              return (
                <div key={event.id} className="bg-black/60 border border-white/10 hover:border-mafia-gold/50 transition-all duration-300 p-6 group relative overflow-hidden flex flex-col shadow-lg">
                  {/* Category Emoji bg watermark */}
                  <div className="absolute -right-4 -bottom-4 text-[150px] opacity-[0.03] pointer-events-none group-hover:scale-110 group-hover:opacity-[0.06] transition-all duration-500">
                    {categoryObj?.emoji}
                  </div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex gap-2">
                      <div className="px-2 py-1 bg-mafia-gold/10 border border-mafia-gold/30 text-mafia-gold text-[10px] font-bold uppercase tracking-widest">
                        {categoryObj?.name || event.category}
                      </div>
                      {event.isPrivate && (
                        <div className="px-2 py-1 bg-purple-900/40 border border-purple-500/50 text-purple-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                          <Lock size={10} /> {lang === 'cs' ? "Privátní" : "Private"}
                        </div>
                      )}
                    </div>
                    {isToday && (
                      <div className="px-3 py-1 bg-mafia-red text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-pulse">
                        {lang === 'cs' ? "DNES!" : "TODAY!"}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-heading font-black uppercase tracking-wider mb-2 relative z-10 text-white group-hover:text-mafia-gold transition-colors">{event.title}</h3>
                  <p className="text-white/60 text-sm mb-6 line-clamp-3 relative z-10 flex-grow font-sans">{event.description}</p>
                  
                  <div className="space-y-3 mb-6 relative z-10">
                    <div className="flex items-center gap-3 text-sm text-white/80">
                      <Calendar size={16} className="text-mafia-gold" />
                      {eventDateObj.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/80">
                      <MapPin size={16} className="text-mafia-gold" />
                      <span className="font-bold">{event.city ? `${event.city}, ` : ''}</span><span className="text-white/50">{event.region}</span>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="pt-4 border-t border-white/10 mt-auto relative z-10 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Users size={16} className={isFull ? "text-mafia-red" : "text-white/40"} />
                          <span className={`text-sm font-bold ${isFull ? "text-mafia-red" : "text-white/80"}`}>
                            {currentAttendees} {event.maxCapacity ? `/ ${event.maxCapacity}` : ''}
                          </span>
                        </div>
                        {isFull && (
                          <span className="text-[10px] bg-mafia-red/20 text-mafia-red px-2 py-0.5 border border-mafia-red/30 uppercase font-bold tracking-widest">
                            {lang === 'cs' ? "PLNO" : "FULL"}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleShare(event)}
                          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                          title="Sdílet"
                        >
                          <Share2 size={14} />
                        </button>
                        {(isAttending || event.creatorId === session?.user?.email) && (
                           <button 
                             onClick={() => setActiveBoardEvent(event)}
                             className="px-3 h-8 rounded-sm bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                           >
                             <MessageSquare size={14} />
                             {event._count?.messages || 0}
                           </button>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => !isFull || isAttending ? handleAttend(event.id, isAttending) : null}
                      disabled={isFull && !isAttending}
                      className={`w-full py-3 text-sm font-black uppercase tracking-[0.1em] border transition-all flex items-center justify-center gap-2 ${
                        isAttending 
                          ? "bg-mafia-gold/10 border-mafia-gold text-mafia-gold hover:bg-red-500/10 hover:border-red-500 hover:text-red-500" 
                          : isFull 
                            ? "bg-black/50 border-white/5 text-white/20 cursor-not-allowed"
                            : "bg-mafia-gold/90 text-black hover:bg-white border-transparent"
                      }`}
                    >
                      {isAttending ? (
                        <><CheckCircle2 size={16} /> {lang === 'cs' ? "Jdeš tam" : "Attending"}</>
                      ) : isFull ? (
                        <><X size={16} /> {lang === 'cs' ? "Vyprodáno" : "Sold Out"}</>
                      ) : (
                        lang === 'cs' ? "Přidat se!" : "Join!"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* CREATE EVENT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <CreateEventModal 
            onClose={() => setIsModalOpen(false)} 
            onCreated={() => {
              setIsModalOpen(false);
              fetchEvents();
            }} 
          />
        )}
      </AnimatePresence>

      {/* EVENT BOARD MODAL */}
      <AnimatePresence>
        {activeBoardEvent && (
          <EventBoardModal 
            event={activeBoardEvent} 
            onClose={() => setActiveBoardEvent(null)}
          />
        )}
      </AnimatePresence>

      <ShareModal
        isOpen={!!shareModalEvent}
        onClose={() => setShareModalEvent(null)}
        url={shareModalEvent ? `${typeof window !== 'undefined' ? window.location.origin : ''}/seznamka/akce?id=${shareModalEvent.id}` : ''}
        title={shareModalEvent?.title || ''}
        lang={lang}
      />
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-mafia-gold animate-pulse">
      <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="currentColor" />
    </svg>
  );
}

// ==========================================
// CREATE EVENT MODAL
// ==========================================
function CreateEventModal({ onClose, onCreated }: { onClose: () => void, onCreated: () => void }) {
  const { lang } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "party",
    region: REGIONS[1], 
    city: "",
    date: "",
    time: "",
    maxCapacity: "",
    isPrivate: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time) {
      setError(lang === 'cs' ? "Vyplň název, datum a čas." : "Fill title, date and time.");
      return;
    }
    
    const eventDate = new Date(`${form.date}T${form.time}`);
    if (eventDate < new Date()) {
      setError(lang === 'cs' ? "Nemůžeš vytvořit akci v minulosti." : "Cannot create event in the past.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          date: eventDate.toISOString()
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        onCreated();
      } else {
        setError(data.error || "Error");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-mafia-dark border border-mafia-gold/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-mafia-dark/95 backdrop-blur-sm border-b border-white/10 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-wider">
            {lang === 'cs' ? "Vytvořit Akci" : "Create Event"}
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">{lang === 'cs' ? "O co půjde? (Název)" : "Title"}</label>
              <input 
                type="text" 
                value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-mafia-gold focus:outline-none transition-colors"
                placeholder={lang === 'cs' ? "Např. Večerní výběh" : "e.g. Evening Run"}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">{lang === 'cs' ? "Kraj" : "Region"}</label>
                <select 
                  value={form.region} onChange={e => setForm({...form, region: e.target.value})}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-mafia-gold focus:outline-none transition-colors"
                >
                  {REGIONS.filter(r => r !== "ALL").map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">{lang === 'cs' ? "Město" : "City"}</label>
                <input 
                  type="text" 
                  value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-mafia-gold focus:outline-none transition-colors"
                  placeholder="Praha..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">{lang === 'cs' ? "Kategorie" : "Category"}</label>
                <select 
                  value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-mafia-gold focus:outline-none transition-colors"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">{lang === 'cs' ? "Kapacita (volitelně)" : "Capacity (opt)"}</label>
                <input 
                  type="number" 
                  min="2" max="1000"
                  value={form.maxCapacity} onChange={e => setForm({...form, maxCapacity: e.target.value})}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-mafia-gold focus:outline-none transition-colors"
                  placeholder={lang === 'cs' ? "Neomezeno" : "No limit"}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">{lang === 'cs' ? "Datum" : "Date"}</label>
                <input 
                  type="date" 
                  value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white text-sm focus:border-mafia-gold focus:outline-none transition-colors"
                />
              </div>
              <div className="w-1/3">
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">{lang === 'cs' ? "Čas" : "Time"}</label>
                <input 
                  type="time" 
                  value={form.time} onChange={e => setForm({...form, time: e.target.value})}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white text-sm focus:border-mafia-gold focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">{lang === 'cs' ? "Detaily akce" : "Description"}</label>
              <textarea 
                value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-mafia-gold focus:outline-none resize-none h-24 font-sans text-sm transition-colors"
                placeholder={lang === 'cs' ? "Kde se sejdeme, co s sebou..." : "Details here..."}
              ></textarea>
            </div>
          </div>

          {error && <div className="text-mafia-red text-xs bg-mafia-red/10 p-3 border border-mafia-red/30 uppercase tracking-widest font-bold text-center">{error}</div>}

          <button 
            disabled={loading}
            className="w-full py-4 bg-mafia-gold text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-colors shadow-[0_0_15px_rgba(197,160,89,0.3)]"
          >
            {loading ? "ZPRACOVÁVÁM..." : (lang === 'cs' ? "VYTVOŘIT A POZVAT" : "PUBLISH EVENT")}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ==========================================
// EVENT BOARD (CHAT) MODAL
// ==========================================
function EventBoardModal({ event, onClose }: { event: any, onClose: () => void }) {
  const { lang } = useTranslation();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/events/${event.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, [event.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`/api/events/${event.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage })
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-0 md:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-mafia-dark border-l border-white/10 shadow-2xl relative w-full md:w-[450px] h-full flex flex-col z-10"
      >
        <div className="p-6 border-b border-white/10 bg-black/50 flex justify-between items-center">
          <div>
            <h3 className="text-mafia-gold font-black uppercase tracking-widest text-lg">{event.title}</h3>
            <p className="text-white/50 text-[10px] uppercase tracking-widest">
              {lang === 'cs' ? "Diskuze k akci" : "Event Board"}
            </p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white p-2">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="text-center text-white/30 uppercase text-xs tracking-widest animate-pulse">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare size={32} className="mx-auto text-white/10 mb-4" />
              <p className="text-white/40 uppercase text-xs tracking-widest">
                {lang === 'cs' ? "Buď první, kdo něco napíše." : "Be the first to say hi."}
              </p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-mafia-gold/20 border border-mafia-gold/50 flex items-center justify-center text-mafia-gold flex-shrink-0 text-xs font-bold uppercase overflow-hidden">
                  {msg.user?.image ? (
                    <img src={msg.user.image} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    msg.user?.name?.charAt(0) || "U"
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{msg.user?.name || 'Unknown'}</span>
                    <span className="text-[10px] text-white/40">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="text-white/70 text-sm font-sans bg-black/40 p-3 rounded-r-xl rounded-bl-xl border border-white/5 inline-block">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-black border-t border-white/10">
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input 
              type="text" 
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder={lang === 'cs' ? "Napiš něco k akci..." : "Type something..."}
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-mafia-gold focus:bg-white/10 transition-all pr-12"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute right-1 top-1 w-10 h-10 bg-mafia-gold rounded-full flex items-center justify-center text-black disabled:opacity-50 disabled:bg-white/10 disabled:text-white/30 transition-all hover:scale-105"
            >
              <Send size={16} className="ml-1" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
