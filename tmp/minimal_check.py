
import sys

filename = r'c:\Users\micka\.gemini\antigravity\scratch\MMBarber\src\locales\translations.ts'
offset = 175496
with open(filename, 'rb') as f:
    f.seek(max(0, offset - 50))
    data = f.read(100)

print(f"Index {offset} marks: {hex(data[50])}")
print(f"Data snippet: {data}")
# Try decoding with replace
print(f"Decoded snippet: {data.decode('utf-8', errors='replace')}")
