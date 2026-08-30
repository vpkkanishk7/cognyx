from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import pickle
import os
import numpy as np
from feature_schema import FEATURES, VALIDATION_RULES

app = FastAPI(title="COGNYX ML Service")

# Load model on startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'cognyx_model.pkl')
try:
    with open(MODEL_PATH, 'rb') as f:
        model_data = pickle.load(f)
        model = model_data['model']
        trained_features = model_data['features']
        version = model_data['version']
        if trained_features != FEATURES:
            print("WARNING: Loaded model features do not match current FEATURE_SCHEMA!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

class AssessmentData(BaseModel):
    age: float | None = None
    immediate_recall_score: float | None = None
    delayed_recall_score: float | None = None
    word_identifying_score: float | None = None
    pattern_matching_score: float | None = None
    reaction_median_ms: float | None = None
    clock_score: float | None = None
    oculomotor_score: float | None = None

def validate_and_fallback(value, feature_name):
    rules = VALIDATION_RULES[feature_name]
    if value is None or not np.isfinite(value):
        return rules["fallback"]
    if value < rules["min"]:
        return rules["min"]
    if value > rules["max"]:
        return rules["max"]
    return value

@app.post("/predict")
def predict(data: AssessmentData):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    # Construct feature vector in exact order
    vector = []
    data_dict = data.dict()
    
    for feature in FEATURES:
        val = validate_and_fallback(data_dict.get(feature), feature)
        vector.append(val)
        
    X = np.array(vector).reshape(1, -1)
    
    try:
        prediction = model.predict(X)[0]
        probabilities = model.predict_proba(X)[0]
        
        # In scikit-learn RF, [0] is prob of class 0, [1] is prob of class 1.
        # Assuming class 1 = at-risk.
        risk_probability = float(probabilities[1])
        
        return {
            "prediction": int(prediction),
            "probability": risk_probability,
            "model_version": version,
            "feature_schema_version": "2.0.0"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
