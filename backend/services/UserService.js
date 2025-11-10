const Utilisateur = require('../models/Utilisateur');
const Entreprise = require('../models/Entreprise');
const { generateToken, generateRefreshToken } = require('../utils/jwt');

/**
 * Service pour gérer la logique métier des utilisateurs
 */
class UserService {
  /**
   * Créer un nouvel utilisateur avec son entreprise
   */
  async createUser(userData) {
    const { username, email, password, nom, prenom, type_entreprise, est_particulier, entreprise_id, siret } = userData;

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

    let finalEntrepriseId = entreprise_id;
    let entreprise = null;
    let roleEntreprise = 'admin'; // Par défaut, admin si nouvelle entreprise
    let message = 'Inscription réussie ! Votre entreprise a été créée.';

    // Si aucune entreprise n'est fournie, vérifier si elle existe ou en créer une nouvelle
    if (!entreprise_id) {
      if (!type_entreprise) {
        const error = new Error('Type d\'entreprise requis (transporteur ou donneur_ordre)');
        error.statusCode = 400;
        throw error;
      }

      // Définir si c'est un particulier ou une entreprise
      const isParticulier = est_particulier === true || est_particulier === 'true';

      // Pour les entreprises (non particuliers), vérifier si l'entreprise existe
      if (!isParticulier) {
        // Chercher une entreprise existante par SIRET
        if (siret) {
          entreprise = await Entreprise.getBySiret(siret);
          if (entreprise) {
            console.log(`✅ Entreprise existante trouvée par SIRET : ${entreprise.getNomEntreprise()} (ID: ${entreprise.getId()})`);
          }
        }
        
        // Si pas trouvé par SIRET, chercher par email de contact
        if (!entreprise && email) {
          entreprise = await Entreprise.getByEmailContact(email);
          if (entreprise) {
            console.log(`✅ Entreprise existante trouvée par email : ${entreprise.getNomEntreprise()} (ID: ${entreprise.getId()})`);
          }
        }

        // Si l'entreprise existe déjà
        if (entreprise) {
          // Vérifier que le type correspond
          if (entreprise.getTypeEntreprise() !== type_entreprise) {
            const error = new Error(
              `Cette entreprise est enregistrée comme ${entreprise.getTypeEntreprise()}, pas comme ${type_entreprise}`
            );
            error.statusCode = 400;
            throw error;
          }

          // Le nouvel utilisateur devient "employe" car l'entreprise existe déjà
          roleEntreprise = 'employe';
          finalEntrepriseId = entreprise.getId();
          message = 'Inscription réussie ! Vous avez été rattaché à l\'entreprise existante.';
          console.log(`👤 Nouvel utilisateur sera rattaché comme employé`);
        }
      }

      // Si l'entreprise n'existe pas (particulier ou nouvelle entreprise), la créer
      if (!entreprise) {
        entreprise = Entreprise.create();
        
        entreprise.setEstParticulier(isParticulier);
        
        // Nom de l'entreprise/particulier
        if (isParticulier) {
          // Pour un particulier, utiliser nom + prénom
          entreprise.setNomEntreprise(`${prenom || ''} ${nom}`.trim());
        } else {
          // Pour une entreprise, utiliser le nom d'entreprise fourni ou nom+prénom par défaut
          entreprise.setNomEntreprise(userData.nom_entreprise || `${nom}${prenom ? ' ' + prenom : ''}`);
        }
        
        entreprise.setTypeEntreprise(type_entreprise);
        entreprise.setEmailContact(email);
        
        if (userData.telephone) entreprise.setTelephone(userData.telephone);
        if (siret) entreprise.setSiret(siret);
        entreprise.setPays('France');

        // Valeurs par défaut selon le type
        if (type_entreprise === 'transporteur') {
          entreprise.setTypeStructure(isParticulier ? 'Particulier' : 'Individuel');
          entreprise.setDigitalisationActive(true);
        } else if (type_entreprise === 'donneur_ordre') {
          entreprise.setTypeActeur(isParticulier ? 'Particulier' : 'Entreprise');
        }
        
        console.log('🏢 Création d\'une nouvelle entreprise:', entreprise.getNomEntreprise());
        await entreprise.save();
        finalEntrepriseId = entreprise.getId();
        roleEntreprise = 'admin'; // Premier utilisateur = admin
      }
    }

    // Créer le nouvel utilisateur
    console.log(`👤 Création de l'utilisateur ${username} (${roleEntreprise})`);
    const user = Utilisateur.create();
    user.setUsername(username);
    user.setEmail(email);
    user.setNom(nom);
    if (prenom) user.setPrenom(prenom);
    if (userData.telephone) user.setTelephone(userData.telephone);
    user.setEntrepriseId(finalEntrepriseId);
    user.setRoleEntreprise(roleEntreprise);

    // Hash du mot de passe
    await user.setPassword(password);

    // Sauvegarder
    await user.save();

    return {
      user: user.toSafeObject(),
      entreprise: entreprise ? entreprise.toSafeObject() : null,
      message
    };
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
      const error = new Error('Utilisateur non trouvé' + userId);
      error.statusCode = 404;
      throw error;
    }

    // Retourner toutes les données déchiffrées pour l'utilisateur lui-même
    return user.toFullObject();
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

    // Récupérer l'entreprise de l'utilisateur pour obtenir son type
    const Entreprise = require('../models/Entreprise');
    const entreprise = await Entreprise.getFromId(user.getEntrepriseId());

    // Générer les tokens
    const token = generateToken({
      userId: user.id,
      username: user.getUsername(),
      email: user.getEmail(),
      entreprise_id: user.getEntrepriseId(),
      type_entreprise: entreprise ? entreprise.getTypeEntreprise() : null,
      est_particulier: entreprise ? entreprise.getEstParticulier() : false,
      role_entreprise: user.getRoleEntreprise(),
      is_admin: user.getIsAdmin()
    });

    const refreshToken = generateRefreshToken({
      userId: user.id
    });

    return {
      token,
      refreshToken,
      user: {
        ...user.toSafeObject(),
        entreprise: entreprise ? entreprise.toSafeObject() : null
      }
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
    if (updateData.telephone !== undefined) user.setTelephone(updateData.telephone);
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

  /**
   * Récupérer les conducteurs d'une entreprise
   */
  async getConducteursByEntreprise(entrepriseId) {
    const users = await Utilisateur.getAll();
    const conducteurs = users.filter(user => user.getEntrepriseId() === entrepriseId && user.getRole() === 'conducteur');
    return conducteurs.map(u => u.toSafeObject());
  }
}

module.exports = new UserService();
