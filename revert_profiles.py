import re

file_path = "src/components/Profiles.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to replace everything from '<div className="w-full flex flex-col items-center relative py-4 xl:py-8 px-4 md:px-0 mx-auto">'
# to the end of the tree layout.
start_str = '<div className="w-full flex flex-col items-center relative py-4 xl:py-8 px-4 md:px-0 mx-auto">'
end_str = '</div>\n            </div>\n        </div>\n      </div>\n      \n      <OperativeModal'

if start_str in content and end_str in content:
    start_idx = content.find(start_str)
    end_idx = content.find(end_str)
    
    replacement = """<div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-8 xl:gap-10 px-4 md:px-0 w-full mx-auto py-4 xl:py-8">
                    {translatedBarbers.map((barber, index) => {
                      const isTomas = barber.name === 'Tomáš' || barber.name === 'Tomas';
                      const barberKey = isTomas ? 'tomas' : 'nella';
                      const greetingIdx = chairGreetingsIndices[barberKey] ?? (isTomas ? 0 : 1);
                      const chairGreetingText = lang === 'cs' ? CHAIR_GREETINGS_CS[greetingIdx] : CHAIR_GREETINGS_EN[greetingIdx];

                      return (
                        <ChairWithCard 
                          key={barber.name}
                          barber={barber} 
                          activeSpeaker={activeSpeaker} 
                          dialogueIndex={activeDialogueText} 
                          lang={lang} 
                          t={t} 
                          playCardSound={playCardSound} 
                          side={index % 2 === 0 ? "left" : "right"} 
                          graphicsTier={graphicsTier}
                          globalStats={globalStats}
                          likedMap={likedMap}
                          onLike={handleLike}
                          onOpenDossier={setSelectedBarberForModal}
                          chairGreetingText={chairGreetingText || ""}
                        />
                      );
                    })}
                </div>
"""
    new_content = content[:start_idx] + replacement + content[end_idx:]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Reverted the homepage tree back to the simple row successfully.")
else:
    print("Could not find the bounds to replace.")
