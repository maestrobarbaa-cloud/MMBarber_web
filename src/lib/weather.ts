export type WeatherState = 'clear' | 'rain' | 'snow' | 'thunderstorm';

let weatherCache: { data: WeatherState; temperature: number; timestamp: number } | null = null;
let daytimeCache: { data: boolean; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches the current weather for Uherské Hradiště (Lat: 49.0697, Lon: 17.4597)
 * using the open-meteo API and maps it to a unified WeatherState.
 */
export async function getLiveWeather(lat: number = 49.0697, lon: number = 17.4597): Promise<WeatherState> {
  const now = Date.now();
  if (weatherCache && (now - weatherCache.timestamp < CACHE_TTL)) {
    return weatherCache.data;
  }
  await fetchWeatherData(lat, lon);
  return weatherCache ? weatherCache.data : 'clear';
}

export async function getLiveTemperature(lat: number = 49.0697, lon: number = 17.4597): Promise<number> {
  const now = Date.now();
  if (weatherCache && (now - weatherCache.timestamp < CACHE_TTL)) {
    return weatherCache.temperature;
  }
  await fetchWeatherData(lat, lon);
  return weatherCache ? weatherCache.temperature : 0;
}

async function fetchWeatherData(lat: number, lon: number) {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Europe%2FPrague`).catch(() => null);
    
    if (!response || !response.ok) {
        weatherCache = { data: 'clear', temperature: 0, timestamp: Date.now() };
        return;
    }

    const data = await response.json();
    const wmoCode = data?.current_weather?.weathercode;
    const temperature = data?.current_weather?.temperature ?? 0;

    const res = wmoCode === undefined ? 'clear' : mapWmoToState(wmoCode);
    weatherCache = { data: res, temperature, timestamp: Date.now() };
  } catch {
    weatherCache = { data: 'clear', temperature: 0, timestamp: Date.now() };
  }
}

function mapWmoToState(wmoCode: number): WeatherState {
    if (wmoCode >= 95 && wmoCode <= 99) return 'thunderstorm';
    if ((wmoCode >= 71 && wmoCode <= 77) || (wmoCode >= 85 && wmoCode <= 86)) return 'snow';
    if ((wmoCode >= 51 && wmoCode <= 67) || (wmoCode >= 80 && wmoCode <= 82)) return 'rain';
    return 'clear';
}

/**
 * Determines if it's currently daytime at the given location by fetching sunrise/sunset from Open-Meteo.
 */
export async function isDaytime(lat: number = 49.0697, lon: number = 17.4597): Promise<boolean> {
  const nowTs = Date.now();
  if (daytimeCache && (nowTs - daytimeCache.timestamp < CACHE_TTL)) {
    return daytimeCache.data;
  }

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=Europe%2FPrague&forecast_days=1`).catch(() => null);
    
    if (!response || !response.ok) {
      const hour = new Date().getHours();
      const res = hour >= 7 && hour < 20;
      daytimeCache = { data: res, timestamp: Date.now() };
      return res;
    }

    const data = await response.json();
    const sunrise = new Date(data.daily.sunrise[0]).getTime();
    const sunset = new Date(data.daily.sunset[0]).getTime();
    const now = new Date().getTime();
    const res = now >= sunrise && now <= sunset;
    daytimeCache = { data: res, timestamp: Date.now() };
    return res;
  } catch {
    const hour = new Date().getHours();
    return hour >= 7 && hour < 20;
  }
}

export async function searchCity(name: string): Promise<{ lat: number, lon: number, name: string } | null> {
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=cs&format=json`).catch(() => null);
    if (!res || !res.ok) return null;
    
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
        name: data.results[0].name
      };
    }
  } catch {
    // Silent fail
  }
  return null;
}
