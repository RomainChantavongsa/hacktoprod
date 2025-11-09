const express = require('express');
const router = express.Router();
const offreFretService = require('../services/OffreFretService');
const { authMiddleware, requireRole } = require('../utils/jwt');
const { validateCreateOffreFret, validateUpdateOffreFret, validateAttribuerTransporteur } = require('../middleware/validators/offreFretValidator');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/publiees', authMiddleware, asyncHandler(async (req, res) => {
  const offres = await offreFretService.getOffresPubliees();
  res.status(200).json({ success: true, count: offres.length, data: offres });
}));

router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const { statut, donneur_ordre_id, transporteur_id } = req.query;
  const offres = await offreFretService.getAllOffresFret({ statut, donneur_ordre_id, transporteur_id });
  res.status(200).json({ success: true, count: offres.length, data: offres });
}));

router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const offre = await offreFretService.getOffreFretById(req.params.id);
  res.status(200).json({ success: true, data: offre });
}));

router.post('/', authMiddleware, requireRole('admin', 'donneur_ordre'), validateCreateOffreFret, asyncHandler(async (req, res) => {
  const offre = await offreFretService.createOffreFret(req.body);
  res.status(201).json({ success: true, message: 'Offre de fret créée avec succès', data: offre });
}));

router.post('/:id/attribuer', authMiddleware, requireRole('admin', 'donneur_ordre'), validateAttribuerTransporteur, asyncHandler(async (req, res) => {
  const { transporteur_id } = req.body;
  const result = await offreFretService.attribuerTransporteur(req.params.id, transporteur_id);
  res.status(200).json({ success: true, message: 'Transporteur attribué avec succès', data: result });
}));

router.post('/:id/en-cours', authMiddleware, requireRole('admin', 'transporteur'), asyncHandler(async (req, res) => {
  const result = await offreFretService.marquerEnCours(req.params.id);
  res.status(200).json({ success: true, message: 'Offre marquée comme en cours', data: result });
}));

router.post('/:id/completer', authMiddleware, requireRole('admin', 'transporteur', 'donneur_ordre'), asyncHandler(async (req, res) => {
  const result = await offreFretService.marquerCompletee(req.params.id);
  res.status(200).json({ success: true, message: 'Offre marquée comme complétée', data: result });
}));

router.post('/:id/annuler', authMiddleware, requireRole('admin', 'donneur_ordre'), asyncHandler(async (req, res) => {
  const result = await offreFretService.annulerOffre(req.params.id);
  res.status(200).json({ success: true, message: 'Offre annulée', data: result });
}));

router.put('/:id', authMiddleware, requireRole('admin', 'donneur_ordre'), validateUpdateOffreFret, asyncHandler(async (req, res) => {
  const offre = await offreFretService.updateOffreFret(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Offre de fret mise à jour avec succès', data: offre });
}));

router.delete('/:id', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const result = await offreFretService.deleteOffreFret(req.params.id);
  res.status(200).json({ success: true, ...result });
}));

module.exports = router;
