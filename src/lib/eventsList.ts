export type MMEvent = {
  id: string;
  isBloodMode?: boolean;
  name: string;
  desc: string;
  date: string;
  image: string;
  monthIndex: number;
  isAdminOnly?: boolean;
};

export const ALL_EVENTS: MMEvent[] = [
  { id: 'classic', isBloodMode: false, name: 'Standard Režim', desc: 'Klasický mafiánský styl MM Barber.', date: 'Trvalý', image: '/obr/main-hero.png', monthIndex: 0 },
  { id: 'winter', isBloodMode: false, name: 'Zimní Režim', desc: 'Sníh a chladná atmosféra.', date: 'Leden - Únor', image: '/obr/main-hero.png', monthIndex: 1 },
  { id: 'cny', isBloodMode: false, name: 'Chinese New Year', desc: 'Oslava Asijské kultury, červeno-zlatá.', date: 'Únor 2027', image: '/obr/cina.png', monthIndex: 2 },
  { id: 'valentine', isBloodMode: false, name: 'Valentýn', desc: 'Svátek zamilovaných.', date: '14. Února', image: '/obr/main-hero.png', monthIndex: 2 },
  { id: 'spring', isBloodMode: false, name: 'Jarní Probuzení', desc: 'Zelená atmosféra, nová sezóna.', date: 'Březen', image: '/obr/main-hero.png', monthIndex: 3 },
  { id: 'easter', isBloodMode: false, name: 'Velikonoce', desc: 'Jarní svátky, tradice.', date: 'Duben', image: '/obr/main-hero.png', monthIndex: 4 },
  { id: 'witches', isBloodMode: false, name: 'Čarodějnice', desc: 'Pálení čarodějnic.', date: '30. Dubna', image: '/obr/main-hero.png', monthIndex: 4 },
  { id: 'may', isBloodMode: false, name: 'Máj - Lásky čas', desc: 'Jarní romance.', date: 'Květen', image: '/obr/main-hero.png', monthIndex: 5 },
  { id: 'sakura', isBloodMode: false, name: 'Sakura Event', desc: 'Kvetoucí japonské třešně.', date: 'Květen', image: '/obr/cina.png', monthIndex: 5 },
  { id: 'czech', isBloodMode: false, name: 'Česko Event', desc: 'Národní hrdost, sport.', date: 'Květen (MS v hokeji)', image: '/obr/main-hero.png', monthIndex: 5 },
  { id: 'midsummer', isBloodMode: false, name: 'Slunovrat', desc: 'Oslava nejdelšího dne v roce.', date: '21. Června', image: '/obr/main-hero.png', monthIndex: 6 },
  { id: 'summer', isBloodMode: false, name: 'Letní Vibes', desc: 'Pohoda u vody a letní horka.', date: 'Červenec - Srpen', image: '/obr/main-hero.png', monthIndex: 7 },
  { id: 'harvest', isBloodMode: false, name: 'Dožínky', desc: 'Oslava sklizně.', date: 'Konec Srpna', image: '/obr/main-hero.png', monthIndex: 8 },
  { id: 'slovacko', isBloodMode: false, name: 'Slovácko Event', desc: 'Lidové motivy a modro-bílý styl.', date: 'Září', image: '/obr/slovácko.png', monthIndex: 9 },
  { id: 'halloween', isBloodMode: false, name: 'Halloween', desc: 'Dýně a podzimní strašidla.', date: '31. Října', image: '/obr/halloween.png', monthIndex: 10 },
  { id: 'allsouls', isBloodMode: false, name: 'Dušičky', desc: 'Vzpomínka na zesnulé.', date: '2. Listopadu', image: '/obr/main-hero.png', monthIndex: 11 },
  { id: 'veterans', isBloodMode: false, name: 'Den Veteránů', desc: 'Pocta hrdinům.', date: '11. Listopadu', image: '/obr/main-hero.png', monthIndex: 11 },
  { id: 'christmas', isBloodMode: false, name: 'Vánoce', desc: 'Klidné a temné vánoční svátky.', date: 'Prosinec', image: '/obr/main-hero.png', monthIndex: 12 },
  { id: 'silvestr', isBloodMode: false, name: 'Silvestr', desc: 'Oslava nového roku.', date: '31. Prosince', image: '/obr/main-hero.png', monthIndex: 12 },
  
  // Speciální (nedatované / denní) události
  { id: 'classic', isBloodMode: true, name: 'Blood Mode', desc: 'Noční krvavý masakr (Denně 03:00 - 06:00)', date: 'Každou noc', image: '/obr/hero-2.png', monthIndex: 99 },
  { id: 'galaxy', isBloodMode: false, name: 'Galaxy Mode', desc: 'Vesmírná atmosféra.', date: 'Speciální událost', image: '/obr/main-hero.png', monthIndex: 99 },
  { id: 'crt', isBloodMode: false, name: 'Retro CRT', desc: 'Stará televize 90. let.', date: 'Speciální událost', image: '/obr/main-hero.png', monthIndex: 99 },
  { id: 'matrix', isBloodMode: false, name: 'Matrix', desc: 'Zelený digitální déšť.', date: 'Speciální událost', image: '/obr/main-hero.png', monthIndex: 99 },
  { id: 'pixelate', isBloodMode: false, name: '8-Bit Pixel', desc: 'Retro herní styl.', date: 'Speciální událost', image: '/obr/main-hero.png', monthIndex: 99 },
  { id: 'vintage', isBloodMode: false, name: 'Vintage', desc: 'Starý film.', date: 'Speciální událost', image: '/obr/main-hero.png', monthIndex: 99 },
  { id: 'noirblue', isBloodMode: false, name: 'Cold Noir', desc: 'Mrazivá kriminálka.', date: 'Speciální událost', image: '/obr/main-hero.png', monthIndex: 99 },
  { id: 'noirred', isBloodMode: false, name: 'Hot Noir', desc: 'Spalující atmosféra.', date: 'Speciální událost', image: '/obr/main-hero.png', monthIndex: 99 },
  { id: 'chaos', isBloodMode: false, name: 'Chaos Mode', desc: 'Nekontrolovatelné anomálie.', date: 'Speciální událost', image: '/obr/main-hero.png', monthIndex: 99 },
  { id: 'friday13', isBloodMode: false, name: 'Pátek 13.', desc: 'Den smůly a strachu.', date: 'Pátek třináctého', image: '/obr/main-hero.png', monthIndex: 99 },
  { id: 'secret', isBloodMode: false, name: 'Secret Level', desc: 'Tajná sekce.', date: 'Neznámé', image: '/obr/main-hero.png', monthIndex: 99 },
  { id: 'legacy', isBloodMode: false, name: 'Legacy', desc: 'Odkaz minulosti.', date: 'Speciální událost', image: '/obr/main-hero.png', monthIndex: 99 },
  
  // --- NÁRODNÍ EVENTY (Viditelné pouze pro Admina) ---
  { id: 'national-cz', name: 'Česko', desc: 'Den české státnosti', date: '28. Října', image: '/obr/main-hero.png', monthIndex: 9, isAdminOnly: true },
  { id: 'national-sk', name: 'Slovensko', desc: 'Den Ústavy SR', date: '1. Září', image: '/obr/main-hero.png', monthIndex: 8, isAdminOnly: true },
  { id: 'national-usa', name: 'USA', desc: 'Den nezávislosti', date: '4. Července', image: '/obr/main-hero.png', monthIndex: 6, isAdminOnly: true },
  { id: 'national-uk', name: 'Velká Británie', desc: 'Den svatého Jiří', date: '23. Dubna', image: '/obr/main-hero.png', monthIndex: 3, isAdminOnly: true },
  { id: 'national-de', name: 'Německo', desc: 'Den sjednocení', date: '3. Října', image: '/obr/main-hero.png', monthIndex: 9, isAdminOnly: true },
  { id: 'national-at', name: 'Rakousko', desc: 'Národní den', date: '26. Října', image: '/obr/main-hero.png', monthIndex: 9, isAdminOnly: true },
  { id: 'national-it', name: 'Itálie', desc: 'Den republiky', date: '2. Června', image: '/obr/main-hero.png', monthIndex: 5, isAdminOnly: true },
  { id: 'national-ch', name: 'Švýcarsko', desc: 'Národní den', date: '1. Srpna', image: '/obr/main-hero.png', monthIndex: 7, isAdminOnly: true },
  { id: 'national-es', name: 'Španělsko', desc: 'Fiesta Nacional', date: '12. Října', image: '/obr/main-hero.png', monthIndex: 9, isAdminOnly: true },
  { id: 'national-ca', name: 'Kanada', desc: 'Canada Day', date: '1. Července', image: '/obr/main-hero.png', monthIndex: 6, isAdminOnly: true },
  { id: 'national-tr', name: 'Turecko', desc: 'Den republiky', date: '29. Října', image: '/obr/main-hero.png', monthIndex: 9, isAdminOnly: true },
  { id: 'national-ru', name: 'Rusko', desc: 'Den Ruska', date: '12. Června', image: '/obr/main-hero.png', monthIndex: 5, isAdminOnly: true },
  { id: 'national-fr', name: 'Francie', desc: 'Dobytí Bastily', date: '14. Července', image: '/obr/main-hero.png', monthIndex: 6, isAdminOnly: true },
  { id: 'national-gr', name: 'Řecko', desc: 'Den nezávislosti', date: '25. Března', image: '/obr/main-hero.png', monthIndex: 2, isAdminOnly: true },
  { id: 'national-pl', name: 'Polsko', desc: 'Svátek nezávislosti', date: '11. Listopadu', image: '/obr/main-hero.png', monthIndex: 10, isAdminOnly: true },
  { id: 'national-hu', name: 'Maďarsko', desc: 'Vznik státu', date: '20. Srpna', image: '/obr/main-hero.png', monthIndex: 7, isAdminOnly: true },
  { id: 'national-lt', name: 'Litva', desc: 'Obnovení státnosti', date: '16. Února', image: '/obr/main-hero.png', monthIndex: 1, isAdminOnly: true },
  { id: 'national-lv', name: 'Lotyšsko', desc: 'Vyhlášení nezávislosti', date: '18. Listopadu', image: '/obr/main-hero.png', monthIndex: 10, isAdminOnly: true },
  { id: 'national-ee', name: 'Estonsko', desc: 'Den nezávislosti', date: '24. Února', image: '/obr/main-hero.png', monthIndex: 1, isAdminOnly: true },
  { id: 'national-nl', name: 'Nizozemsko', desc: 'Králův den', date: '27. Dubna', image: '/obr/main-hero.png', monthIndex: 3, isAdminOnly: true },
  { id: 'national-be', name: 'Belgie', desc: 'Národní den', date: '21. Července', image: '/obr/main-hero.png', monthIndex: 6, isAdminOnly: true },
  { id: 'national-pt', name: 'Portugalsko', desc: 'Den Portugalska', date: '10. Června', image: '/obr/main-hero.png', monthIndex: 5, isAdminOnly: true },
  { id: 'national-ro', name: 'Rumunsko', desc: 'Den sjednocení', date: '1. Prosince', image: '/obr/main-hero.png', monthIndex: 11, isAdminOnly: true },
  { id: 'national-bg', name: 'Bulharsko', desc: 'Den osvobození', date: '3. Března', image: '/obr/main-hero.png', monthIndex: 2, isAdminOnly: true },
  { id: 'national-hr', name: 'Chorvatsko', desc: 'Den státnosti', date: '30. Května', image: '/obr/main-hero.png', monthIndex: 4, isAdminOnly: true },
  { id: 'national-si', name: 'Slovinsko', desc: 'Den státnosti', date: '25. Června', image: '/obr/main-hero.png', monthIndex: 5, isAdminOnly: true },
  { id: 'national-dk', name: 'Dánsko', desc: 'Den ústavy', date: '5. Června', image: '/obr/main-hero.png', monthIndex: 5, isAdminOnly: true },
  { id: 'national-se', name: 'Švédsko', desc: 'Národní den', date: '6. Června', image: '/obr/main-hero.png', monthIndex: 5, isAdminOnly: true },
  { id: 'national-fi', name: 'Finsko', desc: 'Den nezávislosti', date: '6. Prosince', image: '/obr/main-hero.png', monthIndex: 11, isAdminOnly: true },
  { id: 'national-ie', name: 'Irsko', desc: 'Sv. Patrik', date: '17. Března', image: '/obr/main-hero.png', monthIndex: 2, isAdminOnly: true }
];

