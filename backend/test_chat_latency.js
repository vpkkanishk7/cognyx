const http = require('http');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_cognyx_key_12345!';

async function testChatLatency() {
  const token = jwt.sign({ userId: 1, username: 'speed_tester' }, JWT_SECRET, { expiresIn: '1h' });
  console.log("Generated valid token, testing chat message latency...");

  // Send "[START]" in Tamil
  await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3005,
      path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log("Start Response:", JSON.parse(d));
        resolve();
      });
    });
    req.write(JSON.stringify({ message: '[START]', language: 'ta' }));
    req.end();
  });

  // Send "நான் அழகா இருக்கேன்"
  const t0 = Date.now();
  await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3005,
      path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const elapsed = Date.now() - t0;
        console.log(`Chat response received in ${elapsed}ms ->`, JSON.parse(d));
        resolve();
      });
    });
    req.write(JSON.stringify({ message: 'நான் அழகா இருக்கேன்', responseTimeMs: 1200, inputMethod: 'text', language: 'ta' }));
    req.end();
  });
}

testChatLatency();
