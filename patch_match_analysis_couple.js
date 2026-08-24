const fs = require('fs');
const path = require('path');

const profileCardPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'ProfileCard.tsx');
let content = fs.readFileSync(profileCardPath, 'utf8');

const targetAccordion = `<AccordionSection title={lang === 'cs' ? 'Proč se k sobě hodíte' : 'Match Analysis'} icon={<Target size={16} />} defaultOpen={false}>`;
const newAccordionTitle = `<AccordionSection title={profile.accountType === 'couple' ? (lang === 'cs' ? 'Naše společné zájmy & Shoda' : 'Shared Interests & Match') : (lang === 'cs' ? 'Proč se k sobě hodíte' : 'Match Analysis')} icon={<Target size={16} />} defaultOpen={false}>`;

content = content.replace(targetAccordion, newAccordionTitle);

const targetScoreEnd = `<div className="flex-1 bg-black/40 h-2 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-mafia-gold transition-all duration-1000" style={{ width: \`\${matchScores.overall}%\` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}`;

const newScoreEndWithTags = `<div className="flex-1 bg-black/40 h-2 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-mafia-gold transition-all duration-1000" style={{ width: \`\${matchScores.overall}%\` }} />
                        </div>
                      </div>
                    </div>
                    {/* Společné zájmy pro páry */}
                    {profile.accountType === 'couple' && currentUserProfile && profile.interests && currentUserProfile.interests && (
                      <div className="mt-4 pt-4 border-t border-mafia-gold/20">
                        <h5 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-2">{lang === 'cs' ? 'Společné štítky a zájmy' : 'Shared Tags & Interests'}</h5>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests.filter(i => currentUserProfile.interests?.includes(i)).map((interest, idx) => (
                            <span key={idx} className="bg-mafia-gold/20 text-mafia-gold border border-mafia-gold/40 px-2 py-1 rounded-full text-xs font-mono uppercase shadow-[0_0_8px_rgba(197,160,89,0.2)]">
                              {interest}
                            </span>
                          ))}
                          {profile.interests.filter(i => currentUserProfile.interests?.includes(i)).length === 0 && (
                            <span className="text-white/40 text-xs font-mono uppercase">{lang === 'cs' ? 'Zatím žádné společné štítky' : 'No shared tags yet'}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}`;

content = content.replace(targetScoreEnd, newScoreEndWithTags);

fs.writeFileSync(profileCardPath, content);
console.log('Done patching Match Analysis for couples');
