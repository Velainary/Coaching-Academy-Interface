// backend/database.js
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "tuition.db");

// If you want to force recreate the DB for testing, set environment var RESET_DB=1
if (process.env.RESET_DB === "1" && fs.existsSync(DB_PATH)) {
  try {
    fs.unlinkSync(DB_PATH);
    console.log("⚠️  Reset: removed existing DB:", DB_PATH);
  } catch (e) {
    console.warn("Could not remove DB file:", e);
  }
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("❌ Failed to open DB:", err);
    process.exit(1);
  }
  console.log("✅ SQLite DB opened at:", DB_PATH);
});

db.serialize(() => {
  // Recommended pragmas
  db.run("PRAGMA foreign_keys = ON");
  db.run("PRAGMA journal_mode = WAL");

  // USERS
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student','parent','teacher')),
      created_at TEXT DEFAULT (datetime('now'))
    )`
  );

  // COURSES (subject + schedule)
  db.run(
    `CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      schedule TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )`
  );

  // INSTRUCTORS
  db.run(
    `CREATE TABLE IF NOT EXISTS instructors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      subject TEXT,
      bio TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )`
  );

  // ATTENDANCE
  db.run(
    `CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      course_id INTEGER,
      date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Present','Absent')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE SET NULL
    )`
  );

  // Indexes for faster joins/queries
  db.run(`CREATE INDEX IF NOT EXISTS idx_attendance_user ON attendance(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_attendance_course ON attendance(course_id)`);

  // Insert sample data only if tables are empty
  db.get("SELECT COUNT(*) AS cnt FROM users", (err, row) => {
    if (!err && row && row.cnt === 0) {
      const stmt = db.prepare(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
      );
      stmt.run("Alice Student", "alice@example.com", "pass123", "student");
      stmt.run("Bob Parent", "bob@example.com", "pass123", "parent");
      stmt.run("Clara Teacher", "clara@example.com", "pass123", "teacher");
      stmt.finalize(() => console.log("✅ Inserted sample users (alice/bob/clara)"));
    }
  });

  db.get("SELECT COUNT(*) AS cnt FROM courses", (err, row) => {
    if (!err && row && row.cnt === 0) {
      const stmt = db.prepare("INSERT INTO courses (subject, schedule) VALUES (?, ?)");
      stmt.run("Mathematics", "Mon-Wed-Fri 5:00-6:30 PM");
      stmt.run("Science", "Tue-Thu 6:00-7:30 PM");
      stmt.finalize(() => console.log("✅ Inserted sample courses (Math/Science)"));
    }
  });

  db.get("SELECT COUNT(*) AS cnt FROM instructors", (err, row) => {
    if (!err && row && row.cnt === 0) {
      const stmt = db.prepare("INSERT INTO instructors (name, subject, bio) VALUES (?, ?, ?)");
      stmt.run("Mr. John Doe", "Mathematics", "10+ years teaching experience");
      stmt.run("Ms. Jane Smith", "Science", "Loves experiments and labs");
      stmt.finalize(() => console.log("✅ Inserted sample instructors (John/Jane)"));
    }
  });
});

// Export the DB connection
module.exports = db;
