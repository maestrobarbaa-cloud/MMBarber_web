const fs = require('fs');
const path = require('path');

const pondPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'Pond.tsx');
let content = fs.readFileSync(pondPath, 'utf8');

// 1. Add import
if (!content.includes('LegalHubModal')) {
  content = content.replace(
    /import \{ DsaTransparencyInfo \} from "\.\/DsaTransparencyInfo";/,
    `import { DsaTransparencyInfo } from "./DsaTransparencyInfo";\nimport { LegalHubModal } from "./LegalHubModal";`
  );
}

// 2. Add state for the modal
if (!content.includes('isLegalHubOpen')) {
  content = content.replace(
    /const \[dragStartPos, setDragStartPos\] = useState<\(\[number, number\]\) \| null>\(null\);/,
    `const [dragStartPos, setDragStartPos] = useState<([number, number]) | null>(null);\n  const [isLegalHubOpen, setIsLegalHubOpen] = useState(false);`
  );
}

// 3. Add button next to DsaTransparencyInfo
// The DSA transparency info is currently a floating button. We'll group them.
// Let's first remove the DsaTransparencyInfo from where we injected it before:
//    <DsaTransparencyInfo lang={lang} />
// We'll replace it with a container that holds both buttons, or we just render them side-by-side. 
// Actually, `DsaTransparencyInfo` renders its own floating button. We can't group them easily unless we modify `DsaTransparencyInfo`.
// Let's just render a new floating button for Legal Hub right above the DSA button or left of it.
// The DSA button is `fixed bottom-4 right-4`. We can put the Legal button at `fixed bottom-4 right-20`.

const legalButton = `
      {/* Legal & Security Hub Button */}
      <button 
        onClick={() => setIsLegalHubOpen(true)}
        className="fixed bottom-4 right-20 z-50 p-3 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full text-white/50 hover:text-white transition-all shadow-lg backdrop-blur-md"
        title={lang === 'cs' ? 'Právní a bezpečnostní informace (VOP, GDPR)' : 'Legal & Security (ToS, GDPR)'}
      >
        <ShieldCheck size={20} />
      </button>

      <LegalHubModal 
        isOpen={isLegalHubOpen}
        onClose={() => setIsLegalHubOpen(false)}
      />
`;

if (!content.includes('<LegalHubModal')) {
  content = content.replace(
    /<DsaTransparencyInfo lang=\{lang\} \/>/,
    `<DsaTransparencyInfo lang={lang} />\n${legalButton}`
  );
}

fs.writeFileSync(pondPath, content);
console.log('Done integrating LegalHubModal into Pond.tsx');
