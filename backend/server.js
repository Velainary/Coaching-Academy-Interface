// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const { router: authRoutes, authenticate, authorizeRole } = require("./routes/auth");
const coursesRoutes = require("./routes/courses");
const instructorsRoutes = require("./routes/instructors");
const attendanceRoutes = require("./routes/attendance");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// ---------- API Routes ----------

// Auth (open)
app.use("/api/auth", authRoutes);

// Courses: students/parents can read, only teachers can add
app.use("/api/courses",
  authenticate,
  (req, res, next) => req.method === "GET" ? next() : authorizeRole("teacher")(req, res, next),
  coursesRoutes
);

// Instructors: same logic
app.use("/api/instructors",
  authenticate,
  (req, res, next) => req.method === "GET" ? next() : authorizeRole("teacher")(req, res, next),
  instructorsRoutes
);

// Attendance: teachers can add, students/parents can only read
app.use("/api/attendance",
  authenticate,
  (req, res, next) => req.method === "GET" ? next() : authorizeRole("teacher")(req, res, next),
  attendanceRoutes
);

// ---------- Frontend ----------
// (already serving static frontend folder)

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
