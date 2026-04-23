// Utility for sending Google Analytics events
interface GTagWindow extends Window {
  gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
}

export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && (window as unknown as GTagWindow).gtag) {
    (window as unknown as GTagWindow).gtag!("event", eventName, params);
  }
};
