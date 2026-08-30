const Groq = require('groq-sdk');
const { safeParse } = require('./aiResponse');

const SETUP_QUESTIONS = [
  { id: "COMFORT", intent: "COMFORT", category: "SETUP", defaultText: "Hello, I am your digital clinician. How are you feeling today?" }
];

const SCORED_QUESTIONS = [
  { id: "AGE", intent: "AGE", category: "Demographic/context", defaultText: "Could you tell me your age or date of birth?" },
  { id: "ORIENTATION", intent: "ORIENTATION", category: "Orientation", defaultText: "To get started, could you tell me what today's date is and what city or place you are in right now?" },
  { id: "DAILY_ROUTINE", intent: "DAILY_ROUTINE", category: "Daily routine", defaultText: "Can you describe something you usually do during a normal day from morning to evening?" },
  { id: "RECENT_MEMORY", intent: "RECENT_MEMORY", category: "Recent memory", defaultText: "What is one thing you remember doing yesterday or recently?" },
  { id: "ATTENTION", intent: "ATTENTION", category: "Attention", defaultText: "When you are doing normal activities like reading, working, or watching TV, how easy is it for you to stay focused?" },
  { id: "LANGUAGE", intent: "LANGUAGE", category: "Language", defaultText: "Do you sometimes have difficulty finding the right word when speaking or writing?" },
  { id: "EVERYDAY_MEMORY", intent: "EVERYDAY_MEMORY", category: "Prospective memory", defaultText: "Do you ever forget where you placed things, forget appointments, or need reminders for everyday tasks?" }
];

const TIMING_THRESHOLDS = {
  "≤20 years":   { FAST: 4, EXPECTED: [4, 11], SLOW: [11, 18] },
  "21–50 years": { FAST: 5, EXPECTED: [5, 13], SLOW: [13, 22] },
  "51–70 years": { FAST: 6, EXPECTED: [6, 16], SLOW: [16, 26] },
  "71–100 years":{ FAST: 8, EXPECTED: [8, 20], SLOW: [20, 32] },
  "Unknown":     { FAST: 6, EXPECTED: [6, 15], SLOW: [15, 25] }
};

const CATEGORY_MULTIPLIERS = {
  "PERSONAL_FACT": 1.0,
  "SIMPLE_DAILY": 1.0,
  "ROUTINE": 1.2,
  "PLANNING": 1.2,
  "AUTOBIOGRAPHICAL": 1.3,
  "SETUP": 1.0
};

class AssessmentEngine {
  constructor(username) {
    this.username = username;
    this.currentPhase = "SETUP"; // "SETUP" or "SCORED"
    this.currentQuestionIndex = 0;
    this.conversationComplete = false;
    this.clarificationAttempted = false; // Tracks if we clarified the CURRENT question
    this.userAnswers = {};
    this.timingData = [];
    this.history = []; // Multi-turn conversational dialogue memory
    this.lastQuestionWording = null;
    this.age = null;
    this.ageBand = "Unknown";
  }

  calculateAgeBand(age) {
    const a = parseInt(age, 10);
    if (isNaN(a) || a <= 0) return "51–70 years";
    if (a <= 20) return "≤20 years";
    if (a <= 50) return "21–50 years";
    if (a <= 70) return "51–70 years";
    return "71–100 years";
  }

  classifyTiming(ageBand, category, responseTimeMs) {
    if (responseTimeMs === null || responseTimeMs === undefined || responseTimeMs <= 0) {
      return "NOT_AVAILABLE";
    }
    const sec = responseTimeMs / 1000;
    const thresholds = TIMING_THRESHOLDS[ageBand] || TIMING_THRESHOLDS["Unknown"];
    const mult = CATEGORY_MULTIPLIERS[category] || 1.0;

    const fastLim = thresholds.FAST * mult;
    const expectedLow = thresholds.EXPECTED[0] * mult;
    const expectedHigh = thresholds.EXPECTED[1] * mult;
    const slowLow = thresholds.SLOW[0] * mult;
    const slowHigh = thresholds.SLOW[1] * mult;

    if (sec < fastLim) return "FAST";
    if (sec >= expectedLow && sec <= expectedHigh) return "EXPECTED";
    if (sec > expectedHigh && sec <= slowHigh) return "SLOW";
    return "VERY_SLOW";
  }

