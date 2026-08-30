const { GoogleGenerativeAI } = require("@google/generativeai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
model.generateContent("hello").then(r => console.log(r.response.text())).catch(e => console.error(e.message));
