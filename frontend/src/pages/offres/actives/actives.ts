import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import apiService from '../../../services/apiService'
import { isApiSuccess } from '../../../types/api'
import type { OffreFret } from '../../../types/api'

export const useOffresActives = () => {
  const { user } = useAuth()
  const [offres, setOffres] = useState<OffreFret[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadOffresActives = async () => {
    if (!user?.entreprise_id) return
    setIsLoading(true)
    setError('')
    try {
      const response = await apiService.getOffresFret({ statut: 'Publiee', donneur_ordre_id: user.entreprise_id })
      if (isApiSuccess(response)) {
        setOffres(response.data)
      } else {
        setError(response.message || 'Erreur lors du chargement')
      }
    } catch (err: any) {
      setError('Erreur lors du chargement des offres actives')
    } finally {
      setIsLoading(false)
    }
  }

  const annulerOffre = async (offreId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette offre ?')) return
    setIsLoading(true)
    try {
      const response = await apiService.annulerOffre(offreId)
      if (isApiSuccess(response)) {
        await loadOffresActives()
      } else {
        setError(response.message || 'Erreur lors de l\'annulation')
      }
    } catch (err: any) {
      setError('Erreur lors de l\'annulation de l\'offre')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOffresActives()
  }, [user?.entreprise_id])

  return {
    offres,
    isLoading,
    error,
    annulerOffre,
    recharger: loadOffresActives
  }
}
