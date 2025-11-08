const BaseModel = require('./BaseModel');
const bcrypt = require('bcrypt');

/**
 * Modèle pour la table utilisateurs
 */
class Utilisateur extends BaseModel {
  constructor(data = {}) {
    super('utilisateurs', data);
  }

  // Getters
  getId() {
    return this.id;
  }

  getUsername() {
    return this.username;
  }

  getEmail() {
    return this.email;
  }

  getNom() {
    return this.nom;
  }

  getPrenom() {
    return this.prenom;
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

  // Setters
  setUsername(value) {
    this.username = value;
    return this;
  }

  setEmail(value) {
    this.email = value;
    return this;
  }

  setNom(value) {
    this.nom = value;
    return this;
  }

  setPrenom(value) {
    this.prenom = value;
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
   */
  static async authenticate(username, password) {
    try {
      const users = await this.where('username', '=', username);
      
      if (users.length === 0) {
        return null;
      }

      const user = users[0];
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
   * Retourne l'utilisateur sans le mot de passe
   */
  toSafeObject() {
    const { password, _tableName, _pool, ...safeUser } = this;
    return safeUser;
  }
}

module.exports = Utilisateur;
