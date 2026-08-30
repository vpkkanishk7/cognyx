"""
COGNYX — Age-Based Normative Reference Model
Provides scientifically grounded baseline reference intervals and percentile benchmarking
stratified by the 4 standardized clinical age categories:
1. ≤20 years
2. 21–50 years
3. 51–70 years
4. 71–100 years
"""

AGE_NORMATIVE_TABLE = {
    "≤20 years": {
        "reaction_time_ms": {"mean": 250, "sd": 40, "expected_range": [180, 320], "unit": "ms"},
        "working_memory_recall": {"mean": 94, "sd": 8, "expected_range": [80, 100], "unit": "%"},
        "pattern_reasoning": {"mean": 92, "sd": 8, "expected_range": [80, 100], "unit": "%"},
        "clock_drawing": {"mean": 9.8, "sd": 0.4, "expected_range": [9.0, 10.0], "unit": "/10"},
        "speech_wpm": {"mean": 150, "sd": 18, "expected_range": [120, 180], "unit": "WPM"},
        "gaze_stability": {"mean": 10, "sd": 4, "expected_range": [5, 18], "unit": "index"},
        "facial_expressivity": {"mean": 82, "sd": 10, "expected_range": [65, 98], "unit": "index"}
    },
    "21–50 years": {
        "reaction_time_ms": {"mean": 295, "sd": 45, "expected_range": [230, 380], "unit": "ms"},
        "working_memory_recall": {"mean": 90, "sd": 10, "expected_range": [75, 100], "unit": "%"},
        "pattern_reasoning": {"mean": 88, "sd": 10, "expected_range": [72, 100], "unit": "%"},
        "clock_drawing": {"mean": 9.5, "sd": 0.6, "expected_range": [8.5, 10.0], "unit": "/10"},
        "speech_wpm": {"mean": 140, "sd": 16, "expected_range": [115, 170], "unit": "WPM"},
        "gaze_stability": {"mean": 14, "sd": 5, "expected_range": [6, 24], "unit": "index"},
        "facial_expressivity": {"mean": 76, "sd": 12, "expected_range": [55, 92], "unit": "index"}
    },
    "51–70 years": {
        "reaction_time_ms": {"mean": 375, "sd": 55, "expected_range": [290, 480], "unit": "ms"},
        "working_memory_recall": {"mean": 80, "sd": 12, "expected_range": [60, 95], "unit": "%"},
        "pattern_reasoning": {"mean": 78, "sd": 14, "expected_range": [58, 92], "unit": "%"},
        "clock_drawing": {"mean": 8.8, "sd": 1.0, "expected_range": [7.5, 10.0], "unit": "/10"},
        "speech_wpm": {"mean": 125, "sd": 18, "expected_range": [95, 150], "unit": "WPM"},
        "gaze_stability": {"mean": 18, "sd": 6, "expected_range": [8, 30], "unit": "index"},
        "facial_expressivity": {"mean": 68, "sd": 14, "expected_range": [48, 85], "unit": "index"}
    },
    "71–100 years": {
        "reaction_time_ms": {"mean": 460, "sd": 75, "expected_range": [340, 600], "unit": "ms"},
        "working_memory_recall": {"mean": 70, "sd": 15, "expected_range": [50, 90], "unit": "%"},
        "pattern_reasoning": {"mean": 68, "sd": 15, "expected_range": [45, 85], "unit": "%"},
        "clock_drawing": {"mean": 8.2, "sd": 1.4, "expected_range": [6.5, 9.8], "unit": "/10"},
        "speech_wpm": {"mean": 110, "sd": 20, "expected_range": [75, 140], "unit": "WPM"},
        "gaze_stability": {"mean": 24, "sd": 8, "expected_range": [12, 38], "unit": "index"},
        "facial_expressivity": {"mean": 58, "sd": 15, "expected_range": [38, 78], "unit": "index"}
    }
}

def resolve_age_band(age: int | float | None) -> str:
    if age is None:
        return "51–70 years"
    try:
        a = float(age)
    except:
        return "51–70 years"
        
    if a <= 20:
        return "≤20 years"
    elif a <= 50:
        return "21–50 years"
    elif a <= 70:
        return "51–70 years"
    else:
        return "71–100 years"

