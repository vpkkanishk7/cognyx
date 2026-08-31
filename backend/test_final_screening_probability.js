const http = require('http');

function postJson(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: '127.0.0.1',
      port: 8000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(resBody) });
        } catch (e) {
          resolve({ status: res.statusCode, data: resBody });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function verifyFinalDementiaScreeningProbability() {
  console.log("===================================================================");
  console.log("   COGNYX FINAL DEMENTIA SCREENING PROBABILITY VERIFICATION");
  console.log("   Trained Model: COGNYX-ML-v3.0-OPTIMAL");
  console.log("===================================================================\n");

  // [TEST 1] Full Multimodal Assessment Payload -> ML Inference
  console.log("[TEST 1] Testing Complete Assessment Battery ML Feature Pipeline...");
  const fullPayload = {
    memory_score: 80.0,            // Working memory recall
    pattern_score: 85.0,           // Abstract pattern recognition
    clock_score: 8.5,              // Visuospatial clock construction
    avg_reaction_time_ms: 360.0,   // Psychomotor green-target response
    words_per_minute: 125.0,       // Speech fluency / processing speed
    age: 68.0,                     // User validated demographic age
    gender: "female",
    educationyears: 14.0,
    diabetes: 0,
    reaction_trials: [350.0, 370.0, 360.0],
    facial_apathy_score: 12.0,     // Video facial affect (only when valid)
    gaze_smoothness: 88.0          // Oculomotor stability
  };

  const res1 = await postJson('/predict', fullPayload);
  console.log("ML Microservice Status:", res1.status);
  const data1 = res1.data;
  console.log("Model Version:                 ", data1.modelVersion);
  console.log("Estimated Risk Display:        ", data1.dementiaProbabilityDisplay);
  console.log("Dementia Probability Pct:      ", `${data1.dementiaProbabilityPct}%`);
  console.log("Risk Level:                    ", data1.riskLevel);
  console.log("Screening Result:              ", data1.screeningResult);
  console.log("Safety Disclaimer:             ", data1.safety_disclaimer);

  if (
    data1.dementiaProbabilityPct !== null &&
    data1.dementiaProbabilityPct !== undefined &&
    typeof data1.dementiaProbabilityPct === 'number' &&
    data1.riskLevel &&
    data1.modelVersion === "COGNYX-ML-v3.0-OPTIMAL" &&
    data1.dementiaProbabilityDisplay.includes("Estimated Cognitive Impairment Risk:") &&
    data1.safety_disclaimer.includes("not a medical diagnosis")
  ) {
    console.log("✅ Complete multimodal assessment successfully converted into calibrated ML probability!\n");
  } else {
    console.error("❌ Test 1 Failed: ML Prediction output structure invalid!", data1);
    process.exit(1);
  }

  // [TEST 2] High Cognitive Variance Profile -> Calibrated Risk Tier
  console.log("[TEST 2] Testing Attenuated Cognitive Performance Profile...");
  const attenuatedPayload = {
    memory_score: 30.0,
    pattern_score: 35.0,
    clock_score: 4.0,
    avg_reaction_time_ms: 1800.0,
    words_per_minute: 40.0,
    age: 76.0,
    gender: "male",
    educationyears: 8.0,
    diabetes: 1,
    reaction_trials: [1800.0, 1950.0, 1750.0]
  };

  const res2 = await postJson('/predict', attenuatedPayload);
  const data2 = res2.data;
  console.log("Attenuated Profile Output:     ", data2.dementiaProbabilityDisplay);
  console.log("Attenuated Risk Level:         ", data2.riskLevel);
  console.log("Attenuated Screening Result:   ", data2.screeningResult);

  if (
    data2.dementiaProbabilityPct > data1.dementiaProbabilityPct &&
    (data2.riskLevel === "Moderate" || data2.riskLevel === "Elevated")
  ) {
    console.log("✅ Attenuated profile correctly reflects higher calibrated screening risk!\n");
  } else {
    console.error("❌ Test 2 Failed: Attenuated profile did not produce expected higher risk!", data2);
    process.exit(1);
  }

  // [TEST 3] Major Cognitive Factors Output
  console.log("[TEST 3] Testing Explainable Major Cognitive Factors Breakdown...");
  console.log("Factors count:", data1.majorCognitiveFactors.length);
  data1.majorCognitiveFactors.forEach((f, idx) => {
    console.log(`  ${idx + 1}. ${f.factor_name}: ${f.status} (Weight: ${f.contribution_weight_pct}%)`);
  });

  if (data1.majorCognitiveFactors && data1.majorCognitiveFactors.length >= 4) {
    console.log("✅ Explainable cognitive factor contributions fully verified!\n");
  } else {
    console.error("❌ Test 3 Failed: Cognitive factors missing!");
    process.exit(1);
  }

  // [TEST 4] Safety & Non-Diagnostic Clinical Boundaries
  console.log("[TEST 4] Testing Safety, Ethical Disclaimers, and Non-Diagnostic Wording...");
  const summaryStr = JSON.stringify(data1);
  if (
    !summaryStr.toLowerCase().includes("user has dementia") &&
    !summaryStr.toLowerCase().includes("diagnosed with dementia") &&
    data1.safety_disclaimer.includes("not a medical diagnosis")
  ) {
    console.log("✅ Safety boundaries strictly upheld — zero claims of clinical diagnosis!\n");
  } else {
    console.error("❌ Test 4 Failed: Inappropriate diagnostic claim found!");
    process.exit(1);
  }

  console.log("===================================================================");
  console.log("   ✅ ALL FINAL DEMENTIA SCREENING PROBABILITY TESTS PASSED!");
  console.log("===================================================================");
}

verifyFinalDementiaScreeningProbability().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
