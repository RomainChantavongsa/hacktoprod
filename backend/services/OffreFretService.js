const { OffreFret } = require('../models');

/**
 * Service pour gérer la logique métier des offres de fret
 */
class OffreFretService {
  /**
   * Créer une nouvelle offre de fret
   */
  async createOffreFret(offreData) {
    const offre = await OffreFret.create({
      ...offreData,
      statut_offre: 'Publiee'
    });

    return this._formatOffreFret(offre);
  }

  /**
   * Récupérer toutes les offres de fret avec filtres optionnels
   */
  async getAllOffresFret(filters = {}) {
    const { statut, donneur_ordre_id, transporteur_id } = filters;
    
    let offres;
    
    if (statut) {
      offres = await OffreFret.where('statut_offre', '=', statut);
    } else if (donneur_ordre_id) {
      offres = await OffreFret.getOffresByDonneurOrdre(donneur_ordre_id);
    } else if (transporteur_id) {
      offres = await OffreFret.getOffresByTransporteur(transporteur_id);
    } else {
      offres = await OffreFret.getAll();
    }
    
    return offres.map(o => this._formatOffreFret(o));
  }

  /**
   * Récupérer les offres publiées (disponibles)
   */
  async getOffresPubliees() {
    const offres = await OffreFret.getOffresPubliees();
    return offres.map(o => this._formatOffreFret(o));
  }

  /**
   * Récupérer une offre de fret par ID
   */
  async getOffreFretById(offreId) {
    const offre = await OffreFret.getFromId(offreId);

    if (!offre) {
      const error = new Error('Offre de fret non trouvée');
      error.statusCode = 404;
      throw error;
    }

    return this._formatOffreFret(offre);
  }

  /**
   * Mettre à jour une offre de fret
   */
  async updateOffreFret(offreId, updateData) {
    const offre = await OffreFret.getFromId(offreId);

    if (!offre) {
      const error = new Error('Offre de fret non trouvée');
      error.statusCode = 404;
      throw error;
    }

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
    } = updateData;

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

    return this._formatOffreFret(offre);
  }

  /**
   * Attribuer un transporteur à une offre
   */
  async attribuerTransporteur(offreId, transporteurId) {
    const offre = await OffreFret.getFromId(offreId);

    if (!offre) {
      const error = new Error('Offre de fret non trouvée');
      error.statusCode = 404;
      throw error;
    }

    await offre.attribuerTransporteur(transporteurId);

    return {
      id: offre.getId(),
      statut_offre: offre.getStatutOffre(),
      transporteur_attribue_id: offre.getTransporteurAttribueId()
    };
  }

  /**
   * Marquer une offre comme en cours
   */
  async marquerEnCours(offreId) {
    const offre = await OffreFret.getFromId(offreId);

    if (!offre) {
      const error = new Error('Offre de fret non trouvée');
      error.statusCode = 404;
      throw error;
    }

    await offre.marquerEnCours();

    return {
      id: offre.getId(),
      statut_offre: offre.getStatutOffre()
    };
  }

  /**
   * Marquer une offre comme complétée
   */
  async marquerCompletee(offreId) {
    const offre = await OffreFret.getFromId(offreId);

    if (!offre) {
      const error = new Error('Offre de fret non trouvée');
      error.statusCode = 404;
      throw error;
    }

    await offre.marquerCompletee();

    return {
      id: offre.getId(),
      statut_offre: offre.getStatutOffre()
    };
  }

  /**
   * Annuler une offre
   */
  async annulerOffre(offreId) {
    const offre = await OffreFret.getFromId(offreId);

    if (!offre) {
      const error = new Error('Offre de fret non trouvée');
      error.statusCode = 404;
      throw error;
    }

    await offre.annuler();

    return {
      id: offre.getId(),
      statut_offre: offre.getStatutOffre()
    };
  }

  /**
   * Supprimer une offre de fret
   */
  async deleteOffreFret(offreId) {
    const offre = await OffreFret.getFromId(offreId);

    if (!offre) {
      const error = new Error('Offre de fret non trouvée');
      error.statusCode = 404;
      throw error;
    }

    await offre.delete();

    return { message: 'Offre de fret supprimée avec succès' };
  }

  /**
   * Formater une offre de fret pour la réponse
   */
  _formatOffreFret(offre) {
    return {
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
    };
  }
}

module.exports = new OffreFretService();
