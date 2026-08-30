function robustJsonParse(str) {
    try {
        return JSON.parse(str);
    } catch(e) {}
    
    // strip markdown
    str = str.replace(/```json/gi, '').replace(/```/g, '').trim();
    // strip think
    str = str.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    
    const start = str.indexOf('{');
    const end = str.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
        try {
            return JSON.parse(str.substring(start, end + 1));
        } catch(e) {
            console.error("Substring json parse failed on:", str.substring(start, end + 1));
            return null;
        }
    }
    return null;
}

import fs from 'fs';
let content = fs.readFileSync('utils/assessmentEngine.js', 'utf8');

content = content.replace(/let contentStr = "";\n    let contentStr2 = "";\n    try {\n      const extResult/g, 'try {\n      const extResult');
content = content.replace(/let parsed = null;\n      try {[\s\S]*?\} catch\(e\) {[\s\S]*?\}/g, 
  `let parsed = robustJsonParse(contentStr);
      if(!parsed) { console.error("FAILED JSON PARSE CONTENT WAS:", contentStr); throw new Error("JSON Parse failed"); }`
)

content = content.replace(/let parsed2 = null;\n      try {[\s\S]*?\} catch\(e\) {[\s\S]*?\}/g, 
  `const parsed2 = robustJsonParse(contentStr2);
      if(!parsed2) { console.error("FAILED JSON PARSE 2 CONTENT WAS:", contentStr2); throw new Error("JSON Parse 2 failed"); }`
)

// Add robustJsonParse at top
content = `
function robustJsonParse(str) {
    try { return JSON.parse(str); } catch(e) {}
    str = str.replace(/${'`'}${'`'}${'`'}json/gi, '').replace(/${'`'}${'`'}${'`'}/g, '').trim();
    str = str.replace(/<think>[\\s\\S]*?<\\/think>/gi, '').trim();
    const start = str.indexOf('{');
    const end = str.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
        try { return JSON.parse(str.substring(start, end + 1)); } catch(e) { return null; }
    }
    return null;
}
` + content;

fs.writeFileSync('utils/assessmentEngine.js', content, 'utf8');
console.log("Fixed!");
