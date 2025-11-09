const Document = require('../models/Document');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

class DocumentService {
  constructor() {
    // Dossier de stockage des documents
    this.uploadsDir = path.join(__dirname, '..', 'uploads', 'documents');
    this.ensureUploadDirExists();
  }

  /**
   * S'assurer que le dossier d'upload existe
   */
  async ensureUploadDirExists() {
    try {
      await fs.mkdir(this.uploadsDir, { recursive: true });
      console.log(`✅ Dossier uploads créé/vérifié : ${this.uploadsDir}`);
    } catch (error) {
      console.error('❌ Erreur lors de la création du dossier uploads:', error);
    }
  }

  /**
   * Créer un dossier spécifique pour une entreprise
   */
  async ensureEntrepriseDirExists(entrepriseId) {
    try {
      const entrepriseDir = path.join(this.uploadsDir, `entreprise_${entrepriseId}`);
      await fs.mkdir(entrepriseDir, { recursive: true });
      return entrepriseDir;
    } catch (error) {
      console.error(`❌ Erreur lors de la création du dossier entreprise ${entrepriseId}:`, error);
      // En cas d'erreur, retourner le dossier racine
      return this.uploadsDir;
    }
  }

  /**
   * Générer un nom de fichier unique
   */
  generateUniqueFilename(originalName) {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    return `${timestamp}-${randomString}${ext}`;
  }

  /**
   * Créer un nouveau document
   */
  async createDocument(documentData, file) {
    try {
      // S'assurer que le dossier de l'entreprise existe
      const entrepriseDir = await this.ensureEntrepriseDirExists(documentData.entreprise_id);

      // Générer un nom unique pour le fichier
      const uniqueFilename = this.generateUniqueFilename(file.originalname);
      const filePath = path.join(entrepriseDir, uniqueFilename);

      // Sauvegarder le fichier
      await fs.writeFile(filePath, file.buffer);
      console.log(`✅ Fichier sauvegardé : ${filePath}`);

      // Extraire l'extension
      const extension = path.extname(file.originalname);

      // Préparer les données du document
      const docData = {
        entreprise_id: documentData.entreprise_id,
        nom_fichier_original: documentData.nom_fichier_original || file.originalname,
        nom_fichier_stockage: uniqueFilename,
        chemin_stockage: filePath,
        type_document: documentData.type_document || 'Autre',
        categorie: documentData.categorie || 'Autre',
        description: documentData.description || null,
        extension: extension,
        taille_octets: file.size,
        mime_type: file.mimetype,
        version: documentData.version || 1,
        document_parent_id: documentData.document_parent_id || null,
        date_emission: documentData.date_emission || null,
        date_expiration: documentData.date_expiration || null,
        est_valide: documentData.est_valide !== undefined ? documentData.est_valide : true,
        uploade_par: documentData.uploade_par || null,
        tags: documentData.tags || null
      };

      // Créer l'entrée en base de données
      const document = await Document.create(docData);
      return document;
    } catch (error) {
      console.error('Erreur lors de la création du document:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les documents d'une entreprise
   */
  async getDocumentsByEntreprise(entrepriseId, filters = {}) {
    try {
      return await Document.getByEntreprise(entrepriseId, filters);
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      throw error;
    }
  }

  /**
   * Récupérer un document par ID
   */
  async getDocumentById(documentId) {
    try {
      return await Document.getById(documentId);
    } catch (error) {
      console.error('Erreur lors de la récupération du document:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un document
   */
  async updateDocument(documentId, documentData) {
    try {
      return await Document.update(documentId, documentData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du document:', error);
      throw error;
    }
  }

  /**
   * Supprimer un document
   */
  async deleteDocument(documentId) {
    try {
      // Récupérer le document pour obtenir le chemin du fichier
      const document = await Document.getById(documentId);
      
      if (!document) {
        throw new Error('Document non trouvé');
      }

      // Supprimer le fichier physique
      try {
        await fs.unlink(document.chemin_stockage);
      } catch (error) {
        console.error('Erreur lors de la suppression du fichier:', error);
        // On continue quand même pour supprimer l'entrée en base
      }

      // Supprimer l'entrée en base de données
      return await Document.delete(documentId);
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      throw error;
    }
  }

  /**
   * Vérifier si un document appartient à une entreprise
   */
  async verifyDocumentOwnership(documentId, entrepriseId) {
    try {
      return await Document.belongsToEntreprise(documentId, entrepriseId);
    } catch (error) {
      console.error('Erreur lors de la vérification de propriété:', error);
      throw error;
    }
  }

  /**
   * Récupérer les documents qui expirent bientôt
   */
  async getExpiringDocuments(entrepriseId, daysAhead = 30) {
    try {
      return await Document.getExpiringDocuments(entrepriseId, daysAhead);
    } catch (error) {
      console.error('Erreur lors de la récupération des documents expirants:', error);
      throw error;
    }
  }

  /**
   * Récupérer les documents expirés
   */
  async getExpiredDocuments(entrepriseId) {
    try {
      return await Document.getExpiredDocuments(entrepriseId);
    } catch (error) {
      console.error('Erreur lors de la récupération des documents expirés:', error);
      throw error;
    }
  }
}

module.exports = new DocumentService();
