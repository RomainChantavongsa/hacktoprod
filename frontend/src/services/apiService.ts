import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Transporteur,
  CreateTransporteurRequest,
  DonneurOrdre,
  CreateDonneurOrdreRequest,
  OffreFret,
  CreateOffreFretRequest,
  UpdateOffreFretRequest,
  ApiResponse
} from '@models/api';

import { isApiSuccess } from '@models/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Classe pour gérer toutes les requêtes API avec typage TypeScript
 */
class ApiService {
  private token: string | null = null;

  constructor() {
    // Récupérer le token du localStorage au démarrage
    this.token = localStorage.getItem('token');
  }

  /**
   * Définir le token d'authentification
   */
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  /**
   * Récupérer le token actuel
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Requête HTTP générique avec gestion d'erreurs
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Ajouter le token si disponible
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      // Si la réponse n'est pas OK et qu'il n'y a pas de champ success
      if (!response.ok && data.success === undefined) {
        return {
          success: false,
          message: data.message || `Erreur HTTP ${response.status}`,
        };
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur réseau',
      };
    }
  }

  // ============================================
  // USER ENDPOINTS
  // ============================================

  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Si succès, sauvegarder le token
    if (isApiSuccess(response) && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  /**
   * Inscription utilisateur
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Récupérer tous les utilisateurs (admin)
   */
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/users');
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`);
  }

  /**
   * Mettre à jour un utilisateur
   */
  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Supprimer un utilisateur (admin)
   */
  async deleteUser(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Déconnexion
   */
  logout() {
    this.setToken(null);
  }

  // ============================================
  // TRANSPORTEUR ENDPOINTS
  // ============================================

  /**
   * Récupérer tous les transporteurs
   */
  async getTransporteurs(): Promise<ApiResponse<Transporteur[]>> {
    return this.request<Transporteur[]>('/transporteurs');
  }

  /**
   * Récupérer un transporteur par ID
   */
  async getTransporteurById(id: number): Promise<ApiResponse<Transporteur>> {
    return this.request<Transporteur>(`/transporteurs/${id}`);
  }

  /**
   * Créer un transporteur
   */
  async createTransporteur(data: CreateTransporteurRequest): Promise<ApiResponse<Transporteur>> {
    return this.request<Transporteur>('/transporteurs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Mettre à jour un transporteur
   */
  async updateTransporteur(id: number, data: Partial<CreateTransporteurRequest>): Promise<ApiResponse<Transporteur>> {
    return this.request<Transporteur>(`/transporteurs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Supprimer un transporteur
   */
  async deleteTransporteur(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/transporteurs/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // DONNEUR ORDRE ENDPOINTS
  // ============================================

  /**
   * Récupérer tous les donneurs d'ordre
   */
  async getDonneursOrdre(): Promise<ApiResponse<DonneurOrdre[]>> {
    return this.request<DonneurOrdre[]>('/donneurs-ordre');
  }

  /**
   * Récupérer un donneur d'ordre par ID
   */
  async getDonneurOrdreById(id: number): Promise<ApiResponse<DonneurOrdre>> {
    return this.request<DonneurOrdre>(`/donneurs-ordre/${id}`);
  }

  /**
   * Créer un donneur d'ordre
   */
  async createDonneurOrdre(data: CreateDonneurOrdreRequest): Promise<ApiResponse<DonneurOrdre>> {
    return this.request<DonneurOrdre>('/donneurs-ordre', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Mettre à jour un donneur d'ordre
   */
  async updateDonneurOrdre(id: number, data: Partial<CreateDonneurOrdreRequest>): Promise<ApiResponse<DonneurOrdre>> {
    return this.request<DonneurOrdre>(`/donneurs-ordre/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Supprimer un donneur d'ordre
   */
  async deleteDonneurOrdre(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/donneurs-ordre/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // OFFRE FRET ENDPOINTS
  // ============================================

  /**
   * Récupérer toutes les offres de fret (avec filtres optionnels)
   */
  async getOffresFret(filters?: {
    statut?: string;
    donneur_ordre_id?: number;
    transporteur_id?: number;
  }): Promise<ApiResponse<OffreFret[]>> {
    const params = new URLSearchParams();
    if (filters?.statut) params.append('statut', filters.statut);
    if (filters?.donneur_ordre_id) params.append('donneur_ordre_id', filters.donneur_ordre_id.toString());
    if (filters?.transporteur_id) params.append('transporteur_id', filters.transporteur_id.toString());

    const queryString = params.toString();
    return this.request<OffreFret[]>(`/offres-fret${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Récupérer les offres publiées (disponibles)
   */
  async getOffresPubliees(): Promise<ApiResponse<OffreFret[]>> {
    return this.request<OffreFret[]>('/offres-fret/publiees');
  }

  /**
   * Récupérer une offre de fret par ID
   */
  async getOffreFretById(id: number): Promise<ApiResponse<OffreFret>> {
    return this.request<OffreFret>(`/offres-fret/${id}`);
  }

  /**
   * Créer une offre de fret
   */
  async createOffreFret(data: CreateOffreFretRequest): Promise<ApiResponse<OffreFret>> {
    return this.request<OffreFret>('/offres-fret', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Mettre à jour une offre de fret
   */
  async updateOffreFret(id: number, data: UpdateOffreFretRequest): Promise<ApiResponse<OffreFret>> {
    return this.request<OffreFret>(`/offres-fret/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Attribuer un transporteur à une offre
   */
  async attribuerTransporteur(offreId: number, transporteurId: number): Promise<ApiResponse<{ id: number; statut_offre: string; transporteur_attribue_id: number }>> {
    return this.request(`/offres-fret/${offreId}/attribuer`, {
      method: 'POST',
      body: JSON.stringify({ transporteur_id: transporteurId }),
    });
  }

  /**
   * Marquer une offre comme en cours
   */
  async marquerEnCours(offreId: number): Promise<ApiResponse<{ id: number; statut_offre: string }>> {
    return this.request(`/offres-fret/${offreId}/en-cours`, {
      method: 'POST',
    });
  }

  /**
   * Marquer une offre comme complétée
   */
  async marquerCompletee(offreId: number): Promise<ApiResponse<{ id: number; statut_offre: string }>> {
    return this.request(`/offres-fret/${offreId}/completer`, {
      method: 'POST',
    });
  }

  /**
   * Annuler une offre
   */
  async annulerOffre(offreId: number): Promise<ApiResponse<{ id: number; statut_offre: string }>> {
    return this.request(`/offres-fret/${offreId}/annuler`, {
      method: 'POST',
    });
  }

  /**
   * Supprimer une offre de fret
   */
  async deleteOffreFret(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/offres-fret/${id}`, {
      method: 'DELETE',
    });
  }
}

// Export une instance unique (Singleton)
export const apiService = new ApiService();
export default apiService;
