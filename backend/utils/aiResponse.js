/**
 * AI Response Centralized Utility (Updated per Corrections)
 */

const safeParse = (jsonString, defaultFallback) => {
  try {
    const raw = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(raw);
  } catch (err) {
    console.error("AI JSON Parse Error:", err.message);
    return defaultFallback;
  }
};

const validateNumeric = (val, min, max) => {
  if (val === null || val === undefined) return null; // Missing/Unavailable
  if (typeof val !== 'number' || !Number.isFinite(val) || Number.isNaN(val)) return null;
  if (val < min || val > max) return null; // Reject out of range instead of silent clamp
  return val;
};

// Validates structured biomarkers and allows explicitly marking unavailable fields as null
const validateNumericBiomarkers = (data, schema, ranges = {}) => {
  const validated = {};
  if (!data || typeof data !== 'object') {
    // If entirely malformed, everything is null
    for (const key of Object.keys(schema)) {
      validated[key] = schema[key] === 'number' ? null : schema[key];
    }
    return validated;
  }

  for (const key of Object.keys(schema)) {
    if (schema[key] === 'number') {
      const min = ranges[key]?.min ?? 0;
      const max = ranges[key]?.max ?? 100;
      validated[key] = validateNumeric(data[key], min, max);
    } else {
      validated[key] = data[key] !== undefined ? data[key] : schema[key];
    }
  }
  return validated;
};

module.exports = {
  safeParse,
  validateNumericBiomarkers,
  validateNumeric
};
