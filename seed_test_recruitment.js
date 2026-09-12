const { PrismaClient } = require("./.prisma/client" in require.resolve ? "./.prisma/client" : "./node_modules/.prisma/client");
const prisma = new PrismaClient();

const phase1Answers = {
  "1": { choice: "Chybu jsem priznal/a zakaznikovi, omluvil/a se a nabidl/a bezplatnou opravu.", score: 2 },
  "2": { choice: "Omluvim se, pozvu ho znovu a nabidnu bezplatnou upravu bez vraceni penez.", score: 2 },
  "3": { choice: "Je to moje chyba a musim pridat.", score: 2 },
  "4": { choice: "Hned rano kontaktuji vsechny klienty, nabidnu nahradni terminy a aktivuji financni zalohu.", score: 2 },
  "5": { value: 2, score: 2 },
  "6": { choice: "Spustim pracku, provizorne pouziji papirove rucniky a zakaznikovi vysvetlim situaci.", score: 2 },
  "7": { choice: "Administrativa, ucty, pojistne - ta byrokracie me stoji energii.", score: 2 },
  "8": { choice: "Tymovy hrac - prikladam ruku k dilu pro celou znacku i kolegy.", score: 2 },
  "9": { choice: "Mam rezervu alespon na 2-3 mesice a pravidelne sporim.", score: 2 },
  "10": { choice: "Myslim, ze ano - dokazuji mi to opakovane se klienti a jejich doporuceni.", score: 2 },
  "11": { choice: "Bolelo to, ale podekoval/a jsem a nad tim premyslel/a.", score: 2 },
  "12": { choice: "Aktivne oslovim klienty s nabidkou terminu, vycistim nastroje nebo se neco naucim.", score: 2 },
  "13": { choice: "V technice - nektere strihy mi nejdou na 100 %.", score: 2 },
  "14": { choice: "Reknu mu primo: Kamarade, prosim te, vrat strojek vycisteny - to je zaklad.", score: 2 },
  "15": { choice: "Chci vydelavat primo umerne svemu vykonu a budovat si vlastni klientelu.", score: 2 }
};

const phase3Answers = {
  "1": { choice: "Chybi jim systematicka prace na sobe a sebevzdelavani.", score: 2 },
  "2": { choice: "Priznal/a jsem chybu, omluvil/a se a hned jsem zacal/a premyslet, jak to neopakovat.", score: 2 },
  "3": { choice: "Odvedl jsem prumernou praci a zakaznik mi rekl, ze to minule bylo lepsi.", score: 2 },
  "4": { choice: "Primociarost - rikam veci na rovinu, ale nekdy byvam prilis drsny/a.", score: 2 },
  "5": { choice: "S empati trvam na storno poplatku, ale nabidnu mu nahradni termin zdarma.", score: 2 },
  "6": { choice: "Jasne sdelim svuj pohled, necham hlasovat a respektuji vysledek.", score: 2 },
  "7": { choice: "Ano - ale sam/sama jsem hledal/a zpusob, jak situaci zmenit nebo odejit.", score: 2 },
  "8": { choice: "Interne se uklidnim a zakaznikovi to nedam znat.", score: 2 },
  "9": { choice: "Priznam to zakaznikovi, vysvetlim situaci a nabidnu reseni.", score: 2 },
  "10": { choice: "Uprimne ho pochvalim a poprosim ho, at mi ukaze, jak to udelal.", score: 2 },
  "11": { choice: "Kdyz mi zakaznik podekuje a sveri se se svym problemem.", score: 2 },
  "12": { choice: "Kdyz vyzaduje absolutni poradek a mikromanaguje kazdy detail.", score: 2 },
  "13": { choice: "Prijmu to klidne - je to docasne a zakaznici jsou na prvnim miste.", score: 2 }
};

async function main() {
  const app = await prisma.recruitmentApplication.create({
    data: {
      name: "Jakub Novak (TESTOVACI)",
      email: "test.uchazeč@mmbarber.cz",
      phone: "+420 777 123 456",
      phase1Answers: JSON.stringify(phase1Answers),
      phase1Status: "PASSED",
      phase3Answers: JSON.stringify(phase3Answers),
      phase3Status: "PENDING_REVIEW",
      status: "COMPLETED"
    }
  });
  console.log("Testovaci uchazec vytvoren, ID:", app.id);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
