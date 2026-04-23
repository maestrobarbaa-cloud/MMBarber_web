
import sys

filename = r'c:\Users\micka\.gemini\antigravity\scratch\MMBarber\src\locales\translations.ts'
offset = 175496
try:
    with open(filename, 'rb') as f:
        f.seek(max(0, offset - 100))
        data = f.read(200)
    
    print(f"Data around offset {offset}:")
    print(f"Hex: {data.hex()}")
    # Replace individual bytes that are not decodable
    decoded = ""
    for i, b in enumerate(data):
        curr_offset = offset - 100 + i
        try:
            char = bytes([b]).decode('utf-8')
            decoded += char
        except:
            decoded += f"[{hex(b)}@off{curr_offset}]"
    print(f"Decoded: {decoded}")
except Exception as ex:
    print(f"Error: {ex}")
