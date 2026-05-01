"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { trackEvent } from "../utils/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "../utils/audio";
import { WeatherOverlay } from "./WeatherOverlay";
import NextImage from "next/image";
import Image from "./OptimizedImage";

const LATIN_SLOGANS: Record<string, string> = {
  // CZECH SLOGANS
  "Místo pro ty, co nepotřebují vykřikovat svůj styl do světa.": "Locus iis qui stilum suum mundo clamare non debent.",
  "Kvalita se pozná i bez zbytečných slov.": "Qualitas etiam sine verbis supervacuis agnoscitur.",
  "Styl, který si nekoupíš. Musíš si ho zasloužit.": "Stylus quem non emas. Mereri debes.",
  "Nezajímá nás kvantita. Chceme, abys od nás odcházel jako nový člověk.": "Quantitas non interest. Te novum hominem hinc abire volumus.",
  "Tohle není jen barbershop. Je to náš svět, do kterého tě zveme.": "Hic non solum tonstrina est. Mundus noster est quo te invitamus.",

  // EASTER EGG SLOGANS
  "Tady neřešíme, kdo jsi byl. Zajímá nás, s jakou vizí odcházíš.": "Hic non curamus quis fueris. Interest qua visione abeas.",
  "Ne všechno, co tu vytváříme, uvidíš jen v zrcadle.": "Non omnia quae hic creamus in speculo tantum videntur.",
  "Sebevědomí, které si od nás odneseš, u dveří nekončí.": "Fiducia quam hinc aufers ad ostium non desinit.",
  "Every success of yours is our success too. We're in this together.": "Omnis successus tuus etiam noster est. Una sumus.",
  "Nezáleží na tom, odkud přicházíš. Záleží na tom, co po tobě zůstane.": "Non interest unde venias. Interest quid post te maneat.",
  "Když se rozhodneš změnit pravidla hry, začneš psát novou historii.": "Cum regulas ludi mutare statueris, novam historiam scribere incipies.",
  "Některá jména se zapomínají. Skutečný charakter zůstává.": "Quaedam nomina obliviscuntur. Character verus manet.",
  "Tady stavíme na hodnotách, které se dneska už moc nenosí.": "Hic fundamenta iacimus in virtutibus quae hodie rarae sunt.",

  // NIGHT SLOGANS
  "Město už spí, ale tvůj nový styl začíná právě teď.": "Urbs dormit, sed novus stylus tuus nunc incipit.",
  "Ššš… ještě jsi vzhůru? Ideální čas si zajistit křeslo.": "Silere... adhuc vigilas? Tempus est sedem parare.",
  "Noc patří těm, co vědí, co chtějí. Tvoje rezervace čeká.": "Nox iis est qui sciunt quid velint. Reservatio tua manet.",
  "Zítřek začíná dnešním rozhodnutím. Klikni a máš své místo.": "Cras hodierna decisione incipit. Preme et locum habe.",
  "Nečekej na ráno, ty nejlepší termíny mizí za tmy.": "Ne mane expectaveris, optima tempora in tenebris evanescunt.",

  // DEEP NIGHT SLOGANS
  "Půlnoc. Hradiště utichlo… a ty víš, že je čas na změnu.": "Media nox. Urbs siluit... et scis tempus esse mutandi.",
  "Tahle hodina patří vyvoleným. Tvé místo u nás je připravené.": "Haec hora electis est. Locus tuus paratus est.",
  "Pokud nespíš, máš k tomu důvod. Udělej ten první krok k nám.": "Si non dormis, causam habes. Primum gradum ad nos fac.",
  "V tuhle dobu se dělají ta nejlepší rozhodnutí. Potvrď si termín.": "Hoc tempore optima consilia capiuntur. Reservationem confirma.",
  "Jsi blíž svému novému já, než si v tuhle chvíli myslíš.": "Propior es novo te quam hoc momento putas.",

  // MOTTOES / CHAPTERS
  "Příběh první: Kde se rodí styl": "Historia Prima: Ubi stylus nascitur",
  "Příběh druhý: O loajalitě": "Historia Secunda: De fidelitate",
  "Příběh třetí: Poctivé řemeslo": "Historia Tertia: Ars honesta",
  "Story one: Where style is born": "Historia Prima: Ubi stylus nascitur",
  "Story two: About loyalty": "Historia Secunda: De fidelitate",
  "Story three: Honest craft": "Historia Tertia: Ars honesta",

  // ENGLISH SLOGANS
  "A place for those who don't need to shout their style to the world.": "Locus iis qui stilum suum mundo clamare non debent.",
  "Quality is recognized even without unnecessary words.": "Qualitas etiam sine verbis supervacuis agnoscitur.",
  "Style you can't buy. You have to earn it.": "Stylus quem non emas. Mereri debes.",
  "We don't care about quantity. We want you to leave here as a new person.": "Quantitas non interest. Te novum hominem hinc abire volumus.",
  "This isn't just a barbershop. It's our world we're inviting you to.": "Hic non solum tonstrina est. Mundus noster est quo te invitamus.",

  "We don't care who you were here. We care what vision you leave with.": "Hic non curamus quis fueris. Interest qua visione abeas.",
  "Not everything we create here you'll see only in the mirror.": "Non omnia quae hic creamus in speculo tantum videntur.",
  "The confidence you take from us doesn't end at the door.": "Fiducia quam hinc aufers ad ostium non desinit.",
  "It doesn't matter where you come from. It matters what you leave behind.": "Non interest unde venias. Interest quid post te maneat.",
  "Some names are forgotten. Real character remains.": "Quaedam nomina obliviscuntur. Character verus manet.",

  "City's already asleep, but your new style starts right now.": "Urbs dormit, sed novus stylus tuus nunc incipit.",
  "Shh... still awake? Ideal time to secure your chair.": "Silere... adhuc vigilas? Tempus est sedem parare.",
  "Night belongs to those who know what they want. Your booking awaits.": "Nox iis est qui sciunt quid velint. Reservatio tua manet.",
  "Tomorrow starts with today's decision. Click and you have your spot.": "Cras hodierna decisione incipit. Preme et locum habe.",
  "Don't wait for morning, best slots vanish in the dark.": "Ne mane expectaveris, optima tempora in tenebris evanescunt.",

  "Midnight. Hradiště quieted... and you know it's time for a change.": "Media nox. Urbs siluit... et scis tempus esse mutandi.",
  "This hour belongs to the chosen. Your spot with us is ready.": "Haec hora electis est. Locus tuus paratus est.",
  "If you're not sleeping, you have a reason. Take that first step to us.": "Si non dormis, causam habes. Primum gradum ad nos fac.",
  "Best decisions are made at this time. Confirm your booking.": "Hoc tempore optima consilia capiuntur. Reservationem confirma.",
  "You're closer to your new self than you think right now.": "Propior es novo te quam hoc momento putas.",


  // BOSS SLOGANS
  "Tady se neptáme, co jsi dělal včera. Důležité je, jak vypadáš dnes.": "Non quaerimus quid heri feceris. Refert quomodo hodie videaris.",
  "Respekt se nezískává slovy, ale činy. A tvým vzhledem.": "Respectus non verbis, sed factis et specie acquiritur.",
  "V našem křesle jsi pod ochranou. Ostatní nechej za dveřmi.": "In sede nostra protectus es. Reliqua post fores relinque.",
  "Kšefty se dělají tam, kde vládne styl. My ti ho dáme.": "Negotia ubi stylus regnat aguntur. Nos tibi eum dabimus.",
  "Rodina je základ. A tvůj střih je tvá vizitka.": "Familia fundamentum est. Et tonsura tua tessera est.",
  "Pravidlo první: Loajalita": "Regula prima: Fidelitas",
  "Pravidlo druhé: Mlčení": "Regula secunda: Silentium",
  "Pravidlo třetí: Respekt": "Regula tertia: Respectus",
  "I když město spí, my hlídáme tvůj styl.": "Etiam si urbs dormit, stylum tuum custodimus.",
  "Noc je dlouhá, ale tvoje místo u nás je jisté.": "Nox longa est, sed locus tuus apud nos certus est.",
  "Pravý šéf ví, kdy je čas na změnu.": "Verus dux scit quando tempus sit mutandi.",
  "V tuhle hodinu se řeší ty nejdůležitější věci.": "Hac hora res gravissimae aguntur.",
  "Hradiště utichlo, ale my jsme stále v pohotovosti.": "Urbs siluit, sed nos adhuc vigilemus.",
  "Někdy je lepší mlčet a nechat za sebe mluvit svůj střih.": "Aliquando melius est silere et tonsuram pro te loqui sinere.",
  "Kdo má styl, nepotřebuje křičet.": "Qui stylum habet, clamare non debet.",

  // FALCO SLOGANS
  "Stil ist eine Entscheidung, kein Zufall.": "Stylus decisio est, non casus.",
  "Eleganz ist die einzige Schönheit, die niemals vergeht.": "Elegantia sola pulchritudo est quae nunquam perit.",
  "Ein Gentleman schweigt und genießt den Moment im Sessel.": "Vir generosus silet et momentum in sede fruitur.",
  "Wir kreieren nicht nur Schnitte, wir kreieren Legenden.": "Non solum tonsuras, sed legandas creamus.",
  "Der Wiener Charme trifft auf tschechisches Handwerk.": "Lepos Vindobonensis artes Bohemicas occurrit.",
  "Kapitel Eins: Der Kaiser": "Caput Primum: Imperator",
  "Kapitel Zwei: Die Musik": "Caput Secundum: Musica",
  "Kapitel Drei: Der Ruhm": "Caput Tertium: Gloria",
  "Die Stadt schläft, aber der Kaiser wacht.": "Urbs dormit, sed imperator vigilat.",
  "Nachtstunden sind für die Elite.": "Horae nocturnae electis sunt."
};

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useTranslation();
  
  // Dynamic Hero Logic - Random Start
  const [activeHero, setActiveHero] = useState<1 | 2 | 3>(1);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isEasterEgg, setIsEasterEgg] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = useState(false);
  const [selectedMotto, setSelectedMotto] = useState("");
  const [graphicsTier, setGraphicsTier] = useState<string>("low");

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1280);
    const updateTier = () => {
      const tier = document.documentElement.getAttribute('data-graphics-tier') || "low";
      setGraphicsTier(tier);
    };

    checkMobile();
    updateTier();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('mmbarber-graphics-update', updateTier);

    const initialEffectsState = localStorage.getItem("mmbarber_mobile_effects_enabled") === "true";
    setIsMobileEffectsEnabled(initialEffectsState);
    
    const handleMobileEffectsUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsMobileEffectsEnabled(detail);
    };
    window.addEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as EventListener);
    
    const getNewSlogan = () => {
      const now = new Date();
      const hour = now.getHours();
      let slogans = t.hero.description;
      
      if (hour >= 19 && hour <= 23) {
        slogans = t.hero.nightSlogans || slogans;
      } else if (hour >= 0 && hour < 6) {
        slogans = t.hero.deepNightSlogans || slogans;
      }

      const isGoldEnabled = typeof window !== 'undefined' && 
                            (localStorage.getItem("mmbarber_gold_slogans_enabled") === "true" || 
                             localStorage.getItem("mmbarber_vip_auth") === "true");
      
      if (isGoldEnabled && Math.random() < 0.15 && t.hero.easterEggSlogans) {
        slogans = t.hero.easterEggSlogans;
      }

      if (Array.isArray(slogans)) {
        return slogans[Math.floor(Math.random() * slogans.length)];
      }
      return slogans as string;
    };

    const initialSlogan = getNewSlogan();
    setDisplayText(initialSlogan);

    // Slogan Rotation Interval
    const sloganInterval = setInterval(() => {
      setIsSloganHovered(currentHover => {
        if (!currentHover) {
          setDisplayText(getNewSlogan());
        }
        return currentHover;
      });
    }, (graphicsTier === 'low') ? 30000 : 15000);

    // Motto is now handled by activeHero effect

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as EventListener);
      window.removeEventListener('mmbarber-graphics-update', updateTier);
      clearInterval(sloganInterval);
    };
  }, [t.hero.description, t.hero.easterEggSlogans, t.hero.nightSlogans, t.hero.deepNightSlogans, lang]);

  useEffect(() => {
    // Sync with Dev Menu
    const syncHero = () => {
      const override = localStorage.getItem('mmbarber_hero_override');
      if (!override) return;

      const targetHero = (
        override === '1' ? 1 : 
        override === '2' ? 2 : 
        3
      ) as 1 | 2 | 3;
      
      const isActuallyMobile = window.innerWidth < 1280;
      if (isActuallyMobile) {
        // Simple swap on mobile
        setActiveHero(targetHero);
        return;
      }

      // Trigger cinematic transition
      setIsGlitching(true);
      window.dispatchEvent(new Event('mmbarber-glitch-start'));

      setTimeout(() => {
        setActiveHero(targetHero);
        setTimeout(() => {
          setIsGlitching(false);
          window.dispatchEvent(new Event('mmbarber-glitch-end'));
        }, 750);
      }, 750);
    };
    
    syncHero();
    window.addEventListener('mmbarber-hero-update', syncHero);

    // Random Fate - Switch every 3-7 minutes (Only on Desktop)
    let interval: NodeJS.Timeout;
    const isActuallyMobile = window.innerWidth < 1280;
    if (!isActuallyMobile) {
      interval = setInterval(() => {
        if (localStorage.getItem('mmbarber_hero_override')) return;
        
        setIsGlitching(true);
        window.dispatchEvent(new Event('mmbarber-glitch-start'));
        
        // Synchronize swap with the peak of the shutter animation (0.75s)
        setTimeout(() => {
          setActiveHero(prev => {
            let next;
            do {
              next = Math.floor(Math.random() * 3) + 1;
            } while (next === prev);
            return next as 1 | 2 | 3;
          });
          
          // End glitch when shutter completely closes (1.5s total)
          setTimeout(() => {
            setIsGlitching(false);
            window.dispatchEvent(new Event('mmbarber-glitch-end'));
          }, 750); 
        }, 750);
      }, Math.random() * 240000 + 180000); // 3 to 7 minutes
    }
    return () => {
      window.removeEventListener('mmbarber-hero-update', syncHero);
      if (interval) clearInterval(interval);
    };
  }, []); // End of mounting effect

  // Sync Motto (Kapitola) with Active Hero — only small bottom text
  useEffect(() => {
    const heroData = t.hero as any;
    const mottoes = heroData.mottoes || [heroData.motto];
    // activeHero is 1, 2, or 3. Array is 0-indexed.
    const targetMotto = mottoes[activeHero - 1] || mottoes[0];
    setSelectedMotto(targetMotto);
  }, [activeHero, t.hero, lang]);

  const playRazorSound = () => {
    playSound("/sounds/břitva.mp3", 0.2);
  };

  const [isMissionReady, setIsMissionReady] = useState(false);
  const [isSloganHovered, setIsSloganHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMissionReady(true), (graphicsTier === 'low') ? 0 : 1800);
    return () => clearTimeout(timer);
  }, [graphicsTier]);

  const handleBookingScroll = () => {
    if (!isMissionReady) return;
    trackEvent("cta_hero_booking"); 
    const element = document.getElementById('operativi');
    if (element) {
      const headerOffset = window.innerWidth < 1280 ? 80 : 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const heroImage = 
    activeHero === 1 ? "/obr/main-hero.png" : 
    activeHero === 2 ? "/obr/hero-2.png" : 
    "/obr/hero-3.png";

  return (
    <section id="hero" data-no-click-effect="true" className="relative w-full min-h-[100dvh] xl:min-h-screen flex flex-col items-center justify-start xl:justify-center px-0 xl:px-4 pt-20 xl:pt-20 pb-0 overflow-x-hidden">
      
      {/* CINEMATIC GAMING TRANSITION - HIGH-END SHUTTER (Desktop only) */}
      <AnimatePresence mode="wait">
        {!isMobile && isGlitching && graphicsTier !== 'low' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden"
          >
             {/* Background Filler with Hex Pattern & Digital Noise */}
             <div className="absolute inset-0 bg-[#050505]">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute inset-0 opacity-10 animate-pulse bg-gradient-to-br from-mafia-gold/5 via-transparent to-mafia-gold/5"></div>
             </div>
             
             {/* Top Main Shutter */}
             <motion.div 
               initial={{ y: "-100%" }}
               animate={{ y: ["-100%", "0%", "-100%"] }}
               transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1], times: [0, 0.5, 1] }}
               className="absolute top-0 left-0 w-full h-1/2 bg-[#080808] border-b-2 border-mafia-gold/50 flex items-end justify-center group overflow-hidden"
               style={{ 
                 clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)"
               }}
             >
                {/* Internal HUD Elements */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>
                <div className="flex flex-col items-center mb-10 gap-3 relative z-10">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-mafia-gold"
                      />
                    ))}
                  </div>
                  <div className="text-mafia-gold font-mono text-[10px] tracking-[1.2em] uppercase font-black">MMBARBER_OS_ONERAT</div>
                  <div className="w-80 h-[2px] bg-mafia-gold/20 relative overflow-hidden">
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-y-0 w-1/3 bg-mafia-gold/80 blur-[1px]"
                    />
                  </div>
                </div>
             </motion.div>

             {/* Bottom Main Shutter */}
             <motion.div 
               initial={{ y: "100%" }}
               animate={{ y: ["100%", "0%", "100%"] }}
               transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1], times: [0, 0.5, 1] }}
               className="absolute bottom-0 left-0 w-full h-1/2 bg-[#080808] border-t-2 border-mafia-gold/50 flex items-start justify-center overflow-hidden"
               style={{ 
                 clipPath: "polygon(0 15%, 50% 0, 100% 15%, 100% 100%, 0 100%)"
               }}
             >
                <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>
                <div className="flex flex-col items-center mt-10 gap-3 relative z-10">
                  <div className="flex items-center gap-10">
                    <span className="text-mafia-gold/40 font-mono text-[8px] animate-pulse">AUTH_TOKEN: STATUS_OK</span>
                    <div className="w-12 h-px bg-mafia-gold/30"></div>
                    <span className="text-mafia-gold/40 font-mono text-[8px] animate-pulse">VOCATIO_SYST_PARATA</span>
                  </div>
                  <div className="text-mafia-gold/20 font-mono text-[10px] tracking-[0.8em] font-light">NEXUS_VISUALIS_STRUEBATUR</div>
                </div>
             </motion.div>

             {/* Center Tactical Core */}
             <motion.div
               initial={{ scale: 0, opacity: 0, rotate: 45 }}
               animate={{ 
                 scale: [0, 1.2, 1, 0], 
                 opacity: [0, 1, 1, 0],
                 rotate: [45, 225, 225, 405]
               }}
               transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
               className="absolute w-32 h-32 border-2 border-mafia-gold z-[120] flex items-center justify-center bg-mafia-black/80 backdrop-blur-sm"
               style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
             >
                <motion.div 
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                  className="w-10 h-10 border border-mafia-gold flex items-center justify-center"
                >
                   <div className="w-1 h-1 bg-mafia-gold rounded-full"></div>
                </motion.div>
             </motion.div>

             {/* Horizontal Beam Line */}
             <motion.div
               animate={{ 
                 scaleX: [0, 1, 0, 1, 0], 
                 opacity: [0, 1, 0.5, 1, 0],
                 height: ["1px", "4px", "1px"]
               }}
               transition={{ duration: 1.5, times: [0, 0.45, 0.5, 0.55, 1] }}
               className="absolute w-full bg-mafia-gold shadow-[0_0_20px_var(--color-mafia-gold)] z-[130]"
             />

          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIUM GAMING ARROWS HIDDEN PER USER REQUEST */}

      <div className="absolute inset-0 w-full h-[100dvh] xl:h-full xl:-z-10 pointer-events-none overflow-hidden flex flex-col justify-center xl:rounded-none">
        {/* Main background image with Clean Transition */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeHero}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              filter: isGlitching 
                ? "brightness(1.1) blur(4px)" 
                : "none" 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 0.8, ease: "easeOut" },
              scale: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }
            }}
            className={`absolute inset-0 w-full h-full z-0 overflow-hidden ${isGlitching ? 'animate-glitch' : ''}`}
          >
            <NextImage
              src={heroImage}
              alt="MMBARBER Background"
              fill
              priority
              loading="eager"
              {...({ fetchPriority: "high" } as any)}
              quality={90}
              className="object-cover xl:object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Global Weather - Fully hidden during shutter operation for a clean mechanical feel */}
        {!isGlitching && <WeatherOverlay />}

        {/* Stronger bottom fade to ground the content */}
        <div className="absolute inset-x-0 bottom-0 h-32 xl:h-64 bg-gradient-to-t from-mafia-black via-mafia-black/80 xl:via-mafia-black/40 to-transparent z-30"></div>
        
        {/* MOBILE SMOKE EFFECT (Conditional) */}
        {isMobile && isMobileEffectsEnabled && (
          <div className="absolute inset-0 z-30 pointer-events-none mix-blend-screen opacity-60">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/smoke2.webm" type="video/webm" />
              <source src="/smoke.mp4" type="video/mp4" />
            </video>
          </div>
        )}

        {/* MOBILE / TABLET TEXT & BUTTON OVER IMAGE */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 px-4 xl:hidden gap-6 sm:gap-8 pointer-events-auto">
          <div 
            onMouseEnter={() => setIsSloganHovered(true)}
            onMouseLeave={() => setIsSloganHovered(false)}
            className="min-h-[120px] w-full flex flex-col items-center justify-center"
          >
            <div className="relative">
              <AnimatePresence mode="wait">
                <div
                  key={displayText}
                  className="flex flex-col items-center"
                >
                  <motion.h1
                    className={`hero-slogan tracking-normal leading-[1.3] w-full max-w-[95vw] text-center transition-all duration-700 ${isSloganHovered ? 'scale-[1.02]' : ''} ${isEasterEgg ? 'text-mafia-gold drop-shadow-[0_0_15px_var(--user-glow-color)]' : 'text-white'} text-2xl xs:text-3xl sm:text-5xl md:text-6xl`}
                    style={{
                      fontFamily: "var(--font-great-vibes), cursive",
                      filter: (graphicsTier === 'low') ? "none" : (isEasterEgg 
                        ? "drop-shadow(0 2px 8px rgba(0,0,0,1)) drop-shadow(0 15px var(--user-glow-radius) var(--user-glow-color))"
                        : "drop-shadow(0 2px 8px rgba(0,0,0,1)) drop-shadow(0 15px 25px rgba(0,0,0,0.8))"),
                      wordBreak: "break-word"
                    }}
                  >
                    {isMounted && displayText && (
                      <div className="opacity-[0.85]">
                        {displayText}
                      </div>
                    )}
                  </motion.h1>

                  {/* Mobile Perfect Mirror Reflection - Grouped for Sync */}
                  {/* Mobile Reflection disabled for performance */}
                </div>
              </AnimatePresence>
            </div>
          </div>

          <div className="min-h-[60px] flex items-center justify-center">
            <motion.a
              key="mob-mission-ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              href="/#operativi"
              onClick={(e) => { 
                e.preventDefault();
                handleBookingScroll();
                playRazorSound();
              }}
              onMouseEnter={playRazorSound}
              className="group relative overflow-hidden bg-mafia-dark/80 border-2 border-mafia-gold px-8 py-3.5 transition-all duration-500 hover:shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)] shadow-[0_0_30px_rgba(197,160,89,0.2)] flex items-center justify-center w-fit mx-auto"
            >
              <div className="absolute inset-0 block bg-mafia-gold -translate-x-[102%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></div>
              <span className="relative z-10 text-mafia-gold font-sans text-sm sm:text-base uppercase tracking-[0.2em] font-black group-hover:text-mafia-black transition-colors whitespace-nowrap text-center" style={{ textShadow: "0 0 var(--user-glow-radius) var(--user-glow-color)" }}>
                {t.hero.bookBtn}
              </span>
            </motion.a>
          </div>

          {/* MOBILE GOLD MOTTO - MOVED TO BOTTOM */}
          <div className="absolute bottom-8 left-0 right-0 text-mafia-gold/70 font-mono text-[9px] tracking-[0.2em] uppercase text-center px-6">
            {isMounted && selectedMotto}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-5px, 5px) skew(2deg); filter: hue-rotate(90deg); }
          40% { transform: translate(5px, -5px) skew(-2deg); }
          60% { transform: translate(-3px, 2px); }
          80% { transform: translate(3px, -2px) skew(1deg); }
          100% { transform: translate(0); }
        }
        .animate-glitch {
          animation: glitch 0.3s ease-in-out infinite;
        }
      `}</style>

      <div 
        ref={containerRef} 
        onMouseEnter={() => setIsSloganHovered(true)}
        onMouseLeave={() => setIsSloganHovered(false)}
        className="hidden xl:flex relative z-20 flex-col items-center gap-10 w-full max-w-7xl mx-auto text-center px-8 -mt-32 min-h-[160px] group/slogan"
      >
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: (graphicsTier === 'low' || graphicsTier === 'medium') ? 0.5 : 1.5 } }}
              className="flex flex-col items-center"
            >
              <motion.h1
                className={`hero-slogan tracking-normal mb-2 leading-[1.3] w-full max-w-none px-4 whitespace-nowrap transition-all duration-700 ${isSloganHovered ? 'scale-[1.02]' : ''} ${isEasterEgg ? 'text-mafia-gold drop-shadow-[0_0_15px_var(--user-glow-color)]' : 'text-white'} text-5xl md:text-6xl`}
                style={{
                  fontFamily: "var(--font-great-vibes), cursive",
                  filter: (graphicsTier === 'low') ? "none" : (isEasterEgg 
                    ? "drop-shadow(0 2px 8px rgba(0,0,0,1)) drop-shadow(0 15px var(--user-glow-radius) var(--user-glow-color))"
                    : "drop-shadow(0 2px 8px rgba(0,0,0,1)) drop-shadow(0 15px 25px rgba(0,0,0,0.8))"),
                  wordBreak: "break-word"
                }}
              >
                {(graphicsTier === 'low' || graphicsTier === 'medium') ? (
                  isMounted && displayText
                ) : (
                  isMounted && displayText && displayText.split("").map((char, i) => (
                    <motion.span
                      key={`desk-${displayText}-${i}`}
                      initial={{ opacity: 0, filter: "blur(12px)", scale: 1.1 }}
                      animate={{ 
                        opacity: 0.8, 
                        filter: "blur(0px)", 
                        scale: 1,
                        textShadow: "0 0 15px rgba(197,160,89,0.3)"
                      }}
                      exit={{ 
                        opacity: 0, 
                        filter: "blur(50px) brightness(5)", 
                        scaleY: 2.5, 
                        scaleX: 0.8,
                        transition: { duration: 1.4, delay: i * 0.015, ease: "easeIn" }
                      }}
                      transition={{ 
                        duration: 1, 
                        delay: i * 0.03, 
                        ease: "easeOut" 
                      }}
                      className="inline-block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))
                )}
              </motion.h1>

              {/* Perfect Mirror Reflection Effect - Disabled for Low/Medium Tiers */}
              {graphicsTier !== 'low' && graphicsTier !== 'medium' && (
                <div className="absolute top-full left-0 w-full pointer-events-none select-none mt-20 flex justify-center">
                  <motion.div
                    animate={{ opacity: isSloganHovered ? 0.6 : 0 }}
                    transition={{ duration: 1 }}
                    className="w-full flex justify-center overflow-visible"
                    style={{ 
                      transformOrigin: "top center",
                      transform: "scaleY(-1) scaleX(-1)",
                      maskImage: "linear-gradient(to bottom, white 0%, rgba(255,255,255,0.6) 40%, transparent 95%)",
                      WebkitMaskImage: "linear-gradient(to bottom, white 0%, rgba(255,255,255,0.6) 40%, transparent 95%)",
                    }}
                  >
                    <h2 
                      className={`text-5xl md:text-6xl tracking-normal leading-[1.3] whitespace-nowrap ${isEasterEgg ? 'text-mafia-gold' : 'text-white/60'}`}
                      style={{ fontFamily: "var(--font-great-vibes), cursive" }}
                    >
                      {isMounted && displayText && (LATIN_SLOGANS[displayText] || displayText).split("").map((char, i) => (
                        <motion.span
                          key={`reflect-sync-${displayText}-${i}`}
                          initial={{ opacity: 0, filter: "blur(12px)", scale: 1.1 }}
                          animate={{ 
                            opacity: 1,
                            filter: "blur(0px)",
                            scale: 1
                          }}
                          exit={{ 
                            opacity: 0, 
                            filter: "blur(50px) brightness(5)", 
                            scaleY: 2.5,
                            scaleX: 0.8,
                            transition: { duration: 1.4, delay: i * 0.015, ease: "easeIn" }
                          }}
                          transition={{ 
                            duration: 1, 
                            delay: i * 0.03, 
                            ease: "easeOut" 
                          }}
                          className="inline-block"
                        >
                          {char === " " ? "\u00A0" : char}
                        </motion.span>
                      ))}
                    </h2>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* DESKTOP GOLD MOTTO - Moved to Bottom Right with Mirror Effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5 }}
        className="hidden xl:block absolute bottom-12 right-12 z-40 group cursor-default"
      >
        <div className="relative">
          {/* Main Text */}
          <div 
            className="text-mafia-gold font-mono text-[10px] tracking-[0.4em] uppercase transition-all duration-700 group-hover:scale-105 group-hover:tracking-[0.6em] group-hover:text-white"
            style={{ textShadow: "0 0 10px rgba(197, 160, 89, 0.4)" }}
          >
            {isMounted && selectedMotto.split("").map((char: string, i: number) => {
              const firstPeriodIndex = selectedMotto.indexOf('.');
              const isSecondSentence = firstPeriodIndex !== -1 && i > firstPeriodIndex;
              const pauseDelay = isSecondSentence ? 2.0 : 0;
              
              return (
                <motion.span
                  key={`desk-motto-${i}`}
                  initial={{ opacity: 0, filter: "blur(12px)", y: 10 }}
                  animate={{ opacity: 0.9, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 1.2, delay: 2.0 + pauseDelay + i * 0.06, ease: "easeOut" }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              );
            })}
          </div>

          {/* Mirror Reflection Effect */}
          <div 
            className="absolute top-full left-0 w-full opacity-20 pointer-events-none select-none blur-[2px]"
            style={{ 
              transform: "scaleY(-0.8) scaleX(-1) translateY(4px)",
              maskImage: "linear-gradient(to bottom, white, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, white, transparent)"
            }}
          >
            <div className="text-mafia-gold font-mono text-[10px] tracking-[0.4em] uppercase">
              {isMounted && (LATIN_SLOGANS[selectedMotto] || selectedMotto)}
            </div>
          </div>
        </div>
        
        {/* Subtle decorative line under motto on hover */}
        <motion.div 
          className="h-[1px] bg-mafia-gold mt-6 w-0 group-hover:w-full transition-all duration-1000 ease-in-out opacity-30"
        />
      </motion.div>

      <div className="hidden xl:flex relative z-20 mt-10 xl:mt-10 w-full justify-center pb-12 xl:pb-0 min-h-[60px]">
          <AnimatePresence mode="wait">
            {!isMissionReady ? (
              <motion.div 
                key="mission-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-2"
              >
                <div className="flex gap-1.5 mb-1">
                  {[1,2,3].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      className="w-2 h-2 bg-mafia-gold shadow-[0_0_10px_var(--color-mafia-gold-glow)]"
                    />
                  ))}
                </div>
                <span className="text-mafia-gold font-mono text-xs tracking-[1.5em] uppercase font-black ml-[1.5em]">
                  ONERANDI...
                </span>
              </motion.div>
            ) : (
              <motion.a
                key="mission-ready"
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                href="/#operativi"
                onClick={(e) => { 
                  e.preventDefault();
                  handleBookingScroll();
                  playRazorSound();
                }}
                onMouseEnter={playRazorSound}
                className="group relative overflow-hidden bg-mafia-dark/80 border-2 border-mafia-gold px-10 py-4 transition-all duration-500 hover:shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)] shadow-[0_0_30px_rgba(197,160,89,0.2)] flex items-center justify-center w-fit mx-auto"
              >
                <div className="absolute inset-0 block bg-mafia-gold -translate-x-[102%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></div>
                <span className="relative z-10 text-mafia-gold font-sans text-lg uppercase tracking-[0.3em] font-black group-hover:text-mafia-black transition-colors whitespace-nowrap text-center" style={{ textShadow: "0 0 var(--user-glow-radius) var(--user-glow-color)" }}>
                  {t.hero.bookBtn}
                </span>
              </motion.a>
            )}
          </AnimatePresence>
      </div>

    </section>
  );
}
