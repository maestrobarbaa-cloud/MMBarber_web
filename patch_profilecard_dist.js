const fs = require('fs');
const path = require('path');

const profileCardPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'ProfileCard.tsx');
let content = fs.readFileSync(profileCardPath, 'utf8');

const targetContent = `<div className="flex flex-wrap items-center gap-3 mt-2">`;
const newContent = `<div className="flex flex-wrap items-center gap-3 mt-2">
                {profile.distanceFromUser !== undefined && (
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-mafia-gold/30 shadow-[0_0_10px_rgba(197,160,89,0.2)]" title={lang === 'cs' ? 'Zrcadlová vzdálenost (stejně jako vy vidíte tento profil, tak vidí i on vás)' : 'Mirrored distance (both parties see this)'}>
                    <MapPin size={12} className="text-mafia-gold" />
                    <span className="text-mafia-gold text-[10px] font-mono font-bold tracking-widest">{profile.distanceFromUser} km {lang === 'cs' ? 'od tebe' : 'away'}</span>
                  </div>
                )}`;

content = content.replace(targetContent, newContent);

fs.writeFileSync(profileCardPath, content);
console.log('Done modifying ProfileCard.tsx for distance');
