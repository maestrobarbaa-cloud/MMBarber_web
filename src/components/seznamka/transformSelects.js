const fs = require('fs');
let code = fs.readFileSync('ProfileSetup.tsx', 'utf8');

// 1. Fix buttons
code = code.replace(/<button\s+onClick=\{\(\) => setActiveQuiz/g, '<button type="button" onClick={() => setActiveQuiz');

// 2. Fix mapped selects
const regex = /<select[\s\S]*?value=\{([^}]+)\}[\s\S]*?onChange=\{\(e\) => ([^}]*?)e\.target\.value([^}]*?)\}[\s\S]*?<option value="">\{([^}]+)\}<\/option>\s*\{\[([^\]]+)\]\.map\(t => \([\s\S]*?<\/select>/g;
code = code.replace(regex, (match, valueExpr, onChangePrefix, onChangeSuffix, placeholderExpr, arrayContent) => {
    return `<CustomSelect
                        value={${valueExpr.trim()}}
                        onChange={(val) => ${onChangePrefix.trim()}val${onChangeSuffix.trim()}}
                        placeholder={${placeholderExpr.trim()}}
                        options={[${arrayContent.trim()}].map(t => ({ value: t, label: t }))}
                      />`;
});

// 3. Fix Mindset
const mindsetTarget = `<select value={formData.mindset || ""} onChange={(e) => setFormData({...formData, mindset: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none">
                        <option value="">{lang === 'cs' ? 'Vyber...' : 'Select...'}</option>
                        <option value="Fixed Mindset">Fixed Mindset</option>
                        <option value="Growth Mindset">Growth Mindset</option>
                      </select>`;
const mindsetReplace = `<CustomSelect 
                        value={formData.mindset || ""} 
                        onChange={(val) => setFormData({...formData, mindset: val})} 
                        placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'}
                        options={[
                          { value: "Fixed Mindset", label: "Fixed Mindset" },
                          { value: "Growth Mindset", label: "Growth Mindset" }
                        ]}
                      />`;
code = code.replace(mindsetTarget, mindsetReplace);

// 4. Fix Ex Friendship
const exTarget = `<select value={formData.exFriendship || ""} onChange={(e) => setFormData({...formData, exFriendship: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none">
                        <option value="">{lang === 'cs' ? 'Vyber...' : 'Select...'}</option>
                        <option value="Zcela v pohodě">Zcela v pohodě</option>
                        <option value="Jen známí">Jen známí</option>
                        <option value="Absolutní ne">Absolutní ne</option>
                      </select>`;
const exReplace = `<CustomSelect 
                        value={formData.exFriendship || ""} 
                        onChange={(val) => setFormData({...formData, exFriendship: val})} 
                        placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'}
                        options={[
                          { value: "Zcela v pohodě", label: "Zcela v pohodě" },
                          { value: "Jen známí", label: "Jen známí" },
                          { value: "Absolutní ne", label: "Absolutní ne" }
                        ]}
                      />`;
code = code.replace(exTarget, exReplace);

// 5. Fix Privacy
const privacyTarget = `<select value={formData.privacyLevel || ""} onChange={(e) => setFormData({...formData, privacyLevel: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none">
                        <option value="">{lang === 'cs' ? 'Vyber...' : 'Select...'}</option>
                        <option value="Otevřená kniha (známe hesla)">Otevřená kniha</option>
                        <option value="Absolutní soukromí">Absolutní soukromí</option>
                      </select>`;
const privacyReplace = `<CustomSelect 
                        value={formData.privacyLevel || ""} 
                        onChange={(val) => setFormData({...formData, privacyLevel: val})} 
                        placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'}
                        options={[
                          { value: "Otevřená kniha (známe hesla)", label: "Otevřená kniha" },
                          { value: "Absolutní soukromí", label: "Absolutní soukromí" }
                        ]}
                      />`;
code = code.replace(privacyTarget, privacyReplace);

fs.writeFileSync('ProfileSetup.tsx', code);
console.log('Successfully fully transformed ProfileSetup.tsx!');
