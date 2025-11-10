const express = require('express');
const router = express.Router({ mergeParams: true });
const propositionService = require('../services/PropositionOffreService');
const { authMiddleware, requireRole, requireEntrepriseType } = require('../utils/jwt');
const { asyncHandler } = require('../middleware/errorHandler');

// Soumettre une proposition (transporteur)
router.post('/', authMiddleware, requireEntrepriseType('transporteur'), asyncHandler(async (req,res)=>{
  const { entreprise_id } = req.user || {};
  const { prix_propose, message } = req.body || {};
  const result = await propositionService.soumettreProposition(req.params.offreId, entreprise_id, { prix_propose, message });
  res.status(201).json({ success:true, data: result });
}));

// Lister propositions pour une offre (donneur d'ordre)
router.get('/', authMiddleware, requireEntrepriseType('donneur_ordre'), asyncHandler(async (req,res)=>{
  const list = await propositionService.listerPourOffre(req.params.offreId);
  res.status(200).json({ success:true, count: list.length, data: list });
}));

// Accepter une proposition (donneur d'ordre)
router.post('/:propositionId/accepter', authMiddleware, requireEntrepriseType('donneur_ordre'), asyncHandler(async (req,res)=>{
  const result = await propositionService.accepter(req.params.offreId, req.params.propositionId);
  res.status(200).json({ success:true, message: 'Proposition acceptée', data: result });
}));

module.exports = router;