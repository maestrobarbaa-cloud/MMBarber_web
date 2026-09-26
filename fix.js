const fs = require('fs');

function replaceStr(file, oldStr, newStr) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(file, content);
}

// Intro.tsx
replaceStr('src/components/Intro.tsx',
    "className={`h-auto object-contain ",
    "className={`h-auto object-contain transform-gpu [backface-visibility:hidden] [image-rendering:-webkit-optimize-contrast] contrast-105 "
);

// page.tsx (easter egg)
replaceStr('src/app/x7q9-p2m4-v8b1-z5c3/page.tsx',
    "className={`absolute inset-0 w-full h-full object-contain z-10 ",
    "className={`absolute inset-0 w-full h-full object-contain z-10 transform-gpu [backface-visibility:hidden] [image-rendering:-webkit-optimize-contrast] contrast-105 "
);

// zivotopisy/page.tsx
replaceStr('src/app/zivotopisy/page.tsx',
    "className={`object-contain w-full max-w-[220px] md:max-w-[300px] lg:max-w-[350px] h-auto ",
    "className={`object-contain w-full max-w-[220px] md:max-w-[300px] lg:max-w-[350px] h-auto transform-gpu [backface-visibility:hidden] [image-rendering:-webkit-optimize-contrast] contrast-105 "
);

console.log('Done');
