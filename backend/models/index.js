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
const PropositionOffre = require('./PropositionOffre');
const Utilisateur = require('./Utilisateur');
const OffreFret = require('./OffreFret');
const Vehicule = require('./Vehicule');
const Remorque = require('./Remorque');
const Conducteur = require('./Conducteur');
const Document = require('./Document');
const Entrepot = require('./Entrepot');

module.exports = {
  BaseModel,
  Entreprise,
  Transporteur,
  DonneurOrdre,
  PropositionOffre,
  Utilisateur,
  OffreFret,
  Vehicule,
  Remorque,
  Conducteur,
  Document,
  Entrepot
};
