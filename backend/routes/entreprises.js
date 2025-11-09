const express = require('express');
const router = express.Router();
const entrepriseService = require('../services/EntrepriseService');
const { authMiddleware } = require('../utils/jwt');

// Helper pour gérer les erreurs async
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * GET /api/entreprises
 * Récupérer toutes les entreprises (optionnel: filtrer par type)
 */
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const { type } = req.query;
  const entreprises = await entrepriseService.getAllEntreprises(type);
  res.json({ success: true, data: entreprises });
}));

/**
 * GET /api/entreprises/:id
 * Récupérer une entreprise par son ID
 */
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const entreprise = await entrepriseService.getEntrepriseById(parseInt(id));
  res.json({ success: true, data: entreprise });
}));

/**
 * PUT /api/entreprises/:id
 * Mettre à jour une entreprise
 */
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  // Vérifier que l'utilisateur a le droit de modifier l'entreprise
  if (req.user.entreprise_id !== parseInt(id) && !req.user.is_admin) {
    return res.status(403).json({
      success: false,
      message: 'Vous n\'avez pas les droits pour modifier cette entreprise'
    });
  }

  // Vérifier que l'utilisateur est admin de l'entreprise
  if (req.user.role_entreprise !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Seuls les administrateurs peuvent modifier les informations de l\'entreprise'
    });
  }

  const entreprise = await entrepriseService.updateEntreprise(parseInt(id), updateData);
  res.json({ success: true, data: entreprise, message: 'Entreprise mise à jour avec succès' });
}));

/**
 * GET /api/entreprises/:id/utilisateurs
 * Récupérer tous les utilisateurs d'une entreprise
 */
router.get('/:id/utilisateurs', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Vérifier que l'utilisateur appartient à l'entreprise
  if (req.user.entreprise_id !== parseInt(id) && !req.user.is_admin) {
    return res.status(403).json({
      success: false,
      message: 'Vous n\'avez pas accès à ces informations'
    });
  }

  const Entreprise = require('../models/Entreprise');
  const utilisateurs = await Entreprise.getUtilisateurs(parseInt(id));
  
  // Retourner seulement les informations sûres
  const safeUtilisateurs = utilisateurs.map(u => u.toSafeObject());
  
  res.json({ success: true, data: safeUtilisateurs });
}));

module.exports = router;
