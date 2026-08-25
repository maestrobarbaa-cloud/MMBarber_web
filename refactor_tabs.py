import re

with open('src/components/seznamka/ProfileSetup.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the entire 'modules' block
modules_pattern = re.compile(r'\{\s*activeTab === \'modules\'.*?(?=\{activeTab === \'physical\')', re.DOTALL)
content = modules_pattern.sub('', content)

# Extract chunks
intellect_match = re.search(r'\{\s*activeTab === \'intellect\' && \(\s*<motion\.div.*?<div className=\"text-center mb-6\">\s*<h4.*?Intelekt.*?</h4>.*?</motion\.div>\s*\)', content, re.DOTALL)
intellect_chunk = intellect_match.group(0) if intellect_match else ''
if intellect_chunk:
    intellect_inner = re.search(r'<div className=\"text-center mb-6\">.*?(?=\s*</motion\.div>)', intellect_chunk, re.DOTALL).group(0)
else:
    intellect_inner = ''

communication_match = re.search(r'\{\s*activeTab === \'communication\' && \(\s*<motion\.div.*?<div className=\"text-center mb-6\">\s*<h4.*?Komunikace.*?</h4>.*?</motion\.div>\s*\)', content, re.DOTALL)
communication_chunk = communication_match.group(0) if communication_match else ''
if communication_chunk:
    communication_inner = re.search(r'<div className=\"text-center mb-6\">.*?(?=\s*</motion\.div>)', communication_chunk, re.DOTALL).group(0)
else:
    communication_inner = ''

boundaries_match = re.search(r'\{\s*activeTab === \'boundaries\' && \(\s*<motion\.div.*?<div className=\"text-center mb-6\">\s*<h4.*?Hranice.*?</h4>.*?</motion\.div>\s*\)', content, re.DOTALL)
boundaries_chunk = boundaries_match.group(0) if boundaries_match else ''
if boundaries_chunk:
    boundaries_inner = re.search(r'<div className=\"text-center mb-6\">.*?(?=\s*</motion\.div>)', boundaries_chunk, re.DOTALL).group(0)
else:
    boundaries_inner = ''

intimacy_match = re.search(r'\{\s*activeTab === \'intimacy\' && \(\s*<motion\.div.*?<div className=\"text-center mb-6\">\s*<h4.*?Intimita.*?</h4>.*?</motion\.div>\s*\)', content, re.DOTALL)
intimacy_chunk = intimacy_match.group(0) if intimacy_match else ''
if intimacy_chunk:
    intimacy_inner = re.search(r'<div className=\"text-center mb-6\">.*?(?=\s*</motion\.div>)', intimacy_chunk, re.DOTALL).group(0)
else:
    intimacy_inner = ''

old_blocks_pattern = re.compile(r'\{activeTab === \'physical\'.*?(?=\{activeTab === \'schools\')', re.DOTALL)

new_grouped = f'''
          {{activeTab === "personality" && (
            <motion.div initial={{{{ opacity: 0, x: 20 }}}} animate={{{{ opacity: 1, x: 0 }}}} exit={{{{ opacity: 0, x: -20 }}}} className="space-y-8">
              <Step2Physical formData={{formData}} setFormData={{setFormData}} lang={{lang}} />
              <Step3Character formData={{formData}} setFormData={{setFormData}} lang={{lang}} />
              {{/* Intellect */}}
              {intellect_inner}
            </motion.div>
          )}}
          {{activeTab === "lifestyle" && (
            <motion.div initial={{{{ opacity: 0, x: 20 }}}} animate={{{{ opacity: 1, x: 0 }}}} exit={{{{ opacity: 0, x: -20 }}}} className="space-y-8">
              <Step4Lifestyle formData={{formData}} setFormData={{setFormData}} lang={{lang}} />
              <Step7ValuesMoney formData={{formData}} setFormData={{setFormData}} lang={{lang}} />
            </motion.div>
          )}}
          {{activeTab === "relationships" && (
            <motion.div initial={{{{ opacity: 0, x: 20 }}}} animate={{{{ opacity: 1, x: 0 }}}} exit={{{{ opacity: 0, x: -20 }}}} className="space-y-8">
              <Step5CommLove formData={{formData}} setFormData={{setFormData}} lang={{lang}} />
              {{/* Communication */}}
              {communication_inner}
              {{/* Boundaries */}}
              {boundaries_inner}
            </motion.div>
          )}}
          {{activeTab === "intimacy" && (
            <motion.div initial={{{{ opacity: 0, x: 20 }}}} animate={{{{ opacity: 1, x: 0 }}}} exit={{{{ opacity: 0, x: -20 }}}} className="space-y-8">
              {intimacy_inner}
            </motion.div>
          )}}
          {{activeTab === "assets" && <StepAssets formData={{formData}} setFormData={{setFormData}} lang={{lang}} />}}
          {{activeTab === "timeline" && <StepTimeline formData={{formData}} setFormData={{setFormData}} lang={{lang}} />}}
          {{activeTab === "parenting" && <StepParenting formData={{formData}} setFormData={{setFormData}} lang={{lang}} />}}
'''

content = old_blocks_pattern.sub(new_grouped, content)

with open('src/components/seznamka/ProfileSetup.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done grouping!")
