const http = require('http');

const runTests = async () => {
  console.log("=== Phase 3 Verification ===");
  
  // Assuming server runs on 3005 and no real auth is needed if we mock or hit the endpoint
  // Actually, we require JWT authentication for /api/chat. So I need to mock the test against the AssessmentEngine directly.
  
  const { AssessmentEngine, CONCEPTS } = require('./utils/assessmentEngine');
  
  // Mock Groq client
  const mockGroq = {
    chat: {
      completions: {
        create: async (params) => {
          const prompt = params.messages[0].content;
          
          if (prompt.includes("Extract any of these concepts")) {
            // Intent extraction mock
            if (prompt.includes("I am 70 years old")) {
              return { choices: [{ message: { content: '{"extracted_concepts": [{"conceptId": "IDENTITY_AGE", "answer": "70"}], "user_intent": "answered"}' } }] };
            }
            if (prompt.includes("John Doe")) {
               return { choices: [{ message: { content: '{"extracted_concepts": [{"conceptId": "IDENTITY_NAME", "answer": "John Doe"}], "user_intent": "answered"}' } }] };
            }
            return { choices: [{ message: { content: '{"extracted_concepts": [], "user_intent": "answered"}' } }] };
          } else {
            // Generation mock
            if (prompt.includes("[IDENTITY_NAME]")) return { choices: [{ message: { content: "What is your full name?" } }] };
            if (prompt.includes("[IDENTITY_AGE]")) return { choices: [{ message: { content: "How old are you?" } }] };
            return { choices: [{ message: { content: "Mocked next question." } }] };
          }
        }
      }
    }
  };

  const engine = new AssessmentEngine("testuser");
  
  // 1. Initial greeting
  // Should pick IDENTITY_AGE first since age is unknown.
  const q1 = await engine.processUserMessage(mockGroq, "Hello");
  console.log("Q1:", q1);
  if (q1 === "How old are you?") console.log("[PASS] Prioritizes age correctly.");
  else console.error("[FAIL] Did not ask age first.");

  // 2. Answer age, observe age adaptation
  const q2 = await engine.processUserMessage(mockGroq, "I am 70 years old");
  console.log("Q2:", q2);
  if (engine.age === 70 && engine.getLifeStage() === '66-75') {
    console.log("[PASS] Age extracted and life stage mapped (66-75).");
  } else {
    console.error("[FAIL] Age not updated.");
  }

  // 3. Duplicate prevention check
  const hasAgeAgain = engine.selectNextConcept() === 'IDENTITY_AGE';
  if (!hasAgeAgain) console.log("[PASS] Duplicate prevention (IDENTITY_AGE not selected again).");
  else console.error("[FAIL] Duplicate prevention failed.");

  console.log("Done.");
};

runTests();
