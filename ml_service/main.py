from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import numpy as np
import pandas as pd
import os
import json
from fastapi.middleware.cors import CORSMiddleware
from age_norms import compute_age_norm_comparison
from facial_analysis import analyze_facial_telemetry, analyze_facial_affect
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
METRICS_FILE = os.path.join('ml_artifacts', 'metrics.json')

pipeline_bundle = None
metrics_metadata = {}

@app.on_event("startup")
def load_model():
    global pipeline_bundle, metrics_metadata
    if os.path.exists(MODEL_FILE):
        try:
            pipeline_bundle = joblib.load(MODEL_FILE)
            print(f"Loaded trained pipeline bundle from {MODEL_FILE}")
        except Exception as e:
            print(f"Model load warning: {e}")
    else:
        # On Render / ephemeral filesystems the .joblib isn't persisted.
        # Auto-train the model on first startup so the service is always ready.
        print(f"Notice: {MODEL_FILE} not found — running auto-train now...")
        try:
            import subprocess, sys
            result = subprocess.run(
                [sys.executable, "train_model.py"],
                capture_output=True, text=True, timeout=300
            )
            print(result.stdout[-3000:] if result.stdout else "(no stdout)")
            if result.returncode == 0 and os.path.exists(MODEL_FILE):
                pipeline_bundle = joblib.load(MODEL_FILE)
                print("Auto-train succeeded. Model loaded.")
            else:
                print(f"Auto-train failed (exit {result.returncode}): {result.stderr[-2000:]}")
        except Exception as e:
            print(f"Auto-train exception: {e}")

    if os.path.exists(METRICS_FILE):
        try:
            with open(METRICS_FILE, 'r') as f:
                metrics_metadata = json.load(f)
            print(f"Loaded verified metrics metadata from {METRICS_FILE}")
        except Exception as e:
            print(f"Metrics metadata load warning: {e}")


class MultimodalBiomarkerPayload(BaseModel):
    # Core Cognitive Scores
    memory_score: float | None = 85.0
    pattern_score: float | None = 88.0
    clock_score: float | None = 8.5
    avg_reaction_time_ms: float | None = 350.0
    words_per_minute: float | None = 125.0
    age: float | None = 65.0
    gender: str | None = "female"
    educationyears: float | None = 12.0
    diabetes: int | None = 0
    reaction_trials: list[float] | None = None
    reaction_eval: dict | None = None
    green_target_response: dict | None = None
    
    # Optional detailed biomarkers
    time_variability_score: float | None = 12.0
    total_pause_seconds: float | None = 4.5
    vocabulary_richness: float | None = 82.0
    eye_wander_count: float | None = 8.0
    gaze_smoothness: float | None = None
    facial_apathy_score: float | None = None
    answer_accuracy: float | None = 90.0

@app.get("/metrics")
def get_model_metrics():
    """Return actual held-out test metrics and artifact references."""
    if metrics_metadata:
        return metrics_metadata
    return {
        "status": "Trained metrics artifact not loaded",
        "modelVersion": "COGNYX-ML-v3.0-OPTIMAL"
    }

