const fs = require('fs');

let content = fs.readFileSync('src/components/TomasSkillTree.bak.tsx', 'utf8');

// 1. Add props to interface
content = content.replace(
  `export function TomasSkillTree({ \n  totalCollected, \n  lang \n}: { \n  totalCollected: number;\n  lang: string;\n}) {`,
  `export function TomasSkillTree({ \n  totalCollected, \n  lang,\n  isBloodMode = false,\n  isNoirMode = false\n}: { \n  totalCollected: number;\n  lang: string;\n  isBloodMode?: boolean;\n  isNoirMode?: boolean;\n}) {`
);

// 2. Add dynamic variables at the start of the component
content = content.replace(
  `  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);`,
  `  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);\n  const primaryColorHex = isBloodMode ? '200,16,46' : isNoirMode ? '255,255,255' : '197,160,89';\n  const tc = isBloodMode ? 'text-mafia-red' : isNoirMode ? 'text-white' : 'text-mafia-gold';\n  const bc = isBloodMode ? 'border-mafia-red' : isNoirMode ? 'border-white' : 'border-mafia-gold';\n  const bgc = isBloodMode ? 'bg-mafia-red' : isNoirMode ? 'bg-white' : 'bg-mafia-gold';\n  const rc = isBloodMode ? 'ring-mafia-red' : isNoirMode ? 'ring-white' : 'ring-mafia-gold';\n  const shadowColor = isBloodMode ? 'rgba(200,16,46,0.8)' : isNoirMode ? 'rgba(255,255,255,0.8)' : 'rgba(197,160,89,0.8)';`
);

// Background and Grid
content = content.replace(
  `backgroundImage: "radial-gradient(circle at center, rgba(197,160,89,0.25) 0%, transparent 70%)",`,
  `backgroundImage: \`radial-gradient(circle at center, rgba(\${primaryColorHex},0.25) 0%, transparent 70%)\`,`
);
content = content.replace(
  `bg-[linear-gradient(rgba(197,160,89,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.2)_1px,transparent_1px)] bg-[size:40px_40px]`,
  `bg-[url('/images/noise.png')] opacity-[0.15] mix-blend-overlay`
);
// Added tactical grid
content = content.replace(
  `{/* Grid pattern */}`,
  `{/* Grid pattern */}\n        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: \`linear-gradient(rgba(\${primaryColorHex},1) 1px, transparent 1px), linear-gradient(90deg, rgba(\${primaryColorHex},1) 1px, transparent 1px)\`, backgroundSize: '40px 40px' }}></div>`
);

// Texts and components outside literals
content = content.replace(/text-mafia-gold font-heading/g, `\${tc} font-heading`);
content = content.replace(/shadow-\[0_0_15px_rgba\(197,160,89,0\.8\)\]/g, `shadow-[0_0_15px_\${shadowColor}]`);
content = content.replace(/text-mafia-gold font-bold/g, `\${tc} font-bold`);
content = content.replace(/bg-mafia-gold transition-all duration-1000 shadow-\[0_0_10px_rgba\(197,160,89,0\.8\)\]/g, `\${bgc} transition-all duration-1000 shadow-[0_0_10px_\${shadowColor}]`);

// Connection Lines Canvas
content = content.replace(/rgba\(197,160,89,0\.6\)/g, `\${primaryColorHex},0.6`);
content = content.replace(/"rgba\(197,160,89,0\.8\)"/g, `\`rgba(\${primaryColorHex},0.8)\``);
content = content.replace(/"rgba\(197,160,89,0\.4\)"/g, `\`rgba(\${primaryColorHex},0.4)\``);

// Nodes logic
content = content.replace(
  `nodeClass = \`bg-black border-mafia-gold \${currentLevel > 1 ? 'text-white' : 'text-mafia-gold'}\`;`,
  `nodeClass = \`bg-black \${bc} \${currentLevel > 1 ? 'text-white' : tc}\`;`
);
content = content.replace(
  `glowEffect = \`shadow-[\${glowStrength}_rgba(197,160,89,0.8)] inset-shadow-[0_0_10px_rgba(197,160,89,0.5)]\`;`,
  `glowEffect = \`shadow-[\${glowStrength}_rgba(\${primaryColorHex},0.8)] inset-shadow-[0_0_10px_rgba(\${primaryColorHex},0.5)]\`;`
);
content = content.replace(
  `nodeClass = "bg-black text-white/80 border-mafia-gold/50 border-dashed animate-pulse hover:border-mafia-gold hover:bg-mafia-gold/10";`,
  `nodeClass = \`bg-black text-white/80 \${bc}/50 border-dashed animate-pulse hover:\${bc} hover:\${bgc}/10\`;`
);
content = content.replace(
  `glowEffect = "shadow-[0_0_10px_rgba(197,160,89,0.3)]";`,
  `glowEffect = \`shadow-[0_0_10px_rgba(\${primaryColorHex},0.3)]\`;`
);

