with open(".env.example", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("GEMINI_MODEL=gemini-2.5-pro", "GEMINI_MODEL=gemini-3.1-pro-preview")

with open(".env.example", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated .env.example")
