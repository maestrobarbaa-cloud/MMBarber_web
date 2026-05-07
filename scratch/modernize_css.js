const fs = require('fs');
let content = fs.readFileSync('c:\\Users\\micka\\Documents\\MMBarber_web\\src\\app\\globals.css', 'utf8');

// 1. Replace rgba( with rgb(
content = content.replace(/rgba\(/g, 'rgb(');

// 2. Ensure space after commas in rgb() calls
// This regex looks for rgb() calls and adds spaces after commas if missing
content = content.replace(/rgb\(([^)]+)\)/g, (match, p1) => {
    let parts = p1.split(',').map(p => p.trim());
    return `rgb(${parts.join(', ')})`;
});

// 3. One more check for variables with !important (just in case)
content = content.replace(/^(\s*--[a-zA-Z0-9-]+\s*:\s*[^;!]+)\s*!important\s*;/gm, '$1;');

fs.writeFileSync('c:\\Users\\micka\\Documents\\MMBarber_web\\src\\app\\globals.css', content);
console.log('Successfully modernized color functions and cleaned variables.');
