const fs = require('fs');
let content = fs.readFileSync('src/components/Intro.tsx', 'utf8');

// Find Deep Vignette outside scale-wrapper
const deepStart = content.indexOf('{/* Deep Vignette */}');
if (deepStart > -1) {
    const deepEnd = content.indexOf('/>', deepStart) + 2;
    content = content.substring(0, deepStart) + content.substring(deepEnd); // remove it
    
    // Find Ultra Graphics Only Premium Effects inside scale-wrapper
    const ultraEffectsStart = content.indexOf('{/* Ultra Graphics Only Premium Effects */}');
    const ultraEffectsBlock = content.indexOf('<>', ultraEffectsStart);
    
    if (ultraEffectsBlock > -1) {
        const replacement = '\n            {/* Deep Vignette */}\n            <div className="absolute inset-0 z-[15] pointer-events-none shadow-[inset_0_0_250px_rgba(0,0,0,0.95)]" />';
        content = content.substring(0, ultraEffectsBlock + 2) + replacement + content.substring(ultraEffectsBlock + 2);
    }
}

fs.writeFileSync('src/components/Intro.tsx', content);
console.log('Restored Deep Vignette to scale-wrapper');
