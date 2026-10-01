export const toggleCompass = async () => {
  if (
    typeof window !== 'undefined' && 
    typeof (window as any).DeviceOrientationEvent !== 'undefined' && 
    typeof (window as any).DeviceOrientationEvent.requestPermission === 'function'
  ) {
    try {
      const permissionState = await (window as any).DeviceOrientationEvent.requestPermission();
      if (permissionState === 'granted') {
        window.dispatchEvent(new CustomEvent('mmbarber-toggle-compass'));
      }
    } catch (e) {
      console.error("Compass permission error:", e);
      window.dispatchEvent(new CustomEvent('mmbarber-toggle-compass'));
    }
  } else {
    window.dispatchEvent(new CustomEvent('mmbarber-toggle-compass'));
  }
};
