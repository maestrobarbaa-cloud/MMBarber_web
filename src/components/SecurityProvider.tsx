"use client";

import { useEffect } from "react";

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.allow-copy')) return;
      e.preventDefault();
      return false;
    };

    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.allow-copy')) return;
      e.preventDefault();
      return false;
    };

    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.allow-copy')) return;
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      
      if (
        (isCtrl && e.key === 'u') || 
        (isCtrl && e.key === 's') || 
        (isCtrl && isShift && e.key === 'I') || 
        (isCtrl && isShift && e.key === 'J') || 
        (isCtrl && isShift && e.key === 'C') || 
        e.key === 'F12' ||
        (isCtrl && e.key === 'p') // Block Print
      ) {
        e.preventDefault();
        return false;
      }

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

    // Advanced: Debugger trap for DevTools
    const debuggerInterval = setInterval(() => {
      // This is a subtle way to slow down casual inspectors
      // but might be annoying for development, so we only run it in production if possible
      if (process.env.NODE_ENV === 'production') {
        (function() { (function a() { try { (function b(i) { if (("" + i / i).length !== 1 || i % 20 === 0) { (function() { }).constructor("debugger")() } else { debugger } b(++i) })(0) } catch (e) { setTimeout(a, 5000) } })() })();
      }
    }, 10000);

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      clearInterval(debuggerInterval);
    };
  }, []);

  return <>{children}</>;
}
