/**
 * Test Translation Integrity & Key Parity across EN, TA, and HI
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Starting COGNYX Translation Integrity & Parity Test ---');

// 1. Require i18n module
const i18n = require(path.join(__dirname, '../frontend/i18n.js'));
const { translations, t } = i18n;

assert(translations, 'translations object must exist');
assert(typeof t === 'function', 't() translation function must exist');

// 2. Validate Key Parity
const enKeys = Object.keys(translations.en).sort();
const taKeys = Object.keys(translations.ta).sort();
const hiKeys = Object.keys(translations.hi).sort();

console.log(`Key counts: EN = ${enKeys.length}, TA = ${taKeys.length}, HI = ${hiKeys.length}`);
assert.strictEqual(enKeys.length, taKeys.length, 'EN and TA key counts must match');
assert.strictEqual(enKeys.length, hiKeys.length, 'EN and HI key counts must match');

const missingTa = enKeys.filter(k => !(k in translations.ta));
const missingHi = enKeys.filter(k => !(k in translations.hi));
assert.deepStrictEqual(missingTa, [], `Missing TA keys: ${missingTa.join(', ')}`);
assert.deepStrictEqual(missingHi, [], `Missing HI keys: ${missingHi.join(', ')}`);

console.log('✓ 100% dictionary key parity confirmed across EN, TA, and HI.');

// 3. Scan frontend/script.js for all t("key") calls
const scriptPath = path.join(__dirname, '../frontend/script.js');
const scriptCode = fs.readFileSync(scriptPath, 'utf8');

const tRegex = /\bt\(\s*["']([^"']+)["']/g;
const scriptKeys = new Set();
let match;
while ((match = tRegex.exec(scriptCode)) !== null) {
  scriptKeys.add(match[1]);
}

console.log(`Found ${scriptKeys.size} distinct translation keys called in script.js`);

const unmappedScriptKeys = [];
scriptKeys.forEach(k => {
  const enVal = t(k, 'en');
  // Check if it fell back to humanized fallback without being defined
  if (!(k in translations.en)) {
    // Check if canonical alias
    const aliases = {
      'clock_btn_clear': 'clock_tool_clear',
      'clock_btn_submit': 'clock_btn_finish',
      'reaction_start': 'reaction_btn_start',
    };
    if (!aliases[k] && !translations.en[aliases[k]]) {
      unmappedScriptKeys.push(k);
    }
  }
});

assert.deepStrictEqual(unmappedScriptKeys, [], `Script references undefined keys: ${unmappedScriptKeys.join(', ')}`);
console.log('✓ All script.js translation calls resolve in the dictionary or registered aliases.');

// 4. Verify Canonical Aliases
assert.strictEqual(t('clock_btn_clear', 'en'), translations.en['clock_tool_clear'], 'clock_btn_clear must resolve to clock_tool_clear');
assert.strictEqual(t('clock_btn_submit', 'en'), translations.en['clock_btn_finish'], 'clock_btn_submit must resolve to clock_btn_finish');
assert.strictEqual(t('reaction_start', 'en'), translations.en['reaction_btn_start'], 'reaction_start must resolve to reaction_btn_start');
console.log('✓ Canonical aliases resolve correctly.');

// 5. Verify Safe Fallback prevents raw snake_case exposure
const fallbackOutput = t('completely_unknown_test_key', 'en');
assert.doesNotMatch(fallbackOutput, /_/, 'Fallback output must not contain raw snake_case underscores');
assert.strictEqual(fallbackOutput, 'Completely Unknown Test Key', 'Fallback output must be clean capitalized text');
console.log('✓ Safe fallback prevents raw technical key exposure.');

// 6. Verify non-empty translations for all keys
['en', 'ta', 'hi'].forEach(lang => {
  enKeys.forEach(key => {
    const val = translations[lang][key];
    assert(typeof val === 'string' && val.trim().length > 0, `Empty translation for [${lang}][${key}]`);
  });
});
console.log('✓ No empty translation strings found in EN, TA, or HI.');

console.log('--- All Translation Integrity & Parity Tests PASSED Successfully! ---');
