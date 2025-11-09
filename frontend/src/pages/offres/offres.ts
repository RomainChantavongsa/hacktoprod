import { useState } from 'react';
import apiService from '@services/apiService';
import type { OffreFret, CreateOffreFretRequest } from '@models/api';
import { isApiSuccess } from '@models/api';

/**
 * Hook personnalisé pour gérer les offres de fret
 * Exemple d'utilisation des types TypeScript avec l'API
 */
export const useOffresFret = () => {
  const [offres, setOffres] = useState<OffreFret[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupérer toutes les offres publiées
   */
  const fetchOffresPubliees = async () => {
    setLoading(true);
    setError(null);

    const response = await apiService.getOffresPubliees();

    if (isApiSuccess(response)) {
      setOffres(response.data);
    } else {
      setError(response.message);
    }

    setLoading(false);
  };

  /**
   * Créer une nouvelle offre
   */
  const createOffre = async (data: CreateOffreFretRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const response = await apiService.createOffreFret(data);

    setLoading(false);

    if (isApiSuccess(response)) {
      // Recharger la liste
      await fetchOffresPubliees();
      return true;
    } else {
      setError(response.message);
      return false;
    }
  };

  /**
   * Attribuer un transporteur
   */
  const attribuerTransporteur = async (
    offreId: number,
    transporteurId: number
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const response = await apiService.attribuerTransporteur(offreId, transporteurId);

    setLoading(false);

    if (isApiSuccess(response)) {
      // Recharger la liste
      await fetchOffresPubliees();
      return true;
    } else {
      setError(response.message);
      return false;
    }
  };

  return {
    offres,
    loading,
    error,
    fetchOffresPubliees,
    createOffre,
    attribuerTransporteur,
  };
};
