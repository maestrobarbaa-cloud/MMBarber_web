export interface BarberProfile {
  id: string;
  name: string;
  role: string;
  image: string;
  desc: string;
  schedule: string;
  bookingSystemType?: string;
  bookingLink?: string;
  staticDesc?: string;
  stats?: string[];
  story?: string;
  medals?: string[];
  motto?: string;
  specializations?: string[];
  favorites?: string;
  isHidden?: boolean;
  missionFailed?: boolean;
  unlockThreshold?: number;
  symbol: string;
  rank?: {
    level: number;
    title: string;
    status?: 'promoted' | 'demoted' | 'stable' | 'demotedDesertion';
    nextRankIn?: string;
  };
}

export const TOMAS_QUOTES: string[] = [
  "Nic nestojí samo. Ani to, co tak vypadá.",
  "Každá věc má svůj konec někde jinde.",
  "Svět není ze spojení. Svět je spojení.",
  "To, co spolu nesouvisí, jen ještě neznáme.",
  "Všechno se dotýká všeho, jen ne vždycky ve stejný čas.",
  "Mezi dvěma věcmi je vždycky něco třetího.",
  "Náhoda je jméno pro souvislost, kterou zatím nevidíme.",
  "I věci, které se nikdy nepotkaly, mají společný příběh.",
  "Nic není oddělené, jen některé souvislosti jsou příliš tiché.",
  "Svět drží pohromadě věcmi, které spolu zdánlivě nesouvisí.",
  "To, co vypadá jako náhoda, možná jen nezná své jméno.",
  "Každá věc je začátkem něčeho, co ještě nevidíme.",
  "Mezi ničím a vším vede víc cest, než dokážeme spočítat.",
  "Všechno se něčeho dotýká, i když přes nekonečno.",
  "Možná jsme se nepotkali ve správný čas, ale ve správném příběhu.",
  "Jsou lidé, jejichž nepřítomnost má větší přítomnost než většina lidí.",
  "Někdy si dva lidé nejsou souzeni navždy, ale jen na tak dlouho, aby se navzájem změnili.",
  "Nejzvláštnější na některých lidech je, že odejdou z místnosti, ale ne z myšlenek.",
  "Některé vztahy se nerozbijí. Jen přestanou mít kam růst.",
  "Potkali jsme se jako cizí lidé a rozešli se jako vzpomínka.",
  "Někdy se dva lidé najdou právě proto, aby zjistili, proč se hledali.",
  "Možná nejde o to, kdo zůstane, ale o to, kdo v nás zůstane.",
  "Možná po člověku nezůstane to, co udělal, ale to, co v někom změnil.",
  "Člověk odchází dřív, než zmizí jeho stopa.",
  "Jednou po nás zůstanou jen věci, které jsme změnili v druhých.",
  "Nezůstává po nás to, co jsme měli, ale to, co jsme v někom zanechali.",
  "Až jednou nebudeme, budou po nás žít věci, o kterých ani nebudeme vědět.",
  "Možná je život jen o tom, co po sobě necháme v cizích příbězích.",
  "Po některých lidech zůstane prázdno. Po jiných člověk, kterým jsme díky nim.",
  "Na konci nezáleží, kolik času jsme měli, ale kolik života po nás zůstalo v ostatních.",
  "Některé stopy nejsou vidět na cestě, ale v lidech, kteří po ní jdou dál.",
  "Možná neumíráme tehdy, když odejdeme, ale tehdy, když po nás přestane něco pokračovat.",
  "Kdo ovládne jiné, získá moc. Kdo ovládne sebe, získá svobodu.",
  "Největší bitvy se nevedou před očima lidí.",
  "Člověk pozná svou sílu až ve chvíli, kdy ji nemusí nikomu dokazovat.",
  "Láska člověka nepřipoutá. Ukáže mu, ke komu se chce vracet.",
  "Některá setkání jsou krátká, protože jejich smysl není zůstat, ale změnit.",
  "Kdo někoho opravdu miloval, nenese jeho odchod. Nese jeho část.",
  "Někdy člověk ztratí druhého, aby poznal, co v něm zanechal.",
  "Jméno může zmizet z kamene, ale nemusí zmizet z paměti.",
  "Člověk odchází jednou. Jeho vliv může odcházet po staletí.",
  "Když člověk pozná celý svět, teprve potom zjistí, že nejméně znal sebe.",
  "Osud není cesta před námi. Je to stopa, kterou za sebou poznáme až na konci.",
  "Co nazýváme náhodou, může být jen souvislost, která ještě nezná své místo.",
  "Svět si nepamatuje všechny naše kroky. Pamatuje si, co se kvůli nim změnilo.",
  "Každý člověk je chvílí v životě druhého a celý život ve svém vlastním."
];

