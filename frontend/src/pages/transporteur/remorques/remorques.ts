import { useEffect, useState } from 'react'
import apiService from '@services/apiService'
import type { Remorque } from '@models/api'

export const useRemorques = () => {
  const [remorques, setRemorques] = useState<Remorque[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    type_remorque: '',
    plaque_immatriculation: '',
    capacite_tonnes: '' as string | number
  })

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const load = async () => {
    setLoading(true)
    setError('')
    const res = await apiService.getRemorques()
    if (res.success) setRemorques(res.data)
    else setError(res.message)
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
      // Étape 1: Uploader le document de la remorque
      let documentId = null

      if (uploadedFile) {
        const documentFormData = new FormData()
        documentFormData.append('file', uploadedFile)
        documentFormData.append('type_document', 'Document remorque')
        documentFormData.append('categorie', 'Remorque')

        const documentResponse = await apiService.uploadDocument(documentFormData)
        if (documentResponse.success) {
          documentId = documentResponse.data.id
        } else {
          throw new Error('Erreur lors de l\'upload du document de remorque')
        }
      }

      // Étape 2: Créer la remorque avec la référence du document
      const payload = {
        type_remorque: form.type_remorque,
        plaque_immatriculation: form.plaque_immatriculation,
        capacite_tonnes: form.capacite_tonnes === '' ? undefined : Number(form.capacite_tonnes),
        document_id: documentId
      }

      const res = await apiService.createRemorque(payload)
      if (res.success) {
        setForm({ type_remorque: '', plaque_immatriculation: '', capacite_tonnes: '' })
        setUploadedFile(null)
        await load()
      } else {
        setError(res.message)
      }
    } catch (error) {
      console.error('Erreur lors de la création de la remorque:', error)
      setError(error.message || 'Erreur lors de la création de la remorque')
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (id: number) => {
    const res = await apiService.deleteRemorque(id)
    if (res.success) await load()
    else setError(res.message)
  }

  const resetForm = () => {
    setForm({ type_remorque: '', plaque_immatriculation: '', capacite_tonnes: '' })
    setUploadedFile(null)
  }

  const handleFileChange = (file: File | null) => {
    setUploadedFile(file)
  }

  return {
    remorques,
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
