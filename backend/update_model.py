import re

with open("utils/assessmentEngine.js", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('llama3-70b-8192', 'llama3-8b-8192')

with open("utils/assessmentEngine.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated model name")
