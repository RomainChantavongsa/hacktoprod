const express = require('express');
const router = express.Router();
const { OffreFret } = require('../models');
const { authMiddleware, requireRole } = require('../utils/jwt');

/**
 * GET /api/offres-fret - Récupérer toutes les offres de fret
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { statut, donneur_ordre_id, transporteur_id } = req.query;
    
    let offres;
    
    // Filtrer par statut si spécifié
    if (statut) {
      offres = await OffreFret.where('statut_offre', '=', statut);
    }
    // Filtrer par donneur d'ordre si spécifié
    else if (donneur_ordre_id) {
      offres = await OffreFret.getOffresByDonneurOrdre(donneur_ordre_id);
    }
    // Filtrer par transporteur si spécifié
    else if (transporteur_id) {
      offres = await OffreFret.getOffresByTransporteur(transporteur_id);
    }
    // Sinon récupérer toutes les offres
    else {
      offres = await OffreFret.getAll();
    }
    
    res.status(200).json({
      success: true,
      count: offres.length,
      data: offres.map(o => ({
        id: o.getId(),
        donneur_ordre_id: o.getDonneurOrdreId(),
        transporteur_attribue_id: o.getTransporteurAttribueId(),
        date_publication: o.getDatePublication(),
        statut_offre: o.getStatutOffre(),
        poids_marchandise_kg: o.getPoidsMarchandiseKg(),
        volume_m3: o.getVolumeM3(),
        type_marchandise: o.getTypeMarchandise(),
        adresse_chargement: o.getAdresseChargement(),
        ville_chargement: o.getVilleChargement(),
        code_postal_chargement: o.getCodePostalChargement(),
        adresse_livraison: o.getAdresseLivraison(),
        ville_livraison: o.getVilleLivraison(),
        code_postal_livraison: o.getCodePostalLivraison(),
        type_vehicule_souhaite: o.getTypeVehiculeSouhaite(),
        date_chargement_prevue: o.getDateChargementPrevue(),
        conditions_speciales: o.getConditionsSpeciales(),
        prix_propose: o.getPrixPropose()
      }))
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des offres de fret:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * GET /api/offres-fret/publiees - Récupérer toutes les offres publiées (disponibles)
 */
