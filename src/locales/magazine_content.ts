
export const MAGAZINE_CS = [
  {
    type: 'cover',
    title: 'PÉČE',
    category: 'MAGAZÍN',
    shortTitle: 'Obálka',
    subtitle: 'MMBARBER MAGAZÍN O PROFESIONÁLNÍ PÉČI',
    edition: 'EDICE 2026 / SVAZEK I',
  },
  {
    type: 'editorial',
    title: 'Filozofie péče',
    category: 'MAGAZÍN',
    shortTitle: 'Filozofie',
    content: 'Skutečná péče není o marketingu, ale o biologii. Vaše pokožka je největším orgánem těla a vlasy/vousy jsou jejími deriváty. V tomto vydání se podíváme na to, jak fungují oleje, jak bojovat s kožními problémy a proč se péče musí měnit s ročním obdobím.',
    quote: '„Kvalita není náhoda, je to výsledek inteligentního úsilí.“',
  },
  {
    type: 'alter-ego',
    title: 'Tvoje Alter Ego',
    category: 'IDENTITA',
    shortTitle: 'Alter Ego (Test)',
    subtitle: 'Kdo se skrývá pod povrchem?',
    questions: [
      { q: "Jaký je váš primární komunikační kód?", options: [
        { text: "Přímý, autoritativní, bez zbytečných slov.", val: 1 }, 
        { text: "Drsný, upřímný, mluvím činy.", val: 2 }, 
        { text: "Nepředvídatelný, ironický, bořím konvence.", val: 3 }, 
        { text: "Slušný, diplomatický, s důrazem na etiketu.", val: 4 }
      ]},
      { q: "Váš ideální revír pro sobotní večer?", options: [
        { text: "Střešní bar s výhledem na město a drahým pitím.", val: 1 }, 
        { text: "Klub, kde hraje bass a cítím tep ulice.", val: 2 }, 
        { text: "Ateliér, garáž nebo místo, kde můžu tvořit.", val: 3 }, 
        { text: "Klasický lounge s kvalitním doutníkem.", val: 4 }
      ]},
      { q: "Jak reagujete na autority a pravidla?", options: [
        { text: "Já jsem ta autorita, která pravidla tvoří.", val: 1 }, 
        { text: "Pravidla respektuji, dokud mi nestojí v cestě.", val: 2 }, 
        { text: "Pravidla jsou pro ty, co nemají fantazii.", val: 3 }, 
        { text: "Pravidla jsou základem civilizované společnosti.", val: 4 }
      ]},
      { q: "Co definuje váš osobní prostor?", options: [
        { text: "Minimalismus, luxus a absolutní řád.", val: 1 }, 
        { text: "Funkčnost, tech a surový industriál.", val: 2 }, 
        { text: "Chaos, barvy a sbírka unikátních předmětů.", val: 3 }, 
        { text: "Historie, tradice a kvalitní materiály.", val: 4 }
      ]},
      { q: "Váš postoj k technologiím?", options: [
        { text: "Nástroj k efektivitě a ovládání trhu.", val: 1 }, 
        { text: "Můj život je online, tech je moje DNA.", val: 2 }, 
        { text: "Používám jen to, co mi dává svobodu.", val: 3 }, 
        { text: "Tech je dobrý sluha, ale špatný pán.", val: 4 }
      ]}
    ],
    results: {
      boss: { 
        title: "PROFIL: THE ALPHA ARCHITECT", 
        desc: "Jste vizionář, který vidí struktury tam, kde jiní vidí chaos. Vaše přítomnost v místnosti mění atmosféru. Nečekáte na příležitosti, vy si je berete.", 
        advice: "Váš styl vyžaduje absolutní preciznost. Žádné kompromisy.",
        haircut: "Executive Contour / Razor Fade Slick Back",
        beard: "Heavy Stubble (precizně konturované)",
        fragrance: "Oud, Saffron, Black Leather"
      },
      gangster: { 
        title: "PROFIL: URBAN PREDATOR", 
        desc: "Ulice je váš domov a vy znáte její rytmus. Jste loajální ke svému klanu, ale nemilosrdný k nepřátelům. Vaše síla je v autenticitě.", 
        advice: "Potřebujete styl, který vydrží tempo města a vypadá drsně i po 12 hodinách.",
        haircut: "High Skin Fade + Textured Fringe",
        beard: "Boxed Beard (ostré linie)",
        fragrance: "Gunpowder, Sea Salt, Dark Woods"
      },
      outsider: { 
        title: "PROFIL: CREATIVE ANARCHIST", 
        desc: "Nezapadáte a ani nechcete. Váš život je experiment a vaše hlava je továrna na nápady. Jste ten, na koho se lidé dívají, i když se nesnažíte.", 
        advice: "Váš styl je vyjádřením svobody. Nebojte se extrémů a přirozenosti.",
        haircut: "Long Taper / Messy Mullet / Natural Flow",
        beard: "Full Natural Beard (jen lehká úprava)",
        fragrance: "Cannabis, Patchouli, Pine Needle"
      },
      gentleman: { 
        title: "PROFIL: LEGACY GUARDIAN", 
        desc: "Střežíte hodnoty, které se ze světa vytrácejí. Čest, etiketa a smysl pro detail jsou vaším brněním. Jste pilířem, o který se ostatní opírají.", 
        advice: "Elegance není o tom být viděn, ale o tom být zapamatován. Vsaďte na klasiku.",
        haircut: "Classic Side Part / Scumbag Fade",
        beard: "Clean Shave / Moustache Only",
        fragrance: "Lavender, Bergamot, Sandalwood"
      }
    }
  },
  {
    type: 'rituals',
    title: 'Globální rituály',
    category: 'MAGAZÍN',
    shortTitle: 'Rituály',
    subtitle: 'Historie a tradice napříč světem',
    rituals: [
      { country: 'Itálie', fact: 'Dědictví renesance a rozmarýnu. Italští mistři po staletí využívají macerát Rosmarinus officinalis (rozmarýn) pro stimulaci mikrocirkulace vlasové pokožky.' },
      { country: 'Španělsko', fact: 'Proteinový rituál a citrusy. Tradiční španělská péče využívala vaječné žloutky v kombinaci s čerstvou citronovou šťávou pro uzavření vlasové kutikuly.' },
      { country: 'Řecko', fact: 'Tradiční rituál po koupání v moři. Řekové si do vlasů i vousů vmasírují čistý olivový olej ihned po odchodu z pláže pro vytěsnění soli.' },
      { country: 'Egypt', fact: 'Tajemství faraonů v podobě oleje z černuchy seté (černý kmín). Má neuvěřitelné protizánětlivé účinky pro pokožku po holení.' },
      { country: 'Skandinávie', fact: 'Březová voda a střídání teplot. Seveřané používají výluh z březového listí pro posílení kořínků a lesk.' },
      { country: 'Japonsko', fact: 'Ritualita horkých ručníků. Napařování pro otevření pórů a změkčení i těch nejtvrdších vousů.' }
    ]
  },
  {
    type: 'fragrance',
    title: 'Vůně a genetika',
    category: 'BIOLOGIE',
    shortTitle: 'Vůně',
    subtitle: 'Biometrický profil a kompatibilita',
    content: 'Výběr vůně není jen o vkusu, ale o biologické kompatibilitě. Vědecké studie potvrzují, že náš imunitní systém (MHC komplex) a genetický původ (gen ABCC11) určují, jak bude parfém na naší kůži vonět.',
    profiles: [
      { origin: 'Severní / Nordický', skin: 'Tenká, světlá, suchá', genetics: 'Nižší aktivita apokrinních žláz', rec: 'Ozonické, akvatické a lehké citrusové tóny.' },
      { origin: 'Středomořský / Olivový', skin: 'Silnější, mastnější, pigmentovaná', genetics: 'Vysoká produkce lipidů', rec: 'Dřevité, kožené a hluboké ambrové vůně.' },
      { origin: 'Orientální / Asijský', skin: 'Kombinovaná, citlivá', genetics: 'Specifická varianta genu ABCC11', rec: 'Zelený čaj, jasmín, santalové dřevo.' }
    ],
    factors: [
      { t: 'MHC Komplex', d: 'Váš unikátní genetický kód ovlivňuje složení kožního mazu a mikroflóry.' },
      { t: 'Původ a strava', d: 'Lidé se středomořským původem mají tendenci k mastnější pokožce.' },
      { t: 'Test kompatibility', d: 'Odborníci doporučují testovat vůni po 3 hodinách od aplikace.' }
    ]
  },
  {
    type: 'test',
    title: 'Biogenetický Profiler',
    category: 'BIOLOGIE',
    shortTitle: 'Profiler (Test)',
    subtitle: 'Interaktivní analýza vašeho původu',
    questions: [
      { q: "Jaká je přirozená barva vašich vlasů/vousů?", options: [{ text: "Blond, zrzavá nebo světle hnědá.", val: 1 }, { text: "Středně až tmavě hnědá.", val: 2 }, { text: "Černá nebo velmi tmavá.", val: 3 }] },
      { q: "Jak vaše pokožka reaguje na první jarní slunce?", options: [{ text: "Okamžitě zrudne, téměř se neopálí.", val: 1 }, { text: "Nejdříve zrudne, pak zhnědne.", val: 2 }, { text: "Rychle a snadno hnědne bez pálení.", val: 3 }] },
      { q: "Jaká je tloušťka vašich jednotlivých vlasů?", options: [{ text: "Jemné, tenké vlasy.", val: 1 }, { text: "Střední tloušťka.", val: 2 }, { text: "Silné, hrubé vlasy.", val: 3 }] },
      { q: "Jaká je struktura vašich vousů?", options: [{ text: "Měkké, spíše řidší.", val: 1 }, { text: "Pevné, rovnoměrně rostoucí.", val: 2 }, { text: "Velmi tvrdé, kudrnaté nebo nepoddajné.", val: 3 }] },
      { q: "Jaká je vaše barva očí?", options: [{ text: "Modrá, zelená nebo šedá.", val: 1 }, { text: "Oříšková nebo světle hnědá.", val: 2 }, { text: "Tmavě hnědá až černá.", val: 3 }] },
      { q: "Jaký je váš etnický původ (převažující)?", options: [{ text: "Severní / Střední Evropa.", val: 1 }, { text: "Jižní Evropa / Středomoří.", val: 2 }, { text: "Blízký východ / Asie.", val: 3 }] }
    ],
    results: {
      borealis: { title: "PROFIL: BOREALIS", desc: "Váš původ směřuje k severním a středoevropským liniím. Máte jemnější strukturu pokožky i vlasů.", advice: "Volte svěží, dřevité a lehce kořeněné vůně. Vyhněte se těžkým sladkým parfémům." },
      meridionalis: { title: "PROFIL: MERIDIONALIS", desc: "Váš profil nese znaky středomořských a kontinentálních vlivů. Pokožka je odolnější.", advice: "Ideální jsou citrusové základy s hlubokým dozvukem kůže nebo tabáku." },
      orientalis: { title: "PROFIL: ORIENTALIS", desc: "Váš původ je spojen s jižními a orientálními liniemi. Máte vysokou odolnost a hustotu.", advice: "Nebojte se výrazných, ambrových a kořeněných vůní. Vaše kůže je unese." }
    }
  },
  {
    type: 'herbs',
    title: 'Herbální Medicína',
    category: 'HERBOLOGIE',
    shortTitle: 'Byliny',
    subtitle: 'Síla přírody v boji za hustotu',
    content: 'Tradiční medicína, zejména ta čínská (TCM), využívá sílu rostlin k harmonizaci organismu. Vlasy jsou v TCM považovány za „přebytek krve“. Pokud je krev slabá nebo stagnuje, vlasy strádají.',
    herbs: [
      { n: 'He Shou Wu (Rdesno)', f: 'Polygonum multiflorum', d: 'Legendární čínská bylina. Vyživuje játra a ledviny, posiluje krev a podle tradice navrací šedým vlasům jejich původní barvu.' },
      { n: 'Saw Palmetto', f: 'Serenoa repens', d: 'Přírodní blokátor enzymu 5-alfa-reduktázy. Snižuje hladinu DHT v pokožce, čímž chrání folikuly před miniaturizací.' },
      { n: 'Reishi', f: 'Ganoderma lucidum', d: '„Houba nesmrtelnosti“. Působí silně protizánětlivě a antioxidačně, stabilizuje imunitní reakce pokožky.' },
      { n: 'Kopřiva & Přeslička', f: 'Urtica dioica / Equisetum', d: 'Bohaté zdroje křemíku a síry. Zpevňují strukturu vlasu a podporují tvorbu kolagenu.' }
    ]
  },
  {
    type: 'test-herbs',
    title: 'Herbální Profiler',
    category: 'HERBOLOGIE',
    shortTitle: 'Byliny (Test)',
    subtitle: 'Která rostlina je pro vás ta pravá?',
    questions: [
      { q: "Jaký je váš hlavní cíl v péči o vlasy/vousy?", options: [{ text: "Zastavit vypadávání a zahustit porost.", val: 1 }, { text: "Zpomalit šedivění a podpořit pigmentaci.", val: 2 }, { text: "Zklidnit pokožku a odstranit záněty.", val: 3 }] },
      { q: "Jak pociťujete svou celkovou životní energii?", options: [{ text: "Jsem často unavený, pociťuji slabost.", val: 1 }, { text: "Energie je v normě, ale chybí mi vitalita.", val: 2 }, { text: "Cítím horkost, podráždění nebo stres.", val: 3 }] },
      { q: "Jaká je struktura vašich vlasů v posledních letech?", options: [{ text: "Ztenčují se a slábnou.", val: 1 }, { text: "Ztrácejí barvu (šedivějí).", val: 2 }, { text: "Jsou suché, lámavé a kůže svědí.", val: 3 }] }
    ],
    results: {
      'growth': { title: "DOPORUČENÍ: SAW PALMETTO", desc: "Váš profil naznačuje citlivost na DHT. Saw Palmetto pomůže chránit vaše kořínky.", advice: "Doplňte o masáže s rozmarýnovým olejem pro podporu cirkulace." },
      'pigment': { title: "DOPORUČENÍ: HE SHOU WU", desc: "Potřebujete posílit krevní esenci a vyživit játra. He Shou Wu je pro vás ideální volbou.", advice: "Kombinujte s černým sezamem a kustovnicí čínskou (Goji)." },
      'soothing': { title: "DOPORUČENÍ: REISHI & KOPŘIVA", desc: "Vaše pokožka potřebuje zklidnit a vyčistit od toxinů. Reishi podpoří imunitu a kopřiva dodá minerály.", advice: "Pijte kopřivový čaj v 3-týdenních kúrách a omezte cukr." }
    }
  },
  {
    type: 'nutrition',
    title: 'Výživa zevnitř',
    category: 'BIOLOGIE',
    shortTitle: 'Výživa',
    subtitle: 'Vlasy začínají na talíři',
    content: 'Kosmetika řeší následky, ale strava ovlivňuje příčinu. Vlasový folikul je jednou z nejaktivnějších tkání v těle.',
    nutrients: [
      { n: 'Proteiny (Keratin)', f: 'Vejce, libové maso, luštěniny.', d: 'Vlas je tvořen bílkovinou. Nedostatek proteinů vede k slábnutí vlasového vlákna.' },
      { n: 'Omega-3 mastné kyseliny', f: 'Tučné ryby, vlašské ořechy, lněná semínka.', d: 'Zajišťují hydrataci pokožky zevnitř a dodávají vlasům lesk.' },
      { n: 'Zinek a Železo', f: 'Dýňová semínka, hovězí maso, špenát.', d: 'Zinek brání vypadávání, železo zajišťuje okysličení kořínků.' },
      { n: 'Biotin a Vitamin C', f: 'Vaječné žloutky, citrusy, paprika.', d: 'Biotin zpevňuje strukturu, Vitamin C je nezbytný pro tvorbu kolagenu.' }
    ]
  },
  {
    type: 'test-trichology',
    title: 'Trichologický Audit',
    category: 'BIOLOGIE',
    shortTitle: 'Trichologie (Test)',
    subtitle: 'Hloubková analýza zdraví folikulů',
    questions: [
      { q: "Jak pociťujete napětí pokožky hlavy v průběhu dne?", options: [{ text: "Vůbec, pokožka je pružná a bez pnutí.", val: 1 }, { text: "Občasné pnutí v oblasti spánků nebo temene.", val: 2 }, { text: "Časté pnutí, pocit 'stažené' pokožky.", val: 3 }] },
      { q: "Pozorujete zvýšené vypadávání vlasů při mytí nebo česání?", options: [{ text: "Minimální, v rámci běžné normy (do 100 vlasů).", val: 1 }, { text: "Mírně zvýšené, v odpadu je vlasů více než dříve.", val: 2 }, { text: "Výrazné, vlasy zůstávají na polštáři i na rukou.", val: 3 }] },
      { q: "Jaká je hustota vašich vlasů v oblasti koutů a temene ve srovnání s týlem?", options: [{ text: "Hustota je rovnoměrná po celé hlavě.", val: 1 }, { text: "Mírné prořídnutí v oblasti koutů.", val: 2 }, { text: "Viditelný rozdíl, kůže prosvítá skrze vlasy.", val: 3 }] },
      { q: "Jak často se setkáváte s mikro-záněty (pupínky, zarudlá místa) na pokožce?", options: [{ text: "Téměř nikdy.", val: 1 }, { text: "Jednou za čas, většinou po stresu nebo dietě.", val: 2 }, { text: "Pravidelně, pokožka je citlivá a náchylná k zánětům.", val: 3 }] },
      { q: "Jaký je váš průměrný stupeň stresu a kvalita spánku?", options: [{ text: "Nízký stres, kvalitní spánek (7h+).", val: 1 }, { text: "Střední stres, občasné potíže se spánkem.", val: 2 }, { text: "Vysoký stres, chronický nedostatek spánku.", val: 3 }] },
      { q: "Cítíte někdy 'bolest' vlasových kořínků (trichodynie)?", options: [{ text: "Nikdy jsem to nepocítil.", val: 1 }, { text: "Velmi zřídka při změně účesu nebo čepice.", val: 2 }, { text: "Často, pokožka bolí i při mírném dotyku.", val: 3 }] }
    ],
    results: {
      'stable': { title: "STAV: OPTIMÁLNÍ", desc: "Váš trichologický profil je stabilní. Folikuly jsou dostatečně vyživené a růstový cyklus je v rovnováze.", advice: "Udržujte stávající rutinu. Zaměřte se na preventivní masáže pro podporu mikrocirkulace." },
      'warning': { title: "STAV: LATENTNÍ RIZIKO", desc: "Detekovány známky únavy folikulů nebo narušení bariéry. Růstová fáze může být oslabena.", advice: "Zvyšte příjem minerálů (Zinek, Hořčík) a zařaďte kofeinová tonika pro stimulaci kořínků." },
      'critical': { title: "STAV: VYŽADUJE POZORNOST", desc: "Váš profil vykazuje známky trichodynie a zvýšeného stresu tkáně. Hrozí předčasný přechod do fáze vypadávání.", advice: "Konzultujte stav s odborníkem. Doporučujeme hloubkovou kúru a radikální snížení stresových faktorů." }
    }
  },
  {
    type: 'seasonal',
    title: 'Sezónní cyklus',
    category: 'VLASY',
    shortTitle: 'Cyklus',
  },
  {
    type: 'test-hair',
    title: 'Diagnostika a výběr',
    category: 'VLASY',
    shortTitle: 'Vlasy (Test)',
    subtitle: 'Poznejte své vlasy dříve, než nakoupíte',
    content: 'Šampon byste měli vybírat primárně podle stavu pokožky hlavy, zatímco kondicionér podle stavu délek.',
    questions: [
      { q: "Jak rychle vaše vlasy po namočení 'ztěžknou' a skutečně nasáknou?", options: [{ text: "Dlouho to trvá, voda po nich spíše stéká v kapičkách.", val: 1 }, { text: "Normálně, během chvíle jsou mokré skrz naskrz.", val: 2 }, { text: "Okamžitě, nasáknou vodu jako houba.", val: 3 }] },
      { q: "Jak vaše vlasy reagují na zvýšenou vlhkost (např. v koupelně nebo v dešti)?", options: [{ text: "Téměř vůbec, drží si svůj tvar.", val: 1 }, { text: "Mírně se zvlní nebo ztratí lesk.", val: 2 }, { text: "Okamžitě zkrepatí a zvětší svůj objem.", val: 3 }] },
      { q: "Zkuste vlas jemně natáhnout (mezi prsty). Co se stane?", options: [{ text: "Ihned praskne, nejde vůbec natáhnout.", val: 1 }, { text: "Mírně se natáhne a vrátí se zpět.", val: 2 }, { text: "Natáhne se jako gumička a pak se přetrhne.", val: 3 }] }
    ],
    results: {
      'low-porosity': { title: "NÍZKÁ POROZITA", desc: "Vaše vlasová kutikula je pevně uzavřená. Vlasy jsou odolné, ale těžko přijímají hydrataci.", advice: "Používejte teplo při aplikaci masek. Vyhněte se těžkým olejům.", focus: "Zvlhčovadla (Glycerin, Aloe)." },
      'medium-porosity': { title: "NORMÁLNÍ POROZITA", desc: "Ideální stav. Kutikula je mírně otevřená, vlas dobře přijímá i drží vlhkost.", advice: "Pokračujte v běžné údržbě. Občasná proteinová kúra udrží strukturu pevnou.", focus: "Rovnováha (Hydratace + Proteiny)." },
      'high-porosity': { title: "VYSOKÁ POROZITA", desc: "Vlas je poškozený nebo geneticky velmi 'otevřený'. Rychle nasaje vodu, ale ještě rychleji ji ztratí.", advice: "Používejte kyselé oplachy pro uzavření kutikuly. Nutností jsou oleje a másla.", focus: "Proteiny a lipidy (Keratin, Ceramidy)." }
    }
  },
  {
    type: 'test-scalp',
    title: 'Kožní anomálie',
    category: 'PLEŤ',
    shortTitle: 'Pokožka (Test)',
    subtitle: 'Když je něco špatně',
    content: 'Mnoho mužů zaměňuje seboroickou dermatitidu za běžné lupy.',
    questions: [
      { q: "Jak často si musíte mýt vlasy/vousy kvůli pocitu mastnoty?", options: [{ text: "Stačí jednou za 4 dny nebo i méně často.", val: 1 }, { text: "Každý druhý až třetí den.", val: 2 }, { text: "Musím každý den, jinak jsou mastné.", val: 3 }] },
      { q: "Pociťujete v průběhu dne svědění, pálení nebo pnutí pokožky?", options: [{ text: "Téměř nikdy, pokožka je v klidu.", val: 1 }, { text: "Občas po umytí nebo při stresu.", val: 2 }, { text: "Často, pokožka je citlivá a zarudlá.", val: 3 }] },
      { q: "Objevují se ve vašich vlasech šupinky (lupy)? Jak vypadají?", options: [{ text: "Žádné lupy nemám.", val: 1 }, { text: "Drobné, bílé a suché.", val: 2 }, { text: "Větší, nažloutlé a mastné.", val: 3 }] }
    ],
    results: {
      'dry': { title: "SUCHÁ / CITLIVÁ POKOŽKA", desc: "Vaše pokožka produkuje málo přirozeného mazu.", advice: "Používejte jemné šampony bez sulfátů.", warning: "Pozor na horkou vodu!" },
      'oily': { title: "BALANCOVANÁ / MASTNĚJŠÍ", desc: "Produkce mazu je vyšší, ale v normě.", advice: "Doporučujeme pravidelný peeling pokožky hlavy.", warning: "Nepřemývejte vlasy příliš často." },
      'problematic': { title: "SEBOROICKÝ / ZÁNĚTLIVÝ PROFIL", desc: "Mastné šupinky a svědění mohou značit seboroickou dermatitidu.", advice: "Používejte šampony s obsahem kyseliny salicylové.", warning: "Při zhoršení navštivte dermatologa." }
    }
  },
  {
    type: 'expert',
    title: 'Věda o složení',
    category: 'PLEŤ',
    shortTitle: 'Složení',
    subtitle: 'Co hledat v šamponech a olejích?',
    content: 'Většina komerčních produktů obsahuje levné náhražky. Odborníci doporučují zaměřit se na funkční látky, které skutečně pronikají do struktury vlasu.',
    sections: [
      { t: 'Vhodné složky', d: 'Hledejte Panthenol (hydratace), Keratin (síla), Kofein (stimulace kořínků) and Aloe Vera (zklidnění).' },
      { t: 'PH Rovnováha', d: 'Šampon by měl mít pH 4.5 – 5.5. Příliš zásadité produkty otevírají vlasovou kutikulu.' },
      { t: 'Čemu se vyhnout', d: 'Parabeny a ftaláty narušují hormonální rovnováhu. Minerální oleje ucpávají póry.' },
      { t: 'Frekvence mytí', d: 'Mýt si vlasy denně je mýtus. Pro většinu typů stačí 2–3x týdně.' }
    ]
  },
  {
    type: 'solutions',
    title: 'Řešení na míru',
    category: 'PLEŤ',
    shortTitle: 'Řešení',
    subtitle: 'Specifické potřeby a odborná pomoc',
    content: 'Každý organismus reaguje na vnější i vnitřní změny jinak. Zde jsou klíčová doporučení pro specifické situace podložená vědeckými studiemi.',
    categories: [
      { t: 'Ženy po porodu', d: 'Hormonální změny vedou k tzv. telogennímu efluviu (nadměrné vypadávání). Doporučuje se Biotin, Kolagen a šampony s obsahem křemíku.' },
      { t: 'Muži: Padání vlasů', d: 'Hledejte aktivní látky jako Kofein, Aminexil nebo extrakt ze Saw Palmetto, který přirozeně blokuje DHT.' },
      { t: 'Suchá a svědivá kůže', d: 'Ideální jsou produkty s obsahem Urey and Glycerinu, které v pokožce vázají vodu.' },
      { t: 'Mastná pokožka', d: 'Vhodná je kyselina salicylová, která jemně čistí póry, nebo jíl (Kaolin), který absorbuje přebytečný maz bez vysoušení.' }
    ]
  },
  {
    type: 'shaving',
    title: 'Hygiena a holení',
    category: 'VOUSY',
    shortTitle: 'Holení',
    subtitle: 'Umění břitvy a ochrana pokožky',
    content: 'Holení je pro pokožku invazivní proces. Správný postup a důsledná dezinfekce jsou rozdílem mezi hladkou tváří a podrážděním.',
    steps: [
      { t: 'Příprava (Napařování)', d: 'Horký ručník (rituál Hot Towel) otevře póry a změkčí vousy.' },
      { t: 'Dezinfekce a Alum', d: 'Kamenec (Alum) je přírodní minerál, který okamžitě zastavuje mikrokrvácení a uzavírá póry.' },
      { t: 'Péče po shaverování hlavy', d: 'Při holení hlavy do hladka je pokožka citlivá. Používejte tonika s obsahem hamamelu (vilínu).' },
      { t: 'Zklidnění', d: 'Po holení vždy opláchněte obličej studenou vodou pro uzavření pórů a aplikujte balzám bez alkoholu.' }
    ]
  },
  {
    type: 'aftercare',
    title: 'Následná péče',
    category: 'VOUSY',
    shortTitle: 'Péče',
    subtitle: 'Jak udržet styl i po odchodu ze salonu',
    content: 'Vaše návštěva u barbera končí u dveří, ale péče pokračuje doma. Správné návyky prodlouží trvanlivost střihu a udrží pokožku zdravou.',
    sections: [
      { t: 'Správné mytí vlasů', d: 'Používejte vlažnou vodu. Horká voda zbavuje pokožku mazu a otevírá vlasovou kutikulu, což vede k poškození.' },
      { t: 'Po návštěvě barbera', d: 'Prvních 24 hodin se snažte na čerstvý sestřih nebo oholení nesahat špinavýma rukama.' },
      { t: 'Čerstvé povlečení', d: 'Tip od profesionálů: Po každém velkém holení nebo střihu si vyměňte povlečení na polštáři.' },
      { t: 'Styling doma', d: 'Vždy se zeptejte svého barbera, jaký produkt použil a jak ho správně aplikovat.' }
    ]
  },
  {
    type: 'styling-guide',
    title: 'Průvodce Stylingem',
    category: 'STYLING',
    shortTitle: 'Styling',
    subtitle: 'Pomády, pasty a slané vody',
    content: 'Správný stylingový produkt je jako poslední dílek skládačky. Bez něj střih postrádá strukturu a charakter. Každý typ produktu je navržen pro jiný účel a typ vlasů.',
    products: [
      { t: 'Pomády (Water-based)', d: 'Klasika pro uhlazené účesy (Slick Back). Vysoký lesk a silná fixace. Snadno se vymývají.' },
      { t: 'Pasty a Hlíny', d: 'Univerzální nástroje pro texturu a matný vzhled. Ideální pro moderní, rozcuchané účesy.' },
      { t: 'Slané vody (Salt Spray)', d: 'Základ pro objem. Dodají vlasům texturu jako od moře. Používají se jako prestyling před fénováním.' },
      { t: 'Pudry na vlasy', d: 'Okamžitý objem u kořínků a extrémně matný efekt. Skvělé pro jemné vlasy.' }
    ]
  },
  {
    type: 'test-styling',
    title: 'Stylingový Algoritmus',
    category: 'STYLING',
    shortTitle: 'Styling (Test)',
    subtitle: 'Najděte svůj ideální finiš',
    questions: [
      { q: "Jakého výsledného efektu chcete docílit?", options: [{ text: "Uhlazený, lesklý a elegantní vzhled.", val: 1 }, { text: "Přirozený, matný a texturovaný look.", val: 2 }, { text: "Maximální objem bez pocitu produktu ve vlasech.", val: 3 }] },
      { q: "Jak silnou fixaci (držení) vyžadujete?", options: [{ text: "Extrémní - vlasy se nesmí hnout celý den.", val: 1 }, { text: "Střední - chci mít možnost vlasy v průběhu dne upravit.", val: 2 }, { text: "Lehkou - preferuji přirozený pohyb.", val: 3 }] },
      { q: "Jaká je délka vašich vlasů?", options: [{ text: "Krátké (do 5 cm).", val: 1 }, { text: "Středně dlouhé (5-12 cm).", val: 2 }, { text: "Dlouhé (nad 12 cm).", val: 3 }] }
    ],
    results: {
      'pomade': { title: "VOLBA: VODNÍ POMÁDA", desc: "Potřebujete kontrolu a lesk. Pomáda udrží váš účes v perfektním tvaru po celý den.", advice: "Aplikujte do mírně vlhkých vlasů pro maximální lesk." },
      'paste': { title: "VOLBA: MATNÁ PASTA / JÍL", desc: "Hledáte moderní texturu a matný efekt. Pasta dodá vlasům hloubku bez zbytečného zatížení.", advice: "Produkt nejdříve pořádně rozetřete v dlaních, dokud se nezahřeje." },
      'salt-powder': { title: "VOLBA: SLANÁ VODA / PUDR", desc: "Váš cíl je objem a lehkost. Tyto produkty vlasy nezatíží a dodají jim 'plážový' charakter.", advice: "Slanou vodu stříkejte do vlhkých vlasů před fénováním." }
    }
  },
  {
    type: 'quality-check',
    title: 'Jak poznat kvalitu?',
    category: 'EXPERT',
    shortTitle: 'Kvalita',
    subtitle: 'Nenechte se opít marketingem',
    content: 'Rozdíl mezi prémiovým produktem a chemií z drogerie není jen v ceně, ale v molekulární struktuře a čistotě ingrediencí.',
    checks: [
      { t: 'Obsah vody', d: 'Levné produkty mají vodu na prvním místě jen jako plnidlo. Kvalitní věci obsahují hydrosoly nebo aloe šťávu.' },
      { t: 'Syntetické parfémy', d: 'Silná, chemická vůně často maskuje nekvalitní suroviny. Hledejte esenciální oleje.' },
      { t: 'Vymývatelnost', d: 'Prémiová pomáda by měla jít vymýt čistou vodou. Pokud potřebujete 3x šampon, je v tom příliš mnoho silikonů.' },
      { t: 'Původ surovin', d: 'Zajímejte se, kde byla kosmetika vyrobena. Malé šarže (batch production) zaručují čerstvost účinných látek.' }
    ]
  },
  {
    type: 'beard-styling',
    title: 'Architektura Vousů',
    category: 'STYLING',
    shortTitle: 'Vousy (Styling)',
    subtitle: 'Oleje, balzámy a vosky',
    content: 'Vousy nejsou jen delší chlupy na obličeji. Vyžadují specifickou chemii, protože pokožka pod nimi trpí nedostatkem kyslíku a hydratace.',
    products: [
      { t: 'Oleje na vousy', d: 'Základ pro každého. Hydratují pokožku (zastavují svědění) a změkčují vousy. Nezbytné pro zdravý růst.' },
      { t: 'Balzámy (Beard Butter)', d: 'Kombinace péče a stylingu. Obsahují včelí vosk a bambucké máslo. Dodají vousům objem a mírnou fixaci.' },
      { t: 'Vosky na knír', d: 'Pro ty, kteří chtějí mít knír pod kontrolou. Extrémně silná fixace pro precizní tvarování.' },
      { t: 'Mýdla na vousy', d: 'Nikdy nepoužívejte běžné mýdlo. Speciální mýdla na vousy nevysušují citlivou pokožku obličeje.' }
    ]
  },
  {
    type: 'shampoo-guide',
    title: 'Matrix Šamponů',
    category: 'EXPERT',
    shortTitle: 'Šampony',
    subtitle: 'Jak zvolit zbraně podle problému',
    content: 'Mytí je chemický proces. Pokud zvolíte špatný nástroj, můžete si pokožku poškodit na týdny dopředu.',
    matrix: [
      { p: 'Svědění a suchost', s: 'Šampon bez sulfátů s obsahem Urey nebo Panthenolu.', w: 'Vyhněte se parfémovaným produktům z drogerie.' },
      { p: 'Mastné vlasy (každý den)', s: 'Produkty s obsahem Kaolinu (jíl) nebo citrusových extraktů.', w: 'Nemyjte vlasy příliš horkou vodou, stimuluje maz.' },
      { p: 'Žluté lupy (Mastné)', s: 'Šampon s kyselinou salicylovou a protizánětlivými složkami.', w: 'Neškrábejte pokožku, hrozí zanesení infekce.' },
      { p: 'Slábnoucí vlasy', s: 'Kofeinová a biotinová tonika + stimulační šampony.', w: 'Výsledek uvidíte nejdříve po 3 měsících používání.' }
    ]
  }
];

