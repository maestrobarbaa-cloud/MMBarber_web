export type SEOVariant = {
  id: string;
  title: string;
  content: string;
  keywords: string[];
};

export const ADVANCED_SEO_CONTENT: Record<string, Record<string, SEOVariant[]>> = {
  cs: {
    classic: [
      {
        id: "classic-1",
        title: "MM BARBER: Nejlepší Barbershop v Uherském Hradišti a ČR",
        content: `
          <h2>Prémiový pánský střih a úprava vousů</h2>
          <p>Hledáte ten nejlepší barbershop v Uherském Hradišti? MM BARBER není jen holičství, je to instituce. Zaměřujeme se na precizní pánský střih, dokonalou úpravu vousů a luxusní péči o muže. Naše standardy přesahují hranice Zlínského kraje – přinášíme světovou kvalitu přímo do srdce Slovácka. Ať už hledáte moderní fade, klasický pompadour nebo dokonalé oholení břitvou (hot towel shave), naši mistři holiči jsou tu pro vás.</p>
          <h3>Seznamka a sebevědomí: První dojem rozhoduje</h3>
          <p>Víme, že dokonalý vzhled je klíčem k úspěchu – a to i v osobním životě. Proto MM BARBER přesahuje hranice běžného salonu. Připravujeme muže na klíčové okamžiky, od důležitých byznys schůzek až po první rande. Sebevědomý muž je přitažlivý muž. Naše exkluzivní propojení s prémiovou seznamkou pro moderní muže pomáhá našim klientům nejen skvěle vypadat, ale také najít tu pravou.</p>
        `,
        keywords: ["Nejlepší barbershop Uherské Hradiště", "pánský střih", "úprava vousů", "holičství", "seznamka pro muže"]
      },
      {
        id: "classic-2",
        title: "Holistická péče o muže: Světový standard na Slovácku",
        content: `
          <h2>Více než jen ostříhání. Životní styl.</h2>
          <p>MM BARBER redefinuje to, co znamená být světovým barbershopem. Náš přístup spojuje tradiční řemeslo s nejnovějšími trendy v pánské kosmetice. Jsme lídrem v oblasti pánského stylingu v celé České republice. Každý náš klient dostává VIP péči – od welcome drinku, přes precizní fade, až po finální styling špičkovými produkty.</p>
          <h3>Vztahy, byznys a charisma</h3>
          <p>Věříme, že úspěch v práci i v lásce začíná u zdravého sebevědomí. Proto u nás nekončíme jen u vlasů. Nabízíme konzultace stylu a úzce spolupracujeme s platformami pro osobní rozvoj a seznamování. V MM BARBER budujeme komunitu úspěšných a sebevědomých mužů, kteří vědí, co od života chtějí.</p>
        `,
        keywords: ["Barbershop ČR", "pánská péče", "pánský styling", "VIP péče", "rozvoj mužů", "seznamka"]
      }
    ],
    slovacko: [
      {
        id: "slovacko-1",
        title: "Tradice a styl: Nejkvalitnější holičství na Slovácku",
        content: `
          <h2>Srdce regionu bije pro poctivé řemeslo</h2>
          <p>V Uherském Hradišti si zakládáme na tradici a poctivé práci. MM BARBER spojuje dědictví slováckých mistrů s moderními světovými trendy. Naše holičství je místem, kde se setkávají generace mužů. Od klasické úpravy vousů až po moderní střihy, které obstojí i v těch nejnáročnějších podmínkách. Jsme hrdí na to, že jsme nejvyhledávanějším barbershopem v regionu Slovácko.</p>
          <h3>Láska a víno: Prémiová seznamka pro místní gentlemany</h3>
          <p>K dobrému vzhledu patří i jiskra v oku. Na Slovácku víme, jak oslavovat život. Náš barbershop funguje jako neformální hub pro navazování kontaktů. Pro naše klienty jsme vytvořili unikátní koncept prémiové seznamky. Připravíme vás tak, abyste na slavnostech vína, hodech, nebo při intimní večeři zanechali nezapomenutelný dojem.</p>
        `,
        keywords: ["Holičství Slovácko", "Barbershop Uherské Hradiště", "tradiční holič", "seznamka Zlínský kraj", "pánský střih Hradiště"]
      }
    ],
    noir: [
      {
        id: "noir-1",
        title: "MM BARBER: Tajný klub pro pravé gentlemany",
        content: `
          <h2>Atmosféra 30. let a nekompromisní kvalita</h2>
          <p>Vstupte do světa, kde vládne stín, styl a respekt. Noir edice MM BARBER vás přenese do éry klasických mafiánských filmů, ale s tou nejmodernější péčí současnosti. Naše úprava vousů ostrou břitvou a precizní kontury z vás udělají bosse. Nejsme obyčejné holičství, jsme privátní klub pro ty, kteří si potrpí na absolutní dokonalost.</p>
          <h3>VIP Seznamka: Přitažlivost, které nelze odolat</h3>
          <p>Ženy přitahuje sebevědomí, moc a styl. V našem klubu vás nejen perfektně upravíme, ale poskytneme vám přístup do exkluzivní seznamky. Noir muž nepotřebuje mluvit nahlas, jeho vzhled a aura mluví za něj. Připravte se na to, že po návštěvě u nás se pravidla hry mění ve váš prospěch.</p>
        `,
        keywords: ["VIP barbershop", "Noir styl", "úprava vousů břitvou", "luxusní holičství", "elitní seznamka"]
      }
    ]
  },
  en: {
    classic: [
      {
        id: "classic-1-en",
        title: "MM BARBER: The Best Barbershop in Czech Republic",
        content: `
          <h2>Premium Men's Haircuts and Grooming</h2>
          <p>Looking for a world-class barbershop? MM BARBER is an institution. We focus on precise men's haircuts, perfect beard trims, and luxury grooming. Our standards bring global quality to the heart of Europe. Whether you want a modern fade, classic pompadour, or a traditional hot towel shave, our master barbers are here for you.</p>
          <h3>Dating & Confidence: First Impressions Matter</h3>
          <p>A flawless look is the key to success. We prepare men for crucial moments, from business meetings to first dates. Our exclusive matchmaking and dating platform connections help our clients not only look great but find the right partner.</p>
        `,
        keywords: ["Best barbershop Czech Republic", "mens grooming", "fade haircut", "dating for men"]
      }
    ]
  }
};
