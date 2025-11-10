const { Entrepot } = require('../models');

/**
 * Service pour gérer la logique métier des entrepôts
 */
class EntrepotService {
  /**
   * Créer un nouvel entrepôt
   */
  async createEntrepot(entrepotData) {
    const {
      entreprise_id,
      nom_entrepot,
      type_entrepot,
      adresse,
      ville,
      code_postal,
      pays,
      capacite_stockage_m3,
      telephone,
      email_contact,
      horaires_ouverture,
      equipements_speciaux,
      est_actif = true
    } = entrepotData;

    const entrepot = await Entrepot.create({
      entreprise_id,
      nom_entrepot,
      type_entrepot,
      adresse,
      ville,
      code_postal,
      pays: pays || 'France',
      capacite_stockage_m3,
      telephone,
      email_contact,
      horaires_ouverture,
      equipements_speciaux,
      est_actif
    });

    return this._formatEntrepot(entrepot);
  }

  /**
   * Récupérer tous les entrepôts d'une entreprise
   */
  async getEntrepotsByEntreprise(entrepriseId) {
    const entrepots = await Entrepot.getEntrepotsByEntreprise(entrepriseId);
    return entrepots.map(e => this._formatEntrepot(e));
  }

  /**
   * Récupérer les entrepôts actifs d'une entreprise
   */
  async getEntrepotsActifsByEntreprise(entrepriseId) {
    const entrepots = await Entrepot.getEntrepotsActifsByEntreprise(entrepriseId);
    return entrepots.map(e => this._formatEntrepot(e));
  }

  /**
   * Récupérer un entrepôt par ID
   */
  async getEntrepotById(entrepotId) {
    const entrepot = await Entrepot.getFromId(entrepotId);

    if (!entrepot) {
      const error = new Error('Entrepôt non trouvé');
      error.statusCode = 404;
      throw error;
    }

    return this._formatEntrepot(entrepot);
  }

  /**
   * Mettre à jour un entrepôt
   */
  async updateEntrepot(entrepotId, updateData) {
    const entrepot = await Entrepot.getFromId(entrepotId);

    if (!entrepot) {
      const error = new Error('Entrepôt non trouvé');
      error.statusCode = 404;
      throw error;
    }

    const {
      nom_entrepot,
      type_entrepot,
      adresse,
      ville,
      code_postal,
      pays,
      capacite_stockage_m3,
      telephone,
      email_contact,
      horaires_ouverture,
      equipements_speciaux,
      est_actif
    } = updateData;

    if (nom_entrepot) entrepot.setNomEntrepot(nom_entrepot);
    if (type_entrepot !== undefined) entrepot.setTypeEntrepot(type_entrepot);
    if (adresse) entrepot.setAdresse(adresse);
    if (ville) entrepot.setVille(ville);
    if (code_postal) entrepot.setCodePostal(code_postal);
    if (pays) entrepot.setPays(pays);
    if (capacite_stockage_m3 !== undefined) entrepot.setCapaciteStockageM3(capacite_stockage_m3);
    if (telephone !== undefined) entrepot.setTelephone(telephone);
    if (email_contact !== undefined) entrepot.setEmailContact(email_contact);
    if (horaires_ouverture !== undefined) entrepot.setHorairesOuverture(horaires_ouverture);
    if (equipements_speciaux !== undefined) entrepot.setEquipementsSpeciaux(equipements_speciaux);
    if (est_actif !== undefined) entrepot.setEstActif(est_actif);

    await entrepot.save();

    return this._formatEntrepot(entrepot);
  }

  /**
   * Supprimer un entrepôt
   */
  async deleteEntrepot(entrepotId) {
    const entrepot = await Entrepot.getFromId(entrepotId);

    if (!entrepot) {
      const error = new Error('Entrepôt non trouvé');
      error.statusCode = 404;
      throw error;
    }

    await entrepot.delete();

    return { message: 'Entrepôt supprimé avec succès' };
  }

  /**
   * Activer/désactiver un entrepôt
   */
  async toggleEntrepotStatus(entrepotId) {
    const entrepot = await Entrepot.getFromId(entrepotId);

    if (!entrepot) {
      const error = new Error('Entrepôt non trouvé');
      error.statusCode = 404;
      throw error;
    }

    const newStatus = !entrepot.getEstActif();
    entrepot.setEstActif(newStatus);
    await entrepot.save();

    return {
      id: entrepot.getId(),
      est_actif: newStatus,
      message: `Entrepôt ${newStatus ? 'activé' : 'désactivé'} avec succès`
    };
  }

  /**
   * Formater un entrepôt pour la réponse
   */
  _formatEntrepot(entrepot) {
    return {
      id: entrepot.getId(),
      entreprise_id: entrepot.getEntrepriseId(),
      nom_entrepot: entrepot.getNomEntrepot(),
      type_entrepot: entrepot.getTypeEntrepot(),
      adresse: entrepot.getAdresse(),
      ville: entrepot.getVille(),
      code_postal: entrepot.getCodePostal(),
      pays: entrepot.getPays(),
      capacite_stockage_m3: entrepot.getCapaciteStockageM3(),
      telephone: entrepot.getTelephone(),
      email_contact: entrepot.getEmailContact(),
      horaires_ouverture: entrepot.getHorairesOuverture(),
      equipements_speciaux: entrepot.getEquipementsSpeciaux(),
      est_actif: entrepot.getEstActif(),
      created_at: entrepot.getCreatedAt(),
      updated_at: entrepot.getUpdatedAt()
    };
  }
}

module.exports = new EntrepotService();