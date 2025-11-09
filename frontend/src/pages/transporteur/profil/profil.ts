import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import apiService from '../../../services/apiService'
import type { Transporteur } from '../../../types/api'

interface ProfilFormData {
  nom_entreprise: string
  type_structure?: string
  siret: string
  email_contact: string
  telephone?: string
  adresse_siege?: string
  capacite_max_tonnes?: number
  digitalisation_active?: boolean
}

export const useProfil = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState<ProfilFormData>({
    nom_entreprise: '',
    type_structure: '',
    siret: '',
    email_contact: '',
    telephone: '',
    adresse_siege: '',
    capacite_max_tonnes: undefined,
    digitalisation_active: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Charger les données du transporteur au montage
  useEffect(() => {
    const loadTransporteurData = async () => {
      if (user?.transporteur_id) {
        setIsLoading(true)
        try {
          const response = await apiService.getTransporteurById(user.transporteur_id)
          if (response.success && response.data) {
            setFormData({
              nom_entreprise: response.data.nom_entreprise || '',
              type_structure: response.data.type_structure || '',
              siret: response.data.siret || '',
              email_contact: response.data.email_contact || '',
              telephone: response.data.telephone || '',
              adresse_siege: response.data.adresse_siege || '',
              capacite_max_tonnes: response.data.capacite_max_tonnes || undefined,
              digitalisation_active: response.data.digitalisation_active || false
            })
          } else {
            setError('Erreur lors du chargement des données')
          }
        } catch (err: any) {
          setError('Erreur lors du chargement des données')
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadTransporteurData()
  }, [user?.transporteur_id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else if (type === 'number') {
      const numValue = value === '' ? undefined : parseFloat(value)
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (!user?.transporteur_id) {
        setError('ID du transporteur non trouvé')
        return
      }

      // Appel API pour mettre à jour le profil
      const response = await apiService.updateTransporteur(user.transporteur_id, formData)

      if (response.success) {
        setSuccess('Informations mises à jour avec succès !')
      } else {
        setError(response.message || 'Erreur lors de la mise à jour')
      }

    } catch (err: any) {
      setError('Erreur lors de la mise à jour')
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
    handleSubmit
  }
}