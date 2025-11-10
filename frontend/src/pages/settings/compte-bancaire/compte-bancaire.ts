import { useState, useEffect } from 'react'
import apiService from '../../../services/apiService'

interface CompteBancaireData {
  id?: number
  iban: string
  bic?: string
  nom_banque: string
  titulaire: string
  est_principal?: boolean
}

export const useCompteBancaire = () => {
  const [comptes, setComptes] = useState<CompteBancaireData[]>([])
  const [formData, setFormData] = useState<Partial<CompteBancaireData>>({
    iban: '',
    bic: '',
    nom_banque: '',
    titulaire: '',
    est_principal: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  // Charger les comptes bancaires au montage
  useEffect(() => {
    fetchComptes()
  }, [])

  const fetchComptes = async () => {
    try {
      const response = await apiService.getComptesBancaires()
      if (response.success && response.data) {
        setComptes(response.data)
      }
    } catch (err) {
      console.error('Erreur lors du chargement des comptes bancaires:', err)
      setError('Erreur lors du chargement des comptes bancaires')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      let response
      if (editingId) {
        // Modification
        response = await apiService.updateCompteBancaire(editingId, formData)
        if (response.success) {
          setSuccess('Compte bancaire modifié avec succès !')
          await fetchComptes()
          handleCancel()
        } else {
          setError(response.message || 'Erreur lors de la modification')
        }
      } else {
        // Création
        response = await apiService.createCompteBancaire(formData as CompteBancaireData)
        if (response.success) {
          setSuccess('Compte bancaire ajouté avec succès !')
          await fetchComptes()
          handleCancel()
        } else {
          setError(response.message || 'Erreur lors de l\'ajout')
        }
      }
    } catch (err: any) {
      setError('Erreur lors de l\'opération')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (compte: CompteBancaireData) => {
    setFormData({
      iban: compte.iban,
      bic: compte.bic || '',
      nom_banque: compte.nom_banque,
      titulaire: compte.titulaire,
      est_principal: compte.est_principal || false
    })
    setEditingId(compte.id!)
    setIsEditing(true)
    setError('')
    setSuccess('')
  }

  const handleCancel = () => {
    setFormData({
      iban: '',
      bic: '',
      nom_banque: '',
      titulaire: '',
      est_principal: false
    })
    setEditingId(null)
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce compte bancaire ?')) {
      return
    }

    try {
      const response = await apiService.deleteCompteBancaire(id)
      if (response.success) {
        setSuccess('Compte bancaire supprimé avec succès !')
        await fetchComptes()
      } else {
        setError(response.message || 'Erreur lors de la suppression')
      }
    } catch (err: any) {
      setError('Erreur lors de la suppression')
    }
  }

  const startAddNew = () => {
    setFormData({
      iban: '',
      bic: '',
      nom_banque: '',
      titulaire: '',
      est_principal: false
    })
    setEditingId(null)
    setIsEditing(true)
    setError('')
    setSuccess('')
  }

  const handleSetAsPrincipal = async (compteId: number) => {
    try {
      const response = await apiService.setCompteAsPrincipal(compteId)
      if (response.success) {
        setSuccess('Compte bancaire défini comme principal avec succès !')
        await fetchComptes()
      } else {
        setError(response.message || 'Erreur lors de la définition du compte principal')
      }
    } catch (err: any) {
      setError('Erreur lors de la définition du compte principal')
    }
  }

  return {
    comptes,
    formData,
    isLoading,
    error,
    success,
    isEditing,
    editingId,
    handleChange,
    handleSubmit,
    handleEdit,
    handleCancel,
    handleDelete,
    startAddNew,
    handleSetAsPrincipal
  }
}