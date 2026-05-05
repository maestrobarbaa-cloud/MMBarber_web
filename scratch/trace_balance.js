const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/locales/translations.ts');
const content = fs.readFileSync(filePath, 'utf8');

let balance = 0;
let lines = content.split('\n');
for (let i = 0; i < 810; i++) {
    let line = lines[i];
    if (!line) continue;
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (balance === 1 && i > 5) {
        console.log(`Balance 1 at line ${i+1}: ${line}`);
    }
}
