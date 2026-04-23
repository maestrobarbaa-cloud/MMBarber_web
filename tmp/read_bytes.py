
import sys

filename = r'c:\Users\micka\.gemini\antigravity\scratch\MMBarber\src\locales\translations.ts'
try:
    with open(filename, 'rb') as f:
        data = f.read()
    
    lines = data.splitlines()
    # Looking around 1510
    for i in range(1500, min(len(lines), 1520)):
        print(f"Line {i+1}: {lines[i]}")
except Exception as ex:
    print(f"Error: {ex}")
