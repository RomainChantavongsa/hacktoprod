const express = require('express');
const router = express.Router();
const vehiculeService = require('../services/VehiculeService');
const { authMiddleware } = require('../utils/jwt');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Liste des véhicules de l'entreprise courante
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const entrepriseId = req.user.entreprise_id;
  const data = await vehiculeService.list(entrepriseId);
  res.json({ success: true, data });
}));

// Créer un véhicule
router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  if (req.user.role_entreprise !== 'admin') {
    return res.status(403).json({ success: false, message: 'Seul un administrateur peut ajouter un véhicule.' });
  }
  const entrepriseId = req.user.entreprise_id;
  const vehicule = await vehiculeService.create(entrepriseId, req.body);
  res.status(201).json({ success: true, data: vehicule });
}));

// Récupérer un véhicule
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const entrepriseId = req.user.entreprise_id;
  const vehicule = await vehiculeService.get(parseInt(req.params.id, 10), entrepriseId);
  res.json({ success: true, data: vehicule });
}));

// Mettre à jour un véhicule
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
  if (req.user.role_entreprise !== 'admin') {
    return res.status(403).json({ success: false, message: 'Seul un administrateur peut modifier un véhicule.' });
  }
  const entrepriseId = req.user.entreprise_id;
  const vehicule = await vehiculeService.update(parseInt(req.params.id, 10), entrepriseId, req.body);
  res.json({ success: true, data: vehicule, message: 'Véhicule mis à jour' });
}));

// Supprimer un véhicule
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  if (req.user.role_entreprise !== 'admin') {
    return res.status(403).json({ success: false, message: 'Seul un administrateur peut supprimer un véhicule.' });
  }
  const entrepriseId = req.user.entreprise_id;
  const result = await vehiculeService.delete(parseInt(req.params.id, 10), entrepriseId);
  res.json({ success: true, ...result });
}));

module.exports = router;
