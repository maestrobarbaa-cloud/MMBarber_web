export type Language = 'cs' | 'en' | 'boss' | 'falco';

export const LANGUAGE_LABELS: Record<string, string> = {
  cs: 'Česky',
  en: 'English',
  boss: 'Boss Edition',
  falco: 'Falco Mode',
};

import { useState, useEffect, useMemo } from "react";
import { translations } from "../locales/translations";

export function useTranslation() {
  const [lang, setLang] = useState<Language>('cs');

  useEffect(() => {
    const saved = localStorage.getItem('mmbarber_lang') as Language;
    const validLangs: Language[] = ['cs', 'en', 'boss', 'falco'];
    
    // Automatic Boss Mode check (4:00 - 6:00)
    const hour = new Date().getHours();
    const isEarlyMorning = hour >= 4 && hour < 6;

    if (saved && validLangs.includes(saved)) {
      setLang(saved);
    } else if (isEarlyMorning) {
      setLang('boss');
    }

    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      setLang(customEvent.detail);
    };

    window.addEventListener('language_changed', handleLanguageChange);
    return () => window.removeEventListener('language_changed', handleLanguageChange);
  }, []);

  // Merging logic for Boss mode (inherits from CS)
  const t = useMemo(() => {
    if (lang === 'boss') {
      return { 
        ...translations.cs, 
        header: { ...translations.cs.header, ...(translations.boss as typeof translations.cs).header },
        hero: { ...translations.cs.hero, ...(translations.boss as typeof translations.cs).hero },
        services: { ...translations.cs.services, ...(translations.boss as typeof translations.cs).services },
        operatives: { ...translations.cs.operatives, ...(translations.boss as typeof translations.cs).operatives }
      };
    }
    if (lang === 'falco') {
      return { 
        ...translations.cs, 
        header: { ...translations.cs.header, ...(translations.falco as typeof translations.cs).header },
        hero: { ...translations.cs.hero, ...(translations.falco as typeof translations.cs).hero },
        services: { ...translations.cs.services, ...(translations.falco as typeof translations.cs).services },
        operatives: { ...translations.cs.operatives, ...(translations.falco as typeof translations.cs).operatives },
        intro: { ...translations.cs.intro, ...(translations.falco as typeof translations.cs).intro },
        theCode: { ...translations.cs.theCode, ...(translations.falco as typeof translations.cs).theCode }
      };
    }
    return (translations as any)[lang] || (translations as any).en;
  }, [lang]);

  const switchLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('mmbarber_lang', newLang);
    window.dispatchEvent(new CustomEvent('language_changed', { detail: newLang }));
  };

  return { t, lang: (lang === 'boss' || lang === 'falco') ? 'cs' : lang, currentMode: lang, switchLanguage };
}
