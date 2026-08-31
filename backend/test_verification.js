const http = require('http');

function post(url, data, token = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const postData = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch(e) {
          resolve({ raw: body, status: res.statusCode });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log("=== RUNNING COGNYX PROBABILITY & MULTILINGUAL VERIFICATION ===");

  // 1. Test Direct ML Service
  console.log("\n[TEST 1] Querying ML Service directly (/predict)...");
  try {
    const mlData = await post('http://127.0.0.1:8000/predict', {
      memory_score: 85,
      pattern_score: 90,
      clock_score: 9.0,
      avg_reaction_time_ms: 1200,
      age: 65,
      words_per_minute: 120
    });
    console.log("ML Service Response:", {
      diagnosis: mlData.diagnosis,
      dementiaProbability: mlData.dementiaProbability,
      dementiaProbabilityPct: mlData.dementiaProbabilityPct,
      dementiaProbabilityDisplay: mlData.dementiaProbabilityDisplay,
      riskLevel: mlData.riskLevel,
      majorCognitiveFactors: mlData.majorCognitiveFactors?.slice(0, 2)
    });
  } catch (err) {
    console.error("❌ ML Service connection:", err.message);
  }

  // Auth Step
  console.log("\n[AUTH] Logging in to COGNYX backend...");
  let token = "";
  const testUser = 'user_' + Date.now();
  const testPass = 'Password123!';
  try {
    await post('http://127.0.0.1:3005/api/signup', {
      username: testUser,
      password: testPass
    });
    const loginData = await post('http://127.0.0.1:3005/api/login', {
      username: testUser,
      password: testPass
    });
    token = loginData.token;
    console.log("Authenticated successfully. Token present:", !!token, "Token prefix:", token ? token.substring(0, 15) : "none");
  } catch (e) {
    console.error("Auth error:", e);
  }

  // 2. Test Express /api/predict
  console.log("\n[TEST 2] Querying Backend Express /api/predict...");
  try {
    const beData = await post('http://127.0.0.1:3005/api/predict', {
      memory_score: 85,
      pattern_score: 90,
      clock_score: 9.0,
      avg_reaction_time_ms: 1200,
      age: 65,
      words_per_minute: 120
    }, token);
    console.log("Backend /api/predict Response:", {
      diagnosis: beData.diagnosis,
      dementiaProbability: beData.dementiaProbability,
      dementiaProbabilityPct: beData.dementiaProbabilityPct,
      dementiaProbabilityDisplay: beData.dementiaProbabilityDisplay,
      riskLevel: beData.riskLevel
    });
  } catch (err) {
    console.error("❌ Backend /api/predict error:", err.message);
  }

  // 3. Test Multilingual Chat (English, Tamil, Hindi)
  console.log("\n[TEST 3] Testing Multilingual Chat (/api/chat)...");
  for (const lang of ['en', 'ta', 'hi']) {
    try {
      const chatData = await post('http://127.0.0.1:3005/api/chat', {
        message: "[START]",
        language: lang
      }, token);
      console.log(`Chat [${lang}] response:`, chatData.question);
    } catch (err) {
      console.error(`Chat [${lang}] error:`, err.message);
    }
  }

  // 4. Test Final Report Generation in English, Tamil, Hindi
  console.log("\n[TEST 4] Testing Multilingual Final Report Generation (/api/generate-final-report)...");
  for (const lang of ['en', 'ta', 'hi']) {
    try {
      const repData = await post('http://127.0.0.1:3005/api/generate-final-report', {
        subject: "TestSubject",
        age: 68,
        scores: { memoryScore: 80, patternScore: 85, clockScore: 8, reactionTimeMs: 1350 },
        dementiaProbabilityPct: 14.2,
        riskLevel: "Low",
        language: lang
      }, token);
      console.log(`Report [${lang}] Summary:`, repData.report?.summary);
      console.log(`Report [${lang}] Probability Display:`, repData.report?.dementia_screening_probability);
      console.log(`Report [${lang}] Risk Level:`, repData.report?.overall_risk_score);
    } catch (err) {
      console.error(`Report [${lang}] error:`, err.message);
    }
  }

  console.log("\n=== ALL TESTS COMPLETE ===");
}

runTests();
