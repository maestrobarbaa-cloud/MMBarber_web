"use client";

import { useEffect, useRef, useState } from "react";
import { Scissors, Heart, Snowflake, Flame, Star, Medal } from "lucide-react";

/**
 * Custom Clipper SVG Icon
 */
const ClipperIcon = ({ size, className }: { size: number, className: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={{ filter: `drop-shadow(0 0 ${size/10}px var(--color-mafia-gold))` }}
  >
    <path d="M7 6c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2V6z" />
    <path d="M8 4h8l1-2H7l1 2z" />
    <path d="M7 2h10" />
    <path d="M10 8h4" />
    <path d="M10 11h4" />
    <path d="M10 14h4" />
    <path d="M12 20v2" />
  </svg>
)

/**
 * Custom Clover SVG Icon
 */
const CloverIcon = ({ size, className, leaves = 4 }: { size: number, className: string, leaves?: 3 | 4 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    style={{ filter: `drop-shadow(0 0 ${size/10}px rgba(0,255,65,0.4))` }}
  >
    {/* Common center */}
    <circle cx="12" cy="12" r="1.5" />
    {/* Leaves */}
    <path d="M12 11.5c-1-2.5-4-2.5-4 0s3 2.5 4 0z" /> {/* Top Leaf */}
    <path d="M11.5 12c-2.5 1-2.5 4 0 4s2.5-3 0-4z" /> {/* Left Leaf */}
    <path d="M12.5 12c2.5-1 2.5-4 0-4s-2.5 3 0 4z" /> {/* Right Leaf */}
    {leaves === 4 && <path d="M12 12.5c1 2.5 4 2.5 4 0s-3-2.5-4 0z" />} {/* Bottom Leaf for 4-leaf only */}
    {/* Stem */}
    <path d="M12 14c0 2 1 4 3 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const PumpkinIcon = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21c-4.4 0-8-3-8-7s3.6-7 8-7 8 3 8 7-3.6 7-8 7zm0-16c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
    <path d="M8.5 12c.3 0 .5-.2.5-.5s-.2-.5-.5-.5-.5.2-.5.5.2.5.5.5zm7 0c.3 0 .5-.2.5-.5s-.2-.5-.5-.5-.5.2-.5.5.2.5.5.5z" fill="black" />
    <path d="M12 17c1.5 0 2.5-1 2.5-1h-5s1 1 2.5 1z" fill="black" />
  </svg>
);

const BroomIcon = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Handle */}
    <path d="M4 19L17 6" />
    {/* Straw/Twigs */}
    <path d="M15 4l5 5L18 12l-5-5L15 4z" fill="currentColor" fillOpacity="0.2" />
    <path d="M17 6l3 3" />
    <path d="M18 5l2 2" />
    <path d="M16 7l2 2" />
    {/* Binding */}
    <path d="M14 9l2 2" strokeWidth="2" />
  </svg>
);

interface Item {
  id: number;
  x: number; // percent 0-100
  y: number; // percent 0-100
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  size: number;
  type: 'scissors' | 'clippers' | 'heart' | 'clover3' | 'clover4' | 'pumpkin' | 'snowflake' | 'flame' | 'broom' | 'star' | 'medal';
  el?: HTMLDivElement | null; // Direct reference for DOM manipulation
}

