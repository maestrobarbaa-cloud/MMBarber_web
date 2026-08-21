"use client";

import { useState, useEffect } from "react";
import { X, PlusSquare, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Zkontrolovat, jestli uživatel už banner nezavřel nebo aplikaci nenainstaloval
    if (localStorage.getItem("mmbarber_install_prompt_dismissed")) {
      return;
    }

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      return; // Už je nainstalováno
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android/.test(userAgent);
    
    if (isMobile) {
      const ios = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(ios);
      
      if (!ios) {
        // Pro Android nasloucháme na událost
        window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault();
          setDeferredPrompt(e);
          setShowPrompt(true);
        });
        
        // Pokud událost neproběhne hned (často chybí PWA manifest), ukážeme aspoň návod
        setTimeout(() => {
          if (!deferredPrompt) {
            setShowPrompt(true);
          }
        }, 3000);
      } else {
        // Pro iOS ukážeme rovnou (iOS nepodporuje beforeinstallprompt)
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // Pokud nemáme nativní prompt, ukážeme jen návod
      alert(isIOS 
        ? "V Safari klikněte dole na tlačítko Sdílet a vyberte 'Přidat na plochu' (Add to Home Screen)." 
        : "V prohlížeči klikněte na menu (tři tečky) a vyberte 'Přidat na plochu' (Add to Home screen)."
      );
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("mmbarber_install_prompt_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-[9999] bg-mafia-black/95 backdrop-blur-md border-b border-mafia-gold/30 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-mafia-gold rounded-xl flex items-center justify-center text-black shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                <Download size={20} />
              </div>
              <div>
                <h4 className="text-white font-heading font-black text-sm uppercase tracking-widest">Nainstalovat Aplikaci</h4>
                <p className="text-white/60 text-xs font-mono">
                  {isIOS ? "Přidej si nás na plochu pro lepší zážitek." : "Získej appku na plochu."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-mafia-gold text-black font-black uppercase text-xs tracking-widest rounded-lg hover:bg-white transition-colors whitespace-nowrap"
              >
                Přidat
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
