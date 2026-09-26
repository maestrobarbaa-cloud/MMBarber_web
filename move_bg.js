const fs = require('fs');
let content = fs.readFileSync('src/components/Intro.tsx', 'utf8');

// 1. Move background out of scale-wrapper
const bgStart = content.indexOf('{/* Dynamic Background with Parallax on Ultra */}');
const bgEnd = content.indexOf('</div>', bgStart) + 6;

if (bgStart > -1) {
    const bgHtml = content.substring(bgStart, bgEnd);
    content = content.substring(0, bgStart) + content.substring(bgEnd); // remove it
    
    const newBgHtml = bgHtml.replace(
        'className="absolute inset-[-5%] z-10 pointer-events-none bg-cover bg-center bg-no-repeat transition-transform duration-200 ease-out"', 
        'className="fixed inset-[-5vw] z-0 pointer-events-none bg-cover bg-center bg-no-repeat transition-transform duration-200 ease-out w-[110vw] h-[110vh] max-w-none"'
    );
    
    const scaleWrapperMarker = 'id="scale-wrapper"';
    const scaleWrapperStart = content.lastIndexOf('<div', content.indexOf(scaleWrapperMarker));
    
    content = content.substring(0, scaleWrapperStart) + newBgHtml + '\n      ' + content.substring(scaleWrapperStart);
}

// 2. Move deep vignette out of scale-wrapper
const deepStart = content.indexOf('{/* Deep Vignette */}');
const deepEnd = content.indexOf('/>', deepStart) + 2;

if (deepStart > -1) {
    const deepHtml = content.substring(deepStart, deepEnd);
    content = content.substring(0, deepStart) + content.substring(deepEnd); // remove it
    
    const newDeepHtml = deepHtml.replace(
        'className="absolute inset-0 z-[15] pointer-events-none shadow-[inset_0_0_250px_rgba(0,0,0,0.95)]"',
        'className="fixed inset-0 z-[15] pointer-events-none shadow-[inset_0_0_250px_rgba(0,0,0,0.95)] w-full h-[100dvh]"'
    );
    
    const scaleWrapperMarker = 'id="scale-wrapper"';
    const scaleWrapperStart = content.lastIndexOf('<div', content.indexOf(scaleWrapperMarker));
    
    content = content.substring(0, scaleWrapperStart) + newDeepHtml + '\n      ' + content.substring(scaleWrapperStart);
}

fs.writeFileSync('src/components/Intro.tsx', content);
console.log('Done moving bg and deep vignette');
