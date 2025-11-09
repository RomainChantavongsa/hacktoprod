const express = require('express');
const router = express.Router();
const donneurOrdreService = require('../services/DonneurOrdreService');
const { authMiddleware, requireRole } = require('../utils/jwt');
const { validateCreateDonneurOrdre, validateUpdateDonneurOrdre } = require('../middleware/validators/donneurOrdreValidator');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * GET /api/donneurs-ordre - Récupérer tous les donneurs d'ordre
 */
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const donneursOrdre = await donneurOrdreService.getAllDonneursOrdre();
  
  res.status(200).json({
    success: true,
    count: donneursOrdre.length,
    data: donneursOrdre
  });
}));

/**
 * GET /api/donneurs-ordre/:id - Récupérer un donneur d'ordre par ID
 */
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const donneurOrdre = await donneurOrdreService.getDonneurOrdreById(req.params.id);
  
  res.status(200).json({
    success: true,
    data: donneurOrdre
  });
}));

/**
 * POST /api/donneurs-ordre - Créer un nouveau donneur d'ordre
 */
router.post('/', authMiddleware, requireRole('admin', 'donneur_ordre'), validateCreateDonneurOrdre, asyncHandler(async (req, res) => {
  const donneurOrdre = await donneurOrdreService.createDonneurOrdre(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Donneur d\'ordre créé avec succès',
    data: donneurOrdre
  });
}));

/**
 * PUT /api/donneurs-ordre/:id - Mettre à jour un donneur d'ordre
 */
router.put('/:id', authMiddleware, requireRole('admin', 'donneur_ordre'), validateUpdateDonneurOrdre, asyncHandler(async (req, res) => {
  const donneurOrdre = await donneurOrdreService.updateDonneurOrdre(req.params.id, req.body);
  
  res.status(200).json({
    success: true,
    message: 'Donneur d\'ordre mis à jour avec succès',
    data: donneurOrdre
  });
}));

/**
 * DELETE /api/donneurs-ordre/:id - Supprimer un donneur d'ordre
 */
router.delete('/:id', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const result = await donneurOrdreService.deleteDonneurOrdre(req.params.id);
  
  res.status(200).json({
    success: true,
    ...result
  });
}));

module.exports = router;
