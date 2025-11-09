/**
 * Point d'entrée pour tous les modèles
 * Facilite l'import des modèles dans le reste de l'application
 * 
 * Exemple d'utilisation:
 * const { Transporteur, DonneurOrdre, Utilisateur } = require('./models');
 */

const BaseModel = require('./BaseModel');
const Entreprise = require('./Entreprise');
const Transporteur = require('./Transporteur');
const DonneurOrdre = require('./DonneurOrdre');
const Utilisateur = require('./Utilisateur');
const OffreFret = require('./OffreFret');
const Vehicule = require('./Vehicule');
const Remorque = require('./Remorque');
const Conducteur = require('./Conducteur');
const Document = require('./Document');

module.exports = {
  BaseModel,
  Entreprise,
  Transporteur,
  DonneurOrdre,
  Utilisateur,
  OffreFret,
  Vehicule,
  Remorque,
  Conducteur,
  Document
};
