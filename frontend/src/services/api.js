// Service API - Configuration centralisée
// Ce fichier montre comment utiliser les variables d'environnement dans React

// L'URL de l'API est définie dans les variables d'environnement
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Service pour les appels API
 */
class ApiService {
  /**
   * Effectue une requête GET
   * @param {string} endpoint - L'endpoint de l'API
   * @param {string} token - Token JWT optionnel
   * @returns {Promise} La réponse de l'API
   */
  static async get(endpoint, token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Effectue une requête POST
   * @param {string} endpoint - L'endpoint de l'API
   * @param {object} data - Les données à envoyer
   * @param {string} token - Token JWT optionnel
   * @returns {Promise} La réponse de l'API
   */
  static async post(endpoint, data, token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Récupère l'URL de base de l'API
   * @returns {string} L'URL de l'API
   */
  static getBaseUrl() {
    return API_URL;
  }
}

export default ApiService;
