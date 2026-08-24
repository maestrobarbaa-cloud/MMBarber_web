const fs = require('fs');
const path = require('path');

const discoveryHubPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'DiscoveryHub.tsx');
let content = fs.readFileSync(discoveryHubPath, 'utf8');

const targetReligion = `{ id: 'hindu', label: { cs: '🕉️ Hinduismus', en: '🕉️ Hinduism' }, tag: '🕉️ Hinduismus' }`;
const newReligion = `{ id: 'hindu', label: { cs: '🕉️ Hinduismus', en: '🕉️ Hinduism' }, tag: '🕉️ Hinduismus' },
        { id: 'higher_power', label: { cs: '✨ Vyšší moc', en: '✨ Higher Power' }, tag: '✨ Vyšší moc' },
        { id: 'aliens', label: { cs: '👽 Mimozemšťané', en: '👽 Aliens' }, tag: '👽 Mimozemšťané' }`;

content = content.replace(targetReligion, newReligion);

fs.writeFileSync(discoveryHubPath, content);
console.log('Done patching DiscoveryHub.tsx');
