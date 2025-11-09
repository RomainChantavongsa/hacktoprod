const { Transporteur } = require('../models');

/**
 * Service pour gérer la logique métier des transporteurs
 */
class TransporteurService {
  /**
   * Créer un nouveau transporteur
   */
  async createTransporteur(transporteurData) {
    const {
      nom_entreprise,
      type_structure,
      siret,
      email_contact,
      telephone,
      adresse_siege,
      capacite_max_tonnes,
      digitalisation_active
    } = transporteurData;

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

    return this._formatTransporteur(transporteur);
  }

  /**
   * Récupérer tous les transporteurs
   */
  async getAllTransporteurs() {
    const transporteurs = await Transporteur.getAll();
    return transporteurs.map(t => this._formatTransporteur(t));
  }

  /**
   * Récupérer un transporteur par ID
   */
  async getTransporteurById(transporteurId) {
    const transporteur = await Transporteur.getFromId(transporteurId);

    if (!transporteur) {
      const error = new Error('Transporteur non trouvé');
      error.statusCode = 404;
      throw error;
    }

    return this._formatTransporteur(transporteur);
  }

  /**
   * Mettre à jour un transporteur
   */
  async updateTransporteur(transporteurId, updateData) {
    const transporteur = await Transporteur.getFromId(transporteurId);

    if (!transporteur) {
      const error = new Error('Transporteur non trouvé');
      error.statusCode = 404;
      throw error;
    }

    const {
      nom_entreprise,
      type_structure,
      siret,
      email_contact,
      telephone,
      adresse_siege,
      capacite_max_tonnes,
      digitalisation_active
    } = updateData;

    if (nom_entreprise) transporteur.setNomEntreprise(nom_entreprise);
    if (type_structure) transporteur.setTypeStructure(type_structure);
    if (siret) transporteur.setSiret(siret);
    if (email_contact) transporteur.setEmailContact(email_contact);
    if (telephone) transporteur.setTelephone(telephone);
    if (adresse_siege) transporteur.setAdresseSiege(adresse_siege);
    if (capacite_max_tonnes !== undefined) transporteur.setCapaciteMaxTonnes(capacite_max_tonnes);
    if (digitalisation_active !== undefined) transporteur.setDigitalisationActive(digitalisation_active);

    await transporteur.save();

    return this._formatTransporteur(transporteur);
  }

  /**
   * Supprimer un transporteur
   */
  async deleteTransporteur(transporteurId) {
    const transporteur = await Transporteur.getFromId(transporteurId);

    if (!transporteur) {
      const error = new Error('Transporteur non trouvé');
      error.statusCode = 404;
      throw error;
    }

    await transporteur.delete();

    return { message: 'Transporteur supprimé avec succès' };
  }

  /**
   * Formater un transporteur pour la réponse
   */
  _formatTransporteur(transporteur) {
    return {
      id: transporteur.getId(),
      nom_entreprise: transporteur.getNomEntreprise(),
      type_structure: transporteur.getTypeStructure(),
      siret: transporteur.getSiret(),
      email_contact: transporteur.getEmailContact(),
      telephone: transporteur.getTelephone(),
      adresse_siege: transporteur.getAdresseSiege(),
      capacite_max_tonnes: transporteur.getCapaciteMaxTonnes(),
      digitalisation_active: transporteur.getDigitalisationActive()
    };
  }
}

module.exports = new TransporteurService();
