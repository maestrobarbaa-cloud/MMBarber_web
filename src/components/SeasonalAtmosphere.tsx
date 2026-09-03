"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeType } from "@/lib/holidays";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  spin: number;
  opacity: number;
  color?: string;
  type?: 'petal' | 'snow' | 'ember' | 'leaf' | 'orb' | 'lantern';
}

interface SeasonalAtmosphereProps {
  theme: ThemeType;
}

export function SeasonalAtmosphere({ theme }: SeasonalAtmosphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Map theme to behavior
  const getThemeConfig = () => {
    switch (theme) {
      case 'winter':
      case 'silvestr':
        return { particle: 'snow', bg: theme, blend: 'screen', overlay: 'bg-black/30', color: '160, 196, 255' };
      case 'christmas':
        return { particle: 'snow', bg: 'xmas', blend: 'screen', overlay: 'bg-black/40', color: '46, 125, 50' };
      case 'sakura':
      case 'may':
      case 'spring':
        return { particle: 'petal', bg: theme, blend: 'screen', overlay: 'bg-black/40', color: '255, 179, 198' };
      case 'valentine':
        return { particle: 'petal', bg: 'valentine', blend: 'screen', overlay: 'bg-black/60', color: '255, 51, 102' };
      case 'witches':
      case 'harvest':
      case 'halloween':
        return { particle: 'ember', bg: theme, blend: 'screen', overlay: 'bg-black/60', color: '255, 102, 0' };
      case 'cny':
        return { particle: 'lantern', bg: 'cny', blend: 'screen', overlay: 'bg-black/60', color: '255, 0, 0' };
      case 'midsummer':
      case 'allsouls':
      case 'easter':
        return { particle: 'orb', bg: theme, blend: 'screen', overlay: 'bg-black/50', color: '0, 255, 65' };
      case 'summer':
        return { particle: 'orb', bg: 'summer', blend: 'screen', overlay: 'bg-black/30', color: '255, 202, 40' };
      default:
        return { particle: 'none', bg: 'default', blend: 'normal', overlay: 'bg-transparent', color: '255, 255, 255' };
    }
  };

  const config = getThemeConfig();

  useEffect(() => {
    const tier = document.documentElement.getAttribute('data-graphics-tier');
    if (tier === 'low' || tier === 'lite' || config.particle === 'none') {
      setIsVisible(config.particle !== 'none'); // Still render background image if low tier
      // But we will skip canvas animation
    } else {
      setIsVisible(true);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize);

    const initParticles = () => {
      const particles: Particle[] = [];
      const numParticles = width < 768 ? 20 : (config.particle === 'snow' ? 80 : 40);
      
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height - height,
          size: config.particle === 'lantern' ? Math.random() * 15 + 10 : (config.particle === 'snow' ? Math.random() * 3 + 1 : Math.random() * 8 + 3),
          speedY: (config.particle === 'ember' || config.particle === 'lantern') ? -(Math.random() * 1.5 + 0.5) : Math.random() * 1.5 + 0.5,
          speedX: Math.random() * 1 - 0.5,
          angle: Math.random() * 360,
          spin: (Math.random() - 0.5) * 0.1,
          opacity: Math.random() * 0.6 + 0.2
        });
      }
      particlesRef.current = particles;
    };
    
    if (tier !== 'low' && tier !== 'lite') {
      initParticles();
    }

    const drawPetal = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, -p.size / 3, p.size, 0);
      ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, p.size, 0, p.size * 1.2);
      ctx.bezierCurveTo(-p.size / 2, p.size, -p.size, p.size / 3, -p.size, 0);
      ctx.bezierCurveTo(-p.size, -p.size / 3, -p.size / 2, -p.size / 2, 0, 0);
      const gradient = ctx.createLinearGradient(-p.size, -p.size, p.size, p.size);
      const c = config.color || '255,183,197';
      gradient.addColorStop(0, `rgba(${c}, ${p.opacity})`);
      gradient.addColorStop(1, `rgba(${c}, ${p.opacity * 0.5})`);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    };

    const drawSnow = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill();
    };

    const drawEmber = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, ${Math.random() * 100 + 100}, 0, ${p.opacity})`;
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(255,50,0,0.8)";
    };

    const drawOrb = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 255, 150, ${p.opacity})`;
      ctx.fill();
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(100,255,100,0.6)";
    };

    const drawLantern = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      
      // Sways softly
      ctx.rotate(Math.sin(p.angle) * 0.2);
      
      const width = p.size;
      const height = p.size * 1.2;
      
      // Glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = `rgba(255, 50, 0, ${p.opacity})`;

      // Lantern body (red/orange glow)
      ctx.beginPath();
      ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 40, 0, ${p.opacity})`;
      ctx.fill();
      
      // Vertical lines on the lantern
      ctx.strokeStyle = `rgba(100, 10, 0, ${p.opacity * 0.8})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.4, height, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.8, height, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // Top and bottom caps
      ctx.fillStyle = `rgba(255, 200, 0, ${p.opacity})`;
      ctx.shadowBlur = 0;
      ctx.fillRect(-width * 0.4, -height - 2, width * 0.8, 3);
      ctx.fillRect(-width * 0.4, height - 1, width * 0.8, 3);
      
      // Tassel at the bottom
      ctx.beginPath();
      ctx.moveTo(0, height + 2);
      ctx.lineTo(0, height + p.size * 0.8);
      ctx.strokeStyle = `rgba(255, 150, 0, ${p.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    };


    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const time = Date.now() * 0.001;
      const globalWind = Math.sin(time * 0.5) * 0.5;
      
      particlesRef.current.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + globalWind;
        p.angle += p.spin;

        if (config.particle === 'ember' || config.particle === 'lantern') {
            if (p.y < -p.size * 2) {
                p.y = height + p.size * 2;
                p.x = Math.random() * width;
            }
        } else {
            if (p.y > height + p.size) {
                p.y = -p.size;
                p.x = Math.random() * width;
            }
        }

        if (p.x > width + p.size) p.x = -p.size;
        else if (p.x < -p.size) p.x = width + p.size;

        if (config.particle === 'petal') drawPetal(ctx, p);
        else if (config.particle === 'snow') drawSnow(ctx, p);
        else if (config.particle === 'ember') drawEmber(ctx, p);
        else if (config.particle === 'orb') drawOrb(ctx, p);
        else if (config.particle === 'lantern') drawLantern(ctx, p);
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    if (tier !== 'low' && tier !== 'lite') {
      animate();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [theme]);

  if (!isVisible && config.bg === 'default') return null;
  if (typeof window !== 'undefined' && window.innerWidth < 1024) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Image */}
      {config.bg !== 'default' && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-opacity duration-1000" 
          style={{ backgroundImage: `url('/obr/sezona/${config.bg}.jpg')` }}
        ></div>
      )}
      
      {/* Overlay to ensure text readability */}
      <div className={`absolute inset-0 ${config.overlay} transition-colors duration-1000`}></div>
      
      {/* Particles Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full opacity-90 transition-opacity duration-1000 mix-blend-${config.blend}`}
      />
      {/* Global Color Override */}
      {config.color !== '255, 255, 255' && (
        <style dangerouslySetInnerHTML={{ __html: `
          :root, html.theme-gold, html.theme-silver, html.theme-blood, html.mode-stealth {
            --color-mafia-gold: rgb(${config.color}) !important;
            --color-mafia-gold-glow: rgba(${config.color}, 0.5) !important;
          }
        `}} />
      )}
    </div>
  );
}
