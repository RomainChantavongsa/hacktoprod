/**
 * Types pour les réponses de l'API backend
 */

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: number;
  username: string;
  email: string;
  nom: string;
  prenom?: string;
  role: 'admin' | 'transporteur' | 'donneur_ordre';
  transporteur_id?: number;
  donneur_ordre_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nom: string;
  prenom?: string;
  role: 'admin' | 'transporteur' | 'donneur_ordre';
  transporteur_id?: number;
  donneur_ordre_id?: number;
}

// ============================================
// TRANSPORTEUR TYPES
// ============================================

export interface Transporteur {
  id: number;
  nom_entreprise: string;
  type_structure?: string;
  siret: string;
  email_contact: string;
  telephone?: string;
  adresse_siege?: string;
  capacite_max_tonnes?: number;
  digitalisation_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransporteurRequest {
  nom_entreprise: string;
  type_structure?: string;
  siret: string;
  email_contact: string;
  telephone?: string;
  adresse_siege?: string;
  capacite_max_tonnes?: number;
  digitalisation_active?: boolean;
}

// ============================================
// DONNEUR ORDRE TYPES
// ============================================

export interface DonneurOrdre {
  id: number;
  nom_entreprise: string;
  type_acteur?: string;
  siret: string;
  email_contact: string;
  telephone?: string;
  frequence_besoin?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDonneurOrdreRequest {
  nom_entreprise: string;
  type_acteur?: string;
  siret: string;
  email_contact: string;
  telephone?: string;
  frequence_besoin?: string;
}

// ============================================
// OFFRE FRET TYPES
// ============================================

export type StatutOffre = 'Publiee' | 'Attribuee' | 'En_Cours' | 'Completee' | 'Annulee';

export interface OffreFret {
  id: number;
  donneur_ordre_id: number;
  transporteur_attribue_id?: number;
  date_publication: string;
  statut_offre: StatutOffre;
  poids_marchandise_kg: number;
  volume_m3?: number;
  type_marchandise: string;
  adresse_chargement: string;
  ville_chargement: string;
  code_postal_chargement: string;
  adresse_livraison: string;
  ville_livraison: string;
  code_postal_livraison: string;
  type_vehicule_souhaite?: string;
  date_chargement_prevue: string;
  conditions_speciales?: string;
  prix_propose?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateOffreFretRequest {
  donneur_ordre_id: number;
  poids_marchandise_kg: number;
  volume_m3?: number;
  type_marchandise: string;
  adresse_chargement: string;
  ville_chargement: string;
  code_postal_chargement: string;
  adresse_livraison: string;
  ville_livraison: string;
  code_postal_livraison: string;
  type_vehicule_souhaite?: string;
  date_chargement_prevue: string;
  conditions_speciales?: string;
  prix_propose?: number;
}

export interface UpdateOffreFretRequest {
  poids_marchandise_kg?: number;
  volume_m3?: number;
  type_marchandise?: string;
  adresse_chargement?: string;
  ville_chargement?: string;
  code_postal_chargement?: string;
  adresse_livraison?: string;
  ville_livraison?: string;
  code_postal_livraison?: string;
  type_vehicule_souhaite?: string;
  date_chargement_prevue?: string;
  conditions_speciales?: string;
  prix_propose?: number;
  statut_offre?: StatutOffre;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  count?: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================
// TYPE GUARDS (pour vérifier les types)
// ============================================

export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.success === true;
}

export function isApiError(response: ApiResponse<unknown>): response is ApiErrorResponse {
  return response.success === false;
}
