/**
 * COGNYX — Green-Target Response-Time Evaluation Engine
 * Single authoritative source of truth for 3-trial median response-time analysis.
 * 
 * NOTE: References are project-defined COGNYX prototype values, not clinically validated normative data.
 */

const COGNYX_PROTOTYPE_AGE_TABLE = [
  { minAge: 18, maxAge: 29, ageGroup: "18–29", medianMs: 800, expectedMinMs: 600, expectedMaxMs: 1000 },
  { minAge: 30, maxAge: 39, ageGroup: "30–39", medianMs: 900, expectedMinMs: 675, expectedMaxMs: 1125 },
  { minAge: 40, maxAge: 49, ageGroup: "40–49", medianMs: 1000, expectedMinMs: 750, expectedMaxMs: 1250 },
  { minAge: 50, maxAge: 59, ageGroup: "50–59", medianMs: 1200, expectedMinMs: 900, expectedMaxMs: 1500 },
  { minAge: 60, maxAge: 69, ageGroup: "60–69", medianMs: 1500, expectedMinMs: 1125, expectedMaxMs: 1875 },
  { minAge: 70, maxAge: 79, ageGroup: "70–79", medianMs: 1700, expectedMinMs: 1275, expectedMaxMs: 2125 },
  { minAge: 80, maxAge: 150, ageGroup: "80+", medianMs: 2000, expectedMinMs: 1500, expectedMaxMs: 2500 }
];

const SOURCE_LABEL = "COGNYX Prototype Reference (Project-defined, non-clinical)";

/**
 * Calculates the median of an array of numbers or returns the single numeric value.
 */
function calculateMedian(values) {
  if (!values) return null;
  if (typeof values === "number") return Math.round(values);
  if (!Array.isArray(values) || values.length === 0) return null;

  const valid = values
    .map(v => parseFloat(v))
    .filter(v => !isNaN(v) && v > 0)
    .sort((a, b) => a - b);

  if (valid.length === 0) return null;
  const mid = Math.floor(valid.length / 2);
  if (valid.length % 2 !== 0) {
    return Math.round(valid[mid]);
  } else {
    return Math.round((valid[mid - 1] + valid[mid]) / 2);
  }
}

/**
 * Evaluates 3-trial Green-Target response time against the COGNYX Prototype Age Table.
 * @param {number|string} age - The user's age in years
 * @param {Array<number>|number} trialsOrMedian - Array of 3 trial latencies (ms) or single median (ms)
 * @returns {Object} Authoritative greenTargetResponse object
 */
function evaluateGreenTargetResponse(age, trialsOrMedian) {
  const numAge = parseInt(age, 10);
  const safeAge = isNaN(numAge) || numAge <= 0 ? 65 : numAge;

  let trials = [];
  let medianMs = null;

  if (Array.isArray(trialsOrMedian)) {
    trials = trialsOrMedian.map(v => Math.round(parseFloat(v))).filter(v => !isNaN(v) && v > 0);
    medianMs = calculateMedian(trials);
  } else if (typeof trialsOrMedian === "number" || typeof trialsOrMedian === "string") {
    const val = Math.round(parseFloat(trialsOrMedian));
    if (!isNaN(val) && val > 0) {
      medianMs = val;
      trials = [val, val, val];
    }
  }

  // Find matched age category from table
  let matchedGroup = COGNYX_PROTOTYPE_AGE_TABLE.find(g => safeAge >= g.minAge && safeAge <= g.maxAge);
  if (!matchedGroup) {
    if (safeAge < 18) {
      matchedGroup = COGNYX_PROTOTYPE_AGE_TABLE[0]; // 18-29 baseline
    } else {
      matchedGroup = COGNYX_PROTOTYPE_AGE_TABLE[COGNYX_PROTOTYPE_AGE_TABLE.length - 1]; // 80+
    }
  }

  if (medianMs === null || medianMs <= 0) {
    return {
      trials: [],
      medianMs: null,
      age: safeAge,
      ageGroup: matchedGroup.ageGroup,
      referenceMedianMs: matchedGroup.medianMs,
      expectedMinMs: matchedGroup.expectedMinMs,
      expectedMaxMs: matchedGroup.expectedMaxMs,
      classification: "Insufficient reaction-time trial data",
      riskLevel: "Unknown",
      source: SOURCE_LABEL
    };
  }

  // Classification rules:
  // Below expected range = Faster than expected
  // Inside expected range = Within COGNYX expected range
  // Above expected range but <= 1.25 × expectedMaxMs = Slower than expected
  // Above 1.25 × expectedMaxMs = Markedly slower than expected
  let classification = "";
  let riskLevel = "Low";

  if (medianMs < matchedGroup.expectedMinMs) {
    classification = "Faster than expected";
    riskLevel = "Low";
  } else if (medianMs <= matchedGroup.expectedMaxMs) {
    classification = "Within COGNYX expected range";
    riskLevel = "Low";
  } else if (medianMs <= Math.round(matchedGroup.expectedMaxMs * 1.25)) {
    classification = "Slower than expected";
    riskLevel = "Moderate";
  } else {
    classification = "Markedly slower than expected";
    riskLevel = "Elevated";
  }

  return {
    trials: trials,
    medianMs: medianMs,
    age: safeAge,
    ageGroup: matchedGroup.ageGroup,
    referenceMedianMs: matchedGroup.medianMs,
    expectedMinMs: matchedGroup.expectedMinMs,
    expectedMaxMs: matchedGroup.expectedMaxMs,
    classification: classification,
    riskLevel: riskLevel,
    source: SOURCE_LABEL
  };
}

// Backward-compatible alias
function evaluateResponseTime(age, measuredTimeMs) {
  const gtr = evaluateGreenTargetResponse(age, measuredTimeMs);
  return {
    age: gtr.age,
    ageGroup: gtr.ageGroup,
    protocol: "Visual Green-Target Response (3-Trial Median)",
    rawReactionTimeMs: gtr.medianMs,
    referenceSource: gtr.source,
    interpretation: gtr.classification,
    percentile: gtr.classification === "Faster than expected" ? 90 : (gtr.classification === "Within COGNYX expected range" ? 75 : (gtr.classification === "Slower than expected" ? 40 : 15)),
    zScore: null,
    normativeReferenceAvailable: true,
    greenTargetResponse: gtr
  };
}

module.exports = {
  COGNYX_PROTOTYPE_AGE_TABLE,
  evaluateGreenTargetResponse,
  evaluateResponseTime
};
