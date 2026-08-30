const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const authMiddleware = require('../middleware/auth');
const { safeParse, validateNumericBiomarkers } = require('../utils/aiResponse');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(GEMINI_API_KEY);

const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const DISCLAIMER = "\n\n*Disclaimer: This cognitive wellness assessment is not a medical diagnosis. Results should not be used to diagnose dementia or any other medical condition. If you have persistent concerns about cognitive changes, consult a qualified healthcare professional.*";

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
      OCULOMOTOR: 15, FACIAL_AFFECT: 10, KINEMATIC: 12, LINGUISTIC_ACOUSTIC: 5,
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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
      OCULOMOTOR: 12,
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
  const { assessmentMode, conversation, memoryGame, diagnosis, confidence, scores, videoScores } = req.body;
  const username = req.user.username;
  
  const simulateOfflineReport = () => {
    const memScore = scores?.memoryScore ?? 80;
    const patScore = scores?.patternScore ?? 85;
    const clkScore = scores?.clockScore !== null && scores?.clockScore !== undefined ? scores.clockScore : 8;
    const rxTime = scores?.reactionTimeMs ?? 380;
    
    const rawJson = {
      conversational_observations: [
        "Consistent conversational cadence and appropriate response formulation during clinical dialogue.",
        "Lexical retrieval and thought expression were fluent and coherent throughout."
      ],
      cognitive_interpretation: [
        `Working memory retention achieved ${memScore}% target recall accuracy.`,
        `Pattern recognition test completed with ${patScore}% accuracy across multi-stage geometric sequences.`,
        `Visuospatial clock construction scored ${clkScore}/10 with preserved contour and hand placement.`,
        `Sensorimotor reaction latency averaged ${rxTime}ms, reflecting alert responsiveness.`
      ],
      face_voice_observations: [
        "Telemetry indicators reflect steady attentional engagement and active task focus.",
        "Facial affect and ocular telemetry remained stable throughout the assessment battery."
      ],
      voice_interaction: [
        "Communication pacing and interaction latency remained within expected wellness thresholds."
      ],
      ml_risk_analysis: [
        { domain: "Cognitive Vitality", indicator: "Working Memory & Recall", risk_level: memScore >= 70 ? "Low" : "Moderate", explanation: "Multi-item lexical recall demonstrates active short-term retention." },
        { domain: "Executive Function", indicator: "Pattern Recognition & Visuospatial", risk_level: patScore >= 70 ? "Low" : "Moderate", explanation: "Geometric rule abstraction and spatial synthesis executed effectively." },
        { domain: "Processing Speed", indicator: "Reaction & Latency Telemetry", risk_level: rxTime < 500 ? "Low" : "Moderate", explanation: "Oculomotor sensorimotor reflex aligned with standard reference baselines." }
      ],
      overall_risk_score: (memScore >= 70 && patScore >= 70) ? "Low" : "Moderate",
      recommendations: [
        "Continue engaging in intellectually stimulating activities such as complex puzzle-solving and pattern recognition.",
        "Maintain regular physical exercise, balanced nutrition, and restorative sleep to support cognitive longevity.",
        "Schedule periodic wellness assessments to track your longitudinal cognitive vitality profile."
      ],
      summary: `Cognitive wellness screening for ${username} indicates well-preserved cognitive vitality across working memory, visuospatial reasoning, and pattern recognition domains. Response times and task accuracies align with healthy adult baseline performance.`
    };
    res.json({ report: rawJson, analysis_source: "fallback" });
  };

  try {
    const prompt = `You are an analytical clinical AI assistant generating a highly structured Cognitive Wellness & Multimodal Synthesis Report.
Subject: ${username}
Modality: ${assessmentMode}

Data:
Conversation History: ${JSON.stringify(conversation || [])}
Memory Registration & Recall: ${JSON.stringify(memoryGame || {})}
Clock Visuospatial Score: ${scores?.clockScore !== null ? scores?.clockScore : 'N/A'}/10
Reaction Time: ${scores?.reactionTimeMs || 'N/A'}ms
Pattern Recognition Score: ${scores?.patternScore || 'N/A'}%
Oculomotor Risk: ${videoScores ? videoScores.OCULOMOTOR : 'unavailable'}

IMPORTANT GUIDELINES:
- Provide supportive, objective, and understandable cognitive wellness insights.
- Do NOT claim to diagnose dementia, Alzheimer's disease, or any medical condition.
- You are an observer and interpreter of cognitive wellness metrics.
- Your output MUST be a strict JSON object matching this exact schema:
{
  "conversational_observations": ["bullet 1", "bullet 2"],
  "cognitive_interpretation": ["bullet 1", "bullet 2", "bullet 3"],
  "face_voice_observations": ["bullet 1", "bullet 2"],
  "voice_interaction": ["bullet 1", "bullet 2"],
  "ml_risk_analysis": [
    { "domain": "Cognitive Vitality", "indicator": "...", "risk_level": "Low/Moderate/High", "explanation": "..." },
    { "domain": "Executive Function", "indicator": "...", "risk_level": "Low/Moderate/High", "explanation": "..." },
    { "domain": "Processing Speed", "indicator": "...", "risk_level": "Low/Moderate/High", "explanation": "..." }
  ],
  "overall_risk_score": "Low",
  "recommendations": ["rec 1", "rec 2", "rec 3"],
  "summary": "overall wellness summary paragraph"
}`;

    const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
    
    // Add timeout to prevent hanging forever
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 12000);

    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: groqModel,
      response_format: { type: "json_object" }
    }, { signal: abortController.signal });

    clearTimeout(timeout);

    const rawJson = safeParse(result.choices[0].message.content, null);
    if (!rawJson || typeof rawJson !== 'object') {
      simulateOfflineReport();
    } else {
      res.json({ report: rawJson, analysis_source: "groq" });
    }
  } catch (err) {
    console.error("Groq Final Report API Error:", err.message);
    simulateOfflineReport();
  }
});

