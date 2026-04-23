/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = 'c:/Users/micka/.gemini/antigravity/scratch/MMBarber/src/locales/translations.ts';

// We need to be careful with the manual structure.
// I'll read the file and find the indices for cs and en.
let content = fs.readFileSync(path, 'utf8');

const startCs = content.indexOf('  cs: {');
const startEn = content.indexOf('  en: {');
const endEn = content.indexOf('  de: {'); // Next language after en

if (startCs !== -1 && startEn !== -1 && endEn !== -1) {
  const csBlock = content.substring(startCs, startEn);
  const enBlock = content.substring(startEn, endEn);
  
  const newContent = `export const translations = {\n${csBlock}${enBlock}};\n`;
  fs.writeFileSync(path, newContent);
  console.log('Restricted to cs and en!');
} else {
  console.log('Could not find boundaries!', {startCs, startEn, endEn});
}
