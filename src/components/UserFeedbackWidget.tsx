"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb, Bug, Send, Check, Target, Pause, Play } from "lucide-react";
import { submitFeedbackAction } from "@/app/actions/feedback";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useUI } from "@/contexts/UIContext";

export function UserFeedbackWidget() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { graphicsTier, isMobileEffectsEnabled, networkStatus } = useUI();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'IDEA' | 'BUG'>('IDEA');
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState("");
  const [isSelectingElement, setIsSelectingElement] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  type SelectionSnapshot = {
    el: HTMLElement;
    comment: string | null;
    path: string;
    textContent: string;
    htmlContent: string;
    url: string;
  };

  const selectedElementsRef = React.useRef<Array<SelectionSnapshot>>([]);
  const originalStylesRef = React.useRef<Map<HTMLElement, { outline: string, cursor: string }>>(new Map());
  const [selectionCount, setSelectionCount] = useState(0);

  // Auto-highlight logic pro adminy, co proklikli z dashboardu
  useEffect(() => {
    const highlights = searchParams?.getAll('mmbarber_highlight');
    if (!highlights || highlights.length === 0) return;

    // Timeout aby se stihl načíst DOM
    const timer = setTimeout(() => {
      highlights.forEach(selector => {
        try {
          const els = document.querySelectorAll(selector);
          els.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.boxShadow = "0 0 0 4px #ef4444, 0 0 30px rgba(239, 68, 68, 0.6)";
              el.style.position = "relative";
              el.style.zIndex = "999";
              // Scroll to the first one
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
        } catch (e) {
          console.warn("Nevplatný selector z URL:", selector);
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Element Selector Logic
  useEffect(() => {
    if (!isSelectingElement) return;

    let hoveredEl: HTMLElement | null = null;
    const originalStyles = originalStylesRef.current;

    const applyHighlight = (el: HTMLElement, color: string, style: string) => {
      if (!originalStyles.has(el)) {
        originalStyles.set(el, { outline: el.style.outline, cursor: el.style.cursor });
      }
      el.style.outline = `2px ${style} ${color}`;
      el.style.outlineOffset = "2px";
      el.style.cursor = "crosshair";
    };

    const restoreHighlight = (el: HTMLElement) => {
      const orig = originalStyles.get(el);
      if (orig) {
        el.style.outline = orig.outline;
        el.style.cursor = orig.cursor;
        originalStyles.delete(el);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (isPaused) return;
      const target = e.target as HTMLElement;
      if (target.closest('#selection-widget')) return;

      const isSelected = selectedElementsRef.current.some(s => s.el === target);

      if (hoveredEl && !selectedElementsRef.current.some(s => s.el === hoveredEl)) {
        restoreHighlight(hoveredEl);
      }
      
      hoveredEl = target;
      if (!isSelected) {
        applyHighlight(hoveredEl, "rgba(239, 68, 68, 0.5)", "dashed"); // Red dashed hover
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (isPaused) return;
      if (hoveredEl && !selectedElementsRef.current.some(s => s.el === hoveredEl)) {
        restoreHighlight(hoveredEl);
      }
      hoveredEl = null;
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('#selection-widget')) return;
      if (isPaused) return; // Allow normal clicks when paused

      e.preventDefault();
      e.stopPropagation();

      const existingIndex = selectedElementsRef.current.findIndex(s => s.el === target);

      if (existingIndex >= 0) {
        // Deselect
        restoreHighlight(target);
        selectedElementsRef.current.splice(existingIndex, 1);
        setSelectionCount(selectedElementsRef.current.length);
        
        // If it's still hovered after deselecting, show hover outline
        if (hoveredEl === target) {
          applyHighlight(target, "rgba(239, 68, 68, 0.5)", "dashed");
        }
      } else {
        // Select
        const comment = window.prompt("Přidat komentář k tomuto prvku (nepovinné):");
        
        let path = target.tagName.toLowerCase();
        if (target.id) path += `#${CSS.escape(target.id)}`;
        if (target.className && typeof target.className === 'string') {
          const classes = target.className.split(' ')
            .filter(c => c && !c.includes('outline'))
            .map(c => CSS.escape(c))
            .join('.');
          if (classes) path += `.${classes}`;
        }
        const textContent = target.innerText?.slice(0, 100).replace(/\n/g, ' ') || "Žádný text";
        const htmlContent = target.outerHTML?.slice(0, 200) + (target.outerHTML?.length > 200 ? '...' : '');

        selectedElementsRef.current.push({ 
          el: target, 
          comment,
          path,
          textContent,
          htmlContent,
          url: window.location.href
        });
        setSelectionCount(selectedElementsRef.current.length);
        applyHighlight(target, "#c5a059", "solid"); // Gold solid selected
      }
    };

    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("mouseout", handleMouseOut, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("mouseout", handleMouseOut, true);
      document.removeEventListener("click", handleClick, true);
      
      if (!isSelectingElement) {
        originalStyles.forEach((orig, el) => {
          el.style.outline = orig.outline;
          el.style.cursor = orig.cursor;
        });
        originalStyles.clear();
        selectedElementsRef.current = [];
        setSelectionCount(0);
        setIsPaused(false);
      }
    };
  }, [isSelectingElement, isPaused]);

  const confirmSelection = () => {
    if (selectedElementsRef.current.length > 0) {
      let combinedLog = "";
      
      selectedElementsRef.current.forEach(({ el, comment, url }, index) => {
        let path = el.tagName.toLowerCase();
        if (el.id) path += `#${CSS.escape(el.id)}`;
        if (el.className && typeof el.className === 'string') {
          const classes = el.className.split(' ')
            .filter(c => c && !c.includes('outline'))
            .map(c => CSS.escape(c))
            .join('.');
          if (classes) path += `.${classes}`;
        }
        const textContent = el.innerText?.slice(0, 100).replace(/\n/g, ' ') || "Žádný text";
        const htmlContent = el.outerHTML?.slice(0, 200) + (el.outerHTML?.length > 200 ? '...' : '');

        combinedLog += `\n\n--- OZNAČENÝ PRVEK #${index + 1} ---\n`;
        if (comment) combinedLog += `Komentář uživatele: ${comment}\n`;
        combinedLog += `Cesta k prvku: ${path}\nText v prvku: ${textContent}\nHTML kód: ${htmlContent}\nURL: ${url}`;
      });

      // Získání kontextu obrazovky a grafiky
      const isMobile = window.innerWidth <= 768;
      const deviceType = isMobile ? "Mobil" : "Počítač/Tablet";
      
      combinedLog += `\n\n--- SYSTÉMOVÝ KONTEXT ---\n`;
      combinedLog += `Rozlišení obrazovky: ${window.innerWidth}x${window.innerHeight} (${deviceType})\n`;
      combinedLog += `Grafický stupeň (GraphicsTier): ${graphicsTier}\n`;
      combinedLog += `Mobilní efekty (MobileEffects): ${isMobileEffectsEnabled ? 'Zapnuto' : 'Vypnuto'}\n`;
      combinedLog += `Stav sítě: ${networkStatus.isLowBandwidth ? 'Nízká propustnost' : 'Standardní'}\n`;
      combinedLog += `URL: ${window.location.href}\n`;
      combinedLog += `Prohlížeč: ${navigator.userAgent}`;

      setMessage(prev => prev + combinedLog);
    }
    
    setIsSelectingElement(false);
    setIsPaused(false);
    setIsOpen(true);
  };

  const cancelSelection = () => {
    setIsSelectingElement(false);
    setIsPaused(false);
    setIsOpen(true);
  };

  // Skrytí widgetu pokud jsme v admin sekci
  if (pathname?.startsWith("/admin")) return null;

  if (isAdmin) return null; // Admin to nepotřebuje

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('LOADING');
    setErrorMsg("");

    try {
      if (type === 'IDEA') {
        const res = await fetch('/api/zlepseni', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: session?.user?.name || "Anonymní z widgetu",
            userId: session?.user?.email || "anonymous",
            content: message,
            points: ["Zadáno přes rychlý widget"],
            userPriority: 5,
            status: 'PENDING'
          })
        });
        
        if (res.ok) {
          setStatus('SUCCESS');
          setTimeout(() => {
            setIsOpen(false);
            setStatus('IDLE');
            setMessage("");
          }, 2000);
        } else {
          setStatus('ERROR');
          setErrorMsg("Došlo k chybě při odesílání.");
        }
      } else {
        const res = await submitFeedbackAction({ type, message });
        if (res.success) {
          setStatus('SUCCESS');
          setTimeout(() => {
            setIsOpen(false);
            setStatus('IDLE');
            setMessage("");
          }, 2000);
        } else {
          setStatus('ERROR');
          setErrorMsg(res.error || "Došlo k chybě.");
        }
      }
    } catch (err) {
      setStatus('ERROR');
      setErrorMsg("Něco se pokazilo.");
    }
  };

  const startElementSelection = () => {
    setIsOpen(false);
    setIsSelectingElement(true);
  };



  return (
    <>
      {/* Desktop Widget Kolečko (Skryté na mobilu) */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="hidden md:flex fixed bottom-48 left-6 md:bottom-56 md:left-10 z-40 p-3 md:p-4 rounded-full bg-black/80 border border-mafia-gold/50 shadow-[0_0_20px_rgba(197,160,89,0.3)] text-mafia-gold backdrop-blur-sm group overflow-hidden items-center justify-center"
        title="Nápady a hlášení chyb"
      >
        <div className="absolute inset-0 bg-mafia-gold/20 animate-pulse opacity-50 rounded-full pointer-events-none" />
        <Lightbulb size={28} className="relative z-10 group-hover:text-white transition-colors" />
      </motion.button>

      {/* Modál */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0c0c0c] border-2 border-mafia-gold shadow-[0_0_50px_rgba(197,160,89,0.3)] rounded-lg flex flex-col p-6 z-10"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-widest mb-6">
                Napište nám
              </h2>

              {status === 'SUCCESS' ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <Send size={32} />
                  </div>
                  <h3 className="text-xl font-heading text-white mb-2">Děkujeme!</h3>
                  <p className="text-white/60">Zpráva byla úspěšně odeslána.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setType('IDEA')}
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded transition-colors ${type === 'IDEA' ? 'bg-mafia-gold/10 border-mafia-gold text-mafia-gold' : 'border-white/10 text-white/50 hover:border-white/30'}`}
                    >
                      <Lightbulb size={24} />
                      <span className="text-xs uppercase tracking-widest font-bold">Vize a zlepšení</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('BUG')}
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded transition-colors ${type === 'BUG' ? 'bg-mafia-gold/10 border-mafia-gold text-mafia-gold' : 'border-white/10 text-white/50 hover:border-white/30'}`}
                    >
                      <Bug size={24} />
                      <span className="text-xs uppercase tracking-widest font-bold">Nahlásit problém</span>
                    </button>
                  </div>

                  <div className="mt-4">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={type === 'IDEA' ? "Mám nápad na vylepšení..." : "Něco nefunguje správně..."}
                      className="w-full h-32 bg-black border border-white/20 rounded p-4 text-white focus:outline-none focus:border-mafia-gold transition-colors resize-none"
                      required
                    />
                  </div>

                  {type === 'BUG' && (
                    <button
                      type="button"
                      onClick={startElementSelection}
                      className="flex items-center justify-center gap-2 py-2 mt-2 border border-mafia-red/50 text-mafia-red hover:bg-mafia-red/10 transition-colors rounded font-mono text-xs uppercase tracking-widest"
                    >
                      <Bug size={14} /> Označit prvek na stránce
                    </button>
                  )}

                  {status === 'ERROR' && (
                    <div className="text-red-500 text-sm mt-1">{errorMsg}</div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'LOADING' || !message.trim()}
                    className="w-full mt-4 py-4 bg-mafia-gold text-black font-black uppercase tracking-widest disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                  >
                    {status === 'LOADING' ? 'Odesílání...' : 'Odeslat'}
                    {!status && <Send size={18} />}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Selection Widget */}
      {isSelectingElement && (
        <div id="selection-widget" className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] bg-black/90 border border-mafia-gold/50 rounded-full px-6 py-3 flex items-center gap-6 shadow-[0_0_30px_rgba(197,160,89,0.3)] backdrop-blur-md">
          <span className="text-white text-xs font-mono tracking-widest uppercase flex items-center gap-2">
            <Target size={14} className={`text-mafia-gold ${isPaused ? 'opacity-50' : 'animate-pulse'}`} />
            {isPaused ? 'POZASTAVENO' : `Označeno: ${selectionCount}`}
          </span>
          <div className="flex gap-3 border-l border-white/20 pl-6">
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className={`p-2 rounded-full transition-colors flex items-center justify-center ${isPaused ? 'bg-mafia-gold text-black' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'}`}
              title={isPaused ? "Pokračovat ve výběru" : "Pozastavit pro navigaci"}
            >
              {isPaused ? <Play size={18} /> : <Pause size={18} />}
            </button>
            <button 
              onClick={confirmSelection}
              className="p-2 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-black rounded-full transition-colors flex items-center justify-center"
              title="Dokončit a uložit označení"
            >
              <Check size={18} />
            </button>
            <button 
              onClick={cancelSelection}
              className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-black rounded-full transition-colors flex items-center justify-center"
              title="Zrušit označování"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
