const express = require('express');
const router = express.Router();
const userService = require('../services/UserService');
const { authMiddleware, requireRole } = require('../utils/jwt');
const { validateCreateUser, validateLogin, validateUpdateUser } = require('../middleware/validators/userValidator');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * POST /api/users - Créer un nouvel utilisateur
 */
router.post('/', validateCreateUser, asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Utilisateur créé avec succès',
    data: user
  });
}));

/**
 * GET /api/users - Récupérer tous les utilisateurs (protégé - admin)
 */
router.get('/', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
}));

/**
 * GET /api/users/:id - Récupérer un utilisateur par ID (protégé)
 */
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  
  res.status(200).json({
    success: true,
    data: user
  });
}));

/**
 * PUT /api/users/:id - Mettre à jour un utilisateur (protégé)
 */
router.put('/:id', authMiddleware, validateUpdateUser, asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  
  res.status(200).json({
    success: true,
    message: 'Utilisateur mis à jour avec succès',
    data: user
  });
}));

/**
 * DELETE /api/users/:id - Supprimer un utilisateur (protégé - admin)
 */
router.delete('/:id', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  
  res.status(200).json({
    success: true,
    ...result
  });
}));

/**
 * POST /api/users/login - Authentifier un utilisateur et retourner un token JWT
 */
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const { token, refreshToken, user } = await userService.loginUser(username, password);
  
  res.status(200).json({
    success: true,
    message: 'Authentification réussie',
    token,
    refreshToken,
    user
  });
}));

module.exports = router;
