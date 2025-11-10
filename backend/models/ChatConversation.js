const BaseModel = require('./BaseModel');

/**
 * Modèle ChatConversation
 * Gère les conversations chat des utilisateurs
 */
class ChatConversation extends BaseModel {
  constructor(data = {}) {
    super('chat_conversation', data);
  }

  /**
   * Trouve une conversation active pour un utilisateur
   * @param {number} utilisateurId - ID de l'utilisateur
   * @returns {Promise<ChatConversation|null>}
   */
  static async findActiveByUser(utilisateurId) {
    try {
      const conversations = await this.where('utilisateur_id', '=', utilisateurId);
      const active = conversations.filter(c => c.statut === 'active');

      if (active.length > 0) {
        // Retourne la plus récente
        return active.sort((a, b) =>
          new Date(b.derniere_activite) - new Date(a.derniere_activite)
        )[0];
      }

      return null;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche conversation: ${error.message}`);
    }
  }

  /**
   * Trouve toutes les conversations d'un utilisateur
   * @param {number} utilisateurId - ID de l'utilisateur
   * @returns {Promise<Array<ChatConversation>>}
   */
  static async findByUser(utilisateurId) {
    return await this.where('utilisateur_id', '=', utilisateurId);
  }

  /**
   * Crée ou récupère une conversation active pour un utilisateur
   * @param {number} utilisateurId - ID de l'utilisateur
   * @param {Object} contextData - Données de contexte optionnelles
   * @returns {Promise<ChatConversation>}
   */
  static async getOrCreate(utilisateurId, contextData = null) {
    try {
      // Cherche une conversation active existante
      let conversation = await this.findActiveByUser(utilisateurId);

      if (!conversation) {
        // Crée une nouvelle conversation
        conversation = new this({
          utilisateur_id: utilisateurId,
          derniere_activite: new Date(),
          statut: 'active',
          context_data: contextData ? JSON.stringify(contextData) : null
        });

        await conversation.save();
      }

      return conversation;
    } catch (error) {
      throw new Error(`Erreur lors de la création/récupération conversation: ${error.message}`);
    }
  }

  /**
   * Met à jour la dernière activité de la conversation
   */
  async updateActivity() {
    this.derniere_activite = new Date();
    await this.save();
  }

  /**
   * Ferme la conversation
   */
  async close() {
    this.statut = 'fermee';
    await this.save();
  }

  /**
   * Archive la conversation
   */
  async archive() {
    this.statut = 'archivee';
    await this.save();
  }

  /**
   * Met à jour le contexte de la conversation
   * @param {Object} newContext - Nouveau contexte à ajouter/mettre à jour
   */
  async updateContext(newContext) {
    const currentContext = this.context_data
      ? (typeof this.context_data === 'string' ? JSON.parse(this.context_data) : this.context_data)
      : {};

    this.context_data = JSON.stringify({
      ...currentContext,
      ...newContext
    });

    await this.save();
  }
}

module.exports = ChatConversation;
