const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to the SQLite database.');

    const addColumn = (colName, colType) => {
      return new Promise((resolve) => {
        db.run(`ALTER TABLE Assessments ADD COLUMN ${colName} ${colType}`, (err) => {
          if (err && err.message.includes("duplicate column name")) {
            console.log(`Column ${colName} already exists.`);
            resolve(true);
          } else if (err) {
            console.error(`Error adding ${colName}:`, err.message);
            resolve(false);
          } else {
            console.log(`Added column ${colName}.`);
            resolve(true);
          }
        });
      });
    };

    (async () => {
      await addColumn('age', 'INTEGER');
      await addColumn('immediate_recall_score', 'INTEGER');
      await addColumn('delayed_recall_score', 'INTEGER');
      await addColumn('word_identifying_score', 'INTEGER');
      await addColumn('pattern_matching_score', 'INTEGER');
      await addColumn('reaction_median_ms', 'INTEGER');
      console.log('Migration complete.');
      db.close();
    })();
  }
});
