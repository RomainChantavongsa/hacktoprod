const express = require('express');
const router = express.Router();
const DocumentService = require('../services/DocumentService');
const multer = require('multer');
const path = require('path');

// Configuration de Multer pour l'upload de fichiers
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10 MB
  },
  fileFilter: (req, file, cb) => {
    // Types de fichiers autorisés
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Formats acceptés: PDF, JPG, PNG, DOC, DOCX'));
    }
  }
});

// Import du middleware d'authentification
const { authMiddleware } = require('../utils/jwt');

/**
 * Middleware pour extraire l'entreprise_id depuis le token JWT
 */
const extractEntrepriseId = [
  authMiddleware,
  (req, res, next) => {
    // Le token JWT contient déjà l'entreprise_id
    if (!req.user || !req.user.entreprise_id) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié ou entreprise non associée'
      });
    }
    req.entreprise_id = req.user.entreprise_id;
    req.user_id = req.user.userId; // Pour savoir qui a uploadé
    next();
  }
];

/**
 * GET /api/documents
 * Récupérer tous les documents de l'entreprise
 */
router.get('/', extractEntrepriseId, async (req, res) => {
  try {
    const { type, categorie, statut } = req.query;
    
    const filters = {};
    if (type) filters.type = type;
    if (categorie) filters.categorie = categorie;
    if (statut) filters.statut = statut;

    const documents = await DocumentService.getDocumentsByEntreprise(req.entreprise_id, filters);

    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des documents',
      error: error.message
    });
  }
});

/**
 * GET /api/documents/expiring
 * Récupérer les documents qui expirent bientôt
 */
router.get('/expiring', extractEntrepriseId, async (req, res) => {
  try {
    const daysAhead = parseInt(req.query.days) || 30;
    const documents = await DocumentService.getExpiringDocuments(req.entreprise_id, daysAhead);

    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des documents expirants:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des documents expirants',
      error: error.message
    });
  }
});

/**
 * GET /api/documents/expired
 * Récupérer les documents expirés
 */
router.get('/expired', extractEntrepriseId, async (req, res) => {
  try {
    const documents = await DocumentService.getExpiredDocuments(req.entreprise_id);

    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des documents expirés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des documents expirés',
      error: error.message
    });
  }
});

/**
 * GET /api/documents/:id
 * Récupérer un document par ID
 */
router.get('/:id', extractEntrepriseId, async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    
    // Vérifier que le document appartient à l'entreprise
    const belongs = await DocumentService.verifyDocumentOwnership(documentId, req.entreprise_id);
    if (!belongs) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce document'
      });
    }

    const document = await DocumentService.getDocumentById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé'
      });
    }

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du document:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du document',
      error: error.message
    });
  }
});

/**
 * GET /api/documents/:id/download
 * Télécharger un document
 */
router.get('/:id/download', extractEntrepriseId, async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    
    // Vérifier que le document appartient à l'entreprise
    const belongs = await DocumentService.verifyDocumentOwnership(documentId, req.entreprise_id);
    if (!belongs) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce document'
      });
    }

    const document = await DocumentService.getDocumentById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé'
      });
    }

    // Télécharger le fichier
    res.download(document.chemin_stockage, document.nom_fichier_original, (err) => {
      if (err) {
        console.error('Erreur lors du téléchargement:', err);
        res.status(500).json({
          success: false,
          message: 'Erreur lors du téléchargement du fichier'
        });
      }
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du document:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du téléchargement du document',
      error: error.message
    });
  }
});

/**
 * GET /api/documents/:id/preview
 * Prévisualiser un document (pour PDF et images)
 */
router.get('/:id/preview', extractEntrepriseId, async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    
    // Vérifier que le document appartient à l'entreprise
    const belongs = await DocumentService.verifyDocumentOwnership(documentId, req.entreprise_id);
    if (!belongs) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce document'
      });
    }

    const document = await DocumentService.getDocumentById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé'
      });
    }

    // Envoyer le fichier pour affichage dans le navigateur
    res.sendFile(document.chemin_stockage, (err) => {
      if (err) {
        console.error('Erreur lors de la prévisualisation:', err);
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la prévisualisation du fichier'
        });
      }
    });
  } catch (error) {
    console.error('Erreur lors de la prévisualisation du document:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la prévisualisation du document',
      error: error.message
    });
  }
});

/**
 * POST /api/documents
 * Uploader un nouveau document
 */
router.post('/', extractEntrepriseId, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    // Utiliser le nom personnalisé si fourni, sinon garder le nom original
    const customName = req.body.nom_fichier_original;
    
    const documentData = {
      entreprise_id: req.entreprise_id,
      nom_fichier_original: customName || req.file.originalname,
      type_document: req.body.type_document || 'Autre',
      categorie: req.body.categorie || 'Autre',
      description: req.body.description || null,
      date_emission: req.body.date_emission || null,
      date_expiration: req.body.date_expiration || null,
      uploade_par: req.user_id || null,
      tags: req.body.tags ? JSON.parse(req.body.tags) : null
    };

    const document = await DocumentService.createDocument(documentData, req.file);

    res.status(201).json({
      success: true,
      message: 'Document uploadé avec succès',
      data: document
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload du document:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload du document',
      error: error.message
    });
  }
});

/**
 * PUT /api/documents/:id
 * Mettre à jour un document
 */
router.put('/:id', extractEntrepriseId, async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    
    // Vérifier que le document appartient à l'entreprise
    const belongs = await DocumentService.verifyDocumentOwnership(documentId, req.entreprise_id);
    if (!belongs) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce document'
      });
    }

    const documentData = {
      type_document: req.body.type_document,
      categorie: req.body.categorie,
      description: req.body.description,
      date_emission: req.body.date_emission,
      date_expiration: req.body.date_expiration,
      est_valide: req.body.est_valide,
      tags: req.body.tags
    };

    const updatedDocument = await DocumentService.updateDocument(documentId, documentData);

    res.json({
      success: true,
      message: 'Document mis à jour avec succès',
      data: updatedDocument
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du document:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du document',
      error: error.message
    });
  }
});

/**
 * DELETE /api/documents/:id
 * Supprimer un document
 */
router.delete('/:id', extractEntrepriseId, async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    
    // Vérifier que le document appartient à l'entreprise
    const belongs = await DocumentService.verifyDocumentOwnership(documentId, req.entreprise_id);
    if (!belongs) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce document'
      });
    }

    await DocumentService.deleteDocument(documentId);

    res.json({
      success: true,
      message: 'Document supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du document:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du document',
      error: error.message
    });
  }
});

module.exports = router;
