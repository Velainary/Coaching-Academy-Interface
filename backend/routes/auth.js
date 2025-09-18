const express = require("express");
const db = require("../database");
const router = express.Router();

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", user: row });
  });
});

module.exports = router;