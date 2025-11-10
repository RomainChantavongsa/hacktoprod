import { useEffect, useState } from 'react'
import apiService from '@services/apiService'
import type { Vehicule, Conducteur } from '@models/api'

export const useVehicules = () => {
  const [vehicules, setVehicules] = useState<Vehicule[]>([])
  const [conducteurs, setConducteurs] = useState<Conducteur[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    type_vehicule: '',
    plaque_immatriculation: '',
    conducteur_attitre: '',
    capacite_tonnes: '' as string | number
  })

  const [uploadedFiles, setUploadedFiles] = useState({
    carte_grise: null as File | null,
    assurance: null as File | null
  })

  const load = async () => {
    setLoading(true)
    setError('')
    const [vehiculesRes, conducteursRes] = await Promise.all([
      apiService.getVehicules(),
      apiService.getConducteurs()
    ])
    
    if (vehiculesRes.success) setVehicules(vehiculesRes.data)
    else setError(vehiculesRes.message)

    if (conducteursRes.success) setConducteurs(conducteursRes.data)
    else setError(error + (error ? '; ' : '') + conducteursRes.message)

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
      // Étape 1: Uploader les documents
      let carteGriseDocId = null
      let assuranceDocId = null

      // Uploader la carte grise
      if (uploadedFiles.carte_grise) {
        const carteGriseFormData = new FormData()
        carteGriseFormData.append('file', uploadedFiles.carte_grise)
        carteGriseFormData.append('type_document', 'Carte grise')
        carteGriseFormData.append('categorie', 'Vehicule')

        const carteGriseResponse = await apiService.uploadDocument(carteGriseFormData)
        if (carteGriseResponse.success) {
          carteGriseDocId = carteGriseResponse.data.id
        } else {
          throw new Error('Erreur lors de l\'upload de la carte grise')
        }
      }

      // Uploader l'assurance
      if (uploadedFiles.assurance) {
        const assuranceFormData = new FormData()
        assuranceFormData.append('file', uploadedFiles.assurance)
        assuranceFormData.append('type_document', 'Assurance')
        assuranceFormData.append('categorie', 'Assurance')

        const assuranceResponse = await apiService.uploadDocument(assuranceFormData)
        if (assuranceResponse.success) {
          assuranceDocId = assuranceResponse.data.id
        } else {
          throw new Error('Erreur lors de l\'upload de l\'assurance')
        }
      }

      // Étape 2: Créer le véhicule avec les références des documents
      const payload = {
        type_vehicule: form.type_vehicule,
        plaque_immatriculation: form.plaque_immatriculation,
        conducteur_attitre: form.conducteur_attitre || undefined,
        capacite_tonnes: form.capacite_tonnes === '' ? undefined : Number(form.capacite_tonnes),
        carte_grise_document_id: carteGriseDocId,
        assurance_document_id: assuranceDocId
      }

      const res = await apiService.createVehicule(payload)
      if (res.success) {
        setForm({ type_vehicule: '', plaque_immatriculation: '', conducteur_attitre: '', capacite_tonnes: '' })
        setUploadedFiles({ carte_grise: null, assurance: null })
        await load()
      } else {
        setError(res.message)
      }
    } catch (error) {
      console.error('Erreur lors de la création du véhicule:', error)
      setError(error.message || 'Erreur lors de la création du véhicule')
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (id: number) => {
    const res = await apiService.deleteVehicule(id)
    if (res.success) await load()
    else setError(res.message)
  }

  const resetForm = () => {
    setForm({ type_vehicule: '', plaque_immatriculation: '', conducteur_attitre: '', capacite_tonnes: '' })
    setUploadedFiles({ carte_grise: null, assurance: null })
  }

  const handleFileChange = (file: File | null, type: 'carte_grise' | 'assurance') => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: file
    }))
  }

  return {
    vehicules,
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
    uploadedFiles,
    handleFileChange
  }
}
