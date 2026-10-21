const assert = require('assert');

const BASE_URL = 'http://localhost:3005';

async function runScoreIntegrityTests() {
  console.log('====================================================');
  console.log('   COGNYX SCORE HANDLING & DATA INTEGRITY TESTS     ');
  console.log('====================================================\n');

  // Register & login test user to get JWT token
  const testUser = 'score_test_' + Date.now();
  await fetch(`${BASE_URL}/api/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: testUser, password: 'password123' })
  });

  const loginRes = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: testUser, password: 'password123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  assert(token, 'JWT token must be acquired');

  // Helper fetch function
  const post = async (endpoint, data) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return { status: res.status, body: await res.json() };
  };

  // TEST 1: Valid Normal Scores -> Should produce valid composite score
  console.log('1️⃣  TEST: Valid Normal Positive Scores');
  {
    const payload = {
      scores: {
        reactionTimeMs: 450,
        memoryScore: 80,
        clockScore: 9,
        patternScore: 90,
        delayedRecallScore: 67
      },
      age: 65,
      gender: 'Female',
      education: 'College'
    };

    const res = await post('/api/predict', payload);
    assert.strictEqual(res.status, 200);
    assert(Number.isFinite(res.body.composite_score), 'Composite score must be finite number');
    assert(res.body.composite_score > 0, 'Composite score must be positive');
    // When ML microservice is offline, analytical fallback honestly reports Unavailable
    assert(['Low', 'Moderate', 'Elevated', 'Unavailable'].includes(res.body.riskLevel), `Risk level must be valid, got: ${res.body.riskLevel}`);
    console.log(`   -> PASS: Normal composite score=${res.body.composite_score}, risk=${res.body.riskLevel}`);
  }

  // TEST 2: Valid Score of ZERO -> Must be preserved, not overwritten with default 85/88/8.5
  console.log('\n2️⃣  TEST: Legitimate Score of Zero');
  {
    const payload = {
      scores: {
        reactionTimeMs: 1200,
        memoryScore: 0, // Legitimate 0% recall
        clockScore: 0,  // Failed clock completely
        patternScore: 0, // 0 pattern correct
        delayedRecallScore: 0
      },
      age: 72
    };

    const res = await post('/api/predict', payload);
    assert.strictEqual(res.status, 200);
    assert(Number.isFinite(res.body.composite_score), 'Composite score must be finite');
    // Scores of 0 across all domains must result in a very low overall score, NOT fabricated 85+
    assert(res.body.composite_score <= 20, `Zero scores must not produce high score; got: ${res.body.composite_score}`);
    console.log(`   -> PASS: Valid zeros preserved; composite=${res.body.composite_score}, risk=${res.body.riskLevel}`);
  }

  // TEST 3: Incomplete Data / Missing Metrics -> Must NOT invent fake scores
  console.log('\n3️⃣  TEST: Incomplete Assessment Data (Only 1 metric provided)');
  {
    const payload = {
      scores: {
        patternScore: 75
        // memoryScore, clockScore, reactionTimeMs all missing/null
      },
      age: 60
    };

    const res = await post('/api/predict', payload);
    assert.strictEqual(res.status, 200);
    // When only patternScore is measured (weight = 0.25 < 0.35 threshold),
    // overall score must be null (Unavailable), NOT a fabricated full score!
    assert.strictEqual(res.body.composite_score, null, 'Composite score must be null when insufficient domains measured');
    assert.strictEqual(res.body.riskLevel, 'Unavailable', 'Risk level must be Unavailable for incomplete data');
    console.log(`   -> PASS: Incomplete data correctly reported composite_score=${res.body.composite_score}, riskLevel=${res.body.riskLevel}`);
  }

  // TEST 4: Explicit Nulls, Undefined, String, NaN, Negative, and Out-of-Range values
  console.log('\n4️⃣  TEST: Malformed, NaN, String, and Out-of-Range Inputs');
  {
    const payload = {
      scores: {
        reactionTimeMs: "four hundred", // Invalid string
        memoryScore: NaN,               // NaN
        clockScore: -5,                 // Negative / out-of-range
        patternScore: 9999,             // Out of range (> 100)
        delayedRecallScore: null        // Explicit null
      },
      age: "unknown"
    };

    const res = await post('/api/predict', payload);
    assert.strictEqual(res.status, 200);
    // None of these are valid finite scores, so composite_score must be null
    assert.strictEqual(res.body.composite_score, null, 'Invalid/NaN/Out-of-range scores must be rejected and result in null composite');
    assert.strictEqual(res.body.riskLevel, 'Unavailable');
    console.log(`   -> PASS: Rejected all malformed/NaN/out-of-range inputs; risk=${res.body.riskLevel}`);
  }

  // TEST 5: Save Report Endpoint with NULL metrics -> DB must store NULLs without defaulting to 0 or 85
  console.log('\n5️⃣  TEST: Save Report with Null / Missing Metrics');
  {
    const savePayload = {
      rx: null,
      mem: null,
      clk: null,
      delay: null,
      pattern_score: 83.3,
      overall_score: null,
      diagnosis: 'Screening probability unavailable.',
      confidence: null,
      dementia_prob: null,
      risk_level: 'Unavailable'
    };

    const res = await post('/api/save-report', savePayload);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    console.log('   -> PASS: Save report accepted honest nulls and stored successfully without error.');
  }

  // TEST 6: Save Report with Legitimate ZERO -> DB must store 0, not null and not 85
  console.log('\n6️⃣  TEST: Save Report with Legitimate Zero Values');
  {
    const saveZeroPayload = {
      rx: 950,
      mem: 0,
      clk: 0,
      delay: 0,
      pattern_score: 0,
      overall_score: 12,
      diagnosis: 'Screening variance',
      confidence: 90,
      dementia_prob: 78,
      risk_level: 'Elevated'
    };

    const res = await post('/api/save-report', saveZeroPayload);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    console.log('   -> PASS: Legitimate 0 values stored cleanly.');
  }

  // TEST 7: History Endpoint -> Verify Saved Reports preserve nulls vs zeros
  console.log('\n7️⃣  TEST: User History Endpoint Preserves Real Values');
  {
    const res = await (await fetch(`${BASE_URL}/api/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })).json();
    assert(Array.isArray(res.history), 'History must be array');
    assert(res.history.length >= 2, 'History must contain at least 2 saved tests');
    
    // Most recent is TEST 6 (zero scores)
    const latestZero = res.history[0];
    assert.strictEqual(latestZero.memory_score, 0, 'Legitimate 0 must be preserved in DB');
    assert.strictEqual(latestZero.clock_score, 0, 'Legitimate 0 must be preserved in DB');
    
    // Second most recent is TEST 5 (null scores)
    const latestNull = res.history[1];
    assert.strictEqual(latestNull.memory_score, null, 'Missing score must be NULL in DB');
    assert.strictEqual(latestNull.clock_score, null, 'Missing score must be NULL in DB');
    assert.strictEqual(latestNull.overall_score, null, 'Missing composite must be NULL in DB');
    console.log('   -> PASS: Database historical records accurately preserve 0 vs NULL.');
  }

  // TEST 8: Final Report Generation (Fallback simulation) -> Missing values handled honestly
  console.log('\n8️⃣  TEST: Report Generation Handles Missing Metrics');
  {
    const genPayload = {
      assessmentMode: 'text',
      conversation: [],
      memoryGame: { words: [], selected: [], score: null },
      diagnosis: 'Screening probability unavailable.',
      confidence: 0,
      dementiaProbabilityPct: null,
      riskLevel: 'Unavailable',
      scores: {
        memoryScore: null,
        patternScore: 75,
        clockScore: null
      },
      age: 65,
      language: 'en'
    };

    const res = await post('/api/generate-final-report', genPayload);
    assert.strictEqual(res.status, 200);
    assert(res.body.report, 'Report text must be returned');
    console.log('   -> PASS: Report generation succeeds with honest missing data handling.');
  }

  console.log('\n====================================================');
  console.log('   ALL SCORE INTEGRITY & DATA TESTS PASSED! ✅     ');
  console.log('====================================================');
}

runScoreIntegrityTests().catch(err => {
  console.error('Score integrity test failed:', err);
  process.exit(1);
});
