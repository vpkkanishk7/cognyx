const fs = require('fs');
let code = fs.readFileSync('routes/assessment.js', 'utf8');

code = code.replace(/db\.all\(SELECT \* FROM Assessments WHERE user_id \= \? ORDER BY created_at DESC, \[user\.id\],/g, 
  "db.all(`SELECT * FROM Assessments WHERE user_id = ? ORDER BY created_at DESC`, [user.id],");

fs.writeFileSync('routes/assessment.js', code, 'utf8');
console.log("Fixed assessment.js SELECT");
