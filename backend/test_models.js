const Groq = require('groq-sdk');
const fs = require('fs');
require('dotenv').config();

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function listModels() {
    try {
        const response = await client.models.list();
        console.log(response.data.map(m => m.id).join('\n'));
    } catch (e) {
        console.error(e);
    }
}
listModels();
