const fs = require('fs');
const path = require('path');

const userSettingsPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'UserSettings.tsx');
let content = fs.readFileSync(userSettingsPath, 'utf8');

const targetAccountTabStart = `{activeTab === 'account' && (
                <motion.div key="account" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                  <h4 className="font-heading font-black text-red-500 uppercase tracking-widest text-sm mb-4 border-b border-red-500/20 pb-2 flex items-center gap-2">`;

const newSubProfileSection = `{activeTab === 'account' && (
                <motion.div key="account" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                  
                  {/* Create Sub-profiles */}
                  <div className="mb-8">
                    <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                      <UserCog size={16} /> {lang === 'cs' ? 'Spravovat a Vytvořit Profily' : 'Manage & Create Profiles'}
                    </h4>
                    <p className="text-white/50 text-[10px] font-mono leading-relaxed max-w-sm mb-4">
                      {lang === 'cs' ? 'Přidejte si k účtu další specializované profily (např. rodinný účet nebo profil vašeho mazlíčka).' : 'Add specialized profiles to your account (e.g. family or pet profile).'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button className="p-4 bg-blue-900/10 border border-blue-500/30 rounded-xl hover:bg-blue-900/30 hover:border-blue-500 transition-all text-left group">
                        <Users size={20} className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-white font-bold text-xs uppercase tracking-widest mb-1">{lang === 'cs' ? 'Vytvořit Skupinu / Pár' : 'Create Group / Couple'}</div>
                      </button>
                      
                      <button className="p-4 bg-purple-900/10 border border-purple-500/30 rounded-xl hover:bg-purple-900/30 hover:border-purple-500 transition-all text-left group">
                        <Users size={20} className="text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-white font-bold text-xs uppercase tracking-widest mb-1">{lang === 'cs' ? 'Vytvořit Rodinu' : 'Create Family'}</div>
                      </button>

                      <button className="p-4 bg-yellow-900/10 border border-yellow-500/30 rounded-xl hover:bg-yellow-900/30 hover:border-yellow-500 transition-all text-left group">
                        <PawPrint size={20} className="text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-white font-bold text-xs uppercase tracking-widest mb-1">{lang === 'cs' ? 'Vytvořit Profil Zvířete' : 'Create Pet Profile'}</div>
                      </button>
                    </div>
                  </div>

                  <h4 className="font-heading font-black text-red-500 uppercase tracking-widest text-sm mb-4 border-b border-red-500/20 pb-2 flex items-center gap-2">`;

content = content.replace(targetAccountTabStart, newSubProfileSection);

// Also need to add PawPrint icon import if it's missing
if (!content.includes('PawPrint')) {
  content = content.replace('import { UserCog', 'import { UserCog, PawPrint');
}

fs.writeFileSync(userSettingsPath, content);
console.log('Done patching UserSettings.tsx');
