
import sys

filename = r'c:\Users\micka\.gemini\antigravity\scratch\MMBarber\src\locales\translations.ts'
try:
    with open(filename, 'rb') as f:
        data = f.read()
    
    # Decodes as much as possible, replacing errors
    content = data.decode('utf-8', errors='replace')
    lines = content.splitlines()
    
    # Find the line with the replacement character
    for i, line in enumerate(lines):
        if '\ufffd' in line:
            print(f"Line {i+1}: {line}")
except Exception as ex:
    print(f"Failed to read file: {ex}")
