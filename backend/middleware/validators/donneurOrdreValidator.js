/**
 * Middleware de validation pour les donneurs d'ordre
 */

/**
 * Valide les données de création d'un donneur d'ordre
 */
const validateCreateDonneurOrdre = (req, res, next) => {
  const { nom_entreprise, siret, email_contact } = req.body;
  const errors = [];

  if (!nom_entreprise || nom_entreprise.trim() === '') {
    errors.push('Le nom d\'entreprise est requis');
  }

  if (!siret || siret.trim() === '') {
    errors.push('Le SIRET est requis');
  } else if (!/^\d{14}$/.test(siret.replace(/\s/g, ''))) {
    errors.push('Le SIRET doit contenir 14 chiffres');
  }

  if (!email_contact || email_contact.trim() === '') {
    errors.push('L\'email de contact est requis');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_contact)) {
    errors.push('L\'email de contact n\'est pas valide');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors: errors
    });
  }

  next();
};

/**
 * Valide les données de mise à jour d'un donneur d'ordre
 */
const validateUpdateDonneurOrdre = (req, res, next) => {
  const { siret, email_contact } = req.body;
  const errors = [];

  if (siret && !/^\d{14}$/.test(siret.replace(/\s/g, ''))) {
    errors.push('Le SIRET doit contenir 14 chiffres');
  }

  if (email_contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_contact)) {
    errors.push('L\'email de contact n\'est pas valide');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors: errors
    });
  }

  next();
};

module.exports = {
  validateCreateDonneurOrdre,
  validateUpdateDonneurOrdre
};
