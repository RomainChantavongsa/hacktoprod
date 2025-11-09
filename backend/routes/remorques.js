const express = require('express');
const router = express.Router();
const remorqueService = require('../services/RemorqueService');
const { authMiddleware } = require('../utils/jwt');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Liste des remorques de l'entreprise courante
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const entrepriseId = req.user.entreprise_id;
  const data = await remorqueService.list(entrepriseId);
  res.json({ success: true, data });
}));

// Créer une remorque
router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  if (req.user.role_entreprise !== 'admin') {
    return res.status(403).json({ success: false, message: 'Seul un administrateur peut ajouter une remorque.' });
  }
  const entrepriseId = req.user.entreprise_id;
  const remorque = await remorqueService.create(entrepriseId, req.body);
  res.status(201).json({ success: true, data: remorque });
}));

// Récupérer une remorque
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const entrepriseId = req.user.entreprise_id;
  const remorque = await remorqueService.get(parseInt(req.params.id, 10), entrepriseId);
  res.json({ success: true, data: remorque });
}));

// Mettre à jour une remorque
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
  if (req.user.role_entreprise !== 'admin') {
    return res.status(403).json({ success: false, message: 'Seul un administrateur peut modifier une remorque.' });
  }
  const entrepriseId = req.user.entreprise_id;
  const remorque = await remorqueService.update(parseInt(req.params.id, 10), entrepriseId, req.body);
  res.json({ success: true, data: remorque, message: 'Remorque mise à jour' });
}));

// Supprimer une remorque
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  if (req.user.role_entreprise !== 'admin') {
    return res.status(403).json({ success: false, message: 'Seul un administrateur peut supprimer une remorque.' });
  }
  const entrepriseId = req.user.entreprise_id;
  const result = await remorqueService.delete(parseInt(req.params.id, 10), entrepriseId);
  res.json({ success: true, ...result });
}));

module.exports = router;
