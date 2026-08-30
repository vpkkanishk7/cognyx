const fs = require('fs');
let code = fs.readFileSync('backend/utils/assessmentEngine.js', 'utf8');

const regex = /const systemInstruction =/;
const declareStr = `
    let nextConceptForPrompt = CONCEPT_KEYS[this.currentConceptIndex + 1] || 'COMPLETE';
    const systemInstruction =`;

if (code.includes('nextConceptForPrompt')) {
   console.log('Already declared');
} else {
   code = code.replace(regex, declareStr);
   code = code.replace(/\$\{nextConcept \|\| "COMPLETE"\}/g, "${nextConceptForPrompt}");
   fs.writeFileSync('backend/utils/assessmentEngine.js', code);
   console.log('Fixed nextConceptForPrompt');
}
