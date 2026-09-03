"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type GraphicsTier = "lite" | "low" | "medium" | "high" | "ultra" | "soft";
export type WeatherState = 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'live';

interface UIContextProps {
  isSoundEnabled: boolean;
  setIsSoundEnabled: (val: boolean) => void;
  isStealthMode: boolean;
  setIsStealthMode: (val: boolean) => void;
  graphicsTier: GraphicsTier;
  setGraphicsTier: (val: GraphicsTier) => void;
  isDevMode: boolean;
  setIsDevMode: (val: boolean) => void;
  isMobileEffectsEnabled: boolean;
  setIsMobileEffectsEnabled: (val: boolean) => void;
  weatherOverride: WeatherState;
  setWeatherOverride: (val: WeatherState) => void;
  isGameEnabled: boolean;
  setIsGameEnabled: (val: boolean) => void;
  floatingItemOverride: string;
  setFloatingItemOverride: (val: string) => void;
  atmosphereOverride: string;
  setAtmosphereOverride: (val: string) => void;
  accentColor: string;
  setAccentColor: (val: string) => void;
  isNoirMode: boolean;
  setIsNoirMode: (val: boolean) => void;
  isBloodMode: boolean;
  setIsBloodMode: (val: boolean) => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isStealthMode, setIsStealthMode] = useState(false);
  const [graphicsTier, setGraphicsTier] = useState<GraphicsTier>("low");
  const [isDevMode, setIsDevMode] = useState(false);
  
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = useState(true);
  const [weatherOverride, setWeatherOverride] = useState<WeatherState>('live');
  const [isGameEnabled, setIsGameEnabled] = useState(false);
  const [floatingItemOverride, setFloatingItemOverride] = useState<string>('random');
  const [atmosphereOverride, setAtmosphereOverride] = useState<string>('classic');
  const [accentColor, setAccentColor] = useState<string>('live');
  
  const [isNoirMode, setIsNoirMode] = useState(false);
  const [isBloodMode, setIsBloodMode] = useState(false);

  useEffect(() => {
    setIsSoundEnabled(localStorage.getItem("mmbarber_sound_enabled") !== "false");
    setIsStealthMode(localStorage.getItem("mmbarber_stealth_mode") === "true");
    setIsDevMode(localStorage.getItem("mmbarber_dev_mode") === "true");
    
    const savedTier = localStorage.getItem("mmbarber_graphics_tier") as GraphicsTier;
    if (savedTier) setGraphicsTier(savedTier);

    setIsMobileEffectsEnabled(localStorage.getItem("mmbarber_mobile_effects_enabled") !== "false");
    
    const savedWeather = localStorage.getItem("mmbarber_dev_weather_override") as WeatherState;
    if (savedWeather) setWeatherOverride(savedWeather);

    setIsGameEnabled(localStorage.getItem("mmbarber_game_enabled") === "true");
    
    const savedFloatingItem = localStorage.getItem("mmbarber_floating_item_override");
    if (savedFloatingItem) setFloatingItemOverride(savedFloatingItem);

    const savedAtmosphere = localStorage.getItem("mmbarber_atmosphere_override");
    if (savedAtmosphere) setAtmosphereOverride(savedAtmosphere);

    const savedAccentColor = localStorage.getItem("mmbarber_dev_accent_color");
    if (savedAccentColor) setAccentColor(savedAccentColor);

    setIsNoirMode(localStorage.getItem("mmbarber_noir_mode") === "true");
    setIsBloodMode(localStorage.getItem("mmbarber_blood_mode") === "true");
  }, []);

  // Sync to DOM when noir or blood mode changes
  useEffect(() => {
    if (isNoirMode) {
      document.documentElement.classList.add("noir-mode");
      document.documentElement.classList.remove("theme-blood");
    } else if (isBloodMode) {
      document.documentElement.classList.add("theme-blood");
      document.documentElement.classList.remove("noir-mode");
    } else {
      document.documentElement.classList.remove("noir-mode");
      document.documentElement.classList.remove("theme-blood");
    }
  }, [isNoirMode, isBloodMode]);

  return (
    <UIContext.Provider value={{
      isSoundEnabled, setIsSoundEnabled,
      isStealthMode, setIsStealthMode,
      graphicsTier, setGraphicsTier,
      isDevMode, setIsDevMode,
      isMobileEffectsEnabled, setIsMobileEffectsEnabled,
      weatherOverride, setWeatherOverride,
      isGameEnabled, setIsGameEnabled,
      floatingItemOverride, setFloatingItemOverride,
      atmosphereOverride, setAtmosphereOverride,
      accentColor, setAccentColor,
      isNoirMode, setIsNoirMode,
      isBloodMode, setIsBloodMode
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
