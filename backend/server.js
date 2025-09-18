const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Import API routes
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const instructorRoutes = require("./routes/instructors");
const attendanceRoutes = require("./routes/attendance");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ======================
// ✅ Serve Frontend
// ======================
app.use(express.static(path.join(__dirname, "../frontend"))); 

// Root route -> index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// ======================
// ✅ API Routes
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/attendance", attendanceRoutes);

// ======================
// ✅ Fallback (for unknown routes)
// ======================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// ======================
// ✅ Start server
// ======================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
