import os
import json
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import joblib

from sklearn.model_selection import GroupShuffleSplit
from sklearn.preprocessing import RobustScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, HistGradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix,
    roc_curve, precision_recall_curve
)
from sklearn.inspection import permutation_importance
from sklearn.calibration import CalibratedClassifierCV

# Define paths
BASE_DATA_DIR = r"f:\dem-evol\COGNYX\dataset"
OPTIMAL_CSV = os.path.join(BASE_DATA_DIR, "OPTIMAL_combined_3studies_6feb2020-selected-columns.csv")

ML_DIR = r"f:\dem-evol\COGNYX\COGNYX\ml_service"
ARTIFACTS_DIR = os.path.join(ML_DIR, "ml_artifacts")
ROOT_ARTIFACTS_DIR = r"f:\dem-evol\COGNYX\COGNYX\ml_artifacts"

os.makedirs(ARTIFACTS_DIR, exist_ok=True)
os.makedirs(ROOT_ARTIFACTS_DIR, exist_ok=True)

MODEL_SAVE_PATH = os.path.join(ML_DIR, "dementia_model.joblib")
ROOT_MODEL_SAVE_PATH = r"f:\dem-evol\COGNYX\COGNYX\dementia_model.joblib"

def load_and_split_data():
    print("--- 1. Loading Dataset 3 (OPTIMAL) ---")
    df = pd.read_csv(OPTIMAL_CSV, na_values=['NA', 'NaN', ''])
    
    # Feature columns and target
    num_features = ['age', 'educationyears', 'EF', 'PS', 'Global', 'diabetes']
    cat_features = ['gender']
    target_col = 'dementia_all'
    group_col = 'ID'
    
    X = df[num_features + cat_features]
    y = df[target_col]
    groups = df[group_col]
    
    print(f"Total dataset: {len(df)} rows across {df[group_col].nunique()} unique participants")
    print(f"Target distribution (dementia_all): Control (0)={sum(y==0)}, Dementia (1)={sum(y==1)}")
    
    # Grouped split: 70% Train, 30% Temp (Val + Test)
    gss1 = GroupShuffleSplit(n_splits=1, train_size=0.70, random_state=42)
    train_idx, temp_idx = next(gss1.split(X, y, groups=groups))
    
    X_train, y_train, groups_train = X.iloc[train_idx], y.iloc[train_idx], groups.iloc[train_idx]
    X_temp, y_temp, groups_temp = X.iloc[temp_idx], y.iloc[temp_idx], groups.iloc[temp_idx]
    
    # Split Temp into 50% Val (15% total), 50% Test (15% total)
    gss2 = GroupShuffleSplit(n_splits=1, train_size=0.50, random_state=42)
    val_sub_idx, test_sub_idx = next(gss2.split(X_temp, y_temp, groups=groups_temp))
    
    X_val, y_val, groups_val = X_temp.iloc[val_sub_idx], y_temp.iloc[val_sub_idx], groups_temp.iloc[val_sub_idx]
    X_test, y_test, groups_test = X_temp.iloc[test_sub_idx], y_temp.iloc[test_sub_idx], groups_temp.iloc[test_sub_idx]
    
    print("\n--- Split Verification ---")
    print(f"Train Set: {len(X_train)} samples ({groups_train.nunique()} participants) | 0: {sum(y_train==0)}, 1: {sum(y_train==1)}")
    print(f"Validation Set: {len(X_val)} samples ({groups_val.nunique()} participants) | 0: {sum(y_val==0)}, 1: {sum(y_val==1)}")
    print(f"Test Set: {len(X_test)} samples ({groups_test.nunique()} participants) | 0: {sum(y_test==0)}, 1: {sum(y_test==1)}")
    
    # Check ID leakage
    s_train, s_val, s_test = set(groups_train), set(groups_val), set(groups_test)
    assert len(s_train.intersection(s_val)) == 0, "Leakage between Train and Val!"
    assert len(s_train.intersection(s_test)) == 0, "Leakage between Train and Test!"
    assert len(s_val.intersection(s_test)) == 0, "Leakage between Val and Test!"
    print("Leakage Check: PASSED (0 overlapping participant IDs between Train, Val, Test)")
    
    return (X_train, y_train, groups_train), (X_val, y_val, groups_val), (X_test, y_test, groups_test), num_features, cat_features

