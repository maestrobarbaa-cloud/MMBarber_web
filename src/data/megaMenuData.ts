import { type Language } from "@/hooks/useTranslation";

export type MegaMenuData = {
  [key: string]: {
    title: string;
    path: string;
    groups: {
      title: string;
      items: { name: string; path: string }[];
    }[];
    promo?: {
      title: string;
      description: string;
      cta: string;
      path: string;
      image: string;
    }
  }
}

export const getMegaMenuData = (lang: Language): MegaMenuData => ({
  services: {
    title: lang === 'cs' ? "Služby" : "Services",
    path: "/#services",
    groups: [
      {
        title: lang === 'cs' ? "Základní péče" : "Basic Care",
        items: [
          { name: lang === 'cs' ? "Pánský střih" : "Haircut", path: "/sluzby/pansky-strih" },
          { name: lang === 'cs' ? "Úprava vousů" : "Beard Trim", path: "/sluzby/uprava-vousu" },
        ]
      },
      {
        title: lang === 'cs' ? "Speciální nabídka" : "Specials",
        items: [
          { name: "VIP Club", path: "/vip-club" },
          { name: lang === 'cs' ? "Dárkové Vouchery" : "Vouchers", path: "/vouchery" },
        ]
      },
      {
        title: lang === 'cs' ? "Prohloubit zážitek" : "Enhance Experience",
        items: [
          { name: lang === 'cs' ? "Systém a návštěva" : "System & Visit", path: "/system-a-navsteva" },
          { name: lang === 'cs' ? "Ceník a Rezervace" : "Prices & Booking", path: "/cenik" },
        ]
      }
    ]
  },
  "o-nas": {
    title: lang === 'cs' ? "O Nás" : "About Us",
    path: "/pribeh?v=2",
    groups: [
      {
        title: lang === 'cs' ? "Příběh" : "Story",
        items: [
          { name: lang === 'cs' ? "Jak to chodí" : "How it works", path: "/jak-to-chodi" },
          { name: lang === 'cs' ? "Příběh podniku" : "Company Story", path: "/pribeh?v=2" },
          { name: lang === 'cs' ? "Osobní životopis" : "Personal CV", path: "/zivotopisy" },
          { name: lang === 'cs' ? "Speciální mise" : "Special Mission", path: "/barbergames" },
        ]
      },
      {
        title: lang === 'cs' ? "Kultura" : "Culture",
        items: [
          { name: lang === 'cs' ? "Náš tým (Rodina)" : "Our Team (Family)", path: "/rodina" },
          { name: lang === 'cs' ? "Galerie" : "Gallery", path: "/galerie" },
          { name: lang === 'cs' ? "Komunita" : "Community", path: "/komunita" },
        ]
      },
      {
        title: lang === 'cs' ? "Lokace" : "Location",
        items: [
          { name: lang === 'cs' ? "Kudy k nám" : "Find Us", path: "/#kontakt" },
          { name: lang === 'cs' ? "Skrytá místa" : "Hidden Places", path: "/skryta-mista" },
        ]
      }
    ]
  },
  career: {
    title: lang === 'cs' ? "Kariéra & Rozvoj" : "Career & Growth",
    path: "/kariera",
    groups: [
      {
        title: lang === 'cs' ? "Spolupráce a Vize" : "Collaboration & Vision",
        items: [
          { name: lang === 'cs' ? "Naše vize & Mindset" : "Our Vision & Mindset", path: "/vize" },
          { name: lang === 'cs' ? "Volné pracovní pozice" : "Open Positions", path: "/kariera" },
        ]
      },
      {
        title: lang === 'cs' ? "Vzdělávání" : "Education",
        items: [
          { name: lang === 'cs' ? "Akademie (Pro začátečníky)" : "Academy", path: "/akademie" },
          { name: lang === 'cs' ? "Přednášky a Mentoring" : "Lectures & Mentoring", path: "/prednasky" },
        ]
      }
    ],
    promo: {
      title: "Chceš žít svůj vysněný život?",
      description: "Flexibilita, svoboda a přesah. Ať už chceš pracovat v salonu, nebo tvořit od moře — s námi posouváš hranice nemožného. Učíme dovednosti a měníme mentalitu.",
      cta: "Začni teď",
      path: "/vize",
      image: "/obr/main-hero.png"
    }
  }
});
