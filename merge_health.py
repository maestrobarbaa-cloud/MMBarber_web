import re

with open('stephealth_temp.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
# omit the import line
append_content = ''.join(lines[2:])

with open('src/components/seznamka/ProfileSetupSteps.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add to lucide-react imports
content = re.sub(r'import \{ (.*?) \} from "lucide-react";', r'import { \1, Eye, HeartPulse, Brain, Activity, Coffee } from "lucide-react";', content)

# ensure AccordionSection is imported if not already
if 'AccordionSection' not in content:
    content = content.replace('import { CustomSelect } from "./CustomSelect";', 'import { CustomSelect } from "./CustomSelect";\nimport { AccordionSection } from "./AccordionSection";')

content += '\n' + append_content

with open('src/components/seznamka/ProfileSetupSteps.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
