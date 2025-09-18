const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const instructorRoutes = require("./routes/instructors");
const attendanceRoutes = require("./routes/attendance");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Each one is a function now
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/attendance", attendanceRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});