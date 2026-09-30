import fs from 'fs';
import path from 'path';

// Složky k prohledávání
const DIRS_TO_SCAN = ['src/app', 'src/components', 'src/data'];
const OUTPUT_FILE = 'src/data/knowledgeBase.json';

// Pomocná funkce pro rekurzivní čtení složky
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            // Bereme jen .tsx a .ts soubory, vynecháme tento skript a samotný daimonBot, ať se nehledá v chatbotech
            if ((file.endsWith('.tsx') || file.endsWith('.ts')) && file !== 'daimonBot.ts') {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

// Očištění textu od kódu
function extractTextFromCode(code) {
    let extracted = [];
    
    // 1. Vytažení textu z vnitřku JSX tagů: >Tady je text<
    const tagRegex = />([^<]+)</g;
    let match;
    while ((match = tagRegex.exec(code)) !== null) {
        const text = match[1].trim();
        // Vyloučíme JSX proměnné a prázdné znaky
        if (text && text.length > 3 && !text.includes('{') && !text.includes('}')) {
            extracted.push(text);
        }
    }

    // 2. Vytažení čistého textu z uvozovek (např. data, pole, popisky)
    const stringRegex = /(["'`])([^"'`]+)\1/g;
    while ((match = stringRegex.exec(code)) !== null) {
        const text = match[2].trim();
        // Bereme jen to, co vypadá jako skutečný lidský text (obsahuje mezery, nemá lomená lomítka, nemá CSS třídy)
        if (text && text.length > 5 && text.includes(' ') && !text.includes('/') && !text.includes('{') && !text.includes('flex') && !text.includes('text-')) {
             if (text.split(' ').length >= 2) {
                 extracted.push(text);
             }
        }
    }

    // 3. Vyčištění od zbytků kódu a formátování
    return extracted
        .map(t => t.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(t => t.length > 5 && !t.includes('=>') && !t.includes('eslint'))
        // Vyfiltrujeme klíčová slova jazyka
        .filter(t => !/^(export|const|let|var|return|import|function|div|span|className)/.test(t));
}

console.log("🛠️ Začínám generovat Knowledge Base (znalostní databázi) z webu...");

let allTextLines = [];

DIRS_TO_SCAN.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = getAllFiles(dir);
        files.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');
            const extracted = extractTextFromCode(content);
            allTextLines = allTextLines.concat(extracted);
        });
    }
});

// Odstranění duplicit a příliš krátkých textů
const uniqueTexts = [...new Set(allTextLines)];

// Uložíme do JSON pro použití chatbotem
const outputData = {
    generatedAt: new Date().toISOString(),
    totalEntries: uniqueTexts.length,
    data: uniqueTexts
};

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf8');

console.log(`✅ Znalostní databáze úspěšně vygenerována! Obsahuje ${uniqueTexts.length} vět/informací.`);
console.log(`📂 Uloženo do: ${OUTPUT_FILE}`);
