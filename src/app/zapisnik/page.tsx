"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronLeft, Book, History, Clock, MapPin } from "lucide-react";
import Link from "next/link";

const SEO_STORIES = [
  {
    month: 0, // Leden
    title: "Zimní kronika: Ochrana a styl v srdci Uherského Hradiště",
    content: "Leden v Uherském Hradišti přináší mráz, který prověří každého muže. V MM BARBER Mařatice víme, že zimní úprava vousů není jen o estetice, ale o přežití pokožky. Naši klienti z Kunovic a Starého Města k nám jezdí pro poctivý pánský střih a hloubkovou hydrataci. Když mrzne až praští u stadionu 1.FC Slovácko, v našem barbershopu vás čeká horký ručník (hot towel) a prémiové oleje, které ochrání váš styl i tvář. Leden je čas pro budování základu – ať už jde o skin fade nebo klasický taper fade, preciznost je náš zákon."
  },
  {
    month: 1, // Únor
    title: "Únorový zápisník: Příprava na jaro a precizní detaily",
    content: "Zatímco se Slovácko pomalu probouzí ze zimního spánku, v MM BARBER ladíme detaily. Únor je měsícem ostrosti. Naše břitvy jsou připraveny pro ty, kteří hledají dokonalou konturu vousů. Pokud hledáte nejlepší pánské kadeřnictví v UH, kde rozumí textuře vlasů i v proměnlivém počasí, jste na správné adrese. Pánský kadeřník Tomáš Mička zdůrazňuje: kvalita se pozná podle toho, jak střih vypadá po dvou týdnech. Ať už jste z Jarošova nebo Sadů, váš styl v únoru definuje vaši disciplínu po zbytek roku."
  },
  {
    month: 2, // Březen
    title: "Březnová obroda: Svěží střihy pro jarní sezónu v UH",
    content: "Březen v Uherském Hradišti znamená jediné – čas na restart. Po zimních čepicích potřebují vaše vlasy prostor. V MM BARBER řešíme jarní revitalizaci pokožky hlavy. Navštěvují nás muži, kteří se chystají do Slováckého divadla nebo na první jarní procházky směr hrad Buchlov. Nabízíme moderní pánské účesy, které kombinují lehkost a strukturu. Naše technika střihu je navržena tak, aby fungovala v běžném životě i bez hodin strávených před zrcadlem. Uherské Hradiště ožívá a my s ním."
  },
  {
    month: 3, // Duben
    title: "Dubnový protokol: Velikonoční ostrost a tradice",
    content: "Velikonoce na Slovácku jsou o tradicích a v MM BARBER ctíme tu nejdůležitější – vypadat skvěle. Duben je ve znamení čistých linií. Naši klienti z Uherského Ostrohu a Napajedel oceňují precizní fade, který vydrží i sváteční nápor. Barbershop v Mařaticích se stává centrem diskuzí o stylu i lokálním fotbale. Dubnová péče zahrnuje lehčí stylingové produkty, hlinky a pasty, které dodají vlasům přirozený matný vzhled. Jsme víc než jen holičství, jsme místo, kde tradice potkává moderní grooming."
  },
  {
    month: 4, // Květen
    title: "Květnová kronika: Svatby, styl a slunečné dny",
    content: "Květen je v Uherském Hradišti sezónou svateb a společenských akcí. V MM BARBER připravujeme ženichy i hosty na jejich velký den. Úprava vousů břitvou, precizní napařování a střih, který sklidí komplimenty v Buchlovicích i na Velehradě. Naše služby jsou vyhledávané pro svou spolehlivost a smysl pro detail. Květnové slunce už začíná hřát, proto doporučujeme profesionální kosmetiku s UV ochranou. V UH jsme synonymem pro špičkový servis, který vás nenechá ve štychu v žádné situaci."
  },
  {
    month: 5, // Červen
    title: "Červnový report: LFŠ a letní styl v MM BARBER",
    content: "Uherské Hradiště se v červnu připravuje na Letní filmovou školu (LFŠ). Město se naplní kulturou a my v MM BARBER plníme termíny těmi, kteří chtějí v ulicích zazářit. Letní střih vyžaduje odvahu – krátké boky, precizní fade a texturovaný vršek. Naši holiči v UH vědí, jak na to. Pokud parkujete u nemocnice nebo na Starém městě, zastavte se u nás v Mařaticích. Červen je ideální čas na experimenty s vizáží. Atmosféra našeho barberu v červnu tepe stejně jako srdce Slovácka."
  },
  {
    month: 6, // Červenec
    title: "Červencový zápisník: Prázdninová péče a relax v UH",
    content: "Léto je v plném proudu, teploty v Aquaparku Uherské Hradiště stoupají a v MM BARBER udržujeme chladnou hlavu. Červenec je o hydrataci. Sůl a chlór jsou pro vlasy zátěží, naše profesionální kosmetika jim ale vrátí sílu. Klienti z lokalit Vésky a Sady k nám jezdí pro osvěžující rituály. Pánský střih v červenci musí být praktický, abyste vypadali dobře i po dni stráveném u vody. Jsme váš přístav klidu v horkém městě, kde se čas na chvíli zastaví u sklenice vody a špičkového servisu."
  },
  {
    month: 7, // Srpen
    title: "Srpnová historie: Slavnosti vína a ostrá břitva",
    content: "Srpen v Uherském Hradišti graduje přípravami na Slovácké slavnosti vína a otevřených památek. V MM BARBER je to nejrušnější období roku. Každý chce mít svůj vous a vlas v dokonalém pořádku pro lidové tradice i moderní oslavy. Jsme hrdí na to, že můžeme být součástí identity mužů z UH a okolí. Srpen je o reprezentaci – ostré kontury, čistý krk a styl, který vzdává hold historii regionu. MM BARBER Mařatice je místem, kde se setkávají generace patriotů se společným cílem: vypadat co nejlépe."
  },
  {
    month: 8, // Září
    title: "Zářijový návrat: Konec léta a regenerace v barberu",
    content: "Září v Uherském Hradišti znamená návrat do režimu. Po prázdninových dobrodružstvích potřebují vlasy i vousy hloubkovou regeneraci. V MM BARBER diagnostikujeme stav vaší pokožky a navrhujeme optimální péči. Naši klienti, kteří pracují v centru UH nebo ve Starém Městě, oceňují rychlost a kvalitu našich služeb. Zářijový střih je o návratu k eleganci. Změna počasí vyžaduje přechod na výživnější produkty. My v Mařaticích víme, co váš styl potřebuje pro úspěšný start do podzimní sezóny."
  },
  {
    month: 9, // Říjen
    title: "Říjnový protokol: Podzimní nálada a plné vousy",
    content: "Říjen barví Slovácko do zlata a v MM BARBER sledujeme trend delších, plnějších vousů. Podzim v Uherském Hradišti vybízí k větší pozornosti k detailům. Naši holiči se soustředí na tvarování plnovousů tak, aby podtrhly charakter obličeje. Pokud hledáte útočiště před říjnovými plískavicemi, náš private club v Mařaticích je tou správnou volbou. Vůně santalového dřeva, horký čaj a precizní práce – to je naše definice podzimního relaxu. Říjen je časem pro budování silného, mužného vzhledu."
  },
  {
    month: 10, // Listopad
    title: "Listopadová kronika: Movember a osvěta v UH",
    content: "Listopad v MM BARBER patří knírům a mužskému zdraví. Movember v Uherském Hradišti podporujeme aktivně – nejen střihem, ale i radami o prevenci. Listopadový pánský střih je základem pro výrazný knír nebo upravené strniště. Naši klienti z Kunovic a Jarošova vědí, že v tomto měsíci jde o víc než jen o vzhled. Je to měsíc solidarity a stylu. V našem barbershopu v Mařaticích vytváříme komunitu, která se stará o své členy. Listopad je o hrdosti na to být mužem, který o sebe dbá."
  },
  {
    month: 11, // Prosinec
    title: "Prosincový závěr: Vánoce v UH a novoroční styl",
    content: "Prosinec v Uherském Hradišti je ve znamení trhů, rodiny a dárků. V MM BARBER připravujeme naše klienty na konec roku v tom nejlepším světle. Vánoční vouchery mizí z pultu stejně rychle jako volné termíny. Chcete vypadat ostře u štědrovečerní večeře i na Silvestra v centru UH? Rezervujte si svůj čas včas. Prosinec je měsícem bilancování a oslav. Děkujeme všem klientům ze Slovácka za důvěru v uplynulém roce. MM BARBER Mařatice je připraven vás dovést do nového roku s tím nejlepším střihem v celém kraji."
  }
];

