import json

transcript_path = r"C:\Users\KANISHK VP\.gemini\antigravity-ide\brain\4a708c85-a2c9-42f6-8658-7a7af43b7d85\.system_generated\logs\transcript_full.jsonl"

found_content = None
try:
    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line)
            content = data.get('content', '')
            if 'VIEW 3: CHAT INTERFACE' in content:
                print("FOUND in content!")
                # the content might be the output of view_file
                found_content = content
                break
            
            # also check tool responses
            if 'tool_calls' in data:
                for call in data['tool_calls']:
                    pass # responses are in type: TOOL_RESPONSE
            
            if data.get('type') == 'TOOL_RESPONSE':
                if 'VIEW 3: CHAT INTERFACE' in content:
                    print("FOUND in tool response!")
                    found_content = content
                    break
except Exception as e:
    print(e)

if found_content:
    with open("found_index.txt", "w", encoding="utf-8") as f:
        f.write(found_content)
    print("Wrote to found_index.txt")
else:
    print("Not found")
