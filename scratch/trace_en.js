const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/locales/translations.ts');
const content = fs.readFileSync(filePath, 'utf8');

let balance = 0;
let lines = content.split('\n');
for (let i = 801; i < 1524; i++) {
    let line = lines[i];
    if (!line) continue;
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (balance <= 0) {
        console.log(`Balance ${balance} at line ${i+1}: ${line}`);
    }
}
