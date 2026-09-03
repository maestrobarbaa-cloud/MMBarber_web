import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/utils/analytics';
import { playSound } from '@/utils/audio';
import { type Language } from '@/hooks/useTranslation';

interface UseHeaderSearchProps {
  lang: Language;
  setIsAboutMeOpen: (v: boolean) => void;
  setIsThoughtsOpen: (v: boolean) => void;
  setIsVisionOpen: (v: boolean) => void;
  setIsWebInfoOpen: (v: boolean) => void;
  setIsPerformanceOpen: (v: boolean) => void;
  switchLanguage: (lang: Language) => void;
}

export function useHeaderSearch({ 
  lang, 
  setIsAboutMeOpen, 
  setIsThoughtsOpen, 
  setIsVisionOpen, 
  setIsWebInfoOpen, 
  setIsPerformanceOpen,
  switchLanguage
}: UseHeaderSearchProps) {
  const router = useRouter();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const searchTimestamps = useRef<number[]>([]);
  const [isInterrogationActive, setIsInterrogationActive] = useState(false);
  const [mouseDelta, setMouseDelta] = useState(0);
  const lastMouseX = useRef(0);

  const searchIndex = [
    { keywords: ["barber", "tomáš", "tomas", "specialista", "specialist", "rezerv", "book", "kadeřník", "holič", "operativci"], id: "operativi" },
    { keywords: ["informace", "info", "pravidla", "platba", "cash", "parkování", "parking", "vlasy", "hair", "gel", "umyt", "wash", "svátky", "holiday", "calend", "kalendář"], id: "holidays" },
    { keywords: ["kontakt", "contact", "adresa", "address", "telefon", "phone", "mapa", "map", "najít", "find"], id: "kontakt" },
    { keywords: ["ceník", "cena", "price", "services", "služby", "střih", "cut", "vous", "beard", "kombo", "combo", "exclusive", "premium", "fade", "basic"], id: "services" },
    { keywords: ["galerie", "gallery", "foto", "photo", "prostředí", "environment", "salon", "interior"], id: "galerie-prostredi" },
    { keywords: ["hodnocení", "hodnoceni", "přezdívky", "prezdivky", "rating", "nicknames", "elita", "elite"], id: "hodnoceni_page" },
  ];

  const handleInterrogationMouseMove = (e: React.MouseEvent) => {
    if (!isInterrogationActive) return;
    if (lastMouseX.current !== 0) {
      const delta = Math.abs(e.clientX - lastMouseX.current);
      setMouseDelta(prev => {
        const next = prev + delta;
        if (next > 2000) {
          setIsInterrogationActive(false);
          searchTimestamps.current = [];
          return 0;
        }
        return next;
      });
    }
    lastMouseX.current = e.clientX;
  };

  const runCommand = (cmd: string) => {
    const query = cmd.toLowerCase().trim();
    setIsConsoleOpen(true);
    setConsoleOutput(lang === 'cs' ? ["Inicializace..."] : ["Initializing..."]);
    
    setTimeout(() => {
      setConsoleOutput(prev => [...prev, lang === 'cs' ? `Vyhledávání v databázi pro: ${query}` : `Searching database for: ${query}`]);
      
      setTimeout(() => {
        if (query === "intro" || query === "menu" || query === "welcome") {
          localStorage.removeItem("mmbarber_visited");
          const csIntroReset = ["RESETOVÁNÍ PŘÍZNAKU NÁVŠTĚVY...", "SPUŠTĚNÍ UVÍTACÍHO MENU...", "ČEKEJTE."];
          const enIntroReset = ["RESETTING VISIT FLAG...", "LAUNCHING WELCOME MENU...", "STAND BY."];
          setConsoleOutput(prev => [...prev, ...(lang === 'cs' ? csIntroReset : enIntroReset)]);
          playSound("/sounds/success.mp3", 0.5);
          setTimeout(() => {
            setIsConsoleOpen(false);
            window.dispatchEvent(new Event("mmbarber-trigger-intro"));
          }, 1800);
        } else if (query === "odkrýt" || query === "odkryt" || query === "reveal") {
          setConsoleOutput(prev => [...prev, lang === 'cs' ? "PŘÍSTUP POVOLEN." : "ACCESS GRANTED.", lang === 'cs' ? "Dešifrování operativních souborů..." : "Decrypting operative files...", lang === 'cs' ? "Profily odhaleny." : "Profiles revealed."]);
          window.dispatchEvent(new Event("mmbarber-reveal-barbers"));
          playSound("/sounds/success.mp3", 0.5);
          setTimeout(() => setIsConsoleOpen(false), 3000);
        } else if (query === "admin") {
          setConsoleOutput(prev => [...prev, lang === 'cs' ? "DETEKOVÁNO ADMINISTRÁTORSKÉ OPRÁVNĚNÍ." : "ADMIN CLEARANCE DETECTED.", lang === 'cs' ? "Přesměrování na centrální velitelství..." : "Redirecting to central command...", lang === 'cs' ? "Čekejte." : "Stand by."]);
          playSound("/sounds/success.mp3", 0.5);
          setTimeout(() => {
            setIsConsoleOpen(false);
            router.push("/admin");
          }, 2000);
        } else {
          setConsoleOutput(prev => [...prev, lang === 'cs' ? "CHYBA: Příkaz nenalezen nebo přístup odepřen." : "ERROR: Command not found or Access Denied."]);
          playSound("/sounds/vrong.mp3", 0.5);
          setTimeout(() => setIsConsoleOpen(false), 2000);
        }
      }, 800);
    }, 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const now = Date.now();
    searchTimestamps.current = searchTimestamps.current.filter(t => now - t < 10000);
    searchTimestamps.current.push(now);

    if (searchTimestamps.current.length > 5) {
      setIsInterrogationActive(true);
      setSearchQuery("");
      setIsSearchOpen(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    if (query === "intro" || query === "menu" || query === "welcome" || query === "odkrýt" || query === "odkryt" || query === "reveal" || query === "admin") {
      runCommand(query);
      setSearchQuery("");
      setIsSearchOpen(false);
      return;
    }

    if (query === "valentýn" || query === "valentyn") {
      setIsSearchOpen(false);
      setSearchQuery("");
      router.push("/valentynmatch");
      return;
    }

    if (query === "stealth") {
      const current = localStorage.getItem("mmbarber_stealth_mode") === "true";
      localStorage.setItem("mmbarber_stealth_mode", String(!current));
      window.dispatchEvent(new CustomEvent("mmbarber-stealth-update", { detail: !current }));
      setSearchQuery("");
      setIsSearchOpen(false);
      return;
    }

    if (query === "dev") {
      const current = localStorage.getItem("mmbarber_dev_mode") === "true";
      localStorage.setItem("mmbarber_dev_mode", String(!current));
      window.dispatchEvent(new Event("mmbarber-dev-mode-toggle"));
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_dev", { enabled: !current });
      return;
    }

    if (query === "země" || query === "zeme" || query === "earth") {
      setIsSearchOpen(false);
      setSearchQuery("");
      window.dispatchEvent(new Event('mmbarber-earth-protocol'));
      trackEvent("header_search_earth_protocol");
      return;
    }

    if (query === "galaxy" || query === "noc" || query === "night") {
      localStorage.setItem("mmbarber_atmosphere_override", "galaxy");
      window.dispatchEvent(new Event("mmbarber-atmosphere-update"));
      setIsSearchOpen(false);
      setSearchQuery("");
      trackEvent("header_search_atmosphere_galaxy");
      return;
    }

    if (query === "classic" || query === "den" || query === "day" || query === "standard") {
      localStorage.setItem("mmbarber_atmosphere_override", "classic");
      window.dispatchEvent(new Event("mmbarber-atmosphere-update"));
      setIsSearchOpen(false);
      setSearchQuery("");
      trackEvent("header_search_atmosphere_classic");
      return;
    }

    if (query === "auto" || query === "reset") {
      localStorage.removeItem("mmbarber_atmosphere_override");
      window.dispatchEvent(new Event("mmbarber-atmosphere-update"));
      setIsSearchOpen(false);
      setSearchQuery("");
      return;
    }

    const seasonalThemes = ['winter', 'cny', 'valentine', 'spring', 'easter', 'witches', 'may', 'midsummer', 'summer', 'harvest', 'halloween', 'allsouls', 'christmas', 'silvestr', 'sakura', 'czech', 'matrix', 'legacy', 'victory', 'st-patricks', 'friday13'];
    const aliasMap: Record<string, string> = {
      'japan': 'sakura', 'japonsko': 'sakura',
      'dragon': 'cny', 'čína': 'cny',
      'xmas': 'christmas', 'vanoce': 'christmas',
      'valentyn': 'valentine',
      'jaro': 'spring',
      'leto': 'summer',
      'podzim': 'harvest',
      'zima': 'winter'
    };

    if (seasonalThemes.includes(query) || aliasMap[query]) {
      const theme = aliasMap[query] || query;
      localStorage.setItem("mmbarber_atmosphere_override", theme);
      window.dispatchEvent(new Event("mmbarber-atmosphere-update"));
      setIsSearchOpen(false);
      setSearchQuery("");
      trackEvent(`header_search_atmosphere_${theme}`);
      return;
    }

    if (query === "vip") {
      setIsSearchOpen(false);
      setSearchQuery("");
      router.push("/vip-club");
      trackEvent("header_search_vip_access");
      return;
    }

    if (query === "mák" || query === "maky" || query === "poppy" || query === "veteran") {
      localStorage.setItem("mmbarber_dev_visual_mode", "poppy");
      window.dispatchEvent(new Event("mmbarber-force-theme-eval"));
      setIsSearchOpen(false);
      setSearchQuery("");
      return;
    }

    if (query === "normal") {
      localStorage.setItem("mmbarber_dev_visual_mode", "normal");
      window.dispatchEvent(new Event("mmbarber-force-theme-eval"));
      setIsSearchOpen(false);
      setSearchQuery("");
      return;
    }

    if (query === "737") {
      setIsSearchOpen(false);
      setSearchQuery("");
      window.dispatchEvent(new Event('mmbarber-trigger-737'));
      trackEvent("header_search_737_sequence");
      return;
    }

    if (query === "cheat" || query === "cheaty" || query === "kódy" || query === "kody") {
      setIsSearchOpen(false);
      setSearchQuery("");
      router.push("/the-cheats");
      trackEvent("header_search_cheat_sheet");
      return;
    }

    if (query === "normal") {
      const modeClasses = Array.from(document.documentElement.classList).filter(c => c.startsWith('mode-'));
      modeClasses.forEach(c => document.documentElement.classList.remove(c));
      localStorage.setItem("mmbarber_dev_visual_mode", 'normal');
      window.dispatchEvent(new Event('mmbarber-mode-update'));

      const themeClasses = Array.from(document.documentElement.classList).filter(c => c.startsWith('theme-'));
      themeClasses.forEach(c => document.documentElement.classList.remove(c));
      localStorage.removeItem("mmbarber_dev_accent_color");
      window.dispatchEvent(new Event('mmbarber-accent-update'));

      document.documentElement.classList.remove("noir-mode");
      localStorage.setItem("mmbarber_noir_mode", "false");
      localStorage.setItem("mmbarber_game_enabled", "false");
      localStorage.setItem("mmbarber_dev_theme_override", 'default');
      switchLanguage('cs');
      
      window.dispatchEvent(new Event('mmbarber-game-update'));
      window.dispatchEvent(new Event('mmbarber-theme-update'));
      window.dispatchEvent(new Event('mmbarber-dev-mode-toggle'));

      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_reset_all");
      return;
    }

    if (query === "omne" || query === "autor" || query === "micka") {
      setIsAboutMeOpen(true);
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_about_me");
      return;
    }

    if (query === "myslenky" || query === "filozofie" || query === "pravda") {
      setIsThoughtsOpen(true);
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_thoughts");
      return;
    }

    if (query === "vize" || query === "budoucnost" || query === "sny") {
      setIsVisionOpen(true);
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_vision");
      return;
    }

    if (query === "o webu" || query === "owebu" || query === "o-webu" || query === "web") {
      setIsWebInfoOpen(true);
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_web_info");
      return;
    }

    if (query === "výkon" || query === "vykon" || query === "performance" || query === "stats" || query === "diagnostika") {
      setIsPerformanceOpen(true);
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_performance");
      return;
    }

    if (query === "boss") {
      switchLanguage('boss');
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_boss_mode");
      return;
    }

    if (query === "falco" || query === "pes" || query === "dog") {
      switchLanguage('falco');
      
      const classes = Array.from(document.documentElement.classList).filter(c => c.startsWith('mode-'));
      classes.forEach(c => document.documentElement.classList.remove(c));
      document.documentElement.classList.add('mode-falco');
      localStorage.setItem("mmbarber_dev_visual_mode", "falco");
      window.dispatchEvent(new Event('mmbarber-mode-update'));

      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_falco_mode");
      return;
    }

    if (query === "radio") {
      const current = localStorage.getItem("mmbarber_radio_forced") === "true";
      localStorage.setItem("mmbarber_radio_forced", String(!current));
      window.dispatchEvent(new Event('mmbarber-radio-force-update'));
      setIsSearchOpen(false);
      setSearchQuery("");
      trackEvent("header_search_radio_toggle", { enabled: !current });
      return;
    }

    if (query === "hry" || query === "games") {
      const current = localStorage.getItem("mmbarber_game_forced") === "true";
      localStorage.setItem("mmbarber_game_forced", String(!current));
      window.dispatchEvent(new Event('mmbarber-game-force-update'));
      setIsSearchOpen(false);
      setSearchQuery("");
      trackEvent("header_search_game_force");
      return;
    }

    if (query === "legacy" || query === "812" || query === "founder") {
      setIsSearchOpen(false);
      setSearchQuery("");
      const classes = Array.from(document.documentElement.classList).filter(c => c.startsWith('mode-'));
      classes.forEach(c => document.documentElement.classList.remove(c));
      document.documentElement.classList.add('mode-legacy');
      localStorage.setItem("mmbarber_dev_visual_mode", "legacy");
      window.dispatchEvent(new Event('mmbarber-mode-update'));
      trackEvent("header_search_legacy_mode");
      return;
    }

    if (["matrix", "crt", "pixel", "chaos", "valentine", "halloween", "christmas", "newyear", "czech", "secret", "tajne", "tajně", "patrik", "stpatricks", "patrick", "friday13", "friday15", "witches", "carodejnice", "victory", "vitezstvi", "vítězství"].includes(query)) {
      const themeClasses = Array.from(document.documentElement.classList).filter(c => c.startsWith('mode-'));
      themeClasses.forEach(c => document.documentElement.classList.remove(c));
      
      let mode = query;
      if (query === 'pixel') mode = 'pixelate';
      if (query === 'tajne' || query === 'tajně') mode = 'secret';
      if (['patrik', 'stpatricks', 'patrick'].includes(query)) mode = 'st-patricks';
      if (query === 'friday15') mode = 'friday13';
      if (query === 'carodejnice') mode = 'witches';
      if (query === 'vitezstvi' || query === 'vítězství') mode = 'victory';

      document.documentElement.classList.add(`mode-${mode}`);
      localStorage.setItem("mmbarber_dev_visual_mode", mode);
      
      window.dispatchEvent(new Event('mmbarber-mode-update'));
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_visual_mode", { mode });
      return;
    }

    const match = searchIndex.find(item =>
      item.keywords.some(kw => query.includes(kw) || kw.includes(query))
    );

    if (match) {
      if (match.id === "services") {
        router.push("/cenik");
        trackEvent("header_search", { query, matched: "cenik_page" });
      } else if (match.id === "hodnoceni_page") {
        router.push("/hodnoceni");
        trackEvent("header_search", { query, matched: "hodnoceni_page" });
      } else {
        const el = document.getElementById(match.id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          trackEvent("header_search", { query, matched: match.id });
        }
      }
    } else {
      playSound("/sounds/vrong.mp3", 0.5);
    }
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(prev => {
      if (!prev) setTimeout(() => searchInputRef.current?.focus(), 100);
      return !prev;
    });
  };

  return {
    isSearchOpen, setIsSearchOpen,
    searchQuery, setSearchQuery,
    searchInputRef,
    consoleOutput, isConsoleOpen,
    isInterrogationActive, mouseDelta,
    handleInterrogationMouseMove,
    handleSearch, toggleSearch
  };
}
