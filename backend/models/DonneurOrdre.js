const BaseModel = require('./BaseModel');

/**
 * Modèle pour la table donneurs_ordre
 */
class DonneurOrdre extends BaseModel {
  constructor(data = {}) {
    super('donneurs_ordre', data);
  }

  // Getters
  getId() {
    return this.id;
  }

  getNomEntreprise() {
    return this.nom_entreprise;
  }

  getTypeActeur() {
    return this.type_acteur;
  }

  getSiret() {
    return this.siret;
  }

  getEmailContact() {
    return this.email_contact;
  }

  getTelephone() {
    return this.telephone;
  }

  getFrequenceBesoin() {
    return this.frequence_besoin;
  }

  // Setters
  setNomEntreprise(value) {
    this.nom_entreprise = value;
    return this;
  }

  setTypeActeur(value) {
    this.type_acteur = value;
    return this;
  }

  setSiret(value) {
    this.siret = value;
    return this;
  }

  setEmailContact(value) {
    this.email_contact = value;
    return this;
  }

  setTelephone(value) {
    this.telephone = value;
    return this;
  }

  setFrequenceBesoin(value) {
    this.frequence_besoin = value;
    return this;
  }
}

module.exports = DonneurOrdre;
