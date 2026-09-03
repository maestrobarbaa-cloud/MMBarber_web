import { BarberProfile } from "@/data/profilesData";

export const barbers: BarberProfile[] = [
  {
    name: "Tomáš",
    id: "tomas",
    role: "The Enforcer",
    image: "/obr/tomasmicka.png",
    desc: `Vzdělání:
- SSPŠHŽ – elektrotechnika.
- Kadeřník.
- Sociální pedagogika.

O mně:
Možná čekáš, že si sem napíšu CEO, Founder nebo jiný korporátní status. Já si z podobných nálepek spíš dělám legraci. Tituly, funkce a zkratky před jménem jsou hezké, ale samy o sobě nic nedokazují.

Už mnohokrát jsem slyšel větu: „Rozhodují činy, ne slova.“ Zajímavé je, že o některých lidech, kteří to říkali nejhlasitěji, jsem později už neslyšel. Zato jsem často viděl profily plné titulů, funkcí a statusů. Výrazné výsledky už méně.

Proto si raději na nic nehraju. Kdo jsem a co vytvářím, ať si každý posoudí sám.

A pokud tě zajímá víc, stav se na střih. Heslo ti dám osobně. Zbytek si pak můžeš přečíst doma.`,
    schedule: "Út-Pá 9:00 - 18:00 | So-Ne 9:00 - 12:00",
    bookingSystemType: "internal",
    bookingLink: "https://mm.inthechair.com/micka",
    specializations: ["Primárně pánské", "ale zvládnu i dámy"],
    symbol: "A",
    rank: {
      level: 9,
      title: "GENERÁLNÍ ŘEDITEL STŘIHU",
      status: 'stable'
    }
  },
  {
    name: "Nella",
    id: "nella",
    role: "Mladé ucho",
    image: "/obr/nellapelikanova.png",
    desc: "Ochoč si svoji barberku. Čerstvá krev v našem týmu.",
    schedule: "Individuální režim práce.",
    bookingSystemType: "internal",
    bookingLink: "https://mmbarberx.setmore.com",
    specializations: ["Barvení", "Trvalá ondulace", "Stříhání pánské", "Stříhání dámské", "Děti"],
    symbol: "Q",
    rank: {
      level: 0,
      title: "KOSMETIK PLOVOUCÍCH KRYTIN",
      status: 'demoted',
      nextRankIn: "ČERVEN 2026"
    }
  }
];
