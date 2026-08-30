import os
import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from feature_schema import FEATURES

def generate_synthetic_data(num_samples=1000):
    """
    Generates synthetic training data for demonstration purposes.
    DISCLAIMER: This is synthetic data, not clinical medical data.
    """
    np.random.seed(42)
    
    # Healthy cluster (low risk)
    age_h = np.random.randint(18, 65, num_samples//2)
    im_h = np.random.randint(2, 4, num_samples//2)
    dr_h = np.random.randint(2, 4, num_samples//2)
    wi_h = np.random.randint(70, 101, num_samples//2)
    pm_h = np.random.randint(70, 101, num_samples//2)
    rx_h = np.random.randint(200, 1000, num_samples//2)
    clk_h = np.random.randint(8, 11, num_samples//2)
    oc_h = np.random.randint(80, 101, num_samples//2)
    y_h = np.zeros(num_samples//2)
    
    # At-risk cluster (higher risk indicators)
    age_r = np.random.randint(65, 95, num_samples//2)
    im_r = np.random.randint(0, 3, num_samples//2)
    dr_r = np.random.randint(0, 2, num_samples//2)
    wi_r = np.random.randint(30, 80, num_samples//2)
    pm_r = np.random.randint(30, 80, num_samples//2)
    rx_r = np.random.randint(800, 3000, num_samples//2)
    clk_r = np.random.randint(2, 8, num_samples//2)
    oc_r = np.random.randint(40, 80, num_samples//2)
    y_r = np.ones(num_samples//2)
    
    X_h = np.column_stack((age_h, im_h, dr_h, wi_h, pm_h, rx_h, clk_h, oc_h))
    X_r = np.column_stack((age_r, im_r, dr_r, wi_r, pm_r, rx_r, clk_r, oc_r))
    
    X = np.vstack((X_h, X_r))
    y = np.concatenate((y_h, y_r))
    
    return X, y

if __name__ == "__main__":
    print("Generating synthetic data according to authoritative feature schema...")
    X, y = generate_synthetic_data()
    
    print(f"Training RandomForestClassifier on {len(FEATURES)} features...")
    print(f"Features: {FEATURES}")
    
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X, y)
    
    model_path = os.path.join(os.path.dirname(__file__), 'cognyx_model.pkl')
    
    model_data = {
        'model': clf,
        'features': FEATURES,
        'version': '2.0.0-synthetic'
    }
    
    with open(model_path, 'wb') as f:
        pickle.dump(model_data, f)
        
    print(f"Model saved to {model_path}")
    print("WARNING: This model uses synthetic data. Do not use for clinical diagnosis.")
