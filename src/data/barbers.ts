import { BarberProfile } from "@/components/Profiles";

export const barbers: BarberProfile[] = [
  {
    name: "Tomáš",
    id: "tomas",
    role: "The Enforcer",
    image: "/obr/tomasmicka.png",
    desc: "Mistr komunikace a hrubé síly. Tvůj vous zlomí k naprosté poslušnosti.",
    schedule: "Út-Pá 9:00 - 18:00 | So-Ne 9:00 - 12:00",
    bookingLink: "https://mm.inthechair.com/micka",
    specializations: ["Primárně pánské", "ale zvládnu i dámy"],
    symbol: "A",
    rank: {
      level: 7,
      title: "THE DON",
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
      title: "Čistič latrín",
      status: 'demoted',
      nextRankIn: "ČERVEN 2026"
    }
  }
];
