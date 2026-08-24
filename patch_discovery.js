const fs = require('fs');
const path = require('path');

const discoveryPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'DiscoveryHub.tsx');
let content = fs.readFileSync(discoveryPath, 'utf8');

const newHobbies = `      { id: 'gamer', label: { cs: '🎮 Gamer', en: '🎮 Gamer' }, tag: '🎮 Gamer' },
      { id: 'homechill', label: { cs: '☕ Domácí pohoda', en: '☕ Home chill' }, tag: '☕ Domácí pohoda' },
      { id: 'reader', label: { cs: '📚 Čtenář / Knihomol', en: '📚 Reader / Bookworm' }, tag: '📚 Čtenář' },
      { id: 'dance', label: { cs: '💃 Tanec', en: '💃 Dance' }, tag: '💃 Tanec' },
      { id: 'animals', label: { cs: '🐾 Milovník zvířat', en: '🐾 Animal lover' }, tag: '🐾 Zvířata' },
      { id: 'nature', label: { cs: '🌲 Příroda & Turistika', en: '🌲 Nature & Hiking' }, tag: '🌲 Příroda' },
      { id: 'diy', label: { cs: '🛠️ Kutil / DIY', en: '🛠️ DIY' }, tag: '🛠️ Kutil' },
      { id: 'plants', label: { cs: '🪴 Pěstitel / Rostliny', en: '🪴 Plant lover' }, tag: '🪴 Rostliny' },
      { id: 'photography', label: { cs: '📸 Focení', en: '📸 Photography' }, tag: '📸 Focení' },`;

content = content.replace(
  /\{ id: 'gamer', label: \{ cs: '🎮 Gamer', en: '🎮 Gamer' \}, tag: '🎮 Gamer' \},/,
  newHobbies
);

fs.writeFileSync(discoveryPath, content);
console.log('Done modifying DiscoveryHub.tsx');
