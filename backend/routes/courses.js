// backend/routes/courses.js
const express = require("express");
const db = require("../database");
const router = express.Router();

// GET /api/courses
router.get("/", (req, res) => {
  db.all("SELECT id, subject, schedule FROM courses ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/courses
router.post("/", (req, res) => {
  const { subject, schedule } = req.body;
  if (!subject) return res.status(400).json({ error: "subject is required" });

  db.run("INSERT INTO courses (subject, schedule) VALUES (?, ?)", [subject, schedule || ""], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Course added", courseId: this.lastID });
  });
});

module.exports = router;
