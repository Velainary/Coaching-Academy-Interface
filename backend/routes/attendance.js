const express = require("express");
const db = require("../database");
const router = express.Router();

// ✅ Get attendance (with student + course info)
router.get("/", (req, res) => {
  const query = `
    SELECT 
      a.id,
      u.name AS student_name,
      c.title AS course_name,
      a.date,
      a.status
    FROM attendance a
    LEFT JOIN users u ON a.user_id = u.id
    LEFT JOIN courses c ON a.course_id = c.id
    ORDER BY a.date DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ✅ Mark attendance
router.post("/", (req, res) => {
  const { user_id, course_id, date, status } = req.body;

  if (!user_id || !course_id || !date || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO attendance (user_id, course_id, date, status)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [user_id, course_id, date, status], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ 
      message: "Attendance marked",
      id: this.lastID,
      user_id,
      course_id,
      date,
      status
    });
  });
});

module.exports = router;
