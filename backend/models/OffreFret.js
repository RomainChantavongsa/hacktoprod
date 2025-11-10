const BaseModel = require('./BaseModel');

/**
 * Modèle pour la table offre_fret
 */
class OffreFret extends BaseModel {
  constructor(data = {}) {
    // Mapper les noms de propriétés vers les vrais noms de colonnes SQL
    const mappedData = { ...data };
    
    // Si on reçoit donneur_ordre_id, le transformer en entreprise_donneur_ordre_id
    if (data.donneur_ordre_id !== undefined && data.entreprise_donneur_ordre_id === undefined) {
      mappedData.entreprise_donneur_ordre_id = data.donneur_ordre_id;
      delete mappedData.donneur_ordre_id;
    }
    
    // Si on reçoit transporteur_attribue_id, le transformer en entreprise_transporteur_id
    if (data.transporteur_attribue_id !== undefined && data.entreprise_transporteur_id === undefined) {
      mappedData.entreprise_transporteur_id = data.transporteur_attribue_id;
      delete mappedData.transporteur_attribue_id;
    }
    
    super('offre_fret', mappedData);
  }

  // Getters
  getId() {
    return this.id;
  }

  getDonneurOrdreId() {
    return this.donneur_ordre_id || this.entreprise_donneur_ordre_id;
  }

  getTransporteurAttribueId() {
    return this.transporteur_attribue_id || this.entreprise_transporteur_id;
  }

  getCreateurId() {
    return this.createur_id;
  }

  getDatePublication() {
    return this.date_publication;
  }

  getStatutOffre() {
    return this.statut_offre;
  }

  getPoidsMarchandiseKg() {
    return this.poids_marchandise_kg;
  }

  getVolumeM3() {
    return this.volume_m3;
  }

  getTypeMarchandise() {
    return this.type_marchandise;
  }

  getAdresseChargement() {
    return this.adresse_chargement;
  }

  getVilleChargement() {
    return this.ville_chargement;
  }

  getCodePostalChargement() {
    return this.code_postal_chargement;
  }

  getAdresseLivraison() {
    return this.adresse_livraison;
  }

  getVilleLivraison() {
    return this.ville_livraison;
  }

  getCodePostalLivraison() {
    return this.code_postal_livraison;
  }

  getTypeVehiculeSouhaite() {
    return this.type_vehicule_souhaite;
  }

  getDateChargementPrevue() {
    return this.date_chargement_prevue;
  }

  getConditionsSpeciales() {
    return this.conditions_speciales;
  }

  getPrixPropose() {
    return this.prix_propose;
  }

  // Setters
  setDonneurOrdreId(value) {
    this.entreprise_donneur_ordre_id = value;
    return this;
  }

  setTransporteurAttribueId(value) {
    this.entreprise_transporteur_id = value;
    return this;
  }

  setCreateurId(value) {
    this.createur_id = value;
    return this;
  }

  setDatePublication(value) {
    this.date_publication = value;
    return this;
  }

  setStatutOffre(value) {
    // Valeurs possibles: 'Publiee', 'Attribuee', 'EnCours', 'Completee', 'Annulee'
    this.statut_offre = value;
    return this;
  }

  setPoidsMarchandiseKg(value) {
    this.poids_marchandise_kg = value;
    return this;
  }

  setVolumeM3(value) {
    this.volume_m3 = value;
    return this;
  }

  setTypeMarchandise(value) {
    this.type_marchandise = value;
    return this;
  }

  setAdresseChargement(value) {
    this.adresse_chargement = value;
    return this;
  }

  setVilleChargement(value) {
    this.ville_chargement = value;
    return this;
  }

  setCodePostalChargement(value) {
    this.code_postal_chargement = value;
    return this;
  }

  setAdresseLivraison(value) {
    this.adresse_livraison = value;
    return this;
  }

  setVilleLivraison(value) {
    this.ville_livraison = value;
    return this;
  }

  setCodePostalLivraison(value) {
    this.code_postal_livraison = value;
    return this;
  }

  setTypeVehiculeSouhaite(value) {
    this.type_vehicule_souhaite = value;
    return this;
  }

  setDateChargementPrevue(value) {
    this.date_chargement_prevue = value;
    return this;
  }

  setConditionsSpeciales(value) {
    this.conditions_speciales = value;
    return this;
  }

  setPrixPropose(value) {
    this.prix_propose = value;
    return this;
  }

  /**
   * Méthodes utilitaires
   */

  // Vérifier si l'offre est disponible (Publiee)
  isDisponible() {
    return this.statut_offre === 'Publiee';
  }

  // Vérifier si l'offre est attribuée
  isAttribuee() {
    return this.statut_offre === 'Attribuee' || this.statut_offre === 'EnCours';
  }

  // Vérifier si l'offre est terminée
  isTerminee() {
    return this.statut_offre === 'Completee' || this.statut_offre === 'Annulee';
  }

  // Attribuer un transporteur à l'offre
  async attribuerTransporteur(transporteurId) {
    this.setTransporteurAttribueId(transporteurId);
    this.setStatutOffre('Attribuee');
    return await this.save();
  }

  // Marquer l'offre comme en cours
  async marquerEnCours() {
    this.setStatutOffre('EnCours');
    return await this.save();
  }

  // Marquer l'offre comme complétée
  async marquerCompletee() {
    this.setStatutOffre('Completee');
    return await this.save();
  }

  // Annuler l'offre
  async annuler() {
    this.setStatutOffre('Annulee');
    return await this.save();
  }

  /**
   * Méthodes statiques pour récupérer les offres par critères
   */

  // Récupérer toutes les offres publiées
  static async getOffresPubliees() {
    return await OffreFret.where('statut_offre', '=', 'Publiee');
  }

  // Récupérer les offres d'un donneur d'ordre
  static async getOffresByDonneurOrdre(donneurOrdreId) {
    return await OffreFret.where('entreprise_donneur_ordre_id', '=', donneurOrdreId);
  }

  // Récupérer les offres attribuées à un transporteur
  static async getOffresByTransporteur(transporteurId) {
    return await OffreFret.where('entreprise_transporteur_id', '=', transporteurId);
  }
}

module.exports = OffreFret;
