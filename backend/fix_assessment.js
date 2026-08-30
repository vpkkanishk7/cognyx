const fs = require('fs');
let code = fs.readFileSync('routes/assessment.js', 'utf8');

code = code.replace(/INSERT INTO Assessments \([\s\S]*?\) VALUES \([\s\S]*?\)/, function(match) {
  return '`' + match + '`';
});

fs.writeFileSync('routes/assessment.js', code, 'utf8');
console.log("Fixed assessment.js");
