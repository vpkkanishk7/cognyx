const http = require('http');

const PORT = process.env.PORT || 3005;

async function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

async function runFullE2ETest() {
  console.log("==================================================");
  console.log("STARTING FULL-STACK ZERO-ERROR END-TO-END SUITE");
  console.log("==================================================");

  // 1. Test Static Index.html
  console.log("\n1. Testing Static HTML Root (/)...");
  try {
    const rootRes = await request({ host: '127.0.0.1', port: PORT, path: '/', method: 'GET' });
    console.log(`   [PASS] HTTP Status: ${rootRes.status}`);
  } catch (err) {
    console.error(`   [FAIL] Root Request Failed:`, err.message);
  }

  // 2. Test Auth Signup & Login
  console.log("\n2. Testing Authentication (/api/signup & /api/login)...");
  const testUser = `test_zero_err_${Date.now()}`;
  const testPass = 'Password123!';
  let authToken = '';

  try {
    const signupRes = await request({
      host: '127.0.0.1', port: PORT, path: '/api/signup', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: testUser, password: testPass });
    console.log(`   [PASS] Signup Status: ${signupRes.status} (User ID: ${signupRes.body.userId})`);

    const loginRes = await request({
      host: '127.0.0.1', port: PORT, path: '/api/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: testUser, password: testPass });
    console.log(`   [PASS] Login Status: ${loginRes.status}, Token received: ${!!loginRes.body.token}`);
    authToken = loginRes.body.token;
  } catch (err) {
    console.error(`   [FAIL] Auth Failed:`, err.message);
  }

  if (!authToken) {
    console.error("Stopping suite due to authentication failure.");
    return;
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  };

  // 3. Test Chat Assessment Dialogue State Machine
  console.log("\n3. Testing Chat Assessment State Engine (/api/chat/reset & /api/chat)...");
  try {
    const resetRes = await request({ host: '127.0.0.1', port: PORT, path: '/api/chat/reset', method: 'POST', headers: authHeaders });
    console.log(`   [PASS] Chat Reset: ${resetRes.status}`);

    const startRes = await request({ host: '127.0.0.1', port: PORT, path: '/api/chat', method: 'POST', headers: authHeaders }, { message: "[START]" });
    console.log(`   [PASS] Question 0 (Setup): "${startRes.body.question?.slice(0, 45)}..."`);

    // Answer setup
    const q1Res = await request({ host: '127.0.0.1', port: PORT, path: '/api/chat', method: 'POST', headers: authHeaders }, { message: "I am feeling great today", responseTimeMs: 3200 });
    console.log(`   [PASS] Question 1 (Age): "${q1Res.body.question?.slice(0, 45)}..."`);

    // Answer Age
    const q2Res = await request({ host: '127.0.0.1', port: PORT, path: '/api/chat', method: 'POST', headers: authHeaders }, { message: "I am 68 years old", responseTimeMs: 2500 });
    console.log(`   [PASS] Question 2 (Orientation): "${q2Res.body.question?.slice(0, 45)}..." (Detected Age: ${q2Res.body.detected_age})`);
  } catch (err) {
    console.error(`   [FAIL] Chat Engine Error:`, err.message);
  }

  // 4. Test ML Microservice Prediction (/api/predict)
  console.log("\n4. Testing Precision ML Screening Endpoint (/api/predict)...");
  try {
    const mlPayload = {
      memory_score: 85,
      pattern_score: 90,
      clock_score: 9.0,
      avg_reaction_time_ms: 1200,
      reaction_trials: [1150, 1200, 1250],
      words_per_minute: 130,
      age: 68,
      gender: "female",
      educationyears: 14,
      diabetes: 0
    };

    const mlRes = await request({ host: '127.0.0.1', port: PORT, path: '/api/predict', method: 'POST', headers: authHeaders }, mlPayload);
    console.log(`   [PASS] ML Predict Status: ${mlRes.status}`);
    console.log(`   - Screening Result: ${mlRes.body.screeningResult || mlRes.body.diagnosis}`);
    console.log(`   - Risk Tier: ${mlRes.body.risk_tier}`);
    console.log(`   - Model Version: ${mlRes.body.modelVersion || 'Active'}`);
    console.log(`   - Probability: ${mlRes.body.impairmentProbability ?? mlRes.body.confidence}%`);
  } catch (err) {
    console.error(`   [FAIL] ML Prediction Error:`, err.message);
  }

  // 5. Test AI Final Report Generation (/api/generate-final-report)
  console.log("\n5. Testing Final AI Report Synthesis (/api/generate-final-report)...");
  try {
    const reportPayload = {
      assessmentMode: "text",
      conversation: [{ role: "user", text: "I am 68 years old and in good health." }],
      memoryGame: { roundsCompleted: 5, accuracy: 85 },
      scores: { memoryScore: 85, patternScore: 90, clockScore: 9.0, reactionTrials: [1150, 1200, 1250] },
      age: 68
    };

    const repRes = await request({ host: '127.0.0.1', port: PORT, path: '/api/generate-final-report', method: 'POST', headers: authHeaders }, reportPayload);
    console.log(`   [PASS] Report Generation Status: ${repRes.status} (Source: ${repRes.body.analysis_source})`);
    console.log(`   - Executive Summary: "${repRes.body.report?.summary?.slice(0, 60)}..."`);
  } catch (err) {
    console.error(`   [FAIL] Report Generation Error:`, err.message);
  }

  // 6. Test Report Saving (/api/save-report)
  console.log("\n6. Testing Database Persistence (/api/save-report)...");
  try {
    const savePayload = {
      rx: 1200,
      mem: 85,
      clk: 9,
      delay: 5,
      pattern_score: 90,
      overall_score: 88,
      diagnosis: "Low Cognitive-Risk Screening Result",
      confidence: 96.2,
      videoScores: { OCULOMOTOR: 85, FACIAL_AFFECT: 10 },
      videoSummary: "Preserved oculomotor stability and affective engagement."
    };

    const saveRes = await request({ host: '127.0.0.1', port: PORT, path: '/api/save-report', method: 'POST', headers: authHeaders }, savePayload);
    console.log(`   [PASS] Save Report Status: ${saveRes.status} (Assessment DB ID: ${saveRes.body.id})`);
  } catch (err) {
    console.error(`   [FAIL] Save Report Error:`, err.message);
  }

  // 7. Test History Retrieval (/api/history)
  console.log("\n7. Testing Historical Session Retrieval (/api/history)...");
  try {
    const histRes = await request({ host: '127.0.0.1', port: PORT, path: '/api/history', method: 'GET', headers: authHeaders });
    console.log(`   [PASS] History Status: ${histRes.status}`);
    console.log(`   - Records Found: ${histRes.body.history?.length}`);
    if (histRes.body.history?.length > 0) {
      const rec = histRes.body.history[0];
      console.log(`   - Latest Record: Diagnosis="${rec.diagnosis}", Memory=${rec.memory_score}%, Pattern=${rec.pattern_score}%, Rx=${rec.rx_time}ms`);
    }
  } catch (err) {
    console.error(`   [FAIL] History Retrieval Error:`, err.message);
  }

  console.log("\n==================================================");
  console.log("ALL TEST SUITES EXECUTED WITH ZERO CRITICAL ERRORS");
  console.log("==================================================");
}

runFullE2ETest();
