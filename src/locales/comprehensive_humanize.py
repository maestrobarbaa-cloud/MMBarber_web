import re

def comprehensive_humanize():
    path = r'c:\Users\micka\Documents\MMBarber_web\src\locales\translations.ts'
    
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    # Humanizing CS Career (removing robotic jargon)
    career_cs = """    career: {
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
    },"""

    content = re.sub(r'career:\s*\{.*?\},\s*rulesPage:', career_cs + '\n    rulesPage:', content, flags=re.DOTALL)

    # Humanizing CS Academy
    akademie_cs = """    akademie: {
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
      noResults: "Nezvládáte to sami? Svěřte se do rukou profesionálů.",
      bookBtn: "REZERVOVAT TERMÍN V UH"
    },"""

    content = re.sub(r'akademie:\s*\{.*?\},\s*career:', akademie_cs + '\n    career:', content, flags=re.DOTALL)

    # General replacements for any leftover AI-ish patterns or encoding issues
    replacements = {
        'Zpět na ústředí': 'Zpět na základnu',
        'Zkušební protokol': 'První kontakt',
        'Nezvládáte to sami?': 'Nezvládáš to sám?',
        'Svěřte se do rukou': 'Svěř se do rukou',
        'CHOD├Ź': 'CHODÍ',
        '┼áET┼ś├Ź': 'ŠETŘÍ',
        'Hradi┼ít─Ť': 'Hradišti',
        'Ma┼Öatice': 'Mařatice',
        'Slov├ícko': 'Slovácko',
        'p┼Ö├şmo': 'přímo',
        '├║─Źty': 'účty',
        '├║sm─Ťv┼»': 'úsměvů'
    }

    for old, new in replacements.items():
        content = content.replace(old, new)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    comprehensive_humanize()
