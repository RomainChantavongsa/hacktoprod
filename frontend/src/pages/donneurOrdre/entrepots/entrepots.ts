import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import apiService from '../../../services/apiService'

interface Entrepot {
  id: number
  entreprise_id: number
  nom_entrepot: string
  type_entrepot?: string
  adresse: string
  ville: string
  code_postal: string
  pays?: string
  capacite_stockage_m3?: number
  telephone?: string
  email_contact?: string
  horaires_ouverture?: string
  equipements_speciaux?: string
  est_actif: boolean
  created_at?: string
  updated_at?: string
}

interface EntrepotFormData {
  nom_entrepot: string
  type_entrepot?: string
  adresse: string
  ville: string
  code_postal: string
  pays?: string
  capacite_stockage_m3?: number
  telephone?: string
  email_contact?: string
  horaires_ouverture?: string
  equipements_speciaux?: string
  est_actif?: boolean
}

export const useEntrepots = () => {
  const { user } = useAuth()
  const [entrepots, setEntrepots] = useState<Entrepot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingEntrepot, setEditingEntrepot] = useState<Entrepot | null>(null)

  const [formData, setFormData] = useState<EntrepotFormData>({
    nom_entrepot: '',
    type_entrepot: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'France',
    capacite_stockage_m3: undefined,
    telephone: '',
    email_contact: '',
    horaires_ouverture: '',
    equipements_speciaux: '',
    est_actif: true
  })

  // Charger les entrepôts au montage
  useEffect(() => {
    loadEntrepots()
  }, [user?.entreprise_id])

  const loadEntrepots = async () => {
    if (!user?.entreprise_id) return

    setIsLoading(true)
    try {
      // TODO: Remplacer par l'appel API réel quand disponible
      // const response = await apiService.getEntrepots()
      // Simulation pour l'instant
      const mockEntrepots: Entrepot[] = []
      setEntrepots(mockEntrepots)
    } catch (err: any) {
      setError('Erreur lors du chargement des entrepôts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    setFormData(prev => {
      const updated = { ...prev }
      if (type === 'checkbox') {
        ;(updated as any)[name] = (e.target as HTMLInputElement).checked
      } else if (type === 'number') {
        ;(updated as any)[name] = value === '' ? undefined : Number(value)
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
        ...formData,
        entreprise_id: user.entreprise_id
      }

      if (editingEntrepot) {
        // TODO: Mise à jour
        // const response = await apiService.updateEntrepot(editingEntrepot.id, payload)
        console.log('Mise à jour entrepôt:', payload)
        setSuccess('Entrepôt mis à jour avec succès !')
      } else {
        // TODO: Création
        // const response = await apiService.createEntrepot(payload)
        console.log('Création entrepôt:', payload)
        setSuccess('Entrepôt créé avec succès !')
      }

      // Recharger la liste
      await loadEntrepots()

      // Réinitialiser le formulaire
      resetForm()
      setShowForm(false)

    } catch (err: any) {
      setError('Erreur lors de la sauvegarde')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (entrepot: Entrepot) => {
    setEditingEntrepot(entrepot)
    setFormData({
      nom_entrepot: entrepot.nom_entrepot,
      type_entrepot: entrepot.type_entrepot || '',
      adresse: entrepot.adresse,
      ville: entrepot.ville,
      code_postal: entrepot.code_postal,
      pays: entrepot.pays || 'France',
      capacite_stockage_m3: entrepot.capacite_stockage_m3,
      telephone: entrepot.telephone || '',
      email_contact: entrepot.email_contact || '',
      horaires_ouverture: entrepot.horaires_ouverture || '',
      equipements_speciaux: entrepot.equipements_speciaux || '',
      est_actif: entrepot.est_actif
    })
    setShowForm(true)
  }

  const handleDelete = async (entrepotId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet entrepôt ?')) return

    setIsLoading(true)
    try {
      // TODO: Suppression
      // await apiService.deleteEntrepot(entrepotId)
      console.log('Suppression entrepôt:', entrepotId)
      setSuccess('Entrepôt supprimé avec succès !')

      // Recharger la liste
      await loadEntrepots()

    } catch (err: any) {
      setError('Erreur lors de la suppression')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleForm = () => {
    if (showForm) {
      resetForm()
      setEditingEntrepot(null)
    }
    setShowForm(!showForm)
  }

  const resetForm = () => {
    setFormData({
      nom_entrepot: '',
      type_entrepot: '',
      adresse: '',
      ville: '',
      code_postal: '',
      pays: 'France',
      capacite_stockage_m3: undefined,
      telephone: '',
      email_contact: '',
      horaires_ouverture: '',
      equipements_speciaux: '',
      est_actif: true
    })
    setEditingEntrepot(null)
  }

  return {
    entrepots,
    isLoading,
    error,
    success,
    showForm,
    editingEntrepot,
    formData,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    toggleForm,
    setError,
    setSuccess
  }
}