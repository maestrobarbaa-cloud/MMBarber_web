const fs = require('fs');
const path = require('path');

const pondPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'Pond.tsx');
let content = fs.readFileSync(pondPath, 'utf8');

// We need to add state for DsaTransparencyInfo if it doesn't exist.
if (!content.includes('isDsaInfoOpen')) {
  content = content.replace(
    /const \[isLegalHubOpen, setIsLegalHubOpen\] = useState\(false\);/,
    `const [isLegalHubOpen, setIsLegalHubOpen] = useState(false);\n  const [isDsaInfoOpen, setIsDsaInfoOpen] = useState(false);`
  );
}

// Find the section where I injected the buttons and modals previously
const oldInjectionRegex = /<DsaTransparencyInfo lang=\{lang\} \/>[\s\S]*?<LegalHubModal[\s\S]*?onClose=\{[^}]*\}\s*\/>/m;

// Replace it with the new footer and modals
const newInjection = `
      {/* Legal & Transparency Footer */}
      <div className="w-full mt-auto pt-12 pb-6 flex flex-col items-center justify-center gap-2 border-t border-white/5 relative z-10">
        <div className="flex flex-wrap justify-center gap-4 text-xs font-mono tracking-widest uppercase">
          <button 
            onClick={() => setIsLegalHubOpen(true)}
            className="text-white/40 hover:text-mafia-gold transition-colors flex items-center gap-2"
          >
            <ShieldCheck size={14} />
            {lang === 'cs' ? 'Právní & Soukromí (VOP, GDPR)' : 'Legal & Privacy (ToS, GDPR)'}
          </button>
          <span className="text-white/20">|</span>
          <button 
            onClick={() => setIsDsaInfoOpen(true)}
            className="text-white/40 hover:text-mafia-gold transition-colors flex items-center gap-2"
          >
            <Scale size={14} />
            {lang === 'cs' ? 'Transparentnost & DSA' : 'Transparency & DSA'}
          </button>
        </div>
        <div className="text-[10px] text-white/20 font-mono">
          © 2026 MMBarber Seznamka. All rights reserved.
        </div>
      </div>

      <DsaTransparencyInfo 
        lang={lang} 
        isOpen={isDsaInfoOpen}
        onClose={() => setIsDsaInfoOpen(false)}
      />

      <LegalHubModal 
        isOpen={isLegalHubOpen}
        onClose={() => setIsLegalHubOpen(false)}
      />
`;

content = content.replace(oldInjectionRegex, newInjection);

fs.writeFileSync(pondPath, content);
console.log('Done integrating footer into Pond.tsx');
