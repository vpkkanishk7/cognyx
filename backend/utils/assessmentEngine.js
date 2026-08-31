const Groq = require('groq-sdk');
const { safeParse } = require('./aiResponse');

const SETUP_QUESTIONS = [
  { 
    id: "COMFORT", 
    intent: "COMFORT", 
    category: "SETUP", 
    defaultText: "Hello, I am your digital clinician. How are you feeling today?",
    translations: {
      en: "Hello, I am your digital clinician. How are you feeling today?",
      ta: "வணக்கம், நான் உங்கள் டிஜிட்டல் மருத்துவர். இன்று நீங்கள் எப்படி உணர்கிறீர்கள்?",
      hi: "नमस्ते, मैं आपका डिजिटल चिकित्सक हूँ। आज आप कैसा महसूस कर रहे हैं?"
    }
  }
];

const SCORED_QUESTIONS = [
  { 
    id: "AGE", 
    intent: "AGE", 
    category: "Demographic/context", 
    defaultText: "Could you tell me your age or date of birth?",
    translations: {
      en: "Could you tell me your age or date of birth?",
      ta: "உங்கள் வயது அல்லது பிறந்த தேதியைக் கூற முடியுமா?",
      hi: "क्या आप मुझे अपनी आयु या जन्म तिथि बता सकते हैं?"
    }
  },
  { 
    id: "ORIENTATION", 
    intent: "ORIENTATION", 
    category: "Orientation", 
    defaultText: "To get started, could you tell me what today's date is and what city or place you are in right now?",
    translations: {
      en: "To get started, could you tell me what today's date is and what city or place you are in right now?",
      ta: "தொடங்குவதற்கு, இன்றைய தேதி என்ன என்றும், நீங்கள் தற்போது எந்த நகரம் அல்லது இடத்தில் இருக்கிறீர்கள் என்றும் கூற முடியுமா?",
      hi: "शुरुआत करने के लिए, क्या आप मुझे बता सकते हैं कि आज की तारीख क्या है और आप अभी किस शहर या स्थान पर हैं?"
    }
  },
  { 
    id: "DAILY_ROUTINE", 
    intent: "DAILY_ROUTINE", 
    category: "Daily routine", 
    defaultText: "Can you describe something you usually do during a normal day from morning to evening?",
    translations: {
      en: "Can you describe something you usually do during a normal day from morning to evening?",
      ta: "ஒரு சாதாரண நாளில் காலையிலிருந்து மாலை வரை நீங்கள் வழக்கமாகச் செய்யும் ஒன்றை விவரிக்க முடியுமா?",
      hi: "क्या आप बता सकते हैं कि आप आमतौर पर सुबह से शाम तक सामान्य दिन में क्या करते हैं?"
    }
  },
  { 
    id: "RECENT_MEMORY", 
    intent: "RECENT_MEMORY", 
    category: "Recent memory", 
    defaultText: "What is one thing you remember doing yesterday or recently?",
    translations: {
      en: "What is one thing you remember doing yesterday or recently?",
      ta: "நேற்று அல்லது சமீபத்தில் நீங்கள் செய்ததாக நினைவில் இருக்கும் ஒரு விஷயம் என்ன?",
      hi: "ऐसी कौन सी एक बात है जो आपको कल या हाल ही में करने की याद है?"
    }
  },
  { 
    id: "ATTENTION", 
    intent: "ATTENTION", 
    category: "Attention", 
    defaultText: "When you are doing normal activities like reading, working, or watching TV, how easy is it for you to stay focused?",
    translations: {
      en: "When you are doing normal activities like reading, working, or watching TV, how easy is it for you to stay focused?",
      ta: "வாசிப்பது, வேலை செய்வது அல்லது டிவி பார்ப்பது போன்ற சாதாரண நடவடிக்கைகளைச் செய்யும்போது, கவனம் செலுத்துவது உங்களுக்கு எவ்வளவு எளிதாக இருக்கிறது?",
      hi: "पढ़ने, काम करने या टीवी देखने जैसी सामान्य गतिविधियाँ करते समय, ध्यान केंद्रित रखना आपके लिए कितना आसान है?"
    }
  },
  { 
    id: "LANGUAGE", 
    intent: "LANGUAGE", 
    category: "Language", 
    defaultText: "Do you sometimes have difficulty finding the right word when speaking or writing?",
    translations: {
      en: "Do you sometimes have difficulty finding the right word when speaking or writing?",
      ta: "பேசும்போது அல்லது எழுதும்போது சரியான வார்த்தையைக் கண்டுபிடிப்பதில் சில நேரங்களில் சிரமம் ஏற்படுகிறதா?",
      hi: "क्या बोलते या लिखते समय आपको कभी-कभी सही शब्द खोजने में कठिनाई होती है?"
    }
  },
  { 
    id: "EVERYDAY_MEMORY", 
    intent: "EVERYDAY_MEMORY", 
    category: "Prospective memory", 
    defaultText: "Do you ever forget where you placed things, forget appointments, or need reminders for everyday tasks?",
    translations: {
      en: "Do you ever forget where you placed things, forget appointments, or need reminders for everyday tasks?",
      ta: "பொருட்களை வைத்த இடத்தை மறப்பது, சந்திப்புகளை மறப்பது அல்லது அன்றாட பணிகளுக்கு நினைவூட்டல்கள் தேவைப்படுவது போன்ற நிகழ்வுகள் உங்களுக்கு ஏற்படுகிறதா?",
      hi: "क्या आप कभी चीजें रखकर भूल जाते हैं, अपॉइंटमेंट भूल जाते हैं, या दैनिक कार्यों के लिए रिमाइंडर की आवश्यकता होती है?"
    }
  }
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
    this.clarificationAttempted = false;
    this.userAnswers = {};
    this.timingData = [];
    this.history = [];
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

  getLocalizedQuestion(qObj, lang = "en") {
    if (!qObj) return "";
    const l = (lang === "ta" || lang === "hi") ? lang : "en";
    if (qObj.translations && qObj.translations[l]) {
      return qObj.translations[l];
    }
    return qObj.defaultText || "";
  }

  async processUserMessage(groqClient, userMessage, responseTimeMs = null, inputMethod = "text", language = "en") {
    const activeLang = (language === "ta" || language === "hi") ? language : "en";
    const langName = activeLang === "ta" ? "Tamil" : (activeLang === "hi" ? "Hindi" : "English");

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
      this.lastQuestionWording = this.getLocalizedQuestion(currentQuestion, activeLang);
      this.history.push({ role: "assistant", text: this.lastQuestionWording });
      return { 
        type: "question", 
        acknowledgement: null, 
        question: this.lastQuestionWording, 
        isComplete: false 
      };
    }

    if (this.conversationComplete) {
      const closingAck = activeLang === "ta"
        ? "பகிர்ந்தமைக்கு நன்றி. நமது உரையாடல் பரிசோதனை நிறைவடைந்தது."
        : (activeLang === "hi"
            ? "साझा करने के लिए धन्यवाद। हमारा संवादात्मक मूल्यांकन पूरा हो गया है।"
            : "Thank you for sharing that with me. We have completed the conversational screening.");
      return { 
        type: "complete", 
        conversation_complete: true, 
        acknowledgement: closingAck,
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
        uncertainty_flag: userMessage && userMessage.toLowerCase().match(/don't know|can't remember|not sure|no idea|தெரியாது|மறந்து|याद नहीं|पता नहीं/i) ? true : false,
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
Target Language: ${langName}

Conversation Context So Far:
${recentHistoryStr}

Current Clinical Target Intent: ${currentQuestion.intent}
User's Latest Response: "${userMessage}"
Next Clinical Target Intent: ${nextQuestion ? nextQuestion.intent : "NONE - Conversation Concludes"}

Clinical Communication Guidelines:
- Respond naturally, warmly, and empathetically in ${langName} directly acknowledging the user's specific response.
- Extract the factual core value (e.g. numeric "62" for age, occupation, hometown, etc.).
- DO NOT ask questions or add follow-up questions in the acknowledgement. The system will append the next question automatically.

Output STRICT JSON ONLY:
{
  "extracted_value": "...",
  "acknowledgement": "Warm, natural sentence in ${langName} directly acknowledging their specific answer"
}`;

    let extracted;
    try {
      const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
      const groqCall = groqClient.chat.completions.create({
        messages: [
          { role: "system", content: `You are the COGNYX digital clinician conducting a warm, natural cognitive screening dialogue in ${langName}. Output STRICT JSON.` },
          { role: "user", content: extractionPrompt }
        ],
        model: groqModel,
        response_format: { type: "json_object" },
        temperature: 0.6
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Groq conversational completion timed out")), 2500)
      );

      const res = await Promise.race([groqCall, timeoutPromise]);
      extracted = safeParse(res.choices[0].message.content, { 
        extracted_value: null, acknowledgement: "" 
      });
    } catch (err) {
      console.error("Conversational LLM notice (fast fallback activated):", err.message);
      const defaultAck = activeLang === "ta" ? "நான் புரிந்து கொண்டேன்." : (activeLang === "hi" ? "मैं समझता हूँ।" : "I understand.");
      extracted = { 
        extracted_value: userMessage, acknowledgement: defaultAck
      };
    }

    if (currentQuestion.id === "AGE" && (extracted.extracted_value || userMessage)) {
      const combinedText = `${extracted.extracted_value || ""} ${userMessage}`;
      const match = combinedText.match(/\d+/);
      if (match) {
        this.age = match[0];
        this.ageBand = this.calculateAgeBand(this.age);
      }
    }

    if (!isSetup && timingRecord) {
      if (userMessage.toLowerCase().match(/don't know|can't remember|not sure|no idea|தெரியாது|மறந்து|याद नहीं|पता नहीं/i)) {
        timingRecord.answer_status = "not_available";
      }
    }

    this.userAnswers[currentQuestion.id] = {
      raw: userMessage,
      extracted: extracted.extracted_value,
      time_ms: responseTimeMs
    };

    // Advance to next phase/question
    this.currentPhase = nextPhase;
    this.currentQuestionIndex = nextIndex;

    this.lastQuestionWording = nextQuestion ? this.getLocalizedQuestion(nextQuestion, activeLang) : "";
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
      const finalMsg = activeLang === "ta"
        ? "உங்கள் அனுபவங்களை என்னுடன் பகிர்ந்து கொண்டதற்கு மிக்க நன்றி. நமது உரையாடல் பரிசோதனை நிறைவடைந்தது."
        : (activeLang === "hi"
            ? "अपने अनुभव मेरे साथ साझा करने के लिए बहुत-बहुत धन्यवाद। हमारा संवादात्मक मूल्यांकन पूरा हो गया है।"
            : "Thank you so much for sharing your experiences with me. We have finished our conversational screening.");
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