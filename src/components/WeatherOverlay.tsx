"use client";

import { useEffect, useRef, useState } from "react";
import { getLiveWeather, WeatherState } from "../lib/weather";

type ExtendedWeatherState = WeatherState | 'loading';

interface Particle {
    x: number;
    y: number;
    speed: number;
    opacity: number;
    size: number;
    angle: number;
}

export function WeatherOverlay() {
  const [weather, setWeather] = useState<ExtendedWeatherState>('loading');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(undefined);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1280);
    const handleResize = () => {
        setIsMobile(window.innerWidth < 1280);
        const canvas = canvasRef.current;
        if (canvas) {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.scale(dpr, dpr);
        }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initParticles = (type: WeatherState) => {
    const count = type === 'rain' ? 150 : type === 'snow' ? 100 : type === 'thunderstorm' ? 200 : 0;
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            speed: type === 'snow' ? (Math.random() * 2 + 1) : (Math.random() * 15 + 10),
            opacity: Math.random() * 0.5 + 0.3,
            size: type === 'snow' ? (Math.random() * 3 + 1) : (Math.random() * 2 + 1),
            angle: type === 'snow' ? (Math.random() * 0.2 - 0.1) : 0.1 // Slight slant for rain
        });
    }
    particlesRef.current = particles;
  };

  useEffect(() => {
    const fetchWeather = async () => {
      const override = localStorage.getItem('mmbarber_dev_weather_override');
      let newWeather: WeatherState = 'clear';
      if (override && override !== 'live') {
        newWeather = override as WeatherState;
      } else {
        newWeather = await getLiveWeather();
      }
      setWeather(newWeather);
      initParticles(newWeather);
    };

    fetchWeather();
    const intervalId = setInterval(fetchWeather, 600000);
    
    const onCustomEvent = () => fetchWeather();
    window.addEventListener('mmbarber-weather-update', onCustomEvent);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mmbarber-weather-update', onCustomEvent);
    };
  }, []);

  useEffect(() => {
    if (weather === 'loading' || weather === 'clear') {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let goldColor = '#C5A029';
    const updateColor = () => {
        goldColor = getComputedStyle(document.documentElement).getPropertyValue('--color-mafia-gold').trim() || '#C5A029';
    };
    updateColor();

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const particles = particlesRef.current;
        const w = canvas.width;
        const h = canvas.height;

        ctx.strokeStyle = goldColor;
        ctx.fillStyle = goldColor;

        particles.forEach(p => {
            // Update position
            p.y += p.speed * (isMobile ? 0.6 : 1);
            p.x += Math.sin(p.y * 0.01) * (weather === 'snow' ? 1 : 0.2); // Sidelong drift

            if (p.y > 110) {
                p.y = -10;
                p.x = Math.random() * 100;
            }

            const px = (p.x / 100) * w;
            const py = (p.y / 100) * h;

            if (weather === 'rain' || weather === 'thunderstorm') {
                ctx.globalAlpha = p.opacity;
                ctx.lineWidth = p.size;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px + p.angle * 50, py + (isMobile ? 40 : 80));
                ctx.stroke();
            } else if (weather === 'snow') {
                ctx.globalAlpha = p.opacity;
                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [weather, isMobile]);

  if (weather === 'loading') return null;

  return (
    <>
      {/* Base Smoke Overlay */}
      {weather === 'clear' && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-15 xl:opacity-35 mix-blend-screen z-10 pointer-events-none hidden xl:block"
          style={{ filter: "contrast(1.05) brightness(0.8)" }}
        >
          <source src="/smoke2.webm" type="video/webm" />
          <source src="/smoke2_small.mp4" type="video/mp4" />
        </video>
      )}

      {/* Weather Layer - Canvas based */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden mix-blend-screen">
        {weather !== 'clear' && (
            <canvas 
                ref={canvasRef}
                className="w-full h-full"
            />
        )}
        
        {/* Thunderstorm Flash Overlay */}
        {weather === 'thunderstorm' && (
            <>
                <style>{`
                    .thunderstorm-flash {
                        position: absolute;
                        inset: 0;
                        background: radial-gradient(circle at 50% 30%, rgba(197, 160, 41, 0.2), transparent);
                        animation: weather-flash ease-in-out infinite;
                        opacity: 0;
                        mix-blend-mode: color-dodge;
                        pointer-events: none;
                    }
                    @keyframes weather-flash {
                        0%, 92% { opacity: 0; }
                        93% { opacity: 1; }
                        94% { opacity: 0.1; }
                        95% { opacity: 0.8; }
                        96%, 100% { opacity: 0; }
                    }
                `}</style>
                <div className="thunderstorm-flash" style={{ animationDuration: '7s' }}></div>
                <div className="thunderstorm-flash" style={{ animationDuration: '11s', animationDelay: '3s' }}></div>
            </>
        )}
      </div>
    </>
  );
}

