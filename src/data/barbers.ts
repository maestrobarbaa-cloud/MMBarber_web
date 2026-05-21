import { BarberProfile } from "@/components/Profiles";

export const barbers: BarberProfile[] = [
  {
    name: "Tomáš",
    id: "tomas",
    role: "The Enforcer",
    image: "/obr/tomasmicka.png",
    desc: `Možná bys čekal jednoduchý příběh. Školu, obor, certifikát, hotovo.

Ale realita je jinde.

Ano — něco jsem vystudoval. Něco, co se dá napsat do řádku a dát do CV. Ale to je jen začátek věci, ne její podstata.

To, kým jsem dnes, vzniklo až potom. V pohybu, v rozhodnutích, v místech, kde se nehraje na jistotu.

A možná tě to překvapí, ale i věci, na které se právě díváš, nejsou náhoda.

Jsou to odrazy mých myšlenek. Každý detail, atmosféra, energie — všechno má svůj původ.

Netvořím jen to, co je vidět.

Tvořím všechno kolem toho.

A možná proto to působí jinak, než bys čekal.`,
    schedule: "Út-Pá 9:00 - 18:00 | So-Ne 9:00 - 12:00",
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
