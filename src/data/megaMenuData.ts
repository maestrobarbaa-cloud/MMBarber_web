import { type Language } from "@/hooks/useTranslation";

export type MegaMenuData = {
  [key: string]: {
    title: string;
    path: string;
    groups: {
      title: string;
      items: { name: string; path: string; requiredXP?: number }[];
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
    title: lang === 'cs' ? "Služby & Rezervace" : "Services & Booking",
    path: "/#services",
    groups: [
      {
        title: lang === 'cs' ? "Naše služby" : "Our Services",
        items: [
          { name: lang === 'cs' ? "Pánský střih" : "Haircut", path: "/sluzby/pansky-strih" },
          { name: lang === 'cs' ? "Úprava vousů" : "Beard Trim", path: "/sluzby/uprava-vousu" },
        ]
      },
      {
        title: lang === 'cs' ? "Rezervace a Ceny" : "Booking & Prices",
        items: [
          { name: lang === 'cs' ? "Ceník a Rezervace" : "Prices & Booking", path: "/cenik" },
          { name: lang === 'cs' ? "Jak to chodí" : "How it works", path: "/jak-to-chodi" },
          { name: lang === 'cs' ? "Systém a návštěva" : "System & Visit", path: "/system-a-navsteva" },
        ]
      },
      {
        title: lang === 'cs' ? "Exkluzivně" : "Exclusive",
        items: [
          { name: "VIP Club", path: "/vip-club" },
          { name: lang === 'cs' ? "Dárkové Vouchery" : "Vouchers", path: "/vouchery" },
        ]
      }
    ]
  },
  products: {
    title: lang === 'cs' ? "Produkty & Arzenál" : "Products & Arsenal",
    path: "/produkty",
    groups: [
      {
        title: lang === 'cs' ? "E-shop" : "E-shop",
        items: [
          { name: lang === 'cs' ? "Všechny produkty" : "All Products", path: "/produkty" },
          { name: lang === 'cs' ? "Značky a Arzenál" : "Brands & Arsenal", path: "/arzenal" },
        ]
      },
      {
        title: lang === 'cs' ? "Akce a Slevy" : "Sales",
        items: [
          { name: lang === 'cs' ? "Žhavé slevy a Aukce" : "Hot Sales & Auctions", path: "/produkty" },
        ]
      }
    ],
    promo: {
      title: lang === 'cs' ? "Vybavte se jako profík" : "Equip like a Pro",
      description: lang === 'cs' ? "Objevte naši exkluzivní nabídku prémiové kosmetiky a zúčastněte se napínavých aukcí o unikátní kousky." : "Discover our exclusive premium cosmetics and join thrilling auctions.",
      cta: lang === 'cs' ? "Do obchodu" : "Shop Now",
      path: "/produkty",
      image: "/obr/main-hero.png" // using placeholder/existing hero image
    }
  },
  family: {
    title: lang === 'cs' ? "Rodina & Příběh" : "Family & Story",
    path: "/pribeh",
    groups: [
      {
        title: lang === 'cs' ? "O Nás" : "About Us",
        items: [
          { name: lang === 'cs' ? "Příběh podniku" : "Company Story", path: "/pribeh?v=2" },
          { name: lang === 'cs' ? "Časté dotazy" : "FAQ", path: "/faq" },
        ]
      },
      {
        title: lang === 'cs' ? "Tým a Kultura" : "Team & Culture",
        items: [
          { name: lang === 'cs' ? "Náš tým (Rodina)" : "Our Team (Family)", path: "/rodina" },
          { name: lang === 'cs' ? "Životopisy barberů" : "Barber CVs", path: "/zivotopisy" },
          { name: lang === 'cs' ? "Galerie" : "Gallery", path: "/galerie" },
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
        title: lang === 'cs' ? "Budoucnost" : "Future",
        items: [
          { name: lang === 'cs' ? "Naše vize & Mindset" : "Our Vision & Mindset", path: "/vize" },
          { name: lang === 'cs' ? "Volné pracovní pozice" : "Open Positions", path: "/kariera" },
          { name: lang === 'cs' ? "Spolupráce" : "Cooperation", path: "/spoluprace" },
        ]
      },
      {
        title: lang === 'cs' ? "Vzdělávání" : "Education",
        items: [
          { name: lang === 'cs' ? "Akademie (Začátečníci)" : "Academy", path: "/akademie" },
          { name: lang === 'cs' ? "Přednášky a Mentoring" : "Lectures & Mentoring", path: "/prednasky" },
        ]
      }
    ],
    promo: {
      title: lang === 'cs' ? "Chceš žít svůj vysněný život?" : "Live your dream life?",
      description: lang === 'cs' ? "Flexibilita, svoboda a přesah. Ať už chceš pracovat v salonu, nebo tvořit od moře — s námi posouváš hranice nemožného." : "Flexibility, freedom and impact. With us you push boundaries of the impossible.",
      cta: lang === 'cs' ? "Začni teď" : "Start now",
      path: "/vize",
      image: "/obr/main-hero.png"
    }
  }
});