def build_preprocessor(num_features, cat_features):
    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', RobustScaler())
    ])
    
    cat_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', num_pipeline, num_features),
            ('cat', cat_pipeline, cat_features)
        ],
        remainder='drop'
    )
    return preprocessor

def evaluate_predictions(y_true, y_pred, y_prob):
    cm = confusion_matrix(y_true, y_pred)
    tn, fp, fn, tp = cm.ravel()
    
    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, zero_division=0)
    rec = recall_score(y_true, y_pred, zero_division=0)
    spec = tn / (tn + fp) if (tn + fp) > 0 else 0.0
    f1 = f1_score(y_true, y_pred, zero_division=0)
    roc_auc = roc_auc_score(y_true, y_prob) if len(np.unique(y_true)) > 1 else 0.5
    pr_auc = average_precision_score(y_true, y_prob) if len(np.unique(y_true)) > 1 else 0.0
    
    return {
        "accuracy": float(acc),
        "precision": float(prec),
        "recall_sensitivity": float(rec),
        "specificity": float(spec),
        "f1_score": float(f1),
        "roc_auc": float(roc_auc),
        "pr_auc": float(pr_auc),
        "confusion_matrix": {
            "tn": int(tn),
            "fp": int(fp),
            "fn": int(fn),
            "tp": int(tp)
        }
    }

