// Configuration globale de l'application
// Centralise toutes les variables d'environnement

module.exports = {
  // Configuration du serveur
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
  },

  // Configuration de la base de données
  database: {
    url: process.env.DATABASE_URL,
  },

  // Configuration JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h', // Durée de validité du token
  },

  // Configuration Twilio
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  },

  // Configuration AWS S3
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3BucketName: process.env.AWS_S3_BUCKET_NAME,
    region: process.env.AWS_REGION || 'eu-west-1',
  },
};
