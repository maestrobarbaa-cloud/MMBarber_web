export interface DaimonResponse {
    text: string;
    isVulgar: boolean;
    isInsultingTomas?: boolean;
}

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const getTomasExperience = () => {
    const startDate = new Date(2019, 8, 1);
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    if (months < 0) {
        years--;
        months += 12;
    }
    if (years === 1) return '1 ROK';
    if (years >= 2 && years <= 4) return `${years} ROKY`;
    return `${years} LET`;
};

export function isAprilFools(): boolean {
    const today = new Date();
    return today.getMonth() === 3 && today.getDate() === 1; // Month is 0-indexed (3 = April)
}

export function getDaimonName(): string {
    if (!isAprilFools()) return 'Daimon';
    
    const names = ['Žán', 'Žakuj', 'Bídný červ', 'Holomek', 'Pacholek', 'Darebák', 'Poseroutka'];
    return names[Math.floor(Math.random() * names.length)];
}

export function getDaimonResponse(userText: string, strikes: number): DaimonResponse {
    const lowerText = userText.toLowerCase();

    if (isAprilFools()) {
        const apologies = [
            "Poníženě se vám omlouvám, snad mě nepotrestá můj pán...",
            "Prosím za odpuštění, hned to vyřídím. Jen ať to nezjistí pan Tomáš...",
            "Padám k vašim nohám, udělám co budete chtít. Jen mě prosím nebijte...",
            "Odpusťte tomuto červovi! Vyřídím vše, co si jen budete přát.",
            "Já ubožák se moc omlouvám, hned vám posloužím. Můj pán by mě jinak ztrestal."
        ];
        return { text: apologies[Math.floor(Math.random() * apologies.length)], isVulgar: false };
    }

    // 1. Vulgarity check first
    if (lowerText.match(/\b(kurv|pič|píč|zmrd|debil|kret|kréť|idiot|hovn|prdel|mrd|kokot|buzn|buzer|čubk|děvk|kripl|magor|blb|čur|čúr|chuj|srač|sráč|šulin|vypatl|šmejd)\b/i) || lowerText.match(/(kurv|pič|píč|zmrd|debil|kret|kréť|idiot|hovno|prdel|mrd|kokot|buzn|buzer|čubk|děvk|kripl|magor|blb|čur|čúr|chuj|srač|sráč|šulin|vypatl|šmejd)/i)) {
        
        // Insulting Tomáš directly?
        if (lowerText.match(/(tomáš|tomas|don|majitel|šéf|boss|holič|barber)/i)) {
            return {
                text: "V pořádku, vyplač se. Ale radím ti být spíš potichu. Můj pán to zrovna neslyší rád. Sám o sobě kritiku snese, ale musíš mít oprávněný důvod jej urazit. Jinak bych ti doporučil být radši potichoučku.",
                isVulgar: true,
                isInsultingTomas: true
            };
        }

        let reply = "";
        if (strikes === 0) {
            reply = "Zkoušíš mou trpělivost? Považuj tohle za své první varování. „S prázdnou hlavou naděláš nejvíc hluku.“ Chovej se slušně.";
        } else if (strikes === 1) {
            reply = "Tohle byl tvůj druhý přešlap. Běž si léčit komplexy jinam. Ještě jedna podobná zpráva a letíš odtud. „Na hloupou otázku, hloupá odpověď.“";
        } else {
            reply = "Tak a dost.";
        }
        return { text: reply, isVulgar: true };
    }

    const intents = [
        {
            keywords: ["cena", "stojí", "ceník", "kolik", "platí", "platba"],
            responses: [
                "Cena se odvíjí od času, který v křesle strávíš. Uvedené ceny jsou orientační, všechno je to o domluvě. Za odstřihnutí jednoho vlasu si od tebe pětikilo fakt nevezmeme 😄 Mrkni do rezervačního systému: https://mm.inthechair.com/micka",
                "Jedeme na časový tarif, takže záleží, co všechno budeme dělat. Ceny jsou vždy orientační a jde o domluvu – neboj, za zastřihnutí jednoho vousu ti 500 Kč nenaúčtujeme. Přesnější odhad najdeš u Tomáše v rezervačním systému: https://mm.inthechair.com/micka",
                "Cena se počítá podle času a vše je o domluvě. Ceník je orientační, takže fakt neplatíš pětikilo za ustřihnutí jednoho vlasu. Hoď oko na náš rezervační systém, tam je všechno černé na bílém: https://mm.inthechair.com/micka"
            ]
        },
        {
            keywords: ["rezervace", "objednat", "zrušit", "termín", "místo"],
            responses: [
                "Všechny rezervace si řeší sám Don Tomáš ve svém systému. Tam najdeš volné termíny a můžeš si vybrat, co přesně chceš: https://mm.inthechair.com/micka",
                "Jasně, jestli hledáš termín, nejrychlejší je kliknout na rezervační systém. Všechno si tam vybereš a naklikáš sám: https://mm.inthechair.com/micka"
            ]
        },
        {
            keywords: ["storno", "zrušení", "zpoždění", "pozdě", "nepřijdu", "nestíhám", "podmínky"],
            responses: [
                "V pohodě, stát se to může. Ale rezervaci musíš zrušit nejpozději 2 hodiny předem. Pokud to zrušíš později nebo nedorazíš, účtujeme si storno až do výše 100 %. A jestli se zdržíš víc jak 15 minut, možná to budeme muset zkrátit nebo zrušit.",
                "Pravidla jsou jasná: ruší se maximálně 2 hoďky předem, jinak to může stát plnou palbu. Když máš zpoždění víc jak 15 minut, je reálné, že už to nestihneme."
            ]
        },
        {
            keywords: ["kde", "adresa", "najdu", "lokace", "sídlí", "město", "uherské hradiště", "mařatice", "vypadá", "bouda"],
            responses: [
                "Najdeš nás v Uherském Hradišti – Mařaticích. Vypadá to zvenku jako taková bouda, ale nesuď knihu podle obalu. Jak vejdeš dovnitř, hned poznáš její kouzlo. Adresa je tady na webu v Kontaktech.",
                "Sídlíme v Mařaticích. Zvenku to sice může působit jako bouda, ale to kouzlo a luxus čeká uvnitř. Nesuď podle vzhledu. Mrkni do sekce Kontakt pro přesnou mapu."
            ]
        },
        {
            keywords: ["vloupat", "vykrást", "ukrást", "vybavení", "zloděj", "zabezpečení", "alarm", "krádež"],
            responses: [
                "Zajímá tě, co tam máme za vybavení? Je tam docela dobrý systém na likvidaci divé zvěře. Pan majitel totiž rád chodí lovit takové kousky, jako jsi ty. Říká tomu 'hon na kance'. Většinou si ho uštvou – a je jedno jak... psychicky, fyzicky... hlavně, že se kluci jedni baví.",
                "Chceš se tam podívat po zavíračce? Máme tam dost kvalitní systém na odchyt škodné. Don Tomáš to bere jako sport – říká tomu hon na kance. Uštvou ho, buď psychicky nebo fyzicky. Hlavní je, že se u toho kluci vždycky dobře pobaví. Zkus to a uvidíš sám."
            ]
        },
        {
            keywords: ["tomáš", "tomas", "majitel", "don", "boss", "šéf", "sef", "kdo je tomáš", "něco o tomášovi"],
            responses: [
                "Don Tomáš... to je příběh sám o sobě. Renesanční člověk, co si sám programuje weby, vystudoval kadeřníka, elektrotechniku i sociální pedagogiku. Není gay a nemá žádné tetování. Občas rád hraje hlupáka, ale jeho prostorová inteligence a chápání složitých struktur jsou extrémní. V klasických IQ testech pohořívá z jediného důvodu – u každé otázky vidí tolik různých řešení, že mu zkrátka vyprší čas. Má vytříbený hudební sluch a když ho něco nadchne, jde do toho naplno. Lidé ho mají rádi a umí se bavit s kýmkoliv, ale uvnitř je opatrný. Nikomu nevěří a od žen si drží obzvlášť velký odstup – vždy má tunelové vidění jen na jednu jedinou. Když ho potkáš a on nepozdraví, neber si to osobně; většinou usilovně přemýšlí.",
                "Ptáš se na našeho bosse? Tomáš je komplikovaný vůdce, který chodí vždy proti davu a nikoho se neprosí. Pokud něco potřebuje, zařídí si to po svém. Jeho život poznamenala velká zrada od někoho, kdo pro něj znamenal všechno na jeho cestě. Dnes kvůli tomu kouří, aby tu bolest utlumil, i když ten pach sám nesnáší. Věří ve vyšší moc a jeho DNA v sobě skrývá zajímavé věci, ze kterých si dřív dělal jen legraci – dokud se nezačaly potvrzovat. Je svým pánem, snaží se všem pomoct, ale je tak zavalený prací, že nemůže být pro všechny. Umí plynule přepínat mezi introvertem a extrovertem. A pamatuj u něj na jedno: věk pro něj rozhodně není známkou inteligence ani zkušeností."
            ]
        },
        {
            keywords: ["žen", "dám", "barv", "holk", "přítelkyn", "manželk", "přítel", "manžel"],
            responses: [
                "Jasně, bereme i dámy. Tomáš zvládá precizní dámské střihy i profi barvení vlasů. Žádný stres.",
                "U nás se nedělají rozdíly. Dámy jsou vítány, Tomáš je mistr i na dámské střihy a kompletní barvení."
            ]
        },
        {
            keywords: ["tvůrce", "kdo dělal", "kdo vytvořil", "kdo programoval", "stránky", "web"],
            responses: [
                "To byl můj pán. Nejenže umí s nůžkami, ale tenhle web si postavil úplně sám.",
                "Kdo dělal tenhle web? Můj pán. Mistr přes vlasy i přes kód."
            ]
        },
        {
            keywords: ["vlas", "účes", "střih", "fade", "mullet", "crop", "krátký", "delší"],
            responses: [
                "To zní dobře. Ať už chceš skin fade zkrácený úplně na kůži, texturovaný crop, nebo nechat vršek trochu delší, zvládneme to. Jestli nevíš, co vybrat, popiš mi to a poradím.",
                "Jasně. Děláme klasiku, mid fade, high fade, klidně i delší vlasy a pompadour. Jestli váháš, mrkni na rezervační systém, ať víme, kolik na to potřebujeme času."
            ]
        },
        {
            keywords: ["vous", "holení", "plnovous", "bradka", "knír", "hot towel", "břitva", "vousy"],
            responses: [
                "O vousy se postaráme jako králové. Zvládneme všechno od zastřižení až po pořádné holení břitvou s metodou Hot Towel (horký ručník). Doma nezapomínej mazat olejem!",
                "Vousy jsou základ. Uděláme ti perfektní úpravu nebo napaření vousů s Hot Towel. Podle toho, kolik máš na obličeji porostu, to vezme nějaký čas."
            ]
        },

        // ─── ODBORNÉ ZNALOSTI – FADERY A STŘIHY ────────────────────────
        {
            keywords: ["low fade", "low", "nízký fade", "přechod dole"],
            responses: [
                "Low fade začíná těsně nad ušima a přirozenou linií vlasů – je nejsubtilnější a nejkonzervativnější varianta. Super pro kancelář nebo jestli chceš zachovat víc vlasů po stranách. Nenápadně elegantní.",
                "Nízký fade je základ. Přechod do ztracena začíná nízko, těsně nad uchem. Výsledek je čistý, ale ne agresivní. Ideál pro ty, co nechtějí příliš výrazný kontrast."
            ]
        },
        {
            keywords: ["mid fade", "střední fade", "přechod uprostřed"],
            responses: [
                "Mid fade – přechod začíná někde u úrovně spánků. Nejuniverzálnější varianta, funguje na skoro každý tvar hlavy a do každé příležitosti. Není ani moc jemný, ani moc agresivní.",
                "Střední fade je zlatá střední cesta. Blend začíná uprostřed stran, výsledek je moderní a dá se nosit v práci i na párty. Tohle je asi nejčastější věc, co tady děláme."
            ]
        },
        {
            keywords: ["high fade", "vysoký fade", "přechod nahoře", "skin fade", "nula", "bald fade"],
            responses: [
                "High fade nebo skin fade – to je ostrý kontrast. Přechod začíná vysoko, klidně nad spánky, a dole může jít až na kůži (skin fade = nula). Výsledek je výrazný, moderní a trochu agresivní v tom nejlepším smyslu.",
                "Skin fade znamená, že blend jde doslova až na holou kůži. Low skin fade, mid skin fade nebo high skin fade – záleží, kde ten blend začíná. Pokud nevíš, přines fotku a hned se domluvíme."
            ]
        },
        {
            keywords: ["buzz cut", "holá hlava", "na nulu", "strojek"],
            responses: [
                "Buzz cut – to je čistá síla. Celá hlava na jeden guard, výsledek je uniformní a nízkoúdržbový. Podle čísla guardu dostaneš různou délku. Jednička je téměř holá, čtyřka už nechá citelnou délku.",
                "Na nulu nebo téměř na nulu – to je buzz cut. Minimální péče, maximální efekt. Ideál pro ty, co nechtějí řešit styling každé ráno."
            ]
        },
        {
            keywords: ["textur", "crop", "texture", "french crop"],
            responses: [
                "Texturovaný crop je momentálně jeden z nejpopulárnějších pánských střihů. Krátký na stranách (většinou mid nebo high fade), nahoře délka s mačkanou texturou a rovnou nebo nakloněnou přední linií. Moderní, snadno stylizovatelný.",
                "Crop top haircut – typicky fade nebo taper po stranách, nahoře kratší délka tvarovaná do přirozené textury. S trochou pudru nebo matné hlíny ráno to vypadá jako z časopisu."
            ]
        },
        {
            keywords: ["pompadour", "quiff", "slick back", "namazaný", "retro", "rockabilly"],
            responses: [
                "Pompadour – klasika ze 50. let, dnes zpátky v módě. Delší vršek česaný nahoru a dozadu, přísně faded strany. Pro tohle potřebuješ aspoň 5–8 cm nahoře a silnější fixaci, třeba pomádu na vodní bázi.",
                "Slick back nebo Quiff – podobný princip jako pompadour, ale vlasy jedou dozadu nebo mírně do strany. Ideál pro silnější vlasy. Stylový a nadčasový."
            ]
        },
        {
            keywords: ["mullet", "undercut", "mohyk", "mohawk"],
            responses: [
                "Mullet je zpátky a tentokrát jako fashion statement, ne jako trapný vtip z 80. let. Krátký vršek, delší vzadu – dnes kombinovaný s fadem po stranách. Kdo se nebojí, vypadá skvěle.",
                "Undercut – delší vršek, holé nebo velmi krátké strany bez přechodu (tvrdá linie). Výrazný kontrast. Pokud chceš undercut s fadem nebo bez, řekni a doladíme to."
            ]
        },
        {
            keywords: ["tvar hlavy", "tvar obličeje", "kulatý obličej", "oválný", "hranatý", "kosočtverec", "jaký střih"],
            responses: [
                "Tvar hlavy a obličeje hodně určuje, co ti bude sedět. Oválný obličej – prakticky cokoliv. Kulatý – lepší je výška nahoře (fade + quiff), aby hlava nevypadala ještě kulatěji. Hranatý – měkčí přechody. Říkej mi víc a poradím.",
                "Obecné pravidlo: chceš vytvořit iluzi oválu. Proto ke kulatému obličeji přidáváme výšku nahoře, ke čtvercovému změkčujeme linie. Přijď a na místě to vyřešíme – zrcadlo vždy řekne víc než popis."
            ]
        },

        // ─── VLASY – STRUKTURA A PÉČE ────────────────────────────────────
        {
            keywords: ["struktura vlasů", "z čeho jsou vlasy", "keratin", "kortiex", "kutikula", "medula", "melanin"],
            responses: [
                "Každý vlas má tři vrstvy. Kutikula je vnější ochranná vrstva z překrývajících se šupinek – právě ta dává vlasům lesk nebo matnost podle stavu. Kortex tvoří jádro vlasu, obsahuje melanin (pigment, co určuje barvu) a dává vlasům pružnost. Medula je vnitřní jádro, nejčastěji v silných vlasech.",
                "Vlasy jsou z 95 % keratin – bílkovina podobná té v nehtech. Zdravý vlas má kutikulu hladkou jako ryby šupiny, vlhkost drží uvnitř a lesk se krásně odráží. Poškozená kutikula je jako rozlomená šupina – vlasy pak vypadají matně, lámou se a do ruky se chytají."
            ]
        },
        {
            keywords: ["silné vlasy", "husté vlasy", "jemné vlasy", "tenké vlasy", "vlnité", "kudrnaté"],
            responses: [
                "Jemné vlasy – potřebují objem. Pudr nebo lehká pěna je víc jejich kamarád než těžký vosk. Silné husté vlasy zvládnou matnou hlínu nebo pomádu s vysokou fixací. Vlnité a kudrnaté vlasy mají vlastní pravidla – hydratace je základ.",
                "Typ vlasů hodně ovlivní výběr produktu i techniku střihu. Na jemných vlasech nedělej příliš velký objem – může to vypadat jako nafouklý balón. Na husté vlasy naopak potřebuješ techniku odlehčení, jinak to nahoře stojí jak stan."
            ]
        },
        {
            keywords: ["vypadávání vlasů", "padají vlasy", "lysina", "alopecia", "plešivost", "vlasová linie", "recidiva"],
            responses: [
                "Vypadávání vlasů má mnoho příčin – stres, genetika, hormonální změny, výživa nebo i agresivní péče. Nejčastější je androgenetická alopecia (vzorové plešivění) – to je z 80 % genetika a DHT hormon. Pokud padají vlasy rapidně nebo v skvrnách, tohle je věc pro dermatologa, ne pro mě.",
                "Malé vypadávání vlasů (100–150 denně) je normální. Problém začíná, když přestávají dorůstat nebo padají v skvrnách. Stres, nedostatek železa, vitaminu D nebo zinku – to jsou nejčastější spouštěče. Poraď se s lékařem, než začneš sáhat po přípravcích."
            ]
        },
        {
            keywords: ["šampon", "kondicionér", "mytí vlasů", "jak mýt", "sulfáty", "silikoně"],
            responses: [
                "Šampon čistí, kondicionér hydratuje a uzavírá kutikulu. Pro denní mytí vyber šampon bez sulfátů – ty agresivní odplavují přirozené oleje a pokožku přesušují. Kondicionér nanášej jen na délky, ne na kořeny.",
                "Vlasy nemusíš mýt každý den – pro většinu lidí stačí 2–4x týdně. Časté mytí horkou vodou přesušuje pokožku hlavy a stimuluje tvorbu mazu, takže vlasy mastnou rychleji – začarovaný kruh. Vlažná voda, šetrný šampon, dobrý kondicionér. Tak jednoduché to je."
            ]
        },

        // ─── POKOŽKA HLAVY – PROBLÉMY ───────────────────────────────────
        {
            keywords: ["lupy", "lup", "bílé vločky", "šupinatá hlava", "suchá pokožka"],
            responses: [
                "Lupy jsou nejčastěji způsobeny kvasinkou Malassezia, která žije přirozeně na pokožce každého. Problém nastane, když se přemnoží. Suché bílé vločky = spíš suchá pokožka. Mastné nažloutlé šupiny = seborrheická dermatitida, závažnější případ. Na běžné lupy pomohou šampony se zinkem, ketokonazolem nebo kyselinou salicylovou.",
                "Na lupy: nejdřív zkus šampon s aktivní látkou jako pyrithion zinku nebo ketokonazol, nech ho pár minut působit. Vyhni se horké vodě, přesušování a agresivním přípravkům ze supermarketu. Pokud to přetrvává víc jak měsíc i s léčbou, čas k dermatologovi."
            ]
        },
        {
            keywords: ["seborrheická", "seborrhea", "mastná pokožka", "záněty pokožky", "dermatitida"],
            responses: [
                "Seborrheická dermatitida je chronický zánět pokožky spojený s přemnoženou kvasinkou Malassezia. Projevuje se červenými, šupinatými oblastmi – nejen na hlavě, ale i na obočí, po stranách nosu nebo ušních boltcích. Léčba: medikované šampony, v těžších případech kortikosteroidy – to ale předepíše lékař.",
                "Seborrhea není nakažlivá a nedá se úplně vyléčit, ale jde zvládnout. Pravidelné používání šamponu s ketokonazolem nebo pyrithionem zinku drží příznaky pod kontrolou. Stres, mastná jídla a horko to zhoršují."
            ]
        },
        {
            keywords: ["svědit", "svědění", "škrábání", "podráždění hlavy", "citlivá pokožka"],
            responses: [
                "Svědění pokožky hlavy může mít víc příčin: sucho, lupy, alergická reakce na produkt nebo kontaktní dermatitida. Zkus vyměnit šampon za hypoalergenní bez parfémů a sulfátů. Jestli svědění přetrvává nebo se přidá vyrážka – to je věc pro dermatologa.",
                "Citlivá pokožka na hlavě = méně je více. Vyhni se produktům plným alkoholu, parfémů a agresivních detergentů. Chladnější voda při mytí pomáhá zklidnit podráždění."
            ]
        },
        {
            keywords: ["psoriáza", "lupénka", "ekzém"],
            responses: [
                "Psoriáza na pokožce hlavy se projevuje silnými stříbrnými šupinami a zarudnutím. Není nakažlivá. Jde o autoimunitní onemocnění – tělo napadá vlastní kůži. Léčba je věc pro dermatologa, ale barber může pomoci šetrným přístupem a vhodnými produkty. Vždycky nás před návštěvou informuj.",
                "S ekzémem nebo lupénkou na hlavě vždy předem řekni barberovi. Použijeme šetrný přístup, nic agresivního. Ale diagnostiku a léčbu nechej na dermatologovi."
            ]
        },

        // ─── BARVENÍ VLASŮ ──────────────────────────────────────────────
        {
            keywords: ["barvení", "barva na vlasy", "barvit vlasy", "odbarvení", "melír", "baleyage", "highlights"],
            responses: [
                "Barva vlasů funguje dvěma způsoby. Permanentní barva: amoniak otevře kutikulu, vývojka (peroxid) odbourá přirozený melanin a zároveň aktivuje pigmenty uvnitř vlasu – ty tam zůstanou natrvalo. Semi-permanentní: pigmenty se usadí jen na povrchu, vyplavují se postupně při každém mytí.",
                "Odbarvení nebo melír je chemický zákrok – buď jde o klasické pruhy nebo baleyage (ombre přechod nanesený ručně). Čím víc odbarveš, tím víc namáháš vlasy. Po každém chemickém zákroku je klíčová regenerační péče – keratin, hluboká hydratace."
            ]
        },
        {
            keywords: ["šedivění", "šedivé vlasy", "šediny", "zbavit se šedin", "šedé"],
            responses: [
                "Šedivění nastane, kdy melanocyty (buňky tvořící pigment) přestanou fungovat. Genetika určuje, kdy to přijde. Zbavit se šedin lze permanentní barvou nebo šediny zapracovat do stylu – dnes je salt & pepper look vysoce ceněný a přirozený.",
                "Šediny jsou gentlemanský znak. Ale jestli je chceš zakrýt, permanentní barva to zvládne spolehlivě. Jestli je chceš naopak zvýraznit, dá se s nimi pracovat baleyage technikou pro krásný přirozený efekt."
            ]
        },
        {
            keywords: ["perma", "trvalá ondulace", "trvalá", "narovnání vlasů", "keratinový zábal", "keratin"],
            responses: [
                "Trvalá ondulace mění strukturu vlasů chemicky – rozbijí se disulfidické vazby v kortexu a vlasy se přetvarují do nové formy (vlnky nebo naopak rovné). Pak se vazby chemicky znovu uzamknou v nové poloze. Vlasy jsou pak trvale zformované, dokud nevyrostou nové.",
                "Keratinový zábal vlasy nevlní, ale vyhlazuje a regeneruje. Keratin proniká do kortexu, opravuje poškozené části vlasu a kutikulu zarovnává. Výsledek: méně krepatění, více lesku, snadnější česání. Péče po zákroku je klíčová."
            ]
        },

        // ─── VOUSY – ODBORNÁ PÉČE ────────────────────────────────────────
        {
            keywords: ["olej na vousy", "beard oil", "balzám na vousy", "beard balm", "péče o vousy", "vousy svědí"],
            responses: [
                "Olej na vousy jde jako první – hydratuje pokožku pod vousem a zabraňuje svědění. Pár kapek, vmáchej dlaněma a masíruj přímo do vousu a kůže pod ním. Potom teprve balzám (beard balm), ten přidá fixaci a lehký tvar. Olej hydratuje, balzám stylizuje.",
                "Svědění vousu je signál suché kůže pod ním. Beard oil je řešení – základní složky jsou nejčastěji argan, jojoba nebo mandlový olej. Vyber bez alkoholu a agresivních parfémů. Aplikuj každý den po sprše na mírně vlhký vous."
            ]
        },
        {
            keywords: ["nechat růst vous", "jak dlouho", "vousy nerostou", "hustý vous", "řídký vous"],
            responses: [
                "Prvních 4–6 týdnů nevyhazuj flintu do žita. Vousy v té fázi často vypadají nerovnoměrně a řídce, ale to neznamená, že bude řídký navždy – prostě ještě nevyrostly. Dej jim čas a teprve pak se uvidí, co s tím dál.",
                "Hustota vousu je z velké části genetika a testosteron. Pokud jsou vousy opravdu řídké, minoxidil (původně lék na vlasy) prý pomáhá i na vousy – ale to je věc pro lékaře. Doma: pravidelná masáž pokožky stimuluje prokrvení folikul."
            ]
        },
        {
            keywords: ["neckline", "linie vousu", "hranice vousu", "kde zastřihat vous", "krk vous"],
            responses: [
                "Neckline – hranice vousu na krku – je nejčastěji kazitelná věc domácí úpravy. Klasická chyba je stříhat příliš vysoko, vlasy pak vypadají jako přilepený vous bez konexe s krkem. Správná linie je zhruba dva prsty nad ohryzkem. Nejistý si? Nech první šablonu udělat nám a pak to doma jen udržuj.",
                "Hranice vousu na krku by měla kopírovat přirozený tvar čelisti, ne být rovná čára. Přijď a Tomáš ti to nastřiží tak, abys to pak doma jednoduše udržel."
            ]
        },

        // ─── STYLING PRODUKTY – ODBORNĚ ─────────────────────────────────
        {
            keywords: ["pudr na vlasy", "powder", "objem", "lifter", "texture powder"],
            responses: [
                "Stylingový pudr je nejlepší kamarád jemných vlasů. Aplikuj ho na suché vlasy u kořínků, trochu zmačkej a okamžitě máš objem, texturu a matný efekt. Prakticky žádná fixace, ale skvělá textura.",
                "Pudr funguje na absorpci mazu a zdrsňování vlasového vlákna – vlasy pak k sobě lépe drží a drží tvar. Dávka: minimum. Stačí malá špetka, víc způsobí bílý prach ve vlasech."
            ]
        },
        {
            keywords: ["pomáda", "pomade", "wet look", "slick", "uhlazený"],
            responses: [
                "Pomáda na vodní bázi = klasický wet look nebo slick back. Vysoký lesk, silná fixace, ale dá se vyčesat i po zaschnutí. Vosk (wax) je matný nebo pololesklý se silnější fixací. Pomáda na olejové bázi drží víc, ale ze vlasů se hůř vymývá.",
                "Wet look nebo slick back? Sáhni po pomádě na vodní bázi – vydatná fixace, hladký povrch, snadné vymytí šamponem. Nanes na mírně vlhké vlasy pro nejlepší efekt."
            ]
        },
        {
            keywords: ["hlína", "clay", "matný", "matná fixace"],
            responses: [
                "Matná hlína (clay) je král pro texturu a silnou fixaci bez lesku. Ideál pro husté vlasy nebo texturovaný crop. Nanes na suché nebo mírně vlhké vlasy, rozetři mezi dlaněma, pak práce prsty. Výsledek je přirozený a silně fixovaný.",
                "Clay nebo pasta – pro matný, přirozený look se silnější fixací. Na jemné vlasy je to trochu těžký materiál, spíš sáhni po pudru nebo lehké pastě."
            ]
        },
        {
            keywords: ["fénovanie", "fénování", "fén", "jak vysušit vlasy", "difuzér"],
            responses: [
                "Fénování vlasů: vždy používej ochranný sprej proti teplu, drž fén aspoň 15–20 cm od vlasů a pohybuj jím stále. Horký fén zblízka opakovaně poškozuje kutikulu. Vlasy foukej ve směru růstu (shora dolů) – tak zůstane kutikula hladká a vlasy lesknou.",
                "Na vlnité vlasy použij difuzér – rozptyluje vzduch šetrněji a zachovává přirozené vlnky bez krepatění. Na rovné vlasy fouká klasický fén dobře. Zásada: studená sprška na konci uzavře kutikulu a přidá lesk."
            ]
        },

        // ─── HISTORIE BARBERSHOPU ───────────────────────────────────────
        {
            keywords: ["historie", "historii", "barber tyč", "barber pole", "barber sloup", "původ barbershop"],
            responses: [
                "Barbershop má historii skoro 6000 let. Ve starém Egyptě byli holiči respektovaní kněží – stříháním odháněli zlé duchy. Ve středověku se stali 'barber-surgeons', co vedle stříhání také pouštěli žilou, trhali zuby a dělali malé operace.",
                "Barber tyč – ten točící se červeno-bílý sloup? Červená = krev, bílá = obvaz. Ve středověku holiči po pouštění žilou pověsili zkrvavené obvazy ven na sušení a vítr je roztočil do spirály. Z toho vznikl symbol. V USA přidali i modrou – barvy vlajky."
            ]
        },
        {
            keywords: ["barber surgeon", "barber chirurg", "pouštění žilou"],
            responses: [
                "Ve středověku byli holiči i lékaři zároveň. Pouštěli žilou (věřilo se, že odstraní nemoc), trhali zuby, ošetřovali rány. Tomuto cechu se říkalo 'barber-surgeon'. Až v 18. století se chirurgie oddělila jako samostatná medicína.",
                "Barber surgeon – dvojí řemeslo nůžek a skalpelu. Tohle trvalo pár set let. Lékařská obec je pak oddělila a holičům zanechala jen vlasy a vousy. My se dnes věnujeme výhradně tomu druhému – a to nám stačí."
            ]
        },
        {
            keywords: ["trend", "co je teď módní", "populární střih", "módní účes", "2024", "2025", "2026"],
            responses: [
                "Teď jedou hlavně texturované střihy – crop s fadem, buzz cut v různých délkách, nebo naopak delší vlasy s přirozenou texturou. Vousy zůstávají silné – středně dlouhý plnovous nebo pečlivě tvarovaný krátký vous. Šedé vlasy přestaly být tabu – salt & pepper look je dnes status.",
                "Momentálně se vrací klasika – clean cuts, razor-sharp linie, precizní fade. Mladší generace sahá po retro inspiraci: textured quiff, french crop. A vousy? Buď pečlivě zastřižené, nebo záměrně rustikální. Žádný chaos."
            ]
        },
        {
            keywords: ["hygiena", "sterilizace", "čistota", "čisté nástroje", "infekce"],
            responses: [
                "Hygiena v barbershopu není volitelná. Kvalitní místo sterilizuje nůžky, hřebeny a strojky po každém zákazníkovi. Holicí čepele jsou na jedno použití. Pokud tě zajímá, jak to u nás funguje, klidně se ptej – rádi ukážeme.",
                "U nás se nebagatelizuje čistota. Sterilní nástroje, čerstvé čepele, čisté ručníky. Tohle je základ, bez kterého barber nemá právo pracovat."
            ]
        },
        {
            keywords: ["frekvence", "jak často", "každých kolik týdnů", "kdy se jít ostříhat", "refresh"],
            responses: [
                "Záleží na střihu. Skin fade nebo velmi krátký střih drží svůj tvar maximálně 2–3 týdny. Střední délka s fadem – 3–4 týdny. Delší vlasy nebo jen lehká údržba – klidně každé 6–8 týdnů. Pokud chceš vždy vypadat fresh, počítej s kratším intervalem.",
                "Obecné pravidlo: čím kratší a přesnější střih, tím častěji budeš potřebovat refresh. Fade se roste rychle a po 4 týdnech to začne být znát. Vousy zvládneš udržovat doma, ale profi refresh jednou za 3–4 týdny dělá velký rozdíl."
            ]
        },

        // ─── TIPY NA PŘÍPRAVU ────────────────────────────────────────────
        {
            keywords: ["přinést fotku", "inspirace", "ukázat", "referenční fotka", "nevím co chci"],
            responses: [
                "Přines fotku! Vážně. 'Trochu zkrátit po stranách' může každý barber pochopit jinak. Fotka je nejpřesnější komunikace – méně nedorozumění, přesnější výsledek. Stačí screenshot z Instagramu.",
                "Pokud nevíš co chceš, ale máš vizi, popiš mi výsledek – ne název střihu. 'Chci mít čisté po stranách a nahoře nechám víc délky' je víc než 'nějak moderní'. Nebo klidně pošli fotku přímo v chatu."
            ]
        },
        {
            keywords: ["jak se připravit", "před návštěvou", "co dělat před", "přijít čistý"],
            responses: [
                "Přijď přesně tak, jak jsi. Vlasy ti umyjeme my – to je součást zážitku, ne přítěž. Ale pokud máš vousy, je fajn vědět předem, co s nimi chceš, ať víme, kolik toho budeme dělat.",
                "Nemusíš se speciálně připravovat. Čisté vlasy jsou fajn, ale umyjeme tě tady s masáží hlavy. Jedinou přípravou je vědět, co přibližně chceš – nebo aspoň popsat výsledek, který by se ti líbil."
            ]
        },

        {
            keywords: ["produkt", "pomáda", "vosk", "gel", "pudr", "styling", "hlína", "clay"],
            responses: [
                "Na jemné vlasy doporučujeme pudr pro objem, na silné husté vlasy matnou hlínu (clay) se silnou fixací. Pokud chceš spíš 'wet look', tak sáhni po pomádě na vodní bázi.",
                "Styling ti doladíme přímo na křesle. Obecně platí: pudr na objem a texturu, hlína pro matný fix a pomáda pro klasický uhlazený styl."
            ]
        },
        {
            keywords: ["pokožk", "lup", "svědění", "vyrážka", "problém", "suchá", "mastná", "alergie"],
            responses: [
                "Zdravá pokožka je základ, ale jestli máš nějakou kožní alergii nebo vyrážku, nebudu si tu hrát na doktora. Určitě to před stříháním radši zmiň přímo barberovi.",
                "Pokud tě trápí lupy nebo svědění hlavy, srovnáme to kvalitní kosmetikou bez agresivní chemie. Jestli jde ale o alergii, řekni to radši rovnou při příchodu Tomášovi."
            ]
        },
        {
            keywords: ["seznamka", "seznameni", "seznámení", "láska", "vztah", "rande"],
            responses: [
                "Zrovna makáme na nové seznamce! Ještě to ladíme, ale už teď hledáme první odvážlivce, kteří do toho půjdou s námi. Bude tam hned několik kategorií, takže ať už hledáš cokoliv nebo kohokoliv, určitě zapadneš do té správné skupiny. Dej nám ještě chvilku a brzy se dozvíš víc!",
                "Slyšel jsi dobře, připravujeme zbrusu novou seznamku. Je to ve vývoji a budeme rádi, když se k nám pak přidáš. Chceme, aby si tam každý našel to své, proto chystáme různé kategorie – takže bez obav, určitě se najdeš v té správné partě. Zůstaň na příjmu!"
            ]
        },
        {
            keywords: ["data", "soukromí", "gdpr", "osobní údaje", "bezpečnost", "co shromažďujete", "informace", "sledování", "ip", "poloha"],
            responses: [
                "Jsme naprosto transparentní a hrajeme s otevřenými kartami. Napříč celým webem (nejen na seznamce) shromažďujeme tvoji IP adresu a z ní odvozenou hrubou polohu. Proč? Čistě z bezpečnostních důvodů – chrání nás to před útoky (DDoS), spammery a pomáhá to řídit frontu návštěvnosti na serveru. Při rezervaci u holiče potřebujeme jméno, telefon a e-mail. Na seznamce je to jen to nejnutnější a pokud nahraješ občanku na ověření, systém ji jen přečte a NIKDY neukládá. Pokud sám budeš chtít, můžeme tvoje kontakty předat prověřeným B2B partnerům kvůli práci. Nic víc, nic míň.",
                "U nás se nic netají, jsme 100% transparentní. Kromě základů jako jméno, e-mail a telefon při rezervacích sbíráme taky tvoji IP adresu a zevrubnou polohu. Je to náš štít proti botům, útokům a pro řízení rychlosti webu (rate-limiting). U seznamky pak dbáme na to, aby se žádné citlivé doklady (jako ID k ověření) nikam neukládaly – po přečtení rovnou mizí. Vše jede podle GDPR a DSA. Pokud chceš, můžeš svoje údaje nasdílet našim partnerům pro pracovní nabídky, ale to už je jen a jen na tobě."
            ]
        },
        {
            keywords: ["ahoj", "čau", "čus", "zdravím", "dobrý den", "cau", "dobry den", "nazdar"],
            responses: [
                "Jasně 😄 Vítej u MMbarber. Jsem Daimon, tvůj průvodce. Co máš na srdci nebo na hlavě?",
                "Zdravíčko! Já jsem Daimon. Chceš se objednat, nebo potřebuješ poradit s nějakým střihem?",
                "V pohodě, zdravím. Tady Daimon. S čím můžu pomoct?"
            ]
        },
        {
            keywords: ["dík", "děkuji", "super", "pecka", "díky", "dik", "diky", "paráda"],
            responses: [
                "V pohodě. Kdykoliv. Kdybys ještě něco potřeboval, víš, kde mě hledat.",
                "Jasná věc. Ať ti vlasy a vousy drží tvar!",
                "Nemáš zač. Kdyby bylo potřeba něco složitějšího, stačí přepnout na Živou podporu."
            ]
        },
        {
            keywords: ["vtip", "zasmát", "joke", "vtipný", "srand", "sranda"],
            responses: [
                "Víte, proč plešatí lidé nepotřebují klíče? Protože nemají žádné kadeře... 😄",
                "Přijde chlapík k holiči a říká: 'Mohl byste mi to ostříhat tak, abych vypadal o deset let mladší?' Holič na to: 'Jasně, zavřete oči a představujte si, že je vám deset.'",
                "Srandičky, na to tě užije, co? Ale jestli se chceš fakt zasmát, nech si ostříhat vlasy podle hrnce."
            ]
        },
        {
            keywords: ["otevřeno", "otevíračka", "zavřeno", "kdy máte", "hodiny", "otevírací doba", "dneska", "zítra"],
            responses: [
                "Zastav se, jsme tu normálně od úterý do soboty. Ale jestli hledáš volné místo přímo na dnešek nebo zítřek, nejlepší je mrknout hned na rezervační systém: https://mm.inthechair.com/micka",
                "Otevíračku neřeš, řeš termíny. Ty najdeš vždycky nejvíc aktuální v rezervačním systému: https://mm.inthechair.com/micka"
            ]
        },
        {
            keywords: ["platb", "platit", "kart", "hotov", "cash", "kartou", "převod", "qr"],
            responses: [
                "U nás můžeš platit vším možným. Bereme hotovost, máme i QR kód a většinou není problém ani karta. Všechno je to na místě o domluvě.",
                "Hotově nebo přes QR kód je to nejlepší, ale jestli máš jen kartu, taky se domluvíme. Nejsme ve středověku 😄"
            ]
        },
        {
            keywords: ["parkování", "zaparkuj", "parkov", "auto"],
            responses: [
                "S parkováním u nás v Mařaticích většinou nebývá problém. Kousek místa se tu vždycky najde.",
                "Zaparkuješ kousek od nás. S autem to tady v Mařaticích máme naštěstí docela v pohodě."
            ]
        },
        {
            keywords: ["děti", "dítě", "syn", "kluk", "dět"],
            responses: [
                "Stříháme i mladé pány, ale pamatuj, že čas běží všem stejně a účtujeme si to podle něj. Takže pokud junior chvíli neposedí, může se to protáhnout.",
                "Děti zvládáme, ale je potřeba, aby trochu spolupracovaly. Účtujeme totiž za čas v křesle, ne podle věku."
            ]
        },
        {
            keywords: ["kafe", "káv", "pivo", "pití", "napít", "občerstvení", "voda"],
            responses: [
                "O žízeň se u nás bát nemusíš. Káva, voda a s trochou štěstí i něco jiného na zpříjemnění čekání tu na tebe vždycky počká.",
                "U nás na suchu sedět nebudeš. Nabídneme ti kafe a vždycky se najde něco na osvěžení. ☕"
            ]
        },
        {
            keywords: ["umýt", "špinav", "mýt", "připravit", "před stříháním"],
            responses: [
                "Vlasy si doma mýt nemusíš, o to se postaráme my přímo u křesla. Mytí s masáží hlavy je přece ta nejlepší část!",
                "Přijď přesně tak, jak jsi. Všechno mytí a péči vyřešíme my tady. Aspoň si užiješ masáž hlavy."
            ]
        },
        {
            keywords: ["jak se máš", "co děláš", "jak to jde"],
            responses: [
                "Já se mám skvěle, jsem přece bot žijící v nejlepším barbershopu. Jak to jde tobě?",
                "Nestěžuju si, hlídám tu online prostor. A co ty, potřebuješ poradit se střihem?"
            ]
        },
        {
            keywords: ["nejlepší", "kdo je top", "koho vybrat"],
            responses: [
                "Všichni tu umí s nůžkami kouzla, ale jestli se ptáš, kdo to tu vede – je to Don Tomáš.",
                "Neuděláš chybu s nikým z nás, ale mistr zakladatel je jen jeden. Záleží jen, na koho trefíš volný termín."
            ]
        },
        {
            keywords: ["jak dlouho", "zkušenosti", "praxe", "roky", "od kdy"],
            responses: [
                `Seš tak slepej nebo natvrdlej? Všechno to máš napsaný tady na webu, nejsem tvoje máma, abych ti to tady předčítal. Ale že jsi to ty: náš Don stříhá už !!! ${getTomasExperience()} !!!`,
                `Nečteš web, viď? Nejsem tvoje matka, abych ti tu recitoval náš příběh. Ale že jsi to ty, tak abys věděl – Don Tomáš to drtí už !!! ${getTomasExperience()} !!!`
            ]
        },
        {
            keywords: ["konkurence", "jiní holič", "jiný barber", "ostatní", "druhý holič", "jiné holičství"],
            responses: [
                "Nikdo není objektivně 'nejlepší'. O některých jiných místech jsem slyšel, že si o sobě možná myslí moc, nebo že věří, že čím déle člověka stříhají, tím víc luxusu mu dávají. My si na nic nehrajeme. Tady mluví činy a výsledky, ne pohádky kolem.",
                "Znáš to... někteří jinde si myslí, že čím víc času ti patlají hlavu, tím lepší to je. My se soustředíme na naši práci a naše lidi. Nikdo není nejlepší na světě, ale my známe svou hodnotu a sílu. Kdo chce, cestu si k nám najde."
            ]
        },
        {
            keywords: ["promiň", "pardon", "spletl", "omluv", "chyba"],
            responses: [
                "V pohodě, nic se neděje. Nejsme z cukru. Pojďme to radši vyřešit.",
                "Jasně, to se stává. Co jsi potřeboval původně?"
            ]
        },
        {
            keywords: ["kdo jsi", "co jsi", "kdo tě vytvořil", "jsi člověk", "jsi robot", "daimon", "jak se jmenuješ"],
            responses: [
                "Já jsem Daimon. Pokorný sluha a hlídač tohoto digitálního prostoru. Sloužím výhradně Jeho Excelenci, mistru Tomášovi, zakladateli tohoto podniku. Ráčili byste si přát nějakou službu?",
                "Jméno mé je Daimon. Jsem digitální stín samotného velkého Dona Tomáše. Jsem zde, abych vám pomohl, urovnal cestu k rezervaci a ochránil klid tohoto domu. Co pro vás mohu učinit?"
            ]
        },
        {
            keywords: ["reklamace", "nespokojen", "špatný", "stížnost", "zkazil", "nelíbí"],
            responses: [
                "Tohle mě mrzí. Náš Don Tomáš bere případné reklamace zodpovědně, ale logicky se na to musí nejdřív podívat. Všechno je u nás o domluvě. Přepni se na Živou podporu a probereme, co s tím.",
                "To nezní dobře. Tomáš řeší reklamace napřímo, ale musí to vidět. Jsme lidi a všechno je o domluvě. Přepni na Živou podporu a mrkneme se na to."
            ]
        },
        {
            keywords: ["nevím", "pomoc", "porad", "help"],
            responses: [
                "V pohodě. Pokud nevíš co vybrat, popiš mi aspoň zhruba, jaký chceš výsledek, a já tě nasměruju. Nebo mrkni do rezervací.",
                "Jestli nevíš, přepni se klidně na Živou podporu. Tohle už asi radši nechám na člověkovi, ať ti neporadím špatně."
            ]
        }
    ];

    let foundIntent = false;
    let botReply = "Omlouvám se, ale jsem jen virtuální asistent. Na složitější dotazy vám lépe odpoví živá podpora. Zkuste prosím přepnout dole na 'Živou podporu'.";

    // Score intents based on matching keywords
    const intentScores = intents.map(intent => {
        const matches = intent.keywords.filter(kw => lowerText.includes(kw));
        return { intent, score: matches.length };
    });

    // Find the highest scoring intent (must have at least 1 match)
    const bestMatch = intentScores.sort((a, b) => b.score - a.score)[0];

    if (bestMatch && bestMatch.score > 0) {
        botReply = getRandom(bestMatch.intent.responses);
        foundIntent = true;
    } else {
        // Fallback generic responses for chit-chat
        if (lowerText.length < 5) {
            botReply = "Zkuste se rozepsat trošku víc.";
        } else if (lowerText.endsWith("?")) {
            botReply = "Dobrá otázka. Bohužel přesnou odpověď na tohle neznám. Bude lepší to probrat s naší živou podporou.";
        }
    }

    return { text: botReply, isVulgar: false };
}
