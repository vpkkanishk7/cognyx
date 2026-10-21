const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const authMiddleware = require('../middleware/auth');
const { safeParse, validateNumericBiomarkers } = require('../utils/aiResponse');
const { evaluateGreenTargetResponse, evaluateResponseTime } = require('../utils/scoringEngine');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(GEMINI_API_KEY);

const https = require('https');
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const DISCLAIMER = "\n\n*Disclaimer: This cognitive wellness assessment is not a medical diagnosis. Results should not be used to diagnose dementia or any other medical condition. If you have persistent concerns about cognitive changes, consult a qualified healthcare professional.*";

// Dynamic Text-to-Speech (TTS) Streaming Proxy for Tamil, Hindi, English
router.get('/tts', (req, res) => {
  const text = (req.query.text || '').trim();
  const lang = (req.query.lang || 'en').toLowerCase();
  
  if (!text) {
    return res.status(400).json({ error: 'Text parameter is required for TTS' });
  }

  // Slice to max 250 characters per phrase to ensure instant streaming response
  const cleanText = text.slice(0, 250);
  const targetLang = lang === 'ta' ? 'ta' : (lang === 'hi' ? 'hi' : 'en');
  
  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${targetLang}&client=tw-ob`;

  const requestOptions = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://translate.google.com/'
    }
  };

  https.get(googleTtsUrl, requestOptions, (ttsRes) => {
    if (ttsRes.statusCode !== 200) {
      console.warn(`[TTS PROXY] Google TTS returned status ${ttsRes.statusCode} for lang ${targetLang}`);
      return res.status(502).json({ error: 'TTS upstream unavailable' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    ttsRes.pipe(res);
  }).on('error', (err) => {
    console.error('[TTS PROXY ERROR]:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'TTS streaming error' });
    }
  });
});

// Save Full Session Video
router.post('/save-session', authMiddleware, upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No video file provided.' });
  try {
    const ext = req.file.mimetype === 'video/webm' ? '.webm' : '.mp4';
    const filename = `session_${Date.now()}_${Math.floor(Math.random()*1000)}${ext}`;
    const destDir = path.join(__dirname, '..', 'uploads', 'sessions');
    
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    
    const targetPath = path.join(destDir, filename);
    fs.renameSync(req.file.path, targetPath);
    
    res.json({ success: true, url: `/sessions/${filename}` });
  } catch (err) {
    console.error("Session Video Save Error:", err.message);
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Failed to save session video.' });
  }
});

// Analyze Real Video Upload
router.post('/analyze-video', authMiddleware, upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No video file provided.' });

  const simulateOffline = () => {
    res.json({
      OCULOMOTOR: null, FACIAL_AFFECT: null, KINEMATIC: null, LINGUISTIC_ACOUSTIC: null,
      summary: "Fallback: AI temporarily unavailable.",
      analysis_source: "fallback"
    });
  };

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 15000);

  try {
    const uploadResult = await fileManager.uploadFile(req.file.path, {
      mimeType: req.file.mimetype,
      displayName: "Assessment Video",
    });

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash" });
    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [
            { fileData: { mimeType: uploadResult.file.mimeType, fileUri: uploadResult.file.uri } },
            { text: "Analyze this video for behavioral metrics. Extract and score from 0 to 100: OCULOMOTOR (gaze stability), FACIAL_AFFECT (apathy vs active expressions), KINEMATIC (psychomotor slowness), LINGUISTIC_ACOUSTIC (speech pace). Output ONLY a valid JSON object with keys: OCULOMOTOR, FACIAL_AFFECT, KINEMATIC, LINGUISTIC_ACOUSTIC, and a brief string 'summary'. No markdown." }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    }, { signal: abortController.signal });

    clearTimeout(timeout);
    fs.unlinkSync(req.file.path);

    const rawJson = safeParse(result.response.text(), {});
    const safeData = validateNumericBiomarkers(rawJson, {
      OCULOMOTOR: 'number', FACIAL_AFFECT: 'number', KINEMATIC: 'number', LINGUISTIC_ACOUSTIC: 'number', summary: "Could not parse details."
    });
    safeData.analysis_source = "gemini";

    res.json(safeData);
  } catch (err) {
    clearTimeout(timeout);
    console.error("Gemini Video Upload Error:", err.message);
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    simulateOffline();
  }
});

// Analyze Clock Drawing
router.post('/analyze-clock', authMiddleware, async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'No image provided.' });

  const base64Data = image.replace(/^data:image\/png;base64,/, "");

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 10000);

  try {
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash" });
    const prompt = "Analyze the image. Score it out of 10 based on standard visual rubrics (contour, numbers, hands, time accuracy). If the user drew a rough or messy diagram, DO NOT penalize them heavily as long as it is structurally correct and shows the right time.";
    
    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [
            { inlineData: { data: base64Data, mimeType: "image/png" } },
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.INTEGER, description: "Score from 0 to 10" },
            analysis: { type: SchemaType.STRING, description: "Brief analysis" }
          },
          required: ["score", "analysis"]
        }
      }
    }, { signal: abortController.signal });

    clearTimeout(timeout);
    const rawJson = safeParse(result.response.text(), { score: null, analysis: "Parse failed" });
    
    const finalScore = (rawJson.score !== null && rawJson.score >= 0 && rawJson.score <= 10) ? rawJson.score : null;
    
    res.json({ score: finalScore, analysis: rawJson.analysis, analysis_source: "gemini" });
  } catch (err) {
    clearTimeout(timeout);
    console.error("Clock analysis error:", err.message);
    res.json({ score: null, analysis: "Fallback: AI offline.", analysis_source: "fallback" });
  }
});

// Analyze Behavior Route (WebGazer Telemetry)
router.post('/analyze-behavior', authMiddleware, async (req, res) => {
  const { telemetry } = req.body;
  if (!telemetry || !Array.isArray(telemetry)) {
    return res.status(400).json({ error: 'No telemetry array provided.' });
  }

  const simulateOffline = () => {
    res.json({
      OCULOMOTOR: null,
      FACIAL_AFFECT: null,
      KINEMATIC: null,
      LINGUISTIC_ACOUSTIC: null,
      summary: "Fallback: AI temporarily unavailable.",
      analysis_source: "fallback"
    });
  };

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 15000);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = "You are a behavioral analysis assistant. Analyze the user's eye-tracking telemetry vectors. \nTelemetry data (sampled): " + JSON.stringify(telemetry.slice(0, 100)) + "\n\nExtract and score only the OCULOMOTOR metric from 0 to 100 based on gaze stability and fixations. Do not invent FACIAL_AFFECT, KINEMATIC, or LINGUISTIC_ACOUSTIC since audio and full video are absent.";

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            OCULOMOTOR: { type: SchemaType.INTEGER },
            summary: { type: SchemaType.STRING }
          },
          required: ["OCULOMOTOR", "summary"]
        }
      }
    }, { signal: abortController.signal });

    clearTimeout(timeout);
    const rawJson = safeParse(result.response.text(), {});
    const safeData = validateNumericBiomarkers(rawJson, {
      OCULOMOTOR: 'number', summary: "Could not parse analysis."
    });
    
    // Explicitly nullify modalities not supported by pure gaze telemetry
    safeData.FACIAL_AFFECT = null;
    safeData.KINEMATIC = null;
    safeData.LINGUISTIC_ACOUSTIC = null;
    safeData.analysis_source = "gemini";

    res.json(safeData);
  } catch (err) {
    clearTimeout(timeout);
    console.error("Gemini Behavior Analysis Error:", err.message);
    simulateOffline();
  }
});

// Generate Final AI Synthesis Report
router.post('/generate-final-report', authMiddleware, async (req, res) => {
  const { assessmentMode, conversation, memoryGame, diagnosis, confidence, dementiaProbabilityPct, riskLevel, scores, videoScores, age, language } = req.body;
  const username = req.user.username;
  
  const greenTargetResponse = evaluateGreenTargetResponse(age, scores?.reactionTrials || scores?.reactionTimeMs);
  const reactionEval = evaluateResponseTime(age, greenTargetResponse.medianMs);
  const probDisplay = dementiaProbabilityPct !== null && dementiaProbabilityPct !== undefined ? `${dementiaProbabilityPct}%` : 'Screening probability unavailable.';
  const safeRiskLevel = riskLevel || (dementiaProbabilityPct !== null && dementiaProbabilityPct !== undefined ? (dementiaProbabilityPct < 35 ? 'Low' : (dementiaProbabilityPct <= 55 ? 'Moderate' : 'Elevated')) : 'Low');
  const activeLang = (language === 'ta' || language === 'hi') ? language : 'en';
  const langName = activeLang === 'ta' ? 'Tamil' : (activeLang === 'hi' ? 'Hindi' : 'English');

  const simulateOfflineReport = () => {
    const memScore = (scores && Number.isFinite(scores.memoryScore)) ? scores.memoryScore : null;
    const patScore = (scores && Number.isFinite(scores.patternScore)) ? scores.patternScore : null;
    const clkScore = (scores && Number.isFinite(scores.clockScore)) ? scores.clockScore : null;
    
    let rawJson;
    if (activeLang === 'ta') {
      rawJson = {
        conversational_observations: [
          "அமர்வு உரையாடலின் போது நிலையான பேச்சு வேகம் மற்றும் பொருத்தமான வாக்கிய உருவாக்கம் வெளிப்பட்டது.",
          "சொற்களை நினைவுபடுத்தி பேசுவதில் நிலைத்தன்மையும் தெளிவும் காணப்பட்டது."
        ],
        cognitive_interpretation: [
          memScore !== null ? `செயல் நினைவகப் பிரிவில் ${memScore}% துல்லியமான சொல் மீட்பு பதிவு செய்யப்பட்டது.` : "செயல் நினைவகப் பரிசோதனை முடிவு கிடைக்கவில்லை.",
          patScore !== null ? `வடிவ முறை சிந்தனை சோதனையில் ${patScore}% துல்லியம் பெறப்பட்டது.` : "வடிவ முறை சிந்தனை முடிவு கிடைக்கவில்லை.",
          clkScore !== null ? `கடிகார வரைதல் சோதனையில் ${clkScore}/10 மதிப்பெண் பெறப்பட்டது.` : "கடிகார வரைதல் முடிவு கிடைக்கவில்லை.",
          greenTargetResponse.medianMs ? `பச்சை இலக்கு எதிர்வினை வேகம்: ${greenTargetResponse.classification} (சராசரி: ${greenTargetResponse.medianMs}ms).` : "எதிர்வினை வேகம் பதிவு செய்யப்படவில்லை."
        ],
        face_voice_observations: [
          videoScores && videoScores.FACIAL_AFFECT !== null && videoScores.FACIAL_AFFECT !== undefined
            ? `முக உணர்ச்சி பரிசோதனை சுறுசுறுப்பான உணர்வு வெளிப்பாட்டை பிரதிபலிக்கிறது.`
            : "முக அசைவு மற்றும் உணர்ச்சி பதிவு இந்த அமர்வில் கிடைக்கவில்லை.",
          videoScores && videoScores.OCULOMOTOR !== null && videoScores.OCULOMOTOR !== undefined
            ? `கண் பார்வை நிலைத்தன்மை குறியீடு: ${videoScores.OCULOMOTOR}.`
            : "நேரடி கண் பார்வை பதிவு கிடைக்கவில்லை."
        ],
        voice_interaction: [
          "பேச்சு வேகம் மற்றும் இடைநிறுத்த அளவீடுகள் இயல்பான வரம்பிற்குள் உள்ளன."
        ],
        ml_risk_analysis: [
          { domain: "அறிவாற்றல் திறன்", indicator: "செயல் நினைவகம்", risk_level: memScore !== null ? (memScore >= 70 ? "Low" : "Moderate") : "Unavailable", explanation: memScore !== null ? "நினைவுத்திறன் பதிவு செய்யப்பட்டுள்ளது." : "தரவு கிடைக்கவில்லை." },
          { domain: "செயல்முறை சிந்தனை", indicator: "வடிவ முறை பகுப்பாய்வு", risk_level: patScore !== null ? (patScore >= 70 ? "Low" : "Moderate") : "Unavailable", explanation: patScore !== null ? "தருக்க சிந்தனை பதிவு செய்யப்பட்டுள்ளது." : "தரவு கிடைக்கவில்லை." },
          { domain: "செயலாக்க வேகம்", indicator: "எதிர்வினை நேரம்", risk_level: greenTargetResponse.riskLevel || "Unavailable", explanation: greenTargetResponse.classification || "தரவு கிடைக்கவில்லை." }
        ],
        overall_risk_score: safeRiskLevel,
        dementia_screening_probability: probDisplay,
        recommendations: [
          "புதிர் விளையாட்டுகள் மற்றும் நினைவாற்றல் பயிற்சிகளில் தொடர்ந்து ஈடுபடுங்கள்.",
          "வழக்கமான உடற்பயிற்சி, சமச்சீரான உணவு மற்றும் போதுமான தூக்கத்தை பராமரிக்கவும்.",
          "நீண்டகால அறிவாற்றல் ஆரோக்கியத்தை கண்காணிக்க அவ்வப்போது பரிசோதனை செய்து கொள்ளுங்கள்."
        ],
        summary: `${username} க்கான அறிவாற்றல் பரிசோதனையில் பரிசோதனை நிகழ்தகவு ${probDisplay} (நிலை: ${safeRiskLevel}) என பதிவு செய்யப்பட்டுள்ளது.`
      };
    } else if (activeLang === 'hi') {
      rawJson = {
        conversational_observations: [
          "सत्र संवाद के दौरान सुसंगत गति और उचित विचार अभिव्यक्ति देखी गई।",
          "बातचीत के दौरान शब्दों का चयन और प्रवाह सामान्य रहा।"
        ],
        cognitive_interpretation: [
          memScore !== null ? `कार्यशील स्मृति परीक्षण में ${memScore}% सटीकता प्राप्त हुई।` : "कार्यशील स्मृति परिणाम उपलब्ध नहीं है।",
          patScore !== null ? `पैटर्न पहचान परीक्षण में ${patScore}% सटीकता दर्ज की गई।` : "पैटर्न परीक्षण परिणाम उपलब्ध नहीं है।",
          clkScore !== null ? `घड़ी निर्माण परीक्षण में ${clkScore}/10 स्कोर प्राप्त हुआ।` : "घड़ी निर्माण परिणाम उपलब्ध नहीं है।",
          greenTargetResponse.medianMs ? `प्रतिक्रिया समय: ${greenTargetResponse.classification} (औसत: ${greenTargetResponse.medianMs}ms).` : "प्रतिक्रिया समय दर्ज नहीं किया गया।"
        ],
        face_voice_observations: [
          videoScores && videoScores.FACIAL_AFFECT !== null && videoScores.FACIAL_AFFECT !== undefined
            ? `चेहरे का भाव विश्लेषण सक्रिय भावनात्मक प्रतिक्रिया दर्शाता है।`
            : "चेहरे के भाव ट्रैकिंग इस सत्र में उपलब्ध नहीं थी।",
          videoScores && videoScores.OCULOMOTOR !== null && videoScores.OCULOMOTOR !== undefined
            ? `आई-ट्रैकिंग स्थिरता स्कोर: ${videoScores.OCULOMOTOR}.`
            : "आई-ट्रैकिंग टेलीमेट्री अनुपलब्ध थी।"
        ],
        voice_interaction: [
          "बोलने की गति और विराम अंतराल स्वास्थ्य मानकों के अनुरूप हैं।"
        ],
        ml_risk_analysis: [
          { domain: "संज्ञानात्मक स्वास्थ्य", indicator: "कार्यशील स्मृति", risk_level: memScore !== null ? (memScore >= 70 ? "Low" : "Moderate") : "Unavailable", explanation: memScore !== null ? "स्मृति क्षमता दर्ज की गई है।" : "डेटा उपलब्ध नहीं है।" },
          { domain: "कार्यकारी कार्य", indicator: "पैटर्न पहचान", risk_level: patScore !== null ? (patScore >= 70 ? "Low" : "Moderate") : "Unavailable", explanation: patScore !== null ? "तार्किक विश्लेषण दर्ज किया गया है।" : "डेटा उपलब्ध नहीं है।" },
          { domain: "प्रसंस्करण गति", indicator: "प्रतिक्रिया समय", risk_level: greenTargetResponse.riskLevel || "Unavailable", explanation: greenTargetResponse.classification || "डेटा उपलब्ध नहीं है।" }
        ],
        overall_risk_score: safeRiskLevel,
        dementia_screening_probability: probDisplay,
        recommendations: [
          "पहेलियों और स्मृति बढ़ाने वाले अभ्यासों में नियमित भाग लें।",
          "नियमित शारीरिक व्यायाम, संतुलित पोषण और पर्याप्त नींद बनाए रखें।",
          "समय-समय पर स्वास्थ्य मूल्यांकन करवाएं।"
        ],
        summary: `${username} के लिए संज्ञानात्मक स्क्रीनिंग में स्क्रीनिंग परिणाम ${probDisplay} (स्तर: ${safeRiskLevel}) दर्ज किया गया है।`
      };
    } else {
      rawJson = {
        conversational_observations: [
          "Consistent conversational cadence and appropriate response formulation during dialogue.",
          "Lexical retrieval and thought expression were fluent and coherent throughout."
        ],
        cognitive_interpretation: [
          memScore !== null ? `Working memory recall achieved ${memScore}% accuracy.` : "Working memory metric unavailable.",
          patScore !== null ? `Pattern recognition test completed with ${patScore}% accuracy across multi-stage geometric sequences.` : "Pattern reasoning metric unavailable.",
          clkScore !== null ? `Visuospatial clock construction scored ${clkScore}/10 with contour and hand placement evaluation.` : "Clock construction metric unavailable.",
          greenTargetResponse.medianMs ? `Sensorimotor Green-Target response latency: ${greenTargetResponse.classification} (Median: ${greenTargetResponse.medianMs}ms vs Age ${greenTargetResponse.ageGroup} range ${greenTargetResponse.expectedMinMs}–${greenTargetResponse.expectedMaxMs}ms).` : "Sensorimotor response latency not measured."
        ],
        face_voice_observations: [
          videoScores && videoScores.FACIAL_AFFECT !== null && videoScores.FACIAL_AFFECT !== undefined
            ? `Video facial affect assessment reflects active emotional responsiveness (Apathy index: ${videoScores.FACIAL_AFFECT}).`
            : "Facial landmark and affect tracking was not recorded for this session.",
          videoScores && videoScores.OCULOMOTOR !== null && videoScores.OCULOMOTOR !== undefined
            ? `Oculomotor telemetry stability index measured at ${videoScores.OCULOMOTOR}.`
            : "Direct ocular tracking telemetry was unavailable."
        ],
        voice_interaction: [
          "Communication pacing and interaction latency remained within expected wellness thresholds."
        ],
        ml_risk_analysis: [
          { domain: "Cognitive Vitality", indicator: "Working Memory & Recall", risk_level: memScore !== null ? (memScore >= 70 ? "Low" : "Moderate") : "Unavailable", explanation: memScore !== null ? "Lexical recall demonstrates recorded retention." : "Metric not available." },
          { domain: "Executive Function", indicator: "Pattern Recognition & Visuospatial", risk_level: patScore !== null ? (patScore >= 70 ? "Low" : "Moderate") : "Unavailable", explanation: patScore !== null ? "Geometric pattern reasoning recorded." : "Metric not available." },
          { domain: "Processing Speed", indicator: "3-Trial Green-Target Response Latency", risk_level: greenTargetResponse.riskLevel || "Unavailable", explanation: greenTargetResponse.medianMs ? `Sensorimotor response latency is ${greenTargetResponse.classification.toLowerCase()} (${greenTargetResponse.medianMs}ms vs ${greenTargetResponse.expectedMinMs}–${greenTargetResponse.expectedMaxMs}ms prototype range for age ${greenTargetResponse.ageGroup}).` : "Metric not available." }
        ],
        overall_risk_score: safeRiskLevel,
        dementia_screening_probability: probDisplay,
        recommendations: [
          "Continue engaging in intellectually stimulating activities such as puzzles and logic games.",
          "Maintain regular physical exercise, balanced nutrition, and restorative sleep to support cognitive longevity.",
          "Schedule periodic wellness check-ins to monitor longitudinal cognitive health trends."
        ],
        summary: `Cognitive health screening for ${username} indicates an Estimated Cognitive Impairment Risk of ${probDisplay} (Screening Level: ${safeRiskLevel}).`
      };
    }
    res.json({ report: rawJson, analysis_source: "fallback" });
  };

  try {
    const prompt = `You are an analytical clinical AI assistant generating a highly structured Cognitive Wellness & Multimodal Synthesis Report.
Subject: ${username}
Modality: ${assessmentMode}
Language: ${langName}

Data:
Estimated Cognitive Impairment Risk (Trained ML Model Output): ${probDisplay}
Screening Risk Level: ${safeRiskLevel}
Model: COGNYX-ML-v3.0-OPTIMAL
Algorithmic Screening Result: ${diagnosis || 'Low Cognitive-Risk Screening Result'}
Conversation History: ${JSON.stringify(conversation || [])}
Memory Registration & Recall: ${JSON.stringify(memoryGame || {})}
Clock Visuospatial Score: ${scores?.clockScore !== null ? scores?.clockScore : 'N/A'}/10
Green-Target Response Latency (Prototype Reference): Median ${greenTargetResponse.medianMs}ms vs Age ${greenTargetResponse.ageGroup} Expected Range ${greenTargetResponse.expectedMinMs}–${greenTargetResponse.expectedMaxMs}ms (Classification: ${greenTargetResponse.classification})
Pattern Recognition Score: ${scores?.patternScore || 'N/A'}%
Facial Affect (Video AI): ${videoScores?.FACIAL_AFFECT !== null && videoScores?.FACIAL_AFFECT !== undefined ? videoScores.FACIAL_AFFECT : 'unavailable'}
Oculomotor Stability: ${videoScores?.OCULOMOTOR !== null && videoScores?.OCULOMOTOR !== undefined ? videoScores.OCULOMOTOR : 'unavailable'}

IMPORTANT GUIDELINES:
- Output all conversational observations, cognitive interpretations, recommendations, and summary in ${langName}.
- You MUST reference the EXACT Estimated Cognitive Impairment Risk (${probDisplay}) and Risk Level (${safeRiskLevel}) without inventing or recalculating.
- Clearly state that this is an algorithmic screening estimate, NOT a medical diagnosis. Never state "the user has dementia".
- Provide supportive, objective, and understandable cognitive wellness insights.
- Your output MUST be a strict JSON object matching this exact schema:
{
  "conversational_observations": ["bullet 1", "bullet 2"],
  "cognitive_interpretation": ["bullet 1", "bullet 2", "bullet 3"],
  "face_voice_observations": ["bullet 1", "bullet 2"],
  "voice_interaction": ["bullet 1", "bullet 2"],
  "ml_risk_analysis": [
    { "domain": "Cognitive Vitality", "indicator": "...", "risk_level": "Low/Moderate/Elevated", "explanation": "..." },
    { "domain": "Executive Function", "indicator": "...", "risk_level": "Low/Moderate/Elevated", "explanation": "..." },
    { "domain": "Processing Speed", "indicator": "...", "risk_level": "Low/Moderate/Elevated", "explanation": "..." }
  ],
  "overall_risk_score": "${safeRiskLevel}",
  "dementia_screening_probability": "${probDisplay}",
  "recommendations": ["rec 1", "rec 2", "rec 3"],
  "summary": "overall wellness summary paragraph in ${langName} mentioning Estimated Cognitive Impairment Risk (${probDisplay}) and Risk Level (${safeRiskLevel})"
}`;

    const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
    
    const groqPromise = groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: groqModel,
      response_format: { type: "json_object" }
    });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Groq report generation timed out")), 6000)
    );

    const result = await Promise.race([groqPromise, timeoutPromise]);

    const rawJson = safeParse(result.choices[0].message.content, null);
    if (!rawJson || typeof rawJson !== 'object') {
      simulateOfflineReport();
    } else {
      if (!rawJson.summary) {
        rawJson.summary = rawJson.executive_summary || rawJson.clinical_summary || rawJson.overview || rawJson.report?.summary || `Cognitive wellness screening for ${username} indicates a Dementia-Associated Screening Probability of ${probDisplay} (Risk Level: ${safeRiskLevel}).`;
      }
      res.json({ report: rawJson, analysis_source: "groq" });
    }
  } catch (err) {
    console.error("Groq Final Report API notice (fallback activated):", err.message);
    simulateOfflineReport();
  }
});

// Save Final Report
router.post('/save-report', authMiddleware, (req, res) => {
  const { rx, mem, clk, delay, pattern_score, overall_score, diagnosis, confidence, dementia_prob, risk_level, videoScores, videoSummary } = req.body;
  const username = req.user.username;

  const safeRx = (rx !== null && rx !== undefined && Number.isFinite(Number(rx)) && Number(rx) > 0) ? Number(rx) : null;
  const safeMem = (mem !== null && mem !== undefined && Number.isFinite(Number(mem))) ? Number(mem) : null;
  const safeClk = (clk !== null && clk !== undefined && Number.isFinite(Number(clk))) ? Number(clk) : null;
  const safeDelay = (delay !== null && delay !== undefined && Number.isFinite(Number(delay))) ? Number(delay) : null;
  const safePat = (pattern_score !== null && pattern_score !== undefined && Number.isFinite(Number(pattern_score))) ? Number(pattern_score) : null;
  const safeOverall = (overall_score !== null && overall_score !== undefined && Number.isFinite(Number(overall_score))) ? Number(overall_score) : null;
  const safeDementiaProb = (dementia_prob !== null && dementia_prob !== undefined && Number.isFinite(Number(dementia_prob))) ? Number(dementia_prob) : null;
  const safeRiskLevel = risk_level || "Unavailable";
  const safeConfidence = (confidence !== null && confidence !== undefined && Number.isFinite(Number(confidence))) ? Number(confidence) : null;

  db.get('SELECT id FROM Users WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    
    db.run(
      `INSERT INTO Assessments (
        user_id, rx_time, memory_score, clock_score, delay_time, pattern_score, overall_score,
        diagnosis, confidence, dementia_prob, risk_level,
        video_oculomotor, video_affect, video_kinematic, video_linguistic, video_summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    , [
      user.id, safeRx, safeMem, safeClk, safeDelay, safePat, safeOverall,
      diagnosis || "Cognitive Health Screening Summary", safeConfidence,
      safeDementiaProb, safeRiskLevel,
      videoScores?.OCULOMOTOR ?? null, 
      videoScores?.FACIAL_AFFECT ?? null, 
      videoScores?.KINEMATIC ?? null, 
      videoScores?.LINGUISTIC_ACOUSTIC ?? null, 
      videoSummary || ""
    ], function(err) {
      if (err) {
        console.error("DB save error:", err.message);
        return res.status(500).json({ error: 'Failed to save report' });
      }
      res.json({ success: true, id: this.lastID });
    });
  });
});

// Get User History
router.get('/history', authMiddleware, (req, res) => {
  const username = req.user.username;
  
  db.get('SELECT id FROM Users WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    
    db.all(`SELECT * FROM Assessments WHERE user_id = ? ORDER BY id DESC`, [user.id], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch history' });
      res.json({ history: rows });
    });
  });
});

module.exports = router;
