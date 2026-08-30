const { Groq } = require("groq-sdk");
require("dotenv").config();

const apiKey = process.env.GROQ_API_KEY;
let groq = null;
if (apiKey) {
  groq = new Groq({ apiKey });
}

async function generateCompletionGroq(prompt, systemPrompt = null, jsonMode = false) {
  if (!groq) throw new Error("GROQ_API_KEY not configured");
  
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("LLM_TIMEOUT")), 15000)
    );

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const config = {
      messages,
      model: process.env.GROQ_MODEL || "mixtral-8x7b-32768",
    };
    if (jsonMode) config.response_format = { type: "json_object" };

    const apiPromise = groq.chat.completions.create(config);
    const response = await Promise.race([apiPromise, timeoutPromise]);
    
    return response.choices[0].message.content;
  } catch (error) {
    throw error;
  }
}

module.exports = { generateCompletionGroq };
