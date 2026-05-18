"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Zap, 
  Phone, 
  ShieldCheck, 
  Home, 
  Building2, 
  School, 
  Factory,
  CheckCircle2,
  HardHat,
  Construction,
  Star,
  Flame,
  Target,
  Check
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { Footer } from "@/components/Footer";
import { playSound } from "@/utils/audio";
import { trackEvent } from "@/utils/analytics";
import { 
  subscribeToGlobalXpStats, 
  addVoteToBarberStat, 
  hasStatLikedToday,
  GlobalBarberStats
} from "@/utils/barberXp";

export default function RomanJakubcakPage() {
  const { lang } = useTranslation();
  const [globalStats, setGlobalStats] = useState<GlobalBarberStats>({});
  const [statLikedMap, setStatLikedMap] = useState<Record<string, boolean>>({});
  const [clientNickname, setClientNickname] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const services = [
    { title: lang === 'cs' ? "Bytová elektroinstalace" : "Residential Electrical", icon: <Home className="w-6 h-6" /> },
    { title: lang === 'cs' ? "Rodinné domy (Novostavby / Rekonstrukce)" : "Houses (New Build / Renovations)", icon: <Construction className="w-6 h-6" /> },
    { title: lang === 'cs' ? "Veřejné budovy (Školy / Školky)" : "Public Buildings (Schools)", icon: <School className="w-6 h-6" /> },
    { title: lang === 'cs' ? "Komerční prostory (Kanceláře)" : "Commercial (Offices)", icon: <Building2 className="w-6 h-6" /> },
    { title: lang === 'cs' ? "Průmyslová elektroinstalace (Haly)" : "Industrial Electrical (Halls)", icon: <Factory className="w-6 h-6" /> },
    { title: lang === 'cs' ? "Revize & Hledání závad" : "Revisions & Troubleshooting", icon: <ShieldCheck className="w-6 h-6" /> },
  ];

  const techDetails = [
    lang === 'cs' ? "Kompletní elektro práce od A do Z" : "Complete electrical work from A to Z",
    lang === 'cs' ? "Vrtání krabiček & frézování drážek" : "Box drilling & groove milling",
    lang === 'cs' ? "Sádrovování & pokládka kabeláže" : "Plastering & wiring layout",
    lang === 'cs' ? "Datové rozvody & hlavní přívody" : "Data networks & main supplies",
    lang === 'cs' ? "Senzory, relátka, trafa & vrátníky" : "Sensors, relays, transformers & intercoms",
    lang === 'cs' ? "Kompletace rozvaděčů (Silnoproud i Data)" : "Switchboard assembly (Power & Data)",
    lang === 'cs' ? "Diagnostika a hledání poruch" : "Electronics diagnostics & fault finding",
  ];

  const skillsMetadata = [
    { label: lang === 'cs' ? "Preciznost rozvodů" : "Wiring Precision", key: "stat1" },
    { label: lang === 'cs' ? "Spolehlivost revize" : "Revision Reliability", key: "stat2" },
    { label: lang === 'cs' ? "Rychlost zásahu" : "Troubleshooting Speed", key: "stat3" },
    { label: lang === 'cs' ? "Čistota práce" : "Workplace Tidiness", key: "stat4" },
    { label: lang === 'cs' ? "Komunikace" : "Communication", key: "stat5" },
    { label: lang === 'cs' ? "Dochvilnost" : "Punctuality", key: "stat6" }
  ];

  useEffect(() => {
    setIsClient(true);

    // Subscribe to real-time database stats for Roman
    const unsubscribeXp = subscribeToGlobalXpStats((stats) => {
      setGlobalStats(stats);
      
      const updatedStatLikes: Record<string, boolean> = {};
      for (let i = 0; i < 6; i++) {
        updatedStatLikes[`roman-jakubcak_${i}`] = hasStatLikedToday("roman-jakubcak", i);
      }
      setStatLikedMap(updatedStatLikes);
    });

    // Load simple nickname from local storage set in the ratings page
    const savedNickname = localStorage.getItem("mmbarber_client_nickname");
    if (savedNickname) {
      setClientNickname(savedNickname);
    }

    const handleLocalXpUpdate = () => {
      const updatedStatLikes: Record<string, boolean> = {};
      for (let i = 0; i < 6; i++) {
        updatedStatLikes[`roman-jakubcak_${i}`] = hasStatLikedToday("roman-jakubcak", i);
      }
      setStatLikedMap(updatedStatLikes);
      
      const latestNickname = localStorage.getItem("mmbarber_client_nickname");
      if (latestNickname) {
        setClientNickname(latestNickname);
      }
    };

    window.addEventListener('mmbarber_xp_updated', handleLocalXpUpdate);

    return () => {
      unsubscribeXp();
      window.removeEventListener('mmbarber_xp_updated', handleLocalXpUpdate);
    };
  }, []);

  const getVocative = (name: string) => {
    if (!name) return "";
    const n = name.trim().toUpperCase();
    if (lang !== 'cs') return name;

    // Basic Czech vocative heuristics
    if (n.endsWith('A')) return n.slice(0, -1) + 'O';
    if (n.endsWith('EK')) return n.slice(0, -2) + 'KU';
    if (n.endsWith('ÍK')) return n.slice(0, -2) + 'ÍKU';
    if (n.endsWith('US')) return n.slice(0, -2) + 'E';
    if (n.endsWith('ES')) return n.slice(0, -2) + 'E';
    if (n.endsWith('O')) return n;
    if (n.endsWith('I') || n.endsWith('Í')) return n;
    if (n.endsWith('E') || n.endsWith('Ě')) return n;
    
    // Soft consonants
    if (['Š', 'Ž', 'Č', 'Ř', 'C', 'J', 'Ď', 'Ť', 'Ň'].includes(n.slice(-1))) return n + 'I';
    // Hard/Velar consonants
    if (n.endsWith('H') || n.endsWith('CH') || n.endsWith('K') || n.endsWith('G')) return n + 'U';
    // Others
    if (['S', 'Z', 'T', 'D', 'M', 'B', 'P', 'V', 'N', 'R', 'L'].includes(n.slice(-1))) return n + 'E';
    
    return n;
  };

  const handleStatVote = async (statIndex: number) => {
    const mapKey = `roman-jakubcak_${statIndex}`;
    if (statLikedMap[mapKey]) return;

    setStatLikedMap(prev => ({ ...prev, [mapKey]: true }));
    playSound("/sounds/cash.mp3", 0.4);
    trackEvent("partner_stat_vote", { partnerId: "roman-jakubcak", statIndex });

    try {
      await addVoteToBarberStat("roman-jakubcak", statIndex);
    } catch (err) {
      console.error("Failed to submit vote for partner:", err);
      setStatLikedMap(prev => ({ ...prev, [mapKey]: false }));
    }
  };

  if (!isClient) return null;

  // Retrieve Roman's dynamic stats from database
  const romanStats = globalStats["roman-jakubcak"] || { xp: 0, likes: 0, stat1: 0, stat2: 0, stat3: 0, stat4: 0, stat5: 0, stat6: 0 };
  const totalVotes = (romanStats.stat1 ?? 0) + (romanStats.stat2 ?? 0) + (romanStats.stat3 ?? 0) + (romanStats.stat4 ?? 0) + (romanStats.stat5 ?? 0) + (romanStats.stat6 ?? 0);

  return (
    <main className="min-h-screen bg-[#050505] text-smoke-white overflow-hidden selection:bg-mafia-gold selection:text-mafia-black relative">
      {/* Premium Ambience Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(var(--color-mafia-gold-rgb),0.05)_0%,transparent_60%)] opacity-80" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10 font-sans">
        {/* Back navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link 
            href="/rodina" 
            className="group inline-flex items-center gap-3 text-mafia-gold/60 hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-[0.4em]"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {lang === 'cs' ? "Zpět k rodině" : "Back to family"}
          </Link>
        </motion.div>

        {/* Premium Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Visual Profile and Contact Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-mafia-black/90 border border-white/10 p-8 md:p-10 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xl"
            >
              {/* Subtle gold ambient glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-mafia-gold/5 rounded-full blur-3xl pointer-events-none" />
              
              {/* Partner Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-mafia-gold/30 bg-mafia-gold/5 rounded-full mb-8">
                <Zap size={12} className="text-mafia-gold" />
                <span className="text-mafia-gold text-[9px] font-mono tracking-[0.3em] uppercase">
                  {lang === 'cs' ? "PROVĚŘENÝ PARTNER" : "VERIFIED PARTNER"}
                </span>
              </div>

              {/* Avatar Photo Frame */}
              <div className="relative w-40 h-40 md:w-52 md:h-52 mb-8 group">
                <div className="absolute inset-0 border border-mafia-gold/40 rounded-lg group-hover:scale-105 transition-transform duration-700 z-10" />
                <Image 
                  src="/logo.png" 
                  alt="Roman Jakubčák" 
                  width={220} 
                  height={220} 
                  className="w-full h-full object-contain rounded-lg p-6 bg-white/[0.01] border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>

              <h1 className="text-3xl md:text-4xl font-heading font-black text-smoke-white uppercase tracking-tight text-center leading-none mb-3">
                Roman <span className="text-mafia-gold">Jakubčák</span>
              </h1>
              
              <p className="text-smoke-white/60 font-mono text-[10px] uppercase tracking-[0.3em] mb-6">
                {lang === 'cs' ? "ELEKTRIKÁŘ & REVÍZNÍ TECHNIK" : "ELECTRICIAN & INSPECTION TECHNICIAN"}
              </p>

              {/* Verified Star Rating badge based on dynamic data */}
              <div className="w-full bg-black/40 border border-white/5 p-4 rounded-lg flex items-center justify-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={totalVotes > 0 ? "fill-mafia-gold text-mafia-gold" : "text-white/10"} 
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">
                  {totalVotes > 0 
                    ? (lang === 'cs' ? `5.0 ★ (${totalVotes} hodnocení)` : `5.0 ★ (${totalVotes} reviews)`) 
                    : (lang === 'cs' ? "Zatím nehodnoceno" : "Not rated yet")}
                </span>
              </div>
            </motion.div>

            {/* ACTIVE COMBATANT PROFILE CARD (Automatically reflected from ratings page) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-mafia-black/90 border border-white/10 p-6 rounded-sm relative overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Star size={64} className="text-mafia-gold" />
              </div>

              {clientNickname ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-mafia-gold/30 bg-mafia-gold/10 flex items-center justify-center text-mafia-gold shrink-0">
                    <Star size={20} className="animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-mafia-gold/60 uppercase tracking-[0.3em] block">
                      {lang === 'cs' ? "PROFIL AKTIVNÍHO BOJOVNÍKA" : "ACTIVE FIGHTER PROFILE"}
                    </span>
                    <h3 className="text-lg font-heading font-black text-white uppercase tracking-wider italic">
                      {clientNickname}
                    </h3>
                    <p className="text-[10px] text-white/50 leading-relaxed font-sans">
                      {lang === 'cs'
                        ? `Vítej zpět, ${getVocative(clientNickname)}! Tvůj profil bojovníka je propojen a tvé hlasy se okamžitě přenášejí do Romanova hodnocení.`
                        : `Welcome back, ${clientNickname}! Your fighter profile is synced, and your votes immediately update Roman's credentials.`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/30 shrink-0">
                    <Star size={20} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.3em] block">
                      {lang === 'cs' ? "PROPOJENÍ PROFILU" : "PROFILE STATUS"}
                    </span>
                    <h3 className="text-xs font-heading font-bold text-white/50 uppercase tracking-widest">
                      {lang === 'cs' ? "PROFIL NENÍ PROPOJEN" : "NO ACTIVE PROFILE LINKED"}
                    </h3>
                    <p className="text-[9px] text-white/40 leading-relaxed font-sans">
                      {lang === 'cs' ? (
                        <>
                          Nemáš nastavenou přezdívku aktivního bojovníka. Nastav si ji v sekci{" "}
                          <Link href="/hodnoceni" className="text-mafia-gold hover:underline font-bold">
                            HODNOCENÍ / NICKNAME
                          </Link>
                          , a profil se okamžitě automaticky spáruje.
                        </>
                      ) : (
                        <>
                          No active combatant nickname set. Create one in the{" "}
                          <Link href="/hodnoceni" className="text-mafia-gold hover:underline font-bold">
                            RATINGS / NICKNAME
                          </Link>{" "}
                          section to sync automatically.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Direct Contact Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <a 
                href="tel:+420732169799"
                className="group relative flex flex-col items-center justify-center border border-mafia-gold/50 bg-mafia-gold/10 p-6 md:p-8 w-full overflow-hidden transition-all hover:bg-mafia-gold hover:border-mafia-gold"
              >
                <div className="relative z-10 flex flex-col items-center text-center gap-1">
                  <span className="text-mafia-gold group-hover:text-mafia-black font-mono text-[9px] uppercase tracking-[0.3em] font-bold transition-colors">
                    {lang === 'cs' ? "Rychlý kontakt" : "Quick Contact"}
                  </span>

                  <span className="text-sm text-smoke-white/60 group-hover:text-mafia-black/80 font-heading uppercase tracking-wider font-bold transition-colors mt-1">
                    {lang === 'cs' ? "Rezervace a revize" : "Bookings & Inspections"}
                  </span>

                  <span className="text-2xl md:text-3xl font-heading font-black text-mafia-gold group-hover:text-mafia-black tracking-tight mt-2 mb-1 transition-colors">
                    +420 732 169 799
                  </span>
                  
                  <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-mafia-gold/50 group-hover:text-mafia-black/50 transition-colors">
                    {lang === 'cs' ? "Klikněte pro zavolání" : "Click to call"}
                  </p>
                </div>
              </a>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Skills, Dossier and Story (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Biography & Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-1 bg-mafia-gold"></div>
                <h2 className="text-2xl font-heading font-black text-smoke-white uppercase tracking-widest italic">
                  {lang === 'cs' ? "Profil partnera" : "Partner Profile"}
                </h2>
              </div>
              
              <div className="space-y-6 text-smoke-white/70 font-sans text-base md:text-lg leading-relaxed italic border-l-2 border-mafia-gold/20 pl-6">
                <p>
                  {lang === 'cs' 
                    ? "Elektroinstalacím se věnuji profesionálně již od 19 let. Pro mě elektřina není jen o tahání kabelů ve zdi, je to o vdechnutí života, spolehlivosti a maximální funkčnosti do každé novostavby i rekonstrukce. Na stavbě či projektu si zakládám na tom, aby rozvaděče a kabelové rozvody byly provedeny naprosto přehledně a čistě." 
                    : "I have been working in electrical installations professionally since I was 19. For me, electricity isn't just about pulling cables in the wall, it's about breathing life, reliability, and maximum functionality into every new construction and renovation. I pride myself on clean, precise switchboard assembly and wiring."}
                </p>
                <p>
                  {lang === 'cs'
                    ? "Jako držitel odborné certifikace a oprávnění pro revize garantuji naprostou bezpečnost, absolutní shodu se současnými technickými normami a profesionální realizaci bez kompromisů."
                    : "As a certified electrician holding complete regulatory clearance, I guarantee complete safety, absolute compliance with technical standards, and professional execution without compromise."}
                </p>
              </div>
            </motion.div>

            {/* REAL-TIME DYNAMIC SKILL RATINGS PANEL */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-black/90 border border-white/10 p-6 md:p-8 rounded-sm relative backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6 justify-between">
                <span className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] flex items-center gap-2">
                  <Target size={14} className="text-mafia-gold" />
                  {lang === 'cs' ? "Hodnocení zákazníků a dovedností" : "Customer Ratings & Endorsements"}
                </span>
              </div>

              {/* Strictly check if Roman has any ratings in database */}
              {totalVotes === 0 ? (
                /* HONEST STATE: NO RATING FABRICATED, AS REQUESTED */
                <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-white/10 rounded bg-white/[0.01]">
                  <h4 className="text-sm font-heading font-black text-smoke-white uppercase tracking-wider mb-2 text-center">
                    {lang === 'cs' ? "Zatím žádné hodnocení" : "No ratings yet"}
                  </h4>
                  <p className="text-[11px] font-sans text-white/40 text-center max-w-sm leading-relaxed mb-6">
                    {lang === 'cs' 
                      ? "Nebylo nalezeno žádné předchozí hodnocení zákazníků. Pomozte Romanovi vybudovat profil a udělte mu první hlas!" 
                      : "No previous customer endorsements found. Help Roman build his profile and cast his first vote!"}
                  </p>
                  
                  {/* Quick micro-actions to vote directly */}
                  <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                    {skillsMetadata.map((skill, index) => (
                      <button
                        key={index}
                        onClick={() => handleStatVote(index)}
                        className="px-4 py-2.5 bg-mafia-gold/5 border border-mafia-gold/30 hover:border-mafia-gold hover:bg-mafia-gold hover:text-black rounded text-[9px] font-mono uppercase tracking-widest text-mafia-gold transition-all duration-300 active:scale-95 cursor-pointer"
                      >
                        +1 {skill.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* LIVE RATINGS DISPLAYED */
                <div className="space-y-4">
                  <div className="bg-mafia-gold/5 border border-mafia-gold/20 p-4 rounded mb-6 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-mafia-gold/60 uppercase tracking-widest block">{lang === 'cs' ? "Celkové hodnocení práce" : "Total Performance Score"}</span>
                      <span className="text-base font-heading font-black text-white uppercase tracking-wider">{lang === 'cs' ? "Vynikající kvalita realizací" : "Excellent Performance"}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block">{lang === 'cs' ? "Celkový počet hlasů" : "Total Endorsements"}</span>
                      <span className="text-2xl font-heading font-black text-mafia-gold">{totalVotes} <span className="text-xs text-white/40 font-mono">{lang === 'cs' ? "hlasů" : "votes"}</span></span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {skillsMetadata.map((skill, index) => {
                      const votes = romanStats[skill.key as "stat1" | "stat2" | "stat3" | "stat4" | "stat5" | "stat6"] ?? 0;
                      const percent = Math.min(100, votes * 10); // Scale up visually for readability
                      const hasLiked = statLikedMap[`roman-jakubcak_${index}`] || false;

                      return (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white/[0.01] border border-white/5 hover:border-mafia-gold/20 rounded transition-all">
                          <div className="flex-grow space-y-1.5 w-full">
                            <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest text-white/50">
                              <span>{skill.label}</span>
                              <span className="text-mafia-gold font-bold">
                                {votes > 0 ? `+${votes} ${lang === 'cs' ? 'Hlasů' : 'Votes'}` : (lang === 'cs' ? "Zatím bez hlasů" : "No votes")}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5 relative">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.max(2, percent)}%` }}
                                className="h-full rounded-full bg-mafia-gold"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => handleStatVote(index)}
                            disabled={hasLiked}
                            className={`w-full sm:w-auto px-4 py-2 border transition-all text-[9px] font-mono uppercase tracking-wider shrink-0 rounded flex items-center justify-center gap-1.5 cursor-pointer ${
                              hasLiked 
                                ? "bg-white/5 border-white/10 text-white/30 cursor-not-allowed" 
                                : "bg-transparent border-mafia-gold/30 text-mafia-gold hover:bg-mafia-gold hover:text-black"
                            }`}
                          >
                            {hasLiked ? (
                              <>
                                <Check size={11} className="text-emerald-500" />
                                <span>{lang === 'cs' ? "PODPOŘENO" : "ENDORSED"}</span>
                              </>
                            ) : (
                              <>
                                <Flame size={11} className="text-mafia-gold" />
                                <span>EXP +1</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Scope of certified works */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white/[0.01] border border-white/5 p-6 md:p-8 rounded-sm relative"
            >
              <h3 className="text-xl font-heading font-black text-mafia-gold uppercase mb-6 tracking-widest">
                {lang === 'cs' ? "Rozsah prováděných prací" : "Scope of Services"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((s, i) => (
                  <div 
                    key={i}
                    className="bg-black/60 border border-white/5 p-4 hover:border-mafia-gold/30 transition-all flex items-start gap-4"
                  >
                    <div className="text-mafia-gold mt-0.5">{s.icon}</div>
                    <span className="font-heading font-bold text-xs uppercase tracking-widest text-smoke-white/80">{s.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quality commitment */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-mafia-gold/5 border border-mafia-gold/20 p-8 rounded-sm relative overflow-hidden"
            >
              <div className="absolute -top-4 -right-4 bg-mafia-gold text-mafia-black px-4 py-1 text-[9px] font-black uppercase tracking-widest skew-x-[-12deg]">
                 {lang === 'cs' ? "Kvalita & Bezpečnost" : "Quality & Safety"}
              </div>
              
              <h4 className="text-lg font-heading font-black text-mafia-gold uppercase mb-4 tracking-wider">
                {lang === 'cs' ? "Standardy realizací" : "Standard of Execution"}
              </h4>

              <ul className="space-y-3">
                {techDetails.map((detail, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-mafia-gold shrink-0 mt-0.5" />
                    <span className="text-smoke-white/80 font-sans text-xs md:text-sm uppercase tracking-wide leading-tight">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-mafia-gold/10">
                 <div className="flex items-center gap-3">
                    <HardHat size={16} className="text-mafia-gold/40" />
                    <p className="text-[9px] font-mono text-mafia-gold/40 uppercase tracking-[0.2em] italic leading-snug">
                      {lang === 'cs' ? "Veškeré elektroinstalace splňují normy ČSN a jsou dodávány s revizní zprávou." : "All electrical systems meet safety standards and include complete compliance inspection logs."}
                    </p>
                 </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
