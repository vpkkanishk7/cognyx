const { AssessmentEngine, QUESTIONS } = require('./backend/utils/assessmentEngine');
const assert = require('assert');

// Mock Groq SDK
class MockGroq {
  constructor() {
    this.chat = {
      completions: {
        create: async (req) => {
          const content = req.messages[0].content;
          const userMessage = content.match(/User's answer: "(.*?)"/)[1];
          let needsClarification = false;
          let answered = true;

          if (userMessage === "vague response") {
            needsClarification = true;
            answered = false;
          }

          return {
            choices: [{
              message: {
                content: JSON.stringify({
                  answered: answered,
                  extracted_value: userMessage === "45" ? "45" : "test value",
                  acknowledgement: "Got it, thanks.",
                  needs_clarification: needsClarification,
                  clarification_wording: needsClarification ? "Can you clarify?" : null,
                  next_question_wording: "This is a dynamically generated question."
                })
              }
            }]
          };
        }
      }
    };
  }
}

async function runTest() {
  const engine = new AssessmentEngine("testuser");
  const groq = new MockGroq();
  
  let result;
  
  // 1. Initial Start -> Should give Q1 default text
  result = await engine.processUserMessage(groq, "[START]", 0, "text");
  console.log("Turn 0 (START):", result);
  assert.strictEqual(engine.currentQuestionIndex, 0);
  assert.strictEqual(result.type, "question");
  assert.strictEqual(result.question, QUESTIONS[0].defaultText);
  
  // Q1
  result = await engine.processUserMessage(groq, "good", 6000, "text"); // 6s -> EXPECTED
  console.log("Turn 1 (good):", result);
  assert.strictEqual(result.type, "question");
  assert.strictEqual(engine.currentQuestionIndex, 1);
  assert.strictEqual(engine.timingData[0].timing_classification, "EXPECTED");

  // Q2 (Age)
  result = await engine.processUserMessage(groq, "45", 2500, "text"); // 2.5s -> FAST
  console.log("Turn 2 (45):", result);
  assert.strictEqual(result.type, "question");
  assert.strictEqual(engine.currentQuestionIndex, 2);
  assert.strictEqual(engine.ageBand, "40-49");
  assert.strictEqual(engine.timingData[1].timing_classification, "FAST");

  // Q3 (Vague response, triggers clarification)
  result = await engine.processUserMessage(groq, "vague response", 35000, "text"); // 35s -> VERY_SLOW
  console.log("Turn 3 (vague response - clarification):", result);
  assert.strictEqual(result.type, "question");
  assert.strictEqual(engine.currentQuestionIndex, 2); // DID NOT ADVANCE
  assert.strictEqual(engine.clarificationAttempted, true);
  assert.strictEqual(result.question, "Can you clarify?");
  assert.strictEqual(engine.timingData[2].timing_classification, "VERY_SLOW");

  // Q3 (Second vague response, MUST advance)
  result = await engine.processUserMessage(groq, "vague response", 10000, "text");
  console.log("Turn 4 (vague response - force advance):", result);
  assert.strictEqual(result.type, "question");
  assert.strictEqual(engine.currentQuestionIndex, 3);
  assert.strictEqual(engine.clarificationAttempted, false);

  // Remaining questions
  const answers = ["I was a bank manager", "my wife", "Idli", "I use my phone calendar"];
  for (let i = 0; i < answers.length; i++) {
    result = await engine.processUserMessage(groq, answers[i], 8000, "text");
    console.log(`Turn ${i+5} (${answers[i]}):`, result);
    
    if (i < 3) {
      assert.strictEqual(result.type, "question");
      assert.strictEqual(engine.currentQuestionIndex, 4 + i);
    } else {
      assert.strictEqual(result.type, "complete");
      assert.strictEqual(result.conversation_complete, true);
      assert.strictEqual(engine.conversationComplete, true);
    }
  }

  // Attempt to submit after complete
  result = await engine.processUserMessage(groq, "hello again", 5000, "text");
  console.log("Turn 9 (AFTER COMPLETE):", result);
  assert.strictEqual(result.type, "complete");

  // Verify constraints
  assert.strictEqual(QUESTIONS.length, 7);
  assert.strictEqual(engine.timingData.length, 8); // 8 answered turns because of 1 clarification
  assert.strictEqual(engine.timingData[0].question_category, "SIMPLE_DAILY");
  
  console.log("All tests passed! Exactly 7 questions, 1 clarification max, timing classification working.");
}

runTest().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
