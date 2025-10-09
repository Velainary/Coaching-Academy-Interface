const express = require("express");
const router = express.Router();
const db = require("../database");

// GET all attendance (join user & course names)
router.get("/", (req, res) => {
  const sql = `
    SELECT a.id,
           u.id AS user_id,
           u.name AS student_name,
           c.id AS course_id,
           c.subject AS course_name,
           a.date,
           a.status,
           a.created_at
    FROM attendance a
    LEFT JOIN users u ON a.user_id = u.id
    LEFT JOIN courses c ON a.course_id = c.id
    ORDER BY a.date DESC, a.id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// ADD new attendance record
router.post("/", (req, res) => {
  const { user_id, course_id, date, status } = req.body || {};
  if (!date || !status) return res.status(400).json({ error: "date and status are required" });

  db.run("INSERT INTO attendance (user_id, course_id, date, status) VALUES (?, ?, ?, ?)",
    [user_id || null, course_id || null, date, status],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Attendance added", id: this.lastID });
    });
});

// UPDATE attendance record
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { user_id, course_id, date, status } = req.body || {};
  if (!date || !status) return res.status(400).json({ error: "date and status are required" });

  db.run("UPDATE attendance SET user_id = ?, course_id = ?, date = ?, status = ? WHERE id = ?",
    [user_id || null, course_id || null, date, status, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Attendance record not found" });
      res.json({ message: "Attendance updated" });
    });
});

// DELETE attendance record
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM attendance WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Attendance record not found" });
    res.json({ message: "Attendance deleted" });
  });
});

module.exports = router;
