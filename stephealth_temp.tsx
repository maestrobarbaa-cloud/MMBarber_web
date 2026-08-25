
import { Eye, HeartPulse, Brain } from "lucide-react";

export const StepHealth = ({ formData, setFormData, lang }: { formData: any, setFormData: any, lang: string }) => {
  const t = lang === 'cs' ? {
    title: 'Zdraví a Omezení',
    desc: 'Sdílej tolik, kolik je ti příjemné. Být upřímný ohledně zdravotních specifik pomáhá najít někoho, kdo má pochopení.',
    visionHearing: 'Zrak & Sluch',
    mobility: 'Fyzická mobilita',
    chronic: 'Chronická onemocnění a Zdraví',
    neurodivergent: 'Neurodiverzita',
    dietary: 'Životní styl a Omezení',
    options: {
      glasses: 'Brýle / Kontaktní čočky',
      blind: 'Zrakový handicap',
      hearing_aid: 'Naslouchátko',
      deaf: 'Sluchový handicap',
      wheelchair: 'Vozíčkář',
      crutches: 'Berle / Hůl',
      amputee: 'Amputace',
      hidden_mobility: 'Skrytý fyzický handicap',
      fully_mobile: 'Plně mobilní',
      asthma: 'Astma',
      diabetes: 'Diabetes',
      allergies: 'Silné alergie',
      migraines: 'Migrény',
      autoimmune: 'Autoimunitní onemocnění',
      epilepsy: 'Epilepsie',
      adhd: 'ADHD',
      autism: 'Autismus / Asperger',
      dyslexia: 'Dyslexie / Dysgrafie',
      ocd: 'OCD',
      celiac: 'Celiakie / Bezlepková dieta',
      health_vegan: 'Vegan ze zdravotních důvodů',
      frequent_rest: 'Potřebuji častý odpočinek',
      medication: 'Pravidelná medikace'
    }
  } : {
    title: 'Health & Conditions',
    desc: 'Share as much as you feel comfortable with. Being upfront helps find an understanding partner.',
    visionHearing: 'Vision & Hearing',
    mobility: 'Physical Mobility',
    chronic: 'Chronic Conditions & Health',
    neurodivergent: 'Neurodivergence',
    dietary: 'Lifestyle & Constraints',
    options: {
      glasses: 'Glasses / Contacts',
      blind: 'Visual Impairment',
      hearing_aid: 'Hearing Aid',
      deaf: 'Hearing Impairment',
      wheelchair: 'Wheelchair user',
      crutches: 'Crutches / Cane',
      amputee: 'Amputee',
      hidden_mobility: 'Hidden physical disability',
      fully_mobile: 'Fully mobile',
      asthma: 'Asthma',
      diabetes: 'Diabetes',
      allergies: 'Severe Allergies',
      migraines: 'Migraines',
      autoimmune: 'Autoimmune Disease',
      epilepsy: 'Epilepsy',
      adhd: 'ADHD',
      autism: 'Autism / Aspergers',
      dyslexia: 'Dyslexia',
      ocd: 'OCD',
      celiac: 'Celiac / Gluten-free',
      health_vegan: 'Vegan for health reasons',
      frequent_rest: 'Need frequent rest',
      medication: 'Regular medication'
    }
  };

  const updateField = (field: string, values: string[]) => {
    setFormData({
      ...formData,
      healthConditions: {
        ...(formData.healthConditions || {}),
        [field]: values
      }
    });
  };

  const getValues = (field: string) => {
    return formData.healthConditions?.[field] || [];
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="font-heading font-black text-2xl text-white uppercase tracking-wider mb-2">{t.title}</h3>
        <p className="text-white/50 text-sm max-w-md mx-auto">{t.desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AccordionSection title={t.visionHearing} icon={<Eye size={16} />} defaultOpen={true}>
          <div className="flex flex-wrap gap-2 mt-4">
            {['glasses', 'blind', 'hearing_aid', 'deaf'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const current = getValues('visionHearing');
                  const next = current.includes(opt) ? current.filter((c: string) => c !== opt) : [...current, opt];
                  updateField('visionHearing', next);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${getValues('visionHearing').includes(opt) ? 'bg-mafia-gold text-black font-bold' : 'bg-black/50 text-white/70 hover:bg-white/10'}`}
              >
                {t.options[opt as keyof typeof t.options]}
              </button>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title={t.mobility} icon={<Activity size={16} />} defaultOpen={false}>
          <div className="flex flex-wrap gap-2 mt-4">
            {['fully_mobile', 'hidden_mobility', 'wheelchair', 'crutches', 'amputee'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const current = getValues('mobility');
                  const next = current.includes(opt) ? current.filter((c: string) => c !== opt) : [...current, opt];
                  updateField('mobility', next);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${getValues('mobility').includes(opt) ? 'bg-mafia-gold text-black font-bold' : 'bg-black/50 text-white/70 hover:bg-white/10'}`}
              >
                {t.options[opt as keyof typeof t.options]}
              </button>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title={t.chronic} icon={<HeartPulse size={16} />} defaultOpen={false}>
          <div className="flex flex-wrap gap-2 mt-4">
            {['asthma', 'diabetes', 'allergies', 'migraines', 'autoimmune', 'epilepsy'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const current = getValues('chronic');
                  const next = current.includes(opt) ? current.filter((c: string) => c !== opt) : [...current, opt];
                  updateField('chronic', next);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${getValues('chronic').includes(opt) ? 'bg-mafia-gold text-black font-bold' : 'bg-black/50 text-white/70 hover:bg-white/10'}`}
              >
                {t.options[opt as keyof typeof t.options]}
              </button>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title={t.neurodivergent} icon={<Brain size={16} />} defaultOpen={false}>
          <div className="flex flex-wrap gap-2 mt-4">
            {['adhd', 'autism', 'dyslexia', 'ocd'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const current = getValues('neurodivergent');
                  const next = current.includes(opt) ? current.filter((c: string) => c !== opt) : [...current, opt];
                  updateField('neurodivergent', next);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${getValues('neurodivergent').includes(opt) ? 'bg-mafia-gold text-black font-bold' : 'bg-black/50 text-white/70 hover:bg-white/10'}`}
              >
                {t.options[opt as keyof typeof t.options]}
              </button>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title={t.dietary} icon={<Coffee size={16} />} defaultOpen={false}>
          <div className="flex flex-wrap gap-2 mt-4">
            {['celiac', 'health_vegan', 'frequent_rest', 'medication'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const current = getValues('dietaryOrLifestyleConstraints');
                  const next = current.includes(opt) ? current.filter((c: string) => c !== opt) : [...current, opt];
                  updateField('dietaryOrLifestyleConstraints', next);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${getValues('dietaryOrLifestyleConstraints').includes(opt) ? 'bg-mafia-gold text-black font-bold' : 'bg-black/50 text-white/70 hover:bg-white/10'}`}
              >
                {t.options[opt as keyof typeof t.options]}
              </button>
            ))}
          </div>
        </AccordionSection>
      </div>
    </motion.div>
  );
};
