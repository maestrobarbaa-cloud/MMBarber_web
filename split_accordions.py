import re

with open('psych.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (
        "<AccordionSection title={lang === 'cs' ? 'Psychologie & Deep Talk' : 'Psychology & Deep Talk'} icon={<Skull size={16} />} defaultOpen={false}>",
        "<AccordionSection title={lang === 'cs' ? 'Osobnost a Vzhled' : 'Personality & Looks'} icon={<User size={16} />} defaultOpen={false}>"
    ),
    (
        "                <div className=\"bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mt-4\">\n                  <h4 className=\"text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4\">\n                    <Heart size={12} /> Životní hodnoty & Cíle",
        "</AccordionSection>\n\n        <AccordionSection title={lang === 'cs' ? 'Životní styl a Hodnoty' : 'Lifestyle & Values'} icon={<Star size={16} />} defaultOpen={false}>\n                <div className=\"bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mt-4\">\n                  <h4 className=\"text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4\">\n                    <Heart size={12} /> Životní hodnoty & Cíle"
    ),
    (
        "                <div className=\"bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mt-4\">\n                  <h4 className=\"text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4\">\n                    <Heart size={12} /> Láska & Vztahy",
        "</AccordionSection>\n\n        <AccordionSection title={lang === 'cs' ? 'Vztahy a Komunikace' : 'Relationships'} icon={<Heart size={16} />} defaultOpen={false}>\n                <div className=\"bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mt-4\">\n                  <h4 className=\"text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4\">\n                    <Heart size={12} /> Láska & Vztahy"
    ),
    (
        "                <div className=\"bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mt-4\">\n                  <h4 className=\"text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4\">\n                    <Flame size={12} /> Intimita & Chemie",
        "</AccordionSection>\n\n        <AccordionSection title={lang === 'cs' ? 'Intimita' : 'Intimacy'} icon={<Flame size={16} />} defaultOpen={false}>\n                <div className=\"bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mt-4\">\n                  <h4 className=\"text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4\">\n                    <Flame size={12} /> Intimita & Chemie"
    )
]

for old, new in replacements:
    content = content.replace(old, new)

with open('psych_replaced.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