export const MAGAZINE_EN = [
  {
    type: 'cover',
    title: 'CARE',
    category: 'MAGAZINE',
    shortTitle: 'Cover',
    subtitle: 'MMBARBER PROFESSIONAL CARE MAGAZINE',
    edition: '2026 EDITION / VOLUME I',
  },
  {
    type: 'editorial',
    title: 'Care Philosophy',
    category: 'MAGAZINE',
    shortTitle: 'Philosophy',
    content: 'True care is not about marketing, but about biology. Your skin is the body\'s largest organ, and hair/beard are its derivatives. In this issue, we look at how oils work, how to fight skin anomalies, and why care must change with the seasons.',
    quote: '„Quality is not an accident; it is the result of intelligent effort.“',
  },
  {
    type: 'alter-ego',
    title: 'Your Alter Ego',
    category: 'IDENTITY',
    shortTitle: 'Alter Ego (Test)',
    subtitle: 'Who hides beneath the surface?',
    questions: [
      { q: "What is your primary communication code?", options: [
        { text: "Direct, authoritative, without wasted words.", val: 1 }, 
        { text: "Tough, honest, I speak with actions.", val: 2 }, 
        { text: "Unpredictable, ironic, breaking conventions.", val: 3 }, 
        { text: "Polite, diplomatic, with emphasis on etiquette.", val: 4 }
      ]},
      { q: "Your ideal territory for a Saturday night?", options: [
        { text: "Rooftop bar with city views and expensive drinks.", val: 1 }, 
        { text: "A club where the bass hits and I feel the street pulse.", val: 2 }, 
        { text: "A studio, garage, or a place where I can create.", val: 3 }, 
        { text: "A classic lounge with a premium cigar.", val: 4 }
      ]},
      { q: "How do you react to authorities and rules?", options: [
        { text: "I am the authority that makes the rules.", val: 1 }, 
        { text: "I respect rules as long as they don't stand in my way.", val: 2 }, 
        { text: "Rules are for those who lack imagination.", val: 3 }, 
        { text: "Rules are the foundation of a civilized society.", val: 4 }
      ]},
      { q: "What defines your personal space?", options: [
        { text: "Minimalism, luxury, and absolute order.", val: 1 }, 
        { text: "Functionality, tech, and raw industrial.", val: 2 }, 
        { text: "Chaos, colors, and a collection of unique items.", val: 3 }, 
        { text: "History, tradition, and quality materials.", val: 4 }
      ]},
      { q: "What is your attitude towards technology?", options: [
        { text: "A tool for efficiency and market control.", val: 1 }, 
        { text: "My life is online, tech is my DNA.", val: 2 }, 
        { text: "I only use what gives me freedom.", val: 3 }, 
        { text: "Tech is a good servant, but a bad master.", val: 4 }
      ]}
    ],
    results: {
      boss: { 
        title: "PROFILE: THE ALPHA ARCHITECT", 
        desc: "You are a visionary who sees structures where others see chaos. Your presence in the room changes the atmosphere. You don't wait for opportunities; you take them.", 
        advice: "Your style requires absolute precision. No compromises.",
        haircut: "Executive Contour / Razor Fade Slick Back",
        beard: "Heavy Stubble (precisely contoured)",
        fragrance: "Oud, Saffron, Black Leather"
      },
      gangster: { 
        title: "PROFILE: URBAN PREDATOR", 
        desc: "The street is your home and you know its rhythm. You are loyal to your clan but ruthless to enemies. Your strength is in authenticity.", 
        advice: "You need a style that lasts the city's pace and looks tough even after 12 hours.",
        haircut: "High Skin Fade + Textured Fringe",
        beard: "Boxed Beard (sharp lines)",
        fragrance: "Gunpowder, Sea Salt, Dark Woods"
      },
      outsider: { 
        title: "PROFILE: CREATIVE ANARCHIST", 
        desc: "You don't fit in and you don't want to. Your life is an experiment and your head is an idea factory. You are the one people look at, even when you aren't trying.", 
        advice: "Your style is an expression of freedom. Don't be afraid of extremes and naturalness.",
        haircut: "Long Taper / Messy Mullet / Natural Flow",
        beard: "Full Natural Beard (minimal grooming)",
        fragrance: "Cannabis, Patchouli, Pine Needle"
      },
      gentleman: { 
        title: "PROFILE: LEGACY GUARDIAN", 
        desc: "You guard values that are disappearing from the world. Honor, etiquette, and attention to detail are your armor. You are a pillar that others lean on.", 
        advice: "Elegance is not about being seen, but about being remembered. Go for the classic.",
        haircut: "Classic Side Part / Scumbag Fade",
        beard: "Clean Shave / Moustache Only",
        fragrance: "Lavender, Bergamot, Sandalwood"
      }
    }
  },
  {
    type: 'rituals',
    title: 'Global Rituals',
    category: 'MAGAZINE',
    shortTitle: 'Rituals',
    subtitle: 'History and traditions across the world',
    rituals: [
      { country: 'Italy', fact: 'Renaissance heritage and rosemary. Italian masters have used Rosmarinus officinalis (rosemary) macerate for centuries to stimulate scalp microcirculation.' },
      { country: 'Spain', fact: 'Protein ritual and citrus. Traditional Spanish care used egg yolks combined with fresh lemon juice to close the hair cuticle.' },
      { country: 'Greece', fact: 'Traditional post-sea bathing ritual. Greeks massage pure olive oil into hair and beard immediately after leaving the beach to displace salt.' },
      { country: 'Egypt', fact: 'Pharaoh\'s secret in the form of Nigella sativa (black cumin) oil. It has incredible anti-inflammatory effects for post-shave skin.' },
      { country: 'Scandinavia', fact: 'Birch water and temperature changes. Northerners use birch leaf infusion to strengthen roots and add shine.' },
      { country: 'Japan', fact: 'Hot towel ritual. Steaming to open pores and soften even the toughest beard.' }
    ]
  },
  {
    type: 'fragrance',
    title: 'Fragrance & Genetics',
    category: 'BIOLOGY',
    shortTitle: 'Fragrance',
    subtitle: 'Biometric profile and compatibility',
    content: 'Choosing a fragrance is not just about taste, but biological compatibility. Scientific studies confirm that our immune system (MHC complex) and genetic origin (ABCC11 gene) determine how a perfume smells on our skin.',
    profiles: [
      { origin: 'Northern / Nordic', skin: 'Thin, fair, dry', genetics: 'Lower apocrine gland activity', rec: 'Ozonic, aquatic and light citrus tones.' },
      { origin: 'Mediterranean / Olive', skin: 'Thicker, oilier, pigmented', genetics: 'High lipid production', rec: 'Woody, leather and deep amber scents.' },
      { origin: 'Oriental / Asian', skin: 'Combination, sensitive', genetics: 'Specific ABCC11 gene variant', rec: 'Green tea, jasmine, sandalwood.' }
    ],
    factors: [
      { t: 'MHC Complex', d: 'Your unique genetic code affects the composition of sebum and microflora.' },
      { t: 'Origin & Diet', d: 'People with Mediterranean origin tend to have oilier skin.' },
      { t: 'Compatibility Test', d: 'Experts recommend testing fragrance 3 hours after application.' }
    ]
  },
  {
    type: 'test',
    title: 'Biogenetic Profiler',
    category: 'BIOLOGY',
    shortTitle: 'Profiler (Test)',
    subtitle: 'Interactive analysis of your origin',
    questions: [
      { q: "What is your natural hair/beard color?", options: [{ text: "Blonde, red or light brown.", val: 1 }, { text: "Medium to dark brown.", val: 2 }, { text: "Black or very dark.", val: 3 }] },
      { q: "How does your skin react to the first spring sun?", options: [{ text: "Immediately turns red, almost no tan.", val: 1 }, { text: "Turns red first, then browns.", val: 2 }, { text: "Tans quickly and easily without burning.", val: 3 }] },
      { q: "What is the thickness of your individual hairs?", options: [{ text: "Fine, thin hair.", val: 1 }, { text: "Medium thickness.", val: 2 }, { text: "Thick, coarse hair.", val: 3 }] },
      { q: "What is the structure of your beard?", options: [{ text: "Soft, rather sparse.", val: 1 }, { text: "Firm, evenly growing.", val: 2 }, { text: "Very hard, curly or unruly.", val: 3 }] },
      { q: "What is your eye color?", options: [{ text: "Blue, green or gray.", val: 1 }, { text: "Hazel or light brown.", val: 2 }, { text: "Dark brown to black.", val: 3 }] },
      { q: "What is your ethnic origin (predominant)?", options: [{ text: "Northern / Central Europe.", val: 1 }, { text: "Southern Europe / Mediterranean.", val: 2 }, { text: "Middle East / Asia.", val: 3 }] }
    ],
    results: {
      borealis: { title: "PROFILE: BOREALIS", desc: "Your origin points to Northern and Central European lines. You have a finer skin and hair structure.", advice: "Choose fresh, woody and lightly spicy fragrances. Avoid heavy sweet perfumes." },
      meridionalis: { title: "PROFILE: MERIDIONALIS", desc: "Your profile bears signs of Mediterranean and continental influences. Skin is more resilient.", advice: "Citrus bases with a deep echo of leather or tobacco are ideal." },
      orientalis: { title: "PROFILE: ORIENTALIS", desc: "Your origin is associated with Southern and Oriental lines. You have high resilience and density.", advice: "Don't be afraid of bold, amber and spicy fragrances. Your skin can carry them." }
    }
  },
  {
    type: 'herbs',
    title: 'Herbal Medicine',
    category: 'HERBOLOGY',
    shortTitle: 'Herbs',
    subtitle: 'Nature\'s power in the fight for density',
    content: 'Traditional medicine, especially Chinese medicine (TCM), utilizes the power of plants to harmonize the organism. In TCM, hair is considered a „surplus of blood“. If blood is weak or stagnant, hair suffers.',
    herbs: [
      { n: 'He Shou Wu', f: 'Polygonum multiflorum', d: 'Legendary Chinese herb. It nourishes the liver and kidneys, strengthens blood, and traditionally restores original color to gray hair.' },
      { n: 'Saw Palmetto', f: 'Serenoa repens', d: 'Natural blocker of the 5-alpha-reductase enzyme. It reduces DHT levels in the skin, protecting follicles from miniaturization.' },
      { n: 'Reishi', f: 'Ganoderma lucidum', d: '„Mushroom of Immortality“. It has strong anti-inflammatory and antioxidant effects, stabilizing skin immune responses.' },
      { n: 'Nettle & Horsetail', f: 'Urtica dioica / Equisetum', d: 'Rich sources of silica and sulfur. They strengthen the hair structure and support collagen production.' }
    ]
  },
  {
    type: 'test-herbs',
    title: 'Herbal Profiler',
    category: 'HERBOLOGY',
    shortTitle: 'Herbs (Test)',
    subtitle: 'Which plant is the right one for you?',
    questions: [
      { q: "What is your main goal in hair/beard care?", options: [{ text: "Stop hair loss and increase density.", val: 1 }, { text: "Slow down graying and support pigmentation.", val: 2 }, { text: "Soothe the skin and remove inflammation.", val: 3 }] },
      { q: "How do you feel your overall life energy?", options: [{ text: "I'm often tired, feeling weak.", val: 1 }, { text: "Energy is normal, but I lack vitality.", val: 2 }, { text: "I feel heat, irritation, or stress.", val: 3 }] },
      { q: "What has your hair structure been like in recent years?", options: [{ text: "Thinning and weakening.", val: 1 }, { text: "Losing color (graying).", val: 2 }, { text: "Dry, brittle, and skin itches.", val: 3 }] }
    ],
    results: {
      'growth': { title: "RECOMMENDATION: SAW PALMETTO", desc: "Your profile suggests sensitivity to DHT. Saw Palmetto will help protect your roots.", advice: "Supplement with rosemary oil massages to support circulation." },
      'pigment': { title: "RECOMMENDATION: HE SHOU WU", desc: "You need to strengthen blood essence and nourish the liver. He Shou Wu is the ideal choice for you.", advice: "Combine with black sesame and Goji berries." },
      'soothing': { title: "RECOMMENDATION: REISHI & NETTLE", desc: "Your skin needs to be calmed and cleared of toxins. Reishi will support immunity and nettle will provide minerals.", advice: "Drink nettle tea in 3-week cycles and limit sugar." }
    }
  },
  {
    type: 'nutrition',
    title: 'Nutrition from Within',
    category: 'BIOLOGY',
    shortTitle: 'Nutrition',
    subtitle: 'Hair starts on the plate',
    content: 'Cosmetics solve consequences, but diet affects the cause. The hair follicle is one of the most active tissues in the body.',
    nutrients: [
      { n: 'Proteins (Keratin)', f: 'Eggs, lean meat, legumes.', d: 'Hair is made of protein. Protein deficiency leads to thinning of the hair fiber.' },
      { n: 'Omega-3 Fatty Acids', f: 'Fatty fish, walnuts, flax seeds.', d: 'They ensure internal skin hydration and give hair shine.' },
      { n: 'Zinc & Iron', f: 'Pumpkin seeds, beef, spinach.', d: 'Zinc prevents hair loss, iron ensures root oxygenation.' },
      { n: 'Biotin & Vitamin C', f: 'Egg yolks, citrus, peppers.', d: 'Biotin strengthens the structure, Vitamin C is essential for collagen production.' }
    ]
  },
  {
    type: 'test-trichology',
    title: 'Trichological Audit',
    category: 'BIOLOGY',
    shortTitle: 'Trichology (Test)',
    subtitle: 'In-depth analysis of follicle health',
    questions: [
      { q: "How do you feel scalp tension during the day?", options: [{ text: "Not at all, skin is flexible and tension-free.", val: 1 }, { text: "Occasional tension in temples or crown area.", val: 2 }, { text: "Frequent tension, feeling of 'tight' skin.", val: 3 }] },
      { q: "Do you notice increased hair loss during washing or combing?", options: [{ text: "Minimal, within normal range (up to 100 hairs).", val: 1 }, { text: "Slightly increased, more hair in the drain than before.", val: 2 }, { text: "Significant, hair remains on pillow and hands.", val: 3 }] },
      { q: "What is your hair density in temples and crown compared to the back?", options: [{ text: "Density is even across the whole head.", val: 1 }, { text: "Slight thinning in the temple area.", val: 2 }, { text: "Visible difference, skin shows through hair.", val: 3 }] },
      { q: "How often do you encounter micro-inflammations (pimples, red spots)?", options: [{ text: "Almost never.", val: 1 }, { text: "Occasionally, usually after stress or diet.", val: 2 }, { text: "Regularly, skin is sensitive and prone to inflammation.", val: 3 }] },
      { q: "What is your average stress level and sleep quality?", options: [{ text: "Low stress, quality sleep (7h+).", val: 1 }, { text: "Medium stress, occasional sleep issues.", val: 2 }, { text: "High stress, chronic lack of sleep.", val: 3 }] },
      { q: "Do you ever feel 'pain' in hair roots (trichodynia)?", options: [{ text: "Never felt it.", val: 1 }, { text: "Very rarely when changing hairstyle or hat.", val: 2 }, { text: "Often, skin hurts even with light touch.", val: 3 }] }
    ],
    results: {
      'stable': { title: "STATUS: OPTIMAL", desc: "Your trichological profile is stable. Follicles are well-nourished and the growth cycle is balanced.", advice: "Maintain your current routine. Focus on preventative massages to support microcirculation." },
      'warning': { title: "STATUS: LATENT RISK", desc: "Signs of follicle fatigue or barrier disruption detected. Growth phase may be weakened.", advice: "Increase mineral intake (Zinc, Magnesium) and include caffeine tonics for root stimulation." },
      'critical': { title: "STATUS: REQUIRES ATTENTION", desc: "Your profile shows signs of trichodynia and increased tissue stress. Risk of premature transition to shedding phase.", advice: "Consult your condition with a specialist. We recommend a deep treatment and radical reduction of stress factors." }
    }
  },
  {
    type: 'seasonal',
    title: 'Seasonal Cycle',
    category: 'HAIR',
    shortTitle: 'Cycle',
  },
  {
    type: 'test-hair',
    title: 'Diagnostics & Choice',
    category: 'HAIR',
    shortTitle: 'Hair (Test)',
    subtitle: 'Know your hair before you buy',
    content: 'You should choose shampoo primarily by scalp condition, while conditioner by the state of the lengths.',
    questions: [
      { q: "How quickly does your hair become 'heavy' and actually soak after wetting?", options: [{ text: "It takes a long time, water rather runs off in droplets.", val: 1 }, { text: "Normally, it's wet through in a while.", val: 2 }, { text: "Immediately, it soaks up water like a sponge.", val: 3 }] },
      { q: "How does your hair react to increased humidity (e.g., in the bathroom or in the rain)?", options: [{ text: "Hardly at all, it keeps its shape.", val: 1 }, { text: "It curls slightly or loses shine.", val: 2 }, { text: "It immediately frizzes and increases in volume.", val: 3 }] },
      { q: "Try to gently stretch the hair (between fingers). What happens?", options: [{ text: "It snaps immediately, can't be stretched at all.", val: 1 }, { text: "It stretches slightly and returns back.", val: 2 }, { text: "It stretches like a rubber band and then snaps.", val: 3 }] }
    ],
    results: {
      'low-porosity': { title: "LOW POROSITY", desc: "Your hair cuticle is tightly closed. Hair is resilient but hard to hydrate.", advice: "Use heat when applying masks. Avoid heavy oils.", focus: "Humectants (Glycerin, Aloe)." },
      'medium-porosity': { title: "MEDIUM POROSITY", desc: "Ideal state. Cuticle is slightly open, hair takes and holds moisture well.", advice: "Continue with regular maintenance. Occasional protein treatment keeps structure firm.", focus: "Balance (Hydration + Proteins)." },
      'high-porosity': { title: "HIGH POROSITY", desc: "Hair is damaged or genetically very 'open'. It soaks up water fast but loses it even faster.", advice: "Use acid rinses to close the cuticle. Oils and butters are a must.", focus: "Proteins and lipids (Keratin, Ceramides)." }
    }
  },
  {
    type: 'test-scalp',
    title: 'Skin Anomalies',
    category: 'SKIN',
    shortTitle: 'Skin (Test)',
    subtitle: 'When something is wrong',
    content: 'Many men confuse seborrheic dermatitis with common dandruff.',
    questions: [
      { q: "How often do you have to wash your hair/beard due to a feeling of oiliness?", options: [{ text: "Once every 4 days or less frequently.", val: 1 }, { text: "Every second to third day.", val: 2 }, { text: "Every day, otherwise it's visibly oily.", val: 3 }] },
      { q: "Do you experience itching, burning or tension of the skin during the day?", options: [{ text: "Almost never, skin is calm.", val: 1 }, { text: "Occasionally after washing or when stressed.", val: 2 }, { text: "Often, skin is sensitive and red.", val: 3 }] },
      { q: "Do scales (dandruff) appear in your hair? What do they look like?", options: [{ text: "I have no dandruff.", val: 1 }, { text: "Small, white and dry.", val: 2 }, { text: "Larger, yellowish and oily.", val: 3 }] }
    ],
    results: {
      'dry': { title: "DRY / SENSITIVE SKIN", desc: "Your skin produces little natural sebum.", advice: "Use gentle sulfate-free shampoos.", warning: "Watch out for hot water!" },
      'oily': { title: "BALANCED / OILIER", desc: "Sebum production is higher but within norm.", advice: "We recommend regular scalp peeling.", warning: "Don't overwash your hair too often." },
      'problematic': { title: "SEBORRHEIC / INFLAMMATORY PROFILE", desc: "Oily scales and itching can signify seborrheic dermatitis.", advice: "Use shampoos containing salicylic acid.", warning: "Visit a dermatologist if it worsens." }
    }
  },
  {
    type: 'expert',
    title: 'Science of Composition',
    category: 'SKIN',
    shortTitle: 'Composition',
    subtitle: 'What to look for in shampoos and oils?',
    content: 'Most commercial products contain cheap substitutes. Experts recommend focusing on functional substances that actually penetrate the hair structure.',
    sections: [
      { t: 'Suitable Ingredients', d: 'Look for Panthenol (hydration), Keratin (strength), Caffeine (root stimulation) and Aloe Vera (soothing).' },
      { t: 'PH Balance', d: 'Shampoo should have pH 4.5 – 5.5. Overly alkaline products open the hair cuticle.' },
      { t: 'What to Avoid', d: 'Parabens and phthalates disrupt hormonal balance. Mineral oils clog pores.' },
      { t: 'Washing Frequency', d: 'Washing hair daily is a myth. For most types, 2–3 times a week is enough.' }
    ]
  },
  {
    type: 'solutions',
    title: 'Customized Solutions',
    category: 'SKIN',
    shortTitle: 'Solutions',
    subtitle: 'Specific needs and expert help',
    content: 'Every organism reacts differently to external and internal changes. Here are key recommendations for specific situations supported by scientific studies.',
    categories: [
      { t: 'Women Postpartum', d: 'Hormonal changes lead to so-called telogen effluvium (excessive loss). Biotin, Collagen and shampoos with silica are recommended.' },
      { t: 'Men: Hair Loss', d: 'Look for active substances like Caffeine, Aminexil or Saw Palmetto extract, which naturally blocks DHT.' },
      { t: 'Dry & Itchy Skin', d: 'Ideal are products with Urea and Glycerin, which bind water in the skin.' },
      { t: 'Oily Skin', d: 'Salicylic acid is suitable, which gently cleans pores, or clay (Kaolin), which absorbs excess sebum without drying.' }
    ]
  },
  {
    type: 'shaving',
    title: 'Hygiene & Shaving',
    category: 'BEARD',
    shortTitle: 'Shaving',
    subtitle: 'Art of the razor and skin protection',
    content: 'Shaving is an invasive process for the skin. Proper procedure and consistent disinfection are the difference between a smooth face and irritation.',
    steps: [
      { t: 'Preparation (Steaming)', d: 'A hot towel (Hot Towel ritual) opens pores and softens the beard.' },
      { t: 'Disinfection & Alum', d: 'Alum is a natural mineral that immediately stops micro-bleeding and closes pores.' },
      { t: 'Head Shaver Care', d: 'When shaving the head smooth, the skin is sensitive. Use tonics containing witch hazel (Hamamelis).' },
      { t: 'Soothing', d: 'After shaving, always rinse face with cold water to close pores and apply alcohol-free balm.' }
    ]
  },
  {
    type: 'aftercare',
    title: 'Follow-up Care',
    category: 'BEARD',
    shortTitle: 'Care',
    subtitle: 'How to keep style even after leaving the salon',
    content: 'Your barber visit ends at the door, but care continues at home. Proper habits prolong the haircut\'s durability and keep skin healthy.',
    sections: [
      { t: 'Correct Hair Washing', d: 'Use lukewarm water. Hot water strips skin of sebum and opens the hair cuticle, leading to damage.' },
      { t: 'After Barber Visit', d: 'For the first 24 hours, try not to touch fresh haircut or shave with dirty hands.' },
      { t: 'Fresh Bedding', d: 'Pro tip: After every major shave or haircut, change the pillowcase.' },
      { t: 'Home Styling', d: 'Always ask your barber which product they used and how to apply it correctly.' }
    ]
  },
  {
    type: 'styling-guide',
    title: 'Styling Guide',
    category: 'STYLING',
    shortTitle: 'Styling',
    subtitle: 'Pomades, pastes, and salt sprays',
    content: 'The right styling product is like the last piece of a puzzle. Without it, the cut lacks structure and character. Each type of product is designed for a different purpose and hair type.',
    products: [
      { t: 'Water-based Pomades', d: 'Classic for slicked-back styles. High shine and strong hold. Easy to wash out.' },
      { t: 'Pastes and Clays', d: 'Versatile tools for texture and a matte look. Ideal for modern, messy hairstyles.' },
      { t: 'Salt Sprays', d: 'The foundation for volume. Gives hair a beach-like texture. Used as a pre-styling before blow-drying.' },
      { t: 'Hair Powders', d: 'Instant volume at the roots and an extreme matte effect. Great for fine hair.' }
    ]
  },
  {
    type: 'test-styling',
    title: 'Styling Algorithm',
    category: 'STYLING',
    shortTitle: 'Styling (Test)',
    subtitle: 'Find your ideal finish',
    questions: [
      { q: "What results are you looking for?", options: [{ text: "Slick, shiny, and elegant look.", val: 1 }, { text: "Natural, matte, and textured look.", val: 2 }, { text: "Maximum volume without feeling product in the hair.", val: 3 }] },
      { q: "How strong a hold do you require?", options: [{ text: "Extreme - hair must not move all day.", val: 1 }, { text: "Medium - I want to be able to restyle during the day.", val: 2 }, { text: "Light - I prefer natural movement.", val: 3 }] },
      { q: "What is your hair length?", options: [{ text: "Short (up to 5 cm).", val: 1 }, { text: "Medium (5-12 cm).", val: 2 }, { text: "Long (over 12 cm).", val: 3 }] }
    ],
    results: {
      'pomade': { title: "CHOICE: WATER POMADE", desc: "You need control and shine. Pomade will keep your style in perfect shape all day.", advice: "Apply to slightly damp hair for maximum shine." },
      'paste': { title: "CHOICE: MATTE PASTE / CLAY", desc: "You're looking for modern texture and a matte effect. Paste adds depth without unnecessary weight.", advice: "Rub the product thoroughly in your palms until it warms up before applying." },
      'salt-powder': { title: "CHOICE: SALT SPRAY / POWDER", desc: "Your goal is volume and lightness. These products won't weigh hair down and give it a 'beachy' character.", advice: "Spray salt spray into damp hair before blow-drying." }
    }
  },
  {
    type: 'quality-check',
    title: 'Identifying Quality',
    category: 'EXPERT',
    shortTitle: 'Quality',
    subtitle: 'Don\'t be fooled by marketing',
    content: 'The difference between a premium product and drugstore chemistry is not just in the price, but in the molecular structure and purity of ingredients.',
    checks: [
      { t: 'Water Content', d: 'Cheap products have water as the first ingredient just as a filler. Quality items contain hydrosols or aloe juice.' },
      { t: 'Synthetic Fragrances', d: 'Strong, chemical scents often mask low-quality ingredients. Look for essential oils.' },
      { t: 'Washability', d: 'A premium pomade should be washable with clear water. If you need 3 shampoos, there are too many silicones.' },
      { t: 'Source Origin', d: 'Care about where the cosmetics were made. Small batch production guarantees fresh active ingredients.' }
    ]
  },
  {
    type: 'beard-styling',
    title: 'Beard Architecture',
    category: 'STYLING',
    shortTitle: 'Beard (Styling)',
    subtitle: 'Oils, balms, and waxes',
    content: 'Beards are not just longer facial hair. They require specific chemistry because the skin underneath suffers from a lack of oxygen and hydration.',
    products: [
      { t: 'Beard Oils', d: 'The foundation for everyone. They hydrate the skin (stopping itching) and soften the beard. Essential for healthy growth.' },
      { t: 'Balms (Beard Butter)', d: 'A combination of care and styling. Contain beeswax and shea butter. Add volume and moderate hold.' },
      { t: 'Moustache Waxes', d: 'For those who want to keep their moustache under control. Extremely strong hold for precise shaping.' },
      { t: 'Beard Soaps', d: 'Never use regular soap. Special beard soaps don\'t dry out sensitive facial skin.' }
    ]
  },
  {
    type: 'shampoo-guide',
    title: 'Shampoo Matrix',
    category: 'EXPERT',
    shortTitle: 'Shampoos',
    subtitle: 'Choosing your weapons by the problem',
    content: 'Washing is a chemical process. If you choose the wrong tool, you can damage your skin for weeks ahead.',
    matrix: [
      { p: 'Itching and Dryness', s: 'Sulfate-free shampoo with Urea or Panthenol.', w: 'Avoid perfumed drugstore products.' },
      { p: 'Oily Hair (Daily)', s: 'Products containing Kaolin (clay) or citrus extracts.', w: 'Do not wash hair with hot water; it stimulates sebum.' },
      { p: 'Yellow Dandruff (Oily)', s: 'Shampoo with salicylic acid and anti-inflammatory ingredients.', w: 'Do not scratch the skin; there is a risk of infection.' },
      { p: 'Thinning Hair', s: 'Caffeine and biotin tonics + stimulating shampoos.', w: 'Results will be visible after at least 3 months of use.' }
    ]
  }
];

