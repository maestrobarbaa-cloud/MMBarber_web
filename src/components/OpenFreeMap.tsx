"use client";

import { useEffect, useRef, useState } from 'react';
import { useUI } from '@/contexts/UIContext';
import { useTranslation } from '@/hooks/useTranslation';

export function OpenFreeMap() {
  const { lang } = useTranslation();
  const langRef = useRef(lang);
  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  const mapContainer = useRef<HTMLDivElement>(null);
  const [activeEasterEgg, setActiveEasterEgg] = useState<any>(null);
  const { isHistoryUnlocked, setIsHistoryUnlocked, isBloodMode, isNoirMode } = useUI();

  useEffect(() => {
    let mapInstance: any = null;
    let isCancelled = false;

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
          
          if (isCancelled) return;

          // Zjištění aktuálního tématu pro mapu (detekujeme rovnou z DOMu pro maximální spolehlivost + UIContext fallback)
          const isBlood = isBloodMode || document.documentElement.classList.contains('theme-blood');
          const isNoir = isNoirMode || document.documentElement.classList.contains('noir-mode');
          const graphicsTier = localStorage.getItem('mmbarber_graphics_tier') || 'low';
          const isWeakerGraphics = ['lite', 'low', 'medium', 'soft'].includes(graphicsTier);
          
          let solidBgColor = '#000000';
          if (isNoir) {
            solidBgColor = '#000000';
          } else if (isWeakerGraphics) {
             if (graphicsTier === 'low') solidBgColor = '#020202';
             else if (graphicsTier === 'soft') solidBgColor = '#0a0a0a';
             else solidBgColor = '#1a1a1a'; // lite, medium
          }
          
          const pageBgColor = solidBgColor;
          const pageBgColorLighter = isWeakerGraphics ? solidBgColor : '#030303';
          
          let colorGold = '#c5a059';
          let colorGoldDark = '#a88647';
          let colorRoadMain = '#8b6914';
          let colorRoadSub = '#5a4611';
          
          if (isBlood) {
            // Domy klasickou červenou, cesty a letiště světlejší
            colorGold = '#8b0000'; // Temně červená z nadpisů
            colorGoldDark = '#5a0000'; // Tmavší červená pro obrysy
            colorRoadMain = '#ff6666'; // Světlejší cesty
            colorRoadSub = '#ff4d4d'; // Světlejší vedlejší cesty
          } else if (isNoir) {
            colorGold = '#e2e2e2';
            colorGoldDark = '#a0a0a0';
            colorRoadMain = '#606060';
            colorRoadSub = '#404040';
          }

          // Modifikace stylu pro aktuální téma
          style.layers.forEach((layer: any) => {
            // Skrytí většiny popisků, ale zobrazení kontinentů, ostrovů a vybraných sídel
            if (layer.type === 'symbol') {
              const isContinent = layer.id.includes('continent') || layer.id.includes('island') || layer.id.includes('ocean') || layer.id.includes('sea');
              const isCity = layer.id.includes('city') || layer.id.includes('town') || layer.id.includes('village') || layer.id.includes('capital') || layer.id.includes('place');
              
              if (isContinent || isCity) {
                if (!layer.layout) layer.layout = {};
                layer.layout.visibility = 'visible';
                
                if (layer.paint && layer.layout['text-field']) {
                  let textColor = isBlood ? '#ff4444' : isNoir ? '#dddddd' : colorGold;
                  // Města dostanou trochu jemnější/tmavší odstín než kontinenty
                  if (isCity && !isContinent) {
                    textColor = isBlood ? '#cc4444' : isNoir ? '#999999' : colorGoldDark;
                  }
                  
                  layer.paint['text-color'] = textColor;
                  layer.paint['text-halo-color'] = pageBgColor;
                  layer.paint['text-halo-width'] = isContinent ? 2 : 1;
                  
                  // Města necháme plynule vyblednout, když jsme oddálení, aby nekřičela přes kontinenty
                  if (isCity && !isContinent) {
                    layer.paint['text-opacity'] = [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      4, 0,   // Na globálním zoomu (4) jsou města neviditelná
                      6.5, 1  // Při přiblížení nad 6.5 už jsou plně viditelná
                    ];
                  }
                }
              } else {
                if (!layer.layout) layer.layout = {};
                layer.layout.visibility = 'none';
              }
            }

            // Úprava pozadí a vody (zdůraznění pobřeží a ostrovů)
            if (layer.id === 'background' || layer.id.includes('water')) {
              if (layer.paint && layer.paint['background-color']) layer.paint['background-color'] = pageBgColorLighter;
              if (layer.paint && layer.paint['fill-color']) layer.paint['fill-color'] = pageBgColor;
              
              // Jemný obrys kolem vodních ploch (kreslí hranice ostrovů a kontinentů)
              if (layer.id.includes('water') && layer.paint && layer.type === 'fill') {
                 const coastColor = isBlood ? '#9a001a' : isNoir ? '#222222' : '#4a3a18';
                 layer.paint['fill-outline-color'] = coastColor;
              }
            }

            if (layer.id.includes('building')) {
              if (layer.paint && layer.paint['fill-color']) layer.paint['fill-color'] = colorGold;
              if (layer.paint && layer.paint['fill-extrusion-color']) layer.paint['fill-extrusion-color'] = colorGold;
              if (layer.paint && layer.paint['line-color']) layer.paint['line-color'] = colorGoldDark;
            }

            if (layer.id.includes('transportation') || layer.id.includes('road') || layer.id.includes('highway') || layer.id.includes('street') || layer.id.includes('bridge') || layer.id.includes('tunnel') || layer.id.includes('path') || layer.id.includes('track')) {
              if (layer.paint && layer.paint['line-color']) {
                if (layer.id.includes('path') || layer.id.includes('track') || layer.id.includes('pedestrian') || layer.id.includes('footway') || layer.id.includes('dirt')) {
                  layer.paint['line-color'] = isNoir ? '#111111' : isBlood ? '#ff9999' : '#241a09'; // Tmavší barva pro polní cesty/pěšiny
                  if (layer.type === 'line') layer.paint['line-width'] = 1; // Ztenčení polních cest
                } else if (layer.id.includes('major') || layer.id.includes('primary') || layer.id.includes('secondary') || layer.id.includes('motorway')) {
                  layer.paint['line-color'] = colorRoadMain; 
                } else {
                  layer.paint['line-color'] = colorRoadSub; 
                }
                
                // Skrytí cest při globálním oddálení (aby vynikly kontinenty)
                if (layer.type === 'line') {
                  layer.paint['line-opacity'] = [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    4, 0,    // Zcela průhledné na globálním zoomu
                    7, 1     // Zcela viditelné při přiblížení na kraje/města
                  ];
                }
              }
              if (layer.paint && layer.paint['fill-color']) {
                  layer.paint['fill-color'] = colorRoadSub;
              }
            }

            // Koleje / Železnice
            if (layer.id.includes('rail') || layer.id.includes('train') || layer.id.includes('transit')) {
              if (layer.paint && layer.paint['line-color']) {
                const railColor = isNoir ? '#444444' : isBlood ? '#ffb3b3' : '#4a3a18';
                layer.paint['line-color'] = railColor;
                if (layer.type === 'line') {
                  layer.paint['line-width'] = 2;
                  layer.paint['line-dasharray'] = [2, 2]; // Vzor pražců (přerušovaná čára)
                }
              }
            }

            // Letištní plochy / Runways
            if (layer.id.includes('aeroway') || layer.id.includes('airport') || layer.id.includes('runway') || layer.id.includes('taxiway')) {
              const runwayColor = isBlood ? '#ff9999' : isNoir ? '#ffffff' : '#fce883'; // Bright glowing colors
              
              if (layer.paint && layer.paint['fill-color']) {
                layer.paint['fill-color'] = colorRoadSub; // Base concrete color for the polygon
              }
              
              if (layer.paint && layer.paint['line-color']) {
                layer.paint['line-color'] = runwayColor; // Bright line for the actual runway/taxiway
                if (layer.type === 'line') {
                  const maxThick = layer.id.includes('runway') ? 4 : 2;
                  // Dynamická tloušťka podle zoomu, aby to z dálky nevypadalo ošklivě tlustě
                  layer.paint['line-width'] = [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    10, 0.5,
                    16, maxThick
                  ];
                }
              }
            }

            // Státy a regiony (zvýraznění při oddálení)
            if (layer.id.includes('admin') || layer.id.includes('boundary') || layer.id.includes('state') || layer.id.includes('country')) {
              // Vynucení zobrazení i při maximálním oddálení (zrušení limitu zoomu)
              if (layer.minzoom) layer.minzoom = 3;
              
              if (layer.paint && layer.paint['line-color']) {
                const boundaryColor = isBlood ? '#8b0000' : isNoir ? '#555555' : '#8a733f';
                layer.paint['line-color'] = boundaryColor;
                
                if (layer.type === 'line') {
                  // Výraznější čáry hranic, když je mapa oddálená
                  layer.paint['line-width'] = [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    3, 2,   // na zoomu 3 (max oddálení) jsou čáry tlustší
                    8, 0.5  // na zoomu 8 už jsou tenoučké
                  ];
                }
              }
            }
          });

          // @ts-ignore
          mapInstance = new window.maplibregl.Map({
            container: mapContainer.current,
            style: style,
            center: [17.4835088, 49.0592272],
            zoom: 14.5, // Výchozí zoom posunut nahoru, aby bylo hned vidět celé město, domy a všechny cesty
            minZoom: 4, // Zabrání odzoomování příliš daleko (udrží focus na úrovni kontinentů)
            pitch: 55, // restored original 3D view
            bearing: -15, // restored original bearing
            attributionControl: false
          });

          // Barva pro značky na mapě (X, tajná schránka atd.)
          const markerColor = isBlood ? '#ff6666' : isNoir ? '#e2e2e2' : colorGold;

          // Vytvoření vlastního "mafiánského" markeru od ruky
          const el = document.createElement('div');
          el.innerHTML = `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; cursor: pointer;">
              <!-- X značka -->
              <div style="font-family: 'Brush Script MT', 'Courier New', cursive; font-size: 28px; color: ${markerColor}; font-weight: bold; transform: rotate(-5deg); text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">X</div>
              <!-- Ručně kreslený kruh -->
              <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.8));" viewBox="0 0 100 100">
                <path d="M 45,15 C 75,10 90,30 85,60 C 80,90 40,95 15,75 C -5,55 10,20 40,15 C 45,14 50,15 50,15" 
                      fill="none" 
                      stroke="${markerColor}" 
                      stroke-width="5" 
                      stroke-linecap="round"
                      style="transform-origin: center; transform: rotate(15deg);"
                />
                <path d="M 40,17 C 45,15 52,16 52,16" 
                      fill="none" 
                      stroke="${markerColor}" 
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

          // Tajná schránka pro "Dnes v historii" (pokud není odemčena)
          if (!isHistoryUnlocked) {
            let lng = localStorage.getItem('mmbarber_history_marker_lng');
            let lat = localStorage.getItem('mmbarber_history_marker_lat');
            
            if (!lng || !lat) {
              // Vygenerovat náhodnou pozici někde kolem Uherského Hradiště
              // Rozsah zhruba: Lng (17.45 - 17.50), Lat (49.05 - 49.08)
              const randomLng = 17.45 + Math.random() * 0.05;
              const randomLat = 49.05 + Math.random() * 0.03;
              lng = randomLng.toString();
              lat = randomLat.toString();
              localStorage.setItem('mmbarber_history_marker_lng', lng);
              localStorage.setItem('mmbarber_history_marker_lat', lat);
            }

            const newspaperEl = document.createElement('div');
            newspaperEl.innerHTML = `
              <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);" class="hover:scale-125 hover:rotate-3 group" title="Něco starého...">
                <div style="position: absolute; inset: -5px; background: radial-gradient(circle, rgba(197,160,89,0.4) 0%, transparent 70%); border-radius: 50%; opacity: 0; transition: opacity 0.4s ease;" class="group-hover:opacity-100 group-hover:animate-pulse"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="#000000" stroke="${markerColor}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.8)) drop-shadow(0 0 8px rgba(197,160,89,0.4));">
                  <!-- Dokument -->
                  <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v18z" fill="#0a0a0a" stroke-width="1.5"/>
                  <polyline points="14 2 14 8 20 8" fill="#111" stroke-width="1.5"/>
                  
                  <!-- Razítko "TOP SECRET" -->
                  <rect x="3" y="11" width="18" height="4" transform="rotate(-15 12 13)" fill="#0a0a0a" stroke="#e2062c" stroke-width="1" />
                  <text x="12" y="14" transform="rotate(-15 12 13)" font-family="monospace" font-size="3.2" font-weight="900" fill="#e2062c" stroke="none" text-anchor="middle" letter-spacing="0.5">CLASSIFIED</text>
                  
                  <!-- Iniciály MM -->
                  <text x="12" y="20" font-family="Georgia, serif" font-size="4" font-weight="900" fill="${colorGoldDark}" stroke="none" text-anchor="middle">MM</text>
                </svg>
              </div>
            `;
            
            // @ts-ignore
            const historyMarker = new window.maplibregl.Marker({ element: newspaperEl })
              .setLngLat([parseFloat(lng), parseFloat(lat)])
              .addTo(mapInstance);
              
            newspaperEl.addEventListener('click', (e) => {
              e.stopPropagation();
              historyMarker.remove();
              localStorage.setItem('mmbarber_history_unlocked', 'true');
              setIsHistoryUnlocked(true);
              setActiveEasterEgg({
                title: "Tajná schránka objevena",
                text: "Našel jsi starý výtisk MMBarber Times! Od teď máš přístup k historickým událostem v levém dolním rohu obrazovky."
              });
            });
          }

          // Hudební easter egg (Nella Notta Siciliana / cina.mp3)
          const savedPlaylist = localStorage.getItem('mmbarber_playlist') || '[]';
          const isSicilianaUnlocked = savedPlaylist.includes('Nella Notta Siciliana.mp3');
          const isCinaUnlocked = savedPlaylist.includes('cina.mp3');
          
          // Pro čínský režim (C.N.Y.) chytáme 'cina.mp3', jinak 'Nella Notta Siciliana'
          const shouldSpawnNote = langRef.current === 'zh' ? !isCinaUnlocked : !isSicilianaUnlocked;

          if (shouldSpawnNote) {
            const musicEl = document.createElement('div');
            musicEl.innerHTML = `
              <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; cursor: pointer;" class="hover:scale-110 group" title="Chyť mě!">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="${colorGold}" stroke="#0a0a0a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px ${colorGold}); animation: bounce 2s infinite;">
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
              </div>
            `;
          
          let musicLng = 17.46 + Math.random() * 0.04;
          let musicLat = 49.06 + Math.random() * 0.02;
          let targetLng = musicLng;
          let targetLat = musicLat;
          let isCaught = false;
          
          // @ts-ignore
          const musicMarker = new window.maplibregl.Marker({ element: musicEl })
            .setLngLat([musicLng, musicLat])
            .addTo(mapInstance);

          const generateNewTarget = () => {
             // Area: UH, Staré Město, Kunovice, Mařatice, Jarošov
             targetLng = 17.43 + Math.random() * 0.06;
             targetLat = 49.04 + Math.random() * 0.04;
          };
          generateNewTarget();

          const animateNote = () => {
             if (isCaught || isCancelled) return;
             
             // Pomalý let mapou
             const speed = 0.00005; // degrees per frame
             const dlng = targetLng - musicLng;
             const dlat = targetLat - musicLat;
             const dist = Math.sqrt(dlng*dlng + dlat*dlat);
             
             if (dist < 0.001) {
                generateNewTarget();
             } else {
                musicLng += (dlng / dist) * speed;
                musicLat += (dlat / dist) * speed;
                musicMarker.setLngLat([musicLng, musicLat]);
             }
             requestAnimationFrame(animateNote);
          };
          requestAnimationFrame(animateNote);
          
          musicEl.addEventListener('mouseenter', () => {
            if (isCaught) return;
            // V čínském módu (c.ny) nota neuhýbá, aby šla snadno chytit jako odměna
            if (lang === 'zh') return;
            
            // Uhýbání - neuteče hned, ale letí trochu pryč
            const dodgeAngle = Math.random() * Math.PI * 2;
            const dodgeDist = 0.003; 
            targetLng = musicLng + Math.cos(dodgeAngle) * dodgeDist;
            targetLat = musicLat + Math.sin(dodgeAngle) * dodgeDist;
            
            // Udržení v hranicích
            targetLng = Math.max(17.43, Math.min(17.49, targetLng));
            targetLat = Math.max(49.04, Math.min(49.08, targetLat));
          });
          
          // Přidáme i touchstart pro mobilní zařízení, kde hover zlobí
          const catchNote = (e: Event) => {
            e.stopPropagation();
            if (isCaught) return;
            isCaught = true;
            
            // Přehrát skladbu
              window.dispatchEvent(new CustomEvent('mmbarber-play-track', { 
                detail: { 
                  track: langRef.current === 'zh' ? '/sounds/cina.mp3' : '/sounds/Nella Notta Siciliana.mp3', 
                  name: langRef.current === 'zh' ? 'Chinese Event' : 'Nella Notta Siciliana', 
                  color: colorGold 
                } 
              }));
              
              // Efekt chycení
              musicEl.innerHTML = `<div style="color: ${colorGold}; font-weight: bold; font-family: monospace; font-size: 16px; text-shadow: 0 0 10px ${colorGold}; white-space: nowrap; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) forwards;">🎵 CHYCENO!</div>`;
              setTimeout(() => musicMarker.remove(), 1500);
          };
          
          musicEl.addEventListener('click', catchNote);
          musicEl.addEventListener('touchstart', catchNote);
          }

          // Zlikvidovaná konkurence (Vypáleno / Sem nechodit)
          const competitors = [
            { name: "SOLO BARBERSHOP", coord: [17.4612420, 49.0688287] },
            { name: "Performance Barber (UH)", coord: [17.4588110, 49.0706053] },
            { name: "Oscar's Barbershop", coord: [17.4625563, 49.0688100] },
            { name: "Robert's Barber Shop", coord: [17.4598511, 49.0688631] },
            { name: "Studio BarberShop", coord: [17.4635381, 49.0690060] },
            { name: "SHOHAI barbershop", coord: [17.4651985, 49.0680358] },
            { name: "Alfa Barbershop", coord: [17.4572550, 49.0711575] },
            { name: "Kadeřnictví Adam", coord: [17.4631921, 49.0687184] },
            { name: "Kotas Tattoo & Barber", coord: [17.4510046, 49.0657056] },
            { name: "6N Cut & Shave Club", coord: [17.4790660, 49.0577954] },
            { name: "Performance Barber (Staré Město)", coord: [17.4464900, 49.0777550] },
            { name: "Holičství Falcon (Staré Město)", coord: [17.4394438, 49.0753663] },
            { name: "Mikulas Tattoo & Barber", coord: [17.4454880, 49.0795132] }
          ];

          const markerObjects: any[] = [];

          competitors.forEach((comp) => {
            const compEl = document.createElement('div');
            // Tmavší barvy, aby ikony více vynikly na světlé/tmavé mapě
            const skullColor = isBlood ? '#ff6666' : isNoir ? '#505050' : '#a87a20'; 
            const skullGlow = isBlood ? 'rgba(255,102,102,0.5)' : isNoir ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.8)';
            const hoverGlow = isBlood ? '#ff9999' : isNoir ? '#ffffff' : '#fce883';

            compEl.innerHTML = `
              <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 50px; height: 50px; opacity: 0.9; cursor: not-allowed; transition: all 0.3s ease;" class="hover:scale-125 hover:opacity-100 group" title="${comp.name}">
                <svg viewBox="0 0 448 512" width="28" height="28" fill="${skullColor}" stroke="#000000" stroke-width="15" style="filter: drop-shadow(0px 2px 4px ${skullGlow}); transition: filter 0.3s ease;" class="group-hover:drop-shadow-[0_0_8px_${hoverGlow}]">
                  <path d="M439.15 453.06L297.17 384l141.99-69.06c7.9-3.95 11.11-13.56 7.15-21.46L432 264.85c-3.95-7.9-13.56-11.11-21.47-7.16L224 348.41 37.47 257.69c-7.9-3.95-17.51-.75-21.47 7.16L1.69 293.48c-3.95 7.9-.75 17.51 7.15 21.46L150.83 384 8.85 453.06c-7.9 3.95-11.11 13.56-7.15 21.47l14.31 28.63c3.95 7.9 13.56 11.11 21.47 7.15L224 419.59l186.53 90.72c7.9 3.95 17.51 .75 21.47-7.15l14.31-28.63c3.95-7.91 .75-17.52-7.16-21.47zM150 237.28l-5.48 25.87c-2.67 12.62 5.42 24.85 16.45 24.85h126.08c11.03 0 19.12-12.23 16.45-24.85l-5.5-25.87c41.78-22.41 70-62.75 70-109.28C368 57.31 303.53 0 224 0S80 57.31 80 128c0 46.53 28.22 86.87 70 109.28zM280 112c17.65 0 32 14.35 32 32s-14.35 32-32 32-32-14.35-32-32 14.35-32 32-32zm-112 0c17.65 0 32 14.35 32 32s-14.35 32-32 32-32-14.35-32-32 14.35-32 32-32z"/>
                </svg>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -bottom-5 text-[10px] whitespace-nowrap px-1 rounded" style="background: rgba(0,0,0,0.9); color: ${skullColor}; border: 1px solid ${skullColor}; font-weight: bold; box-shadow: 0 0 5px rgba(0,0,0,1);">${comp.name}</div>
              </div>
            `;
            
            // @ts-ignore
            const marker = new window.maplibregl.Marker({ element: compEl })
              .setLngLat(comp.coord)
              .addTo(mapInstance);
              
            markerObjects.push({ marker, element: compEl, type: 'competitor' });
          });

          // @ts-ignore
          mapInstance.on('zoom', () => {
             // @ts-ignore
             if (!mapInstance) return;
             // @ts-ignore
             const currentZoom = mapInstance.getZoom();
             const isVisible = currentZoom >= 10; // Viditelné jen když jsme blíže než globální oddálení
             markerObjects.forEach(obj => {
                if (obj.type === 'competitor') {
                  obj.element.style.display = isVisible ? 'flex' : 'none';
                }
             });
          });

          // @ts-ignore
          mapInstance.on('load', () => {
            const runwayLayerIds = style.layers
              .filter((l: any) => l.id.includes('aeroway') || l.id.includes('airport') || l.id.includes('runway') || l.id.includes('taxiway'))
              .map((l: any) => l.id);

            // Zrušíme plynulé přechody (transitions) na dasharray, aby nedocházelo ke crossfadu a efekt vypadal ostře jako světlo.
            runwayLayerIds.forEach((id: string) => {
              // @ts-ignore
              if (mapInstance.getLayer(id) && mapInstance.getLayer(id).type === 'line') {
                // @ts-ignore
                mapInstance.setPaintProperty(id, 'line-dasharray-transition', { duration: 0, delay: 0 });
              }
            });

            // "Running rabbit" efekt (1 bod světla běží po dráze, zbytek tma/mezera)
            const dashArrays = [
              [1, 5],
              [0, 1, 1, 4],
              [0, 2, 1, 3],
              [0, 3, 1, 2],
              [0, 4, 1, 1],
              [0, 5, 1, 0]
            ];
            
            let step = 0;
            const blinkInterval = setInterval(() => {
              if (!mapInstance) {
                clearInterval(blinkInterval);
                return;
              }
              
              step = (step + 1) % dashArrays.length;
              const currentDash = dashArrays[step];
              
              runwayLayerIds.forEach((id: string) => {
                // @ts-ignore
                if (mapInstance.getLayer(id) && mapInstance.getLayer(id).type === 'line') {
                  // @ts-ignore
                  mapInstance.setPaintProperty(id, 'line-dasharray', currentDash);
                }
              });
            }, 80); // Ještě o něco rychlejší, aby to působilo reálněji jako stroboskop
            
            // @ts-ignore
            mapInstance.on('remove', () => clearInterval(blinkInterval));
          });
            
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
      isCancelled = true;
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [isBloodMode, isNoirMode]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full mafia-map-container bg-mafia-black" />
      
      {/* Vyskakovací okno pro Easter Eggs */}
      {activeEasterEgg && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setActiveEasterEgg(null)}>
          <div 
            className="relative bg-[#121212] border-2 max-w-md w-full p-8 shadow-2xl" 
            style={{ 
              borderColor: '#c5a059', 
              boxShadow: '0 0 30px rgba(197, 160, 89, 0.2)',
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-wall.png")'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveEasterEgg(null)} 
              className="absolute top-2 right-3 text-[#c5a059] hover:text-white text-2xl font-bold transition-colors"
            >
              &times;
            </button>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-[#c5a059] mb-2 border-b border-[#c5a059]/30 pb-4 inline-block">
                {activeEasterEgg.title}
              </h2>
            </div>
            <p className="text-gray-300 font-serif leading-relaxed text-lg text-justify first-letter:text-4xl first-letter:text-[#c5a059] first-letter:font-bold first-letter:float-left first-letter:mr-2">
              {activeEasterEgg.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
