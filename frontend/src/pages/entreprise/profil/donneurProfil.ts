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

  useEffect(() => {
    const loadEntrepriseData = async () => {
      if (user?.entreprise_id) {
        setIsLoading(true)
        try {
          const response = await apiService.getEntrepriseById(user.entreprise_id)
          if (response.success && (response as any).data) {
            const data = (response as any).data as Entreprise
            setFormData({
              nom_entreprise: data.nom_entreprise || '',
              type_structure: data.type_structure || '',
              siret: data.siret || '',
              email_contact: data.email_contact || '',
              telephone: data.telephone || '',
              adresse_siege: data.adresse_siege || '',
              complement_adresse: data.complement_adresse || '',
              code_postal: data.code_postal || '',
              ville: data.ville || '',
              pays: data.pays || 'France',
              secteur_activite: data.type_acteur || '',
              taille_entreprise: '',
              frequence_expeditions: data.frequence_besoin || '',
              digitalisation_active: data.digitalisation_active || false
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
        setError("ID de l'entreprise non trouvé")
        return
      }

      const payload: Partial<Entreprise> = {
        nom_entreprise: formData.nom_entreprise,
        type_structure: formData.type_structure || undefined,
        siret: formData.siret,
        email_contact: formData.email_contact,
        telephone: formData.telephone || undefined,
        adresse_siege: formData.adresse_siege || undefined,
        complement_adresse: formData.complement_adresse || undefined,
        code_postal: formData.code_postal || undefined,
        ville: formData.ville || undefined,
        pays: formData.pays || undefined,
        digitalisation_active: formData.digitalisation_active,
        type_acteur: formData.secteur_activite || undefined,
        frequence_besoin: formData.frequence_expeditions || undefined
      }

      const response = await apiService.updateEntreprise(user.entreprise_id, payload)

      if (response.success) {
        setSuccess('Informations mises à jour avec succès !')
      } else {
        setError((response as any).message || 'Erreur lors de la mise à jour')
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
