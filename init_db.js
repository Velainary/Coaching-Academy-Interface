const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./school_app.sqlite");

// Create users table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('parent','student'))
  )`);

  // Insert a test parent
  db.run(
    `INSERT OR IGNORE INTO users (username, password, role) VALUES ('parent1', '$2a$10$123456789012345678901uXcdFsaTestHash', 'parent')`
  );

  // Insert a test student
  db.run(
    `INSERT OR IGNORE INTO users (username, password, role) VALUES ('student1', '$2a$10$123456789012345678901uXcdFsaTestHash', 'student')`
  );
});

db.close();
