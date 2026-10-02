"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight, ChevronLeft, Quote, Snowflake, Leaf, Sun, Wind } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { BottomTerminalReveal } from "@/components/BottomTerminalReveal";
import { CareSEOArchive } from "@/components/CareSEOArchive";
import { MAGAZINE_CS, MAGAZINE_EN, SEASONAL_CS, SEASONAL_EN } from '@/locales/magazine_content';
import { translations } from "@/locales/translations";
import { getDaimonResponse, getDaimonName } from "@/lib/daimonBot";

function StarField() {
  const [stars, setStars] = useState<{ x: number, y: number, size: number, opacity: number, duration: number, delay: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 300 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.2,
      opacity: Math.random() * 0.7 + 0.1,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 10
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-mafia-gold"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            boxShadow: star.size > 1.5 ? `0 0 ${star.size * 2}px rgba(var(--color-mafia-gold-rgb), 0.8)` : 'none',
          }}
          animate={{
            opacity: [0, star.opacity, star.opacity * 0.3, star.opacity],
            scale: [0.8, 1.5, 0.8],
            x: [(star.x - 50) * 0.05, (star.x - 50) * 0.2, (star.x - 50) * 0.05],
            y: [(star.y - 50) * 0.05, (star.y - 50) * 0.2, (star.y - 50) * 0.05],
          }}
          transition={{
            duration: star.duration * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay
          }}
        />
      ))}
    </div>
  );
}

