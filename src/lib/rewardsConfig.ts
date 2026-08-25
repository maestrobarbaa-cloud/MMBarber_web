/**
 * Konfigurace odměňovacího systému aplikce.
 * Zde můžete snadno upravit poměry, pokud uvidíte, že algoritmy vydělávají méně, než by měly.
 */
export const REWARDS_CONFIG = {
  // Základní uvítací balíček (když se někdo zaregistruje)
  WELCOME_COINS: 5,
  WELCOME_BOOSTS: 5,

  // Měsíční odměna za návrat po 30 dnech
  MONTHLY_COIN: 1,

  // Referral systém (když někoho přivedete)
  REFERRAL_INVITER_COINS: 5, // Co dostane ten, kdo kód poslal
  REFERRAL_INVITEE_COINS: 5, // Co dostane nováček, který kód zadal
  REFERRAL_INVITEE_BOOSTS: 5,

  // Odměny za aktivitu (10 minut denně)
  ACTIVITY_REQUIRED_MINUTES: 10,
  ACTIVITY_REQUIRED_DAYS: 7, // 7 dní za sebou (nebo celkem)
  ACTIVITY_REWARD_COINS: 1, // Dáváme rovnou plné MMCOINy
};

/**
 * Funkce pro sezónní multiplikátor. 
 * Např. o Vánocích (prosinec) se všechny MMCOIN odměny vynásobí 2x.
 */
export function getSeasonalMultiplier(): number {
  const currentMonth = new Date().getMonth() + 1; // 1 = Leden, 12 = Prosinec
  
  if (currentMonth === 12) {
    // Vánoční bonus
    return 2.0; 
  }
  
  // Přidejte další svátky (např. únor = Valentýn)
  if (currentMonth === 2) {
    return 1.5;
  }

  // Normální doba
  return 1.0;
}
