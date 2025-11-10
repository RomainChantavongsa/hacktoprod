const BaseModel = require('./BaseModel');

/**
 * Modello ChatConversation
 * Gestisce le conversazioni chat degli utenti
 */
class ChatConversation extends BaseModel {
  constructor(data = {}) {
    super('chat_conversation', data);
  }

  /**
   * Trova conversazione attiva per un utente
   * @param {number} utilisateurId - ID dell'utente
   * @returns {Promise<ChatConversation|null>}
   */
  static async findActiveByUser(utilisateurId) {
    try {
      const conversations = await this.where('utilisateur_id', '=', utilisateurId);
      const active = conversations.filter(c => c.stato === 'attiva');

      if (active.length > 0) {
        // Ritorna la più recente
        return active.sort((a, b) =>
          new Date(b.ultima_attivita) - new Date(a.ultima_attivita)
        )[0];
      }

      return null;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche conversation: ${error.message}`);
    }
  }

  /**
   * Trova tutte le conversazioni di un utente
   * @param {number} utilisateurId - ID dell'utente
   * @returns {Promise<Array<ChatConversation>>}
   */
  static async findByUser(utilisateurId) {
    return await this.where('utilisateur_id', '=', utilisateurId);
  }

  /**
   * Crea o recupera una conversazione attiva per un utente
   * @param {number} utilisateurId - ID dell'utente
   * @param {Object} contextData - Dati di contesto opzionali
   * @returns {Promise<ChatConversation>}
   */
  static async getOrCreate(utilisateurId, contextData = null) {
    try {
      // Cerca una conversazione attiva esistente
      let conversation = await this.findActiveByUser(utilisateurId);

      if (!conversation) {
        // Crea una nuova conversazione
        conversation = new this({
          utilisateur_id: utilisateurId,
          ultima_attivita: new Date(),
          stato: 'attiva',
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
   * Aggiorna l'ultima attività della conversazione
   */
  async updateActivity() {
    this.ultima_attivita = new Date();
    await this.save();
  }

  /**
   * Chiude la conversazione
   */
  async close() {
    this.stato = 'chiusa';
    await this.save();
  }

  /**
   * Archivia la conversazione
   */
  async archive() {
    this.stato = 'archiviata';
    await this.save();
  }

  /**
   * Aggiorna il contesto della conversazione
   * @param {Object} newContext - Nuovo contesto da aggiungere/aggiornare
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
