/**
 * DynamicEventEngine.ts
 * 
 * "Nádech a Výdech" Algorithm
 * Breathing algorithm to dynamically adjust app behavior based on peak hours and holidays.
 * Peak (Nádech): Restricts matching, increases coin costs to build tension.
 * Off-Peak (Výdech): Loosens restrictions, decreases coin costs to encourage activity.
 * Holidays (Sváteční štědrost): Overrides everything to be very generous.
 */

export type EventPhase = 'PEAK' | 'OFF_PEAK' | 'NORMAL' | 'HOLIDAY';

export interface DynamicModifiers {
  phase: EventPhase;
  eventName?: string;
  coinMultiplier: number;
  delayDays: number;
  baseChatUnlockCost: number;
  currentChatUnlockCost: number;
  description: { cs: string; en: string };
}

// Holiday definitions (MM-DD)
const HOLIDAYS: Record<string, { name: string, description: {cs: string, en: string} }> = {
  "12-24": { name: "Vánoční Nadílka", description: { cs: "Štědrý den! Odemčení chatu je zlevněné.", en: "Christmas Eve! Chat unlocks are discounted." } },
  "12-25": { name: "Vánoční Nadílka", description: { cs: "Vánoce! Odemčení chatu je zlevněné.", en: "Christmas Day! Chat unlocks are discounted." } },
  "02-14": { name: "Valentýn", description: { cs: "Svátek zamilovaných! Zrychlené propojování.", en: "Valentine's Day! Fast matching." } },
  "12-31": { name: "Silvestr", description: { cs: "Nový rok se blíží, spoj se hned!", en: "New Year is coming, connect now!" } }
};

export class DynamicEventEngine {
  
  static readonly BASE_CHAT_UNLOCK_COST = 5; // Default cost in Coins
  static readonly BASE_DELAY_DAYS = 7; // Default waiting days for free unlock

  /**
   * Get the current event status and modifiers based on the given date (default now).
   */
  static getEventStatus(date: Date = new Date()): DynamicModifiers {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const holidayKey = `${month}-${day}`;

    // 1. Check for Holidays (Highest priority - "Massive Release")
    if (HOLIDAYS[holidayKey]) {
      return {
        phase: 'HOLIDAY',
        eventName: HOLIDAYS[holidayKey].name,
        coinMultiplier: 0.4, // 60% discount
        delayDays: 3, // Faster free match
        baseChatUnlockCost: this.BASE_CHAT_UNLOCK_COST,
        currentChatUnlockCost: Math.ceil(this.BASE_CHAT_UNLOCK_COST * 0.4),
        description: HOLIDAYS[holidayKey].description
      };
    }

    const hour = date.getHours();

    // 2. Check for Peak Hours (Tension / "Nádech") - e.g. 19:00 to 23:00
    if (hour >= 19 && hour <= 23) {
      return {
        phase: 'PEAK',
        eventName: 'Peak Hours',
        coinMultiplier: 1.6, // 60% more expensive
        delayDays: 10, // Longer wait
        baseChatUnlockCost: this.BASE_CHAT_UNLOCK_COST,
        currentChatUnlockCost: Math.ceil(this.BASE_CHAT_UNLOCK_COST * 1.6),
        description: { 
          cs: "Nejvíce lidí online! Vyšší cena za okamžitý přístup.", 
          en: "Peak time! Higher cost for instant access." 
        }
      };
    }

    // 3. Check for Off-Peak Hours (Release / "Výdech") - e.g. 09:00 to 14:00
    if (hour >= 9 && hour <= 14) {
      return {
        phase: 'OFF_PEAK',
        eventName: 'Happy Hours',
        coinMultiplier: 0.4, // 60% discount
        delayDays: 5, // Faster free match
        baseChatUnlockCost: this.BASE_CHAT_UNLOCK_COST,
        currentChatUnlockCost: Math.ceil(this.BASE_CHAT_UNLOCK_COST * 0.4),
        description: { 
          cs: "Happy Hour! Propojení je teď výrazně levnější.", 
          en: "Happy Hour! Connection is much cheaper right now." 
        }
      };
    }

    // 4. Normal operation
    return {
      phase: 'NORMAL',
      eventName: 'Standard',
      coinMultiplier: 1.0,
      delayDays: this.BASE_DELAY_DAYS,
      baseChatUnlockCost: this.BASE_CHAT_UNLOCK_COST,
      currentChatUnlockCost: this.BASE_CHAT_UNLOCK_COST,
      description: { 
        cs: "Standardní podmínky propojování.", 
        en: "Standard matching conditions." 
      }
    };
  }
}
