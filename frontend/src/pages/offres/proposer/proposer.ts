import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/apiService';
import { isApiSuccess, OffreFret, CreatePropositionRequest } from '../../../types/api';

export const useSoumettreProposition = (offreId: string) => {
  const { user } = useAuth();
  const [offre, setOffre] = useState<OffreFret | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    prix_propose: '',
    message: '',
  });

  useEffect(() => {
    loadOffre();
  }, [offreId]);

  const loadOffre = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getOffreFretById(Number(offreId));
      
      if (!isApiSuccess(response)) {
        throw new Error(response.message || 'Erreur lors du chargement de l\'offre');
      }
      
      setOffre(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement de l\'offre:', err);
      setError('Impossible de charger l\'offre');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.entreprise_id) {
      setError('ID entreprise non trouvé');
      return;
    }

    if (!formData.prix_propose || Number(formData.prix_propose) <= 0) {
      setError('Veuillez entrer un prix valide');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const propositionData: CreatePropositionRequest = {
        prix_propose: Number(formData.prix_propose),
        message: formData.message || undefined,
      };

      const response = await apiService.soumettreProposition(Number(offreId), propositionData);
      
      if (isApiSuccess(response)) {
        setSuccess(true);
      } else {
        throw new Error(response.message || 'Erreur lors de la soumission');
      }
    } catch (err: any) {
      console.error('Erreur lors de la soumission:', err);
      setError(err.message || 'Impossible de soumettre la proposition');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    offre,
    loading,
    submitting,
    error,
    success,
    formData,
    handleChange,
    handleSubmit,
  };
};
