const fs = require('fs');
const code = fs.readFileSync('script.js', 'utf8');
try { new Function(code); console.log('SYNTAX OK'); } catch(e) { console.error('SYNTAX ERROR:', e.message); }
