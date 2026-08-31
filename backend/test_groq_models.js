const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function listModels() {
  try {
    const list = await groq.models.list();
    console.log("Available models on Groq:", list.data.map(m => m.id));
  } catch (e) {
    console.error("List models error:", e.message);
  }
}
listModels();
