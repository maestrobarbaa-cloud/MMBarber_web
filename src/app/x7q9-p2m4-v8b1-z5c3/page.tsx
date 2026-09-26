"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SecretOpenFreeMap } from "@/components/SecretOpenFreeMap";
import { useRouter } from "next/navigation";

// --- POZADÍ (Particles) ---
function SecretInteractiveParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    const particles: any[] = [];
    const numParticles = 40;
    const symbols = ['✂', '♛', '♦', '⚜', '♠', '★'];

    for (let i = 0; i < numParticles; i++) {
      const el = document.createElement('div');
      el.className = `absolute flex items-center justify-center text-mafia-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.8)]`;
      const size = Math.random() * 15 + 10;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.fontSize = `${size * 0.8}px`;
      el.style.opacity = (Math.random() * 0.4 + 0.3).toString();
      el.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
      container.appendChild(el);
      
      particles.push({
        element: el,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: - (Math.random() * 1.5 + 0.5),
        size,
        baseSpeedY: - (Math.random() * 1.5 + 0.5),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
      });
    }

    let mouseX = -1000, mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const handleMouseLeave = () => { mouseX = -1000; mouseY = -1000; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;
    const render = () => {
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rotation += p.rotationSpeed;
        if (p.y < -50) { p.y = window.innerHeight + 50; p.x = Math.random() * window.innerWidth; p.vx = (Math.random() - 0.5) * 0.5; }
        if (p.x < -50) p.x = window.innerWidth + 50;
        if (p.x > window.innerWidth + 50) p.x = -50;

        const dx = p.x - mouseX, dy = p.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          p.vx += (dx / distance) * force * 0.8;
          p.vy += (dy / distance) * force * 0.8;
          p.rotationSpeed += (dx > 0 ? 1 : -1) * force * 0.5;
        } else {
          p.vx *= 0.95; p.vy += (p.baseSpeedY - p.vy) * 0.05;
          p.rotationSpeed *= 0.98;
        }
        p.vx += Math.sin(p.y * 0.02) * 0.05;
        p.element.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`;
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />;
}

// --- DATA DIALOGŮ ---
type DialogueOption = {
  text: string;
  nextId: string | null;
  isEnd?: boolean;
};

type DialogueNode = {
  id: string;
  text: string;
  options: DialogueOption[];
  isEnd?: boolean;
  isInput?: boolean;
  hasReviewGenerator?: boolean;
};

const dialogueTree: Record<string, DialogueNode> = {
  "start": {
    id: "start",
    text: "No neříkej, že ses sem dostal omylem. Vypadáš, jako bys zrovna utekl hrobníkovi z lopaty. Co tu chceš? Mluv, než mi vystydne kafe.",
    options: [
      { text: "ZPOVĚĎ (Mám problém)", nextId: "confession" },
      { text: "HUMOR (Řekni vtip)", nextId: "joke" },
      { text: "ŠPINAVÁ PRÁCE (Schovat tělo)", nextId: "morava" },
      { text: "IDENTITA (Krycí jméno)", nextId: "alias" },
      { text: "STATUS (Jak na tom jsem?)", nextId: "status_ask" },
      { text: "LOKACE (Soukromé stříhárny)", nextId: "speakeasy" },
      { text: "RECENZE (Proč je nemám na webu)", nextId: "reviews" },
      { text: "NÁZOR NA NEJBLIŽŠÍ (Zrada)", nextId: "closest_start" },
      { text: "ŽENY (Jaká je dnešní realita)", nextId: "women_start" },
      { text: "VZTAHY (Dědův zápisník)", nextId: "relationships_start" },
      { text: "BYZNYS (Ředitelé a biče)", nextId: "business_start" },
      { text: "ŠKOLSTVÍ (Vysoké školy)", nextId: "school_start" },
      { text: "VÝCHOVA (Odkaz velkých lidí)", nextId: "mentors_start" },
      { text: "POLITIKA (Národní tragédie)", nextId: "politics_start" },
      { text: "SOCIÁLNÍ SÍTĚ (Citlivky na Instagramu)", nextId: "social_start" },
      { text: "MORÁLKA (Římané a slabý článek)", nextId: "romans_start" },
      { text: "CHARAKTER (Vzorce chování davu)", nextId: "character_start" },
      { text: "BÁSNÍK (Juliána z Tesca)", nextId: "poem_start" },
      { text: "BALADY (Nové zrození Máje)", nextId: "echoes_1" }
      // { text: "VZPOMÍNKY (Příběh dvou)", nextId: "go_to_story" }
    ]
  },
  "poem_start": {
    id: "poem_start",
    text: "Básně? No jasně. Možná vypadám jako rváč, ale ve skutečnosti jsem sakra dobrý básník a upravovač textů na dnešní dobu. Moje prababička mi kdysi vyprávěla jednu starou báseň. Juliána, krásná panna, tak nějak se to jmenovalo. Vyprávěla to možná o něco líp, ale já vzal ten text a upravil ho pro dnešní dobu. Chceš to slyšet?",
    options: [
      { text: "Schválně, ukaž tu moderní verzi.", nextId: "poem_modern_1" },
      { text: "A jak byla ta původní od prababičky?", nextId: "poem_original_1" }
    ]
  },
  "poem_modern_1": {
    id: "poem_modern_1",
    text: "1.\nJuliána krásná panna,\nprala prádlo u Tesca zrána.\nJeli tudy čtyři páni,\nvšichni čerstvě po rozchodu, sami.\n\n„Juliáno, pojeď s námi,\nna Tinderu jsme zklamáni.“\n„Já bych s vámi ráda jela,\nkam bych svého přítele dala?“",
    options: [
      { text: "Pokračuj.", nextId: "poem_modern_2" }
    ]
  },
  "poem_modern_2": {
    id: "poem_modern_2",
    text: "2.\n„Přítele můžeš opustiti,\nna Tinderu se přihlásiti.“\n„Jak bych já ho otrávila,\nkdyž jsem se to neučila?“\n\n„Jdi do města, tam jsou kluby,\ntam zapomeneš všechny sliby.\nV klubu najdeš zábavy dost,\nzapomeneš na svou starost.“\n\nŠla do města, našla kluby,\ntam už čekali čtyři páni.\nČtyři páni, samé řeči,\nkaždý hledal, která svědčí.",
    options: [
      { text: "Dál?", nextId: "poem_modern_3" }
    ]
  },
  "poem_modern_3": {
    id: "poem_modern_3",
    text: "3.\nPřítel z práce domů jede,\nna nohou se sotva vede.\n„Pojď, miláčku, pojď k obědu,\nmáme dneska něco z bufetu.“\n\n„Jaká je to divná bašta,\nže je bílá, divně mastná?“\n„To není ryba, to je tráva,\nco nám včera ještě zbyla.“",
    options: [
      { text: "A co pak?", nextId: "poem_modern_4" }
    ]
  },
  "poem_modern_4": {
    id: "poem_modern_4",
    text: "4.\nPo obědě hlava bolí,\n„Miláčku, zavaž mě jí.“\n„Jdi, miláčku, pro pivečko,\nať okřeje mé srdéčko.“\n\n„Vypij raději vodičku,\nať zhojíme tvou hlavičku.“\nPodala mu vody z louže,\n„Pij, miláčku, to pomůže.“",
    options: [
      { text: "To je drsný. Co bylo dál?", nextId: "poem_modern_5" }
    ]
  },
  "poem_modern_5": {
    id: "poem_modern_5",
    text: "5.\n„Přines, milá, poduštičku,\nať položím svou hlavičku.“\nPodala mu tvrdý kámen,\n„Spi, miláčku, s Kristem, ámen.“\n\n„Co se to jen se mnou děje?\nBěda, milá, zle je, zle je!“\nA když bylo po milování,\npřítel měl se k umírání.",
    options: [
      { text: "Zavolali doktora?", nextId: "poem_modern_6" }
    ]
  },
  "poem_modern_6": {
    id: "poem_modern_6",
    text: "6.\nA když bylo po večeři,\npřijeli tam tři doktoři.\n„Oj, vy páni lékařové,\nzachraňte mě, doktorové!“\n\n„Máte žádanku, či ne?“\n„Nemám.“ „Tak to nejde, ne.“\n„Bez ní vás tu nevezmeme,\nna pohotovost pošleme.“\n\n„Pojištění řádně platím,\nproč tu tedy život tratím?“\n„Bez objednání nejde léčit,\nmusíte se jinde svěřit.“",
    options: [
      { text: "To je hodně ze života... a konec?", nextId: "poem_modern_7" }
    ]
  },
  "poem_modern_7": {
    id: "poem_modern_7",
    text: "7.\nPřítele pak zachránili,\nJuliánu obvinili.\nNad přítelem lidi pláčou,\nnad Juliánou posměšky skáčou.\n\nJuliána, krásná panna,\npo městě i okrese známá.\nJejí pověst letí světem,\nz Tesca rovnou internetem.\n\nKaždý o ní povídá,\nco kde dělá, každý zná.",
    options: [
      { text: "A co z toho jako plyne za ponaučení?", nextId: "poem_modern_conclusion" }
    ]
  },
  "poem_modern_conclusion": {
    id: "poem_modern_conclusion",
    text: "Co z toho plyne? Jednoduché... stará ohraná klasika. S vlastním přítelem se už cítila spíš jen jako s kamarádem. Nechala se potetovat, nabarvit vlasy, udělat pořádné řasy a linky, jen aby ukázala světu, že je vážně něco, o co se lidi budou prát. Za jeho zádama jela bomby na Tinderu s partičkou borců, co byli čerstvě po rozchodu. A přitom to přece byla vždycky 'tak hodná holka', aspoň to její mamka říkala. Zkrátka stará klasika, když se chceš dobře prodat na trhu... a reklamačky se neberou. Mezitím se ale musela smířit s naprosto opačným osudem. Teď už si jen nalhává, že udělala ten správný krok. Ale pravda je taková, že ji to jednou semele, lidi totiž nezapomínají a ponese se to s ní celej její život.",
    options: [
      { text: "To dává smysl. A ta původní verze od prababičky?", nextId: "poem_original_1" },
      { text: "Složil jsi ještě něco?", nextId: "zpev_start" },
      { text: "Běž radši stříhat, Tome.", nextId: "poem_end" }
    ]
  },
  "poem_original_1": {
    id: "poem_original_1",
    text: "Tak poslouchej originál, Juliána krásná panna, od prababičky. Ta se s tím nemazala:\n\n1.\nJuliána krásná panna prala prádlo u Jordána.\nJeli tudy 4 páni, Juliáno pojeď s námi.\nJá bych s vámi ráda jela, kam bych bratra, sestru dala?\nSestru můžeš s sebou vzíti a bratříčka otráviti.",
    options: [
      { text: "A dál?", nextId: "poem_original_2" }
    ]
  },
  "poem_original_2": {
    id: "poem_original_2",
    text: "2.\nJak bych já ho otrávila, když jsem se to neučila?\nJdi do lesa jedlového, najdi hada jedového.\nNakrájej ho na na kousíčky, řekni že to jsou rybičky.\nŠla do lesa jedlového, našla hada jedového.",
    options: [
      { text: "Pokračuj.", nextId: "poem_original_3" }
    ]
  },
  "poem_original_3": {
    id: "poem_original_3",
    text: "3.\nBratříček už z lesa jede, jedlového dřeva veze,\nPojď bratříčku poď k obědu,máme dneska vzácnou rybu.\nJaká je to divná ryba, že ploutvičky hlavu nemá.\nHlavičku jsem posnídala a ploutvičky kočka vzala.",
    options: [
      { text: "Chudák bratr...", nextId: "poem_original_4" }
    ]
  },
  "poem_original_4": {
    id: "poem_original_4",
    text: "4.\nPo obědě hlava bolí, Juliano, zavaž mě jí.\nJdi sestřičko pro vínečko, ať okřeje mé srdéčko.\nVypij raději vodičku, ať zhojíme tvou hlavičku.\nPodala mu vody z louže, pij bratříčku, to pomůže.",
    options: [
      { text: "Co bylo pak?", nextId: "poem_original_5" }
    ]
  },
  "poem_original_5": {
    id: "poem_original_5",
    text: "5.\nPřines, sestro poduštičku, ať položím svou hlavičku.\nPodala mu tvrdý kámen, spi bratříčku, s Kristem pánem.\nCo se to jen se mnou děje, běda, sestro, zle je, zle je!\nA když bylo po klekání bratr měl se k umírání.",
    options: [
      { text: "Blíží se konec?", nextId: "poem_original_6" }
    ]
  },
  "poem_original_6": {
    id: "poem_original_6",
    text: "6.\nA když bylo po večeři, přijeli tam tři lékaři.\nOj, vy páni lékařové, probodněte srdce moje.\nTělo dejte pod kamení, ať ten oheň více není,\na z kamení do kostnice, ať ta bolest není více.",
    options: [
      { text: "Jak to dopadlo?", nextId: "poem_original_7" }
    ]
  },
  "poem_original_7": {
    id: "poem_original_7",
    text: "7.\nBratra ještě zachránili, Julianu oběsili.\nNad bratříčkem lidi pláčou, nad sestřičkou vrány skáčou.",
    options: [
      { text: "Tak ta moje verze je aspoň moderní. Měj se, Tome.", nextId: "poem_end" },
      { text: "Složil jsi k tomu tématu ještě něco dalšího?", nextId: "zpev_start" }
    ]
  },
  "poem_end": {
    id: "poem_end",
    text: "No, snad jsi ocenil mou poezii. Ale teď už fakt mazej, mám tu další práci. Zmiz.",
    options: [],
    isEnd: true
  },
  "zpev_start": {
    id: "zpev_start",
    text: "ZPĚV\n\nCo bývalo kdysi slovem „láska“,\nteď v jejích rtech znělo jako žal,\nz něžného snu zůstala vráska,\nkdyž každý z nich už jinam stál.\n\nPrý příliš chtěl a příliš chránil,\nprý svíral křídla, bránil v letu;\non všechno, co měl, jí odevzdal,\na přece byl prý vinou světa.\n\nZa její stopou kráčel dál,\nač každý krok ho uvnitř pálil,\nco včera pevně v rukou měl,\ndnes mezi prsty pomalu ztratil.\n\nJak poutník, který cestu ztratil\na přesto kráčí za světlem,\ntak v každém ránu znovu věřil,\nže včerejšek se vrátí sem.",
    options: [
      { text: "Pokračuj...", nextId: "zpev_2" }
    ]
  },
  "zpev_2": {
    id: "zpev_2",
    text: "Vždyť láska zvláštní zákon má —\nkdyž bolí, člověk zůstává;\nčím více srdce krvácí,\ntím méně síly odchází.\n\nA ona šla už jinou cestou,\nkde vedle ní šel někdo jiný;\non zůstal stát před vlastní bolestí,\njež neměla jména, neměla viny.\n\nPak spatřil ji — a vedle ní\nse cizí ruka dotýkala.\nV tom jediném krátkém setkání\nse celá minulost mu vzdala.\n\nNejvíc však nebolel ten muž,\njenž kráčel nyní vedle ní,\nspíš obraz, který vytvořila,\nv němž on byl vinou všeho zlého.",
    options: [
      { text: "To muselo bolet. Dál?", nextId: "zpev_3" }
    ]
  },
  "zpev_3": {
    id: "zpev_3",
    text: "Z muže, jenž chtěl jí život dát,\nse stal prý ten, kdo všechno ničí;\nz rukou, jež chtěly budoucnost stavět,\nse staly ruce, které svírají.\n\nA tak se ptal v té dlouhé noci,\nkde vlastně jejich cesta zhasla,\nkdy z „my“ se stalo pouhé „já“\na kde se ztratila jejich láska.\n\nKdy růže, kterou kdysi nesl,\nse proměnila v ostrý trn,\nkdy z toho krásného, co vzrostlo,\nzůstal jen stín a prázdný sen.\n\nOn chtěl jen stavět — kámen ke kameni,\npro jejich dům a budoucí čas;\nchtěl, aby měli vlastní zázemí,\naby se jednou svět usmál zas.",
    options: [
      { text: "A jak jí to vracela?", nextId: "zpev_4" }
    ]
  },
  "zpev_4": {
    id: "zpev_4",
    text: "Budoval firmu, budoval svůj sen,\nchtěl z práce vytvořit jejich štěstí,\na místo díků přišel chladný den\na slova ostrá jako hřebíky.\n\nKdyž nejvíc potřeboval její dlaň,\nkdyž sotva stál a docházel mu dech,\nona mu místo blízkosti dala jen zášť\na nechala ho samotného ve zdech.\n\nTak zůstal sám — a kolem ticho,\njen nedokončený sen před ním stál;\nco mělo být kdysi jejich „zítra“,\nteď jako cizí dům tam stálo dál.\n\nŠel vzhůru sám, krok za krokem,\nbez cizí ruky, bez podpory;\nzatímco ona jiným směrem\nsi stavěla své nové obzory.",
    options: [
      { text: "Rozdělily se cesty...", nextId: "zpev_5" }
    ]
  },
  "zpev_5": {
    id: "zpev_5",
    text: "Jejich sny jak listí větrem vzlétly,\nroznesly se po krajině dál;\nco spolu kdysi pevně spletli,\nčas beze slova rozerval.\n\nA ona změnila svou tvář —\nnové vlasy, nové znamení,\nna kůži vepsaný nový řád,\nnový způsob vlastního vidění.\n\nChtěla být ženou velkých gest,\ntou, která světu ukáže svou sílu,\nchtěla už kráčet bez starých cest\na minulost nechat za svou vírou.\n\nJen pod tím obrazem, pod novou tváří,\nse život neptá, kdo jsi chtěla být;\nsvětlo se může odrážet v záři,\na přesto člověk může uvnitř hnít.",
    options: [
      { text: "A on na to všechno jen koukal?", nextId: "zpev_6" }
    ]
  },
  "zpev_6": {
    id: "zpev_6",
    text: "I ta, co stála kdysi blízko,\njednoho dne zmizela z jejího světa;\nco bývalo poutem, stalo se nízkým,\njakmile přešla další léta.\n\nA on se vrátil v myšlenkách zpět,\ntam, kde ještě všechno bylo prosté,\nkde jeden smích byl celý svět\na z malých chvil se štěstí rostlo.\n\nVzpomněl si na tu růži v dlani,\nna klíček, kterým ji kdysi rval,\nna dívku stojící při svítání,\nna život, který s ní plánoval.\n\nA najednou mu bylo jasné,\nže některé věci nejdou vrátit,\nže člověk může změnit tvář,\na přesto něco v něm navždy ztratit.",
    options: [
      { text: "Silný příběh.", nextId: "zpev_7" }
    ]
  },
  "zpev_7": {
    id: "zpev_7",
    text: "Tak dlouho ji nosil v očích,\naž zapomněl, že čas umí brát;\nže z toho, co bývalo nejbližší,\nmůže se stát někdo, koho nepoznáš.\n\nA v tiché noci, bez svědků,\nkdyž měsíc kreslil stín na stěnu,\nse vracel k jediné myšlence,\njež bolela víc než všechno předtím:\n\nKde zmizela ta dívka, kterou znal?\nTa, co se smála nad tou růží?\nKde se ten krásný příběh rozpadal —\na kdo jim zavřel dveře k jejich „my“?\n\nA pak už jenom v duchu řekl,\nbez zloby, která kdysi pálila:\n\n„Tak krásná byla, když jsem ji poznal…\nkdy se ta dívka vlastně změnila?“",
    options: [
      { text: "A dál?", nextId: "zpev_8" }
    ]
  },
  "zpev_8": {
    id: "zpev_8",
    text: "A noc mu neřekla nic.\n\nJen vítr prošel kolem oken,\njak prochází kolem člověka čas,\na někde hluboko pod tím vším\nzůstal ten první společný hlas.",
    options: [
      { text: "To je všechno? Běž stříhat, Tome.", nextId: "poem_end" }
    ]
  },
  "speakeasy": {
    id: "speakeasy",
    text: "Hledej, turisto. Ptej se místních na soukromé stříhárny. Pocestní ti poradí. Pamatuj na krédo Bratrstva... Pracujeme v temnotě, abychom sloužili světlu.",
    options: [
      { text: "Otevřít mapu úkrytů", nextId: "show_map" }
    ]
  },
  "reviews": {
    id: "reviews",
    text: "Já nedávam recenze na web pane, protože můj bratr z Kalkaty umět napsat tisíc recenze za pět dolarů. Všechny být pět hvězdiček, velmi dobrý servis, velký spokojenost! On mít sto počítač a dělat klik klik klik. Proč já platit za falešný chvála, když moje nůžky mluvit samy za sebe?",
    options: [],
    isEnd: true,
    hasReviewGenerator: true
  },
  "status_ask": {
    id: "status_ask",
    text: "Status? Chceš vědět, kam patříš v potravním řetězci? Dobrá. Ale napřed mi řekni, čím se vůbec živíš, frajere?",
    options: [
      { text: "Jsem Barber", nextId: "status_anim" },
      { text: "Jsem Manažer", nextId: "status_anim" },
      { text: "Jsem Student", nextId: "status_anim" },
      { text: "Dělám něco jinýho", nextId: "status_anim" }
    ]
  },
  "status_explanation_barber": {
    id: "status_explanation_barber",
    text: "Proč pod hnojem? Stříhat vlasy umí každej trouba. Skutečnej byznys se dělá v zákulisí s velkejma prachama. Ale nezoufej, někdo mi tu ofinku zastřihnout musí.",
    options: [],
    isEnd: true
  },
  "status_explanation_manager": {
    id: "status_explanation_manager",
    text: "Manažer? Znáš ten vtip, jak přijde manažer do baru a... vlastně žádnej není, protože jste všichni strašně nudní. Jsi pod hnojem, protože hnůj má aspoň nějaký reálný využití na poli.",
    options: [],
    isEnd: true
  },
  "status_explanation_student": {
    id: "status_explanation_student",
    text: "Student? Někdo ten hnůj prostě kydat musí. Každej musí nějak začít, mladej. Až dostuduješ a vyroste ti plnovous, možná tě povýším na zkušební lopatu.",
    options: [],
    isEnd: true
  },
  "status_explanation_other": {
    id: "status_explanation_other",
    text: "Něco jinýho? Když ani ty nevíš, co jsi pořádně zač, jak tě můžu zařadit jinam než na úplný dno? Buď rád, že jsi vůbec na seznamu.",
    options: [],
    isEnd: true
  },
  "joke": {
    id: "joke",
    text: "Vtip? Já ti vypadám jako nějakej klaun z poutě? Ale budiž, jeden z oboru ti řeknu. Víš, proč si mafiáni nikdy nestěžují u holiče?",
    options: [
      { text: "Protože mají přirozený respekt?", nextId: "joke_respect" },
      { text: "Protože holič drží břitvu na jejich krku?", nextId: "joke_razor" }
    ]
  },
  "joke_respect": {
    id: "joke_respect",
    text: "Ne, ty chytrolíne. Protože když se jim nelíbí sestřih, z holičství se stane pizzerie. Haha! No nic, radši už běž, mám tu práci.",
    options: [],
    isEnd: true
  },
  "joke_razor": {
    id: "joke_razor",
    text: "Přesně tak! Jediný člověk, kterýmu Don dobrovolně svěří svůj krk, je ten s nabroušenou břitvou. A teď už mazej, než mi z tebe vyschne v krku.",
    options: [],
    isEnd: true
  },
  "alias": {
    id: "alias",
    text: "Krycí jméno? Dobře. Vypadáš naprosto tuctově. Odteď seš 'Jarda, co minulej čtvrtek u samoobslužný kasy zapomněl pípnout rohlíky'. Je to tak blbý, že je to absolutně neprůstřelný. Nikoho nenapadne tě hledat. A teď už běž.",
    options: [],
    isEnd: true
  },
  "confession": {
    id: "confession",
    text: "Vyzpovídat se? Na to tu máme kostel. Ale budiž, mám zrovna dobrou náladu. Co ti leží na srdci, chlapče? Vyklop to všechno, poslouchám.",
    options: [],
    isInput: true
  },
  "confess_1": {
    id: "confess_1",
    text: "Hele, to je těžký... Ale jak říkával můj děda: Když tě něco trápí, dej si pořádnej guláš se šesti. Problém to sice nevyřeší, ale s plným břichem se líp přemýšlí.",
    options: [],
    isEnd: true
  },
  "confess_2": {
    id: "confess_2",
    text: "Chápu tě. Život je občas jak jízda v autě s prasklou gumou. Ale pamatuj – když tě někdo fakt štve, prostě mu schovej nabíječku na mobil. To je dneska horší než italská vendeta.",
    options: [],
    isEnd: true
  },
  "confess_3": {
    id: "confess_3",
    text: "Slyším tě. Ale upřímně? Prostě nad tím mávni rukou. Stres dělá vrásky a přes vrásky se špatně holí krk. Takže se usměj a hoď to za hlavu.",
    options: [],
    isEnd: true
  },
  "confess_4": {
    id: "confess_4",
    text: "Zajímavý... Velmi zajímavý. Ale víš ty co? Zkus to zresetovat. Ne počítač, ale sebe. Běž na pivo, pusť si fajn film a zítra je taky den.",
    options: [],
    isEnd: true
  },
  "morava": {
    id: "morava",
    text: "Morava? Děláš si prdel? Tam je v létě vody po kotníky a na každým metru čumí nějakej rybář. Leda bys to chtěl maskovat jako trofejního sumce. A pískovna v Ostrožský už je beztak plná mých... nepovedených experimentů.",
    options: [
      { text: "Tak to zakopem někde ve vinohradu pod Buchlovem.", nextId: "morava_wine" },
      { text: "Tak nevím. Co to nechat prostě na Masarykově náměstí lavičce?", nextId: "morava_square" }
    ]
  },
  "morava_wine": {
    id: "morava_wine",
    text: "Vinohrad pod Buchlovem... konečně mluvíš jako pravej chlap ze Slovácka. Kvalitní hnojivo je základ dobrýho Rulandskýho. Běž pro rýč a já zavolám chlapům, ať nastartujou dodávku.",
    options: [],
    isEnd: true
  },
  "morava_square": {
    id: "morava_square",
    text: "Na Masarykáči? Jo, a rovnou tomu dáme do ruky kornout zmrzliny, ať je nenápadnej, ne? Ty seš blbější než vypadáš. Zmiz, než si to rozmyslím a udělám z tebe krmení pro holuby na vlakovým nádraží.",
    options: [],
    isEnd: true
  },
  "closest_start": {
    id: "closest_start",
    text: "Ptáš se, jaký mám názor na nejbližší? Poslouchej pozorně. Zrada od těch nejbližších bolí ze všeho nejvíc. Můžou stát roky po tvém boku, ale právě na ně si musíš dát ten největší pozor.",
    options: [
      { text: "Copak se na tyhle věci časem nezapomene?", nextId: "closest_time" },
      { text: "Proč tě podrazí zrovna oni?", nextId: "closest_why" }
    ]
  },
  "closest_time": {
    id: "closest_time",
    text: "Jasně, snaží se svoje zrady maskovat. Obhájit to tím, že už je to dávno. Ale takhle tenhle svět nefunguje! Svoje činy nezamaskují. Lidi zjistí skutečnou pravdu a vzpomenou si i po mnoha letech, protože ta pravda vyjde najevo. Obzvlášť to poznají ti, kteří u toho tehdy byli a viděli, jak to doopravdy bylo.",
    options: [
      { text: "Takže spravedlnost je nakonec dožene?", nextId: "closest_consequences" }
    ]
  },
  "closest_why": {
    id: "closest_why",
    text: "Víš, co je na tom to nejkrásnější? Zradí tě často těsně před tím, než se odehraje něco velkého. Podcení tě. Netuší, do čeho se pouští, a tímhle si sami v podstatě vykopali hrob.",
    options: [
      { text: "A co se stane, když se ta pravda ukáže?", nextId: "closest_consequences" }
    ]
  },
  "closest_consequences": {
    id: "closest_consequences",
    text: "Pak se to na určitých místech rozkřikne a s dotyčnýma se to už jen veze. Už nemají kam utéct před svou pověstí. Kdyby měli aspoň trochu rozumu, tak by pro ně bylo nejlepší změnit lokaci a odstěhovat se někam hodně, hodně daleko.",
    options: [
      { text: "Máš k tomu nějaký vlastní citát?", nextId: "closest_quote" },
      { text: "Drsný, ale pravdivý. Díky, Tome.", nextId: "closest_end" }
    ]
  },
  "closest_quote": {
    id: "closest_quote",
    text: "Mám. Zapiš si to za uši: 'Největší tmu nezažiješ, když zhasne slunce, ale když tě stínem zakryje ten, komu jsi celou dobu svítil na cestu.'... A teď už běž, tohle zamyšlení mě stojí moc času.",
    options: [],
    isEnd: true
  },
  "closest_end": {
    id: "closest_end",
    text: "Není zač. Ber to jako lekci k nezaplacení. Dávej si pozor na to, koho si pouštíš blízko k tělu. A teď už zmiz.",
    options: [],
    isEnd: true
  },
  "women_start": {
    id: "women_start",
    text: "Ptáš se na dnešní vztahy a realitu? Zlatý časy, kdy lidi uměli ocenit opravdovost, se dneska ztrácí v záplavě povrchnosti na sociálních sítích.",
    options: [
      { text: "Jak to přesně myslíš?", nextId: "women_reality" },
      { text: "Snad nejsou všichni stejní, ne?", nextId: "women_exception" }
    ]
  },
  "women_reality": {
    id: "women_reality",
    text: "Dneska spousta lidí hledá spíš dokonalou iluzi na Instagram než reálnýho partnera. Všechno je to o pozlátku a nerealistických očekáváních. Ale když přijde na to stát po boku toho druhýho, když jde opravdu do tuhýho a je potřeba zabrat... najednou jich spousta raději vycouvá.",
    options: [
      { text: "Takže co s tím má chlap dělat?", nextId: "women_solution" }
    ]
  },
  "women_exception": {
    id: "women_exception",
    text: "Neříkám, že jsou všechny stejný. Pořád se najdou ty pravý, co vědí, co je to loajalita a neřeší jenom značky kabelek. Ale najít takovou je dneska jako hledat jehlu v kupce sena. A ještě k tomu potmě a na minovým poli.",
    options: [
      { text: "Máš nějakou radu, jak ji poznat?", nextId: "women_solution" }
    ]
  },
  "women_solution": {
    id: "women_solution",
    text: "Moje rada? Nenech se opít rohlíkem a nevymaž si mozek hned první hezkou tvářičkou. Ženská do nepohody se pozná podle toho, že se s tebou nebojí brodit blátem, když se nedaří. Nejen se vézt, když svítí sluníčko.",
    options: [
      { text: "Máš k tomu zase nějakej svůj citát?", nextId: "women_quote" },
      { text: "Díky za pohled na věc, Tome.", nextId: "women_end" }
    ]
  },
  "women_quote": {
    id: "women_quote",
    text: "Jasně. 'Krása ti sice otevře všechny dveře, ale jestli za nima vydržíš, záleží jen na tom, jestli uvnitř nejsi úplně prázdná.'... A teď už fakt mazej, začínám tu být z tebe nějakej sentimentální.",
    options: [],
    isEnd: true
  },
  "women_end": {
    id: "women_end",
    text: "Pamatuj si to. Chlap, co si nechá diktovat život, není chlap, ale rohožka. Měj svou hrdost a nenech sebou mávat. A teď už fakt vypadni, mám práci.",
    options: [],
    isEnd: true
  },
  "relationships_start": {
    id: "relationships_start",
    text: "Chceš mluvit o vztazích? O tom, jak to mezi lidma chodí? Hele, já ti řeknu jedno tajemství. Není v tom žádná věda, žádný složitý rovnice. Je to mnohem prostší, než se zdá.",
    options: [
      { text: "Tak povídej, jsem jedno ucho.", nextId: "relationships_grandpa" },
      { text: "Prostší? Dneska mi lidi přijdou hrozně složití.", nextId: "relationships_simple" }
    ]
  },
  "relationships_simple": {
    id: "relationships_simple",
    text: "Složití? To si jen myslíš, protože spousta lidí dneska hraje hry a nosí masky. Ale když to osekáš až úplně na dřeň, zbyde ti jen jedno jediný pravidlo.",
    options: [
      { text: "A to je jaký pravidlo?", nextId: "relationships_grandpa" }
    ]
  },
  "relationships_grandpa": {
    id: "relationships_grandpa",
    text: "Můj děda měl takovej starej otřískanej zápisník. Nosil ho neustále u sebe. Jednou mi z něj přečetl jednu větu. Zněla přesně takhle: 'Jak se chováš k lidem, lidé se budou chovat k tobě.' Je to jak bumerang, mladej. Všechno, co vypustíš do světa, se ti vrátí i s úrokama.",
    options: [
      { text: "To zní spravedlivě. Ale co ti, co pořád dělají podrazy?", nextId: "relationships_karma" },
      { text: "Takže když budu na všechny hodný, tak se mi to vrátí?", nextId: "relationships_naive" }
    ]
  },
  "relationships_karma": {
    id: "relationships_karma",
    text: "Ti, co dělají podrazy? Na ty si taky dojde. Možná to nebude hned zítra. Možná to potrvá roky. Ale ten účet jim život jednou vystaví a bude zatraceně tučnej. Věř mi, tenhle systém ještě nikoho neomluvil.",
    options: [
      { text: "Díky za připomenutí, Tome.", nextId: "relationships_end" }
    ]
  },
  "relationships_naive": {
    id: "relationships_naive",
    text: "Hodný? Neřekl jsem, abys byl slaboch nebo něčí rohožka. Chovat se slušně a s respektem neznamená, že ze sebe necháš dělat hlupáka. Znamená to dát respekt tam, kde si ho lidé zaslouží. A umět tvrdě zabouchnout dveře před těmi, co to zneužívají.",
    options: [
      { text: "Díky za upřímnost, Tome.", nextId: "relationships_end" }
    ]
  },
  "relationships_end": {
    id: "relationships_end",
    text: "Jenom si na ten dědův zápisník občas vzpomeň. A teď mě už omluv, mám tu další klienty, co potřebují srovnat fazónu... a někteří i ten život. Zmiz.",
    options: [],
    isEnd: true
  },
  "business_start": {
    id: "business_start",
    text: "Úspěch v byznysu? Setkal jsem se s lidma, co měli za sebou fakt velký věci. Ředitelé obřích firem. Ani jeden z nich se nepotřeboval předvádět na Instagramu jako ti špatně placení herci s půjčenýma autama.",
    options: [
      { text: "Ale spousta ředitelů se dneska ráda ukazuje.", nextId: "business_directors" }
    ]
  },
  "business_directors": {
    id: "business_directors",
    text: "Jo, jenže to nejsou praví lídři. Ti aktuální ředitelé mi často připadají jako přerostlá malá děcka. A popravdě, většinou mají ze mě strach. A to naprosto oprávněně.",
    options: [
      { text: "Proč se tě bojí?", nextId: "business_whip" }
    ]
  },
  "business_whip": {
    id: "business_whip",
    text: "Jednou jsem se jich zeptal, jak vedou svý lidi, když jde do tuhýho. A víš, co mi ukázali? Tabulky, grafy a nějaký dotazníky spokojenosti. Navrhl jsem jim, ať ty papíry spálí a zkusí se radši bavit s lidma narovinu. Dát jim zodpovědnost a přestat je vodit za ručičku.",
    options: [
      { text: "A jak reagovali?", nextId: "business_egypt" }
    ]
  },
  "business_egypt": {
    id: "business_egypt",
    text: "Zbledli, jako by viděli ducha. Dnešní manažeři se totiž osobní zodpovědnosti a přímýho jednání bojí víc než čert kříže. Radši se schovají za procesy. Lídr bez odvahy je jenom ouřada s hezkou vizitkou. A od tý doby je radši nepotkávám. Zmiz.",
    options: [],
    isEnd: true
  },
  "school_start": {
    id: "school_start",
    text: "Vysoký školy a princip dnešní výchovy? Je to úplně ujetý. Moc dobře vím, jak se tam ve skutečnosti točí penízky, jen aby si ti nahoře udrželi svoje pohodlný statusy.",
    options: [
      { text: "Ale doktoráty přece mají nějakou hodnotu, ne?", nextId: "school_doctorate" }
    ]
  },
  "school_doctorate": {
    id: "school_doctorate",
    text: "Hodnotu? Spousta těch jejich doktorátů plodí jenom totální nesmysly a lidi nepoužitelný do reálnýho provozu. Papír ti mozek do hlavy nenaleje. A jestli si myslíš něco jinýho, seš naivní. Běž pryč.",
    options: [],
    isEnd: true
  },
  "mentors_start": {
    id: "mentors_start",
    text: "Když už se bavíme o výchově... Mě vychovali velcí lidé. Kapacity, co za sebou něco zanechaly. Ale víš, co je na tom to nejtěžší?",
    options: [
      { text: "Co to je?", nextId: "mentors_value" }
    ]
  },
  "mentors_value": {
    id: "mentors_value",
    text: "Že člověk až po delším čase začne doopravdy chápat jejich význam a tu skutečnou hodnotu. Až zpětně ti dojde, co vlastně dokázali vybudovat, i když to hromada lidí kolem nich dodneška ani nevidí.",
    options: [
      { text: "K tomu asi člověk musí dozrát.", nextId: "mentors_end" }
    ]
  },
  "mentors_end": {
    id: "mentors_end",
    text: "Přesně. Člověk k tomu musí dorůst a zažít si svý. Jinak je to jenom házení perel sviním. A teď mě už nech na pokoji, mám tu důležitější věci na práci.",
    options: [],
    isEnd: true
  },
  "politics_start": {
    id: "politics_start",
    text: "Politika? K tomuhle cirkusu se radši ani nechci moc vyjadřovat. Celej ten dnešní systém je k pláči. To už se fakt nedá nazývat nějakým úspěchem.",
    options: [
      { text: "A jak to teda vidíš?", nextId: "politics_tragedy" }
    ]
  },
  "politics_tragedy": {
    id: "politics_tragedy",
    text: "Dneska se jedná spíš o jednu velkou národní tragédii. Místo toho, aby to tu šlapalo, se to celý řítí z útesu a ti nahoře u toho s úsměvem stříhají pásky. Hromada lidí to jasně vidí, co se děje. Ne nadarmo bych ti tu s chutí odcitoval Farmu zvířat.",
    options: [
      { text: "Všichni jsou si rovni, ale někteří rovnější?", nextId: "politics_pockets" }
    ]
  },
  "politics_pockets": {
    id: "politics_pockets",
    text: "Přesně. A to platí dvojnásob, když jdou prachy hezky bokem do správný kapsy. Všichni přece jedou s tou stejnou naivní myšlenkou: 'Však o tom se přece nikdo nikdy nedozví'.",
    options: [
      { text: "Důkazy ale vždycky nějaké zbudou, ne?", nextId: "politics_shredders" }
    ]
  },
  "politics_shredders": {
    id: "politics_shredders",
    text: "Na důkazy a papíry tu máme tenhle krásnej vynález... skartovačky a zmizíky. Dřív se to aspoň pálilo, ale to dělalo moc kouře. Dneska? Dneska se ty nejdůležitější spisy prostě ztratí během 'běžného úklidu'.",
    options: [
      { text: "To jim vážně prochází?", nextId: "politics_covers" }
    ]
  },
  "politics_covers": {
    id: "politics_covers",
    text: "Prochází. A víš proč? Protože ruka ruku myje a nikdo nechce být ten, kdo to začne řešit. Alibismus na nejvyšší úrovni. Radši dělají, že se ty dokumenty snad samy odnesly do sběru. A teď už mazej, než nás začne někdo odposlouchávat.",
    options: [],
    isEnd: true
  },
  "social_start": {
    id: "social_start",
    text: "Sociální sítě... Dneska jsou na sebe lidi strašně citliví. Zejména sami k sobě. Pořád se někde hledají na Instagramu a myslí si, že jim to dá smysl života.",
    options: [
      { text: "Takže jim jde jenom o falešnou pozornost?", nextId: "social_instagram" }
    ]
  },
  "social_instagram": {
    id: "social_instagram",
    text: "Přesně tak. A víš, co je to nejvtipnější zrcadlo? Krásně se ukazuje, o co jim ve skutečnosti jde, už jen podle těch čísel – kolik lidí sledují oni a kolik lidí naopak sleduje je. To je měřítko jejich hodnoty, to na ně působí a formuje to jejich mozek. Tragikomedie.",
    options: [],
    isEnd: true
  },
  "romans_start": {
    id: "romans_start",
    text: "Dnešní lidi, chlapi, ženský... víš co? Od dob starých Římanů jsme se vlastně mentálně nikam moc neposunuli.",
    options: [
      { text: "Jak to myslíš? Máme přece technologie.", nextId: "romans_chain" }
    ]
  },
  "romans_chain": {
    id: "romans_chain",
    text: "Technologie ti morálku a páteř nenarovnají. Pořád totiž záleží na tom jednom nejslabším článku. Všechno pramení už od rodiny. A když máš v základu jen jeden jedinej slabej článek, začne se ti trhat celej řetěz. Je naprosto jedno, jestli je to rodina, tvoje firma, nebo římská legie.",
    options: [
      { text: "Takže chybí pevný základ?", nextId: "romans_discipline" }
    ]
  },
  "romans_discipline": {
    id: "romans_discipline",
    text: "Chybí disciplína a morálka! A to nejhorší? Lidi se dneska absolutně neumí omluvit. Udělají botu, ale chybí jim základní slušnost říct 'byla to moje chyba, omlouvám se za svoje činy'. Místo toho radši hledají miliony výmluv a svou vlastní odpovědnost okamžitě shazují na všechny okolo. Svět je prostě plnej alibistů, co si neumí zamést před vlastním prahem. A teď už mazej.",
    options: [],
    isEnd: true
  },
  "character_start": {
    id: "character_start",
    text: "Víš, co mě po těch letech strávených pozorováním naprosto fascinuje? Že se u naprosté většiny lidí v určitých situacích pokaždé aktivují naprosto stejné vzorce chování.",
    options: [
      { text: "Jaké vzorce máš přesně na mysli?", nextId: "character_patterns" }
    ]
  },
  "character_patterns": {
    id: "character_patterns",
    text: "Stačí, aby něco viděli u ostatních. Ať už nějakou novou blbost, nějakou pózu, nebo naopak zdánlivou zkratku k úspěchu. A najednou cvak! Aktivuje se to a všichni se do jednoho začnou chovat naprosto stejně. Bez rozmyslu. Kopírují se jako ovce.",
    options: [
      { text: "Copak lidem už úplně chybí vlastní identita?", nextId: "character_strong" }
    ]
  },
  "character_strong": {
    id: "character_strong",
    text: "Téměř ano. Opravdový a pevný charakter si totiž udrží jen těch pár nejsilnějších jedinců. Ti, co se nenechají strhnout tím davem a drží si svůj vlastní kurz navzdory tomu, že kolem nich všichni blázní. Snaž se mezi ně patřit taky. A teď mě omluv, mám tu něco na práci.",
    options: [],
        isEnd: true
  },
  "echoes_1": {
    id: "echoes_1",
    text: "Byl jsem svědkem mnoha lidských příběhů. Příběhů, které člověka někdy jen pohladí, jindy znejistí, a některé v něm zůstanou ještě dlouho poté, co jejich poslední věta dozněla. O mnoha baladách a tragických příbězích jsme se učili už ve škole. Četli jsme o lásce, zradě, vině, touze, bolesti i o rozhodnutích, která už nejdou vzít zpět.",
    options: [
      { text: "Dneska už je to jiné, ne?", nextId: "echoes_2" }
    ]
  },
  "echoes_2": {
    id: "echoes_2",
    text: "Člověk si tehdy říká, že jsou to příběhy dávných časů, vytvořené básníky a spisovateli. Že patří do knih a do minulosti. Netušil jsem však, že jednou budu stát tak blízko příběhům, které jako by vystoupily ze stránek těch známých děl — jen dostaly nový nádech, nové kulisy a kabát jednadvacátého století.",
    options: [
      { text: "Máš nějaký konkrétní příklad?", nextId: "echoes_3" }
    ]
  },
  "echoes_3": {
    id: "echoes_3",
    text: "Byl jsem svědkem jakéhosi nového zrození Máje. Ne toho ze školních lavic, ale Máje dnešního světa. Místo dávných cest a lesů tu máme sociální sítě a společnost, ve které se všechno děje mnohem rychleji, než stačíme pochopit následky vlastních činů. A přesto se v člověku stále odehrávají ty stejné věci. Láska. Žárlivost. Zrada.",
    options: [
      { text: "Co se přesně stalo?", nextId: "echoes_4" }
    ]
  },
  "echoes_4": {
    id: "echoes_4",
    text: "Jedním z těch příběhů byl příběh teprve dvacetiletého chlapce. Který věřil své přítelkyni. Jenže ona chodila za jinými a nakonec svedla dokonce otce svého mladého přítele. Kdybych podobný příběh četl v knize, řekl bych si, že je to až příliš neuvěřitelné. Jenže život žádného autora nepotřebuje.",
    options: [
      { text: "To je šílený. Co s tím ale chceš dělat?", nextId: "echoes_5" }
    ]
  },
  "echoes_5": {
    id: "echoes_5",
    text: "A právě proto si říkám, že bychom možná mohli začít tyto příběhy znovu vyprávět. Ne proto, abychom jejich aktéry soudili, ale abychom pochopili, co se v lidech odehrává. Vzít starou baladu a dát jí nový kabát. Nechat Máj promluvit jazykem jednadvacátého století.",
    options: [
      { text: "Takže z toho bude nová sbírka?", nextId: "echoes_6" }
    ]
  },
  "echoes_6": {
    id: "echoes_6",
    text: "Třeba jednou všechny tyto příběhy poskládáme vedle sebe. Vznikne tak nová sbírka balad našeho času. Protože možná právě tam, kde končí stránky starých knih, začínají nové příběhy. Jen dnes mají jiný svět, jiná jména a jiný kabát... Ale lidské srdce zůstává překvapivě stejné.",
    options: [
      { text: "Složil jsi k tomu tématu něco?", nextId: "zpev_start" },
      { text: "Silný. Radši půjdu, Tome.", nextId: "poem_end" }
    ]
  }
};

// --- KOMPONENTY PRO DIALOG ---
const TypewriterText = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    let currentIndex = 0;
    let isFinished = false;
    
    const intervalId = setInterval(() => {
      if (isFinished) return;
      
      setDisplayedText(text.substring(0, currentIndex + 1));
      currentIndex++;
      
      if (currentIndex >= text.length) {
        isFinished = true;
        clearInterval(intervalId);
        // Prodleva 1.2 sekundy po dopsání textu, než naskočí možnosti (aby si to hráč stihl dočíst)
        setTimeout(() => {
          onComplete();
        }, 1200);
      }
    }, 35); // Rychlost psaní

    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return <span>{displayedText}</span>;
};

const BigHierarchyAnimation = ({ profession, onComplete }: { profession: string; onComplete: () => void }) => {
  const items = [
    { title: "BŮH (Kmotr)", scale: 2 },
    { title: "CAPO (Šéf)", scale: 1.5 },
    { title: "PĚŠÁK", scale: 1 },
    { title: "HNŮJ", scale: 0.8 },
    { title: `TY (${profession.toUpperCase()})`, scale: 0.5, color: "text-red-500" }
  ];

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden font-heading text-mafia-gold">
      <motion.div 
        initial={{ y: "50vh" }}
        animate={{ y: "-240vh" }}
        transition={{ duration: 5, ease: "easeInOut" }}
        className="flex flex-col items-center gap-[40vh] pt-[50vh]"
      >
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <motion.h1 
              style={{ scale: item.scale }}
              className={`text-5xl md:text-7xl font-black uppercase tracking-widest text-center ${item.color || "text-mafia-gold"}`}
            >
              {item.title}
            </motion.h1>
            {idx < items.length - 1 && (
              <div className="h-[40vh] border-l-4 border-dashed border-mafia-gold/30 my-8 flex items-center justify-center relative">
                <div className="absolute bottom-0 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-mafia-gold/30 translate-y-full" />
              </div>
            )}
          </div>
        ))}
      </motion.div>

      <AnimatePresence>
        {showButton && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onComplete}
            className="absolute bottom-10 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest uppercase text-xl rounded shadow-[0_0_40px_rgba(255,0,0,0.5)] z-[101] transition-colors"
          >
            Proč jsem zařazen tady?!
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReviewGenerator = () => {
  const [reviews, setReviews] = useState<{name: string, text: string, stars: number}[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const generateReview = () => {
    const firstNames = [
      "Arjun", "Raj", "Vikram", "Sanjay", "Amit", // Indian
      "Hans", "Klaus", "Dieter", "Wolfgang", // German
      "Giovanni", "Luigi", "Mario", "Marco", // Italian
      "John", "Michael", "David", "James", // English
      "Pavel", "Karel", "Jozef", "Dežo", "Milan" // CZ/SK
    ];
    const lastNames = [
      "Patel", "Kumar", "Sharma", "Singh", // Indian
      "Müller", "Schmidt", "Wagner", "Becker", // German
      "Rossi", "Russo", "Ferrari", "Esposito", // Italian
      "Smith", "Johnson", "Williams", "Brown", // English
      "Novák", "Kováč", "Procházka", "Lakatoš", "Horváth" // CZ/SK
    ];
    
    // Procedural generation parts
    const intros = [
      "Můj bratr říkat pravda.",
      "Očen charašo servis pane!",
      "Tohle být úplně nejlepší místo na světě.",
      "Velmi kvalitní práce.",
      "Moje rodina být velmi spokojená.",
      "Nejlepší podnik v celém regionu.",
      "Dlouho jsem hledat dobrý střih.",
      "Tento obchod je velký luxus."
    ];
    
    const middles = [
      "Hlava vypadat jako Bollywood star.",
      "Střih čistý jak zrcadlo.",
      "Poslat všechny moje bratrance z Dillí k Tomášovi.",
      "Tento muž stříhat velmi rychle a bezchybně.",
      "Za pět dolarů já napsat cokoliv, ale tohle je pravda.",
      "Kvalita jak z německé fabriky, všechno lícovat.",
      "Moje žena už nechtít jiný muž, jen mě.",
      "Vonět to tam jako opravdový úspěch.",
      "Ruce kmitat jako šicí stroj, velmi dobrá technika."
    ];
    
    const outros = [
      "Děkuji tisíckrát pane!",
      "Velmi velký spokojenost!",
      "Pět hvězda pro Tomáš!",
      "Doporučuji všem lidem na planetě.",
      "Namaste, vrátím se zítra!",
      "Nikdy už nepůjdu jinam.",
      "Velmi dobrý byznys, děkuji.",
      "A teď jdu na rande s novým účesem."
    ];

    const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const randomText = `${intros[Math.floor(Math.random() * intros.length)]} ${middles[Math.floor(Math.random() * middles.length)]} ${outros[Math.floor(Math.random() * outros.length)]}`;
    
    setReviews(prev => [{ name: randomName, text: randomText, stars: 5 }, ...prev].slice(0, 5));
    setTotalCount(prev => prev + 1);
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      <div className="text-mafia-gold font-mono text-[10px] mb-2 tracking-widest bg-black px-2 py-1 border border-mafia-gold/30">
        FALEŠNÉ RECENZE: {totalCount} / 9999999999+
      </div>
      <button 
        onClick={generateReview}
        className="bg-mafia-gold/20 hover:bg-mafia-gold/40 border border-mafia-gold text-mafia-gold px-4 py-2 rounded text-xs font-heading tracking-widest uppercase transition-all mb-4"
      >
        Vygenerovat recenzi od bratra
      </button>

      <div className="w-full flex flex-col gap-2 font-sans">
        <AnimatePresence>
          {reviews.map((rev, idx) => (
            <motion.div 
              key={idx + rev.name}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-black/50 border border-white/10 p-3 rounded flex flex-col gap-1 w-full text-left"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-mafia-gold text-xs">{rev.name}</span>
                <span className="text-mafia-gold text-xs">★★★★★</span>
              </div>
              <span className="text-smoke-white/80 text-[11px] italic">"{rev.text}"</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function EasterEggPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDay, setIsDay] = useState(true);
  const [currentNodeId, setCurrentNodeId] = useState<string>("start");
  const [isTyping, setIsTyping] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [hierarchyAnim, setHierarchyAnim] = useState(false);
  const [selectedStartOption, setSelectedStartOption] = useState("");
  const [profession, setProfession] = useState("");
  const [showBigAnim, setShowBigAnim] = useState(false);
  const [showSecretMap, setShowSecretMap] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    setIsDay(hour >= 6 && hour < 18);
  }, []);

  const handleOptionClick = (nextId: string | null, text: string = "") => {
    // if (nextId === "go_to_story") {
    //   router.push('/q8w2-e4r7-t1y5-u9i3');
    //   return;
    // }

    if (nextId === "show_map") {
      setShowSecretMap(true);
      return;
    }

    if (nextId === "status_anim") {
      if (text.includes("Barber")) setProfession("Barber");
      else if (text.includes("Manažer")) setProfession("Manažer");
      else if (text.includes("Student")) setProfession("Student");
      else setProfession("Něco jinýho");
      
      setShowBigAnim(true);
      return;
    }

    if (nextId && dialogueTree[nextId]) {
      setCurrentNodeId(nextId);
      setIsTyping(true);
    }
  };

  const handleAnimComplete = () => {
    setShowBigAnim(false);
    let nextNode = "status_explanation_other";
    if (profession === "Barber") nextNode = "status_explanation_barber";
    if (profession === "Manažer") nextNode = "status_explanation_manager";
    if (profession === "Student") nextNode = "status_explanation_student";
    
    setCurrentNodeId(nextNode);
    setIsTyping(true);
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;
    const universalAnswers = ["confess_1", "confess_2", "confess_3", "confess_4"];
    const randomAnswer = universalAnswers[Math.floor(Math.random() * universalAnswers.length)];
    setCurrentNodeId(randomAnswer);
    setIsTyping(true);
    setInputValue("");
  };

  const handleComplete = useCallback(() => setIsTyping(false), []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  if (showSecretMap) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black flex flex-col"
      >
        <div className="absolute top-4 left-4 z-[210]">
          <button 
            onClick={() => setShowSecretMap(false)} 
            className="px-6 py-2 bg-black hover:bg-mafia-gold/20 text-mafia-gold border border-mafia-gold uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:shadow-[0_0_25px_rgba(197,160,89,0.6)]"
          >
            Zpět do úkrytu
          </button>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[210] bg-black/80 backdrop-blur-md px-8 py-4 border-y border-mafia-gold/50 shadow-[0_0_30px_rgba(0,0,0,0.9)] text-center w-11/12 md:w-auto pointer-events-none">
          <span className="text-mafia-gold font-serif italic text-xl md:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            „Pracujeme v temnotě, abychom sloužili světlu.“
          </span>
        </div>
        <div className="flex-1 relative">
          <SecretOpenFreeMap />
        </div>
      </motion.div>
    );
  }

  if (showBigAnim) {
    return <BigHierarchyAnimation profession={profession} onComplete={handleAnimComplete} />;
  }

  const currentNode = dialogueTree[currentNodeId];
  const isIndianActive = currentNodeId === 'reviews';
  const tomasImage = isIndianActive ? '/hierarchie/indian.png' : (isDay ? '/hierarchie/tomáš-sako-den.png' : '/hierarchie/tomáš-sako-večer.png');

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-center overflow-hidden font-sans">
      <SecretInteractiveParticles />

      {/* Hlavní obsah - Z-index navrch */}
      <div className="z-10 w-full max-w-4xl p-6 h-full flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-12 relative mt-20 md:mt-0">
        
        {/* Obrázek Tomáše */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-64 h-80 md:w-96 md:h-[500px] shrink-0 md:mt-10"
        >
          <img 
            src={tomasImage} 
            alt="Don Tomáš" 
            className={`absolute inset-0 w-full h-full object-contain z-10 transform-gpu [backface-visibility:hidden] [image-rendering:-webkit-optimize-contrast] contrast-105 transition-all duration-500 ${!isDay ? 'drop-shadow-[0_0_25px_rgba(197,160,89,0.3)]' : 'drop-shadow-[0_0_15px_rgba(0,0,0,0.3)]'}`}
          />
        </motion.div>

        {/* Dialogové okno */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 flex flex-col justify-center w-full min-h-[300px]"
        >
          <div className="bg-black/80 backdrop-blur-md border border-mafia-gold/40 rounded-sm p-6 md:p-8 shadow-[0_0_40px_rgba(197,160,89,0.15)] relative">
            
            {/* Jméno řečníka */}
            <div className="absolute -top-4 left-6 bg-black border border-mafia-gold px-4 py-1 shadow-[0_0_10px_rgba(197,160,89,0.2)]">
              <h2 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-sm">Don Tomáš</h2>
            </div>

            {/* Text dialogu */}
            <div className="text-mafia-gold/90 text-xl md:text-2xl min-h-[120px] font-serif italic tracking-wide leading-relaxed mt-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-pre-line">
              <TypewriterText 
                text={currentNode.text} 
                onComplete={handleComplete} 
              />
            </div>

            {/* Volby */}
            <div className="mt-10 flex flex-col gap-3 min-h-[100px] font-serif tracking-wider text-lg">
              <AnimatePresence>
                {/* --- Speciální render pro úvodní volbu (Roletka) --- */}
                {!isTyping && currentNodeId === 'start' && (
                  <motion.div
                    key="start-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 w-full"
                  >
                    <select
                      value={selectedStartOption}
                      onChange={(e) => setSelectedStartOption(e.target.value)}
                      className="w-full p-4 bg-black border border-mafia-gold/40 text-mafia-gold font-serif text-lg focus:outline-none focus:border-mafia-gold appearance-none cursor-pointer"
                      style={{ backgroundImage: 'linear-gradient(45deg, transparent 50%, #c5a059 50%), linear-gradient(135deg, #c5a059 50%, transparent 50%)', backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)', backgroundSize: '5px 5px, 5px 5px', backgroundRepeat: 'no-repeat' }}
                    >
                      <option value="" disabled className="bg-black text-white/50">-- Vyber si téma hovoru --</option>
                      {currentNode.options.map((option, idx) => (
                        <option key={idx} value={option.nextId!} className="bg-black text-mafia-gold py-2">{option.text}</option>
                      ))}
                    </select>
                    <button
                      disabled={!selectedStartOption}
                      onClick={() => {
                        const opt = currentNode.options.find(o => o.nextId === selectedStartOption);
                        if (opt) handleOptionClick(selectedStartOption, opt.text);
                      }}
                      className="w-full p-4 border border-mafia-gold/40 hover:border-mafia-gold bg-mafia-gold/10 hover:bg-mafia-gold/30 text-mafia-gold transition-all uppercase tracking-widest text-sm font-sans font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Potvrdit téma
                    </button>
                  </motion.div>
                )}

                {/* --- Normální render pro další dialogy --- */}
                {!isTyping && !currentNode.isEnd && !currentNode.isInput && currentNodeId !== 'start' && currentNode.options.map((option, idx) => (
                  <motion.button
                    key={`option-${option.nextId || idx}`}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    onClick={() => handleOptionClick(option.nextId, option.text)}
                    className="w-full text-left p-4 border border-white/10 hover:border-mafia-gold/60 bg-white/5 hover:bg-mafia-gold/10 text-white/70 hover:text-white transition-all duration-300 flex items-center justify-between group text-lg"
                  >
                    <span>{option.text}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-mafia-gold transition-opacity">→</span>
                  </motion.button>
                ))}

                {!isTyping && currentNode.isInput && (
                  <motion.div
                    key="dialogue-input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-4 mt-2"
                  >
                    <textarea 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Vyklop mi to..."
                      className="w-full bg-black/60 border border-mafia-gold/30 p-4 text-smoke-white font-serif italic focus:outline-none focus:border-mafia-gold resize-none h-32"
                    />
                    <button 
                      onClick={handleInputSubmit}
                      className="w-full text-center p-4 border border-mafia-gold/40 hover:border-mafia-gold bg-mafia-gold/10 hover:bg-mafia-gold/30 text-mafia-gold transition-all uppercase tracking-widest text-sm font-sans font-bold"
                    >
                      Říct to Donovi
                    </button>
                  </motion.div>
                )}

                {!isTyping && currentNode.hasReviewGenerator && (
                  <motion.div
                    key="review-generator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <ReviewGenerator />
                  </motion.div>
                )}

                {!isTyping && currentNode.isEnd && (
                  <motion.div
                    key="end-link"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center mt-4"
                  >
                    <Link 
                      href="/" 
                      className="group flex items-center gap-3 text-mafia-gold hover:text-white transition-all duration-500 border border-mafia-gold/30 hover:border-mafia-gold px-8 py-4 bg-mafia-gold/5 hover:bg-mafia-gold/10"
                    >
                      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
                      <span className="tracking-widest uppercase text-sm">Odejít ze stínů</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}


