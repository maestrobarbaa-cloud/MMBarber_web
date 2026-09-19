"use client";

import { useEffect, useRef } from 'react';

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.maplibregl && mapContainer.current) {
        // @ts-ignore
        const map = new window.maplibregl.Map({
          container: mapContainer.current,
          style: 'https://tiles.openfreemap.org/styles/dark',
          center: [17.4835088, 49.0592272],
          zoom: 15.5,
          attributionControl: false
        });
        // @ts-ignore
        new window.maplibregl.Marker({ color: '#c5a059' })
          .setLngLat([17.4835088, 49.0592272])
          .addTo(map);
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, backgroundColor: '#000', overflow: 'hidden' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
