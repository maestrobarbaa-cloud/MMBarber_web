const fs = require('fs');

const content = fs.readFileSync('src/components/Intro.tsx', 'utf8');

const leftMenuMarker = '{/* Left Side: Game Menu */}';
const rightColMarker = '{/* Right Side: Details / Information */}';
const scaleWrapperMarker = 'id="scale-wrapper"';

const leftMenuStart = content.indexOf(leftMenuMarker);
const rightColStart = content.indexOf(rightColMarker);
const scaleWrapperIdIndex = content.indexOf(scaleWrapperMarker);
const scaleWrapperStart = content.lastIndexOf('<div', scaleWrapperIdIndex);

if (leftMenuStart > -1 && rightColStart > -1 && scaleWrapperStart > -1) {
    const leftMenuHtml = content.substring(leftMenuStart, rightColStart);
    
    // Remove left menu from inside wrapper
    let newContent = content.substring(0, leftMenuStart) + content.substring(rightColStart);
    
    // Modify left menu html
    const oldClass = "className={`w-[350px] flex-none flex flex-col items-center md:items-start justify-center px-4 md:px-10 z-30 relative ${isLiteTier ? 'bg-[#050505]' : 'bg-black/60 md:backdrop-blur-sm border-r border-mafia-gold/10'}`}";
    const newClass = "className={`fixed left-0 top-[50%] h-[1080px] w-[350px] flex-none flex flex-col items-center md:items-start justify-center px-4 md:px-10 z-[60] ${isLiteTier ? 'bg-[#050505]' : 'bg-black/60 md:backdrop-blur-sm border-r border-mafia-gold/10'}`} style={{ transform: `translate(0, -50%) scale(${Math.min((windowSize.width || (typeof window !== 'undefined' ? window.innerWidth : 1920)) / 1920, (windowSize.height || (typeof window !== 'undefined' ? window.innerHeight : 1080)) / 1080)})`, transformOrigin: 'left center' }}";
    
    const modifiedLeftMenu = leftMenuHtml.replace(oldClass, newClass);
    
    // Insert before scale-wrapper
    const newScaleWrapperIdIndex = newContent.indexOf(scaleWrapperMarker);
    const newScaleWrapperStart = newContent.lastIndexOf('<div', newScaleWrapperIdIndex);
    
    newContent = newContent.substring(0, newScaleWrapperStart) + modifiedLeftMenu + '\n      ' + newContent.substring(newScaleWrapperStart);
    
    fs.writeFileSync('src/components/Intro.tsx', newContent);
    console.log("SUCCESS");
} else {
    console.log("FAILED TO FIND MARKERS");
}
