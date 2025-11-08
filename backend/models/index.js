/**
 * Point d'entrée pour tous les modèles
 * Facilite l'import des modèles dans le reste de l'application
 * 
 * Exemple d'utilisation:
 * const { Transporteur, DonneurOrdre, Utilisateur } = require('./models');
 */

const BaseModel = require('./BaseModel');
const Transporteur = require('./Transporteur');
const DonneurOrdre = require('./DonneurOrdre');
const Utilisateur = require('./Utilisateur');

module.exports = {
  BaseModel,
  Transporteur,
  DonneurOrdre,
  Utilisateur
};