export function getSortedEvents(activeAtmosphere: string, isBlood: boolean, isAdmin: boolean = false): MMEvent[] {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  
  const visibleEvents = ALL_EVENTS.filter(ev => isAdmin || !ev.isAdminOnly);
  
  return [...visibleEvents].sort((a, b) => {
    const aIsActive = (a.id === activeAtmosphere || (a.id === 'cny' && activeAtmosphere === 'c.n.y') || (a.id === 'c.n.y' && activeAtmosphere === 'cny')) && (a.isBloodMode === isBlood);
    const bIsActive = (b.id === activeAtmosphere || (b.id === 'cny' && activeAtmosphere === 'c.n.y') || (b.id === 'c.n.y' && activeAtmosphere === 'cny')) && (b.isBloodMode === isBlood);
    
    if (aIsActive && !bIsActive) return -1;
    if (!aIsActive && bIsActive) return 1;

    // 2. Standard Režim je hned druhý (pokud není aktivní)
    if (a.id === 'classic' && !a.isBloodMode) return -1;
    if (b.id === 'classic' && !b.isBloodMode) return 1;

    // 3. Speciální události (monthIndex: 99) jdou na konec
    if (a.monthIndex === 99 && b.monthIndex !== 99) return 1;
    if (b.monthIndex === 99 && a.monthIndex !== 99) return -1;
    if (a.monthIndex === 99 && b.monthIndex === 99) return 0;

    // 4. Seřazení chronologicky od aktuálního měsíce
    const distA = a.monthIndex >= currentMonth ? a.monthIndex - currentMonth : (a.monthIndex - currentMonth) + 12;
    const distB = b.monthIndex >= currentMonth ? b.monthIndex - currentMonth : (b.monthIndex - currentMonth) + 12;

    return distA - distB;
  });
}
