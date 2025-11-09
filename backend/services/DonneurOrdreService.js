const { DonneurOrdre } = require('../models');

/**
 * Service pour gérer la logique métier des donneurs d'ordre
 */
class DonneurOrdreService {
  /**
   * Créer un nouveau donneur d'ordre
   */
  async createDonneurOrdre(donneurOrdreData) {
    const {
      nom_entreprise,
      type_acteur,
      siret,
      email_contact,
      telephone,
      frequence_besoin
    } = donneurOrdreData;

    const donneurOrdre = await DonneurOrdre.create({
      nom_entreprise,
      type_acteur,
      siret,
      email_contact,
      telephone,
      frequence_besoin
    });

    return this._formatDonneurOrdre(donneurOrdre);
  }

  /**
   * Récupérer tous les donneurs d'ordre
   */
  async getAllDonneursOrdre() {
    const donneursOrdre = await DonneurOrdre.getAll();
    return donneursOrdre.map(d => this._formatDonneurOrdre(d));
  }

  /**
   * Récupérer un donneur d'ordre par ID
   */
  async getDonneurOrdreById(donneurOrdreId) {
    const donneurOrdre = await DonneurOrdre.getFromId(donneurOrdreId);

    if (!donneurOrdre) {
      const error = new Error('Donneur d\'ordre non trouvé');
      error.statusCode = 404;
      throw error;
    }

    return this._formatDonneurOrdre(donneurOrdre);
  }

  /**
   * Mettre à jour un donneur d'ordre
   */
  async updateDonneurOrdre(donneurOrdreId, updateData) {
    const donneurOrdre = await DonneurOrdre.getFromId(donneurOrdreId);

    if (!donneurOrdre) {
      const error = new Error('Donneur d\'ordre non trouvé');
      error.statusCode = 404;
      throw error;
    }

    const {
      nom_entreprise,
      type_acteur,
      siret,
      email_contact,
      telephone,
      frequence_besoin
    } = updateData;

    if (nom_entreprise) donneurOrdre.setNomEntreprise(nom_entreprise);
    if (type_acteur) donneurOrdre.setTypeActeur(type_acteur);
    if (siret) donneurOrdre.setSiret(siret);
    if (email_contact) donneurOrdre.setEmailContact(email_contact);
    if (telephone) donneurOrdre.setTelephone(telephone);
    if (frequence_besoin) donneurOrdre.setFrequenceBesoin(frequence_besoin);

    await donneurOrdre.save();

    return this._formatDonneurOrdre(donneurOrdre);
  }

  /**
   * Supprimer un donneur d'ordre
   */
  async deleteDonneurOrdre(donneurOrdreId) {
    const donneurOrdre = await DonneurOrdre.getFromId(donneurOrdreId);

    if (!donneurOrdre) {
      const error = new Error('Donneur d\'ordre non trouvé');
      error.statusCode = 404;
      throw error;
    }

    await donneurOrdre.delete();

    return { message: 'Donneur d\'ordre supprimé avec succès' };
  }

  /**
   * Formater un donneur d'ordre pour la réponse
   */
  _formatDonneurOrdre(donneurOrdre) {
    return {
      id: donneurOrdre.getId(),
      nom_entreprise: donneurOrdre.getNomEntreprise(),
      type_acteur: donneurOrdre.getTypeActeur(),
      siret: donneurOrdre.getSiret(),
      email_contact: donneurOrdre.getEmailContact(),
      telephone: donneurOrdre.getTelephone(),
      frequence_besoin: donneurOrdre.getFrequenceBesoin()
    };
  }
}

module.exports = new DonneurOrdreService();
