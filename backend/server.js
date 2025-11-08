// Dans backend/server.js
const express = require('express');
const app = express();

// Utilisation des variables d'environnement
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello from the Node.js API!');
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});