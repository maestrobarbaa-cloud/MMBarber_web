export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  keywords: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "skin-fade-komu-slusi",
    title: "Skin Fade – komu sluší a jak jej udržovat?",
    excerpt: "Zjistěte vše o nejoblíbenějším pánském střihu současnosti. Hodí se skin fade právě pro váš tvar hlavy a jak často musíte k barberovi?",
    date: "2026-07-13",
    keywords: ["skin fade", "fade", "pánský střih", "barber střihy"],
    content: `
      <h2>Co je to vlastně Skin Fade?</h2>
      <p>Skin fade (neboli do ztracena kůží) je technika střihu, při které vlasy plynule přecházejí od naprosté nuly (holé kůže) na spodní části hlavy až po delší vlasy na vrchu. Tento přechod musí být absolutně hladký a plynulý, což vyžaduje zkušenou ruku barbera a kvalitní strojek s planžetou.</p>
      
      <h2>Tři základní typy</h2>
      <ul>
        <li><strong>Low Fade (nízký):</strong> Přechod začíná nízko nad ušima a na zátylku. Ideální pro začátečníky.</li>
        <li><strong>Mid Fade (střední):</strong> Zlatá střední cesta, začíná zhruba v polovině boků hlavy.</li>
        <li><strong>High Fade (vysoký):</strong> Agresivnější střih, kde je většina boků a zadní části hlavy vyholena a přechod je vysoko.</li>
      </ul>

      <h2>Komu skin fade sluší?</h2>
      <p>Dobrou zprávou je, že skin fade <strong>sluší téměř každému muži</strong>. Kouzlo spočívá v tom, že zkušený barber dokáže výškou fadu opticky korigovat tvar hlavy. Pokud máte kulatější obličej, vyšší fade ho opticky prodlouží. Naopak pokud máte spíše protáhlý obličej, doporučujeme low fade.</p>
      <p>Opatrnosti je třeba pouze v případě, že máte na hlavě výrazné nerovnosti nebo jizvy – v takovém případě je často lepší zvolit např. taper fade (přechod jen na spáncích a krku) nebo nechat délku alespoň 3 mm.</p>

      <h2>Jak často s fadem k holiči?</h2>
      <p>Skin fade vypadá fantasticky, ale má jednu nevýhodu – rychle odrůstá. Aby byl fade perfektně "fresh", doporučujeme návštěvu barbera každé <strong>2 až 3 týdny</strong>. Po 4 týdnech už se efekt ztracena vytrácí a střih působí neudržovaně.</p>
    `
  },
  {
    id: "2",
    slug: "jak-casto-chodit-k-barberovi",
    title: "Jak často chodit k barberovi?",
    excerpt: "Návod na to, v jakých intervalech navštěvovat holičství v závislosti na vašem účesu a vousech.",
    date: "2026-07-10",
    keywords: ["jak často k holiči", "intervaly holení", "barber"],
    content: `
      <h2>Frekvence návštěv ovlivňuje váš styl</h2>
      <p>Otázka, jak často byste měli navštěvovat svého barbera, nemá jedinou správnou odpověď. Vše se odvíjí od typu vašeho střihu, rychlosti růstu vlasů a vašeho osobního standardu. Obecně však platí následující pravidla:</p>

      <h2>Krátké střihy (Skin Fade, Buzz Cut, French Crop)</h2>
      <p>Pokud nosíte velmi krátký střih na bocích nebo oblíbený skin fade, vlasy vám viditelně odrostou velmi rychle. Pro udržení perfektního, čerstvého vzhledu je ideální návštěva každé <strong>2 až 3 týdny</strong>. U Buzz Cutu (strojkem na milimetry) můžete interval protáhnout na 3 týdny, u velmi krátkých fadeů (tzv. bald fade) chodí perfekcionisté i každých 10 dní.</p>

      <h2>Střední délky a klasické střihy (Pompadour, Slick Back, Taper Fade)</h2>
      <p>Střihy, které kombinují nůžky a delší vlasy na vrchu hlavy a nejsou na bocích zcela na kůži, vydrží déle. Ideální interval pro tyto účesy je <strong>4 až 5 týdnů</strong>. Vlasy sice povyrostou, ale pokud jsou dobře strukturované od minula, dají se stále dobře stylizovat doma pomocí pasty nebo pomády.</p>

      <h2>Dlouhé vlasy a delší účesy (Mullet, dlouhé mikádo, atd.)</h2>
      <p>U dlouhých vlasů stačí návštěva každých <strong>6 až 8 týdnů</strong>, nebo i déle. Jde spíše o zkrácení roztřepených konečků, provzdušnění a úpravu tvaru.</p>

      <h2>A co vousy?</h2>
      <p>Vousy rostou u většiny mužů rychleji než vlasy a navíc velmi nerovnoměrně. Pokud si zakládáte na ostrých konturách (na tvářích a na krku), budete k barberovi muset každé <strong>2 až 3 týdny</strong>. Samozřejmě si krk a tváře můžete holit břitvou nebo žiletkou doma sami, ale pro celkové zkrácení, zarovnání do roviny a vytvarování symetrie je ruka profesionála nenahraditelná.</p>

      <h2>Závěrem</h2>
      <p>Pravidelnost se vyplácí. Pokud budete chodit v pravidelných intervalech, váš barber bude s vašimi vlasy lépe obeznámen a bude přesně vědět, jak padají a jak se chovají. V MM BARBER vám rádi doporučíme ideální harmonogram přímo pro vás.</p>
    `
  },
  {
    id: "3",
    slug: "buzz-cut-2026",
    title: "Buzz Cut 2026: Proč je krátký střih zpět na vrcholu",
    excerpt: "Minimalismus vládne. Proč se letos tolik mužů vrací k úplně krátkým vlasům a jak nosit buzz cut stylově.",
    date: "2026-07-05",
    keywords: ["buzz cut", "krátké vlasy", "vojenský střih"],
    content: `
      <h2>Návrat k jednoduchosti</h2>
      <p>Rok 2026 se nese ve znamení radikálního minimalismu a "Buzz Cut" je jeho vlajkovou lodí. Možná to je přesycení složitými účesy, které vyžadují ranní fénování a aplikaci tří různých produktů, nebo prostě touha po drsnějším, maskulinním vzhledu. Jedno je jisté – buzz cut je všude.</p>

      <h2>Co dělá Buzz Cut moderním?</h2>
      <p>Moderní Buzz Cut není jen vzít strojek a objet celou hlavu jedním nástavcem. To byste vypadali spíše jako rekrut. Dnešní verze je sofistikovaná:</p>
      <ul>
        <li><strong>Fade na bocích:</strong> Vršek se stříhá strojkem na délku 3 až 9 milimetrů, ale boky a zadní část hlavy jsou upraveny jako skin fade nebo high taper fade. Tím střih získá dynamiku.</li>
        <li><strong>Line-up (Ostré kontury):</strong> Základem je naprosto přesně definovaná linie na čele a spáncích, často upravená břitvou.</li>
        <li><strong>Textura:</strong> Někdy se vršek nechá o malinko delší a lehce se promelíruje nůžkami pro hrubší texturu.</li>
      </ul>

      <h2>Výhody tohoto střihu</h2>
      <p>Největší výhodou je <strong>nulová údržba</strong>. Ráno vstanete, omyjete si obličej a hlava je hotová. Nemusíte řešit vítr ani déšť, při sportu vlasy nepřekážejí a po sprše jste okamžitě suší. Navíc tento střih výborně zvýrazní vaše lícní kosti, čelist a oči – proto se často doporučuje mužům s ostřejšími rysy.</p>

      <h2>Jak na něj?</h2>
      <p>Pokud se rozhodnete pro Buzz Cut, doporučujeme nejprve konzultaci. Barber zhodnotí tvar vaší lebky – pokud máte výrazné asymetrie, může být lepší nechat vršek mírně delší pro korekci tvaru. Nezapomeňte také na pokožku hlavy, která bude najednou vystavena slunci – zejména v létě je SPF ochrana nutností!</p>
    `
  },
  {
    id: "4",
    slug: "nejlepsi-ucesy-pro-kouty",
    title: "Nejlepší účesy pro kouty a ustupující vlasy",
    excerpt: "Ztrácíte vlasy? Neztrácejte hlavu. Poradíme vám, jaké střihy zvolit, abyste kouty zamaskovali, nebo z nich udělali přednost.",
    date: "2026-06-28",
    keywords: ["kouty", "plešatění", "ustupující vlasy", "účesy pro muže"],
    content: `
      <h2>Kouty nejsou konec světa</h2>
      <p>Mnoho mužů zpanikaří, když si všimnou, že se jim prohlubují kouty nebo celkově ustupuje linie vlasů. Začnou vlasy zčesávat dopředu nebo vytvářet nepřirozené přehazovačky. Zastavte. S ustupujícími vlasy se dá pracovat velmi stylově, chce to jen vědět jak.</p>

      <h2>1. Krátké boky jsou základ</h2>
      <p>Klíčovým pravidlem při ustupujících vlasech je: <strong>zkrátit boky</strong>. Čím delší máte vlasy na bocích, tím více kontrastují s řidšími vlasy nahoře nebo s kouty. Pokud boky zkrátíte na minimum (např. pomocí skin fadu), opticky se rozdíl smaže a vlasy nahoře budou působit hustší. Je to o hře s kontrastem.</p>

      <h2>2. Buzz Cut (Extrémně krátký střih)</h2>
      <p>Pokud kouty postupují hlouběji, jednou z nejlepších a nejodvážnějších možností je vzít strojek a všechno zkrátit (Buzz Cut). Nejen, že kouty téměř splynou s pokožkou hlavy, ale tento střih působí velmi sebevědomě. Vzpomeňte na Jasona Stathama.</p>

      <h2>3. French Crop a texturovaná ofina</h2>
      <p>Pokud nechcete jít do extrému, skvělou volbou je French Crop. Vlasy na vrchu hlavy se stříhají s texturou (aby působily rozcuchaně) a směřují mírně dopředu přes čelo. Kratší ofina elegantně zakryje vznikající kouty. Pro styling použijte zmatňující pudr nebo lehkou hlínu – vyhněte se gelům a pomádám s vysokým leskem, které vlasy slepují a odhalují pokožku hlavy.</p>

      <h2>4. Slick Back (Sčesané dozadu)</h2>
      <p>Máte kouty, ale vlasy jsou stále husté? Přiznejte barvu! Mnoho elegantních mužů volí účes sčesaný dozadu (Slick Back) nebo jemně na stranu (Side Part). Nesnažíte se nic maskovat, naopak kouty hrdě přiznáváte. S krátkými boky a dobře upravenými vousy to vypadá nesmírně sofistikovaně.</p>

      <h2>Čeho se vyvarovat?</h2>
      <p>Vyhněte se zmíněným přehazovačkám, těžkým gelům, dlouhým a zplihlým vlasům. Pokud si nejste jistí, přijďte k nám. Zhodnotíme situaci a navrhneme střih, ve kterém se budete cítit opět na 100 % sebejistě.</p>
    `
  },
  {
    id: "5",
    slug: "jak-pecovat-o-vousy",
    title: "Komplexní průvodce: Jak správně pečovat o vousy",
    excerpt: "Mít vousy není jen přestat se holit. Je to závazek. Jak o ně pečovat, aby neškrábaly, nesvědily a vypadaly reprezentativně?",
    date: "2026-06-15",
    keywords: ["vousy", "péče o vousy", "olej na vousy", "holení"],
    content: `
      <h2>Vousy potřebují péči, ne jen čas</h2>
      <p>Mnoho mužů si myslí, že pěstovat vousy znamená vyhodit žiletku a čekat. Opak je pravdou. Nestarané vousy často svědí, vysušují pokožku pod nimi a působí neupraveně. Zde je základní rutina pro perfektní plnovous.</p>

      <h2>1. Mytí a čištění</h2>
      <p>Nepoužívejte na vousy běžný sprchový gel nebo šampon na vlasy! Tyto produkty jsou navrženy pro odstraňování mazu a pokožku na tváři extrémně vysuší. Pořiďte si <strong>speciální šampon nebo mýdlo na vousy</strong>. Jsou šetrnější a obsahují oleje. Vousy myjte 2x až 3x týdně, aby nedocházelo k úplnému odstranění přirozeného kožního mazu.</p>

      <h2>2. Hydratace (Olej a Balzám)</h2>
      <p>Tohle je naprostý základ. <strong>Olej na vousy</strong> byste měli používat každý den ráno (případně i večer). Kápněte pár kapek do dlaní, rozetřete a vmasírujte <em>až na pokožku</em> pod vousy. Olej změkčí tvrdé vousy, zabrání svědění a tvorbě lupů. Pokud máte delší vousy, použijte <strong>balzám</strong> – ten obsahuje navíc vosk, který pomůže nepoddajné vousy zkrotit a drží jejich tvar.</p>

      <h2>3. Kartáčování a rozčesávání</h2>
      <p>Kupte si kartáč z kančích štětin. Proč? Protože kančí štětiny dokonale pomáhají roznést aplikovaný olej od kořínků až po konečky. Kartáčování navíc stimuluje prokrvení pokožky, čímž podporuje růst, a odstraňuje odumřelé kožní buňky. Vousy byste měli pročesávat každý den.</p>

      <h2>4. Ostré kontury (Zastřihování)</h2>
      <p>Ať už nosíte krátké strniště, nebo dlouhý plnovous, klíčem k reprezentativnímu vzhledu jsou <strong>ostré kontury</strong> na tvářích a na krku. Linie na krku by měla ideálně kopírovat ohyb krku (asi dva prsty nad ohryzkem). Linie na tvářích by měla spojovat vršek ucha s koutkem úst (nebo trochu níže). Pokud si netroufáte kontury vytvořit sami břitvou nebo strojkem, navštivte svého barbera, který vám je přesně "narýsuje". Doma je pak budete jen udržovat.</p>

      <h2>5. Trpělivost</h2>
      <p>V první fázi (cca 2–4 týdny) vás vousy pravděpodobně budou svědit. To je normální. Odstřihli jste ostré konečky, které se teď stáčejí a dráždí kůži. Právě zde vás zachrání olej na vousy. Vydržte to a odměnou vám bude skvělý plnovous.</p>
    `
  }
];
