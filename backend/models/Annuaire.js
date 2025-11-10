const BaseModel = require('./BaseModel');

/**
 * Modèle pour la table annuaire (coordonnées des membres de l'entreprise)
 */
class Annuaire extends BaseModel {
  constructor(data = {}) {
    super('annuaire', data);
  }

  // Getters
  getId() {
    return this.id;
  }

  getEntrepriseId() {
    return this.entreprise_id;
  }

  getNom() {
    return this.nom;
  }

  getPrenom() {
    return this.prenom;
  }

  getFonction() {
    return this.fonction;
  }

  getService() {
    return this.service;
  }

  getEmail() {
    return this.email;
  }

  getTelephoneFixe() {
    return this.telephone_fixe;
  }

  getTelephoneMobile() {
    return this.telephone_mobile;
  }

  getTelephoneProfessionnel() {
    return this.telephone_professionnel;
  }

  getAdresseProfessionnelle() {
    return this.adresse_professionnelle;
  }

  getCodePostalProfessionnel() {
    return this.code_postal_professionnel;
  }

  getVilleProfessionnelle() {
    return this.ville_professionnelle;
  }

  getNotes() {
    return this.notes;
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

  setNom(value) {
    this.nom = value;
    return this;
  }

  setPrenom(value) {
    this.prenom = value;
    return this;
  }

  setFonction(value) {
    this.fonction = value;
    return this;
  }

  setService(value) {
    this.service = value;
    return this;
  }

  setEmail(value) {
    this.email = value;
    return this;
  }

  setTelephoneFixe(value) {
    this.telephone_fixe = value;
    return this;
  }

  setTelephoneMobile(value) {
    this.telephone_mobile = value;
    return this;
  }

  setTelephoneProfessionnel(value) {
    this.telephone_professionnel = value;
    return this;
  }

  setAdresseProfessionnelle(value) {
    this.adresse_professionnelle = value;
    return this;
  }

  setCodePostalProfessionnel(value) {
    this.code_postal_professionnel = value;
    return this;
  }

  setVilleProfessionnelle(value) {
    this.ville_professionnelle = value;
    return this;
  }

  setNotes(value) {
    this.notes = value;
    return this;
  }

  setEstActif(value) {
    this.est_actif = value;
    return this;
  }

  setCreatedBy(value) {
    this.created_by = value;
    return this;
  }

  setUpdatedBy(value) {
    this.updated_by = value;
    return this;
  }

  /**
   * Créer une nouvelle entrée d'annuaire
   */
  async create(annuaireData) {
    const values = [
      annuaireData.entreprise_id,
      annuaireData.nom,
      annuaireData.prenom,
      annuaireData.fonction,
      annuaireData.service,
      annuaireData.email,
      annuaireData.telephone_fixe,
      annuaireData.telephone_mobile,
      annuaireData.telephone_professionnel,
      annuaireData.adresse_professionnelle,
      annuaireData.code_postal_professionnel,
      annuaireData.ville_professionnelle,
      annuaireData.notes,
      annuaireData.est_actif !== undefined ? annuaireData.est_actif : true,
      annuaireData.created_by
    ];

    const query = `
      INSERT INTO annuaire (
        entreprise_id, nom, prenom, fonction, service, email,
        telephone_fixe, telephone_mobile, telephone_professionnel,
        adresse_professionnelle, code_postal_professionnel, ville_professionnelle,
        notes, est_actif, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const result = await this._executeQuery(query, values);
    return new Annuaire(result.rows[0]);
  }

  /**
   * Récupérer toutes les entrées d'annuaire d'une entreprise
   */
  static async getByEntreprise(entrepriseId, filters = {}) {
    let query = 'SELECT * FROM annuaire WHERE entreprise_id = $1';
    const values = [entrepriseId];
    let paramIndex = 2;

    // Filtres optionnels
    if (filters.est_actif !== undefined) {
      query += ` AND est_actif = $${paramIndex}`;
      values.push(filters.est_actif);
      paramIndex++;
    }

    if (filters.service) {
      query += ` AND service ILIKE $${paramIndex}`;
      values.push(`%${filters.service}%`);
      paramIndex++;
    }

    query += ' ORDER BY nom ASC, prenom ASC';

    const result = await this._executeStaticQuery(query, values);
    return result.rows.map(row => new Annuaire(row));
  }

  /**
   * Récupérer une entrée d'annuaire par ID
   */
  static async getById(id) {
    const query = 'SELECT * FROM annuaire WHERE id = $1';
    const result = await this._executeStaticQuery(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return new Annuaire(result.rows[0]);
  }

  /**
   * Mettre à jour une entrée d'annuaire
   */
  async update(id, annuaireData) {
    const updatableFields = [
      'nom', 'prenom', 'fonction', 'service', 'email',
      'telephone_fixe', 'telephone_mobile', 'telephone_professionnel',
      'adresse_professionnelle', 'code_postal_professionnel', 'ville_professionnelle',
      'notes', 'est_actif'
    ];

    const setParts = [];
    const values = [];
    let paramIndex = 1;

    updatableFields.forEach(field => {
      if (annuaireData[field] !== undefined) {
        setParts.push(`${field} = $${paramIndex}`);
        values.push(annuaireData[field]);
        paramIndex++;
      }
    });

    if (setParts.length === 0) {
      throw new Error('Aucun champ à mettre à jour');
    }

    // Ajouter updated_at et updated_by
    setParts.push(`updated_at = CURRENT_TIMESTAMP`);
    if (annuaireData.updated_by) {
      setParts.push(`updated_by = $${paramIndex}`);
      values.push(annuaireData.updated_by);
      paramIndex++;
    }

    values.push(id); // WHERE id = $paramIndex

    const query = `
      UPDATE annuaire
      SET ${setParts.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await this._executeQuery(query, values);

    if (result.rows.length === 0) {
      throw new Error('Entrée d\'annuaire non trouvée');
    }

    return new Annuaire(result.rows[0]);
  }

  /**
   * Supprimer une entrée d'annuaire
   */
  async delete(id) {
    const query = 'DELETE FROM annuaire WHERE id = $1 RETURNING *';
    const result = await this._executeQuery(query, [id]);

    if (result.rows.length === 0) {
      throw new Error('Entrée d\'annuaire non trouvée');
    }

    return result.rows[0];
  }

  /**
   * Vérifier qu'une entrée appartient à l'entreprise
   */
  static async belongsToEntreprise(annuaireId, entrepriseId) {
    const query = 'SELECT COUNT(*) as count FROM annuaire WHERE id = $1 AND entreprise_id = $2';
    const result = await this._executeStaticQuery(query, [annuaireId, entrepriseId]);
    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Retourne les informations pour le client
   */
  toSafeObject() {
    return {
      id: this.id,
      entreprise_id: this.entreprise_id,
      nom: this.nom,
      prenom: this.prenom,
      fonction: this.fonction,
      service: this.service,
      email: this.email,
      telephone_fixe: this.telephone_fixe,
      telephone_mobile: this.telephone_mobile,
      telephone_professionnel: this.telephone_professionnel,
      adresse_professionnelle: this.adresse_professionnelle,
      code_postal_professionnel: this.code_postal_professionnel,
      ville_professionnelle: this.ville_professionnelle,
      notes: this.notes,
      est_actif: this.est_actif,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Annuaire;