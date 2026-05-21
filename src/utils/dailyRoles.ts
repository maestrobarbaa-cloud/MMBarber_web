export const FUNNY_ROLES = [
  "Generální ředitel přechodů",
  "Strategický nákupčí barber technologií",
  "Ředitel vlasové strategie",
  "Manažer krizového přechodu",
  "Vedoucí oddělení vousového růstu",
  "Koordinátor zákaznického komfortu",
  "Firemní auditor fade procesů",
  "Projektový manažer atmosféry",
  "Specialista prvního dojmu",
  "Manažer prémiového holení",
  "Senior konzultant pro kontury",
  "Koordinátor barber synergie",
  "Vedoucí provozu kávovaru",
  "Specialista interního respektu",
  "Stážista vlasové logistiky",
  "Externí poradce pro růst kotlet",
  "Ředitel krizového fade managementu",
  "Manažer firemní autenticity",
  "Koordinátor ostrých břitů",
  "Konzultant pro synergii vousů",
  "Generální manažer barber korporátu",
  "Vedoucí oddělení luxusního posedu",
  "Specialista na digitální respekt",
  "Výkonný ředitel barber operací",
  "Manažer toaletních operací",
  "Technik mokré podlahy",
  "Kosmetik podlahových krytin",
  "Vedoucí oddělení smetáku",
  "Senior specialista na odpadkové hospodářství",
  "Koordinátor toaletního papíru",
  "Projektový manažer umyvadlových procesů",
  "Expert na hygienickou synergii",
  "Manažer klikového systému dveří",
  "Auditor čistoty zrcadel",
  "Konzultant židlí a posedů",
  "Technik akustiky fénu",
  "Vedoucí oddělení kabelového managementu",
  "Operátor koštěte první třídy",
  "Specialista krizového vytírání",
  "Senior manager popelníkové estetiky",
  "Ředitel ventilace a kouřové atmosféry",
  "Koordinátor vůně záchodového osvěžovače",
  "Asistent strategického zametání",
  "Manažer krizového splachování",
  "Výkonný specialista na drobky vlasů",
  "Vedoucí sekce tajemného cvakání strojků",
  "Kontrolor lesku dlažby",
  "Hlavní architekt čekárnového flow",
  "Ředitel vstupních rohoží",
  "CEO mokrého hadru"
];

export function getDailyRole(barberId: string, lang: string = 'cs'): string {
  // Get days since epoch to change daily
  const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  
  // Create a predictable but daily-changing index for this barber
  // Use sum of char codes of barberId as salt
  const salt = barberId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Calculate index
  const index = (daysSinceEpoch + salt) % FUNNY_ROLES.length;
  
  const role = FUNNY_ROLES[index];
  
  // If english, we could translate, but since we only have CS roles, 
  // return them directly or return a generic if requested. 
  // Given the comedic nature, returning the CS one or a placeholder might be fine.
  // For now, let's just return the role (or you can add EN translations later)
  return lang === 'en' ? "CORPORATE BARBER AGENT" : role;
}
