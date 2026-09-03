import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Target } from "lucide-react";

interface HeaderSearchBarProps {
  lang: string;
  t: any;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  handleSearch: (e: React.FormEvent) => void;
  toggleSearch: () => void;
  consoleOutput: string[];
  isConsoleOpen: boolean;
  isInterrogationActive: boolean;
  mouseDelta: number;
  handleInterrogationMouseMove: (e: React.MouseEvent) => void;
}

export function HeaderSearchBar({
  lang,
  t,
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  searchInputRef,
  handleSearch,
  toggleSearch,
  consoleOutput,
  isConsoleOpen,
  isInterrogationActive,
  mouseDelta,
  handleInterrogationMouseMove
}: HeaderSearchBarProps) {
  return (
    <>
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0, x: 20 }}
              animate={{ width: 220, opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden relative"
            >
              <div className="relative">
                <input
                  ref={searchInputRef}
                  id="header-search-desktop"
                  type="text"
                  aria-label={lang === 'cs' ? "Vyhledat" : "Search"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t?.header?.searchPlaceholder || (lang === 'cs' ? "VYHLEDAT CÍL..." : "LOCATE TARGET...")}
                  className="w-full bg-mafia-black/90 border-2 border-mafia-gold/50 text-white text-[10px] font-mono px-4 py-2 outline-none placeholder:text-mafia-gold/20 focus:border-mafia-gold transition-all tracking-[0.2em] relative z-10"
                  onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
                  autoComplete="off"
                />
                <div className="absolute inset-0 pointer-events-none z-20 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.1)_0px,rgba(0,0,0,0.1)_1px,transparent_1px,transparent_2px)] opacity-30"></div>
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-[1px] bg-mafia-gold/30 shadow-[0_0_10px_var(--color-mafia-gold-glow)] z-30 opacity-50"
                />
                {searchQuery.length > 1 && (
                  <div className="absolute top-full left-0 w-full bg-mafia-black border border-mafia-gold/30 z-[40000] mt-1 shadow-lg">
                     {["winter", "cny", "valentine", "spring", "easter", "witches", "may", "midsummer", "summer", "harvest", "halloween", "allsouls", "christmas", "silvestr", "sakura", "classic", "dev", "intro", "menu", "reveal"]
                        .filter(c => c.includes(searchQuery.toLowerCase().trim()))
                        .map(suggestion => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => { setSearchQuery(suggestion); setTimeout(() => handleSearch({ preventDefault: () => {} } as any), 50); }}
                            className="w-full text-left px-4 py-2 font-mono text-[10px] text-mafia-gold/70 hover:text-mafia-gold hover:bg-mafia-gold/10 tracking-widest uppercase border-b border-white/5 last:border-0"
                          >
                            {suggestion}
                          </button>
                     ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isSearchOpen && (
          <button 
            type="submit" 
            className="text-mafia-gold hover:scale-110 transition-transform p-1 animate-pulse"
          >
            <Search size={18} />
          </button>
        )}
      </form>
      
      <button
        onClick={toggleSearch}
        className={`p-2 transition-all duration-300 rounded-full hover:bg-white/5 group relative ${isSearchOpen ? 'scale-110' : 'hover:scale-110'}`}
        aria-label={lang === 'cs' ? "Vyhledat" : "Search"}
      >
        <Search size={20} className="relative z-10 transition-transform duration-300 group-hover:scale-110" style={{ color: 'var(--user-accent-color)', filter: `drop-shadow(0 0 8px var(--user-glow-color))` }} />
      </button>

      {/* Console Overlay */}
      <AnimatePresence>
        {isConsoleOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-10 left-10 z-[100] w-[350px] bg-black/90 border border-mafia-gold/30 p-6 font-mono text-[10px] text-mafia-gold shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl rounded-sm"
          >
            <div className="flex items-center gap-2 mb-4 border-b border-mafia-gold/10 pb-2">
              <div className="w-2 h-2 rounded-full bg-mafia-gold animate-pulse" />
              <span className="uppercase tracking-[0.2em] font-bold">MM SYSTEM CONSOLE</span>
            </div>
            <div className="space-y-1">
              {consoleOutput.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <span className="opacity-40">{">"}</span>
                  <span className="tracking-widest">{line}</span>
                </motion.div>
              ))}
              <motion.div 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-1.5 h-3 bg-mafia-gold ml-4 inline-block align-middle"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interrogation Screen */}
      <AnimatePresence>
        {isInterrogationActive && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center cursor-crosshair"
            onMouseMove={handleInterrogationMouseMove}
          >
            <div className="absolute inset-0 bg-red-900/20 blur-[100px] pointer-events-none" />
            <div className="w-20 h-20 border border-red-500/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
               <Target size={32} className="text-red-500" />
            </div>
            <h1 className="text-4xl text-red-500 font-black uppercase tracking-widest mb-4">VÝSLECH</h1>
            <p className="text-red-400 font-mono text-center max-w-md border border-red-500/20 bg-red-900/10 p-4 rounded">
              Příliš mnoho dotazů. Nejsi ty od policajtů? Hýbni myší zleva doprava a dokaž svou nevinu.
            </p>
            <div className="mt-8 w-64 h-2 bg-red-900/30 rounded-full overflow-hidden">
               <div className="h-full bg-red-500 transition-all duration-100" style={{ width: `${Math.min(100, (mouseDelta / 2000) * 100)}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
