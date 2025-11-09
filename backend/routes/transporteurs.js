const express = require('express');
const router = express.Router();
const transporteurService = require('../services/TransporteurService');
const { authMiddleware, requireRole } = require('../utils/jwt');
const { validateCreateTransporteur, validateUpdateTransporteur } = require('../middleware/validators/transporteurValidator');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * GET /api/transporteurs - Récupérer tous les transporteurs
 */
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const transporteurs = await transporteurService.getAllTransporteurs();
  
  res.status(200).json({
    success: true,
    count: transporteurs.length,
    data: transporteurs
  });
}));

/**
 * GET /api/transporteurs/:id - Récupérer un transporteur par ID
 */
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const transporteur = await transporteurService.getTransporteurById(req.params.id);
  
  res.status(200).json({
    success: true,
    data: transporteur
  });
}));

/**
 * POST /api/transporteurs - Créer un nouveau transporteur
 */
router.post('/', authMiddleware, requireRole('admin', 'transporteur'), validateCreateTransporteur, asyncHandler(async (req, res) => {
  const transporteur = await transporteurService.createTransporteur(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Transporteur créé avec succès',
    data: transporteur
  });
}));

/**
 * PUT /api/transporteurs/:id - Mettre à jour un transporteur
 */
router.put('/:id', authMiddleware, requireRole('admin', 'transporteur'), validateUpdateTransporteur, asyncHandler(async (req, res) => {
  const transporteur = await transporteurService.updateTransporteur(req.params.id, req.body);
  
  res.status(200).json({
    success: true,
    message: 'Transporteur mis à jour avec succès',
    data: transporteur
  });
}));

/**
 * DELETE /api/transporteurs/:id - Supprimer un transporteur
 */
router.delete('/:id', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const result = await transporteurService.deleteTransporteur(req.params.id);
  
  res.status(200).json({
    success: true,
    ...result
  });
}));

module.exports = router;
