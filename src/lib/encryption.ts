import crypto from 'crypto';

// Tajný klíč pro šifrování (v produkci by měl být v .env)
const ENCRYPTION_KEY = process.env.CHAT_ENCRYPTION_KEY || 'MMBarberTopSecretKey123456789012'; // Musí mít 32 znaků
const ALGORITHM = 'aes-256-cbc';

// Ošetření délky klíče na přesně 32 bytů pro AES-256
const key = crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest('base64').substring(0, 32);

export function encryptMessage(text: string): string {
  if (!text) return text;
  
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    // Uložíme IV společně s šifrovaným textem (nutné pro dešifrování)
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption failed', error);
    return text; // Fallback
  }
}

export function decryptMessage(encryptedText: string): string {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
  
  try {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift() as string, 'hex');
    const encrypted = textParts.join(':');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed', error);
    // Pokud selže dešifrování, vrátíme zástupný text, aby nepadla aplikace
    return '[Šifrovaná zpráva poškozena]';
  }
}
