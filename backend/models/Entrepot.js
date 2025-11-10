const BaseModel = require('./BaseModel');

/**
 * Modèle pour la table entrepot
 */
class Entrepot extends BaseModel {
  constructor(data = {}) {
    super('entrepot', data);
  }

  // Getters
  getId() {
    return this.id;
  }

  getEntrepriseId() {
    return this.entreprise_id;
  }

  getNomEntrepot() {
    return this.nom_entrepot;
  }

  getTypeEntrepot() {
    return this.type_entrepot;
  }

  getAdresse() {
    return this.adresse;
  }

  getVille() {
    return this.ville;
  }

  getCodePostal() {
    return this.code_postal;
  }

  getPays() {
    return this.pays;
  }

  getCapaciteStockageM3() {
    return this.capacite_stockage_m3;
  }

  getTelephone() {
    return this.telephone;
  }

  getEmailContact() {
    return this.email_contact;
  }

  getHorairesOuverture() {
    return this.horaires_ouverture;
  }

  getEquipementsSpeciaux() {
    return this.equipements_speciaux;
  }

  getEstActif() {
    return this.est_actif;
  }

  getCreatedAt() {
    return this.created_at;
  }

  getUpdatedAt() {
    return this.updated_at;
  }

  // Setters
  setEntrepriseId(value) {
    this.entreprise_id = value;
    return this;
  }

  setNomEntrepot(value) {
    this.nom_entrepot = value;
    return this;
  }

  setTypeEntrepot(value) {
    this.type_entrepot = value;
    return this;
  }

  setAdresse(value) {
    this.adresse = value;
    return this;
  }

  setVille(value) {
    this.ville = value;
    return this;
  }

  setCodePostal(value) {
    this.code_postal = value;
    return this;
  }

  setPays(value) {
    this.pays = value;
    return this;
  }

  setCapaciteStockageM3(value) {
    this.capacite_stockage_m3 = value;
    return this;
  }

  setTelephone(value) {
    this.telephone = value;
    return this;
  }

  setEmailContact(value) {
    this.email_contact = value;
    return this;
  }

  setHorairesOuverture(value) {
    this.horaires_ouverture = value;
    return this;
  }

  setEquipementsSpeciaux(value) {
    this.equipements_speciaux = value;
    return this;
  }

  setEstActif(value) {
    this.est_actif = value;
    return this;
  }

  /**
   * Récupérer tous les entrepôts d'une entreprise
   */
  static async getEntrepotsByEntreprise(entrepriseId) {
    return await Entrepot.where('entreprise_id', '=', entrepriseId);
  }

  /**
   * Récupérer les entrepôts actifs d'une entreprise
   */
  static async getEntrepotsActifsByEntreprise(entrepriseId) {
    return await Entrepot.where('entreprise_id', '=', entrepriseId)
                         .where('est_actif', '=', true);
  }
}

module.exports = Entrepot;