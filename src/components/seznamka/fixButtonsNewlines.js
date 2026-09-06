const fs = require('fs');
let code = fs.readFileSync('ProfileSetup.tsx', 'utf8');

// The `\s+` will catch spaces and newlines
code = code.replace(/<button\s+onClick=\{\(\) => setActiveQuiz/g, '<button type="button" onClick={() => setActiveQuiz');

fs.writeFileSync('ProfileSetup.tsx', code);
console.log('Fixed buttons with newlines!');