// Shape of nodes - fixed backticks mapping
content = content.replace(
  `className={\`w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 \${nodeClass} \${glowEffect} \${isSelected ? 'ring-4 ring-mafia-gold/40 scale-110' : 'hover:scale-105'} \${isMaxed ? 'bg-mafia-gold/20' : ''}\`}`,
  `className={\`w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rotate-45 border-[2px] shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-300 \${nodeClass} \${glowEffect} \${isSelected ? \`ring-4 \${rc}/40 scale-110\` : 'hover:scale-105'} \${isMaxed ? \`\${bgc}/20\` : ''}\`}`
);
content = content.replace(
  `<node.icon size={isUnlocked ? 32 : 28} className={isUnlocked ? "drop-shadow-[0_0_8px_rgba(197,160,89,0.9)]" : ""} />`,
  `<div className="-rotate-45 flex items-center justify-center"><node.icon size={isUnlocked ? 32 : 28} className={isUnlocked ? \`drop-shadow-[0_0_8px_rgba(\${primaryColorHex},0.9)]\` : ""} /></div>`
);
content = content.replace(
  `border-mafia-gold text-mafia-gold`,
  `\${bc} \${tc}`
);
content = content.replace(
  `bg-mafia-gold/20`,
  `\${bgc}/20`
);
content = content.replace(
  `group-hover:text-mafia-gold`,
  `group-hover:\${tc}`
);

// Upgrade Button
content = content.replace(
  `'bg-mafia-gold text-black hover:bg-white hover:scale-[1.02] shadow-[0_0_20px_rgba(197,160,89,0.4)]'`,
  `\`\${bgc} text-black hover:bg-white hover:scale-[1.02] shadow-[0_0_20px_rgba(\${primaryColorHex},0.4)]\``
);

// Sidebar Dossier aesthetic
content = content.replace(
  `border-mafia-gold/60`,
  `\${bc}/60`
);
content = content.replace(
  `hover:text-mafia-gold`,
  `hover:\${tc}`
);
content = content.replace(
  `hover:border-mafia-gold/30`,
  `hover:\${bc}/30`
);
content = content.replace(
  `bg-mafia-gold/10 border-mafia-gold text-mafia-gold shadow-[0_0_30px_rgba(197,160,89,0.5)]`,
  `\${bgc}/10 \${bc} \${tc} shadow-[0_0_30px_rgba(\${primaryColorHex},0.5)]`
);
content = content.replace(
  `drop-shadow-[0_0_15px_rgba(197,160,89,0.9)]`,
  `drop-shadow-[0_0_15px_rgba(\${primaryColorHex},0.9)]`
);
content = content.replace(
  `text-mafia-gold text-shadow-md`,
  `\${tc} drop-shadow-md`
);
content = content.replace(
  `bg-gradient-to-r from-mafia-gold/60 via-mafia-gold/20`,
  `bg-gradient-to-r from-\${bgc.replace('bg-','')}/60 via-\${bgc.replace('bg-','')}/20`
);
content = content.replace(
  `text-mafia-gold/60`,
  `\${tc}/60`
);
content = content.replace(
  `border-mafia-gold/80 bg-mafia-gold/5`,
  `\${bc}/80 \${bgc}/5`
);
content = content.replace(
  `bg-mafia-gold/15`,
  `\${bgc}/15`
);
content = content.replace(
  `border-mafia-gold/40`,
  `\${bc}/40`
);
content = content.replace(
  `rgba(197,160,89,0.2)`,
  `rgba(\${primaryColorHex},0.2)`
);

// Add Top Secret stamp in the sidebar
content = content.replace(
  `{/* Ikona a Header */}`,
  `{/* Dossier Header */}\n                 <div className="flex justify-between items-start w-full opacity-60 pointer-events-none mb-4">\n                    <span className={\`font-heading text-4xl \${tc} border-4 \${bc} px-2 py-1 rotate-[-5deg] inline-block\`}>DOSSIER</span>\n                 </div>\n\n                 {/* Ikona a Header */}`
);

fs.writeFileSync('src/components/TomasSkillTree.tsx', content, 'utf8');
console.log("Done");
