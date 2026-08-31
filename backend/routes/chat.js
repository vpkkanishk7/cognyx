const express = require('express');
const Groq = require('groq-sdk');
const authMiddleware = require('../middleware/auth');
const { AssessmentEngine } = require('../utils/assessmentEngine');

const router = express.Router();
const sessions = {};

function getSession(username) {
  if (!sessions[username]) {
    sessions[username] = new AssessmentEngine(username);
  }
  return sessions[username];
}

router.post('/chat/reset', authMiddleware, (req, res) => {
  const username = req.user.username;
  sessions[username] = new AssessmentEngine(username);
  res.json({ success: true, message: "Assessment state reset." });
});

router.post('/chat', authMiddleware, async (req, res) => {
  const { message, responseTimeMs, inputMethod, language } = req.body;
  const username = req.user.username;
  
  if (!message) return res.status(400).json({ error: 'Message is required' });

  let session = getSession(username);
  const activeLang = (language === 'ta' || language === 'hi') ? language : 'en';
  
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const replyObj = await session.processUserMessage(groq, message, responseTimeMs, inputMethod || "text", activeLang);
    
    res.json({ 
      ...replyObj, 
      detected_age: session.age ? parseInt(session.age, 10) : null,
      detected_age_band: session.ageBand || null,
      analysis_source: "groq" 
    });
  } catch (err) {
    console.error("Chat API Error:", err.message);
    const fallbackQ = activeLang === 'ta'
      ? "தற்போது இணைப்பதில் சிக்கல் உள்ளது. மீண்டும் கூற முடியுமா?"
      : (activeLang === 'hi'
          ? "मुझे अभी कनेक्ट करने में समस्या हो रही है। क्या आप इसे दोहरा सकते हैं?"
          : "I'm having trouble connecting right now. Can you repeat that?");
    res.json({ 
      type: "question", 
      acknowledgement: null, 
      question: fallbackQ, 
      detected_age: session.age ? parseInt(session.age, 10) : null,
      detected_age_band: session.ageBand || null,
      analysis_source: "fallback" 
    });
  }
});

module.exports = router;
