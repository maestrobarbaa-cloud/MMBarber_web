export type MMEvent = {
  id: string;
  isBloodMode?: boolean;
  name: string;
  desc: string;
  date: string;
  image: string;
  monthIndex: number;
};

export const ALL_EVENTS: MMEvent[] = [
  { id: 'classic', isBloodMode: false, name: 'Standard Režim', desc: 'Klasický mafiánský styl MM Barber.', date: 'Trvalý', image: '/obr/main-hero.png', monthIndex: 0 },
  { id: 'winter', isBloodMode: false, name: 'Zimní Režim', desc: 'Sníh a chladná atmosféra.', date: 'Leden - Únor', image: '/obr/main-hero.png', monthIndex: 1 },
  { id: 'c.n.y', isBloodMode: false, name: 'Chinese New Year', desc: 'Oslava Asijské kultury, červeno-zlatá.', date: 'Únor 2027', image: '/obr/cina.png', monthIndex: 2 },
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
  { id: 'halloween', isBloodMode: false, name: 'Halloween', desc: 'Dýně a podzimní strašidla.', date: '31. Října', image: '/obr/hero-2.png', monthIndex: 10 },
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
  { id: 'legacy', isBloodMode: false, name: 'Legacy', desc: 'Odkaz minulosti.', date: 'Speciální událost', image: '/obr/main-hero.png', monthIndex: 99 }
];

export function getSortedEvents(activeAtmosphere: string, isBlood: boolean): MMEvent[] {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  
  return [...ALL_EVENTS].sort((a, b) => {
    // 1. Aktivní event je VŽDY PRVNÍ
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
