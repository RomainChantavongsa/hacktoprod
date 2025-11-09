const express = require('express');
const router = express.Router();
const ConducteurService = require('../services/ConducteurService');
const { conducteurValidationRules, validate } = require('../middleware/validators/conducteurValidator');
const { authMiddleware } = require('../utils/jwt');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/conducteurs - Liste tous les conducteurs de l'entreprise
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const entrepriseId = req.user.entreprise_id;
  const data = await ConducteurService.list(entrepriseId);
  res.json({ success: true, data });
}));

// GET /api/conducteurs/:id - Récupère un conducteur spécifique
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const entrepriseId = req.user.entreprise_id;
  const data = await ConducteurService.get(parseInt(id), entrepriseId);
  res.json({ success: true, data });
}));

// POST /api/conducteurs - Crée un nouveau conducteur
router.post('/', authMiddleware, conducteurValidationRules(), validate, asyncHandler(async (req, res) => {
  const entrepriseId = req.user.entreprise_id;
  const data = await ConducteurService.create(entrepriseId, req.body);
  res.status(201).json({ success: true, data });
}));

// PUT /api/conducteurs/:id - Met à jour un conducteur
router.put('/:id', authMiddleware, conducteurValidationRules(), validate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const entrepriseId = req.user.entreprise_id;
  const data = await ConducteurService.update(parseInt(id), entrepriseId, req.body);
  res.json({ success: true, data });
}));

// DELETE /api/conducteurs/:id - Supprime un conducteur
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const entrepriseId = req.user.entreprise_id;
  const result = await ConducteurService.delete(parseInt(id), entrepriseId);
  res.json({ success: true, message: result.message });
}));

module.exports = router;
