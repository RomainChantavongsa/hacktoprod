const fs = require('fs');
const path = require('path');
const pool = require('./database');

/**
 * Initialise la base de données en exécutant le script init.sql
 */
async function initDatabase() {
  try {
    console.log('🔄 Initialisation de la base de données...');

    // Lire le fichier init.sql
    const sqlFilePath = path.join(__dirname, '..', 'init.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Exécuter le script SQL
    await pool.query(sql);

    console.log('✅ Base de données initialisée avec succès');
  } catch (error) {
    // Si les tables existent déjà, c'est normal
    if (error.code === '42P07') {
      console.log('ℹ️  Tables déjà existantes, pas besoin de réinitialiser');
    } else {
      console.error('❌ Erreur lors de l\'initialisation de la base de données:', error.message);
      throw error;
    }
  }
}

module.exports = { initDatabase };
