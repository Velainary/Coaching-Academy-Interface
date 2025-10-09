// backend/routes/attendance.js
const express = require("express");
const db = require("../database");
const router = express.Router();

// 🟢 GET attendance list (with student + course info)
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      a.id,
      u.name AS student_name,
      c.subject AS course_name,
      a.date,
      a.status
    FROM attendance a
    LEFT JOIN users u ON a.user_id = u.id
    LEFT JOIN courses c ON a.course_id = c.id
    ORDER BY a.date DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 🟢 POST mark attendance
router.post("/", (req, res) => {
  const { user_id, course_id, date, status } = req.body;
  if (!user_id || !course_id || !date || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO attendance (user_id, course_id, date, status)
    VALUES (?, ?, ?, ?)
  `;
  db.run(sql, [user_id, course_id, date, status], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Attendance marked", id: this.lastID });
  });
});

module.exports = router;
