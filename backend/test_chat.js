const http = require('http');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, username: 'testuser' }, 'super_secret_cognyx_key_12345!', { expiresIn: '1h' });

const options = {
  hostname: '127.0.0.1',
  port: 3005,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
};

const resetOptions = {
  hostname: '127.0.0.1',
  port: 3005,
  path: '/api/chat/reset',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
};

async function sendChat(message) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', e => reject(e));
    req.write(JSON.stringify({ message }));
    req.end();
  });
}

async function resetChat() {
  return new Promise((resolve, reject) => {
    const req = http.request(resetOptions, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', e => reject(e));
    req.end();
  });
}

async function test() {
  await resetChat();
  console.log("---- RESET ----");
  
  const messages = [
    "okay", 
    "78", 
    "Nagercoil", 
    "Monday", 
    "Father", 
    "don't know",
    "I'm retired. I eat, sleep and repeat.",
    "don't know",
    "don't know",
    "don't know",
    "don't know",
    "fine",
    "fine",
    "fine",
    "okay",
    "okay",
    "okay",
    "done"
  ];
  
  for (let m of messages) {
     console.log(`\nUser: ${m}`);
     const res = await sendChat(m);
     console.log(`Assistant: ${res.reply}`);
     console.log(`(Concept: ${res.concept}, Complete: ${res.conversation_complete})`);
     if (res.conversation_complete) break;
  }
}

test();
