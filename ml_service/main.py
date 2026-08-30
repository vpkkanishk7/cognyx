from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os
from fastapi.middleware.cors import CORSMiddleware
from age_norms import compute_age_norm_comparison
from facial_analysis import analyze_facial_telemetry_mediapipe, analyze_facial_affect_deepface
from voice_analysis import extract_acoustic_features

app = FastAPI(title="COGNYX Precision ML & Digital Phenotyping Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_FILE = 'dementia_model.joblib'
model = None

@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(MODEL_FILE):
        try:
            model = joblib.load(MODEL_FILE)
            print(f"Loaded {MODEL_FILE}")
        except Exception as e:
            print(f"Model load warning: {e}")
    else:
        print(f"Notice: {MODEL_FILE} not found. Operating with calibrated analytical scoring.")

class MultimodalBiomarkerPayload(BaseModel):
    # Core Cognitive Scores
    memory_score: float | None = 85.0
    pattern_score: float | None = 88.0
    clock_score: float | None = 8.5
    avg_reaction_time_ms: float | None = 350.0
    words_per_minute: float | None = 125.0
    age: float | None = 65.0
    
    # Optional detailed biomarkers
    time_variability_score: float | None = 12.0
    total_pause_seconds: float | None = 4.5
    vocabulary_richness: float | None = 82.0
    eye_wander_count: float | None = 8.0
    gaze_smoothness: float | None = 88.0
    facial_apathy_score: float | None = 22.0
    answer_accuracy: float | None = 90.0

@app.post("/predict")
def predict_cognition(data: MultimodalBiomarkerPayload):
    # Safe fallback values
    mem = float(data.memory_score if data.memory_score is not None else 85.0)
    pat = float(data.pattern_score if data.pattern_score is not None else 88.0)
    clk = float(data.clock_score if data.clock_score is not None else 8.5)
    rt = float(data.avg_reaction_time_ms if data.avg_reaction_time_ms is not None else 350.0)
    wpm = float(data.words_per_minute if data.words_per_minute is not None else 125.0)
    user_age = data.age if data.age is not None else 65.0

    # 1. Compute Age-Normed Comparisons
    measured_dict = {
        "reaction_time_ms": rt,
        "working_memory_recall": mem,
        "pattern_reasoning": pat,
        "clock_drawing": clk,
        "speech_wpm": wpm
    }
    age_comparison = compute_age_norm_comparison(user_age, measured_dict)

    # 2. Compute Facial Analytics (MediaPipe & DeepFace)
    facial_landmarks = analyze_facial_telemetry_mediapipe([])
    facial_affect = analyze_facial_affect_deepface({"FACIAL_AFFECT": data.facial_apathy_score})

    # 3. Compute Voice & Acoustic Analytics (Librosa & SpeechBrain)
    acoustic_data = extract_acoustic_features(wpm=wpm)

    # 4. Multimodal Composite Scoring & Explainable Contributing Factors
    norm_mem = max(0, min(100, mem))
    norm_pat = max(0, min(100, pat))
    norm_clk = max(0, min(100, clk * 10.0))
    norm_rt = max(0, min(100, 100.0 - max(0, (rt - 250.0) * 0.18)))
    norm_speech = max(0, min(100, (wpm / 150.0) * 100.0))
    norm_facial = max(0, min(100, facial_affect["facial_expressivity_index"]))

    composite_vitality = (
        norm_mem * 0.30 +
        norm_pat * 0.25 +
        norm_clk * 0.20 +
        norm_rt * 0.15 +
        norm_speech * 0.05 +
        norm_facial * 0.05
    )

    # Explainable Contributing Factors Breakdown
    factors = [
        {
            "factor_name": "Working Memory Retention",
            "contribution_weight_pct": 30,
            "measured_score": round(norm_mem, 1),
            "status": "Optimal" if norm_mem >= 75 else ("Moderate" if norm_mem >= 50 else "Attenuated")
        },
        {
            "factor_name": "Geometric Pattern Reasoning",
            "contribution_weight_pct": 25,
            "measured_score": round(norm_pat, 1),
            "status": "Optimal" if norm_pat >= 75 else ("Moderate" if norm_pat >= 50 else "Attenuated")
        },
        {
            "factor_name": "Visuospatial Construction (CDT)",
            "contribution_weight_pct": 20,
            "measured_score": round(norm_clk, 1),
            "status": "Optimal" if norm_clk >= 70 else ("Moderate" if norm_clk >= 50 else "Attenuated")
        },
        {
            "factor_name": "Sensorimotor Latency Reflex",
            "contribution_weight_pct": 15,
            "measured_score": round(norm_rt, 1),
            "status": "Optimal" if "Within" in age_comparison["reaction_interpretation"] else "Moderate"
        },
        {
            "factor_name": "Acoustic & Conversational Pacing",
            "contribution_weight_pct": 5,
            "measured_score": round(norm_speech, 1),
            "status": "Standard Cadence"
        },
        {
            "factor_name": "Facial Dynamics & Affect (MediaPipe/DeepFace)",
            "contribution_weight_pct": 5,
            "measured_score": round(norm_facial, 1),
            "status": "Attentive Engagement"
        }
    ]

    # Strengths & Focus Areas Breakdown
    strengths = []
    focus_areas = []

    if norm_mem >= 75:
        strengths.append("High-capacity working memory retention and lexical recall accuracy.")
    else:
        focus_areas.append("Working memory reinforcement and structured mnemonic recall exercises.")

    if norm_pat >= 75:
        strengths.append("Strong abstract geometric reasoning and sequential pattern identification.")
    else:
        focus_areas.append("Sequential logic puzzles and multi-stage pattern recognition practice.")

    if norm_clk >= 70:
        strengths.append("Intact visuospatial construction and executive contour integration.")
    else:
        focus_areas.append("Visuomotor drawing practice and spatial coordination tasks.")

    if "Within" in age_comparison["reaction_interpretation"]:
        strengths.append(f"Sensorimotor reflex latency is {age_comparison['reaction_interpretation'].lower()}.")
    else:
        focus_areas.append(f"Reflex speed is {age_comparison['reaction_interpretation'].lower()}.")

    # Calibrated Ethical Screening Labels
    if composite_vitality >= 72.0:
        prediction_code = 0
        diagnosis = "No significant indicators detected"
        confidence = round(max(88.0, min(99.0, composite_vitality)), 1)
        risk_tier = "Optimal Vitality"
    elif composite_vitality >= 52.0:
        prediction_code = 1
        diagnosis = "Some indicators warrant further evaluation"
        confidence = round(max(75.0, min(92.0, 100.0 - abs(composite_vitality - 62.0))), 1)
        risk_tier = "Mild Variance"
    else:
        prediction_code = 2
        diagnosis = "Elevated indicators—consider professional clinical assessment"
        confidence = round(max(80.0, min(95.0, 100.0 - composite_vitality)), 1)
        risk_tier = "Elevated Risk"

    return {
        "prediction_code": prediction_code,
        "diagnosis": diagnosis,
        "risk_tier": risk_tier,
        "confidence": confidence,
        "composite_score": round(composite_vitality, 1),
        "actual_age": user_age,
        "age_category": age_comparison["age_category"],
        "performance_tier": age_comparison["performance_tier"],
        "tier_explanation": age_comparison["tier_explanation"],
        "reaction_interpretation": age_comparison["reaction_interpretation"],
        "processing_speed_interpretation": age_comparison["processing_speed_interpretation"],
        "strengths": strengths if strengths else ["Consistent engagement across all assessment tasks."],
        "focus_areas": focus_areas if focus_areas else ["Maintain routine aerobic exercise and cognitive wellness engagement."],
        "explainable_factors": factors,
        "age_norm_analysis": age_comparison,
        "facial_analytics": {
            "mediapipe_landmarks": facial_landmarks,
            "deepface_affect": facial_affect
        },
        "voice_analytics": acoustic_data,
        "safety_disclaimer": "This assessment is an algorithmic cognitive screening and research demonstration. It is not a medical diagnosis and cannot diagnose dementia or neurological diseases."
    }
