export type Language = 'cs' | 'en' | 'boss' | 'falco' | 'zh';

export const LANGUAGE_LABELS: Record<string, string> = {
  cs: 'Česky',
  en: 'English',
  boss: 'Boss Edition',
  falco: 'Falco Mode',
  zh: '中文 (C.N.Y.)',
};

import { useState, useEffect, useMemo } from "react";
import { translations } from "../locales/translations";
import { getVocative } from "../utils/nameInflection";
import { getActiveTheme } from "../lib/holidays";

function injectPlaceholders(obj: any, nickname: string, vocative: string): any {
  if (typeof obj === 'string') {
    if (!nickname) {
      return obj
        .replace(/[,\s]*\{\{vocative\}\}/g, '')
        .replace(/[,\s]*\{\{nickname\}\}/g, '')
        .replace(/ ,/g, ',')
        .replace(/ \./g, '.')
        .replace(/ !/g, '!')
        .replace(/ \?/g, '?');
    }
    return obj
      .replace(/\{\{nickname\}\}/g, nickname)
      .replace(/\{\{vocative\}\}/g, vocative)
      .replace(/ ,/g, ',')
      .replace(/ \./g, '.')
      .replace(/ !/g, '!')
      .replace(/ \?/g, '?');
  }
  if (Array.isArray(obj)) {
    return obj.map(item => injectPlaceholders(item, nickname, vocative));
  }
  if (typeof obj === 'object' && obj !== null) {
    const result: any = {};
    for (const key in obj) {
      result[key] = injectPlaceholders(obj[key], nickname, vocative);
    }
    return result;
  }
  return obj;
}

export function useTranslation() {
  const [lang, setLang] = useState<Language>('cs');
  const [nickname, setNickname] = useState("");
  const [vocative, setVocative] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('mmbarber_lang') as Language;
    const validLangs: Language[] = ['cs', 'en', 'boss', 'falco', 'zh'];
    
    // Automatic Boss Mode check (4:00 - 6:00)
    const hour = new Date().getHours();
    const isEarlyMorning = hour >= 4 && hour < 6;

    // Check if CNY is active
    const themeOverride = localStorage.getItem("mmbarber_atmosphere_override");
    const isCnyActive = themeOverride === 'cny' || (!themeOverride && getActiveTheme() === 'cny');

    if (isCnyActive) {
      setLang('zh');
    } else if (saved && validLangs.includes(saved)) {
      setLang(saved);
    } else if (isEarlyMorning) {
      setLang('boss');
    } else {
      // Auto-detect browser language if no language is saved
      const browserLang = navigator.language || (navigator as any).userLanguage;
      if (browserLang && browserLang.toLowerCase().startsWith('cs')) {
        setLang('cs');
        localStorage.setItem('mmbarber_lang', 'cs');
      } else if (browserLang && browserLang.toLowerCase().startsWith('en')) {
        setLang('en');
        localStorage.setItem('mmbarber_lang', 'en');
      }
    }

    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      setLang(customEvent.detail);
    };

    const handleNicknameChange = () => {
      const name = localStorage.getItem('mmbarber_client_nickname') || "";
      setNickname(name);
      setVocative(getVocative(name));
    };

    handleNicknameChange(); // Load initial

    const handleAtmosphereUpdate = () => {
      const themeOverride = localStorage.getItem("mmbarber_atmosphere_override");
      const isCnyActive = themeOverride === 'cny' || (!themeOverride && getActiveTheme() === 'cny');
      if (isCnyActive) {
        setLang('zh');
      } else {
        const currentSaved = localStorage.getItem('mmbarber_lang') as Language;
        if (currentSaved && validLangs.includes(currentSaved) && currentSaved !== 'zh') {
          setLang(currentSaved);
        } else {
          setLang('cs'); // default fallback if returning from CNY
        }
      }
    };

    window.addEventListener('language_changed', handleLanguageChange);
    window.addEventListener('mmbarber_ratings_updated', handleNicknameChange);
    window.addEventListener('mmbarber-atmosphere-update', handleAtmosphereUpdate);
    return () => {
      window.removeEventListener('language_changed', handleLanguageChange);
      window.removeEventListener('mmbarber_ratings_updated', handleNicknameChange);
      window.removeEventListener('mmbarber-atmosphere-update', handleAtmosphereUpdate);
    };
  }, []);

  // Merging logic for Boss mode (inherits from CS)
  const t = useMemo(() => {
    let baseTranslations: any;

    if (lang === 'boss') {
      baseTranslations = { 
        ...translations.cs, 
        header: { ...translations.cs.header, ...(translations.boss as any).header },
        hero: { ...translations.cs.hero, ...(translations.boss as any).hero },
        services: { ...translations.cs.services, ...(translations.boss as any).services },
        operatives: { ...translations.cs.operatives, ...(translations.boss as any).operatives }
      };
    } else if (lang === 'falco') {
      baseTranslations = { 
        ...translations.cs, 
        header: { ...translations.cs.header, ...(translations.falco as any).header },
        hero: { ...translations.cs.hero, ...(translations.falco as any).hero },
        services: { ...translations.cs.services, ...(translations.falco as any).services },
        operatives: { ...translations.cs.operatives, ...(translations.falco as any).operatives },
        intro: { ...translations.cs.intro, ...(translations.falco as any).intro },
        theCode: { ...translations.cs.theCode, ...(translations.falco as any).theCode }
      };
    } else if (lang === 'zh') {
      const zhBase = (translations as any).zh || {};
      baseTranslations = { 
        ...translations.cs,
        ...zhBase,
        header: { ...translations.cs.header, ...(zhBase.header || {}) },
        hero: { ...translations.cs.hero, ...(zhBase.hero || {}) },
        services: { ...translations.cs.services, ...(zhBase.services || {}) },
        operatives: { ...translations.cs.operatives, ...(zhBase.operatives || {}) },
        contact: { ...translations.cs.contact, ...(zhBase.contact || {}) },
        partners: { ...translations.cs.partners, ...(zhBase.partners || {}) },
        theCode: { ...translations.cs.theCode, ...(zhBase.theCode || {}) },
        intro: { ...translations.cs.intro, ...(zhBase.intro || {}) }
      };
    } else {
      baseTranslations = (translations as any)[lang] || (translations as any).en;
    }

    return injectPlaceholders(baseTranslations, nickname, vocative);
  }, [lang, nickname, vocative]);

  const switchLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('mmbarber_lang', newLang);
    window.dispatchEvent(new CustomEvent('language_changed', { detail: newLang }));
  };

  return { t, lang: (lang === 'boss' || lang === 'falco') ? 'cs' : lang, currentMode: lang, switchLanguage };
}
