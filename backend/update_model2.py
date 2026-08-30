import re

with open("utils/assessmentEngine.js", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('llama3-8b-8192', 'llama-3.1-8b-instant')

with open("utils/assessmentEngine.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated model name again")
