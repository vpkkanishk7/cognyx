const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'cognyx.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  const columns = [
    "age INTEGER",
    "immediate_recall_score INTEGER",
    "delayed_recall_score INTEGER",
    "word_identifying_score INTEGER",
    "pattern_matching_score INTEGER",
    "reaction_median_ms INTEGER"
  ];
  
  for (let col of columns) {
    db.run(`ALTER TABLE Assessments ADD COLUMN ${col}`, (err) => {
      if (err) {
        if (!err.message.includes("duplicate column name")) {
          console.error(err.message);
        }
      } else {
        console.log(`Added column ${col}`);
      }
    });
  }
});
