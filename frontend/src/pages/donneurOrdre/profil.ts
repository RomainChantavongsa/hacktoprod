import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import apiService from '../../../services/apiService'
import type { Entreprise } from '../../../types/api'

interface ProfilFormData {
  nom_entreprise: string
  type_structure?: string
  siret: string
  email_contact: string
  telephone?: string
  adresse_siege?: string
  complement_adresse?: string
  code_postal?: string
  ville?: string
  pays?: string
  secteur_activite?: string
  taille_entreprise?: string
  frequence_expeditions?: string
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
    complement_adresse: '',
    code_postal: '',
    ville: '',
    pays: 'France',
    secteur_activite: '',
    taille_entreprise: '',
    frequence_expeditions: '',
    digitalisation_active: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Charger les données de l'entreprise au montage
  useEffect(() => {
    const loadEntrepriseData = async () => {
      if (user?.entreprise_id) {
        setIsLoading(true)
        try {
          const response = await apiService.getEntrepriseById(user.entreprise_id)
          if (response.success && response.data) {
            setFormData({
              nom_entreprise: response.data.nom_entreprise || '',
              type_structure: response.data.type_structure || '',
              siret: response.data.siret || '',
              email_contact: response.data.email_contact || '',
              telephone: response.data.telephone || '',
              adresse_siege: response.data.adresse_siege || '',
              complement_adresse: response.data.complement_adresse || '',
              code_postal: response.data.code_postal || '',
              ville: response.data.ville || '',
              pays: response.data.pays || 'France',
              secteur_activite: response.data.secteur_activite || '',
              taille_entreprise: response.data.taille_entreprise || '',
              frequence_expeditions: response.data.frequence_expeditions || '',
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

    loadEntrepriseData()
  }, [user?.entreprise_id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    setFormData(prev => {
      const updated = { ...prev }
      if (type === 'checkbox') {
        ;(updated as any)[name] = (e.target as HTMLInputElement).checked
      } else {
        ;(updated as any)[name] = value
      }
      return updated
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (!user?.entreprise_id) {
        setError('ID de l\'entreprise non trouvé')
        return
      }

      const payload = {
        ...formData
      } as Partial<Entreprise>

      // Appel API pour mettre à jour le profil
      const response = await apiService.updateEntreprise(user.entreprise_id, payload)

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