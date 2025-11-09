const { Pool } = require('pg');

// Pool partagé pour toutes les instances
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Classe de base pour tous les modèles (pattern Active Record)
 * Fonctionne comme en PHP : créer une instance, modifier les propriétés, appeler save()
 */
class BaseModel {
  constructor(tableName, data = {}) {
    this._tableName = tableName;
    this._pool = pool;
    
    // Assigne toutes les propriétés de data à l'instance
    Object.assign(this, data);
  }

  /**
   * Sauvegarde l'instance actuelle (crée ou met à jour selon présence d'ID)
   * Comme en PHP : $objet->save()
   * @returns {Promise<this>} L'instance mise à jour
   */
  async save() {
    try {
      // Récupère toutes les propriétés de l'instance (sauf les propriétés privées commençant par _)
      const data = {};
      for (const key in this) {
        if (!key.startsWith('_') && this.hasOwnProperty(key)) {
          data[key] = this[key];
        }
      }

      if (this.id) {
        // Si un ID existe, faire une mise à jour
        const { id, ...updateData } = data;
        const result = await this._updateInstance(id, updateData);
        
        // Met à jour l'instance avec les données retournées
        Object.assign(this, result);
      } else {
        // Sinon, créer un nouvel enregistrement
        const result = await this._createInstance(data);
        
        // Met à jour l'instance avec les données retournées (notamment l'ID)
        Object.assign(this, result);
      }

      return this;
    } catch (error) {
      throw new Error(`Erreur lors de la sauvegarde: ${error.message}`);
    }
  }

  /**
   * Crée un enregistrement en base (méthode interne)
   */
  async _createInstance(data) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(data);

    const query = `INSERT INTO ${this._tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this._pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Met à jour un enregistrement en base (méthode interne)
   */
  async _updateInstance(id, data) {
    const setClause = Object.keys(data)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ');
    const values = [...Object.values(data), id];

    const query = `UPDATE ${this._tableName} SET ${setClause} WHERE id = $${values.length} RETURNING *`;
    const result = await this._pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Supprime l'instance actuelle de la base de données
   * @returns {Promise<boolean>} True si supprimé
   */
  async delete() {
    try {
      if (!this.id) {
        throw new Error('Impossible de supprimer un enregistrement sans ID');
      }

      const result = await this._pool.query(
        `DELETE FROM ${this._tableName} WHERE id = $1 RETURNING *`,
        [this.id]
      );

      if (result.rows[0]) {
        // Supprime l'ID de l'instance
        delete this.id;
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  }

  /**
   * Méthodes statiques pour les requêtes (appelées sur la classe, pas l'instance)
   */

  /**
   * Crée une nouvelle instance vide (sans sauvegarder)
   * @returns {BaseModel} Nouvelle instance
   */
  static create() {
    return new this();
  }

  /**
   * Recherche avec condition
   * @param {string} column - Nom de la colonne
   * @param {string} operator - Opérateur
   * @param {*} value - Valeur
   * @returns {Promise<Array<BaseModel>>} Tableau d'instances
   */
  static async where(column, operator, value) {
    try {
      const tableName = new this()._tableName;
      let query;
      let values;

      const validOperators = ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'IN', 'NOT IN'];
      const upperOperator = operator.toUpperCase();

      if (!validOperators.includes(upperOperator)) {
        throw new Error(`Opérateur non valide: ${operator}`);
      }

      if (upperOperator === 'IN' || upperOperator === 'NOT IN') {
        if (!Array.isArray(value)) {
          throw new Error(`La valeur pour ${upperOperator} doit être un tableau`);
        }
        const placeholders = value.map((_, i) => `$${i + 1}`).join(', ');
        query = `SELECT * FROM ${tableName} WHERE ${column} ${upperOperator} (${placeholders})`;
        values = value;
      } else {
        query = `SELECT * FROM ${tableName} WHERE ${column} ${upperOperator} $1`;
        values = [value];
      }

      const result = await pool.query(query, values);
      
      // Retourne des instances de la classe
      return result.rows.map(row => new this(row));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche: ${error.message}`);
    }
  }

  /**
   * Trouve un enregistrement par ID
   * @param {number} id - ID à rechercher
   * @returns {Promise<BaseModel|null>} Instance trouvée ou null
   */
  static async getFromId(id) {
    try {
      const tableName = new this()._tableName;
      const result = await pool.query(
        `SELECT * FROM ${tableName} WHERE id = $1`,
        [id]
      );
      
      return result.rows[0] ? new this(result.rows[0]) : null;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche: ${error.message}`);
    }
  }

  /**
   * Récupère tous les enregistrements
   * @returns {Promise<Array<BaseModel>>} Tableau d'instances
   */
  static async getAll() {
    try {
      const tableName = new this()._tableName;
      const result = await pool.query(`SELECT * FROM ${tableName}`);
      
      return result.rows.map(row => new this(row));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération: ${error.message}`);
    }
  }
}

module.exports = BaseModel;
