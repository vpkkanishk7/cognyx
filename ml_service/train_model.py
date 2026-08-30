import numpy as np
import pandas as pd
import random
import joblib
from sklearn.ensemble import RandomForestClassifier

MODEL_FILE = 'dementia_model.joblib'

def generate_synthetic_data(samples=1000):
    """
    Generates synthetic cognitive biomarker data based on 9 advanced multimodal features.
    Classes:
    0: Healthy
    1: Mild Cognitive Impairment (MCI)
    2: Severe Impairment
    """
    data = []
    labels = []
    
    for _ in range(samples):
        status = random.choice([0, 1, 2])
        
        if status == 0:
            rx = random.uniform(200, 450)
            time_var = random.uniform(0, 30) # low variability
            pause = random.uniform(2, 10)
            wpm = random.uniform(110, 160)
            vocab = random.uniform(70, 100) # out of 100
            eye_wander = random.randint(0, 5)
            gaze_smooth = random.uniform(75, 100) # out of 100
            apathy = random.uniform(0, 20)
            acc = random.uniform(85, 100)
            clock = random.uniform(8, 10)
        elif status == 1:
            rx = random.uniform(400, 800)
            time_var = random.uniform(30, 60)
            pause = random.uniform(10, 30)
            wpm = random.uniform(80, 120)
            vocab = random.uniform(40, 75)
            eye_wander = random.randint(5, 15)
            gaze_smooth = random.uniform(40, 75)
            apathy = random.uniform(20, 50)
            acc = random.uniform(50, 85)
            clock = random.uniform(4, 7)
        else:
            rx = random.uniform(700, 1500)
            time_var = random.uniform(60, 100)
            pause = random.uniform(30, 90)
            wpm = random.uniform(30, 80)
            vocab = random.uniform(10, 40)
            eye_wander = random.randint(15, 40)
            gaze_smooth = random.uniform(10, 40)
            apathy = random.uniform(50, 100)
            acc = random.uniform(0, 50)
            clock = random.uniform(0, 3)
            
        data.append([rx, time_var, pause, wpm, vocab, eye_wander, gaze_smooth, apathy, acc, clock])
        labels.append(status)
        
    columns = [
        'avg_reaction_time_ms', 'time_variability_score', 'total_pause_seconds',
        'words_per_minute', 'vocabulary_richness', 'eye_wander_count',
        'gaze_smoothness', 'facial_apathy_score', 'answer_accuracy', 'clock_score'
    ]
    return pd.DataFrame(data, columns=columns), np.array(labels)

def train():
    print("Generating synthetic data for 9 features...")
    X, y = generate_synthetic_data(1500)
    
    print("Training Random Forest Classifier...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    clf.fit(X, y)
    
    print(f"Saving model to {MODEL_FILE}...")
    joblib.dump(clf, MODEL_FILE)
    print("Training complete.")

if __name__ == "__main__":
    train()
