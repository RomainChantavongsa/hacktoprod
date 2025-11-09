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

/**
 * Middleware pour vérifier le rôle de l'utilisateur
 * @param {String} role - Le rôle requis (ex: 'admin', 'transporteur', 'donneur_ordre')
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    
    if (req.user.role !== role) {
      return res.status(403).json({ error: `Accès refusé. Rôle requis: ${role}` });
    }
    
    next();
  };
};

/**
 * Génère un refresh token (token de longue durée)
 * @param {Object} payload - Les données à inclure dans le token
 * @returns {String} Le refresh token
 */
const generateRefreshToken = (payload) => {
  if (!config.jwt.secret) {
    throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement !');
  }
  
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: '7d', // 7 jours pour le refresh token
  });
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  authMiddleware,
  requireRole,
};
