const fs = require('fs').promises;
const path = require('path');

/**
 * Créer tous les dossiers nécessaires pour l'application
 */
async function initDirectories() {
  const directories = [
    path.join(__dirname, '..', 'uploads'),
    path.join(__dirname, '..', 'uploads', 'documents'),
    path.join(__dirname, '..', 'uploads', 'images'),
    path.join(__dirname, '..', 'uploads', 'temp'),
    path.join(__dirname, '..', 'logs')
  ];

  console.log('📁 Initialisation des dossiers...');

  for (const dir of directories) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(`✅ Dossier créé/vérifié : ${dir}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la création du dossier ${dir}:`, error.message);
    }
  }

  console.log('✅ Tous les dossiers ont été initialisés\n');
}

module.exports = { initDirectories };
