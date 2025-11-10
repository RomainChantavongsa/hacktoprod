import { useState, useEffect } from 'react'

export function useAnnuaire() {
  const [annuaire, setAnnuaire] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<any>(null)
  const [createForm, setCreateForm] = useState({
    nom: '',
    prenom: '',
    fonction: '',
    service: '',
    email: '',
    telephone_professionnel: '',
    telephone_mobile: '',
    telephone_fixe: '',
    notes: ''
  })
  const [editForm, setEditForm] = useState({
    nom: '',
    prenom: '',
    fonction: '',
    service: '',
    email: '',
    telephone_professionnel: '',
    telephone_mobile: '',
    telephone_fixe: '',
    notes: ''
  })

  // Charger l'annuaire de l'entreprise
  useEffect(() => {
    loadAnnuaire()
  }, [])

  const loadAnnuaire = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/annuaire`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setAnnuaire(data.data)
      } else {
        setError(data.message || 'Erreur lors du chargement de l\'annuaire')
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement de l\'annuaire:', err)
      setError(err.response?.data?.message || 'Erreur lors du chargement de l\'annuaire')
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les contacts selon la recherche
  const filteredAnnuaire = (annuaire || []).filter(contact => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      contact.nom?.toLowerCase().includes(query) ||
      contact.prenom?.toLowerCase().includes(query) ||
      contact.fonction?.toLowerCase().includes(query) ||
      contact.service?.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      contact.telephone_professionnel?.includes(query) ||
      contact.telephone_mobile?.includes(query) ||
      contact.telephone_fixe?.includes(query)
    )
  })

  // Gérer l'ajout d'un contact
  const handleCreateSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/annuaire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(createForm)
      })
      const data = await response.json()
      if (data.success) {
        setAnnuaire([...annuaire, data.data])
        setShowCreateModal(false)
        setCreateForm({
          nom: '',
          prenom: '',
          fonction: '',
          service: '',
          email: '',
          telephone_professionnel: '',
          telephone_mobile: '',
          telephone_fixe: '',
          notes: ''
        })
      } else {
        setError(data.message || 'Erreur lors de la création')
      }
    } catch (err: any) {
      setError('Erreur lors de la création du contact')
    }
  }

  // Gérer la modification d'un contact
  const handleEditEntry = (contact: any) => {
    setEditingEntry(contact)
    setEditForm({
      nom: contact.nom || '',
      prenom: contact.prenom || '',
      fonction: contact.fonction || '',
      service: contact.service || '',
      email: contact.email || '',
      telephone_professionnel: contact.telephone_professionnel || '',
      telephone_mobile: contact.telephone_mobile || '',
      telephone_fixe: contact.telephone_fixe || '',
      notes: contact.notes || ''
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e: any) => {
    e.preventDefault()
    if (!editingEntry) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/annuaire/${editingEntry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editForm)
      })
      const data = await response.json()
      if (data.success) {
        setAnnuaire(annuaire.map(contact =>
          contact.id === editingEntry.id ? data.data : contact
        ))
        setShowEditModal(false)
        setEditingEntry(null)
      } else {
        setError(data.message || 'Erreur lors de la modification')
      }
    } catch (err: any) {
      setError('Erreur lors de la modification du contact')
    }
  }

  // Gérer la suppression d'un contact
  const handleDeleteEntry = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/annuaire/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setAnnuaire(annuaire.filter(contact => contact.id !== id))
      } else {
        setError(data.message || 'Erreur lors de la suppression')
      }
    } catch (err: any) {
      setError('Erreur lors de la suppression du contact')
    }
  }

  // Formater le numéro de téléphone
  const formatTelephone = (phone: string | null) => {
    if (!phone) return '-'

    // Supprimer tous les caractères non numériques
    const cleaned = phone.replace(/\D/g, '')

    // Format français
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
    }

    // Format international
    if (cleaned.length === 11 && cleaned.startsWith('33')) {
      const national = cleaned.substring(2)
      return national.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '+33 $1 $2 $3 $4 $5')
    }

    return phone
  }

  return {
    annuaire: filteredAnnuaire,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    editingEntry,
    createForm,
    setCreateForm,
    editForm,
    setEditForm,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteEntry,
    formatTelephone,
    reloadAnnuaire: loadAnnuaire
  }
}