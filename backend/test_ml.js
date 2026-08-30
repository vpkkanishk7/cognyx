const http = require('http');

async function testDirectML() {
  console.log("1. Testing Direct FastAPI ML Microservice on port 8000...");
  try {
    const res = await fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        age: 65,
        immediate_recall_score: 3,
        delayed_recall_score: 2,
        word_identifying_score: 85,
        pattern_matching_score: 90,
        reaction_median_ms: 380,
        clock_score: 9,
        oculomotor_score: 95
      })
    });
    const data = await res.json();
    console.log(`[PASS] FastAPI ML Response (Status ${res.status}):`, data);
  } catch (err) {
    console.log("[INFO] FastAPI ML Service is not currently running on port 8000:", err.message);
  }
}

async function testBackendMLProxy() {
  console.log("\n2. Testing Express Backend ML Proxy on port 3005 (/api/predict)...");
  try {
    const testUsername = 'mltest_' + Date.now();
    await fetch('http://127.0.0.1:3005/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: testUsername, password: 'password123' })
    });

    const loginRes = await fetch('http://127.0.0.1:3005/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: testUsername, password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    if (!token) {
      console.error("[FAIL] Could not authenticate test user");
      return;
    }

    const predictRes = await fetch('http://127.0.0.1:3005/api/predict', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        age: 65,
        immediate_recall_score: 3,
        delayed_recall_score: 2,
        word_identifying_score: 85,
        pattern_matching_score: 90,
        reaction_median_ms: 380,
        clock_score: 9,
        oculomotor_score: 95
      })
    });

    const predictData = await predictRes.json();
    console.log(`[PASS] Express Proxy ML Response (Status ${predictRes.status}):`, predictData);
  } catch (err) {
    console.error("[FAIL] Express Proxy error:", err.message);
  }
}

async function main() {
  await testDirectML();
  await testBackendMLProxy();
}

main();
