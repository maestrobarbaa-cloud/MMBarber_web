/**
 * MMBarber Internal Identity System
 * Replaces external Google Auth with a secure fingerprinting system.
 * Combines IP, Device ID, and Browser Fingerprint to identify unique voters.
 */

let cachedIdentity: string | null = null;

export const getInternalIdentity = async (): Promise<string> => {
  if (cachedIdentity) return cachedIdentity;

  try {
    // 1. Persistent Device ID (Stays until browser storage is cleared)
    let deviceId = typeof window !== 'undefined' ? localStorage.getItem("mmbarber_device_id") : null;
    if (!deviceId && typeof window !== 'undefined') {
      deviceId = crypto.randomUUID();
      localStorage.setItem("mmbarber_device_id", deviceId);
    }

    // 2. Public IP Address (Network identifier)
    let ip = "127.0.0.1";
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      ip = data.ip || "127.0.0.1";
    } catch (e) {
      // Fallback if IP API is down
      console.warn("Identity: IP fetch failed, using fallback.");
    }

    // 3. Hardware/Browser Fingerprint
    const fingerprint = typeof navigator !== 'undefined' 
      ? `${navigator.userAgent}-${window.screen.width}x${window.screen.height}-${navigator.language}`
      : "server-side";

    // 4. Secret Salt (Internal to the build)
    const salt = "mmbarber-secure-voting-v1";

    // 5. Combine and Hash with SHA-256
    const rawId = `${deviceId}-${ip}-${fingerprint}-${salt}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(rawId);
    
    // Native Web Crypto API
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    cachedIdentity = hashHex;
    return hashHex;
  } catch (error) {
    console.error("Identity generation failed:", error);
    return "anonymous-fallback-" + Math.random().toString(36).substring(7);
  }
};
