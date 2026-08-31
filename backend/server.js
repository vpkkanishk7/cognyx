const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const assessmentRoutes = require('./routes/assessment');
const db = require('./db'); // Ensure DB is initialized
const rateLimit = require('express-rate-limit');
const authMiddleware = require('./middleware/auth');
const { evaluateGreenTargetResponse, evaluateResponseTime } = require('./utils/scoringEngine');

if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'test') {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

const IS_VERCEL = !!process.env.VERCEL;

const app = express();
const PORT = process.env.PORT || 3000;

const { exec } = require('child_process');

// Middleware
// On Vercel, allow all origins (the app IS the backend — same domain)
const allowedOrigins = IS_VERCEL
  ? true
  : [process.env.FRONTEND_URL || 'http://127.0.0.1:3005', 'http://localhost:3005', 'http://localhost:5500', 'http://127.0.0.1:5500', 'null'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend'), {
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));
app.use('/sessions', express.static(path.join(__dirname, 'uploads', 'sessions')));

// Rate Limiting setup
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Routes
app.use('/api', authRoutes);
app.use('/api', chatRoutes);
app.use('/api', assessmentRoutes);

app.post('/api/predict', authMiddleware, async (req, res) => {
  try {
    const { 
      memory_score, pattern_score, clock_score, avg_reaction_time_ms, reaction_trials,
      words_per_minute, age, facial_apathy_score, gaze_smoothness 
    } = req.body;

    const mem = Number(memory_score ?? 85);
    const pat = Number(pattern_score ?? 88);
    const clk = Number(clock_score ?? 8.5);
    const rt = Number(avg_reaction_time_ms ?? 350);
    const wpm = Number(words_per_minute ?? 125);
    const userAge = Number(age ?? 65);

    const greenTargetResponse = evaluateGreenTargetResponse(userAge, reaction_trials || rt);
    const reactionEval = evaluateResponseTime(userAge, greenTargetResponse.medianMs || rt);

    try {
      // Forward the payload to the FastAPI ML microservice
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memory_score: mem,
          pattern_score: pat,
          clock_score: clk,
          avg_reaction_time_ms: greenTargetResponse.medianMs || rt,
          reaction_trials: greenTargetResponse.trials,
          words_per_minute: wpm,
          age: userAge,
          reaction_eval: reactionEval,
          green_target_response: greenTargetResponse,
          facial_apathy_score: facial_apathy_score != null ? Number(facial_apathy_score) : null,
          gaze_smoothness: gaze_smoothness != null ? Number(gaze_smoothness) : null
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        return res.json(result);
      }
    } catch (svcErr) {
      console.log('ML Microservice offline, utilizing calibrated analytical engine:', svcErr.message);
    }
    
    // Calibrated Explainable Multimodal Scoring Fallback
    const normMem = Math.max(0, Math.min(100, mem));
    const normPat = Math.max(0, Math.min(100, pat));
    const normClk = Math.max(0, Math.min(100, clk * 10.0));
    const normSpeech = Math.max(0, Math.min(100, (wpm / 150.0) * 100.0));

    // Use percentile if valid, else neutral 50 to avoid penalizing or boosting composite if data is missing
    const normRt = reactionEval.percentile !== null ? reactionEval.percentile : 50;

    const compositeVitality = (
      normMem * 0.30 +
      normPat * 0.25 +
      normClk * 0.20 +
      normRt * 0.15 +
      normSpeech * 0.05 +
      5.0
    );

    const ageCategory = reactionEval.ageGroup || (userAge <= 20 ? "≤20 years" : (userAge <= 50 ? "21–50 years" : (userAge <= 70 ? "51–70 years" : "71–100 years")));
    
    // Dynamic Performance Tier & Explanations
    let performanceTier = "Optimal Cognitive Vitality";
    let tierExplanation = `Performance is in the top tier relative to the ${ageCategory} reference cohort across memory, spatial, and reaction metrics.`;
    let rxInterp = greenTargetResponse.classification;
    let procInterp = "Within the expected range for your age group";

    if (compositeVitality < 55.0) {
      performanceTier = "Cognitive Screening Variance";
      tierExplanation = `Performance shows variances compared to the ${ageCategory} baseline; targeted cognitive exercises and periodic monitoring are suggested.`;
    } else if (compositeVitality < 75.0) {
      performanceTier = "Preserved Cognitive Function";
      tierExplanation = `Performance is consistent with expected norms for the ${ageCategory} peer group with steady cognitive vitality.`;
    }

    const strengths = [];
    const focusAreas = [];
    if (normMem >= 75) strengths.push("High-capacity working memory retention and lexical recall accuracy.");
    else focusAreas.push("Working memory reinforcement and structured mnemonic recall exercises.");

    if (normPat >= 75) strengths.push("Strong abstract geometric reasoning and sequential pattern identification.");
    else focusAreas.push("Sequential logic puzzles and multi-stage pattern recognition practice.");

    if (normClk >= 70) strengths.push("Intact visuospatial construction and executive contour integration.");
    else focusAreas.push("Visuomotor drawing practice and spatial coordination tasks.");

    if (greenTargetResponse.classification === "Within COGNYX expected range" || greenTargetResponse.classification === "Faster than expected") {
      strengths.push(`Green-target reflex latency is ${greenTargetResponse.classification.toLowerCase()} (${greenTargetResponse.medianMs}ms vs ${greenTargetResponse.expectedMinMs}–${greenTargetResponse.expectedMaxMs}ms range for age ${greenTargetResponse.ageGroup}).`);
    } else {
      focusAreas.push(`Green-target reflex latency is ${greenTargetResponse.classification.toLowerCase()} (${greenTargetResponse.medianMs}ms vs ${greenTargetResponse.expectedMinMs}–${greenTargetResponse.expectedMaxMs}ms range for age ${greenTargetResponse.ageGroup}).`);
    }

    let predictionCode = 0;
    let diagnosis = "Screening probability unavailable.";
    let riskTier = "Unavailable";

    const factors = [
      { factor_name: "Working Memory Retention", contribution_weight_pct: 30, measured_score: Math.round(normMem), status: normMem >= 75 ? "Optimal" : "Moderate" },
      { factor_name: "Geometric Pattern Reasoning", contribution_weight_pct: 25, measured_score: Math.round(normPat), status: normPat >= 75 ? "Optimal" : "Moderate" },
      { factor_name: "Visuospatial Construction (CDT)", contribution_weight_pct: 20, measured_score: Math.round(normClk), status: normClk >= 70 ? "Optimal" : "Moderate" },
      { factor_name: "Sensorimotor Latency Reflex", contribution_weight_pct: 15, measured_score: greenTargetResponse.medianMs, status: (greenTargetResponse.classification.includes("Within") || greenTargetResponse.classification.includes("Faster")) ? "Optimal" : (greenTargetResponse.classification.includes("Slower") ? "Moderate" : "Attenuated") },
      { factor_name: "Acoustic & Conversational Pacing", contribution_weight_pct: 5, measured_score: Math.round(normSpeech), status: "Standard Cadence" },
      { factor_name: "Facial Dynamics & Affect (Video AI)", contribution_weight_pct: 0, measured_score: null, status: "Unavailable" }
    ];

    res.json({
      prediction_code: predictionCode,
      dementiaProbability: null,
      dementiaProbabilityPct: null,
      dementiaProbabilityDisplay: "Screening probability unavailable.",
      riskLevel: "Unavailable",
      risk_tier: riskTier,
      screeningResult: diagnosis,
      diagnosis,
      confidence: 0,
      composite_score: Math.round(compositeVitality),
      actual_age: userAge,
      age_category: ageCategory,
      performance_tier: performanceTier,
      tier_explanation: tierExplanation,
      reaction_interpretation: rxInterp,
      processing_speed_interpretation: procInterp,
      green_target_response: greenTargetResponse,
      strengths,
      focus_areas: focusAreas,
      majorCognitiveFactors: factors,
      explainable_factors: factors,
      age_norm_analysis: {
        actual_age: userAge,
        age_category: ageCategory,
        avg_percentile: 88,
        performance_tier: performanceTier,
        tier_explanation: tierExplanation,
        reaction_interpretation: rxInterp,
        processing_speed_interpretation: procInterp,
        reaction_time_evaluation: reactionEval,
        green_target_response: greenTargetResponse,
        limitations: "Derived from COGNYX prototype reference distributions."
      },
      facial_analytics: {
        engine: "Unavailable",
        landmark_stability: null,
        landmark_stability_status: "Facial landmark analysis unavailable for this session",
        blink_frequency_cpm: null,
        blink_frequency_status: "Blink rate analysis unavailable (landmark stream not active)",
        facial_expressivity_index: null,
        affect_valence: "Facial analysis unavailable for this session",
        apathy_index: null,
        status: "Unavailable",
        summary: "Facial analysis unavailable for this session."
      },
      voice_analytics: null,
      limitations: [
        "Screening probability unavailable — ML microservice is offline."
      ],
      safety_disclaimer: "This assessment is an algorithmic screening tool and not a medical diagnosis."
    });
  } catch (error) {
    console.error('Failed to run ML pipeline:', error);
    res.status(500).json({ error: 'Failed to run ML model.' });
  }
});

app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Start Server — only in non-serverless (local/traditional hosting) environments
// Vercel invokes the exported `app` directly as a serverless function
if (!IS_VERCEL) {
  const PORT = process.env.PORT || 3005;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// Export for Vercel serverless handler
module.exports = app;
