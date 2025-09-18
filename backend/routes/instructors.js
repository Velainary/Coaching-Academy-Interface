// backend/routes/instructors.js
const express = require("express");
const db = require("../database");
const router = express.Router();

// GET /api/instructors
router.get("/", (req, res) => {
  db.all("SELECT id, name, subject, bio FROM instructors ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/instructors
router.post("/", (req, res) => {
  const { name, subject, bio } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });

  db.run("INSERT INTO instructors (name, subject, bio) VALUES (?, ?, ?)", [name, subject || "", bio || ""], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Instructor added", instructorId: this.lastID });
  });
});

module.exports = router;
