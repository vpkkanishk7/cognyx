import re

with open("utils/assessmentEngine.js", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('let content = response.choices[0]?.message?.content || "";', 'let content = response.choices[0]?.message?.content || "";\n    content = content.replace(/<think>[\\s\\S]*?<\\/think>/gi, "").trim();')

with open("utils/assessmentEngine.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Added think tag stripper")
