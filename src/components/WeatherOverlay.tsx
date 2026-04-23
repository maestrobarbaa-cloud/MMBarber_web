"use client";

import { useEffect, useState } from "react";
import { getLiveWeather, WeatherState } from "../lib/weather";

type ExtendedWeatherState = WeatherState | 'loading';

export function WeatherOverlay() {
  const [weather, setWeather] = useState<ExtendedWeatherState>('loading');

  const [rainItems, setRainItems] = useState<{id: number, left: number, duration: number, delay: number, opacity: number}[]>([]);
  const [snowItems, setSnowItems] = useState<{id: number, left: number, duration: number, delay: number, size: number, opacity: number}[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1280);
    const handleResize = () => setIsMobile(window.innerWidth < 1280);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setRainItems(Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      left: (Math.random() * 100),
      duration: (Math.random() * 0.4 + 0.3),
      delay: (Math.random() * 2),
      opacity: (Math.random() * 0.4 + 0.6)
    })));

    setSnowItems(Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: (Math.random() * 130 - 15),
      duration: (Math.random() * 7 + 5),
      delay: (Math.random() * 10),
      size: (Math.random() * 6 + 2),
      opacity: (Math.random() * 0.5 + 0.5)
    })));
  }, []);

  useEffect(() => {
    // Function to check weather either from override or from live API
    const fetchWeather = async () => {
      const override = localStorage.getItem('mmbarber_dev_weather_override');
      
      let newWeather: WeatherState = 'clear';
      if (override && override !== 'live') {
        newWeather = override as WeatherState;
      } else {
        newWeather = await getLiveWeather();
      }
      
      setWeather(newWeather);
    };

    fetchWeather();

    // Poll every 10 mins if live
    const intervalId = setInterval(fetchWeather, 600000);
    
    // Listen to storage events to react instantly if dev menu saves from another component/instance
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'mmbarber_dev_weather_override') {
        fetchWeather();
      }
    };
    
    // Custom event for same-window syncing when dev menu clicks
    const onCustomEvent = () => fetchWeather();

    window.addEventListener('storage', onStorage);
    window.addEventListener('mmbarber-weather-update', onCustomEvent);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('mmbarber-weather-update', onCustomEvent);
    };
  }, []);

  if (weather === 'loading') return null;

  return (
    <>
      {/* Base Smoke Overlay - Only visible when weather is clear */}
      {weather === 'clear' && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover xl:object-cover opacity-15 xl:opacity-35 mix-blend-screen z-10 pointer-events-none hidden xl:block"
          style={{ filter: "contrast(1.05) brightness(0.8)", transform: isMobile ? "scale(0.8)" : "scale(1)" }}
        >
          <source src="/smoke2.webm" type="video/webm" />
          <source src="/smoke2_small.mp4" type="video/mp4" />
        </video>
      )}

      {/* Weather Layer - Conditional on top of smoke */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden mix-blend-screen">
        <style>{`
          /* Dynamic Weather Palette - Synced with Theme */
          :root {
            --w-primary: var(--color-mafia-gold, #C5A029);
            --w-glow: var(--color-mafia-gold-glow, rgba(197, 160, 41, 0.4));
          }

          .weather-container {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          }

          /* Rain - Accented needles */
          .rainfall .drop {
            position: absolute;
            bottom: 100%;
            width: 2px;
            height: 120px;
            background: linear-gradient(to bottom, transparent, var(--w-primary), var(--w-glow));
            animation: falling-rain linear infinite;
            filter: drop-shadow(0 0 5px var(--w-glow));
          }

          @media (max-width: 1279px) {
            .rainfall .drop {
              width: 1px;
              height: 60px;
            }
          }

          @keyframes falling-rain {
            0% { transform: translateY(0vh) scaleY(1); }
            100% { transform: translateY(120vh) scaleY(1); }
          }

          /* Snow - Accented dust */
          .snowfall .flake {
            position: absolute;
            bottom: 100%;
            border-radius: 50%;
            background: var(--w-primary);
            box-shadow: 0 0 12px var(--w-glow);
            animation: falling-snow linear infinite;
          }

          @keyframes falling-snow {
            0% { transform: translate(0vw, 0vh) rotate(0deg); opacity: 1; }
            50% { opacity: 0.8; }
            100% { transform: translate(-15vw, 120vh) rotate(720deg); opacity: 0.1; }
          }

          /* Thunderstorm - Accented lightning flash */
          .thunderstorm-flash {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 30%, var(--w-glow), transparent);
            animation: weather-flash ease-in-out infinite;
            opacity: 0;
            mix-blend-mode: color-dodge;
          }

          @keyframes weather-flash {
            0%, 92% { opacity: 0; }
            93% { opacity: 1; }
            94% { opacity: 0.1; }
            95% { opacity: 0.8; }
            96%, 100% { opacity: 0; }
          }
        `}</style>
        
        <div className="weather-container">
          {weather === 'rain' && (
            <div className="rainfall opacity-90">
              {rainItems.map((item) => (
                <div 
                   key={item.id} 
                   className="drop" 
                   style={{ 
                     left: item.left + 'vw', 
                     animationDuration: (isMobile ? item.duration * 2 : item.duration) + 's',
                     animationDelay: item.delay + 's',
                     opacity: item.opacity
                   }} 
                />
              ))}
            </div>
          )}

          {weather === 'snow' && (
            <div className="snowfall opacity-100">
              {snowItems.map((item) => (
                <div 
                   key={item.id} 
                   className="flake" 
                   style={{ 
                     left: item.left + 'vw',
                     animationDuration: item.duration + 's',
                     animationDelay: item.delay + 's',
                     width: item.size + 'px',
                     height: item.size + 'px',
                     opacity: item.opacity
                   }} 
                />
              ))}
            </div>
          )}

          {weather === 'thunderstorm' && (
             <>
                <div className="rainfall opacity-100">
                  {/* Heavy golden rain for thunderstorms - use subset of rain items but faster */}
                  {rainItems.slice(0, 130).map((item) => (
                    <div 
                       key={item.id} 
                       className="drop" 
                       style={{ 
                         left: item.left + 'vw', 
                         animationDuration: (isMobile ? item.duration * 1.5 : item.duration * 0.7) + 's',
                         animationDelay: (item.delay * 0.5) + 's',
                         background: 'linear-gradient(to bottom, transparent, var(--w-primary))',
                         width: isMobile ? '1.5px' : '3px',
                         height: isMobile ? '70px' : '120px'
                       }} 
                    />
                  ))}
                </div>
                
                <div className="thunderstorm-flash" style={{ animationDuration: '7s' }}></div>
                <div className="thunderstorm-flash" style={{ animationDuration: '11s', animationDelay: '3s' }}></div>
             </>
          )}
        </div>
      </div>
    </>
  );
}
