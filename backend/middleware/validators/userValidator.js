/**
 * Middleware de validation pour les utilisateurs
 */

/**
 * Valide les données de création d'un utilisateur
 */
const validateCreateUser = (req, res, next) => {
  const { username, email, password, nom, type_entreprise, est_particulier } = req.body;
  const errors = [];

  // Validation des champs requis
  if (!username || username.trim() === '') {
    errors.push('Le nom d\'utilisateur est requis');
  }

  if (!email || email.trim() === '') {
    errors.push('L\'email est requis');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('L\'email n\'est pas valide');
  }

  if (!password || password.trim() === '') {
    errors.push('Le mot de passe est requis');
  } else if (password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }

  if (!nom || nom.trim() === '') {
    errors.push('Le nom est requis');
  }

  if (!type_entreprise || type_entreprise.trim() === '') {
    errors.push('Le type d\'entreprise est requis');
  } else if (!['transporteur', 'donneur_ordre'].includes(type_entreprise)) {
    errors.push('Le type d\'entreprise doit être: transporteur ou donneur_ordre');
  }

  // Validation spécifique pour donneur_ordre
  if (type_entreprise === 'donneur_ordre') {
    // est_particulier peut être true/false, accepter les deux
    if (est_particulier === undefined || est_particulier === null) {
      errors.push('Vous devez indiquer si vous êtes un particulier ou une entreprise');
    }
  }

  // Si des erreurs existent, retourner 400
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
 * Valide les données de connexion
 */
const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];

  if (!username || username.trim() === '') {
    errors.push('Le nom d\'utilisateur est requis');
  }

  if (!password || password.trim() === '') {
    errors.push('Le mot de passe est requis');
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
 * Valide les données de mise à jour d'un utilisateur
 */
const validateUpdateUser = (req, res, next) => {
  const { email, password, role, telephone } = req.body;
  const errors = [];

  // Validation de l'email si fourni
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('L\'email n\'est pas valide');
  }

  // Validation du mot de passe si fourni
  if (password && password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }

  // Validation du rôle si fourni
  if (role && !['admin', 'transporteur', 'donneur_ordre'].includes(role)) {
    errors.push('Le rôle doit être: admin, transporteur ou donneur_ordre');
  }

  // Validation du téléphone si fourni
  if (telephone && (typeof telephone !== 'string' || telephone.length < 10 || telephone.length > 15)) {
    errors.push('Le numéro de téléphone doit être une chaîne de 10 à 15 caractères');
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
  validateCreateUser,
  validateLogin,
  validateUpdateUser
};
