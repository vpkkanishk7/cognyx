const https = require('https');

const req = https.request({
    hostname: 'api.groq.com',
    path: '/openai/v1/models',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(JSON.parse(data).data.map(m => m.id)));
});
req.on('error', console.error);
req.end();
