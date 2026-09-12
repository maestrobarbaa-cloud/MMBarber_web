
const fs = require('fs');
const dbPath = 'data/mmbarber_db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.rodina_divisions = [
  { id: 'voda', name: 'Voda, Topení a Revize', nameEn: 'Plumbing & Heating', icon: 'Droplets' },
  { id: 'elektro', name: 'Elektro a Energie', nameEn: 'Electric & Energy', icon: 'Zap' },
  { id: 'stavebnictvi', name: 'Stavebnictví a Reality', nameEn: 'Construction & Real Estate', icon: 'Building2' },
  { id: 'auto', name: 'Auto a Moto', nameEn: 'Car & Moto', icon: 'Target' },
  { id: 'kreativci', name: 'Design a Foto', nameEn: 'Design & Photo', icon: 'Camera' },
  { id: 'umelci', name: 'Hudba a Eventy', nameEn: 'Music & Events', icon: 'Music' },
  { id: 'gastro', name: 'Gastro a Zážitky', nameEn: 'Gastronomy & Experiences', icon: 'UtensilsCrossed' },
  { id: 'okna-vrata', name: 'Okna a Vrata', nameEn: 'Windows & Gates', icon: 'Home' },
  { id: 'obaly', name: 'Obalová řešení', nameEn: 'Packaging Solutions', icon: 'Package' },
  { id: 'ucetni', name: 'Účetnictví a Finance', nameEn: 'Accounting & Finance', icon: 'Calculator' },
  { id: 'support', name: 'Podpora a Charita', nameEn: 'Support & Charity', icon: 'HeartHandshake' },
  { id: 'kola', name: 'Jízdní kola', nameEn: 'Bicycles', icon: 'Bike' },
  { id: 'it', name: 'IT & Sítě', nameEn: 'IT & Networks', icon: 'Monitor' },
  { id: 'team', name: 'Tým MMBarber', nameEn: 'MMBarber Team', icon: 'Users' }
];

