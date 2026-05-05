const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/locales/translations.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The main issue is that locales are closing too early or missing braces.
// I will try to find the start of each locale and rebuild the object.

const locales = ['cs', 'en', 'boss', 'falco'];
const startLines = {};
locales.forEach(loc => {
    const idx = content.indexOf(`  ${loc}: {`);
    if (idx !== -1) startLines[loc] = idx;
});

// Rebuild the file
let newContent = `export const translations = {\n`;

locales.forEach((loc, i) => {
    const start = startLines[loc];
    let end;
    if (i < locales.length - 1) {
        end = startLines[locales[i+1]];
    } else {
        end = content.lastIndexOf('};');
    }

    let localeContent = content.substring(start, end).trim();
    // Remove the trailing comma if it exists
    if (localeContent.endsWith(',')) {
        localeContent = localeContent.substring(0, localeContent.length - 1);
    }
    
    // Ensure the locale object is balanced
    let balance = 0;
    for (let char of localeContent) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    
    while (balance < 0) {
        // Too many closing braces, remove the last one
        const lastBrace = localeContent.lastIndexOf('}');
        localeContent = localeContent.substring(0, lastBrace) + localeContent.substring(lastBrace + 1);
        balance++;
    }
    while (balance > 0) {
        // Too few closing braces, add one
        localeContent += '\n  }';
        balance--;
    }

    newContent += '  ' + localeContent + (i < locales.length - 1 ? ',\n' : '\n');
});

newContent += '};';

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Translations file reconstructed and balanced.');
