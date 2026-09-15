"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUI } from "@/contexts/UIContext";

export function InteractiveParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBloodMode, setIsBloodMode] = useState(false);
  const [isNoirMode, setIsNoirMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      if (typeof document !== 'undefined') {
        setIsBloodMode(document.documentElement.classList.contains('theme-blood') || document.documentElement.classList.contains('mode-blood'));
        setIsNoirMode(document.documentElement.classList.contains('noir-mode'));
      }
    };
    checkTheme();
    if (typeof document !== 'undefined') {
      const observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }
  }, []);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles: {
      element: HTMLDivElement;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSpeedY: number;
    }[] = [];

    const numParticles = 40;
    const colors = isBloodMode 
      ? ['bg-mafia-red', 'shadow-[0_0_8px_1px_rgba(200,16,46,0.8)]']
      : isNoirMode
      ? ['bg-white', 'shadow-[0_0_8px_1px_rgba(255,255,255,0.8)]']
      : ['bg-[#ffd700]', 'shadow-[0_0_8px_1px_rgba(255,215,0,0.8)]'];

    for (let i = 0; i < numParticles; i++) {
      const el = document.createElement('div');
      el.className = `absolute rounded-full ${colors[0]} ${colors[1]}`;
      const size = Math.random() * 2 + 1.5;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.filter = `blur(${Math.random() * 0.5}px)`;
      el.style.opacity = '0.6';
      // initial position offscreen bottom to flow up
      container.appendChild(el);
      
      particles.push({
        element: el,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: - (Math.random() * 1.5 + 0.5), // fly upwards
        size,
        baseSpeedY: - (Math.random() * 1.5 + 0.5)
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;

    const render = () => {
      particles.forEach(p => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Reset if off screen (top or sides)
        if (p.y < -50) {
          p.y = window.innerHeight + 50;
          p.x = Math.random() * window.innerWidth;
          p.vx = (Math.random() - 0.5) * 0.5;
        }
        if (p.x < -50) p.x = window.innerWidth + 50;
        if (p.x > window.innerWidth + 50) p.x = -50;

        // Mouse repulsion
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200; // Repulsion radius

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          p.vx += (dx / distance) * force * 0.8;
          p.vy += (dy / distance) * force * 0.8;
        } else {
          // Return to base speed
          p.vx *= 0.95; // dampen horizontal
          p.vy += (p.baseSpeedY - p.vy) * 0.05; // gradually return to base vertical speed
        }
        
        // Add subtle sine wave horizontal movement
        p.vx += Math.sin(p.y * 0.02) * 0.05;

        // Apply
        p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleBurst = (e: any) => {
      let burstX = window.innerWidth / 2;
      let burstY = window.innerHeight / 2;
      if (e.detail && e.detail.x !== undefined) burstX = e.detail.x;
      if (e.detail && e.detail.y !== undefined) burstY = e.detail.y;
      
      particles.forEach(p => {
        const dx = p.x - burstX;
        const dy = p.y - burstY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
           const force = 800 / Math.max(distance, 50); 
           p.vx += (dx / distance) * force * (Math.random() * 2 + 1);
           p.vy += (dy / distance) * force * (Math.random() * 2 + 1);
        }
      });
    };

    window.addEventListener('particle-burst', handleBurst as EventListener);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('particle-burst', handleBurst as EventListener);
      cancelAnimationFrame(animationFrameId);
      particles.forEach(p => {
        if (container.contains(p.element)) {
          container.removeChild(p.element);
        }
      });
    };
  }, [isBloodMode, isNoirMode]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen"></div>;
}
