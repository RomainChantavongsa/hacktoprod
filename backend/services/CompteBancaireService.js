const CompteBancaire = require('../models/CompteBancaire');

class CompteBancaireService {
  constructor() {
    // Pas de dossier de stockage nécessaire pour les comptes bancaires
  }

  /**
   * Créer un nouveau compte bancaire
   */
  async createCompteBancaire(compteData) {
    try {
      // Validation des données
      this.validateCompteData(compteData);

      // Vérifier que l'IBAN est unique
      const isUnique = await CompteBancaire.isIbanUnique(compteData.iban);
      if (!isUnique) {
        throw new Error('Cet IBAN est déjà utilisé par un autre compte');
      }

      // Si c'est le premier compte ou marqué comme principal, gérer la logique
      if (compteData.est_principal) {
        // Vérifier s'il y a déjà un compte principal
        const comptePrincipal = await CompteBancaire.getPrincipalByEntreprise(compteData.entreprise_id);
        if (comptePrincipal) {
          // Il y a déjà un compte principal, on ne peut pas créer un nouveau compte principal
          throw new Error('Il ne peut y avoir qu\'un seul compte principal. Désélectionnez d\'abord l\'autre compte principal.');
        }
      }

      // Créer le compte bancaire
      const compte = await CompteBancaire.create(compteData);
      return compte;
    } catch (error) {
      console.error('Erreur lors de la création du compte bancaire:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les comptes bancaires d'une entreprise
   */
  async getComptesByEntreprise(entrepriseId) {
    try {
      return await CompteBancaire.getByEntreprise(entrepriseId);
    } catch (error) {
      console.error('Erreur lors de la récupération des comptes bancaires:', error);
      throw error;
    }
  }

  /**
   * Récupérer un compte bancaire par ID
   */
  async getCompteById(compteId) {
    try {
      return await CompteBancaire.getById(compteId);
    } catch (error) {
      console.error('Erreur lors de la récupération du compte bancaire:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un compte bancaire
   */
  async updateCompteBancaire(compteId, compteData) {
    try {
      // Validation des données
      this.validateCompteData(compteData, true); // true pour update (certains champs optionnels)

      // Vérifier que l'IBAN est unique (sauf pour ce compte)
      if (compteData.iban) {
        const isUnique = await CompteBancaire.isIbanUnique(compteData.iban, compteId);
        if (!isUnique) {
          throw new Error('Cet IBAN est déjà utilisé par un autre compte');
        }
      }

      // Récupérer le compte actuel pour vérifier les changements
      const compteActuel = await CompteBancaire.getById(compteId);
      if (!compteActuel) {
        throw new Error('Compte bancaire non trouvé');
      }

      // Si on essaie de définir ce compte comme principal
      if (compteData.est_principal === true && !compteActuel.est_principal) {
        // Vérifier s'il y a déjà un compte principal
        const comptePrincipal = await CompteBancaire.getPrincipalByEntreprise(compteActuel.entreprise_id);
        if (comptePrincipal && comptePrincipal.id !== compteId) {
          throw new Error('Il ne peut y avoir qu\'un seul compte principal. Désélectionnez d\'abord l\'autre compte principal.');
        }
      }

      return await CompteBancaire.update(compteId, compteData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du compte bancaire:', error);
      throw error;
    }
  }

  /**
   * Supprimer un compte bancaire
   */
  async deleteCompteBancaire(compteId) {
    try {
      // Vérifier que le compte n'est pas principal avant de le supprimer
      const compte = await CompteBancaire.getById(compteId);
      if (!compte) {
        throw new Error('Compte bancaire non trouvé');
      }

      if (compte.est_principal) {
        throw new Error('Impossible de supprimer le compte principal. Désignez d\'abord un autre compte comme principal.');
      }

      return await CompteBancaire.delete(compteId);
    } catch (error) {
      console.error('Erreur lors de la suppression du compte bancaire:', error);
      throw error;
    }
  }

  /**
   * Définir un compte comme principal
   */
  async setCompteAsPrincipal(compteId, entrepriseId) {
    try {
      return await CompteBancaire.setAsPrincipal(compteId, entrepriseId);
    } catch (error) {
      console.error('Erreur lors de la définition du compte principal:', error);
      throw error;
    }
  }

  /**
   * Récupérer le compte principal d'une entreprise
   */
  async getComptePrincipal(entrepriseId) {
    try {
      return await CompteBancaire.getPrincipalByEntreprise(entrepriseId);
    } catch (error) {
      console.error('Erreur lors de la récupération du compte principal:', error);
      throw error;
    }
  }

  /**
   * Vérifier si un compte bancaire appartient à une entreprise
   */
  async verifyCompteOwnership(compteId, entrepriseId) {
    try {
      return await CompteBancaire.belongsToEntreprise(compteId, entrepriseId);
    } catch (error) {
      console.error('Erreur lors de la vérification de propriété:', error);
      throw error;
    }
  }

  /**
   * Validation des données du compte bancaire
   */
  validateCompteData(data, isUpdate = false) {
    if (!isUpdate || data.iban !== undefined) {
      if (!data.iban || typeof data.iban !== 'string') {
        throw new Error('L\'IBAN est requis et doit être une chaîne de caractères');
      }

      // Validation basique de l'IBAN (doit commencer par 2 lettres suivies de chiffres)
      const ibanRegex = /^[A-Z]{2}[0-9A-Z]{10,30}$/;
      if (!ibanRegex.test(data.iban.replace(/\s/g, '').toUpperCase())) {
        throw new Error('Format d\'IBAN invalide');
      }
    }

    if (!isUpdate || data.nom_banque !== undefined) {
      if (!data.nom_banque || typeof data.nom_banque !== 'string') {
        throw new Error('Le nom de la banque est requis et doit être une chaîne de caractères');
      }
    }

    if (!isUpdate || data.titulaire !== undefined) {
      if (!data.titulaire || typeof data.titulaire !== 'string') {
        throw new Error('Le titulaire du compte est requis et doit être une chaîne de caractères');
      }
    }

    // BIC optionnel mais si fourni, doit être valide
    if (data.bic && typeof data.bic === 'string') {
      const bicRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
      if (!bicRegex.test(data.bic.replace(/\s/g, '').toUpperCase())) {
        throw new Error('Format de BIC invalide');
      }
    }

    // L'entreprise_id est requis uniquement lors de la création
    if (!isUpdate || data.entreprise_id !== undefined) {
      if (!data.entreprise_id || typeof data.entreprise_id !== 'number') {
        throw new Error('L\'ID de l\'entreprise est requis et doit être un nombre');
      }
    }
  }
}

module.exports = new CompteBancaireService();