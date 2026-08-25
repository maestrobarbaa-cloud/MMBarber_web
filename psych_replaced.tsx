        <AccordionSection title={lang === 'cs' ? 'Osobnost a Vzhled' : 'Personality & Looks'} icon={<User size={16} />} defaultOpen={false}>
          {currentStrategy === 'random' ? (
            <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-xl border border-white/5 text-center mt-2">
              <Lock size={32} className="text-white/30 mb-3" />
              <p className="text-white/50 text-xs font-mono uppercase tracking-widest leading-relaxed">
                {lang === 'cs' 
                  ? 'Psychologický profil je v náhodném algoritmu skrytý.' 
                  : 'Psychological profile is hidden in the random algorithm.'}
              </p>
            </div>
          ) : (
            <>
              
          {/* Psychology Section */}
          {(profile.mbti || profile.temperament || profile.mindset || profile.intelligence || profile.socialBattery) && (
            <div className="space-y-4 pt-4 border-t border-mafia-gold/20">
              <div className="flex items-center gap-2 border-b border-mafia-gold/30 pb-2">
                <Heart size={16} className="text-mafia-gold" />
                <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm">Psychologie & Povaha</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {profile.mbti && (
                  <div className="bg-black/40 border border-mafia-gold/20 p-3 rounded-sm">
                    <div className="text-[9px] font-mono text-mafia-gold uppercase tracking-widest mb-1 opacity-80">
                      MBTI Typ
                    </div>
                    <div className="text-white text-xs font-bold font-sans">
                      {profile.mbti}
                    </div>
                  </div>
                )}

                {profile.temperament && (
                  <div className="bg-black/40 border border-mafia-gold/20 p-3 rounded-sm">
                    <div className="text-[9px] font-mono text-mafia-gold uppercase tracking-widest mb-1 opacity-80">
                      Temperament
                    </div>
                    <div className="text-white text-xs font-bold font-sans">
                      {profile.temperament}
                    </div>
                  </div>
                )}

                {profile.mindset && (
                  <div className="bg-black/40 border border-mafia-gold/20 p-3 rounded-sm">
                    <div className="text-[9px] font-mono text-mafia-gold uppercase tracking-widest mb-1 opacity-80">
                      Základní nastavení
                    </div>
                    <div className="text-white text-xs font-bold font-sans">
                      {profile.mindset}
                    </div>
                  </div>
                )}

                {profile.socialBattery && (
                  <div className="bg-black/40 border border-mafia-gold/20 p-3 rounded-sm">
                    <div className="text-[9px] font-mono text-mafia-gold uppercase tracking-widest mb-1 opacity-80">
                      Sociální baterie
                    </div>
                    <div className="text-white text-xs font-bold font-sans">
                      {profile.socialBattery}
                    </div>
                  </div>
                )}

                {profile.intelligence && (
                  <div className="col-span-2 bg-black/40 border border-mafia-gold/20 p-3 rounded-sm">
                    <div className="text-[9px] font-mono text-mafia-gold uppercase tracking-widest mb-1 opacity-80">
                      Typ inteligence (Nejsilnější stránka)
                    </div>
                    <div className="text-white text-xs font-bold font-sans">
                      {profile.intelligence}
                    </div>
                  </div>
                )}

                {profile.personalityDynamics && (
                  <div className="col-span-2 bg-black/40 border border-mafia-gold/20 p-3 rounded-sm">
                    <div className="text-[9px] font-mono text-mafia-gold uppercase tracking-widest mb-1 opacity-80">
                      Osobnostní dynamika ve vztahu
                    </div>
                    <div className="text-white text-xs font-bold font-sans">
                      {profile.personalityDynamics}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Complicated Section (Deep Dive) */}
          {profile.isComplicated && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-mafia-gold/30 pb-2">
                <Sparkles size={16} className="text-mafia-gold" />
                <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm">Pojďme do hloubky</h4>
              </div>

              {profile.weekend && (
                <div className="bg-mafia-gold/5 border border-mafia-gold/20 p-4 rounded-sm">
                  <div className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest mb-1 flex items-center gap-2">
                    Můj typický víkend
                  </div>
                  <div className="text-white text-sm font-sans">
                    {profile.weekend}
                  </div>
                </div>
              )}

              {profile.lifeGoal && (
                <div className="bg-mafia-gold/5 border border-mafia-gold/20 p-4 rounded-sm">
                  <div className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest mb-1 flex items-center gap-2">
                    Životní cíl
                  </div>
                  <div className="text-white text-sm font-sans">
                    {profile.lifeGoal}
                  </div>
                </div>
              )}

              {profile.kids && (
                <div className="bg-mafia-gold/5 border border-mafia-gold/20 p-4 rounded-sm">
                  <div className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest mb-1 flex items-center gap-2">
                    Názor na děti
                  </div>
                  <div className="text-white text-sm font-sans">
                    {profile.kids === 'yes' ? 'Určitě chci' :
                      profile.kids === 'maybe' ? 'Možná jednou' :
                        profile.kids === 'no' ? 'Nechci' : 'Už mám'}
                  </div>
                </div>
              )}

              {profile.redFlag && (
                <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-sm">
                  <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Flag size={12} /> Moje mouchy (Red Flag)
                  </div>
                  <div className="text-white text-sm font-sans">
                    {profile.redFlag === 'slow' ? 'Odepisuju strašně pomalu' :
                      profile.redFlag === 'snore' ? 'Chrápu' :
                        profile.redFlag === 'phone' ? 'Jsem pořád na telefonu' : 'Neumím vařit'}
                  </div>
                </div>
              )}

              {profile.loveLanguage && (
                <div className="bg-mafia-gold/5 border border-mafia-gold/20 p-4 rounded-sm">
                  <div className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest mb-1 flex items-center gap-2">
                    <MessageCircleHeart size={12} /> Jazyk lásky
                  </div>
                  <div className="text-white text-sm font-sans">
                    {profile.loveLanguage === 'touch' ? 'Fyzický kontakt' :
                      profile.loveLanguage === 'gifts' ? 'Pozornosti a dárky' :
                        profile.loveLanguage === 'time' ? 'Trávení času spolu' : 'Slova ujištění'}
                  </div>
                </div>
              )}
            </div>
          )}


        
            </>
          )}
</AccordionSection>

