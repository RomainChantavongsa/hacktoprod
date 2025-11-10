import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import apiService from '../../../services/apiService'
import { isApiSuccess } from '../../../types/api'
import type { OffreFret, CreateOffreFretRequest } from '../../../types/api'

export const usePublierOffre = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState<Partial<CreateOffreFretRequest>>({
    type_marchandise: '',
    poids_marchandise_kg: undefined,
    volume_m3: undefined,
    adresse_chargement: '',
    ville_chargement: '',
    code_postal_chargement: '',
    adresse_livraison: '',
    ville_livraison: '',
    code_postal_livraison: '',
    date_chargement_prevue: '',
    type_vehicule_souhaite: '',
    conditions_speciales: '',
    prix_propose: undefined,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value
    }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!user?.entreprise_id) {
      setError('ID entreprise non trouvé')
      setIsLoading(false)
      return
    }

    try {
      const payload: CreateOffreFretRequest = {
        donneur_ordre_id: user.entreprise_id,
        type_marchandise: formData.type_marchandise || '',
        poids_marchandise_kg: formData.poids_marchandise_kg || 0,
        volume_m3: formData.volume_m3,
        adresse_chargement: formData.adresse_chargement || '',
        ville_chargement: formData.ville_chargement || '',
        code_postal_chargement: formData.code_postal_chargement || '',
        adresse_livraison: formData.adresse_livraison || '',
        ville_livraison: formData.ville_livraison || '',
        code_postal_livraison: formData.code_postal_livraison || '',
        date_chargement_prevue: formData.date_chargement_prevue || '',
        type_vehicule_souhaite: formData.type_vehicule_souhaite,
        conditions_speciales: formData.conditions_speciales,
        prix_propose: formData.prix_propose,
      }

      const response = await apiService.createOffreFret(payload)
      if (isApiSuccess(response)) {
        setSuccess('Offre publiée avec succès !')
        // Reset form
        setFormData({
          type_marchandise: '',
          poids_marchandise_kg: undefined,
          volume_m3: undefined,
          adresse_chargement: '',
          ville_chargement: '',
          code_postal_chargement: '',
          adresse_livraison: '',
          ville_livraison: '',
          code_postal_livraison: '',
          date_chargement_prevue: '',
          type_vehicule_souhaite: '',
          conditions_speciales: '',
          prix_propose: undefined,
        })
      } else {
        setError(response.message || 'Erreur lors de la publication')
      }
    } catch (err: any) {
      setError('Erreur lors de la publication de l\'offre')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    isLoading,
    error,
    success,
    handleChange,
    handleSubmit,
    setError,
    setSuccess
  }
}
