const Annuaire = require('../models/Annuaire');
const Utilisateur = require('../models/Utilisateur');

/**
 * Service pour gérer l'annuaire des coordonnées de l'entreprise
 */
class AnnuaireService {
  /**
   * Récupérer toutes les coordonnées de l'annuaire d'une entreprise
   */
  async getAnnuaireEntreprise(entrepriseId) {
    const entrees = await Annuaire.getByEntreprise(entrepriseId, { est_actif: true });

    return entrees.map(entree => entree.toSafeObject());
  }

  /**
   * Créer une nouvelle entrée d'annuaire
   */
  async createEntreeAnnuaire(entrepriseId, data, createdBy) {
    const annuaire = new Annuaire();

    const entreeData = {
      entreprise_id: entrepriseId,
      nom: data.nom,
      prenom: data.prenom,
      fonction: data.fonction,
      service: data.service,
      email: data.email,
      telephone_fixe: data.telephone_fixe,
      telephone_mobile: data.telephone_mobile,
      telephone_professionnel: data.telephone_professionnel,
      adresse_professionnelle: data.adresse_professionnelle,
      code_postal_professionnel: data.code_postal_professionnel,
      ville_professionnelle: data.ville_professionnelle,
      notes: data.notes,
      est_actif: data.est_actif !== undefined ? data.est_actif : true,
      created_by: createdBy
    };

    return await annuaire.create(entreeData);
  }

  /**
   * Mettre à jour une entrée d'annuaire
   */
  async updateEntreeAnnuaire(id, entrepriseId, data, updatedBy) {
    // Vérifier que l'entrée appartient à l'entreprise
    const belongsToEntreprise = await Annuaire.belongsToEntreprise(id, entrepriseId);
    if (!belongsToEntreprise) {
      throw new Error('Entrée d\'annuaire non trouvée ou accès non autorisé');
    }

    const annuaire = new Annuaire();
    const updateData = {
      ...data,
      updated_by: updatedBy
    };

    return await annuaire.update(id, updateData);
  }

  /**
   * Supprimer une entrée d'annuaire
   */
  async deleteEntreeAnnuaire(id, entrepriseId) {
    // Vérifier que l'entrée appartient à l'entreprise
    const belongsToEntreprise = await Annuaire.belongsToEntreprise(id, entrepriseId);
    if (!belongsToEntreprise) {
      throw new Error('Entrée d\'annuaire non trouvée ou accès non autorisé');
    }

    const annuaire = new Annuaire();
    return await annuaire.delete(id);
  }

  /**
   * Récupérer une entrée d'annuaire par ID
   */
  async getEntreeAnnuaireById(id, entrepriseId) {
    const entree = await Annuaire.getById(id);

    if (!entree || entree.getEntrepriseId() !== entrepriseId) {
      throw new Error('Entrée d\'annuaire non trouvée ou accès non autorisé');
    }

    return entree.toSafeObject();
  }
}

module.exports = new AnnuaireService();