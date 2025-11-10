// Charger les variables d'environnement depuis le .env à la racine
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { initDatabase } = require('./config/initDatabase');
const { initDirectories } = require('./config/initDirectories');
const { errorHandler } = require('./middleware/errorHandler');
const { setupChatSocketHandlers } = require('./services/chatSocketHandler');

const app = express();
const server = http.createServer(app);

// Configurazione Socket.io con CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Setup handler Socket.io per il chat
setupChatSocketHandlers(io);

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
const chatRouter = require('./routes/chat');
const compteBancaireRouter = require('./routes/compte-bancaire');
const annuaireRouter = require('./routes/annuaire');
const entrepotsRouter = require('./routes/entrepots');

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
      chat: '/api/chat',
      compte_bancaire: '/api/compte-bancaire',
      annuaire: '/api/annuaire',
      entrepots: '/api/entrepots'
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
app.use('/api/chat', chatRouter);
app.use('/api/compte-bancaire', compteBancaireRouter);
app.use('/api/annuaire', annuaireRouter);
app.use('/api/entrepots', entrepotsRouter);

// Middleware de gestion des erreurs (DOIT être après les routes)
app.use(errorHandler);

// Fonction de démarrage asynchrone
async function startServer() {
  try {
    // Initialiser les dossiers nécessaires
    await initDirectories();
    
    // Initialiser la base de données
    await initDatabase();
    
    // Démarrer le serveur (usa server invece di app per Socket.io)
    server.listen(port, () => {
      console.log(`✅ Backend server is running on http://localhost:${port}`);
      console.log(`💬 Chat WebSocket is ready`);
      console.log(`🔧 Mode: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Démarrer le serveur
startServer();
