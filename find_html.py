import json

transcript_path = r"C:\Users\KANISHK VP\.gemini\antigravity-ide\brain\4a708c85-a2c9-42f6-8658-7a7af43b7d85\.system_generated\logs\transcript_full.jsonl"

found_html = False
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'ACTION_RESPONSE':
                content = data.get('content', '')
                if 'file:///d:/VS%20CODE/EVOL/COGNYX/frontend/index.html' in content and 'The following code has been modified' in content:
                    print("Found index.html in transcript!")
                    found_html = True
                    break
        except Exception as e:
            pass

if found_html:
    print("Found it!")
else:
    print("Not found.")
