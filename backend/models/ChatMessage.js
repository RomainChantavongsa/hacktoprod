const BaseModel = require('./BaseModel');

/**
 * Modello ChatMessage
 * Gestisce i singoli messaggi delle conversazioni
 */
class ChatMessage extends BaseModel {
  constructor(data = {}) {
    super('chat_message', data);
  }

  /**
   * Trova messaggi per conversazione
   * @param {number} conversationId - ID della conversazione
   * @param {number} limit - Numero massimo di messaggi (default: 50)
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
   * Crea un nuovo messaggio
   * @param {Object} data - Dati del messaggio
   * @returns {Promise<ChatMessage>}
   */
  static async createMessage(data) {
    const message = new this({
      conversation_id: data.conversation_id,
      mittente: data.mittente, // 'user' o 'bot'
      contenuto: data.contenuto,
      intent_riconosciuto: data.intent_riconosciuto || null,
      utile: null
    });

    await message.save();
    return message;
  }

  /**
   * Segna il messaggio come utile o non utile
   * @param {boolean} utile - True se utile, false altrimenti
   */
  async setFeedback(utile) {
    this.utile = utile;
    await this.save();
  }

  /**
   * Conta i messaggi in una conversazione
   * @param {number} conversationId - ID della conversazione
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
   * Trova ultimi N messaggi di una conversazione
   * @param {number} conversationId - ID della conversazione
   * @param {number} limit - Numero di messaggi da recuperare
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
      // Inverti l'ordine per avere i messaggi più vecchi prima
      return result.rows.reverse().map(row => new this(row));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche derniers messages: ${error.message}`);
    }
  }
}

module.exports = ChatMessage;
