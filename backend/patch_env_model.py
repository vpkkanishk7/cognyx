with open(".env", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("GEMINI_MODEL=gemini-3.1-pro-preview", "GEMINI_MODEL=gemini-1.5-pro")
with open(".env", "w", encoding="utf-8") as f:
    f.write(content)
