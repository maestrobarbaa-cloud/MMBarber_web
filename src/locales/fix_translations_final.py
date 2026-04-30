import re

def fix_translations_final():
    path = r'c:\Users\micka\Documents\MMBarber_web\src\locales\translations.ts'
    
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    # AKADEMIE CS
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
      noResults: "Nezvládáš to sám? Svěř se do rukou profesionálů.",
      bookBtn: "REZERVOVAT TERMÍN V UH"
    },"""

    # FRANCHISE CS
    franchise_cs = """    franchisePage: {
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
    },"""

    # AKADEMIE EN
    akademie_en = """    akademie: {
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

    # FRANCHISE EN
    franchise_en = """    franchisePage: {
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

    # 1. Clean up existing (possibly broken) blocks
    content = re.sub(r'\n\s*akademie:\s*\{.*?\},', '', content, flags=re.DOTALL)
    content = re.sub(r'\n\s*franchisePage:\s*\{.*?\},', '', content, flags=re.DOTALL)

    # 2. Insert into CS
    cs_pattern = re.compile(r'(cs:\s*\{.*?)(career:\s*\{)', re.DOTALL)
    content = cs_pattern.sub(r'\1' + akademie_cs + '\n' + franchise_cs + '\n    ' + r'\2', content)

    # 3. Insert into EN
    en_pattern = re.compile(r'(en:\s*\{.*?)(career:\s*\{)', re.DOTALL)
    content = en_pattern.sub(r'\1' + akademie_en + '\n' + franchise_en + '\n    ' + r'\2', content)

    # 4. Final Mojibake fix
    replacements = {
        '├á': 'à', '├ę': 'é', '├ş': 'í', '├│': 'ó', '├║': 'ú', '┼»': 'ů', '─Ť': 'ě',
        '┼í': 'š', '─Ź': 'č', '┼Ö': 'ř', '┼ż': 'ž', '┼ś': 'Ř', '─î': 'Č', '┼á': 'Š',
        '┬á': ' ', 'ÔÇô': '–', '├ë': 'É', '┼┼': 'ž', '┼║': 'ž', '┼ş': 'í', '├ü': 'Á',
        'SADOV├ü': 'SADOVÁ', 'MA┼śATICE': 'MAŘATICE', 'Hradi┼ít─Ť': 'Hradišti',
        'Anal├Żza': 'Analýza', 'Star├Żma': 'Starýma'
    }
    
    for old, new in replacements.items():
        content = content.replace(old, new)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_translations_final()
