
import sys

filename = r'c:\Users\micka\.gemini\antigravity\scratch\MMBarber\src\locales\translations.ts'
try:
    with open(filename, 'rb') as f:
        data = f.read()
    
    lines = data.splitlines()
    if len(lines) >= 1510:
        line = lines[1509]
        print(f"Line 1510 bytes: {line.hex()}")
        print(f"Line 1510 repr: {line}")
except Exception as ex:
    print(f"Error: {ex}")