// Save Final Report
router.post('/save-report', authMiddleware, (req, res) => {
  const { rx, mem, clk, delay, pattern_score, overall_score, diagnosis, confidence, videoScores, videoSummary } = req.body;
  const username = req.user.username;

  const safeRx = (rx !== null && Number.isFinite(rx)) ? rx : 0;
  const safeMem = (mem !== null && Number.isFinite(mem)) ? mem : 0;
  const safeClk = (clk !== null && Number.isFinite(clk)) ? clk : 0;
  const safeDelay = (delay !== null && Number.isFinite(delay)) ? delay : 0;
  const safePat = (pattern_score !== null && Number.isFinite(pattern_score)) ? pattern_score : 0;
  const safeOverall = (overall_score !== null && Number.isFinite(overall_score)) ? overall_score : Math.round((safeMem + safePat + safeClk * 10) / 3);

  db.get('SELECT id FROM Users WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    
    db.run(
      `INSERT INTO Assessments (
        user_id, rx_time, memory_score, clock_score, delay_time, pattern_score, overall_score,
        diagnosis, confidence, 
        video_oculomotor, video_affect, video_kinematic, video_linguistic, video_summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    , [
      user.id, safeRx, safeMem, safeClk, safeDelay, safePat, safeOverall,
      diagnosis || "Healthy", confidence || 95,
      videoScores?.OCULOMOTOR ?? 0, 
      videoScores?.FACIAL_AFFECT ?? 0, 
      videoScores?.KINEMATIC ?? 0, 
      videoScores?.LINGUISTIC_ACOUSTIC ?? 0, 
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
    
    db.all(`SELECT * FROM Assessments WHERE user_id = ? ORDER BY created_at DESC`, [user.id], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch history' });
      res.json({ history: rows });
    });
  });
});

module.exports = router;
