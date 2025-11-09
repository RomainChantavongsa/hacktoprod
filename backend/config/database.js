// Configuration de la base de données
// Ce fichier montre comment utiliser les variables d'environnement
const { Pool } = require('pg');

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Options supplémentaires en production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Nombre max de clients dans le pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Intercepter les requêtes pour les afficher en développement
if (process.env.NODE_ENV !== 'production') {
  const originalQuery = pool.query.bind(pool);
  pool.query = function(...args) {
    console.log('\n🔍 SQL Query:', args[0]);
    if (args[1]) console.log('📦 Parameters:', args[1]);
    return originalQuery(...args);
  };
}

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connecté à la base de données PostgreSQL');
  console.log('🔧 Mode:', process.env.NODE_ENV || 'development');
});

pool.on('error', (err) => {
  console.error('❌ Erreur de connexion à la base de données:', err);
  process.exit(-1);
});

module.exports = pool;
