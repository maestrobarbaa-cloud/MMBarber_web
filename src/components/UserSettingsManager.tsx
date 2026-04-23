"use client";

import { useEffect } from "react";

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

export function UserSettingsManager() {
  useEffect(() => {
    const applySettings = () => {
      const saved = localStorage.getItem("mmbarber_user_config");
      if (saved) {
        try {
          const config = JSON.parse(saved);
          const root = document.documentElement;
          
          if (config.accentColor) {
            root.style.setProperty("--user-accent-color", config.accentColor);
            root.style.setProperty("--user-accent-color-rgb", hexToRgb(config.accentColor));
          }
          
          if (config.glowIntensity !== undefined) {
             root.style.setProperty("--user-glow-intensity", (config.glowIntensity / 50).toString());
          }
          
          if (config.fontFamily) {
             root.style.setProperty("--user-font-sans", config.fontFamily);
          }
        } catch (e) {
          console.error("Failed to parse user config", e);
        }
      }
    };

    applySettings();
    window.addEventListener("mmbarber-user-settings-update", applySettings);
    return () => window.removeEventListener("mmbarber-user-settings-update", applySettings);
  }, []);

  return null;
}
