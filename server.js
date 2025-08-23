const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const db = new sqlite3.Database("./school_app.sqlite");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: true
}));

// Register (optional)
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, hashedPassword, role],
    function (err) {
      if (err) {
        console.error(err);
        res.send("❌ Error registering user.");
      } else {
        res.send("✅ User registered!");
      }
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.send("⚠️ Server error.");
    if (!user) return res.send("❌ Invalid username or password.");

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.user = { id: user.id, username: user.username, role: user.role };
      if (user.role === "parent") {
        res.redirect("/parent-dashboard.html");
      } else {
        res.redirect("/student-dashboard.html");
      }
    } else {
      res.send("❌ Invalid username or password.");
    }
  });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
