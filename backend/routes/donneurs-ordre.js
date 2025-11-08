const express = require('express');
const router = express.Router();
const { DonneurOrdre } = require('../models');
const { authMiddleware, requireRole } = require('../utils/jwt');

/**
 * GET /api/donneurs-ordre - Récupérer tous les donneurs d'ordre
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const donneursOrdre = await DonneurOrdre.getAll();
    
    res.status(200).json({
      success: true,
      count: donneursOrdre.length,
      data: donneursOrdre.map(d => ({
        id: d.getId(),
        nom_entreprise: d.getNomEntreprise(),
        type_acteur: d.getTypeActeur(),
        siret: d.getSiret(),
        email_contact: d.getEmailContact(),
        telephone: d.getTelephone(),
        frequence_besoin: d.getFrequenceBesoin()
      }))
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des donneurs d\'ordre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * GET /api/donneurs-ordre/:id - Récupérer un donneur d'ordre par ID
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const donneurOrdre = await DonneurOrdre.getFromId(id);

    if (!donneurOrdre) {
      return res.status(404).json({
        success: false,
        message: 'Donneur d\'ordre non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: donneurOrdre.getId(),
        nom_entreprise: donneurOrdre.getNomEntreprise(),
        type_acteur: donneurOrdre.getTypeActeur(),
        siret: donneurOrdre.getSiret(),
        email_contact: donneurOrdre.getEmailContact(),
        telephone: donneurOrdre.getTelephone(),
        frequence_besoin: donneurOrdre.getFrequenceBesoin()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du donneur d\'ordre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * POST /api/donneurs-ordre - Créer un nouveau donneur d'ordre
 */
router.post('/', authMiddleware, requireRole('admin', 'donneur_ordre'), async (req, res) => {
  try {
    const {
      nom_entreprise,
      type_acteur,
      siret,
      email_contact,
      telephone,
      frequence_besoin
    } = req.body;

    // Validation
    if (!nom_entreprise || !siret || !email_contact) {
      return res.status(400).json({
        success: false,
        message: 'Nom d\'entreprise, SIRET et email sont requis'
      });
    }

    // Créer le donneur d'ordre
    const donneurOrdre = await DonneurOrdre.create({
      nom_entreprise,
      type_acteur,
      siret,
      email_contact,
      telephone,
      frequence_besoin
    });

    res.status(201).json({
      success: true,
      message: 'Donneur d\'ordre créé avec succès',
      data: {
        id: donneurOrdre.getId(),
        nom_entreprise: donneurOrdre.getNomEntreprise(),
        type_acteur: donneurOrdre.getTypeActeur(),
        siret: donneurOrdre.getSiret(),
        email_contact: donneurOrdre.getEmailContact(),
        telephone: donneurOrdre.getTelephone(),
        frequence_besoin: donneurOrdre.getFrequenceBesoin()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du donneur d\'ordre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * PUT /api/donneurs-ordre/:id - Mettre à jour un donneur d'ordre
 */
router.put('/:id', authMiddleware, requireRole('admin', 'donneur_ordre'), async (req, res) => {
  try {
    const { id } = req.params;
    const donneurOrdre = await DonneurOrdre.getFromId(id);

    if (!donneurOrdre) {
      return res.status(404).json({
        success: false,
        message: 'Donneur d\'ordre non trouvé'
      });
    }

    // Mise à jour des champs
    const {
      nom_entreprise,
      type_acteur,
      siret,
      email_contact,
      telephone,
      frequence_besoin
    } = req.body;

    if (nom_entreprise) donneurOrdre.setNomEntreprise(nom_entreprise);
    if (type_acteur) donneurOrdre.setTypeActeur(type_acteur);
    if (siret) donneurOrdre.setSiret(siret);
    if (email_contact) donneurOrdre.setEmailContact(email_contact);
    if (telephone) donneurOrdre.setTelephone(telephone);
    if (frequence_besoin) donneurOrdre.setFrequenceBesoin(frequence_besoin);

    await donneurOrdre.save();

    res.status(200).json({
      success: true,
      message: 'Donneur d\'ordre mis à jour avec succès',
      data: {
        id: donneurOrdre.getId(),
        nom_entreprise: donneurOrdre.getNomEntreprise(),
        type_acteur: donneurOrdre.getTypeActeur(),
        siret: donneurOrdre.getSiret(),
        email_contact: donneurOrdre.getEmailContact(),
        telephone: donneurOrdre.getTelephone(),
        frequence_besoin: donneurOrdre.getFrequenceBesoin()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du donneur d\'ordre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * DELETE /api/donneurs-ordre/:id - Supprimer un donneur d'ordre
 */
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const donneurOrdre = await DonneurOrdre.getFromId(id);

    if (!donneurOrdre) {
      return res.status(404).json({
        success: false,
        message: 'Donneur d\'ordre non trouvé'
      });
    }

    await donneurOrdre.delete();

    res.status(200).json({
      success: true,
      message: 'Donneur d\'ordre supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du donneur d\'ordre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

module.exports = router;
