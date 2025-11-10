const BaseModel = require('./BaseModel');

/**
 * Modèle ChatMessage
 * Gère les messages individuels des conversations
 */
class ChatMessage extends BaseModel {
  constructor(data = {}) {
    super('chat_message', data);
  }

  /**
   * Trouve les messages pour une conversation
   * @param {number} conversationId - ID de la conversation
   * @param {number} limit - Nombre maximum de messages (default: 50)
   * @returns {Promise<Array<ChatMessage>>}
   */
  static async findByConversation(conversationId, limit = 50) {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      const query = `
        SELECT * FROM chat_message
        WHERE conversation_id = $1
        ORDER BY created_at ASC
        LIMIT $2
      `;

      const result = await pool.query(query, [conversationId, limit]);
      return result.rows.map(row => new this(row));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche messages: ${error.message}`);
    }
  }

  /**
   * Crée un nouveau message
   * @param {Object} data - Données du message
   * @returns {Promise<ChatMessage>}
   */
  static async createMessage(data) {
    const message = new this({
      conversation_id: data.conversation_id,
      expediteur: data.expediteur, // 'user' ou 'bot'
      contenu: data.contenu,
      intention_reconnue: data.intention_reconnue || null,
      utile: null
    });

    await message.save();
    return message;
  }

  /**
   * Marque le message comme utile ou non utile
   * @param {boolean} utile - True si utile, false sinon
   */
  async setFeedback(utile) {
    this.utile = utile;
    await this.save();
  }

  /**
   * Compte les messages dans une conversation
   * @param {number} conversationId - ID de la conversation
   * @returns {Promise<number>}
   */
  static async countByConversation(conversationId) {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      const query = `
        SELECT COUNT(*) as count
        FROM chat_message
        WHERE conversation_id = $1
      `;

      const result = await pool.query(query, [conversationId]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw new Error(`Erreur lors du comptage messages: ${error.message}`);
    }
  }

  /**
   * Trouve les derniers N messages d'une conversation
   * @param {number} conversationId - ID de la conversation
   * @param {number} limit - Nombre de messages à récupérer
   * @returns {Promise<Array<ChatMessage>>}
   */
  static async findLastMessages(conversationId, limit = 10) {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      const query = `
        SELECT * FROM chat_message
        WHERE conversation_id = $1
        ORDER BY created_at DESC
        LIMIT $2
      `;

      const result = await pool.query(query, [conversationId, limit]);
      // Inverse l'ordre pour avoir les messages plus anciens en premier
      return result.rows.reverse().map(row => new this(row));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche derniers messages: ${error.message}`);
    }
  }
}

module.exports = ChatMessage;
