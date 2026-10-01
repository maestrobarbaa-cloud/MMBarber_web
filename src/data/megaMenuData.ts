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
    title: lang === 'cs' ? "Služby & Rezervace" : lang === 'zh' ? "服务 & 预订 (Služby & Rezervace)" : "Services & Booking",
    path: "/#services",
    groups: [
      {
        title: lang === 'cs' ? "Naše služby" : lang === 'zh' ? "我们的服务 (Naše služby)" : "Our Services",
        items: [
          { name: lang === 'cs' ? "Pánský střih" : lang === 'zh' ? "男士理发 (Pánský střih)" : "Haircut", path: "/sluzby/pansky-strih" },
          { name: lang === 'cs' ? "Úprava vousů" : lang === 'zh' ? "胡须修剪 (Úprava vousů)" : "Beard Trim", path: "/sluzby/uprava-vousu" },
        ]
      },
      {
        title: lang === 'cs' ? "Rezervace a Ceny" : lang === 'zh' ? "预订与价格 (Rezervace a Ceny)" : "Booking & Prices",
        items: [
          { name: lang === 'cs' ? "Ceník a Rezervace" : lang === 'zh' ? "价格与预订 (Ceník a Rezervace)" : "Prices & Booking", path: "/cenik" },
          { name: lang === 'cs' ? "Jak to chodí" : lang === 'zh' ? "工作原理 (Jak to chodí)" : "How it works", path: "/jak-to-chodi" },
          { name: lang === 'cs' ? "Systém a návštěva" : lang === 'zh' ? "系统与访问 (Systém a návštěva)" : "System & Visit", path: "/system-a-navsteva" },
        ]
      },
      {
        title: lang === 'cs' ? "Exkluzivně" : lang === 'zh' ? "独家 (Exkluzivně)" : "Exclusive",
        items: [
          { name: "VIP Club", path: "/vip-club" },
          { name: lang === 'cs' ? "Dárkové Vouchery" : lang === 'zh' ? "礼品券 (Dárkové Vouchery)" : "Vouchers", path: "/vouchery" },
        ]
      }
    ]
  },
  products: {
    title: lang === 'cs' ? "Produkty & Arzenál" : lang === 'zh' ? "产品 & 军火库 (Produkty & Arzenál)" : "Products & Arsenal",
    path: "/produkty",
    groups: [
      {
        title: lang === 'cs' ? "E-shop" : lang === 'zh' ? "网上商店 (E-shop)" : "E-shop",
        items: [
          { name: lang === 'cs' ? "Všechny produkty" : lang === 'zh' ? "所有产品 (Všechny produkty)" : "All Products", path: "/produkty" },
          { name: lang === 'cs' ? "Značky a Arzenál" : lang === 'zh' ? "品牌与军火库 (Značky a Arzenál)" : "Brands & Arsenal", path: "/arzenal" },
        ]
      },
      {
        title: lang === 'cs' ? "Akce a Slevy" : lang === 'zh' ? "促销活动 (Akce a Slevy)" : "Sales",
        items: [
          { name: lang === 'cs' ? "Žhavé slevy a Aukce" : lang === 'zh' ? "热卖与拍卖 (Žhavé slevy a Aukce)" : "Hot Sales & Auctions", path: "/produkty" },
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
    title: lang === 'cs' ? "Rodina & Příběh" : lang === 'zh' ? "家庭 & 故事 (Rodina & Příběh)" : "Family & Story",
    path: "/pribeh",
    groups: [
      {
        title: lang === 'cs' ? "O Nás" : lang === 'zh' ? "关于我们 (O Nás)" : "About Us",
        items: [
          { name: lang === 'cs' ? "Příběh podniku" : lang === 'zh' ? "公司故事 (Příběh podniku)" : "Company Story", path: "/pribeh?v=2" },
          { name: lang === 'cs' ? "Časté dotazy" : lang === 'zh' ? "常见问题 (Časté dotazy)" : "FAQ", path: "/faq" },
        ]
      },
      {
        title: lang === 'cs' ? "Tým a Kultura" : lang === 'zh' ? "团队与文化 (Tým a Kultura)" : "Team & Culture",
        items: [
          { name: lang === 'cs' ? "Náš tým (Rodina)" : lang === 'zh' ? "我们的团队 (Rodina)" : "Our Team (Family)", path: "/rodina" },
          { name: lang === 'cs' ? "Životopisy barberů" : lang === 'zh' ? "理发师简历 (Životopisy barberů)" : "Barber CVs", path: "/zivotopisy" },
          { name: lang === 'cs' ? "Galerie" : lang === 'zh' ? "画廊 (Galerie)" : "Gallery", path: "/galerie" },
        ]
      },
      {
        title: lang === 'cs' ? "Lokace" : lang === 'zh' ? "地点 (Lokace)" : "Location",
        items: [
          { name: lang === 'cs' ? "Kudy k nám" : lang === 'zh' ? "怎么找到我们 (Kudy k nám)" : "Find Us", path: "/#kontakt" },
          { name: lang === 'cs' ? "Skrytá místa" : lang === 'zh' ? "隐藏的地方 (Skrytá místa)" : "Hidden Places", path: "/skryta-mista" },
        ]
      }
    ]
  },
  career: {
    title: lang === 'cs' ? "Kariéra & Rozvoj" : lang === 'zh' ? "职业与成长 (Kariéra & Rozvoj)" : "Career & Growth",
    path: "/kariera",
    groups: [
      {
        title: lang === 'cs' ? "Budoucnost" : lang === 'zh' ? "未来 (Budoucnost)" : "Future",
        items: [
          { name: lang === 'cs' ? "Naše vize & Mindset" : lang === 'zh' ? "我们的愿景和心态 (Naše vize)" : "Our Vision & Mindset", path: "/vize" },
          { name: lang === 'cs' ? "Volné pracovní pozice" : lang === 'zh' ? "空缺职位 (Volné pozice)" : "Open Positions", path: "/kariera" },
          { name: lang === 'cs' ? "Spolupráce" : lang === 'zh' ? "合作 (Spolupráce)" : "Cooperation", path: "/spoluprace" },
        ]
      },
      {
        title: lang === 'cs' ? "Vzdělávání" : lang === 'zh' ? "教育 (Vzdělávání)" : "Education",
        items: [
          { name: lang === 'cs' ? "Akademie (Začátečníci)" : lang === 'zh' ? "学院 (Akademie)" : "Academy", path: "/akademie" },
          { name: lang === 'cs' ? "Přednášky a Mentoring" : lang === 'zh' ? "讲座和辅导 (Přednášky)" : "Lectures & Mentoring", path: "/prednasky" },
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
  },
  events: {
    title: lang === 'cs' ? "Eventy & Atmosféra" : lang === 'zh' ? "事件与气氛 (Eventy & Atmosféra)" : "Events & Atmosphere",
    path: "#",
    groups: []
  }
});
