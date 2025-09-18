const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./tuition.db", (err) => {
  if (err) console.error("❌ Database error: ", err);
  else console.log("✅ Connected to SQLite DB");
});

module.exports = db;
