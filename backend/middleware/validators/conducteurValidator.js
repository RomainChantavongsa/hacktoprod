const { body, validationResult } = require('express-validator');

const conducteurValidationRules = () => {
  return [
    body('nom')
      .trim()
      .notEmpty().withMessage('Le nom est requis')
      .isLength({ max: 255 }).withMessage('Le nom ne doit pas dépasser 255 caractères'),
    
    body('prenom')
      .trim()
      .notEmpty().withMessage('Le prénom est requis')
      .isLength({ max: 255 }).withMessage('Le prénom ne doit pas dépasser 255 caractères'),
    
    body('email')
      .optional({ checkFalsy: true })
      .isEmail().withMessage('Email invalide')
      .normalizeEmail(),
    
    body('telephone')
      .optional({ checkFalsy: true })
      .isLength({ max: 20 }).withMessage('Le téléphone ne doit pas dépasser 20 caractères'),
    
    body('numero_permis')
      .trim()
      .notEmpty().withMessage('Le numéro de permis est requis')
      .isLength({ max: 50 }).withMessage('Le numéro de permis ne doit pas dépasser 50 caractères'),
    
    body('date_naissance')
      .optional({ checkFalsy: true })
      .isISO8601().withMessage('Format de date invalide (YYYY-MM-DD)'),
    
    body('date_embauche')
      .optional({ checkFalsy: true })
      .isISO8601().withMessage('Format de date invalide (YYYY-MM-DD)'),
    
    body('statut')
      .optional()
      .isIn(['actif', 'inactif', 'conge', 'suspendu']).withMessage('Statut invalide')
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation échouée', 
      details: errors.array() 
    });
  }
  next();
};

module.exports = {
  conducteurValidationRules,
  validate
};
