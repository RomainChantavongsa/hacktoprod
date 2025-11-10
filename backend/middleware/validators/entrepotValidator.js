/**
 * Middleware de validation pour les entrepôts
 */

/**
 * Validation de création d'un entrepôt
 */
const validateCreateEntrepot = (req, res, next) => {
  const {
    nom_entrepot,
    adresse,
    ville,
    code_postal,
    capacite_stockage_m3,
    email_contact
  } = req.body;

  const errors = [];

  if (!nom_entrepot || nom_entrepot.trim() === '') {
    errors.push("Le nom de l'entrepôt est requis");
  }
  if (!adresse || adresse.trim() === '') {
    errors.push("L'adresse est requise");
  }
  if (!ville || ville.trim() === '') {
    errors.push('La ville est requise');
  }
  if (!code_postal || code_postal.trim() === '') {
    errors.push('Le code postal est requis');
  }
  if (capacite_stockage_m3 !== undefined && capacite_stockage_m3 < 0) {
    errors.push('La capacité de stockage doit être positive');
  }
  if (email_contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_contact)) {
    errors.push("L'email de contact est invalide");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors
    });
  }

  next();
};

/**
 * Validation de mise à jour d'un entrepôt (tous optionnels mais formats vérifiés)
 */
const validateUpdateEntrepot = (req, res, next) => {
  const {
    capacite_stockage_m3,
    email_contact
  } = req.body;

  const errors = [];

  if (capacite_stockage_m3 !== undefined && capacite_stockage_m3 < 0) {
    errors.push('La capacité de stockage doit être positive');
  }
  if (email_contact !== undefined && email_contact !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_contact)) {
    errors.push("L'email de contact est invalide");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors
    });
  }

  next();
};

module.exports = {
  validateCreateEntrepot,
  validateUpdateEntrepot
};
