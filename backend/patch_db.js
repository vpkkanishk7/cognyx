const fs = require('fs');
let content = fs.readFileSync('db.js', 'utf8');

const oldTable = `    // Create Assessments table
    db.run(\`
      CREATE TABLE IF NOT EXISTS Assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        rx_time INTEGER,
        memory_score INTEGER,
        clock_score INTEGER,
        delay_time INTEGER,
        diagnosis TEXT,
        confidence REAL,
        video_oculomotor INTEGER,
        video_affect INTEGER,
        video_kinematic INTEGER,
        video_linguistic INTEGER,
        video_summary TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users (id)
      )
    \`);`;

const newTable = `    // Create Assessments table
    db.run(\`
      CREATE TABLE IF NOT EXISTS Assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        age INTEGER,
        immediate_recall_score INTEGER,
        delayed_recall_score INTEGER,
        word_identifying_score INTEGER,
        pattern_matching_score INTEGER,
        reaction_median_ms INTEGER,
        clock_score INTEGER,
        video_oculomotor INTEGER,
        diagnosis TEXT,
        confidence REAL,
        video_summary TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users (id)
      )
    \`);`;

content = content.replace(oldTable, newTable);
fs.writeFileSync('db.js', content, 'utf8');
console.log("Updated db.js schema");
