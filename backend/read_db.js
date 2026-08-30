const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('backend/database.sqlite', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error(err.message);
    }
});

db.serialize(() => {
    db.all("SELECT * FROM Assessments", (err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log(rows);
        }
    });
});

db.close();
