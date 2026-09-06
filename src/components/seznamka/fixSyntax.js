const fs = require('fs');
let code = fs.readFileSync('ProfileSetup.tsx', 'utf8');

// Fix the missing closing brackets in CustomSelect onChange handlers
// The broken pattern is: onChange={(val) => setFormData({ ...formData, something: val}
// (Missing the closing `)}` before the newline)
code = code.replace(/onChange=\{\(val\) => setFormData\(\{\s*\.\.\.formData,\s*([^:]+):\s*val(?! \)\})\}/g, 'onChange={(val) => setFormData({ ...formData, $1: val })}');

fs.writeFileSync('ProfileSetup.tsx', code);
console.log('Fixed syntax errors');