export const SEASONAL_CS = {
  winter: {
    title: "Zimní regenerace",
    desc: "Mráz a suchý vzduch v místnostech jsou největšími nepřáteli vašich vlasů a vousů. Během zimy dochází k uzavírání krevních kapilár v pokožce hlavy, což omezuje výživu kořínků.",
    tips: [
      "Používejte hutnější oleje s obsahem arganového oleje pro ochranu před mrazem.",
      "Omezte mytí horkou vodou – ta zbavuje pokožku přirozené lipidové bariéry.",
      "Vmasírujte tonika pro prokrvení pokožky hlavy po příchodu z venku."
    ]
  },
  spring: {
    title: "Jarní detox",
    desc: "Po zimě je potřeba pokožku zbavit odumřelých buněk a stimulovat růst. Jaro je obdobím obnovy, kdy folikuly přecházejí do aktivní růstové fáze.",
    tips: [
      "Proveďte jemný peeling pokožky hlavy pro lepší okysličení.",
      "Zvyšte příjem zinku a biotinu pro posílení struktury nového vlasu.",
      "Zkraťte délky, abyste odstranili zimou poškozené konečky."
    ]
  },
  summer: {
    title: "Letní ochrana",
    desc: "UV záření a slaná voda (či chlór) rozkládají keratin ve vlasu. Pokožka hlavy je v létě náchylná k dehydrataci a spálení.",
    tips: [
      "Používejte bezoplachové kondicionéry s UV filtrem.",
      "Po každém koupání v bazénu či moři vlasy ihned opláchněte sladkou vodou.",
      "Dodržujte pitný režim – hydratace vlasu začíná uvnitř."
    ]
  },
  autumn: {
    title: "Podzimní posílení",
    desc: "Na podzim často dochází k sezónnímu vypadávání vlasů. Tělo se připravuje na změnu teplot a vlasový cyklus se synchronizuje.",
    tips: [
      "Zaměřte se na masáže pokožky s kofeinovými toniky.",
      "Dopřejte vlasům hloubkovou hydratační kúru s bambuckým máslem.",
      "Noste čepice z přírodních materiálů, které pokožku nedusí."
    ]
  }
};

