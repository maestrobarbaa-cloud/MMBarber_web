
const fs = require('fs');
const content = fs.readFileSync('src/locales/translations.ts', 'utf8');
const lines = content.split('\n');
let balance = 0;
for (let i = 801; i < 1556; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '{') balance++;
    if (line[j] === '}') balance--;
  }
  if (line.includes(': {') && balance > 2) {
      // console.log(`Line ${i + 1} (${line.trim()}): ${balance}`);
  }
}

// Find line where balance increased but didn't decrease back
balance = 0;
for (let i = 801; i < 1556; i++) {
  const line = lines[i];
  const oldBalance = balance;
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '{') balance++;
    if (line[j] === '}') balance--;
  }
  // If it's a top level section like 'hero: {', balance should go from 1 to 2
  // and back to 1 at the end of the section.
}
console.log('Final balance in EN:', balance);
