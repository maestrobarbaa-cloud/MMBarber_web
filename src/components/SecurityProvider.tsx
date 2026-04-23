"use client";

import { useEffect } from "react";

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Allow right click ONLY if the element has 'allow-copy' class
      const target = e.target as HTMLElement;
      if (target.closest('.allow-copy')) return;
      
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Ctrl+U, Ctrl+S, Ctrl+Shift+I, F12, Ctrl+Shift+C
      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      
      // Allow Ctrl+C and Ctrl+V ONLY for .allow-copy elements?
      // Actually, standard is to block Ctrl+U, Ctrl+S, F12
      
      if (
        (isCtrl && e.key === 'u') || // View Source
        (isCtrl && e.key === 's') || // Save
        (isCtrl && isShift && e.key === 'I') || // DevTools
        (isCtrl && isShift && e.key === 'J') || // DevTools
        (isCtrl && isShift && e.key === 'C') || // Inspect
        e.key === 'F12' // DevTools
      ) {
        e.preventDefault();
        return false;
      }

      // Block Ctrl+C (Copy) globally unless in allow-copy
      if (isCtrl && e.key === 'c') {
        const selection = window.getSelection();
        const target = selection?.anchorNode?.parentElement;
        if (target && !target.closest('.allow-copy')) {
          e.preventDefault();
          return false;
        }
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.allow-copy')) return;
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return <>{children}</>;
}
