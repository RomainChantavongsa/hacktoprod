import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import apiService from '../../../services/apiService'
import Icon from '../../../components/Icon.jsx'
import './documents.scss'

function Documents() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Types de documents requis pour les transporteurs
  const requiredDocuments = [
    {
      type: 'Kbis',
      label: 'Extrait Kbis',
      description: 'Document officiel d\'immatriculation au registre du commerce',
      required: true,
      category: 'Legal'
    },
    {
      type: 'Licence de transport',
      label: 'Licence de transport',
      description: 'Licence officielle de transporteur routier',
      required: true,
      category: 'Legal'
    }
  ]

  // Charger les documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)
        const response = await apiService.getDocuments()
        if (response.success && response.data) {
          // Filtrer pour ne montrer que les documents généraux de l'entreprise
          // (pas les documents spécifiques aux véhicules)
          const generalDocuments = response.data.filter(doc =>
            doc.type_document !== 'Carte grise' && doc.type_document !== 'Assurance'
          )
          setDocuments(generalDocuments)
        } else {
          setError('Erreur lors du chargement des documents')
        }
      } catch (err) {
        console.error('Erreur lors du chargement des documents:', err)
        setError('Erreur lors du chargement des documents')
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  // Vérifier si un document est uploadé
  const isDocumentUploaded = (type) => {
    return documents.some(doc => doc.type_document === type)
  }

  // Obtenir le document par type
  const getDocumentByType = (type) => {
    return documents.find(doc => doc.type_document === type)
  }

  // Gérer l'upload de fichier
  const handleFileUpload = async (e, documentType) => {
    const file = e.target.files[0]
    if (!file) return

    // Validation de taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Le fichier ne doit pas dépasser 10MB')
      return
    }

    // Validation de type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      setError('Seuls les fichiers PDF et images sont acceptés')
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)
      setError('')
      setSuccess('')

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type_document', documentType)
      formData.append('categorie', requiredDocuments.find(d => d.type === documentType)?.category || 'Autre')

      // Simulation de progression
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await apiService.uploadDocument(formData)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.success) {
        setSuccess('Document uploadé avec succès !')
        // Recharger les documents
        const docsResponse = await apiService.getDocuments()
        if (docsResponse.success && docsResponse.data) {
          setDocuments(docsResponse.data)
        }
        setShowUploadForm(false)
      } else {
        setError(response.message || 'Erreur lors de l\'upload')
      }
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err)
      setError('Erreur lors de l\'upload du document')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // Télécharger un document
  const handleDownload = async (documentId, fileName) => {
    try {
      const blob = await apiService.downloadDocument(documentId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err)
      setError('Erreur lors du téléchargement du document')
    }
  }

  // Supprimer un document
  const handleDelete = async (documentId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return

    try {
      const response = await apiService.deleteDocument(documentId)
      if (response.success) {
        setSuccess('Document supprimé avec succès')
        setDocuments(prev => prev.filter(doc => doc.id !== documentId))
      } else {
        setError('Erreur lors de la suppression du document')
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      setError('Erreur lors de la suppression du document')
    }
  }

  // Vérifier si tous les documents requis sont présents
  const allRequiredDocumentsPresent = () => {
    return requiredDocuments
      .filter(doc => doc.required)
      .every(doc => isDocumentUploaded(doc.type))
  }

  if (loading) {
    return (
      <div className="documents-page">
        <div className="loading">Chargement des documents...</div>
      </div>
    )
  }

  return (
    <div className="documents-page">
      <div className="page-header">
        <h1>Documents légaux</h1>
        <p className="subtitle">Gérez vos documents administratifs et certifications</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Status des documents requis */}
      <div className="documents-status">
        <div className={`status-card ${allRequiredDocumentsPresent() ? 'complete' : 'incomplete'}`}>
          <div className="status-icon">
            {allRequiredDocumentsPresent() ? <Icon name="checkCircle" size={32} /> : <Icon name="alertTriangle" size={32} />}
          </div>
          <div className="status-content">
            <h3>Documents requis</h3>
            <p>
              {allRequiredDocumentsPresent()
                ? 'Tous les documents obligatoires sont présents'
                : 'Certains documents obligatoires sont manquants'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Liste des documents */}
      <div className="documents-grid">
        {requiredDocuments.map(docType => {
          const uploadedDoc = getDocumentByType(docType.type)
          const isUploaded = !!uploadedDoc

          return (
            <div key={docType.type} className={`document-card ${isUploaded ? 'uploaded' : 'missing'}`}>
              <div className="document-header">
                <div className="document-icon">
                  {isUploaded ? <Icon name="document" size={32} /> : <Icon name="clipboard" size={32} />}
                </div>
                <div className="document-info">
                  <h3>{docType.label}</h3>
                  <p>{docType.description}</p>
                  {docType.required && <span className="required-badge">Obligatoire</span>}
                </div>
              </div>

              <div className="document-actions">
                {isUploaded ? (
                  <div className="uploaded-info">
                    <div className="file-info">
                      <span className="file-name">{uploadedDoc.nom_fichier_original}</span>
                      <span className="file-size">
                        {(uploadedDoc.taille_octets / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <div className="action-buttons">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleDownload(uploadedDoc.id, uploadedDoc.nom_fichier_original)}
                      >
                        Télécharger
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(uploadedDoc.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="upload-section">
                    <input
                      type="file"
                      id={`file-${docType.type}`}
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, docType.type)}
                      style={{ display: 'none' }}
                      disabled={uploading}
                    />
                    <label
                      htmlFor={`file-${docType.type}`}
                      className="btn btn-primary btn-sm"
                    >
                      {uploading ? 'Upload en cours...' : 'Uploader'}
                    </label>
                  </div>
                )}
              </div>

              {uploading && uploadProgress > 0 && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Informations complémentaires */}
      <div className="documents-info">
        <h3>ℹ️ Informations importantes</h3>
        <ul>
          <li>Les documents marqués comme "Obligatoire" sont nécessaires pour pouvoir postuler aux offres de transport</li>
          <li>Formats acceptés : PDF, JPG, PNG (max 10MB)</li>
          <li>Conservez vos documents originaux en cas de contrôle</li>
          <li>Les documents expirés doivent être renouvelés</li>
          <li><strong>Note:</strong> Les documents spécifiques aux véhicules (carte grise, assurance) sont gérés depuis la page Véhicules</li>
        </ul>
      </div>
    </div>
  )
}

export default Documents