const fs = require('fs');

const content = fs.readFileSync('src/app/x7q9-p2m4-v8b1-z5c3/page.tsx', 'utf8');

const zpevNodes = `  "zpev_start": {
    id: "zpev_start",
    text: "ZPĚV\\n\\nCo bývalo kdysi slovem „láska“,\\nteď v jejích rtech znělo jako žal,\\nz něžného snu zůstala vráska,\\nkdyž každý z nich už jinam stál.\\n\\nPrý příliš chtěl a příliš chránil,\\nprý svíral křídla, bránil v letu;\\non všechno, co měl, jí odevzdal,\\na přece byl prý vinou světa.\\n\\nZa její stopou kráčel dál,\\nač každý krok ho uvnitř pálil,\\nco včera pevně v rukou měl,\\ndnes mezi prsty pomalu ztratil.\\n\\nJak poutník, který cestu ztratil\\na přesto kráčí za světlem,\\ntak v každém ránu znovu věřil,\\nže včerejšek se vrátí sem.",
    options: [
      { text: "Pokračuj...", nextId: "zpev_2" }
    ]
  },
  "zpev_2": {
    id: "zpev_2",
    text: "Vždyť láska zvláštní zákon má —\\nkdyž bolí, člověk zůstává;\\nčím více srdce krvácí,\\ntím méně síly odchází.\\n\\nA ona šla už jinou cestou,\\nkde vedle ní šel někdo jiný;\\non zůstal stát před vlastní bolestí,\\njež neměla jména, neměla viny.\\n\\nPak spatřil ji — a vedle ní\\nse cizí ruka dotýkala.\\nV tom jediném krátkém setkání\\nse celá minulost mu vzdala.\\n\\nNejvíc však nebolel ten muž,\\njenž kráčel nyní vedle ní,\\nspíš obraz, který vytvořila,\\nv němž on byl vinou všeho zlého.",
    options: [
      { text: "To muselo bolet. Dál?", nextId: "zpev_3" }
    ]
  },
  "zpev_3": {
    id: "zpev_3",
    text: "Z muže, jenž chtěl jí život dát,\\nse stal prý ten, kdo všechno ničí;\\nz rukou, jež chtěly budoucnost stavět,\\nse staly ruce, které svírají.\\n\\nA tak se ptal v té dlouhé noci,\\nkde vlastně jejich cesta zhasla,\\nkdy z „my“ se stalo pouhé „já“\\na kde se ztratila jejich láska.\\n\\nKdy růže, kterou kdysi nesl,\\nse proměnila v ostrý trn,\\nkdy z toho krásného, co vzrostlo,\\nzůstal jen stín a prázdný sen.\\n\\nOn chtěl jen stavět — kámen ke kameni,\\npro jejich dům a budoucí čas;\\nchtěl, aby měli vlastní zázemí,\\naby se jednou svět usmál zas.",
    options: [
      { text: "A jak jí to vracela?", nextId: "zpev_4" }
    ]
  },
  "zpev_4": {
    id: "zpev_4",
    text: "Budoval firmu, budoval svůj sen,\\nchtěl z práce vytvořit jejich štěstí,\\na místo díků přišel chladný den\\na slova ostrá jako hřebíky.\\n\\nKdyž nejvíc potřeboval její dlaň,\\nkdyž sotva stál a docházel mu dech,\\nona mu místo blízkosti dala jen zášť\\na nechala ho samotného ve zdech.\\n\\nTak zůstal sám — a kolem ticho,\\njen nedokončený sen před ním stál;\\nco mělo být kdysi jejich „zítra“,\\nteď jako cizí dům tam stálo dál.\\n\\nŠel vzhůru sám, krok za krokem,\\nbez cizí ruky, bez podpory;\\nzatímco ona jiným směrem\\nsi stavěla své nové obzory.",
    options: [
      { text: "Rozdělily se cesty...", nextId: "zpev_5" }
    ]
  },
  "zpev_5": {
    id: "zpev_5",
    text: "Jejich sny jak listí větrem vzlétly,\\nroznesly se po krajině dál;\\nco spolu kdysi pevně spletli,\\nčas beze slova rozerval.\\n\\nA ona změnila svou tvář —\\nnové vlasy, nové znamení,\\nna kůži vepsaný nový řád,\\nnový způsob vlastního vidění.\\n\\nChtěla být ženou velkých gest,\\ntou, která světu ukáže svou sílu,\\nchtěla už kráčet bez starých cest\\na minulost nechat za svou vírou.\\n\\nJen pod tím obrazem, pod novou tváří,\\nse život neptá, kdo jsi chtěla být;\\nsvětlo se může odrážet v záři,\\na přesto člověk může uvnitř hnít.",
    options: [
      { text: "A on na to všechno jen koukal?", nextId: "zpev_6" }
    ]
  },
  "zpev_6": {
    id: "zpev_6",
    text: "I ta, co stála kdysi blízko,\\njednoho dne zmizela z jejího světa;\\nco bývalo poutem, stalo se nízkým,\\njakmile přešla další léta.\\n\\nA on se vrátil v myšlenkách zpět,\\ntam, kde ještě všechno bylo prosté,\\nkde jeden smích byl celý svět\\na z malých chvil se štěstí rostlo.\\n\\nVzpomněl si na tu růži v dlani,\\nna klíček, kterým ji kdysi rval,\\nna dívku stojící při svítání,\\nna život, který s ní plánoval.\\n\\nA najednou mu bylo jasné,\\nže některé věci nejdou vrátit,\\nže člověk může změnit tvář,\\na přesto něco v něm navždy ztratit.",
    options: [
      { text: "Silný příběh.", nextId: "zpev_7" }
    ]
  },
  "zpev_7": {
    id: "zpev_7",
    text: "Tak dlouho ji nosil v očích,\\naž zapomněl, že čas umí brát;\\nže z toho, co bývalo nejbližší,\\nmůže se stát někdo, koho nepoznáš.\\n\\nA v tiché noci, bez svědků,\\nkdyž měsíc kreslil stín na stěnu,\\nse vracel k jediné myšlence,\\njež bolela víc než všechno předtím:\\n\\nKde zmizela ta dívka, kterou znal?\\nTa, co se smála nad tou růží?\\nKde se ten krásný příběh rozpadal —\\na kdo jim zavřel dveře k jejich „my“?\\n\\nA pak už jenom v duchu řekl,\\nbez zloby, která kdysi pálila:\\n\\n„Tak krásná byla, když jsem ji poznal…\\nkdy se ta dívka vlastně změnila?“",
    options: [
      { text: "A dál?", nextId: "zpev_8" }
    ]
  },
  "zpev_8": {
    id: "zpev_8",
    text: "A noc mu neřekla nic.\\n\\nJen vítr prošel kolem oken,\\njak prochází kolem člověka čas,\\na někde hluboko pod tím vším\\nzůstal ten první společný hlas.",
    options: [
      { text: "To je všechno? Běž stříhat, Tome.", nextId: "poem_end" }
    ]
  },
`;

let updatedContent = content.replace('  "speakeasy": {', zpevNodes + '  "speakeasy": {');

updatedContent = updatedContent.replace(
    /text: "To dává smysl. A ta původní verze od prababičky\?", nextId: "poem_original_1" \},/,
    'text: "To dává smysl. A ta původní verze od prababičky?", nextId: "poem_original_1" },\n      { text: "Složil jsi ještě něco?", nextId: "zpev_start" },'
);

updatedContent = updatedContent.replace(
    /text: "Tak ta moje verze je aspoň moderní. Měj se, Tome.", nextId: "poem_end" \}/,
    'text: "Tak ta moje verze je aspoň moderní. Měj se, Tome.", nextId: "poem_end" },\n      { text: "Složil jsi k tomu tématu ještě něco dalšího?", nextId: "zpev_start" }'
);

fs.writeFileSync('src/app/x7q9-p2m4-v8b1-z5c3/page.tsx', updatedContent);
console.log('Nodes added successfully.');
