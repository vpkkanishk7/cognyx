const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testFastModels() {
  const models = ['openai/gpt-oss-20b', 'qwen/qwen3.6-27b', 'groq/compound-mini'];
  for (const m of models) {
    const t0 = Date.now();
    try {
      const res = await groq.chat.completions.create({
        messages: [{ role: 'user', content: 'Say warm clinical acknowledgement to "நான் அழகா இருக்கேன்" in Tamil. JSON format: {"acknowledgement": "..."}' }],
        model: m,
        response_format: { type: 'json_object' }
      });
      console.log(`[${m}] took ${Date.now() - t0}ms ->`, res.choices[0].message.content);
    } catch (e) {
      console.error(`[${m}] error:`, e.message);
    }
  }
}
testFastModels();
