const fs = require('fs');
const path = require('path');

const profileCardPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'ProfileCard.tsx');
let content = fs.readFileSync(profileCardPath, 'utf8');

// 0. Add ShieldAlert to lucide-react import
content = content.replace(
  /import \{\n  MapPin, Ruler, Cigarette, Wine, Sparkles, Info, X, Skull, Flag, MessageCircleHeart, Coffee, Target, GraduationCap, Zap, Bookmark, ChevronDown, ChevronLeft, ChevronRight, Camera, Heart, Instagram, Link, PawPrint, Facebook, Linkedin, Twitter, Music, PlaySquare, MessageSquare, EyeOff, Users, Home, Leaf, Calendar, Briefcase, Gamepad2, ShieldCheck, BadgeCheck, Lock\n\} from "lucide-react";/g,
  `import {
  MapPin, Ruler, Cigarette, Wine, Sparkles, Info, X, Skull, Flag, MessageCircleHeart, Coffee, Target, GraduationCap, Zap, Bookmark, ChevronDown, ChevronLeft, ChevronRight, Camera, Heart, Instagram, Link, PawPrint, Facebook, Linkedin, Twitter, Music, PlaySquare, MessageSquare, EyeOff, Users, Home, Leaf, Calendar, Briefcase, Gamepad2, ShieldCheck, BadgeCheck, Lock, ShieldAlert
} from "lucide-react";`
);


// 1. Change defaultOpen=true to defaultOpen=false for 'Proč se k sobě hodíte' and 'O mně & Vibe'
content = content.replace(
  /<AccordionSection title=\{lang === 'cs' \? 'Proč se k sobě hodíte' : 'Match Analysis'\} icon=\{<Target size=\{16\} \/>\} defaultOpen=\{true\}>/g,
  `<AccordionSection title={lang === 'cs' ? 'Proč se k sobě hodíte' : 'Match Analysis'} icon={<Target size={16} />} defaultOpen={false}>`
);
content = content.replace(
  /<AccordionSection title=\{lang === 'cs' \? 'O mně & Vibe' : 'About & Vibe'\} icon=\{<MessageCircleHeart size=\{16\} \/>\} defaultOpen=\{true\}>/g,
  `<AccordionSection title={lang === 'cs' ? 'O mně & Vibe' : 'About & Vibe'} icon={<MessageCircleHeart size={16} />} defaultOpen={false}>`
);

// 2. Insert the Warning Banner at the top
const containerMatch = `<div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-24 relative">`;
const banner = `
        {/* CRITICAL WARNING BANNER */}
        {profile.criticalWarnings && profile.criticalWarnings.length > 0 && (
          <div className="bg-red-900/40 border border-red-500/50 rounded-xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.3)] mb-8">
            <div className="absolute -right-4 -top-4 opacity-10">
              <ShieldAlert size={120} className="text-red-500" />
            </div>
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-red-500">
                <ShieldAlert size={28} className="animate-pulse" />
                <h3 className="font-heading font-black uppercase tracking-widest text-lg">
                  {lang === 'cs' ? 'Varování komunity' : 'Community Warning'}
                </h3>
              </div>
              <p className="text-white/80 font-mono text-sm leading-relaxed border-l-2 border-red-500/50 pl-4 py-1">
                {lang === 'cs' 
                  ? 'U tohoto profilu shledáváme míru závažnějšího špatného hodnocení od ostatních uživatelů (např. nevhodné chování, nátlak, agresivita).' 
                  : 'We have detected a significant level of severe negative feedback from other users for this profile (e.g. inappropriate behavior, harassment, aggression).'}
              </p>
            </div>
          </div>
        )}
`;
content = content.replace(containerMatch, containerMatch + banner);

// 3. Hide details on random strategy for Zájmy
const interestsRegex = /(<AccordionSection title=\{lang === 'cs' \? 'Zájmy & Životní styl' : 'Interests & Lifestyle'\} icon=\{<Sparkles size=\{16\} \/>\} defaultOpen=\{false\}>)([\s\S]*?)(<\/AccordionSection>)/;
content = content.replace(interestsRegex, (match, p1, p2, p3) => {
  return `${p1}
          {currentStrategy === 'random' ? (
            <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-xl border border-white/5 text-center mt-2">
              <Lock size={32} className="text-white/30 mb-3" />
              <p className="text-white/50 text-xs font-mono uppercase tracking-widest leading-relaxed">
                {lang === 'cs' 
                  ? 'Základní algoritmus nezobrazuje hlubší zájmy. Pro více informací vyberte jiný algoritmus (např. Nejbližší, Rozdílné).' 
                  : 'Random algorithm hides deeper interests. Choose another algorithm to reveal.'}
              </p>
            </div>
          ) : (
            <>
              ${p2}
            </>
          )}
${p3}`;
});

// 4. Hide details on random strategy for Psychologie
const psychRegex = /(<AccordionSection title=\{lang === 'cs' \? 'Psychologie & Deep Talk' : 'Psychology & Deep Talk'\} icon=\{<Skull size=\{16\} \/>\} defaultOpen=\{false\}>)([\s\S]*?)(<\/AccordionSection>)/;
content = content.replace(psychRegex, (match, p1, p2, p3) => {
  return `${p1}
          {currentStrategy === 'random' ? (
            <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-xl border border-white/5 text-center mt-2">
              <Lock size={32} className="text-white/30 mb-3" />
              <p className="text-white/50 text-xs font-mono uppercase tracking-widest leading-relaxed">
                {lang === 'cs' 
                  ? 'Psychologický profil je v náhodném algoritmu skrytý.' 
                  : 'Psychological profile is hidden in the random algorithm.'}
              </p>
            </div>
          ) : (
            <>
              ${p2}
            </>
          )}
${p3}`;
});

// 5. Hide details on random strategy for Sociální sítě
const socialRegex = /(<AccordionSection title=\{lang === 'cs' \? 'Sociální sítě' : 'Social Networks'\} icon=\{<Link size=\{16\} \/>\} defaultOpen=\{false\}>)([\s\S]*?)(<\/AccordionSection>)/;
content = content.replace(socialRegex, (match, p1, p2, p3) => {
  return `${p1}
          {currentStrategy === 'random' ? (
            <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-xl border border-white/5 text-center mt-2">
              <Lock size={32} className="text-white/30 mb-3" />
              <p className="text-white/50 text-xs font-mono uppercase tracking-widest leading-relaxed">
                {lang === 'cs' 
                  ? 'Sociální sítě nejsou v náhodném algoritmu dostupné.' 
                  : 'Social networks are not available in random algorithm.'}
              </p>
            </div>
          ) : (
            <>
              ${p2}
            </>
          )}
${p3}`;
});

fs.writeFileSync(profileCardPath, content);
console.log('Done modifying ProfileCard.tsx');
