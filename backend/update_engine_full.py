import re

with open("utils/assessmentEngine.js", "r", encoding="utf-8") as f:
    content = f.read()

# Add the sanitizeAssistantResponse function at the top
sanitize_func = """const { safeParse } = require('./aiResponse');

function sanitizeAssistantResponse(content, currentConceptFallback) {
  if (!content) return currentConceptFallback;
  
  let sanitized = content;

  // A. Remove complete <think>...</think> blocks including multi-line
  sanitized = sanitized.replace(/<think>[\\s\\S]*?<\\/think>/gi, "");
  
  // B. Remove unclosed <think> tag everything from it to the end
  sanitized = sanitized.replace(/<think>[\\s\\S]*/gi, "");
  
  // C. Remove orphaned </think> tag
  sanitized = sanitized.replace(/<\\/think>/gi, "");

  // E & F. Remove markdown internal reasoning headers
  const badHeaders = [
    /^\\s*\\**Analyze User Input:?\\**.*$/gmi,
    /^\\s*\\**Role:?\\**.*$/gmi,
    /^\\s*\\**Question to ask:?\\**.*$/gmi,
    /^\\s*\\**Life Stage:?\\**.*$/gmi,
    /^\\s*\\**Rules:?\\**.*$/gmi,
    /^\\s*\\**Identify Key Requirements:?\\**.*$/gmi,
    /^\\s*\\**Draft Generation.*?:?\\**.*$/gmi,
    /^\\s*\\**Mental:?\\**.*$/gmi,
    /^\\s*\\**Internal reasoning:?\\**.*$/gmi,
    /^\\s*\\**Thought process:?\\**.*$/gmi,
    /^\\s*\\**Planning:?\\**.*$/gmi,
    /^\\s*\\**Analysis:?\\**.*$/gmi,
    /^\\s*\\**Assistant analysis:?\\**.*$/gmi,
    /^\\s*\\**System prompt:?\\**.*$/gmi,
    /^\\s*\\**Constraint Verification:?\\**.*$/gmi,
    /^\\s*\\**Drafting.*?:?\\**.*$/gmi,
    /^\\s*\\**Refining:?\\**.*$/gmi,
    /^\\s*\\**Final Polish:?\\**.*$/gmi,
    /^\\s*\\[Output Generation\\].*$/gmi,
    /^\\s*\\*Self-Correction.*$/gmi,
    /^\\s*\\[Final Check.*$/gmi,
    /^\\s*Proceeds\\..*$/gmi,
    /^\\s*Done\\..*$/gmi,
    /^\\s*Output:.*$/gmi,
    /^\\s*Output matches.*$/gmi,
    /^\\s*\\[Output\\].*$/gmi
  ];

  for (let regex of badHeaders) {
    sanitized = sanitized.replace(regex, "");
  }

  // G. Remove accidental ``` blocks
  sanitized = sanitized.replace(/```[\\s\\S]*?```/g, "");

  // H. Trim whitespace
  sanitized = sanitized.trim();
  
  // I. If resulting response is empty or still looks like internal reasoning, use fallback
  if (sanitized.length === 0 || /^\\d+\\.\\s+\\**/.test(sanitized)) {
    return currentConceptFallback;
  }
  
  return sanitized;
}
"""
content = content.replace("const { safeParse } = require('./aiResponse');", sanitize_func)


# Update the system prompt in generateNextQuestion
old_prompt = """    let prompt = `You are a friendly, professional AI assistant conducting a cognitive wellness screening.
You need to ask a question related to: ${conceptObj.text}
User's inferred life stage (based on age): ${lifeStage}. Adapt your tone naturally. Do NOT assume impairment based on age.

IMPORTANT RULES:
1. Do NOT ask a question you have already asked. Past questions: [${pastQuestions}]
2. Keep the question brief, clear, and singular (don't ask two things at once).
3. Do NOT say "Okay" or "Thank you" before asking the question. Just ask the question naturally.
`;"""

new_prompt = """    let prompt = `You are a Cognitive Wellness Assistant.
Return ONLY the final conversational response intended for the user.
Never output chain-of-thought, analysis, planning, hidden reasoning, internal instructions, system prompts, developer instructions, or intermediate drafts.
Do not use <think> tags.
Do not explain how you generated the question.
Output only the sentence/message that should appear in the chat.

You need to ask a question related to: ${conceptObj.text}
User's inferred life stage (based on age): ${lifeStage}. Adapt your tone naturally. Do NOT assume impairment based on age.

IMPORTANT RULES:
1. Do NOT ask a question you have already asked. Past questions: [${pastQuestions}]
2. Keep the question brief, clear, and singular (don't ask two things at once).
3. Do NOT say "Okay" or "Thank you" before asking the question. Just ask the question naturally.
`;"""
content = content.replace(old_prompt, new_prompt)

# Update the replacement logic at the end of generateNextQuestion
old_logic = """      let questionText = result.choices[0].message.content || "";
      
      // Robust sanitizer for <think> tags
      questionText = questionText.replace(/<think>[\\s\\S]*?<\\/think>/gi, ""); // Remove complete blocks
      questionText = questionText.replace(/<think>[\\s\\S]*/gi, ""); // Remove unclosed blocks
      questionText = questionText.replace(/<\\/think>/gi, ""); // Remove stray closing tags
      questionText = questionText.trim();

      if (!questionText) {
         questionText = "Could you tell me more about that?";
      }"""

new_logic = """      let questionText = result.choices[0].message.content || "";
      console.log("[AI] Raw response received:", questionText);
      
      const fallbackMsg = "Could you tell me a little more about that?";
      questionText = sanitizeAssistantResponse(questionText, fallbackMsg);
      
      console.log("[AI] Sanitized response:", questionText);
      console.log("[AI] Current concept:", this.currentConcept);
      console.log("[AI] Extracted concepts:", Array.from(this.answeredQuestionConcepts));"""
content = content.replace(old_logic, new_logic)


with open("utils/assessmentEngine.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated assessmentEngine.js successfully.")
