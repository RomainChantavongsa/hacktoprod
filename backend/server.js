// Charger les variables d'environnement depuis le .env à la racine
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./config/initDatabase');
const { initDirectories } = require('./config/initDirectories');
const { errorHandler } = require('./middleware/errorHandler');

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
const entreprisesRouter = require('./routes/entreprises');
const vehiculesRouter = require('./routes/vehicules');
const remorquesRouter = require('./routes/remorques');
const conducteursRouter = require('./routes/conducteurs');
const documentsRouter = require('./routes/documents');
const compteBancaireRouter = require('./routes/compte-bancaire');
const annuaireRouter = require('./routes/annuaire');

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'API HackToGone - Backend server is running!',
    endpoints: {
      users: '/api/users',
      entreprises: '/api/entreprises',
      transporteurs: '/api/transporteurs',
      donneurs_ordre: '/api/donneurs-ordre',
      offres_fret: '/api/offres-fret',
      vehicules: '/api/vehicules',
      remorques: '/api/remorques',
      conducteurs: '/api/conducteurs',
      documents: '/api/documents',
      compte_bancaire: '/api/compte-bancaire',
      annuaire: '/api/annuaire'
    }
  });
});

// Montage des routes
app.use('/api/users', usersRouter);
app.use('/api/entreprises', entreprisesRouter);
app.use('/api/transporteurs', transporteursRouter);
app.use('/api/donneurs-ordre', donneursOrdreRouter);
app.use('/api/offres-fret', offresFretRouter);
app.use('/api/vehicules', vehiculesRouter);
app.use('/api/remorques', remorquesRouter);
app.use('/api/conducteurs', conducteursRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/compte-bancaire', compteBancaireRouter);
app.use('/api/annuaire', annuaireRouter);

// Middleware de gestion des erreurs (DOIT être après les routes)
app.use(errorHandler);

// Fonction de démarrage asynchrone
async function startServer() {
  try {
    // Initialiser les dossiers nécessaires
    await initDirectories();
    
    // Initialiser la base de données
    await initDatabase();
    
    // Démarrer le serveur
    app.listen(port, () => {
      console.log(`✅ Backend server is running on http://localhost:${port}`);
      console.log(`🔧 Mode: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Démarrer le serveur
startServer();
