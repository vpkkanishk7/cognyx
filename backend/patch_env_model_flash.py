with open(".env", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("GEMINI_MODEL=gemini-1.5-pro", "GEMINI_MODEL=gemini-2.5-flash")
with open(".env", "w", encoding="utf-8") as f:
    f.write(content)
