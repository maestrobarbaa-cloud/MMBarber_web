import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Star, Shield, Award, Users, ThumbsUp, Heart } from "lucide-react";

export function ReviewSEO() {
  const { lang } = useTranslation();

  return (
    <section className="mt-16 pt-16 border-t border-mafia-gold/20 bg-gradient-to-b from-mafia-gold/[0.01] to-transparent rounded-sm p-6 md:p-12 relative overflow-hidden">
      {/* Visual Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-mafia-gold to-transparent" />
      
      <div className="max-w-5xl mx-auto space-y-12">
        {/* SEO Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-mafia-gold/5 border border-mafia-gold/20 text-mafia-gold font-mono text-[9px] uppercase tracking-[0.3em]">
            <Award size={10} className="text-mafia-gold" />
            <span>{lang === 'cs' ? 'DŮVĚRA A REPUTACE' : 'TRUST & REPUTATION'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-smoke-white uppercase tracking-tight italic">
            {lang === 'cs' ? 'Proč má MMBARBER nejlepší hodnocení v Uherském Hradišti?' : 'Why MMBarber holds the best ratings in Uherské Hradiště?'}
          </h2>
          <p className="text-mafia-gold/60 font-mono text-[10px] md:text-xs uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
            {lang === 'cs' 
              ? 'Pravda o naší kvalitě zapsaná našimi klienty. Zjistěte, proč jsme nejlépe hodnocený pánský salon na Slovácku.'
              : 'The truth about our quality written by our clients. Find out why we are the highest-rated men\'s salon in Slovácko.'}
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 border border-white/5 bg-white/[0.01] hover:border-mafia-gold/20 transition-all rounded-sm space-y-3">
            <div className="w-10 h-10 border border-mafia-gold/20 bg-mafia-gold/5 flex items-center justify-center text-mafia-gold rounded">
              <Star size={18} className="fill-mafia-gold" />
            </div>
            <h3 className="text-lg font-heading font-black text-white uppercase tracking-wider">
              {lang === 'cs' ? '100% Spokojenost' : '100% Satisfaction'}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              {lang === 'cs'
                ? 'Naše hodnocení není náhoda. Každý pánský střih a úprava vousů prochází finální kontrolou geometrie a detailů.'
                : 'Our high ratings are no accident. Every men\'s haircut and beard trim undergoes a final geometry and detail check.'}
            </p>
          </div>

          <div className="p-6 border border-white/5 bg-white/[0.01] hover:border-mafia-gold/20 transition-all rounded-sm space-y-3">
            <div className="w-10 h-10 border border-mafia-gold/20 bg-mafia-gold/5 flex items-center justify-center text-mafia-gold rounded">
              <Users size={18} />
            </div>
            <h3 className="text-lg font-heading font-black text-white uppercase tracking-wider">
              {lang === 'cs' ? 'Klientská Komunita' : 'Client Community'}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              {lang === 'cs'
                ? 'Budujeme vztahy. Naši klienti z Mařatic, Jarošova, Kunovic a Starého Města nejsou jen čísla, ale naši bratři.'
                : 'We build relationships. Our clients from Mařatice, Jarošov, Kunovice and Staré Město are not just numbers, but our brothers.'}
            </p>
          </div>

          <div className="p-6 border border-white/5 bg-white/[0.01] hover:border-mafia-gold/20 transition-all rounded-sm space-y-3">
            <div className="w-10 h-10 border border-mafia-gold/20 bg-mafia-gold/5 flex items-center justify-center text-mafia-gold rounded">
              <Shield size={18} />
            </div>
            <h3 className="text-lg font-heading font-black text-white uppercase tracking-wider">
              {lang === 'cs' ? 'Absolutní Bezpečnost' : 'Absolute Safety'}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              {lang === 'cs'
                ? 'Pracujeme s nejmodernějšími hygienickými standardy a sterilním vybavením. Vaše zdraví a komfort jsou naší prioritou.'
                : 'We operate under the most modern hygiene standards with sterile equipment. Your health and comfort are our top priority.'}
            </p>
          </div>
        </div>

        {/* Detailed SEO Copy Area */}
        <article className="border border-white/5 p-8 bg-black/60 rounded-sm font-sans space-y-6 text-sm text-white/70 leading-relaxed">
          <h3 className="text-xl font-heading font-black text-white uppercase tracking-widest">
            {lang === 'cs' ? 'Hledáte nejlepší pánské holičství v Uherském Hradišti? Podívejte se na recenze!' : 'Searching for the best barbershop in Uherské Hradiště? Check the reviews!'}
          </h3>
          <p>
            {lang === 'cs' ? (
              <>
                Při výběru barbershopu hrají <strong>recenze a reálná spokojenost klientů</strong> tu nejdůležitější roli. 
                V <strong>MMBARBER Uherské Hradiště (Mařatice)</strong> si zakládáme na naprosté transparentnosti. Náš inovativní 
                a gamifikovaný hodnotící systém umožňuje každému zákazníkovi přiřadit svým oblíbeným barberům – 
                <strong>Tomášovi a Nelle</strong> – cenné XP body a podpořit jejich specifické dovednosti (jako je přesnost břitvy, 
                geometrie fadu, kreativní textura či komunikace a lidský přístup). Tímto způsobem tvoříme unikátní, v reálném čase 
                synchronizovanou hierarchii hodností, která nemá v České republice obdoby.
              </>
            ) : (
              <>
                When choosing a barbershop, <strong>reviews and genuine client satisfaction</strong> play the most vital role. 
                At <strong>MMBarber Uherské Hradiště (Mařatice)</strong>, we value complete transparency. Our innovative 
                and gamified rating system allows every customer to assign valuable XP points to their favorite barbers – 
                <strong>Tomáš and Nella</strong> – endorsing their specific skills (like razor precision, fade geometry, 
                creative texture, or communication and charisma). This is how we create a unique, real-time synchronized 
                hierarchy of ranks that is unmatched in the Czech Republic.
              </>
            )}
          </p>

          <p>
            {lang === 'cs' ? (
              <>
                Ať už k nám jezdíte na pánský střih ze <strong>Starého Města, Kunovic, Hluku, Uherského Brodu</strong> nebo ze 
                <strong>Zlína</strong>, víte, že u nás dostanete prémiový servis. Naše recenze vyzdvihují nejen mistrovské fade střihy 
                (skin fade, taper fade), ale také jedinečnou hot towel napářku, precizní úpravu vousů břitvou a uvolněnou 
                noir mafiánskou atmosféru. Bezkonkurenčním benefitem, který klienti často zmiňují, je také bezproblémové parkování 
                zdarma přímo u vchodu do salonu v Mařaticích.
              </>
            ) : (
              <>
                Whether you visit us for a men\'s haircut from <strong>Staré Město, Kunovice, Hluk, Uherský Brod</strong>, or 
                <strong>Zlín</strong>, you know you will receive premium service. Our reviews praise not only master fade cuts 
                (skin fade, taper fade) but also the signature hot towel wrap, precise straight-razor beard styling, and the relaxed 
                noir mafia atmosphere. A highly praised benefit regularly mentioned by clients is the hassle-free free parking 
                directly in front of our Mařatice salon.
              </>
            )}
          </p>
        </article>

        {/* Structured Schema FAQ Area */}
        <div itemScope itemType="https://schema.org/FAQPage" className="border border-white/5 p-8 bg-[#030303] rounded-sm space-y-6">
          <h3 className="text-xl font-heading font-black text-mafia-gold uppercase tracking-wider text-center">
            {lang === 'cs' ? 'Časté dotazy ohledně hodnocení a kvality' : 'Frequently Asked Questions About Ranks & Quality'}
          </h3>

          <div className="space-y-6 divide-y divide-white/5">
            <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="pt-4">
              <h4 itemProp="name" className="text-sm md:text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-mafia-gold">Q:</span>
                {lang === 'cs' ? 'Jak funguje systém přezdívek a hodností v MMBARBER?' : 'How does the nickname and rank system work at MMBarber?'}
              </h4>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer" className="mt-2 text-xs text-white/60 font-sans pl-6 leading-relaxed">
                <p itemProp="text">
                  {lang === 'cs'
                    ? 'Náš hodnotící systém je zcela jedinečný. Každý registrovaný zákazník může svému barberovi udělit XP body za konkrétní schopnosti (geometrie střihu, pokec, styl). Nasbírané XP posouvají barbera do vyšších vojenských a mafiánských hodností, které se pak zobrazují v celém rezervačním rozhraní a klientském terminálu.'
                    : 'Our rating system is entirely unique. Every registered client can award XP points to their barber for specific skills (fade geometry, chat, styling). Accumulated XP moves the barber into higher military/mafia ranks, which are reflected across the booking interface and client terminal.'}
                </p>
              </div>
            </div>

            <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="pt-6">
              <h4 itemProp="name" className="text-sm md:text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-mafia-gold">Q:</span>
                {lang === 'cs' ? 'Proč má váš salon v Uherském Hradišti tak vysoké hodnocení?' : 'Why does your salon in Uherské Hradiště have such high reviews?'}
              </h4>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer" className="mt-2 text-xs text-white/60 font-sans pl-6 leading-relaxed">
                <p itemProp="text">
                  {lang === 'cs'
                    ? 'Zakládáme si na preciznosti, kvalitě použitých kosmetických produktů (Reuzel, Uppercut, Morgan\'s) a individuálním přístupu. Na rozdíl od běžných kadeřnictví u nás pánský střih trvá plných 45 až 60 minut, abychom zaručili naprostou čistotu fadu a spokojenost klienta s každým detailem.'
                    : 'We focus strictly on precision, high-end grooming cosmetics (Reuzel, Uppercut, Morgan\'s), and a personalized approach. Unlike ordinary salons, our men\'s haircut takes a full 45 to 60 minutes to guarantee absolute fade cleanliness and extreme client satisfaction with every single detail.'}
                </p>
              </div>
            </div>

            <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="pt-6">
              <h4 itemProp="name" className="text-sm md:text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-mafia-gold">Q:</span>
                {lang === 'cs' ? 'Jak mohu napsat recenzi nebo ohodnotit svého barbera?' : 'How can I write a review or rate my barber?'}
              </h4>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer" className="mt-2 text-xs text-white/60 font-sans pl-6 leading-relaxed">
                <p itemProp="text">
                  {lang === 'cs'
                    ? 'Ohodnotit a podpořit svého barbera můžete přímo na této stránce v klientské sekci MM Spokojenost. Stačí zadat své jméno nebo přezdívku, čímž se autorizujete v našem systému, a pak jednoduše kliknout na tlačítko "DÁT EXP +1" u příslušné dovednosti. Vaše hodnocení se okamžitě započítá.'
                    : 'You can rate and support your barber directly on this page under the MM Satisfaction section. Simply enter your name or nickname to authorize in our system, and click the "GIVE EXP +1" button for the respective skill. Your review will be calculated in real-time.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Brand Accent */}
        <div className="flex flex-col items-center gap-2 pt-6">
          <div className="h-px w-24 bg-mafia-gold/20" />
          <p className="text-[8px] font-mono text-white/30 uppercase tracking-[0.4em] text-center leading-relaxed">
            {lang === 'cs' 
              ? 'MMBARBER © 2026 // GLOBÁLNÍ STANDARDY V SRDCI SLOVÁCKA // MAŘATICE SADÁVÁ 1383' 
              : 'MMBARBER © 2026 // GLOBAL STANDARDS IN SLOVÁCKO // MAŘATICE SADÁVÁ 1383'}
          </p>
        </div>
      </div>
    </section>
  );
}
