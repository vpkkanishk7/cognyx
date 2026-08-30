const fs = require('fs');
let code = fs.readFileSync('backend/utils/assessmentEngine.js', 'utf8');

const regex2 = /    \/\/ If we advanced to a new concept[\s\S]*?this\.history\.push\(`Assistant: \$\{nextQuestion\}`\);/;

const replacement = `    // Use LLM generated next question if available, else fallback to deterministic
    if (parsed.next_question) {
        nextQuestion = parsed.next_question;
    } else if (this.attemptCount === 0) {
        const transition = this.getTransitionForAnswer(currentConcept, isIdk, !parsed.answered);
        nextQuestion = \`\${transition} \${this.getDeterministicQuestion(nextConcept, false)}\`;
    } else {
        nextQuestion = this.getDeterministicQuestion(nextConcept, true);
    }

    this.questionCount++;
    this.history.push(\`Assistant: \${nextQuestion}\`);`;

if (code.includes('parsed.next_question')) {
    console.log('Already updated logic');
} else {
    code = code.replace(regex2, replacement);
    fs.writeFileSync('backend/utils/assessmentEngine.js', code);
    console.log('Updated nextQuestion logic');
}
