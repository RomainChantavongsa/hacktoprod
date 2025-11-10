import type {
  User,
  UserProfile,
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
  Entreprise,
  ApiResponse,
  Vehicule,
  CreateVehiculeRequest,
  Remorque,
  CreateRemorqueRequest,
  Conducteur,
  CreateConducteurRequest
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
    // Note: Le backend retourne le token directement dans la réponse, pas dans response.data
    if (response.success && (response as any).token) {
      this.setToken((response as any).token);
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
   * Mettre à jour le profil utilisateur
   */
  async updateUserProfile(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Récupérer le profil complet de l'utilisateur authentifié
   */
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/users/profile');
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
   * Récupérer les conducteurs d'une entreprise
   */
  async getConducteurs(): Promise<ApiResponse<Conducteur[]>> {
    return this.request<Conducteur[]>('/conducteurs');
  }

  /**
   * Créer un conducteur
   */
  async createConducteur(data: CreateConducteurRequest): Promise<ApiResponse<Conducteur>> {
    return this.request<Conducteur>('/conducteurs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Supprimer un conducteur
   */
  async deleteConducteur(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/conducteurs/${id}`, {
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
  // ENTREPRISES ENDPOINTS
  // ============================================

  /**
   * Récupérer toutes les entreprises
   */
  async getEntreprises(type?: string): Promise<ApiResponse<Entreprise[]>> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);

    const queryString = params.toString();
    return this.request<Entreprise[]>(`/entreprises${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Récupérer une entreprise par ID
   */
  async getEntrepriseById(id: number): Promise<ApiResponse<Entreprise>> {
    return this.request<Entreprise>(`/entreprises/${id}`);
  }

  /**
   * Mettre à jour une entreprise
   */
  async updateEntreprise(id: number, data: Partial<Entreprise>): Promise<ApiResponse<Entreprise>> {
    return this.request<Entreprise>(`/entreprises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ============================================
  // FLOTTE : VEHICULES
  // ============================================

  async getVehicules(): Promise<ApiResponse<Vehicule[]>> {
    return this.request<Vehicule[]>('/vehicules');
  }

  async createVehicule(data: CreateVehiculeRequest): Promise<ApiResponse<Vehicule>> {
    return this.request<Vehicule>('/vehicules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVehicule(id: number, data: Partial<CreateVehiculeRequest>): Promise<ApiResponse<Vehicule>> {
    return this.request<Vehicule>(`/vehicules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteVehicule(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/vehicules/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // FLOTTE : REMORQUES
  // ============================================

  async getRemorques(): Promise<ApiResponse<Remorque[]>> {
    return this.request<Remorque[]>('/remorques');
  }

  async createRemorque(data: CreateRemorqueRequest): Promise<ApiResponse<Remorque>> {
    return this.request<Remorque>('/remorques', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRemorque(id: number, data: Partial<CreateRemorqueRequest>): Promise<ApiResponse<Remorque>> {
    return this.request<Remorque>(`/remorques/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRemorque(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/remorques/${id}`, {
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

  // ============================================
  // DOCUMENT ENDPOINTS
  // ============================================

  /**
   * Récupérer tous les documents de l'entreprise
   */
  async getDocuments(queryString: string = ''): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/documents${queryString}`);
  }

  /**
   * Récupérer un document par ID
   */
  async getDocumentById(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/documents/${id}`);
  }

  /**
   * Uploader un document
   */
  async uploadDocument(formData: FormData): Promise<ApiResponse<any>> {
    const headers: HeadersInit = {};
    
    // Ajouter le token si disponible
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers,
        body: formData, // FormData gère automatiquement le Content-Type
      });

      const data = await response.json();

      if (!response.ok && data.success === undefined) {
        return {
          success: false,
          message: data.message || `Erreur HTTP ${response.status}`,
        };
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de l\'upload',
      };
    }
  }

  /**
   * Télécharger un document
   */
  async downloadDocument(id: number): Promise<Blob> {
    const headers: HeadersInit = {};
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}/documents/${id}/download`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement');
    }

    return response.blob();
  }

  /**
   * Mettre à jour un document
   */
  async updateDocument(id: number, documentData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(documentData),
    });
  }

  /**
   * Supprimer un document
   */
  async deleteDocument(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // COMPTE BANCAIRE ENDPOINTS
  // ============================================

  /**
   * Récupérer tous les comptes bancaires de l'entreprise
   */
  async getComptesBancaires(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/compte-bancaire');
  }

  /**
   * Récupérer un compte bancaire par ID
   */
  async getCompteBancaireById(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/compte-bancaire/${id}`);
  }

  /**
   * Créer un compte bancaire
   */
  async createCompteBancaire(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/compte-bancaire', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Mettre à jour un compte bancaire
   */
  async updateCompteBancaire(id: number, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/compte-bancaire/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Supprimer un compte bancaire
   */
  async deleteCompteBancaire(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/compte-bancaire/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Définir un compte bancaire comme principal
   */
  async setCompteAsPrincipal(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/compte-bancaire/${id}/set-principal`, {
      method: 'POST',
    });
  }

  /**
   * Récupérer le compte bancaire principal
   */
  async getComptePrincipal(): Promise<ApiResponse<any>> {
    return this.request<any>('/compte-bancaire/principal');
  }
}

// Export une instance unique (Singleton)
export const apiService = new ApiService();
export default apiService;
