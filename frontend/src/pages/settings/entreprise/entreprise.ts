import { useState, useEffect } from 'react'
import apiService from '@services/apiService'
import { Entreprise } from '@types/api'

export const useEntrepriseProfile = () => {
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [isEditing, setIsEditing] = useState<boolean>(false)

  useEffect(() => {
    loadEntrepriseProfile()
  }, [])

  const loadEntrepriseProfile = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Récupérer le profil utilisateur pour obtenir l'entreprise_id
      const userProfile = await apiService.getUserProfile()
      
      if (userProfile.entreprise_id) {
        // Récupérer les détails de l'entreprise
        const response = await apiService.get(`/entreprises/${userProfile.entreprise_id}`)
        setEntreprise(response.data)
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement du profil entreprise:', err)
      setError(err.response?.data?.message || 'Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleUpdate = async (updatedData: Partial<Entreprise>) => {
    try {
      setLoading(true)
      setError('')
      
      if (!entreprise) return

      const response = await apiService.put(`/entreprises/${entreprise.id}`, updatedData)
      setEntreprise(response.data)
      setIsEditing(false)
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err)
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  return {
    entreprise,
    loading,
    error,
    isEditing,
    toggleEdit,
    handleUpdate,
    reload: loadEntrepriseProfile
  }
}
