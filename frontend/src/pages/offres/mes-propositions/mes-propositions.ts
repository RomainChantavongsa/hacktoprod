import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/apiService';
import { isApiSuccess, PropositionOffre } from '../../../types/api';

export const useMesPropositions = () => {
  const { user } = useAuth();
  const [propositions, setPropositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPropositions = async () => {
    if (!user?.entreprise_id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer toutes les offres pour obtenir celles où on a soumis des propositions
      // Note: Idéalement, il faudrait une API dédiée pour les propositions d'un transporteur
      const response = await apiService.getOffresFret({});
      
      if (!isApiSuccess(response)) {
        throw new Error(response.message || 'Erreur lors du chargement');
      }
      
      // Pour chaque offre, vérifier si on a soumis une proposition
      const propositionsWithOffre = [];
      for (const offre of response.data) {
        try {
          const propsResponse = await apiService.getPropositionsPourOffre(offre.id);
          if (isApiSuccess(propsResponse)) {
            // Trouver notre proposition
            const maProposition = propsResponse.data.find(
              (p: PropositionOffre) => p.entreprise_transporteur_id === user.entreprise_id
            );
            
            if (maProposition) {
              propositionsWithOffre.push({
                ...maProposition,
                offre: offre,
              });
            }
          }
        } catch (err) {
          // Ignorer les erreurs pour les offres individuelles
          console.warn(`Erreur pour offre ${offre.id}:`, err);
        }
      }
      
      setPropositions(propositionsWithOffre);
    } catch (err) {
      console.error('Erreur lors du chargement des propositions:', err);
      setError('Impossible de charger vos propositions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPropositions();
  }, [user?.entreprise_id]);

  return {
    propositions,
    loading,
    error,
    reload: loadPropositions,
  };
};
