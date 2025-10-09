const express = require("express");
const router = express.Router();
const db = require("../database");

// GET all instructors
router.get("/", (req, res) => {
  db.all("SELECT id, name, subject, bio, created_at FROM instructors ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// ADD instructor
router.post("/", (req, res) => {
  const { name, subject, bio } = req.body || {};
  if (!name) return res.status(400).json({ error: "name is required" });

  db.run("INSERT INTO instructors (name, subject, bio) VALUES (?, ?, ?)",
    [name, subject || "", bio || ""],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Instructor added", id: this.lastID });
    });
});

// UPDATE instructor
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, subject, bio } = req.body || {};
  if (!name) return res.status(400).json({ error: "name is required" });

  db.run("UPDATE instructors SET name = ?, subject = ?, bio = ? WHERE id = ?",
    [name, subject || "", bio || "", id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Instructor not found" });
      res.json({ message: "Instructor updated" });
    });
});

// DELETE instructor
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM instructors WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Instructor not found" });
    res.json({ message: "Instructor deleted" });
  });
});

module.exports = router;
