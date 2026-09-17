"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "@/components/OptimizedImage";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useBarbers } from "@/contexts/BarberContext";
import { useGame } from "@/contexts/GameContext";
import { useUI } from "@/contexts/UIContext";
import { playSound } from "@/utils/audio";
import { trackEvent } from "@/utils/analytics";
import { useTranslation } from "@/hooks/useTranslation";
import { Footer } from "@/components/Footer";
import { 
  subscribeToGlobalXpStats, 
  calculateLevelFromXp, 
  getCzechRankFromLevel, 
  getEnglishRankFromLevel,
  GlobalBarberStats 
} from "@/utils/barberXp";
import { getDailyRole } from "@/utils/dailyRoles";
import { getNicknamesAction, addNicknameVoteAction, NicknamesDB } from "@/app/actions/nicknames";
import { 
  ArrowLeft, 
  Sparkles, 
  Award, 
  Star, 
  Calendar, 
  Layers, 
  Sliders, 
  Pocket, 
  CheckCircle2, 
  RefreshCw,
  Compass,
  Share2
} from "lucide-react";
import { TomasSkillTree } from "@/components/TomasSkillTree";
import { HiddenSeoArchive } from "@/components/HiddenSEOArchive";
import { InteractiveParticles } from "@/components/InteractiveParticles";
import { AnimusDNA3D } from "@/components/AnimusDNA3D";

