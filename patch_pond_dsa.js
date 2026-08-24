const fs = require('fs');
const path = require('path');

const pondPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'Pond.tsx');
let content = fs.readFileSync(pondPath, 'utf8');

// 1. Add import
if (!content.includes('DsaTransparencyInfo')) {
  content = content.replace(
    /import \{ MatchVoucherCard, VoucherData \} from "\.\/MatchVoucherCard";/,
    `import { MatchVoucherCard, VoucherData } from "./MatchVoucherCard";\nimport { DsaTransparencyInfo } from "./DsaTransparencyInfo";`
  );
}

// 2. Add component to the end of the return statement
if (!content.includes('<DsaTransparencyInfo lang={lang} />')) {
  content = content.replace(
    /(\s*)<\/div>\n(\s*)<\/div>\n(\s*)<\/div>\n(\s*)<\/div>\n\s*\);\n\}/,
    (match, p1, p2, p3, p4) => {
      // Find the last few </div> tags before the component ends and inject the modal there
      return `${p1}</div>\n${p2}</div>\n${p3}</div>\n      <DsaTransparencyInfo lang={lang} />\n${p4}</div>\n  );\n}`;
    }
  );
}

fs.writeFileSync(pondPath, content);
console.log('Done modifying Pond.tsx');
