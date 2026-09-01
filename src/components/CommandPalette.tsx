'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, Calendar, Users, Target, Scissors, Globe, UserSquare2, Ticket } from 'lucide-react';

const commands = [
  { id: 'home', title: 'Domů', icon: <Home className="w-5 h-5 text-mafia-gold" />, path: '/' },
  { id: 'booking', title: 'Ceník a rezervace', icon: <Target className="w-5 h-5 text-mafia-gold" />, path: '/cenik' },
  { id: 'seznamka', title: 'Seznamka', icon: <Users className="w-5 h-5 text-mafia-gold" />, path: '/seznamka' },
  { id: 'gallery', title: 'Galerie', icon: <UserSquare2 className="w-5 h-5 text-mafia-gold" />, path: '/galerie' },
  { id: 'vouchers', title: 'Dárkové vouchery', icon: <Ticket className="w-5 h-5 text-mafia-gold" />, path: '/vouchery' },
  { id: 'family', title: 'Rodina (Náš Tým)', icon: <Scissors className="w-5 h-5 text-mafia-gold" />, path: '/rodina' },
  { id: 'hidden', title: 'Skrytá místa', icon: <Globe className="w-5 h-5 text-mafia-gold" />, path: '/skryta-mista' },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  // Handle Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setIsOpen(false);
    setSearch('');
    router.push(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[15vh] mx-auto z-[9999] max-w-xl w-full px-4"
          >
            <div className="bg-[#1A1A1A] border border-mafia-gold/20 rounded-xl shadow-2xl shadow-mafia-gold/5 overflow-hidden font-sans">
              <div className="flex items-center px-4 py-3 border-b border-white/5">
                <Search className="w-5 h-5 text-mafia-gold/70" />
                <input
                  type="text"
                  placeholder="Hledat nebo zadat příkaz..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-smoke-white ml-3 placeholder:text-white/30 text-lg"
                  autoFocus
                />
                <span className="text-xs text-white/30 border border-white/10 px-2 py-1 rounded bg-white/5">ESC</span>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto py-2 px-2">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd.path)}
                      className="w-full flex items-center px-3 py-3 rounded-lg hover:bg-mafia-gold/10 transition-colors group text-left"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-black/30 border border-white/5 mr-3 group-hover:border-mafia-gold/30 transition-colors">
                        {cmd.icon}
                      </div>
                      <span className="text-smoke-white group-hover:text-mafia-gold transition-colors font-medium">
                        {cmd.title}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-white/40">
                    Nebyly nalezeny žádné příkazy pro "{search}"
                  </div>
                )}
              </div>
              
              <div className="px-4 py-2 border-t border-white/5 bg-black/20 text-xs text-white/30 flex justify-between items-center">
                <span>Enter pro výběr</span>
                <span className="flex items-center gap-1">
                  MMBARBER OS <span className="w-1.5 h-1.5 rounded-full bg-mafia-gold inline-block shadow-[0_0_5px_#C5A059]" />
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
