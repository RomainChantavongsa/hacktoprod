// Utilitaires JWT
// Ce fichier montre comment utiliser JWT avec les variables d'environnement
const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Génère un token JWT
 * @param {Object} payload - Les données à inclure dans le token
 * @returns {String} Le token JWT
 */
const generateToken = (payload) => {
  if (!config.jwt.secret) {
    throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement !');
  }
  
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Vérifie et décode un token JWT
 * @param {String} token - Le token à vérifier
 * @returns {Object} Le payload décodé
 */
const verifyToken = (token) => {
  if (!config.jwt.secret) {
    throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement !');
  }
  
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Token invalide ou expiré');
  }
};

/**
 * Middleware pour protéger les routes
 */
const authMiddleware = (req, res, next) => {
  try {
    // Récupérer le token depuis l'header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    // Ajouter les informations décodées à la requête
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
};