export function FloatingScissors({ position = "fixed", countOverride }: { position?: "fixed" | "absolute", countOverride?: number }) {
  const [items, setItems] = useState<Item[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Item[]>([]);
  const requestRef = useRef<number>(undefined);
  const mouseRef = useRef<{ x: number, y: number } | null>(null);

  const INITIAL_COUNT = countOverride || 8;

  const init = () => {
    const isMobile = window.innerWidth < 768;
    const typeOverride = localStorage.getItem("mmbarber_floating_item_override");
    const htmlClasses = document.documentElement.className;
    
    const getInitialType = (): Item['type'] => {
        if (htmlClasses.includes('mode-valentine')) return 'heart';
        if (htmlClasses.includes('mode-st-patricks')) return Math.random() > 0.3 ? 'clover3' : 'clover4';
        if (htmlClasses.includes('mode-halloween')) return 'pumpkin';
        if (htmlClasses.includes('mode-christmas')) return 'snowflake';
        if (htmlClasses.includes('mode-witches')) return Math.random() > 0.5 ? 'flame' : 'broom';
        if (htmlClasses.includes('mode-victory')) return Math.random() > 0.5 ? 'star' : 'medal';
        
        if (typeOverride === 'scissors') return 'scissors';
        if (typeOverride === 'clippers') return 'clippers';
        return Math.random() > 0.5 ? 'scissors' : 'clippers';
    };

    const isChaos = localStorage.getItem("mmbarber_dev_visual_mode") === 'chaos';
    const finalCount = isChaos ? (INITIAL_COUNT * 3) : INITIAL_COUNT;

    const initialItems: Item[] = Array.from({ length: isMobile ? (isChaos ? 12 : 4) : finalCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 1,
      size: isMobile ? (Math.random() * 15 + 30) : (Math.random() * 40 + 45),
      type: getInitialType()
    }));
    
    itemsRef.current = initialItems;
    setItems(initialItems);
  };

  const update = () => {
    const currentItems = itemsRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < currentItems.length; i++) {
        const item = currentItems[i];
        
        // Physics update
        item.x += item.vx;
        item.y += item.vy;
        item.rotation += item.vr;

        // Custom gravity for snowflakes
        if (item.type === 'snowflake') {
          item.vy += 0.005; // Constant downward drift
          item.vx += (Math.random() - 0.5) * 0.01; // Sidelong drift
        }

        const isChaos = localStorage.getItem("mmbarber_dev_visual_mode") === 'chaos';
        const speedMult = isChaos ? 4 : 1;

        item.vx += (Math.random() - 0.5) * 0.015 * speedMult;
        item.vy += (Math.random() - 0.5) * 0.015 * speedMult;
        item.vr += (Math.random() - 0.5) * 0.15 * speedMult;

        if (mouseRef.current) {
            const mx = (mouseRef.current.x / width) * 100;
            const my = (mouseRef.current.y / height) * 100;
            const dx = item.x - mx;
            const dy = item.y - my;
            const aspectForce = width / height;
            const distSq = (dx * dx) + (dy * dy / (aspectForce * aspectForce));
            const radius = 12;

            if (distSq < radius * radius && distSq > 0) {
                const dist = Math.sqrt(distSq);
                const force = Math.pow((radius - dist) / radius, 1.2); 
                item.vx += (dx / dist) * force * 0.22;
                item.vy += (dy / dist) * force * 0.22;
                item.vr += force * (Math.random() - 0.5) * 6;
            }
        }

        item.vx *= 0.985;
        item.vy *= 0.985;
        item.vr *= 0.99;

        const padding = 2; 
        if (item.type === 'snowflake') {
          // Wrapped falling for snow
          if (item.y > 105) { 
            item.y = -5; 
            item.x = Math.random() * 100;
          }
          if (item.x < -5) item.x = 105;
          if (item.x > 105) item.x = -5;
        } else {
          // Bouncing for others
          if (item.x < padding) { item.x = padding; item.vx = Math.abs(item.vx) * 0.4; }
          if (item.x > 100 - padding) { item.x = 100 - padding; item.vx = -Math.abs(item.vx) * 0.4; }
          if (item.y < padding) { item.y = padding; item.vy = Math.abs(item.vy) * 0.4; }
          if (item.y > 100 - padding) { item.y = 100 - padding; item.vy = -Math.abs(item.vy) * 0.4; }
        }

        // DOM Update (Ref only, no React state)
        if (item.el) {
          item.el.style.transform = `translate(-50%, -50%) translate3d(${item.x}vw, ${item.y}vh, 0) rotate(${item.rotation}deg)`;
        }
    }

    // 2. Collision detection
    for (let i = 0; i < currentItems.length; i++) {
        const item = currentItems[i];
        for (let j = i + 1; j < currentItems.length; j++) {
            const other = currentItems[j];
            const dx = (item.x - other.x) * (width / 100);
            const dy = (item.y - other.y) * (height / 100);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = (item.size + other.size) / 2.5;

            if (dist < minDist && dist > 0) {
                const angle = Math.atan2(dy, dx);
                const push = (minDist - dist) / 60; 
                item.x += Math.cos(angle) * push;
                item.y += Math.sin(angle) * (push / (width / height));
                const tempVx = item.vx;
                const tempVy = item.vy;
                item.vx = other.vx * 0.8;
                item.vy = other.vy * 0.8;
                other.vx = tempVx * 0.8;
                other.vy = tempVy * 0.8;
            }
        }
    }

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    // Disable on mobile for performance
    if (window.innerWidth < 768) {
      return;
    }

    init();
    
    const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleUpdate = () => init();
    
    const handleGlitchStart = () => {
        itemsRef.current.forEach(item => {
            item.vx += (Math.random() - 0.5) * 8;
            item.vy += (Math.random() - 0.5) * 8;
        });
    };
    
    const onResize = () => init();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener('resize', onResize);
    window.addEventListener('mmbarber-floaters-update', handleUpdate);
    window.addEventListener('mmbarber-mode-update', handleUpdate);
    window.addEventListener('mmbarber-glitch-start', handleGlitchStart);
    
    requestRef.current = requestAnimationFrame(update);

    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('mmbarber-floaters-update', handleUpdate);
        window.removeEventListener('mmbarber-mode-update', handleUpdate);
        window.removeEventListener('mmbarber-glitch-start', handleGlitchStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderIcon = (item: Item) => {
    const commonClass = "transition-colors drop-shadow-xl text-mafia-gold/40";
    const commonStyle = { filter: `drop-shadow(0 0 ${item.size/6}px var(--color-mafia-gold))` };
    const snowflakeStyle = { filter: `drop-shadow(0 0 ${item.size/2}px rgba(255,255,255,0.9))` };

    switch (item.type) {
      case 'heart':
        return <Heart size={item.size} className={commonClass} style={commonStyle} fill="currentColor" />;
      case 'clover3':
        return <CloverIcon size={item.size} className="text-[#00ff41]/80" leaves={3} />;
      case 'clover4':
        return <CloverIcon size={item.size} className="text-[#00ff41]" leaves={4} />;
      case 'pumpkin':
        return <PumpkinIcon size={item.size} className={commonClass} />;
      case 'snowflake':
        return <Snowflake size={item.size} className="text-white/90" style={snowflakeStyle} fill="white" />;
      case 'flame':
        return <div className="animate-fire"><Flame size={item.size} className="text-orange-500" style={{ filter: `drop-shadow(0 0 ${item.size/3}px #ff4500)` }} fill="currentColor" /></div>;
      case 'broom':
        return <div className="hover:rotate-12 transition-transform duration-500"><BroomIcon size={item.size} className="text-[#8b4513]" /></div>;
      case 'star':
        return <Star size={item.size} className="text-mafia-gold drop-shadow-[0_0_15px_rgba(197,160,89,0.8)]" style={commonStyle} fill="currentColor" />;
      case 'medal':
        return <Medal size={item.size} className="text-mafia-gold/60 drop-shadow-[0_0_15px_rgba(197,160,89,0.4)]" style={commonStyle} />;
      case 'scissors':
        return <Scissors size={item.size} className={commonClass} style={commonStyle} />;
      case 'clippers':
        return <ClipperIcon size={item.size} className={commonClass} />;
      default:
        return <Scissors size={item.size} className={commonClass} style={commonStyle} />;
    }
  };

  const isHoliday = items.length > 0 && !['scissors', 'clippers'].includes(items[0].type);

  return (
    <div ref={containerRef} className={`${position} inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen ${isHoliday ? 'opacity-80' : 'opacity-40'} transition-opacity duration-1000 hidden md:block`}>
      {items.map((item) => (
        <div
          key={item.id}
          ref={(el) => { if (item) item.el = el; }}
          className="absolute will-change-transform"
          style={{
            top: 0,
            left: 0,
            transform: `translate(-50%, -50%) translate3d(${item.x}vw, ${item.y}vh, 0) rotate(${item.rotation}deg)`,
            width: item.size,
            height: item.size
          }}
        >
          {renderIcon(item)}
        </div>
      ))}
      <style jsx global>{`
        @keyframes fire-flicker {
          0%, 100% { transform: scale(1) rotate(-1deg); filter: brightness(1); }
          50% { transform: scale(1.1) rotate(1deg); filter: brightness(1.2); }
        }
        .animate-fire {
          animation: fire-flicker 0.6s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
}
