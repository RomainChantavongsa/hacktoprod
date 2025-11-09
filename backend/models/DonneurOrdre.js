const BaseModel = require('./BaseModel');

/**
 * Modèle pour la table donneur_ordre
 */
class DonneurOrdre extends BaseModel {
  constructor(data = {}) {
    super('donneur_ordre', data);
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

  getTva() {
    return this.tva;
  }

  getRegistreCommerce() {
    return this.registre_commerce;
  }

  getAdresseSiege() {
    return this.adresse_siege;
  }

  getComplementAdresse() {
    return this.complement_adresse;
  }

  getCodePostal() {
    return this.code_postal;
  }

  getVille() {
    return this.ville;
  }

  getPays() {
    return this.pays;
  }

  getPhotoProfil() {
    return this.photo_profil;
  }

  getCreatedAt() {
    return this.created_at;
  }

  getUpdatedAt() {
    return this.updated_at;
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

  setTva(value) {
    this.tva = value;
    return this;
  }

  setRegistreCommerce(value) {
    this.registre_commerce = value;
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

  setComplementAdresse(value) {
    this.complement_adresse = value;
    return this;
  }

  setCodePostal(value) {
    this.code_postal = value;
    return this;
  }

  setVille(value) {
    this.ville = value;
    return this;
  }

  setPays(value) {
    this.pays = value;
    return this;
  }

  setPhotoProfil(value) {
    this.photo_profil = value;
    return this;
  }

  setFrequenceBesoin(value) {
    this.frequence_besoin = value;
    return this;
  }
}

module.exports = DonneurOrdre;
