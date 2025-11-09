const Utilisateur = require('../models/Utilisateur');
const Transporteur = require('../models/Transporteur');
const DonneurOrdre = require('../models/DonneurOrdre');
const { generateToken, generateRefreshToken } = require('../utils/jwt');

/**
 * Service pour gérer la logique métier des utilisateurs
 */
class UserService {
  /**
   * Créer un nouvel utilisateur
   */
  async createUser(userData) {
    const { username, email, password, nom, prenom, role, transporteur_id, donneur_ordre_id } = userData;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await Utilisateur.findByUsername(username);
    if (existingUser) {
      const error = new Error('Nom d\'utilisateur déjà utilisé');
      error.statusCode = 409;
      throw error;
    }

    // Vérifier si l'email existe déjà
    const existingEmail = await Utilisateur.findByEmail(email);
    if (existingEmail) {
      const error = new Error('Email déjà utilisé');
      error.statusCode = 409;
      throw error;
    }

    let finalTransporteurId = transporteur_id;
    let finalDonneurOrdreId = donneur_ordre_id;

    // Si le rôle est transporteur et qu'aucun transporteur_id n'est fourni, créer une entité transporteur
    if (role === 'transporteur' && !transporteur_id) {
      const transporteur = Transporteur.create();
      transporteur.setNomEntreprise(`${nom}${prenom ? ' ' + prenom : ''}`); // Utiliser le nom de l'utilisateur par défaut
      transporteur.setTypeStructure('Individuel'); // Valeur par défaut
      transporteur.setEmailContact(email);
      transporteur.setDigitalisationActive(true);
      
      await transporteur.save();
      finalTransporteurId = transporteur.getId();
    }

    // Si le rôle est donneur_ordre et qu'aucun donneur_ordre_id n'est fourni, créer une entité donneur_ordre
    if (role === 'donneur_ordre' && !donneur_ordre_id) {
      const donneurOrdre = DonneurOrdre.create();
      donneurOrdre.setNomEntreprise(`${nom}${prenom ? ' ' + prenom : ''}`); // Utiliser le nom de l'utilisateur par défaut
      donneurOrdre.setTypeActeur('Entreprise'); // Valeur par défaut
      donneurOrdre.setEmailContact(email);
      
      await donneurOrdre.save();
      finalDonneurOrdreId = donneurOrdre.getId();
    }

    // Créer un nouvel utilisateur
    const user = Utilisateur.create();
    user.setUsername(username);
    user.setEmail(email);
    user.setNom(nom);
    if (prenom) user.setPrenom(prenom);
    user.setRole(role);
    if (finalTransporteurId) user.setTransporteurId(finalTransporteurId);
    if (finalDonneurOrdreId) user.setDonneurOrdreId(finalDonneurOrdreId);

    // Hash du mot de passe
    await user.setPassword(password);

    // Sauvegarder
    await user.save();

    return user.toSafeObject();
  }

  /**
   * Récupérer tous les utilisateurs
   */
  async getAllUsers() {
    const users = await Utilisateur.getAll();
    return users.map(u => u.toSafeObject());
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async getUserById(userId) {
    const user = await Utilisateur.getFromId(userId);
    
    if (!user) {
      const error = new Error('Utilisateur non trouvé');
      error.statusCode = 404;
      throw error;
    }

    return user.toSafeObject();
  }

  /**
   * Authentifier un utilisateur
   */
  async loginUser(username, password) {
    const user = await Utilisateur.authenticate(username, password);

    if (!user) {
      const error = new Error('Identifiants incorrects');
      error.statusCode = 401;
      throw error;
    }

    // Générer les tokens
    const token = generateToken({
      userId: user.id,
      username: user.getUsername(),
      email: user.getEmail(),
      role: user.role,
      is_admin: user.getIsAdmin()
    });

    const refreshToken = generateRefreshToken({
      userId: user.id
    });

    return {
      token,
      refreshToken,
      user: user.toSafeObject()
    };
  }

  /**
   * Mettre à jour un utilisateur
   */
  async updateUser(userId, updateData) {
    const user = await Utilisateur.getFromId(userId);
    
    if (!user) {
      const error = new Error('Utilisateur non trouvé');
      error.statusCode = 404;
      throw error;
    }

    // Vérifier si username change et s'il existe déjà
    if (updateData.username && updateData.username !== user.getUsername()) {
      const existingUser = await Utilisateur.findByUsername(updateData.username);
      if (existingUser) {
        const error = new Error('Nom d\'utilisateur déjà utilisé');
        error.statusCode = 409;
        throw error;
      }
      user.setUsername(updateData.username);
    }

    // Vérifier si email change et s'il existe déjà
    if (updateData.email && updateData.email !== user.getEmail()) {
      const existingEmail = await Utilisateur.findByEmail(updateData.email);
      if (existingEmail) {
        const error = new Error('Email déjà utilisé');
        error.statusCode = 409;
        throw error;
      }
      user.setEmail(updateData.email);
    }

    // Mettre à jour les autres champs
    if (updateData.nom) user.setNom(updateData.nom);
    if (updateData.prenom !== undefined) user.setPrenom(updateData.prenom);
    if (updateData.role) user.setRole(updateData.role);
    if (updateData.transporteur_id !== undefined) user.setTransporteurId(updateData.transporteur_id);
    if (updateData.donneur_ordre_id !== undefined) user.setDonneurOrdreId(updateData.donneur_ordre_id);

    // Mettre à jour le mot de passe si fourni
    if (updateData.password) {
      await user.setPassword(updateData.password);
    }

    await user.save();

    return user.toSafeObject();
  }

  /**
   * Supprimer un utilisateur
   */
  async deleteUser(userId) {
    const user = await Utilisateur.getFromId(userId);
    
    if (!user) {
      const error = new Error('Utilisateur non trouvé');
      error.statusCode = 404;
      throw error;
    }

    await user.delete();

    return { message: 'Utilisateur supprimé avec succès' };
  }
}

module.exports = new UserService();
