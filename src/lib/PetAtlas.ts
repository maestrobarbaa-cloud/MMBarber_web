export interface AnimalType {
  id: string;
  label: Record<'cs' | 'en', string>;
  icon: string;
}

export const ANIMAL_TYPES: AnimalType[] = [
  { id: 'dog', label: { cs: 'Pes', en: 'Dog' }, icon: '🐕' },
  { id: 'cat', label: { cs: 'Kočka', en: 'Cat' }, icon: '🐈' },
  { id: 'small', label: { cs: 'Drobný savec / Hlodavec', en: 'Small mammal / Rodent' }, icon: '🐹' },
  { id: 'bird', label: { cs: 'Pták', en: 'Bird' }, icon: '🦜' },
  { id: 'reptile', label: { cs: 'Plaz / Obojživelník', en: 'Reptile / Amphibian' }, icon: '🦎' },
  { id: 'fish', label: { cs: 'Rybičky', en: 'Fish' }, icon: '🐟' },
  { id: 'horse', label: { cs: 'Kůň', en: 'Horse' }, icon: '🐎' },
  { id: 'exotic', label: { cs: 'Exotické / Hmyz', en: 'Exotic / Insects' }, icon: '🕷️' },
];

export const PET_BREEDS: Record<string, string[]> = {
  dog: [
    "Afgánský chrt", "Airedale teriér", "Akita Inu", "Aljašský malamut", "Americký buldok", "Americký pitbulteriér", 
    "Americký stafordšírský teriér", "Anglický buldok", "Anglický chrt (Greyhound)", "Anglický kokršpaněl", "Anglický setr", 
    "Australská kelpie", "Australský ovčák", "Barzoj (Ruský chrt)", "Baset", "Beagle", "Belgický ovčák (Malinois)", 
    "Belgický ovčák (Tervueren)", "Bernský salašnický pes", "Bígl", "Bišonek", "Bordeauxská doga", "Border kolie", 
    "Border teriér", "Bostonský teriér", "Bulteriér", "Cane Corso", "Coton de Tuléar", "Československý vlčák", 
    "Český fousek", "Český teriér", "Čau-čau", "Čivava", "Dalmatin", "Dobrman", "Kavalír King Charles španěl", 
    "Knírač", "Kolie dlouhosrstá", "Kříženec (Voříšek)", "Labradorský retrívr", "Leonberger", "Maltézský psík", 
    "Mops", "Německá doga", "Německý boxer", "Německý ovčák", "Německý špic", "Novofundlandský pes", "Pomeranian", 
    "Pražský krysařík", "Pudl (Toy/Trpasličí/Střední/Velký)", "Rhodeský ridgeback", "Rotvajler", "Saluki (Perský chrt)", 
    "Sibiřský husky", "Skotský teriér", "Shiba Inu", "Stafordšírský bulteriér", "Šarpej", "Šeltie (Shetlandský ovčák)", 
    "Šiperka", "Tibetská doga", "Velškorgr (Corgi)", "Výmarský ohař", "Zlatý retrívr", "Jiné plemeno"
  ].sort((a, b) => a.localeCompare(b, 'cs')),
  cat: [
    "Abesínská kočka", "Americká curl", "Americká krátkosrstá", "Angorská kočka (Turecká angora)", 
    "Balinéská kočka", "Bengálská kočka", "Birma (Posvátná birmánská)", "Britská dlouhosrstá", "Britská krátkosrstá", 
    "Barmská kočka", "Cornish rex", "Devon rex", "Domácí kočka (Kříženec)", "Egyptská mau", "Exotická krátkosrstá", 
    "Havana brown", "Kartouzská kočka", "Korat", "Kurilský bobtail", "Mainská mývalí (Maine Coon)", "Manská kočka", 
    "Něvská maškaráda", "Norská lesní kočka", "Ocicat", "Orientální krátkosrstá", "Perská kočka", "Peterbald", 
    "Ragdoll", "Ruská modrá", "Savannah", "Siamská kočka", "Sibiřská kočka", "Singapurská kočka", "Skotská klapouchá", 
    "Sněžnice (Snowshoe)", "Sokoke", "Somálská kočka", "Sphynx", "Turecká van", "Jiné plemeno"
  ].sort((a, b) => a.localeCompare(b, 'cs')),
  small: [
    "Činčila vlnatá", "Fretka domácí", "Ježek bělobřichý (Africký)", "Křeček džungarský", "Křeček Roborovského", 
    "Křeček syrský (zlatý)", "Křečík Campbellův", "Králik (Beran, Hermelín, Lvíček...)", "Morče (Hladkosrsté, Rozeta, Skinny)", 
    "Myš domácí", "Osmák degu", "Pískomil mongolský", "Potkan (Dumbo, Sphynx, Standard)", "Vakoveverka létavá", "Jiné"
  ].sort((a, b) => a.localeCompare(b, 'cs')),
  bird: [
    "Agapornis", "Andulka vlnkovaná", "Ara ararauna", "Ara arakanga", "Ara hyacintový", "Eklektus různobarvý", 
    "Holub domácí / Závodní", "Kachna / Husa (Zájmový chov)", "Kakadu bílý", "Kakadu růžový", "Kanár", 
    "Korela chocholatá", "Křepelka", "Kur domácí (Slepice - Zájmový chov)", "Loríček", "Papoušek senegalský", 
    "Papoušek šedý (Žako)", "Páv", "Pěnkava", "Rozela", "Zebřička pestrá", "Jiné"
  ].sort((a, b) => a.localeCompare(b, 'cs')),
  reptile: [
    "Agama kočičínská", "Agama vousatá", "Anolis", "Boa constrictor (Hroznýš)", "Chameleon jemenský", 
    "Chameleon pardálí", "Felsuma", "Gekončík noční", "Krajta kobercová", "Krajta královská", "Krajta mřížkovaná", 
    "Leguán zelený", "Užovka červená", "Varan", "Žába (Pralesnička - Šípová žába)", "Žába (Rosnička)", 
    "Želva nádherná (vodní)", "Želva pardálí", "Želva stepní", "Želva zelenavá (suchozemská)", "Jiné"
  ].sort((a, b) => a.localeCompare(b, 'cs')),
  fish: [
    "Ancistrus", "Bojovnice (Betta splendens)", "Cichlida (Malawi / Tanganika)", "Čichavec", "Dánio pruhované", 
    "Kapr Koi (Jezírko)", "Krunýřovec", "Mečovka", "Mřenka", "Neonka červená / obecná", "Pancéřníček", 
    "Paví očko (Guppy)", "Plata", "Skalár amazonský", "Terčovec (Discus)", "Závojnatka (Zlatá rybka)", "Jiné"
  ].sort((a, b) => a.localeCompare(b, 'cs')),
  horse: [
    "Americký quarter horse (AQH)", "Andaluský kůň", "Anglický plnokrevník", "Appaloosa", "Arabský plnokrevník", 
    "Belgický chladnokrevník", "Český teplokrevník", "Fjordský kůň", "Fríský kůň", "Hafling", "Huculský kůň", 
    "Kinský kůň", "Lipicán", "Minihorse", "Paint horse", "Pony (Shetland, Welsh, atd.)", "Shirský kůň", 
    "Starokladrubský kůň", "Tažný kůň (Různá plemena)", "Jiné"
  ].sort((a, b) => a.localeCompare(b, 'cs')),
  exotic: [
    "Kudlanka nábožná", "Mnohonožka (Gigas)", "Pavouk (Sklípkan - různé druhy)", "Rak / Krab (Akvarijní)", 
    "Stonožka", "Strašilka / Pakobylka", "Šnek (Achatina - Oblovka)", "Štír", "Tuleň / Lachtan (Zoo/Odborný chov)", 
    "Včelstvo (Včely)", "Jiné"
  ].sort((a, b) => a.localeCompare(b, 'cs'))
};
