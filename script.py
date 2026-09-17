# -*- coding: utf-8 -*-
import sys

file_path = r"c:\Users\micka\Documents\MMBarber_web\src\components\profiles\BarberCard.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target1 = '''          {graphicsTier !== 'lite' && (
            <span className="text-[10px] font-mono uppercase text-white/30 tracking-widest block relative">
              {barber.role}
            </span>
          )}'''

replacement1 = ""

target2 = '''          {graphicsTier !== 'lite' && (
            <div className="mt-4 relative flex justify-center">
              <BarberRanking 
                level={globalLevel} 
                rankTitle={globalRank} 
                lang={lang} 
                id={barber.id} 
                xp={globalXp}
              />
            </div>
          )}'''

replacement2 = '''          {graphicsTier !== 'lite' && (
              <div className="mt-4 mb-2 relative w-full min-h-[120px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {activeSpeaker === (barber.id === 'tomas' ? 'tomas' : 'nella') && (
                      <motion.div
                        key={mobile--}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-mafia-gold barber-dialogue-text font-heading italic text-xs tracking-[0.15em] px-4 py-3 leading-relaxed uppercase bg-mafia-gold/5 border border-mafia-gold/10 rounded-none backdrop-blur-sm shadow-[0_5px_15px_rgba(0,0,0,0.5)] w-full max-w-[300px]"
                      >
                        <span className="opacity-40 block mb-2 text-[8px] font-mono tracking-[0.5em]">
                          {lang === 'cs' ? "— ZÁZNAM KOMUNIKACE —" : "— MESSAGE_LOG —"}
                        </span>
                        {barber.story}
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
          )}'''

content_normalized = content.replace("\r\n", "\n")
target1_normalized = target1.replace("\r\n", "\n")
target2_normalized = target2.replace("\r\n", "\n")

if target1_normalized in content_normalized and target2_normalized in content_normalized:
    content_normalized = content_normalized.replace(target1_normalized, replacement1)
    content_normalized = content_normalized.replace(target2_normalized, replacement2)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content_normalized)
    print("Success")
else:
    print("Failed to find targets")
