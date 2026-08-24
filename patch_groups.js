const fs = require('fs');
const path = require('path');

const profileCardPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'ProfileCard.tsx');
let content = fs.readFileSync(profileCardPath, 'utf8');

const targetAccordion1 = `<AccordionSection title={lang === 'cs' ? 'O mně & Vibe' : 'About & Vibe'} icon={<MessageCircleHeart size={16} />} defaultOpen={false}>`;
const newAccordion1 = `        <AccordionSection title={['couple', 'group', 'family'].includes(profile.accountType || '') ? (lang === 'cs' ? 'O nás & Vibe' : 'About Us & Vibe') : (lang === 'cs' ? 'O mně & Vibe' : 'About Me & Vibe')} icon={<MessageCircleHeart size={16} />} defaultOpen={false}>`;
content = content.replace(targetAccordion1, newAccordion1);

const targetLabel = `<h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-2">O mně</h4>`;
const newLabel = `<h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-2">{['couple', 'group', 'family'].includes(profile.accountType || '') ? 'O nás' : 'O mně'}</h4>`;
content = content.replace(targetLabel, newLabel);

const targetInsertBeforeAccordion = `        <AccordionSection title={lang === 'cs' ? 'Proč se k sobě hodíte' : 'Match Analysis'} icon={<Target size={16} />} defaultOpen={false}>`;
const newGroupMembersSection = `        {/* Group / Community Members */}
        {['group', 'couple', 'family', 'property'].includes(profile.accountType || '') && (
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-black text-white tracking-widest uppercase">{lang === 'cs' ? 'Členové' : 'Members'}</h3>
              {profile.accountType !== 'couple' && (
                <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] uppercase tracking-widest rounded-md transition-colors shadow-[0_0_10px_rgba(37,99,235,0.4)]">
                  {lang === 'cs' ? 'Přidat se' : 'Join'}
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {profile.members && profile.members.length > 0 ? (
                profile.members.map((member, idx) => (
                  <div key={idx} className="relative group cursor-pointer aspect-square rounded-md overflow-hidden border border-white/10 hover:border-mafia-gold transition-colors">
                    <img src={'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'} alt={member.name} className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                      <span className="text-[8px] font-mono text-white truncate w-full text-center">{member.name}</span>
                    </div>
                  </div>
                ))
              ) : (
                /* Mock Members for visualization */
                [...Array(6)].map((_, idx) => (
                  <div key={idx} className="relative group cursor-pointer aspect-square rounded-md overflow-hidden border border-white/10 hover:border-mafia-gold transition-colors">
                    <img src={\`https://i.pravatar.cc/100?img=\${idx + 10}\`} alt="Member" className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                      <span className="text-[8px] font-mono text-white truncate w-full text-center">Member {idx + 1}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <AccordionSection title={lang === 'cs' ? 'Proč se k sobě hodíte' : 'Match Analysis'} icon={<Target size={16} />} defaultOpen={false}>`;
content = content.replace(targetInsertBeforeAccordion, newGroupMembersSection);

fs.writeFileSync(profileCardPath, content);
console.log('Done patching ProfileCard.tsx for groups');
