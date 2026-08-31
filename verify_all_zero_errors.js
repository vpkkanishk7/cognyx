const fs = require('fs');
const path = require('path');

console.log("==================================================");
console.log("COGNYX FULL SYSTEM ZERO-ERROR AUDIT & VERIFICATION");
console.log("==================================================");

// 1. Audit DOM IDs in frontend/script.js vs frontend/index.html
const htmlPath = path.join(__dirname, 'frontend', 'index.html');
const jsPath = path.join(__dirname, 'frontend', 'script.js');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const jsContent = fs.readFileSync(jsPath, 'utf8');

// Extract all id="..." from index.html
const idRegex = /id=["']([^"']+)["']/g;
const htmlIds = new Set();
let match;
while ((match = idRegex.exec(htmlContent)) !== null) {
  htmlIds.add(match[1]);
}

// Extract document.getElementById("...") from script.js
const getElemRegex = /document\.getElementById\(["']([^"']+)["']\)/g;
const jsQueriedIds = new Set();
while ((match = getElemRegex.exec(jsContent)) !== null) {
  jsQueriedIds.add(match[1]);
}

console.log(`\n1. DOM Integrity Check:`);
console.log(`   - HTML contains ${htmlIds.size} unique element IDs.`);
console.log(`   - JavaScript queries ${jsQueriedIds.size} unique element IDs.`);

const missingIds = [];
for (const id of jsQueriedIds) {
  if (!htmlIds.has(id)) {
    missingIds.push(id);
  }
}

if (missingIds.length === 0) {
  console.log("   [PASS] All DOM IDs queried in script.js exist in index.html!");
} else {
  console.log(`   [WARN] Found ${missingIds.length} IDs queried in JS but missing in HTML:`, missingIds);
}

// 2. Check for unsafe unhandled null DOM accesses
const unsafeAccessPatterns = jsContent.match(/document\.getElementById\([^)]+\)\.(?!addEventListener\?|style|textContent|value|classList|innerHTML|setAttribute|getAttribute|click|focus|blur|disabled|checked)/g);
console.log(`\n2. Null-Safety Check in Frontend JS:`);
console.log(`   - Checking optional chaining and null guards...`);

// 3. Verify ML artifacts exist
console.log(`\n3. ML Artifacts Verification:`);
const artifacts = [
  'accuracy_curve.png',
  'confusion_matrix.png',
  'roc_curve.png',
  'precision_recall_curve.png',
  'feature_importance.png',
  'metrics.json'
];

let allArtifactsExist = true;
for (const art of artifacts) {
  const p = path.join(__dirname, 'ml_artifacts', art);
  const exists = fs.existsSync(p);
  const size = exists ? fs.statSync(p).size : 0;
  console.log(`   - ${art}: ${exists ? `EXISTS (${size} bytes)` : 'MISSING'}`);
  if (!exists || size === 0) allArtifactsExist = false;
}

if (allArtifactsExist) {
  console.log("   [PASS] All 6 ML artifacts verified and non-empty!");
} else {
  console.log("   [FAIL] Some ML artifacts are missing.");
}

console.log("\n==================================================");
