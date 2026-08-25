import re

with open('src/components/seznamka/PastAdmirers.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update onRateUser prop signature
content = content.replace('onRateUser: (profileId: string, rating: number, isCritical: boolean) => void;', 'onRateUser: (profileId: string, rating: number, isCritical: boolean, traits: string[]) => void;')

# Add state for traits
state_injection = """
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [isCritical, setIsCritical] = useState<boolean>(false);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter(t => t !== trait));
    } else {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };
"""
content = content.replace(
"""  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [isCritical, setIsCritical] = useState<boolean>(false);""",
state_injection.strip())

# Update handleRateSubmit
handle_submit_injection = """
  const handleRateSubmit = (profileId: string) => {
    onRateUser(profileId, rating, isCritical, selectedTraits);
    setSelectedProfileId(null);
    setRating(5);
    setIsCritical(false);
    setSelectedTraits([]);
  };
"""
content = content.replace(
"""  const handleRateSubmit = (profileId: string) => {
    onRateUser(profileId, rating, isCritical);
    setSelectedProfileId(null);
    setRating(5);
    setIsCritical(false);
  };""",
handle_submit_injection.strip())

# Inject the new UI sections before the critical warning block
new_ui_injection = """
                        {/* Hodnocení vlastností */}
                        <div className="space-y-4">
                          <label className="block text-white/70 font-mono text-xs uppercase tracking-widest">
                            {lang === 'cs' ? 'Skutečná osobnost (jak jste ji vnímali)' : 'True personality (as you perceived it)'}
                          </label>
                          
                          <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-4">
                            {/* Přístup k životu */}
                            <div>
                              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold">
                                {lang === 'cs' ? 'Přístup k životu' : 'Approach to life'}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { id: 'optimist', label: lang === 'cs' ? 'Optimista' : 'Optimist' },
                                  { id: 'pessimist', label: lang === 'cs' ? 'Pesimista' : 'Pessimist' },
                                  { id: 'realist', label: lang === 'cs' ? 'Realista' : 'Realist' },
                                  { id: 'dreamer', label: lang === 'cs' ? 'Snílek' : 'Dreamer' },
                                  { id: 'toxic_positive', label: lang === 'cs' ? 'Toxicky pozitivní' : 'Toxic positive' },
                                ].map(trait => (
                                  <button
                                    key={trait.id}
                                    onClick={() => toggleTrait(trait.id)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-colors border ${selectedTraits.includes(trait.id) ? 'bg-mafia-gold text-black border-mafia-gold font-bold' : 'bg-black/50 text-white/60 border-white/10 hover:border-white/30'}`}
                                  >
                                    {trait.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Komunikace */}
                            <div>
                              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold">
                                {lang === 'cs' ? 'Komunikace a Konflikty' : 'Communication & Conflicts'}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { id: 'communicative', label: lang === 'cs' ? 'Komunikativní' : 'Communicative' },
                                  { id: 'closed', label: lang === 'cs' ? 'Uzavřený' : 'Closed off' },
                                  { id: 'passive_aggressive', label: lang === 'cs' ? 'Pasivně agresivní' : 'Passive aggressive' },
                                  { id: 'explosive', label: lang === 'cs' ? 'Výbušný' : 'Explosive' },
                                  { id: 'manipulative', label: lang === 'cs' ? 'Manipulátor' : 'Manipulative' },
                                  { id: 'listener', label: lang === 'cs' ? 'Naslouchající' : 'Good listener' },
                                ].map(trait => (
                                  <button
                                    key={trait.id}
                                    onClick={() => toggleTrait(trait.id)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-colors border ${selectedTraits.includes(trait.id) ? 'bg-mafia-gold text-black border-mafia-gold font-bold' : 'bg-black/50 text-white/60 border-white/10 hover:border-white/30'}`}
                                  >
                                    {trait.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Peníze a zázemí */}
                            <div>
                              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold">
                                {lang === 'cs' ? 'Peníze a Zázemí' : 'Money & Background'}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { id: 'generous', label: lang === 'cs' ? 'Štědrý' : 'Generous' },
                                  { id: 'saver', label: lang === 'cs' ? 'Šetřílek' : 'Saver' },
                                  { id: 'gold_digger', label: lang === 'cs' ? 'Zlatokop/ka' : 'Gold digger' },
                                  { id: 'independent', label: lang === 'cs' ? 'Finančně nezávislý' : 'Financially independent' },
                                ].map(trait => (
                                  <button
                                    key={trait.id}
                                    onClick={() => toggleTrait(trait.id)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-colors border ${selectedTraits.includes(trait.id) ? 'bg-mafia-gold text-black border-mafia-gold font-bold' : 'bg-black/50 text-white/60 border-white/10 hover:border-white/30'}`}
                                  >
                                    {trait.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Charakter */}
                            <div>
                              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold">
                                {lang === 'cs' ? 'Charakter a Spolehlivost' : 'Character & Reliability'}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { id: 'responsible', label: lang === 'cs' ? 'Zodpovědný' : 'Responsible' },
                                  { id: 'unreliable', label: lang === 'cs' ? 'Nespolehlivý' : 'Unreliable' },
                                  { id: 'liar', label: lang === 'cs' ? 'Lhář' : 'Liar' },
                                  { id: 'loyal', label: lang === 'cs' ? 'Věrný' : 'Loyal' },
                                  { id: 'empathetic', label: lang === 'cs' ? 'Empatický' : 'Empathetic' },
                                  { id: 'selfish', label: lang === 'cs' ? 'Sobec' : 'Selfish' },
                                ].map(trait => (
                                  <button
                                    key={trait.id}
                                    onClick={() => toggleTrait(trait.id)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-colors border ${selectedTraits.includes(trait.id) ? 'bg-mafia-gold text-black border-mafia-gold font-bold' : 'bg-black/50 text-white/60 border-white/10 hover:border-white/30'}`}
                                  >
                                    {trait.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

"""
content = content.replace(
    '                        <div>\n                          <label className="flex items-start gap-3 p-4 border border-red-900/50 bg-red-950/20 rounded-xl cursor-pointer transition-colors hover:border-red-500/50">',
    new_ui_injection + '                        <div>\n                          <label className="flex items-start gap-3 p-4 border border-red-900/50 bg-red-950/20 rounded-xl cursor-pointer transition-colors hover:border-red-500/50">'
)

with open('src/components/seznamka/PastAdmirers.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
