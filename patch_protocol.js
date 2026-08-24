const fs = require('fs');
const path = require('path');

const setupPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'ProfileSetupSteps.tsx');
let content = fs.readFileSync(setupPath, 'utf8');

// Update useState for agreed to have 5 booleans instead of 3
content = content.replace(
  /const \[agreed, setAgreed\] = useState\(\[\s*formData\.protocolAgreed \|\| false,\s*formData\.protocolAgreed \|\| false,\s*formData\.protocolAgreed \|\| false\s*\]\);/g,
  `const [agreed, setAgreed] = useState([
    formData.protocolAgreed || false, 
    formData.protocolAgreed || false, 
    formData.protocolAgreed || false,
    formData.protocolAgreed || false,
    formData.protocolAgreed || false
  ]);`
);

// Add the two new labels
const newConditions = `
          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="mt-1 w-4 h-4 rounded border-white/20 bg-black/50 checked:bg-mafia-gold checked:border-mafia-gold focus:ring-mafia-gold"
              checked={agreed[3]}
              onChange={(e) => handleCheck(3, e.target.checked)}
            />
            <div className="flex-1">
              <span className="block text-sm font-bold text-white group-hover:text-mafia-gold transition-colors">Mluvím pravdu o své osobě</span>
              <span className="block text-[10px] font-mono text-white/50">Zavazuji se, že uvádím o sobě pravdu, nezatajuji důležité skutečnosti a nesnažím se působit jako někdo jiný.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="mt-1 w-4 h-4 rounded border-white/20 bg-black/50 checked:bg-mafia-gold checked:border-mafia-gold focus:ring-mafia-gold"
              checked={agreed[4]}
              onChange={(e) => handleCheck(4, e.target.checked)}
            />
            <div className="flex-1">
              <span className="block text-sm font-bold text-white group-hover:text-mafia-gold transition-colors">Hodnotím ostatní férově a pravdivě</span>
              <span className="block text-[10px] font-mono text-white/50">Nebudu nikoho hodnotit ukřivděně či mstivě. Svá hodnocení zakládám na pravdě, i co se týče historie. Za svým slovem si stojím.</span>
            </div>
          </label>
        </div>`;

content = content.replace(
  /<\/label>\s*<\/div>/g,
  `</label>\n${newConditions}`
);

fs.writeFileSync(setupPath, content);
console.log('Done modifying ProfileSetupSteps.tsx');