export const TOMAS_QUOTES_EN: string[] = [
  "Divide et impera.",
  "Vires acquirit eundo.",
  "Memento mori.",
  "Labor omnia vincit.",
  "I'm teaching you humility.\nTowards customers... and life.",
  "You might feel you know everything.\nThat you're experienced.\nBut the truth is elsewhere.",
  "You know almost nothing yet.\nAnd that's okay.\nBecause you have a chance.",
  "Don't waste it. Work hard. Train.\nYou have the conditions here.",
  "One more thing...\nDon't ask for big money\nuntil you've mastered everything.",
  "Experience cannot be bypassed.\nYou have to earn it.",
  "Don't rely on others' wisdom.\nMost people just talk.\nYou must do."
];

export const TOMAS_CHAIR_GREETINGS_CS = [
  "Tak dámíčky, kterou dneska ostříháme?",
  "Další princezna na řadě, prosím.",
  "Posaď se, zlato. Uděláme tě k světu.",
  "Tak co, kočko, jen konečky?",
  "Neboj, fešáku, budeš krásnej.",
  "Ježiši, kdo ti to udělal? Ukaž, zachráníme to.",
  "Tak povídej, brečel jsi, když tě stříhali naposledy?",
  "Klid, nic necítíš. To je normální.",
  "Tohle nebude střih. Tohle je záchranná operace.",
  "Přišel ses ostříhat, nebo se jen pochlubit tím neštěstím na hlavě?",
  "Tak ukaž ten skalp, než si to rozmyslím.",
  "Vypadáš dobře. To mě trochu sere, budu se muset snažit.",
  "Kolik ti zaplatili, aby ses takhle ukázal mezi lidma?",
  "Tak co dneska? Jako člověk, nebo zase experiment?",
  "Neboj, maminka tě pozná.",
  "Ty vole, tohle ani policie nechtěla vyšetřovat.",
  "Posaď se. Horší už to být nemůže.",
  "Kdo je poslední? Ať si sundá tu mrtvou veverku z hlavy.",
  "Tak šampónek připravený? Jdeme na to, princezno.",
  "Kdyby vlasy mohly mluvit, ty tvoje by volaly o pomoc.",
  "Podívejme, kdo ještě neskončil v base.",
  "Nazdar, krasavče. Zase tě pustili mezi lidi?",
  "Ty žiješ? Já už tě odepsal.",
  "Přišel ses ostříhat, nebo jen zkontrolovat, jestli ještě dýchám?",
  "Tak co, šéfe, dneska střih nebo svědecká ochrana?",
  "Vidím, že ses celou cestu vyhýbal zrcadlům. Správně.",
  "No sláva. Už jsem myslel, že tě ostříhá konkurence."
];

export const CHAIR_GREETINGS_CS = [
  "Trůn barbera",
  "Sedni. Změň se.",
  "Respekt začíná tady",
  "Ticho před proměnou",
  "Křeslo pro bossy",
  "Není to střih. Je to upgrade.",
  "Místo, kde se začíná změna",
  "Sedni si jako boss",
  "Klid. Ostří. Výsledek.",
  "Tady se rodí styl",
  "Bez řečí. Jen práce.",
  "Nový level začíná tady"
];

export const CHAIR_GREETINGS_EN = [
  "Barber's throne",
  "Sit down. Change.",
  "Respect starts here",
  "Silence before transformation",
  "Chair for bosses",
  "It's not a cut. It's an upgrade.",
  "The place where change begins",
  "Sit down like a boss",
  "Calm. Edge. Result.",
  "Style is born here",
  "No talk. Just work.",
  "New level starts here"
];