router.get('/publiees', authMiddleware, async (req, res) => {
  try {
    const offres = await OffreFret.getOffresPubliees();
    
    res.status(200).json({
      success: true,
      count: offres.length,
      data: offres.map(o => ({
        id: o.getId(),
        donneur_ordre_id: o.getDonneurOrdreId(),
        date_publication: o.getDatePublication(),
        statut_offre: o.getStatutOffre(),
        poids_marchandise_kg: o.getPoidsMarchandiseKg(),
        volume_m3: o.getVolumeM3(),
        type_marchandise: o.getTypeMarchandise(),
        adresse_chargement: o.getAdresseChargement(),
        ville_chargement: o.getVilleChargement(),
        code_postal_chargement: o.getCodePostalChargement(),
        adresse_livraison: o.getAdresseLivraison(),
        ville_livraison: o.getVilleLivraison(),
        code_postal_livraison: o.getCodePostalLivraison(),
        type_vehicule_souhaite: o.getTypeVehiculeSouhaite(),
        date_chargement_prevue: o.getDateChargementPrevue(),
        conditions_speciales: o.getConditionsSpeciales(),
        prix_propose: o.getPrixPropose()
      }))
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des offres publiées:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * GET /api/offres-fret/:id - Récupérer une offre de fret par ID
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const offre = await OffreFret.getFromId(id);

    if (!offre) {
      return res.status(404).json({
        success: false,
        message: 'Offre de fret non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: offre.getId(),
        donneur_ordre_id: offre.getDonneurOrdreId(),
        transporteur_attribue_id: offre.getTransporteurAttribueId(),
        date_publication: offre.getDatePublication(),
        statut_offre: offre.getStatutOffre(),
        poids_marchandise_kg: offre.getPoidsMarchandiseKg(),
        volume_m3: offre.getVolumeM3(),
        type_marchandise: offre.getTypeMarchandise(),
        adresse_chargement: offre.getAdresseChargement(),
        ville_chargement: offre.getVilleChargement(),
        code_postal_chargement: offre.getCodePostalChargement(),
        adresse_livraison: offre.getAdresseLivraison(),
        ville_livraison: offre.getVilleLivraison(),
        code_postal_livraison: offre.getCodePostalLivraison(),
        type_vehicule_souhaite: offre.getTypeVehiculeSouhaite(),
        date_chargement_prevue: offre.getDateChargementPrevue(),
        conditions_speciales: offre.getConditionsSpeciales(),
        prix_propose: offre.getPrixPropose()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'offre de fret:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * POST /api/offres-fret - Créer une nouvelle offre de fret
 */
router.post('/', authMiddleware, requireRole('admin', 'donneur_ordre'), async (req, res) => {
  try {
    const {
      donneur_ordre_id,
      poids_marchandise_kg,
      volume_m3,
      type_marchandise,
      adresse_chargement,
      ville_chargement,
      code_postal_chargement,
      adresse_livraison,
      ville_livraison,
      code_postal_livraison,
      type_vehicule_souhaite,
      date_chargement_prevue,
      conditions_speciales,
      prix_propose
    } = req.body;

    // Validation
    if (!donneur_ordre_id || !poids_marchandise_kg || !type_marchandise || 
        !adresse_chargement || !ville_chargement || !code_postal_chargement ||
        !adresse_livraison || !ville_livraison || !code_postal_livraison ||
        !date_chargement_prevue) {
      return res.status(400).json({
        success: false,
        message: 'Champs requis manquants'
      });
    }

    // Créer l'offre
    const offre = await OffreFret.create({
      donneur_ordre_id,
      poids_marchandise_kg,
      volume_m3,
      type_marchandise,
      adresse_chargement,
      ville_chargement,
      code_postal_chargement,
      adresse_livraison,
      ville_livraison,
      code_postal_livraison,
      type_vehicule_souhaite,
      date_chargement_prevue,
      conditions_speciales,
      prix_propose,
      statut_offre: 'Publiee'
    });

    res.status(201).json({
      success: true,
      message: 'Offre de fret créée avec succès',
      data: {
        id: offre.getId(),
        donneur_ordre_id: offre.getDonneurOrdreId(),
        transporteur_attribue_id: offre.getTransporteurAttribueId(),
        date_publication: offre.getDatePublication(),
        statut_offre: offre.getStatutOffre(),
        poids_marchandise_kg: offre.getPoidsMarchandiseKg(),
        volume_m3: offre.getVolumeM3(),
        type_marchandise: offre.getTypeMarchandise(),
        adresse_chargement: offre.getAdresseChargement(),
        ville_chargement: offre.getVilleChargement(),
        code_postal_chargement: offre.getCodePostalChargement(),
        adresse_livraison: offre.getAdresseLivraison(),
        ville_livraison: offre.getVilleLivraison(),
        code_postal_livraison: offre.getCodePostalLivraison(),
        type_vehicule_souhaite: offre.getTypeVehiculeSouhaite(),
        date_chargement_prevue: offre.getDateChargementPrevue(),
        conditions_speciales: offre.getConditionsSpeciales(),
        prix_propose: offre.getPrixPropose()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'offre de fret:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * PUT /api/offres-fret/:id - Mettre à jour une offre de fret
 */
router.put('/:id', authMiddleware, requireRole('admin', 'donneur_ordre'), async (req, res) => {
  try {
    const { id } = req.params;
    const offre = await OffreFret.getFromId(id);

    if (!offre) {
      return res.status(404).json({
        success: false,
        message: 'Offre de fret non trouvée'
      });
    }

    // Mise à jour des champs
    const {
      poids_marchandise_kg,
      volume_m3,
      type_marchandise,
      adresse_chargement,
      ville_chargement,
      code_postal_chargement,
      adresse_livraison,
      ville_livraison,
      code_postal_livraison,
      type_vehicule_souhaite,
      date_chargement_prevue,
      conditions_speciales,
      prix_propose,
      statut_offre
    } = req.body;

    if (poids_marchandise_kg !== undefined) offre.setPoidsMarchandiseKg(poids_marchandise_kg);
    if (volume_m3 !== undefined) offre.setVolumeM3(volume_m3);
    if (type_marchandise) offre.setTypeMarchandise(type_marchandise);
    if (adresse_chargement) offre.setAdresseChargement(adresse_chargement);
    if (ville_chargement) offre.setVilleChargement(ville_chargement);
    if (code_postal_chargement) offre.setCodePostalChargement(code_postal_chargement);
    if (adresse_livraison) offre.setAdresseLivraison(adresse_livraison);
    if (ville_livraison) offre.setVilleLivraison(ville_livraison);
    if (code_postal_livraison) offre.setCodePostalLivraison(code_postal_livraison);
    if (type_vehicule_souhaite) offre.setTypeVehiculeSouhaite(type_vehicule_souhaite);
    if (date_chargement_prevue) offre.setDateChargementPrevue(date_chargement_prevue);
    if (conditions_speciales) offre.setConditionsSpeciales(conditions_speciales);
    if (prix_propose !== undefined) offre.setPrixPropose(prix_propose);
    if (statut_offre) offre.setStatutOffre(statut_offre);

    await offre.save();

    res.status(200).json({
      success: true,
      message: 'Offre de fret mise à jour avec succès',
      data: {
        id: offre.getId(),
        donneur_ordre_id: offre.getDonneurOrdreId(),
        transporteur_attribue_id: offre.getTransporteurAttribueId(),
        date_publication: offre.getDatePublication(),
        statut_offre: offre.getStatutOffre(),
        poids_marchandise_kg: offre.getPoidsMarchandiseKg(),
        volume_m3: offre.getVolumeM3(),
        type_marchandise: offre.getTypeMarchandise(),
        adresse_chargement: offre.getAdresseChargement(),
        ville_chargement: offre.getVilleChargement(),
        code_postal_chargement: offre.getCodePostalChargement(),
        adresse_livraison: offre.getAdresseLivraison(),
        ville_livraison: offre.getVilleLivraison(),
        code_postal_livraison: offre.getCodePostalLivraison(),
        type_vehicule_souhaite: offre.getTypeVehiculeSouhaite(),
        date_chargement_prevue: offre.getDateChargementPrevue(),
        conditions_speciales: offre.getConditionsSpeciales(),
        prix_propose: offre.getPrixPropose()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'offre de fret:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * POST /api/offres-fret/:id/attribuer - Attribuer un transporteur à une offre
 */
router.post('/:id/attribuer', authMiddleware, requireRole('admin', 'donneur_ordre'), async (req, res) => {
  try {
    const { id } = req.params;
    const { transporteur_id } = req.body;

    if (!transporteur_id) {
      return res.status(400).json({
        success: false,
        message: 'ID du transporteur requis'
      });
    }

    const offre = await OffreFret.getFromId(id);

    if (!offre) {
      return res.status(404).json({
        success: false,
        message: 'Offre de fret non trouvée'
      });
    }

    await offre.attribuerTransporteur(transporteur_id);

    res.status(200).json({
      success: true,
      message: 'Transporteur attribué avec succès',
      data: {
        id: offre.getId(),
        statut_offre: offre.getStatutOffre(),
        transporteur_attribue_id: offre.getTransporteurAttribueId()
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'attribution du transporteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * POST /api/offres-fret/:id/en-cours - Marquer une offre comme en cours
 */
router.post('/:id/en-cours', authMiddleware, requireRole('admin', 'transporteur'), async (req, res) => {
  try {
    const { id } = req.params;
    const offre = await OffreFret.getFromId(id);

    if (!offre) {
      return res.status(404).json({
        success: false,
        message: 'Offre de fret non trouvée'
      });
    }

    await offre.marquerEnCours();

    res.status(200).json({
      success: true,
      message: 'Offre marquée comme en cours',
      data: {
        id: offre.getId(),
        statut_offre: offre.getStatutOffre()
      }
    });
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * POST /api/offres-fret/:id/completer - Marquer une offre comme complétée
 */
router.post('/:id/completer', authMiddleware, requireRole('admin', 'transporteur', 'donneur_ordre'), async (req, res) => {
  try {
    const { id } = req.params;
    const offre = await OffreFret.getFromId(id);

    if (!offre) {
      return res.status(404).json({
        success: false,
        message: 'Offre de fret non trouvée'
      });
    }

    await offre.marquerCompletee();

    res.status(200).json({
      success: true,
      message: 'Offre marquée comme complétée',
      data: {
        id: offre.getId(),
        statut_offre: offre.getStatutOffre()
      }
    });
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * POST /api/offres-fret/:id/annuler - Annuler une offre
 */
router.post('/:id/annuler', authMiddleware, requireRole('admin', 'donneur_ordre'), async (req, res) => {
  try {
    const { id } = req.params;
    const offre = await OffreFret.getFromId(id);

    if (!offre) {
      return res.status(404).json({
        success: false,
        message: 'Offre de fret non trouvée'
      });
    }

    await offre.annuler();

    res.status(200).json({
      success: true,
      message: 'Offre annulée',
      data: {
        id: offre.getId(),
        statut_offre: offre.getStatutOffre()
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'annulation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * DELETE /api/offres-fret/:id - Supprimer une offre de fret
 */
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const offre = await OffreFret.getFromId(id);

    if (!offre) {
      return res.status(404).json({
        success: false,
        message: 'Offre de fret non trouvée'
      });
    }

    await offre.delete();

    res.status(200).json({
      success: true,
      message: 'Offre de fret supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'offre de fret:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

module.exports = router;
