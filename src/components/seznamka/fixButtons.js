const fs = require('fs');
let code = fs.readFileSync('ProfileSetup.tsx', 'utf8');
code = code.replace(/<button(\s+)onClick=\{\(\) => setActiveQuiz/g, '<button type="button"$1onClick={() => setActiveQuiz');
fs.writeFileSync('ProfileSetup.tsx', code);
console.log('done');
