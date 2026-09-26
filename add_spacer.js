const fs = require('fs');
let content = fs.readFileSync('src/components/Intro.tsx', 'utf8');

const rightColMarker = '{/* Right Side: Details / Information */}';
const spacer = '<div className="w-[350px] flex-none hidden md:block pointer-events-none"></div>\n        ';

content = content.replace(rightColMarker, spacer + rightColMarker);

fs.writeFileSync('src/components/Intro.tsx', content);
console.log('Added spacer');