def main():
    (X_train, y_train, groups_train), (X_val, y_val, groups_val), (X_test, y_test, groups_test), num_features, cat_features = load_and_split_data()
    
    preprocessor = build_preprocessor(num_features, cat_features)
    
    # Fit preprocessor strictly on training data
    print("\n--- 2. Fitting Preprocessing on Training Set Only ---")
    X_train_proc = preprocessor.fit_transform(X_train)
    X_val_proc = preprocessor.transform(X_val)
    X_test_proc = preprocessor.transform(X_test)
    
    # Feature names after preprocessing
    cat_encoder = preprocessor.named_transformers_['cat'].named_steps['encoder']
    cat_names = [f"gender_{c}" for c in cat_encoder.get_feature_names_out(cat_features)]
    feature_names = num_features + cat_names
    print(f"Processed Feature Names ({len(feature_names)}): {feature_names}")
    
    # Model candidates
    models = {
        "Logistic Regression (Balanced)": LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42),
        "Random Forest (Balanced Subsample)": RandomForestClassifier(n_estimators=100, max_depth=6, class_weight='balanced_subsample', random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, max_depth=3, learning_rate=0.05, random_state=42),
        "HistGradientBoosting (Balanced)": HistGradientBoostingClassifier(class_weight='balanced', max_depth=4, random_state=42)
    }
    
    print("\n--- 3. Training & Comparing Model Candidates on Validation Set ---")
    val_results = {}
    fitted_models = {}
    
    for name, clf in models.items():
        clf.fit(X_train_proc, y_train)
        fitted_models[name] = clf
        
        y_val_pred = clf.predict(X_val_proc)
        y_val_prob = clf.predict_proba(X_val_proc)[:, 1] if hasattr(clf, "predict_proba") else clf.decision_function(X_val_proc)
        
        metrics = evaluate_predictions(y_val, y_val_pred, y_val_prob)
        val_results[name] = metrics
        print(f"\nModel: {name}")
        print(f"  Val ROC-AUC: {metrics['roc_auc']:.4f} | PR-AUC: {metrics['pr_auc']:.4f} | Sensitivity: {metrics['recall_sensitivity']:.4f} | Specificity: {metrics['specificity']:.4f} | F1: {metrics['f1_score']:.4f}")
    
    # Select Best Model based on Validation PR-AUC + ROC-AUC
    # For imbalanced screening (6.3% positive), PR-AUC + ROC-AUC are the primary criteria
    best_model_name = max(val_results, key=lambda k: val_results[k]['pr_auc'] + val_results[k]['roc_auc'])
    best_clf = fitted_models[best_model_name]
    print(f"\n>>> Best Model Selected on Validation Set: '{best_model_name}' <<<")
    
    # 4. Genuine Learning / Accuracy Curve across Estimators
    print("\n--- 4. Computing Genuine Estimator Accuracy / Learning Curve ---")
    estimator_counts = [10, 25, 50, 75, 100, 150, 200, 250, 300]
    train_acc_curve = []
    val_acc_curve = []
    train_roc_curve = []
    val_roc_curve = []
    
    for n_est in estimator_counts:
        temp_rf = RandomForestClassifier(n_estimators=n_est, max_depth=6, class_weight='balanced_subsample', random_state=42)
        temp_rf.fit(X_train_proc, y_train)
        
        train_pred = temp_rf.predict(X_train_proc)
        val_pred = temp_rf.predict(X_val_proc)
        
        train_prob = temp_rf.predict_proba(X_train_proc)[:, 1]
        val_prob = temp_rf.predict_proba(X_val_proc)[:, 1]
        
        train_acc_curve.append(accuracy_score(y_train, train_pred))
        val_acc_curve.append(accuracy_score(y_val, val_pred))
        train_roc_curve.append(roc_auc_score(y_train, train_prob))
        val_roc_curve.append(roc_auc_score(y_val, val_prob))
    
    # Plot Accuracy / Performance Curve
    plt.figure(figsize=(9, 5.5))
    plt.plot(estimator_counts, train_acc_curve, 'o-', color='#0284c7', label='Training Accuracy', linewidth=2)
    plt.plot(estimator_counts, val_acc_curve, 's--', color='#10b981', label='Validation Accuracy', linewidth=2)
    plt.title('Random Forest Estimator Performance Curve (Actual Data)', fontsize=13, fontweight='bold')
    plt.xlabel('Number of Estimator Trees', fontsize=11)
    plt.ylabel('Accuracy Score', fontsize=11)
    plt.ylim(0.70, 1.0)
    plt.grid(True, linestyle=':', alpha=0.6)
    plt.legend(loc='lower right', frameon=True)
    plt.tight_layout()
    acc_curve_path = os.path.join(ARTIFACTS_DIR, "accuracy_curve.png")
    plt.savefig(acc_curve_path, dpi=300)
    plt.savefig(os.path.join(ROOT_ARTIFACTS_DIR, "accuracy_curve.png"), dpi=300)
    plt.close()
    print(f"Saved: {acc_curve_path}")
    
    # 5. Held-Out Test Set Evaluation
    print("\n--- 5. Evaluating Best Model on Held-Out Test Set (Evaluated ONCE) ---")
    y_test_pred = best_clf.predict(X_test_proc)
    y_test_prob = best_clf.predict_proba(X_test_proc)[:, 1]
    
    test_metrics = evaluate_predictions(y_test, y_test_pred, y_test_prob)
    print("Held-Out Test Results:")
    for k, v in test_metrics.items():
        if k != "confusion_matrix":
            print(f"  {k}: {v:.4f}")
        else:
            print(f"  {k}: {v}")
            
    # 6. Generate Test Confusion Matrix Plot
    fig, ax = plt.subplots(figsize=(6, 5.2))
    cm = confusion_matrix(y_test, y_test_pred)
    cax = ax.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    plt.colorbar(cax, fraction=0.046, pad=0.04)
    
    # Annotate numbers and percentages
    thresh = cm.max() / 2.0
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            val = cm[i, j]
            pct = val / len(y_test) * 100
            ax.text(j, i, f"{val}\n({pct:.1f}%)",
                    ha="center", va="center",
                    color="white" if val > thresh else "#0f172a",
                    fontsize=12, fontweight='bold')
                    
    ax.set_xticks([0, 1])
    ax.set_yticks([0, 1])
    ax.set_xticklabels(['Control (0)', 'Dementia (1)'], fontsize=10, fontweight='bold')
    ax.set_yticklabels(['Control (0)', 'Dementia (1)'], fontsize=10, fontweight='bold')
    plt.title('Test Set Confusion Matrix\n(Held-Out N=280 Participants)', fontsize=12, fontweight='bold')
    plt.xlabel('Predicted Screening Class', fontsize=11)
    plt.ylabel('Actual Clinical Ground Truth', fontsize=11)
    plt.tight_layout()
    cm_path = os.path.join(ARTIFACTS_DIR, "confusion_matrix.png")
    plt.savefig(cm_path, dpi=300)
    plt.savefig(os.path.join(ROOT_ARTIFACTS_DIR, "confusion_matrix.png"), dpi=300)
    plt.close()
    print(f"Saved: {cm_path}")
    
    # 7. Generate ROC-AUC Curve Plot
    fpr, tpr, _ = roc_curve(y_test, y_test_prob)
    plt.figure(figsize=(7, 5.5))
    plt.plot(fpr, tpr, color='#0284c7', lw=2.5, label=f'Test ROC Curve (AUC = {test_metrics["roc_auc"]:.3f})')
    plt.plot([0, 1], [0, 1], color='#94a3b8', lw=1.5, linestyle='--', label='Chance Line (AUC = 0.500)')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate (1 - Specificity)', fontsize=11)
    plt.ylabel('True Positive Rate (Sensitivity / Recall)', fontsize=11)
    plt.title('Empirical ROC Curve on Held-Out Test Set', fontsize=12, fontweight='bold')
    plt.grid(True, linestyle=':', alpha=0.6)
    plt.legend(loc='lower right', frameon=True)
    plt.tight_layout()
    roc_path = os.path.join(ARTIFACTS_DIR, "roc_curve.png")
    plt.savefig(roc_path, dpi=300)
    plt.savefig(os.path.join(ROOT_ARTIFACTS_DIR, "roc_curve.png"), dpi=300)
    plt.close()
    print(f"Saved: {roc_path}")
    
    # 8. Generate Precision-Recall Curve Plot
    precision_vals, recall_vals, _ = precision_recall_curve(y_test, y_test_prob)
    baseline_pr = sum(y_test==1) / len(y_test)
    plt.figure(figsize=(7, 5.5))
    plt.plot(recall_vals, precision_vals, color='#10b981', lw=2.5, label=f'Test PR Curve (PR-AUC = {test_metrics["pr_auc"]:.3f})')
    plt.plot([0, 1], [baseline_pr, baseline_pr], color='#f59e0b', lw=1.5, linestyle='--', label=f'Prevalence Baseline ({baseline_pr*100:.1f}%)')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('Recall (Sensitivity)', fontsize=11)
    plt.ylabel('Precision (Positive Predictive Value)', fontsize=11)
    plt.title('Precision-Recall Curve (Prevalence = 6.4%)', fontsize=12, fontweight='bold')
    plt.grid(True, linestyle=':', alpha=0.6)
    plt.legend(loc='upper right', frameon=True)
    plt.tight_layout()
    pr_path = os.path.join(ARTIFACTS_DIR, "precision_recall_curve.png")
    plt.savefig(pr_path, dpi=300)
    plt.savefig(os.path.join(ROOT_ARTIFACTS_DIR, "precision_recall_curve.png"), dpi=300)
    plt.close()
    print(f"Saved: {pr_path}")
    
    # 9. Generate Feature Importance Plot (Permutation Importance on Test Set)
    print("\n--- 6. Computing Permutation Feature Importance ---")
    perm_imp = permutation_importance(best_clf, X_test_proc, y_test, n_repeats=20, random_state=42, scoring='roc_auc')
    sorted_idx = perm_imp.importances_mean.argsort()
    
    plt.figure(figsize=(8, 5))
    plt.barh(np.array(feature_names)[sorted_idx], perm_imp.importances_mean[sorted_idx],
             xerr=perm_imp.importances_std[sorted_idx], color='#0284c7', alpha=0.85, capsize=4)
    plt.title('Permutation Feature Importance (ROC-AUC Impact on Test Set)', fontsize=12, fontweight='bold')
    plt.xlabel('Mean Decrease in Test ROC-AUC', fontsize=11)
    plt.grid(axis='x', linestyle=':', alpha=0.6)
    plt.tight_layout()
    feat_imp_path = os.path.join(ARTIFACTS_DIR, "feature_importance.png")
    plt.savefig(feat_imp_path, dpi=300)
    plt.savefig(os.path.join(ROOT_ARTIFACTS_DIR, "feature_importance.png"), dpi=300)
    plt.close()
    print(f"Saved: {feat_imp_path}")
    
    # 10. Fit Platt Scaling Calibration on Validation Set
    print("\n--- 7. Calibrating Classifier Probabilities on Validation Partition (Platt Scaling) ---")
    val_raw_probs = best_clf.predict_proba(X_val_proc)[:, 1].reshape(-1, 1)
    calibrator = LogisticRegression(C=1.0, solver='lbfgs', random_state=42)
    calibrator.fit(val_raw_probs, y_val)
    
    test_raw_probs = y_test_prob.reshape(-1, 1)
    y_test_cal_prob = calibrator.predict_proba(test_raw_probs)[:, 1]
    
    # 11. Save Metrics JSON
    total_participants = len(set(groups_train).union(set(groups_val)).union(set(groups_test)))
    total_samples = len(X_train) + len(X_val) + len(X_test)
    
    final_artifact_data = {
        "modelVersion": "COGNYX-ML-v3.0-OPTIMAL",
        "modelType": best_model_name,
        "calibrationMethod": "Platt Scaling (Sigmoid) on Validation Set",
        "datasetSource": "OPTIMAL Multi-cohort Neuropsychological Study (Dataset 3)",
        "targetLabel": "dementia_all (0: Control, 1: Dementia)",
        "totalParticipants": total_participants,
        "totalSamples": total_samples,
        "dataSplit": {
            "trainingSamples": len(X_train),
            "trainingParticipants": int(groups_train.nunique()),
            "trainingClassDistribution": {"control_0": int(sum(y_train==0)), "dementia_1": int(sum(y_train==1))},
            "validationSamples": len(X_val),
            "validationParticipants": int(groups_val.nunique()),
            "validationClassDistribution": {"control_0": int(sum(y_val==0)), "dementia_1": int(sum(y_val==1))},
            "testSamples": len(X_test),
            "testParticipants": int(groups_test.nunique()),
            "testClassDistribution": {"control_0": int(sum(y_test==0)), "dementia_1": int(sum(y_test==1))}
        },
        "validationComparison": val_results,
        "heldOutTestMetrics": test_metrics,
        "featureNames": feature_names,
        "featureImportanceMean": {feature_names[i]: float(perm_imp.importances_mean[i]) for i in range(len(feature_names))},
        "limitations": [
            "Algorithmic research screening assessment, not a medical diagnosis.",
            "Visual-motor green-target response compared against COGNYX engineering reference values, not clinically validated norms.",
            "Trained on research cohorts with 6.3% dementia prevalence."
        ]
    }
    
    metrics_json_path = os.path.join(ARTIFACTS_DIR, "metrics.json")
    with open(metrics_json_path, 'w') as f:
        json.dump(final_artifact_data, f, indent=2)
    with open(os.path.join(ROOT_ARTIFACTS_DIR, "metrics.json"), 'w') as f:
        json.dump(final_artifact_data, f, indent=2)
    print(f"Saved: {metrics_json_path}")
    
    # 12. Save Full End-to-End Pipeline
    print("\n--- 8. Saving Deployable End-to-End Pipeline ---")
    deployable_pipeline = {
        "preprocessor": preprocessor,
        "raw_classifier": best_clf,
        "calibrator": calibrator,
        "feature_names": feature_names,
        "model_version": "COGNYX-ML-v3.0-OPTIMAL",
        "metadata": final_artifact_data
    }
    joblib.dump(deployable_pipeline, MODEL_SAVE_PATH)
    joblib.dump(deployable_pipeline, ROOT_MODEL_SAVE_PATH)
    print(f"Successfully saved deployable pipeline to: {MODEL_SAVE_PATH}")
    print("--- Training and Evaluation Pipeline Completed Successfully ---")

if __name__ == "__main__":
    main()