export const SEASONAL_EN = {
  winter: {
    title: "Winter Regeneration",
    desc: "Frost and dry indoor air are the biggest enemies of your hair and beard. During winter, blood capillaries in the scalp close, which limits root nutrition.",
    tips: [
      "Use denser oils containing argan oil for protection against frost.",
      "Limit washing with hot water – it strips the skin of its natural lipid barrier.",
      "Massage tonics to stimulate scalp circulation after coming in from the cold."
    ]
  },
  spring: {
    title: "Spring Detox",
    desc: "After winter, it's necessary to rid the skin of dead cells and stimulate growth. Spring is a period of renewal when follicles transition into an active growth phase.",
    tips: [
      "Perform a gentle scalp scrub for better oxygenation.",
      "Increase intake of zinc and biotin to strengthen new hair structure.",
      "Shorten lengths to remove winter-damaged ends."
    ]
  },
  summer: {
    title: "Summer Protection",
    desc: "UV radiation and salt water (or chlorine) break down keratin in the hair. The scalp is prone to dehydration and sunburn in summer.",
    tips: [
      "Use leave-in conditioners with UV filters.",
      "Rinse hair with fresh water immediately after every swim in the pool or sea.",
      "Maintain hydration – hair hydration starts from within."
    ]
  },
  autumn: {
    title: "Autumn Strengthening",
    desc: "Seasonal hair loss often occurs in autumn. The body prepares for temperature changes and the hair cycle synchronizes.",
    tips: [
      "Focus on scalp massages with caffeine tonics.",
      "Treat hair to a deep moisturizing treatment with shea butter.",
      "Wear hats made of natural materials that don't suffocate the skin."
    ]
  }
};
