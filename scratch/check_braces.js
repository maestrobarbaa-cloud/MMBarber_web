
const fs = require('fs');
const content = fs.readFileSync('src/locales/translations.ts', 'utf8');
let balance = 0;
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '{') balance++;
    if (line[j] === '}') balance--;
  }
  if (line.includes('cs: {')) console.log(`CS start Line ${i + 1} balance: ${balance}`);
  if (line.includes('en: {')) console.log(`EN start Line ${i + 1} balance: ${balance}`);
  if (line.includes('boss: {')) console.log(`BOSS start Line ${i + 1} balance: ${balance}`);
  if (line.includes('falco: {')) console.log(`FALCO start Line ${i + 1} balance: ${balance}`);
}
console.log('Final balance:', balance);
