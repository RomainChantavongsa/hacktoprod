const express = require('express');
const router = express.Router();
const CompteBancaireService = require('../services/CompteBancaireService');

// Import du middleware d'authentification
const { authMiddleware } = require('../utils/jwt');

/**
 * Middleware pour extraire l'entreprise_id depuis le token JWT et vérifier les permissions
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
    req.user_role = req.user.role_entreprise || 'employe';
    req.is_admin = req.user.is_admin || false;
    next();
  }
];

/**
 * Middleware pour vérifier que l'utilisateur a les droits d'admin entreprise
 */
const requireAdminEntreprise = (req, res, next) => {
  // L'admin global peut tout faire
  if (req.is_admin) {
    return next();
  }

  // Pour les comptes bancaires, seuls les admins entreprise peuvent modifier
  if (req.user_role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Seuls les administrateurs de l\'entreprise peuvent gérer les comptes bancaires.'
    });
  }

  next();
};

/**
 * GET /api/compte-bancaire
 * Récupérer tous les comptes bancaires de l'entreprise
 */
router.get('/', extractEntrepriseId, async (req, res) => {
  try {
    const comptes = await CompteBancaireService.getComptesByEntreprise(req.entreprise_id);

    res.json({
      success: true,
      data: comptes
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des comptes bancaires:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des comptes bancaires',
      error: error.message
    });
  }
});

/**
 * GET /api/compte-bancaire/:id
 * Récupérer un compte bancaire par ID
 */
router.get('/:id', extractEntrepriseId, async (req, res) => {
  try {
    const compteId = parseInt(req.params.id);

    // Vérifier que le compte appartient à l'entreprise
    const belongs = await CompteBancaireService.verifyCompteOwnership(compteId, req.entreprise_id);
    if (!belongs) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce compte bancaire'
      });
    }

    const compte = await CompteBancaireService.getCompteById(compteId);

    if (!compte) {
      return res.status(404).json({
        success: false,
        message: 'Compte bancaire non trouvé'
      });
    }

    res.json({
      success: true,
      data: compte
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du compte bancaire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du compte bancaire',
      error: error.message
    });
  }
});

/**
 * POST /api/compte-bancaire
 * Créer un nouveau compte bancaire
 */
router.post('/', extractEntrepriseId, async (req, res) => {
  try {
    const compteData = {
      entreprise_id: req.entreprise_id,
      iban: req.body.iban,
      bic: req.body.bic,
      nom_banque: req.body.nom_banque,
      titulaire: req.body.titulaire
    };

    const compte = await CompteBancaireService.createCompteBancaire(compteData);

    res.status(201).json({
      success: true,
      message: 'Compte bancaire créé avec succès',
      data: compte
    });
  } catch (error) {
    console.error('Erreur lors de la création du compte bancaire:', error);

    // Gestion des erreurs spécifiques
    if (error.message.includes('IBAN') || error.message.includes('BIC')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte bancaire',
      error: error.message
    });
  }
});

/**
 * PUT /api/compte-bancaire/:id
 * Mettre à jour un compte bancaire
 */
router.put('/:id', extractEntrepriseId, async (req, res) => {
  try {
    const compteId = parseInt(req.params.id);

    // Vérifier que le compte appartient à l'entreprise
    const belongs = await CompteBancaireService.verifyCompteOwnership(compteId, req.entreprise_id);
    if (!belongs) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce compte bancaire'
      });
    }

    const compteData = {
      iban: req.body.iban,
      bic: req.body.bic,
      nom_banque: req.body.nom_banque,
      titulaire: req.body.titulaire
    };

    const updatedCompte = await CompteBancaireService.updateCompteBancaire(compteId, compteData);

    res.json({
      success: true,
      message: 'Compte bancaire mis à jour avec succès',
      data: updatedCompte
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du compte bancaire:', error);

    // Gestion des erreurs spécifiques
    if (error.message.includes('IBAN') || error.message.includes('BIC')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du compte bancaire',
      error: error.message
    });
  }
});

/**
 * DELETE /api/compte-bancaire/:id
 * Supprimer un compte bancaire
 */
router.delete('/:id', extractEntrepriseId, async (req, res) => {
  try {
    const compteId = parseInt(req.params.id);

    // Vérifier que le compte appartient à l'entreprise
    const belongs = await CompteBancaireService.verifyCompteOwnership(compteId, req.entreprise_id);
    if (!belongs) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce compte bancaire'
      });
    }

    await CompteBancaireService.deleteCompteBancaire(compteId);

    res.json({
      success: true,
      message: 'Compte bancaire supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du compte bancaire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du compte bancaire',
      error: error.message
    });
  }
});

/**
 * POST /api/compte-bancaire/:id/set-principal
 * Définir un compte comme principal
 */
router.post('/:id/set-principal', extractEntrepriseId, async (req, res) => {
  try {
    const compteId = parseInt(req.params.id);

    // Vérifier que le compte appartient à l'entreprise
    const belongs = await CompteBancaireService.verifyCompteOwnership(compteId, req.entreprise_id);
    if (!belongs) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce compte bancaire'
      });
    }

    const compte = await CompteBancaireService.setCompteAsPrincipal(compteId, req.entreprise_id);

    res.json({
      success: true,
      message: 'Compte bancaire défini comme principal avec succès',
      data: compte
    });
  } catch (error) {
    console.error('Erreur lors de la définition du compte principal:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la définition du compte principal',
      error: error.message
    });
  }
});

/**
 * GET /api/compte-bancaire/principal
 * Récupérer le compte principal de l'entreprise
 */
router.get('/principal', extractEntrepriseId, async (req, res) => {
  try {
    const compte = await CompteBancaireService.getComptePrincipal(req.entreprise_id);

    res.json({
      success: true,
      data: compte
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du compte principal:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du compte principal',
      error: error.message
    });
  }
});

module.exports = router;