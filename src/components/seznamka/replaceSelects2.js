const fs = require('fs');

let code = fs.readFileSync('ProfileSetup.tsx', 'utf8');

const regex = /<select[\s\S]*?value=\{([^}]+)\}[\s\S]*?onChange=\{\(e\) => ([^}]*?)e\.target\.value([^}]*?)\}[\s\S]*?<option value="">\{([^}]+)\}<\/option>\s*\{\[([^\]]+)\]\.map\(t => \([\s\S]*?<\/select>/g;

let matchCount = 0;
code = code.replace(regex, (match, valueExpr, onChangePrefix, onChangeSuffix, placeholderExpr, arrayContent) => {
    matchCount++;
    return `<CustomSelect
                        value={${valueExpr.trim()}}
                        onChange={(val) => ${onChangePrefix.trim()}val${onChangeSuffix.trim()}}
                        placeholder={${placeholderExpr.trim()}}
                        options={[${arrayContent.trim()}].map(t => ({ value: t, label: t }))}
                      />`;
});

fs.writeFileSync('ProfileSetup.tsx', code);
console.log(`Replaced ${matchCount} standard selects with CustomSelect`);
