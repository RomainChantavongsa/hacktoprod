/**
 * Types pour les réponses de l'API backend
 */

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: number;
  username: string;
  entreprise_id: number;
  role_entreprise: 'admin' | 'employe' | 'viewer';
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile extends User {
  email: string;
  nom: string;
  prenom?: string;
  telephone?: string;
}

export interface Entreprise {
  id: number;
  nom_entreprise: string;
  type_entreprise: 'transporteur' | 'donneur_ordre';
  est_particulier: boolean;
  siret?: string;
  tva?: string;
  registre_commerce?: string;
  email_contact: string;
  telephone?: string;
  adresse_siege?: string;
  complement_adresse?: string;
  code_postal?: string;
  ville?: string;
  pays?: string;
  logo_url?: string;
  // Champs spécifiques transporteur
  type_structure?: string;
  capacite_max_tonnes?: number;
  digitalisation_active?: boolean;
  nombre_vehicules?: number;
  types_vehicules?: string[];
  zones_intervention?: string[];
  rayon_action_km?: number;
  licence_transport?: string;
  assurance_marchandises?: string;
  numero_assurance?: string;
  date_expiration_assurance?: string;
  certifications?: string[];
  transport_frigorifique?: boolean;
  transport_express?: boolean;
  transport_volumineux?: boolean;
  transport_dangereuses?: boolean;
  transport_international?: boolean;
  hayon_elevateur?: boolean;
  gerbeur?: boolean;
  transpalette?: boolean;
  // Champs spécifiques donneur d'ordre
  type_acteur?: string;
  frequence_besoin?: string;
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
  telephone?: string;
  type_entreprise: 'transporteur' | 'donneur_ordre';
  est_particulier?: boolean;
  nom_entreprise?: string;
  siret?: string;
  entreprise_id?: number;
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

// ============================================
// FLOTTE : VEHICULES & REMORQUES
// ============================================

export interface Vehicule {
  id: number;
  entreprise_id: number;
  type_vehicule: string;
  plaque_immatriculation: string;
  conducteur_attitre?: string | null;
  capacite_tonnes?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVehiculeRequest {
  type_vehicule: string;
  plaque_immatriculation: string;
  conducteur_attitre?: string;
  capacite_tonnes?: number;
}

export interface Remorque {
  id: number;
  entreprise_id: number;
  type_remorque: string;
  plaque_immatriculation: string;
  capacite_tonnes?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRemorqueRequest {
  type_remorque: string;
  plaque_immatriculation: string;
  capacite_tonnes?: number;
}

// ============================================
// CONDUCTEURS
// ============================================

export interface Conducteur {
  id: number;
  entreprise_id: number;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  numero_permis: string;
  date_naissance?: string;
  date_embauche?: string;
  statut: 'actif' | 'inactif' | 'conge' | 'suspendu';
  created_at?: string;
  updated_at?: string;
}

export interface CreateConducteurRequest {
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  numero_permis: string;
  date_naissance?: string;
  date_embauche?: string;
  statut?: 'actif' | 'inactif' | 'conge' | 'suspendu';
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
