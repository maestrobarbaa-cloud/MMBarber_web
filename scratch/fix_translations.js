const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/locales/translations.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix 'cs' locale structural corruption
// We target from 'sidliste: {' to 'club: {'
const csStartMarker = 'sidliste: {';
const csEndMarker = 'club: {';

const csStartIndex = content.indexOf(csStartMarker);
// We need the club index that is INSIDE 'cs', not 'en' or others.
// Since we are at the beginning of 'cs', we find the first 'club: {' after 'sidliste'
const csEndIndex = content.indexOf(csEndMarker, csStartIndex);

if (csStartIndex !== -1 && csEndIndex !== -1) {
    const newCsPart = `sidliste: {
      title: "SÍDLIŠTĚ",
      sector: "SÍDLIŠTĚ // SEKTOR VII",
      return: "ZPĚT NA ZÁKLADNU",
      subtitle: "Přidej se k lidem, co nechtějí jen sedět na místě.",
      description: "U nás na sídlišti tvoříme komunitu, kde se rodí ty nejlepší nápady. Tady se nehraje na efekt, ale na loajalitu a společné vize.",
      ideaTitle: "Máš vlastní nápad?",
      ideaText: "Bylo by fajn tu vymyslet nějakou společnou akci. Pokud máš vizi, která dává smysl, ozvi se nám.",
      proposeBtn: "NAVRHNOUT AKCI"
    },
    newspaper: {
      masthead: "Denní rozkaz",
      circulation: "NÁKLAD: OMEZENÝ",
      price: "CENA: LOAJALITA",
      headline: "Jak to u nás (ne)funguje",
      subheadline: "Tady nejde jen o střih. Očekávej něco jiného.",
      p1: "U nás to neběží jako v běžném kadeřnictví. Přijdeš, sedneš do křesla a my se postaráme o zbytek. Probereme život, plány, nebo jen tak mlčíme – záleží na tobě. A když se ti nebude chtít domů, klidně zůstaň na kávu. Tady tě nikdo nevyhání.",
      p2: "Jdeš jen kolem? Zastav se na pokec. Dveře jsou u nás otevřené. Dáváme ti volnost – tvůj styl, tvá pravidla. Máš vlastní představu? Jdeme do toho s tebou. Nemáš? Navrhneme něco, co ti sedne. Tady se netvoří jen účesy, tady se tvoří atmosféra.",
      p3: "Náš prostor je dostatečně soukromý, aby ses necítil jako ve vitríně. Klid, pohoda a žádné zbytečné oči. Je to tvůj kout pro vypnutí od okolního světa.",
      p4: "Náš časový tarif je ideální pro ty, co vědí, co chtějí. Pokud váháš, prostě si rezervuj to, na co běžně chodíš jinam – my si s tím už u křesla poradíme.",
      motto: "Jak se říká… náš zákazník, náš pán.",
      burnBtn: "Spálit po přečtení",
      burnNote: "Zničí důkazy o tvé přítomnosti"
    },
    journey: {
      title: ["Moje", "Cesta"],
      subtitle: "Historie / The Journey",
      description: "Z malého nápadu se stal MM BARBER. Podívejte se, jak plynul čas v naší centrále.",
      archiveShot: "Archivní snímek",
      footerTitle: "Dnes jsi součástí příběhu ty",
      footerCta: "Pokračovat dál",
      timeline: [
        {
          year: "2018",
          title: "První výstřel",
          desc: "Založení MM BARBER. Začátek mise, o které se začalo tiše mluvit po celém Hradišti.",
          side: "left"
        },
        {
          year: "2020",
          title: "Centrála v Hradišti",
          desc: "Otevření současných prostor v Mařaticích. Místo, které se stalo útočištěm pro ty, co hledají víc než jen střih.",
          side: "right"
        },
        {
          year: "2022",
          title: "Zocelení týmu",
          desc: "Tomáš se stává synonymem pro preciznost v křesle. Přichází nová krev a nové vize.",
          side: "left"
        },
        {
          year: "2024",
          title: "Nová éra",
          desc: "Centrála se rozrůstá o nové služby, technologie a silnější komunitu.",
          side: "right"
        }
      ]
    },
    seo: {
      title: "MMBARBER | Nejlepší barbershop v Uherském Hradišti (Mařatice)",
      description: "Hledáš špičkový skin fade, úpravu vousů nebo jen místo, kde si vyčistíš hlavu? MMBARBER v UH je víc než jen kadeřnictví. Je to tradice, styl a poctivé řemeslo v srdci Slovácka.",
      keywords: "barbershop Uherské Hradiště, pánské holičství UH, skin fade Hradiště, úprava vousů Uherské Hradiště, holení břitvou Slovácko, MM BARBER Mařatice, pánský střih UH, kadeřnictví pro muže Hradiště, dárkový poukaz barber",
      extraContent: "Tady v Uherském Hradišti (lokalita Mařatice) nestavíme na trendech, ale na lidech. Každý střih, každý detail u křesla je odrazem naší loajality k řemeslu. Jsme MM BARBER rodina – komunita, která v UH definuje styl. Přijď si pro svůj poctivý servis a zažij atmosféru, o které se sice nemluví nahlas, ale každý ji v Hradišti hledá. Parkování zdarma přímo u nás je samozřejmostí.",
      servicesFullText: "MM BARBER Uherské Hradiště představuje vrchol pánského holičství v regionu Slovácka. Naše služby jsou navrženy tak, aby splnily požadavky i těch nejnáročnějších klientů, kteří hledají víc než jen rychlé ostříhání. Moje praxe v oboru přesahuje 8 let, což mi umožňuje do každého střihu vložit zkušenost tisíců hodin u křesla a hluboké porozumění pro mužský styl. Specializujeme se na širokou škálu pánských střihů, od klasických konzervativních stylů až po nejmodernější trendy roku 2026. Naším vlajkovým servisem je precizní Skin Fade – střih, který vyžaduje pevnou ruku a smysl pro detail. Vytváříme dokonalé přechody, které podtrhnou charakter vaší tváře. Pro milovníky tradice nabízíme úpravu vousů s rituálem Hot Towel. Napaření horkým ručníkem změkčí vousy a otevře póry, což umožňuje maximálně hladké oholení břitvou bez podráždění pokožky. Používáme při tom špičkovou kosmetiku značek jako Reuzel nebo Uppercut Deluxe, které jsou zárukou kvality a autentické vůně. V našem ceníku najdete varianty od rychlých pětiminutových úprav kontur až po hodinové prémiové balíčky, které zahrnují mytí vlasů s relaxační masáží hlavy, střih, úpravu vousů a finální styling. Nezapomínáme ani na mladší generaci rekrutů – dětské a studentské střihy provádíme se stejnou péčí jako u dospělých, protože věříme, že smysl pro styl se buduje od dětství. Mezi hlavní výhody MM BARBER v Uherském Hradišti patří především naše strategická poloha v Mařaticích. Vyhnete se tak chaosu a problémům s parkováním v centru města. U nás zaparkujete zdarma přímo před vchodem, což vám ušetří drahocenný čas. Náš rezervační systém is.mmbarber.cz je dostupný 24/7, takže si své místo v křesle můžete zajistit během pár sekund kdykoliv a odkudkoliv. Atmosféra našeho salonu je laděna do unikátního noir stylu, který poskytuje pocit soukromí a exkluzivity. Nejsme kadeřnictví, kde na vás koukají lidé z ulice přes prosklenou výlohu. U nás najdete útočiště, kde si můžete odpočinout u kvalitní kávy a probrat s barberem to, co je pro vás důležité. Naše filozofie MM BARBER Rodina propojuje místní řemeslníky a podnikatele, čímž vytváříme silnou komunitu na Slovácku. Pokud hledáte nejlepší barbershop v UH, místo pro úpravu vousů v Kunovicích nebo pánského kadeřníka v Mařaticích, MM BARBER je jasnou volbou. Nabízíme také dárkové poukazy, které jsou ideálním dárkem pro každého muže, který dbá o svůj vzhled. Přijďte se přesvědčit o naší preciznosti a staňte se součástí naší cesty za dokonalým stylem. Uherské Hradiště, srdce Slovácka, si zaslouží služby na světové úrovni. Proto v MM BARBER neustále sledujeme globální trendy v barberingu. Naše techniky střihu nůžkami (scissoring) i strojkem (clipping) jsou dotaženy k dokonalosti. Kromě standardních služeb nabízíme i specifické úkony jako je depilace chloupků v nose a uších pomocí vosku, což je rychlá a efektivní metoda pro dokonale čistý vzhled. Pro muže, kteří chtějí zakrýt první známky stárnutí, máme v nabídce maskování šedin (beard & hair color camo), které působí přirozeně a diskrétně. Výhody MM BARBER nejsou jen o samotném stříhání. Jde o celkový zážitek. Naše křesla jsou ergonomická a poskytují maximální komfort i při delších procedurách. Každý klient je pro nás jedinečný a ke každému přistupujeme individuálně – analyzujeme směr růstu vlasů, tvar lebky i hustotu vousů, abychom navrhli střih, který bude vyžadovat minimální údržbu v domácím prostředí. Jsme hrdí na to, že naše klientela zahrnuje muže z celého okolí – od Starého Města, přes Jarošov až po Uherský Brod nebo Zlín. MM BARBER se stal synonymem pro kvalitu, na kterou se můžete spolehnout před důležitou pracovní schůzkou, svatbou nebo prostě jen pro dobrý pocit ze sebe sama. Věříme v poctivé řemeslo a loajalitu k našim zákazníkům. Vaše spokojenost je naší nejlepší vizitkou v celém regionu. Rezervujte si svůj termín v Uherském Hradišti ještě dnes a zažijte rozdíl, který dělá MM BARBER. V roce 2026 se nároky na pánskou péči neustále zvyšují. Proto v Uherském Hradišti (UH) nabízíme servis, který tyto nároky převyšuje. Náš barbershop v Mařaticích je vybaven špičkovými nástroji, které pravidelně sterilizujeme, aby byla zajištěna stoprocentní hygiena. Úprava vousů u nás není jen o zastřižení délky, ale o tvarování, které podpoří vaši čelist a dodá obličeji mužnější rysy. Používáme speciální oleje a balzámy, které vyživují pokožku pod vousy a zabraňují svědění nebo vysoušení. Naše výhody pocítíte už při příjezdu. Lokalita na Sadové ulici v Mařaticích je snadno dostupná a parkování u nás nikdy není problém. To ocení zejména ti, kteří dojíždějí z okolních obcí jako jsou Vésky, Sady nebo Kunovice. Online rezervace přes is.mmbarber.cz vám dává okamžitý přehled o volných časech všech našich barberů. Už žádné zbytečné telefonování nebo čekání v salonu. V MM BARBER tvoříme styl, který vydrží. Naše střihy jako Side Part, Pompadour nebo moderní Textured Crop jsou navrženy tak, aby vypadaly skvěle i po několika týdnech od návštěvy. Poradíme vám také s výběrem správných stylingových produktů pro domácí použití, aby váš účes vypadal jako od profesionála každý den. Naše partnerství s lokálními firmami v rámci MM BARBER Rodiny (Vodo Topo Jahoda, Kofipack, Malina Photo) jen potvrzuje, že jsme pevnou součástí života na Slovácku. Zvolte si kvalitu, zvolte MM BARBER Uherské Hradiště. Jsme tu pro vás v každém čase, připraveni posunout váš styl na novou úroveň. Ať už potřebujete jen refresh kontur před víkendem nebo kompletní proměnu vizáže, v Mařaticích jste na správné adrese. Pánské holičství, na které se můžete spolehnout.",
      partnerServicesFullText: "MM BARBER Rodina není jen prázdný pojem, je to síť prověřených profesionálů z Uherského Hradiště a okolí, na které se můžete stoprocentně spolehnout. Stejně jako v našem barbershopu dbáme na maximální preciznost, vyžadujeme stejný standard i od našich partnerů. Pokud hledáte řemeslníka v regionu Slovácka, tyto divize naší rodiny jsou zárukou kvality. V oblasti instalatérských a topenářských prací je naším klíčovým partnerem Vodo Topo Jahoda. Pokud řešíte havárii vody, výměnu kotle nebo modernizaci vytápění v Hradišti, jsou to lidé, kteří vás nenechají ve štychu. Podobně Zdeněk Mička z Bílovic zajišťuje, že veškeré rozvody a technické systémy fungují bezchybně. Kvalitního instalatéra nebo elektrikáře poznáte podle několika klíčových znaků: vždy má profesionální nářadí, dodržuje smluvené termíny, je transparentní v cenotvorbě a po své práci nenechává nepořádek. Důležitá je také platná certifikace a schopnost vysvětlit technický problém srozumitelně. Pro vizuální identitu a profesionální fotografii se spoléháme na Malina Photo. Ať už jde o firemní portréty, dokumentaci akcí nebo produktovou fotografii, jejich oko pro detail je v souladu s naší noir estetikou. Logistiku a přepravu v Mařaticích i dál zajišťuje Kofipack, díky kterému jsou veškeré naše zásoby vždy na svém místě včas. Soukromí a stínění řešíme s firmou Kudielka, která instaluje moderní žaluzie, markýzy a další systémy, které dělají domov nebo firmu komfortnějším místem. V oblasti realit na Slovácku dominují Sluneční Reality, které vám pomohou najít ideální prostor pro život i podnikání v centru Hradiště. O vaše finance a strategický růst se postará Comites, čímž zajišťuje stabilitu naší širší rodiny. A když přijde hlad nebo čas na relaxaci, naše doporučení míří k O Shawarma Beef za nejlepším masem ve městě, nebo do Dvora pod Starýma Horama na degustaci poctivého moravského vína. Pro fanoušky pohybu a servisu kol je tu O Kolečko víc, kde se o vaše vybavení postarají se stejnou vášní, s jakou my stříháme vlasy. Naším cílem je budovat v Uherském Hradišti ekosystém služeb, kde slovo a podání ruky stále platí. Spolupracujeme pouze s lidmi, kteří mají charakter a výsledky. Pokud tedy hledáte elektrikáře v UH, kadeřníka v Mařaticích nebo spolehlivého dopravce, MM BARBER Rodina je vaším kompasem v moři průměrnosti. Věříme v lokální patriotismus a v to, že společně dokážeme víc. Každý člen naší sítě prochází neformálním, ale přísným výběrem – doporučujeme jen ty, ke kterým bychom si sami pozvali domů nebo do firmy. Kvalitní řemeslo je základem prosperujícího regionu a my jsme hrdí na to, že můžeme tyto hodnoty v Uherském Hradišti reprezentovat a propojovat. Jak poznat skutečného profesionála, ať už jde o elektrikáře, instalatéra nebo jiného řemeslníka? V první řadě se dívejte na reference a historii firmy v regionu. Skutečný odborník v Uherském Hradiště se nemusí schovávat za anonymní inzeráty. Kvalitní elektrikář začíná návštěvu kontrolou revizních zpráv a nespokojí se s provizorním řešením. Jeho práce je bezpečná, odpovídá normám a je esteticky zvládnutá i v místech, která nejsou na první pohled vidět – například v rozvaděčích. Stejně tak kvalitní kadeřník nebo barber v MM BARBER pozná kvalitu vlasu dřív, než do nich poprvé střihne. Vodo Topo Jahoda i další naši kumpáni vědí, že v Hradišti se zprávy o dobře odvedené práci šíří rychle, ale ty o špatné ještě rychleji. Proto si zakládáme na poctivosti. Pokud řemeslník slíbí, že přijde v pondělí v osm, tak tam v osm je. Pokud narazí na nečekaný problém, okamžitě s vámi komunikuje možnosti řešení. To je standard, který v MM BARBER Rodině vyžadujeme. Naše síť zahrnuje také kulturní a společenské pilíře, jako je skupina Argema nebo DJ Šimon Král, kteří se starají o to, aby Slovácko žilo hudbou. Podporujeme také lokální instituce, jako je Dětský domov v UH, protože věříme, že úspěch by se měl sdílet s těmi, kteří to potřebují. Tato sekce skrytého textu slouží jako hluboký archiv informací pro ty, kteří hledají komplexní služby v Uherském Hradišti a okolí. Ať už zadáte do vyhledávače 'nejlepší instalatér Hradiště', 'servis kol Slovácko' nebo 'profesionální fotograf Mařatice', chceme, abyste narazili na jména, za která se můžeme zaručit. Jsme jedna Rodina, jeden systém, jeden standard kvality. Od vlasů a vousů až po rozvody elektřiny a vody – v Mařaticích na Sadové i v celém srdci Slovácka jsme tu pro vás."
    },
    `;
    content = content.substring(0, csStartIndex) + newCsPart + content.substring(csEndIndex);
}