  async processUserMessage(groqClient, userMessage, responseTimeMs = null, inputMethod = "text") {
    if (userMessage === "[START]") {
      this.currentPhase = "SETUP";
      this.currentQuestionIndex = 0;
      this.conversationComplete = false;
      this.clarificationAttempted = false;
      this.userAnswers = {};
      this.timingData = [];
      this.history = [];
      this.age = null;
      this.ageBand = "Unknown";
      
      const currentQuestion = SETUP_QUESTIONS[0];
      this.lastQuestionWording = currentQuestion.defaultText;
      this.history.push({ role: "assistant", text: currentQuestion.defaultText });
      return { 
        type: "question", 
        acknowledgement: null, 
        question: currentQuestion.defaultText, 
        isComplete: false 
      };
    }

    if (this.conversationComplete) {
      return { 
        type: "complete", 
        conversation_complete: true, 
        acknowledgement: "Thank you for sharing that with me. We have completed the conversational screening.",
        timingData: this.timingData
      };
    }

    const isSetup = this.currentPhase === "SETUP";
    const questionsArray = isSetup ? SETUP_QUESTIONS : SCORED_QUESTIONS;
    const currentQuestion = questionsArray[this.currentQuestionIndex];
    
    let timingRecord = null;
    if (!isSetup) {
      const timeClassification = this.classifyTiming(this.ageBand, currentQuestion.category, responseTimeMs);
      const answerTimestamp = Date.now();
      const questionTimestamp = responseTimeMs ? answerTimestamp - responseTimeMs : null;
      
      timingRecord = {
        question_id: currentQuestion.id,
        question_number: this.currentQuestionIndex + 1,
        age: this.age ? parseInt(this.age, 10) : null,
        age_group: this.ageBand,
        question_category: currentQuestion.category,
        question_text: this.lastQuestionWording,
        user_answer: userMessage,
        answer_length: userMessage ? userMessage.length : 0,
        is_empty: !userMessage || userMessage.trim().length === 0,
        uncertainty_flag: userMessage && userMessage.toLowerCase().match(/don't know|can't remember|not sure|no idea/i) ? true : false,
        answer_status: "answered",
        question_timestamp: questionTimestamp,
        answer_timestamp: answerTimestamp,
        response_time_ms: responseTimeMs || null,
        response_time_seconds: responseTimeMs ? parseFloat((responseTimeMs / 1000).toFixed(2)) : null,
        timing_classification: timeClassification,
        input_method: inputMethod
      };
      this.timingData.push(timingRecord);
    }
    
    this.history.push({ role: "user", text: userMessage });

    const isLastQuestion = this.currentQuestionIndex === questionsArray.length - 1;
    let nextQuestion = null;
    let nextPhase = this.currentPhase;
    let nextIndex = this.currentQuestionIndex;

    if (!isLastQuestion) {
      nextQuestion = questionsArray[this.currentQuestionIndex + 1];
      nextIndex++;
    } else if (isSetup) {
      nextQuestion = SCORED_QUESTIONS[0];
      nextPhase = "SCORED";
      nextIndex = 0;
    }

    // Build context transcript for LLM
    const recentHistoryStr = this.history.slice(-8).map(h => `${h.role === 'assistant' ? 'Clinician' : 'User'}: "${h.text}"`).join("\n");

    const extractionPrompt = `You are the COGNYX clinical AI clinician conducting a warm, supportive, and natural conversational screening.

Conversation Context So Far:
${recentHistoryStr}

Current Clinical Target Intent: ${currentQuestion.intent}
User's Latest Response: "${userMessage}"
Next Clinical Target Intent: ${nextQuestion ? nextQuestion.intent : "NONE - Conversation Concludes"}

Clinical Communication Guidelines:
- Respond naturally, warmly, and empathetically to the specific content and nuance of the user's answer.
- Extract the factual core value (e.g. "62" for age, "Teacher" for occupation, "Springfield" for hometown).
- DO NOT generate follow-up questions or clarify the user's answer, even if their answer is short, vague, "I don't know", or "okay".
- You are ONLY generating an acknowledgement of the user's answer. The system will append the next question automatically.

Output STRICT JSON ONLY:
{
  "extracted_value": "...",
  "acknowledgement": "Warm, natural sentence directly reflecting their specific answer"
}`;

    let extracted;
    try {
      const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
      const res = await groqClient.chat.completions.create({
        messages: [
          { role: "system", content: "You are the COGNYX digital clinician conducting a warm, natural, and medically sound cognitive screening dialogue. Output STRICT JSON." },
          { role: "user", content: extractionPrompt }
        ],
        model: groqModel,
        response_format: { type: "json_object" },
        temperature: 0.6
      });
      extracted = safeParse(res.choices[0].message.content, { 
        extracted_value: null, acknowledgement: "" 
      });
    } catch (err) {
      console.error("Conversational LLM error:", err.message);
      extracted = { 
        extracted_value: userMessage, acknowledgement: ""
      };
    }

    if (currentQuestion.id === "AGE" && extracted.extracted_value) {
      const match = String(extracted.extracted_value).match(/\d+/);
      if (match) {
        this.age = match[0];
        this.ageBand = this.calculateAgeBand(this.age);
      }
    }

    if (!isSetup && timingRecord) {
      if (userMessage.toLowerCase().match(/don't know|can't remember|not sure|no idea/)) {
        timingRecord.answer_status = "not_available";
      }
    }

    this.userAnswers[currentQuestion.id] = {
      raw: userMessage,
      extracted: extracted.extracted_value,
      time_ms: responseTimeMs
    };

    // Unconditionally advance to the next phase/question
    this.currentPhase = nextPhase;
    this.currentQuestionIndex = nextIndex;

    this.lastQuestionWording = nextQuestion ? nextQuestion.defaultText : "";
    const combinedReply = extracted.acknowledgement ? `${extracted.acknowledgement} ${this.lastQuestionWording}` : this.lastQuestionWording;
    
    if (nextQuestion) {
      this.history.push({ role: "assistant", text: combinedReply });
      return {
        type: "question",
        acknowledgement: extracted.acknowledgement, 
        question: this.lastQuestionWording,
        isComplete: false
      };
    } else {
      this.conversationComplete = true;
      const finalMsg = "Thank you so much for sharing your experiences with me. We have finished our conversational screening.";
      const fullClosing = extracted.acknowledgement ? `${extracted.acknowledgement} ${finalMsg}` : finalMsg;
      this.history.push({ role: "assistant", text: fullClosing });
      return {
        type: "complete",
        acknowledgement: fullClosing,
        conversation_complete: true,
        timingData: this.timingData
      };
    }
  }
}

module.exports = { AssessmentEngine, SETUP_QUESTIONS, SCORED_QUESTIONS, TIMING_THRESHOLDS, CATEGORY_MULTIPLIERS };