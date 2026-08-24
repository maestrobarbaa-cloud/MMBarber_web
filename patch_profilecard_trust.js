const fs = require('fs');
const path = require('path');

const profileCardPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'ProfileCard.tsx');
let content = fs.readFileSync(profileCardPath, 'utf8');

const oldTrustScore = `                {/* Trust Score */}
                {(profile.trustScore !== undefined || profile.trustEndorsements !== undefined) && (
                  <div className="flex items-center gap-1.5 bg-blue-900/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-blue-500/50" title="Skóre důvěryhodnosti">
                    <ShieldCheck size={10} className="text-blue-400" />
                    <span className="text-blue-400 text-[9px] font-mono uppercase font-bold tracking-widest">
                      TRUST {profile.trustScore || 0}% ({endorsements})
                    </span>
                  </div>
                )}`;

const newTrustScore = `${oldTrustScore}

                {/* Trusted Ratings Count */}
                {profile.trustedRatingsReceived !== undefined && profile.trustedRatingsReceived > 0 && (
                  <div className="flex items-center gap-1.5 bg-yellow-900/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-yellow-500/50" title={lang === 'cs' ? 'Hodnocení od uživatelů se závazkem protokolu' : 'Trusted ratings from verified users'}>
                    <ShieldCheck size={10} className="text-mafia-gold fill-mafia-gold/20" />
                    <span className="text-mafia-gold text-[9px] font-mono uppercase font-bold tracking-widest">
                      {profile.trustedRatingsReceived} {lang === 'cs' ? 'Férových Hodnocení' : 'Fair Ratings'}
                    </span>
                  </div>
                )}`;

content = content.replace(oldTrustScore, newTrustScore);

// Add the explanation to the TrustScore & Safety section in renderDetails
// I will search for "Míra Důvěry (Skóre)"
const explanationRegex = /(<h4 className="text-\[10px\] font-mono text-white\/50 uppercase tracking-widest">\{lang === 'cs' \? 'Míra Důvěry \(Skóre\)' : 'Trust Score'\}<\/h4>\s*<p className="text-sm font-bold text-white mt-1">\{profile\.trustScore \|\| 0\}%<\/p>\s*<\/div>)/;

const newExplanation = `$1
                {profile.trustedRatingsReceived !== undefined && profile.trustedRatingsReceived > 0 && (
                  <div className="mt-4 p-3 bg-yellow-900/10 border border-mafia-gold/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck size={14} className="text-mafia-gold" />
                      <h4 className="text-xs font-bold text-mafia-gold uppercase tracking-widest">{profile.trustedRatingsReceived} {lang === 'cs' ? 'Férových Hodnocení' : 'Fair Ratings'}</h4>
                    </div>
                    <p className="text-[10px] font-mono text-white/50">{lang === 'cs' ? 'Tato hodnocení pochází od uživatelů, kteří podepsali Závazek Protokolu (ručí za pravdomluvnost a férovost hodnocení).' : 'These ratings come from users who signed the Trust Protocol (guaranteeing honesty and fair rating).'}</p>
                  </div>
                )}`;

content = content.replace(explanationRegex, newExplanation);

fs.writeFileSync(profileCardPath, content);
console.log('Done modifying ProfileCard.tsx');
