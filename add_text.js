const fs = require('fs');

const content = fs.readFileSync('src/components/Intro.tsx', 'utf8');

const targetHtml = `              <p>
                {lang === 'cs'
                  ? "A tyhle stránky? Ty stále tvořím sám ve svém volném čase. Vše má svůj čas a kvalitu."
                  : "And this website? I'm still building it myself in my free time. Everything has its time and quality."
                }
              </p>
            </div>`;

// We'll search for just a portion of it to be safe
const searchChunk = 'A tyhle stránky?';

const index = content.indexOf(searchChunk);
if (index !== -1) {
    const divEnd = content.indexOf('</div>', index);
    if (divEnd !== -1) {
        const replacement = `              <div className="my-4 w-full h-px bg-mafia-gold/20" />
              <h4 className="text-mafia-gold font-bold uppercase tracking-wider text-sm mt-2">
                {lang === 'cs' ? "Ozvěny starých balad" : "Echoes of Old Ballads"}
              </h4>
              <p>
                {lang === 'cs'
                  ? "Byl jsem svědkem mnoha lidských příběhů. Příběhů, které člověka někdy jen pohladí, jindy znejistí, a některé v něm zůstanou ještě dlouho poté, co jejich poslední věta dozněla."
                  : "I have witnessed many human stories. Stories that sometimes just caress you, other times unsettle you, and some stay with you long after their final sentence has faded."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "O mnoha baladách a tragických příbězích jsme se učili už ve škole. Četli jsme o lásce, zradě, vině, touze, bolesti i o rozhodnutích, která už nejdou vzít zpět. Člověk si tehdy říká, že jsou to příběhy dávných časů, vytvořené básníky a spisovateli. Že patří do knih a do minulosti."
                  : "We learned about many ballads and tragic stories in school. We read about love, betrayal, guilt, desire, pain, and decisions that can never be taken back. One might think these are stories of ancient times, created by poets and writers. That they belong in books and in the past."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "Netušil jsem však, že jednou budu stát tak blízko příběhům, které jako by vystoupily ze stránek těch známých děl — jen dostaly nový nádech, nové kulisy a kabát jednadvacátého století."
                  : "But I never suspected that one day I would stand so close to stories that seem to have stepped right out of the pages of those famous works — only they got a new breath, a new setting, and the coat of the twenty-first century."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "Byl jsem svědkem jakéhosi nového zrození Máje. Ne toho, který známe pouze ze školních lavic, ale Máje, který se odehrává v dnešním světě. Místo dávných cest, lesů a jezer tu máme moderní domy, telefony, sociální sítě a společnost, ve které se všechno děje mnohem rychleji, než stačíme pochopit následky vlastních činů."
                  : "I have witnessed a kind of new birth of May. Not the one we know only from school desks, but a May that takes place in today's world. Instead of ancient roads, forests, and lakes, we have modern houses, phones, social networks, and a society where everything happens much faster than we can understand the consequences of our own actions."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "A přesto se v člověku stále odehrávají stejné věci jako před staletími. Láska. Žárlivost. Zrada. Samota. Touha po přijetí. A někdy také bolest, kterou si lidé způsobí navzájem, aniž by dokázali domyslet, co po nich zůstane."
                  : "And yet, the exact same things are still happening inside humans as centuries ago. Love. Jealousy. Betrayal. Loneliness. The desire for acceptance. And sometimes also the pain that people cause each other without being able to foresee what they will leave behind."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "Musím přiznat, že některé z těch příběhů mě skutečně šokovaly. Ne snad proto, že by byly nemožné, ale právě proto, že se skutečně odehrály. Najednou jsem pochopil, že společnost se sice změnila, ale lidské příběhy se v mnohém opakují. Jen se mění jejich kulisy a způsob, jakým je prožíváme."
                  : "I must admit that some of those stories truly shocked me. Not because they were impossible, but precisely because they actually happened. Suddenly I understood that while society has changed, human stories repeat themselves in many ways. Only their settings and the way we experience them change."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "Jedním z těch příběhů byl příběh teprve dvacetiletého chlapce. Mladého člověka, který věřil své přítelkyni. Jenže ona chodila za jinými a nakonec svedla dokonce otce svého mladého přítele."
                  : "One of those stories was the story of a boy who was only twenty years old. A young man who trusted his girlfriend. But she was seeing others behind his back, and in the end, she even seduced the father of her young boyfriend."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "Kdybych podobný příběh četl v knize, možná bych si řekl, že je až příliš neuvěřitelný. Že něco takového patří spíše do tragédie nebo do balady než do skutečného života. Jenže život žádného autora nepotřebuje."
                  : "If I read a similar story in a book, I might say it is simply too unbelievable. That something like that belongs more in a tragedy or a ballad than in real life. But life does not need any author."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "A právě proto si říkám, že bychom možná mohli začít tyto příběhy znovu vyprávět. Ne proto, abychom jejich aktéry soudili, ale abychom se pokusili pochopit, co se v lidech odehrává. Co člověka vede k některým rozhodnutím a kam až mohou taková rozhodnutí vést."
                  : "And that is exactly why I think we might want to start telling these stories again. Not to judge their actors, but to try to understand what happens inside people. What leads a person to certain decisions and how far such decisions can lead."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "Možná bychom mohli vzít známá díla, která jsme kdysi četli ve škole, a podívat se na ně očima dnešní doby. Nechat jejich motivy znovu ožít v současných lidských příbězích. Vzít starou baladu a dát jí nový kabát. Nechat Máj promluvit jazykem jednadvacátého století."
                  : "Perhaps we could take the famous works we once read in school and look at them through the eyes of today. Let their motives come alive again in contemporary human stories. Take an old ballad and give it a new coat. Let May speak the language of the twenty-first century."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "Protože možná zjistíme něco zvláštního. Že se svět kolem nás změnil mnohem víc než člověk uvnitř nás. A tak možná budeme pokračovat. Příběh za příběhem, osud za osudem. Budeme hledat jejich podobnosti se slavnými díly, která známe z literatury, a dávat jim nové podoby v současném světě."
                  : "Because we might discover something strange. That the world around us has changed much more than the human inside us. And so perhaps we will continue. Story after story, fate after fate. We will look for their similarities with the famous works we know from literature, and give them new forms in the contemporary world."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "A třeba jednou všechny tyto příběhy poskládáme vedle sebe. Vznikne tak něco jako nová sbírka balad našeho času — příběhů lidí, kteří milovali, věřili, zradili, selhali, trpěli, odpouštěli nebo už odpustit nedokázali."
                  : "And maybe one day we will put all these stories next to each other. Thus creating something like a new collection of ballads of our time — stories of people who loved, trusted, betrayed, failed, suffered, forgave, or could no longer forgive."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "Protože možná právě tam, kde končí stránky starých knih, začínají nové příběhy. A ty se, stejně jako ty dávné, píší dál. Jen dnes mají jiný svět, jiná jména a jiný kabát."
                  : "Because perhaps exactly where the pages of old books end, new stories begin. And they, just like the ancient ones, are still being written. Only today they have a different world, different names, and a different coat."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "Ale lidské srdce zůstává překvapivě stejné."
                  : "But the human heart remains surprisingly the same."
                }
              </p>
            </div>`;
        const newContent = content.substring(0, divEnd) + replacement.substring(18); // remove start padding to match </div>
        fs.writeFileSync('src/components/Intro.tsx', newContent);
        console.log("SUCCESS");
    }
} else {
    console.log("FAIL");
}
