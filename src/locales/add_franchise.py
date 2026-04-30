import re

def add_franchise_translations():
    path = r'c:\Users\micka\Documents\MMBarber_web\src\locales\translations.ts'
    
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

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

    content = re.sub(r'akademie:\s*\{.*?\},\s*career:', lambda m: m.group(0).replace('akademie:', 'akademie:') + '\n' + franchise_cs + '\n', content, flags=re.DOTALL)

    # English version
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

    content = re.sub(r'en:\s*\{.*?\n\s*akademie:\s*\{.*?\},\s*career:', lambda m: m.group(0).replace('akademie:', 'akademie:') + '\n' + franchise_en + '\n', content, flags=re.DOTALL)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    add_franchise_translations()
