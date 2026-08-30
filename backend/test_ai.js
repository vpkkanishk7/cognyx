const { validateNumericBiomarkers, validateNumeric, safeParse } = require('./utils/aiResponse');

console.log("=== AI Validation Tests ===");

let passed = 0;
const assert = (name, cond) => {
  if (cond) { console.log('[PASS] ' + name); passed++; }
  else console.error('[FAIL] ' + name);
}

// 1. Valid JSON
const res1 = safeParse('{"score": 5}', null);
assert("Valid JSON", res1.score === 5);

// 2. Markdown Wrapped JSON
const res2 = safeParse('\\\json\n{"score": 8}\n\\\', null);
assert("Markdown Wrapped JSON", res2.score === 8);

// 3. Malformed JSON
const res3 = safeParse('{score: 8, }', { score: 'fallback' });
assert("Malformed JSON", res3.score === 'fallback');

// 4. Numeric safety (NaN, Infinity, undefined, negative)
assert("validateNumeric: null", validateNumeric(null, 0, 100) === null);
assert("validateNumeric: undefined", validateNumeric(undefined, 0, 100) === null);
assert("validateNumeric: NaN", validateNumeric(NaN, 0, 100) === null);
assert("validateNumeric: Infinity", validateNumeric(Infinity, 0, 100) === null);
assert("validateNumeric: negative", validateNumeric(-10, 0, 100) === null);
assert("validateNumeric: > max", validateNumeric(150, 0, 100) === null);
assert("validateNumeric: valid", validateNumeric(50, 0, 100) === 50);

// 5. Biomarkers (Modality Integrity)
const schema = { OCULOMOTOR: 'number', FACIAL_AFFECT: 'number' };
const raw = { OCULOMOTOR: 80, FACIAL_AFFECT: 150 }; // 150 should be nullified
const validated = validateNumericBiomarkers(raw, schema);
assert("validateNumericBiomarkers: Modality integrity", validated.OCULOMOTOR === 80 && validated.FACIAL_AFFECT === null);

// 6. Missing Fields
const rawMissing = { OCULOMOTOR: 40 };
const valMissing = validateNumericBiomarkers(rawMissing, schema);
assert("validateNumericBiomarkers: Missing fields", valMissing.OCULOMOTOR === 40 && valMissing.FACIAL_AFFECT === null);

console.log("Done.");
