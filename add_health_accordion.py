import re

with open('src/components/seznamka/ProfileCard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

health_accordion = """
        {profile.healthConditions && (
          <AccordionSection title={lang === 'cs' ? 'Zdraví a Omezení' : 'Health & Constraints'} icon={<Activity size={16} />} defaultOpen={false}>
            <div className="space-y-6">
              
              {profile.healthConditions.visionHearing && profile.healthConditions.visionHearing.length > 0 && (
                <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mt-4">
                  <h4 className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                    <Eye size={12} /> {lang === 'cs' ? 'Zrak & Sluch' : 'Vision & Hearing'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.healthConditions.visionHearing.map((tag: string, i: number) => {
                      const labels: Record<string, string> = {
                        'glasses': 'Brýle / Kontaktní čočky',
                        'blind': 'Zrakový handicap',
                        'hearing_aid': 'Naslouchátko',
                        'deaf': 'Sluchový handicap',
                      };
                      return (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-white/80 text-xs font-sans rounded-full">
                          {labels[tag] || tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {profile.healthConditions.mobility && profile.healthConditions.mobility.length > 0 && (
                <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mt-4">
                  <h4 className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                    <Activity size={12} /> {lang === 'cs' ? 'Fyzická mobilita' : 'Physical Mobility'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.healthConditions.mobility.map((tag: string, i: number) => {
                      const labels: Record<string, string> = {
                        'wheelchair': 'Vozíčkář',
                        'crutches': 'Berle / Hůl',
                        'amputee': 'Amputace',
                        'hidden_mobility': 'Skrytý fyzický handicap',
                        'fully_mobile': 'Plně mobilní',
                      };
                      return (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-white/80 text-xs font-sans rounded-full">
                          {labels[tag] || tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {profile.healthConditions.chronic && profile.healthConditions.chronic.length > 0 && (
                <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mt-4">
                  <h4 className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                    <HeartPulse size={12} /> {lang === 'cs' ? 'Chronická onemocnění' : 'Chronic Conditions'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.healthConditions.chronic.map((tag: string, i: number) => {
                      const labels: Record<string, string> = {
                        'asthma': 'Astma',
                        'diabetes': 'Diabetes',
                        'allergies': 'Silné alergie',
                        'migraines': 'Migrény',
                        'autoimmune': 'Autoimunitní onemocnění',
                        'epilepsy': 'Epilepsie',
                      };
                      return (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-white/80 text-xs font-sans rounded-full">
                          {labels[tag] || tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {profile.healthConditions.neurodivergent && profile.healthConditions.neurodivergent.length > 0 && (
                <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mt-4">
                  <h4 className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                    <Brain size={12} /> {lang === 'cs' ? 'Neurodiverzita' : 'Neurodivergence'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.healthConditions.neurodivergent.map((tag: string, i: number) => {
                      const labels: Record<string, string> = {
                        'adhd': 'ADHD',
                        'autism': 'Autismus / Asperger',
                        'dyslexia': 'Dyslexie / Dysgrafie',
                        'ocd': 'OCD',
                      };
                      return (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-white/80 text-xs font-sans rounded-full">
                          {labels[tag] || tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {profile.healthConditions.dietaryOrLifestyleConstraints && profile.healthConditions.dietaryOrLifestyleConstraints.length > 0 && (
                <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mt-4">
                  <h4 className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                    <Coffee size={12} /> {lang === 'cs' ? 'Životní styl a Omezení' : 'Lifestyle & Constraints'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.healthConditions.dietaryOrLifestyleConstraints.map((tag: string, i: number) => {
                      const labels: Record<string, string> = {
                        'celiac': 'Celiakie / Bezlepková dieta',
                        'health_vegan': 'Vegan ze zdravotních důvodů',
                        'frequent_rest': 'Potřebuji častý odpočinek',
                        'medication': 'Pravidelná medikace',
                      };
                      return (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-white/80 text-xs font-sans rounded-full">
                          {labels[tag] || tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </AccordionSection>
        )}
"""

content = content.replace(
    "<AccordionSection title={lang === 'cs' ? 'Osobnost a Vzhled' : 'Personality & Looks'}",
    health_accordion + "\n\n        <AccordionSection title={lang === 'cs' ? 'Osobnost a Vzhled' : 'Personality & Looks'}"
)

with open('src/components/seznamka/ProfileCard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done grouping!")
