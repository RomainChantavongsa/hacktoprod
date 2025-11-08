const crypto = require('crypto');

/**
 * Utilitaire pour chiffrer/déchiffrer les données sensibles
 */
class CryptoUtils {
  constructor() {
    // Clé de chiffrement depuis les variables d'environnement
    // Doit être une clé de 32 caractères (256 bits)
    this.algorithm = 'aes-256-cbc';
    this.secretKey = this.getSecretKey();
    this.iv = crypto.randomBytes(16); // Vecteur d'initialisation
  }

  /**
   * Récupère ou génère une clé secrète
   */
  getSecretKey() {
    const key = process.env.ENCRYPTION_KEY;
    
    if (!key) {
      throw new Error('ENCRYPTION_KEY must be defined in environment variables');
    }

    // S'assurer que la clé fait 32 caractères
    return crypto.createHash('sha256').update(key).digest('base64').substr(0, 32);
  }

  /**
   * Chiffre une valeur
   * @param {string} text - Texte à chiffrer
   * @returns {string} Texte chiffré au format "iv:encrypted"
   */
  encrypt(text) {
    if (!text) return text;
    
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secretKey), iv);
      
      let encrypted = cipher.update(text.toString());
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      
      // Retourne iv:encrypted pour pouvoir déchiffrer plus tard
      return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
      throw new Error(`Erreur de chiffrement: ${error.message}`);
    }
  }

  /**
   * Déchiffre une valeur
   * @param {string} text - Texte chiffré au format "iv:encrypted"
   * @returns {string} Texte déchiffré
   */
  decrypt(text) {
    if (!text || !text.includes(':')) return text;
    
    try {
      const parts = text.split(':');
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedText = Buffer.from(parts[1], 'hex');
      
      const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.secretKey), iv);
      
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      return decrypted.toString();
    } catch (error) {
      // Si le déchiffrement échoue, retourner la valeur originale
      // (peut être une valeur non chiffrée dans la DB)
      return text;
    }
  }

  /**
   * Hash une valeur (pour les recherches)
   * @param {string} text - Texte à hasher
   * @returns {string} Hash
   */
  hash(text) {
    if (!text) return text;
    return crypto.createHash('sha256').update(text.toString()).digest('hex');
  }
}

module.exports = new CryptoUtils();
