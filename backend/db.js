const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Vercel serverless: only /tmp is writable. Use it in production.
// Locally: use the backend directory as usual.
const IS_VERCEL = !!process.env.VERCEL;
const dbPath = IS_VERCEL
  ? '/tmp/cognyx_database.sqlite'
  : path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password_hash TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Assessments table
    db.run(`
      CREATE TABLE IF NOT EXISTS Assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        rx_time INTEGER,
        memory_score INTEGER,
        clock_score INTEGER,
        delay_time INTEGER,
        pattern_score INTEGER,
        overall_score INTEGER,
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
    `, () => {
      // Safe migrations for existing DBs
      db.run(`ALTER TABLE Assessments ADD COLUMN pattern_score INTEGER`, () => {});
      db.run(`ALTER TABLE Assessments ADD COLUMN overall_score INTEGER`, () => {});
    });
  }
});

module.exports = db;
