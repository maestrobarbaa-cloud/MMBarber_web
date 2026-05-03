"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, ShieldAlert, Zap, Target, TrendingUp, Camera } from "lucide-react";

export function PersonalVision() {
  return (
    <div className="w-full bg-mafia-black py-32 px-6 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-mafia-gold/5 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Radical Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Rocket className="text-mafia-gold animate-bounce" size={24} />
            <span className="font-mono text-mafia-gold text-xs tracking-[0.3em] uppercase">Micka's Directive 001</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-heading font-black text-white italic leading-none uppercase tracking-tighter mb-8">
            Co bych udělal <span className="text-mafia-gold">JÁ</span>
            <br />
            <span className="text-2xl md:text-3xl opacity-50">(tvůj styl, žádný korporát)</span>
          </h2>
        </div>

        {/* The Main Content - Hard & Direct */}
        <div className="space-y-12">
          
          <div className="relative group">
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-mafia-gold opacity-30 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-2xl md:text-4xl font-heading font-bold text-white uppercase italic mb-6">
              „MMBARBER – barbershop v Uherském Hradišti, kde se píše respekt“
            </h3>
            
            <div className="prose prose-invert max-w-none space-y-6 text-smoke-white/80 font-sans leading-relaxed text-lg">
              <p>
                Hele, nebudeme si tu hrát na navoněný korporátní salóny, kde tě přivítá recepční s umělým úsměvem a nabídne ti předražený kafe, zatímco se tě snaží vmanipulovat do věrnostního programu. V MM BARBER to funguje jinak. Tohle není kadeřnictví. Tohle je systém. Moje zbraň, moje pravidla.
              </p>
              <p>
                Když jsem MM BARBER v Mařaticích otevíral, měl jsem jasnou vizi: vytvořit místo, kde se chlap cítí jako chlap, a ne jako položka v excelu. V Uherském Hradišti je spousta míst, kde tě "ostříhají", ale jen málo míst, kde ti dají identitu. My v MM BARBER neděláme jen vlasy. My děláme respekt.
              </p>
              <p>
                Náš styl je syrový. Černá, zlato, břitva a řev mašinek. Žádný pseudo-moderní nesmysly z Instagramu od "odborníků", co v životě nedrželi nůžky v ruce. U nás v Mařaticích sázémy na poctivý řemeslo a disciplínu. Protože disciplína je to, co odděluje vítěze od průměru.
              </p>
              <p>
                Proč chlapi z UH, Staráku nebo Kunovic jezdí právě k nám? Protože vědí, že tady se na nic nehrajeme. Dostaneš špičkovej skin fade, kterej vydrží, a úpravu vousů, po který se nebudeš muset stydět podívat do zrcadla. Ale hlavně dostaneš klid od toho venkovního chaosu. Tady se řeší věci na přímo.
              </p>
              <p>
                Můj gangster vibe? To není póza. To je postoj k byznysu a k životu. Buď to děláš na 100 %, nebo se na to vykašli. MM BARBER je moje rodina, můj odkaz. A každej, kdo sedne do mýho křesla, se stává součástí tohohle příběhu. V Uherském Hradišti jsme si vybudovali jméno díky tvrdý práci a loajalitě našich klientů. Ne díky reklamě v rádiu.
              </p>
              <p>
                Hledáš nejlepší barbershop v okolí? Nehledej podle toho, kdo má nejvíc neonů na výloze. Hledej podle toho, kdo ti podá ruku a podívá se ti do očí. MM BARBER je o vztazích, o důvěře a o tom, že když odejdeš, cítíš se jako král svýho revíru. To je moje mise. To je MM BARBER.
              </p>
            </div>
          </div>

          {/* Action Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-white/5 border border-white/10 rounded-sm space-y-4"
            >
              <div className="flex items-center gap-3 text-mafia-gold">
                <Zap size={20} />
                <h4 className="font-heading font-black uppercase italic tracking-wider">Jak poznáš dobrý barbershop?</h4>
              </div>
              <p className="text-sm text-smoke-white/60">
                Není to o drahý whiskey. Je to o čistotě nástrojů, o tom, jak se holič dívá na tvůj růst vlasů a jestli ti dokáže říct pravdu do očí – i když ti ten účes, co jsi viděl u fotbalisty, prostě nesedne.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-white/5 border border-white/10 rounded-sm space-y-4"
            >
              <div className="flex items-center gap-3 text-mafia-gold">
                <Target size={20} />
                <h4 className="font-heading font-black uppercase italic tracking-wider">Nejlepší střiky 2026</h4>
              </div>
              <p className="text-sm text-smoke-white/60">
                Zapomeň na trendy. Klasika se vrací v plný síle. Ostrý kontury, precizní přechody a textura, která dává vlasům život. V MM BARBER definujeme budoucnost skrze tradici.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-white/5 border border-white/10 rounded-sm space-y-4"
            >
              <div className="flex items-center gap-3 text-mafia-gold">
                <TrendingUp size={20} />
                <h4 className="font-heading font-black uppercase italic tracking-wider">Barbershop vs Kadeřnice</h4>
              </div>
              <p className="text-sm text-smoke-white/60">
                U kadeřnice jsi v ženským světě. V barbershopu jsi doma. Tady se mluví na rovinu, tady voní kolínská a kůže. Je to o rituálu, ne jen o zkrácení vlasů.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-mafia-gold/10 border border-mafia-gold/20 rounded-sm space-y-4"
            >
              <div className="flex items-center gap-3 text-mafia-gold">
                <Camera size={20} />
                <h4 className="font-heading font-black uppercase italic tracking-wider">Můj Gangster Vibe</h4>
              </div>
              <p className="text-sm text-smoke-white/60">
                Tohle je moje zbraň. Moje autenticita. Každá fotka na webu, každej detail v interiéru – to jsem já. Žádný fotobanky, žádný fejk. Realita Uherského Hradiště v tom nejlepším světle.
              </p>
            </motion.div>

          </div>

          <div className="mt-16 p-8 border-2 border-mafia-gold/30 bg-black flex flex-col items-center text-center">
             <ShieldAlert className="text-mafia-gold mb-4" size={40} />
             <p className="text-mafia-gold font-mono text-sm uppercase tracking-widest mb-2">Security Note</p>
             <p className="text-white/60 text-xs italic mb-10">
               Tento obsah je chráněn systémem MMBARBER. Kopírování textu bez respektu k originálu se trestá zapomněním.
             </p>

             <a 
               href="https://is.mmbarber.cz" 
               target="_blank" 
               rel="noopener noreferrer"
               className="w-full max-w-sm p-8 bg-mafia-gold text-mafia-black font-heading font-black uppercase italic tracking-[0.2em] hover:bg-white hover:scale-105 transition-all shadow-[0_0_50px_rgba(197,160,89,0.4)]"
             >
                Rezervovat v mém stylu
             </a>
          </div>

        </div>
      </div>
    </div>
  );
}
