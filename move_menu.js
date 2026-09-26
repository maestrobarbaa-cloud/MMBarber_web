const fs = require('fs');
let content = fs.readFileSync('src/components/Intro.tsx', 'utf8');

const leftMenuStartStr = '{/* Left Side: Game Menu */}';
const rightColStartStr = '{/* Right Side: Details / Information */}';

const leftMenuStart = content.indexOf(leftMenuStartStr);
const rightColStart = content.indexOf(rightColStartStr);

if (leftMenuStart !== -1 && rightColStart !== -1) {
    let leftMenuBlock = content.slice(leftMenuStart, rightColStart);
    content = content.slice(0, leftMenuStart) + content.slice(rightColStart);

    leftMenuBlock = leftMenuBlock.replace(
        /className=\{`w-\[350px\] flex-none flex flex-col items-center md:items-start justify-center px-4 md:px-10 z-30 relative ([^`]+)`\}/,
        'className={`fixed left-0 top-[50%] h-[1080px] w-[350px] flex-none flex flex-col items-center md:items-start justify-center px-4 md:px-10 z-[60] $1`}\n          style={{ transform: `translate(0, -50%) scale(${Math.min((windowSize.width || (typeof window !== \\'undefined\\' ? window.innerWidth : 1920)) / 1920, (windowSize.height || (typeof window !== \\'undefined\\' ? window.innerHeight : 1080)) / 1080)})`, transformOrigin: \\'left center\\' }}'
    );

    const scaleWrapperStartStr = '<div \n        id="scale-wrapper"';
    const scaleWrapperStart = content.indexOf(scaleWrapperStartStr);
    
    if (scaleWrapperStart !== -1) {
        content = content.slice(0, scaleWrapperStart) + leftMenuBlock + '\n      ' + content.slice(scaleWrapperStart);
        fs.writeFileSync('src/components/Intro.tsx', content);
        console.log('Successfully moved the Left Menu outside the scale-wrapper.');
    } else {
        console.log('Could not find scale-wrapper.');
    }
} else {
    console.log('Could not find Left Menu or Right Col markers.');
}
