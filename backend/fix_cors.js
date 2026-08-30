const fs = require('fs');
let js = fs.readFileSync('server.js', 'utf8');

js = js.replace(/app\.use\(cors\(\{ origin: \[.*\] \}\)\);/, "app.use(cors({ origin: [process.env.FRONTEND_URL || 'http://127.0.0.1:3005', 'http://localhost:3005', 'http://localhost:5500', 'http://127.0.0.1:5500', 'null'] }));");

fs.writeFileSync('server.js', js, 'utf8');
console.log("Updated CORS properly");
