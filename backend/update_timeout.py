import re

with open("utils/assessmentEngine.js", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace('timeout: 8000', '')
content = content.replace('timeout: 10000', '')
with open("utils/assessmentEngine.js", "w", encoding="utf-8") as f:
    f.write(content)
    
with open("routes/assessment.js", "r", encoding="utf-8") as f:
    content2 = f.read()
content2 = content2.replace('timeout: 15000', '')
with open("routes/assessment.js", "w", encoding="utf-8") as f:
    f.write(content2)
print("Removed timeout")
