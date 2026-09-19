/**
 * Utility pro převod českých bankovních účtů na IBAN a generování SPAYD řetězce (pro QR platby).
 */

/**
 * Převede klasický český formát účtu (např. 123456-1234567890/0100) na platný IBAN formát (CZ...).
 * Podporuje i účty bez předčíslí (např. 1234567890/0100).
 * Pokud je na vstupu již IBAN, vrátí ho nezměněný.
 * Vrací null, pokud je formát neplatný.
 */
export function czechAccountToIban(account: string): string | null {
  if (!account) return null;
  const cleaned = account.trim().toUpperCase().replace(/\s+/g, '');

  // Pokud je to už IBAN (začíná písmeny), tak ho rovnou zkusíme vrátit
  if (/^[A-Z]{2}[0-9]{2}/.test(cleaned)) {
    return cleaned;
  }

  // Očekáváme formát: [předčíslí(max 6)-]číslo(max 10)/kód_banky(4)
  const match = cleaned.match(/^(?:([0-9]{1,6})-)?([0-9]{1,10})\/([0-9]{4})$/);
  
  if (!match) return null;

  const prefix = match[1] ? match[1].padStart(6, '0') : '000000';
  const number = match[2].padStart(10, '0');
  const bankCode = match[3];

  const bban = `${bankCode}${prefix}${number}`;
  
  // CZ = 12, 35. + 00 pro výpočet kontrolních číslic
  const numericString = `${bban}123500`;
  
  // Modulo 97 pro velká čísla (BigInt je dostupný v moderním JS/TS)
  const mod = BigInt(numericString) % 97n;
  const checkDigits = (98n - mod).toString().padStart(2, '0');

  return `CZ${checkDigits}${bban}`;
}

export interface SpaydOptions {
  account: string; // IBAN nebo lokální český formát
  amount: number;
  currency?: string;
  message?: string;
  variableSymbol?: string;
  constantSymbol?: string;
  specificSymbol?: string;
}

/**
 * Vygeneruje SPAYD (Short Payment Descriptor) řetězec,
 * který lze použít pro vygenerování platebního QR kódu.
 */
export function generateSpaydString(options: SpaydOptions): string | null {
  const iban = czechAccountToIban(options.account);
  if (!iban) return null;

  let spayd = `SPD*1.0*ACC:${iban}*AM:${options.amount.toFixed(2)}*CC:${options.currency || 'CZK'}`;

  if (options.message) {
    // Odstranění diakritiky a nepovolených znaků pro jistotu (SPAYD by měl být ASCII/URL safe)
    const safeMsg = options.message.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 60);
    if (safeMsg) {
      spayd += `*MSG:${safeMsg}`;
    }
  }

  if (options.variableSymbol) {
    const vs = options.variableSymbol.replace(/[^0-9]/g, '').substring(0, 10);
    if (vs) spayd += `*X-VS:${vs}`;
  }

  if (options.constantSymbol) {
    const ks = options.constantSymbol.replace(/[^0-9]/g, '').substring(0, 10);
    if (ks) spayd += `*X-KS:${ks}`;
  }

  if (options.specificSymbol) {
    const ss = options.specificSymbol.replace(/[^0-9]/g, '').substring(0, 10);
    if (ss) spayd += `*X-SS:${ss}`;
  }

  return spayd;
}

/**
 * Vygeneruje Google Chart API URL pro zobrazení QR kódu ze SPAYD řetězce.
 * Doporučujeme ale raději použít qrcode.react na frontendu pro lepší výkon a stabilitu.
 */
export function getSpaydQrImageUrl(spaydString: string, size: number = 300): string {
  const encoded = encodeURIComponent(spaydString);
  return `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encoded}&choe=UTF-8`;
}