export default function BiographiesPage() {
  const { graphicsTier } = useUI();
  const { lang } = useTranslation();
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [previewBarberId, setPreviewBarberId] = useState<string | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalBarberStats>({});
  const { barbers, loading } = useBarbers();
  const { isTomasUnlocked, isNellaUnlocked, totalCollected } = useGame();
  
  const [isBloodMode, setIsBloodMode] = useState(false);
  const [isNoirMode, setIsNoirMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      if (typeof document !== 'undefined') {
        setIsBloodMode(document.documentElement.classList.contains('theme-blood') || document.documentElement.classList.contains('mode-blood'));
        setIsNoirMode(document.documentElement.classList.contains('noir-mode'));
      }
    };
    checkTheme();
    
    if (typeof document !== 'undefined') {
      const observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }
  }, []);
  
  // Custom names overrides from localStorage
  const [customTomasName, setCustomTomasName] = useState("Tomáš");
  const [customNellaName, setCustomNellaName] = useState("Nella");
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [showUnlockOverlay, setShowUnlockOverlay] = useState(false);

  const [nicknamesDb, setNicknamesDb] = useState<NicknamesDB | null>(null);
  const [newNickname, setNewNickname] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isExtendedUnlocked, setIsExtendedUnlocked] = useState(false);
  const [secretContent, setSecretContent] = useState("");
  const [activeTomasQuote, setActiveTomasQuote] = useState("");

  const tomasQuotes = [
    { cs: "Já nerozhoduji o osudu. Já ho píšu.", en: "I don't decide fate. I write it.", la: "Ego de fato non decerno. Ego id scribo." },
    { cs: "Největší věci se nestaví slovy. Staví se v tichu.", en: "The greatest things aren't built with words. They are built in silence.", la: "Maximae res verbis non struuntur. In silentio aedificantur." },
    { cs: "Mlčím ne proto, že nemám co říct. Mlčím, protože pracuji na tom, co ostatní teprve pochopí.", en: "I am silent not because I have nothing to say. I am silent because I'm working on what others have yet to understand.", la: "Taceo non quia nihil dicere habeo. Taceo quia id ago quod alii mox intellegent." },
    { cs: "Mlčení není prázdnota. Je to prostor, ve kterém vznikají věci, o kterých se jednou bude mluvit.", en: "Silence is not emptiness. It's the space where things are created that will one day be talked about.", la: "Silentium non est inane. Spatium est ubi res creantur de quibus olim dicetur." },
    { cs: "Nechte ostatní mluvit. Já mám práci.", en: "Let others talk. I have work to do.", la: "Sinite alios loqui. Ego opus habeo." },
    { cs: "Nemluvím o tom, co přijde. Konám tak, aby to přišlo.", en: "I don't talk about what's coming. I act so that it comes.", la: "Non loquor de eo quod veniet. Ago ut veniat." },
    { cs: "Nejtišší muž u stolu bývá často ten, kterého by ostatní měli poslouchat nejvíc.", en: "The quietest man at the table is often the one others should listen to the most.", la: "Vir quietissimus ad mensam saepe is est quem alii maxime audire debent." },
    { cs: "Nikdy neukazuj světu, co buduješ. Až to uvidí, už bude pozdě.", en: "Never show the world what you are building. By the time they see it, it will be too late.", la: "Numquam ostende mundo quid aedifices. Cum videbunt, iam sero erit." },
    { cs: "Naši předkové nepotřebovali vysvětlovat své jméno. Historie to udělala za ně.", en: "Our ancestors didn't need to explain their name. History did it for them.", la: "Maiores nostri nomen suum explicare non egebant. Historia pro eis id fecit." },
    { cs: "Nemusím nikomu dokazovat, kdo jsem. Moji předkové to dokázali už dávno.", en: "I don't have to prove who I am to anyone. My ancestors proved it long ago.", la: "Nemini probare debeo quis sim. Maiores mei id iam pridem probaverunt." },
    { cs: "Život naučí člověka všechno. Jen každého jiným způsobem.", en: "Life teaches a man everything. Just each in a different way.", la: "Vita hominem omnia docet. Sed unumquemque alio modo." },
    { cs: "Život je učitel, který nikdy neopakuje lekci.", en: "Life is a teacher that never repeats a lesson.", la: "Vita magister est qui lectionem numquam repetit." },
    { cs: "Čas naučí to, co mládí nechce slyšet.", en: "Time teaches what youth doesn't want to hear.", la: "Tempus docet id quod iuventus audire non vult." },
    { cs: "Každá chyba něco stojí. Každá zkušenost má svou cenu.", en: "Every mistake costs something. Every experience has its price.", la: "Omnis error aliquid constat. Omnis experientia pretium suum habet." },
    { cs: "Život člověka nezkouší proto, aby ho zlomil, ale aby ukázal, z čeho je.", en: "Life tests a man not to break him, but to show what he is made of.", la: "Vita hominem non probat ut eum frangat, sed ut ostendat ex quo sit." },
    { cs: "Člověk se nenarodí moudrý. Moudrým se stává tím, co přežije.", en: "A man is not born wise. He becomes wise through what he survives.", la: "Homo sapiens non nascitur. Sapiens fit per ea quae superat." },
    { cs: "To, co tě dnes bolí, tě zítra naučí, komu věřit.", en: "What hurts you today will teach you who to trust tomorrow.", la: "Quod te hodie laedit, cras te docebit cui credas." },
    { cs: "Nejtěžší lekce života bývají ty, které si člověk zapamatuje navždy.", en: "The hardest lessons in life are the ones a man remembers forever.", la: "Gravissimae vitae lectiones eae sunt quas homo in aeternum meminit." },
    { cs: "Čas prověří každého. Jméno prověří staletí.", en: "Time tests everyone. A name is tested by centuries.", la: "Tempus omnes probat. Nomen saecula probant." },
    { cs: "Některé lekce se dědí. Jiné se musí prožít.", en: "Some lessons are inherited. Others must be lived.", la: "Quaedam lectiones hereditate relinquuntur. Aliae vivendae sunt." },
    { cs: "Čest se neříká. Čest se dědí, žije a předává.", en: "Honor isn't spoken. Honor is inherited, lived, and passed down.", la: "Honor non dicitur. Honor hereditate accipitur, vivitur et traditur." },
    { cs: "Život tě naučí všemu. Nejprve tě ale naučí, komu nemáš věřit.", en: "Life will teach you everything. But first, it will teach you who not to trust.", la: "Vita te omnia docebit. Sed primum te docebit cui non credas." },
    { cs: "Život člověka naučí mlčet. Čas ho naučí, proč.", en: "Life teaches a man to be silent. Time teaches him why.", la: "Vita hominem tacere docet. Tempus eum docet cur." },
    { cs: "Každý muž jednou pochopí, že největší lekce mu nedali učitelé, ale lidé, kteří ho zklamali.", en: "Every man will eventually understand that his greatest lessons didn't come from teachers, but from the people who disappointed him.", la: "Omnis vir aliquando intelleget maximas lectiones non a magistris, sed a decepturis datas esse." },
    { cs: "Život tě naučí, že ne každá prohra je porážka a ne každé vítězství je výhra.", en: "Life will teach you that not every loss is a defeat, and not every victory is a win.", la: "Vita te docebit non omnem cladem esse ruinam nec omnem victoriam esse triumphum." },
    { cs: "Život tě naučí všechno, co potřebuješ vědět. Jen některé lekce pochopíš až příliš pozdě.", en: "Life will teach you everything you need to know. You'll just understand some lessons too late.", la: "Vita te docebit omnia quae scire debes. Sed quasdam lectiones nimis sero intelleges." },
    { cs: "Nejhlasitější lidé často nemají co říct.", en: "The loudest people often have nothing to say.", la: "Homines clamosissimi saepe nihil dicere habent." },
    { cs: "Někteří ukazují světu každý svůj krok. My jsme se naučili, že ty nejdůležitější kroky se dělají v tichosti.", en: "Some show the world every step they take. We learned that the most important steps are taken in silence.", la: "Quidam mundo omnem gressum suum ostendunt. Nos didicimus gravissimos gressus in silentio fieri." },
    { cs: "Kdo má skutečnou hodnotu, nepotřebuje ji vystavovat.", en: "He who has true value doesn't need to display it.", la: "Qui verum valorem habet, eum ostentare non eget." },
    { cs: "Výstřednost přitahuje oči. Charakter přitahuje respekt.", en: "Eccentricity attracts eyes. Character attracts respect.", la: "Eccentricitas oculos trahit. Mores respectum trahunt." }
  ];

  // Unikátní karetní systém pro pokládání otázek (Latina -> Čeština/Angličtina)
  const tomasCards = [
    { 
      suit: "♠", value: "A", name_cs: "PIKOVÉ ESO", name_en: "ACE OF SPADES", 
      q_cs: "Co děláš s těmi, co nedrží slovo?", q_en: "What do you do with those who break their word?", q_la: "Quid agis cum iis qui verbum non tenent?",
      a_cs: "Dám jim šanci odejít. Pokud ji nevyužijí... už o nich nikdo neuslyší.",
      a_en: "I give them a chance to leave. If they don't take it... no one will ever hear from them again.",
      a_la: "Do illis occasionem abeundi. Si eam non capiunt... nemo de illis audiet." 
    },
    { 
      suit: "♣", value: "K", name_cs: "KŘÍŽOVÝ KRÁL", name_en: "KING OF CLUBS", 
      q_cs: "Jakou cenu má věrnost?", q_en: "What is the price of loyalty?", q_la: "Quod est pretium fidei?",
      a_cs: "Věrnost se nedá koupit penězi. Tu si musíš zasloužit krví a časem.",
      a_en: "Loyalty cannot be bought with money. You must earn it with blood and time.",
      a_la: "Fides pecunia emi non potest. Sanguine et tempore merenda est." 
    },
    { 
      suit: "♥", value: "J", name_cs: "SRDCOVÝ SPODEK", name_en: "JACK OF HEARTS", 
      q_cs: "Děláš někdy výjimky z pravidel?", q_en: "Do you ever make exceptions to the rules?", q_la: "Facisne umquam exceptiones a regulis?",
      a_cs: "Pravidla drží tenhle svět pohromadě. Kdo je poruší, padá. Žádné výjimky.",
      a_en: "Rules hold this world together. Whoever breaks them, falls. No exceptions.",
      a_la: "Regulae hunc mundum continent. Qui eas frangit, cadit. Nulla exceptio." 
    },
    { 
      suit: "♦", value: "Q", name_cs: "KÁROVÁ DÁMA", name_en: "QUEEN OF DIAMONDS", 
      q_cs: "Co je tvá největší slabina?", q_en: "What is your greatest weakness?", q_la: "Quae est tua maxima infirmitas?",
      a_cs: "Slabiny mají jen ti, kteří se bojí něco ztratit. Já už jsem obětoval vše.",
      a_en: "Only those who fear losing something have weaknesses. I have already sacrificed everything.",
      a_la: "Infirmitates habent tantum qui aliquid amittere timent. Ego iam omnia sacrificavi." 
    }
  ];

  const [secretArticles, setSecretArticles] = useState<any[]>([]);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [activeTomasQuoteCz, setActiveTomasQuoteCz] = useState("");
  const [isTomasTranslated, setIsTomasTranslated] = useState(false);
  const [interrogationMode, setInterrogationMode] = useState<'cards' | 'envelope' | null>(null);

  // Select quote randomly on page load and when previewing
  useEffect(() => {
    if (previewBarberId === 'tomas' || previewBarberId === null) {
      const randomQuote = tomasQuotes[Math.floor(Math.random() * tomasQuotes.length)];
      setActiveTomasQuote(randomQuote.la);
      setActiveTomasQuoteCz(lang === 'en' ? randomQuote.en : randomQuote.cs);
      setIsTomasTranslated(false);
      
      if (previewBarberId === 'tomas') {
        // Zaručené střídání obálky a karet, aby si uživatel obojího užil
        setInterrogationMode(prev => prev === 'envelope' ? 'cards' : 'envelope');
      }
    }
  }, [lang, previewBarberId]);

  // The sand/dust effect is now handled purely by framer-motion stagger, 
  // so we don't need the setInterval slice logic anymore.
  // We just use activeTomasQuote directly in the render.

  const [isUnlockingArticle, setIsUnlockingArticle] = useState(false);
  
  // New State for Folders
  const [activeFolderId, setActiveFolderId] = useState('main_bio');
  
  // Cheat Code State
  const [cheatUnlocked, setCheatUnlocked] = useState(false);

  const parseSecretText = (text: string) => {
    const parts = text.split('\n');
    return parts.map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h5 key={i} className="text-mafia-gold font-heading font-black uppercase tracking-widest mb-2 mt-4 italic">{line.replace(/\*\*/g, '')}</h5>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 mb-1 list-disc text-white/80">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2"></div>;
      }
      return <p key={i} className="mb-2 leading-relaxed text-smoke-white/90">{line}</p>;
    });
  };

  const handleUnlock = async () => {
    if (!passwordInput.trim() || isUnlocking) return;
    setIsUnlocking(true);
    try {
      const res = await fetch('/api/cv-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unlock', password: passwordInput.toUpperCase(), lang })
      });
      const data = await res.json();
      if (data.success) {
        setSecretContent(data.text);
        setSecretArticles(data.articles || []);
        setIsExtendedUnlocked(true);
        setShowPasswordModal(false);
        playSound("/sounds/reload.mp3", 0.4);
      } else {
        if (data.error === 'expired_password') {
          alert(lang === 'cs' ? "Toto heslo již vypršelo." : "This password has expired.");
        } else {
          alert(lang === 'cs' ? "Přístup odepřen: Neplatné nebo expirované heslo." : "Access Denied: Invalid or expired password.");
        }
      }
    } catch (e) {
      alert("Chyba spojení.");
    }
    setIsUnlocking(false);
  };

  const fetchNicknames = useCallback(async () => {
    try {
      const db = await getNicknamesAction();
      setNicknamesDb(db);
      if (db.tomas?.topNickname) setCustomTomasName(db.tomas.topNickname);
      if (db.nella?.topNickname) setCustomNellaName(db.nella.topNickname);
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchNicknames();
    // Poll for nickname updates every 10 seconds
    const interval = setInterval(fetchNicknames, 10000);

    // Subscribe to global stats
    const unsubscribeXp = subscribeToGlobalXpStats((stats) => {
      setGlobalStats(stats);
    });

    const fetchVisibility = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          const parsed: Record<string, boolean> = {};
          if (data.values) {
            Object.entries(data.values).forEach(([key, val]) => {
              const v = String(val).toLowerCase();
              parsed[key] = !(v === 'false' || v === 'skryté' || v === 'hidden');
            });
          }
          setVisibility(parsed);
        }
      } catch (e) {}
    };
    fetchVisibility();

    return () => {
      clearInterval(interval);
      unsubscribeXp();
    };
  }, [fetchNicknames]);

  const isTomasVisible = visibility['visibility_barber_tomas'] ?? true;
  const isNellaVisible = visibility['visibility_barber_nella'] ?? true;

  // Calculate dynamic rating based on real community feedback in firebase
  const getBarberRatingData = (barberId: string) => {
    const stats = globalStats[barberId] || { xp: 0, likes: 0, stat1: 0, stat2: 0, stat3: 0, stat4: 0, stat5: 0, stat6: 0 };
    const likes = stats.likes || 0;
    
    // Sum up the dynamic attribute ratings cast by users
    const totalStatVotes = (stats.stat1 || 0) + (stats.stat2 || 0) + (stats.stat3 || 0) + (stats.stat4 || 0) + (stats.stat5 || 0) + (stats.stat6 || 0);
    const overallActions = likes + totalStatVotes;

    // Start with high baseline to look professional (e.g. 4.8), then scale organically up to 4.98 based on user likes
    const starScore = Math.min(5.0, 4.8 + Math.min(0.2, likes * 0.005));
    
    return {
      stars: starScore.toFixed(2),
      actionsCount: overallActions,
      likesCount: likes
    };
  };

  const handleSelectBarber = (id: string) => {
    setSelectedBarberId(id);
    playSound("/sounds/reload.mp3", 0.4);
    trackEvent("biography_select", { barberId: id });
  };

  const handlePreviewBarber = (id: string) => {
    setPreviewBarberId(id);
    playSound("/sounds/click.mp3", 0.4);
  };


  const handleBackToSelection = () => {
    setSelectedBarberId(null);
    playSound("/sounds/click.mp3", 0.2);
  };

  const handleVoteNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNickname.trim() || !activeBarberSafe.id) return;
    setIsVoting(true);
    const res = await addNicknameVoteAction(activeBarberSafe.id as 'tomas' | 'nella', newNickname);
    if (res.success) {
      setNewNickname("");
      fetchNicknames();
      // Optional: show a small success message or play a sound
      playSound("/sounds/click.mp3", 0.4);
    } else {
      alert(res.error || "Chyba při hlasování.");
    }
    setIsVoting(false);
  };

  const isTomasFullyUnlocked = true; // was: isTomasUnlocked || cheatUnlocked;
  const isNellaFullyUnlocked = true; // was: isNellaUnlocked || cheatUnlocked;
  const effectiveTotalCollected = 10; // was: cheatUnlocked ? 99 : totalCollected;
  
  // Need activeBarber safe fallback early if loading is done
  const activeBarberTemp = barbers.find(b => b.id === selectedBarberId) || barbers[0] || { id: "tomas" };
  const isFullyUnlockedTemp = activeBarberTemp.id === "tomas" ? isTomasFullyUnlocked : (activeBarberTemp.id === "nella" ? isNellaFullyUnlocked : false);

  useEffect(() => {
    if (selectedBarberId && isFullyUnlockedTemp) {
      const shownKey = `mmbarber_unlock_shown_${selectedBarberId}`;
      if (!sessionStorage.getItem(shownKey)) {
        setShowUnlockOverlay(true);
        sessionStorage.setItem(shownKey, 'true');
        setTimeout(() => setShowUnlockOverlay(false), 2500);
      }
    }
  }, [selectedBarberId, isFullyUnlockedTemp]);

  if (loading || barbers.length === 0) return null;

  // Find currently active chosen barber
  const activeBarber = barbers.find(b => b.id === selectedBarberId);
  const activeBarberSafe = activeBarber || barbers[0];
  const activeCustomName = activeBarberSafe.id === "tomas" ? customTomasName : customNellaName;

  const activeStats = globalStats[activeBarberSafe.id] || { xp: 0 };
  const activeLevel = calculateLevelFromXp(activeStats.xp);
  const activeRank = lang === 'cs' 
    ? getCzechRankFromLevel(activeLevel, activeBarberSafe.id === "nella") 
    : getEnglishRankFromLevel(activeLevel);

  const activeRating = getBarberRatingData(activeBarberSafe.id);

  const isPhotoUnlocked = true;
  const isFullyUnlocked = true;
  
  // Calculate how many text parts to show
  // Fallback to match to avoid Safari syntax error on lookbehinds
  const textParts = activeBarberSafe.desc.match(/.*?[.?!](?:\s+|$)|.+/g)?.map(s => s.trim()) || [activeBarberSafe.desc];
  let textPartsToShow = textParts.length;
  
  const visibleText = textParts.slice(0, textPartsToShow).join(' ');
  const hiddenText = textParts.slice(textPartsToShow).join(' ');

  return (
    <main 
      className="min-h-screen bg-[#050505] text-smoke-white overflow-x-hidden selection:bg-mafia-gold selection:text-mafia-black relative flex flex-col justify-between"
      onClick={() => {
        if (previewBarberId) {
          setPreviewBarberId(null);
          const burstX = window.innerWidth <= 768 ? window.innerWidth / 2 : window.innerWidth * 0.35;
          const burstY = window.innerHeight * 0.45;
          window.dispatchEvent(new CustomEvent('particle-burst', { detail: { x: burstX, y: burstY } }));
        }
      }}
    >
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(var(--color-mafia-gold-rgb),0.03)_0%,transparent_60%)] opacity-80" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
        
        {/* Floating Sparks/Particles that interact with mouse */}
        <InteractiveParticles />
      </div>

      {/* Header section */}
      <header className="w-full py-6 px-8 border-b border-white/5 flex justify-between items-center z-50 backdrop-blur-md bg-mafia-black/80 sticky top-0">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2.5 text-white/50 hover:text-mafia-gold transition-colors font-mono text-[9px] uppercase tracking-[0.4em]"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>{lang === 'cs' ? "Zpět na základnu" : "Back Home"}</span>
        </Link>
        <span className="font-heading font-black text-base tracking-[0.3em] text-mafia-gold logo-neon">MMBARBER</span>
      </header>

      {/* Main Container */}
      <div className={`flex-grow mx-auto w-full px-4 md:px-6 py-12 md:py-16 z-10 flex flex-col justify-start gap-12 ${selectedBarberId && activeBarberSafe.id === 'tomas' ? 'max-w-[1800px] w-[95vw]' : 'max-w-6xl'}`}>
        
        <AnimatePresence mode="wait">
          {!selectedBarberId ? (
            /* SELECTION GRID MODE */
            <motion.div
              key="selection-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Title Block */}
              <div className="text-center space-y-4 max-w-xl mx-auto">
                <span className="text-mafia-gold text-[10px] font-mono tracking-[0.4em] uppercase block">
                  {lang === 'cs' ? "STRUKTURA A ROLE" : "STRUCTURE AND ROLES"}
                </span>
                <h1 className="text-4xl md:text-5xl font-heading font-black text-smoke-white uppercase tracking-tight leading-none">
                  {lang === 'cs' ? "HIERARCHIE V RODINĚ" : "FAMILY HIERARCHY"}
                </h1>
                <p className="text-xs text-white/40 leading-relaxed max-w-sm mx-auto">
                  {lang === 'cs'
                    ? "Vyberte si složku jednoho z našich operativců pro detailní taktický životopis, přehled dovedností a hodnocení."
                    : "Select a profile folder for an in-depth dossier covering tactical backgrounds, community reviews, and combat skills."}
                </p>
              </div>

              {/* Fragment Warning */}
              {totalCollected < 10 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-2xl mx-auto border border-mafia-gold/50 bg-mafia-gold/10 p-6 rounded-sm text-center shadow-[0_0_20px_rgba(197,160,89,0.15)] flex flex-col items-center gap-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mafia-gold/80 to-transparent"></div>
                  <Compass className="text-mafia-gold animate-pulse" size={28} />
                  <h3 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-lg md:text-xl">
                    {lang === 'cs' ? "ZKOMPLETUJTE ŽIVOTOPISY" : "COMPLETE THE BIOGRAPHIES"}
                  </h3>
                  <p className="text-xs md:text-sm font-mono text-smoke-white/90 leading-relaxed max-w-lg mx-auto">
                    {lang === 'cs' 
                      ? "Některá data jsou stále zašifrována. Běžte na hlavní stránku, hledejte skryté otisky prstů (fragmenty) a postupně odemykejte plné profily operativců!" 
                      : "Some data is still encrypted. Go to the homepage, find hidden fingerprints (fragments), and gradually unlock full operative profiles!"}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 border border-mafia-gold/30 bg-mafia-black px-4 py-2 rounded-sm text-[10px] font-mono text-mafia-gold uppercase tracking-[0.3em]">
                    {lang === 'cs' ? `Nalezeno fragmentů: ${effectiveTotalCollected} / 10` : `Fragments found: ${effectiveTotalCollected} / 10`}
                  </div>
                </motion.div>
              )}

              {/* Central Hierarchy Layout */}
              <div className="w-full max-w-5xl mx-auto flex flex-col items-center relative py-12 px-4">
                
                {/* LEVEL 1: Boss (Tomáš) */}
                {isTomasVisible && (
                  <div className="w-full flex justify-center relative z-20 mb-8 md:mb-16">
                    {(() => {
                      const isTomasHierarchyUnlocked = effectiveTotalCollected >= 1;
                      
                      if (!isTomasHierarchyUnlocked) {
                        return (
                          <div className="flex flex-col items-center opacity-60">
                             <div className="w-64 h-[400px] md:h-[600px] bg-black border border-mafia-gold/30 rounded-md flex flex-col items-center justify-center">
                               <span className="text-6xl font-heading font-black text-mafia-gold/20 italic animate-pulse">?</span>
                               <span className="text-mafia-gold/40 text-[10px] font-mono mt-4">DATA ENCRYPTED</span>
                             </div>
                          </div>
                        );
                      }
                      
                      const hour = new Date().getHours();
                      const jacketSrc = (hour >= 6 && hour < 18) ? '/hierarchie/tomáš-sako-den.png' : '/hierarchie/tomáš-sako-večer.png';
                      const isPreviewActive = previewBarberId === 'tomas';

                      return (
                        <div className="relative flex flex-col items-center">
                           <div 
                             onClick={(e) => { e.stopPropagation(); handlePreviewBarber("tomas"); }}
                             className={`relative cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none focus:outline-none select-none ${isPreviewActive ? 'scale-105 md:scale-110 z-30' : 'hover:scale-105 z-10'}`}
                             style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                           >
                             <Image 
                               src={jacketSrc}
                               alt="Tomáš"
                               width={600}
                               height={800}
                               priority={true}
                               draggable={false}
                               style={{ border: 'none', outline: 'none', background: 'transparent' }}
                               className={`object-contain w-full max-w-[220px] md:max-w-[300px] lg:max-w-[350px] h-auto transition-all duration-500 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] text-transparent border-none outline-none focus:outline-none ${isPreviewActive ? (isBloodMode ? 'drop-shadow-[0_0_15px_rgba(200,16,46,0.5)]' : isNoirMode ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]') + ' scale-[1.02]' : ''} ${isBloodMode ? 'grayscale sepia-[1] hue-rotate-[320deg] saturate-[5]' : isNoirMode ? 'grayscale' : ''}`}
                             />
                           </div>

                           {/* Citáty po levé straně s luxusním efektem a interaktivním Q&A */}
                           <AnimatePresence>
                             {isPreviewActive && activeTomasQuote && (
                               <motion.div 
                                 initial={{ opacity: 0, filter: 'blur(10px)' }}
                                 animate={{ opacity: 1, filter: 'blur(0px)' }}
                                 exit={{ opacity: 0, filter: 'blur(10px)' }}
                                 transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                 className="absolute top-[15%] lg:top-[25%] left-[-40px] md:left-[-220px] lg:left-[-320px] flex flex-col items-end z-40 w-[240px] md:w-[320px]"
                               >
                                  <div className="relative w-full">
                                    {interrogationMode === 'envelope' ? (
                                      /* REŽIM: OBÁLKA (DOSSIER) */
                                      <div className="relative w-full max-w-[320px] pointer-events-auto mt-4 drop-shadow-2xl">
                                        <motion.div 
                                          initial={false}
                                          animate={{ height: isTomasTranslated ? 'auto' : '180px' }}
                                          className={`relative w-full border-y-2 border-x shadow-[0_20px_50px_rgba(0,0,0,0.95),inset_0_2px_15px_rgba(255,255,255,0.03)] overflow-hidden flex flex-col rounded-sm ${isBloodMode ? 'bg-gradient-to-br from-[#2a0505] to-[#0a0000] border-[#4a0a0a]' : isNoirMode ? 'bg-gradient-to-br from-[#1a1a1a] to-[#050505] border-[#333333]' : 'bg-gradient-to-br from-[#1c1a17] to-[#0a0908] border-[#3a2e1d]'}`}
                                        >
                                          {/* Background Noise for Noir Folder */}
                                          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay pointer-events-none z-0"></div>
                                          
                                          {/* Subtle Watermark Stamp */}
                                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] opacity-[0.03] pointer-events-none z-0">
                                            <span className="font-heading font-black text-6xl text-mafia-red uppercase tracking-widest whitespace-nowrap border-4 border-mafia-red px-6 py-2 rounded-sm">
                                              CONFIDENTIAL
                                            </span>
                                          </div>

                                          {/* Envelope Label */}
                                          <div className="p-4 border-b border-mafia-gold/10 relative z-20 flex justify-between items-center bg-black/60 shadow-lg">
                                            <div>
                                              <div className="flex items-center gap-2 mb-1">
                                                <div className="relative flex items-center justify-center w-2 h-2">
                                                   <div className={`absolute inset-0 rounded-full border animate-ping ${isBloodMode ? 'border-mafia-red/50' : isNoirMode ? 'border-white/50' : 'border-mafia-gold/50'}`}></div>
                                                   <div className={`w-1 h-1 rounded-full ${isBloodMode ? 'bg-mafia-red shadow-[0_0_8px_rgba(200,16,46,1)]' : isNoirMode ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,1)]' : 'bg-mafia-gold shadow-[0_0_8px_rgba(197,160,89,1)]'}`}></div>
                                                </div>
                                                <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${isBloodMode ? 'text-mafia-red/90' : isNoirMode ? 'text-white/90' : 'text-mafia-gold/90'}`}>
                                                  {lang === 'en' ? 'TOP SECRET' : 'PŘÍSNĚ TAJNÉ'}
                                                </span>
                                              </div>
                                              <span className="text-[8px] font-mono text-white/40 tracking-[0.2em]">
                                                {lang === 'en' ? 'WIRETAP DOSSIER' : 'SPIS ODPOSLECHU'}
                                              </span>
                                            </div>
                                            <span className={`font-serif text-xl ${isBloodMode ? 'text-mafia-red/30' : isNoirMode ? 'text-white/30' : 'text-mafia-gold/30'}`}>M</span>
                                          </div>

                                          {/* Content Area */}
                                          <div className="relative flex-1 flex flex-col items-center justify-center p-6 min-h-[120px]">
                                            {!isTomasTranslated ? (
                                              // Closed State: Just the Wax Seal
                                              <motion.button
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring" }}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setIsTomasTranslated(true);
                                                  playSound("/sounds/magnum.mp3", 0.3);
                                                }}
                                                className="relative cursor-pointer group flex flex-col items-center justify-center bg-transparent border-none outline-none"
                                              >
                                                {/* Wax Seal */}
                                                <div className={`relative w-16 h-16 rounded-full border shadow-[0_5px_15px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,255,255,0.3)] flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-transform duration-500 overflow-hidden ${isBloodMode ? 'bg-gradient-to-br from-[#990000] to-[#4a0000] border-[#ff6b6b]/20 hover:shadow-[0_0_20px_rgba(153,0,0,0.6)]' : isNoirMode ? 'bg-gradient-to-br from-[#444] to-[#111] border-[#fff]/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]' : 'bg-gradient-to-br from-[#b89454] to-[#6b552e] border-[#ffe6b3]/20 hover:shadow-[0_0_20px_rgba(197,160,89,0.6)]'}`}>
                                                  <div className={`w-12 h-12 rounded-full border border-black/40 flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] ${isBloodMode ? 'bg-gradient-to-br from-[#7a0000] to-[#3a0000]' : isNoirMode ? 'bg-gradient-to-br from-[#333] to-[#0a0a0a]' : 'bg-gradient-to-br from-[#8f723e] to-[#47371c]'}`}>
                                                    <span className={`font-serif font-bold text-3xl tracking-tighter mix-blend-overlay ${isBloodMode ? 'text-[#ffb8b8]/40' : isNoirMode ? 'text-white/40' : 'text-[#ffe6b3]/40'}`}>T</span>
                                                  </div>
                                                  <div className={`absolute -bottom-1 right-2 w-2 h-3 rounded-full blur-[0.5px] ${isBloodMode ? 'bg-[#6a0000]' : isNoirMode ? 'bg-[#222]' : 'bg-[#5e4922]'}`}></div>
                                                </div>
                                                <div className="mt-4">
                                                  <span className={`text-[8px] font-mono uppercase tracking-[0.3em] transition-all ${isBloodMode ? 'text-white/40 group-hover:text-mafia-red' : isNoirMode ? 'text-white/40 group-hover:text-white' : 'text-white/40 group-hover:text-mafia-gold'}`}>
                                                    {lang === 'en' ? 'BREAK TO OPEN' : 'PORUŠIT PEČEŤ'}
                                                  </span>
                                                </div>
                                              </motion.button>
                                            ) : (
                                              // Open State: The Sand Text inside dossier
                                              <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="w-full relative z-10"
                                              >
                                                <p className="text-sm md:text-md font-mono text-white/90 leading-relaxed text-left">
                                                  {(() => {
                                                    let runningIndex = 0;
                                                    const textToRender = activeTomasQuoteCz; // Always translated inside envelope
                                                    return textToRender.split(' ').map((word, wIdx) => {
                                                      const chars = word.split('').map((char, cIdx) => ({
                                                        char,
                                                        globalIndex: runningIndex + cIdx
                                                      }));
                                                      runningIndex += word.length + 1;

                                                      return (
                                                        <span key={wIdx} className="inline-block mr-[0.25em] whitespace-nowrap">
                                                          {chars.map((item) => (
                                                            <motion.span
                                                              key={`env-${textToRender}-${item.globalIndex}`}
                                                              initial={{ opacity: 0, filter: "blur(5px)" }}
                                                              animate={{ opacity: 1, filter: "blur(0px)" }}
                                                              transition={{ duration: 0.8, delay: item.globalIndex * 0.02 }}
                                                              className={`inline-block ${isBloodMode ? 'text-mafia-red/90 drop-shadow-[0_0_5px_rgba(200,16,46,0.3)]' : isNoirMode ? 'text-white/90 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]' : 'text-mafia-gold/90 drop-shadow-[0_0_5px_rgba(197,160,89,0.3)]'}`}
                                                            >
                                                              {item.char}
                                                            </motion.span>
                                                          ))}
                                                        </span>
                                                      );
                                                    });
                                                  })()}
                                                </p>
                                              </motion.div>
                                            )}
                                          </div>
                                        </motion.div>
                                      </div>
                                    ) : (
                                      /* REŽIM: KARTY (PŮVODNÍ) */
                                      <div className="relative w-full pointer-events-none flex flex-col items-end">
                                        <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.8)_0%,transparent_70%)] z-[-1] blur-md mix-blend-multiply"></div>
                                        <div className="flex items-center gap-2 mb-2 justify-end">
                                           <div className="relative flex items-center justify-center w-3 h-3">
                                              <div className={`absolute inset-0 rounded-full border animate-ping ${isBloodMode ? 'border-mafia-red/50' : isNoirMode ? 'border-white/50' : 'border-mafia-gold/50'}`}></div>
                                              <div className={`w-1.5 h-1.5 rounded-full ${isBloodMode ? 'bg-mafia-red shadow-[0_0_8px_rgba(200,16,46,1)]' : isNoirMode ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,1)]' : 'bg-mafia-gold shadow-[0_0_8px_rgba(197,160,89,1)]'}`}></div>
                                           </div>
                                           <span className="text-[10px] md:text-xs font-mono text-white/90 font-bold uppercase tracking-[0.3em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                             {lang === 'en' ? 'WIRETAP RECORDS' : 'ZÁZNAMY ODPOSLECHŮ'}
                                           </span>
                                        </div>
                                        <p className="text-sm md:text-lg lg:text-xl font-heading font-black text-white italic leading-relaxed text-right drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] min-h-[80px]">
                                          {(() => {
                                            let runningIndex = 0;
                                            const textToRender = isTomasTranslated ? activeTomasQuoteCz : activeTomasQuote;
                                            return textToRender.split(' ').map((word, wIdx) => {
                                              const chars = word.split('').map((char, cIdx) => ({
                                                char,
                                                globalIndex: runningIndex + cIdx
                                              }));
                                              runningIndex += word.length + 1;

                                              return (
                                                <span key={wIdx} className="inline-block mr-[0.25em] whitespace-nowrap">
                                                  {chars.map((item) => (
                                                    <motion.span
                                                      key={`${textToRender}-${item.globalIndex}`}
                                                      initial={{ opacity: 0, filter: "blur(10px)", x: 20, y: -10, textShadow: "0 0 20px rgba(197, 160, 89, 1)" }}
                                                      animate={{ opacity: 1, filter: "blur(0px)", x: 0, y: 0, textShadow: "0 2px 10px rgba(0, 0, 0, 0.9)" }}
                                                      transition={{ duration: 1.2, delay: item.globalIndex * 0.035, ease: [0.23, 1, 0.32, 1] }}
                                                      className="inline-block"
                                                    >
                                                      {item.char}
                                                    </motion.span>
                                                  ))}
                                                </span>
                                              );
                                            });
                                          })()}
                                        </p>
                                        
                                        <AnimatePresence>
                                          {!isTomasTranslated && (
                                            <motion.button
                                              initial={{ opacity: 0, y: 10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              exit={{ opacity: 0, scale: 0.9 }}
                                              transition={{ delay: activeTomasQuote.length * 0.035 + 0.2 }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setIsTomasTranslated(true);
                                                playSound("/sounds/magnum.mp3", 0.2);
                                              }}
                                              className={`pointer-events-auto mt-4 mb-2 flex items-center gap-2 px-4 py-1.5 border backdrop-blur-sm mx-auto rounded-sm transition-all duration-300 group ${isBloodMode ? 'border-mafia-red/50 text-mafia-red hover:bg-mafia-red hover:text-black hover:shadow-[0_0_15px_rgba(200,16,46,0.6)]' : isNoirMode ? 'border-white/50 text-white hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]' : 'border-mafia-gold/50 text-mafia-gold hover:bg-mafia-gold hover:text-black hover:shadow-[0_0_15px_rgba(197,160,89,0.6)]'}`}
                                            >
                                              <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                                              <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.2em]">
                                                {lang === 'en' ? 'DECIPHER' : 'DEŠIFROVAT'}
                                              </span>
                                            </motion.button>
                                          )}
                                        </AnimatePresence>


                                        <motion.div 
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ duration: 0.8, ease: "easeOut", delay: activeTomasQuote.length * 0.035 + 0.5 }}
                                          className="mt-8 flex flex-col items-center w-full max-w-[350px] relative z-50 pointer-events-auto"
                                        >
                                          <div className="mb-4 w-full flex justify-center">
                                            <span className={`text-[9px] font-mono text-white/50 uppercase tracking-[0.4em] bg-black/60 px-3 py-1 border rounded-sm ${isBloodMode ? 'drop-shadow-[0_0_5px_rgba(200,16,46,0.5)] border-mafia-red/20' : isNoirMode ? 'drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] border-white/20' : 'drop-shadow-[0_0_5px_rgba(197,160,89,0.5)] border-mafia-gold/20'}`}>
                                              {lang === 'en' ? 'CHOOSE A FATE CARD' : 'VYBER SI KARTU OSUDU'}
                                            </span>
                                          </div>
                                          
                                          <div className="flex justify-center gap-[-10px] sm:gap-2 w-full perspective-1000 mt-6">
                                            {tomasCards.map((card, i) => {
                                              const isFlipped = activeTomasQuote === card.a_la || activeTomasQuoteCz === card.a_cs || activeTomasQuoteCz === card.a_en;
                                              const rotation = (i - 1.5) * 8; 
                                              const translateY = Math.abs(i - 1.5) * 5; 
                                              
                                              return (
                                                <motion.div 
                                                  key={i}
                                                  initial={false}
                                                  animate={{ 
                                                    rotateY: isFlipped ? 180 : 0,
                                                    rotateZ: isFlipped ? 0 : rotation,
                                                    y: isFlipped ? -20 : translateY,
                                                    scale: isFlipped ? 1.1 : 1,
                                                    zIndex: isFlipped ? 50 : 10 + i
                                                  }}
                                                  whileHover={!isFlipped ? { y: translateY - 15, scale: 1.05, zIndex: 40 } : {}}
                                                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                                  className="relative w-16 h-24 md:w-20 md:h-28 lg:w-24 lg:h-32 cursor-pointer drop-shadow-2xl"
                                                  style={{ transformStyle: "preserve-3d", transformOrigin: "bottom center", marginLeft: i !== 0 ? "-20px" : "0" }}
                                                  onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    setActiveTomasQuote(card.a_la); 
                                                    setActiveTomasQuoteCz(lang === 'en' ? card.a_en : card.a_cs);
                                                    setIsTomasTranslated(false);
                                                    playSound("/sounds/cards-shuffle.mp3", 0.5); 
                                                  }}
                                                >
                                                  <div 
                                                    className={`absolute inset-0 bg-[#0a0a0a] border-2 rounded-md flex items-center justify-center overflow-hidden ${isBloodMode ? 'border-mafia-red/40 shadow-[inset_0_0_15px_rgba(200,16,46,0.2)]' : isNoirMode ? 'border-white/40 shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]' : 'border-mafia-gold/40 shadow-[inset_0_0_15px_rgba(197,160,89,0.2)]'}`}
                                                    style={{ backfaceVisibility: "hidden" }}
                                                  >
                                                    <div className={`absolute inset-1 border rounded-[4px] ${isBloodMode ? 'border-mafia-red/20' : isNoirMode ? 'border-white/20' : 'border-mafia-gold/20'}`}></div>
                                                    <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"></div>
                                                    <span className={`text-2xl md:text-3xl lg:text-4xl ${isBloodMode ? 'text-mafia-red/30' : isNoirMode ? 'text-white/30' : 'text-mafia-gold/30'}`}>{card.suit}</span>
                                                  </div>
                                                  <div 
                                                    className="absolute inset-0 bg-gradient-to-br from-[#e2d5c3] to-[#c8b69b] border border-[#a69273] rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] flex flex-col p-1 md:p-2"
                                                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                                                  >
                                                    <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"></div>
                                                    
                                                    <div className="flex justify-between w-full">
                                                      <span className="text-[10px] md:text-xs font-serif font-bold text-black/80">{card.value}</span>
                                                      <span className="text-[10px] md:text-xs font-serif font-bold text-mafia-red/80">{card.suit}</span>
                                                    </div>
                                                    
                                                    <div className="flex-1 flex flex-col items-center justify-center p-2 text-center mt-3">
                                                      <span className="text-[6px] md:text-[8px] font-mono text-black/40 uppercase tracking-widest mb-1">{!isTomasTranslated ? "IGNOTUM" : (lang === 'en' ? card.name_en : card.name_cs)}</span>
                                                      <p className="text-[8px] md:text-[9px] font-sans font-bold text-black/80 leading-tight">
                                                        "{!isTomasTranslated ? card.q_la : (lang === 'en' ? card.q_en : card.q_cs)}"
                                                      </p>
                                                    </div>
                                                  </div>
                                                </motion.div>
                                              );
                                            })}
                                          </div>
                                        </motion.div>
                                      </div>
                                    )}
                                  </div>

                                </motion.div>
                             )}
                           </AnimatePresence>

                           {/* Zlatá pacička UI (Shows only when clicked/previewed) */}
                           <AnimatePresence>
                             {isPreviewActive && (
                               <motion.div 
                                 initial={{ opacity: 0, x: -20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 exit={{ opacity: 0, x: -20 }}
                                 transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                 className="absolute top-[40%] right-[-20px] md:right-[-120px] lg:right-[-180px] flex items-center pointer-events-none z-40"
                               >
                                 <div className="flex items-center gap-0">
                                   {/* Konektor - vodorovná zlatá linka */}
                                   <div className={`w-8 md:w-16 h-[2px] bg-gradient-to-r from-transparent relative ${isBloodMode ? 'to-mafia-red' : isNoirMode ? 'to-white' : 'to-mafia-gold'}`}>
                                      <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${isBloodMode ? 'bg-mafia-red shadow-[0_0_10px_rgba(200,16,46,1)]' : isNoirMode ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,1)]' : 'bg-mafia-gold shadow-[0_0_10px_rgba(197,160,89,1)]'}`}></div>
                                   </div>
                                   
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); handleSelectBarber('tomas'); }}
                                     className={`pointer-events-auto px-6 md:px-8 py-2 md:py-3 bg-black border font-black uppercase tracking-[0.2em] text-xs md:text-sm transition-all duration-300 flex items-center justify-center group relative overflow-hidden rounded-sm ${isBloodMode ? 'border-mafia-red/50 text-mafia-red hover:bg-mafia-red hover:text-black shadow-[0_0_15px_rgba(200,16,46,0.3)] hover:shadow-[0_0_30px_rgba(200,16,46,0.6)]' : isNoirMode ? 'border-white/50 text-white hover:bg-white hover:text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]' : 'border-mafia-gold/50 text-mafia-gold hover:bg-mafia-gold hover:text-black shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:shadow-[0_0_30px_rgba(197,160,89,0.6)]'}`}
                                   >
                                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
                                     <span className="block group-hover:scale-105 transition-transform relative z-10">{lang === 'cs' ? 'ŽIVOTOPIS' : 'DOSSIER'}</span>
                                   </button>
                                 </div>
                               </motion.div>
                             )}
                           </AnimatePresence>
                           
                           {/* Dim Background overlay when previewing */}
                           {isPreviewActive && (
                             <div 
                               className="fixed inset-0 bg-black/70 z-[-1] backdrop-blur-[2px]" 
                               onClick={(e) => { e.stopPropagation(); setPreviewBarberId(null); }}
                             />
                           )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* DNA Model for Tomas (Only in preview) */}
                {isTomasVisible && isFullyUnlocked && previewBarberId === 'tomas' && graphicsTier !== 'lite' && (
                  <div 
                    className="w-full relative flex justify-center items-center h-[500px] z-[30] mb-8 pointer-events-auto transition-opacity duration-1000 animate-in fade-in"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AnimusDNA3D isBloodMode={isBloodMode} isNoirMode={isNoirMode} />
                  </div>
                )}

                {/* PROPOJOVACÍ LINIE & SLOTY (Perfektně centrované) */}
                <div className="w-full flex flex-col items-center relative -mt-4 md:-mt-8 z-10 pointer-events-none">
                  {/* Hlavní svislá linie z Toma */}
                  <div className="w-[2px] h-12 md:h-20 bg-gradient-to-b from-mafia-gold via-mafia-gold/50 to-mafia-gold/20 shadow-[0_0_10px_rgba(197,160,89,0.5)]"></div>
                  
                  {/* Vodorovná rozbočovací linie */}
                  <div className="w-[280px] md:w-[480px] h-[2px] bg-mafia-gold/30 relative">
                     {/* Zářivé body na krajích a uprostřed */}
                     <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-mafia-gold shadow-[0_0_8px_rgba(197,160,89,0.8)]"></div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-mafia-gold shadow-[0_0_8px_rgba(197,160,89,0.8)]"></div>
                     <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-mafia-gold shadow-[0_0_8px_rgba(197,160,89,0.8)]"></div>
                  </div>

                  {/* Svislé linky a samotné sloty zabalené k sobě pro 100% zarovnání */}
                  <div className="w-[280px] md:w-[480px] flex justify-between relative">
                     
                     {/* ============================================================== */}
                     {/* LEVÁ VĚTEV (Rekrut + 2 Učňové) */}
                     <div className="flex flex-col items-center -translate-x-1/2 pointer-events-auto">
                        <div className="w-[2px] h-10 md:h-16 bg-gradient-to-b from-mafia-gold/30 to-mafia-gold/20 pointer-events-none"></div>
                        <div className="flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity mt-[-5px]">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-mafia-gold/30 overflow-hidden bg-black/80 flex items-center justify-center relative shadow-[0_0_20px_rgba(0,0,0,0.9)] backdrop-blur-sm group cursor-pointer">
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                             <span className="text-xl font-heading font-black text-mafia-gold/20 italic group-hover:text-mafia-gold/50 transition-colors">?</span>
                          </div>
                          <div className="mt-4 text-center">
                             <span className="text-mafia-gold/40 text-[8px] md:text-[9px] font-mono tracking-[0.3em] uppercase block mb-1">VOLNÝ SLOT</span>
                             <h2 className="text-xs md:text-sm font-heading font-black text-white/40 uppercase tracking-widest italic">REKRUT</h2>
                          </div>
                        </div>

                        {/* Podvětev - levá */}
                        <div className="flex flex-col items-center relative -mt-2 pointer-events-none z-10 w-[120px] md:w-[180px]">
                           <div className="w-[2px] h-8 md:h-12 bg-gradient-to-b from-mafia-gold/20 to-mafia-gold/10"></div>
                           <div className="w-full h-[2px] bg-mafia-gold/10 relative">
                               <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-mafia-gold/50 shadow-[0_0_8px_rgba(197,160,89,0.3)]"></div>
                               <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-mafia-gold/50 shadow-[0_0_8px_rgba(197,160,89,0.3)]"></div>
                           </div>
                           <div className="w-full flex justify-between relative">
                              <div className="flex flex-col items-center -translate-x-1/2 pointer-events-auto">
                                 <div className="w-[2px] h-8 md:h-10 bg-gradient-to-b from-mafia-gold/10 to-transparent pointer-events-none"></div>
                                 <div className="flex flex-col items-center opacity-40 hover:opacity-80 transition-opacity mt-[-5px]">
                                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-mafia-gold/20 overflow-hidden bg-black/80 flex items-center justify-center relative backdrop-blur-sm group cursor-pointer">
                                       <span className="text-lg font-heading font-black text-mafia-gold/10 italic group-hover:text-mafia-gold/30 transition-colors">?</span>
                                    </div>
                                    <div className="mt-2 text-center">
                                       <span className="text-mafia-gold/30 text-[7px] font-mono tracking-[0.2em] uppercase block">UČEŇ</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex flex-col items-center translate-x-1/2 pointer-events-auto">
                                 <div className="w-[2px] h-8 md:h-10 bg-gradient-to-b from-mafia-gold/10 to-transparent pointer-events-none"></div>
                                 <div className="flex flex-col items-center opacity-40 hover:opacity-80 transition-opacity mt-[-5px]">
                                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-mafia-gold/20 overflow-hidden bg-black/80 flex items-center justify-center relative backdrop-blur-sm group cursor-pointer">
                                       <span className="text-lg font-heading font-black text-mafia-gold/10 italic group-hover:text-mafia-gold/30 transition-colors">?</span>
                                    </div>
                                    <div className="mt-2 text-center">
                                       <span className="text-mafia-gold/30 text-[7px] font-mono tracking-[0.2em] uppercase block">UČEŇ</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* ============================================================== */}
                     {/* PROSTŘEDNÍ VĚTEV (Rekrut + 1 Učeň) */}
                     <div className="flex flex-col items-center pointer-events-auto">
                        <div className="w-[2px] h-10 md:h-16 bg-gradient-to-b from-mafia-gold/30 to-mafia-gold/20 pointer-events-none"></div>
                        <div className="flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity mt-[-5px]">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-mafia-gold/30 overflow-hidden bg-black/80 flex items-center justify-center relative shadow-[0_0_20px_rgba(0,0,0,0.9)] backdrop-blur-sm group cursor-pointer">
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                             <span className="text-xl font-heading font-black text-mafia-gold/20 italic group-hover:text-mafia-gold/50 transition-colors">?</span>
                          </div>
                          <div className="mt-4 text-center">
                             <span className="text-mafia-gold/40 text-[8px] md:text-[9px] font-mono tracking-[0.3em] uppercase block mb-1">VOLNÝ SLOT</span>
                             <h2 className="text-xs md:text-sm font-heading font-black text-white/40 uppercase tracking-widest italic">REKRUT</h2>
                          </div>
                        </div>

                        {/* Podvětev - střední */}
                        <div className="flex flex-col items-center relative -mt-2 pointer-events-none z-10">
                           <div className="w-[2px] h-8 md:h-12 bg-gradient-to-b from-mafia-gold/20 to-transparent"></div>
                           <div className="flex flex-col items-center pointer-events-auto">
                               <div className="flex flex-col items-center opacity-40 hover:opacity-80 transition-opacity mt-[-5px]">
                                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-mafia-gold/20 overflow-hidden bg-black/80 flex items-center justify-center relative backdrop-blur-sm group cursor-pointer">
                                     <span className="text-lg font-heading font-black text-mafia-gold/10 italic group-hover:text-mafia-gold/30 transition-colors">?</span>
                                  </div>
                                  <div className="mt-2 text-center">
                                     <span className="text-mafia-gold/30 text-[7px] font-mono tracking-[0.2em] uppercase block">UČEŇ</span>
                                  </div>
                               </div>
                           </div>
                        </div>
                     </div>

                     {/* ============================================================== */}
                     {/* PRAVÁ VĚTEV (Rekrut + 2 Učňové) */}
                     <div className="flex flex-col items-center translate-x-1/2 pointer-events-auto">
                        <div className="w-[2px] h-10 md:h-16 bg-gradient-to-b from-mafia-gold/30 to-mafia-gold/20 pointer-events-none"></div>
                        <div className="flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity mt-[-5px]">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-mafia-gold/30 overflow-hidden bg-black/80 flex items-center justify-center relative shadow-[0_0_20px_rgba(0,0,0,0.9)] backdrop-blur-sm group cursor-pointer">
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                             <span className="text-xl font-heading font-black text-mafia-gold/20 italic group-hover:text-mafia-gold/50 transition-colors">?</span>
                          </div>
                          <div className="mt-4 text-center">
                             <span className="text-mafia-gold/40 text-[8px] md:text-[9px] font-mono tracking-[0.3em] uppercase block mb-1">VOLNÝ SLOT</span>
                             <h2 className="text-xs md:text-sm font-heading font-black text-white/40 uppercase tracking-widest italic">REKRUT</h2>
                          </div>
                        </div>

                        {/* Podvětev - pravá */}
                        <div className="flex flex-col items-center relative -mt-2 pointer-events-none z-10 w-[120px] md:w-[180px]">
                           <div className="w-[2px] h-8 md:h-12 bg-gradient-to-b from-mafia-gold/20 to-mafia-gold/10"></div>
                           <div className="w-full h-[2px] bg-mafia-gold/10 relative">
                               <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-mafia-gold/50 shadow-[0_0_8px_rgba(197,160,89,0.3)]"></div>
                               <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-mafia-gold/50 shadow-[0_0_8px_rgba(197,160,89,0.3)]"></div>
                           </div>
                           <div className="w-full flex justify-between relative">
                              <div className="flex flex-col items-center -translate-x-1/2 pointer-events-auto">
                                 <div className="w-[2px] h-8 md:h-10 bg-gradient-to-b from-mafia-gold/10 to-transparent pointer-events-none"></div>
                                 <div className="flex flex-col items-center opacity-40 hover:opacity-80 transition-opacity mt-[-5px]">
                                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-mafia-gold/20 overflow-hidden bg-black/80 flex items-center justify-center relative backdrop-blur-sm group cursor-pointer">
                                       <span className="text-lg font-heading font-black text-mafia-gold/10 italic group-hover:text-mafia-gold/30 transition-colors">?</span>
                                    </div>
                                    <div className="mt-2 text-center">
                                       <span className="text-mafia-gold/30 text-[7px] font-mono tracking-[0.2em] uppercase block">UČEŇ</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex flex-col items-center translate-x-1/2 pointer-events-auto">
                                 <div className="w-[2px] h-8 md:h-10 bg-gradient-to-b from-mafia-gold/10 to-transparent pointer-events-none"></div>
                                 <div className="flex flex-col items-center opacity-40 hover:opacity-80 transition-opacity mt-[-5px]">
                                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-mafia-gold/20 overflow-hidden bg-black/80 flex items-center justify-center relative backdrop-blur-sm group cursor-pointer">
                                       <span className="text-lg font-heading font-black text-mafia-gold/10 italic group-hover:text-mafia-gold/30 transition-colors">?</span>
                                    </div>
                                    <div className="mt-2 text-center">
                                       <span className="text-mafia-gold/30 text-[7px] font-mono tracking-[0.2em] uppercase block">UČEŇ</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     
                  </div>
                </div>

              </div>
            </motion.div>
          ) : activeBarberSafe.id === 'tomas' ? (
            /* TOMAS SKILL TREE MODE */
            <motion.div
              key="barber-dossier-tomas"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="w-full relative py-6 md:py-12"
            >
              <button 
                onClick={handleBackToSelection}
                className="group inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors font-mono text-[9px] uppercase tracking-[0.3em] mb-8"
              >
                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                <span>{lang === 'cs' ? "Zpět na hierarchii" : "Back to Hierarchy"}</span>
              </button>
              <TomasSkillTree totalCollected={effectiveTotalCollected} lang={lang} isBloodMode={isBloodMode} isNoirMode={isNoirMode} />
            </motion.div>
          ) : (
            /* DOSSIER DETAIL MODE */
            <motion.div
              key="barber-dossier"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="bg-mafia-black/95 border border-white/10 p-6 md:p-12 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] rounded-sm"
            >
              {/* Gold Scanner line decoration */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-mafia-gold/30 to-transparent pointer-events-none" />

              {/* Back Link inside dossier */}
              <button 
                onClick={handleBackToSelection}
                className="group inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors font-mono text-[9px] uppercase tracking-[0.3em] mb-8"
              >
                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                <span>{lang === 'cs' ? "Zpět na hierarchii" : "Back to Hierarchy"}</span>
              </button>

              {/* Main Dossier Grid */}
              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                
                {/* LEFT PORTRAIT COLUMN */}
                <div className="lg:col-span-4 order-1">
                  
                  {/* Photo Frame */}
                  <div className={`w-full aspect-square relative rounded-sm border overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-1000 ${isPhotoUnlocked ? 'border-mafia-gold/50' : 'border-white/10'}`}>
                    <Image 
                      src={activeBarberSafe.image} 
                      alt={activeCustomName} 
                      fill 
                      priority
                      className={`object-cover transition-all duration-1000 ${!isPhotoUnlocked ? 'grayscale blur-xl brightness-50 opacity-40' : 'grayscale-0 blur-0 brightness-100 opacity-100'}`} 
                    />
                    
                    {!isPhotoUnlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-80 mix-blend-overlay"></div>
                    )}
                    
                    {!isPhotoUnlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <span className="text-mafia-gold/50 font-mono text-xs uppercase tracking-widest animate-pulse border border-mafia-gold/20 bg-mafia-black/80 px-4 py-2 rounded backdrop-blur-sm shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                          [ FOTOGRAFIE BLOKOVÁNA ]
                        </span>
                      </div>
                    )}
                  </div>

                </div>

                {/* RIGHT FOLDERS COLUMN (Tab navigation) */}
                <div className="lg:col-span-3 order-2 lg:order-3 w-full overflow-x-auto pb-4 lg:pb-0 hide-scrollbar pt-2">
                  <div className="flex flex-row lg:flex-col gap-3 lg:gap-4 min-w-max lg:min-w-0 pr-4 lg:pr-0 pl-2 lg:pl-0 lg:border-l-2 lg:border-white/10 lg:pl-0">
                    
                    {/* Základní profil */}
                    <button
                      onClick={() => { setActiveFolderId('main_bio'); playSound("/sounds/paper.mp3", 0.4); }}
                      className={`relative px-5 py-5 text-left transition-all duration-500 overflow-hidden min-w-[180px] lg:min-w-full shadow-lg flex flex-col justify-center
                        ${activeFolderId === 'main_bio' 
                          ? 'border-l-4 border-b-4 lg:border-b-0 border-mafia-gold bg-gradient-to-r from-mafia-gold/20 via-mafia-black/90 to-black lg:-ml-[2px] scale-[1.02] z-10' 
                          : 'border-l-2 border-white/20 bg-black/60 hover:bg-white/5 hover:border-mafia-gold/50 opacity-70 hover:opacity-100'}
                        rounded-tr-md rounded-br-md`}
                    >
                      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-overlay pointer-events-none"></div>
                      <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex items-center gap-3">
                          <Layers size={18} className={activeFolderId === 'main_bio' ? 'text-mafia-gold' : 'text-white/40'} />
                          <span className={`text-xs md:text-sm font-heading font-black uppercase tracking-[0.2em] ${activeFolderId === 'main_bio' ? 'text-mafia-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'text-white/60'}`}>
                            {lang === 'cs' ? 'Základní složka' : 'Main Dossier'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between opacity-50 pl-7">
                          <div className="font-mono text-[8px] tracking-[0.4em] text-white/50">REF: MB-001</div>
                          {activeFolderId === 'main_bio' && <div className="w-1.5 h-1.5 rounded-full bg-mafia-gold shadow-[0_0_5px_var(--color-mafia-gold)] animate-pulse"></div>}
                        </div>
                      </div>
                    </button>

                    {/* Tajný životopis (pouze Tomáš) */}
                    {activeBarberSafe.id === 'tomas' && (
                      <button
                        onClick={() => { setActiveFolderId('secret_cv'); playSound("/sounds/paper.mp3", 0.4); }}
                        className={`relative px-5 py-5 text-left transition-all duration-500 overflow-hidden min-w-[180px] lg:min-w-full shadow-lg flex flex-col justify-center
                          ${activeFolderId === 'secret_cv' 
                            ? 'border-l-4 border-b-4 lg:border-b-0 border-mafia-gold bg-gradient-to-r from-mafia-gold/20 via-mafia-black/90 to-black lg:-ml-[2px] scale-[1.02] z-10' 
                            : 'border-l-2 border-white/20 bg-black/60 hover:bg-white/5 hover:border-mafia-gold/50 opacity-70 hover:opacity-100'}
                          rounded-tr-md rounded-br-md`}
                      >
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-overlay pointer-events-none"></div>
                        <div className="flex flex-col gap-2 relative z-10">
                          <div className="flex items-center gap-3">
                            <Sliders size={18} className={activeFolderId === 'secret_cv' ? 'text-mafia-gold' : 'text-white/40'} />
                            <span className={`text-xs md:text-sm font-heading font-black uppercase tracking-[0.2em] ${activeFolderId === 'secret_cv' ? 'text-mafia-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'text-white/60'}`}>
                              {lang === 'cs' ? 'Tajný spis' : 'Secret Dossier'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between opacity-50 pl-7">
                            <div className="font-mono text-[8px] tracking-[0.4em] text-mafia-gold/80">CLASS: TOP SECRET</div>
                            {activeFolderId === 'secret_cv' && <div className="w-1.5 h-1.5 rounded-full bg-mafia-gold shadow-[0_0_5px_var(--color-mafia-gold)] animate-pulse"></div>}
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Nový zablokovaný spis (Projekt X) */}
                    {activeBarberSafe.id === 'tomas' && (
                      <button
                        onClick={() => {
                           if (effectiveTotalCollected >= 12) {
                             setActiveFolderId('classified_1'); 
                             playSound("/sounds/paper.mp3", 0.4);
                           } else {
                             playSound("/sounds/click.mp3", 0.4);
                           }
                        }}
                        className={`relative px-5 py-5 text-left transition-all duration-500 overflow-hidden min-w-[180px] lg:min-w-full shadow-lg flex flex-col justify-center
                          ${effectiveTotalCollected < 12 ? 'opacity-40 cursor-not-allowed grayscale' : ''}
                          ${activeFolderId === 'classified_1' 
                            ? 'border-l-4 border-b-4 lg:border-b-0 border-mafia-gold bg-gradient-to-r from-mafia-gold/20 via-mafia-black/90 to-black lg:-ml-[2px] scale-[1.02] z-10' 
                            : 'border-l-2 border-white/20 bg-black/60 hover:bg-white/5 hover:border-mafia-gold/50 opacity-70 hover:opacity-100'}
                          rounded-tr-md rounded-br-md`}
                      >
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-overlay pointer-events-none"></div>
                        
                        {/* Diagonální proužky (varování) pokud je zamčeno */}
                        {effectiveTotalCollected < 12 && (
                           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, #c5a059 10px, #c5a059 20px)" }}></div>
                        )}

                        <div className="flex flex-col gap-2 relative z-10">
                           <div className="flex items-center gap-3">
                             <Pocket size={18} className={activeFolderId === 'classified_1' ? 'text-mafia-gold' : 'text-white/40'} />
                             <span className={`text-xs md:text-sm font-heading font-black uppercase tracking-[0.2em] ${activeFolderId === 'classified_1' ? 'text-mafia-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'text-white/60'}`}>
                               {lang === 'cs' ? 'Spis Projekt X' : 'Project X File'}
                             </span>
                           </div>
                           <div className="flex items-center justify-between pl-7">
                             {effectiveTotalCollected < 10 ? (
                                <div className="text-[8px] font-mono text-mafia-gold font-bold uppercase tracking-widest bg-mafia-gold/20 border border-mafia-gold/50 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(197,160,89,0.2)]">
                                  {lang === 'cs' ? 'Vyžaduje 10 fragmentů' : 'Requires 10 fragments'}
                                </div>
                             ) : (
                                <>
                                  <div className="font-mono text-[8px] tracking-[0.4em] text-white/50 opacity-50">REF: X-992</div>
                                  {activeFolderId === 'classified_1' && <div className="w-1.5 h-1.5 rounded-full bg-mafia-gold shadow-[0_0_5px_var(--color-mafia-gold)] animate-pulse"></div>}
                                </>
                             )}
                           </div>
                        </div>
                      </button>
                    )}

                  </div>
                </div>

                {/* MIDDLE DETAILED BIO COLUMN */}
                <div className="lg:col-span-5 space-y-8 order-3 lg:order-2 w-full lg:pr-4">
                  
                  {/* Title & Rank header */}
                  <div className="space-y-2 text-left">
                    <span className="text-mafia-gold text-[10px] font-mono tracking-[0.3em] uppercase block">
                      {lang === 'cs' ? getDailyRole(activeBarberSafe.id, lang) : "SPECIALIST"}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tight italic">
                      {activeCustomName}
                    </h2>
                    
                    {/* Hlasování o přezdívce */}
                    <div className="mt-4 p-4 border border-white/10 bg-black/50 rounded-sm">
                      <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-3">
                        {lang === 'cs' ? "Návrhy komunity na přezdívku:" : "Community nickname suggestions:"}
                      </p>
                      
                      {/* Top suggestions tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {nicknamesDb?.[activeBarberSafe.id as 'tomas'|'nella']?.suggestions && 
                         Object.entries(nicknamesDb[activeBarberSafe.id as 'tomas'|'nella'].suggestions)
                           .sort((a, b) => Number(b[1]) - Number(a[1]))
                           .slice(0, 5) // Show top 5
                           .map(([name, votes]) => (
                             <button
                               key={name}
                               onClick={() => { setNewNickname(name); }}
                               className="px-2 py-1 text-[10px] font-mono uppercase bg-white/5 border border-white/10 hover:border-mafia-gold hover:text-mafia-gold transition-colors rounded text-white/70 flex items-center gap-2"
                             >
                               <span>{name}</span>
                               <span className="text-mafia-gold/50">[{votes}]</span>
                             </button>
                         ))}
                      </div>

                      {/* Vote Form */}
                      <form onSubmit={handleVoteNickname} className="flex gap-2">
                        <input
                          type="text"
                          maxLength={20}
                          value={newNickname}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.toLowerCase() === "open") {
                              setCheatUnlocked(true);
                              setNewNickname("");
                              playSound("/sounds/reload.mp3", 0.5);
                            } else {
                              setNewNickname(val);
                            }
                          }}
                          placeholder={lang === 'cs' ? "Navrhni novou přezdívku..." : "Suggest a new nickname..."}
                          className="flex-grow bg-black border border-white/20 p-2 text-white font-mono text-xs focus:border-mafia-gold focus:outline-none rounded-sm transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={!newNickname.trim() || isVoting}
                          className="px-4 py-2 bg-mafia-gold/20 text-mafia-gold border border-mafia-gold/50 hover:bg-mafia-gold hover:text-black font-mono text-[10px] uppercase tracking-widest rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isVoting ? "..." : (lang === 'cs' ? "HLASOVAT" : "VOTE")}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Conditional Rendering of Content based on Active Folder */}
                  <AnimatePresence mode="wait">
                    {activeFolderId === 'main_bio' && (
                      <motion.div 
                        key="folder_main"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* Backstory */}
                        <div className="space-y-3 text-left relative min-h-[200px]">
                          <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                            {lang === 'cs' ? "O BARBEROVI & BIOGRAFIE" : "ABOUT & BIOGRAPHY"}
                          </h4>
                          
                          {!isFullyUnlocked && visibleText.length === 0 ? (
                            <div className="absolute inset-0 pt-6 flex flex-col items-center justify-center bg-mafia-black/80 backdrop-blur-[2px] z-10 border border-mafia-gold/20 rounded">
                              <span className="text-mafia-gold/50 font-mono text-xs uppercase tracking-widest animate-pulse mb-2">
                                [ DATA UZAMČENA / FRAGMENTY CHYBÍ ]
                              </span>
                              <p className="text-white/30 text-xs font-mono max-w-[80%] text-center">
                                Najdi všechny otisky/fragmenty na domovské stránce k odemčení kompletního profilu operativce.
                              </p>
                            </div>
                          ) : (
                            <motion.div 
                              initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            >
                              {isFullyUnlocked && (
                                 <div className="mb-4 inline-flex items-center gap-2 border border-mafia-gold/30 bg-mafia-gold/10 px-3 py-1 rounded text-mafia-gold font-mono text-[9px] uppercase tracking-widest shadow-[0_0_10px_rgba(197,160,89,0.2)]">
                                   <CheckCircle2 size={10} />
                                   {lang === 'cs' ? "Úspěšně sestaveno z útržků" : "Successfully assembled from fragments"}
                                 </div>
                              )}
                              <div className="flex items-center gap-2 mb-3">
                                <div className="relative flex items-center justify-center w-3 h-3">
                                   <div className="absolute inset-0 rounded-full border border-mafia-red/50 animate-ping"></div>
                                   <div className="w-1.5 h-1.5 rounded-full bg-mafia-red shadow-[0_0_8px_rgba(200,16,46,1)]"></div>
                                </div>
                                <span className="text-[10px] md:text-xs font-mono text-white/90 font-bold uppercase tracking-[0.3em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                  {lang === 'en' ? 'WIRETAP RECORDS' : 'ZÁZNAMY ODPOSLECHŮ'}
                                </span>
                              </div>
                              <div className="text-base text-smoke-white/90 font-sans leading-relaxed relative flex flex-wrap gap-1 whitespace-pre-wrap">
                                {visibleText && <span className="animate-fade-in-up">{visibleText}</span>}
                                {!isFullyUnlocked && hiddenText && (
                                  <span className="blur-sm opacity-30 select-none bg-white/5 inline-block text-transparent bg-clip-text" style={{ textShadow: "0 0 8px rgba(255,255,255,0.5)" }}>
                                    {hiddenText.replace(/[a-zA-Z]/g, '█')}
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {activeFolderId === 'secret_cv' && activeBarberSafe.id === 'tomas' && (
                      <motion.div
                        key="folder_secret"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-4">
                          {lang === 'cs' ? "TAJNÝ SPIS - NEJVYŠŠÍ UTAJENÍ" : "SECRET DOSSIER - TOP SECRET"}
                        </h4>

                        {!isExtendedUnlocked ? (
                           <div className="border border-mafia-gold/30 bg-mafia-gold/5 p-8 rounded-sm text-center flex flex-col items-center gap-4">
                             <Sliders size={32} className="text-mafia-gold/50" />
                             <h3 className="font-heading font-black text-mafia-gold uppercase tracking-widest">
                               ŠIFROVANÝ DOKUMENT
                             </h3>
                             <p className="text-xs text-white/50 font-mono max-w-sm mb-4">
                               K odpečetění této složky potřebuješ heslo, které poskytuje pouze vedení v centrále.
                             </p>
                             <button 
                               onClick={() => setShowPasswordModal(true)}
                               className="text-[10px] font-mono uppercase tracking-widest text-mafia-black bg-mafia-gold px-6 py-3 hover:bg-white hover:text-black transition-colors rounded shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                             >
                               {lang === 'cs' ? "ZADAT HESLO" : "ENTER PASSWORD"}
                             </button>
                           </div>
                        ) : (
                           <motion.div 
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             className="mt-4 p-6 border border-mafia-gold/30 bg-mafia-gold/5 text-smoke-white/90 font-sans leading-relaxed text-sm shadow-[inset_0_0_20px_rgba(197,160,89,0.05)] rounded-sm relative"
                           >
                              <div className="absolute top-0 left-0 w-2 h-full bg-mafia-gold/50" />
                              <h5 className="text-mafia-gold font-heading font-black uppercase tracking-widest mb-2 italic">Odlečněno (Stupeň utajení 0)</h5>
                              <div className="mb-4">
                                {parseSecretText(secretContent)}
                              </div>

                              {secretArticles.length > 0 && (
                                <div className="mt-8 space-y-6 border-t border-mafia-gold/20 pt-8 mb-6">
                                    <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest italic mb-6">
                                        {lang === 'cs' ? 'Archiv Bádání & Záznamy' : 'Research Archive & Logs'}
                                    </h4>
                                    {secretArticles.map((article: any) => (
                                        <div key={article.id} className="bg-black/40 border border-white/5 p-6 rounded-sm relative">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-mafia-gold/30" />
                                            {article.title && (
                                                <h5 className="text-white font-bold uppercase tracking-wider mb-3">{article.title}</h5>
                                            )}
                                            <div className="text-sm text-smoke-white/80 leading-relaxed whitespace-pre-wrap">
                                                {article.content}
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-mafia-gold/40 font-mono uppercase tracking-widest">
                                                {lang === 'cs' ? 'Záznam pořízen:' : 'Log Date:'} {new Date(article.createdAt).toLocaleDateString(lang === 'cs' ? 'cs-CZ' : 'en-US')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                              )}
                              
                              <div className="w-full h-px bg-white/10 my-4"></div>
                              
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <p className="text-mafia-gold/50 font-mono text-xs uppercase tracking-widest max-w-sm">
                                  {lang === 'cs'
                                    ? "Tato část životopisu je exkluzivně pro loajální klienty. Jsem rád, že jsi tu s námi."
                                    : "This part of the biography is exclusive to loyal clients. I'm glad you're here with us."}
                                </p>
                                
                                <button 
                                  onClick={() => {
                                    if (navigator.share) {
                                      navigator.share({
                                        title: 'MMBarber - Tajný Životopis',
                                        url: window.location.href
                                      }).catch(console.error);
                                    } else {
                                      navigator.clipboard.writeText(window.location.href);
                                      setIsCopied(true);
                                      setTimeout(() => setIsCopied(false), 2000);
                                    }
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 border border-mafia-gold/30 hover:bg-mafia-gold hover:text-black transition-colors rounded text-[10px] font-mono uppercase tracking-widest text-mafia-gold whitespace-nowrap"
                                >
                                  <Share2 size={14} />
                                  {isCopied ? (lang === 'cs' ? "Zkopírováno!" : "Copied!") : (lang === 'cs' ? "Máš svého šéfa? Pošli mu to!" : "Have a boss? Share this!")}
                                </button>
                              </div>
                           </motion.div>
                         )}
                      </motion.div>
                    )}

                    {activeFolderId === 'classified_1' && activeBarberSafe.id === 'tomas' && (
                      <motion.div
                        key="folder_classified1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 border border-white/10 p-6 rounded-sm bg-black/40"
                      >
                        <h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-4">
                          {lang === 'cs' ? "PROJEKT X - PRACOVNÍ SLOŽKA" : "PROJECT X - WORK FILE"}
                        </h4>
                        <div className="text-sm text-smoke-white/80 leading-relaxed space-y-4">
                          <p>Tato složka byla odemčena díky sbírání fragmentů. Brzy zde přibudou další informace o zákulisí MMBARBER a plánech do budoucna.</p>
                          <p className="italic text-white/40">Záznam končí...</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* DNA Model */}
                  {isFullyUnlocked && activeBarberSafe.id === 'tomas' && graphicsTier !== 'lite' && (
                    <div className="w-full my-8 relative flex justify-center items-center">
                      <AnimusDNA3D isBloodMode={isBloodMode} isNoirMode={isNoirMode} />
                    </div>
                  )}

                  {/* Call to action & switch bar */}
                  <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
                    
                    <a
                      href={activeBarberSafe.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow py-4 bg-mafia-gold text-mafia-black font-heading font-black tracking-[0.25em] uppercase text-xs flex items-center justify-center gap-2 rounded shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.25)] hover:bg-white hover:border-white transition-all cursor-pointer"
                    >
                      <Calendar size={14} />
                      <span>{lang === 'cs' ? "REZERVOVAT KŘESLO" : "BOOK A CHAIR"}</span>
                    </a>

                    {((activeBarberSafe.id === "tomas" && isNellaVisible) || (activeBarberSafe.id === "nella" && isTomasVisible)) && (
                      <button
                        onClick={() => handleSelectBarber(activeBarberSafe.id === "tomas" ? "nella" : "tomas")}
                        className="py-3.5 px-6 bg-transparent border border-white/10 hover:border-white/30 text-white/60 hover:text-white font-mono text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all cursor-pointer rounded"
                      >
                        <RefreshCw size={12} />
                        <span>
                          {lang === 'cs' 
                            ? `Přepnout na ${activeBarberSafe.id === "tomas" ? customNellaName : customTomasName}`
                            : `Switch to ${activeBarberSafe.id === "tomas" ? customNellaName : customTomasName}`}
                        </span>
                      </button>
                    )}

                  </div>

                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showUnlockOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="text-center"
              >
                <div className="mb-6 mx-auto w-24 h-24 border-4 border-mafia-gold rounded-full flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(197,160,89,0.5)]">
                  <CheckCircle2 size={48} className="text-mafia-gold" />
                </div>
                <h2 className="text-4xl md:text-6xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-4 drop-shadow-[0_0_10px_rgba(197,160,89,0.8)]">
                  PŘÍSTUP ODEMČEN
                </h2>
                <p className="font-mono text-white/50 tracking-widest uppercase">
                  Data kompletně dešifrována a sestavena
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-mafia-black border border-mafia-gold/50 p-8 md:p-12 max-w-md w-full relative shadow-[0_0_50px_rgba(197,160,89,0.2)] text-center rounded-sm"
              >
                <button 
                  onClick={() => setShowPasswordModal(false)}
                  className="absolute top-4 right-4 text-white/30 hover:text-white font-mono text-xs uppercase tracking-widest"
                >
                  [ ZAVŘÍT ]
                </button>
                <h3 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-6 italic">
                  {lang === 'cs' ? "Autorizace nutná" : "Authorization Required"}
                </h3>
                <input 
                  type="password"
                  value={passwordInput}
                  maxLength={17}
                  onChange={(e) => {
                    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                    if (val === "OPEN") {
                      setCheatUnlocked(true);
                      setPasswordInput("");
                      playSound("/sounds/reload.mp3", 0.5);
                      setShowPasswordModal(false);
                      return;
                    }
                    let formatted = '';
                    if (val.length > 0) formatted = val.substring(0, 7);
                    if (val.length > 7) formatted += '-' + val.substring(7, 11);
                    if (val.length > 11) formatted += '-' + val.substring(11, 15);
                    setPasswordInput(formatted);
                  }}
                  className="w-full bg-black/50 border border-white/20 p-4 text-white text-center font-mono tracking-[0.5em] uppercase focus:border-mafia-gold focus:outline-none mb-6 rounded-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                  placeholder="KRYPTON-XXXX-XXXX"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnlock();
                    }
                  }}
                  disabled={isUnlocking}
                />
                <button 
                  onClick={handleUnlock}
                  disabled={isUnlocking}
                  className="w-full py-4 bg-mafia-gold text-black font-black uppercase tracking-[0.3em] mb-8 hover:bg-white transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUnlocking ? "..." : (lang === 'cs' ? "ODEMKNOUT DATA" : "UNLOCK DATA")}
                </button>
                <div className="w-12 h-px bg-mafia-gold/30 mx-auto mb-6"></div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">
                  {lang === 'cs' 
                    ? "Pokud chceš bližší životopis, dostav se k nám na křeslo. Tomáš ti dá heslo osobně." 
                    : "If you want the detailed biography, visit us in person. Tomas will give you the password."}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-auto w-full z-10 relative">
        <Footer />
        <HiddenSeoArchive lang={lang} mode="seo-hidden" />
      </div>
    </main>
  );
}
