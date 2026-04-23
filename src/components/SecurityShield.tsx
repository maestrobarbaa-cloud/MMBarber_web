"use client";

import { useEffect } from 'react';

/**
 * SecurityShield Component
 * Implements various front-end protections to discourage content copying and unauthorized inspection.
 * NOTE: This is for deterrence only, as determined users can always bypass client-side restrictions.
 */
export function SecurityShield() {
  useEffect(() => {
    // 1. Disable Right Click (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Disable Text Selection via JavaScript (redundant with CSS but good for older browsers)
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // 3. Disable DevTools and Common Copy Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+U (View Source)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        return false;
      }

      if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's' || e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+C (Copy) - optional but requested
      if (e.ctrlKey && (e.key === 'C' || e.key === 'c')) {
         // We could allow this but maybe show a warning? For now, let's block as requested.
         e.preventDefault();
         return false;
      }
    };

    // 4. Block Dragging of Images
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    // CSS Protection
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      img {
        -webkit-user-drag: none !important;
        pointer-events: none;
      }
      /* Allow selection only in specific areas if needed (e.g. search bars) */
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.head.removeChild(style);
    };
  }, []);

  return null; // This component doesn't render anything
}
