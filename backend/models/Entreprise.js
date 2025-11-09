const BaseModel = require('./BaseModel');
const { Pool } = require('pg');

// Pool partagé pour les requêtes statiques
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Modèle pour la table entreprise (unifié transporteur/donneur_ordre)
 */
class Entreprise extends BaseModel {
  constructor(data = {}) {
    super('entreprise', data);
  }

  // Getters
  getId() {
    return this.id;
  }

  getNomEntreprise() {
    return this.nom_entreprise;
  }

  getTypeEntreprise() {
    return this.type_entreprise; // 'transporteur' ou 'donneur_ordre'
  }

  getEstParticulier() {
    return this.est_particulier || false;
  }

  getSiret() {
    return this.siret;
  }

  getTva() {
    return this.tva;
  }

  getRegistreCommerce() {
    return this.registre_commerce;
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

  getLogoUrl() {
    return this.logo_url;
  }

  // Champs spécifiques transporteur
  getTypeStructure() {
    return this.type_structure;
  }

  getCapaciteMaxTonnes() {
    return this.capacite_max_tonnes;
  }

  getDigitalisationActive() {
    return this.digitalisation_active;
  }

  getNombreVehicules() {
    return this.nombre_vehicules;
  }

  getTypesVehicules() {
    return this.types_vehicules;
  }

  getZonesIntervention() {
    return this.zones_intervention;
  }

  getRayonActionKm() {
    return this.rayon_action_km;
  }

  getLicenceTransport() {
    return this.licence_transport;
  }

  getAssuranceMarchandises() {
    return this.assurance_marchandises;
  }

  getNumeroAssurance() {
    return this.numero_assurance;
  }

  getDateExpirationAssurance() {
    return this.date_expiration_assurance;
  }

  getCertifications() {
    return this.certifications;
  }

  getTransportFrigorifique() {
    return this.transport_frigorifique;
  }

  getTransportExpress() {
    return this.transport_express;
  }

  getTransportVolumineux() {
    return this.transport_volumineux;
  }

  getTransportDangereuses() {
    return this.transport_dangereuses;
  }

  getTransportInternational() {
    return this.transport_international;
  }

  getHayonElevateur() {
    return this.hayon_elevateur;
  }

  getGerbeur() {
    return this.gerbeur;
  }

  getTranspalette() {
    return this.transpalette;
  }

  // Champs spécifiques donneur d'ordre
  getTypeActeur() {
    return this.type_acteur;
  }

  getFrequenceBesoin() {
    return this.frequence_besoin;
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

  setTypeEntreprise(value) {
    if (!['transporteur', 'donneur_ordre'].includes(value)) {
      throw new Error('Type entreprise doit être "transporteur" ou "donneur_ordre"');
    }
    this.type_entreprise = value;
    return this;
  }

  setEstParticulier(value) {
    this.est_particulier = value;
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

  setLogoUrl(value) {
    this.logo_url = value;
    return this;
  }

  // Setters spécifiques transporteur
  setTypeStructure(value) {
    this.type_structure = value;
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

  setNombreVehicules(value) {
    this.nombre_vehicules = value;
    return this;
  }

  setTypesVehicules(value) {
    this.types_vehicules = value;
    return this;
  }

  setZonesIntervention(value) {
    this.zones_intervention = value;
    return this;
  }

  setRayonActionKm(value) {
    this.rayon_action_km = value;
    return this;
  }

  setLicenceTransport(value) {
    this.licence_transport = value;
    return this;
  }

  setAssuranceMarchandises(value) {
    this.assurance_marchandises = value;
    return this;
  }

  setNumeroAssurance(value) {
    this.numero_assurance = value;
    return this;
  }

  setDateExpirationAssurance(value) {
    this.date_expiration_assurance = value;
    return this;
  }

  setCertifications(value) {
    this.certifications = value;
    return this;
  }

  setTransportFrigorifique(value) {
    this.transport_frigorifique = value;
    return this;
  }

  setTransportExpress(value) {
    this.transport_express = value;
    return this;
  }

  setTransportVolumineux(value) {
    this.transport_volumineux = value;
    return this;
  }

  setTransportDangereuses(value) {
    this.transport_dangereuses = value;
    return this;
  }

  setTransportInternational(value) {
    this.transport_international = value;
    return this;
  }

  setHayonElevateur(value) {
    this.hayon_elevateur = value;
    return this;
  }

  setGerbeur(value) {
    this.gerbeur = value;
    return this;
  }

  setTranspalette(value) {
    this.transpalette = value;
    return this;
  }

  // Setters spécifiques donneur d'ordre
  setTypeActeur(value) {
    this.type_acteur = value;
    return this;
  }

  setFrequenceBesoin(value) {
    this.frequence_besoin = value;
    return this;
  }

  /**
   * Vérifie si l'entreprise est un transporteur
   */
  isTransporteur() {
    return this.type_entreprise === 'transporteur';
  }

  /**
   * Vérifie si l'entreprise est un donneur d'ordre
   */
  isDonneurOrdre() {
    return this.type_entreprise === 'donneur_ordre';
  }

  /**
   * Vérifie si c'est un particulier
   */
  isParticulier() {
    return this.est_particulier === true;
  }

  /**
   * Recherche une entreprise par SIRET
   */
  static async getBySiret(siret) {
    if (!siret) return null;
    
    try {
      const query = 'SELECT * FROM entreprise WHERE siret = $1 LIMIT 1';
      const result = await pool.query(query, [siret]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return new Entreprise(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la recherche par SIRET:', error);
      throw new Error(`Erreur lors de la recherche par SIRET: ${error.message}`);
    }
  }

  /**
   * Recherche une entreprise par email de contact
   */
  static async getByEmailContact(email) {
    if (!email) return null;
    
    try {
      const query = 'SELECT * FROM entreprise WHERE email_contact = $1 LIMIT 1';
      const result = await pool.query(query, [email]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return new Entreprise(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la recherche par email:', error);
      throw new Error(`Erreur lors de la recherche par email: ${error.message}`);
    }
  }

  /**
   * Récupère tous les utilisateurs d'une entreprise
   */
  static async getUtilisateurs(entrepriseId) {
    try {
      const query = `
        SELECT * FROM utilisateur 
        WHERE entreprise_id = $1 
        ORDER BY role_entreprise DESC, created_at ASC
      `;
      const result = await pool.query(query, [entrepriseId]);
      
      const Utilisateur = require('./Utilisateur');
      return result.rows.map(row => new Utilisateur(row));
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
    }
  }

  /**
   * Retourne les informations de l'entreprise (sans données sensibles)
   */
  toSafeObject() {
    const base = {
      id: this.id,
      nom_entreprise: this.nom_entreprise,
      type_entreprise: this.type_entreprise,
      est_particulier: this.getEstParticulier(),
      email_contact: this.email_contact,
      telephone: this.telephone,
      adresse_siege: this.adresse_siege,
      complement_adresse: this.complement_adresse,
      code_postal: this.code_postal,
      ville: this.ville,
      pays: this.pays,
      logo_url: this.logo_url,
      created_at: this.created_at,
      updated_at: this.updated_at
    };

    // Ajouter les champs spécifiques selon le type
    if (this.isTransporteur()) {
      return {
        ...base,
        type_structure: this.type_structure,
        capacite_max_tonnes: this.capacite_max_tonnes,
        digitalisation_active: this.digitalisation_active,
        nombre_vehicules: this.nombre_vehicules,
        types_vehicules: this.types_vehicules,
        zones_intervention: this.zones_intervention,
        rayon_action_km: this.rayon_action_km,
        licence_transport: this.licence_transport,
        assurance_marchandises: this.assurance_marchandises,
        numero_assurance: this.numero_assurance,
        date_expiration_assurance: this.date_expiration_assurance,
        certifications: this.certifications,
        transport_frigorifique: this.transport_frigorifique,
        transport_express: this.transport_express,
        transport_volumineux: this.transport_volumineux,
        transport_dangereuses: this.transport_dangereuses,
        transport_international: this.transport_international,
        hayon_elevateur: this.hayon_elevateur,
        gerbeur: this.gerbeur,
        transpalette: this.transpalette
      };
    } else {
      return {
        ...base,
        type_acteur: this.type_acteur,
        frequence_besoin: this.frequence_besoin
      };
    }
  }

  /**
   * Retourne toutes les informations (y compris SIRET, TVA, etc.)
   */
  toFullObject() {
    return {
      ...this.toSafeObject(),
      siret: this.siret,
      tva: this.tva,
      registre_commerce: this.registre_commerce
    };
  }
}

module.exports = Entreprise;
