
import sys

filename = r'c:\Users\micka\.gemini\antigravity\scratch\MMBarber\src\locales\translations.ts'
with open(filename, 'rb') as f:
    data = f.read()

# Replace the problematic sequence at 175496
# I will replace it with a space to make it valid for now
# OR try to see if it was meant to be some Cyrillic character like 'і'
bad_byte = data[175496]
print(f"Byte at 175496: {hex(bad_byte)}")

# Let's just fix it by replacing the lead byte with a space if it's invalid
new_data = bytearray(data)
new_data[175496] = ord(' ') # Replace \xd1 with space

# Try to decode to check if it's fixed
try:
    new_data.decode('utf-8')
    print("Success! File is now valid UTF-8.")
    with open(filename, 'wb') as f:
        f.write(new_data)
except UnicodeDecodeError as e:
    print(f"Still failing at {e.start}: {e}")
    # Fix the next one recursively if needed
