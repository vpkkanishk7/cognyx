const { generateCompletionGemini } = require("./geminiClient");
const { generateCompletionGroq } = require("./groqClient");

async function generateCompletionWithFailover(prompt, systemPrompt = null, jsonMode = false) {
  // Primary: Gemini
  try {
    const result = await generateCompletionGemini(prompt, systemPrompt, jsonMode);
    console.log("[LLM] Gemini success");
    return result;
  } catch (err) {
    console.error(`[LLM] Gemini failed: ${err.message}`);
    console.log("[LLM] Falling back to Groq");
  }

  // Fallback: Groq
  try {
    const result = await generateCompletionGroq(prompt, systemPrompt, jsonMode);
    console.log("[LLM] Groq success");
    return result;
  } catch (err) {
    console.error(`[LLM] Groq failed: ${err.message}`);
    console.log("[LLM] Both providers failed");
    throw new Error("ALL_PROVIDERS_FAILED");
  }
}

module.exports = { generateCompletionWithFailover };
