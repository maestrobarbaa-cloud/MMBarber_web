const fs = require('fs');
const path = require('path');

const profileCardPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'ProfileCard.tsx');
let content = fs.readFileSync(profileCardPath, 'utf8');

const targetButton = `{profile.accountType !== 'couple' && (
                <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] uppercase tracking-widest rounded-md transition-colors shadow-[0_0_10px_rgba(37,99,235,0.4)]">
                  {profile.accountType === 'family' ? (lang === 'cs' ? 'Požádat o přidání' : 'Request to join') : (lang === 'cs' ? 'Přidat se' : 'Join')}
                </button>
              )}`;

const newButton = `{profile.accountType !== 'couple' && (
                <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] uppercase tracking-widest rounded-md transition-colors shadow-[0_0_10px_rgba(37,99,235,0.4)]">
                  {lang === 'cs' ? 'Požádat o přidání' : 'Request to join'}
                </button>
              )}`;

content = content.replace(targetButton, newButton);

fs.writeFileSync(profileCardPath, content);
console.log('Done patching button text for groups and families');
