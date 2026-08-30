const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

code = code.replace(
  /if\(document\.getElementById\("ml-loading"\)\) document\.getElementById\("ml-loading"\)\.innerHTML = "<span style='color:var\(--danger\)'>ML Analysis Unavailable\.<\/span>";/,
  `if(document.getElementById("ml-loading")) document.getElementById("ml-loading").classList.add("hidden");
      if(document.getElementById("ml-status")) document.getElementById("ml-status").textContent = "Risk analysis unavailable for this session.";
      if(document.getElementById("ml-status")) document.getElementById("ml-status").style.color = "var(--text)";
      if(document.getElementById("ml-confidence")) document.getElementById("ml-confidence").textContent = "--";
      if(document.getElementById("ml-diagnosis-container")) {
         document.getElementById("ml-diagnosis-container").style.background = "rgba(100, 116, 139, 0.1)";
         document.getElementById("ml-diagnosis-container").style.borderColor = "#cbd5e1";
      }`
);

fs.writeFileSync('script.js', code);
console.log("Updated script.js ML error handling");
