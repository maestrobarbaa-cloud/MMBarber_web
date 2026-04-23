/**
 * Utility to play sound effects with global sound setting and device resolution checks.
 */
export const playSound = (soundPath: string, volume: number = 0.4) => {
  if (typeof window === 'undefined') return;

  const isSoundEnabled = localStorage.getItem("mmbarber_sound_enabled") === "true";

  // sounds are disabled globally
  if (!isSoundEnabled) {
    return;
  }

  try {
    const audio = new Audio(soundPath);
    audio.volume = volume;
    audio.play().catch((err) => {
      console.debug("Sound play blocked or interrupted:", err);
    });
  } catch (err) {
    console.debug("Error creating audio object:", err);
  }
};
