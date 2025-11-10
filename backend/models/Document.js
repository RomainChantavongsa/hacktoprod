const BaseModel = require('./BaseModel');

class Document extends BaseModel {
  constructor() {
    super('document');
  }

  /**
   * Créer un nouveau document
   */
  async create(documentData) {
    const query = `
      INSERT INTO document (
        entreprise_id,
        nom_fichier_original,
        nom_fichier_stockage,
        chemin_stockage,
        type_document,
        categorie,
        description,
        extension,
        taille_octets,
        mime_type,
        version,
        document_parent_id,
        date_emission,
        date_expiration,
        est_valide,
        uploade_par,
        tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;

    const values = [
      documentData.entreprise_id,
      documentData.nom_fichier_original,
      documentData.nom_fichier_stockage,
      documentData.chemin_stockage,
      documentData.type_document,
      documentData.categorie || null,
      documentData.description || null,
      documentData.extension,
      documentData.taille_octets,
      documentData.mime_type || null,
      documentData.version || 1,
      documentData.document_parent_id || null,
      documentData.date_emission || null,
      documentData.date_expiration || null,
      documentData.est_valide !== undefined ? documentData.est_valide : true,
      documentData.uploade_par || null,
      documentData.tags || null
    ];

    const result = await this._pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Récupérer tous les documents d'une entreprise
   */
  async getByEntreprise(entrepriseId, filters = {}) {
    let query = `
      SELECT d.* FROM document d
      WHERE d.entreprise_id = $1
    `;
    const values = [entrepriseId];
    let paramIndex = 2;

    // Filtrer par type de document
    if (filters.type) {
      query += ` AND d.type_document = $${paramIndex}`;
      values.push(filters.type);
      paramIndex++;
    }

    // Filtrer par catégorie
    if (filters.categorie) {
      query += ` AND d.categorie = $${paramIndex}`;
      values.push(filters.categorie);
      paramIndex++;
    }

    // Filtrer par véhicule (jointure avec la table vehicule)
    if (filters.vehicule_id) {
      query += ` AND (
        d.id = (SELECT carte_grise_document_id FROM vehicule WHERE id = $${paramIndex} AND entreprise_id = $1) OR
        d.id = (SELECT assurance_document_id FROM vehicule WHERE id = $${paramIndex} AND entreprise_id = $1)
      )`;
      values.push(filters.vehicule_id);
      paramIndex++;
    }

    // Filtrer par conducteur (jointure avec la table conducteur)
    if (filters.conducteur_id) {
      query += ` AND d.id = (SELECT permis_document_id FROM conducteur WHERE id = $${paramIndex} AND entreprise_id = $1)`;
      values.push(filters.conducteur_id);
      paramIndex++;
    }

    // Filtrer par remorque (jointure avec la table remorque)
    if (filters.remorque_id) {
      query += ` AND d.id = (SELECT document_id FROM remorque WHERE id = $${paramIndex} AND entreprise_id = $1)`;
      values.push(filters.remorque_id);
      paramIndex++;
    }

    // Filtrer par statut (valide, expire_bientot, expire)
    if (filters.statut) {
      if (filters.statut === 'valide') {
        query += ` AND d.est_valide = true AND (d.date_expiration IS NULL OR d.date_expiration > CURRENT_DATE)`;
      } else if (filters.statut === 'expire_bientot') {
        query += ` AND d.date_expiration IS NOT NULL AND d.date_expiration > CURRENT_DATE AND d.date_expiration <= CURRENT_DATE + INTERVAL '30 days'`;
      } else if (filters.statut === 'expire') {
        query += ` AND d.date_expiration IS NOT NULL AND d.date_expiration < CURRENT_DATE`;
      }
    }

    query += ` ORDER BY d.created_at DESC`;

    const result = await this._pool.query(query, values);
    return result.rows;
  }

  /**
   * Récupérer un document par ID
   */
  async getById(id) {
    const query = 'SELECT * FROM document WHERE id = $1';
    const result = await this._pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Mettre à jour un document
   */
  async update(id, documentData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    // Champs modifiables
    const updatableFields = [
      'nom_fichier_original',
      'type_document',
      'categorie',
      'description',
      'date_emission',
      'date_expiration',
      'est_valide',
      'tags'
    ];

    updatableFields.forEach(field => {
      if (documentData[field] !== undefined) {
        fields.push(`${field} = $${paramIndex}`);
        values.push(documentData[field]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      throw new Error('Aucun champ à mettre à jour');
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE document 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await this._pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Supprimer un document
   */
  async delete(id) {
    const query = 'DELETE FROM document WHERE id = $1 RETURNING *';
    const result = await this._pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Vérifier si un document appartient à une entreprise
   */
  async belongsToEntreprise(documentId, entrepriseId) {
    const query = 'SELECT COUNT(*) FROM document WHERE id = $1 AND entreprise_id = $2';
    const result = await this._pool.query(query, [documentId, entrepriseId]);
    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Récupérer les documents qui expirent bientôt
   */
  async getExpiringDocuments(entrepriseId, daysAhead = 30) {
    const query = `
      SELECT * FROM document 
      WHERE entreprise_id = $1 
        AND date_expiration IS NOT NULL 
        AND date_expiration > CURRENT_DATE 
        AND date_expiration <= CURRENT_DATE + INTERVAL '${daysAhead} days'
      ORDER BY date_expiration ASC
    `;
    const result = await this._pool.query(query, [entrepriseId]);
    return result.rows;
  }

  /**
   * Récupérer les documents expirés
   */
  async getExpiredDocuments(entrepriseId) {
    const query = `
      SELECT * FROM document 
      WHERE entreprise_id = $1 
        AND date_expiration IS NOT NULL 
        AND date_expiration < CURRENT_DATE
      ORDER BY date_expiration DESC
    `;
    const result = await this._pool.query(query, [entrepriseId]);
    return result.rows;
  }
}

module.exports = new Document();
