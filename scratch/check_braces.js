const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\micka\\Documents\\MMBarber_web\\src\\app\\globals.css', 'utf8');
let stack = [];
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    for (let j = 0; j < line.length; j++) {
        if (line[j] === '{') stack.push({ line: i + 1, char: j + 1 });
        if (line[j] === '}') {
            if (stack.length === 0) {
                console.log(`Extra closing brace at line ${i + 1}, char ${j + 1}`);
            } else {
                stack.pop();
            }
        }
    }
}
if (stack.length > 0) {
    stack.forEach(b => console.log(`Unclosed opening brace at line ${b.line}, char ${b.char}`));
} else {
    console.log('Braces are balanced');
}
