import { useEffect, useState } from 'react'
import apiService from '@services/apiService'

export interface Conducteur {
  id: number
  entreprise_id: number
  nom: string
  prenom: string
  email?: string
  telephone?: string
  numero_permis: string
  date_naissance?: string
  date_embauche?: string
  statut: 'actif' | 'inactif' | 'conge' | 'suspendu'
  created_at?: string
  updated_at?: string
}

export const useConducteurs = () => {
  const [conducteurs, setConducteurs] = useState<Conducteur[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    numero_permis: '',
    date_naissance: '',
    date_embauche: '',
    statut: 'actif' as 'actif' | 'inactif' | 'conge' | 'suspendu'
  })

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const load = async () => {
    setLoading(true)
    setError('')
    const res = await apiService.getConducteurs()
    
    if (res.success) {
      setConducteurs(res.data)
    } else {
      setError(res.message)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      // Étape 1: Uploader le permis de conduire
      let permisDocId = null

      if (uploadedFile) {
        const permisFormData = new FormData()
        permisFormData.append('file', uploadedFile)
        permisFormData.append('type_document', 'Permis')
        permisFormData.append('categorie', 'Conducteur')

        const permisResponse = await apiService.uploadDocument(permisFormData)
        if (permisResponse.success) {
          permisDocId = permisResponse.data.id
        } else {
          throw new Error('Erreur lors de l\'upload du permis de conduire')
        }
      }

      // Étape 2: Créer le conducteur avec la référence du document
      const payload = {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email || undefined,
        telephone: form.telephone || undefined,
        numero_permis: form.numero_permis,
        date_naissance: form.date_naissance || undefined,
        date_embauche: form.date_embauche || undefined,
        statut: form.statut,
        permis_document_id: permisDocId
      }

      const res = await apiService.createConducteur(payload)
      if (res.success) {
        setForm({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          numero_permis: '',
          date_naissance: '',
          date_embauche: '',
          statut: 'actif'
        })
        setUploadedFile(null)
        await load()
      } else {
        setError(res.message)
      }
    } catch (error) {
      console.error('Erreur lors de la création du conducteur:', error)
      setError(error.message || 'Erreur lors de la création du conducteur')
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce conducteur ?')) return
    
    const res = await apiService.deleteConducteur(id)
    if (res.success) {
      await load()
    } else {
      setError(res.message)
    }
  }

  const resetForm = () => {
    setForm({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      numero_permis: '',
      date_naissance: '',
      date_embauche: '',
      statut: 'actif'
    })
    setUploadedFile(null)
  }

  const handleFileChange = (file: File | null) => {
    setUploadedFile(file)
  }

  return {
    conducteurs,
    loading,
    error,
    form,
    handleChange,
    create,
    remove,
    reload: load,
    submitting,
    resetForm,
    uploadedFile,
    handleFileChange
  }
}
