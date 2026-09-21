"use client";

import { useEffect, useRef } from 'react';

export function OpenFreeMap() {
  const mapContainer = useRef<HTMLDivElement>(null);

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

          // Zjištění aktuálního tématu pro mapu
          const isBlood = localStorage.getItem('mmbarber_blood_mode') === 'true';
          const isNoir = localStorage.getItem('mmbarber_noir_mode') === 'true';
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
                 const coastColor = isBlood ? '#550000' : isNoir ? '#222222' : '#4a3a18';
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
                  layer.paint['line-color'] = isNoir ? '#111111' : isBlood ? '#1a0000' : '#241a09'; // Tmavší barva pro polní cesty/pěšiny
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
                const railColor = isNoir ? '#444444' : isBlood ? '#4a0000' : '#4a3a18';
                layer.paint['line-color'] = railColor;
                if (layer.type === 'line') {
                  layer.paint['line-width'] = 2;
                  layer.paint['line-dasharray'] = [2, 2]; // Vzor pražců (přerušovaná čára)
                }
              }
            }

            // Letištní plochy / Runways
            if (layer.id.includes('aeroway') || layer.id.includes('airport') || layer.id.includes('runway') || layer.id.includes('taxiway')) {
              const runwayColor = isBlood ? '#ff3333' : isNoir ? '#ffffff' : '#fce883'; // Bright glowing colors
              
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
                const boundaryColor = isBlood ? '#aa0000' : isNoir ? '#555555' : '#8a733f';
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
  }, []);

  return (
    <div ref={mapContainer} className="w-full h-full mafia-map-container bg-mafia-black" />
  );
}