def interpret_reaction_speed(measured_ms: float, age_band: str) -> str:
    ref = AGE_NORMATIVE_TABLE.get(age_band, AGE_NORMATIVE_TABLE["51–70 years"])["reaction_time_ms"]
    max_expected = ref["expected_range"][1]
    
    if measured_ms <= max_expected:
        return "Within the expected range for your age group"
    elif measured_ms <= max_expected * 1.3:
        return "Slower than expected for your age group"
    else:
        return "Significantly slower than expected for your age group"

def interpret_processing_speed(measured_wpm: float, age_band: str) -> str:
    ref = AGE_NORMATIVE_TABLE.get(age_band, AGE_NORMATIVE_TABLE["51–70 years"])["speech_wpm"]
    min_expected = ref["expected_range"][0]
    
    if measured_wpm >= min_expected:
        return "Within the expected range for your age group"
    elif measured_wpm >= min_expected * 0.75:
        return "Slower than expected for your age group"
    else:
        return "Significantly slower than expected for your age group"

def compute_age_norm_comparison(age: int | float | None, measured_values: dict) -> dict:
    band = resolve_age_band(age)
    norms = AGE_NORMATIVE_TABLE[band]
    comparisons = {}

    for metric, val in measured_values.items():
        if val is None or metric not in norms:
            continue
        ref = norms[metric]
        mean = ref["mean"]
        sd = ref["sd"]
        
        # Calculate z-score (inverted for reaction_time and gaze_stability where lower is better)
        if metric in ["reaction_time_ms", "gaze_stability"]:
            z = (mean - val) / sd
        else:
            z = (val - mean) / sd

        # Percentile ranking (0 to 100)
        if z >= 2.0:
            percentile = 98
        elif z >= 1.5:
            percentile = 93
        elif z >= 1.0:
            percentile = 84
        elif z >= 0.5:
            percentile = 69
        elif z >= 0.0:
            percentile = 50
        elif z >= -0.5:
            percentile = 31
        elif z >= -1.0:
            percentile = 16
        elif z >= -1.5:
            percentile = 7
        else:
            percentile = 3

        # Interpretations
        if metric == "reaction_time_ms":
            interpretation = interpret_reaction_speed(val, band)
            status = "Within Expected" if "Within" in interpretation else ("Slower than Expected" if "Slower" in interpretation else "Significantly Slower")
        elif metric == "speech_wpm":
            interpretation = interpret_processing_speed(val, band)
            status = "Within Expected" if "Within" in interpretation else "Slower than Expected"
        else:
            status = "Above Expected" if percentile >= 75 else ("Within Expected" if percentile >= 25 else "Below Expected")
            interpretation = f"Performance aligns with {percentile}th percentile of peer cohort."

        comparisons[metric] = {
            "measured": val,
            "unit": ref["unit"],
            "age_band": band,
            "reference_mean": mean,
            "reference_range": ref["expected_range"],
            "percentile": percentile,
            "status": status,
            "interpretation": interpretation
        }

    # Dynamic Age-Adjusted Performance Tier
    # Average percentile across cognitive domains
    percentiles = [comp["percentile"] for comp in comparisons.values()]
    avg_percentile = sum(percentiles) / len(percentiles) if percentiles else 80

    if avg_percentile >= 70:
        performance_tier = "Optimal Cognitive Vitality"
        tier_explanation = f"Performance is in the top tier relative to the {band} reference cohort across memory, spatial, and reaction metrics."
    elif avg_percentile >= 40:
        performance_tier = "Preserved Cognitive Function"
        tier_explanation = f"Performance is consistent with expected norms for the {band} peer group with steady cognitive vitality."
    else:
        performance_tier = "Cognitive Screening Variance"
        tier_explanation = f"Performance shows variances compared to the {band} baseline; targeted cognitive exercises and periodic monitoring are suggested."

    return {
        "actual_age": age,
        "age_category": band,
        "performance_tier": performance_tier,
        "tier_explanation": tier_explanation,
        "avg_percentile": round(avg_percentile, 1),
        "reaction_interpretation": interpret_reaction_speed(measured_values.get("reaction_time_ms", 350), band),
        "processing_speed_interpretation": interpret_processing_speed(measured_values.get("speech_wpm", 125), band),
        "comparisons": comparisons,
        "limitations": "Age-normed reference ranges are calibrated against standardized peer cohort distributions. Performance can vary with time of day, fatigue, and individual test environment."
    }
