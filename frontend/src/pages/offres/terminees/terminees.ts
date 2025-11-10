import { useState, useEffect } from 'react';
import { OffreFret, isApiSuccess } from '../../../types/api';
import apiService from '../../../services/apiService';

export const useOffresTerminees = () => {
  const [offres, setOffres] = useState<OffreFret[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOffres = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getOffresFret();
      
      if (!isApiSuccess(response)) {
        throw new Error(response.message || 'Erreur lors du chargement des offres');
      }
      
      // Filter for offers that are completed or cancelled
      const offresTerminees = response.data.filter(
        (offre) => offre.statut_offre === 'Completee' || offre.statut_offre === 'Annulee'
      );
      
      setOffres(offresTerminees);
    } catch (err) {
      console.error('Erreur lors du chargement des offres terminées:', err);
      setError('Impossible de charger les offres terminées');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffres();
  }, []);

  return {
    offres,
    loading,
    error,
    reload: loadOffres,
  };
};
