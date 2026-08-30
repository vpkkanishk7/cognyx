import os

filepath = r"backend\utils\assessmentEngine.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace everything from "class AssessmentEngine" downwards.
start_idx = content.find("class AssessmentEngine")

new_class = """class AssessmentEngine {
  constructor(username) {
    this.username = username;
    this.age = null;
    this.answeredQuestionConcepts = new Set();
    this.userAnswers = {};
    this.history = [];
    this.turn = 0;
    this.currentConcept = null;
    this.conceptAttemptCounts = {};
  }

  getLifeStage() {
    if (!this.age) return 'unknown';
    if (this.age <= 30) return '18-30';
    if (this.age <= 50) return '31-50';
    if (this.age <= 65) return '51-65';
    return '66+';
  }
  
  getUnansweredConcepts() {
    return CONCEPT_KEYS.filter(k => !this.answeredQuestionConcepts.has(k));
  }

  selectNextConcept() {
    const unanswered = this.getUnansweredConcepts();
    for (const key of unanswered) {
      if ((this.conceptAttemptCounts[key] || 0) < 2) {
        return key;
      }
    }
    // If all are answered or attempted >= 2 times, just return the first unanswered one or null
    return unanswered.length > 0 ? unanswered[0] : null;
  }

  async processUserResponse(groqClient, userInput) {
    this.turn++;
    
    // Check if initializing
    if (userInput === "[SYSTEM_INIT]" || this.history.length === 0 && userInput.includes("[SYSTEM:")) {
       this.history = [];
       this.currentConcept = "AGE";
       this.conceptAttemptCounts["AGE"] = 1;
       const initialMsg = `Hello ${this.username}, I'm your COGNYX Cognitive Wellness Assistant. Before we begin, could you tell me how old you are?`;
       this.history.push({ role: 'assistant', content: initialMsg });
       return { type: 'continue', text: initialMsg, answers: this.userAnswers };
    }

    this.history.push({ role: 'user', content: userInput });

    const unanswered = this.getUnansweredConcepts();
    if (unanswered.length === 0) {
       return { type: 'complete', text: "[CONVERSATION_COMPLETE]", answers: this.userAnswers };
    }

    const lifeStage = this.getLifeStage();
    // Pass last 8 messages for context
    const historyStr = this.history.slice(-8).map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join("\\n");

    const prompt = `You are a COGNYX Cognitive Wellness Assistant having a natural conversation.
Your goal is to collect information on 7 objectives naturally.

Remaining objectives to gather:
${unanswered.map(k => `- ${k}: ${CONCEPTS[k].text}`).join("\\n")}

Conversation history:
${historyStr}

INSTRUCTIONS:
1. Extract any useful facts from the User's latest message that satisfy ANY of the remaining objectives.
2. If the user answered an objective, include it in 'objectives_covered_this_turn'.
3. If the user's answer is vague (e.g. "bad", "what", "fine", "I don't know"), DO NOT mark the objective as covered. 
4. Generate a natural, empathetic 'reply'. Do not say "Okay" or "Thank you" repeatedly.
5. In your 'reply', ask a question to pursue the 'next_objective'. Keep questions short (one per reply).
6. Do NOT repeat a question if it has already been asked. If the user is struggling or gave a vague answer twice, pick a DIFFERENT objective.
7. Adapt your tone to the user's life stage: ${lifeStage}.
8. If 'AGE' is the next_objective, explicitly ask "How old are you?" (or similar). Do NOT assume age.
9. Reply MUST be a valid JSON object.

JSON FORMAT:
{
  "extracted_data": {
    "OBJECTIVE_KEY": "extracted fact from user"
  },
  "objectives_covered_this_turn": ["OBJECTIVE_KEY1"],
  "next_objective": "ONE_OF_THE_REMAINING_OBJECTIVES",
  "reply": "Your natural conversational response to the user, ending with the next question."
}`;

    try {
      const extResult = await groqClient.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      });

      let contentStr = extResult.choices[0].message.content;
      // fallback manual parse
      let parsed = null;
      try {
        parsed = JSON.parse(contentStr);
      } catch(e) {
        // if trailing text exists
        const start = contentStr.find("{");
        const end = contentStr.rfind("}");
        if (start != -1 && end != -1) {
            parsed = JSON.parse(contentStr.substring(start, end+1));
        }
      }
      
      if (!parsed) {
         // fallback simple
         parsed = {
            reply: "Could you tell me a little more about that?",
            extracted_data: {},
            objectives_covered_this_turn: [],
            next_objective: this.currentConcept
         };
      }
      
      console.log(`[COGNYX CHAT]\\nUser message: ${userInput}\\nCurrent objective: ${this.currentConcept}\\nExtracted information: ${JSON.stringify(parsed.extracted_data)}\\nCovered objectives: ${JSON.stringify(parsed.objectives_covered_this_turn)}\\nNext objective: ${parsed.next_objective}\\nGenerated reply: ${parsed.reply}\\n`);

      if (parsed.objectives_covered_this_turn && Array.isArray(parsed.objectives_covered_this_turn)) {
        for (const obj of parsed.objectives_covered_this_turn) {
          this.answeredQuestionConcepts.add(obj);
        }
      }
      
      if (parsed.extracted_data) {
        for (const [key, val] of Object.entries(parsed.extracted_data)) {
          this.userAnswers[key] = val;
          if (key === 'AGE') {
             const parsedAge = parseInt(val);
             if (!isNaN(parsedAge)) this.age = parsedAge;
          }
        }
      }

      this.currentConcept = parsed.next_objective || this.selectNextConcept();
      if (this.currentConcept) {
        this.conceptAttemptCounts[this.currentConcept] = (this.conceptAttemptCounts[this.currentConcept] || 0) + 1;
      }
      
      const newUnanswered = this.getUnansweredConcepts();
      let questionText = parsed.reply || "Could you tell me a little more about that?";
      
      const fallbackMsg = "Could you tell me a little more about that?";
      questionText = sanitizeAssistantResponse(questionText, fallbackMsg);
      
      this.history.push({ role: 'assistant', content: questionText });
      
      if (newUnanswered.length === 0) {
         return { type: 'complete', text: "[CONVERSATION_COMPLETE]", answers: this.userAnswers };
      }
      
      return { type: 'continue', text: questionText, answers: this.userAnswers };

    } catch (err) {
      console.error("Chat engine error:", err);
      const fb = "Could you tell me a little more about that?";
      this.history.push({ role: 'assistant', content: fb });
      return { type: 'continue', text: fb, answers: this.userAnswers };
    }
  }
}

module.exports = { AssessmentEngine };
"""

content = content[:start_idx] + new_class

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated backend/utils/assessmentEngine.js with single-pass JSON extraction logic.")
