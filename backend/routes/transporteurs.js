const express = require('express');
const router = express.Router();
const { Transporteur } = require('../models');
const { authMiddleware, requireRole } = require('../utils/jwt');

/**
 * GET /api/transporteurs - Récupérer tous les transporteurs
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transporteurs = await Transporteur.getAll();
    
    res.status(200).json({
      success: true,
      count: transporteurs.length,
      data: transporteurs.map(t => ({
        id: t.getId(),
        nom_entreprise: t.getNomEntreprise(),
        type_structure: t.getTypeStructure(),
        siret: t.getSiret(),
        email_contact: t.getEmailContact(),
        telephone: t.getTelephone(),
        adresse_siege: t.getAdresseSiege(),
        capacite_max_tonnes: t.getCapaciteMaxTonnes(),
        digitalisation_active: t.getDigitalisationActive()
      }))
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des transporteurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * GET /api/transporteurs/:id - Récupérer un transporteur par ID
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const transporteur = await Transporteur.getFromId(id);

    if (!transporteur) {
      return res.status(404).json({
        success: false,
        message: 'Transporteur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: transporteur.getId(),
        nom_entreprise: transporteur.getNomEntreprise(),
        type_structure: transporteur.getTypeStructure(),
        siret: transporteur.getSiret(),
        email_contact: transporteur.getEmailContact(),
        telephone: transporteur.getTelephone(),
        adresse_siege: transporteur.getAdresseSiege(),
        capacite_max_tonnes: transporteur.getCapaciteMaxTonnes(),
        digitalisation_active: transporteur.getDigitalisationActive()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du transporteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * POST /api/transporteurs - Créer un nouveau transporteur
 */
router.post('/', authMiddleware, requireRole('admin', 'transporteur'), async (req, res) => {
  try {
    const {
      nom_entreprise,
      type_structure,
      siret,
      email_contact,
      telephone,
      adresse_siege,
      capacite_max_tonnes,
      digitalisation_active
    } = req.body;

    // Validation
    if (!nom_entreprise || !siret || !email_contact) {
      return res.status(400).json({
        success: false,
        message: 'Nom d\'entreprise, SIRET et email sont requis'
      });
    }

    // Créer le transporteur
    const transporteur = await Transporteur.create({
      nom_entreprise,
      type_structure,
      siret,
      email_contact,
      telephone,
      adresse_siege,
      capacite_max_tonnes,
      digitalisation_active
    });

    res.status(201).json({
      success: true,
      message: 'Transporteur créé avec succès',
      data: {
        id: transporteur.getId(),
        nom_entreprise: transporteur.getNomEntreprise(),
        type_structure: transporteur.getTypeStructure(),
        siret: transporteur.getSiret(),
        email_contact: transporteur.getEmailContact(),
        telephone: transporteur.getTelephone(),
        adresse_siege: transporteur.getAdresseSiege(),
        capacite_max_tonnes: transporteur.getCapaciteMaxTonnes(),
        digitalisation_active: transporteur.getDigitalisationActive()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du transporteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * PUT /api/transporteurs/:id - Mettre à jour un transporteur
 */
router.put('/:id', authMiddleware, requireRole('admin', 'transporteur'), async (req, res) => {
  try {
    const { id } = req.params;
    const transporteur = await Transporteur.getFromId(id);

    if (!transporteur) {
      return res.status(404).json({
        success: false,
        message: 'Transporteur non trouvé'
      });
    }

    // Mise à jour des champs
    const {
      nom_entreprise,
      type_structure,
      siret,
      email_contact,
      telephone,
      adresse_siege,
      capacite_max_tonnes,
      digitalisation_active
    } = req.body;

    if (nom_entreprise) transporteur.setNomEntreprise(nom_entreprise);
    if (type_structure) transporteur.setTypeStructure(type_structure);
    if (siret) transporteur.setSiret(siret);
    if (email_contact) transporteur.setEmailContact(email_contact);
    if (telephone) transporteur.setTelephone(telephone);
    if (adresse_siege) transporteur.setAdresseSiege(adresse_siege);
    if (capacite_max_tonnes !== undefined) transporteur.setCapaciteMaxTonnes(capacite_max_tonnes);
    if (digitalisation_active !== undefined) transporteur.setDigitalisationActive(digitalisation_active);

    await transporteur.save();

    res.status(200).json({
      success: true,
      message: 'Transporteur mis à jour avec succès',
      data: {
        id: transporteur.getId(),
        nom_entreprise: transporteur.getNomEntreprise(),
        type_structure: transporteur.getTypeStructure(),
        siret: transporteur.getSiret(),
        email_contact: transporteur.getEmailContact(),
        telephone: transporteur.getTelephone(),
        adresse_siege: transporteur.getAdresseSiege(),
        capacite_max_tonnes: transporteur.getCapaciteMaxTonnes(),
        digitalisation_active: transporteur.getDigitalisationActive()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du transporteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * DELETE /api/transporteurs/:id - Supprimer un transporteur
 */
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const transporteur = await Transporteur.getFromId(id);

    if (!transporteur) {
      return res.status(404).json({
        success: false,
        message: 'Transporteur non trouvé'
      });
    }

    await transporteur.delete();

    res.status(200).json({
      success: true,
      message: 'Transporteur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du transporteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

module.exports = router;
