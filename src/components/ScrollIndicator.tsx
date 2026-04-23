"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, MotionValue, useMotionValue } from "framer-motion";

const ScrollDot = ({ index, progress, isBottomReached }: { index: number, progress: MotionValue<number>, isBottomReached: boolean }) => {
  const threshold = index / 6;
  const activeProgress = useTransform(progress, [threshold - 0.05, threshold + 0.05], [0, 1]);
  const opacity = useTransform(progress, [threshold - 0.05, threshold + 0.05], [0.3, 1]);
  const scale = useTransform(progress, [threshold - 0.05, threshold + 0.05], [1, 1.5]);

  return (
    <motion.div 
      className={`w-[6px] h-[6px] rotate-45 border relative overflow-hidden ${isBottomReached ? 'border-mafia-gold/50 transition-colors duration-1000' : 'border-mafia-gold/30 transition-colors duration-300'}`}
      style={{
        opacity,
        scale,
      }}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[#121212]" />
      
      {/* Active Layer (Accent Color) */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          backgroundColor: "var(--user-accent-color)",
          opacity: isBottomReached ? 1 : activeProgress,
          boxShadow: "0 0 10px var(--user-accent-color)",
          filter: "blur(1px)"
        }}
      />
    </motion.div>
  );
};

export function ScrollIndicator() {
  const [mounted, setMounted] = useState(false);
  const [isTopReached, setIsTopReached] = useState(true);
  const [isBottomReached, setIsBottomReached] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Rotation mapped to scroll: starts at 45, ends at 45 + 720 (two full turns)
  const rawRotate = useTransform(scrollYProgress, [0, 1], [45, 765]);
  const smoothRotate = useSpring(rawRotate, { 
    stiffness: 120, 
    damping: 20,
    restDelta: 0.001 
  });
  
  // RAW progress for direct control during drag
  const dragProgress = useMotionValue(0);
  
  // Create a mapping that reaches the logical edges slightly before the physical scroll edges
  // to ensure the indicator always "completes" its travel at the dots.
  // Create a mapping that reaches the logical edges slightly before the physical scroll edges
  // to ensure the indicator always "completes" its travel at the dots.
  const edgeProgress = useTransform(scrollYProgress, [0.01, 0.99], [0, 1], { clamp: true });
  
  // Smooth version for normal scrolling
  const smoothProgress = useSpring(edgeProgress, { 
    stiffness: 100, 
    damping: 20,
    restDelta: 0.0001,
    restSpeed: 0.0001
  });
  
  // Height Fill: Switches between smooth and raw
  const heightProgress = useTransform(
    [smoothProgress, edgeProgress],
    ([smooth, raw]) => {
      if (!mounted) return "0%";
      return isDragging ? `${(raw as number) * 100}%` : `${(smooth as number) * 100}%`;
    }
  );
  
  // Indicator Top: Switches between smooth and raw drag progress
  const topProgress = useTransform(
    [smoothProgress, dragProgress],
    ([smooth, drag]) => {
      if (!mounted) return "0%";
      return isDragging ? `${(drag as number) * 100}%` : `${(smooth as number) * 100}%`;
    }
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Safety check: if we are at the top, ensure we show at the top
    if (latest < 0.005) {
      dragProgress.set(0);
      setIsTopReached(true);
      setIsBottomReached(false);
      if (!isDragging) return;
    }

    if (latest >= 0.99) {
      if (!isBottomReached) setIsBottomReached(true);
    } else {
      if (isBottomReached) setIsBottomReached(false);
    }

    if (latest <= 0.01) {
      if (!isTopReached) setIsTopReached(true);
    } else {
      if (isTopReached) setIsTopReached(false);
    }
    
    if (!isDragging) {
      if (latest <= 0.01) dragProgress.set(0);
      else if (latest >= 0.99) dragProgress.set(1);
      else dragProgress.set((latest - 0.01) / 0.98);
    }
  });

  const [isVisibleAfterLoad, setIsVisibleAfterLoad] = useState(false);
  const [isPageScrollable, setIsPageScrollable] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    let frameId: number;
    const checkScrollable = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const isScrollable = scrollHeight > clientHeight + 100;
        
        setIsPageScrollable(isScrollable);
        
        // Only force sync dragProgress during mount/reset phase to avoid fighting useScroll
        if (!isDragging && !isVisibleAfterLoad) {
          const scrollTop = window.scrollY;
          const scrollMax = scrollHeight - clientHeight;
          if (scrollMax > 0) {
            dragProgress.set(scrollTop / scrollMax);
          }
        }
      });
    };
    
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    
    // Observer for dynamic content loading (reveal animations)
    const observer = new ResizeObserver(() => {
      checkScrollable();
    });
    observer.observe(document.body);
    
    const visibilityTimer = setTimeout(() => setIsVisibleAfterLoad(true), 1200);
    
    // Force reset on mount
    dragProgress.set(0);
    setIsTopReached(true);
    setIsBottomReached(false);
    window.scrollTo(0, 0);
    
    // Multiple passes to fight browser scroll restoration and layout shifts
    const timers = [
      setTimeout(() => { dragProgress.set(0); window.scrollTo(0, 0); checkScrollable(); }, 50),
      setTimeout(() => { dragProgress.set(0); window.scrollTo(0, 0); checkScrollable(); }, 250),
      setTimeout(() => { dragProgress.set(0); window.scrollTo(0, 0); checkScrollable(); }, 500),
      setTimeout(() => { dragProgress.set(0); window.scrollTo(0, 0); checkScrollable(); }, 1000),
      setTimeout(() => { dragProgress.set(0); window.scrollTo(0, 0); checkScrollable(); }, 2000)
    ];
    
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(visibilityTimer);
      window.removeEventListener('resize', checkScrollable);
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!scrollTrackRef.current) return;
    setIsDragging(true);
    
    document.body.style.cursor = "grabbing"; // Set global cursor during drag
    
    const rect = scrollTrackRef.current.getBoundingClientRect();
    const update = (clientY: number) => {
      const relativeY = clientY - rect.top;
      const percentage = Math.max(0, Math.min(1, relativeY / rect.height));
      dragProgress.set(percentage);
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, percentage * scrollMax);
    };

    update(e.clientY);
    
    const onPointerMove = (moveEvent: PointerEvent) => {
      update(moveEvent.clientY);
    };
    
    const onPointerUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };
    
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  if (!mounted) return null;

  return (
    <div 
      ref={scrollTrackRef}
      onPointerDown={handlePointerDown}
      className={`fixed right-0 md:right-4 top-[20%] bottom-[20%] z-50 flex flex-col items-center pointer-events-auto cursor-ns-resize hidden xl:flex select-none w-20 px-8 transition-all duration-1000 scroll-indicator-mm ${
        (isVisibleAfterLoad && isPageScrollable) ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      
      {/* Tenká vodící linka v pozadí */}
      <div className="absolute top-0 bottom-0 w-[1px] bg-mafia-gold/10 left-1/2 -translate-x-1/2"></div>
      
      {/* Osvětlená linka - Fill follows mouse raw when dragging */}
      <motion.div 
        className={`absolute top-0 w-[1px] left-1/2 -translate-x-1/2 transition-colors duration-1000 pointer-events-none ${isBottomReached ? 'bg-mafia-gold shadow-[0_0_12px_var(--user-accent-color)]' : 'bg-mafia-gold shadow-[0_0_8px_var(--user-accent-color)]'}`}
        style={{ height: heightProgress }}
      ></motion.div>

      {/* Dekorativní kosočtvercové body */}
      <div className="absolute inset-y-0 w-4 left-1/2 -translate-x-1/2 pointer-events-none">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="absolute w-full flex justify-center" style={{ top: `${(i/6)*100}%`, transform: 'translateY(-50%)' }}>
             <ScrollDot index={i} progress={smoothProgress} isBottomReached={isBottomReached} />
          </div>
        ))}
      </div>

      {/* HLAVNÍ CESTUJÍCÍ ČTVEREČEK */}
      <motion.div
        className="absolute w-12 h-12 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing group/scroll z-50"
        style={{ 
          top: topProgress,
          y: "-50%"
        }}
        onDoubleClick={(e) => {
          window.dispatchEvent(new CustomEvent('mmbarber-toggle-chat'));
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Diamond Visuals */}
        <motion.div 
          className="relative w-4 h-4 pointer-events-none"
          style={{ rotate: smoothRotate }}
        >
          <div className={`absolute inset-0 bg-mafia-black border transition-all duration-1000 group-hover/scroll:opacity-0 ${isBottomReached ? 'border-mafia-gold shadow-[0_0_20px_var(--user-accent-color)]' : 'border-mafia-gold shadow-[0_0_15px_var(--user-accent-color)]'}`}></div>
          
          <div className="absolute inset-0 opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300 scale-150 -rotate-[45deg]">
             <div className="w-full h-full perspective-500">
                <div className="w-full h-full relative transform-style-3d animate-rotate-fast">
                   <div className="absolute inset-0 border border-mafia-gold bg-mafia-black/90" style={{ transform: 'translateZ(10px)' }}></div>
                   <div className="absolute inset-0 border border-mafia-gold bg-mafia-black/90" style={{ transform: 'rotateY(180deg) translateZ(10px)' }}></div>
                   <div className="absolute inset-0 border border-mafia-gold bg-mafia-black/90" style={{ transform: 'rotateY(90deg) translateZ(10px)' }}></div>
                   <div className="absolute inset-0 border border-mafia-gold bg-mafia-black/90" style={{ transform: 'rotateY(-90deg) translateZ(10px)' }}></div>
                   <div className="absolute inset-0 border border-mafia-gold bg-mafia-black/90" style={{ transform: 'rotateX(90deg) translateZ(10px)' }}></div>
                   <div className="absolute inset-0 border border-mafia-gold bg-mafia-black/90" style={{ transform: 'rotateX(-90deg) translateZ(10px)' }}></div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Secret handle visuals continue to function without hint */}
      </motion.div>

      <style jsx>{`
        .perspective-500 { perspective: 500px; }
        .transform-style-3d { transform-style: preserve-3d; }
        @keyframes rotate-fast {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg); }
        }
        .animate-rotate-fast {
          animation: rotate-fast 4s linear infinite;
        }
      `}</style>

    </div>
  );
}
