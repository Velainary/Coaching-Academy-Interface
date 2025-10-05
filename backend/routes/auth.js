// backend/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../database");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
const TOKEN_EXPIRES = "4h";

// ----------------- Register (dev) -----------------
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required" });
  }

  db.run(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role || "student"],
    function (err) {
      if (err) {
        if (err.message && err.message.includes("UNIQUE")) {
          return res.status(400).json({ error: "Email already registered" });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Registered", userId: this.lastID });
    }
  );
});

// ----------------- Login -----------------
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  db.get(
    "SELECT id, name, email, role FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(401).json({ error: "Invalid credentials" });

      const payload = { id: row.id, name: row.name, email: row.email, role: row.role };
      const token = jwt.sign(payload, SECRET, { expiresIn: TOKEN_EXPIRES });

      res.json({ message: "Login successful", token, user: payload });
    }
  );
});

// ----------------- List users (for dropdowns) -----------------
router.get("/users", (req, res) => {
  db.all("SELECT id, name, email, role FROM users ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ----------------- Middleware: authenticate -----------------
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1] || authHeader;
  jwt.verify(token, SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = payload; // { id, name, email, role }
    next();
  });
}

// ----------------- Middleware: authorizeRole -----------------
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Forbidden: insufficient rights" });
    }
    next();
  };
}

// Export router + middlewares in the object shape server.js expects
module.exports = { router, authenticate, authorizeRole };
