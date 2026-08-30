const { GoogleGenAI, Type } = require("@google/genai");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;
let ai = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

async function generateCompletionGemini(prompt, systemPrompt = null, jsonMode = false) {
  if (!ai) throw new Error("GEMINI_API_KEY not configured");

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("LLM_TIMEOUT")), 15000)
    );

    const config = {
      maxOutputTokens: 2000,
    };
    
    if (systemPrompt) config.systemInstruction = systemPrompt;
    if (jsonMode) config.responseMimeType = "application/json";

    const apiPromise = ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt,
      config: config
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);
    return response.text;
  } catch (error) {
    throw error;
  }
}

module.exports = { ai, generateCompletionGemini };
