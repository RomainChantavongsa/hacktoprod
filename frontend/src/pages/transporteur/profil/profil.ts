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
  capacite_max_tonnes?: number
  digitalisation_active?: boolean
  nombre_vehicules?: number
  types_vehicules?: string[]
  zones_intervention?: string[]
  rayon_action_km?: number
  licence_transport?: string
  assurance_marchandises?: string
  numero_assurance?: string
  date_expiration_assurance?: string
  certifications?: string[]
  transport_frigorifique?: boolean
  transport_express?: boolean
  transport_volumineux?: boolean
  transport_dangereuses?: boolean
  transport_international?: boolean
  hayon_elevateur?: boolean
  gerbeur?: boolean
  transpalette?: boolean
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
    capacite_max_tonnes: undefined,
    digitalisation_active: false,
    nombre_vehicules: 0,
    types_vehicules: [],
    zones_intervention: [],
    rayon_action_km: undefined,
    licence_transport: '',
    assurance_marchandises: '',
    numero_assurance: '',
    date_expiration_assurance: '',
    certifications: [],
    transport_frigorifique: false,
    transport_express: false,
    transport_volumineux: false,
    transport_dangereuses: false,
    transport_international: false,
    hayon_elevateur: false,
    gerbeur: false,
    transpalette: false
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
              capacite_max_tonnes: response.data.capacite_max_tonnes || undefined,
              digitalisation_active: response.data.digitalisation_active || false,
              nombre_vehicules: response.data.nombre_vehicules || 0,
              types_vehicules: response.data.types_vehicules || [],
              zones_intervention: response.data.zones_intervention || [],
              rayon_action_km: response.data.rayon_action_km || undefined,
              licence_transport: response.data.licence_transport || '',
              assurance_marchandises: response.data.assurance_marchandises || '',
              numero_assurance: response.data.numero_assurance || '',
              date_expiration_assurance: response.data.date_expiration_assurance || '',
              certifications: response.data.certifications || [],
              transport_frigorifique: response.data.transport_frigorifique || false,
              transport_express: response.data.transport_express || false,
              transport_volumineux: response.data.transport_volumineux || false,
              transport_dangereuses: response.data.transport_dangereuses || false,
              transport_international: response.data.transport_international || false,
              hayon_elevateur: response.data.hayon_elevateur || false,
              gerbeur: response.data.gerbeur || false,
              transpalette: response.data.transpalette || false
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
      if (!user?.entreprise_id) {
        setError('ID de l\'entreprise non trouvé')
        return
      }

      // Normaliser le payload (éviter d'envoyer des valeurs vides invalides)
      const payload = {
        ...formData,
        // Envoyer null si la date est vide pour éviter une erreur Postgres sur DATE
        date_expiration_assurance: formData.date_expiration_assurance && formData.date_expiration_assurance !== ''
          ? formData.date_expiration_assurance
          : null,
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