import json
from main import load_model, predict_cognition, MultimodalBiomarkerPayload, get_model_metrics

# Load models
load_model()

print("1. Testing get_model_metrics():")
m = get_model_metrics()
print("Model Version:", m.get("modelVersion"))
print("Model Type:", m.get("modelType"))
print("Test Metrics:", m.get("heldOutTestMetrics"))

print("\n2. Testing predict_cognition with preserved cognition payload:")
sample_payload = MultimodalBiomarkerPayload(
    memory_score=85.0,
    pattern_score=90.0,
    clock_score=9.0,
    avg_reaction_time_ms=950.0,
    words_per_minute=130.0,
    age=68.0,
    gender="female",
    educationyears=14.0,
    diabetes=0,
    green_target_response={
        "medianMs": 950,
        "classification": "Within COGNYX expected range",
        "expectedMinMs": 1125,
        "expectedMaxMs": 1875,
        "ageGroup": "60–69"
    }
)

pred_json = predict_cognition(sample_payload)
print("\nPreserved Case Output:")
print("  Screening Result:", pred_json.get("screeningResult"))
print("  Risk Tier:", pred_json.get("risk_tier"))
print("  Diagnosis Display:", pred_json.get("diagnosis"))
print("  Raw Probability:", pred_json.get("rawProbability"))
print("  Impairment Probability (Calibrated):", pred_json.get("impairmentProbability"))
print("  Model Version:", pred_json.get("modelVersion"))
print("  Safety Disclaimer:", pred_json.get("safety_disclaimer"))

print("\n3. Testing predict_cognition with impaired cognition payload:")
impaired_payload = MultimodalBiomarkerPayload(
    memory_score=25.0,
    pattern_score=30.0,
    clock_score=2.0,
    avg_reaction_time_ms=2400.0,
    words_per_minute=55.0,
    age=82.0,
    gender="male",
    educationyears=8.0,
    diabetes=1,
    green_target_response={
        "medianMs": 2400,
        "classification": "Slower than expected",
        "expectedMinMs": 1500,
        "expectedMaxMs": 2500,
        "ageGroup": "80+"
    }
)

impaired_json = predict_cognition(impaired_payload)
print("\nImpaired Case Output:")
print("  Screening Result:", impaired_json.get("screeningResult"))
print("  Risk Tier:", impaired_json.get("risk_tier"))
print("  Diagnosis Display:", impaired_json.get("diagnosis"))
print("  Raw Probability:", impaired_json.get("rawProbability"))
print("  Impairment Probability (Calibrated):", impaired_json.get("impairmentProbability"))