db.rodina_members = [
  { name: 'Detailing', div: 'auto', role: 'Prémiová péče o auta', roleEn: 'Premium Car Care', img: '/loga_partneri/detailing.png', link: 'https://www.detailing4u.cz/', year: 2026, specialHover: 'Protože auto má vypadat stejně dobře, jako ty po návštěvě barbera.', specialHoverEn: 'Because a car should look as good as you do after a barber visit.' },
  { name: 'Vodo Topo Jahoda', div: 'voda', role: 'Expertíza a Tradice', roleEn: 'Expertise & Tradition', img: '/loga_partneri/jahoda.png', link: 'https://www.jahodavodotopo.cz/', year: 2025, specialHover: 'Ten frajer hraje i na bubny..', specialHoverEn: 'This guy even plays the drums..' },
  { name: 'O Shawarma Beef', div: 'gastro', role: 'Nejlepší maso ve městě', roleEn: 'Best Beef in Town', img: '/loga_partneri/ShawmaBeef.png', link: 'https://www.instagram.com/o.shawarmabeef', year: 2025, specialHover: 'Na tohoto to napráskám, to je ten co měl dole kebab. Ten jak byl na všechny milý... jo a nezapomeň říct, že jdeš od nás!', specialHoverEn: 'I\\'ll spill the beans on this one, he\\'s the one who had the kebab place downstairs. The one who was nice to everyone... and don\\'t forget to say you\\'re from us!' },
  { name: 'Poe Poe', div: 'gastro', role: 'Kvalitní posezení', roleEn: 'Quality Dining', img: '/loga_partneri/poe.png', link: 'https://www.poe-poe.cz/', year: 2025 },
  { name: 'Dvůr pod Starýma Horama', div: 'gastro', role: 'Víno a Zážitky', roleEn: 'Wine & Experiences', img: '/loga_partneri/DvurPodHorama.png', link: 'https://dvurpodstarymahorama.cz/', year: 2025, specialHover: 'Sem tam nějaká Brigádička pro mladýho? nebo nějaké vínko z moravy ?', specialHoverEn: 'Every now and then a little gig for the young one? Or some wine from Moravia?' },
  { name: 'Malina Photo', div: 'kreativci', role: 'Profesionální Foto', roleEn: 'Professional Photo', img: '/loga_partneri/malinaphoto.gif', link: 'https://malinaphoto.cz/', year: 2025, specialHover: 'Před pár lety jsme se setkali v Brně na Olympii, kde ji fotil. Netušil jsem, že bude ještě fotit i nás..', specialHoverEn: 'A few years ago we met in Brno at Olympia where he photographed her. I had no idea he would be photographing us too..' },
  { name: 'Comites', div: 'stavebnictvi', role: 'Stavebnictví / Reality / Finance', roleEn: 'Construction / Reality / Finance', img: '/loga_partneri/comites.png', link: 'https://comites.cz/', year: 2025, specialHover: 'Zase ti kluci z Hradiště co dělají věci jinak. Od cihel až po pojištění tvého klidu.', specialHoverEn: 'Those guys from Hradiště who do things differently. From bricks to insuring your peace of mind.' },
  { name: 'Šimon Král', div: 'umelci', role: 'Hudba & Eventy', roleEn: 'Music & Events', img: '/loga_partneri/djKing.png', link: 'https://simonkral.cz/', year: 2025 },
  { name: 'Argema', div: 'umelci', role: 'Rocková Legenda', roleEn: 'Rock Legend', img: '/loga_partneri/argema.png', link: 'https://www.argema.cz/', year: 2025, specialHover: 'To snad nemusím ani představovat...', specialHoverEn: 'I probably don\\'t even need to introduce this...' },
  { name: 'Kofipack', div: 'obaly', role: 'Obalová řešení', roleEn: 'Packaging Solutions', img: '/loga_partneri/kofipack.png', link: 'https://kofipack.cz/', year: 2025 },
  { name: 'Sluneční Reality', div: 'stavebnictvi', role: 'Reality s úsměvem', roleEn: 'Real Estate Experts', img: '/loga_partneri/slunecniReality.png', link: 'https://slunecnireality.cz/', year: 2025 },
  { name: 'Dětský domov UH', div: 'support', role: 'Společenská Odpovědnost', roleEn: 'Community Support', img: '/loga_partneri/detskydomov.png', link: 'https://www.detskydomovuh.cz/', year: 2026, specialHover: 'Co třeba neřešit vše jen penězma a nefotit se, ale darovat jim zážitek nebo koupit zmrzlinu? Možná stačí jen malá změna.', specialHoverEn: 'How about not focusing just on money? Give them an experience instead. Maybe a small change is all it takes.' },
  { name: 'Zdeněk Mička', div: 'voda', role: 'Voda / Topo / Bílovice', roleEn: 'Plumbing & Heating', img: '/logo.png', link: 'tel:+420739080968', phone: '+420 739 080 968', year: 2025, specialHover: 'Potřebuješ vodu nebo topení vyřešit hned? Zdeněk je tvoje spojka.', specialHoverEn: 'Need plumbing or heating solved right now? Zdeněk is your contact.' },
  { name: 'Kudielka', div: 'okna-vrata', role: 'Stínící technika & Vrata', roleEn: 'Shading & Gates', img: '/logo.png', link: 'https://www.kudielka.cz/stinici-technika/plise-zaluzie.html', year: 2025, specialHover: 'Potřebuješ se schovat před světem nebo před šéfem? Tyto žaluzie tě podrží.', specialHoverEn: 'Need to hide from the world or your boss?' },
  { name: 'Roman Jakubík', div: 'elektro', role: 'Elektro / Revize', roleEn: 'Electric / Revision', img: '/logo.png', link: '/rodina/remesla', phone: '+420 732 169 799', year: 2026, specialHover: 'Když to nejde silou, jde to Jakubíkem...', specialHoverEn: 'When force doesn\\'t work, Jakubík does...' },
  { name: 'Tomáš Mička', div: 'team', role: 'Web designer | Grafik', roleEn: 'Web Designer | Graphic Designer', img: '/logo.png', link: 'tel:+420577544073', year: 2025 },
  { name: 'Adam Hroník', div: 'team', role: 'Webový vývojář', roleEn: 'Web Developer', img: '/logo.png', link: 'tel:+420577544073', year: 2025 },
  { name: 'Petr Svoboda', div: 'it', role: 'Správa sítě a IT', roleEn: 'Networking & IT', img: '/logo.png', link: 'tel:+420606724310', phone: '+420 606 724 310', year: 2026, specialHover: 'Když potřebuješ internet, co nepadá a síť, co dává smysl. Petr je náš IT mág, na kterého je vždy spoleh.', specialHoverEn: 'When you need internet that doesn\\'t drop and a network that makes sense. Petr is our reliable IT wizard.' },
  { name: 'Romana Mičková', div: 'ucetni', role: 'Samostatná Účetní', roleEn: 'Independent Accountant', img: '/logo.png', link: 'tel:+420774640332', phone: '+420 774 640 332', ico: 'IČO: 65814266', year: 2026 },
  { name: 'O Kolečko víc', div: 'kola', role: 'Jízdní kola a servis', roleEn: 'Bicycles and Service', img: '/loga_partneri/okoleckovic.png', link: 'https://www.okoleckovic.cz/', year: 2026 }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Rodina data injected');
