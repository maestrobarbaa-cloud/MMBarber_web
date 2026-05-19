import re

file_path = "src/components/Profiles.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_dialogues = """const MONTHLY_DIALOGUES: Record<number, DialogueTurn[][]> = {
  // 1. LEDEN - "brzdím"
  0: [
    [
      { speaker: "tomas", text: { cs: "Ty jsi mi říkala, že žiješ zdravě.", en: "You told me you live healthy." } },
      { speaker: "nella", text: { cs: "A žiju.", en: "And I do." } },
      { speaker: "tomas", text: { cs: "A to kafe co křupeš jak kukuřici?", en: "And what about the coffee you crunch like corn?" } },
      { speaker: "nella", text: { cs: "To bylo dřív. Teď už jen brzdím.", en: "That was before. Now I just slow down." } },
      { speaker: "tomas", text: { cs: "Brzdíš tím, že to křupeš tišeji?", en: "You slow down by crunching it quieter?" } },
      { speaker: "nella", text: { cs: "Přesně.", en: "Exactly." } }
    ]
  ],
  // 2. ÚNOR - "kebab incident"
  1: [
    [
      { speaker: "tomas", text: { cs: "A pak jsem tě viděl jíst kebab tak, že jsem musel utírat podlahu.", en: "And then I saw you eating a kebab in a way that I had to mop the floor." } },
      { speaker: "nella", text: { cs: "To byl cheat day.", en: "That was a cheat day." } },
      { speaker: "tomas", text: { cs: "To byl státní svátek kalorickýho zločinu.", en: "That was a national holiday of caloric crime." } }
    ]
  ],
  // 3. BŘEZEN - "logistika budoucnosti"
  2: [
    [
      { speaker: "tomas", text: { cs: "To 'malý překvapení' co jsi nechala uprostřed místnosti…", en: "That 'little surprise' you left in the middle of the room..." } },
      { speaker: "nella", text: { cs: "To nebylo překvapení.", en: "That wasn't a surprise." } },
      { speaker: "tomas", text: { cs: "Co teda?", en: "What then?" } },
      { speaker: "nella", text: { cs: "Logistika budoucnosti.", en: "Logistics of the future." } }
    ]
  ],
  // 4. DUBEN - "krtičinci"
  3: [
    [
      { speaker: "tomas", text: { cs: "Ty jsi fakt bouchala krtičince smetákem.", en: "You were really smashing molehills with a broom." } },
      { speaker: "nella", text: { cs: "Kontrola teritoria.", en: "Territory control." } },
      { speaker: "tomas", text: { cs: "To byl venkovní MMA zápas s přírodou.", en: "That was an outdoor MMA fight with nature." } }
    ]
  ],
  // 5. KVĚTEN - "zahradníci"
  4: [
    [
      { speaker: "tomas", text: { cs: "Neměl jsem nic po ruce, tak jsem dal svým 'osobním zahradníkům' trhat trávu kombinačkama.", en: "I had nothing on hand, so I had my 'personal gardeners' pull grass with pliers." } },
      { speaker: "nella", text: { cs: "A fungovalo to?", en: "Did it work?" } },
      { speaker: "tomas", text: { cs: "Ne.", en: "No." } },
      { speaker: "nella", text: { cs: "Tak to bylo správně.", en: "Then it was correct." } }
    ]
  ],
  // 6. ČERVEN - "archeologie jídla"
  5: [
    [
      { speaker: "tomas", text: { cs: "Na baru vždycky necháš jídlo a ono tam přežije do dalšího dne.", en: "You always leave food on the bar and it survives there until the next day." } },
      { speaker: "nella", text: { cs: "Meal prep.", en: "Meal prep." } },
      { speaker: "tomas", text: { cs: "To už není jídlo, to je archeologický nález.", en: "That's no longer food, that's an archaeological find." } }
    ]
  ],
  // 7. ČERVENEC - "zušlechťování"
  6: [
    [
      { speaker: "tomas", text: { cs: "Ty se vždycky začneš zušlechťovat a foukat, jako bys šla na summit.", en: "You always start grooming and blowing your hair as if you're going to a summit." } },
      { speaker: "nella", text: { cs: "Musím být připravená.", en: "I have to be ready." } },
      { speaker: "tomas", text: { cs: "Na co?", en: "For what?" } },
      { speaker: "nella", text: { cs: "Na život.", en: "For life." } }
    ]
  ],
  // 8. SRPEN - "školní systém"
  7: [
    [
      { speaker: "tomas", text: { cs: "Tvoje paní učitelky tě naučily neuznat porážku, nepřiznat chybu a stát si za svým.", en: "Your teachers taught you to never accept defeat, never admit a mistake, and stand your ground." } },
      { speaker: "nella", text: { cs: "Ano.", en: "Yes." } },
      { speaker: "tomas", text: { cs: "To vysvětluje úplně všechno.", en: "That explains absolutely everything." } }
    ]
  ],
  // 9. ZÁŘÍ - "80 000"
  8: [
    [
      { speaker: "nella", text: { cs: "Šéfe, já nevstanu za míň jak 80 000 v čistém.", en: "Boss, I don't get out of bed for less than 80,000 net." } },
      { speaker: "tomas", text: { cs: "Tady máš 80 korun za celý den.", en: "Here is 80 crowns for the whole day." } },
      { speaker: "nella", text: { cs: "To je málo.", en: "That's not enough." } },
      { speaker: "tomas", text: { cs: "Levná pracovní síla se vždycky hodí. Přijď zas.", en: "Cheap labor always comes in handy. Come again." } }
    ]
  ],
  // 10. ŘÍJEN - "neděléééj"
  9: [
    [
      { speaker: "nella", text: { cs: "Neděléééj!", en: "Don't do thaaaat!" } },
      { speaker: "tomas", text: { cs: "Proč?", en: "Why?" } },
      { speaker: "nella", text: { cs: "Já jsem beran.", en: "I'm an Aries." } },
      { speaker: "tomas", text: { cs: "Paráda. To jsem si přál.", en: "Great. Just what I wished for." } }
    ]
  ],
  // 11. LISTOPAD - "realita kontrola"
  10: [
    [
      { speaker: "tomas", text: { cs: "U tebe se nedá poznat, co je plán a co je náhoda.", en: "With you, it's impossible to tell what's a plan and what's an accident." } },
      { speaker: "nella", text: { cs: "To je záměr.", en: "That's intentional." } },
      { speaker: "tomas", text: { cs: "A výsledek?", en: "And the result?" } },
      { speaker: "nella", text: { cs: "Chaos, co funguje.", en: "Chaos that works." } }
    ]
  ],
  // 12. PROSINEC - "shrnutí roku"
  11: [
    [
      { speaker: "tomas", text: { cs: "Tak co tohle všechno bylo?", en: "So what was all this?" } },
      { speaker: "nella", text: { cs: "Normální rok.", en: "A normal year." } },
      { speaker: "tomas", text: { cs: "Tohle není normální.", en: "This isn't normal." } },
      { speaker: "nella", text: { cs: "Pro tebe ne.", en: "Not for you." } },
      { speaker: "tomas", text: { cs: "A pro tebe?", en: "And for you?" } },
      { speaker: "nella", text: { cs: "Každodenní standard.", en: "Daily standard." } }
    ]
  ]
};"""

# Regex to match the old MONTHLY_DIALOGUES block entirely
pattern = r"const MONTHLY_DIALOGUES: Record<number, DialogueTurn\[\]\[\]> = \{.*?\n};\n"

new_content, count = re.subn(pattern, new_dialogues + "\n", content, flags=re.DOTALL)

if count > 0:
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Replaced MONTHLY_DIALOGUES successfully ({count} replacement).")
else:
    print("Could not find MONTHLY_DIALOGUES block to replace.")
