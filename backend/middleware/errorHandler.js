/**
 * Middleware de gestion centralisée des erreurs
 */
const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);

  // Si l'erreur a un statusCode personnalisé, l'utiliser
  const statusCode = err.statusCode || 500;

  // Construire la réponse d'erreur
  const response = {
    success: false,
    message: err.message || 'Erreur serveur interne'
  };

  // En développement, inclure la stack trace
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * Wrapper pour les fonctions async dans les routes
 * Évite d'avoir à faire try/catch dans chaque route
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler
};
