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

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connecté à la base de données PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erreur de connexion à la base de données:', err);
  process.exit(-1);
});

module.exports = pool;
