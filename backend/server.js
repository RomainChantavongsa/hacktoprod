// Dans backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Utilisation des variables d'environnement
const port = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors()); // Permet les requêtes cross-origin
app.use(express.json()); // Parse le JSON
app.use(express.urlencoded({ extended: true })); // Parse les données de formulaire
app.use(express.static('.')); // Servir les fichiers statiques depuis le dossier courant

// Import des routes
const usersRouter = require('./routes/users');

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'API HackToGone - Backend server is running!',
    endpoints: {
      users: '/api/users'
    }
  });
});

// Montage des routes
app.use('/api/users', usersRouter);

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});