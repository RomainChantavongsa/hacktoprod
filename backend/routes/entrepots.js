const express = require('express');
const router = express.Router();
const entrepotService = require('../services/EntrepotService');
const { authMiddleware, requireRole } = require('../utils/jwt');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * GET /api/entrepots - Récupérer tous les entrepôts de l'entreprise connectée
 */
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const { entreprise_id } = req.user;

  if (!entreprise_id) {
    return res.status(400).json({
      success: false,
      message: 'ID de l\'entreprise non trouvé'
    });
  }

  const entrepots = await entrepotService.getEntrepotsByEntreprise(entreprise_id);

  res.status(200).json({
    success: true,
    count: entrepots.length,
    data: entrepots
  });
}));

/**
 * GET /api/entrepots/actifs - Récupérer les entrepôts actifs de l'entreprise
 */
router.get('/actifs', authMiddleware, asyncHandler(async (req, res) => {
  const { entreprise_id } = req.user;

  if (!entreprise_id) {
    return res.status(400).json({
      success: false,
      message: 'ID de l\'entreprise non trouvé'
    });
  }

  const entrepots = await entrepotService.getEntrepotsActifsByEntreprise(entreprise_id);

  res.status(200).json({
    success: true,
    count: entrepots.length,
    data: entrepots
  });
}));

/**
 * GET /api/entrepots/:id - Récupérer un entrepôt par ID
 */
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const entrepot = await entrepotService.getEntrepotById(req.params.id);

  // Vérifier que l'entrepôt appartient à l'entreprise de l'utilisateur
  if (entrepot.entreprise_id !== req.user.entreprise_id) {
    return res.status(403).json({
      success: false,
      message: 'Accès non autorisé à cet entrepôt'
    });
  }

  res.status(200).json({
    success: true,
    data: entrepot
  });
}));

/**
 * POST /api/entrepots - Créer un nouvel entrepôt
 */
router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  const { entreprise_id } = req.user;

  if (!entreprise_id) {
    return res.status(400).json({
      success: false,
      message: 'ID de l\'entreprise non trouvé'
    });
  }

  const entrepotData = {
    ...req.body,
    entreprise_id
  };

  const entrepot = await entrepotService.createEntrepot(entrepotData);

  res.status(201).json({
    success: true,
    message: 'Entrepôt créé avec succès',
    data: entrepot
  });
}));

/**
 * PUT /api/entrepots/:id - Mettre à jour un entrepôt
 */
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
  // Vérifier que l'entrepôt existe et appartient à l'entreprise
  const existingEntrepot = await entrepotService.getEntrepotById(req.params.id);

  if (existingEntrepot.entreprise_id !== req.user.entreprise_id) {
    return res.status(403).json({
      success: false,
      message: 'Accès non autorisé à cet entrepôt'
    });
  }

  const entrepot = await entrepotService.updateEntrepot(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Entrepôt mis à jour avec succès',
    data: entrepot
  });
}));

/**
 * PATCH /api/entrepots/:id/toggle-status - Activer/désactiver un entrepôt
 */
router.patch('/:id/toggle-status', authMiddleware, asyncHandler(async (req, res) => {
  // Vérifier que l'entrepôt existe et appartient à l'entreprise
  const existingEntrepot = await entrepotService.getEntrepotById(req.params.id);

  if (existingEntrepot.entreprise_id !== req.user.entreprise_id) {
    return res.status(403).json({
      success: false,
      message: 'Accès non autorisé à cet entrepôt'
    });
  }

  const result = await entrepotService.toggleEntrepotStatus(req.params.id);

  res.status(200).json({
    success: true,
    data: result
  });
}));

/**
 * DELETE /api/entrepots/:id - Supprimer un entrepôt
 */
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  // Vérifier que l'entrepôt existe et appartient à l'entreprise
  const existingEntrepot = await entrepotService.getEntrepotById(req.params.id);

  if (existingEntrepot.entreprise_id !== req.user.entreprise_id) {
    return res.status(403).json({
      success: false,
      message: 'Accès non autorisé à cet entrepôt'
    });
  }

  const result = await entrepotService.deleteEntrepot(req.params.id);

  res.status(200).json({
    success: true,
    ...result
  });
}));

module.exports = router;