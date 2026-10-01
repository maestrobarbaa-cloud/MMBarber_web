"use client";

import { useEffect, useRef } from 'react';
import { useUI } from '@/contexts/UIContext';

export function SecretOpenFreeMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { isBloodMode, isNoirMode, atmosphereOverride } = useUI();

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

          const isBlood = isBloodMode || document.documentElement.classList.contains('theme-blood');
          const isNoir = isNoirMode || document.documentElement.classList.contains('noir-mode');
          const isHalloween = atmosphereOverride === 'halloween' || document.documentElement.classList.contains('mode-halloween');
          const isSakura = atmosphereOverride === 'sakura';
          const graphicsTier = localStorage.getItem('mmbarber_graphics_tier') || 'low';
          const isWeakerGraphics = ['lite', 'low', 'medium', 'soft'].includes(graphicsTier);
          
          let solidBgColor = '#000000';
          if (isNoir) {
            solidBgColor = '#000000';
          } else if (isWeakerGraphics) {
             if (graphicsTier === 'low') solidBgColor = '#020202';
             else if (graphicsTier === 'soft') solidBgColor = '#0a0a0a';
             else solidBgColor = '#1a1a1a';
          }
          
          const pageBgColor = solidBgColor;
          const pageBgColorLighter = isWeakerGraphics ? solidBgColor : '#030303';
          
          let colorGold = '#c5a059';
          let colorGoldDark = '#a88647';
          let colorRoadMain = '#8b6914';
          let colorRoadSub = '#5a4611';
          
          if (isBlood) {
            colorGold = '#8b0000';
            colorGoldDark = '#5a0000';
            colorRoadMain = '#ff6666';
            colorRoadSub = '#ff4d4d';
          } else if (isNoir) {
            colorGold = '#e2e2e2';
            colorGoldDark = '#a0a0a0';
            colorRoadMain = '#606060';
            colorRoadSub = '#404040';
          } else if (isHalloween) {
            colorGold = '#ff6600';
            colorGoldDark = '#cc5200';
            colorRoadMain = '#ffa366';
            colorRoadSub = '#ff8533';
          } else if (isSakura) {
            colorGold = '#ffb7c5';
            colorGoldDark = '#ff8ca3';
            colorRoadMain = '#ffebf0';
            colorRoadSub = '#ffd1dc';
          } else if (atmosphereOverride === 'national-cz' || atmosphereOverride === 'czech' || atmosphereOverride === 'national-sk' || atmosphereOverride === 'national-ru') {
            colorGold = '#ffffff'; colorGoldDark = '#cccccc'; colorRoadMain = '#d32f2f'; colorRoadSub = '#1976d2'; // CZ/SK/RU colors (Red/Blue/White)
          } else if (atmosphereOverride === 'national-usa' || atmosphereOverride === 'national-uk') {
            colorGold = '#0a3161'; colorGoldDark = '#062044'; colorRoadMain = '#b31942'; colorRoadSub = '#ffffff'; // USA/UK colors
          } else if (atmosphereOverride === 'national-de') {
            colorGold = '#000000'; colorGoldDark = '#333333'; colorRoadMain = '#dd0000'; colorRoadSub = '#ffce00'; // DE colors
          } else if (atmosphereOverride === 'national-at' || atmosphereOverride === 'national-ch' || atmosphereOverride === 'national-ca' || atmosphereOverride === 'national-tr') {
            colorGold = '#ffffff'; colorGoldDark = '#dddddd'; colorRoadMain = '#d32f2f'; colorRoadSub = '#9a0007'; // AT/CH/CA/TR colors (Red/White)
          } else if (atmosphereOverride === 'national-it') {
            colorGold = '#009246'; colorGoldDark = '#006226'; colorRoadMain = '#ce2b37'; colorRoadSub = '#ffffff'; // IT colors
          } else if (atmosphereOverride === 'national-es') {
            colorGold = '#ffc400'; colorGoldDark = '#b28900'; colorRoadMain = '#c60b1e'; colorRoadSub = '#8c0815'; // ES colors
          } else if (atmosphereOverride === 'valentine') {
            colorGold = '#ff4d79'; colorGoldDark = '#cc0033'; colorRoadMain = '#ff1a53'; colorRoadSub = '#ffb3c6';
          } else if (atmosphereOverride === 'spring' || atmosphereOverride === 'easter' || atmosphereOverride === 'may') {
            colorGold = '#a3e635'; colorGoldDark = '#4d7c0f'; colorRoadMain = '#65a30d'; colorRoadSub = '#d9f99d';
          } else if (atmosphereOverride === 'winter' || atmosphereOverride === 'christmas' || atmosphereOverride === 'silvestr') {
            colorGold = '#e0f2fe'; colorGoldDark = '#7dd3fc'; colorRoadMain = '#38bdf8'; colorRoadSub = '#ffffff';
          } else if (atmosphereOverride === 'summer' || atmosphereOverride === 'midsummer') {
            colorGold = '#fde047'; colorGoldDark = '#ca8a04'; colorRoadMain = '#fbbf24'; colorRoadSub = '#fef08a';
          } else if (atmosphereOverride === 'witches' || atmosphereOverride === 'harvest') {
            colorGold = '#ea580c'; colorGoldDark = '#9a3412'; colorRoadMain = '#c2410c'; colorRoadSub = '#fdba74';
          } else if (atmosphereOverride === 'veterans' || atmosphereOverride === 'allsouls') {
            colorGold = '#71717a'; colorGoldDark = '#27272a'; colorRoadMain = '#a1a1aa'; colorRoadSub = '#d4d4d8';
          }

          const cityLayers: string[] = [];

          style.layers.forEach((layer: any) => {
            if (layer.type === 'symbol') {
              const isContinent = layer.id.includes('continent') || layer.id.includes('island') || layer.id.includes('ocean') || layer.id.includes('sea');
              const isCity = layer.id.includes('city') || layer.id.includes('town') || layer.id.includes('village') || layer.id.includes('capital') || layer.id.includes('place');
              
              if (isCity) {
                cityLayers.push(layer.id);
              }
              
              if (isContinent || isCity) {
                if (!layer.layout) layer.layout = {};
                layer.layout.visibility = 'visible';
                
                if (layer.paint && layer.layout['text-field']) {
                  let textColor = isHalloween ? '#ff8533' : isSakura ? '#ffb7c5' : isBlood ? '#ff4444' : isNoir ? '#dddddd' : colorGold;
                  if (isCity && !isContinent) {
                    textColor = isHalloween ? '#cc5200' : isSakura ? '#ff8ca3' : isBlood ? '#cc4444' : isNoir ? '#999999' : colorGoldDark;
                  }
                  
                  layer.paint['text-color'] = textColor;
                  layer.paint['text-halo-color'] = pageBgColor;
                  layer.paint['text-halo-width'] = isContinent ? 2 : 1;
                  
                  if (isCity && !isContinent) {
                    layer.paint['text-opacity'] = [
                      'interpolate', ['linear'], ['zoom'],
                      4, 0, 6.5, 1
                    ];
                  }
                }
              } else {
                if (!layer.layout) layer.layout = {};
                layer.layout.visibility = 'none';
              }
            }

            if (layer.id === 'background' || layer.id.includes('water')) {
              if (layer.paint && layer.paint['background-color']) layer.paint['background-color'] = pageBgColorLighter;
              if (layer.paint && layer.paint['fill-color']) layer.paint['fill-color'] = pageBgColor;
              
              if (layer.id.includes('water') && layer.paint && layer.type === 'fill') {
                 const coastColor = isHalloween ? '#803300' : isBlood ? '#9a001a' : isNoir ? '#222222' : '#4a3a18';
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
                  layer.paint['line-color'] = isHalloween ? '#993d00' : isNoir ? '#111111' : isBlood ? '#ff9999' : '#241a09';
                  if (layer.type === 'line') layer.paint['line-width'] = 1;
                } else if (layer.id.includes('major') || layer.id.includes('primary') || layer.id.includes('secondary') || layer.id.includes('motorway')) {
                  layer.paint['line-color'] = colorRoadMain; 
                } else {
                  layer.paint['line-color'] = colorRoadSub; 
                }
                
                if (layer.type === 'line') {
                  layer.paint['line-opacity'] = [
                    'interpolate', ['linear'], ['zoom'],
                    4, 0, 7, 1
                  ];
                }
              }
              if (layer.paint && layer.paint['fill-color']) {
                  layer.paint['fill-color'] = colorRoadSub;
              }
            }

            if (layer.id.includes('rail') || layer.id.includes('train') || layer.id.includes('transit')) {
              if (layer.paint && layer.paint['line-color']) {
                const railColor = isNoir ? '#444444' : isBlood ? '#ffb3b3' : '#4a3a18';
                layer.paint['line-color'] = railColor;
                if (layer.type === 'line') {
                  layer.paint['line-width'] = 2;
                  layer.paint['line-dasharray'] = [2, 2];
                }
              }
            }

            if (layer.id.includes('aeroway') || layer.id.includes('airport') || layer.id.includes('runway') || layer.id.includes('taxiway')) {
              const runwayColor = isBlood ? '#ff9999' : isNoir ? '#ffffff' : '#fce883';
              
              if (layer.paint && layer.paint['fill-color']) {
                layer.paint['fill-color'] = colorRoadSub;
              }
              
              if (layer.paint && layer.paint['line-color']) {
                layer.paint['line-color'] = runwayColor;
                if (layer.type === 'line') {
                  const maxThick = layer.id.includes('runway') ? 4 : 2;
                  layer.paint['line-width'] = [
                    'interpolate', ['linear'], ['zoom'],
                    10, 0.5, 16, maxThick
                  ];
                }
              }
            }

            if (layer.id.includes('admin') || layer.id.includes('boundary') || layer.id.includes('state') || layer.id.includes('country')) {
              if (layer.minzoom) layer.minzoom = 3;
              
              if (layer.paint && layer.paint['line-color']) {
                const boundaryColor = isBlood ? '#8b0000' : isNoir ? '#555555' : '#8a733f';
                layer.paint['line-color'] = boundaryColor;
                
                if (layer.type === 'line') {
                  layer.paint['line-width'] = [
                    'interpolate', ['linear'], ['zoom'],
                    3, 2, 8, 0.5
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
            zoom: 12,
            minZoom: 4,
            pitch: 0, // 2D pohled (žádný náklon)
            bearing: 0, // Rovně na sever
            attributionControl: false
          });

          // @ts-ignore
          mapInstance.on('load', () => {
            if (isCancelled || !mapInstance) return;

            // Zjistíme zdroj dat pro města, abychom se na něj mohli napojit
            let placeSource = 'openfreemap';
            let placeSourceLayer = 'place';
            
            for (const l of style.layers) {
              if ((l.id.includes('city') || l.id.includes('town')) && l.source) {
                placeSource = l.source;
                placeSourceLayer = l['source-layer'];
                break;
              }
            }

            // Přidáme pevný střed epicentra
            mapInstance.addLayer({
              id: 'shockwave-center',
              type: 'circle',
              source: placeSource,
              'source-layer': placeSourceLayer,
              filter: ['match', ['get', 'class'], ['city', 'town', 'village', 'hamlet'], true, false],
              paint: {
                'circle-color': 'rgba(197, 160, 89, 0.9)',
                'circle-radius': [
                  'interpolate', ['linear'], ['zoom'],
                  5, 2,    // Malá tečka při oddálení
                  15, 10   // Větší tečka při přiblížení
                ],
                'circle-opacity': 1,
                'circle-stroke-width': 0
              }
            });

            // Přidáme expandující vlnu
            mapInstance.addLayer({
              id: 'shockwave-wave',
              type: 'circle',
              source: placeSource,
              'source-layer': placeSourceLayer,
              filter: ['match', ['get', 'class'], ['city', 'town', 'village', 'hamlet'], true, false],
              paint: {
                'circle-color': 'rgba(197, 160, 89, 0.4)',
                'circle-radius': 0, // Bude animováno
                'circle-opacity': 0, // Bude animováno
                'circle-stroke-color': 'rgba(197, 160, 89, 0.8)',
                'circle-stroke-width': 2,
                'circle-stroke-opacity': 0 // Bude animováno
              }
            });

            // Samotná plynulá 60 FPS WebGL animace vlny
            let animationFrameId: number;
            const animateShockwave = () => {
              if (!mapInstance || !mapInstance.getLayer('shockwave-wave')) return;
              
              const timestamp = performance.now();
              const duration = 2500; // Délka jednoho pulzu v ms
              const progress = (timestamp % duration) / duration; // hodnota 0 až 1
              
              // Poloměr se zvětšuje v čase a plynule se škáluje se zoomem mapy
              mapInstance.setPaintProperty('shockwave-wave', 'circle-radius', [
                'interpolate', ['linear'], ['zoom'],
                5, 5 + progress * 20,
                15, 15 + progress * 100
              ]);
              
              // Průhlednost postupně mizí
              const opacity = 1 - progress; // od 1 do 0
              mapInstance.setPaintProperty('shockwave-wave', 'circle-opacity', opacity * 0.4);
              mapInstance.setPaintProperty('shockwave-wave', 'circle-stroke-opacity', opacity * 0.8);
              
              animationFrameId = requestAnimationFrame(animateShockwave);
            };
            
            animateShockwave();
          });

          // Běžící světla na letišti (rabbit effect)
          // @ts-ignore
          mapInstance.on('load', () => {
            const runwayLayerIds = style.layers
              .filter((l: any) => l.id.includes('aeroway') || l.id.includes('airport') || l.id.includes('runway') || l.id.includes('taxiway'))
              .map((l: any) => l.id);

            runwayLayerIds.forEach((id: string) => {
              // @ts-ignore
              if (mapInstance.getLayer(id) && mapInstance.getLayer(id).type === 'line') {
                // @ts-ignore
                mapInstance.setPaintProperty(id, 'line-dasharray-transition', { duration: 0, delay: 0 });
              }
            });

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
            }, 80);
            
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
  }, [isBloodMode, isNoirMode, atmosphereOverride]);

  return (
    <div className="relative w-full h-full flex-1">
      <div ref={mapContainer} className="w-full h-full bg-black" />
    </div>
  );
}
