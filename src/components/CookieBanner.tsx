"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { trackEvent } from "../utils/analytics";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  interface GTagWindow extends Window {
    gtag?: (command: string, action: string, params: Record<string, unknown>) => void;
  }

  useEffect(() => {
    const consent = localStorage.getItem("mmbarber_cookie_consent");
    if (!consent) {
      // Malé zpoždění, ať nevyskočí hned
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else if (consent === "true") {
      // If already accepted in the past, update GA consent on load
      if (typeof window !== "undefined" && (window as unknown as GTagWindow).gtag) {
        (window as unknown as GTagWindow).gtag!('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted'
        });
      }
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("mmbarber_cookie_consent", "true");
    
    // Update GA consent
    if (typeof window !== "undefined" && (window as unknown as GTagWindow).gtag) {
      (window as unknown as GTagWindow).gtag!('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
      // Track the accept event once we have permission
      trackEvent("cookie_consent_accepted");
    }

    window.dispatchEvent(new Event("cookieConsentGiven"));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[110] p-4 font-sans">
      <div className="max-w-4xl mx-auto bg-mafia-black/95 border border-mafia-gold/30 p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Subtle glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mafia-gold/50 to-transparent"></div>

        <div className="flex gap-4 items-start md:items-center">
          <Cookie className="text-mafia-gold shrink-0 mt-1 md:mt-0" size={32} />
          <div>
            <h3 className="text-smoke-white font-bold tracking-wider uppercase mb-1">Cookies</h3>
            <p className="text-smoke-white/60 text-sm leading-relaxed max-w-2xl">
              Používáme cookies, aby náš web fungoval správně, sledoval návštěvnost a zobrazoval nabídky a akce, které tě zajímají. Kliknutím na „Přijmout“ souhlasíš s jejich používáním.
            </p>
          </div>
        </div>

        <div className="flex gap-4 shrink-0 w-full md:w-auto">
          <button 
            onClick={acceptCookies}
            className="flex-1 md:flex-none border-2 border-mafia-gold px-6 py-2 text-mafia-black bg-mafia-gold font-bold uppercase tracking-widest text-sm hover:bg-transparent hover:text-mafia-gold transition-colors duration-300"
          >
            Přijmout
          </button>
          <button 
            onClick={() => {
              window.dispatchEvent(new Event("cookieConsentGiven"));
              setIsVisible(false);
              // Not granting consent but closing—can't track this to GA if denied!
            }}
            className="p-2 text-smoke-white/40 hover:text-mafia-red transition-colors"
          >
            <X size={24} />
          </button>
        </div>

      </div>
    </div>
  );
}
