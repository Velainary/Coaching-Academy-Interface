const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const dbFile = "./tuition.db";
const dbExists = fs.existsSync(dbFile);

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error("❌ Database error: ", err);
  else {
    console.log("✅ Connected to SQLite DB");

    if (!dbExists) {
      console.log("⚡ Initializing database...");
      db.serialize(() => {
        db.run(`
          CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT CHECK(role IN ('student', 'parent', 'teacher')) NOT NULL
          )
        `);

        db.run(`
          CREATE TABLE courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT NOT NULL,
            schedule TEXT NOT NULL
          )
        `);

        db.run(`
          CREATE TABLE instructors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            bio TEXT
          )
        `);

        db.run(`
          CREATE TABLE attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            date TEXT NOT NULL,
            status TEXT CHECK(status IN ('Present', 'Absent')) NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
          )
        `);

        console.log("✅ Tables created");
      });
    }
  }
});

module.exports = db;