export default function ZapisnikPage() {
  const router = useRouter();
  const { lang } = useTranslation();
  const [currentStory, setCurrentStory] = useState(SEO_STORIES[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const month = new Date().getMonth();
    const story = SEO_STORIES.find(s => s.month === month) || SEO_STORIES[0];
    setCurrentStory(story);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white selection:bg-mafia-gold selection:text-mafia-black py-24 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,20,1)_0%,rgba(0,0,0,1)_100%)]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      
      {/* Gold ambient glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-mafia-gold/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-mafia-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-[0.3em] mb-16 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Zpět na centrálu
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-mafia-gold/30"></div>
            <span className="text-mafia-gold font-mono text-[10px] uppercase tracking-[0.5em] font-black italic">Archivní zápisník v3.3</span>
            <div className="w-12 h-px bg-mafia-gold/30"></div>
          </div>

          <h1 className="text-4xl md:text-7xl font-heading font-black text-white uppercase tracking-tight mb-12 leading-tight">
            {currentStory.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 border-y border-white/5 py-12">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-mafia-gold/60 mb-1">
                <Book size={16} />
                <span className="font-mono text-[10px] uppercase tracking-widest font-black">Typ záznamu</span>
              </div>
              <p className="text-sm font-sans font-bold">SEO Kronika / Lokální Report</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-mafia-gold/60 mb-1">
                <Clock size={16} />
                <span className="font-mono text-[10px] uppercase tracking-widest font-black">Období</span>
              </div>
              <p className="text-sm font-sans font-bold uppercase">{new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(new Date())}</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-mafia-gold/60 mb-1">
                <MapPin size={16} />
                <span className="font-mono text-[10px] uppercase tracking-widest font-black">Lokalita</span>
              </div>
              <p className="text-sm font-sans font-bold">Uherské Hradiště - Mařatice</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-mafia-gold/20"></div>
            <div className="pl-8 text-xl md:text-2xl font-sans text-smoke-white/80 leading-relaxed italic first-letter:text-5xl first-letter:font-heading first-letter:font-black first-letter:text-mafia-gold first-letter:mr-3 first-letter:float-left">
              {currentStory.content}
            </div>
          </div>

          <div className="mt-24 p-8 bg-mafia-gold/5 border border-mafia-gold/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <History size={20} className="text-mafia-gold" />
              <h3 className="text-sm font-heading font-black text-mafia-gold uppercase tracking-widest">Metadata pro vyhledávače</h3>
            </div>
            <p className="text-[10px] font-mono text-smoke-white/40 leading-relaxed uppercase tracking-widest">
              Index_status: Active | Keywords: barbershop UH, pánský střih Uherské Hradiště, úprava vousů břitvou, holičství Slovácko, Tomáš Mička, MM BARBER Mařatice, skin fade Kunovice, Staré Město grooming, nejlepší barber Uherské Hradiště, kosmetika pro muže, styl 2026.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative side text */}
      <div className="fixed right-6 top-1/2 -rotate-90 origin-right translate-y-1/2 hidden xl:block">
        <span className="text-[8px] font-mono text-mafia-gold/10 uppercase tracking-[1em] whitespace-nowrap pointer-events-none">
          SYSTEM_ARCHIVE_ACTIVE_CONNECTION_ESTABLISHED
        </span>
      </div>
    </main>
  );
}
