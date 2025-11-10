import { useState, useEffect } from 'react';
import { OffreFret, isApiSuccess } from '../../../types/api';
import apiService from '../../../services/apiService';

export const useOffresEnCours = () => {
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
      
      // Filter for offers that are assigned or in progress
      const offresEnCours = response.data.filter(
        (offre) => offre.statut_offre === 'Attribuee' || offre.statut_offre === 'En_Cours'
      );
      
      setOffres(offresEnCours);
    } catch (err) {
      console.error('Erreur lors du chargement des offres en cours:', err);
      setError('Impossible de charger les offres en cours');
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
