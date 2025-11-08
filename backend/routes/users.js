const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur');
const { authMiddleware, requireRole } = require('../utils/jwt');

/**
 * POST /api/users - Créer un nouvel utilisateur
 */
router.post('/', async (req, res) => {
  try {
    const { username, email, password, nom, prenom, role, transporteur_id, donneur_ordre_id } = req.body;

    // Validation basique
    if (!username || !email || !password || !nom || !role) {
      return res.status(400).json({
        success: false,
        message: 'Champs requis manquants: username, email, password, nom, role'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await Utilisateur.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Nom d\'utilisateur déjà utilisé'
      });
    }

    // Vérifier si l'email existe déjà
    const existingEmail = await Utilisateur.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email déjà utilisé'
      });
    }

    // Créer un nouvel utilisateur
    const user = Utilisateur.create();
    user.setUsername(username);
    user.setEmail(email);
    user.setNom(nom);
    if (prenom) user.setPrenom(prenom);
    user.setRole(role);
    if (transporteur_id) user.setTransporteurId(transporteur_id);
    if (donneur_ordre_id) user.setDonneurOrdreId(donneur_ordre_id);

    // Hash du mot de passe
    await user.setPassword(password);

    // Sauvegarder
    await user.save();

    // Retourner l'utilisateur sans le mot de passe
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: user.toSafeObject()
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * GET /api/users - Récupérer tous les utilisateurs (protégé)
 */
router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const users = await Utilisateur.getAll();
    const safeUsers = users.map(u => u.toSafeObject());

    res.status(200).json({
      success: true,
      count: safeUsers.length,
      data: safeUsers
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * GET /api/users/:id - Récupérer un utilisateur par ID (protégé)
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await Utilisateur.getFromId(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: user.toSafeObject()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * POST /api/users/login - Authentifier un utilisateur et retourner un token JWT
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username et password requis'
      });
    }

    const user = await Utilisateur.authenticate(username, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Générer le token JWT
    const jwtUtils = require('../utils/jwt');
    const token = jwtUtils.generateToken({
      userId: user.id,
      username: user.getUsername(),
      email: user.getEmail(),
      role: user.role
    });

    // Générer un refresh token (optionnel)
    const refreshToken = jwtUtils.generateRefreshToken({
      userId: user.id
    });

    res.status(200).json({
      success: true,
      message: 'Authentification réussie',
      token: token,
      refreshToken: refreshToken,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

module.exports = router;
