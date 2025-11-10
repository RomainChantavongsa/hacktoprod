const BaseModel = require('./BaseModel');

class CompteBancaire extends BaseModel {
  constructor() {
    super('compte_bancaire');
  }

  /**
   * Créer un nouveau compte bancaire
   */
  async create(compteData) {
    const query = `
      INSERT INTO compte_bancaire (
        entreprise_id,
        iban,
        bic,
        nom_banque,
        titulaire,
        est_principal
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      compteData.entreprise_id,
      compteData.iban,
      compteData.bic || null,
      compteData.nom_banque,
      compteData.titulaire,
      compteData.est_principal || false
    ];

    const result = await this._pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Récupérer tous les comptes bancaires d'une entreprise
   */
  async getByEntreprise(entrepriseId) {
    const query = `
      SELECT * FROM compte_bancaire
      WHERE entreprise_id = $1
      ORDER BY created_at DESC
    `;
    const result = await this._pool.query(query, [entrepriseId]);
    return result.rows;
  }

  /**
   * Récupérer un compte bancaire par ID
   */
  async getById(id) {
    const query = 'SELECT * FROM compte_bancaire WHERE id = $1';
    const result = await this._pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Mettre à jour un compte bancaire
   */
  async update(id, compteData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    // Champs modifiables
    const updatableFields = [
      'iban',
      'bic',
      'nom_banque',
      'titulaire',
      'est_principal'
    ];

    updatableFields.forEach(field => {
      if (compteData[field] !== undefined) {
        fields.push(`${field} = $${paramIndex}`);
        values.push(compteData[field]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      throw new Error('Aucun champ à mettre à jour');
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE compte_bancaire
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await this._pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Supprimer un compte bancaire
   */
  async delete(id) {
    const query = 'DELETE FROM compte_bancaire WHERE id = $1 RETURNING *';
    const result = await this._pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Vérifier si un compte bancaire appartient à une entreprise
   */
  async belongsToEntreprise(compteId, entrepriseId) {
    const query = 'SELECT COUNT(*) FROM compte_bancaire WHERE id = $1 AND entreprise_id = $2';
    const result = await this._pool.query(query, [compteId, entrepriseId]);
    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Vérifier si l'IBAN est unique (sauf pour le compte actuel lors de la mise à jour)
   */
  async isIbanUnique(iban, excludeId = null) {
    let query = 'SELECT COUNT(*) FROM compte_bancaire WHERE iban = $1';
    const values = [iban];

    if (excludeId) {
      query += ' AND id != $2';
      values.push(excludeId);
    }

    const result = await this._pool.query(query, values);
    return parseInt(result.rows[0].count) === 0;
  }

  /**
   * Définir un compte comme principal (et retirer le statut principal des autres comptes)
   */
  async setAsPrincipal(compteId, entrepriseId) {
    // Commencer une transaction
    const client = await this._pool.connect();

    try {
      await client.query('BEGIN');

      // Retirer le statut principal de tous les comptes de l'entreprise
      await client.query(
        'UPDATE compte_bancaire SET est_principal = FALSE WHERE entreprise_id = $1',
        [entrepriseId]
      );

      // Définir le compte sélectionné comme principal
      const result = await client.query(
        'UPDATE compte_bancaire SET est_principal = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND entreprise_id = $2 RETURNING *',
        [compteId, entrepriseId]
      );

      await client.query('COMMIT');

      if (result.rows.length === 0) {
        throw new Error('Compte bancaire non trouvé ou ne appartient pas à cette entreprise');
      }

      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Récupérer le compte principal d'une entreprise
   */
  async getPrincipalByEntreprise(entrepriseId) {
    const query = `
      SELECT * FROM compte_bancaire
      WHERE entreprise_id = $1 AND est_principal = TRUE
      LIMIT 1
    `;
    const result = await this._pool.query(query, [entrepriseId]);
    return result.rows[0] || null;
  }
}

module.exports = new CompteBancaire();