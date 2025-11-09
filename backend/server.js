const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./config/initDatabase');

const app = express();

// Utilisation des variables d'environnement
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Permet les requêtes cross-origin
app.use(express.json()); // Parse le JSON
app.use(express.urlencoded({ extended: true })); // Parse les données de formulaire
app.use(express.static('.')); // Servir les fichiers statiques depuis le dossier courant

// Import des routes
const usersRouter = require('./routes/users');
const transporteursRouter = require('./routes/transporteurs');
const donneursOrdreRouter = require('./routes/donneurs-ordre');
const offresFretRouter = require('./routes/offres-fret');

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'API HackToGone - Backend server is running!',
    endpoints: {
      users: '/api/users',
      transporteurs: '/api/transporteurs',
      donneurs_ordre: '/api/donneurs-ordre',
      offres_fret: '/api/offres-fret'
    }
  });
});

// Montage des routes
app.use('/api/users', usersRouter);
app.use('/api/transporteurs', transporteursRouter);
app.use('/api/donneurs-ordre', donneursOrdreRouter);
app.use('/api/offres-fret', offresFretRouter);

// Fonction de démarrage asynchrone
async function startServer() {
  try {
    // Initialiser la base de données
    await initDatabase();
    
    // Démarrer le serveur
    app.listen(port, () => {
      console.log(`✅ Backend server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Démarrer le serveur
startServer();
