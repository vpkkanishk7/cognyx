import base64
with open('b64.txt', 'r', encoding='utf-16le') as f:
    data = f.read().lstrip('\ufeff')
with open('decoded.zip', 'wb') as f:
    f.write(base64.b64decode(data))
print("Decoded!")