function DNAHelix() {
  return (
    <div className="absolute top-0 bottom-0 right-8 md:right-[5%] w-64 pointer-events-none overflow-hidden hidden md:flex flex-col items-center justify-around z-0">
      {[...Array(32)].map((_, i) => (
        <div key={i} className="relative w-full h-8 flex items-center justify-center">
          {/* Synchronized Container for Rung and Points */}
          <motion.div
            className="relative flex items-center justify-center"
            animate={{
              width: ["0px", "180px", "0px"],
              opacity: [0, 1, 0],
              rotateY: [0, 180, 360],
              x: [0, 10, 0, -10, 0] // Subtle horizontal wobble for extra 3D feel
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.18
            }}
          >
            {/* Connection Rung - Tapered line (thicker at ends) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[2.5px] bg-gradient-to-r from-mafia-gold via-mafia-gold/5 to-mafia-gold noir-mode:from-mafia-silver noir-mode:via-mafia-silver/5 noir-mode:to-mafia-silver theme-blood:from-mafia-blood theme-blood:via-mafia-blood/5 theme-blood:to-mafia-blood opacity-60" />
            </div>

            {/* Left Rhombus (Kosodélník) */}
            <div 
              className="absolute left-0 -translate-x-1/2 w-3.5 h-7 bg-mafia-gold noir-mode:bg-mafia-silver theme-blood:bg-mafia-blood shadow-[0_0_20px_var(--user-accent-color)]"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            ></div>

            {/* Right Rhombus */}
            <div 
              className="absolute right-0 translate-x-1/2 w-3.5 h-7 bg-mafia-gold noir-mode:bg-mafia-silver theme-blood:bg-mafia-blood shadow-[0_0_20px_var(--user-accent-color)] opacity-90"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            ></div>
          </motion.div>
        </div>
      ))}
      
      {/* Vertical Backbone Glitters */}
      <motion.div 
        animate={{ y: ["0%", "100%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex flex-col items-center gap-24 opacity-5"
      >
        {[...Array(8)].map((_: any, i: number) => (
          <div key={i} className="w-px h-40 bg-gradient-to-b from-transparent via-mafia-gold noir-mode:via-mafia-silver theme-blood:via-mafia-blood to-transparent" />
        ))}
      </motion.div>
    </div>
  );
}

type ChatMessage = {
  role: 'user' | 'bot';
  content: string;
  analysis?: { toxic: any[], good: any[], info: any[], food: any[] };
  recommendation?: { title: string, text: string };
};

function AnalyzerComponent({ page, lang }: { page: any, lang: string }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'bot',
    content: lang === 'cs' ? 'Ahoj! Jsem Barber-Bot. Napiš mi složení své kosmetiky, nebo zadej jakékoliv jídlo (např. vejce, losos, cukr) a já ti řeknu, jaký má vliv na tvé tělo a vlasy!' : 'Hi! I am the Barber-Bot. Paste your ingredients or any food, and I will tell you its effect on your hair and body.'
  }]);
  
  const ingredientDb = [
    // ☠️ Toxické a škodlivé - standardní chemie
    { type: 'toxic', names: ['sodium chloride', 'chlorid sodný', 'maris sal', 'sea salt', 'sůl'], severity: 9, reason: lang === 'cs' ? 'Extrémně vysušuje, ničí strukturu vlasu, uzavírá póry a z dlouhodobého hlediska způsobuje řídnutí a vypadávání vlasů.' : 'Extremely drying, destroys hair structure, causes thinning.' },
    { type: 'toxic', names: ['dimethicone', 'amodimethicone', 'cyclomethicone', 'silicone', 'silikon', 'dimethiconol'], severity: 7, reason: lang === 'cs' ? 'Vytvoří na vlasu neprodyšný plastový film. Nevepustí do vlasu hydrataci. Vlas uvnitř usychá a láme se.' : 'Blocks hydration from entering the hair. Hair dries inside.' },
    { type: 'toxic', names: ['sls', 'sles', 'sodium lauryl sulfate', 'sodium laureth sulfate', 'sulfát'], severity: 8, reason: lang === 'cs' ? 'Vysoce agresivní levné pěnidlo (najdete ho i v prostředcích na nádobí). Odstraňuje všechen přirozený maz, extrémně dráždí pokožku.' : 'Aggressive foaming agent. Removes all natural oils, irritates skin.' },
    { type: 'toxic', names: ['paraben', 'methylparaben', 'propylparaben', 'butylparaben', 'ethylparaben'], severity: 6, reason: lang === 'cs' ? 'Levný konzervant a známý endokrinní disruptor. Narušuje hormony a u citlivých jedinců způsobuje dermatitidu.' : 'Endocrine disruptor. Interferes with hormones.' },
    { type: 'toxic', names: ['phthalate', 'ftalát', 'fragrance', 'parfum', 'parfém'], severity: 5, reason: lang === 'cs' ? 'Umělé vůně jsou často chemickým koktejlem, který výrobce nemusí specifikovat. Slouží k maskování chemického zápachu produktu a dráždí pokožku.' : 'May contain hidden chemicals and allergens.' },
    { type: 'toxic', names: ['alcohol denat', 'isopropyl alcohol', 'ethanol', 'alkohol denat'], severity: 7, reason: lang === 'cs' ? 'Silně vysušuje vlasovou pokožku a vlasy, zbavuje je přirozených olejů, což vede ke křehkosti a lámání.' : 'Strongly dries scalp and hair.' },
    { type: 'toxic', names: ['mineral oil', 'paraffinum liquidum', 'minerální olej', 'petrolatum', 'vazelína'], severity: 6, reason: lang === 'cs' ? 'Levný ropný derivát. Ucpává póry na pokožce hlavy, brání dýchání vlasových folikulů a zpomaluje růst vlasů.' : 'Clogs scalp pores, prevents follicle breathing.' },
    { type: 'toxic', names: ['formaldehyde', 'formaldehyd', 'dmdm hydantoin', 'diazolidinyl urea'], severity: 10, reason: lang === 'cs' ? 'Kriticky nebezpečný karcinogen. Uvolňuje toxické výpary a silně poškozuje dýchací cesty i pokožku hlavy.' : 'Carcinogen, releases toxic fumes, extremely dangerous.' },
    { type: 'toxic', names: ['triclosan', 'triklosan'], severity: 8, reason: lang === 'cs' ? 'Agresivní antibakteriální látka. Narušuje přirozený mikrobiom pokožky a přispívá k rezistenci bakterií.' : 'Aggressive antibacterial, disrupts natural microbiome.' },

    // 🤡 Extrémní bizáry a vtípky (Easter eggs)
    { type: 'toxic', names: ['beton', 'concrete', 'cement'], severity: 100, reason: lang === 'cs' ? 'Člověče, co to používáte? Beton vám sice vytvoří dokonalou fixaci, ale vlasy vám po zaschnutí odpadnou i s kusem lebky. První pomoc: Dokud je mokrý, rychle umýt vodou. Jak zaschne, pomůže už jen sbíječka.' : 'Ultimate hold, but you will literally lose your head. Do not use.' },
    { type: 'toxic', names: ['piliny', 'sawdust', 'dřevěné třísky'], severity: 50, reason: lang === 'cs' ? 'Skvělé, pokud se snažíte přilákat datla nebo se stát ptačí budkou. Pro vaše vlasy to ale fakt není. První pomoc: Vysavač a vyčesat.' : 'Great if you want to attract woodpeckers. Terrible for hair.' },
    { type: 'toxic', names: ['motorový olej', 'motor oil', 'wd-40', 'wd40'], severity: 90, reason: lang === 'cs' ? 'Ideální pro promazání pantů u dveří nebo motoru vaší V8, ale na hlavě vám to způsobí totální chemickou katastrofu. První pomoc: Mýt 10x za sebou silným jarem.' : 'Perfect for a V8 engine, absolute disaster for your scalp.' },
    { type: 'toxic', names: ['kyselina sírová', 'sulfuric acid', 'acid'], severity: 1000, reason: lang === 'cs' ? 'Gratulujeme, právě jste si rozpustili hlavu. PRVNÍ POMOC: Okamžitě a dlouze oplachovat obrovským množstvím tekoucí vody, nesnažit se to utírat! Volat záchranku (155).' : 'Congratulations, you just dissolved your head.' },
    { type: 'toxic', names: ['uran', 'uranium', 'plutonium', 'radioaktivní'], severity: 9999, reason: lang === 'cs' ? 'Z vlasů vám sice nezbyde nic, ale aspoň budete ve tmě hezky svítit zeleně. První pomoc: Jodové tablety, olověný oblek a modlitba.' : 'You will glow in the dark, but you won\'t have any hair left.' },
    { type: 'toxic', names: ['jar na nádobí', 'jar', 'pur', 'savo'], severity: 80, reason: lang === 'cs' ? 'Jestli chcete mít vlasy odmaštěné tak, že se začnou drolit na prach, tak prosím. Odstraní všechno, včetně naděje. Savo navyše způsobí těžké poleptání.' : 'Removes grease, hair, and hope.' },
    { type: 'toxic', names: ['benzín', 'benzin', 'gasoline', 'petrol'], severity: 500, reason: lang === 'cs' ? 'Skvělý odmašťovač, ale stačí zapálit si cigaretu a máte na hlavě ohnivou show. PRVNÍ POMOC: Při polití smýt vodou a mýdlem. Při požití NIKDY nevyvolávat zvracení (hrozí vdechnutí do plic) a ihned k lékaři!' : 'Extremely flammable and toxic. You will become Ghost Rider.' },
    { type: 'toxic', names: ['nafta', 'diesel'], severity: 400, reason: lang === 'cs' ? 'Vlasy budou smrdět jako traktor na poli a vaše pokožka se vám odmění chemickým poleptáním a zánětem. PRVNÍ POMOC: Umýt mýdlem. Při požití nevyvolávat zvracení.' : 'You will smell like a tractor and get severe chemical burns.' },
    { type: 'toxic', names: ['brzdová kapalina', 'brake fluid', 'dot4'], severity: 600, reason: lang === 'cs' ? 'Tohle spolehlivě rozežere autolak. S vašimi vlasovými folikuly to udělá to samé. PRVNÍ POMOC: Rychle smýt vodou, při zasažení očí vyplachovat 15 minut.' : 'Destroys car paint, will destroy your scalp even faster.' },
    { type: 'toxic', names: ['fridex', 'nemrznoucí směs', 'antifreeze', 'ethylenglykol'], severity: 800, reason: lang === 'cs' ? 'Chutná sladce, ale je smrtelně jedovatý (ničí ledviny). PRVNÍ POMOC PŘI POŽITÍ: Antidotem je tvrdý alkohol! Rychle vypít panáka silného alkoholu (etanol zablokuje rozklad jedu) a volat 155. Při polití: Smýt vodou.' : 'Highly toxic. Absorbs through scalp and damages organs.' },
    { type: 'toxic', names: ['vteřinové lepidlo', 'superglue', 'sekundové lepidlo', 'cyanoacrylate'], severity: 99, reason: lang === 'cs' ? 'Nezničitelný styling level 9000. PRVNÍ POMOC: Násilím neodtrhávejte! Na kůži zabere aceton (odlakovač na nehty) a teplá mýdlová voda. Na vlasech pomůžou jedině nůžky.' : 'Indestructible hold. Requires an angle grinder for removal.' },
    { type: 'toxic', names: ['odrezovač', 'rust remover'], severity: 150, reason: lang === 'cs' ? 'Vaše vlasy sice možná nebudou reznout, ale za to vám slezou i s kůží rovnou k lebce. PRVNÍ POMOC: Okamžitý výplach čistou vodou.' : 'Your hair won\'t rust, but it will fall off completely.' },
    { type: 'toxic', names: ['montážní pěna', 'pur pěna', 'polyuretanová pěna'], severity: 95, reason: lang === 'cs' ? 'Pokud chcete mít na hlavě trvalou helmu, jdete na to správně. PRVNÍ POMOC: Dokud nezaschne, lze použít speciální čistič na PUR pěnu. Zaschlou už jen ostříhat nebo brousit.' : 'Creates a permanent helmet on your head. Unremovable.' },

    // 🌿 Prospěšné a přírodní
    { type: 'good', names: ['cannabis sativa seed oil', 'hemp seed oil', 'konopný olej', 'konopí', 'hemp', 'cbd'], severity: 0, reason: lang === 'cs' ? 'Vysoce vyživující zázrak! Obsahuje omega-3 a 6 mastné kyseliny, posiluje vlasový stvol, stimuluje růst, hojí podrážděnou pokožku a dodává obrovský lesk.' : 'Highly nourishing oil rich in omega fatty acids. Promotes growth and scalp health.' },
    { type: 'good', names: ['citrus limon', 'lemon extract', 'citron', 'citronový extrakt', 'citric acid', 'kyselina citronová'], severity: 1, reason: lang === 'cs' ? 'Přírodní antioxidant a zdroj vitamínu C. Čistí pokožku hlavy od přebytečného mazu, srovnává pH a dodává vlasům přirozený lesk a svěžest.' : 'Natural antioxidant, cleanses scalp and adds shine, balances pH.' },
    { type: 'good', names: ['aloe barbadensis', 'aloe vera', 'aloe'], severity: 0, reason: lang === 'cs' ? 'Úžasný hydratační a zklidňující prostředek. Pomáhá proti svědění pokožky a dodává vlasům hloubkovou vlhkost bez zatížení.' : 'Deeply hydrating and soothing for scalp and hair.' },
    { type: 'good', names: ['argania spinosa kernel oil', 'argan oil', 'arganový olej', 'argan'], severity: 0, reason: lang === 'cs' ? 'Tekuté zlato pro vlasy. Bohaté na vitamín E, chrání před teplem, eliminuje krepatění a hloubkově vyživuje zničené vlasy.' : 'Liquid gold for hair, rich in vitamin E and deeply nourishing.' },
    { type: 'good', names: ['rosmarinus officinalis', 'rosemary', 'rozmarýn', 'rozmarýnový olej'], severity: 0, reason: lang === 'cs' ? 'Silný přírodní stimulátor růstu vlasů! Klinicky ověřeno, že zlepšuje prokrvení pokožky hlavy a efektivně bojuje proti vypadávání vlasů.' : 'Potent natural hair growth stimulator. Improves scalp circulation.' },
    { type: 'good', names: ['mentha piperita', 'peppermint', 'máta', 'mátový extrakt', 'menthol'], severity: 1, reason: lang === 'cs' ? 'Příjemně chladí, zmírňuje záněty a prokrvuje pokožku, čímž probouzí spící folikuly a podporuje růst silných vlasů.' : 'Cools and stimulates scalp circulation.' },
    { type: 'good', names: ['melaleuca alternifolia', 'tea tree oil', 'tea tree', 'čajovník'], severity: 1, reason: lang === 'cs' ? 'Má silné antiseptické a protiplísňové vlastnosti. Jedna z nejlepších přírodních složek pro boj s lupy a problematickou, aknózní pokožkou na hlavě.' : 'Strong antiseptic, great for fighting dandruff.' },
    { type: 'good', names: ['butyrospermum parkii', 'shea butter', 'bambucké máslo', 'shea'], severity: 0, reason: lang === 'cs' ? 'Vynikající přírodní kondicionér. Dodává extrémní hydrataci, zaceluje roztřepené konečky a tvoří štít proti UV záření.' : 'Excellent natural conditioner, provides extreme hydration.' },
    { type: 'good', names: ['keratin', 'hydrolyzed keratin', 'keratinový'], severity: 0, reason: lang === 'cs' ? 'Hlavní stavební protein vlasu. Opravuje mikrotrhliny ve vlasech, zpevňuje je a navrací jim ztracenou elasticitu a sílu.' : 'Building protein of hair, repairs and strengthens.' },
    { type: 'good', names: ['panthenol', 'provitamin b5', 'vitamín b5', 'b5'], severity: 0, reason: lang === 'cs' ? 'Hloubkově hydratuje, uhlazuje povrch vlasu, zvětšuje objem a hojí spálenou nebo podrážděnou pokožku hlavy.' : 'Deeply hydrates and adds volume. Soothes scalp.' },
    { type: 'good', names: ['salvia officinalis', 'sage extract', 'šalvěj'], severity: 0, reason: lang === 'cs' ? 'Přírodní bylinka čistící póry. Reguluje mazotok a může přirozeně ztmavovat vlasy, čímž lehce kryje první šediny.' : 'Cleanses scalp and naturally darkens hair.' },
    { type: 'good', names: ['urtica dioica', 'nettle extract', 'kopřiva', 'kopřivový extrakt'], severity: 0, reason: lang === 'cs' ? 'Tradiční lokální bylina proti vypadávání vlasů a lupům. Snižuje tvorbu mazu a je nabitá vitamíny pro zdravý růst.' : 'Traditional herb against hair loss and dandruff.' },
    { type: 'good', names: ['biotin', 'vitamin b7', 'vitamín b7'], severity: 0, reason: lang === 'cs' ? 'Nezbytný vitamín pro produkci keratinu. Prokazatelně zahušťuje vlasy a zamezuje jejich nadměrnému padání.' : 'Essential vitamin for keratin production, thickens hair.' },
    { type: 'good', names: ['simmondsia chinensis', 'jojoba oil', 'jojobový olej', 'jojoba'], severity: 0, reason: lang === 'cs' ? 'Strukturně se velmi podobá lidskému kožnímu mazu. Skvěle hydratuje bez maštění a rozpouští nánosy ve folikulech.' : 'Mimics natural sebum, hydrates without greasiness.' },
    { type: 'good', names: ['caffeine', 'kofein'], severity: 0, reason: lang === 'cs' ? 'Stimulant, který prodlužuje růstovou fázi vlasu (anagen). Ideální pro boj s dědičným vypadáváním vlasů a prohřátí kořínků.' : 'Stimulates hair roots and extends growth phase.' },
    { type: 'good', names: ['chamomilla recutita', 'chamomile', 'heřmánek', 'heřmánkový'], severity: 0, reason: lang === 'cs' ? 'Úžasně zklidňuje citlivou pokožku. Má protizánětlivé účinky a přírodně zvýrazňuje blond odstíny.' : 'Soothes sensitive scalp, anti-inflammatory.' },
    { type: 'good', names: ['zinc pyrithione', 'zinek', 'zinc pc'], severity: 1, reason: lang === 'cs' ? 'Prémiová složka proti těžkým lupům a seboroické dermatitidě. Normalizuje produkci mazu na pokožce.' : 'Effective against severe dandruff and dermatitis.' },
    { type: 'good', names: ['collagen', 'kolagen'], severity: 0, reason: lang === 'cs' ? 'Aminokyseliny z kolagenu posilují vlasovou strukturu zevnitř. Zabraňuje stárnutí vlasů a dodává plnost.' : 'Amino acids strengthen hair structure, add fullness.' },
    { type: 'good', names: ['niacinamide', 'vitamin b3', 'vitamín b3'], severity: 0, reason: lang === 'cs' ? 'Zlepšuje prokrvení a transport živin přímo do vlasových folikulů. Posiluje ochrannou bariéru kůže.' : 'Improves blood circulation and nutrient transport to follicles.' },

    // 💡 Styling a zajímavosti (Info / Neutral / Typy produktů)
    { type: 'info', names: ['pivo', 'beer', 'cerveza'], severity: 0, reason: lang === 'cs' ? 'Světe div se, kvasnice a chmel ve skutečnosti vlasy zpevňují a dodávají jim extrémní objem! Oblíbený trik pankáčů a starých barberů.' : 'Yeast and hops actually strengthen hair and add massive volume. Old punk rock trick.' },
    { type: 'info', names: ['prach', 'dust', 'špína'], severity: 2, reason: lang === 'cs' ? 'Běžná špína z ulice. Vlasy budou matné a bez života. Doporučujeme umýt kvalitním šamponem dřív, než se vám v nich usídlí pavouci.' : 'Street dirt. Makes hair dull and lifeless. Wash immediately.' },
    { type: 'info', names: ['vodní pomáda', 'water based pomade', 'ceteareth-25'], severity: 0, reason: lang === 'cs' ? 'Pomáda na vodní bázi: Snadno se smývá pouhou vodou, v průběhu dne mírně zasychá. Vhodná pro moderní uhlazené účesy (Slick back, Pompadour).' : 'Water-based pomade. Washes out easily, sets during the day.' },
    { type: 'info', names: ['olejová pomáda', 'oil based pomade', 'petrolatum pomade'], severity: 0, reason: lang === 'cs' ? 'Tradiční old-school klasika. Nikdy nezaschne, takže lze účes kdykoliv během dne přetvarovat hřebenem. Výborně drží, ale velmi špatně se vymývá.' : 'Traditional oil-based. Never dries, restyleable all day. Hard to wash out.' },
    { type: 'info', names: ['hlína na vlasy', 'matte clay', 'kaolin', 'bentonite', 'bentonit'], severity: 0, reason: lang === 'cs' ? 'Stylingová hlína. Perfektní pro vytvoření silné textury a zcela matného vzhledu. Ideální pro kratší, střapaté styly (Crop, Quiff).' : 'Styling clay. Perfect for matte texture and natural look.' },
    { type: 'info', names: ['slaná voda', 'sea salt spray', 'salt spray', 'slaný sprej'], severity: 1, reason: lang === 'cs' ? 'Dodává fantastický plážový objem a hrubší texturu. POZOR: sůl při častém používání bez kondicionéru vlasy vysušuje!' : 'Adds beach volume and texture, but can dry out hair if used daily.' },
    { type: 'info', names: ['objemová voda', 'volume tonic', 'grooming tonic', 'tonikum'], severity: 0, reason: lang === 'cs' ? 'Pre-styler aplikovaný do vlhkých vlasů před fénováním. Chrání před teplem a dodá účesu masivní základní objem a fixaci, než nanesete pomádu.' : 'Pre-styler for massive volume when blow-drying. Also provides heat protection.' },
    { type: 'info', names: ['barvené vlasy', 'color safe', 'color protection', 'na barvené vlasy'], severity: 0, reason: lang === 'cs' ? 'Šampon pro barvené vlasy: Neobsahuje agresivní sulfáty, takže nevymývá barvu. Navíc má kyselejší pH, které uzavírá vlasovou kutikulu, aby pigment nevypadl.' : 'Color-safe shampoo. Free of harsh sulfates to prevent color fading, pH balanced.' },
    { type: 'info', names: ['suchý šampon', 'dry shampoo', 'suchý sprej'], severity: 1, reason: lang === 'cs' ? 'Prášek (často z rýžového nebo kukuřičného škrobu) ve spreji, který absorbuje maz bez vody. Super záchrana, ale při nadužívání ucpává póry na hlavě.' : 'Absorbs oil without washing. Great emergency tool, but clogs pores if overused.' },
    { type: 'info', names: ['hluboko čistící', 'clarifying shampoo', 'detox šampon'], severity: 1, reason: lang === 'cs' ? 'Silný "resetovací" šampon. Ideální k použití jednou za měsíc k odstranění nánosů tvrdé vody a těžkých stylingů (např. olejových pomád). Nepoužívat denně!' : 'Heavy-duty cleaner to remove product buildup. Use only once a month.' },
    { type: 'info', names: ['vlasový pudr', 'hair powder', 'texture powder', 'texturizing powder', 'silica silylate'], severity: 0, reason: lang === 'cs' ? 'Stylingový pudr: Tajná zbraň pro okamžitý matný vzhled a neuvěřitelný objem od kořínků. Ideální pro jemné a řídnoucí vlasy.' : 'Secret weapon for instant matte volume and texture. Great for fine hair.' },
    { type: 'info', names: ['tepelná ochrana', 'heat protectant', 'heat spray', 'thermo protect'], severity: 0, reason: lang === 'cs' ? 'Vytváří na vlasu mikrofilm, který ho chrání před spálením při fénování, žehlení nebo kulmování. Absolutní nutnost při práci s vysokými teplotami.' : 'Forms a protective barrier against heat damage from hair dryers or flat irons.' },
    { type: 'info', names: ['bezoplachový kondicionér', 'leave-in conditioner', 'bezoplachový', 'leave in'], severity: 0, reason: lang === 'cs' ? 'Kondicionér, který se po umytí nesmývá. Skvělý pro extrémně suché, kudrnaté nebo roztřepené vlasy, kterým dodává vlhkost po celý den.' : 'Leave-in treatment for constant hydration. Perfect for dry or curly hair.' },
    { type: 'info', names: ['lak na vlasy', 'hairspray', 'fixační sprej', 'vlasový sprej'], severity: 1, reason: lang === 'cs' ? 'Závěrečná (finishing) fixace účesu. Obsahuje polymery, které vlasy doslova slepí do pevného štítu. Pozor na levné laky z drogerie – obsahují hodně vysušujícího alkoholu.' : 'Final finishing spray to lock the style. Cheap ones can dry out hair due to alcohol.' },
    { type: 'info', names: ['šampon proti lupům', 'dandruff shampoo', 'šampon na lupy'], severity: 0, reason: lang === 'cs' ? 'Kromě běžného mytí obsahuje aktivní látky (jako Zinek Pyrithion nebo Ketokonazol), které zabíjejí kvasinky způsobující lupy. Nechte na hlavě vždy aspoň 3 minuty působit!' : 'Contains active antifungal ingredients. Must be left on the scalp for at least 3 minutes.' },
    
    // 🍎 Jídlo a Strava (Vliv na tělo a vlasy)
    { type: 'food', names: ['avokádo', 'avocado'], severity: 0, reason: lang === 'cs' ? 'Extrémně bohaté na zdravé tuky a vitamín E. Pro tělo perfektní zdroj energie a pro vlasy prevence proti lámání a vysušování.' : 'Rich in healthy fats and vitamin E. Prevents hair breakage.' },
    { type: 'food', names: ['vejce', 'vajíčko', 'vajíčka', 'egg'], severity: 0, reason: lang === 'cs' ? 'Nejlepší zdroj vysoce kvalitních bílkovin a Biotinu. Podporuje extrémně rychlý růst vlasů a dodává jim maximální pevnost.' : 'Best source of protein and Biotin. Boosts hair growth and strength.' },
    { type: 'food', names: ['losos', 'ryba', 'salmon', 'ryby', 'tuňák'], severity: 0, reason: lang === 'cs' ? 'Omega-3 mastné kyseliny v rybách neskutečně zlepšují kvalitu vlasové pokožky, omezují lupy a podporují hustotu vlasů. Pro mozek a srdce absolutní nutnost.' : 'Omega-3s improve scalp health, reduce dandruff and boost density.' },
    { type: 'food', names: ['ořechy', 'mandle', 'vlašské', 'nuts', 'almonds'], severity: 0, reason: lang === 'cs' ? 'Obsahují Zinek a Selen. Pokud ti chybí, vlasy začnou masivně padat. Ořechy jsou skvělý testosteronový a vlasový booster.' : 'Rich in Zinc and Selenium. Prevents hair loss and boosts testosterone.' },
    { type: 'food', names: ['špenát', 'spinach', 'brokolice'], severity: 0, reason: lang === 'cs' ? 'Železo, vitamín A a C. Zabraňuje křehkosti vlasů a pomáhá kořínkům dýchat. Ideální pro celkovou vitalitu a imunitu.' : 'Iron and vitamins A & C. Prevents brittle hair.' },
    { type: 'food', names: ['cukr', 'sladkosti', 'sugar', 'čokoláda'], severity: 5, reason: lang === 'cs' ? 'Rychlé cukry způsobují záněty v těle, což vede k horší kvalitě kůže, akné a oslabení vlasových folikulů (častější vypadávání).' : 'Causes inflammation, acne, and weakens hair follicles.' },
    { type: 'food', names: ['maso', 'hovězí', 'beef', 'steak'], severity: 0, reason: lang === 'cs' ? 'Královský zdroj železa a proteinu. Podporuje tvorbu svalové hmoty, testosteronu a dodává stavební látky pro silné a tlusté vlasy.' : 'King of iron and protein. Builds muscle and thick hair.' },
    { type: 'food', names: ['voda', 'water', 'čistá voda'], severity: 0, reason: lang === 'cs' ? 'Hydratace zevnitř! Bez dostatku vody budou tvoje vlasy suché a pokožka bude svědit. Pij alespoň 2,5 litru denně.' : 'Hydration from within. Prevents dry hair and itchy scalp.' }
  ];

  const knowledgeBase = lang === 'cs' ? [
    {
      id: 'food_hair',
      keywords: ['jídlo','jíst','jist','jidlo','snídat','obědvat','večeřet','strava','stravov','stravu','stravy','dieta','dietu','diet','doplněk','doplnky','doplňky','doplňek','suplement','suplementy','výživ','výživa','nutrit','jídla','potravia','potrava','potravina','co jíst','co jist','co jídlo','co snídat','co doporučuješ','na vlasy jíst','jídlo vlasy','vlasy jídlo','pro vlasy','na vlasy','vlasovou výživu','vitamín vlasy','vitamíny vlasy','vitamin vlasy','vitamíny na vlasy','minerál vlasy','minerály vlasy'],
      title: 'Strava a výživa pro zdravé vlasy',
      intro: 'Vlasy jsou přímým zrcadlem toho, co jíš. Tady je odborný přehled:',
      text: 'Vlasy rostou přibližně **1–1,5 cm za měsíc** a jsou tvořeny z 90 % proteinem keratin – takže bez dostatku bílkovin prostě nerostou. \n\n**SUPER POTRAVINY PRO VLASY:**\n• **Vejce** – královský zdroj Biotinu (B7) a kompletních proteinů. Biotin je klinicky ověřen jako podpora keratinové syntézy.\n• **Mastné ryby (losos, makrela, sardinky)** – Omega-3 mastné kyseliny vyživují vlasový folikul zevnitř a dramaticky zlepšují lesk a hustotu.\n• **Červené maso a drůbež** – Železo a Zinek. Nedostatek těchto minerálů je jednou z hlavních příčin vypadávání vlasů.\n• **Ořechy a semínka** – Selen (vlašské ořechy), vitamín E a Zinek. Antioxidanty chrání folikuly před poškozením volnými radikály.\n• **Špenát, brokolice, kapusta** – Železo, kyselina listová, beta-karoten. Nedostatek železa způsobuje telogenní effluvium – masivní padání vlasů.\n• **Avokádo** – Vitamín E a zdravé tuky. Chrání buňky vlasové pokožky před oxidativním stresem.\n• **Fazole a luštěniny** – Proteinový základ pro vegany plus Biotin.\n• **Sladké brambory** – Beta-karoten (provitamín A), který tělo mění na vitamín A. Vitamín A je nezbytný pro tvorbu sebum – přirozeného kondicionéru vlasů.\n\n**CO NAOPAK NIČÍ VLASY:**\n• Nadbytek **cukru** – způsobuje glykaci proteinů, tedy poškozuje keratin zevnitř.\n• **Alkohol** – vysušuje organismus a snižuje vstřebávání zinku a folátu.\n• **Crash diety** – dramatický kalorický deficit = anagen effluvium (vlasy se přestanou tvořit).\n\n**DOPLŇKY STRAVY:** Pokud máš špatnou stravu, zvažte: **Biotin 5000 mcg/den**, **Železo (po konzultaci s lékařem)**, **Vitamín D3**, **Omega-3** kapsle a **Kolagen** (hydrolyzovaný, peptidy).'
    },
    {
      id: 'hairloss',
      keywords: ['padání','padají','padajíci','vypadávání','vypadávají','vypadají','vypadl','řídnutí','řídne','řídnou','plešatění','plešatí','lysí','lysina','hair loss','alopecia','alopecie','thinning','vypadávat','vypadnout','padnout','padají mi','padají vlasy','padají mi vlasy','ztráta vlasů'],
      title: 'Vypadávání vlasů – příčiny a řešení',
      intro: 'Vypadávání vlasů je komplexní téma. Tady je to, co o něm říká věda:',
      text: '**Normální je ztratit 50–100 vlasů denně** – to je součást přirozeného cyklu. Pokud padá víc, je čas jednat.\n\n**HLAVNÍ PŘÍČINY:**\n• **Androgenní alopecie (dědičná)** – nejčastější u mužů, způsobena DHT (dihydrotestosteronem) ničícím folikuly. Je genetická, léčba je Minoxidil nebo Finasterid (Propecia).\n• **Telogenní effluvium** – stres, nemoc, operace, porod nebo extrémní dieta způsobí masivní padání 2–3 měsíce po události. Obvykle dočasné a reverzibilní.\n• **Nedostatek živin** – Železo, Zinek, Biotin, Vitamín D, Proteinů.\n• **Štítná žláza** – hypo i hyper thyreoidismus způsobuje padání.\n• **Seboroická dermatitida** – záněty pokožky oslabují folikul.\n\n**CO SKUTEČNĚ FUNGUJE:**\n• **Minoxidil 5%** (Rogaine) – klinicky ověřen, stimuluje prokrvení folikulů. Výsledky viditelné po 4–6 měsících.\n• **Rozmarýnový olej** – studie z 2023 ukázala stejnou účinnost jako 2% Minoxidil při pravidelné aplikaci.\n• **Kofeinový šampon** – pronikne do folikulu a blokuje DHT lokálně.\n• **Sérum s biotinem** – externálně prokáže méně efektu než orální suplementace.\n• **Dermaroller (microneedling)** – 0,5 mm jehličky aktivují kmenové buňky ve folikulech.\n• **Masáže skalpu 10 min/den** – vědecky ověřeno jako podpora hustoty vlasů.\n\n**MMBarber tip:** Vizuálně okamžitě pomůže **vlasový pudr (Texture Powder)** – zakryje prosvítající místá a dodá objem od kořínků.'
    },
    {
      id: 'dandruff',
      keywords: ['lupy','lupa','lupů','lupeny','svědění','svědí','svědivost','lupénka','dandruff','seborrhea','seborea','seboroická','šupinatění','šupiny','svědí hlava','svědivá hlava','škrábání','škrabu','pruritus'],
      title: 'Lupy a svědění pokožky hlavy',
      intro: 'Lupy jsou medicínský problém, ne jen kosmetický. Tady je odborný postup:',
      text: '**Co jsou lupy?** Nejčastěji je způsobují kvasinky *Malassezia globosa*, které se přirozeně vyskytují na kůži. U náchylných jedinců způsobují záněty a zrychlené odlupování kůže.\n\n**LÉČBA:**\n• **Šampony se Zinkem Pyrithionem (ZPT)** – zabíjejí kvasinky. Značky: Head & Shoulders Pro, Ducray Squanorm.\n• **Ketokonazol 2%** – antifungální lék. Nizoral šampon, používej 2x týdně, nech 5 min působit.\n• **Selenium sulfid** – silný antifungál, dostupný bez receptu.\n• **Salicylová kyselina** – odstraní nánosy šupin a umožní účinné látkám proniknout ke kůži.\n• **Tea Tree olej 5%** – přírodní antimykotikum.\n• **Piroctone Olamine** – moderní alternativa k ZPT, méně agresivní.\n\n**KLÍČOVÉ TIPY:**\n• Šampon nech **minimálně 3–5 minut** působit – jinak nestihne aktivní látka zabrat.\n• Vyhni se horké vodě – zhoršuje záněty.\n• Vlasy suš důkladně – vlhké prostředí podporuje růst kvasinek.\n• Vyvaruj se SLS sulfátů, které pokožku dráždí.\n• Pokud nepomáhá nic, navštiv dermatologa – může jít o Psoriázu nebo Atopický ekzém.'
    },
    {
      id: 'volume',
      keywords: ['objem','obejm','objemný','objem vlasů','bez objemu','zplihlé','zplihlý','jemné vlasy','jemná vlákna','tenké vlasy','ploché vlasy','vlasy bez objemu','volume','lift','nadzvednout','nadzvednout vlasy','zvětšit objem','přidat objem','víc objemu'],
      title: 'Objem vlasů – profesionální postup',
      intro: 'Jemné vlasy bez objemu jsou náš denní chléb. Tady jsou triky přímo z barbershopů:',
      text: '**PROČ VLASY NEMAJÍ OBJEM?**\nJemná vlákna mají malý průměr a velmi rychle se lepí k hlavě váhou produktů nebo sebumu.\n\n**PROFESIONÁLNÍ TECHNIKA:**\n1. **Umyj vlasy šamponem pro objem** – bez silikonu a bez sulfátů. Hledej: Hydrolyzovaný keratin, Panthenol, Proteinové hydrolyzáty.\n2. **Nanesti Grooming Tonic / Objemová voda** do vlhkých vlasů – to je základ objemu.\n3. **Fénuj s kulatým kartáčem** – vždy od kořínků, s náfukovacím nástavcem. Foukej na kořínky zespodu nahoru.\n4. **Nech vlasy 100 % vychladnout** před nanášením stylingového produktu.\n5. **Stylingový pudr (Texture Powder)** – vtři do suchých vlasů u kořínků – okamžitý objem bez váhy.\n6. **Matná hlína (Matte Clay)** v malém množství – hřej v dlaních, nanáš od konečků ke kořínkům.\n\n**ČEho se vyvarovat:**\n• Olejové pomády – váha je slepí ihned.\n• Kondicionér na kořínky – zatěžuje je.\n• Příliš mnoho produktu – méně je více.'
    },
    {
      id: 'dry_hair',
      keywords: ['suché','suchý','suchá','suchých','vysoušení','vysušené','vysušená','poškozené','poškozená','lámavé','lámavý','lámání','roztřepené','roztřepené konečky','krepaté','krepat','krepení','frizz','přepokrmeny','přesušené','brittle','dry hair','damaged hair'],
      title: 'Suché a poškozené vlasy – hloubková obnova',
      intro: 'Suché vlasy jsou zanedbaný vlasový hřídel – ale dá se to napravit:',
      text: '**PŘÍČINY:**\n• Agresivní sulfátové šampony (SLS/SLES)\n• Tepelné nástroje bez tepelné ochrany\n• Slunce a UV záření\n• Barvení, melírování, chemická trvalá\n• Klima (suchý vzduch v zimě)\n• Chlor v bazénu\n\n**PROTOKOL OBNOVY:**\n1. **Přestaň s SLS šampony** – přejdi na "sulfate-free" nebo No-Poo metodu.\n2. **Kondicionér po každém mytí** – nechej 3–5 min působit, pak propláchni chladnou vodou (uzavírá kutikulu).\n3. **Hloubková maska 1x týdně** – hledej: Ceramidy, Arganový olej, Keratin, Shea Butter, Panthenol.\n4. **Leave-in kondicionér (bezoplachový)** – nanáš na vlhké vlasy po umytí, vůbec neoplachuj.\n5. **Tepelná ochrana VŽDY** před fénem nebo žehličkou – minimálně 230°C ochrana.\n6. **Olej jako "seal"** – po celé péči zapečeť hydrataci kapkou Arganového nebo Jojobového oleje.\n\n**PROFESIONÁLNÍ TIP:** Keratinová procedura (brazilský keratin) dokáže vlasy kompletně obnovit na 3–6 měsíců. Zeptej se na ni při příští návštěvě MMBarber.'
    },
    {
      id: 'washing',
      keywords: ['mytí','myji','myjí','umývat','umýt','jak mýt','jak umýt','mytí vlasů','jak umývat','šamponování','jak šamponovat','jak pečovat','péče vlasy','hair wash','wash hair','jak moc mýt','jak často mýt','jak często mýt','frekvence mytí','jak moc mýt vlasy','každý den mýt','každodenní mytí'],
      title: 'Jak správně mýt vlasy',
      intro: 'Špatné mytí vlasů je číslo jedna příčina mnoha vlasových problémů. Tady je správný postup:',
      text: '**JAK ČASTO MÝT?**\n• **Normální vlasy:** 2–3x týdně\n• **Mastné vlasy:** každý den nebo ob den (ale jen s jemným šamponem)\n• **Suché a barvené vlasy:** 1–2x týdně\n• **Afro a kudrnaté:** 1x za 10–14 dní\n\n**SPRÁVNÝ POSTUP:**\n1. **Namočit vlasy vlažnou vodou** (ne horkou – horká otevírá kutikulu a zbavuje vlasy lesku)\n2. **Šampon nanést na SKALP, ne na délku** – masíruj kulatými pohyby, ne třením\n3. **Nech šampon 1–2 min působit**, pak smyj\n4. **Kondicionér nanést na délku** – vyhni se kořínkům, nech 3–5 min\n5. **Propláchnout STUDENOU vodou** – zavírá kutikulu, dodává lesk\n6. **Netlačit ručníkem** – vlas je ve vlhkém stavu zranitelný. Jemně osušit, stisknout.\n7. **Fénovat s tepelnou ochranou** na stupeň "medium heat"\n\n**TIP BARBERŮ:** Tzv. "double wash" – první šampon odstranění špíny a produktů, druhý šampon hloubková péče a čistění skalpu.'
    },
    {
      id: 'haircut_styles',
      keywords: ['střih','střihy','účes','účesy','hairstyle','fade','undercut','pompadour','quiff','crop','burst fade','skin fade','high fade','mid fade','low fade','taper','slick back','textured','crew cut','buzz cut','side part','comb over','french crop','caesar','barber střih','jaký střih','doporučuješ střih','jaký účes','jaký účes mám','moderní střih','trendy střih'],
      title: 'Střihy a účesy – kompletní průvodce',
      intro: 'Vyber si střih podle tvaru obličeje a životního stylu. Tady je přehled od barberů:',
      text: '**NEJPOPULÁRNĚJŠÍ PÁNSKÉ STŘIHY:**\n\n• **Fade (postupné přechody):**\n  – *Skin Fade* – mizí úplně na holou kůži, nejostřejší look\n  – *High Fade* – přechod začíná vysoko, maximální kontrast\n  – *Mid Fade* – zlatý střed, nejverzatilnější\n  – *Low Fade* – jemný taper, konzervativní elegance\n  – *Burst Fade* – půlkruhový přechod za uchem, streetwear styl\n\n• **Délka nahoře + styling:**\n  – *Pompadour* – objem vepředu, elegantní, vyžaduje Grooming Tonic + pomádu\n  – *Quiff* – volnější Pompadour, modernější, matná hlína\n  – *Slick Back* – dozadu přičesané, olejová nebo vodní pomáda\n  – *Textured French Crop* – nejpopulárnější nyní, matná textura vepředu\n  – *Side Part* – boční přídělěk, klasický gentleman look\n\n• **Kratší:**\n  – *Crew Cut* – krátká délka na všech stranách, minimální styling\n  – *Buzz Cut* – strojek na celou hlavu, nejnižší údržba\n  – *Caesar Cut* – rovný okraj vpředu, vojenský styl\n\n**JAK VYBRAT STŘIH PODLE OBLIČEJE:**\n• Oválný → Cokoliv\n• Kulatý → High Fade, Pompadour (přidává výšku)\n• Čtvercový → Soft Taper, French Crop\n• Srdcovitý → Mid Fade, Quiff\n• Obdélníkový → Side Part, Buzz Cut'
    },
    {
      id: 'beard',
      keywords: ['vousy','vous','brada','brcky','plnovous','knír','barba','beard','brk','stubble','péče vousy','holení','holeníce','holení vousů','trimmer','zastřihat','zastřihování','tvarování vousů','beard oil','vousoví olej','beardový','vousové','střihat vousy','vousový olej','podmáznout','konturování'],
      title: 'Vousy a brada – kompletní péče',
      intro: 'Vousy jsou umění. Tady je odborný kompendium péče o bradu:',
      text: '**FÁZE RŮSTU VOUSŮ:**\nPrvní 4 týdny jsou nejkritičtější – vlasy rostou nerovnoměrně a pokožka se musí přizpůsobit. Nevzdávej to!\n\n**PÉČE O VOUSY – PROTOKOL:**\n1. **Vousový olej (Beard Oil)** – nanáš každý den na vlhkou bradu. Hydratuje vousy i kůži pod nimi. Hledej: Arganový olej, Jojoba, Konopný olej.\n2. **Vousový balzám (Beard Balm)** – lehká fixace a výživa, ideální pro delší vousy.\n3. **Vousový šampon** – 2x týdně. Normální šampon na vlasy je příliš agresivní pro citlivou pokožku obličeje.\n4. **Kartáč na vousy** – distribuuje přirozené oleje a pomáhá vousy "cvičit" do tvaru.\n5. **Trimmer + přesný holicí strojek** – pro konturování.\n\n**TVAROVÁNÍ:**\n• Necklace (linie krku) – 1–2 cm nad Adamovým jablkem\n• Cheek Line (linie tváří) – přirozená linie, nebo lehce snížená\n• Fade v bradě – populární spojení se skin fadem na hlavě\n\n**TYPICKÉ CHYBY:**\n• Příliš nízká linie krku (vypadá jako stín dvojité brady)\n• Zanedbání péče o pokožku pod vousy → lupénka vousů (Beard Dandruff)\n• Nepoužívání oil/balm → lámání a šupinatění vousů'
    },
    {
      id: 'styling_products',
      keywords: ['pomáda','pomádu','pomády','hlína','wax','vosk','gel','tvarovat','stylingový','styling','fixace','hold','matný','lesklý','shine','matte','product','produkt','styling výrobky','jak nastylovat','nastylovat','nastylování','čím nastylovat','čím nastylit','jaká pomáda','jaký gel','styling vlasů','vlasy nastylovat'],
      title: 'Stylingové produkty – co, kdy a jak',
      intro: 'Výběr správného produktu změní vše. Tady je systematický přehled:',
      text: '**MAPA PRODUKTŮ PODLE POTŘEBY:**\n\n**SILNÁ FIXACE + LESK:**\n• *Olejová pomáda* – klasika 50. let. Nikdy nezaschne, lze restylovat celý den. Špatně se vymývá. Slick Back, Pompadour.\n• *Vodní pomáda* – snazší vymývání, lehce zasychá. Pompadour, Side Part.\n\n**SILNÁ FIXACE + MAT:**\n• *Hlína (Matte Clay)* – zemitý, přírodní look. Nejlepší pro French Crop, Quiff, Textured styly.\n• *Fiber paste* – vláknová pasta, střední fixace, matný finish, hodně textury.\n\n**STŘEDNÍ FIXACE:**\n• *Krém* (Styling Cream) – lehká fixace, zvýrazní přirozené vlny a kudrny.\n• *Mousse (Pěna)* – objem a definice pro jemné nebo vlnité vlasy.\n\n**PRE-STYLING (do vlhkých vlasů):**\n• *Grooming Tonic* – přidá objem základu před fénováním a chrání před teplem.\n• *Sea Salt Spray* – plážová textura, objem, hrubší finish.\n• *Tepelný sprej* – ochrana do 230°C.\n\n**JAK VYBRAT:**\n- Krátké vlasy + mat → Hlína nebo Fiber\n- Střední délka + objem → Grooming Tonic + Hlína\n- Dlouhé vlasy + lesk → Olejová pomáda\n- Jemné vlasy → Pudr nebo Mousse'
    },
    {
      id: 'coloring',
      keywords: ['barvení','barv','obarvit','melír','melírovat','highlights','bleyach','bleach','odbarvit','odbarvení','toning','tónovací','toner','šediny','šedivění','šediví','barva vlasů','šedivé vlasy','šedé vlasy','barvit vlasy','barvení doma','salon barvení','permanentní barva','semi-permanent','demi-permanent','oxidační barva','henna','přírodnímé barvení'],
      title: 'Barvení vlasů – profesionální průvodce',
      intro: 'Barvení je věda i umění. Tady jsou informace, které barber chce, abyste věděli:',
      text: '**TYPY BARVENÍ:**\n• **Permanentní barva** – otevírá kutikulu, mění přirozený pigment. Vydrží 4–8 týdnů. Vyžaduje pravidelné přebarvování odrostů.\n• **Semi-permanentní** – obarvuje bez otevírání kutikuly. Vydrží 4–6 týdnů, postupně se vyplachuje. Ideální pro první barevný experiment.\n• **Tónovací krémy a toners** – neutralizují nežádoucí tóny (žluté po blednutí, mosazné odrosty). Fialový šampon = toner pro blond.\n• **Henna a přírodní barviva** – bez peroxidu. Bezpečné, ale omezená paleta barev a komplikace při dalším barvení.\n\n**PÉČE PO BARVENÍ:**\n• Použij **šampon pro barvené vlasy** (bez SLS/SLES) – zachová barvu déle.\n• **Fialový šampon** pro blond a šedivé – 1x týdně neutralizuje žluté tóny.\n• **Vyhni se horké vodě** – vymývá pigment.\n• Hloubková maska 1x týdně – barvení poškozuje strukturu vlasu.\n• **Tepelná ochrana** je povinná – zbarvené vlasy jsou citlivější.\n\n**VAROVÁNÍ:** Domácí barvení může skončit katastrofálně. Bleach (peroxid + prášek) je agresivní chemikálie. Na světlení VŽDY k profesionálovi.'
    },
    {
      id: 'scalp_care',
      keywords: ['pokožka','skalp','pokožky hlavy','vlasová pokožka','kůže hlavy','pores','póry','mastná pokožka','mastný skalp','suchá pokožka','suchý skalp','kůže vlasová','péče pokožky','scalp care','exfoliant','peeling','skalpový peeling','masáž hlavy','head massage','skalp masáž'],
      title: 'Péče o skalp (pokožku hlavy)',
      intro: 'Skalp je půda, ze které rostou vlasy. Tady je jak ji správně pečovat:',
      text: '**PROČ JE SKALP DŮLEŽITÝ?**\nVlasový folikul je obklopen kapilárami – krevními cévkami. Čím lepší prokrvení, tím rychlejší a zdravější růst. Zanedbaný skalp = ucpané folikuly = pomalý růst nebo vypadávání.\n\n**RUTINA PÉČE O SKALP:**\n1. **Peeling skalpu (1–2x měsíčně)** – fyzický (hrubší částice) nebo chemický (salicylová kyselina). Odstraní mrtvé buňky a uvolní folikuly.\n2. **Skalpové sérum nebo tonikum** – nanášej přímo na skalp, masíruj. Hledej: Kofein, Rozmarýn, Niacin.\n3. **Masáž skalpu 5–10 min denně** – vědecky prokázáno, že zvyšuje hustotu vlasů za 24 týdnů. Dělej to pod sprvchou nebo speciálním masážním přístrojem.\n4. **Nepřehřívat** – horká voda, fénovanie přímo na skalp z blízka = zánět.\n5. **Vyvážené pH** – zdravý skalp má pH 4,5–5,5. Agresivní produkty narušují tuto rovnováhu.\n\n**MASTNÝ SKALP:** Vyhni se kondicionéru na kořínky. Zkus Dry Shampoo pouze občas. Hledej šampony regulující sebum (salicylová kyselina, zinok).\n\n**SUCHÝ SKALP:** Více hydratace – kokosový olej nanesený 30 min před mytím, hydratační sérum.'
    },
    {
      id: 'tools',
      keywords: ['nůžky','hřeben','kartáč','strojek','zastrihávač','trimmer','nástroje','clipper','clippers','razor','břitva','foliot','fén','foukač','žehlička','kulma','tepelné nástroje','holicí strojek','razor','electric razor','profesionální nůžky','barberské nůžky','thinning scissors','texturizační','barberský'],
      title: 'Barberské nástroje – jak vybírat a pečovat',
      intro: 'Dobrý barber zná každý nástroj. Tady je průvodce výbavou:',
      text: '**ZÁKLADNÍ VÝBAVA BARBERA:**\n\n• **Strojek (Clipper)** – Wahl, Andis, Oster, BaByliss. Pro fade je klíčový strojek s pevným vedením (zero gap po seřízení).\n• **Trimmer (Konturovač)** – pro detailní práci, čáry, kontury vousů. T-blade výhodou pro přesnost.\n• **Břitva (Safety Razor / Straight Razor)** – pro ostré linky, holení krku, clean up.\n• **Nůžky** – profesionální japonská ocel (Kamisori, Jaguar, Matsui). Délka 5,5–6,5 palce záleží na stylu.\n• **Texturizační nůžky** – odstraní objem bez délky, vytvoří přirozené přechody.\n• **Hřeben** – uhlíkový hřeben (antistatický), pro fade práci se používá "barber comb" s jemnou a hrubou stranou.\n\n**PÉČE O NÁSTROJE:**\n• Čisti strojek po každém zákazníkovi\n• Namazat ořídlové čepele olejem po každém použití\n• Střihat nůžky 1x za 6–12 měsíců\n• Dezinfekovat sprej (Barbicide, Isopropanol 70%)\n\n**FÉN A TEPELNÉ NÁSTROJE:**\n• Profesionální fén = alespoň 2000W, ionic technologie (méně poškozuje)\n• Žehlička – keramická nebo titanová plotýnka, nastavitelná teplota\n• Vždy tepelná ochrana do 230°C!'
    },
    {
      id: 'mmbarber_info',
      keywords: ['mmbarber','mm barber','barbershop','salon','kde','kdy','otevírací','otevřeno','zavřeno','hodiny','rezervace','objednat','objednání','cena','ceník','kolik stojí','kde se nacházíte','adresa','kontakt','telefon','email','soc siete','instagram','facebook','sociální sítě','ordinace','kdy máte volno','kdy přijít','čas'],
      title: 'MMBarber – Informace a rezervace',
      intro: 'Tady jsou základní informace o MMBarber:',
      text: '**MMBarber Barbershop**\nProfesionální barbershop v srdci Uherského Hradiště.\n\n**ADRESA:** Sadová 1383, 686 05 Uherské Hradiště\n\n**REZERVACE:** Online rezervace přes náš systém přímo na tomto webu – sekce "Operativa". Nebo nás kontaktujte přes sociální sítě.\n\n**CO NABÍZÍME:**\n• Pánský střih + fade\n• Péče o vousy a holení\n• Keratinová procedura\n• Dětský střih\n• Speciální styling\n\n**KONTAKT & SOCIÁLNÍ SÍTĚ:** Mrkni do sekce "Kontakt" nebo nás najdi na Instagramu a Facebooku – @mmbarber\n\n**MISE:** Nejsme jen barbershop. Je to náš svět, do kterého tě zveme. Nepracujeme s kvantitou – záleží nám na každém zákazníkovi.'
    },
    {
      id: 'collaboration',
      keywords: ['spolupráce','spolupracovat','partner','partnerství','kolaborace','sponzor','sponzorování','business','byznys','reklama','reklamu','propagace','propagovat','obchodní','smlouva','deal','projekt','partnerství','kumpáni','kumpán'],
      title: 'Spolupráce a Partnerství (Kumpáni)',
      intro: 'Zajímá tě spolupráce s MMBarber? Tady jsou informace:',
      text: 'MMBarber si své **kumpány** pečlivě vybírá. Nehledáme jen sponzoring, hledáme **dlouhodobou vizi a stejný přístup ke kvalitě a řemeslu.** Ať už jde o gastro, kulturu, hudbu, charitu nebo služby.\n\n**Co hledáme v partnerech:**\n• Stejné hodnoty – kvalita, autenticita, loajalita\n• Zajímavý projekt nebo produkt, který má smysl\n• Zájem o dlouhodobou spolupráci, ne jednorázovou akci\n\n**Jak spolupráce může vypadat:**\n• Cross-promotion na sociálních sítích\n• Física přítomnost loga v salonu\n• Společné eventy nebo akce\n• Zvýhodněné podmínky pro zaměstnance partnera\n\n**Máš zajímavý projekt?** Ozvi se nám přes **kontaktní formulář** na hlavní stránce nebo na naše sociální sítě. Mrklni se také na sekci **"Naši Kumpáni"**, abys viděl, s kým už táhneme za jeden provaz.'
    },
    {
      id: 'website',
      keywords: ['web','webová stránka','stránka','cena webu','kolik stál web','kolik stojí web','web cena','kolik stálo','webdesign','design webu','kdo dělal web','kdy vznikl web','kdy jste spustili web','odkdy máte web','jak vznikl web','stránky','nová stránka','web mmbarber','funkce webu','tvůrce','programátor','kdo programoval','grafika','prvky'],
      title: 'MMBarber – Unikátní Webový Ekosystém',
      intro: 'Tohle není obyčejná stránka z WordPress šablony. Tady je pravda o tom, jak náš web vznikl a kolik by stál:',
      text: '**Kdo web vytvořil?**\nCelý tento web kompletně navrhl a naprogramoval zakladatel/majitel barbershopu ve svém volném čase (s vývojem se začalo v březnu 2026). Nejedná se o žádnou agenturní práci, je to 100% in-house projekt dělaný srdcem a posedlostí detailem.\n\n**Kolik by takový web reálně stál na zakázku?**\nKdyby si barbershop nechal tuhle aplikaci vyvinout na klíč od profesionální IT firmy (včetně všech unikátních prvků a grafiky), nacenění by vypadalo zhruba takto:\n\n• **Core Systém a Architektura (Next.js, React)**: ~250 000 Kč\n• **Vlastní Grafika & UI/UX (Glassmorphism, custom CSS, vizuální identita)**: ~150 000 Kč\n• **Umělá Inteligence (Barber Bot s NLP analyzátorem a databází)**: ~200 000 Kč\n• **Unikátní Interaktivní Prvky (GTA HUD zbraní, Gyroskopický Kompas, složení kosmetiky)**: ~200 000 Kč\n• **Komplexní Eventový Systém (Blood Mode, Slovácko, C.N.Y. s částicemi a 3D efekty)**: ~300 000 Kč\n• **Mobilní vs PC Architektura (výkonnostní vrstvy, gesta a animace)**: ~150 000 Kč\n• **API Integrace (Rezervační systém) & Optimalizace**: ~100 000 Kč\n\n**Celková reálná hodnota webu:**\nPři souvislém vývoji od března 2026, s veškerou grafikou a programováním všech těchto unikátních komponent, se reálná tržní hodnota tohoto webu pohybuje **mezi 1 200 000 Kč až 1 500 000 Kč**.\n\nPokud se chceš dozvědět víc o tom, jak byl web vytvořen, nebo máš zájem o spolupráci na digitálních projektech, zeptej se přímo u nás v salonu!'
    },
  ] : [
    {
      id: 'food_hair',
      keywords: ['food','eat','eating','diet','nutrition','supplements','vitamin','mineral','biotin','what to eat','hair food','hair diet','hair growth food','healthy eating','meal','meals'],
      title: 'Diet & Nutrition for Healthy Hair',
      intro: 'Hair directly reflects what you eat. Here is the expert overview:',
      text: 'Hair grows about **1–1.5 cm per month** and is made of 90% protein keratin – without enough protein, growth stops. \n\n**SUPER FOODS FOR HAIR:**\n• **Eggs** – royal source of Biotin (B7) and complete proteins. Biotin clinically proven to support keratin synthesis.\n• **Fatty fish (salmon, mackerel)** – Omega-3 fatty acids nourish follicles from inside, dramatically improve shine and density.\n• **Red meat & poultry** – Iron and Zinc. Deficiency of these minerals is a leading cause of hair loss.\n• **Nuts and seeds** – Selenium, Vitamin E, Zinc. Antioxidants protect follicles from free radical damage.\n• **Spinach, broccoli, kale** – Iron, folate, beta-carotene. Iron deficiency causes telogen effluvium – massive hair shedding.\n• **Avocado** – Vitamin E and healthy fats. Protects scalp cells from oxidative stress.\n\n**WHAT HARMS HAIR:**\n• Excess **sugar** – causes glycation of proteins, damaging keratin from inside.\n• **Alcohol** – dehydrates body and reduces absorption of zinc and folate.\n• **Crash diets** – dramatic caloric deficit = anagen effluvium (hair stops forming).\n\n**SUPPLEMENTS TO CONSIDER:** Biotin 5000 mcg/day, Iron (consult doctor), Vitamin D3, Omega-3 capsules, Hydrolyzed Collagen.'
    },
    {
      id: 'hairloss',
      keywords: ['hair loss','losing hair','thinning','bald','baldness','alopecia','falling out','shedding','receding','receding hairline'],
      title: 'Hair Loss – Causes and Solutions',
      intro: 'Hair loss is complex. Here is what science says:',
      text: '**Normal is losing 50–100 hairs per day.** If more, it is time to act.\n\n**MAIN CAUSES:**\n• **Androgenic alopecia (hereditary)** – most common in men, caused by DHT destroying follicles. Treat with Minoxidil or Finasteride.\n• **Telogen effluvium** – stress, illness, surgery, childbirth or extreme diet cause massive shedding 2–3 months after event. Usually temporary.\n• **Nutrient deficiency** – Iron, Zinc, Biotin, Vitamin D, Protein.\n• **Thyroid issues** – both hypo and hyper thyroidism cause shedding.\n\n**WHAT ACTUALLY WORKS:**\n• **Minoxidil 5%** – clinically proven, stimulates blood flow to follicles. Results visible after 4–6 months.\n• **Rosemary oil** – 2023 study showed equal efficacy to 2% Minoxidil with regular scalp application.\n• **Caffeine shampoo** – penetrates follicle and locally blocks DHT.\n• **Dermaroller (microneedling)** – 0.5mm needles activate stem cells in follicles.\n• **Scalp massage 10 min/day** – scientifically proven to support hair density.'
    },
    {
      id: 'dandruff',
      keywords: ['dandruff','flakes','itchy','itching','seborrhea','scalp flaking','seborrheic'],
      title: 'Dandruff and Scalp Itching',
      intro: 'Dandruff is a medical issue, not just cosmetic. Here is the expert treatment:',
      text: '**Dandruff is most commonly caused by** *Malassezia globosa* yeast that naturally lives on skin. In susceptible people, it causes inflammation and accelerated skin shedding.\n\n**TREATMENT:**\n• **Zinc Pyrithione (ZPT) shampoos** – kill the yeast. Brands: Head & Shoulders Pro, Ducray.\n• **Ketoconazole 2%** – antifungal medication. Nizoral shampoo, use 2x/week, leave 5 min.\n• **Selenium sulfide** – strong antifungal, available OTC.\n• **Salicylic acid** – removes scale buildup and lets active ingredients penetrate skin.\n• **Tea Tree oil 5%** – natural antifungal.\n\n**KEY TIPS:**\n• Leave shampoo on scalp **minimum 3–5 minutes**.\n• Avoid hot water – worsens inflammation.\n• Dry hair thoroughly – damp environment promotes yeast growth.\n• Avoid SLS sulfates that irritate scalp.'
    },
  ];

  const findBestAnswer = (input: string) => {
    const lower = input.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;
    for (const entry of knowledgeBase) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (lower.includes(kw)) {
          score += kw.length; // longer keyword = more specific = higher score
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }
    return bestScore > 0 ? bestMatch : null;
  };

  const analyze = () => {
    if (!input.trim()) return;
    const lowerInput = input.toLowerCase();
    const currentUserInput = input;
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: currentUserInput }];

    // Speciální dynamický výpočet ceny webu
    if (lowerInput.includes('cena webu') || lowerInput.includes('kolik stál web') || lowerInput.includes('kolik stojí web') || lowerInput.includes('web cena')) {
      const startDate = new Date('2026-03-01T00:00:00');
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Základní cena za unikátní moduly
      const basePrice = 1350000; // 1.35M za core, AI, GTA HUD, 3D eventy
      
      // Přičítáme udržovací a rozvojovou sazbu za každý den od začátku (cca 1000 Kč denně)
      const dynamicPrice = basePrice + (diffDays * 1250); 
      const formattedPrice = dynamicPrice.toLocaleString('cs-CZ');

      newMessages.push({
        role: 'bot',
        content: lang === 'cs' ? 'Tady je přesná kalkulace naší digitální platformy:' : 'Here is the exact calculation of our digital platform:',
        recommendation: {
          title: 'MMBarber – Unikátní Webový Ekosystém',
          text: `**Kdo web vytvořil?**\nCelý tento web kompletně navrhl a naprogramoval zakladatel/majitel barbershopu ve svém volném čase (s vývojem se začalo v březnu 2026). Je to 100% in-house projekt dělaný srdcem.\n\n**Kolik by takový web reálně stál na zakázku?**\nKdyby si barbershop nechal tuhle aplikaci vyvinout na klíč od profesionální IT firmy, nacenění by se počítalo dynamicky podle rozsahu:\n\n• **Core Systém a Architektura**: ~250 000 Kč\n• **Vlastní Grafika & UI/UX**: ~150 000 Kč\n• **Umělá Inteligence (Barber Bot)**: ~200 000 Kč\n• **Interaktivní Prvky (GTA HUD, Gyroskop)**: ~200 000 Kč\n• **Komplexní Eventový Systém (3D částice)**: ~300 000 Kč\n• **Mobilní Architektura**: ~150 000 Kč\n• **API & Rezervace**: ~100 000 Kč\n\n**Algoritmický výpočet tržní hodnoty (Live):**\nOd začátku vývoje uběhlo přesně **${diffDays} dní**. S každodenním vývojem a optimalizací se k dnešnímu dni reálná tržní hodnota tohoto webu pohybuje na částce:\n\n### **${formattedPrice} Kč**\n\nPokud se chceš dozvědět víc o vývoji nebo navázat spolupráci, zeptej se přímo u nás v salonu!`
        }
      });
      setMessages(newMessages);
      return;
    }

    // 1. Try NLP knowledge base first
    const kbMatch = findBestAnswer(lowerInput);
    if (kbMatch && kbMatch.id !== 'website') { // Skip website here since we handled it dynamically
      newMessages.push({
        role: 'bot',
        content: kbMatch.intro,
        recommendation: { title: kbMatch.title, text: kbMatch.text }
      });
      setMessages(newMessages);
      return;
    }

    // 2. Fall back to ingredient database scan
    const toxicFound: any[] = [];
    const goodFound: any[] = [];
    const infoFound: any[] = [];
    const foodFound: any[] = [];
    for (const item of ingredientDb) {
      for (const name of item.names) {
        if (lowerInput.includes(name)) {
          if (item.type === 'toxic') toxicFound.push(item);
          else if (item.type === 'good') goodFound.push(item);
          else if (item.type === 'food') foodFound.push(item);
          else infoFound.push(item);
          break;
        }
      }
    }

    if (toxicFound.length > 0 || goodFound.length > 0 || infoFound.length > 0 || foodFound.length > 0) {
      newMessages.push({
        role: 'bot',
        content: lang === 'cs' ? 'Tady je moje detailní analýza zadaného složení/stravy:' : 'Here is my detailed analysis:',
        analysis: { toxic: toxicFound, good: goodFound, info: infoFound, food: foodFound }
      });
    } else {
      const daimonReply = getDaimonResponse(currentUserInput, 0, lang);
      newMessages.push({
        role: 'bot',
        content: daimonReply.text
      });
    }

    setMessages(newMessages);
  };

  return (
    <div className="w-full flex flex-col pb-10 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-mafia-gold/20">
       <div className="mb-6 md:mb-10">
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
          <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
       </div>
       <p className="text-smoke-white/70 text-sm md:text-base max-w-4xl mb-6 italic leading-relaxed">
          {page.content}
       </p>
       
       {/* Chat History */}
       <div className="flex flex-col gap-6 mb-6">
         {messages.map((msg, idx) => (
           <div key={idx} className={`p-4 md:p-6 w-full max-w-4xl rounded-2xl flex flex-col ${msg.role === 'user' ? 'bg-mafia-gold/10 border border-mafia-gold/20 self-end ml-auto' : 'bg-white/[0.02] border border-white/10 self-start'}`}>
             <div className="flex items-center gap-2 mb-3">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${msg.role === 'user' ? 'bg-mafia-gold text-black' : 'bg-black border border-white/20 text-white'}`}>
                 {msg.role === 'user' ? 'TY' : 'BOT'}
               </div>
               <span className={`text-xs font-mono uppercase tracking-widest ${msg.role === 'user' ? 'text-mafia-gold' : 'text-smoke-white/50'}`}>
                 {msg.role === 'user' ? 'Zákazník' : `${getDaimonName()} AI System`}
               </span>
             </div>
             
             <div className="text-sm md:text-base text-smoke-white whitespace-pre-wrap">{msg.content}</div>

             {/* Zobrazení Analýzy v rámci BOT zprávy */}
             {msg.analysis && (
               <div className="mt-6 flex flex-col gap-8 w-full">
                 
                 {/* Toxické složky */}
                 {msg.analysis.toxic.length > 0 && (
                   <div className="flex flex-col gap-4">
                     <div className="p-3 bg-mafia-red/20 border-l-4 border-mafia-red text-mafia-red text-xs md:text-sm font-bold uppercase">
                       {lang === 'cs' ? `Varování! Nalezeno ${msg.analysis.toxic.length} rizikových složek.` : `Warning! Found ${msg.analysis.toxic.length} risk ingredients.`}
                     </div>
                     {msg.analysis.toxic.map((r: any, i: number) => (
                       <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border border-mafia-red/20 bg-mafia-red/5 rounded-lg">
                         <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-mafia-red/10 border border-mafia-red/50 text-mafia-red font-bold font-mono text-sm md:text-base">
                           {r.severity}/10
                         </div>
                         <div className="flex flex-col justify-center">
                           <span className="text-mafia-red font-bold uppercase font-heading text-sm md:text-base">{r.names[0]}</span>
                           <span className="text-smoke-white/80 text-xs md:text-sm mt-1">{r.reason}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}

                 {/* Prospěšné složky */}
                 {msg.analysis.good.length > 0 && (
                   <div className="flex flex-col gap-4">
                     <div className="p-3 bg-green-500/10 border-l-4 border-green-500 text-green-400 text-xs md:text-sm font-bold uppercase mt-2">
                       {lang === 'cs' ? `Nalezeno ${msg.analysis.good.length} prospěšných a vyživujících složek!` : `Found ${msg.analysis.good.length} beneficial ingredients!`}
                     </div>
                     {msg.analysis.good.map((r: any, i: number) => (
                       <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border border-green-500/20 bg-green-500/5 rounded-lg">
                         <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-500/10 border border-green-500/50 text-green-400 font-bold font-mono text-lg md:text-xl">
                           🌿
                         </div>
                         <div className="flex flex-col justify-center">
                           <span className="text-green-400 font-bold uppercase font-heading text-sm md:text-base">{r.names[0]}</span>
                           <span className="text-smoke-white/80 text-xs md:text-sm mt-1">{r.reason}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}

                 {/* Informační složky (Styling / Zajímavosti) */}
                 {msg.analysis.info.length > 0 && (
                   <div className="flex flex-col gap-4">
                     <div className="p-3 bg-blue-500/10 border-l-4 border-blue-500 text-blue-400 text-xs md:text-sm font-bold uppercase mt-2">
                       {lang === 'cs' ? `Zajímavosti a Styling (${msg.analysis.info.length})` : `Styling & Info (${msg.analysis.info.length})`}
                     </div>
                     {msg.analysis.info.map((r: any, i: number) => (
                       <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border border-blue-500/20 bg-blue-500/5 rounded-lg">
                         <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-500/10 border border-blue-500/50 text-blue-400 font-bold font-mono text-lg md:text-xl">
                           💡
                         </div>
                         <div className="flex flex-col justify-center">
                           <span className="text-blue-400 font-bold uppercase font-heading text-sm md:text-base">{r.names[0]}</span>
                           <span className="text-smoke-white/80 text-xs md:text-sm mt-1">{r.reason}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}

                 {/* Jídlo a Strava */}
                 {msg.analysis.food && msg.analysis.food.length > 0 && (
                   <div className="flex flex-col gap-4">
                     <div className="p-3 bg-orange-500/10 border-l-4 border-orange-500 text-orange-400 text-xs md:text-sm font-bold uppercase mt-2">
                       {lang === 'cs' ? `Strava a Tělo (${msg.analysis.food.length})` : `Diet & Body (${msg.analysis.food.length})`}
                     </div>
                     {msg.analysis.food.map((r: any, i: number) => (
                       <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border border-orange-500/20 bg-orange-500/5 rounded-lg">
                         <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-orange-500/10 border border-orange-500/50 text-orange-400 font-bold font-mono text-lg md:text-xl">
                           🥩
                         </div>
                         <div className="flex flex-col justify-center">
                           <span className="text-orange-400 font-bold uppercase font-heading text-sm md:text-base">{r.names[0]}</span>
                           <span className="text-smoke-white/80 text-xs md:text-sm mt-1">{r.reason}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}

               </div>
             )}

             {/* Zobrazení Doporučení v rámci BOT zprávy */}
             {msg.recommendation && (
               <div className="mt-6 flex flex-col w-full">
                 <div className="p-4 md:p-6 bg-mafia-gold/10 border-l-4 border-mafia-gold rounded-r-xl">
                   <h4 className="text-mafia-gold font-heading font-bold text-lg md:text-xl uppercase mb-3 flex items-center gap-2">
                     <span className="text-2xl">📋</span> {msg.recommendation.title}
                   </h4>
                   <p className="text-smoke-white text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                     {msg.recommendation.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part)}
                   </p>
                 </div>
               </div>
             )}
           </div>

         ))}
       </div>

       {/* Diagnostic Quick Tags */}
       <div className="w-full flex flex-wrap gap-2 md:gap-3 mb-4 sticky bottom-[104px] z-20">
         {lang === 'cs' ? (
           <>
             <button onClick={() => setInput('Co mám jíst pro zdravé vlasy?')} className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/30 border border-orange-500/30 hover:border-orange-500 rounded-full text-xs md:text-sm text-orange-400 font-bold transition-all">🥩 Vliv stravy na vlasy</button>
             <button onClick={() => setInput('Jak funguje spolupráce a partnerství?')} className="px-4 py-2 bg-mafia-gold/10 hover:bg-mafia-gold/30 border border-mafia-gold/30 hover:border-mafia-gold rounded-full text-xs md:text-sm text-mafia-gold font-bold transition-all">🤝 Spolupráce</button>
             <button onClick={() => setInput('Lupy a svědění hlavy')} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/50 rounded-full text-xs md:text-sm text-smoke-white transition-all">Lupy a svědění</button>
             <button onClick={() => setInput('Řídnutí a padání vlasů')} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/50 rounded-full text-xs md:text-sm text-smoke-white transition-all">Řídnutí vlasů</button>
           </>
         ) : (
           <>
             <button onClick={() => setInput('What should I eat for healthy hair?')} className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/30 border border-orange-500/30 hover:border-orange-500 rounded-full text-xs md:text-sm text-orange-400 font-bold transition-all">🥩 Diet & Hair</button>
             <button onClick={() => setInput('How does collaboration work?')} className="px-4 py-2 bg-mafia-gold/10 hover:bg-mafia-gold/30 border border-mafia-gold/30 hover:border-mafia-gold rounded-full text-xs md:text-sm text-mafia-gold font-bold transition-all">🤝 Collaboration</button>
             <button onClick={() => setInput('Dandruff and itching')} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/50 rounded-full text-xs md:text-sm text-smoke-white transition-all">Dandruff</button>
             <button onClick={() => setInput('Thinning hair loss')} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/50 rounded-full text-xs md:text-sm text-smoke-white transition-all">Thinning Hair</button>
           </>
         )}
       </div>

       {/* Chat Input */}
       <div className="w-full flex flex-col md:flex-row gap-4 sticky bottom-0 bg-[#0a0a0a] pt-4 pb-4 border-t border-white/10 z-10 mt-auto">
         <textarea 
           value={input}
           onChange={(e) => setInput(e.target.value)}
           onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); analyze(); } }}
           placeholder={lang === 'cs' ? 'Napiš složení, problém s vlasy, nebo jakékoliv jídlo (vejce, maso, cukr)...' : 'Type ingredients, hair problems, or food...'}
           className="w-full h-16 bg-white/5 border border-white/20 p-4 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-mafia-gold resize-none"
         />
         <button onClick={analyze} className="h-16 bg-mafia-gold text-black font-heading font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-all w-full md:w-48 text-sm">
           {lang === 'cs' ? 'Odeslat' : 'Send'}
         </button>
       </div>
    </div>
  );
}

export default function CareMagazinePage() {
  const { lang } = useTranslation();
  const MAGAZINE_PAGES = lang === 'en' ? MAGAZINE_EN : MAGAZINE_CS;
  const SEASONAL_CONTENT = lang === 'en' ? SEASONAL_EN : SEASONAL_CS;
  const t_mag = (translations as any)[lang]?.magazine || translations.cs.magazine;

  const [currentPage, setCurrentPage] = useState(0);
  const [season, setSeason] = useState<'winter' | 'spring' | 'summer' | 'autumn'>('spring');
  const [testAnswers, setTestAnswers] = useState<number[]>([]);
  const [currentSelections, setCurrentSelections] = useState<number[]>([]);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    setTestAnswers([]);
    setCurrentSelections([]);
    setTestResult(null);
  }, [currentPage]);

  useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month === 12 || month <= 2) setSeason('winter');
    else if (month >= 3 && month <= 5) setSeason('spring');
    else if (month >= 6 && month <= 8) setSeason('summer');
    else setSeason('autumn');
  }, []);

  const nextPage = () => {
    if (currentPage < MAGAZINE_PAGES.length - 1) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const handleTestAnswer = (val: number) => {
    setCurrentSelections(prev => 
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  };


  // Improved navigation and evaluation
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    setQuestionIndex(0);
  }, [currentPage]);

  const handleNextQuestion = () => {
    if (currentSelections.length === 0) return;
    
    const newAnswers = [...testAnswers, ...currentSelections];
    const nextIndex = questionIndex + 1;
    const page = MAGAZINE_PAGES[currentPage] as any;
    
    if (nextIndex >= page.questions.length) {
      const pageType = page.type;
      const uniqueWinners = Array.from(new Set(newAnswers));
      const resultKeys: string[] = [];

      if (pageType === 'alter-ego') {
        const counts: any = {};
        newAnswers.forEach(val => { counts[val] = (counts[val] || 0) + 1; });
        const winner = Number(Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b));
        
        if (winner === 1) resultKeys.push('boss');
        else if (winner === 2) resultKeys.push('gangster');
        else if (winner === 3) resultKeys.push('outsider');
        else resultKeys.push('gentleman');
      } else {
        uniqueWinners.forEach(winner => {
          if (pageType === 'test') {
            if (winner === 1) resultKeys.push('borealis');
            else if (winner === 2) resultKeys.push('meridionalis');
            else resultKeys.push('orientalis');
          } 
          else if (pageType === 'test-hair') {
            if (winner === 1) resultKeys.push('low-porosity');
            else if (winner === 2) resultKeys.push('medium-porosity');
            else resultKeys.push('high-porosity');
          }
          else if (pageType === 'test-scalp') {
            if (winner === 1) resultKeys.push('dry');
            else if (winner === 2) resultKeys.push('oily');
            else resultKeys.push('problematic');
          }
          else if (pageType === 'test-trichology') {
            if (winner === 1) resultKeys.push('stable');
            else if (winner === 2) resultKeys.push('warning');
            else resultKeys.push('critical');
          }
          else if (pageType === 'test-herbs') {
            if (winner === 1) resultKeys.push('growth');
            else if (winner === 2) resultKeys.push('pigment');
            else resultKeys.push('soothing');
          }
          else if (pageType === 'test-styling') {
            if (winner === 1) resultKeys.push('pomade');
            else if (winner === 2) resultKeys.push('paste');
            else resultKeys.push('salt-powder');
          }
          else if (pageType === 'test-haircut') {
            if (winner === 1) resultKeys.push('buzz-crop');
            else if (winner === 2) resultKeys.push('textured-flow');
            else resultKeys.push('classic-pompadour');
          }
        });
      }
      
      setTestResult(resultKeys.join(','));
      setTestAnswers(newAnswers);
    } else {
      setTestAnswers(newAnswers);
      setQuestionIndex(nextIndex);
      setCurrentSelections([]);
    }
  };

  const resetTest = () => {
    setTestAnswers([]);
    setCurrentSelections([]);
    setQuestionIndex(0);
    setTestResult(null);
  };

  return (
    <main className="min-h-screen bg-black text-white relative flex flex-col selection:bg-mafia-gold selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 z-0 bg-black">
        <StarField />
        <DNAHelix />
      </div>

      <div className="relative flex flex-col flex-1">
        {/* Navigation Sidebar Track */}
        <div className="absolute inset-y-0 left-0 w-80 pointer-events-none z-50 hidden xl:block"
             style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}>
          <div className="sticky top-0 h-screen flex flex-col justify-center pointer-events-auto pl-8 gap-8 translate-y-8">
            <div className="h-12 w-px bg-mafia-gold/20 mx-auto mb-2"></div>
            {Object.entries(MAGAZINE_PAGES.reduce((acc, page: any, i: number) => {
               if (!acc[page.category]) acc[page.category] = [];
               acc[page.category].push({ ...page, index: i });
               return acc;
            }, {} as Record<string, any[]>)).map(([category, pages]: [string, any[]]) => (
               <div key={category} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-1">
                     <div className="w-1.5 h-1.5 bg-mafia-gold rotate-45 shadow-[0_0_5px_rgba(var(--color-mafia-gold-rgb),0.3)]"></div>
                     <span className="font-mono text-[11px] text-mafia-gold/60 uppercase tracking-[0.4em] font-black">
                       {category}
                     </span>
                  </div>
                  <div className="flex flex-col gap-3 pl-4 border-l border-white/10">
                     {pages.map((page: any) => (
                       <button 
                         key={page.index}
                         onClick={() => setCurrentPage(page.index)}
                         className={`group flex items-center gap-4 transition-all duration-500 ${page.index === currentPage ? 'text-mafia-gold' : 'text-white/30 hover:text-white/70'}`}
                       >
                          <div className={`w-2 h-2 rotate-45 transition-all duration-500 ${page.index === currentPage ? 'bg-mafia-gold scale-150 shadow-[0_0_12px_rgba(var(--color-mafia-gold-rgb),0.9)]' : 'bg-white/10 group-hover:bg-white/30'}`}></div>
                          <span className={`font-mono text-[10px] uppercase tracking-[0.25em] transition-all duration-500 origin-left whitespace-nowrap ${page.index === currentPage ? 'opacity-100 translate-x-1 font-bold' : 'opacity-50 group-hover:opacity-100'}`}>
                            {page.shortTitle}
                          </span>
                       </button>
                     ))}
                  </div>
               </div>
            ))}
            <div className="h-12 w-px bg-mafia-gold/20 mx-auto mt-2"></div>
          </div>
        </div>

        {/* Mobile Navigation Header */}
        <div className="xl:hidden border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-24 z-[90] overflow-x-auto no-scrollbar scroll-smooth">
           <div className="flex px-4 py-3 gap-6 whitespace-nowrap min-w-max">
              {MAGAZINE_PAGES.map((page: any, i: number) => (
                <button 
                  key={i}
                  onClick={() => {
                    setCurrentPage(i);
                    // Scroll into view
                    const el = document.getElementById(`mob-nav-${i}`);
                    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                  }}
                  id={`mob-nav-${i}`}
                  className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${i === currentPage ? 'text-mafia-gold' : 'text-white/30'}`}
                >
                   <div className={`w-1.5 h-1.5 rotate-45 transition-all duration-500 ${i === currentPage ? 'bg-mafia-gold scale-125 shadow-[0_0_8px_rgba(var(--color-mafia-gold-rgb),0.8)]' : 'bg-white/10'}`}></div>
                   <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
                     {page.shortTitle}
                   </span>
                </button>
              ))}
           </div>
        </div>

        {/* Header */}
        <div className="sticky top-0 z-[110] h-24 flex items-center justify-between px-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
           <Link href="/" className="group flex items-center gap-3 text-mafia-gold noir-mode:text-mafia-silver theme-blood:text-mafia-red hover:text-white transition-all duration-500">
              <div className="w-10 h-10 rounded-full border border-mafia-gold/20 noir-mode:border-mafia-silver/20 theme-blood:border-mafia-red/20 flex items-center justify-center group-hover:border-mafia-gold noir-mode:group-hover:border-mafia-silver theme-blood:group-hover:border-mafia-red group-hover:bg-mafia-gold noir-mode:group-hover:bg-mafia-silver theme-blood:group-hover:bg-mafia-red group-hover:text-black transition-all duration-500">
                 <ArrowLeft size={18} />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">{t_mag.ui.backToSalon}</span>
           </Link>
           <div className="flex flex-col items-end">
              <span className="font-heading font-black text-xl italic tracking-tighter text-white logo-neon">MMBARBER</span>
              <span className="text-[8px] font-mono text-mafia-gold/50 noir-mode:text-mafia-silver/50 theme-blood:text-mafia-red/50 tracking-[0.5em] uppercase">{t_mag.ui.title?.replace(' ', '_')}_v3.5.0</span>
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center relative p-3 md:p-12 mt-4 md:mt-16 z-10">
           <div className="max-w-6xl w-full h-[75vh] md:h-[80vh] relative">
              <AnimatePresence mode="wait">
                 <motion.div
                   key={currentPage}
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 1.02 }}
                   transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                   className="w-full h-full bg-[#0c0c0c] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative"
                 >
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="flex-1 p-6 md:p-20 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-mafia-gold/20">
                      {renderPageContent(MAGAZINE_PAGES[currentPage], season, { handleTestAnswer, handleNextQuestion, currentSelections, questionIndex, testAnswers, testResult, resetTest, lang }, t_mag, SEASONAL_CONTENT)}
                    </div>
                    <div className="absolute bottom-4 right-4 font-mono text-[9px] text-mafia-gold/30 uppercase tracking-widest">
                       {t_mag.ui.page} {currentPage + 1} / {MAGAZINE_PAGES.length}
                    </div>
                 </motion.div>
              </AnimatePresence>

              <div className="absolute -bottom-16 md:-bottom-20 left-0 w-full flex items-center justify-center gap-4 md:gap-8 px-4">
                 <button 
                   onClick={prevPage}
                   disabled={currentPage === 0}
                   className={`p-3 md:p-4 rounded-full border border-mafia-gold/20 transition-all ${currentPage === 0 ? 'opacity-10 cursor-not-allowed' : 'hover:bg-mafia-gold hover:text-black hover:border-mafia-gold active:scale-90'}`}
                 >
                  <ChevronLeft size={20} />
                 </button>
                 <div className="flex-1 max-w-[200px] flex gap-1 md:gap-2">
                    {MAGAZINE_PAGES.map((_: any, i: number) => (
                      <div 
                        key={i} 
                        className={`h-1 flex-1 transition-all duration-500 ${i === currentPage ? 'bg-mafia-gold shadow-[0_0_8px_rgba(var(--color-mafia-gold-rgb),0.5)]' : 'bg-white/10'}`}
                      ></div>
                    ))}
                 </div>
                 <button 
                   onClick={nextPage}
                   disabled={currentPage === MAGAZINE_PAGES.length - 1}
                   className={`p-3 md:p-4 rounded-full border border-mafia-gold/20 transition-all ${currentPage === MAGAZINE_PAGES.length - 1 ? 'opacity-10 cursor-not-allowed' : 'hover:bg-mafia-gold hover:text-black hover:border-mafia-gold active:scale-90'}`}
                 >
                  <ChevronRight size={20} />
                 </button>
              </div>
           </div>
        </div>
        <div className="h-20 md:h-24"></div>
      </div>
      
      <Footer />
      
      <BottomTerminalReveal thresholdMultiplier={1.5}>
        {(level) => (
          <>
            {level >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <CareSEOArchive />
              </motion.div>
            )}
          </>
        )}
      </BottomTerminalReveal>
    </main>
  );
}

