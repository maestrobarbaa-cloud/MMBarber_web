"use client";

import { useEffect, useRef } from 'react';

export function OpenFreeMap() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mapInstance: any = null;

    if (!document.getElementById('maplibre-css')) {
      const link = document.createElement('link');
      link.id = 'maplibre-css';
      link.href = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    const initMap = async () => {
      // @ts-ignore
      if (window.maplibregl && mapContainer.current && !mapInstance) {
        try {
          const res = await fetch('https://tiles.openfreemap.org/styles/dark');
          const style = await res.json();

          // Zjištění aktuálního tématu pro mapu
          const isBlood = localStorage.getItem('mmbarber_blood_mode') === 'true';
          const isNoir = localStorage.getItem('mmbarber_noir_mode') === 'true';
          
          let colorGold = '#c5a059';
          let colorGoldDark = '#a88647';
          let colorRoadMain = '#8b6914';
          let colorRoadSub = '#5a4611';
          
          if (isBlood) {
            colorGold = '#e2062c';
            colorGoldDark = '#9a001a';
            colorRoadMain = '#7a0012';
            colorRoadSub = '#4a0008';
          } else if (isNoir) {
            colorGold = '#e2e2e2';
            colorGoldDark = '#a0a0a0';
            colorRoadMain = '#606060';
            colorRoadSub = '#404040';
          }

          // Modifikace stylu pro aktuální téma
          style.layers.forEach((layer: any) => {
            // Skrytí všech textových popisků a ikon na mapě
            if (layer.type === 'symbol') {
              if (!layer.layout) layer.layout = {};
              layer.layout.visibility = 'none';
            }

            // Úprava pozadí a vody
            if (layer.id === 'background' || layer.id.includes('water')) {
              if (layer.paint && layer.paint['background-color']) layer.paint['background-color'] = '#030303';
              if (layer.paint && layer.paint['fill-color']) layer.paint['fill-color'] = '#000000';
            }

            if (layer.id.includes('building')) {
              if (layer.paint && layer.paint['fill-color']) layer.paint['fill-color'] = colorGold;
              if (layer.paint && layer.paint['fill-extrusion-color']) layer.paint['fill-extrusion-color'] = colorGold;
              if (layer.paint && layer.paint['line-color']) layer.paint['line-color'] = colorGoldDark;
            }

            if (layer.id.includes('transportation') || layer.id.includes('road') || layer.id.includes('highway') || layer.id.includes('street') || layer.id.includes('bridge') || layer.id.includes('tunnel') || layer.id.includes('path') || layer.id.includes('track')) {
              if (layer.paint && layer.paint['line-color']) {
                if (layer.id.includes('major') || layer.id.includes('primary') || layer.id.includes('secondary') || layer.id.includes('motorway')) {
                  layer.paint['line-color'] = colorRoadMain; 
                } else {
                  layer.paint['line-color'] = colorRoadSub; 
                }
              }
              if (layer.paint && layer.paint['fill-color']) {
                  layer.paint['fill-color'] = colorRoadSub;
              }
            }
          });

          // @ts-ignore
          mapInstance = new window.maplibregl.Map({
            container: mapContainer.current,
            style: style,
            center: [17.4835088, 49.0592272],
            zoom: 16, // Přiblížíme trochu víc pro lepší 3D efekt
            pitch: 55, // Naklonění kamery pro dramatický pohled
            bearing: -15, // Mírné natočení
            attributionControl: false
          });

          // Vytvoření vlastního "mafiánského" markeru od ruky
          const el = document.createElement('div');
          el.innerHTML = `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; cursor: pointer;">
              <!-- X značka -->
              <div style="font-family: 'Brush Script MT', 'Courier New', cursive; font-size: 28px; color: ${colorGold}; font-weight: bold; transform: rotate(-5deg); text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">X</div>
              <!-- Ručně kreslený kruh -->
              <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.8));" viewBox="0 0 100 100">
                <path d="M 45,15 C 75,10 90,30 85,60 C 80,90 40,95 15,75 C -5,55 10,20 40,15 C 45,14 50,15 50,15" 
                      fill="none" 
                      stroke="${colorGold}" 
                      stroke-width="5" 
                      stroke-linecap="round"
                      style="transform-origin: center; transform: rotate(15deg);"
                />
                <path d="M 40,17 C 45,15 52,16 52,16" 
                      fill="none" 
                      stroke="${colorGold}" 
                      stroke-width="4" 
                      stroke-linecap="round"
                />
              </svg>
            </div>
          `;

          // @ts-ignore
          new window.maplibregl.Marker({ element: el })
            .setLngLat([17.4835088, 49.0592272])
            .addTo(mapInstance);
            
        } catch (error) {
          console.error("Error loading map style:", error);
        }
      }
    };

    if (!document.getElementById('maplibre-js')) {
      const script = document.createElement('script');
      script.id = 'maplibre-js';
      script.src = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js';
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      // @ts-ignore
      if (window.maplibregl) {
        initMap();
      } else {
        document.getElementById('maplibre-js')?.addEventListener('load', initMap);
      }
    }

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  return (
    <div ref={mapContainer} className="w-full h-full mafia-map-container" />
  );
}
