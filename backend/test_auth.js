const http = require('http');

function request(path, payload) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: '127.0.0.1',
            port: 3005,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
        });
        req.on('error', reject);
        req.write(JSON.stringify(payload));
        req.end();
    });
}

async function test() {
    try {
        console.log("Signup:");
        let res = await request('/api/signup', { username: 'testuser123', password: 'password123' });
        console.log(res);

        console.log("Login:");
        let res2 = await request('/api/login', { username: 'testuser123', password: 'password123' });
        console.log(res2);
    } catch (e) {
        console.error(e);
    }
}
test();