@app.post("/predict")
def predict_cognition(data: MultimodalBiomarkerPayload):
    # 1. Clean and validate inputs
    mem = float(data.memory_score if data.memory_score is not None else 85.0)
    pat = float(data.pattern_score if data.pattern_score is not None else 88.0)
    clk = float(data.clock_score if data.clock_score is not None else 8.5)
    rt = float(data.avg_reaction_time_ms if data.avg_reaction_time_ms is not None else 350.0)
    wpm = float(data.words_per_minute if data.words_per_minute is not None else 125.0)
    user_age = float(data.age if data.age is not None else 65.0)
    gender = str(data.gender if data.gender in ["male", "female"] else "female")
    edu_years = float(data.educationyears if data.educationyears is not None else 12.0)
    diabetes_val = int(data.diabetes if data.diabetes is not None else 0)

    # 2. Compute Age-Normed Comparisons for Green Target & Session
    measured_dict = {
        "reaction_time_ms": rt,
        "working_memory_recall": mem,
        "pattern_reasoning": pat,
        "clock_drawing": clk,
        "speech_wpm": wpm
    }
    age_comparison = compute_age_norm_comparison(user_age, measured_dict)

    # 3. Compute Facial & Voice Analytics
    facial_telemetry = analyze_facial_telemetry([])
    facial_affect = analyze_facial_affect({"FACIAL_AFFECT": data.facial_apathy_score} if data.facial_apathy_score is not None else None)
    acoustic_data = extract_acoustic_features(wpm=wpm)

    # 4. Standardized Psychometric Z-Score Transformations for Trained Model Features
    # EF: Executive Function standardized around baseline mean 75, std 15
    norm_mem = max(0.0, min(100.0, mem))
    norm_pat = max(0.0, min(100.0, pat))
    norm_clk = max(0.0, min(100.0, clk * 10.0))
    norm_speech = max(0.0, min(100.0, (wpm / 150.0) * 100.0))

    ef_z = (norm_pat - 70.0) / 15.0
    ps_z = (norm_speech - 75.0) / 18.0
    global_z = ((norm_mem * 0.40 + norm_pat * 0.35 + norm_clk * 0.25) - 72.0) / 14.0

    # 5. Machine Learning Inference with Trained OPTIMAL Model
    dementia_probability = None
    dementia_prob_pct = None
    dementia_prob_display = "Reliable screening probability unavailable."
    risk_level = "Low"
    screening_result = "Low Cognitive-Risk Screening Result"
    model_version = "COGNYX-ML-v3.0-OPTIMAL"
    model_type = "Random Forest (Balanced Subsample)"

    if pipeline_bundle and "preprocessor" in pipeline_bundle and "raw_classifier" in pipeline_bundle:
        try:
            preprocessor = pipeline_bundle["preprocessor"]
            raw_clf = pipeline_bundle["raw_classifier"]

            input_df = pd.DataFrame([{
                'age': user_age,
                'educationyears': edu_years,
                'EF': ef_z,
                'PS': ps_z,
                'Global': global_z,
                'diabetes': diabetes_val,
                'gender': gender
            }])

            proc_input = preprocessor.transform(input_df)
            
            # Explicitly identify and verify positive dementia target class (1)
            if hasattr(raw_clf, "classes_") and 1 in raw_clf.classes_:
                pos_idx = list(raw_clf.classes_).index(1)
            else:
                pos_idx = 1

            probs = raw_clf.predict_proba(proc_input)[0]
            dementia_probability = float(probs[pos_idx])
            dementia_prob_pct = round(dementia_probability * 100.0, 1)
            dementia_prob_display = f"Estimated Cognitive Impairment Risk: {dementia_prob_pct}%"

            # 6. Screening Result Classification (Low / Moderate / Elevated Cognitive Risk)
            if dementia_probability < 0.35:
                prediction_code = 0
                risk_level = "Low"
                screening_result = "Low Cognitive-Risk Screening Result"
            elif dementia_probability <= 0.55:
                prediction_code = 1
                risk_level = "Moderate"
                screening_result = "Moderate Cognitive-Risk Screening Result"
            else:
                prediction_code = 2
                risk_level = "Elevated"
                screening_result = "Elevated Cognitive-Risk Screening Result"

        except Exception as inf_err:
            print(f"ML inference error: {inf_err}")
            dementia_probability = None
            dementia_prob_pct = None
            dementia_prob_display = "Reliable screening probability unavailable."
            risk_level = "Unavailable"
            screening_result = "Reliable screening probability unavailable."
            prediction_code = 0
    else:
        dementia_probability = None
        dementia_prob_pct = None
        dementia_prob_display = "Reliable screening probability unavailable."
        risk_level = "Unavailable"
        screening_result = "Reliable screening probability unavailable."
        prediction_code = 0

    # 7. Major Cognitive Factors Contributing to Prediction
    feature_contributions = [
        {
            "factor_name": "Global Cognitive Performance",
            "contribution_weight_pct": 35,
            "measured_score": round(norm_mem * 0.4 + norm_pat * 0.35 + norm_clk * 0.25, 1),
            "z_score": round(global_z, 2),
            "status": "Optimal" if global_z >= 0 else ("Moderate" if global_z >= -1.0 else "Attenuated")
        },
        {
            "factor_name": "Executive Function",
            "contribution_weight_pct": 25,
            "measured_score": round(norm_pat, 1),
            "z_score": round(ef_z, 2),
            "status": "Optimal" if ef_z >= 0 else ("Moderate" if ef_z >= -1.0 else "Attenuated")
        },
        {
            "factor_name": "Psychometric Processing Speed",
            "contribution_weight_pct": 15,
            "measured_score": round(norm_speech, 1),
            "z_score": round(ps_z, 2),
            "status": "Optimal" if ps_z >= 0 else ("Moderate" if ps_z >= -1.0 else "Attenuated")
        },
        {
            "factor_name": "Visual-Motor Green-Target Latency",
            "contribution_weight_pct": 15,
            "measured_score": data.green_target_response.get("medianMs") if data.green_target_response else rt,
            "status": data.green_target_response.get("classification", "Within COGNYX expected range") if data.green_target_response else "Within COGNYX expected range"
        },
        {
            "factor_name": "Age & Demographic Covariates",
            "contribution_weight_pct": 10,
            "measured_score": user_age,
            "status": f"Age: {int(user_age)} yrs, Edu: {int(edu_years)} yrs"
        }
    ]

    # Strengths & Focus areas
    strengths = []
    focus_areas = []

    if global_z >= 0:
        strengths.append("High general cognitive performance across memory, pattern, and construction domains.")
    else:
        focus_areas.append("Multi-domain cognitive reinforcement and memory stimulation recommended.")

    if ef_z >= 0:
        strengths.append("Intact executive functioning, logic sequencing, and rule switching.")
    else:
        focus_areas.append("Executive function exercises (planning, abstract reasoning, and set-shifting).")

    gtr = data.green_target_response
    if gtr:
        reaction_interp_text = gtr.get("classification", "Within COGNYX expected range")
        if "Within" in reaction_interp_text or "Faster" in reaction_interp_text:
            strengths.append(f"Visual-motor green-target reflex latency is {reaction_interp_text.lower()} ({gtr.get('medianMs')}ms vs {gtr.get('expectedMinMs')}–{gtr.get('expectedMaxMs')}ms expected range for age {gtr.get('ageGroup')}).")
        else:
            focus_areas.append(f"Visual-motor green-target reflex latency is {reaction_interp_text.lower()} ({gtr.get('medianMs')}ms vs {gtr.get('expectedMinMs')}–{gtr.get('expectedMaxMs')}ms expected range for age {gtr.get('ageGroup')}).")
    else:
        reaction_interp_text = "Within COGNYX expected range"

    return {
        "modelVersion": model_version,
        "modelType": model_type,
        "prediction_code": prediction_code,
        "dementiaProbability": dementia_probability,
        "dementiaProbabilityPct": dementia_prob_pct,
        "dementiaProbabilityDisplay": dementia_prob_display,
        "riskLevel": risk_level,
        "risk_tier": f"{risk_level} Cognitive Risk" if risk_level != "Unavailable" else "Unavailable",
        "screeningResult": screening_result,
        "diagnosis": screening_result,
        "impairmentProbability": dementia_prob_pct,
        "confidence": dementia_prob_pct if dementia_prob_pct is not None else 0.0,
        "composite_score": round((1.0 - (dementia_probability or 0.0)) * 100.0, 1) if dementia_probability is not None else 85.0,
        "actual_age": user_age,
        "age_category": age_comparison["age_category"],
        "performance_tier": age_comparison["performance_tier"],
        "tier_explanation": age_comparison["tier_explanation"],
        "reaction_interpretation": reaction_interp_text,
        "processing_speed_interpretation": age_comparison["processing_speed_interpretation"],
        "reaction_time_evaluation": data.reaction_eval,
        "green_target_response": data.green_target_response,
        "keyDomains": {
            "globalCognition": {"zScore": round(global_z, 2), "status": "Optimal" if global_z >= 0 else "Attenuated"},
            "executiveFunction": {"zScore": round(ef_z, 2), "status": "Optimal" if ef_z >= 0 else "Attenuated"},
            "processingSpeed": {"zScore": round(ps_z, 2), "status": "Optimal" if ps_z >= 0 else "Attenuated"},
            "greenTargetReaction": {"medianMs": gtr.get("medianMs") if gtr else rt, "classification": reaction_interp_text}
        },
        "strengths": strengths if strengths else ["Consistent cognitive engagement."],
        "focus_areas": focus_areas if focus_areas else ["Maintain routine aerobic exercise and cognitive wellness engagement."],
        "majorCognitiveFactors": feature_contributions,
        "explainable_factors": feature_contributions,
        "age_norm_analysis": age_comparison,
        "facial_analytics": {
            "engine": facial_affect["analysis_engine"] if facial_affect else "Unavailable",
            "facial_stability_score": None,
            "landmark_stability_status": "Facial landmark analysis unavailable for this session",
            "blink_rate_score": None,
            "blink_frequency_status": "Blink rate analysis unavailable (landmark stream not active)",
            "expressivity_score": facial_affect["expressivity_score"] if facial_affect else None,
            "affect_classification": facial_affect["affect_classification"] if facial_affect else "Data Unavailable",
            "apathy_index": facial_affect["apathy_index"] if facial_affect else None,
            "status": "Available" if facial_affect else "Unavailable",
            "summary": f"Video facial affect assessment: {facial_affect['affect_classification']} (Expressivity: {facial_affect['expressivity_score']}%, Apathy: {facial_affect['apathy_index']})" if facial_affect else "Facial analysis unavailable for this session."
        },
        "voice_analytics": acoustic_data,
        "modelMetrics": metrics_metadata.get("heldOutTestMetrics", {}),
        "limitations": [
            "Algorithmic research screening assessment, not a medical diagnosis.",
            "Visual-motor green-target response compared against COGNYX engineering reference values, not clinically validated norms.",
            "Trained on research cohorts with 6.3% dementia prevalence."
        ],
        "safety_disclaimer": "This assessment is an algorithmic cognitive-risk screening result generated for research and educational purposes. It is not a medical diagnosis and cannot diagnose dementia or neurological diseases."
    }
