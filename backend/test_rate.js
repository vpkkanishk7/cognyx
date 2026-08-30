const Groq = require("groq-sdk");
require("dotenv").config();

async function test() {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Hello" }],
      model: "qwen/qwen3.6-27b",
      max_tokens: 10
    });
    console.log(chatCompletion.choices[0].message.content);
  } catch(e) {
    console.error(e.message);
  }
}
test();
