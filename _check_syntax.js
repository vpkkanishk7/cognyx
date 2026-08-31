const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function checkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') checkDir(fullPath);
    } else if (fullPath.endsWith('.js')) {
      try {
        cp.execSync(`node --check "${fullPath}"`);
      } catch (e) {
        console.error(`Syntax Error in JS file: ${fullPath}`);
        console.error(e.stderr ? e.stderr.toString() : e.message);
      }
    } else if (fullPath.endsWith('.py')) {
      try {
        cp.execSync(`python -m py_compile "${fullPath}"`);
      } catch (e) {
        console.error(`Syntax Error in Python file: ${fullPath}`);
        console.error(e.stderr ? e.stderr.toString() : e.message);
      }
    }
  }
}

console.log('Starting syntax check...');
checkDir('.');
console.log('Syntax check complete.');
