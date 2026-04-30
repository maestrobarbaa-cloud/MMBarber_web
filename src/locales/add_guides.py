import re

def add_guides():
    path = r'c:\Users\micka\Documents\MMBarber_web\src\locales\translations.ts'
    
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    akademie_new = """    akademie: {
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

    content = re.sub(r'akademie:\s*\{.*?\},\s*kariera:', akademie_new + '\n    kariera:', content, flags=re.DOTALL)

    # English version
    akademie_en_new = """    akademie: {
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

    content = re.sub(r'en:\s*\{.*?\n\s*akademie:\s*\{.*?\},\s*kariera:', lambda m: m.group(0).replace(re.search(r'akademie:\s*\{.*?\}', m.group(0), re.DOTALL).group(0), akademie_en_new), content, flags=re.DOTALL)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    add_guides()
