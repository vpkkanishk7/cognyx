const { AssessmentEngine, CONCEPTS } = require('./utils/assessmentEngine');
const Groq = require('groq-sdk');
require('dotenv').config({ path: '../.env' });

async function run() {
  const engine = new AssessmentEngine("kan");
  // Mock groq to just return deterministic answers to see state machine
  const mockGroq = {
    chat: {
      completions: {
        create: async (params) => {
          // If extraction prompt
          if (params.messages[0].content.includes("Analyze the user's response")) {
            if (params.messages[0].content.includes("45")) {
              return { choices: [{ message: { content: '{"extracted_concepts": [{"conceptId": "IDENTITY_AGE", "answer": "45"}], "user_intent": "answered"}' } }] };
            }
            return { choices: [{ message: { content: '{"extracted_concepts": [], "user_intent": "answered"}' } }] };
          }
          // If generation prompt
          const concept = params.messages[params.messages.length - 1].content.match(/\[(.*?)\]/);
          return { choices: [{ message: { content: `(Generated question for ${concept ? concept[1] : 'unknown'})` } }] };
        }
      }
    }
  };
  
  console.log(await engine.processUserMessage(mockGroq, "fine"));
  console.log("age is", engine.age, "asked", Array.from(engine.askedQuestionConcepts));
  console.log(await engine.processUserMessage(mockGroq, "okay"));
  console.log("age is", engine.age, "asked", Array.from(engine.askedQuestionConcepts));
}
run();
