const fs = require('fs');
let content = fs.readFileSync('src/app/x7q9-p2m4-v8b1-z5c3/page.tsx', 'utf8');

const replacement = `    isEnd: true
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

// --- KOMPONENTY PRO DIALOG ---`;

content = content.replace(/isEnd:\s*true\s*\}\s*\}\;\s*\/\/\s*---\s*KOMPONENTY\s*PRO\s*DIALOG\s*---/, replacement);
fs.writeFileSync('src/app/x7q9-p2m4-v8b1-z5c3/page.tsx', content);
console.log('Added echoes dialogues to easter egg.');
