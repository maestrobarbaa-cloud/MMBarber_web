"use client";

import { useEffect, useState } from 'react';

const CHAPTERS = [
  { id: 'operativi', num: 'I', title: 'TÝM A PROFILY' },
  { id: 'services', num: 'II', title: 'SLUŽBY A OSTATNÍ' },
  { id: 'holidays', num: 'III', title: 'UDÁLOSTI' },
  { id: 'style-definition', num: 'IV', title: 'OSOBNÍ PREZENTACE' },
  { id: 'kontakt', num: 'V', title: 'KONTAKT' },
];

export function BookChaptersLayout({ children }: { children: React.ReactNode }) {
  const [activeChapter, setActiveChapter] = useState('operativi');
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleChapterClick = (id: string) => {
    setActiveChapter(id);
    
    setTimeout(() => {
       const el = document.getElementById(id);
       if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
       }
    }, 50);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!isDesktop) return;
      const tops = CHAPTERS.map(c => {
        const el = document.getElementById(c.id);
        return { id: c.id, top: el ? el.getBoundingClientRect().top : 9999 };
      });
      const visible = tops.filter(t => t.top < window.innerHeight / 2);
      if (visible.length > 0) {
        const current = visible[visible.length - 1];
        if (current.id !== activeChapter) {
          setActiveChapter(current.id);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeChapter, isDesktop]);

  return (
    <div className="w-full flex flex-col lg:flex-row relative max-w-[1600px] mx-auto px-0 lg:px-4">
      {/* LEFT SIDEBAR (BOOK INDEX) */}
      {isDesktop && (
        <div className="w-[300px] xl:w-[400px] shrink-0 sticky top-32 h-[calc(100vh-8rem)] pt-12 pr-8 border-r border-mafia-gold/10 z-50">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-8 h-[1px] bg-mafia-gold/50"></div>
            <h3 className="text-mafia-gold font-mono text-[10px] uppercase tracking-[0.4em]">Osnova Knihy</h3>
          </div>
          <ul className="flex flex-col gap-6 relative">
            <div className="absolute left-[11px] top-4 bottom-4 w-[1px] bg-white/5 z-0"></div>
            
            {CHAPTERS.map((chap) => (
              <li key={chap.id} className="relative z-10">
                <button 
                  onClick={() => handleChapterClick(chap.id)}
                  className={`flex items-center gap-6 group text-left w-full transition-all duration-500`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border bg-[#050505] transition-all duration-500 ${activeChapter === chap.id ? 'border-mafia-gold shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.5)]' : 'border-white/10 group-hover:border-mafia-gold/50'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${activeChapter === chap.id ? 'bg-mafia-gold' : 'bg-transparent group-hover:bg-mafia-gold/50'}`}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-mono text-[9px] transition-colors mb-1 ${activeChapter === chap.id ? 'text-mafia-gold' : 'text-white/20 group-hover:text-mafia-gold/50'}`}>
                      KAPITOLA {chap.num}
                    </span>
                    <span className={`font-heading font-black tracking-widest uppercase transition-colors text-sm xl:text-base ${activeChapter === chap.id ? 'text-smoke-white drop-shadow-[0_0_10px_rgba(var(--color-mafia-gold-rgb),0.5)]' : 'text-white/40 group-hover:text-white/80'}`}>
                      {chap.title}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* RIGHT CONTENT */}
      <div className="flex-1 w-full pl-0 lg:pl-12 xl:pl-20 min-h-screen">
        {children}
      </div>
    </div>
  );
}