function renderPageContent(page: any, season: string, testProps: any, t_mag: any, SEASONAL_CONTENT: any) {
  const { handleTestAnswer, handleNextQuestion, currentSelections, questionIndex, testAnswers, testResult, resetTest, lang } = testProps;

  switch (page.type) {
    case 'cover':
      return (
        <div className="h-full flex flex-col items-center justify-center text-center py-6 md:py-20 relative overflow-hidden">
             <div className="inline-block px-3 py-1 bg-mafia-gold text-black font-mono text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-8 md:mb-12 relative z-20">
                {t_mag.ui.officialPub}
             </div>
             <div className="relative flex flex-col items-center">
                <h1 className="text-7xl min-[400px]:text-8xl md:text-[18rem] font-heading font-black text-white italic leading-none tracking-tighter mb-4 opacity-5 absolute pointer-events-none select-none top-1/2 -translate-y-1/2">
                    {page.title}
                </h1>
                <h1 className="text-6xl min-[400px]:text-7xl md:text-[10rem] font-heading font-black text-white italic leading-none tracking-tighter mb-4 z-10 relative">
                    {page.title}
                </h1>
             </div>
             <p className="text-mafia-gold font-heading font-bold text-lg min-[400px]:text-xl md:text-3xl uppercase tracking-widest mb-8 md:mb-12 italic z-10">
                {page.subtitle}
             </p>
             <div className="mt-8 md:mt-20 pt-6 md:pt-8 border-t border-white/10 w-48 md:w-64 flex justify-center z-10">
                <div className="font-mono text-[9px] md:text-[10px] text-white/40 tracking-widest">{page.edition}</div>
             </div>
        </div>
      );
    case 'editorial':
      return (
        <div className="h-full flex flex-col max-w-4xl mx-auto text-center py-4 md:py-10">
             <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-8 md:mb-12 leading-tight">
                {page.title}
             </h2>
             <div className="relative px-4">
                <Quote className="text-mafia-gold/10 absolute -top-8 -left-2 md:-top-12 md:-left-12 w-12 h-12 md:w-20 md:h-20" />
                <p className="text-smoke-white/80 text-lg md:text-2xl leading-relaxed italic mb-8 md:mb-12 font-serif relative z-10">
                    {page.content}
                </p>
             </div>
             <div className="mt-6 md:mt-12">
                <p className="text-mafia-gold font-heading font-bold text-xl md:text-2xl mb-2">{page.quote}</p>
                <div className="w-10 h-0.5 bg-mafia-gold/30 mx-auto mt-4"></div>
             </div>
        </div>
      );
    case 'rituals':
      return (
        <div className="h-full flex flex-col pb-10">
           <div className="mb-10 md:mb-16 text-center">
              <h2 className="text-4xl md:text-7xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-[0.4em]">{page.subtitle}</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
              {page.rituals.map((r: any, i: number) => (
                <div key={i} className="space-y-4 p-6 md:p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/30 transition-all duration-500">
                   <div className="flex items-center gap-4">
                      <span className="text-mafia-gold font-heading font-black text-xl md:text-2xl italic">{r.country}</span>
                      <div className="flex-1 h-px bg-mafia-gold/20"></div>
                   </div>
                   <p className="text-smoke-white/60 text-xs md:text-base leading-relaxed font-sans italic">
                      {r.fact}
                   </p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'seasonal':
      const content = (SEASONAL_CONTENT as any)[season];
      const icons: any = {
        winter: <Snowflake className="text-blue-400" />,
        spring: <Leaf className="text-green-400" />,
        summer: <Sun className="text-mafia-gold" />,
        autumn: <Wind className="text-orange-400" />
      };

      return (
        <div className="h-full flex flex-col pb-10">
           <div className="mb-10 md:mb-16 text-center">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <div className="flex items-center justify-center gap-4">
                 <div className="w-8 h-px bg-mafia-gold/30"></div>
                 {icons[season]}
                 <div className="w-8 h-px bg-mafia-gold/30"></div>
              </div>
           </div>
           <div className="max-w-4xl mx-auto bg-white/[0.02] border border-white/5 p-6 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 md:opacity-10">
                 {icons[season]}
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-white italic mb-4 md:mb-6">{content.title}</h3>
              <p className="text-smoke-white/70 text-base md:text-lg leading-relaxed mb-8 md:mb-12 italic border-l-2 border-mafia-gold pl-4 md:pl-6">
                 {content.desc}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                 {content.tips.map((tip: string, i: number) => (
                   <div key={i} className="p-5 md:p-6 bg-black border border-white/5 hover:border-mafia-gold/40 transition-all group">
                      <div className="text-mafia-gold font-mono text-[9px] mb-3">TIP 0{i+1}</div>
                      <p className="text-smoke-white/60 text-xs md:text-sm leading-relaxed group-hover:text-white transition-colors">{tip}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      );
    case 'fragrance':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="mb-12 md:mb-16">
              <h4 className="text-white font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] mb-6 md:mb-8 border-l-2 border-mafia-gold pl-4">{lang === 'cs' ? 'Genetický Profiler:' : 'Genetic Profiler:'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                 {page.profiles.map((p: any, i: number) => (
                   <div key={i} className="group p-6 md:p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/40 transition-all duration-700">
                      <h5 className="text-mafia-gold font-heading font-bold text-base md:text-lg uppercase mb-4">{p.origin}</h5>
                      <div className="space-y-3 md:space-y-4">
                         <div className="text-[8px] md:text-[9px] font-mono text-white/30 uppercase">{lang === 'cs' ? 'Biometrika:' : 'Biometrics:'} <span className="text-white/60">{p.skin}</span></div>
                         <div className="text-[8px] md:text-[9px] font-mono text-white/30 uppercase">{lang === 'cs' ? 'Genetika:' : 'Genetics:'} <span className="text-white/60">{p.genetics}</span></div>
                         <div className="h-px bg-white/5 w-full my-3 md:my-4"></div>
                         <p className="text-smoke-white/50 text-[10px] md:text-xs leading-relaxed italic">{p.rec}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {page.factors.map((f: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-black border border-white/5 hover:border-mafia-gold/30 transition-all duration-500">
                   <h5 className="text-mafia-gold font-heading font-bold text-base md:text-lg uppercase tracking-widest mb-4 md:mb-6">{f.t}</h5>
                   <p className="text-smoke-white/50 text-xs md:text-sm leading-relaxed font-sans">{f.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'aftercare':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {page.sections.map((section: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/20 transition-all group">
                   <h5 className="text-mafia-gold font-heading font-bold text-base md:text-lg uppercase tracking-widest mb-4 group-hover:text-white transition-colors">{section.t}</h5>
                   <p className="text-smoke-white/50 text-xs md:text-sm leading-relaxed">{section.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'shaving':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {page.steps.map((step: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-black border border-white/5 hover:border-mafia-gold/40 transition-all duration-500 group">
                   <div className="flex items-center gap-4 mb-4 md:mb-6">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-mafia-gold/30 flex items-center justify-center text-mafia-gold font-mono text-xs md:text-sm group-hover:bg-mafia-gold group-hover:text-black transition-all">
                         0{i+1}
                      </div>
                      <h5 className="text-white font-heading font-bold text-base md:text-lg uppercase tracking-widest">{step.t}</h5>
                   </div>
                   <p className="text-smoke-white/50 text-xs md:text-sm leading-relaxed">{step.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'nutrition':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12 text-center md:text-left">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {page.nutrients.map((item: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/20 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <h5 className="text-mafia-gold font-heading font-bold text-lg md:text-xl uppercase tracking-widest">{item.n}</h5>
                      <div className="text-[8px] md:text-[10px] font-mono text-white/30 uppercase tracking-widest">{lang === 'cs' ? 'Klíčová živina' : 'Key Nutrient'}</div>
                   </div>
                   <div className="text-white/80 text-[10px] font-mono mb-4 uppercase tracking-wider bg-white/5 inline-block px-2 py-1">
                      {lang === 'cs' ? 'Zdroje:' : 'Sources:'} {item.f}
                   </div>
                   <p className="text-smoke-white/50 text-xs md:text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'herbs':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12 text-center md:text-left">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {page.herbs.map((item: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/20 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <h5 className="text-mafia-gold font-heading font-bold text-lg md:text-xl uppercase tracking-widest">{item.n}</h5>
                      <div className="text-[8px] md:text-[10px] font-mono text-white/30 uppercase tracking-widest">{lang === 'cs' ? 'Herbální extrakt' : 'Herbal Extract'}</div>
                   </div>
                   <div className="text-white/80 text-[10px] font-mono mb-4 uppercase tracking-wider bg-white/5 inline-block px-2 py-1">
                      {lang === 'cs' ? 'Latinsky:' : 'Latin:'} {item.f}
                   </div>
                   <p className="text-smoke-white/50 text-xs md:text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'expert':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {page.sections.map((section: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-black border border-white/5 hover:border-mafia-gold/30 transition-all group">
                   <h5 className="text-mafia-gold font-heading font-bold text-base md:text-lg uppercase tracking-widest mb-4 group-hover:text-white transition-colors">{section.t}</h5>
                   <p className="text-smoke-white/50 text-xs md:text-sm leading-relaxed">{section.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'solutions':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {page.categories.map((cat: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/20 transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 text-[30px] md:text-[40px] font-heading font-black text-white/[0.02] pointer-events-none uppercase italic">SOL-0{i+1}</div>
                   <h5 className="text-mafia-gold font-heading font-bold text-lg md:text-xl uppercase tracking-widest mb-4 md:mb-6 group-hover:text-white transition-colors">{cat.t}</h5>
                   <p className="text-smoke-white/50 text-[10px] md:text-sm leading-relaxed border-l border-mafia-gold/20 pl-4 md:pl-6">{cat.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'styling-guide':
    case 'beard-styling':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12 text-center md:text-left">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {page.products.map((item: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/20 transition-all group">
                   <h5 className="text-mafia-gold font-heading font-bold text-lg md:text-xl uppercase tracking-widest mb-4">{item.t}</h5>
                   <p className="text-smoke-white/50 text-xs md:text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'shampoo-guide':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 gap-4 md:gap-6">
              {page.matrix.map((item: any, i: number) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-3 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/30 transition-all group overflow-hidden">
                   <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/5 bg-white/[0.01]">
                      <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-widest block mb-2">{lang === 'cs' ? 'PROBLÉM' : 'PROBLEM'}</span>
                      <h5 className="text-white font-heading font-bold text-lg uppercase italic">{item.p}</h5>
                   </div>
                   <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/5">
                      <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-widest block mb-2">{lang === 'cs' ? 'ŘEŠENÍ' : 'SOLUTION'}</span>
                      <p className="text-smoke-white text-sm leading-relaxed">{item.s}</p>
                   </div>
                   <div className="p-6 md:p-8 bg-mafia-red/5">
                      <span className="text-[10px] font-mono text-mafia-red/60 uppercase tracking-widest block mb-2">{lang === 'cs' ? 'VAROVÁNÍ' : 'WARNING'}</span>
                      <p className="text-mafia-red/80 text-xs italic">{item.w}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      );
    case 'quality-check':
      return (
        <div className="w-full flex flex-col pb-10">
           <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/70 text-base md:text-lg max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {page.checks.map((check: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-black border border-white/5 hover:border-mafia-gold/30 transition-all group">
                   <h5 className="text-mafia-gold font-heading font-bold text-base md:text-lg uppercase tracking-widest mb-4 group-hover:text-white transition-colors">{check.t}</h5>
                   <p className="text-smoke-white/50 text-xs md:text-sm leading-relaxed">{check.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'alter-ego':
      if (testResult) {
        const res = page.results[testResult];
        return (
          <div className="h-full flex flex-col items-center justify-center py-6 md:py-10">
             <motion.div 
               initial={{ opacity: 0, rotateY: 180, scale: 0.8 }} 
               animate={{ opacity: 1, rotateY: 0, scale: 1 }} 
               className="max-w-3xl w-full bg-gradient-to-br from-mafia-gold/20 via-black to-mafia-gold/5 border-2 border-mafia-gold p-8 md:p-16 relative overflow-hidden shadow-[0_0_50px_rgba(var(--color-mafia-gold-rgb),0.3)]"
             >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-4 font-mono text-[60px] opacity-10 select-none">ID</div>
                <div className="absolute bottom-0 left-0 p-4 font-mono text-[10px] text-mafia-gold/40 tracking-widest uppercase">Verified by MMBARBER</div>
                
                <h2 className="text-mafia-gold font-heading font-black text-4xl md:text-6xl italic mb-4 tracking-tighter uppercase">{res.title}</h2>
                <div className="w-24 h-1 bg-mafia-gold mb-8"></div>
                
                <p className="text-white text-lg md:text-2xl leading-relaxed mb-10 italic font-serif">
                  {res.desc}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
                   <div className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-mafia-gold font-mono text-[9px] md:text-[10px] uppercase mb-2 tracking-widest font-black opacity-60">Doporučený střih:</div>
                      <p className="text-white font-heading font-bold text-lg md:text-xl uppercase italic leading-tight">{res.haircut}</p>
                   </div>
                   <div className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-mafia-gold font-mono text-[9px] md:text-[10px] uppercase mb-2 tracking-widest font-black opacity-60">Úprava vousů:</div>
                      <p className="text-white font-heading font-bold text-lg md:text-xl uppercase italic leading-tight">{res.beard}</p>
                   </div>
                </div>

                <div className="mb-8 p-4 md:p-6 bg-white/5 border border-white/10 rounded-lg">
                   <div className="text-mafia-gold font-mono text-[9px] md:text-[10px] uppercase mb-2 tracking-widest font-black opacity-60">DNA Vůně:</div>
                   <p className="text-white font-heading font-bold text-lg md:text-xl uppercase italic leading-tight">{res.fragrance}</p>
                </div>

                <div className="bg-mafia-gold/10 p-4 md:p-6 border-l-4 border-mafia-gold mb-10">
                   <p className="text-mafia-gold font-mono text-[10px] md:text-[11px] font-bold uppercase mb-2">PRO TIP:</p>
                   <p className="text-smoke-white/80 text-sm md:text-base italic leading-relaxed">{res.advice}</p>
                </div>

                <button 
                  onClick={resetTest} 
                  className="group relative w-full py-5 bg-mafia-gold text-mafia-black font-heading font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:bg-white text-xs md:text-sm"
                >
                   <span className="relative z-10">{lang === 'cs' ? 'Resetovat Profiler' : 'Reset Profiler'}</span>
                </button>
             </motion.div>
          </div>
        );
      }

      const q = page.questions[questionIndex];
      if (!q) return null;

      return (
        <div className="h-full flex flex-col items-center justify-center py-6 md:py-10">
           <div className="max-w-4xl w-full">
              <div className="mb-12 text-center">
                 <h2 className="text-4xl md:text-7xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
                 <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-[0.5em]">{page.subtitle}</p>
              </div>
              <div className="relative">
                 <AnimatePresence mode="wait">
                    <motion.div 
                      key={testAnswers.length}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-8"
                    >
                       <h3 className="text-2xl md:text-4xl font-heading font-bold text-white italic mb-10 text-center leading-tight">
                         {q.q}
                       </h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {q.options.map((opt: any, i: number) => {
                             const isSelected = currentSelections.includes(opt.val);
                             return (
                               <button 
                                 key={i} 
                                 onClick={() => handleTestAnswer(opt.val)} 
                                 className={`group relative p-6 md:p-8 border transition-all duration-500 text-left overflow-hidden ${
                                   isSelected 
                                     ? 'border-mafia-gold bg-mafia-gold/10' 
                                     : 'border-white/10 bg-white/[0.02] hover:border-mafia-gold/50'
                                 }`}
                               >
                                  <div className="absolute inset-0 bg-mafia-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                  <p className={`relative z-10 transition-colors text-base md:text-lg font-sans ${isSelected ? 'text-white' : 'text-smoke-white/60 group-hover:text-white'}`}>
                                    {opt.text}
                                  </p>
                                  <div className="absolute top-2 right-2 font-mono text-[10px] text-white/10 group-hover:text-mafia-gold/40">0{i+1}</div>
                               </button>
                             );
                           })}
                        </div>
                        {currentSelections.length > 0 && (
                          <motion.button 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={handleNextQuestion}
                            className="mt-12 w-full py-6 bg-mafia-gold text-black font-heading font-black text-sm md:text-base uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.3)]"
                          >
                            {lang === 'cs' ? 'ANALYSOVAT DNA' : 'ANALYZE DNA'}
                          </motion.button>
                        )}
                     </motion.div>
                 </AnimatePresence>
              </div>
           </div>
        </div>
      );
    case 'test':
    case 'test-hair':
    case 'test-scalp':
    case 'test-trichology':
    case 'test-herbs':
    case 'test-styling':
    case 'test-haircut':
      const questions = page.questions;
      const results = page.results;

      if (testResult) {
        const resultKeys = testResult.split(',');
        return (
          <div className="h-full flex flex-col items-center justify-start py-4 md:py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-mafia-gold/20 px-4">
             <div className={`grid grid-cols-1 ${resultKeys.length > 1 ? 'md:grid-cols-2' : 'max-w-2xl'} gap-4 md:gap-6 w-full mb-8`}>
                {resultKeys.map((key: string, idx: number) => {
                  const res = results[key];
                  if (!res) return null;
                  return (
                    <motion.div 
                      key={key}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                      animate={{ opacity: 1, scale: 1, y: 0 }} 
                      transition={{ delay: idx * 0.1 }}
                      className="w-full bg-white/[0.03] border border-mafia-gold/30 p-6 md:p-8 relative overflow-hidden flex flex-col justify-between"
                    >
                       <div>
                          <h2 className="text-mafia-gold font-heading font-black text-xl md:text-2xl italic mb-2">{res.title}</h2>
                          <p className="text-smoke-white/80 text-xs md:text-sm leading-relaxed mb-6 italic">{res.desc}</p>
                          
                          {res.advice && (
                            <div className="p-4 bg-mafia-gold/5 border-l-2 border-mafia-gold mb-6">
                              <div className="text-mafia-gold font-mono text-[9px] md:text-[10px] uppercase mb-2 font-bold">
                                 {page.type === 'test-scalp' ? (lang === 'cs' ? 'Doporučení:' : 'Recommendation:') : (lang === 'cs' ? 'Expertní rada:' : 'Expert Advice:')}
                              </div>
                              <p className="text-[10px] md:text-xs text-white/70 leading-relaxed">{res.advice}</p>
                            </div>
                          )}
                       </div>

                       <div className="flex flex-col gap-3 mt-auto">
                         {res.focus && (
                           <div className="text-white/30 text-[8px] md:text-[9px] font-mono uppercase">
                             {lang === 'cs' ? 'Hlavní složka:' : 'Key Ingredient:'} {res.focus}
                           </div>
                         )}
                         
                         {res.warning && (
                           <div className="text-red-400/60 text-[7px] md:text-[8px] font-mono uppercase tracking-widest">
                             {lang === 'cs' ? 'Varování:' : 'Warning:'} {res.warning}
                           </div>
                         )}
                       </div>
                    </motion.div>
                  );
                })}
             </div>

             <button onClick={resetTest} className="w-full max-w-xs py-4 border border-white/10 hover:bg-white/5 transition-all font-mono text-[9px] md:text-[10px] uppercase tracking-widest bg-black/40 backdrop-blur-sm sticky bottom-0">
                {t_mag.ui.reset}
             </button>
          </div>
        );
      }

      const currentQ = questions[questionIndex];
      return (
        <div className="h-full flex flex-col items-center justify-center py-6 md:py-10">
           <div className="max-w-3xl w-full px-4">
              <div className="mb-10 md:mb-12 text-center">
                 <h2 className="text-3xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter mb-4">{page.title}</h2>
                 <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-[0.4em]">{page.subtitle}</p>
              </div>
              <div className="space-y-6 md:space-y-8">
                 <h3 className="text-xl md:text-2xl font-heading font-bold text-white italic mb-6 md:mb-8 text-center">{currentQ.q}</h3>
                 <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {currentQ.options.map((opt: any, i: number) => {
                      const isSelected = currentSelections.includes(opt.val);
                      return (
                        <button 
                          key={i} 
                          onClick={() => handleTestAnswer(opt.val)} 
                          className={`p-5 md:p-6 border transition-all group relative ${
                            isSelected 
                              ? 'border-mafia-gold bg-mafia-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                              : 'border-white/5 bg-white/[0.02] hover:border-mafia-gold/50 hover:bg-mafia-gold/5'
                          }`}
                        >
                           <p className={`transition-colors text-sm md:text-base ${isSelected ? 'text-white' : 'text-smoke-white/60 group-hover:text-white'}`}>
                             {opt.text}
                           </p>
                           {isSelected && (
                             <div className="absolute top-2 right-2 text-mafia-gold">
                               <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                               </svg>
                             </div>
                           )}
                        </button>
                      );
                    })}
                 </div>

                 {currentSelections.length > 0 && (
                   <motion.button 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     onClick={handleNextQuestion}
                     className="mt-10 w-full py-5 bg-mafia-gold text-black font-heading font-black text-sm md:text-base uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                   >
                     {lang === 'cs' ? 'Pokračovat' : 'Continue'}
                   </motion.button>
                 )}
              </div>
           </div>
        </div>
      );
    case 'toxic-ingredients':
      return (
        <div className="w-full flex flex-col pb-10 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-mafia-red/20">
           <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-5xl font-heading font-black text-mafia-red uppercase italic tracking-tighter mb-4">{page.title}</h2>
              <p className="text-mafia-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">{page.subtitle}</p>
           </div>
           <p className="text-smoke-white/80 text-sm md:text-base max-w-4xl mb-10 md:mb-12 italic leading-relaxed">
              {page.content}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {page.dangers.map((danger: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-mafia-red/5 border border-mafia-red/20 hover:bg-mafia-red/10 transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 text-[40px] font-heading font-black text-mafia-red/10 pointer-events-none uppercase italic">0{i+1}</div>
                   <h5 className="text-mafia-red font-heading font-bold text-lg md:text-xl uppercase tracking-widest mb-4 transition-colors">{danger.t}</h5>
                   <p className="text-smoke-white/70 text-xs md:text-sm leading-relaxed border-l-2 border-mafia-red/30 pl-4 md:pl-6">{danger.d}</p>
                </div>
              ))}
           </div>
        </div>
      );
    case 'analyzer':
      return <AnalyzerComponent page={page} lang={lang} />;
    default:
      return null;
  }
}
