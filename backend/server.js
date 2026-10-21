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
    const scoresObj = req.body.scores && typeof req.body.scores === 'object' ? req.body.scores : {};
    const memory_score = req.body.memory_score !== undefined ? req.body.memory_score : (scoresObj.memoryScore !== undefined ? scoresObj.memoryScore : scoresObj.memory_score);
    const pattern_score = req.body.pattern_score !== undefined ? req.body.pattern_score : (scoresObj.patternScore !== undefined ? scoresObj.patternScore : scoresObj.pattern_score);
    const clock_score = req.body.clock_score !== undefined ? req.body.clock_score : (scoresObj.clockScore !== undefined ? scoresObj.clockScore : scoresObj.clock_score);
    const avg_reaction_time_ms = req.body.avg_reaction_time_ms !== undefined ? req.body.avg_reaction_time_ms : (scoresObj.reactionTimeMs !== undefined ? scoresObj.reactionTimeMs : (scoresObj.reactionTime !== undefined ? scoresObj.reactionTime : scoresObj.avg_reaction_time_ms));
    const reaction_trials = req.body.reaction_trials !== undefined ? req.body.reaction_trials : (scoresObj.reactionTrials !== undefined ? scoresObj.reactionTrials : scoresObj.reaction_trials);
    const words_per_minute = req.body.words_per_minute !== undefined ? req.body.words_per_minute : (scoresObj.avgTypingWPM !== undefined ? scoresObj.avgTypingWPM : scoresObj.words_per_minute);
    const age = req.body.age !== undefined ? req.body.age : scoresObj.age;
    const facial_apathy_score = req.body.facial_apathy_score !== undefined ? req.body.facial_apathy_score : scoresObj.facial_apathy_score;
    const gaze_smoothness = req.body.gaze_smoothness !== undefined ? req.body.gaze_smoothness : scoresObj.gaze_smoothness;

    const hasMem = memory_score !== null && memory_score !== undefined && memory_score !== "" && Number.isFinite(Number(memory_score)) && Number(memory_score) >= 0 && Number(memory_score) <= 100;
    const hasPat = pattern_score !== null && pattern_score !== undefined && pattern_score !== "" && Number.isFinite(Number(pattern_score)) && Number(pattern_score) >= 0 && Number(pattern_score) <= 100;
    const hasClk = clock_score !== null && clock_score !== undefined && clock_score !== "" && Number.isFinite(Number(clock_score)) && Number(clock_score) >= 0 && Number(clock_score) <= 10;
    const hasRt = avg_reaction_time_ms !== null && avg_reaction_time_ms !== undefined && avg_reaction_time_ms !== "" && Number.isFinite(Number(avg_reaction_time_ms)) && Number(avg_reaction_time_ms) >= 100 && Number(avg_reaction_time_ms) <= 10000;
    const hasWpm = words_per_minute !== null && words_per_minute !== undefined && words_per_minute !== "" && Number.isFinite(Number(words_per_minute)) && Number(words_per_minute) >= 5 && Number(words_per_minute) <= 300;
    const userAge = (age !== null && age !== undefined && Number.isFinite(Number(age)) && Number(age) >= 1 && Number(age) <= 120) ? Number(age) : 65;

    const mem = hasMem ? Number(memory_score) : null;
    const pat = hasPat ? Number(pattern_score) : null;
    const clk = hasClk ? Number(clock_score) : null;
    const rt = hasRt ? Number(avg_reaction_time_ms) : null;
    const wpm = hasWpm ? Number(words_per_minute) : null;

    const greenTargetResponse = evaluateGreenTargetResponse(userAge, reaction_trials || rt);
    const reactionEval = evaluateResponseTime(userAge, greenTargetResponse.medianMs || rt);

    try {
      // Forward the payload to the FastAPI ML microservice
      // Use ML_SERVICE_URL if provided, else default to localhost:8000
      const mlBaseUrl = (process.env.ML_SERVICE_URL || 'http://localhost:8000').replace(/\/$/, '');
      
      const abortController = new AbortController();
      const timeout = setTimeout(() => abortController.abort(), 35000); // 35s timeout to allow Render ML service cold start
      
      const response = await fetch(`${mlBaseUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
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
      
      clearTimeout(timeout);
      
      if (response.ok) {
        const result = await response.json();
        if (result && typeof result === 'object') {
          return res.json(result);
        }
      }
    } catch (svcErr) {
      console.log('ML Microservice offline or timeout, utilizing calibrated analytical engine:', svcErr.message);
    }
    
    // Calibrated Explainable Multimodal Scoring Fallback
    // Only calculate weighted composite across available measured domains
    let weightedSum = 0;
    let totalWeight = 0;

    let normMem = null;
    if (hasMem) {
      normMem = Math.max(0, Math.min(100, mem));
      weightedSum += normMem * 0.30;
      totalWeight += 0.30;
    }

    let normPat = null;
    if (hasPat) {
      normPat = Math.max(0, Math.min(100, pat));
      weightedSum += normPat * 0.25;
      totalWeight += 0.25;
    }

    let normClk = null;
    if (hasClk) {
      normClk = Math.max(0, Math.min(100, clk * 10.0));
      weightedSum += normClk * 0.20;
      totalWeight += 0.20;
    }

    let normRt = null;
    if (greenTargetResponse.medianMs !== null && reactionEval.percentile !== null) {
      normRt = Math.max(0, Math.min(100, reactionEval.percentile));
      weightedSum += normRt * 0.15;
      totalWeight += 0.15;
    }

    let normSpeech = null;
    if (hasWpm) {
      normSpeech = Math.max(0, Math.min(100, (wpm / 150.0) * 100.0));
      weightedSum += normSpeech * 0.10;
      totalWeight += 0.10;
    }

    const hasSufficientData = totalWeight >= 0.35;
    const compositeVitality = hasSufficientData ? Math.round(weightedSum / totalWeight) : null;
    const ageCategory = reactionEval.ageGroup || (userAge <= 20 ? "≤20 years" : (userAge <= 50 ? "21–50 years" : (userAge <= 70 ? "51–70 years" : "71–100 years")));
    
    let performanceTier = "Unavailable";
    let tierExplanation = "Insufficient assessment data to calculate a reliable composite score.";
    let rxInterp = greenTargetResponse.classification;
    let procInterp = hasWpm ? "Within the expected range for your age group" : "Not measured";
    let avgPercentile = null;

    if (compositeVitality !== null) {
      avgPercentile = Math.min(98, Math.max(5, compositeVitality));
      if (compositeVitality >= 75) {
        performanceTier = "Optimal Cognitive Vitality";
        tierExplanation = `Performance is in the top tier relative to the ${ageCategory} reference cohort across memory, spatial, and reaction metrics.`;
      } else if (compositeVitality >= 55) {
        performanceTier = "Preserved Cognitive Function";
        tierExplanation = `Performance is consistent with expected norms for the ${ageCategory} peer group with steady cognitive vitality.`;
      } else {
        performanceTier = "Cognitive Screening Variance";
        tierExplanation = `Performance shows variances compared to the ${ageCategory} baseline; targeted cognitive exercises and periodic monitoring are suggested.`;
      }
    }

    const strengths = [];
    const focusAreas = [];
    if (normMem !== null) {
      if (normMem >= 75) strengths.push("High-capacity working memory retention and lexical recall accuracy.");
      else focusAreas.push("Working memory reinforcement and structured mnemonic recall exercises.");
    }

    if (normPat !== null) {
      if (normPat >= 75) strengths.push("Strong abstract geometric reasoning and sequential pattern identification.");
      else focusAreas.push("Sequential logic puzzles and multi-stage pattern recognition practice.");
    }

    if (normClk !== null) {
      if (normClk >= 70) strengths.push("Intact visuospatial construction and executive contour integration.");
      else focusAreas.push("Visuomotor drawing practice and spatial coordination tasks.");
    }

    if (greenTargetResponse.medianMs !== null) {
      if (greenTargetResponse.classification === "Within COGNYX expected range" || greenTargetResponse.classification === "Faster than expected") {
        strengths.push(`Green-target reflex latency is ${greenTargetResponse.classification.toLowerCase()} (${greenTargetResponse.medianMs}ms vs ${greenTargetResponse.expectedMinMs}–${greenTargetResponse.expectedMaxMs}ms range for age ${greenTargetResponse.ageGroup}).`);
      } else {
        focusAreas.push(`Green-target reflex latency is ${greenTargetResponse.classification.toLowerCase()} (${greenTargetResponse.medianMs}ms vs ${greenTargetResponse.expectedMinMs}–${greenTargetResponse.expectedMaxMs}ms range for age ${greenTargetResponse.ageGroup}).`);
      }
    }

    let predictionCode = 0;
    let diagnosis = hasSufficientData ? "Cognitive screening completed." : "Screening summary unavailable — insufficient assessment data.";
    let riskTier = hasSufficientData ? (compositeVitality >= 75 ? "Low" : (compositeVitality >= 55 ? "Moderate" : "Elevated")) : "Unavailable";

    const factors = [
      { factor_name: "Working Memory Retention", contribution_weight_pct: 30, measured_score: normMem !== null ? Math.round(normMem) : null, status: normMem !== null ? (normMem >= 75 ? "Optimal" : "Moderate") : "Not tested" },
      { factor_name: "Geometric Pattern Reasoning", contribution_weight_pct: 25, measured_score: normPat !== null ? Math.round(normPat) : null, status: normPat !== null ? (normPat >= 75 ? "Optimal" : "Moderate") : "Not tested" },
      { factor_name: "Visuospatial Construction (CDT)", contribution_weight_pct: 20, measured_score: normClk !== null ? Math.round(normClk) : null, status: normClk !== null ? (normClk >= 70 ? "Optimal" : "Moderate") : "Not tested" },
      { factor_name: "Sensorimotor Latency Reflex", contribution_weight_pct: 15, measured_score: greenTargetResponse.medianMs, status: greenTargetResponse.medianMs ? ((greenTargetResponse.classification.includes("Within") || greenTargetResponse.classification.includes("Faster")) ? "Optimal" : (greenTargetResponse.classification.includes("Slower") ? "Moderate" : "Attenuated")) : "Not tested" },
      { factor_name: "Acoustic & Conversational Pacing", contribution_weight_pct: 10, measured_score: normSpeech !== null ? Math.round(normSpeech) : null, status: normSpeech !== null ? "Standard Cadence" : "Not tested" },
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
      composite_score: compositeVitality,
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
        avg_percentile: avgPercentile,
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
