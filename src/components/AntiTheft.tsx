'use client';

import { useEffect } from 'react';

export function AntiTheft() {
  useEffect(() => {
    // 1. Zamezení pravého kliku (Kontextové menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Zamezení klávesových zkratek pro vývojáře (F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Ctrl+Shift+I (Chrome DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
      }
      // Ctrl+Shift+J (Chrome Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
      }
      // Ctrl+Shift+C (Chrome Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
      }
      // Ctrl+S (Save As)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
      }
    };

    // 3. Zamezení přetahování prvků (obrázků)
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 4. Přidání event listenerů
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    // 5. Výhružná zpráva v konzoli, pokud se někdo dostane skrz (např. otevře konzoli před načtením stránky)
    console.log(
      '%cSTOP! 🛑\n\n%cTento kód je duševním vlastnictvím MM Barber a naší AI. \nNaše systémy aktivně monitorují pokusy o krádež zdrojového kódu.\nPokud nejsi vývojář MM Barber, zavři toto okno.',
      'color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;',
      'color: #C5A059; font-size: 16px; font-family: monospace;'
    );

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return null;
}
