const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public')); // Serves HTML, CSS, JS from public folder

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${3000}`);
});
