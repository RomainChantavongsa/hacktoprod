import { useState, useEffect } from 'react'
import apiService from '../../../services/apiService'

interface Document {
  id: number
  entreprise_id: number
  nom_fichier_original: string
  nom_fichier_stockage: string
  chemin_stockage: string
  type_document: string
  categorie: string
  description?: string
  extension: string
  taille_octets: number
  mime_type: string
  version: number
  document_parent_id?: number
  date_emission?: string
  date_expiration?: string
  est_valide: boolean
  uploade_par?: number
  tags?: string[]
  created_at: string
  updated_at: string
}

interface FilterState {
  type: string
  categorie: string
  statut: string
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState<FilterState>({
    type: '',
    categorie: '',
    statut: ''
  })
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    nom_fichier_original: '',
    type_document: 'Autre',
    categorie: 'Autre',
    description: '',
    date_emission: '',
    date_expiration: '',
    tags: ''
  })

  useEffect(() => {
    fetchDocuments()
  }, [filter])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Construction des paramètres de requête
      const params = new URLSearchParams()
      if (filter.type) params.append('type', filter.type)
      if (filter.categorie) params.append('categorie', filter.categorie)
      if (filter.statut) params.append('statut', filter.statut)

      const response = await apiService.getDocuments(`?${params.toString()}`)
      if (response.success && response.data) {
        setDocuments(response.data)
      } else {
        setError(response.message || 'Erreur lors du chargement des documents')
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des documents:', err)
      setError(err.response?.data?.message || 'Erreur lors du chargement des documents')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadForm({
        ...uploadForm,
        file,
        nom_fichier_original: uploadForm.nom_fichier_original || file.name
      })
    }
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!uploadForm.file) {
      setError('Veuillez sélectionner un fichier')
      return
    }

    try {
      setUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', uploadForm.file)
      formData.append('type_document', uploadForm.type_document)
      formData.append('categorie', uploadForm.categorie)
      
      if (uploadForm.nom_fichier_original && uploadForm.nom_fichier_original !== uploadForm.file.name) {
        formData.append('nom_fichier_original', uploadForm.nom_fichier_original)
      }
      
      if (uploadForm.description) {
        formData.append('description', uploadForm.description)
      }
      
      if (uploadForm.date_emission) {
        formData.append('date_emission', uploadForm.date_emission)
      }
      
      if (uploadForm.date_expiration) {
        formData.append('date_expiration', uploadForm.date_expiration)
      }
      
      if (uploadForm.tags) {
        const tagsArray = uploadForm.tags.split(',').map(t => t.trim()).filter(t => t)
        formData.append('tags', JSON.stringify(tagsArray))
      }

      const response = await apiService.uploadDocument(formData)
      
      if (!response.success) {
        throw new Error(response.message || 'Erreur lors de l\'upload')
      }

      // Recharger la liste des documents
      await fetchDocuments()
      
      // Fermer la modal et réinitialiser le formulaire
      setShowUploadModal(false)
      setUploadForm({
        file: null,
        nom_fichier_original: '',
        type_document: 'Autre',
        categorie: 'Autre',
        description: '',
        date_emission: '',
        date_expiration: '',
        tags: ''
      })
    } catch (err: any) {
      console.error('Erreur lors de l\'upload:', err)
      setError(err.message || 'Erreur lors de l\'upload du fichier')
    } finally {
      setUploading(false)
    }
  }

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document)
    setShowEditModal(true)
  }

  const handleUpdateDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingDocument) return

    try {
      setUploading(true)
      setError(null)

      const updateData = {
        nom_fichier_original: editingDocument.nom_fichier_original,
        type_document: editingDocument.type_document,
        categorie: editingDocument.categorie,
        description: editingDocument.description,
        date_emission: editingDocument.date_emission,
        date_expiration: editingDocument.date_expiration,
        est_valide: editingDocument.est_valide,
        tags: editingDocument.tags
      }

      const response = await apiService.updateDocument(editingDocument.id, updateData)
      
      if (!response.success) {
        throw new Error(response.message || 'Erreur lors de la mise à jour')
      }

      // Recharger la liste des documents
      await fetchDocuments()
      
      // Fermer la modal
      setShowEditModal(false)
      setEditingDocument(null)
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err)
      setError(err.message || 'Erreur lors de la mise à jour du document')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return
    }

    try {
      setError(null)
      const response = await apiService.deleteDocument(documentId)
      
      if (response.success) {
        // Retirer le document de la liste
        setDocuments(documents.filter(doc => doc.id !== documentId))
      } else {
        setError(response.message || 'Erreur lors de la suppression du document')
      }
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err)
      setError(err.message || 'Erreur lors de la suppression du document')
    }
  }

  const handleDownloadDocument = async (document: Document) => {
    try {
      const blob = await apiService.downloadDocument(document.id)
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      link.href = url
      link.setAttribute('download', document.nom_fichier_original)
      window.document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      console.error('Erreur lors du téléchargement:', err)
      setError(err.message || 'Erreur lors du téléchargement du document')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getDocumentIcon = (extension: string): string => {
    const ext = extension.toLowerCase().replace('.', '')
    
    const iconMap: { [key: string]: string } = {
      'pdf': 'fileText',
      'doc': 'fileText',
      'docx': 'fileText',
      'xls': 'fileText',
      'xlsx': 'fileText',
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'zip': 'archive',
      'rar': 'archive',
      'txt': 'fileText',
    }
    
    return iconMap[ext] || 'document'
  }

  const isExpiringSoon = (dateExpiration?: string): boolean => {
    if (!dateExpiration) return false
    
    const expDate = new Date(dateExpiration)
    const today = new Date()
    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    // Expire dans moins de 30 jours
    return diffDays > 0 && diffDays <= 30
  }

  const isExpired = (dateExpiration?: string): boolean => {
    if (!dateExpiration) return false
    
    const expDate = new Date(dateExpiration)
    const today = new Date()
    
    return expDate < today
  }

  const handlePreviewDocument = async (document: Document) => {
    try {
      const ext = document.extension.toLowerCase()
      
      // Vérifier si c'est un type prévisualisable
      if (['.pdf', '.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        setError(null)
        setPreviewDocument(document)
        
        // Récupérer le fichier avec le token
        const blob = await apiService.downloadDocument(document.id)
        const url = window.URL.createObjectURL(blob)
        setPreviewUrl(url)
        setShowPreviewModal(true)
      } else {
        // Pour les autres fichiers, télécharger directement
        setError('Ce type de fichier ne peut pas être prévisualisé. Téléchargement en cours...')
        handleDownloadDocument(document)
      }
    } catch (err: any) {
      console.error('Erreur lors de la prévisualisation:', err)
      setError(err.message || 'Erreur lors de la prévisualisation du document')
    }
  }

  const closePreviewModal = () => {
    setShowPreviewModal(false)
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setPreviewDocument(null)
  }

  return {
    documents,
    loading,
    error,
    uploading,
    filter,
    setFilter,
    showUploadModal,
    setShowUploadModal,
    showEditModal,
    setShowEditModal,
    editingDocument,
    uploadForm,
    setUploadForm,
    handleFileSelect,
    handleUploadSubmit,
    handleEditDocument,
    handleUpdateDocument,
    handleDeleteDocument,
    handleDownloadDocument,
    handlePreviewDocument,
    closePreviewModal,
    showPreviewModal,
    previewUrl,
    previewDocument,
    formatFileSize,
    formatDate,
    getDocumentIcon,
    isExpiringSoon,
    isExpired
  }
}
