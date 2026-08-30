import re

with open("utils/assessmentEngine.js", "r", encoding="utf-8") as f:
    content = f.read()

target = """    try {
      const result = await groqClient.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "qwen/qwen3.6-27b",
        
      });

      const questionText = result.choices[0].message.content.trim();
      this.history.push({ role: 'assistant', content: questionText });
      return { type: 'continue', text: questionText };
    } catch (err) {"""

replacement = """    try {
      const result = await groqClient.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "qwen/qwen3.6-27b",
        
      });

      let questionText = result.choices[0].message.content || "";
      
      // Robust sanitizer for <think> tags
      questionText = questionText.replace(/<think>[\\s\\S]*?<\\/think>/gi, ""); // Remove complete blocks
      questionText = questionText.replace(/<think>[\\s\\S]*/gi, ""); // Remove unclosed blocks
      questionText = questionText.replace(/<\\/think>/gi, ""); // Remove stray closing tags
      questionText = questionText.trim();

      if (!questionText) {
         questionText = "Could you tell me more about that?";
      }

      this.history.push({ role: 'assistant', content: questionText });
      return { type: 'continue', text: questionText };
    } catch (err) {"""

content = content.replace(target, replacement)

with open("utils/assessmentEngine.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Applied robust sanitization logic to assessmentEngine.js")
