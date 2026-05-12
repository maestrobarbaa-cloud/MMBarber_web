const fs = require('fs');
const path = require('path');

const files = [
    'public/obr/nellapelikanova.png',
    'public/obr/tomasmicka.png',
    'public/obr/kreslo.png'
];

files.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        console.log(`${file}: ${stats.size} bytes`);
        // Check first few bytes for PNG signature
        const buffer = Buffer.alloc(8);
        const fd = fs.openSync(fullPath, 'r');
        fs.readSync(fd, buffer, 0, 8, 0);
        fs.closeSync(fd);
        console.log(`  Signature: ${buffer.toString('hex')}`);
    } else {
        console.log(`${file}: NOT FOUND`);
    }
});
