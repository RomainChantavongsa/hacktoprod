import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import apiService from '../../../services/apiService'
import { isApiSuccess } from '../../../types/api'
import type { OffreFret, PropositionOffre } from '../../../types/api'

export const usePropositions = () => {
  const { user } = useAuth()
  const [offresAvecPropositions, setOffresAvecPropositions] = useState<Array<{ offre: OffreFret; propositions: PropositionOffre[] }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadOffresEtPropositions = async () => {
    if (!user?.entreprise_id) return
    setIsLoading(true)
    setError('')
    try {
      // Récupérer toutes les offres publiées du donneur d'ordre
      const offresResponse = await apiService.getOffresFret({ statut: 'Publiee', donneur_ordre_id: user.entreprise_id })
      
      if (isApiSuccess(offresResponse)) {
        // Pour chaque offre, récupérer les propositions
        const offresWithProps = await Promise.all(
          offresResponse.data.map(async (offre) => {
            const propsResponse = await apiService.getPropositionsPourOffre(offre.id)
            return {
              offre,
              propositions: isApiSuccess(propsResponse) ? propsResponse.data : []
            }
          })
        )
        // Filtrer pour ne garder que les offres avec au moins une proposition
        setOffresAvecPropositions(offresWithProps.filter(item => item.propositions.length > 0))
      } else {
        setError(offresResponse.message || 'Erreur lors du chargement')
      }
    } catch (err: any) {
      setError('Erreur lors du chargement des propositions')
    } finally {
      setIsLoading(false)
    }
  }

  const accepterProposition = async (offreId: number, propositionId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir accepter cette proposition ?')) return
    setIsLoading(true)
    try {
      const response = await apiService.accepterProposition(offreId, propositionId)
      if (isApiSuccess(response)) {
        await loadOffresEtPropositions()
      } else {
        setError(response.message || 'Erreur lors de l\'acceptation')
      }
    } catch (err: any) {
      setError('Erreur lors de l\'acceptation de la proposition')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOffresEtPropositions()
  }, [user?.entreprise_id])

  return {
    offresAvecPropositions,
    isLoading,
    error,
    accepterProposition,
    recharger: loadOffresEtPropositions
  }
}
