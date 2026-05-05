
const fs = require('fs');
const path = require('path');

// Mock translations to check keys
const translations = require('./src/locales/translations.ts').translations;

function getKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], prefix + key + '.'));
    } else {
      keys.push(prefix + key);
    }
  }
  return keys;
}

const csKeys = getKeys(translations.cs);
const enKeys = getKeys(translations.en);
const bossKeys = getKeys(translations.boss);
const falcoKeys = getKeys(translations.falco);

function findMissing(master, target, name) {
  const missing = master.filter(k => !target.includes(k));
  console.log(`Missing keys in ${name}:`, missing.length);
  if (missing.length > 0) {
    console.log(missing.join('\n'));
  }
}

findMissing(csKeys, enKeys, 'EN');
findMissing(csKeys, bossKeys, 'BOSS');
findMissing(csKeys, falcoKeys, 'FALCO');
