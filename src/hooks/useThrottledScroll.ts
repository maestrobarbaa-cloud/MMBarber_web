import { useState, useEffect, useRef } from 'react';

/**
 * A highly optimized hook for scroll events that uses requestAnimationFrame
 * instead of firing events hundreds of times per second. 
 * Essential for mobile performance (prevents jank and FPS drops).
 */
export function useThrottledScroll(callback?: (scrollY: number) => void) {
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    // Initial value
    if (typeof window !== 'undefined') {
      setScrollY(window.scrollY);
      scrollRef.current = window.scrollY;
    }

    const updateScrollY = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      scrollRef.current = currentScrollY;
      if (callback) {
        callback(currentScrollY);
      }
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollY);
        ticking.current = true;
      }
    };

    // passive: true is crucial for scrolling performance on mobile browsers
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [callback]);

  return scrollY;
}
