// backend/routes/auth.js
const express = require("express");
const db = require("../database");
const router = express.Router();

// Get all users (useful to pick student for attendance)
router.get("/users", (req, res) => {
  db.all("SELECT id, name, email, role FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get(
    "SELECT id, name, email, role FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(401).json({ message: "Invalid credentials" });
      res.json({ message: "Login successful", user: row });
    }
  );
});

// Register
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  db.run(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role || "student"],
    function (err) {
      if (err) {
        if (err.message && err.message.includes("UNIQUE")) {
          return res.status(400).json({ error: "Email already registered" });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "User registered", userId: this.lastID });
    }
  );
});

module.exports = router;
