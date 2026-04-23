
import sys

filename = r'c:\Users\micka\.gemini\antigravity\scratch\MMBarber\src\locales\translations.ts'
try:
    with open(filename, 'rb') as f:
        data = f.read()
    
    # Try decoding to find the first error
    try:
        data.decode('utf-8')
        print("File is valid UTF-8.")
    except UnicodeDecodeError as e:
        print(f"Error: {e}")
        print(f"Position: {e.start}")
        print(f"Bytes: {data[max(0, e.start-20):min(len(data), e.start+20)]}")
except Exception as ex:
    print(f"Failed to read file: {ex}")
