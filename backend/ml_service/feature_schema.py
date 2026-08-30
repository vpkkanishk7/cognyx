"""
AUTHORITATIVE ML FEATURE SCHEMA
Defines the exact feature vector order and missing-value fallbacks used by
both the training script and the FastAPI inference endpoint.
"""

FEATURES = [
    "age",
    "immediate_recall_score", 
    "delayed_recall_score",
    "word_identifying_score",
    "pattern_matching_score",
    "reaction_median_ms",
    "clock_score",
    "oculomotor_score"
]

# Validation ranges and fallback rules
# Fallbacks are only applied if data is genuinely unavailable (e.g. camera denied).
# 0 is NOT used as a missing value unless mathematically sound. Mean imputation is preferred.
VALIDATION_RULES = {
    "age": {"min": 18, "max": 120, "fallback": 45},
    "immediate_recall_score": {"min": 0, "max": 3, "fallback": 0},
    "delayed_recall_score": {"min": 0, "max": 3, "fallback": 0},
    "word_identifying_score": {"min": 0, "max": 100, "fallback": 50},
    "pattern_matching_score": {"min": 0, "max": 100, "fallback": 50},
    "reaction_median_ms": {"min": 150, "max": 10000, "fallback": 1500},
    "clock_score": {"min": 0, "max": 10, "fallback": 5},
    "oculomotor_score": {"min": 0, "max": 100, "fallback": 50}
}
