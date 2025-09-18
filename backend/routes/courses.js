const express = require("express");
const db = require("../database");
const router = express.Router();

// Get all courses
router.get("/", (req, res) => {
  db.all("SELECT * FROM courses", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;