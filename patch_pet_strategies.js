const fs = require('fs');
const path = require('path');

const pondPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'Pond.tsx');
let content = fs.readFileSync(pondPath, 'utf8');

const targetStrategies = `const strategies = [
                    { id: 'random', icon: '🎲', label: lang === 'cs' ? 'Náhodné' : 'Random', free: true },
                    { id: 'magnet', icon: '🧲', label: lang === 'cs' ? 'Rozdílné' : 'Opposites', free: false },
                    { id: 'mirror', icon: '🪞', label: lang === 'cs' ? 'Stejné' : 'Mirrors', free: false },
                    ...((currentUser?.seeking?.includes('partner') || currentUser?.seeking?.includes('all')) ? [{ id: 'zodiac', icon: '✨', label: lang === 'cs' ? 'Znamení' : 'Zodiac', free: false }] : []),
                    { id: 'closest', icon: '📍', label: lang === 'cs' ? 'Nejblíž' : 'Closest', free: false }
                  ];`;

const newStrategies = `const isPetMode = searchFilters.accountFilter === 'pet' || currentUser?.accountType === 'pet';
                  const strategies = [
                    { id: 'random', icon: '🎲', label: lang === 'cs' ? (isPetMode ? 'Je mi to jedno' : 'Náhodné') : (isPetMode ? 'Whatever' : 'Random'), free: true },
                    { id: 'magnet', icon: '🧲', label: lang === 'cs' ? (isPetMode ? 'Opačné povahy' : 'Rozdílné') : (isPetMode ? 'Opposite vibes' : 'Opposites'), free: false },
                    { id: 'mirror', icon: '🪞', label: lang === 'cs' ? (isPetMode ? 'Stejný druh' : 'Stejné') : (isPetMode ? 'Same species' : 'Mirrors'), free: false },
                    ...((!isPetMode && (currentUser?.seeking?.includes('partner') || currentUser?.seeking?.includes('all'))) ? [{ id: 'zodiac', icon: '✨', label: lang === 'cs' ? 'Znamení' : 'Zodiac', free: false }] : []),
                    { id: 'closest', icon: '📍', label: lang === 'cs' ? (isPetMode ? 'Zvířata v okolí' : 'Nejblíž') : (isPetMode ? 'Pets nearby' : 'Closest'), free: false }
                  ];`;

content = content.replace(targetStrategies, newStrategies);

fs.writeFileSync(pondPath, content);
console.log('Done patching strategies in Pond.tsx');
