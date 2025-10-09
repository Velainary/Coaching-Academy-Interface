const express = require("express");
const router = express.Router();
const db = require("../database"); // <-- correct file

// GET all courses
router.get("/", (req, res) => {
  db.all("SELECT id, subject, schedule, created_at FROM courses ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// ADD new course (teachers allowed by server middleware)
router.post("/", (req, res) => {
  const { subject, schedule } = req.body || {};
  if (!subject) return res.status(400).json({ error: "subject is required" });

  db.run("INSERT INTO courses (subject, schedule) VALUES (?, ?)",
    [subject, schedule || ""],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Course added", id: this.lastID });
    });
});

// UPDATE course
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { subject, schedule } = req.body || {};
  if (!subject) return res.status(400).json({ error: "subject is required" });

  db.run("UPDATE courses SET subject = ?, schedule = ? WHERE id = ?",
    [subject, schedule || "", id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Course not found" });
      res.json({ message: "Course updated" });
    });
});

// DELETE course
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM courses WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Course not found" });
    res.json({ message: "Course deleted" });
  });
});

module.exports = router;
