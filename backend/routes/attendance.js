const express = require("express");
const db = require("../database");
const router = express.Router();

// Get attendance
router.get("/", (req, res) => {
  db.all("SELECT a.id, u.name, a.date, a.status FROM attendance a JOIN users u ON a.user_id = u.id", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Mark attendance
router.post("/", (req, res) => {
  const { user_id, date, status } = req.body;
  db.run("INSERT INTO attendance (user_id, date, status) VALUES (?, ?, ?)", [user_id, date, status], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Attendance marked", id: this.lastID });
  });
});

module.exports = router;
