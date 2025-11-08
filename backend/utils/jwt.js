const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_tres_longue_ici';
const JWT_EXPIRES_IN = '24h';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'votre_cle_secrete_tres_longue_ici') {
  console.warn('⚠️  WARNING: JWT_SECRET is not properly set in .env file!');
}

/**
 * Génère un token JWT
 * @param {Object} payload - Les données à inclure dans le token
 * @param {string} expiresIn - Durée de validité (défaut: 24h)
 * @returns {String} Le token JWT
 */
const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn,
      issuer: 'hacktogone-api'
    });
  } catch (error) {
    throw new Error(`Erreur lors de la génération du token: ${error.message}`);
  }
};

/**
 * Vérifie et décode un token JWT
 * @param {String} token - Le token à vérifier
 * @returns {Object} Le payload décodé
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'hacktogone-api'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expiré');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Token invalide');
    } else {
      throw new Error(`Erreur de vérification: ${error.message}`);
    }
  }
};

/**
 * Génère un refresh token (durée plus longue)
 * @param {Object} payload - Les données à inclure
 * @returns {String} Refresh token
 */
const generateRefreshToken = (payload) => {
  return generateToken(payload, '7d');
};

/**
 * Extrait le token du header Authorization
 * @param {string} authHeader - Header Authorization (format: "Bearer TOKEN")
 * @returns {string|null} Token extrait ou null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

/**
 * Middleware pour protéger les routes
 * Vérifie la présence et la validité du token JWT
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Token manquant. Format attendu: "Bearer TOKEN"' 
      });
    }
    
    const decoded = verifyToken(token);
    
    // Ajouter les informations décodées à la requête
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      error: error.message 
    });
  }
};

/**
 * Middleware optionnel : vérifie le token s'il existe mais ne bloque pas si absent
 */
const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Si le token est invalide, on continue quand même
    next();
  }
};

/**
 * Middleware pour vérifier les rôles
 * @param {string[]} roles - Rôles autorisés
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentification requise' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: 'Permissions insuffisantes' 
      });
    }
    
    next();
  };
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  extractTokenFromHeader,
  authMiddleware,
  optionalAuthMiddleware,
  requireRole
};
