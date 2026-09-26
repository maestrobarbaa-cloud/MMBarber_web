const fs = require('fs');

let content = fs.readFileSync('src/components/Intro.tsx', 'utf8');

// 1. Move Global Vignette out of scale-wrapper
const globalVignetteMarker = '{/* Global Vignette / Shadows */}';
const globalVignetteStart = content.indexOf(globalVignetteMarker);
if (globalVignetteStart > -1) {
    const globalVignetteEnd = content.indexOf(')}', globalVignetteStart) + 2;
    let vignetteHtml = content.substring(globalVignetteStart, globalVignetteEnd);
    
    // Convert absolute inset-[-30%] to fixed inset-0
    vignetteHtml = vignetteHtml.replace(/absolute inset-\[-30%\]/g, 'fixed inset-0');
    vignetteHtml = vignetteHtml.replace(/absolute inset-0/g, 'fixed inset-0');
    
    content = content.substring(0, globalVignetteStart) + content.substring(globalVignetteEnd);
    
    const scaleWrapperMarker = 'id="scale-wrapper"';
    const scaleWrapperStart = content.lastIndexOf('<div', content.indexOf(scaleWrapperMarker));
    
    content = content.substring(0, scaleWrapperStart) + vignetteHtml + '\n      ' + content.substring(scaleWrapperStart);
}

// 2. Move Deep Vignette out of scale-wrapper
const deepVignetteMarker = '{/* Deep Vignette */}';
const deepVignetteStart = content.indexOf(deepVignetteMarker);
if (deepVignetteStart > -1) {
    const deepVignetteEnd = content.indexOf('/>', deepVignetteStart) + 2;
    let deepHtml = content.substring(deepVignetteStart, deepVignetteEnd);
    
    // Convert absolute inset-[-30%] to fixed inset-0
    deepHtml = deepHtml.replace('absolute inset-[-30%]', 'fixed inset-0 w-full h-[100dvh]');
    deepHtml = deepHtml.replace('absolute inset-0', 'fixed inset-0 w-full h-[100dvh]');
    
    content = content.substring(0, deepVignetteStart) + content.substring(deepVignetteEnd);
    
    const scaleWrapperMarker = 'id="scale-wrapper"';
    const scaleWrapperStart = content.lastIndexOf('<div', content.indexOf(scaleWrapperMarker));
    
    content = content.substring(0, scaleWrapperStart) + deepHtml + '\n      ' + content.substring(scaleWrapperStart);
}

fs.writeFileSync('src/components/Intro.tsx', content);
console.log('Fixed atmospheric elements');
