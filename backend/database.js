// backend/database.js
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "tuition.db");

// If you want to force recreate the DB during testing, delete backend/tuition.db manually.
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("DB open error:", err);
    return;
  }
  console.log("✅ Connected to SQLite DB:", DB_PATH);
});

db.serialize(() => {
  // Users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('student','parent','teacher')) NOT NULL DEFAULT 'student'
    )
  `);

  // Courses (reverted to subject + schedule)
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      schedule TEXT
    )
  `);

  // Instructors (reverted)
  db.run(`
    CREATE TABLE IF NOT EXISTS instructors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      subject TEXT,
      bio TEXT
    )
  `);

  // Attendance (supports course selection)
  db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      course_id INTEGER,
      date TEXT NOT NULL,
      status TEXT CHECK(status IN ('Present','Absent')) NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(course_id) REFERENCES courses(id)
    )
  `);

  // Add small sample data only if tables are empty
  db.get("SELECT COUNT(*) AS cnt FROM users", (err, row) => {
    if (!err && row && row.cnt === 0) {
      const stmt = db.prepare("INSERT INTO users (name,email,password,role) VALUES (?, ?, ?, ?)");
      stmt.run("Alice Student", "alice@example.com", "pass123", "student");
      stmt.run("Bob Parent", "bob@example.com", "pass123", "parent");
      stmt.run("Clara Teacher", "clara@example.com", "pass123", "teacher");
      stmt.finalize();
      console.log("✅ Inserted sample users");
    }
  });

  db.get("SELECT COUNT(*) AS cnt FROM courses", (err, row) => {
    if (!err && row && row.cnt === 0) {
      const stmt = db.prepare("INSERT INTO courses (subject, schedule) VALUES (?, ?)");
      stmt.run("Mathematics", "Mon-Wed-Fri 5:00-6:30 PM");
      stmt.run("Science", "Tue-Thu 6:00-7:30 PM");
      stmt.finalize();
      console.log("✅ Inserted sample courses");
    }
  });

  db.get("SELECT COUNT(*) AS cnt FROM instructors", (err, row) => {
    if (!err && row && row.cnt === 0) {
      const stmt = db.prepare("INSERT INTO instructors (name, subject, bio) VALUES (?, ?, ?)");
      stmt.run("Mr. John Doe", "Mathematics", "10+ years teaching experience.");
      stmt.run("Ms. Jane Smith", "Science", "Loves experiments and labs.");
      stmt.finalize();
      console.log("✅ Inserted sample instructors");
    }
  });
});

module.exports = db;
