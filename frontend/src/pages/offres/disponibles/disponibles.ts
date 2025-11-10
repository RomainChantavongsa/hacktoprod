import { useState, useEffect } from 'react';
import { OffreFret, isApiSuccess } from '../../../types/api';
import apiService from '../../../services/apiService';

export const useOffresDisponibles = () => {
  const [offres, setOffres] = useState<OffreFret[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOffres = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getOffresPubliees();
      
      if (!isApiSuccess(response)) {
        throw new Error(response.message || 'Erreur lors du chargement des offres');
      }
      
      setOffres(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des offres disponibles:', err);
      setError('Impossible de charger les offres disponibles');
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
