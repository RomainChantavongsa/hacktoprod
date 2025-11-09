/**
 * Middleware de validation pour les utilisateurs
 */

/**
 * Valide les données de création d'un utilisateur
 */
const validateCreateUser = (req, res, next) => {
  const { username, email, password, nom, role } = req.body;
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

  if (!role || role.trim() === '') {
    errors.push('Le rôle est requis');
  } else if (!['admin', 'transporteur', 'donneur_ordre'].includes(role)) {
    errors.push('Le rôle doit être: admin, transporteur ou donneur_ordre');
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
  const { email, password, role } = req.body;
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
