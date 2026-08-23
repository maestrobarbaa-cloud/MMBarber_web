const fs = require('fs');

let code = fs.readFileSync('ProfileSetup.tsx', 'utf8');

const regex = /<select\s+value=\{([^}]+)\}\s+onChange=\{\(e\) => ([^}]*?)e\.target\.value([^}]*?)\}\s+className="[^"]+"\s*>\s*<option value="">\{([^}]+)\}<\/option>\s*\{\[([^\]]+)\]\.map\(t => \(\s*<option key=\{t\} value=\{t\}>\{t\}<\/option>\s*\)\)\}\s*<\/select>/g;

let match;
let matchCount = 0;
code = code.replace(regex, (match, valueExpr, onChangePrefix, onChangeSuffix, placeholderExpr, arrayContent) => {
    matchCount++;
    return `<CustomSelect
                        value={${valueExpr}}
                        onChange={(val) => ${onChangePrefix}val${onChangeSuffix}}
                        placeholder={${placeholderExpr}}
                        options={[${arrayContent}].map(t => ({ value: t, label: t }))}
                      />`;
});

fs.writeFileSync('ProfileSetup.tsx', code);
console.log(`Replaced ${matchCount} standard selects with CustomSelect`);
