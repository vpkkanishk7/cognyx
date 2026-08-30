const { AssessmentEngine } = require('./utils/assessmentEngine');
const Groq = require('groq-sdk');
require('dotenv').config({ path: '../.env' });

async function run() {
  const engine = new AssessmentEngine("testuser");
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  console.log("Q1:");
  let q1 = await engine.processUserMessage(groq, "Hello");
  console.log(q1);

  console.log("Q2:");
  let q2 = await engine.processUserMessage(groq, "I am 45 years old.");
  console.log(q2);
  
  console.log("Q3:");
  let q3 = await engine.processUserMessage(groq, "I am a software engineer.");
  console.log(q3);
  
  console.log("Q4:");
  let q4 = await engine.processUserMessage(groq, "Yesterday I went for a walk.");
  console.log(q4);
}

run();
