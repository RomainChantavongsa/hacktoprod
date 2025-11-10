const express = require('express');
const router = express.Router();
const annuaireService = require('../services/AnnuaireService');
const { authMiddleware } = require('../utils/jwt');

// Helper pour gérer les erreurs async
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * GET /api/annuaire
 * Récupérer l'annuaire de l'entreprise de l'utilisateur connecté
 */
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const entrepriseId = req.user.entreprise_id;
  const annuaire = await annuaireService.getAnnuaireEntreprise(entrepriseId);
  res.json({
    success: true,
    data: annuaire
  });
}));

/**
 * POST /api/annuaire
 * Créer une nouvelle entrée d'annuaire
 */
router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  const entrepriseId = req.user.entreprise_id;
  const entree = await annuaireService.createEntreeAnnuaire(entrepriseId, req.body, req.user.id);
  res.json({
    success: true,
    data: entree.toSafeObject(),
    message: 'Entrée d\'annuaire créée avec succès'
  });
}));

/**
 * PUT /api/annuaire/:id
 * Mettre à jour une entrée d'annuaire
 */
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const entrepriseId = req.user.entreprise_id;
  const entree = await annuaireService.updateEntreeAnnuaire(parseInt(id), entrepriseId, req.body, req.user.id);
  res.json({
    success: true,
    data: entree.toSafeObject(),
    message: 'Entrée d\'annuaire mise à jour avec succès'
  });
}));

/**
 * DELETE /api/annuaire/:id
 * Supprimer une entrée d'annuaire
 */
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const entrepriseId = req.user.entreprise_id;
  await annuaireService.deleteEntreeAnnuaire(parseInt(id), entrepriseId);
  res.json({
    success: true,
    message: 'Entrée d\'annuaire supprimée avec succès'
  });
}));

/**
 * GET /api/annuaire/entreprises
 * Récupérer toutes les entreprises de l'annuaire
 */
router.get('/entreprises', authMiddleware, asyncHandler(async (req, res) => {
  const entreprises = await annuaireService.getAllEntreprisesAnnuaire();
  res.json({
    success: true,
    data: entreprises
  });
}));

/**
 * GET /api/annuaire/utilisateurs
 * Récupérer tous les utilisateurs de l'annuaire
 */
router.get('/utilisateurs', authMiddleware, asyncHandler(async (req, res) => {
  const utilisateurs = await annuaireService.getAllUtilisateursAnnuaire();
  res.json({
    success: true,
    data: utilisateurs
  });
}));

/**
 * GET /api/annuaire/search
 * Rechercher dans l'annuaire
 */
router.get('/search', authMiddleware, asyncHandler(async (req, res) => {
  const { q: query, type = 'all' } = req.query;

  if (!query || query.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Le terme de recherche doit contenir au moins 2 caractères'
    });
  }

  const results = await annuaireService.searchAnnuaire(query.trim(), type);
  res.json({
    success: true,
    data: results,
    query: query.trim(),
    type
  });
}));

module.exports = router;