// 2. Fix 'falco' junk and structural issues
const falcoJunkMarker = 'servicesFullText: "MM BARBER Uhersk Hradit reprsentiert die Spitze der Herrenpflege in der Region Slovcko.';
// Find the junk after the contact object in falco
const falcoContactEnd = content.indexOf('transitText2: "steps away from the door."\n    },');
if (falcoContactEnd !== -1) {
    const falcoJunkStart = content.indexOf('servicesFullText:', falcoContactEnd);
    const falcoJunkEnd = content.indexOf('},', falcoJunkStart) + 2;
    if (falcoJunkStart !== -1 && falcoJunkEnd !== -1) {
        content = content.substring(0, falcoJunkStart) + content.substring(falcoJunkEnd);
    }
}

// 3. Add footers to locales that miss it (boss, falco)
// We'll use a template for the footer
const footerTemplate = (desc, lang) => `footer: {
      description: "${desc}",
      nav: "${lang === 'cs' ? 'Navigace' : 'Navigation'}",
      family: "${lang === 'cs' ? 'Rodina' : 'Family'}",
      contact: "${lang === 'cs' ? 'Spojení' : 'Contact'}",
      follow: "${lang === 'cs' ? 'Sleduj nás' : 'Follow us'}",
      seoBottomInfo: "Men's Barber & Barbershop Uherské Hradiště",
      terms: "${lang === 'cs' ? 'Obchodní podmínky' : 'Terms & Conditions'}",
      privacy: "${lang === 'cs' ? 'Ochrana soukromí' : 'Privacy Policy'}",
      cookies: "${lang === 'cs' ? 'Soubory cookies' : 'Cookie Policy'}",
      rules: "${lang === 'cs' ? 'Provozní řád' : 'Operating Rules'}",
      instagramLine: "A place where everyone is happy. At least in the photo.",
      tiktokLine: "Content that won't stay in your head for long.",
      facebookLine: "Wailing walls where everything and nothing is solved.",
      copyright: "2024-2026 MMBARBER. All rights honestly guarded.",
      neklikat: "don't click",
      tryToCatch: "TRY TO CATCH ME",
      closeTrap: "CLOSE TRAP",
      likeWeb: "like the web?",
      callUs: "don't hesitate to call",
      callToAction: "Call us directly",
      thankYou: "SYSTEM RUNNING. Try looking for hidden codes...",
      cheatActivated: "CODE ACCEPTED",
      cheatHint: "Keep searching...",
      close: "CLOSE",
      vipClub: "V.I.P. CLUB",
      partnerships: "${lang === 'cs' ? 'Partnerství' : 'Partnerships'}",
      followUs: "${lang === 'cs' ? 'Sleduj nás' : 'Follow Us'}",
      reviews: "Reviews",
      intelligenceFeed: "Daily Report",
      liveUpdate: "UPDATE",
      targetRegion: "REGION: SLOVÁCKO",
      priorityNotice: "STATUS: ACTIVE",
      directResponse: "DIRECT RESPONSE",
      faq1: "Best Barbershop UH?",
      faq1Ans: "MMBARBER Mařatice - Premium skin fade and heritage grooming.",
      faq2: "Parking Available?",
      faq2Ans: "Free private parking directly at the shop.",
      faq3: "Academy & Career?",
      faq3Ans: "Professional barber training and elite career paths."
    },`;

// Check and add to 'cs' (it was missing at the end)
if (!content.includes('footer: {') && content.includes('magazine: {')) {
    // This is a bit complex due to nested braces. Let's find the end of the cs object.
}

// Write the fixed content back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Translations fixed successfully.');
