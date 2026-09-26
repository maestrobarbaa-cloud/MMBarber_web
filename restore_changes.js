const fs = require('fs');

let content = fs.readFileSync('src/components/Intro.tsx', 'utf8');

// Restore left menu
const spacerMarker = '<div className="w-[350px] flex-none hidden md:block pointer-events-none"></div>';
const spacerIndex = content.indexOf(spacerMarker);
if (spacerIndex > -1) {
    const leftMenuStart = content.lastIndexOf('<div className={`fixed left-0 top-[50%] h-[1080px] w-[350px]', spacerIndex);
    if (leftMenuStart > -1) {
        let leftMenuEnd = content.indexOf('</button>', leftMenuStart);
        leftMenuEnd = content.indexOf('</div>', leftMenuEnd + 10);
        leftMenuEnd = content.indexOf('</div>', leftMenuEnd + 10);
        leftMenuEnd = content.indexOf('</div>', leftMenuEnd + 10) + 6; 
        
        let leftMenuHtml = content.substring(leftMenuStart, leftMenuEnd);
        content = content.substring(0, leftMenuStart) + content.substring(leftMenuEnd);
        
        leftMenuHtml = leftMenuHtml.replace(
            /className=\{\`fixed left-0 top-\[50%\] h-\[1080px\] w-\[350px\].*?origin: 'left center' \}\}/,
            "className={`w-[350px] flex-none flex flex-col items-center md:items-start justify-center px-4 md:px-10 z-30 relative ${isLiteTier ? 'bg-[#050505]' : 'bg-black/80 md:bg-black/60 md:backdrop-blur-sm'}`}"
        );
        
        const newSpacerIndex = content.indexOf(spacerMarker);
        content = content.substring(0, newSpacerIndex) + leftMenuHtml + content.substring(newSpacerIndex + spacerMarker.length);
    }
}

// Revert inset-[-30%] for dynamic background to inset-0
content = content.replace('className="absolute inset-[-30%] z-10 pointer-events-none bg-cover', 'className="absolute inset-[-5%] z-10 pointer-events-none bg-cover');

// Bring Global Vignette and Deep Vignette back into scale-wrapper
const atmosphereStart = content.indexOf('{/* VIGNETTE ATMOSPHERE');
if (atmosphereStart > -1) {
    const atmosphereEnd = content.indexOf('</div>', content.indexOf('</div>', atmosphereStart) + 10) + 6; // Two divs
    content = content.substring(0, atmosphereStart) + content.substring(atmosphereEnd);
}

// Now insert them properly inside scale-wrapper
const rightColMarker = '{/* Right Side: Details / Information */}';
const rightColStart = content.indexOf(rightColMarker);
if (rightColStart > -1) {
    const standardVignettes = `
        {/* Global Vignette / Shadows */}
        {!isLiteTier && (
          <>
            <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60 z-20 pointer-events-none mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-80 z-20 pointer-events-none mix-blend-multiply" />
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,1)_100%)] z-20 pointer-events-none" />
          </>
        )}
        
        {/* Deep Vignette */}
        {graphicsTier === 'ultra' && (
          <div className="absolute inset-0 z-[15] pointer-events-none shadow-[inset_0_0_250px_rgba(0,0,0,0.95)]" />
        )}
    `;
    
    content = content.substring(0, rightColStart) + standardVignettes + content.substring(rightColStart);
}

fs.writeFileSync('src/components/Intro.tsx', content);
console.log('Restored everything to standard scaling');
