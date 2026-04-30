import re

def final_surgical_fix():
    path = r'c:\Users\micka\Documents\MMBarber_web\src\locales\translations.ts'
    
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    # Split into blocks
    # We know the structure:
    # cs: { ... },
    # en: { ... },
    # boss: { ... },
    # falco: { ... }
    
    parts = re.split(r'\n\s*(en|boss|falco):\s*\{', content)
    # parts[0] is cs block (and header)
    # parts[1] is 'en', parts[2] is en block
    # parts[3] is 'boss', parts[4] is boss block
    # parts[5] is 'falco', parts[6] is falco block

    cs_block = parts[0]
    en_block = parts[2]
    boss_block = parts[4]
    falco_block = parts[6]

    # AKADEMIE & FRANCHISE definitions
    ak_cs = """    akademie: {
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
      backToHqBtn: "Zpět na základnu",
      noResults: "Nezvládáš to sám? Svěř se do rukou profesionálů.",
      bookBtn: "REZERVOVAT TERMÍN V UH"
    },"""

    fr_cs = """    franchisePage: {
      back: "Zpět na základnu",
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
    },"""

    ak_en = """    akademie: {
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
    },"""

    fr_en = """    franchisePage: {
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
    },"""

    def clean_and_insert(block, ak, fr, is_cs):
        # Remove existing ak/fr
        block = re.sub(r'\n\s*akademie:\s*\{.*?\},', '', block, flags=re.DOTALL)
        block = re.sub(r'\n\s*franchisePage:\s*\{.*?\},', '', block, flags=re.DOTALL)
        
        # Humanize Career in CS only
        if is_cs:
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
      step4Content: "Jsi připraven? Pošli nám pár slov o osobně a svých zkušenostech. Jakmile to vyhodnotíme, spojíme se s tebou.", 
      step4Btn: "Odeslat info (E-mail)"
    },"""
            block = re.sub(r'career:\s*\{.*?\},', career_cs, block, flags=re.DOTALL)
        
        # Insert ak/fr before career
        block = re.sub(r'career:\s*\{', ak + '\n' + fr + '\n    career: {', block, flags=re.DOTALL)
        return block

    cs_new = clean_and_insert(cs_block, ak_cs, fr_cs, True)
    en_new = clean_and_insert(en_block, ak_en, fr_en, False)
    
    # Reconstruct
    new_content = cs_new + '\n  en: {' + en_new + '\n  boss: {' + boss_block + '\n  falco: {' + falco_block

    # Final Mojibake fix
    replacements = {
        '├á': 'à', '├ę': 'é', '├ş': 'í', '├│': 'ó', '├║': 'ú', '┼»': 'ů', '─Ť': 'ě',
        '┼í': 'š', '─Ź': 'č', '┼Ö': 'ř', '┼ż': 'ž', '┼ś': 'Ř', '─î': 'Č', '┼á': 'Š',
        '┬á': ' ', 'ÔÇô': '–', '├ë': 'É', '┼┼': 'ž', '┼║': 'ž', '┼ş': 'í', '├ü': 'Á',
        'SADOV├ü': 'SADOVÁ', 'MA┼śATICE': 'MAŘATICE', 'Hradi┼ít─Ť': 'Hradišti',
        'Anal├Żza': 'Analýza', 'Star├Żma': 'Starýma'
    }
    
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)

if __name__ == "__main__":
    final_surgical_fix()
