import os

def final_rebuild_from_clean_source():
    # The absolute best way: Redefine the WHOLE structure in the script.
    # I'll use the pieces I have and assemble them.

    header = """export const translations = {
  cs: {
    header: {
      services: "Služby",
      gallery: "Galerie",
      seznamka: "Seznamka",
      payment: "Platba",
      schedule: "Rozvrh",
      theCode: "Informace",
      more: "Více",
      career: "Kariéra",
      aboutUs: "O Nás",
      franchise: "FRANCHISE",
      startMission: "JAK TO U NÁS CHODÍ",
      compass: "KOMPAS",
      web: "WEB",
      on: "ZAPNUTO",
      off: "VYPNUTO",
      tracking: "SLEDUJI POLOHU",
      savingData: "ŠETŘÍ DATA",
      navigate: "NAVIGOVAT",
      searchPlaceholder: "Ptej se právně.",
      reviews: "Recenze"
    },
    intelligence: [
      "Dneska je ideální tlak pro ten nejostřejší skin fade. V UH je vzduch tak akorát.",
      "Vypadá to, že se v Hradišti začínají dít věci. Rezervace na vousy se plní.",
      "V Mařaticích dnes fouká – pokud nechceš mít vlasy všude, sáhni po silnější pomádě.",
      "Dnešní plán je jasný: Perfektní kontury a klid u křesla. Jsme v pohotovosti.",
      "Všiml jsem si, že se na Slovácku vrací kratší střihy. Buďte o krok napřed.",
      "Náš rezervační systém is.mmbarber.cz dneska skoro nestíhá. Díky za důvěru.",
      "Doporučuji dneska zkusit napaření horkým ručníkem. Nic tě víc neuklidní.",
      "V centrále je všechno připravené. Káva voní, břitvy jsou ostré. Tvůj čas přišel.",
      "V Hradišti dneska vládne styl. Stačí se podívat kolem. Buď jeho součástí.",
      "Malý tip: Olej na vousy dej hned po sprše, dokud jsou póry otevřené. Funguje to líp.",
      "Chlapi z Brodu a Veselí už jsou na cestě. Raději si to své místo pojisti včas.",
      "Dneska neřeš, co bylo včera. Důležité je, jak vypadáš teď a tady.",
      "Naše MM BARBER rodina roste. Je skvělé vidět tolik známých tváří.",
      "Počasí v UH přeje krátkým vlasům. Přijď si pro svůj poctivý taper fade.",
      "Parkování v Mařaticích je dneska úplně v pohodě. Čekáme tě přímo před dveřmi.",
      "V roce 2026 je upravený plnovous základ. Bez debat.",
      "V Kunovicích jsem zahlédl jeden náš čerstvý střih. Sakra, to se povedlo.",
      "Dnešní káva v barberu je silná jako naše břitvy. Přesně tak to máme rádi.",
      "Pořád ladíme detaily. Dneska jsou ty přechody ještě o kousek čistší.",
      "Jdeš k nám poprvé? Žádný stres. U nás se budeš cítit jako doma.",
      "Noir není jen filtr na fotku, je to postoj. Dneska je den na to ukázat charakter.",
      "Letní filmovka se blíží. Chceš v kině vypadat líp než ti na plátně, že?",
      "Slavnosti vína v UH vyžadují reprezentativní vizáž. Nechceš to nechat na náhodu.",
      "Hrajeme si s milimetry. Protože právě na nich záleží ten nejlepší výsledek.",
      "Díky, že držíte s námi. Vaše loajalita je to, co nás žene dopředu.",
      "Máme tu ty nejostřejší břity na celém Slovácku. Přijď si to vyzkoušet na vlastní kůži.",
      "Dneska ty detaily ladím s maximální soustředěností. Chci, abys odcházel spokojený.",
      "Nehledej výmluvy, proč to nejde. Najdi si volný termín na is.mmbarber.cz.",
      "Skoro každý, kdo k nám přijde, odchází s čistou hlavou. Zkus to taky.",
      "MM BARBER Uherské Hradiště – poctivé řemeslo, žádné prázdné řeči."
    ],
    familyIntelligence: [
      "Vodo Topo Jahoda hlásí 100% nasazení v terénu. Havárie v UH pod kontrolou.",
      "Kofipack odeslal novou zásilku pro naši rodinu. Logistika v Mařaticích běží.",
      "Malina Photo vyvolává nové důkazy ze včerejší akce. Očekávejte vizuální update.",
      "Argema ladí zvuk pro další misi. Slovácko bude vibrovat.",
      "Sluneční Reality detekovaly nové strategické objekty v centru Hradiště.",
      "Comites hlásí stabilní růst. Finance naší rodiny jsou v bezpečí.",
      "Šimon Král připravuje setlist, který nenechá nikoho v klidu. Ready?",
      "O Shawarma Beef doplňuje zásoby nejlepšího masa ve městě. Mise: Oběd.",
      "Dvůr pod Starýma Horama připravuje degustaci. Krev naší rodiny je víno.",
      "Kudielka instaluje nové stínící systémy. Vaše soukromí je naší prioritou.",
      "Dětský domov UH: Společně jsme dnes vykouzlili několik úsměvů. Dobrá práce.",
      "O Kolečko víc hlásí: Sezóna v plném proudu, servisy jedou na maximum.",
      "Zdeněk Mička Bílovice: Všechny trubky v regionu jsou v nejlepších rukou.",
      "Romana Mičková: Daně a účty jsou srovnané s matematickou přesností.",
      "Poe Poe: Rychlá jednotka občerstvení v UH je připravena k nasazení.",
      "Analýza: Naše rodina se rozšiřuje o nové vlivné členy. Síla je v jednotě."
    ],
    hero: {
      subtitle: "Holičství Uherské Hradiště",
      title: "Barbershop v Hradišti, kde se mluví málo, ale dělá hodně. Stačí vstoupit.",
      motto: "Příběh první: Kde se rodí styl",
      chapters: [
        "Příběh první: Kde se rodí styl",
        "Příběh druhý: O loajalitě",
        "Příběh třetí: Poctivé řemeslo"
      ],
      mottoes: [
        "Příběh první: Kde se rodí styl",
        "Příběh druhý: O loajalitě",
        "Příběh třetí: Poctivé řemeslo"
      ],
      description: [
        "Místo pro ty, co nepotřebují vykřikovat svůj styl do světa.",
        "Kvalita se pozná i bez zbytečných slov.",
        "Styl, který si nekoupíš. Musíš si ho zasloužit.",
        "Nezajímá nás kvantita. Chceme, abys od nás odcházel jako nový člověk.",
        "Tohle není jen barbershop. Je to náš svět, do kterého tě zveme."
      ],
      easterEggSlogans: [
        "Tady neřešíme, kdo jsi byl. Zajímá nás, s jakou vizí odcházíš.",
        "Ne všechno, co tu vytváříme, uvidíš jen v zrcadle.",
        "Sebevědomí, které si od nás odneseš, u dveří nekončí.",
        "Každý tvůj úspěch je i naším úspěchem. Jsme v tom spolu.",
        "Nezáleží na tom, odkud přicházíš. Záleží na tom, co po tobě zůstane.",
        "Když se rozhodneš změnit pravidla hry, začneš psát novou historii.",
        "Některá jména se zapomínají. Skutečný charakter zůstává.",
        "Tady stavíme na hodnotách, které se dneska už moc nenosí."
      ],
      nightSlogans: [
        "Město už spí, ale tvůj nový styl začíná právě teď.",
        "Ššš… ještě jsi vzhůru? Ideální čas si zajistit křeslo.",
        "Noc patří těm, co vědí, co chtějí. Tvoje rezervace čeká.",
        "Zítřek začíná dnešním rozhodnutím. Klikni a máš své místo.",
        "Nečekej na ráno, ty nejlepší termíny mizí za tmy."
      ],
      deepNightSlogans: [
        "Půlnoc. Hradiště utichlo… a ty víš, že je čas na změnu.",
        "Tahle hodina patří vyvoleným. Tvé místo u nás je připravené.",
        "Pokud nespíš, máš k tomu důvod. Udělej ten první krok k nám.",
        "V tuhle dobu se dělají ta nejlepší rozhodnutí. Potvrď si termín.",
        "Jsi blíž svému novému já, než si v tuhle chvíli myslíš."
      ],
      cta: "Vstoupit do příběhu",
      bookBtn: "CHCI SVÉ KŘESLO"
    },
    services: {
      title: "Naše služby a ceny",
      subtitle: "Vyber si časový slot podle toho, co potřebuješ. Pokud váháš, u křesla to doladíme. Večerní termíny jsou po domluvě otevřené i pro dámy.",
      score: "Zkušenosti",
      bookBtn: "Rezervovat",
      detailsBtn: "Detaily",
      revolutNotice: "",
      currencyLabel: "Měna",
      mainTitle: "Časový tarif",
      timeTariffNote: "Ceny jsou nastavené férově podle času, který tvému stylu věnuji. Platíš za poctivou práci, ne za značku.",
      addonsTitle: "Něco navíc",
      independentTitle: "Jen tak se zastavit",
      specialTitle: "Noční zážitek",
      totalLabel: "Odhadovaná cena",
      timeLabel: "Čas v křesle",
      independentTimeLabel: "Čas odpočinku",
      totalTimeLabel: "Celkový čas u nás",
      extraTimeLabel: "Tvůj čas navíc",
      dynamicPricingTitle: "Dynamická cenotvorba",
      currentSurcharge: "Aktuální sazba",
      surchargeReason: "Důvod",
      surchargeNone: "Standardní cena",
      surchargeSat: "Sobotní provoz (+10 %)",
      surchargeSun: "Nedělní relax (+30 %)",
      surchargeHoliday: "Sváteční servis (+100 %)",
      surchargeAfterHours: "Mimo běžnou dobu (+30 %)",
      surchargeNewYear: "Novoroční update (+70 %)",
      surchargeChristmas: "Vánoční ráno (+50 %)",
      bookingNote: "Jedeme podle rezervačního systému. Pokud vidíš volno, je tvoje.",
      switchDate: "Simulovat datum",
      pricingModes: {
        workday: "Všední den",
        saturday: "Sobota",
        sunday: "Neděle",
        holiday: "Svátek",
        night: "Noční hodiny"
      },
      items: [
        { time: "5 m", name: "RYCHLÁ ÚPRAVA", desc: "Kontury, detaily nebo jen bleskový refresh. Stačí na chvíli naskočit.", price: "100 Kč", priceValue: 100 },
        { time: "10 m", name: "EXPRES SERVIS", desc: "Zaholení krku, úprava bez strojku nebo něco, co už vážně nepočká.", price: "180 Kč", priceValue: 180 },
        { time: "15 m", name: "QUICK FADE", desc: "Buzzcut, jednoduchý střih strojkem nebo rychlé srovnání stran.", price: "280 Kč", priceValue: 280 },
        { time: "20 m", name: "ZÁKLADNÍ STŘIH", desc: "Dětské střihy nebo jednodušší úpravy. Očista, kolínská, styl.", price: "320 Kč", priceValue: 320 },
        { time: "30 m", name: "KLASIKA", desc: "Precizní střih nůžkami i strojkem. Často stihneme vlasy i lehké vousy.", price: "450 Kč", priceValue: 450 },
        { time: "45 m", name: "KOMPLETNÍ PÉČE", desc: "Mytí, střih, zaholení břitvou. Pokud nevíš, tohle je sázka na jistotu.", price: "650 Kč", priceValue: 650 },
        { time: "1 h", name: "PREMIUM KOMBO", desc: "Vlasy, vousy, mytí a totální vypnutí. Maximální relaxace.", price: "1 000 Kč", priceValue: 1000 }
      ],
      addons: [
        { id: "add1", name: "Depilace nosu", priceValue: 30, desc: "Rychle a (skoro) bezbolestně voskem." },
        { id: "add2", name: "Depilace uší", priceValue: 30, desc: "Vosková epilace pro čistý vzhled." },
        { id: "add3", name: "Horký ručník (Hot Towel)", priceValue: 100, desc: "Tradiční napaření a uvolnění pokožky." },
        { id: "add6", name: "Mytí s masáží", priceValue: 100, desc: "Mytí vlasů s příjemnou masáží hlavy." },
        { id: "add4", name: "Napařování vousů", priceValue: 70, desc: "Příprava na precizní oholení." },
        { id: "add5", name: "Opalování uší", priceValue: 20, desc: "Tradiční metoda odstranění jemných chloupků." }
      ],
      independent: [
        { id: "ind1", name: "Masážní křeslo (15 min)", priceValue: 100, time: 15, desc: "Když si chceš jen na chvíli odfrknout." },
        { id: "ind2", name: "Relaxační zóna (30 min)", priceValue: 180, time: 30, desc: "Klid, káva a chvíle pro sebe." }
      ],
      special: [
        { id: "sp2", name: "Noční Full Service", priceValue: 2500, time: "1 h", desc: "Když potřebuješ vypadat skvěle a den ti byl krátký. Po domluvě." },
        { id: "sp1", name: "Noční střih (45 min)", priceValue: 1300, time: "45 min", desc: "Individuální termín mimo běžné hodiny." },
        { id: "sp4", name: "Rychlý noční refresh", priceValue: 900, time: "30 min", desc: "Když spěcháš i v noci." },
        { id: "sp3", name: "Střih při svíčkách", priceValue: 1800, time: "30 min", desc: "Unikátní atmosféra pro ty, co hledají klid." }
      ]
    },
    operatives: {
      title: "Mistři v oboru",
      subtitle: "Všechno stojí na lidech. Komu dneska svěříš svou vizáž?",
      openFile: "Otevřít profil",
      bookBarber: "Rezervovat termín",
      barbers: {
        tomas: {
          name: "Tomáš",
          role: "Zakladatel & Hlavní barber",
          motto: "",
          story: "Člověk, který věří, že v detailech je síla. Nehledá zkratky, ale poctivou cestu k nejlepšímu výsledku.",
          schedule: "Út–Pá 9:00 – 18:00 | So–Ne 9:00 – 12:00",
          englishSpeaking: "English Speaking",
          specializations: ["Hlavně pánské", "ale zvládnu i dámské styly"]
        }
      }
    },
    theCode: {
      title: "Co byste měli vědět",
      subtitle: "Pár drobností pro hladký průběh:",
      rules: [
        { title: "Jak platit", description: "Bereme hotovost i QR platby. Vyřešíme to hned po servisu u křesla." },
        { title: "Kde zaparkovat", description: "Parkování zdarma přímo u nás nebo kousek vedle. Waze tě možná pošle o dům dál, tak raději sleduj značky." },
        { title: "Jak se připravit", description: "Ideální je vlasy předem nemýt – s lehce mastnými se nám pracuje líp. Styling nechte raději na nás." },
        { title: "Tvé soukromí", description: "Tento prostor je tu pro tvůj klid. Žádné zbytečné oči, jen ty a tvůj styl." }
      ],
      footer: "MMBARBER Uherské Hradiště"
    },
    intro: {
      welcome: "Vítejte v MMBARBER – vašem útočišti v Uherském Hradišti.",
      parking: "PARKOVÁNÍ ZDARMA",
      parkingHint: "Waze občas zlobí, ale kdo hledá, ten nás v Mařaticích najde.",
      copyAddress: "KOPÍROVAT ADRESU",
      openMaps: "OTEVŘÍT MAPY",
      payment: "HOTOVOST / QR KÓD",
      acknowledge: "ROZUMÍM",
      acceptMission: "VSTOUPIT"
    },
    devPanel: {
      title: "VÝVOJOVÝ PANEL",
      accent: "Akcent",
      atmosphere: "Atmosféra",
      tools: "Nástroje",
      filters: "Vizuální Filtry",
      game: "MINIHRA"
    },
    radio: {
      playMe: "Hrajte mi"
    },
    partners: {
      title: "Naši Kumpáni",
      subtitle: ""
    },
    contact: {
      title: "Kudy k nám",
      subtitle: "",
      address: "Adresa shopu",
      connection: "Spojení",
      responsiblePerson: "Odpovědná osoba",
      parking: "Parkování",
      parkingText1: "ZDARMA hned u nás. S Waze raději opatrně, trefí se o kousek vedle.",
      parkingText2: "Dopoledne je tu místa víc než dost.",
      transit: "MHD",
      transitText1: "Zastávka Rudy Kubíčka",
      transitText2: "je doslova pár kroků od dveří."
    },
    footer: {
      description: "Elegance, tradice a poctivá preciznost. Barbershop v Hradišti, kde se tvoří styl, o kterém se sice nemluví nahlas, ale každý ho chce.",
      nav: "Navigace",
      family: "Rodina",
      contact: "Spojení",
      follow: "Sleduj nás",
      seoBottomInfo: "Pánské holičství & barbershop Uherské Hradiště",
      terms: "Obchodní podmínky",
      privacy: "Ochrana soukromí",
      cookies: "Soubory cookies",
      rules: "Provozní řád",
      instagramLine: "Místo, kde jsou všichni šťastní. Aspoň na fotce.",
      tiktokLine: "Obsah, co ti v hlavě dlouho nezůstane.",
      facebookLine: "Zdi nářků, kde se řeší všechno a nic.",
      copyright: "2024–2026 MMBARBER. Všechna práva poctivě hlídána.",
      neklikat: "neklikat",
      tryToCatch: "ZKUS MĚ CHYTIT",
      closeTrap: "ZAVŘÍT PAST",
      likeWeb: "líbí se ti web?",
      callUs: "tak neváhej a ozvi se",
      callToAction: "Volej přímo k nám",
      thankYou: "SYSTÉM BĚŽÍ. Zkus hledat skryté kódy... nebo se zeptej svého barbera, co pro tebe má.",
      cheatActivated: "KÓD PŘIJAT",
      cheatHint: "Hledej dál...",
      close: "ZAVŘÍT",
      vipClub: "V.I.P. KLUB",
      partnerships: "Partnerství",
      followUs: "Sleduj nás",
      reviews: "Recenze",
      intelligenceFeed: "Denní hlášení",
      liveUpdate: "AKTUALIZACE",
      targetRegion: "REGION: SLOVÁCKO",
      priorityNotice: "STAV: AKTIVNÍ"
    },
    rodina: {
      title: "MM BARBER RODINA",
      list: "Seznam",
      network: "Síť spojení",
      divisions: "DIVIZE",
      backToHq: "Zpět domů",
      partnersTrust: "Firmy a lidi, za které dáme ruku do ohně.",
      youForUs: "Vy pro nás. My pro vás.",
      weAreFamily: "MMBARBER není jen o stříhání. Je to o lidech, kteří tvoří kvalitu napříč obory. Jsme jedna Rodina.",
      closeNetwork: "ZAVŘÍT SÍŤ",
      cameraFollows: "Kamera tě sleduje",
      headquarters: "CENTRÁLA"
    },
    sidliste: {
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
      extraContent: "Tady v Uherském Hradišti (lokalita Mařatice) nestavíme na trendech, ale na lidech. Každý střih, každý detail u křesla je odrazem naší loajality k řemeslu. Jsme MM BARBER rodina – komunita, která v UH definuje styl. Přijď si pro svůj poctivý servis a zažij atmosféru, o které se sice nemluví nahlas, ale každý ji v Hradišti hledá. Parkování zdarma přímo u nás je samozřejmostí."
    },
    akademie: {
      title: "MM BARBER AKADEMIE",
      subtitle: "Učení u křesla / Individual Mentoring",
      description: "Chceš se naučit řemeslo tak, jak se má dělat? Bez zbytečných řečí, přímo v akci. Předám ti své know-how, ukážu ti grify s břitvou a naučím tě, jak vidět víc než jen vlasy.",
      cta: "CHCI SE UČIT",
      backToHq: "Zpět do centrály",
      motto: "Řemeslo se nedá vyčíst z knih. Musíš ho mít v rukou.",
      levels: [
        { title: "Základy", desc: "Práce se strojkem, nůžkami a pochopení tvaru." },
        { title: "Břitva & Vousy", desc: "Tradiční holení, napařování a precizní kontury." },
        { title: "Masterclass", desc: "Pokročilé techniky, networking a budování vlastního jména." }
      ],
      guidesTitle: "Knowledge Base & Grooming Guide",
      guides: [
        {
          title: "Jak udržet fade v kondici",
          steps: [
            "Kontury u uší a na krku jsou základ. Pokud máš doma strojek, opatrně je začišťuj jednou za týden.",
            "Pokožka pod vlasy potřebuje dýchat. Peeling hlavy jednou týdně tě zbaví zbytků stylingových past.",
            "Méně je více. Matná pasta ti dodá texturu, ale nesmí vlasy slepit. Stačí množství o velikosti hrášku."
          ],
          keywords: ["údržba fade", "péče o vlasy", "styling tipy"]
        },
        {
          title: "Domácí rituál pro vousy",
          steps: [
            "Kartáč z kančích štětin není luxus, ale nutnost. Prokrví kůži a srovná vousy do latě.",
            "Olej na vousy patří na vlhkou tvář. Uzamkne v nich vlhkost a vousy pak neškrábou.",
            "Při holení kontur se drž pravidla 'dva prsty nad ohryzkem'. To je přirozená hranice tvého stylu."
          ],
          keywords: ["péče o vousy", "olej na vousy", "holení kontur"]
        }
      ],
      backToHqBtn: "Zpět na centrálu",
      noResults: "Nezvládáš to sám? Svěř se do rukou profesionálů.",
      bookBtn: "REZERVOVAT TERMÍN V UH"
    },
    franchisePage: {
      back: "Zpět na centrálu",
      title: "FRANCHISE",
      subtitle: "OPPORTUNITY",
      heroDesc: "Staň se součástí nejsilnější barber značky v regionu. Nabízíme víc než jen licenci – nabízíme cestu k vlastnímu úspěchu.",
      sections: {
        about: {
          title: "O PROJEKTU",
          label: "MM BARBER CONCEPT",
          desc: "Vytvořili jsme systém, který funguje. Spojujeme poctivé řemeslo, moderní technologie a nezaměnitelnou noir atmosféru do jednoho celku.",
          motto: "VAŠE VIZE, NAŠE KNOW-HOW"
        },
        benefits: {
          title: "VÝHODY SPOLUPRÁCE",
          items: [
            "Zavedená značka s vysokou autoritou",
            "Kompletní rezervační a informační systém",
            "Pravidelné školení a mentoring týmu",
            "Marketingová podpora a vizuální identita",
            "Pomoc s výběrem a designem prostor",
            "Exkluzivita pro danou lokalitu"
          ]
        },
        who: {
          title: "PRO KOHO?",
          desc: "Hledáme partnery, kteří nehledají jen investici, ale chtějí tvořit kvalitu a být součástí komunity.",
          motto: "Nezáleží na tom, jestli jsi barber nebo investor. Důležitý je tvůj přístup k řemeslu a respekt k našim hodnotám."
        },
        how: {
          title: "JAK ZAČÍT?",
          steps: [
            "První kontakt a schůzka",
            "Plánování a výběr lokality",
            "Příprava a otevření"
          ]
        }
      },
      contact: {
        title: "MÁTE ZÁJEM?",
        desc: "Pokud věříte naší vizi a chcete růst s námi, ozvěte se. Probereme detaily.",
        email: "POSLAT E-MAIL",
        instagram: "INSTAGRAM"
      },
      footer: "MMBARBER GLOBAL EXPANSION"
    },
    career: {
      title: "Nábor do rodiny",
      subtitle: "Hledáme novou krev",
      vacancyTitle: "Barber / Holič",
      vacancySubtitle: "(Hledáme talent, ne jen zaměstnance)",
      location: "SADOVÁ 1383, MAŘATICE, UHERSKÉ HRADIŠTĚ",
      type: "DPP / IČO / HPP",
      responsibilitiesTitle: "Co tě u nás čeká:",
      responsibilities: [
        "Špičkové pánské střihy a precizní úprava vousů",
        "Práce s břitvou a tradičními metodami",
        "Budování vztahů s klienty – u nás nejsi jen u křesla, jsi hostitel",
        "Udržování standardu naší centrály"
      ],
      requirementsTitle: "Co od tebe chceme:",
      requirements: [
        "Vzdělání nebo praxi v oboru (ale talent poznáme i bez papíru)",
        "Cit pro detail a pevnou ruku",
        "Spolehlivost a loajalitu k týmu",
        "Chuť se neustále učit a posouvat dál"
      ],
      offersTitle: "Co ti dáme my:",
      offers: [
        "Zázemí nejsilnějšího barberu v regionu",
        "Férové peníze, které odpovídají tvému nasazení",
        "Moderní vybavení a prostor, kde tě práce bude bavit",
        "Možnost růstu a mentoring přímo od Tomáše",
        "Tým, který tě nenechá ve štychu"
      ],
      status: "STÁLE HLEDÁME",
      contactMotive: "Cítíš, že patříš k nám? Ozvi se.",
      backToHq: "Zpět na základnu",
      step1Title: "CHCETE BÝT SOUČÁSTÍ MMBARBER?", 
      step1Sub: "První kontakt", 
      step1Content: "Nábor u nás není jen o papírech. Hledáme lidi, kteří chápou, že tohle řemeslo je o loajalitě a poctivé práci. Zjisti, jestli k nám zapadneš.", 
      step1Btn: "Chci to zkusit",
      step2Title: "NEJSME JEN DALŠÍ BARBER V ŘADĚ", 
      step2Sub: "ZÁKLADNÍ PRAVIDLA", 
      step2Content: "Nehrajeme si na trendy, kde má každý v ruce břitvu a říká si barber. U nás je to o tvrdé práci, preciznosti v každém detailu a respektu k řemeslu. Jsme tým, který to bere vážně – a zároveň drží při sobě.\\n\\nHledáme lidi, co chtějí víc než jen 'odkroutit' směnu. Lidi, co na sobě chtějí makat, posouvat se a být součástí něčeho, co má směr.\\n\\nŠéf má jasnou vizi a většinu tohohle místa dokázal vybudovat vlastníma rukama. Teď hledáme někoho, kdo v tom chce pokračovat s námi.\\n\\nChceš jít jinou cestou než ostatní? Přidej se.", 
      step2Btn: "Rozumím a respektuji",
      step3Title: "VLASTNÍ KŘESLO A RESPEKT", 
      step3Sub: "Odměna za disciplínu", 
      step3Content: "Tady se o své lidi staráme jako o vlastní. Majitel ti ukáže cestu a dá ti všechno, co k růstu potřebuješ – mentoring, vybavení a klid na práci. Na oplátku ale vyžadujeme jediné: absolutní respekt k jeho vizi a silné morální zásady.\\n\\nMusíš umět naslouchat a hrát podle pravidel naší rodiny. Pokud máš charakter a chuť se učit, čeká tě místo u našeho stolu a přístup k té nejlepší klientele.", 
      step3Btn: "Jdu do toho",
      step4Title: "VÍTEJ V TÝMU", 
      step4Sub: "Poslední krok", 
      step4Content: "Jsi připraven? Pošli nám pár slov o sobě a svých zkušenostech. Jakmile to vyhodnotíme, spojíme se s tebou.", 
      step4Btn: "Odeslat info (E-mail)"
    },
    rulesPage: {
      title: "PROVOZNÍ ŘÁD",
      subtitle: "Pravidla a standardy pánského holičství MMBarber. Naše mise vyžaduje disciplínu a vzájemný respekt.",
      backBtn: "ZPĚT NA ZÁKLADNU",
      sections: [
        { title: "Rezervace a dochvilnost", text: "Prosíme, dorazte na svou misi včas. Příjezd později než 10 minut může znamenat zrušení termínu bez náhrady, abychom neomezili rekruty po vás." },
        { title: "Zrušení termínu", text: "Změnu nebo zrušení termínu hlaste prosím alespoň 24 hodin předem. Respektujeme váš čas, respektujte prosím náš." },
        { title: "Hygienické standardy", text: "Udržujeme chirurgickou čistotu. Každý nástroj je po každém použití sterilizován. Klid a bezpečí jsou prioritou." },
        { title: "Právo odmítnout", text: "MMBarber si vyhrazuje právo odmítnout klienta, který vykazuje známky nevhodného chování nebo infekčního onemocnění. Držíme úroveň v naší rodině." },
        { title: "Platba", text: "Platba probíhá ihned po skončení mise. Přijímáme hotovost a QR platby." }
      ]
    },
    others: {
      title: "VÍCE O PODNIKU",
      hiddenPlaces: {
        title: "SKRYTÁ MÍSTA MĚSTA",
        name: "Komfort Lounge Bar",
        address: "L. Janáčka 180 686 01, Uherské Hradiště 1",
        description: "Atmosférický shisha bar, ideální místo pro relaxaci u vodní dýmky, kávy nebo kvalitního drinku.",
        slotsTitle: "VOLNÉ SLOTS",
        cta: "PŘIDAT SE"
      },
      members: {
        title: "ČLENOVÉ RODINY",
        description: "Ti, co vědí, kam se dívat...",
        employeeWall: {
          title: "ZEĎ ZAMĚSTNANCŮ",
          year: "ROK 2026",
          employeeName: "Tomáš",
          months: ["LEDEN", "ÚNOR", "BŘEZEN", "DUBEN", "KVĚTEN", "ČERVEN", "ČERVENEC", "SRPEN", "ZÁŘÍ", "ŘÍJEN", "LISTOPAD", "PROSINEC"],
          invitation: "Chceš být taky na naší zdi? Měl by ses stavit, ať víme, jakou přezdívku tam máme napsat!",
          brandVision: "Někdo si myslí, že barbershop je jen o vlasech. Tak to vidí 99 % lidí, ale jsou i tací, co to vidí jinak. Můžeš se přidat a pomoct mi budovat brand."
        }
      },
      support: {
        title: "GRAFIKA",
        description: "",
        reward: "Protože nedávám slevy a Black Friday každý pátek. Chceš podpořit barbera? To, co za tím vším stojí? Tak podpoř!",
        pcLabel: "Pozadí na PC 1920x1080px.",
        phoneLabel: "Tapeta na mobil 1080x1920px",
        downloadBtn: "STÁHNOUT ODMĚNU",
        passwordLabel: "PŘÍSTUPOVÉ HESLO",
        passwordHint: "Pro heslo si musíš jít k barberovi, jen nechoď vedle, ten ho neví...",
        unlock: "ODEMKNOUT",
        denied: "Přístup zamítnut"
      },
      systemVisit: {
        title: "Systém a návštěva",
        description: "Jak se správně připravit na návštěvu u barbera.",
        cta: "VÍCE INFORMACÍ"
      }
    },
    styleDefinition: {
      defineStyle: {
        title: ["Definuj", "Svůj Styl"],
        subtitle: "MMBARBER EXCLUSIVE /",
        modalTitle: "Nevíš, jaký sestřih sedne tvému stylu?",
        modalContent: "Společně najdeme střih, který bude ladit s tím, co nosíš – a s tím, kým jsi. Probereme detaily, vyladíme look a ty odejdeš se sebevědomím. Jako král."
      },
      pairTherapy: {
        title: ["Párová", "Terapie"],
        subtitle: "MMBARBER SPECIAL /",
        modalTitle: "Přijďte spolu. Odejděte ještě víc synchronizovaní.",
        modalContent: "Nejdřív vyladíme jeho styl, večer je řada na ní. Mezitím klid, hovor a atmosféra, která vás vtáhne. Protože styl je lepší, když ho sdílíte."
      }
    },
    environmentSlider: {
      title: "GALERIE",
      detailPhoto: "DETAILNÍ SNÍMEK",
      closeImage: "ZÁBĚR ZBLÍZKA"
    },
    seznamka: {
      description: "Matchmaking z reálného světa.\\nNe každý má čas nebo chuť být online.\\nTohle je jiné. Přijdeš. Sedneš si... a věci se dějí.",
      protocolTitle: "MATCHMAKING PROTOKOL",
      acknowledge: "ROZUMÍM",
      successTitle: "MISE KOMPLETNÍ",
      successText: "Teď jsi připraven na osobní setkání.",
      finishBtn: "UKONČIT MISI",
      cancelBtn: "Zrušit postup a vrátit se",
      confirmedLabel: "Postup potvrzen",
      steps: [
        { title: "Pošli kamaráda", desc: "Pošli kamaráda na střih" },
        { title: "Vezmi přítelkyni", desc: "Vezmi přítelkyni na úpravu konečků" },
        { title: "Naverbuj odvážné", desc: "Nebo pošli někoho známého, kdo se nebojí" }
      ]
    },
    welcome: {
      l1: { title: "DOPIS O PLATBĚ", content: "DŮVĚRNÉ: U nás platíte hotově nebo QR kódem svého bankovnictví." },
      l2: { title: "DOPIS O PARKOVÁNÍ", content: "DŮVĚRNÉ: Parkování zdarma přímo před provozovnou. Dopoledne jsou úplně bez problému. Používáš WAZE? trefíš k barberovi vedle..." },
      l3: { title: "DOPIS O KLIDU", content: "DŮVĚRNÉ: Můžete u nás posedět, nikdo vás nevyhazuje. Jsme rodina." },
      authorized: "Autorizováno MMBARBER"
    },
    cityGuide: {
      compass: {
        label: "Kompas k barberu",
        locating: "ZAMĚŘUJI...",
        distance: "{{distance}} ZBÝVÁ"
      }
    },
    game: {
      default: {
        ranks: [
          { title: "Nováček", desc: "Teprve se učíš držet nůžky." },
          { title: "Učeň", desc: "Základy už máš, ale krev ještě teče." },
          { title: "Holič", desc: "Tvoje ruka je jistá, tvůj styl je vidět." },
          { title: "Mistr", desc: "Vlasy tě poslouchají na slovo." },
          { title: "Legenda", desc: "Stříháš i poslepu. Respekt." }
        ],
        quips: ["Pěkný střih!", "Precizní!", "Styl!", "Zásah!", "Ostrý!"],
        hairTooltip: "OSTŘÍHAT",
        rankLabel: "DOSAŽENÁ ÚROVEŇ"
      }
    },
    specialProjects: {
      likeTheWeb: "Líbí se ti tento web ?",
      division: "DESIGN A VÝVOJOVÁ DIVIZE",
      title: "TVOŘÍME DIGITÁLNÍ IDENTITY",
      description: "Nejsme jen holičství. Jsme komunita lidí, co chtějí tvořit kvalitu. Pokud chceš web, který má duši a ne jen kód, dej nám vědět.",
      writeUs: "Napište nám",
      callUs: "Zavolejte nám"
    }
  },
  en: {
    header: {
      services: "Services",
      gallery: "Gallery",
      seznamka: "MATCHMAKING",
      payment: "PAYMENT",
      schedule: "Service Schedule",
      theCode: "Information",
      more: "More",
      career: "Career",
      aboutUs: "About Us",
      franchise: "FRANCHISE",
      startMission: "HOW IT WORKS",
      compass: "COMPASS",
      web: "WEB",
      on: "ON",
      off: "OFF",
      tracking: "TRACKING POSITION",
      savingData: "SAVING DATA",
      navigate: "NAVIGATE",
      searchPlaceholder: "LOCATE TARGET...",
      reviews: "Reviews"
    },
    intelligence: [
      "Ideal pressure for the sharpest skin fade today. Air in UH is just right.",
      "Looks like things are starting to happen in Hradiště. Beard bookings are filling up.",
      "Windy in Mařatice today - if you don't want hair everywhere, reach for a stronger pomade.",
      "Today's plan is clear: Perfect contours and peace at the chair. We're on standby.",
      "Noticed shorter cuts are coming back to Slovácko. Be a step ahead.",
      "Our booking system is.mmbarber.cz is almost falling behind today. Thanks for the trust.",
      "Recommend trying a hot towel steam today. Nothing relaxes you more.",
      "Everything ready at HQ. Coffee smells good, razors are sharp. Your time has come.",
      "Style rules Hradiště today. Just look around. Be part of it.",
      "Small tip: Put beard oil on right after a shower while pores are open. Works better.",
      "Guys from Brod and Veselí already on their way. Better secure your spot in time.",
      "Don't care about yesterday. What matters is how you look here and now.",
      "Our MM BARBER family is growing. Great to see so many familiar faces.",
      "UH weather favors short hair. Come for your honest taper fade.",
      "Parking in Mařatice completely fine today. Waiting for you right at the door.",
      "In 2026, a groomed beard is basic. No debate.",
      "Spotted one of our fresh cuts in Kunovice. Damn, that's good.",
      "Today's coffee at the barber is as strong as our razors. Exactly how we like it.",
      "Still tuning details. Transitions are a bit cleaner today.",
      "First time here? No stress. You'll feel at home with us.",
      "Noir isn't just a photo filter, it's an attitude. Today is the day to show character.",
      "Summer Film School coming up. Want to look better than those on screen, right?",
      "Wine Festival in UH requires a representative look. Don't leave it to chance.",
      "Playing with millimeters. Because it's exactly those that matter for the best result.",
      "Thanks for sticking with us. Your loyalty is what drives us forward.",
      "Sharpest blades in all of Slovácko here. Come try it on your own skin.",
      "Tuning details with maximum focus today. Want you to leave satisfied.",
      "Don't look for excuses why it can't be done. Find a slot on is.mmbarber.cz.",
      "Almost everyone who comes leaves with a clear head. Try it too.",
      "MM BARBER Uherské Hradiště – honest craft, no empty talk."
    ],
    familyIntelligence: [
      "Vodo Topo Jahoda reports 100% field deployment. Emergencies in UH under control.",
      "Kofipack sent a new shipment for our family. Logistics in Mařatice active.",
      "Malina Photo is developing new evidence from yesterday's event. Visual update expected.",
      "Argema is tuning the sound for the next mission. Slovácko will vibrate.",
      "Sluneční Reality detected new strategic objects in the center of Hradiště.",
      "Comites reports stable growth. Our family's finances are secure.",
      "Šimon Král is preparing a setlist that won't leave anyone at peace. Ready?",
      "O Shawarma Beef is restocking the best meat in town. Mission: Lunch.",
      "Dvůr pod Starýma Horama is preparing a tasting. Our family's blood is wine.",
      "Kudielka is installing new shading systems. Your privacy is our priority.",
      "Dětský domov UH: Together we conjured a few smiles today. Good job.",
      "O Kolečko víc reports: Season in full swing, service running at maximum.",
      "Zdeněk Mička Bílovice: All pipes in the region are in the best hands.",
      "Romana Mičková: Taxes and accounts are balanced with mathematical precision.",
      "Poe Poe: Quick refreshment unit in UH is ready for deployment.",
      "Analysis: Our family is expanding with new influential members. Strength in unity."
    ],
    hero: {
      subtitle: "Barbershop Uherské Hradiště",
      title: "Hradiště barbershop where we talk little but do a lot. Just step in.",
      motto: "Story one: Where style is born",
      chapters: [
        "Story one: Where style is born",
        "Story two: About loyalty",
        "Story three: Honest craft"
      ],
      mottoes: [
        "Story one: Where style is born",
        "Story two: About loyalty",
        "Story three: Honest craft"
      ],
      description: [
        "A place for those who don't need to shout their style to the world.",
        "Quality is recognized even without useless words.",
        "Style you can't buy. You have to earn it.",
        "Quantity doesn't interest us. We want you to leave like a new person.",
        "This isn't just a barbershop. It's our world we invite you to."
      ],
      easterEggSlogans: [
        "We don't care who you were. We care about the vision you leave with.",
        "Not everything we create here you'll see only in the mirror.",
        "The confidence you take from us doesn't end at the door.",
        "Every success of yours is our success too. We're in this together.",
        "It doesn't matter where you come from. It matters what you leave behind.",
        "When you decide to change the rules of the game, you start writing new history.",
        "Some names are forgotten. Real character remains.",
        "Here we build on values that aren't worn much anymore today."
      ],
      nightSlogans: [
        "City's already asleep, but your new style starts right now.",
        "Shh... still awake? Ideal time to secure your chair.",
        "Night belongs to those who know what they want. Your booking awaits.",
        "Tomorrow starts with today's decision. Click and you have your spot.",
        "Don't wait for morning, best slots vanish in the dark."
      ],
      deepNightSlogans: [
        "Midnight. Hradiště quieted... and you know it's time for a change.",
        "This hour belongs to the chosen. Your spot with us is ready.",
        "If you're not sleeping, you have a reason. Take that first step to us.",
        "Best decisions are made at this time. Confirm your booking.",
        "You're closer to your new self than you think right now."
      ],
      cta: "Enter the story",
      bookBtn: "WANT MY CHAIR"
    },
    services: {
      title: "Our services and prices",
      subtitle: "Choose a time slot based on what you need. If you hesitate, we'll fine-tune it at the chair. Evening slots open for ladies by appointment.",
      score: "Experience",
      bookBtn: "Book",
      detailsBtn: "Details",
      revolutNotice: "",
      currencyLabel: "Currency",
      mainTitle: "Time tariff",
      timeTariffNote: "Prices set fairly according to the time I dedicate to your style. You pay for honest work, not a brand.",
      addonsTitle: "Something extra",
      independentTitle: "Just stop by",
      specialTitle: "Night experience",
      totalLabel: "Estimated price",
      timeLabel: "Time in chair",
      independentTimeLabel: "Rest time",
      totalTimeLabel: "Total time with us",
      extraTimeLabel: "Your extra time",
      dynamicPricingTitle: "Dynamic pricing",
      currentSurcharge: "Current rate",
      surchargeReason: "Reason",
      surchargeNone: "Standard price",
      surchargeSat: "Saturday operation (+10%)",
      surchargeSun: "Sunday relax (+30%)",
      surchargeHoliday: "Holiday service (+100%)",
      surchargeAfterHours: "After hours (+30%)",
      surchargeNewYear: "New Year update (+70%)",
      surchargeChristmas: "Christmas morning (+50%)",
      bookingNote: "We run by reservation system. If you see an opening, it's yours.",
      switchDate: "Simulate date",
      pricingModes: {
        workday: "Workday",
        saturday: "Saturday",
        sunday: "Sunday",
        holiday: "Holiday",
        night: "Night hours"
      },
      items: [
        { time: "5 m", name: "QUICK REFRESH", desc: "Contours, details or just a lightning refresh. Enough to hop on for a bit.", price: "100 Kč", priceValue: 100 },
        { time: "10 m", name: "EXPRESS SERVICE", desc: "Neck shave, trim without clippers or something that really can't wait.", price: "180 Kč", priceValue: 180 },
        { time: "15 m", name: "QUICK FADE", desc: "Buzzcut, simple clipper cut or quick side alignment.", price: "280 Kč", priceValue: 280 },
        { time: "20 m", name: "BASIC CUT", desc: "Kids' cuts or simpler trims. Clean, cologne, style.", price: "320 Kč", priceValue: 320 },
        { time: "30 m", name: "CLASSIC", desc: "Precise scissors and clipper cut. Often manage hair and light beard.", price: "450 Kč", priceValue: 450 },
        { time: "45 m", name: "COMPLETE CARE", desc: "Wash, cut, razor shave. If you don't know, this is a safe bet.", price: "650 Kč", priceValue: 650 },
        { time: "1 h", name: "PREMIUM COMBO", desc: "Hair, beard, wash and total blackout. Maximum relaxation.", price: "1,000 Kč", priceValue: 1000 }
      ],
      addons: [
        { id: "add1", name: "Nose wax", priceValue: 30, desc: "Quick and (almost) painless with wax." },
        { id: "add2", name: "Ear wax", priceValue: 30, desc: "Wax epilation for a clean look." },
        { id: "add3", name: "Hot Towel", priceValue: 100, desc: "Traditional steaming and skin relaxation." },
        { id: "add6", name: "Wash with massage", priceValue: 100, desc: "Hair wash with pleasant head massage." },
        { id: "add4", name: "Beard steaming", priceValue: 70, desc: "Preparation for precise shave." },
        { id: "add5", name: "Ear singeing", priceValue: 20, desc: "Traditional method to remove fine hairs." }
      ],
      independent: [
        { id: "ind1", name: "Massage chair (15 min)", priceValue: 100, time: 15, desc: "When you just want to take a breather." },
        { id: "ind2", name: "Relax zone (30 min)", priceValue: 180, time: 30, desc: "Peace, coffee and time for yourself." }
      ],
      special: [
        { id: "sp2", name: "Night Full Service", priceValue: 2500, time: "1 h", desc: "When you need to look great and day was short. By appointment." },
        { id: "sp1", name: "Night cut (45 min)", priceValue: 1300, time: "45 min", desc: "Individual slot outside normal hours." },
        { id: "sp4", name: "Quick night refresh", priceValue: 900, time: "30 min", desc: "When you're in a hurry even at night." },
        { id: "sp3", name: "Candlelight cut", priceValue: 1800, time: "30 min", desc: "Unique atmosphere for those seeking peace." }
      ]
    },
    operatives: {
      title: "Masters of the craft",
      subtitle: "Everything stands on people. Who do you trust with your look today?",
      openFile: "Open profile",
      bookBarber: "Book a slot",
      barbers: {
        tomas: {
          name: "Tomáš",
          role: "Founder & Lead Barber",
          motto: "",
          story: "A man who believes strength is in details. Doesn't look for shortcuts, but honest path to best result.",
          schedule: "Tue–Fri 9:00 – 18:00 | Sat–Sun 9:00 – 12:00",
          englishSpeaking: "English Speaking",
          specializations: ["Mainly men's", "but can handle women's styles too"]
        }
      }
    },
    theCode: {
      title: "What you should know",
      subtitle: "A few small things for smooth process:",
      rules: [
        { title: "How to pay", description: "We take cash and QR payments. We'll handle it right after service at the chair." },
        { title: "Where to park", description: "Free parking right here or just next door. Waze might send you a house over, so better watch signs." },
        { title: "How to prepare", description: "Ideal not to wash hair beforehand - slightly oily is better to work with. Leave styling to us." },
        { title: "Your privacy", description: "This space is here for your peace. No unnecessary eyes, just you and your style." }
      ],
      footer: "MMBARBER Uherské Hradiště"
    },
    intro: {
      welcome: "Welcome to MMBARBER – your sanctuary in Uherské Hradiště.",
      parking: "FREE PARKING",
      parkingHint: "Waze acts up sometimes, but who looks finds us in Mařatice.",
      copyAddress: "COPY ADDRESS",
      openMaps: "OPEN MAPS",
      payment: "CASH / QR CODE",
      acknowledge: "I UNDERSTAND",
      acceptMission: "ENTER"
    },
    akademie: {
      title: "MM BARBER ACADEMY",
      subtitle: "Learning at the Chair / Individual Mentoring",
      description: "Want to learn the craft the way it should be done? No useless talk, straight into action. I'll pass on my know-how, show you razor tricks, and teach you to see more than just hair.",
      cta: "WANT TO LEARN",
      backToHq: "Back to HQ",
      motto: "Craft cannot be read from books. You must have it in your hands.",
      levels: [
        { title: "Basics", desc: "Working with clippers, scissors and understanding the shape." },
        { title: "Razor & Beard", desc: "Traditional shaving, steaming and precise contours." },
        { title: "Masterclass", desc: "Advanced techniques, networking and building your own name." }
      ],
      guidesTitle: "Knowledge Base & Grooming Guide",
      guides: [
        {
          title: "How to keep your fade in condition",
          steps: [
            "Contours around ears and neck are the foundation. If you have clippers at home, carefully clean them once a week.",
            "The skin under the hair needs to breathe. A head scrub once a week gets rid of leftover styling pastes.",
            "Less is more. Matte paste gives you texture, but it shouldn't stick the hair together. A pea-sized amount is enough."
          ],
          keywords: ["fade maintenance", "hair care", "styling tips"]
        },
        {
          title: "Home ritual for beards",
          steps: [
            "A boar bristle brush is not a luxury, it's a necessity. It bloodies the skin and lines up the beard.",
            "Beard oil belongs on a damp face. It locks in moisture and the beard won't scratch.",
            "When shaving contours, follow the 'two fingers above the Adam's apple' rule. That's the natural limit of your style."
          ],
          keywords: ["beard care", "beard oil", "contour shaving"]
        }
      ],
      backToHqBtn: "Back to Headquarters",
      noResults: "Can't handle it yourself? Leave it to the professionals.",
      bookBtn: "BOOK AN APPOINTMENT IN UH"
    },
    franchisePage: {
      back: "Back to Headquarters",
      title: "FRANCHISE",
      subtitle: "OPPORTUNITY",
      heroDesc: "Become part of the strongest barber brand in the region. We offer more than just a license – we offer a path to your own success.",
      sections: {
        about: {
          title: "ABOUT THE PROJECT",
          label: "MM BARBER CONCEPT",
          desc: "We have created a system that works. We combine honest craftsmanship, modern technology and an unmistakable noir atmosphere into one whole.",
          motto: "YOUR VISION, OUR KNOW-HOW"
        },
        benefits: {
          title: "BENEFITS OF COOPERATION",
          items: [
            "Established brand with high authority",
            "Complete reservation and information system",
            "Regular team training and mentoring",
            "Marketing support and visual identity",
            "Help with selection and design of premises",
            "Exclusivity for the given location"
          ]
        },
        who: {
          title: "FOR WHOM?",
          desc: "We are looking for partners who are not just looking for an investment, but want to create quality and be part of the community.",
          motto: "It doesn't matter if you are a barber or an investor. What matters is your approach to the craft and respect for our values."
        },
        how: {
          title: "HOW TO START?",
          steps: [
            "First contact and meeting",
            "Planning and location selection",
            "Preparation and opening"
          ]
        }
      },
      contact: {
        title: "INTERESTED?",
        desc: "If you believe in our vision and want to grow with us, get in touch. We'll discuss the details.",
        email: "SEND E-MAIL",
        instagram: "INSTAGRAM"
      },
      footer: "MMBARBER GLOBAL EXPANSION"
    },
    career: {
      title: "Join the Family",
      subtitle: "Looking for new blood",
      vacancyTitle: "Barber",
      vacancySubtitle: "(Looking for talent, not just an employee)",
      location: "SADOVÁ 1383, MAŘATICE, UHERSKÉ HRADIŠTĚ",
      type: "Full-time / Part-time / IČO",
      responsibilitiesTitle: "What awaits you:",
      responsibilities: [
        "Top-tier men's haircuts and precise beard grooming",
        "Working with razors and traditional methods",
        "Building client relationships - you're a host, not just a barber",
        "Maintaining our headquarters' standards"
      ],
      requirementsTitle: "What we want from you:",
      requirements: [
        "Education or experience in the field (talent speaks for itself)",
        "Eye for detail and a steady hand",
        "Reliability and loyalty to the team",
        "Desire to constantly learn and move forward"
      ],
      offersTitle: "What we give you:",
      offers: [
        "Background of the strongest barbershop in the region",
        "Fair pay corresponding to your dedication",
        "Modern equipment and space you'll enjoy working in",
        "Growth and mentoring directly from Tomáš",
        "A team that won't leave you hanging"
      ],
      status: "STILL LOOKING",
      contactMotive: "Feel like you belong with us? Get in touch.",
      backToHq: "Back to HQ",
      step1Title: "WANT TO BE PART OF MMBARBER?", 
      step1Sub: "First Contact", 
      step1Content: "Recruitment here isn't just about papers. We look for people who understand that this craft is about loyalty and honest work. Find out if you'll fit in.", 
      step1Btn: "Want to try",
      step2Title: "WE ARE NOT JUST ANOTHER BARBERSHOP", 
      step2Sub: "BASIC RULES", 
      step2Content: "We don't play trends where everyone has a razor and calls themselves a barber. Here it's about hard work, precision in every detail and respect for the craft. We're a team that takes it seriously - and sticks together.\\n\\nWe're looking for people who want more than just 'finishing' a shift. People who want to work on themselves, push forward and be part of something that has direction.\\n\\nThe boss has a clear vision and built most of this place with his own hands. Now we're looking for someone to continue with us.\\n\\nWant to go a different way? Join us.", 
      step2Btn: "Understand and respect",
      step3Title: "OWN CHAIR AND RESPECT", 
      step3Sub: "Reward for Discipline", 
      step3Content: "Here we take care of our people like our own. The owner will show you the way and give you everything you need to grow - mentoring, gear and peace to work. In return we require one thing: absolute respect for his vision and strong moral principles.\\n\\nYou must be able to listen and play by the rules of our family. If you have character and desire to learn, a seat at our table and access to the best clientele awaits you.", 
      step3Btn: "I'm in",
      step4Title: "WELCOME TO THE TEAM", 
      step4Sub: "Last Step", 
      step4Content: "Ready? Send us a few words about yourself and experiences. Once evaluated, we'll connect.", 
      step4Btn: "Send Info (E-mail)"
    },
    rulesPage: {
      title: "OPERATING RULES",
      subtitle: "Rules and standards of MMBarber men's barbershop. Our mission requires discipline and mutual respect.",
      backBtn: "BACK TO HQ",
      sections: [
        { title: "Booking and Punctuality", text: "Please arrive on time. Arriving more than 10 minutes late may mean cancellation without compensation so as not to limit recruits after you." },
        { title: "Cancellation", text: "Report changes or cancellations at least 24 hours ahead. We respect your time, please respect ours." },
        { title: "Hygiene Standards", text: "We maintain surgical cleanliness. Every tool sterilized after each use. Peace and safety are priorities." },
        { title: "Right to Refuse", text: "MMBarber reserves right to refuse client showing signs of inappropriate behavior or infectious disease. We keep standards in our family." },
        { title: "Payment", text: "Payment right after mission. We take cash and QR payments." }
      ]
    },
    others: {
      title: "MORE ABOUT THE BUSINESS",
      hiddenPlaces: {
        title: "HIDDEN PLACES",
        name: "Komfort Lounge Bar",
        address: "L. Janáčka 180, Uherské Hradiště",
        description: "Atmospheric shisha bar, ideal place to relax with shisha, coffee or a quality drink.",
        slotsTitle: "FREE SLOTS",
        cta: "JOIN"
      },
      members: {
        title: "FAMILY MEMBERS",
        description: "Those who know where to look...",
        employeeWall: {
          title: "EMPLOYEE WALL",
          year: "YEAR 2026",
          employeeName: "Tomáš",
          months: ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"],
          invitation: "Want to be on our wall too? Stop by so we know what nickname to write!",
          brandVision: "Some think a barbershop is just hair. That's how 99% see it, but others see it differently. Join and help me build a brand."
        }
      },
      support: {
        title: "GRAPHICS",
        description: "",
        reward: "Since I don't do discounts and Black Friday every Friday. Want to support the barber? What's behind it all? So support!",
        pcLabel: "PC Background 1920x1080px.",
        phoneLabel: "Phone wallpaper 1080x1920px",
        downloadBtn: "DOWNLOAD REWARD",
        passwordLabel: "ACCESS PASSWORD",
        passwordHint: "For password you must go to the barber, just don't go next door, he doesn't know it...",
        unlock: "UNLOCK",
        denied: "Access denied"
      },
      systemVisit: {
        title: "System and Visit",
        description: "How to properly prepare for a barber visit.",
        cta: "MORE INFO"
      }
    },
    styleDefinition: {
      defineStyle: {
        title: ["Define", "Your Style"],
        subtitle: "MMBARBER EXCLUSIVE /",
        modalTitle: "Don't know which cut fits your style?",
        modalContent: "Together we'll find a cut that harmonizes with what you wear - and who you are. We'll discuss details, tune the look and you'll leave with confidence. Like a king."
      },
      pairTherapy: {
        title: ["Pair", "Therapy"],
        subtitle: "MMBARBER SPECIAL /",
        modalTitle: "Come together. Leave even more synchronized.",
        modalContent: "First we'll tune his style, evening is her turn. Meanwhile peace, talk and atmosphere that draws you in. Because style is better when shared."
      }
    },
    environmentSlider: {
      title: "GALLERY",
      detailPhoto: "DETAIL SHOT",
      closeImage: "CLOSE SHOT"
    },
    seznamka: {
      description: "Real world matchmaking.\\nNot everyone has time/desire to be online.\\nThis is different. You come. Sit down... and things happen.",
      protocolTitle: "MATCHMAKING PROTOCOL",
      acknowledge: "I UNDERSTAND",
      successTitle: "MISSION COMPLETE",
      successText: "Now you're ready for a personal meeting.",
      finishBtn: "FINISH MISSION",
      cancelBtn: "Cancel progress and return",
      confirmedLabel: "Progress confirmed",
      steps: [
        { title: "Send a friend", desc: "Send a friend for a cut" },
        { title: "Take a girlfriend", desc: "Take a girlfriend for a trim" },
        { title: "Recruit the brave", desc: "Or send someone known who isn't afraid" }
      ]
    },
    welcome: {
      l1: { title: "PAYMENT LETTER", content: "CONFIDENTIAL: We take cash or QR code of your bank." },
      l2: { title: "PARKING LETTER", content: "CONFIDENTIAL: Free parking right in front. Mornings completely fine. Using WAZE? You'll hit the barber next door..." },
      l3: { title: "PEACE LETTER", content: "CONFIDENTIAL: You can sit with us, nobody's throwing you out. We are family." },
      authorized: "Authorized by MMBARBER"
    },
    cityGuide: {
      compass: {
        label: "Barber Compass",
        locating: "LOCATING...",
        distance: "{{distance}} REMAINING"
      }
    },
    game: {
      default: {
        ranks: [
          { title: "Rookie", desc: "Just learning to hold scissors." },
          { title: "Apprentice", desc: "Basics there, but blood still flows." },
          { title: "Barber", desc: "Hand is steady, style visible." },
          { title: "Master", desc: "Hair obeys every word." },
          { title: "Legend", desc: "Cut even blindfolded. Respect." }
        ],
        quips: ["Nice cut!", "Precise!", "Style!", "Hit!", "Sharp!"],
        hairTooltip: "CUT HAIR",
        rankLabel: "ACHIEVED LEVEL"
      }
    },
    specialProjects: {
      likeTheWeb: "Like this web?",
      division: "DESIGN AND DEVELOPMENT DIVISION",
      title: "WE CREATE DIGITAL IDENTITIES",
      description: "Not just a barbershop. A community wanting quality. If you want a web with soul, not just code, let us know.",
      writeUs: "Write us",
      callUs: "Call us"
    },
    seo: {
      title: "MMBARBER | Best Barbershop in Uherské Hradiště (Mařatice)",
      description: "Looking for top skin fade, beard grooming or just a place to clear your head? MMBARBER in UH is more than hair. It's tradition, style and honest craft in the heart of Slovácko.",
      keywords: "barbershop Uherské Hradiště, men's hairdressing UH, skin fade Hradiště, beard grooming Uherské Hradiště, razor shave Slovácko, MM BARBER Mařatice, men's cut UH, hair salon for men Hradiště, barber gift voucher",
      extraContent: "Here in Uherské Hradiště (Mařatice) we don't build on trends, but on people. Every cut, every detail is reflection of our loyalty to craft. We are MM BARBER family - community defining style in UH. Come for honest service and experience atmosphere everyone looks for in Hradiště. Free parking at our door."
    }
  },
  boss: {
    header: {
      services: "Kšefty",
      gallery: "Důkazy",
      seznamka: "Informátoři",
      payment: "Výpalné",
      schedule: "Plán akcí",
      theCode: "Náš kodex",
      more: "Ostatní",
      career: "Nábor",
      startMission: "PRAVIDLA RODINY",
      searchPlaceholder: "Ptej se jako šéf."
    },
    hero: {
      subtitle: "Teritorium Uherské Hradiště",
      title: "Barbershop naší rodiny. O čem se mlčí, to má největší váhu.",
      cta: "Respektovat rodinu",
      bookBtn: "Domluvit schůzku"
    },
    services: {
      title: "Ceník kšeftů",
      subtitle: "Vyber si, kolik času nám věnuješ. U křesla pak dojednáme zbytek.",
      bookBtn: "Mám zájem",
      detailsBtn: "Složka"
    },
    operatives: {
      title: "Naši lidi",
      subtitle: "Vyber si svého specialistu.",
      openFile: "Složka",
      bookBarber: "Domluvit se s ním"
    },
    seo: {
      title: "MMBARBER | Teritorium Uherské Hradiště | Rezervace kšeftu",
      description: "Vstup do světa naší rodiny v Uherském Hradišti. MM BARBER nabízí bezcitnou preciznost, loajalitu a styl, který si nekoupíš.",
      keywords: "MMBARBER rodina, šéf Tomáš, Uherské Hradiště, kšefty, nábor, noir styl, loajalita, řemeslo, břitva",
      extraContent: "Tady u křesla se neřeší jen vlasy, ale i kšefty a budoucnost. Pokud máš ambice a chceš víc, jsi na správné adrese. UH - Mařatice - MM BARBER."
    }
  },
  falco: {
    header: {
      services: "Extra Klasse",
      gallery: "Archiv",
      seznamka: "Wiener Club",
      payment: "Geld & Gold",
      schedule: "Zeitplan",
      theCode: "Wiener Kodex",
      more: "Exkluzivita",
      career: "Nábor ELITE",
      startMission: "JAK TO U NÁS CHODÍ",
      searchPlaceholder: "Alles klar?"
    },
    intro: {
      welcome: "Willkommen im MMBARBER Imperial Territory.",
      parking: "KOSTENLOSES PARKEN",
      parkingHint: "Waze wird Sie vielleicht woanders hinschicken. Aber die Spieler wissen, wo die richtige Adresse ist.",
      copyAddress: "ADRESSE KOPIEREN",
      openMaps: "KARTEN ÖFFNEN",
      payment: "BAR / QR-ZAHLUNG",
      acknowledge: "ICH VERSTEHE",
      acceptMission: "INSTRUKTIONEN AKZEPTIEREN"
    }
  }
};
"""

    with open(r'c:\Users\micka\Documents\MMBarber_web\src\locales\translations.ts', 'w', encoding='utf-8') as f:
        f.write(header)

if __name__ == "__main__":
    final_rebuild_from_clean_source()
