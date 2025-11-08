const BaseModel = require('./BaseModel');

/**
 * Modèle pour la table transporteur
 */
class Transporteur extends BaseModel {
  constructor(data = {}) {
    super('transporteur', data);
  }

  // Getters
  getId() {
    return this.id;
  }

  getNomEntreprise() {
    return this.nom_entreprise;
  }

  getTypeStructure() {
    return this.type_structure;
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

  getAdresseSiege() {
    return this.adresse_siege;
  }

  getCapaciteMaxTonnes() {
    return this.capacite_max_tonnes;
  }

  getDigitalisationActive() {
    return this.digitalisation_active;
  }

  // Setters
  setNomEntreprise(value) {
    this.nom_entreprise = value;
    return this;
  }

  setTypeStructure(value) {
    this.type_structure = value;
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

  setAdresseSiege(value) {
    this.adresse_siege = value;
    return this;
  }

  setCapaciteMaxTonnes(value) {
    this.capacite_max_tonnes = value;
    return this;
  }

  setDigitalisationActive(value) {
    this.digitalisation_active = value;
    return this;
  }
}

module.exports = Transporteur;
