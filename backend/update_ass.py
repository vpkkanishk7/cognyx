import re

with open("routes/assessment.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replace gemini model name
content = content.replace('"gemini-1.5-flash"', '"gemini-1.5-flash-latest"')

# Replace max_retries: 0
content = content.replace('timeout: 15000,\n      max_retries: 0', 'timeout: 15000')
content = content.replace('max_retries: 0', '')

with open("routes/assessment.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated assessment.js")
