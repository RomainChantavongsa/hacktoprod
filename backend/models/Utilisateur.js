const BaseModel = require('./BaseModel');
const bcrypt = require('bcrypt');
const cryptoUtils = require('../utils/crypto');

/**
 * Modèle pour la table utilisateurs avec chiffrement des données sensibles
 */
class Utilisateur extends BaseModel {
  constructor(data = {}) {
    super('utilisateurs', data);
    
    // Déchiffrer automatiquement les données lors de la construction
    if (data.username) this._decryptedUsername = cryptoUtils.decrypt(data.username);
    if (data.email) this._decryptedEmail = cryptoUtils.decrypt(data.email);
    if (data.nom) this._decryptedNom = cryptoUtils.decrypt(data.nom);
    if (data.prenom) this._decryptedPrenom = cryptoUtils.decrypt(data.prenom);
  }

  // Getters - retournent les valeurs déchiffrées
  getId() {
    return this.id;
  }

  getUsername() {
    return this._decryptedUsername || cryptoUtils.decrypt(this.username);
  }

  getEmail() {
    return this._decryptedEmail || cryptoUtils.decrypt(this.email);
  }

  getNom() {
    return this._decryptedNom || cryptoUtils.decrypt(this.nom);
  }

  getPrenom() {
    return this._decryptedPrenom || cryptoUtils.decrypt(this.prenom);
  }

  getRole() {
    return this.role;
  }

  getTransporteurId() {
    return this.transporteur_id;
  }

  getDonneurOrdreId() {
    return this.donneur_ordre_id;
  }

  getCreatedAt() {
    return this.created_at;
  }

  getUpdatedAt() {
    return this.updated_at;
  }

  // Setters - chiffrent automatiquement les valeurs
  setUsername(value) {
    this._decryptedUsername = value;
    this.username = cryptoUtils.encrypt(value);
    return this;
  }

  setEmail(value) {
    this._decryptedEmail = value;
    this.email = cryptoUtils.encrypt(value);
    return this;
  }

  setNom(value) {
    this._decryptedNom = value;
    this.nom = cryptoUtils.encrypt(value);
    return this;
  }

  setPrenom(value) {
    this._decryptedPrenom = value;
    this.prenom = cryptoUtils.encrypt(value);
    return this;
  }

  setRole(value) {
    this.role = value;
    return this;
  }

  setTransporteurId(value) {
    this.transporteur_id = value;
    return this;
  }

  setDonneurOrdreId(value) {
    this.donneur_ordre_id = value;
    return this;
  }

  /**
   * Setter pour le mot de passe - hash automatiquement
   */
  async setPassword(plainPassword) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(plainPassword, saltRounds);
    return this;
  }

  /**
   * Vérifie si le mot de passe fourni correspond
   */
  async verifyPassword(plainPassword) {
    if (!this.password) {
      throw new Error('Aucun mot de passe défini pour cet utilisateur');
    }
    return await bcrypt.compare(plainPassword, this.password);
  }

  /**
   * Méthode statique pour authentifier un utilisateur
   * Note: Comme username est chiffré, on doit récupérer tous les utilisateurs
   * et les comparer un par un (moins performant mais nécessaire avec le chiffrement)
   */
  static async authenticate(username, password) {
    try {
      // Récupérer tous les utilisateurs
      const allUsers = await this.getAll();
      
      // Chercher l'utilisateur avec le bon username déchiffré
      const user = allUsers.find(u => u.getUsername() === username);
      
      if (!user) {
        return null;
      }

      const isValid = await user.verifyPassword(password);
      
      if (!isValid) {
        return null;
      }

      return user;
    } catch (error) {
      throw new Error(`Erreur lors de l'authentification: ${error.message}`);
    }
  }

  /**
   * Recherche par username déchiffré
   */
  static async findByUsername(username) {
    try {
      const allUsers = await this.getAll();
      return allUsers.find(u => u.getUsername() === username) || null;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche: ${error.message}`);
    }
  }

  /**
   * Recherche par email déchiffré
   */
  static async findByEmail(email) {
    try {
      const allUsers = await this.getAll();
      return allUsers.find(u => u.getEmail() === email) || null;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche: ${error.message}`);
    }
  }

  /**
   * Retourne l'utilisateur sans le mot de passe et avec les données déchiffrées
   */
  toSafeObject() {
    return {
      id: this.id,
      username: this.getUsername(),
      email: this.getEmail(),
      nom: this.getNom(),
      prenom: this.getPrenom(),
      role: this.role,
      transporteur_id: this.transporteur_id,
      donneur_ordre_id: this.donneur_ordre_id,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Utilisateur;
